import * as utils from '@decentrl/utils/common';
import * as nodeUtils from '@decentrl/utils/node';

const registryDomain = 'decentrl.network';

describe('Create DID', () => {
  it('should did and did document', async () => {
    const did = await utils.generateDid(
      registryDomain,
      nodeUtils.generateP256ECDHKeyPair,
      nodeUtils.generateP256KeyPair,
    );

    expect(did.keys.encryptionKeyPair).toBeDefined();
    expect(did.keys.signingKeyPair).toBeDefined();

    // Generate DID document
    const didDocument = utils.generateDidDocument(did, {
      alias: 'MrRobot',
    });

    // Load DID document to validate it
    new utils.DidDocumentBuilder().load(didDocument);

    const stringifiedDidDocument = JSON.stringify(didDocument);

    // Create DID document signature
    const signature = await utils.signPayload(
      did.keys.signingKeyPair.private,
      didDocument.verificationMethod[0].id,
      stringifiedDidDocument
    );

    // Get DID document signature payload
    const signaturePayload =
      await utils.readSignaturePayload<utils.DidDocument>(signature);

    expect(didDocument).toStrictEqual(signaturePayload);

    // Verify signature
    const verification = await utils.verifySignature(
      did.keys.signingKeyPair.public,
      signature
    );

    expect(verification.protectedHeader.kid).toEqual(
      didDocument.verificationMethod[0].id
    );
  });
});
