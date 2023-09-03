import { Injectable, Logger } from '@nestjs/common';
import { EventLogService } from '../event-log/event-log.service';
import {
  Cryptography,
  MediatorCommand,
  MediatorCommunicationChannel,
  MediatorErrorReason,
  MediatorEventPayload,
  MediatorEventType,
  MediatorTwoWayPrivateCommandPayload,
} from '@decentrl/utils/common';
import { InternalMediatorCommand } from '../../interfaces';
import { verifyCommunicationContract } from '@decentrl/utils/common';
import { MediatorError } from '../../errors/mediator.error';
import { CommunicationContractService } from '../communication-contract/communication-contract.service';

@Injectable()
export class TwoWayPrivateService {
  constructor(
    private eventLogService: EventLogService,
    private communicationContractService: CommunicationContractService
  ) {}

  async postTwoWayPrivateMessage(
    command: MediatorCommand,
    {
      didDocument,
      command: commandPayload,
    }: InternalMediatorCommand<MediatorTwoWayPrivateCommandPayload>
  ): Promise<MediatorEventPayload> {
    const mediatorCommunicationContract =
      await this.communicationContractService.verifyCommunicationContract(
        commandPayload.recipient,
        [MediatorCommunicationChannel.TWO_WAY_PRIVATE]
      );

    if (!mediatorCommunicationContract) {
      throw new MediatorError(
        MediatorErrorReason.RECIPIENT_COMMUNICATION_CHANNEL_NOT_ENABLED
      );
    }

    const senderCommunicationContract =
      await this.communicationContractService.getCommunicationContract(
        commandPayload.recipient,
        didDocument.id
      );

    if (!senderCommunicationContract) {
      if (commandPayload.payload.contract) {
        await this.verifyCommunicationContract(
          commandPayload.payload.contract,
          didDocument.id,
          commandPayload.recipient
        );
      } else {
        throw new MediatorError(
          MediatorErrorReason.COMMUNICATION_CONTRACT_NOT_VALID
        );
      }
    }

    await this.eventLogService.insertCommand(
      command,
      commandPayload,
      didDocument
    );

    return {
      name: MediatorEventType.TWO_WAY_PRIVATE_MESSAGE_SENT,
    };
  }

  async verifyCommunicationContract(
    signedCommunicationContract: string,
    senderDid: string,
    recipientDid: string
  ) {
    const verificationResult = await verifyCommunicationContract(
      signedCommunicationContract,
      Cryptography.NODE
    );

    const contractParties = [
      verificationResult.recipientDidDocument.id,
      verificationResult.requestorDidDocument.id,
    ];

    if (
      !contractParties.includes(senderDid) ||
      !contractParties.includes(recipientDid)
    ) {
      throw new MediatorError(
        MediatorErrorReason.COMMUNICATION_CONTRACT_NOT_VALID
      );
    }
  }
}
