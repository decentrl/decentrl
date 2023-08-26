import { DidKeyPair, KeyPairGenerator } from '@decentrl/utils/common';
import { ed25519 } from '@noble/curves/ed25519';
import { base64url } from '@decentrl/jose';
import { v4 } from 'uuid';

export const generateEd25519KeyPair: KeyPairGenerator =
  async (): Promise<DidKeyPair> => {
    const privateKey = ed25519.utils.randomPrivateKey();
    const publicKey = ed25519.getPublicKey(privateKey);

    return {
      private: {
        kty: 'OKP',
        crv: 'Ed25519',
        x: base64url.encode(publicKey),
        d: base64url.encode(privateKey),
        kid: v4(),
      },
      public: {
        kty: 'OKP',
        crv: 'Ed25519',
        x: base64url.encode(publicKey),
        kid: v4(),
      },
    };
  };
