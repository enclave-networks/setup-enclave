import * as core from '@actions/core'
import { exec } from '@actions/exec';
import { HttpClient } from '@actions/http-client';
import * as httpAuth from '@actions/http-client/auth';
import path from 'path';
import { getEnclaveInfo, getEnclavePidInfo } from './runner'

async function run(): Promise<void> {
  try {

    const orgId = core.getInput('orgId');
    const apiKey = core.getInput('apiKey');

    core.info("Stopping Enclave Agent...");    

    const enclavePidInfo = await getEnclavePidInfo();

    const enclaveInfo = await getEnclaveInfo(enclavePidInfo);

    // Locate the stop script.
    var stopScript = path.join(__dirname, '..', '..', 'external', 'terminate-linux.sh');        

    // Try to stop it.
    var exitCode = await exec(stopScript, [], { env: { ENCLAVE_PID: enclavePidInfo.pid.toString() } });

    if (exitCode === 0)
    {
      core.info("Stopped Enclave Agent.");
    }
    else 
    {
      core.error(`Could not gracefully stop Enclave Agent. Exit code: ${exitCode}.`);
    }

    var bearerHandler = new httpAuth.BearerCredentialHandler(apiKey);

    var httpClient = new HttpClient('enclave-setup', [bearerHandler]);

    core.info("Revoking the Enclave System from your account...");
    
    const result = await httpClient.del(`https://api.enclave.io/org/${orgId}/systems/${enclaveInfo.id}`);

    if (result.message.statusCode == 200)
    {
      core.info("Successfully revoked Enclave System from your account");
    }
    else 
    {
      core.error("Failed to revoke Enclave System from your account:");
      core.error(await result.readBody());
    }

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
