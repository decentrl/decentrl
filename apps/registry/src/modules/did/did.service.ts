import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IdentityWalletService } from '../identity-wallet/identity-wallet.service';
import {
  Cryptography,
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
    private configService: ConfigService
  ) {}

  private async extractDidDocument(didDocumentSignature: string) {
    const didDocument = await readSignaturePayload<DidDocument>(
      didDocumentSignature
    );

    try {
      new DidDocumentBuilder().load(didDocument);
    } catch {
      throw new BadRequestException('Invalid DID document');
    }

    return didDocument;
  }

  private async validateDidDocumentSignature(
    didDocumentSignature: string,
    existingDidDocument?: DidDocument
  ): Promise<DidDocument> {
    const didDocument = await this.extractDidDocument(didDocumentSignature);

    const signatureHeaders = await readSignatureHeaders<{ kid?: string }>(
      didDocumentSignature
    );

    if (!signatureHeaders.kid) {
      throw new BadRequestException(
        'Signature headers are missing kid parameter'
      );
    }

    const verificationMethod = getVerificationMethod(
      existingDidDocument ? existingDidDocument : didDocument,
      signatureHeaders.kid
    );

    if (!verificationMethod) {
      throw new BadRequestException('Verification method not found');
    }

    try {
      await verifySignature(
        didDocumentSignature,
        verificationMethod.publicKeyJwk,
        Cryptography.NODE
      );
    } catch {
      throw new BadRequestException('Invalid signature');
    }

    return didDocument;
  }

  async createDid(encryptedDidDocument: string): Promise<void> {
    const keyPair = this.identityWalletService.getEncryptionKeyPair();

    const didDocumentSignature = await decryptPayload(
      encryptedDidDocument,
      keyPair.private,
      Cryptography.NODE
    );

    const didDocument = await this.validateDidDocumentSignature(
      didDocumentSignature.plaintext.toString()
    );

    await this.prismaService.didDocument.create({
      data: {
        did: didDocument.id,
        didDocument: JSON.stringify(didDocument),
        signature: didDocumentSignature.plaintext.toString(),
      },
    });
  }

  async updateDid(encryptedDidDocument: string): Promise<void> {
    const keyPair = this.identityWalletService.getEncryptionKeyPair();

    const didDocumentSignature = await decryptPayload(
      encryptedDidDocument,
      keyPair.private,
      Cryptography.NODE
    );

    const didDocument = await this.extractDidDocument(
      didDocumentSignature.plaintext.toString()
    );

    const existingDidDocument = await this.prismaService.didDocument.findUnique(
      {
        where: {
          did: didDocument.id,
        },
      }
    );

    if (!existingDidDocument) {
      throw new NotFoundException('DID not found');
    }

    await this.validateDidDocumentSignature(
      didDocumentSignature.plaintext.toString(),
      JSON.parse(existingDidDocument.didDocument as string) as DidDocument
    );

    await this.prismaService.didDocument.update({
      where: {
        did: didDocument.id,
      },
      data: {
        didDocument: JSON.stringify(didDocument),
        signature: didDocumentSignature.plaintext.toString(),
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
