export interface FabricStatus {
  BindingAddress: string;
  Capabilities: CapabilitiesEntity[];
  TapInterfaceIndex: number;
  TapInterfacePhysicalAddress: string;
  TapInterfaceName: string;
  Profile: Profile;
  Policy: Policy;
  Peers: PeersEntity[];
}

export interface CapabilitiesEntity {
  Author: string;
  Copyright: string;
  Compatibility?: string[] | null;
  Description: string;
  IconUrl: string;
  Id: string;
  IsEnabled: boolean;
  IsFaulted: boolean;
  Languages?: string[] | null;
  License: string;
  LicenseUrl?: null;
  Owner: string;
  PluginType: string;
  Priority: number;
  ProjectUrl: string;
  State: string;
  Tags?: string[] | null;
  Title: string;
  Version: string;
}
export interface Profile {
  AuthorisedPeers?: null[] | null;
  Certificate: Certificate;
  FilePath: string;
  DesiredState: number;
  ConnectTimeout: number;
  Guid: string;
  LocalNameserver: string;
  LocalPort: number;
  PersistentKeepaliveInterval: number;
  ProfileName: string;
  TapAdapterGuid: string;
  UPnPEnabled: boolean;
  VirtualAddress?: string | null;
  VirtualSubnetMask: string;
  VirtualNetwork?: string | null;
  Description: string;
  Hostnames: string[] | null;
  ExitNodeFor?: string[] | null;
}
export interface Certificate {
  Version: number;
  SerialNumber: string;
  PermittedUse: number;
  SubjectDistinguishedName: string;
  SubjectPublicKey: string;
  NotBefore: number;
  NotAfter: number;
  IssuerDistinguishedName: string;
  IssuerPublicKey: string;
  Signature: string;
}
export interface Policy {
  Status: number;
  IsCentrallyManaged: boolean;
  Tags?: null[] | null;
}
export interface PeersEntity {
  ConnectionCandidates?: ConnectionCandidatesEntity[] | null;
  MacAddress?: null;
  Tunnel: Tunnel;
  Certificate: Certificate;
  Description: string;
  Guid: string;
  Hostnames?: null[] | null;
  IsAdministrativelyDown: boolean;
  MillisecondsSinceLastActivity: number;
  MaximumSendRate: number;
  MaximumReceiveRate: number;
  Name: string;
  PinnedPublicKey: string;
  RoundTripTime: number;
  SubscriptionState: number;
  Type: number;
  VirtualAddress?: null;
  VirtualSubnetMask?: null;
  VirtualNetwork?: null;
  ExitNodeFor?: null[] | null;
}
export interface ConnectionCandidatesEntity {
  EndPoint: string;
  Type: number;
}
export interface Tunnel {
  Age: number;
  BytesInDelta: number;
  BytesOutDelta: number;
  Certificate: Certificate;
  Created: string;
  FramesInDelta: number;
  FramesOutDelta: number;
  LocalEndPoint: string;
  MaximumReceiveRate: number;
  MaximumSendRate: number;
  ProtocolEndPoint: string;
  ProtocolType: number;
  SubscriptionState: number;
  TotalBytesIn: number;
  TotalBytesOut: number;
  TotalFramesIn: number;
  TotalFramesOut: number;
  Type: number;
}
