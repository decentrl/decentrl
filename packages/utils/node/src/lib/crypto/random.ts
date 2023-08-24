import * as crypto from 'crypto';

export const randomBytesHex = (length = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};
