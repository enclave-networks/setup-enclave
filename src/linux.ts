import {IManifestPackage} from './manifest-types';

export function choosePackage(
  packages: IManifestPackage[]
): IManifestPackage | null {
  return packages.find(p => p.Architecture === 'X64') || null;
}
