import { DidKeyPair, KeyPairGenerator } from '@decentrl/utils/common';
import { v4 } from 'uuid';

export const generateP256KeyPair: KeyPairGenerator =
  async (): Promise<DidKeyPair> => {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      true,
      ['sign', 'verify']
    );

    const privateKeyJwk = await window.crypto.subtle.exportKey(
      'jwk',
      keyPair.privateKey as CryptoKey
    );

    const publicKeyJwk = await window.crypto.subtle.exportKey(
      'jwk',
      keyPair.publicKey as CryptoKey
    );

    delete privateKeyJwk.key_ops;
    delete publicKeyJwk.key_ops;

    return {
      private: {
        ...privateKeyJwk,
        kid: v4(),
      },
      public: {
        ...publicKeyJwk,
        kid: v4(),
      },
    };
  };
