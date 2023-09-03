import { WebSocket } from 'ws';
import { StringDecoder } from 'string_decoder';
import {
  Cryptography,
  DidData,
  DidDocument,
  MediatorCommandType,
  MediatorCommunicationChannel,
  MediatorEvent,
  MediatorEventType,
  decryptPayload,
  generateMediatorCommand,
  readMediatorEventPayload,
  MediatorRequestCommunicationContractCommandPayload,
  generateCommunicationContractSignatureRequest,
  MediatorCommunicationContractSignedEventPayload,
} from '@decentrl/utils/common';
import { randomBytesHex } from '@decentrl/utils/node';

export const registerIdentityOnMediator = async (
  identityDidData: DidData,
  client: WebSocket,
  mediatorDidDocument: DidDocument
): Promise<void> => {
  const mediatorCommunicationContractRequest =
    await generateCommunicationContractSignatureRequest(
      identityDidData,
      mediatorDidDocument.id,
      randomBytesHex(32),
      Cryptography.NODE,
      undefined,
      {
        communicationChannels: [
          MediatorCommunicationChannel.ONE_WAY_PUBLIC,
          MediatorCommunicationChannel.TWO_WAY_PRIVATE,
        ],
      }
    );

  const registerCommandPayload =
    await generateMediatorCommand<MediatorRequestCommunicationContractCommandPayload>(
      {
        name: MediatorCommandType.REQUEST_COMMUNICATION_CONTRACT,
        recipient: mediatorDidDocument.id,
        payload: {
          contract: mediatorCommunicationContractRequest,
        },
      },
      identityDidData,
      mediatorDidDocument,
      Cryptography.NODE
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

  const eventPayload: MediatorCommunicationContractSignedEventPayload =
    await readMediatorEventPayload(
      mediatorEventResponse,
      identityDidData,
      Cryptography.NODE,
      () =>
        ({
          didDocument: mediatorDidDocument,
        } as any)
    );

  if (eventPayload.name !== MediatorEventType.COMMUNICATION_CONTRACT_SIGNED) {
    throw new Error('Mediator did not register the identity');
  }
};

export const listenToMediatorEvent = async <T>(
  identityDidData: DidData,
  ws: WebSocket
): Promise<T> => {
  const payload: string = await new Promise((resolve, reject) => {
    ws.on('message', (raw) => {
      const message = new StringDecoder('utf8').write(raw as any);

      const data = JSON.parse(message);

      if (data.type !== 'EVENT') {
        reject(new Error('ERROR'));
      }

      resolve(data.payload);
    });
  });

  const decryptedResponse = await decryptPayload(
    payload,
    identityDidData.keys.encryptionKeyPair.private,
    Cryptography.NODE
  );

  return JSON.parse(decryptedResponse.plaintext.toString()) as T;
};
