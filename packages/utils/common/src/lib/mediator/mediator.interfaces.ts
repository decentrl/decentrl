export enum MediatorFeature {
  CHALLENGE_AUTHENTICATION = 'CHALLENGE_AUTHENTICATION',
  TOKEN_AUTHENTICATION = 'TOKEN_AUTHENTICATION',
}

export interface MediatorService {
  id: string;
  type: 'DecentrlMediator';
  serviceEndpoint: MediatorServiceEndpoint;
}

export interface MediatorServiceEndpoint {
  uri: string;
  routingKeys: string[];
  features?: MediatorFeature[];
}

export enum MediatorMessageType {
  COMMAND = 'COMMAND',
}

export interface MediatorMessage<T extends Record<string, any>> {
  id: string;
  type: MediatorMessageType;
  payload: T;
}


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
 */
