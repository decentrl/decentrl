import * as jose from '@decentrl/jose';
import { ConfigService } from '@microservice-stack/nest-config';
import {
  DidData,
  DidDocument,
  DidDocumentBuilder,
  DidDocumentVerificationMethodType,
  DidKey,
  MediatorCommunicationChannel,
  MediatorCommunicationContractService,
  MediatorCommunicationService,
  MediatorServiceType,
} from '@decentrl/utils/common';
import { Injectable } from '@nestjs/common';
import { ConfigVariables } from '../../constants';

@Injectable()
export class IdentityWalletService {
  constructor(private configService: ConfigService) {}

  getDidDocument(): DidDocument {
    const domain: string = this.configService.get(ConfigVariables.DOMAIN);

    const keyAgreementX25519Jwk = this.configService.get<jose.JWK>(
      ConfigVariables.KEY_AGREEMENT_X25519_PUBLIC_JWK
    );

    const verificationEd25519Jwk = this.configService.get<jose.JWK>(
      ConfigVariables.VERIFICATION_ED25519_PUBLIC_JWK
    );

    const did = `did:web:${domain}`;
    const keyAgreementX25519JwkId = `${did}#x25519`;
    const verificationEd25519JwkId = `${did}#ed25519`;

    const MediatorCommunicationContractService: MediatorCommunicationContractService =
      {
        id: `${did}#mediatorCommunicationContract`,
        type: `DecentrlMediator${MediatorServiceType.COMMUNICATION_CONTRACT}`,
        serviceEndpoint: {
          uri: `ws://${domain}/`,
          routingKeys: [keyAgreementX25519JwkId],
        },
      };

    const mediatorCommunicationService: MediatorCommunicationService = {
      id: `${did}#mediatorCommunication`,
      type: `DecentrlMediator${MediatorServiceType.COMMUNICATION}`,
      serviceEndpoint: {
        uri: `ws://${domain}/`,
        routingKeys: [keyAgreementX25519JwkId],
        communicationChannels: [
          MediatorCommunicationChannel.ONE_WAY_PUBLIC,
          MediatorCommunicationChannel.TWO_WAY_PRIVATE,
          MediatorCommunicationChannel.GROUP_PRIVATE,
        ],
      },
    };

    return new DidDocumentBuilder()
      .setId(did)
      .addKeyAgreement({
        id: keyAgreementX25519JwkId,
        type: DidDocumentVerificationMethodType.JsonWebKey2020,
        publicKeyJwk: keyAgreementX25519Jwk,
        controller: did,
      })
      .addVerificationMethod({
        id: verificationEd25519JwkId,
        type: DidDocumentVerificationMethodType.JsonWebKey2020,
        publicKeyJwk: verificationEd25519Jwk,
        controller: did,
      })
      .addServiceEndpoint(MediatorCommunicationContractService)
      .addServiceEndpoint(mediatorCommunicationService)
      .build();
  }

  getEncryptionKeyPair(): {
    private: DidKey;
    public: DidKey;
  } {
    return {
      private: this.configService.get<DidKey>(
        ConfigVariables.KEY_AGREEMENT_X25519_PRIVATE_JWK
      ),
      public: this.configService.get<DidKey>(
        ConfigVariables.KEY_AGREEMENT_X25519_PUBLIC_JWK
      ),
    };
  }

  getSigningKeyPair(): {
    private: DidKey;
    public: DidKey;
  } {
    return {
      private: this.configService.get<DidKey>(
        ConfigVariables.VERIFICATION_ED25519_PRIVATE_JWK
      ),
      public: this.configService.get<DidKey>(
        ConfigVariables.VERIFICATION_ED25519_PUBLIC_JWK
      ),
    };
  }

  getDidData(): DidData {
    const didDocument = this.getDidDocument();
    const encryptionKeyPair = this.getEncryptionKeyPair();
    const signingKeyPair = this.getSigningKeyPair();

    return {
      did: didDocument.id,
      keys: {
        encryptionKeyPair,
        signingKeyPair,
      },
    };
  }
}
