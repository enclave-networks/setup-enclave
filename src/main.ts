import * as core from '@actions/core'
import * as linux from './linux'
import {platform} from 'os'
import {IManifestFormat} from './manifestTypes'
import {download} from './utils'
import {spawnEnclave} from './runner'
import fetch from 'node-fetch'

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

    core.info(`Running as ${process.getuid()}:${process.getgid()}`);

    const downloadResult = await fetch(manifest);
    const downloadedManifest: IManifestFormat = await downloadResult.json();
    
    const version = downloadedManifest.ReleaseVersions.reverse().find(version => {
      return version.ReleaseType === releaseVersion
    });

    if (!version) {
      core.setFailed("Could not locate Enclave version in manifest.");
      return;
    }

    core.info(
      `Using Enclave ${version.MajorVersion}.${version.MinorVersion}.${version.BuildVersion}.${version.RevisionVersion}`
    )

    const selectedPackage = linux.choosePackage(version?.Packages)

    if (!selectedPackage) {
      core.setFailed("Could not determine Enclave package from version.");
      return;
    }

    var downloadUrl = selectedPackage.Url;

    const urlParts = downloadUrl.split('/')

    const fileName = urlParts[urlParts.length - 1]

    const tmpPath = `${process.env.HOME}/${fileName}`

    core.info(`Downloading Enclave from ${downloadUrl}...`)

    // Now we need to download the file (this will be bigger, pipe it to disk).
    await download(downloadUrl, tmpPath)

    // Now extract it.
    const enclaveBinaryPath = await linux.extractPackage(
      tmpPath,
      `${process.env.HOME}`
    )

    const procId = await spawnEnclave(
      enclaveBinaryPath,
      core.getInput('enrolment-key')
    )

    core.saveState('ENCLAVE_PID', procId)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
