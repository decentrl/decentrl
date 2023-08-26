import * as jose from '@decentrl/jose';
import { ConfigService } from '@microservice-stack/nest-config';
import {
  DidDocument,
  DidDocumentBuilder,
  DidDocumentVerificationMethodType,
  MediatorCommunicationChannel,
  MediatorCommunicationContractService,
  MediatorCommunicationService,
  MediatorRegisterService,
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
      ConfigVariables.KEY_AGREEMENT_ECDH_PUBLIC_JWK
    );

    const did = `did:web:${domain}`;
    const keyAgreementX25519JwkId = `${did}#key-ECDH-1`;

    const mediatorRegisterService: MediatorRegisterService = {
      id: `${did}#mediatorRegister`,
      type: `DecentrlMediator${MediatorServiceType.REGISTER}`,
      serviceEndpoint: {
        uri: `ws://${domain}/`,
        routingKeys: [keyAgreementX25519JwkId],
      },
    };

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
      .addServiceEndpoint(mediatorRegisterService)
      .addServiceEndpoint(MediatorCommunicationContractService)
      .addServiceEndpoint(mediatorCommunicationService)
      .build();
  }

  getEncryptionKeyPair(): {
    private: jose.JWK;
    public: jose.JWK;
  } {
    return {
      private: this.configService.get<jose.JWK>(
        ConfigVariables.KEY_AGREEMENT_ECDH_PRIVATE_JWK
      ),
      public: this.configService.get<jose.JWK>(
        ConfigVariables.KEY_AGREEMENT_ECDH_PUBLIC_JWK
      ),
    };
  }
}
