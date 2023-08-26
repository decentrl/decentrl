/* eslint-disable @nx/enforce-module-boundaries */
import * as nodeUtils from '@decentrl/utils/node';
import {
  Cryptography,
  DidDocumentBuilder,
  MediatorCommandType,
  MediatorCommunicationChannel,
  MediatorEventType,
  MediatorQueryCommandPayload,
  MediatorRequestCommunicationContractCommandPayload,
  MediatorSignCommunicationContractCommandPayload,
  MediatorTwoWayPrivateCommandPayload,
  decryptTwoWayPrivateMessage,
  encryptTwoWayPrivateMessage,
  generateCommunicationContractSignatureRequest,
  generateMediatorCommand,
  signCommunicationContract,
  verifyCommunicationContract,
  verifyCommunicationContractSignatureRequest,
} from '@decentrl/utils/common';

import { AppModule as MediatorAppModule } from '../../apps/mediator/src/app.module';
import { IdentityWalletService as MediatorIdentityWalletService } from '../../apps/mediator/src/modules/identity-wallet/identity-wallet.service';

import { AppModule as RegistryAppModule } from '../../apps/registry/src/app.module';
import { IdentityWalletService as RegistryIdentityWalletService } from '../../apps/registry/src/modules/identity-wallet/identity-wallet.service';

import { INestApplication } from '@nestjs/common';
import { WebSocket } from 'ws';
import { DidData, DidDocument } from '@decentrl/utils/common';
import { createNestApplication, createWebsocketClient } from './utils/helpers';
import { createAndRegisterIdentity } from './utils/createIdentity';

import fs from 'fs';
import {
  listenToMediatorEvent,
  registerIdentityOnMediator,
} from './utils/mediator';

const registryUrl = `localhost:${process.env.REGISTRY_PORT}`;
const mediatorUrl = `localhost:${process.env.MEDIATOR_PORT}`;

describe('Register on mediator', () => {
  let identityOne: [DidData, DidDocument];
  let identityTwo: [DidData, DidDocument];

  let mediatorDidDocument: DidDocument;
  let registryDidDocument: DidDocument;

  let mediatorApplication: INestApplication;
  let registryApplication: INestApplication;

  let websocketClient: WebSocket;

  let mediatorIdentityWalletService: MediatorIdentityWalletService;

  let registryIdentityWalletService: RegistryIdentityWalletService;

  beforeAll(async () => {
    mediatorApplication = await createNestApplication(
      MediatorAppModule,
      process.env.MEDIATOR_PORT as any
    );
    registryApplication = await createNestApplication(
      RegistryAppModule,
      process.env.REGISTRY_PORT as any,
      {
        key: fs.readFileSync('e2e/src/secrets/registry/key.pem'),
        cert: fs.readFileSync('e2e/src/secrets/registry/cert.pem'),
      }
    );

    websocketClient = await createWebsocketClient(mediatorUrl);

    mediatorIdentityWalletService = mediatorApplication.get(
      MediatorIdentityWalletService
    );
    registryIdentityWalletService = registryApplication.get(
      RegistryIdentityWalletService
    );

    mediatorDidDocument = new DidDocumentBuilder()
      .load(mediatorIdentityWalletService.getDidDocument())
      .build();

    registryDidDocument = new DidDocumentBuilder()
      .load(registryIdentityWalletService.getDidDocument())
      .build();

    identityOne = await createAndRegisterIdentity(
      registryUrl,
      'identity-one-alias',
      registryDidDocument
    );

    await registerIdentityOnMediator(
      identityOne[0],
      websocketClient,
      mediatorDidDocument
    );

    identityTwo = await createAndRegisterIdentity(
      registryUrl,
      'identity-two-lias',
      registryDidDocument
    );

    await registerIdentityOnMediator(
      identityTwo[0],
      websocketClient,
      mediatorDidDocument
    );
  });

  let signedCommunicationContractRequest: string;

  it('identity one should prepare and send communication contract request to identity two', async () => {
    const secretContractKey = nodeUtils.randomBytesHex();

    signedCommunicationContractRequest =
      await generateCommunicationContractSignatureRequest(
        identityOne[0],
        identityTwo[0].did,
        secretContractKey,
        Cryptography.NODE
      );

    const requestCommunicationContractCommandPayload =
      await generateMediatorCommand<MediatorRequestCommunicationContractCommandPayload>(
        {
          name: MediatorCommandType.REQUEST_COMMUNICATION_CONTRACT,
          recipient: identityTwo[0].did,
          payload: {
            contract: signedCommunicationContractRequest,
          },
        },
        identityOne[0],
        mediatorDidDocument,
        Cryptography.NODE
      );

    websocketClient.send(
      JSON.stringify({
        type: 'COMMAND',
        data: requestCommunicationContractCommandPayload,
      })
    );

    const mediatorResponse = await listenToMediatorEvent(
      identityOne[0],
      websocketClient
    );

    expect(mediatorResponse).toStrictEqual({
      name: MediatorEventType.COMMUNICATION_CONTRACT_REQUESTED,
    });
  });

  it('identity two should query mediator for communication contract request', async () => {
    const queryCommunicationContractRequestCommandPayload =
      await generateMediatorCommand<MediatorQueryCommandPayload>(
        {
          name: MediatorCommandType.QUERY,
          payload: {
            command: MediatorCommandType.REQUEST_COMMUNICATION_CONTRACT,
          },
        },
        identityTwo[0],
        mediatorDidDocument,
        Cryptography.NODE
      );

    websocketClient.send(
      JSON.stringify({
        type: 'COMMAND',
        data: queryCommunicationContractRequestCommandPayload,
      })
    );

    const mediatorResponse: any = await listenToMediatorEvent(
      identityTwo[0],
      websocketClient
    );

    expect(mediatorResponse).toStrictEqual({
      name: MediatorEventType.QUERY_EXECUTED,
      payload: [
        {
          id: expect.any(String),
          name: MediatorCommandType.REQUEST_COMMUNICATION_CONTRACT,
          payload: {
            contract: signedCommunicationContractRequest,
          },
          sender: identityOne[0].did,
          recipient: identityTwo[0].did,
          metadata: null,
          createdAt: expect.any(String),
        },
      ],
    });

    await verifyCommunicationContractSignatureRequest(
      mediatorResponse.payload[0].payload.contract,
      Cryptography.NODE
    );
  });

  let signedCommunicationContract: string;

  it('identity two should sign the communication contract request and send it back to identity one', async () => {
    signedCommunicationContract = await signCommunicationContract(
      signedCommunicationContractRequest,
      identityTwo[0],
      Cryptography.NODE
    );

    const signCommunicationContractCommandPayload =
      await generateMediatorCommand<MediatorSignCommunicationContractCommandPayload>(
        {
          name: MediatorCommandType.SIGN_COMMUNICATION_CONTACT,
          recipient: identityOne[0].did,
          payload: {
            contract: signedCommunicationContract,
          },
        },
        identityTwo[0],
        mediatorDidDocument,
        Cryptography.NODE
      );

    websocketClient.send(
      JSON.stringify({
        type: 'COMMAND',
        data: signCommunicationContractCommandPayload,
      })
    );

    const mediatorResponse: any = await listenToMediatorEvent(
      identityTwo[0],
      websocketClient
    );

    expect(mediatorResponse).toStrictEqual({
      name: MediatorEventType.COMMUNICATION_CONTRACT_SIGNED,
    });
  });

  it('identity one should query mediator for signed communication contract', async () => {
    const queryCommunicationContractRequestCommandPayload =
      await generateMediatorCommand<MediatorQueryCommandPayload>(
        {
          name: MediatorCommandType.QUERY,
          payload: {
            command: MediatorCommandType.SIGN_COMMUNICATION_CONTACT,
          },
        },
        identityOne[0],
        mediatorDidDocument,
        Cryptography.NODE
      );

    websocketClient.send(
      JSON.stringify({
        type: 'COMMAND',
        data: queryCommunicationContractRequestCommandPayload,
      })
    );

    const mediatorResponse: any = await listenToMediatorEvent(
      identityOne[0],
      websocketClient
    );

    expect(mediatorResponse).toStrictEqual({
      name: MediatorEventType.QUERY_EXECUTED,
      payload: [
        {
          id: expect.any(String),
          name: MediatorCommandType.SIGN_COMMUNICATION_CONTACT,
          payload: {
            contract: signedCommunicationContract,
          },
          sender: identityTwo[0].did,
          recipient: identityOne[0].did,
          metadata: null,
          createdAt: expect.any(String),
        },
      ],
    });

    await verifyCommunicationContract(
      mediatorResponse.payload[0].payload.contract,
      Cryptography.NODE
    );
  });

  it('identity one should send a private message to the identity two', async () => {
    const encryptedMessage: string = await encryptTwoWayPrivateMessage(
      identityOne[0], // Did Data
      identityTwo[1], // Did Document
      {
        message: 'Hello from identity one',
      },
      Cryptography.NODE
    );

    const sendTwoWayPrivateMessageCommandPayload =
      await generateMediatorCommand<MediatorTwoWayPrivateCommandPayload>(
        {
          name: MediatorCommandType.MESSAGE,
          communicationChannel: MediatorCommunicationChannel.TWO_WAY_PRIVATE,
          recipient: identityTwo[0].did,
          payload: {
            message: encryptedMessage,
            signedCommunicationContract,
          },
        },
        identityOne[0],
        mediatorDidDocument,
        Cryptography.NODE
      );

    websocketClient.send(
      JSON.stringify({
        type: 'COMMAND',
        data: sendTwoWayPrivateMessageCommandPayload,
      })
    );

    const mediatorResponse: any = await listenToMediatorEvent(
      identityOne[0],
      websocketClient
    );
  });

  it('identity two should query mediator for private messages', async () => {
    const queryTwoWayMessageCommandPayload =
      await generateMediatorCommand<MediatorQueryCommandPayload>(
        {
          name: MediatorCommandType.QUERY,
          payload: {
            command: MediatorCommandType.MESSAGE,
          },
        },
        identityTwo[0],
        mediatorDidDocument,
        Cryptography.NODE
      );

    websocketClient.send(
      JSON.stringify({
        type: 'COMMAND',
        data: queryTwoWayMessageCommandPayload,
      })
    );

    const mediatorResponse: any = await listenToMediatorEvent(
      identityTwo[0],
      websocketClient
    );

    const message = await decryptTwoWayPrivateMessage(
      identityTwo[0],
      mediatorResponse.payload[0].payload.message,
      Cryptography.NODE
    );

    expect(message).toStrictEqual({
      message: 'Hello from identity one',
    });
  });

  afterAll(async () => {
    await mediatorApplication.close();
    await registryApplication.close();

    websocketClient.close();
  }, 1000);
});
