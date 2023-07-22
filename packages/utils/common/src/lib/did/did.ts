import { v4 } from 'uuid';
import { DidData, KeyPairGenerator } from './did.interfaces';

export async function generateDid(
  domain: string,
  encryptionKeyPairGenerator: KeyPairGenerator,
  signingKeyPairGenerator: KeyPairGenerator
): Promise<DidData> {
  const encryptionKeyPair = await encryptionKeyPairGenerator();
  const signingKeyPair = await signingKeyPairGenerator();

  return {
    did: `did:web:${domain}:identity:${v4()}`,
    keys: {
      signingKeyPair: {
        private: signingKeyPair.private,
        public: signingKeyPair.public,
      },
      encryptionKeyPair: {
        private: encryptionKeyPair.private,
        public: encryptionKeyPair.public,
      },
    },
  };
}
