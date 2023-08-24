import { Module } from '@nestjs/common';
import { WebsocketModule } from './modules/websocket';
import { IdentityWalletModule } from './modules/identity-wallet/identity-wallet.module';
import { ConfigModule } from '@microservice-stack/nest-config';
import { ConfigVariables } from './constants';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    WebsocketModule,
    IdentityWalletModule,
    CacheModule.register({ isGlobal: true }),
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.DATABASE_URL,
        ConfigVariables.DOMAIN,
        ConfigVariables.KEY_AGREEMENT_ECDH_PUBLIC_JWK,
        ConfigVariables.KEY_AGREEMENT_ECDH_PRIVATE_JWK,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
