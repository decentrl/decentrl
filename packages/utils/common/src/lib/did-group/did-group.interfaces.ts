import { DidKeyPair } from '../did/did.interfaces';

export enum GroupDidKeyPairType {
  DOCUMENT_CONTROL_ENCRYPTION_KEY_PAIR = 'DOCUMENT_CONTROL_ENCRYPTION_KEY_PAIR',
  DOCUMENT_CONTROL_SIGNING_KEY_PAIR = 'DOCUMENT_CONTROL_SIGNING_KEY_PAIR',
  COMMUNICATION_CONTRACT_ENCRYPTION_KEY_PAIR = 'COMMUNICATION_CONTRACT_ENCRYPTION_KEY_PAIR',
  COMMUNICATION_CONTRACT_SIGNING_KEY_PAIR = 'COMMUNICATION_CONTRACT_SIGNING_KEY_PAIR',
  MESSAGING_ENCRYPTION_KEY_PAIR = 'MESSAGING_ENCRYPTION_KEY_PAIR',
  MESSAGING_SIGNING_KEY_PAIR = 'MESSAGING_SIGNING_KEY_PAIR',
}

export interface GroupDidData {
  did: string;
  keys: {
    [GroupDidKeyPairType.DOCUMENT_CONTROL_ENCRYPTION_KEY_PAIR]?: DidKeyPair;
    [GroupDidKeyPairType.DOCUMENT_CONTROL_SIGNING_KEY_PAIR]?: DidKeyPair;
    [GroupDidKeyPairType.COMMUNICATION_CONTRACT_ENCRYPTION_KEY_PAIR]?: DidKeyPair;
    [GroupDidKeyPairType.COMMUNICATION_CONTRACT_SIGNING_KEY_PAIR]?: DidKeyPair;
    [GroupDidKeyPairType.MESSAGING_ENCRYPTION_KEY_PAIR]?: DidKeyPair;
    [GroupDidKeyPairType.MESSAGING_SIGNING_KEY_PAIR]?: DidKeyPair;
  };
}

export type KeyPairGenerator = () => Promise<DidKeyPair>;

export enum GroupServiceEndpointPurpose {
  DOCUMENT_CONTROL = 'DOCUMENT_CONTROL',
  COMMUNICATION_CONTRACT_CONTROL = 'COMMUNICATION_CONTRACT_CONTROL',
  MESSAGING = 'MESSAGING',
}

export interface ServiceEndpoint {
  uri: string;
  routingKeys: string[];
}

export interface GroupServiceEndpoint extends ServiceEndpoint {
  purposes: GroupServiceEndpointPurpose[];
}
