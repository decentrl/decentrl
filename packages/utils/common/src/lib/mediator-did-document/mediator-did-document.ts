import { DidDocument } from '../did-document/did-document.interfaces';
import {
  MediatorCommunicationChannel,
  MediatorServiceType,
  MediatorCommunicationService,
} from './mediator-did-document.interfaces';

export function getMediatorCommunicationChannels(
  didDocument: DidDocument
): MediatorCommunicationChannel[] {
  const communicationService = didDocument.service.find(
    (service) =>
      service.type === `DecentrlMediator${MediatorServiceType.COMMUNICATION}`
  );

  if (!communicationService) {
    return [];
  }

  return (communicationService as MediatorCommunicationService).serviceEndpoint
    .communicationChannels;
}
