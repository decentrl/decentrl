import { Cryptography } from '../crypto/crypto.interfaces';
import {
  DidResolver,
  decryptAndVerifyPayload,
  encryptPayload,
} from '../crypto/ecdh';
import {
  DidDocument,
  DidDocumentVerificationMethodType,
} from '../did-document/did-document.interfaces';
import { getVerificationMethods } from '../did-document/did-document.utils';
import { DidData } from '../did/did.interfaces';
import {
  MediatorCommand,
  MediatorCommandPayload,
  MediatorEvent,
  MediatorEventPayload,
  MediatorMessageType,
} from './mediator.interfaces';
import { v4 } from 'uuid';

export const generateMediatorCommand = async <
  T extends MediatorCommandPayload = MediatorCommandPayload
>(
  commandPayload: T,
  didData: DidData,
  mediatorDidDocument: DidDocument,
  type: Cryptography,
): Promise<MediatorCommand> => {
  const verificationMethods = getVerificationMethods(
    mediatorDidDocument,
    'keyAgreement',
    DidDocumentVerificationMethodType.JsonWebKey2020
  );

  if (verificationMethods.length === 0) {
    throw new Error(
      `Mediator ${mediatorDidDocument.id} has no keyAgreement verification method`
    );
  }

  const encryptedCommandPayload = await encryptPayload(
    JSON.stringify(commandPayload),
    type,
    didData.keys.encryptionKeyPair.private,
    verificationMethods[0].publicKeyJwk,
    `${didData.did}#${didData.keys.encryptionKeyPair.public.kid}`
  );

  const trackingId = v4();

  return {
    id: trackingId,
    type: MediatorMessageType.COMMAND,
    payload: encryptedCommandPayload,
  };
};

export const readMediatorEventPayload = async <T extends MediatorEventPayload>(
  payload: MediatorEvent,
  didData: DidData,
  type: Cryptography,
  resolver?: DidResolver
): Promise<T> => {
  const verificationResult = await decryptAndVerifyPayload(
    payload.payload,
    didData.keys.encryptionKeyPair.private,
    type,
    resolver
  );

  return JSON.parse(verificationResult.decryptedPayload) as T;
};
