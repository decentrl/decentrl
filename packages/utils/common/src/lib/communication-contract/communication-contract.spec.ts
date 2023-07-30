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
import { when } from 'jest-when';

const domain = 'registry.decentrl.network';

describe('Communication Contract', () => {
  let requestorDidData: DidData;
  let requestorDidDocument: DidDocument;
  let recipientDidData: DidData;
  let recipientDidDocument: DidDocument;

  beforeAll(async () => {
    requestorDidData = await generateDid(
      domain,
      nodeUtils.generateP256ECDHKeyPair,
      nodeUtils.generateP256KeyPair
    );

    requestorDidDocument =
      didDocumentUtils.generateDidDocument(requestorDidData);

    recipientDidData = await generateDid(
      domain,
      nodeUtils.generateP256ECDHKeyPair,
      nodeUtils.generateP256KeyPair
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
    const signedCommunicationContractRequest =
      await generateCommunicationContractSignatureRequest(
        requestorDidData,
        recipientDidData.did
      );

    const communicationContractRequestVerificationResult =
      await verifyCommunicationContractSignatureRequest(
        signedCommunicationContractRequest
      );

    expect(communicationContractRequestVerificationResult).toStrictEqual({
      requestorDidDocument,
      communicationContractRequest: {
        requestorDid: requestorDidData.did,
        requestorPublicSigningKeyId: `${requestorDidData.did}#${requestorDidData.keys.signingKeyPair.public.kid}`,
        recipientDid: recipientDidData.did,
        recipientPublicSigningKeyId: `${recipientDidData.did}#${recipientDidData.keys.signingKeyPair.public.kid}`,
      },
    });

    const signedCommunicationContract = await signCommunicationContract(
      signedCommunicationContractRequest,
      recipientDidData
    );

    const communicationContractVerificationResult =
      await verifyCommunicationContract(signedCommunicationContract);

    expect(communicationContractVerificationResult).toStrictEqual({
      requestorDidDocument,
      recipientDidDocument,
      communicationContract: {
        requestorSignature: signedCommunicationContractRequest,
      },
    });
  });

  it('should fail communication contract request verification if it has expired', async () => {
    const expiredCommunicationContractRequest =
      await generateCommunicationContractSignatureRequest(
        requestorDidData,
        recipientDidData.did,
        Date.now() / 1000 - 1
      );

    await expect(
      verifyCommunicationContractSignatureRequest(
        expiredCommunicationContractRequest
      )
    ).rejects.toThrowError(
      'Communication contract request invalid: Contract has expired.'
    );
  });

  it('should fail communication contract verification if it has expired', async () => {
    const communicationContractRequest =
      await generateCommunicationContractSignatureRequest(
        requestorDidData,
        recipientDidData.did
      );

    const expiredCommunicationContract = await signCommunicationContract(
      communicationContractRequest,
      recipientDidData,
      Date.now() / 1000 - 1
    );

    await expect(
      verifyCommunicationContract(expiredCommunicationContract)
    ).rejects.toThrowError(
      'Communication contract invalid: Contract has expired.'
    );
  });
});
