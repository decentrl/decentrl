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
  MediatorQueryCommandPayload,
  MediatorRegisterCommandPayload,
  MediatorRequestCommunicationContractCommandPayload,
  MediatorSignCommunicationContractCommandPayload,
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
import { CommunicationContractService } from '../communication-contract/communication-contract.service';
import { EventLogService } from '../event-log/event-log.service';

@Injectable()
export class WebsocketService {
  constructor(
    private utilService: UtilsService,
    private registerService: RegisterService,
    private communicationContractService: CommunicationContractService,
    private eventLogService: EventLogService,
    private configService: ConfigService,
    private identityWalletService: IdentityWalletService
  ) {}

  async processCommand(
    type: MediatorCommandType,
    command: MediatorCommand,
    commandPayload: MediatorCommandPayload,
    senderDidDocument: DidDocument
  ): Promise<MediatorEventPayload | void> {
    switch (type) {
      case MediatorCommandType.REGISTER:
        return await this.registerService.registerIdentity({
          didDocument: senderDidDocument,
          command: commandPayload as MediatorRegisterCommandPayload,
        });
      case MediatorCommandType.REQUEST_COMMUNICATION_CONTRACT:
        return await this.communicationContractService.requestCommunicationContract(
          command,
          {
            didDocument: senderDidDocument,
            command:
              commandPayload as MediatorRequestCommunicationContractCommandPayload,
          }
        );
      case MediatorCommandType.SIGN_COMMUNICATION_CONTACT:
        return await this.communicationContractService.signCommunicationContract(
          command,
          {
            didDocument: senderDidDocument,
            command:
              commandPayload as MediatorSignCommunicationContractCommandPayload,
          }
        );
      case MediatorCommandType.QUERY:
        return await this.eventLogService.query({
          didDocument: senderDidDocument,
          command: commandPayload as MediatorQueryCommandPayload,
        });
    }
  }

  async commandHandler(
    command: MediatorCommand
  ): Promise<MediatorEvent | MediatorErrorEvent | void> {
    try {
      const { decryptedPayload, senderDidDocument } =
        await this.utilService.unwrapMessage(command.payload);

      const mediatorCommandPayload: MediatorCommandPayload =
        JSON.parse(decryptedPayload);

      const mediatorEventPayload = await this.processCommand(
        mediatorCommandPayload.name,
        command,
        mediatorCommandPayload,
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
        id: command.id,
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
