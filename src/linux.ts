import { exec } from '@actions/exec'
import {IManifestPackage} from './manifestTypes'

export function choosePackage(
  packages: IManifestPackage[]
): IManifestPackage | null {
  return packages.find(p => p.Architecture === 'X64') || null
}