import { JWK } from '@decentrl/jose';

export enum DidDocumentVerificationMethodType {
  JsonWebKey2020 = 'JsonWebKey2020',
}

interface DidDocumentVerificationMethodJsonWebKey2020 {
  id: string;
  type: DidDocumentVerificationMethodType.JsonWebKey2020;
  controller: string;
  publicKeyJwk: JWK;
}

export type DidDocumentVerificationMethod =
  DidDocumentVerificationMethodJsonWebKey2020;

export type DidDocumentAuthentication = string | DidDocumentVerificationMethod;
export type DidDocumentAssertionMethod = string | DidDocumentVerificationMethod;
export type DidDocumentKeyAgreement = string | DidDocumentVerificationMethod;

export type DidDocumentServiceEndpoint =
  | string
  | string[]
  | Record<string, any>;

export interface DidDocumentService {
  id: string;
  type: string;
  serviceEndpoint: DidDocumentServiceEndpoint;
}

export interface DidDocument {
  '@context': string[] | string;
  id: string;
  alias?: string;
  controller?: string | string[];
  alsoKnownAs?: string[];
  verificationMethod: DidDocumentVerificationMethod[];
  authentication: DidDocumentAuthentication[];
  assertionMethod: DidDocumentAssertionMethod[];
  keyAgreement: DidDocumentKeyAgreement[];
  service: DidDocumentService[];
}
