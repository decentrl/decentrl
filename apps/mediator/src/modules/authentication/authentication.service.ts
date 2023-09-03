import { Injectable } from '@nestjs/common';
import { IdentityWalletService } from '../identity-wallet/identity-wallet.service';
import {
  Cryptography,
  DidDocument,
  DidDocumentVerificationMethodType,
  MediatorAuthenticateCommandPayload,
  MediatorAuthenticatedEventPayload,
  MediatorAuthenticationChallengeRequestedEventPayload,
  MediatorCommand,
  MediatorErrorReason,
  MediatorEventType,
  getVerificationMethods,
  readSignaturePayload,
  signPayload,
  verifySignature,
} from '@decentrl/utils/common';
import { InternalMediatorCommand } from '../../interfaces';
import { MediatorError } from '../../errors/mediator.error';

@Injectable()
export class AuthenticationService {
  constructor(private identityWalletService: IdentityWalletService) {}

  async requestAuthenticationChallenge(
    clientDidDocument: DidDocument
  ): Promise<MediatorAuthenticationChallengeRequestedEventPayload> {
    const expiry = (Date.now() + 10_1000) / 1000;

    const signedChallenge = await signPayload(
      JSON.stringify({
        clientDid: clientDidDocument.id,
        expiry,
      }),
      this.identityWalletService.getSigningKeyPair().private,
      this.identityWalletService.getSigningKeyPair().public.kid,
      Cryptography.NODE
    );

    return {
      name: MediatorEventType.AUTHENTICATION_CHALLENGE_REQUESTED,
      challenge: signedChallenge,
    };
  }

  async authenticate(
    command: MediatorCommand,
    {
      didDocument,
      command: commandPayload,
    }: InternalMediatorCommand<MediatorAuthenticateCommandPayload>
  ): Promise<MediatorAuthenticatedEventPayload> {
    try {
      const verificationMethods = getVerificationMethods(
        didDocument,
        'verificationMethod',
        DidDocumentVerificationMethodType.JsonWebKey2020
      );

      await Promise.any(
        verificationMethods.map((verificationMethod) =>
          verifySignature(
            commandPayload.payload.signedChallenge,
            verificationMethod.publicKeyJwk,
            Cryptography.NODE
          )
        )
      );

      const payload = await readSignaturePayload(commandPayload.payload.signedChallenge);

    } catch {
      throw new MediatorError(MediatorErrorReason.AUTHENTICATION_FAILED);
    }
    return {
      name: MediatorEventType.AUTHENTICATED,
    };
  }
}
