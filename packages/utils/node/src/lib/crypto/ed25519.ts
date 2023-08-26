// eslint-disable-next-line @nx/enforce-module-boundaries
import { DidKeyPair, KeyPairGenerator } from '@decentrl/utils-common';
import * as crypto from 'crypto';
import * as jose from '@decentrl/jose';
import { promisify } from 'util';
import { v4 } from 'uuid';

export const generateEd25519KeyPair: KeyPairGenerator =
  async (): Promise<DidKeyPair> => {
    const keyPair = await promisify(crypto.generateKeyPair)('ed25519');

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
