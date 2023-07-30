import { DidDocument, MediatorCommandPayload } from '@decentrl/utils/common';

export interface InternalMediatorCommand<T extends MediatorCommandPayload> {
  didDocument: DidDocument;
  command: T;
}
