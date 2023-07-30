import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { UtilsModule } from '../utils/utils.module';
import { IdentityModule } from '../identity/identity.module';
import { RegisterModule } from '../register/register.module';
import { IdentityWalletModule } from '../identity-wallet/identity-wallet.module';

@Module({
  imports: [UtilsModule, IdentityModule, IdentityWalletModule, RegisterModule],
  providers: [WebsocketGateway, WebsocketService],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
