import { Injectable } from '@nestjs/common';
import { IdentityWalletService } from '../identity-wallet';
import { v4 } from 'uuid';
import {
  AuthenticationCompletedEventPayload,
  ChallangeGeneratedEventPayload,
  MediatorErrorEventType,
  MediatorEvent,
  MediatorEventPayload,
  signJwt,
  signPayload,
  verifyJwt,
  verifySignature,
} from '@decentrl/ssi-utils';
import { MediatorError } from '../errors/mediator.error';
s
@Injectable()
export class AuthenticationService {
  constructor(private identityWalletService: IdentityWalletService) {}

  async requestChallenge(): Promise<
    MediatorEventPayload<ChallangeGeneratedEventPayload>
  > {
    const challenge = await signPayload(
      this.identityWalletService.getSigningKeyPair().private,
      v4()
    );

    return {
      event: MediatorEvent.CHALLENGE_GENERATED,
      data: {
        challenge: challenge,
      },
    };
  }

  async verifyChallenge(challenge: string): Promise<void> {
    try {
      await verifySignature(
        this.identityWalletService.getSigningKeyPair().public,
        challenge
      );
    } catch {
      throw new MediatorError(
        MediatorErrorEventType.INVALID_CHALLENGE,
        'Invalid challenge'
      );
    }
  }

  async verifyToken(token: string): Promise<string> {
    const { payload: verifiedPayload } = await verifyJwt(
      this.identityWalletService.getSigningKeyPair().public,
      token
    );

    if (verifiedPayload.sub === undefined) {
      throw new MediatorError(
        MediatorErrorEventType.INVALID_TOKEN,
        'Invalid token'
      );
    }

    return verifiedPayload.sub;
  }

  async generateAuthenticationToken(
    did: string
  ): Promise<MediatorEventPayload<AuthenticationCompletedEventPayload>> {
    const expiryTime = Math.floor(new Date().getTime() / 1000 + 60 * 60 * 2);

    const token = await signJwt(
      this.identityWalletService.getSigningKeyPair().private,
      {
        iss: this.identityWalletService.getDid(),
        sub: did,
        exp: expiryTime,
      }
    );

    return {
      event: MediatorEvent.AUTHENTICATION_COMPLETED,
      data: {
        token,
        expiresAt: expiryTime,
      },
    };
  }
}
