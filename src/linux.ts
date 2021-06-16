import {execSync} from 'child_process'
import * as fs from 'fs'
import {IManifestPackage} from './manifestTypes'

export function choosePackage(
  packages: IManifestPackage[]
): IManifestPackage | null {
  return packages.find(p => p.Architecture === 'X64') || null
}

export function extractPackage(
  tmpPath: string,
  destFolder: string
): string {
  execSync(`tar xf ${tmpPath} -C ${destFolder}`)

  const target = `${destFolder}/enclave`;

  fs.symlinkSync(target,  '/usr/bin/enclave');
  fs.chownSync(target, 0, 0);
  fs.chmodSync(target, 755);

  return target
}
