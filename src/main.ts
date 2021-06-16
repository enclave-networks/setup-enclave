import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import { HttpClient } from '@actions/http-client'
import * as linux from './linux'
import {platform} from 'os'
import {IManifestFormat} from './manifestTypes'
import {getEnclaveInfo, getEnclavePidInfo, spawnEnclave} from './runner'
import { exec } from '@actions/exec'
import path from 'path'
import { writeFileSync } from 'fs'
import { mkdirP } from '@actions/io'
import { chmodSync } from 'fs'

async function run(): Promise<void> {
  try {
    const channel = core.getInput('channel')

    if (channel !== 'stable' && channel !== 'unstable') {
      core.setFailed(
        "channel input variable can only be 'stable' or 'unstable'"
      );
      return;
    }

    const releaseVersion = channel === 'stable' ? 'GA' : 'RC';

    let manifest: string;

    // Define inputs (Enrolment Key and API token)
    // Depending on platform, download the appropriate binaries (check the manifests to find the right one).
    if (platform() === 'linux') {
      manifest = 'https://install.enclave.io/manifest/linux.json';
    } else {
      core.setFailed('unsupported platform');
      return;
    }

    core.info('Downloading manifest');

    const manifestClient = new HttpClient('enclave-setup');
    
    const downloadedManifest = (await manifestClient.getJson<IManifestFormat>(manifest)).result;

    if (!downloadedManifest)
    {
      core.setFailed("Could not download manifest");
      return;
    }
    
    const version = downloadedManifest.ReleaseVersions.reverse().find(version => {
      return version.ReleaseType === releaseVersion
    });

    if (!version) {
      core.setFailed("Could not locate Enclave version in manifest.");
      return;
    }

    core.info(
      `Using Enclave ${version.MajorVersion}.${version.MinorVersion}.${version.BuildVersion}.${version.RevisionVersion}`
    );

    const selectedPackage = linux.choosePackage(version?.Packages)

    if (!selectedPackage) {
      core.setFailed("Could not determine Enclave package from version.");
      return;
    }

    const downloadUrl = selectedPackage.Url;
    let extractFolder: string;

    if (platform() === 'linux')
    {
      core.info(`Downloading Enclave from ${downloadUrl}...`);
      const downloadedPath = await tc.downloadTool(downloadUrl);

      core.info(`Downloaded`);

      extractFolder = await tc.extractTar(downloadedPath);
    }
    else 
    {
      return;
    }

    const enclaveBinary = `${extractFolder}/enclave`;

    core.info(`Enclave Agent extracted at ${enclaveBinary}`);

    core.info("Starting enclave");

    const enclaveSpawnExitCode = await spawnEnclave(enclaveBinary, core.getInput('enrolment-key'));

    if (enclaveSpawnExitCode !== 0)
    {
      core.setFailed(`Failed to spawn enclave daemon: ${enclaveSpawnExitCode}`);
      return;
    }

    core.debug("Reading Enclave PID");

    const enclavePid = await getEnclavePidInfo();

    core.debug(`PID: ${JSON.stringify(enclavePid)}`);

    core.debug("Reading Enclave Status");

    // Now get the Enclave info.
    const enclaveInfo = await getEnclaveInfo(enclavePid);

    core.debug(`Enclave Status Info: ${JSON.stringify(enclaveInfo)}`);

    // Use the virtual address to configure DNS.
    if (platform() === 'linux')
    {
      core.info("Configuring local DNS");

      // Locate the spawn script.
      const dnsScript = path.join(__dirname, '..', '..', 'external', 'configure-dns-linux.sh');
      const dnsConfigResult = await exec(dnsScript, [], { env: { ENCLAVE_ADDR: enclaveInfo.localAddress } });

      if (dnsConfigResult !== 0)
      {
        throw "Could not configure DNS";
      }
    }

    // Write shell script to temp folder that launches enclave, then add that folder to the path.
    const script = 
`#!/bin/bash
export DOTNET_BUNDLE_EXTRACT_BASE_DIR=${process.env.TMPDIR}/.net
${enclaveBinary} "$@"
`;

    const scriptFolder = `${process.env.TMPDIR}/enclave-launcher`;

    mkdirP(scriptFolder);

    writeFileSync(`${scriptFolder}/enclave`, script);

    chmodSync(`${scriptFolder}/enclave`, 755);

    core.info("Adding enclave to path");

    core.addPath(scriptFolder);

    core.info("Enclave is ready");

  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
