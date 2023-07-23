import { ConfigModule } from '@microservice-stack/nest-config';
import { Module } from '@nestjs/common';
import { ConfigVariables } from './constants';
import { IdentityWalletModule } from './modules/identity-wallet/identity-wallet.module';
import { DidModule } from './modules/did/did.module';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.DATABASE_URL,
        ConfigVariables.DOMAIN,
        ConfigVariables.KEY_AGREEMENT_ECDH_PRIVATE_JWK,
        ConfigVariables.KEY_AGREEMENT_ECDH_PUBLIC_JWK,
      ],
      parse: (configVariable, value) => {
        if (
          configVariable === ConfigVariables.KEY_AGREEMENT_ECDH_PUBLIC_JWK ||
          configVariable === ConfigVariables.KEY_AGREEMENT_ECDH_PRIVATE_JWK
        ) {
          return JSON.parse(value);
        }

        return value;
      },
    }),
    IdentityWalletModule,
    DidModule,
  ],
})
export class AppModule {}
