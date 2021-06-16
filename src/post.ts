import * as core from '@actions/core'
import fetch from 'node-fetch';

async function run(): Promise<void> {
  try {

    // Clean-up & Revoke
    var pid = parseInt(core.getState("ENCLAVE_PID"));

    var orgId = core.getInput("organisation");
    var apiKey = core.getInput("apiKey");

    process.kill(pid, "SIGINT");

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
