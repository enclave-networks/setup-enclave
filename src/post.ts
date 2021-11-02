import * as core from '@actions/core';
import {exec} from '@actions/exec';
import path from 'path';
import {getEnclaveInfo, getEnclavePidInfo} from './runner';

async function run(): Promise<void> {
  try {
    core.info('Stopping Enclave Agent...');

    const enclavePidInfo = await getEnclavePidInfo();

    const enclaveInfo = await getEnclaveInfo(enclavePidInfo);

    // Locate the stop script.
    const stopScript = path.join(
      __dirname,
      '..',
      '..',
      'external',
      'terminate-linux.sh'
    );

    // Try to stop it.
    const exitCode = await exec(stopScript, [], {
      env: {ENCLAVE_PID: enclavePidInfo.pid.toString()}
    });

    if (exitCode === 0) {
      core.info('Stopped Enclave Agent.');
    } else {
      core.error(
        `Could not gracefully stop Enclave Agent. Exit code: ${exitCode}.`
      );
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
