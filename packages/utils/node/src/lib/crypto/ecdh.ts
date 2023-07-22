import { DidKeyPair, KeyPairGenerator } from '@decentrl/utils/common';
import * as crypto from 'crypto';
import * as jose from 'jose';
import { promisify } from 'util';
import { v4 } from 'uuid';

export const generateP256ECDHKeyPair: KeyPairGenerator =
  async (): Promise<DidKeyPair> => {
    const keyPair = await promisify(crypto.generateKeyPair)('ec', {
      namedCurve: 'P-256',
    });

    const privateKeyJwk = await jose.exportJWK(keyPair.privateKey);
    const publicKeyJwk = await jose.exportJWK(keyPair.publicKey);

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
