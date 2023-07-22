import {
  DidDocument,
  DidDocumentVerificationMethod,
  DidDocumentVerificationMethodType,
} from './did-document.interfaces';

export function getVerificationMethods(
  didDocument: DidDocument,
  verificationMethodType:
    | 'keyAgreement'
    | 'authentication'
    | 'assertionMethod'
    | 'verificationMethod',
  keyType: DidDocumentVerificationMethodType
): DidDocumentVerificationMethod[] {
  if (didDocument[verificationMethodType] === null) {
    return [];
  }

  return didDocument[verificationMethodType].flatMap(
    (verificationMethod) => {
      if (typeof verificationMethod === 'string') {
        if (didDocument.verificationMethod === null) {
          return [];
        }

        const referencedVerificationMethod:
          | DidDocumentVerificationMethod
          | undefined = didDocument.verificationMethod.find((method) => {
          return method.id === verificationMethod;
        });

        if (
          referencedVerificationMethod === undefined ||
          referencedVerificationMethod.type !== keyType
        ) {
          return [];
        }

        return [referencedVerificationMethod];
      }

      if (verificationMethod.type !== keyType) {
        return [];
      }

      return [verificationMethod];
    }
  );
}

export function getServiceEndpoints(
  didDocument: DidDocument,
  type: string
): string[] {
  if (didDocument.service === null) {
    return [];
  }

  const endpoints = didDocument.service.flatMap((service) => {
    if (service.type !== type) {
      return [];
    }

    if (typeof service.serviceEndpoint === 'string') {
      return [service.serviceEndpoint];
    }

    return service.serviceEndpoint;
  });

  // get only uniques
  return Array.from(new Set(endpoints));
}
