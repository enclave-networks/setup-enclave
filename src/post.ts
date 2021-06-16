import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    // Clean-up & Revoke
    const pid = parseInt(core.getState('ENCLAVE_PID'))

    // var orgId = core.getInput('organisation')
    // var apiKey = core.getInput('apiKey')

    process.kill(pid, 'SIGINT')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
