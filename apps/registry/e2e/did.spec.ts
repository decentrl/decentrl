import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import {
  DidDocument,
  DidDocumentBuilder,
  encryptPayload,
  generateDid,
  generateDidDocument,
  getRegistryRoutingKey,
  signPayload,
} from '@decentrl/utils/common';
import {
  generateP256ECDHKeyPair,
  generateP256KeyPair,
} from '@decentrl/utils/node';

describe('Did', () => {
  let application: INestApplication;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    application = testingModule.createNestApplication();
    application.useGlobalPipes(new ValidationPipe());

    await application.init();
  });

  it('should register did', async () => {
    /**
     * Get registries public DID document. This will be used
     * to get the public encryption key of registry, with which
     * the create did payload will be encrypted.
     */
    const getRegistryDidDocumentResponse = await request(
      application.getHttpServer()
    )
      .get('/.well-known/did.json')
      .expect(200);

    expect(getRegistryDidDocumentResponse.body.id).toEqual(
      'did:web:identity.decentrl.network'
    );

    /**
     * Load registry DID document to validate it.
     */
    const registryDidDocument = new DidDocumentBuilder()
      .load(getRegistryDidDocumentResponse.body)
      .build();

    /**
     * Generate DID, encryption and signing key pairs.
     * The domain is set to registry domain, so that the did
     * generated will be resolvable to the specific registry.
     *
     * Node P256 key pair generators are used to generate the keys.
     * If you want to use browser P256 key pair generators, you can
     * import them from @decentrl/utils/web.
     */
    const did = await generateDid(
      'identity.decentrl.network',
      generateP256ECDHKeyPair,
      generateP256KeyPair
    );

    /**
     * Generate DID document. DID document is public and only
     * contains DID public keys. Public keys can be used by other entities
     * in the network to send you encrypted payloads.
     */
    const didDocument = generateDidDocument(did, {
      alias: 'MrRobot',
    });

    const publicSigningKid = `${did.did}#${
      did.keys.signingKeyPair.public.kid as string
    }`;

    /**
     * Create a signature of DID document. This signature will be used
     * to verify that the DID document was created by the DID owner.
     */
    const didDocumentSignature = await signPayload(
      did.keys.signingKeyPair.private,
      publicSigningKid,
      JSON.stringify(didDocument)
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
      did.keys.encryptionKeyPair.private,
      registryRoutingKey.publicKeyJwk,
      registryRoutingKey.id
    );

    /**
     * Post encrypted payload to the registry.
     *
     * On this step, the registry will first decrypt the payload using its
     * private key. Then it will verify the signature of the DID document.
     *
     * If the signature is valid, the registry will store the DID document
     * in its database.
     */
    await request(application.getHttpServer())
      .post('/')
      .send({
        encryptedDidDocument: encryptedDidDocumentPayload,
      })
      .expect(201);

    const id = didDocument.id.split(':')[3];

    /**
     * The identities DID document should now be publicly available
     */
    const getDidDocumentResponse = await request(application.getHttpServer())
      .get(`/${id}/did.json`)
      .expect(200);

    expect(JSON.parse(getDidDocumentResponse.text)).toEqual(didDocument);

    const updatedDidDocument: DidDocument = {
      ...didDocument,
      alias: 'Elliot',
    }

    /**
     * Updating the DID document is basically the same process, just with
     * different HTTP method (put).
     */
    const updatedDidDocumentSignature = await signPayload(
      did.keys.signingKeyPair.private,
      publicSigningKid,
      JSON.stringify(updatedDidDocument)
    );

    const encryptedUpdatedDidDocumentPayload = await encryptPayload(
      updatedDidDocumentSignature,
      did.keys.encryptionKeyPair.private,
      registryRoutingKey.publicKeyJwk,
      registryRoutingKey.id
    );

    await request(application.getHttpServer())
      .put('/')
      .send({
        encryptedDidDocument: encryptedUpdatedDidDocumentPayload,
      })
      .expect(200);

    const getUpdatedDidDocumentResponse = await request(application.getHttpServer())
      .get(`/${id}/did.json`)
      .expect(200);

    expect(JSON.parse(getUpdatedDidDocumentResponse.text)).toEqual(updatedDidDocument);
  });
});

// TODO: Add test case that checks if updated did document is a bad actor
