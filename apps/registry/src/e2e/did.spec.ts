import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
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
    const getRegistryDidDocumentResponse = await request(
      application.getHttpServer()
    )
      .get('/.well-known/did.json')
      .expect(200);

    expect(getRegistryDidDocumentResponse.body.id).toEqual(
      'did:web:identity.decentrl.network'
    );

    const registryDidDocument = new DidDocumentBuilder()
      .load(getRegistryDidDocumentResponse.body)
      .build();

    const did = await generateDid(
      'identity.decentrl.network',
      generateP256ECDHKeyPair,
      generateP256KeyPair
    );

    const didDocument = generateDidDocument(did, {
      alias: 'MrRobot',
    });

    const publicSigningKid = `${did.did}#${
      did.keys.signingKeyPair.public.kid as string
    }`;

    const didDocumentSignature = await signPayload(
      did.keys.signingKeyPair.private,
      publicSigningKid,
      JSON.stringify(didDocument)
    );

    const registryRoutingKey = getRegistryRoutingKey(registryDidDocument);

    if (!registryRoutingKey) {
      throw new Error('Registry routing key not found');
    }

    const encryptedDidDocumentPayload = await encryptPayload(
      didDocumentSignature,
      did.keys.encryptionKeyPair.private,
      registryRoutingKey.publicKeyJwk,
      registryRoutingKey.id
    );

    await request(application.getHttpServer())
      .post('/')
      .send({
        encryptedDidDocument: encryptedDidDocumentPayload,
      })
      .expect(201);

    const id = didDocument.id.split(':')[3];

    const getDidDocumentResponse = await request(application.getHttpServer())
      .get(`/${id}/did.json`)
      .expect(200);

    expect(JSON.parse(getDidDocumentResponse.text)).toEqual(didDocument);

    const updatedDidDocument: DidDocument = {
      ...didDocument,
      alias: 'Elliot',
    }

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
