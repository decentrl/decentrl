import { KeyPairGenerator } from '../did/did.interfaces';

import * as jose from '@decentrl/jose';
import { GroupDidData, GroupDidKeyPairType } from './did-group.interfaces';

export async function generateGroupDid(
  encryptionKeyPairGenerator: KeyPairGenerator,
  signingKeyPairGenerator: KeyPairGenerator
): Promise<GroupDidData> {
  const documentControlEncryptionKeyPair = await encryptionKeyPairGenerator();
  const documentControlSigningKeyPair = await signingKeyPairGenerator();

  const messagingEncryptionKeyPair = await encryptionKeyPairGenerator();
  const messagingSigningKeyPair = await signingKeyPairGenerator();

  const communicationContractControlEncryptionKeyPair =
    await encryptionKeyPairGenerator();
  const communicationContractControlSigningKeyPair =
    await signingKeyPairGenerator();

  const documentControlEncryptionKeyPairThumbprint =
    await jose.calculateJwkThumbprintUri(
      documentControlEncryptionKeyPair.public,
      'sha256'
    );

  const documentControlSigningKeyPairThumbprint =
    await jose.calculateJwkThumbprintUri(
      documentControlSigningKeyPair.public,
      'sha256'
    );

  return {
    did: `did:group:${documentControlEncryptionKeyPairThumbprint}-${documentControlSigningKeyPairThumbprint}`,
    keys: {
      [GroupDidKeyPairType.DOCUMENT_CONTROL_ENCRYPTION_KEY_PAIR]: {
        private: documentControlEncryptionKeyPair.private,
        public: documentControlEncryptionKeyPair.public,
      },
      [GroupDidKeyPairType.DOCUMENT_CONTROL_SIGNING_KEY_PAIR]: {
        private: documentControlSigningKeyPair.private,
        public: documentControlSigningKeyPair.public,
      },
      [GroupDidKeyPairType.COMMUNICATION_CONTRACT_ENCRYPTION_KEY_PAIR]: {
        private: communicationContractControlEncryptionKeyPair.private,
        public: communicationContractControlEncryptionKeyPair.public,
      },
      [GroupDidKeyPairType.COMMUNICATION_CONTRACT_SIGNING_KEY_PAIR]: {
        private: communicationContractControlSigningKeyPair.private,
        public: communicationContractControlSigningKeyPair.public,
      },
      [GroupDidKeyPairType.MESSAGING_ENCRYPTION_KEY_PAIR]: {
        private: messagingEncryptionKeyPair.private,
        public: messagingEncryptionKeyPair.public,
      },
      [GroupDidKeyPairType.MESSAGING_SIGNING_KEY_PAIR]: {
        private: messagingSigningKeyPair.private,
        public: messagingSigningKeyPair.public,
      },
    },
  };
}

export function deriveGroupDid(groupDidData: GroupDidData, type: GroupDidKeyPairType[]): string {
  const keyPair = groupDidData.keys[type];
  if (!keyPair) {
    throw new Error(`Key pair of type ${type} not found`);
  }
  const keyPairThumbprint = jose.calculateJwkThumbprintUri(keyPair.public, 'sha256');
  return `did:group:${keyPairThumbprint}`;
}
