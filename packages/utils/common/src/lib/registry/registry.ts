import {
  DidDocument,
  DidDocumentVerificationMethod,
} from '../did-document/did-document.interfaces';
import { getKey } from '../did-document/did-document.utils';
import { RegistryService } from './registry.interfaces';

export function getRegistryRoutingKey(
  didDocument: DidDocument
): DidDocumentVerificationMethod | undefined {
  const registryService: RegistryService | undefined = didDocument.service.find(
    (service) => {
      return service.type === 'DecentrlRegistry';
    }
  ) as RegistryService | undefined;

  if (registryService === undefined) {
    return undefined;
  }

  const routingKey =
    registryService.serviceEndpoint.routingKeys[0] ?? undefined;

  if (routingKey === undefined) {
    return undefined;
  }

  return getKey(didDocument, routingKey);
}
