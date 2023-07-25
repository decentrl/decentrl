import { Injectable } from '@nestjs/common';
import {
  AuthenticateWithChallengeCommandPayload,
  AuthenticateWithTokenCommandPayload,
  DidDocument,
  EncryptedMediatorCommandPayload,
  ForwardMessageCommandPayload,
  MediatorCommand,
  MediatorCommandPayload,
  MediatorErrorEventPayload,
  MediatorErrorEventType,
  MediatorEvent,
  MediatorEventPayload,
  MessageSearchCommandPayload,
} from '@decentrl/ssi-utils';
import { AuthenticationService } from '../authentication';
import { TwoWayPrivateService } from '../two-way-private/two-way-private.service';
import { UtilsService } from '../utils/utils.service';
import { WebSocketExtended } from './websocket.interfaces';
import { MediatorError } from '../errors/mediator.error';
import { Server } from 'ws';
import { OneWayPublicService } from '../one-way-public/one-way-public.service';

@Injectable()
export class WebsocketService {
  constructor(
    private authenticationService: AuthenticationService,
    private twoWayMessagingService: TwoWayPrivateService,
    private oneWayPublicService: OneWayPublicService,
    private utilService: UtilsService
  ) {}

  async commandHandler(
    body: EncryptedMediatorCommandPayload,
    client: WebSocketExtended,
    server: Server
  ): Promise<MediatorEventPayload | void> {
    try {
      const unwrappedMessage = await this.utilService.unwrapMessage(
        body.encryptedPayload
      );

      const parsedMessage: MediatorCommandPayload<any> = JSON.parse(
        unwrappedMessage.decryptedPayload
      );

      // non-protected commands
      switch (parsedMessage.type) {
        case MediatorCommand.AUTHENTICATE_WITH_CHALLENGE:
          return await this.authenticateWithChallenge(
            parsedMessage,
            client,
            unwrappedMessage.senderDidDocument.id
          );
        case MediatorCommand.AUTHENTICATE_WITH_TOKEN:
          return await this.authenticateWithToken(parsedMessage, client);
        case MediatorCommand.REQUEST_CHALLENGE:
          return await this.authenticationService.requestChallenge();
        case MediatorCommand.REQUEST_CONNECTION_INFO:
          return this.requestConnectionInfo(client);
          break;
      }

      // protected commands
      if (!client.did) {
        throw new MediatorError(
          MediatorErrorEventType.UNAUTHORISED,
          'Unauthorised'
        );
      }

      switch (parsedMessage.type) {
        case MediatorCommand.FORWARD:
          return await this.sendTwoWayMessage(
            parsedMessage,
            unwrappedMessage.senderDidDocument,
            client,
            server
          );
        case MediatorCommand.SEARCH_MESSAGES:
          return await this.searchTwoWayMessage(
            parsedMessage,
            unwrappedMessage.senderDidDocument
          );
        case MediatorCommand.PUBLIC_POST:
          return await this.oneWayPublicService.postMessage(
            parsedMessage,
            client.did
          );
        case MediatorCommand.SEARCH_PUBLIC_POSTS:
          return await this.oneWayPublicService.searchPublicPosts(
            parsedMessage
          );
      }
    } catch (error) {
      return this.handleMediatorError(error);
    }

    return {
      event: MediatorEvent.AUTHENTICATION_COMPLETED,
      data: {},
    };
  }

  private async authenticateWithChallenge(
    payload: MediatorCommandPayload<AuthenticateWithChallengeCommandPayload>,
    client: WebSocketExtended,
    senderDid: string
  ): Promise<MediatorEventPayload> {
    await this.authenticationService.verifyChallenge(payload.body.challenge);

    client.did = senderDid;

    return await this.authenticationService.generateAuthenticationToken(
      senderDid
    );
  }

  private async authenticateWithToken(
    payload: MediatorCommandPayload<AuthenticateWithTokenCommandPayload>,
    client: WebSocketExtended
  ): Promise<MediatorEventPayload> {
    const identityDid: string = await this.authenticationService.verifyToken(
      payload.body.token
    );

    client.did = identityDid;

    return await this.authenticationService.generateAuthenticationToken(
      identityDid
    );
  }

  private requestConnectionInfo(
    client: WebSocketExtended
  ): MediatorEventPayload {
    return {
      event: MediatorEvent.CONNECTION_INFO,
      data: {
        did: client.did ?? null,
        connectionId: client.id,
      },
    };
  }

  private async sendTwoWayMessage(
    payload: MediatorCommandPayload<ForwardMessageCommandPayload>,
    senderDidDocument: DidDocument,
    client: WebSocketExtended,
    server: Server
  ) {
    await this.twoWayMessagingService.sendTwoWayMessage(
      payload,
      senderDidDocument,
      client.did,
      server
    );
  }

  private async searchTwoWayMessage(
    payload: MediatorCommandPayload<MessageSearchCommandPayload>,
    senderDidDocument: DidDocument
  ) {
    await this.twoWayMessagingService.getTwoWayMessages(
      payload,
      senderDidDocument.id
    );
  }

  private handleMediatorError(
    error: Error
  ): MediatorEventPayload<MediatorErrorEventPayload> {
    if (error instanceof MediatorError) {
      return {
        event: MediatorEvent.MEDIATOR_ERROR,
        data: {
          payload: {
            error: error.error,
            data: {
              message: error.message,
            },
          },
        },
      };
    } else {
      return {
        event: MediatorEvent.MEDIATOR_ERROR,
        data: {
          payload: {
            error: MediatorErrorEventType.INTERNAL_SERVER_ERROR,
            data: {},
          },
        },
      };
    }
  }
}
