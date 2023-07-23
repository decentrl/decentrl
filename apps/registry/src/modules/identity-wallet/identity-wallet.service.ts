import * as jose from 'jose';
import { ConfigService } from '@microservice-stack/nest-config';
import {
  DidDocument,
  DidDocumentBuilder,
  DidDocumentVerificationMethodType,
  RegistryService,
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

    const registryService: RegistryService = {
      id: `${did}#registry`,
      type: 'DecentrlRegistry',
      serviceEndpoint: {
        uri: `https://${domain}/`,
        routingKeys: [keyAgreementX25519JwkId],
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
      .addServiceEndpoint(registryService)
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
