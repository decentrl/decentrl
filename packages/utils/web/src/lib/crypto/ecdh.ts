import { v4 } from 'uuid';
import { DidKeyPair, KeyPairGenerator } from '@decentrl/utils-common';

export const generateP256ECDHKeyPair: KeyPairGenerator =
  async (): Promise<DidKeyPair> => {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256',
      },
      true,
      ['deriveKey']
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
