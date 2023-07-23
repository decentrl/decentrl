import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IdentityWalletService } from '../identity-wallet/identity-wallet.service';
import {
  DidDocument,
  DidDocumentBuilder,
  decryptPayload,
  getVerificationMethod,
  readSignatureHeaders,
  readSignaturePayload,
  verifySignature,
} from '@decentrl/utils/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@microservice-stack/nest-config';
import { ConfigVariables } from '../../constants';

@Injectable()
export class DidService {
  constructor(
    private identityWalletService: IdentityWalletService,
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  private async validateDidDocumentSignature(
    didDocumentSignature: string
  ): Promise<DidDocument> {
    const didDocument = await readSignaturePayload<DidDocument>(
      didDocumentSignature
    );

    try {
      new DidDocumentBuilder().load(didDocument);
    } catch {
      throw new BadRequestException('Invalid DID document');
    }

    const signatureHeaders = await readSignatureHeaders<{ kid?: string }>(
      didDocumentSignature
    );

    if (!signatureHeaders.kid) {
      throw new BadRequestException(
        'Signature headers are missing kid parameter'
      );
    }

    const verificationMethod = getVerificationMethod(
      didDocument,
      signatureHeaders.kid
    );

    if (!verificationMethod) {
      throw new BadRequestException('Verification method not found');
    }

    try {
      await verifySignature(
        verificationMethod.publicKeyJwk,
        didDocumentSignature
      );
    } catch {
      throw new BadRequestException('Invalid signature');
    }

    return didDocument;
  }

  async createDid(encryptedDidDocument: string): Promise<void> {
    const keyPair = this.identityWalletService.getEncryptionKeyPair();

    const didDocumentSignature = await decryptPayload(
      keyPair.private,
      encryptedDidDocument
    );

    const didDocument = await this.validateDidDocumentSignature(
      didDocumentSignature
    );

    await this.prismaService.didDocument.create({
      data: {
        did: didDocument.id,
        didDocument: JSON.stringify(didDocument),
        signature: didDocumentSignature,
      },
    });
  }

  async updateDid(encryptedDidDocument: string): Promise<void> {
    const keyPair = this.identityWalletService.getEncryptionKeyPair();

    const didDocumentSignature = await decryptPayload(
      keyPair.private,
      encryptedDidDocument
    );

    const didDocument = await this.validateDidDocumentSignature(
      didDocumentSignature
    );

    await this.prismaService.didDocument.update({
      where: {
        did: didDocument.id,
      },
      data: {
        didDocument: JSON.stringify(didDocument),
        signature: didDocumentSignature,
        version: {
          increment: 1,
        },
      },
    });
  }

  async getDidDocument(did: string): Promise<DidDocument> {
    const didDocumentEntity = await this.prismaService.didDocument.findUnique({
      where: {
        did: `did:web:${this.configService.get(ConfigVariables.DOMAIN)}:${did}`,
      },
    });

    if (!didDocumentEntity) {
      throw new NotFoundException('DID not found');
    }

    return didDocumentEntity.didDocument as unknown as DidDocument;
  }

  async getDidDocumentSignature(did: string): Promise<string> {
    const didDocumentEntity = await this.prismaService.didDocument.findUnique({
      where: {
        did: `did:web:${this.configService.get(ConfigVariables.DOMAIN)}:${did}`,
      },
    });

    if (!didDocumentEntity) {
      throw new NotFoundException('DID not found');
    }

    return didDocumentEntity.signature;
  }
}
