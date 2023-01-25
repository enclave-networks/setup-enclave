export interface FabricStatus {
  BindingAddress: string;
  Capabilities: Capability[];
  TapInterfaceIndex: number;
  TapInterfacePhysicalAddress: string;
  TapInterfaceName: string;
  LogFileName: string;
  Profile: Profile;
  Policy: Policy;
  Peers: Peer[];
}

export interface Capability {
  Title: string;
  IsFaulted: boolean;
  State: string;
}

export interface Peer {
  ConnectionCandidates: ConnectionCandidate[];
  MacAddress: string;
  Tunnel: Tunnel;
  Certificate: Certificate;
  Description: string;
  Guid: string;
  Hostnames: string[];
  IsAdministrativelyDown: boolean;
  MillisecondsSinceLastActivity: number;
  MaximumSendRate: number;
  MaximumReceiveRate: number;
  Name: string;
  PinnedPublicKey: string;
  RoundTripTime: number;
  SubscriptionState: number;
  Type: number;
  VirtualAddress: null;
  VirtualSubnetMask: null;
  VirtualNetwork: null;
  ExitNodeFor: string[];
}

export interface Certificate {
  version: number;
  serialNumber: string;
  permittedUse: number;
  subjectDistinguishedName: string;
  subjectPublicKey: string;
  notBefore: number;
  notAfter: number;
  issuerDistinguishedName: string;
  issuerPublicKey: string;
  signature: string;
}

export interface ConnectionCandidate {
  EndPoint: string;
  Type: number;
}

export interface Tunnel {
  Age: number;
  BytesInDelta: number;
  BytesOutDelta: number;
  Certificate: Certificate;
  Created: Date;
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

export interface Policy {
  status: number;
  isCentrallyManaged: boolean;
  tags: string[];
}

export interface Profile {
  Certificate: Certificate;
  FilePath: null;
  DesiredState: number;
  ConnectTimeout: number;
  Guid: string;
  LocalNameserver: string;
  NameServerIsBound: boolean;
  LocalPort: number;
  PersistentKeepaliveInterval: number;
  CurrentPingInterval: number;
  ProfileName: string;
  TapAdapterGuid: string;
  UPnPEnabled: boolean;
  VirtualAddress: string;
  VirtualSubnetMask: string;
  VirtualNetwork: string;
  Description: string;
  Hostnames: string[];
  ExitNodeFor: string[];
}
