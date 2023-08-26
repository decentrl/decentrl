/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import * as jose from '@decentrl/jose';
import { x25519 } from '@noble/curves/ed25519';
import { Cryptography } from './crypto.interfaces';
import { concat, lengthAndInput, encoder, uint32be, concatKdf } from './crypto';

export type DidResolver = (did: string) => Promise<DIDResolutionResult>;

export async function encryptPayload(
  payload: string,
  type: Cryptography,
  privateKeyJwk: jose.JWK,
  publicKeyJwk: jose.JWK,
  publicKeyId: string,
  typ?: string
): Promise<string> {
  const encryptor = new jose.CompactEncrypt(
    new TextEncoder().encode(payload)
  ).setProtectedHeader({
    alg: 'ECDH-ES',
    enc: 'A256GCM',
    kid: publicKeyId,
    typ,
  });

  if (type === Cryptography.NODE) {
    if (privateKeyJwk.crv !== 'X25519' || publicKeyJwk.crv !== 'X25519') {
      throw new Error('Invalid key type');
    }

    const privateKey = await jose.importJWK(privateKeyJwk, 'ECDH-ES', false);
    const publicKey = await jose.importJWK(publicKeyJwk, 'ECDH-ES', false);

    return encryptor
      .setKeyManagementParameters({
        epk: privateKey as jose.KeyLike,
      })
      .encrypt(publicKey as jose.KeyLike);
  } else {
    const privateKey: Uint8Array = jose.base64url.decode(privateKeyJwk.d!);
    const publicKey: Uint8Array = jose.base64url.decode(publicKeyJwk.x!);

    return encryptor
      .setEncryptKeyManagementFunction(async () => {
        const secret = await deriveKey(privateKey, publicKey, 'A256GCM');

        const parameters: jose.JWEHeaderParameters = {
          epk: {
            x: jose.base64url.encode(x25519.getPublicKey(privateKey)),
            kty: 'OKP',
            crv: 'X25519',
          },
        };

        return {
          cek: secret,
          parameters,
        };
      })
      .encrypt(publicKey);
  }
}

export async function decryptPayload(
  payload: string | Uint8Array,
  privateKeyJwk: jose.JWK,
  type: Cryptography
): Promise<jose.CompactDecryptResult> {
  if (type === Cryptography.NODE) {
    const privateKey = await jose.importJWK(privateKeyJwk, 'ECDH-ES');

    const decryptionResult = await jose.compactDecrypt(payload, privateKey, {});

    return decryptionResult;
  }

  const privateKey = jose.base64url.decode(privateKeyJwk.d!);

  const decryptionResult = await jose.compactDecrypt(
    payload,
    privateKey as Uint8Array,
    {
      decryptKeyManagementFunction: async (alg, key, encKey, epk) => {
        if (alg !== 'ECDH-ES') {
          throw new Error('Invalid algorithm');
        }

        const publicKey = jose.base64url.decode((epk['epk'] as jose.JWK).x!);

        const secret = await deriveKey(privateKey, publicKey, 'A256GCM');

        return secret;
      },
    }
  );

  return decryptionResult;
}

async function deriveKey(
  privateKey: Uint8Array,
  publicKey: Uint8Array,
  algorithm: string
): Promise<Uint8Array> {
  const value = concat(
    lengthAndInput(encoder.encode(algorithm)),
    lengthAndInput(new Uint8Array(0)),
    lengthAndInput(new Uint8Array(0)),
    uint32be(256)
  );

  const secret = x25519.getSharedSecret(privateKey, publicKey);

  return concatKdf(secret, 256, value);
}

export async function decryptAndVerifyPayload(
  payload: string | Uint8Array,
  privateKeyJwk: jose.JWK,
  type: Cryptography,
  resolver?: DidResolver
): Promise<DecryptAndVerifyPayloadResult> {
  const decryptionResult = await decryptPayload(payload, privateKeyJwk, type);

  if (!decryptionResult.protectedHeader.kid) {
    throw new Error('No kid in protected header');
  }

  if (!(decryptionResult.protectedHeader as any).epk) {
    throw new Error('No epk in protected header');
  }

  const keyResolutionResult: KeyResolutionResult = await resolveKey(
    decryptionResult.protectedHeader.kid,
    resolver
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

export async function resolveKey(
  kid: string,
  resolver?: DidResolver
): Promise<KeyResolutionResult> {
  const didResolutionResult: DIDResolutionResult = await (resolver
    ? resolver(kid)
    : webDidResolver.resolve(kid));

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
