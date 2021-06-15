import * as core from '@actions/core'

async function run(): Promise<void> {
  try {

    // Clean-up & Revoke
    

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
