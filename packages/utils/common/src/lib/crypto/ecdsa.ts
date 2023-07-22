import * as jose from 'jose';

export async function signPayload(
  privateKey: jose.JWK,
  payload: string | Uint8Array
): Promise<string> {
  if (privateKey.crv !== 'P-256') {
    throw new Error('Invalid key type');
  }

  const privateSigningKey = await jose.importJWK(privateKey, 'ES256');

  const dataBytes: Uint8Array =
    typeof payload === 'string' ? new TextEncoder().encode(payload) : payload;

  const signature = await new jose.CompactSign(dataBytes)
    .setProtectedHeader({ alg: 'ES256' })
    .sign(privateSigningKey);

  return signature;
}

export async function signJwt(
  privateKey: jose.JWK,
  payload: jose.JWTPayload
): Promise<string> {
  if (privateKey.crv !== 'P-256') {
    throw new Error('Invalid key type');
  }

  const privateSigningKey = await jose.importJWK(privateKey, 'ES256');

  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'ES256' })
    .sign(privateSigningKey);
}

export async function verifyJwt(
  publicKey: jose.JWK,
  jwt: string
): Promise<jose.JWTVerifyResult> {
  if (publicKey.crv !== 'P-256') {
    throw new Error('Invalid key type');
  }

  const publicSigningKey = await jose.importJWK(publicKey, 'ES256');

  return jose.jwtVerify(jwt, publicSigningKey);
}

export async function verifySignature(
  publicKey: jose.JWK,
  jws: string
): Promise<jose.CompactVerifyResult> {
  if (publicKey.crv !== 'P-256') {
    throw new Error('Invalid key type');
  }

  const publicSigningKey = await jose.importJWK(publicKey, 'ES256');

  return jose.compactVerify(jws, publicSigningKey);
}

export type SignerFunction = (data: string | Uint8Array) => Promise<string>;

export function buildSignerFunction(privateKey: jose.JWK): SignerFunction {
  if (privateKey.crv !== 'P-256') {
    throw new Error('Invalid key type');
  }

  return async (data: string | Uint8Array): Promise<string> => {
    const dataBytes: Uint8Array =
      typeof data === 'string' ? new TextEncoder().encode(data) : data;

    const privateSigningKey = await jose.importJWK(privateKey, 'ES256');

    const signature = await new jose.CompactSign(dataBytes)
      .setProtectedHeader({ alg: 'ES256' })
      .sign(privateSigningKey);

    return signature;
  };
}
