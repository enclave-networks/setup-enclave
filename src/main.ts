import * as core from '@actions/core'
import * as linux from './linux';
import { platform } from 'os'
import {wait} from './wait'
import { IManifestFormat } from './manifestTypes';
import { download } from './utils';
import { cpuUsage } from 'process';
import { spawnEnclave } from './runner';

async function run(): Promise<void> {
  try {

    const channel = core.getInput("channel");
    
    if (channel != 'stable' && channel != 'unstable')
    {
      core.setFailed("channel input variable can only be 'stable' or 'unstable'");
      return;
    }

    const releaseVersion = channel === 'stable' ? 'GA' : 'RC';

    let manifest: string;

    // Define inputs (Enrolment Key and API token)
    // Depending on platform, download the appropriate binaries (check the manifests to find the right one).
    if (platform() == "linux")
    {
      manifest = "https://install.enclave.io/manifest/linux.json";      
    }
    else 
    {
      core.setFailed("unsupported platform");
      return;
    }

    const downloadUrl = await fetch(manifest)
      .then(result => {
        return result.json();
      })
      .then((jsonResult: IManifestFormat) => {
        const version = jsonResult.ReleaseVersions.reverse().find(version => {
          return version.ReleaseType === releaseVersion;
        });

        if (!version)
        {
          return null;
        }
        
        const selectedPackage = linux.choosePackage(version?.Packages);

        if (!selectedPackage)
        {
          return null;
        }

        return selectedPackage.Url;
      });

    if (!downloadUrl)
    {
      core.setFailed("Cannot determine enclave download URL");
      return;
    }

    const urlParts = downloadUrl.split('/');

    const fileName = urlParts[urlParts.length - 1];

    const tmpPath = `${process.env.HOME}/${fileName}`;

    core.info(`Downloading Enclave from ${downloadUrl}...`);

    // Now we need to download the file (this will be bigger, pipe it to disk).
    await download(downloadUrl, tmpPath);

    // Now extract it.
    const enclaveBinaryPath = await linux.extractPackage(tmpPath, `${process.env.HOME}`);

    const procId = await spawnEnclave(enclaveBinaryPath, core.getInput('enrolment-key'));

    core.saveState('ENCLAVE_PID', procId);

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
