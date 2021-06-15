import { spawn } from "child_process";

export async function spawnEnclave(enclavePath: string, enrolmentKey: string) : Promise<number>
{
    return new Promise<number>((resolve, reject) => {

        try {
            var childProcess = spawn(`sudo`, [enclavePath, 'run'], {
                env: { 'ENCLAVE_ENROLMENT_KEY': enrolmentKey },
                detached: true
            });
            
            resolve(childProcess.pid);
        }
        catch(err)
        {
            reject(err);
        }

    });
}