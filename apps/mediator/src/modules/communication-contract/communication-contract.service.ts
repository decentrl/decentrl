import { Injectable } from '@nestjs/common';
import { EventLogService } from '../event-log/event-log.service';
import { InternalMediatorCommand } from '../../interfaces';
import {
  Cryptography,
  DidDocument,
  MediatorCommand,
  MediatorCommunicationChannel,
  MediatorCommunicationContractRejectedEventPayload,
  MediatorCommunicationContractSignedEventPayload,
  MediatorErrorReason,
  MediatorEventPayload,
  MediatorEventType,
  MediatorRequestCommunicationContractCommandPayload,
  MediatorSignCommunicationContractCommandPayload,
  signCommunicationContract,
} from '@decentrl/utils/common';
import { MediatorError } from '../../errors/mediator.error';
import { PrismaService } from '../prisma/prisma.service';
import { CommunicationContract } from '../../prisma-client';
import { IdentityWalletService } from '../identity-wallet/identity-wallet.service';

@Injectable()
export class CommunicationContractService {
  constructor(
    private prismaService: PrismaService,
    private eventLogService: EventLogService,
    private identityWalletService: IdentityWalletService
  ) {}

  async requestCommunicationContract(
    command: MediatorCommand,
    {
      didDocument,
      command: commandPayload,
    }: InternalMediatorCommand<MediatorRequestCommunicationContractCommandPayload>
  ): Promise<MediatorEventPayload> {
    if (this.isMediatorContractSignatureRequest(commandPayload)) {
      return this.handleMediatorContractSignature(didDocument, commandPayload);
    }

    const communicationContract = await this.getCommunicationContract(
      commandPayload.recipient,
      this.identityWalletService.getDidDocument().id
    );

    if (!communicationContract) {
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
    const communicationContract = await this.getCommunicationContract(
      commandPayload.recipient,
      this.identityWalletService.getDidDocument().id
    );

    if (!communicationContract) {
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

  async getCommunicationContract(
    firstParty: string,
    secondParty: string,
    communicationChannels?: MediatorCommunicationChannel[]
  ): Promise<CommunicationContract | undefined> {
    const communicationContract =
      await this.prismaService.communicationContract.findFirst({
        where: {
          OR: [
            {
              partyOne: firstParty,
              partyTwo: secondParty,
            },
            {
              partyOne: secondParty,
              partyTwo: firstParty,
            },
          ],
          AND: {
            OR: [
              {
                expiresAt: null,
              },
              {
                expiresAt: {
                  gt: new Date(),
                },
              },
            ],
          },
          ...(communicationChannels
            ? {
                communicationChannels: {
                  hasEvery: communicationChannels,
                },
              }
            : {}),
        },
      });

    if (!communicationContract) {
      return undefined;
    }

    return communicationContract;
  }

  isMediatorContractSignatureRequest(
    payload: MediatorRequestCommunicationContractCommandPayload
  ) {
    return this.identityWalletService.getDidDocument().id === payload.recipient;
  }

  async handleMediatorContractSignature(
    requestorDidDocument: DidDocument,
    payload: MediatorRequestCommunicationContractCommandPayload
  ): Promise<
    | MediatorCommunicationContractSignedEventPayload
    | MediatorCommunicationContractRejectedEventPayload
  > {
    const { verificationResult, signature } = await signCommunicationContract(
      payload.payload.contract,
      this.identityWalletService.getDidData(),
      Cryptography.NODE
    );

    if (
      verificationResult.communicationContractRequest.metadata === undefined ||
      verificationResult.communicationContractRequest.metadata
        .communicationChannels === undefined ||
      !Array.isArray(
        verificationResult.communicationContractRequest.metadata
          .communicationChannels
      ) ||
      !verificationResult.communicationContractRequest.metadata.communicationChannels.some(
        (channel) =>
          [
            MediatorCommunicationChannel.GROUP_PRIVATE,
            MediatorCommunicationChannel.TWO_WAY_PRIVATE,
            MediatorCommunicationChannel.ONE_WAY_PUBLIC,
          ].includes(channel)
      )
    ) {
      return {
        name: MediatorEventType.COMMUNICATION_CONTRACT_REJECTED,
        reason: 'COMMUNICATION_CONTRACT_COMMUNICATION_CHANNELS_REQUIRED',
      };
    }

    const existingCommunicationContract = await this.getCommunicationContract(
      requestorDidDocument.id,
      this.identityWalletService.getDidDocument().id
    );

    await this.prismaService.$transaction(async (tx) => {
      if (existingCommunicationContract) {
        await tx.communicationContract.delete({
          where: {
            id: existingCommunicationContract.id,
          },
        });
      }

      await tx.communicationContract.create({
        data: {
          partyOne: requestorDidDocument.id,
          partyTwo: this.identityWalletService.getDidDocument().id,
          contract: signature,
          communicationChannels:
            verificationResult.communicationContractRequest.metadata
              .communicationChannels,
          expiresAt: verificationResult.communicationContractRequest.expiresAt
            ? new Date(
                verificationResult.communicationContractRequest.expiresAt * 1000
              )
            : undefined,
        },
      });
    });

    return {
      name: MediatorEventType.COMMUNICATION_CONTRACT_SIGNED,
      contract: signature,
    };
  }

  async verifyCommunicationContract(
    recipient: string,
    communicationChannels: MediatorCommunicationChannel[]
  ): Promise<CommunicationContract | undefined> {
    return this.getCommunicationContract(
      recipient,
      this.identityWalletService.getDidDocument().id,
      communicationChannels
    );
  }
}
