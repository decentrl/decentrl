import { Injectable } from '@nestjs/common';
import { EventLogService } from '../event-log/event-log.service';
import { InternalMediatorCommand } from '../../interfaces';
import {
  MediatorCommand,
  MediatorErrorReason,
  MediatorEventPayload,
  MediatorEventType,
  MediatorRequestCommunicationContractCommandPayload,
  MediatorSignCommunicationContractCommandPayload,
} from '@decentrl/utils/common';
import { RegisterService } from '../register/register.service';
import { MediatorError } from '../../errors/mediator.error';

@Injectable()
export class CommunicationContractService {
  constructor(
    private eventLogService: EventLogService,
    private registerService: RegisterService
  ) {}

  async requestCommunicationContract(
    command: MediatorCommand,
    {
      didDocument,
      command: commandPayload,
    }: InternalMediatorCommand<MediatorRequestCommunicationContractCommandPayload>
  ): Promise<MediatorEventPayload> {
    const isRecipientRegistered = await this.registerService.isRegistered(
      commandPayload.recipient
    );

    if (!isRecipientRegistered) {
      throw new MediatorError(MediatorErrorReason.RECIPIENT_NOT_REGISTERED);
    }

    await this.eventLogService.insertCommand(
      command,
      commandPayload,
      didDocument
    );

    return {
      name: MediatorEventType.COMMUNICATION_CONTRACT_REQUESTED,
    };
  }

  async signCommunicationContract(
    command: MediatorCommand,
    {
      didDocument,
      command: commandPayload,
    }: InternalMediatorCommand<MediatorSignCommunicationContractCommandPayload>
  ) {
    const isRecipientRegistered = await this.registerService.isRegistered(
      commandPayload.recipient
    );

    if (!isRecipientRegistered) {
      throw new MediatorError(MediatorErrorReason.RECIPIENT_NOT_REGISTERED);
    }

    await this.eventLogService.insertCommand(
      command,
      commandPayload,
      didDocument
    );

    return {
      name: MediatorEventType.COMMUNICATION_CONTRACT_SIGNED,
    };
  }
}
