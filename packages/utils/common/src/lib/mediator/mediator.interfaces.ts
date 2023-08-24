import {
  CommunicationContract,
  CommunicationContractRequest,
} from '../communication-contract/communication-contract.interfaces';

export enum MediatorCommunicationChannel {
  ONE_WAY_PUBLIC = 'ONE_WAY_PUBLIC',
  TWO_WAY_PRIVATE = 'TWO_WAY_PRIVATE',
  GROUP_PRIVATE = 'GROUP_PRIVATE',
}

export enum MediatorServiceType {
  REGISTER = 'Register',
  COMMUNICATION_CONTRACT = 'CommunicationContract',
  COMMUNICATION = 'Communication',
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

export interface MediatorRegisterService {
  id: string;
  type: `DecentrlMediator${MediatorServiceType.REGISTER}`;
  serviceEndpoint: MediatorServiceEndpoint;
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

export enum MediatorMessageType {
  COMMAND = 'COMMAND',
  EVENT = 'EVENT',
  ERROR = 'ERROR',
}

export enum MediatorErrorReason {
  NO_ENABLED_COMMUNICATION_CHANNELS = 'NO_ENABLED_COMMUNICATION_CHANNELS',
  RECIPIENT_NOT_REGISTERED = 'RECIPIENT_NOT_REGISTERED',
  ENCRYPTED_PAYLOAD_MISSING = 'ENCRYPTED_PAYLOAD_MISSING',
  DID_RESOLUTION_FAILED = 'DID_RESOLUTION_FAILED',
  MESSAGE_UNWRAPPING_FAILED = 'MESSAGE_UNWRAPPING_FAILED',
  RESPONSE_ENCRYPTION_FAILED = 'RESPONSE_ENCRYPTION_FAILED',
  NOT_REGISTERED = 'NOT_REGISTERED',
}

export interface MediatorErrorEvent {
  type: MediatorMessageType.ERROR;
  reason: MediatorErrorReason;
}

export interface MediatorEvent {
  // Tracking ID
  id?: string;
  type: MediatorMessageType.EVENT;
  payload: string;
}

export enum MediatorEventType {
  // Registration
  REGISTERED = 'REGISTERED',
  // Communication contract signing
  COMMUNICATION_CONTRACT_REQUESTED = 'COMMUNICATION_CONTRACT_REQUESTED',
  COMMUNICATION_CONTRACT_SIGNED = 'COMMUNICATION_CONTRACT_SIGNED',
  // Query
  QUERY_EXECUTED = 'QUERY_EXECUTED',
}

export interface MediatorEventPayload {
  name: MediatorEventType;
  payload?: unknown;
}

export interface MediatorCommand {
  // Tracking ID
  id: string;
  type: MediatorMessageType.COMMAND;
  payload: string;
}

export enum MediatorCommandType {
  REGISTER = 'REGISTER',
  REQUEST_COMMUNICATION_CONTRACT = 'REQUEST_COMMUNICATION_CONTRACT',
  SIGN_COMMUNICATION_CONTACT = 'SIGN_COMMUNICATION_CONTACT',
  QUERY = 'QUERY',
}

export interface MediatorCommandPayload {
  name: MediatorCommandType;
  recipient?: string;
  payload: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface MediatorQueryFilters {
  sender?: string;
  receiver?: string;

  command?: string

  metadata?: Record<string, any>;

  gte?: string;
  lte?: string;

  offset?: number;
  limit?: number;

  orderBy?: 'asc' | 'desc';
}

/**
 * Query
 */
export interface MediatorQueryCommandPayload {
  name: MediatorCommandType.QUERY;
  payload: MediatorQueryFilters;
}

export interface EventLog {
  id: string;
  name: string;
  sender: string;
  recipient?: string;
  payload: Record<string, any>;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface MediatorQueryEventPayload {
  name: MediatorEventType.QUERY_EXECUTED;
  payload: EventLog[];
}

/**
 * Registration
 */
export interface MediatorRegisterCommandPayload {
  name: MediatorCommandType.REGISTER;
  payload: {
    communicationChannels: MediatorCommunicationChannel[];
  };
}

export interface MediatorRegisteredEventPayload {
  name: MediatorEventType.REGISTERED;
  payload: {
    communicationChannels: MediatorCommunicationChannel[];
  };
}

/**
 * Communication contract
 */
export interface MediatorRequestCommunicationContractCommandPayload {
  name: MediatorCommandType.REQUEST_COMMUNICATION_CONTRACT;
  recipient: string;
  payload: RequestCommunicationContractPayload;
}

export interface RequestCommunicationContractPayload {
  contract: string;
}

export interface MediatorCommunicationContractRequestedEventPayload {
  name: MediatorEventType.COMMUNICATION_CONTRACT_REQUESTED;
}

export interface MediatorSignCommunicationContractCommandPayload {
  name: MediatorCommandType.SIGN_COMMUNICATION_CONTACT;
  recipient: string;
  payload: SignCommunicationContractPayload;
}

export interface SignCommunicationContractPayload {
  contract: string;
}

export interface MediatorCommunicationContractSignedEventPayload {
  name: MediatorEventType.COMMUNICATION_CONTRACT_SIGNED;
}

// export type MediatorCommandGenerator = <
//   T extends MediatorCommandPayload = MediatorCommandPayload
// >(
//   payload: T,
//   didData: DidData,
//   mediatorDidDocument: DidDocument
// ) => Promise<MediatorCommand>;

// export type MediatorEventReader = <
//   T extends MediatorEventPayload = MediatorEventPayload
// >(
//   payload: MediatorEvent,
//   didData: DidData
// ) => Promise<T>;

/**
 * Communication contract signing = Client1-------SIGNED_COMMUNICATION_CONTRACT-------->Client2------SIGNED_COMMUNICATION_CONTRACT------>Client2
 * - -
 * Client1 signs communication contract that contains Client2's public key and id of a key used to encrypt messages
 * Client2 signs the contract with the private key corresponding to the public key from the contract
 * - -
 * Both Clients now have a copy of signed communication contract
 * - -
 * When Client1 wants to send a message to the Client2, it also sends the signed communication contract,
 * which mediator then verifies and upon successful verification forwards the message to the Client2.
 * In case verification fails, mediator does not forward any message to Client2, but can optionally send
 * error message to Client1.
 * - -
 * Communication contract should also contain a secret key that is used to anonymize metadata values that are sent to the mediator.
 * - -
 * Authentication with mediator is also done via signed communication contract. When mediator receives a
 * request it evaluates sender did to see if it matches mediator criteria. (this will enable mediators to have blacklists of dids)
 * - -
 * The blacklist can also prove useful when evaluating some did's reputation. If a did is on a lot of mediators' blacklists,
 * it is probably not a good idea to trust it. Client can query public mediator lists to get feedback from as many mediators as possible.
 * - -
 * Clients can set the configuration for evaluating did reputation. For example, Client1 could set the configuration to require
 * at least 30% mediators (min 100 mediators checked) to have a did on their blacklist in order to consider the did to be untrustworthy.
 * When client is querying mediator lists, it should prioritize mediators with which it already has a signed communication contract.
 * To set the configuration, client sends command to a mediator configuration service endpoint on which it is registered.
 * - -
 * ---- Communication contract revocation ----
 * Communication contract can be revoked by either party. When revocation happens, mediator will no longer forward messages
 * to the party that revoked the contract.
 * - -
 * Mediators hold a list of revoked communication contracts and will not forward messages to parties that have revoked
 * communication contract with each other. Mediators can also optionally send error messages to the party that was revoked
 * to inform them that their communication contract has been revoked.
 * - -
 * ---- Communication contract expiration ----
 * Signatures can include expiration date. When mediator receives a message with expired communication contract,
 * it will not forward the message to the other party, but can optionally send error message to the party that sent the message.
 * - -
 * If contract has expired, but has not been revoked, it can be renewed by either party.
 * - -
 * ---- Mediator ----
 * When client registeres on mediator it can define which message forwarding types it would like to enable.
 * Client can for example only decide that one-way message forwarding is enough for its use case. With only one-way message forwarding enabled,
 * Client1 can only read public messages that Client2 sends to its mediators. Client1 cannot send any messages to Client2. This use-case
 * could prove useful for features such as sharing posts with the public (Twitter, Facebook...).
 * - -
 * ---- Mediator configuration ----
 * With configuration, clients can configure reputation thresholds
 * - -
 * ---- Mediator service endpoints
 * Mediators support different features. In order for a DID to be considered a mediator, it should at least support:
 * - Communication contract signing
 * - - - This is the most basic mediator feature. It enables clients to sign communication contracts with each other and
 * - - - with the mediator itself.
 * - Message forwarding.
 * - - - There are multiple message forwarding types, but only one is required for a DID to be considered a mediator.
 * - - - - - One-way message forwarding
 * - - - - - - - This is the most basic message forwarding type. It enables clients to send messages to the mediator,
 * - - - - - - - which everyone can read. This is useful for building features such as sharing posts & announcements with the public.
 * - - - - - - - (Twitter like feeds). With only this communication enabled on mediator, noone will be able to contact you.
 * - - - - - Two-way message forwarding
 * - - - - - - - Two way message forwarding enables two clients to communicate with eachother. Clients can enable two-way
 * - - - - - - - message forwarding with other clients by signing a communication contract with them. Without the communication
 * - - - - - - - contract, mediator will not forward any messages between the two clients.
 * - - - - - - - Two way message types that are required for communication contract signing skip the contract check but are still
 * - - - - - - - susceptible to reputation, blacklist and configured checks.
 * - - - - - Group message forwarding
 * - -
 * Every mediator feature has its designated service endpoint for communication. The service endpoint defines how to
 * communicate this specific mediator feature. Some service endpoints could be simple REST endpoints, while others could be
 * event based websockets.
 * - -
 * Other Mediator service endpoints include:
 * - Configuration service endpoint
 * - Revocation service endpoint
 * - Blacklist service endpoint
 * - -
 * Mediator service endpoints should all point to a single WS connection, but with different event schemas (different event name, type...) for each feature.
 * - -
 * ---- Mediator registration ----
 * When identity registers on a mediator, it should provide list of features mediator should enable for it and also provide a signed
 * recovery key. In case did is not resolvable anymore (registry goes offline), recovery key can be used to authenticate with mediator
 * and recover the did related data that mediator has saved (this will only work if client has did private keys). With the data recovered
 * client can then register did on a different registry (which will mean that the client will have a different resolvable did) but
 * recovered data can be hydrated on new dids mediators. This enables clients to change registries without losing their data BUT THEY
 * WILL LOSE ALL COMMUNICATION CONTRACTS.
 *
 * Communication contracts should be registered on the mediators
 *
 * possible mediator token for communicating with identity ? this would enable mediator to only check communication contracts when token does not exist
 * - -
 * ---- Mediator metadata anonymization ----
 * Two identities communicating with each other via mediator can anonymize their metadata using a secret key that was shared
 * between them when they signed the communication contract. This secret key can be used to anonymize metadata values that are
 * sent to the mediator.
 */

type Encrypt<T> = string;
type Anonymized<T> = string;

export type Event = Record<string, unknown>;
export type EventMetadata = Record<string, unknown>;

export interface MediatorOneWayPublicModel {
  // Sender DID
  sender: string;
  // Message
  message: Event;
  // Searchable metadata
  metadata: EventMetadata;
  // Created at date
  createdAt: Date;
}

export interface PublicPostModel {
  id: string;
  message: string;
}

export interface CreatePublicPostEvent {
  id: string;
  message: string;
}

export interface MediatorTwoWayPrivateModel {
  // Array of two DID's
  participants: [string, string];
  // Sender DID - One of the participants
  sender: string;
  // Receiver DID - One of the participants
  receiver: string;
  // Encrypted message
  message: string;
  // Searchable metadata
  metadata: EventMetadata;
  // Created at date
  createdAt: Date;
}

export interface ClientChatModel {
  id: string;
  participants: [string, string];
  name: string;
}

export interface CreateChatEvent {
  id: string;
  participants: [string, string];
  name: string;
}

export interface CreateChatMediatorPayload {
  participants: [string, string];
  message: Encrypt<CreateChatEvent>;
  metadata: {
    id: Anonymized<string>;
    type: Anonymized<'Chat'>;
  };
}

export interface UpdateChatEvent {
  chatId: string;
  newName: string;
}

export interface UpdateChatMediatorPayload {
  participants: [string, string];
  message: Encrypt<UpdateChatEvent>;
  metadata: {
    id: Anonymized<string>;
    type: Anonymized<'Chat'>;
  };
}

// export interface ClientChatMessageModel {}

/**
 * Group private
 *
 * Group is a peer did that has its own mediators. Mediator has the peer did registered internally because of validation.
 * The group did contains admin key that is used to sign messages that can update the "public" group peer did that
 * is registered on the mediator. When a group is created, group peer did is sent to group participants via the two way private
 * communication channel. Group admin must have a connection contract established with the group participants in order to send them
 * the group peer did. When sending the did, creator doesn't have to send all private keys. They can only send the communication key
 * and not the group admin key. This way, group participants can only send messages to the group, but cannot update the group peer did.
 *
 * This could result in us creating a generic permissioning system that can be adapted to each group. Define which properties can be changed
 * by which permission group.
 *
 * Admin ---> Mediator ---> Group participants --- Group communication contract? --> Communication contract between the group and the identity
 *
 * To add a new user to the group, admin has to send encrypted group peer did to the new participant through the group contract communication channel.
 *
 */
