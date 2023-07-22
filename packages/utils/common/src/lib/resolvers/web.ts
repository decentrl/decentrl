import { Resolver } from 'did-resolver';
import { getResolver } from 'web-did-resolver';

export const webDidResolver = new Resolver({ ...getResolver() });
