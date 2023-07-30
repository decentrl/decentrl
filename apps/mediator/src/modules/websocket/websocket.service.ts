import { Injectable, Logger } from '@nestjs/common';
import {
  DidDocument,
  DidDocumentVerificationMethodType,
  MediatorCommand,
  MediatorCommandPayload,
  MediatorCommandType,
  MediatorErrorEvent,
  MediatorErrorReason,
  MediatorEvent,
  MediatorEventPayload,
  MediatorMessageType,
  MediatorRegisterCommandPayload,
  encryptPayload,
  getVerificationMethods,
} from '@decentrl/utils/common';
import { UtilsService } from '../utils/utils.service';
import { RegisterService } from '../register/register.service';
import { ConfigService } from '@microservice-stack/nest-config';
import { ConfigVariables } from '../../constants';
import { MediatorError } from '../../errors/mediator.error';
import { IdentityWalletService } from '../identity-wallet/identity-wallet.service';
import { VerificationMethod } from 'did-resolver';

@Injectable()
export class WebsocketService {
  constructor(
    private utilService: UtilsService,
    private registerService: RegisterService,
    private configService: ConfigService,
    private identityWalletService: IdentityWalletService
  ) {}

  async processCommand(
    type: MediatorCommandType,
    command: MediatorCommandPayload,
    senderDidDocument: DidDocument
  ): Promise<MediatorEventPayload | void> {
    switch (type) {
      case MediatorCommandType.REGISTER:
        return await this.registerService.registerIdentity({
          didDocument: senderDidDocument,
          command: command as MediatorRegisterCommandPayload,
        });
        break;
    }
  }

  async commandHandler(
    body: MediatorCommand
  ): Promise<MediatorEvent | MediatorErrorEvent | void> {
    try {
      const { decryptedPayload, senderDidDocument } =
        await this.utilService.unwrapMessage(body.payload);

      const mediatorCommand: MediatorCommandPayload =
        JSON.parse(decryptedPayload);

      const mediatorEventPayload = await this.processCommand(
        mediatorCommand.name,
        mediatorCommand,
        senderDidDocument
      );

      const senderEncryptionKeys = getVerificationMethods(
        senderDidDocument,
        'keyAgreement',
        DidDocumentVerificationMethodType.JsonWebKey2020
      );

      if (senderEncryptionKeys.length === 0) {
        throw new MediatorError(MediatorErrorReason.RESPONSE_ENCRYPTION_FAILED);
      }

      const encryptedPayload = await encryptPayload(
        JSON.stringify(mediatorEventPayload),
        this.configService.get(ConfigVariables.KEY_AGREEMENT_ECDH_PRIVATE_JWK),
        senderEncryptionKeys[0].publicKeyJwk,
        (
          this.identityWalletService.getDidDocument()
            .keyAgreement[0] as VerificationMethod
        ).id
      );

      return {
        id: body.id,
        type: MediatorMessageType.EVENT,
        payload: encryptedPayload,
      };
    } catch (error) {
      return {
        type: MediatorMessageType.ERROR,
        reason: error.message,
      };
    }
  }
}
