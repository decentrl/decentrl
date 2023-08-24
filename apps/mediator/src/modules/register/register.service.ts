import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InternalMediatorCommand } from '../../interfaces';
import {
  MediatorCommunicationChannel,
  MediatorErrorReason,
  MediatorEventPayload,
  MediatorEventType,
  MediatorRegisterCommandPayload,
  getMediatorCommunicationChannels,
} from '@decentrl/utils/common';
import { IdentityWalletService } from '../identity-wallet/identity-wallet.service';
import { CommunicationChannel } from '@prisma/client';
import { MediatorError } from '../../errors/mediator.error';

@Injectable()
export class RegisterService {
  constructor(
    private prismaService: PrismaService,
    private identityWalletService: IdentityWalletService
  ) {}

  async registerIdentity(
    registerCommand: InternalMediatorCommand<MediatorRegisterCommandPayload>
  ): Promise<MediatorEventPayload> {
    const { didDocument, command } = registerCommand;

    const mediatorCommunicationChannels = getMediatorCommunicationChannels(
      this.identityWalletService.getDidDocument()
    );

    const enabledCommunicationChannels =
      command.payload.communicationChannels.filter((channel) =>
        mediatorCommunicationChannels.includes(channel)
      );

    if (enabledCommunicationChannels.length === 0) {
      throw new MediatorError(
        MediatorErrorReason.NO_ENABLED_COMMUNICATION_CHANNELS
      );
    }

    await this.prismaService.registeredIdentities.create({
      data: {
        did: didDocument.id,
        communicationChannels:
          enabledCommunicationChannels as CommunicationChannel[],
      },
    });

    return {
      name: MediatorEventType.REGISTERED,
      payload: {
        communicationChannels: enabledCommunicationChannels,
      },
    };
  }

  async isRegistered(did: string): Promise<boolean> {
    const registeredIdentity =
      await this.prismaService.registeredIdentities.findUnique({
        where: {
          did,
        },
      });

    return !!registeredIdentity;
  }

  async communicationChannelEnabled(
    did: string,
    communicationChannel: MediatorCommunicationChannel
  ): Promise<boolean> {
    const registeredIdentity =
      await this.prismaService.registeredIdentities.findUnique({
        where: {
          did,
        },
      });

    if (!registeredIdentity) {
      return false;
    }

    return registeredIdentity.communicationChannels.includes(
      communicationChannel as CommunicationChannel
    );
  }
}
