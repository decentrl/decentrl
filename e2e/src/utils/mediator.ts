import { WebSocket } from 'ws';
import { StringDecoder } from 'string_decoder';
import {
  DidData,
  DidDocument,
  MediatorCommandType,
  MediatorCommunicationChannel,
  MediatorEvent,
  MediatorEventType,
  MediatorRegisterCommandPayload,
  MediatorRegisteredEventPayload,
  decryptPayload,
  generateMediatorCommand,
  readMediatorEventPayload,
} from '@decentrl/utils/common';

export const registerIdentityOnMediator = async (
  identityDidData: DidData,
  client: WebSocket,
  mediatorDidDocument: DidDocument
): Promise<void> => {
  const registerCommandPayload =
    await generateMediatorCommand<MediatorRegisterCommandPayload>(
      {
        name: MediatorCommandType.REGISTER,
        payload: {
          communicationChannels: [MediatorCommunicationChannel.ONE_WAY_PUBLIC],
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

  const mediatorEventResponse: MediatorEvent = await new Promise((resolve) => {
    client.on('message', (raw) => {
      const message = new StringDecoder('utf8').write(raw as any);

      resolve(JSON.parse(message));
    });
  });

  const eventPayload: MediatorRegisteredEventPayload =
    await readMediatorEventPayload(
      mediatorEventResponse,
      identityDidData,
      () =>
        ({
          didDocument: mediatorDidDocument,
        } as any)
    );

  if (eventPayload.name !== MediatorEventType.REGISTERED) {
    throw new Error('Mediator did not register the identity');
  }
};

export const listenToMediatorEvent = async <T>(
  identityDidData: DidData,
  ws: WebSocket
): Promise<T> => {
  const payload: string = await new Promise((resolve) => {
    ws.on('message', (raw) => {
      const message = new StringDecoder('utf8').write(raw as any);

      const data = JSON.parse(message);

      if (data.type !== 'EVENT') {
        return;
      }

      resolve(data.payload);
    });
  });

  const decryptedResponse = await decryptPayload(
    identityDidData.keys.encryptionKeyPair.private,
    payload
  );

  return JSON.parse(decryptedResponse) as T;
};
