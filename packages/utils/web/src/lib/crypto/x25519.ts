import { DidKeyPair, KeyPairGenerator } from '@decentrl/utils-common';
import { x25519 } from '@noble/curves/ed25519';
import { base64url } from '@decentrl/jose';
import { v4 } from 'uuid';

export const generateX25519KeyPair: KeyPairGenerator =
  async (): Promise<DidKeyPair> => {
    const privateKey = x25519.utils.randomPrivateKey();
    const publicKey = x25519.getPublicKey(privateKey);

    return {
      private: {
        kty: 'OKP',
        crv: 'X25519',
        x: base64url.encode(publicKey),
        d: base64url.encode(privateKey),
        kid: v4(),
      },
      public: {
        kty: 'OKP',
        crv: 'X25519',
        x: base64url.encode(publicKey),
        kid: v4(),
      },
    };
  };
