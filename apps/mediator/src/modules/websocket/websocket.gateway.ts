import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
// import {
//   MediatorEventPayload,
//   EncryptedMediatorCommandPayload,
// } from '@decentrl/ssi-utils';
import { OnModuleInit } from '@nestjs/common';
import { Server } from 'ws';
import { v4 } from 'uuid';
import { WebSocketExtended } from './websocket.interfaces';
import { WebsocketService } from './websocket.service';

@WebSocketGateway()
export class WebsocketGateway implements OnModuleInit {
  constructor(private websocketService: WebsocketService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket: WebSocketExtended) => {
      socket.id = v4();

      this.setPingInterval(socket);

      socket.on('message', (message) => {
        const msg = message.toString('utf-8');

        if (msg === 'pong') {
          clearTimeout(socket.pingTimeoutTimer);
          this.setPingInterval(socket);
        }
      });
    });
  }

  private setPingInterval(socket: WebSocketExtended) {
    socket.pingIntervalTimer = setTimeout(() => {
      socket.send('ping');

      socket.pingTimeoutTimer = setTimeout(() => {
        if (
          socket.readyState !== socket.CLOSING &&
          socket.readyState !== socket.CLOSED
        ) {
          socket.terminate();
        }
      }, 10_000);
    }, 15_000);
  }

  public getWebsocketServer(): Server {
    return this.server;
  }

  // @SubscribeMessage('COMMAND')
  // async commandHandler(
  //   @MessageBody() body: EncryptedMediatorCommandPayload,
  //   @ConnectedSocket() client: WebSocketExtended
  // ): Promise<MediatorEventPayload | void> {
  //   // return this.websocketService.commandHandler(body, client, this.server);
  // }
}
