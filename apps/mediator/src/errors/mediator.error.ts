import { MediatorErrorReason } from '@decentrl/utils/common';

export class MediatorError extends Error {
  constructor(reason: MediatorErrorReason) {
    super(reason);
  }
}
