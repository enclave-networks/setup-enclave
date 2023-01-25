import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as linux from './linux';
import {getEnclaveInfo, getEnclavePidInfo, spawnEnclave} from './runner';
import {exec} from '@actions/exec';
import {HttpClient} from '@actions/http-client';
import {IManifestFormat} from './manifest-types';
import {platform} from 'os';
import path from 'path';

async function run(): Promise<void> {
  try {
    const channel = core.getInput('channel');

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

    const downloadedManifest = (
      await manifestClient.getJson<IManifestFormat>(manifest)
    ).result;

    if (!downloadedManifest) {
      core.setFailed('Could not download manifest');
      return;
    }

    const version = downloadedManifest.ReleaseVersions.reverse().find(v => {
      return v.ReleaseType === releaseVersion;
    });

    if (!version) {
      core.setFailed('Could not locate Enclave version in manifest.');
      return;
    }

    core.info(
      `Using Enclave ${version.MajorVersion}.${version.MinorVersion}.${version.BuildVersion}.${version.RevisionVersion}`
    );

    const selectedPackage = linux.choosePackage(version?.Packages);

    if (!selectedPackage) {
      core.setFailed('Could not determine Enclave package from version.');
      return;
    }

    const downloadUrl = selectedPackage.Url;
    let extractFolder: string;

    if (platform() === 'linux') {
      core.info(`Downloading Enclave from ${downloadUrl}...`);
      const downloadedPath = await tc.downloadTool(downloadUrl);

      core.info(`Downloaded`);

      extractFolder = await tc.extractTar(downloadedPath);
    } else {
      return;
    }

    const enclaveBinary = `${extractFolder}/enclave`;

    core.info(`Enclave Agent extracted at ${enclaveBinary}`);

    core.info('Adding enclave to path');

    core.addPath(extractFolder);

    core.info('Starting enclave');

    const enclaveSpawnExitCode = await spawnEnclave(
      enclaveBinary,
      core.getInput('enrolment-key')
    );

    if (enclaveSpawnExitCode !== 0) {
      core.setFailed(`Failed to spawn enclave daemon: ${enclaveSpawnExitCode}`);
      return;
    }

    core.debug('Reading Enclave PID');

    const enclavePid = await getEnclavePidInfo();

    core.debug(`PID: ${JSON.stringify(enclavePid)}`);

    core.debug('Reading Enclave Status');

    // Now get the Enclave info.
    const enclaveInfo = await getEnclaveInfo(enclavePid);

    core.debug(`Enclave Status Info: ${JSON.stringify(enclaveInfo)}`);

    core.info('Enclave is ready');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
