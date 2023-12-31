import { JWK } from '@decentrl/jose';

export interface DidKeyPair {
  private: JWK & { kid: string };
  public: JWK & { kid: string };
}

export type DidKey = JWK & { kid: string }

export interface DidData {
  did: string;
  keys: {
    signingKeyPair: DidKeyPair;
    encryptionKeyPair: DidKeyPair;
  };
}

export type KeyPairGenerator = () => Promise<DidKeyPair>;
