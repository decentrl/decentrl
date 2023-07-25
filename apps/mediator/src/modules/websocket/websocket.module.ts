import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
// import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [
    // UtilsModule,
  ],
  providers: [WebsocketGateway, WebsocketService],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
