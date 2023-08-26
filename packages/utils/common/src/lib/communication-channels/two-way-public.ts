import { Cryptography } from '../crypto/crypto.interfaces';
import { decryptAndVerifyPayload, encryptPayload } from '../crypto/ecdh';
import {
  DidDocument,
  DidDocumentVerificationMethodType,
} from '../did-document/did-document.interfaces';
import { getVerificationMethods } from '../did-document/did-document.utils';
import { DidData } from '../did/did.interfaces';

export async function encryptTwoWayPrivateMessage(
  senderDidData: DidData,
  recipientDidDocument: DidDocument,
  message: Record<string, any>,
  type: Cryptography
): Promise<string> {
  const verificationMethods = getVerificationMethods(
    recipientDidDocument,
    'keyAgreement',
    DidDocumentVerificationMethodType.JsonWebKey2020
  );

  if (verificationMethods.length === 0) {
    throw new Error(
      `Recipient ${recipientDidDocument.id} has no keyAgreement verification method`
    );
  }

  return encryptPayload(
    JSON.stringify(message),
    type,
    senderDidData.keys.encryptionKeyPair.private,
    verificationMethods[0].publicKeyJwk,
    `${senderDidData.did}#${senderDidData.keys.encryptionKeyPair.public.kid}`
  );
}

export async function decryptTwoWayPrivateMessage<
  T extends Record<string, any>
>(
  recipientDidData: DidData,
  encryptedMessage: string,
  type: Cryptography
): Promise<T> {
  const decryptedPayload = await decryptAndVerifyPayload(
    encryptedMessage,
    recipientDidData.keys.encryptionKeyPair.private,
    type
  );

  return JSON.parse(decryptedPayload.decryptedPayload) as T;
}
