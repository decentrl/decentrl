/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as jose from '@decentrl/jose';
import { ed25519 } from '@noble/curves/ed25519';
import { Cryptography } from './crypto.interfaces';

export async function readSignaturePayload<T extends Record<string, any>>(
  signature: string
): Promise<T> {
  const payload = signature.split('.')[1];

  return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8')) as T;
}

export async function readSignatureHeaders<T extends Record<string, any>>(
  signature: string
): Promise<T> {
  const payload = signature.split('.')[0];

  return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8')) as T;
}

export async function signPayload(
  payload: string | Uint8Array,
  privateKeyJwk: jose.JWK,
  publicKeyId: string,
  type: Cryptography
): Promise<string> {
  if (privateKeyJwk.crv !== 'Ed25519') {
    throw new Error('Invalid key type');
  }

  const dataBytes: Uint8Array =
    typeof payload === 'string' ? new TextEncoder().encode(payload) : payload;

  const signer = new jose.CompactSign(dataBytes).setProtectedHeader({
    alg: 'EdDSA',
    kid: publicKeyId,
  });

  if (type === Cryptography.NODE) {
    const privateSigningKey = await jose.importJWK(privateKeyJwk, 'EdDSA');

    return signer.sign(privateSigningKey);
  }

  const privateKey: Uint8Array = jose.base64url.decode(privateKeyJwk.d!);

  return signer
    .setSignFunction(async (_alg: string, key, data: Uint8Array) => {
      return ed25519.sign(data, key as Uint8Array);
    })
    .sign(privateKey);
}

export async function verifySignature(
  signature: string | Uint8Array,
  publicKeyJwk: jose.JWK,
  type: Cryptography
): Promise<jose.CompactVerifyResult> {
  if (publicKeyJwk.crv !== 'Ed25519') {
    throw new Error('Invalid key type');
  }

  if (type === Cryptography.NODE) {
    const publicSigningKey = await jose.importJWK(publicKeyJwk, 'EdDSA');

    return jose.compactVerify(signature, publicSigningKey);
  }

  return jose.compactVerify(signature, jose.base64url.decode(publicKeyJwk.x!), {
    verifyFunction: async (
      _alg: string,
      key,
      data: Uint8Array,
      signature: Uint8Array
    ) => {
      return ed25519.verify(signature, data, key as Uint8Array);
    },
  });
}
