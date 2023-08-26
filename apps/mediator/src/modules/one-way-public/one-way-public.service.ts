import { Injectable } from '@nestjs/common';
import { EventLogService } from '../event-log/event-log.service';
import {
  MediatorCommand,
  MediatorEventPayload,
  MediatorEventType,
  MediatorOneWayPublicCommandPayload,
} from '@decentrl/utils/common';
import { InternalMediatorCommand } from '../../interfaces';

@Injectable()
export class OneWayPublicService {
  constructor(private eventLogService: EventLogService) {}

  async postOneWayPublicMessage(
    command: MediatorCommand,
    {
      didDocument,
      command: commandPayload,
    }: InternalMediatorCommand<MediatorOneWayPublicCommandPayload>
  ): Promise<MediatorEventPayload> {
    await this.eventLogService.insertCommand(
      command,
      commandPayload,
      didDocument
    );

    return {
      name: MediatorEventType.ONE_WAY_PUBLIC_MESSAGE_SENT,
    };
  }
}
