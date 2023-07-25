import {
  readSignaturePayload,
  signPayload,
  verifySignature,
} from '../crypto/ecdsa';
import { resolveDidDocument } from '../did-document/did-document';
import { DidDocumentVerificationMethodType } from '../did-document/did-document.interfaces';
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

export async function generateCommunicationContractSignatureRequest(
  requestorDidData: DidData,
  recipientDid: string
): Promise<string> {
  const recipientDidDocument = await resolveDidDocument(recipientDid);

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

  const requestorPublicSigningKeyId = `${requestorDidData.did}#${requestorDidData.keys.signingKeyPair.public.kid}`;
  const recipientPublicSigningKeyId = verificationMethods[0].id;

  const communicationContract: CommunicationContractRequest = {
    requestorDid: requestorDidData.did,
    requestorPublicSigningKeyId,
    recipientDid,
    recipientPublicSigningKeyId,
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

  const requestorDidDocument = await resolveDidDocument(
    communicationContractRequest.requestorDid
  );

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
  recipientDidData: DidData
) {
  await verifyCommunicationContractSignatureRequest(
    signedCommunicationContractRequest
  );

  const communicationContract: CommunicationContract = {
    requestorSignature: signedCommunicationContractRequest,
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

  const communicationContractRequestVerificationResult =
    await verifyCommunicationContractSignatureRequest(
      communicationContract.requestorSignature
    );

  const recipientDidDocument = await resolveDidDocument(
    communicationContractRequestVerificationResult.communicationContractRequest
      .recipientDid
  );

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
  };
}
