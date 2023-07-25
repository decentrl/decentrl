import { DidDocument } from '../did-document/did-document.interfaces';

export interface CommunicationContractRequest {
  requestorDid: string;
  requestorPublicSigningKeyId: string;

  recipientDid: string;
  recipientPublicSigningKeyId: string;

  contractExpiresAt?: number;
}

export interface CommunicationContractRequestVerificationResult {
  requestorDidDocument: DidDocument;
  communicationContractRequest: CommunicationContractRequest;
}

export interface CommunicationContract {
  requestorSignature: string;
  contractExpiresAt?: number;
}

export interface CommunicationContractVerificationResult {
  requestorDidDocument: DidDocument;
  recipientDidDocument: DidDocument;
  communicationContract: CommunicationContract;
}
