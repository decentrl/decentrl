import { DidDocument } from '../did-document/did-document.interfaces';

export interface CommunicationContractRequest {
  id: string;

  requestorDid: string;
  requestorPublicSigningKeyId: string;

  recipientDid: string;
  recipientPublicSigningKeyId: string;

  recipientEncryptedCommunicationSecretKey: string;

  expiresAt?: number;
  metadata?: Record<string, any>;
}

export interface CommunicationContractRequestVerificationResult {
  requestorDidDocument: DidDocument;
  communicationContractRequest: CommunicationContractRequest;
}

export interface CommunicationContractSignatureResult {
  verificationResult: CommunicationContractRequestVerificationResult;
  signature: string;
}

export interface CommunicationContract {
  requestorSignature: string;
  requestorEncryptedCommunicationSecretKey: string;
}

export interface CommunicationContractVerificationResult {
  requestorDidDocument: DidDocument;
  recipientDidDocument: DidDocument;
  recipientEncryptedCommunicationSecretKey: string;
  requestorEncryptedCommunicationSecretKey: string;
  communicationContract: CommunicationContract;
}
