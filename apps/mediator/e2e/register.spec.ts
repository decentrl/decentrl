import { Test } from '@nestjs/testing';
import * as nodeUtils from '@decentrl/utils/node';
import {
  DidDocumentBuilder,
  DidDocumentVerificationMethod,
  MediatorCommandType,
  MediatorCommunicationChannel,
  MediatorEvent,
  MediatorEventType,
  MediatorRegisterCommandPayload,
  MediatorRegisteredEventPayload,
  generateDidDocument,
  generateMediatorCommand,
  readMediatorEventPayload,
  resolveDidDocument,
} from '@decentrl/utils/common';

import { AppModule } from '../src/app.module';
import { WebSocketAdapter } from '../src/modules/websocket/websocket.adapter';
import { INestApplication } from '@nestjs/common';
import { WebSocket } from 'ws';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { StringDecoder } from 'string_decoder';
import { DidData, DidDocument, generateDid } from '@decentrl/utils/common';
import { when } from 'jest-when';
import { IdentityWalletService } from '../src/modules/identity-wallet/identity-wallet.service';
import { IdentityService } from '../src/modules/identity/identity.service';

const spy = { resolveDidDocument };

const createNestApplication = async (): Promise<INestApplication> => {
  const test = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = test.createNestApplication(new FastifyAdapter());

  app.useWebSocketAdapter(new WebSocketAdapter(app));
  await app.listen(3000);

  return app;
};

const createWebsocketClient = async (): Promise<WebSocket> => {
  const client = new WebSocket('ws://127.0.0.1:3000');

  console.log('client created');

  client.on('error', (error) => console.log(error));
  client.on('message', (raw) => {
    const message = new StringDecoder('utf8').write(raw as any);

    console.log('Message received', message);

    if (message === 'ping') {
      client.send('pong');
    }
  });

  await new Promise((resolve) => client.on('open', resolve));

  console.log('client connected');

  return client;
};

const domain = 'registry.decentrl.network';
const mediatorDomain = 'mediator.decentrl.network';

describe('Register on mediator', () => {
  let identityDidData: DidData;
  let identityDidDocument: DidDocument;

  let mediatorDidDocument: DidDocument;

  let app: INestApplication;
  let client: WebSocket;

  let identityWalletService: IdentityWalletService;
  let identityService: IdentityService;

  beforeAll(async () => {
    app = await createNestApplication();
    client = await createWebsocketClient();

    identityWalletService = app.get(IdentityWalletService);
    identityService = app.get(IdentityService);

    mediatorDidDocument = new DidDocumentBuilder()
      .load(identityWalletService.getDidDocument())
      .build();

    identityDidData = await generateDid(
      domain,
      nodeUtils.generateP256ECDHKeyPair,
      nodeUtils.generateP256KeyPair
    );

    identityDidDocument = generateDidDocument(identityDidData);

    const webDidResolverSpy = jest.spyOn(identityService, 'resolver');
    const webDidResolver2Spy = jest.spyOn(spy, 'resolveDidDocument');

    when(webDidResolverSpy)
      .calledWith(
        `${identityDidData.did}#${identityDidData.keys.encryptionKeyPair.public.kid}`
      )
      .mockResolvedValue({
        didDocument: identityDidDocument,
      } as any);

    when(webDidResolverSpy)
      .calledWith(
        (mediatorDidDocument.keyAgreement[0] as DidDocumentVerificationMethod)
          .id
      )
      .mockResolvedValue({
        didDocument: identityDidDocument,
      } as any);

    when(webDidResolver2Spy)
      .calledWith(
        (mediatorDidDocument.keyAgreement[0] as DidDocumentVerificationMethod)
          .id
      )
      .mockImplementation(async () => {
        return {
          didDocument: identityDidDocument,
        } as any;
      });
  });

  it('should connect to the websocket server register', async () => {
    const registerCommandPayload =
      await generateMediatorCommand<MediatorRegisterCommandPayload>(
        {
          name: MediatorCommandType.REGISTER,
          payload: {
            communicationChannels: [
              MediatorCommunicationChannel.ONE_WAY_PUBLIC,
            ],
          },
        },
        identityDidData,
        mediatorDidDocument
      );

    client.send(
      JSON.stringify({
        type: 'COMMAND',
        data: registerCommandPayload,
      })
    );

    const mediatorEventResponse: MediatorEvent = await new Promise((resolve) =>
      client.on('message', (raw) => {
        const message = new StringDecoder('utf8').write(raw as any);

        resolve(JSON.parse(message));
      })
    );

    const eventPayload: MediatorRegisteredEventPayload =
      await readMediatorEventPayload(
        mediatorEventResponse,
        identityDidData,
        () =>
          ({
            didDocument: mediatorDidDocument,
          } as any)
      );

    expect(eventPayload).toStrictEqual({
      name: MediatorEventType.REGISTERED,
      payload: {
        communicationChannels: [MediatorCommunicationChannel.ONE_WAY_PUBLIC],
      },
    });
  }, 60_000);
});
