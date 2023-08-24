import {
  DidData,
  DidDocument,
  encryptPayload,
  generateDid,
  generateDidDocument,
  getRegistryRoutingKey,
  signPayload,
} from '@decentrl/utils/common';
import * as nodeUtils from '@decentrl/utils/node';

import request from 'supertest';

export const createAndRegisterIdentity = async (
  domain: string,
  alias: string,
  registryDidDocument: DidDocument,
): Promise<[DidData, DidDocument]> => {
  const identityDidData = await generateDid(
    domain.replace(':', '%3A'),
    nodeUtils.generateP256ECDHKeyPair,
    nodeUtils.generateP256KeyPair
  );

  const identityDidDocument = generateDidDocument(identityDidData, {
    alias,
  });

  const publicSigningKid = `${identityDidData.did}#${
    identityDidData.keys.signingKeyPair.public.kid as string
  }`;

  /**
   * Create a signature of DID document. This signature will be used
   * to verify that the DID document was created by the DID owner.
   */
  const didDocumentSignature = await signPayload(
    identityDidData.keys.signingKeyPair.private,
    publicSigningKid,
    JSON.stringify(identityDidDocument)
  );

  /**
   * Get registry routing key from its DID document. Routing key is used
   * to encrypt the payload, so that only the registry can decrypt it.
   */
  const registryRoutingKey = getRegistryRoutingKey(registryDidDocument);

  if (!registryRoutingKey) {
    throw new Error('Registry routing key not found');
  }

  /**
   * Encrypt the DID document signature using registries routing key.
   */
  const encryptedDidDocumentPayload = await encryptPayload(
    didDocumentSignature,
    identityDidData.keys.encryptionKeyPair.private,
    registryRoutingKey.publicKeyJwk,
    registryRoutingKey.id
  );

  /**
   * Register identity on the registry
   */
  await request(`https://${domain}`)
    .post('/')
    .send({
      encryptedDidDocument: encryptedDidDocumentPayload,
    })
    .expect(201);

  /**
   * Register identity on the mediator
   */


  return [identityDidData, identityDidDocument];
};
