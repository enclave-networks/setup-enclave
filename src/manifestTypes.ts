
export interface IManifestPackage {
    Platform: string;
    Architecture: string;
    Url: string;
    Hash: string;
    HashAlg: string;
}

export interface IManifestFormat {
    ProductName: string;
    DocumentHash: null | string;
    DocumentSignature: null | string;
    TimeToLive: 60;
    ReleaseVersions: {
      MajorVersion: number;
      MinorVersion: number;
      BuildVersion: number;
      RevisionVersion: number;
      ReleaseType: string;
      ReleaseDate: number;
      HardStop: number;
      TargetEnvironment: string;
      Packages: IManifestPackage[];
      ReleaseNotes: null;
    }[];
  }
  