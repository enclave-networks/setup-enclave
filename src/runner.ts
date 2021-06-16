import {exec, spawn} from 'child_process'
import {readFile} from 'fs'

export async function spawnEnclave(
  enclavePath: string,
  enrolmentKey: string
): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    let envCopy: {[id: string]: string} = {}
    let envName: string
    for (envName in process.env) {
      var envVal = process.env[envName]

      if (envVal) {
        envCopy[envName] = envVal
      }
    }

    envCopy['ENCLAVE_ENROLMENT_KEY'] = enrolmentKey

    try {
      var childProcess = spawn(enclavePath, ['run'], {
        env: envCopy,
        detached: true,
        stdio: 'ignore'
      })

      childProcess.unref()

      resolve(childProcess.pid)
    } catch (err) {
      reject(err)
    }
  })
}

export function GetEnclaveInfo(
  enclaveBinaryPath: string
): Promise<{Id: string; LocalAddress: string}> {
  return new Promise<{Id: string; LocalAddress: string}>(
    async (resolve, reject) => {
      // Read the profile json.
      var enclaveProfile = readFile('/etc/enclave/profiles/', (err, data) => {

      });
    }
  )
}
