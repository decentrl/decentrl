/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DIDResolutionResult } from 'did-resolver';
import {
  DidDocumentVerificationMethodType,
  DidDocument,
} from '../did-document/did-document.interfaces';
import { getVerificationMethods } from '../did-document/did-document.utils';
import { webDidResolver } from '../resolvers/web';
import {
  DecryptAndVerifyPayloadResult,
  KeyResolutionResult,
} from './ecdh.interfaces';
import * as jose from 'jose';

export async function encryptPayload(
  payload: string,
  privateKeyJwk: jose.JWK,
  publicKeyJwk: jose.JWK,
  publicKeyId: string,
  typ?: string
): Promise<string> {
  const privateKey = await jose.importJWK(privateKeyJwk, 'ECDH-ES', false);

  const publicKey = await jose.importJWK(publicKeyJwk, 'ECDH-ES', false);

  return new jose.CompactEncrypt(new TextEncoder().encode(payload))
    .setProtectedHeader({
      alg: 'ECDH-ES',
      enc: 'A256GCM',
      kid: publicKeyId,
      typ,
    })
    .setKeyManagementParameters({
      epk: privateKey as jose.KeyLike,
    })
    .encrypt(publicKey as jose.KeyLike);
}

export async function decryptPayload(
  privateJwk: jose.JWK,
  payload: string,
): Promise<string> {
  const privateKey = await jose.importJWK(privateJwk, 'ECDH-ES');
  const decryptionResult = await jose.compactDecrypt(payload, privateKey, {});

  return decryptionResult.plaintext.toString();
}

export async function decryptAndVerifyPayload(
  payload: string,
  privateKeyJwk: jose.JWK
): Promise<DecryptAndVerifyPayloadResult> {
  const privateKey = await jose.importJWK(privateKeyJwk, 'ECDH-ES');
  const decryptionResult = await jose.compactDecrypt(payload, privateKey, {});

  if (!decryptionResult.protectedHeader.kid) {
    throw new Error('No kid in protected header');
  }

  if (!(decryptionResult.protectedHeader as any).epk) {
    throw new Error('No epk in protected header');
  }

  const keyResolutionResult: KeyResolutionResult = await resolveKey(
    decryptionResult.protectedHeader.kid
  );

  const verificationMethods = getVerificationMethods(
    keyResolutionResult.didDocument,
    'keyAgreement',
    DidDocumentVerificationMethodType.JsonWebKey2020
  );

  const matchingPublicKey = verificationMethods.find(
    (verificationMethod) =>
      verificationMethod.publicKeyJwk.x ===
        ((decryptionResult.protectedHeader as any).epk as jose.JWK).x &&
      verificationMethod.publicKeyJwk.crv ===
        ((decryptionResult.protectedHeader as any).epk as jose.JWK).crv &&
      verificationMethod.publicKeyJwk.kty ===
        ((decryptionResult.protectedHeader as any).epk as jose.JWK).kty
  );

  if (!matchingPublicKey) {
    throw new Error('Non-matching public keys');
  }

  return {
    decryptedPayload: new TextDecoder().decode(decryptionResult.plaintext),
    senderDidDocument: keyResolutionResult.didDocument,
  };
}

export async function resolveKey(kid: string): Promise<KeyResolutionResult> {
  const didResolutionResult: DIDResolutionResult = await webDidResolver.resolve(
    kid
  );

  const keyAgreementVerificationMethods = getVerificationMethods(
    didResolutionResult.didDocument as unknown as DidDocument,
    'keyAgreement',
    DidDocumentVerificationMethodType.JsonWebKey2020
  );

  const verificationMethod = keyAgreementVerificationMethods.find(
    (key) => key.id === kid
  );

  if (verificationMethod === undefined) {
    throw new Error('Invalid kid');
  }

  return {
    verificationMethod,
    didDocument: didResolutionResult.didDocument as unknown as DidDocument,
  };
}
