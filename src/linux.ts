import {execSync} from 'child_process'
import * as fs from 'fs/promises'
import {IManifestPackage} from './manifestTypes'

export function choosePackage(
  packages: IManifestPackage[]
): IManifestPackage | null {
  return packages.find(p => p.Architecture === 'X64') || null
}

export async function extractPackage(
  tmpPath: string,
  destFolder: string
): Promise<string> {
  execSync(`tar xf ${tmpPath} -C ${destFolder}`)

  const target = `${destFolder}/enclave`

  await fs.symlink(target, '/usr/bin/enclave')
  await fs.chown(target, 0, 0)
  await fs.chmod(target, 755)

  return target
}
