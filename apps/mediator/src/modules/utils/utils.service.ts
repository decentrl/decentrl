import { Injectable, Logger } from '@nestjs/common';
import {
  DecryptAndVerifyPayloadResult,
  MediatorErrorReason,
  decryptAndVerifyPayload,
} from '@decentrl/utils/common';
import { IdentityWalletService } from '../identity-wallet/identity-wallet.service';
import { MediatorError } from '../../errors/mediator.error';
import { IdentityService } from '../identity/identity.service';

@Injectable()
export class UtilsService {
  constructor(
    private identityWalletService: IdentityWalletService,
    private identityService: IdentityService
  ) {}

  async unwrapMessage(
    encryptedPayload: string
  ): Promise<DecryptAndVerifyPayloadResult> {
    const encryptionKeyPair = this.identityWalletService.getEncryptionKeyPair();

    try {
      return await decryptAndVerifyPayload(
        encryptedPayload,
        encryptionKeyPair.private,
        this.identityService.resolver
      );
    } catch (error) {
      throw new MediatorError(MediatorErrorReason.MESSAGE_UNWRAPPING_FAILED);
    }
  }
}
