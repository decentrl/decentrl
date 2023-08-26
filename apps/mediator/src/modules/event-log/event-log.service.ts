import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  DidDocument,
  MediatorCommand,
  MediatorCommandPayload,
  MediatorEventType,
  MediatorQueryCommandPayload,
} from '@decentrl/utils/common';
import { InternalMediatorCommand } from '../../interfaces';
import { CommunicationChannel } from '../../prisma-client';

@Injectable()
export class EventLogService {
  constructor(private prismaService: PrismaService) {}

  async insertCommand(
    command: MediatorCommand,
    commandPayload: MediatorCommandPayload,
    senderDidDocument: DidDocument
  ) {
    await this.prismaService.eventLog.create({
      data: {
        id: command.id,
        name: commandPayload.name,
        payload: commandPayload.payload,
        communicationChannel:
          commandPayload.communicationChannel as CommunicationChannel,
        sender: senderDidDocument.id,
        receiver: commandPayload.recipient,
        metadata: commandPayload.metadata,
      },
    });
  }

  async query({
    didDocument,
    command: {
      payload: {
        limit,
        offset,
        orderBy,
        sender,
        receiver,
        gte,
        lte,
        metadata,
        command,
      },
    },
  }: InternalMediatorCommand<MediatorQueryCommandPayload>) {
    const metadataKeys = Object.keys(metadata ?? {});

    const metadataFilters = metadataKeys.map((key) => ({
      metadata: {
        path: [key],
        equals: metadata[key],
      },
    }));

    const findResult = await this.prismaService.eventLog.findMany({
      take: limit,
      skip: offset,

      where: {
        sender,
        name: command,
        receiver: receiver ? receiver : didDocument.id,
        communicationChannel: receiver
          ? CommunicationChannel.ONE_WAY_PUBLIC
          : undefined,
        ...(gte && {
          createdAt: {
            gte: new Date(gte),
          },
        }),
        ...(lte && {
          createdAt: {
            lte: new Date(lte),
          },
        }),
        AND: metadataFilters,
      },

      orderBy: {
        createdAt: orderBy ?? 'desc',
      },
    });

    return {
      name: MediatorEventType.QUERY_EXECUTED,
      payload: findResult.map((event) => ({
        id: event.id,
        name: event.name,
        payload: event.payload as Record<string, any>,
        sender: event.sender,
        recipient: event.receiver,
        metadata: event.metadata as Record<string, any>,
        createdAt: event.createdAt.toISOString(),
      })),
    };
  }
}
