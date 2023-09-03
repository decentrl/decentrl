import {
  readSignaturePayload,
  signPayload,
  verifySignature,
} from '../crypto/eddsa';
import { resolveDidDocument } from '../did-document/did-document';
import {
  DidDocument,
  DidDocumentVerificationMethodType,
} from '../did-document/did-document.interfaces';
import {
  getKey,
  getVerificationMethods,
} from '../did-document/did-document.utils';
import { DidData } from '../did/did.interfaces';
import {
  CommunicationContract,
  CommunicationContractRequest,
  CommunicationContractRequestVerificationResult,
  CommunicationContractSignatureResult,
  CommunicationContractVerificationResult,
} from './communication-contract.interfaces';
import { decryptPayload, encryptPayload } from '../crypto/ecdh';
import { Cryptography } from '../crypto/crypto.interfaces';
import { v4 } from 'uuid';

export async function generateCommunicationContractSignatureRequest(
  requestorDidData: DidData,
  recipientDid: string,
  secretContractKey: string,
  type: Cryptography,
  expiresAt?: number,
  metadata?: Record<string, any>
): Promise<string> {
  const recipientDidResolutionResult = await resolveDidDocument(recipientDid);
  const recipientDidDocument =
    recipientDidResolutionResult.didDocument as DidDocument;

  const verificationMethods = getVerificationMethods(
    recipientDidDocument,
    'verificationMethod',
    DidDocumentVerificationMethodType.JsonWebKey2020
  );

  if (verificationMethods.length === 0) {
    throw new Error(
      `Recipient ${recipientDid} does not have any verification methods`
    );
  }

  const keyAgreements = getVerificationMethods(
    recipientDidDocument,
    'keyAgreement',
    DidDocumentVerificationMethodType.JsonWebKey2020
  );

  if (keyAgreements.length === 0) {
    throw new Error(
      `Recipient ${recipientDid} does not have any key agreements`
    );
  }

  const requestorPublicSigningKeyId = `${requestorDidData.did}#${requestorDidData.keys.signingKeyPair.public.kid}`;
  const recipientPublicSigningKeyId = verificationMethods[0].id;

  const recipientEncryptedCommunicationSecretKey = await encryptPayload(
    secretContractKey,
    type,
    requestorDidData.keys.encryptionKeyPair.private,
    keyAgreements[0].publicKeyJwk,
    keyAgreements[0].id
  );

  const communicationContract: CommunicationContractRequest = {
    id: v4(),
    requestorDid: requestorDidData.did,
    requestorPublicSigningKeyId,
    recipientDid,
    recipientPublicSigningKeyId,
    expiresAt: expiresAt,
    recipientEncryptedCommunicationSecretKey,
    metadata,
  };

  const signedCommunicationContractRequest = await signPayload(
    JSON.stringify(communicationContract),
    requestorDidData.keys.signingKeyPair.private,
    requestorPublicSigningKeyId,
    type
  );

  return signedCommunicationContractRequest;
}

export async function verifyCommunicationContractSignatureRequest(
  signedCommunicationContractRequest: string,
  type: Cryptography
): Promise<CommunicationContractRequestVerificationResult> {
  const communicationContractRequest =
    await readSignaturePayload<CommunicationContractRequest>(
      signedCommunicationContractRequest
    );

  if (
    communicationContractRequest.expiresAt &&
    communicationContractRequest.expiresAt < Date.now() / 1000
  ) {
    throw new Error(
      `Communication contract request invalid: Contract has expired.`
    );
  }

  const requestorDidResolutionResult = await resolveDidDocument(
    communicationContractRequest.requestorDid
  );

  const requestorDidDocument =
    requestorDidResolutionResult.didDocument as DidDocument;

  const requestorPublicSigningKey = getKey(
    requestorDidDocument,
    communicationContractRequest.requestorPublicSigningKeyId
  );

  if (!requestorPublicSigningKey) {
    throw new Error(
      `Communication contract request invalid: Requestor public key not found.`
    );
  }

  const signaturePayload = await verifySignature(
    signedCommunicationContractRequest,
    requestorPublicSigningKey.publicKeyJwk,
    type
  );

  if (signaturePayload.protectedHeader.kid !== requestorPublicSigningKey.id) {
    throw new Error(
      `Communication contract request invalid: Requestor public key id does not match signature key id.`
    );
  }

  return {
    communicationContractRequest,
    requestorDidDocument,
  };
}

export async function signCommunicationContract(
  signedCommunicationContractRequest: string,
  recipientDidData: DidData,
  type: Cryptography
): Promise<CommunicationContractSignatureResult> {
  const verificationResult = await verifyCommunicationContractSignatureRequest(
    signedCommunicationContractRequest,
    type
  );

  const secretContractKey = await decryptPayload(
    verificationResult.communicationContractRequest
      .recipientEncryptedCommunicationSecretKey,
    recipientDidData.keys.encryptionKeyPair.private,
    type
  );

  const keyAgreements = getVerificationMethods(
    verificationResult.requestorDidDocument,
    'keyAgreement',
    DidDocumentVerificationMethodType.JsonWebKey2020
  );

  if (keyAgreements.length === 0) {
    throw new Error(
      `Recipient ${verificationResult.requestorDidDocument.id} does not have any key agreements`
    );
  }

  const requestorEncryptedCommunicationSecretKey = await encryptPayload(
    secretContractKey.plaintext.toString(),
    type,
    recipientDidData.keys.encryptionKeyPair.private,
    keyAgreements[0].publicKeyJwk,
    keyAgreements[0].id
  );

  const communicationContract: CommunicationContract = {
    requestorSignature: signedCommunicationContractRequest,
    requestorEncryptedCommunicationSecretKey,
  };

  const recipientPublicSigningKeyId = `${recipientDidData.did}#${recipientDidData.keys.signingKeyPair.public.kid}`;

  const signedCommunicationContract = await signPayload(
    JSON.stringify(communicationContract),
    recipientDidData.keys.signingKeyPair.private,
    recipientPublicSigningKeyId,
    type
  );

  return {
    signature: signedCommunicationContract,
    verificationResult,
  };
}

export async function verifyCommunicationContract(
  signedCommunicationContract: string,
  type: Cryptography
): Promise<CommunicationContractVerificationResult> {
  const communicationContract =
    await readSignaturePayload<CommunicationContract>(
      signedCommunicationContract
    );

  const communicationContractRequestVerificationResult =
    await verifyCommunicationContractSignatureRequest(
      communicationContract.requestorSignature,
      type
    );

  if (
    communicationContractRequestVerificationResult.communicationContractRequest
      .expiresAt &&
    communicationContractRequestVerificationResult.communicationContractRequest
      .expiresAt <
      Date.now() / 1000
  ) {
    throw new Error(`Communication contract invalid: Contract has expired.`);
  }

  const recipientDidResolutionResult = await resolveDidDocument(
    communicationContractRequestVerificationResult.communicationContractRequest
      .recipientDid
  );
  const recipientDidDocument =
    recipientDidResolutionResult.didDocument as DidDocument;

  const recipientPublicSigningKey = getKey(
    recipientDidDocument,
    communicationContractRequestVerificationResult.communicationContractRequest
      .recipientPublicSigningKeyId
  );

  if (!recipientPublicSigningKey) {
    throw new Error(
      `Communication contract invalid: Recipient public key not found.`
    );
  }

  const signaturePayload = await verifySignature(
    signedCommunicationContract,
    recipientPublicSigningKey.publicKeyJwk,
    type
  );

  if (signaturePayload.protectedHeader.kid !== recipientPublicSigningKey.id) {
    throw new Error(
      `Communication contract invalid: Recipient public key id does not match signature key id.`
    );
  }

  return {
    requestorDidDocument:
      communicationContractRequestVerificationResult.requestorDidDocument,
    recipientDidDocument,
    communicationContract,
    recipientEncryptedCommunicationSecretKey:
      communicationContractRequestVerificationResult
        .communicationContractRequest.recipientEncryptedCommunicationSecretKey,
    requestorEncryptedCommunicationSecretKey:
      communicationContract.requestorEncryptedCommunicationSecretKey,
  };
}
