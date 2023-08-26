/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing';
import { WebSocketAdapter } from '../../../apps/mediator/src/modules/websocket/websocket.adapter';
import { ConsoleLogger, INestApplication } from '@nestjs/common';
import { WebSocket } from 'ws';
import { StringDecoder } from 'string_decoder';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';

export const createNestApplication = async (
  appModule: any,
  port: number,
  httpsOptions?: HttpsOptions
): Promise<INestApplication> => {
  const test = await Test.createTestingModule({
    imports: [appModule],
  }).compile();

  const app = test.createNestApplication({
    httpsOptions,
  });

  app.useLogger(new ConsoleLogger());

  app.useWebSocketAdapter(new WebSocketAdapter(app));
  await app.listen(port);

  return app;
};

export const createWebsocketClient = async (
  clientUrl: string
): Promise<WebSocket> => {
  const client = new WebSocket(`ws://${clientUrl}`);


  client.on('error', (error) => console.log(error));
  client.on('message', (raw) => {
    const message = new StringDecoder('utf8').write(raw as any);

    if (message === 'ping') {
      client.send('pong');
    }
  });

  await new Promise((resolve) => client.on('open', resolve));

  return client;
};
