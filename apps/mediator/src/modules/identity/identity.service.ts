import {
  DidDocument,
  MediatorErrorReason,
  resolveDidDocument,
} from '@decentrl/utils/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { MediatorError } from '../../errors/mediator.error';
import { DIDResolutionResult } from 'did-resolver';

@Injectable()
export class IdentityService {
  constructor(@Inject('CACHE_MANAGER') private cacheManager: Cache) {}

  async resolver(did: string): Promise<DIDResolutionResult> {
    try {
      const resolvedDidDocument =
        await resolveDidDocument(did);

      await this.cacheManager.set(did, resolvedDidDocument.didDocument);

      return resolvedDidDocument;
    } catch (error) {
      throw new MediatorError(MediatorErrorReason.DID_RESOLUTION_FAILED);
    }
  }

  async resolveDid(did: string): Promise<DidDocument> {
    const didDocument: DidDocument | undefined =
      await this.cacheManager.get<DidDocument>(did);

    if (didDocument) {
      return didDocument;
    }

    const resolvedDidDocument: DIDResolutionResult = await this.resolver(did);

    return resolvedDidDocument.didDocument as DidDocument;
  }
}
