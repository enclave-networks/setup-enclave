export interface FabricStatus {
  bindingAddress: string;
  capabilities: Capability[];
  tapInterfaceIndex: number;
  tapInterfacePhysicalAddress: string;
  tapInterfaceName: string;
  logFileName: string;
  profile: Profile;
  policy: Policy;
  peers: Peer[];
}

export interface Capability {
  title: string;
  isFaulted: boolean;
  state: string;
}

export interface Peer {
  connectionCandidates: ConnectionCandidate[];
  macAddress: string;
  tunnel: Tunnel;
  certificate: Certificate;
  description: string;
  guid: string;
  hostnames: string[];
  isAdministrativelyDown: boolean;
  millisecondsSinceLastActivity: number;
  maximumSendRate: number;
  maximumReceiveRate: number;
  name: string;
  pinnedPublicKey: string;
  roundTripTime: number;
  subscriptionState: number;
  type: number;
  virtualAddress: null;
  virtualSubnetMask: null;
  virtualNetwork: null;
  exitNodeFor: string[];
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
  endPoint: string;
  type: number;
}

export interface Tunnel {
  age: number;
  bytesInDelta: number;
  bytesOutDelta: number;
  certificate: Certificate;
  created: Date;
  framesInDelta: number;
  framesOutDelta: number;
  localEndPoint: string;
  maximumReceiveRate: number;
  maximumSendRate: number;
  protocolEndPoint: string;
  protocolType: number;
  subscriptionState: number;
  totalBytesIn: number;
  totalBytesOut: number;
  totalFramesIn: number;
  totalFramesOut: number;
  type: number;
}

export interface Policy {
  status: number;
  isCentrallyManaged: boolean;
  tags: string[];
}

export interface Profile {
  certificate: Certificate;
  filePath: null;
  desiredState: number;
  connectTimeout: number;
  guid: string;
  localNameserver: string;
  nameServerIsBound: boolean;
  localPort: number;
  persistentKeepaliveInterval: number;
  currentPingInterval: number;
  profileName: string;
  tapAdapterGuid: string;
  uPnPEnabled: boolean;
  virtualAddress: string;
  virtualSubnetMask: string;
  virtualNetwork: string;
  description: string;
  hostnames: string[];
  exitNodeFor: string[];
}
