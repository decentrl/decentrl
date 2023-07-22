import { JWK } from 'jose';

export interface DidKeyPair {
  private: JWK;
  public: JWK;
}

export interface DidData {
  did: string;
  keys: {
    signingKeyPair: DidKeyPair;
    encryptionKeyPair: DidKeyPair;
  };
}

export type KeyPairGenerator = () => Promise<DidKeyPair>;
