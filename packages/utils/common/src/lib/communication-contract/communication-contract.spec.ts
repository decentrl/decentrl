import { DidData } from '../did/did.interfaces';
import { DidDocument } from '../did-document/did-document.interfaces';
import { generateDid } from '../did/did';
import {
  generateCommunicationContractSignatureRequest,
  signCommunicationContract,
  verifyCommunicationContract,
  verifyCommunicationContractSignatureRequest,
} from './communication-contract';
import * as didDocumentUtils from '../did-document/did-document';

// eslint-disable-next-line @nx/enforce-module-boundaries
import * as nodeUtils from '@decentrl/utils/node';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as webUtils from '@decentrl/utils/web';

import { when } from 'jest-when';
import { decryptPayload } from '../crypto/ecdh';
import { Cryptography } from '../crypto/crypto.interfaces';

const domain = 'registry.decentrl.network';

describe('Communication Contract', () => {
  let requestorDidData: DidData;
  let requestorDidDocument: DidDocument;
  let recipientDidData: DidData;
  let recipientDidDocument: DidDocument;

  beforeAll(async () => {
    requestorDidData = await generateDid(
      domain,
      webUtils.generateX25519KeyPair,
      webUtils.generateEd25519KeyPair
    );

    requestorDidDocument =
      didDocumentUtils.generateDidDocument(requestorDidData);

    recipientDidData = await generateDid(
      domain,
      nodeUtils.generateX25519KeyPair,
      nodeUtils.generateEd25519KeyPair
    );

    recipientDidDocument =
      didDocumentUtils.generateDidDocument(recipientDidData);

    const webDidResolverSpy = jest.spyOn(
      didDocumentUtils,
      'resolveDidDocument'
    );

    when(webDidResolverSpy)
      .calledWith(requestorDidData.did)
      .mockResolvedValue({
        didDocument: requestorDidDocument,
      } as any);

    when(webDidResolverSpy)
      .calledWith(recipientDidData.did)
      .mockResolvedValue({
        didDocument: recipientDidDocument,
      } as any);
  });

  it('should generate communication contract request and sign it', async () => {
    const secretContractKey = nodeUtils.randomBytesHex();

    const signedCommunicationContractRequest =
      await generateCommunicationContractSignatureRequest(
        requestorDidData,
        recipientDidData.did,
        secretContractKey,
        Cryptography.BROWSER
      );

    const communicationContractRequestVerificationResult =
      await verifyCommunicationContractSignatureRequest(
        signedCommunicationContractRequest,
        Cryptography.NODE
      );

    expect(communicationContractRequestVerificationResult).toStrictEqual({
      requestorDidDocument,
      communicationContractRequest: {
        id: expect.any(String),
        requestorDid: requestorDidData.did,
        requestorPublicSigningKeyId: `${requestorDidData.did}#${requestorDidData.keys.signingKeyPair.public.kid}`,
        recipientDid: recipientDidData.did,
        recipientPublicSigningKeyId: `${recipientDidData.did}#${recipientDidData.keys.signingKeyPair.public.kid}`,
        recipientEncryptedCommunicationSecretKey: expect.any(String),
      },
    });

    const signedCommunicationContract = await signCommunicationContract(
      signedCommunicationContractRequest,
      recipientDidData,
      Cryptography.NODE
    );

    const communicationContractVerificationResult =
      await verifyCommunicationContract(
        signedCommunicationContract.signature,
        Cryptography.NODE
      );

    expect(communicationContractVerificationResult).toStrictEqual({
      requestorDidDocument,
      recipientDidDocument,
      communicationContract: {
        requestorSignature: signedCommunicationContractRequest,
        requestorEncryptedCommunicationSecretKey: expect.any(String),
      },
      recipientEncryptedCommunicationSecretKey: expect.any(String),
      requestorEncryptedCommunicationSecretKey: expect.any(String),
    });

    const decryptedRecipientContractKey = await decryptPayload(
      communicationContractVerificationResult.recipientEncryptedCommunicationSecretKey,
      recipientDidData.keys.encryptionKeyPair.private,
      Cryptography.NODE
    );

    const decryptedRequestorContractKey = await decryptPayload(
      communicationContractVerificationResult.requestorEncryptedCommunicationSecretKey,
      requestorDidData.keys.encryptionKeyPair.private,
      Cryptography.BROWSER
    );

    expect(decryptedRecipientContractKey.plaintext.toString()).toStrictEqual(
      secretContractKey
    );
    expect(decryptedRequestorContractKey.plaintext.toString()).toStrictEqual(
      secretContractKey
    );
  });

  it('should fail communication contract request verification if it has expired', async () => {
    const secretContractKey = nodeUtils.randomBytesHex();

    const expiredCommunicationContractRequest =
      await generateCommunicationContractSignatureRequest(
        requestorDidData,
        recipientDidData.did,
        secretContractKey,
        Cryptography.BROWSER,
        Date.now() / 1000 - 1
      );

    await expect(
      verifyCommunicationContractSignatureRequest(
        expiredCommunicationContractRequest,
        Cryptography.NODE
      )
    ).rejects.toThrowError(
      'Communication contract request invalid: Contract has expired.'
    );
  });

  it('should fail communication contract signature if it has expired', async () => {
    const secretContractKey = nodeUtils.randomBytesHex();

    const communicationContractRequest =
      await generateCommunicationContractSignatureRequest(
        requestorDidData,
        recipientDidData.did,
        secretContractKey,
        Cryptography.BROWSER,
        Date.now() / 1000 - 1
      );

    await expect(
      signCommunicationContract(
        communicationContractRequest,
        recipientDidData,
        Cryptography.NODE
      )
    ).rejects.toThrowError(
      'Communication contract request invalid: Contract has expired.'
    );
  });
});
