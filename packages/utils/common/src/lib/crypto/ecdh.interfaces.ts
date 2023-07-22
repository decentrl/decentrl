import { DidDocument, DidDocumentVerificationMethod } from "../did-document/did-document.interfaces";

export interface DecryptAndVerifyPayloadResult {
  decryptedPayload: string;
  senderDidDocument: DidDocument;
}

export interface KeyResolutionResult {
  verificationMethod: DidDocumentVerificationMethod;
  didDocument: DidDocument;
}
