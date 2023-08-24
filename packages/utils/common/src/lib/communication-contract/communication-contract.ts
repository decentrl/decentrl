import {
  readSignaturePayload,
  signPayload,
  verifySignature,
} from '../crypto/ecdsa';
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
  CommunicationContractVerificationResult,
} from './communication-contract.interfaces';
import { decryptPayload, encryptPayload } from '../crypto/ecdh';

export async function generateCommunicationContractSignatureRequest(
  requestorDidData: DidData,
  recipientDid: string,
  secretContractKey: string,
  expiresAt?: number
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
    requestorDidData.keys.encryptionKeyPair.private,
    keyAgreements[0].publicKeyJwk,
    keyAgreements[0].id
  );

  const communicationContract: CommunicationContractRequest = {
    requestorDid: requestorDidData.did,
    requestorPublicSigningKeyId,
    recipientDid,
    recipientPublicSigningKeyId,
    contractExpiresAt: expiresAt,
    recipientEncryptedCommunicationSecretKey,
  };

  const signedCommunicationContractRequest = await signPayload(
    requestorDidData.keys.signingKeyPair.private,
    requestorPublicSigningKeyId,
    JSON.stringify(communicationContract)
  );

  return signedCommunicationContractRequest;
}

export async function verifyCommunicationContractSignatureRequest(
  signedCommunicationContractRequest: string
): Promise<CommunicationContractRequestVerificationResult> {
  const communicationContractRequest =
    await readSignaturePayload<CommunicationContractRequest>(
      signedCommunicationContractRequest
    );

  if (
    communicationContractRequest.contractExpiresAt &&
    communicationContractRequest.contractExpiresAt < Date.now() / 1000
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
    requestorPublicSigningKey.publicKeyJwk,
    signedCommunicationContractRequest
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
  expiresAt?: number
) {
  const verificationResult = await verifyCommunicationContractSignatureRequest(
    signedCommunicationContractRequest
  );

  const secretContractKey: string = await decryptPayload(
    recipientDidData.keys.encryptionKeyPair.private,
    verificationResult.communicationContractRequest
      .recipientEncryptedCommunicationSecretKey
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
    secretContractKey,
    recipientDidData.keys.encryptionKeyPair.private,
    keyAgreements[0].publicKeyJwk,
    keyAgreements[0].id
  );

  const communicationContract: CommunicationContract = {
    requestorSignature: signedCommunicationContractRequest,
    contractExpiresAt: expiresAt,
    requestorEncryptedCommunicationSecretKey,
  };

  const recipientPublicSigningKeyId = `${recipientDidData.did}#${recipientDidData.keys.signingKeyPair.public.kid}`;

  const signedCommunicationContract = await signPayload(
    recipientDidData.keys.signingKeyPair.private,
    recipientPublicSigningKeyId,
    JSON.stringify(communicationContract)
  );

  return signedCommunicationContract;
}

export async function verifyCommunicationContract(
  signedCommunicationContract: string
): Promise<CommunicationContractVerificationResult> {
  const communicationContract =
    await readSignaturePayload<CommunicationContract>(
      signedCommunicationContract
    );

  if (
    communicationContract.contractExpiresAt &&
    communicationContract.contractExpiresAt < Date.now() / 1000
  ) {
    throw new Error(`Communication contract invalid: Contract has expired.`);
  }

  const communicationContractRequestVerificationResult =
    await verifyCommunicationContractSignatureRequest(
      communicationContract.requestorSignature
    );

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
    recipientPublicSigningKey.publicKeyJwk,
    signedCommunicationContract
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
