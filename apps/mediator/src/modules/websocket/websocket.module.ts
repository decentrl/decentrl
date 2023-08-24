import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { UtilsModule } from '../utils/utils.module';
import { IdentityModule } from '../identity/identity.module';
import { RegisterModule } from '../register/register.module';
import { IdentityWalletModule } from '../identity-wallet/identity-wallet.module';
import { CommunicationContractModule } from '../communication-contract/communication-contract.module';
import { EventLogModule } from '../event-log/event-log.module';
import { OneWayPublicModule } from '../one-way-public/one-way-public.module';
import { TwoWayPrivateModule } from '../two-way-private/two-way-private.module';

@Module({
  imports: [
    UtilsModule,
    IdentityModule,
    IdentityWalletModule,
    RegisterModule,
    CommunicationContractModule,
    EventLogModule,
    OneWayPublicModule,
    TwoWayPrivateModule
  ],
  providers: [WebsocketGateway, WebsocketService],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
