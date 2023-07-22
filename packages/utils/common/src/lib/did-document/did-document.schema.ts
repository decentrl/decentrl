export const verificationMethodSchema = {
  id: '/VerificationMethod',
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { type: 'string' },
    controller: { type: 'string' },
    publicKeyJwk: { type: 'object' },
  },
  required: ['id', 'type', 'controller', 'publicKeyJwk'],
  additionalProperties: false,
};

export const didDocumentServiceSchema = {
  id: '/DidDocumentService',
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { type: 'string' },
  },
  required: ['id', 'type', 'serviceEndpoint'],
  additionalProperties: true,
};

export const didDocumentSchema = {
  id: '/DidDocument',
  type: 'object',
  properties: {
    '@context': {
      type: 'array',
      items: { type: 'string' },
    },
    id: { type: 'string' },
    controller: { type: 'string' },
    alsoKnownAs: { type: 'array' },
    verificationMethod: {
      type: 'array',
    },
    authentication: {
      type: 'array',
    },
    assertionMethod: {
      type: 'array',
    },
    keyAgreement: {
      type: 'array',
    },
    service: {
      type: 'array',
      items: { $ref: '/DidDocumentService' },
    },
  },
  required: ['@context', 'id'],
};
