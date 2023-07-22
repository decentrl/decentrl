import { DidData } from '../did/did.interfaces';
import { webDidResolver } from '../resolvers/web';
import { DidDocumentBuilder } from './did-document-builder';
import {
  DidDocumentService,
  DidDocument,
  DidDocumentVerificationMethod,
  DidDocumentVerificationMethodType,
  DidDocumentKeyAgreement,
} from './did-document.interfaces';

export function generateDidDocument(
  { did, keys }: DidData,
  options: {
    service?: DidDocumentService;
    alias?: string;
  } = {}
): DidDocument {
  const verificationMethod: DidDocumentVerificationMethod = {
    id: `${did}#${keys.signingKeyPair.public.kid}`,
    type: DidDocumentVerificationMethodType.JsonWebKey2020,
    controller: did,
    publicKeyJwk: keys.signingKeyPair.public,
  };

  const encryptionKeyAgreement: DidDocumentKeyAgreement = {
    id: `${did}#${keys.encryptionKeyPair.public.kid}`,
    type: DidDocumentVerificationMethodType.JsonWebKey2020,
    controller: did,
    publicKeyJwk: keys.encryptionKeyPair.public,
  };

  const didDocumentBuilder = new DidDocumentBuilder()
    .setId(did)
    .addController(did)
    .addVerificationMethod(verificationMethod)
    .addAuthentication(verificationMethod.id)
    .addKeyAgreement(encryptionKeyAgreement)
    .validate();

  if (options.alias) {
    didDocumentBuilder.setAlias(options.alias)
  }

  if (options.service) {
    didDocumentBuilder.addServiceEndpoint(options.service);
  }

  return didDocumentBuilder.build();
}

export function addServiceEndpointToDidDocument(
  didDocument: DidDocument,
  service: DidDocumentService
): DidDocument {
  return new DidDocumentBuilder()
    .load(didDocument)
    .addServiceEndpoint(service)
    .validate()
    .build();
}

export async function resolveDidDocument(did: string): Promise<DidDocument> {
  const { didDocument } = await webDidResolver.resolve(did);

  if (!didDocument) {
    throw new Error(`Could not resolve DID document for DID ${did}`);
  }

  return didDocument as unknown as DidDocument;
}
