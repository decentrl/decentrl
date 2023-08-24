import { Injectable, Logger } from '@nestjs/common';
import { EventLogService } from '../event-log/event-log.service';
import {
  MediatorCommand,
  MediatorErrorReason,
  MediatorEventPayload,
  MediatorEventType,
  MediatorTwoWayPrivateCommandPayload,
} from '@decentrl/utils/common';
import { InternalMediatorCommand } from '../../interfaces';
import { verifyCommunicationContract } from '@decentrl/utils/common';
import { MediatorError } from '../../errors/mediator.error';

// todo: decrease payload sizes

@Injectable()
export class TwoWayPrivateService {
  constructor(private eventLogService: EventLogService) {}

  async postTwoWayPrivateMessage(
    command: MediatorCommand,
    {
      didDocument,
      command: commandPayload,
    }: InternalMediatorCommand<MediatorTwoWayPrivateCommandPayload>
  ): Promise<MediatorEventPayload> {
    try {
      await this.verifyCommunicationContract(
        commandPayload.payload.signedCommunicationContract,
        didDocument.id,
        commandPayload.recipient
      );
    } catch {
      throw new MediatorError(
        MediatorErrorReason.COMMUNICATION_CONTRACT_NOT_VALID
      );
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
      signedCommunicationContract
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
