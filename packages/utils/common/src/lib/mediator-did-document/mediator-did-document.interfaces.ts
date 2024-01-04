export enum MediatorCommunicationChannel {
  ONE_WAY_PUBLIC = 'ONE_WAY_PUBLIC',
  TWO_WAY_PRIVATE = 'TWO_WAY_PRIVATE',
  GROUP_PRIVATE = 'GROUP_PRIVATE',
}

export enum MediatorServiceType {
  COMMUNICATION_CONTRACT = 'CommunicationContract',
  COMMUNICATION = 'Communication',
  GROUP = 'Group',
  BACKLIST = 'Blacklist',
  DISCOVERY = 'Discovery',
}

export interface MediatorService {
  id: string;
  type: `DecentrlMediator${MediatorServiceType}`;
  serviceEndpoint:
    | MediatorServiceEndpoint
    | MediatorCommunicationServiceEndpoint;
}

export interface MediatorServiceEndpoint {
  uri: string;
  routingKeys: string[];
}

export interface MediatorCommunicationServiceEndpoint
  extends MediatorServiceEndpoint {
  communicationChannels: MediatorCommunicationChannel[];
}

export interface MediatorCommunicationContractService {
  id: string;
  type: `DecentrlMediator${MediatorServiceType.COMMUNICATION_CONTRACT}`;
  serviceEndpoint: MediatorServiceEndpoint;
}

export interface MediatorCommunicationService {
  id: string;
  type: `DecentrlMediator${MediatorServiceType.COMMUNICATION}`;
  serviceEndpoint: MediatorCommunicationServiceEndpoint;
}

export interface MediatorGroupService {
  id: string;
  type: `DecentrlMediator${MediatorServiceType.GROUP}`;
  serviceEndpoint: MediatorServiceEndpoint;
}
