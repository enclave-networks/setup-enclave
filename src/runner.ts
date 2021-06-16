import { HttpClient } from '@actions/http-client'
import {exec, spawn} from 'child_process'
import {readFileSync} from 'fs'
import path from 'path'
import { FabricStatus } from './statusTypes'

export interface IEnclavePid {
    api_key: string,
    heartbeat: number,
    pid: number,
    uri: string
};

export async function spawnEnclave(
  enclavePath: string,
  enrolmentKey: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let envCopy: {[id: string]: string} = {}
    let envName: string
    for (envName in process.env) {
      var envVal = process.env[envName]

      if (envVal) {
        envCopy[envName] = envVal
      }
    }

    envCopy['ENCLAVE_ENROLMENT_KEY'] = enrolmentKey
    envCopy['ENCLAVE_BINARY'] = enclavePath;

    // Locate the spawn script.
    var spawnScript = path.join(__dirname, '..', '..', 'externals', 'spawn-linux.sh');

    try {
      var childProcess = spawn(spawnScript, {
        env: envCopy,
        detached: true,
        stdio: 'ignore'
      });

      childProcess.unref();

      resolve();
    } catch (err) {
      reject(err)
    }
  })
}

export async function getEnclaveInfo(pidInfo: IEnclavePid): Promise<{id: string; localAddress: string}> {
  
    let attemptCounter = 0;
    while (true)
    {
        try 
        {
            let authHeader = {['X-Auth-Token']: pidInfo.api_key};

            // Now call the API to get the status.
            let http: HttpClient = new HttpClient('enclave-actions');

            const apiResponse = await http.getJson<FabricStatus>(`${pidInfo.uri}/fabric/status`, authHeader);

            const status = apiResponse.result;

            // Only when ready...
            if (status && status.Profile.VirtualAddress)
            {
                return { id: status.Profile.Certificate.SubjectDistinguishedName, localAddress:  status.Profile.VirtualAddress };
            }

            throw "Not ready";
        }
        catch (err)
        {
            attemptCounter++;

            if (attemptCounter < 3)
            {
                await sleep(1000);
            }
            else 
            {
                throw "Could not retrieve Enclave info";
            }
        }
    }
}

export async function getEnclavePidInfo() : Promise<IEnclavePid>
{   
    let attemptCounter = 0;
    while (true)
    {
        try 
        {
            const pidContents = readFileSync('/etc/enclave/pid/Universe.profile.pid', 'utf-8');

            const pidObject: IEnclavePid = JSON.parse(pidContents);

            return pidObject;
        }
        catch (err)
        {
            attemptCounter++;

            if (attemptCounter < 3)
            {
                await sleep(1000);
            }
            else 
            {
                throw "Could not load PID file";
            }
        }
    }

}


async function sleep(ms: number) : Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}   
