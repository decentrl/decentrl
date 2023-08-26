// import { DidData } from '../did/did.interfaces';
// import {
//   DidDocument,
// } from '../did-document/did-document.interfaces';
// import { generateDid } from '../did/did';
// import {
//   generateCommunicationContractSignatureRequest,
//   signCommunicationContract,
//   verifyCommunicationContract,
//   verifyCommunicationContractSignatureRequest,
// } from './communication-contract';
// import * as didDocumentUtils from '../did-document/did-document';

// // eslint-disable-next-line @nx/enforce-module-boundaries
// import * as nodeUtils from '@decentrl/utils/node';

// import { when } from 'jest-when';
// import { decryptPayload } from '../crypto/ecdh';

// const domain = 'registry.decentrl.network';

// describe('Communication Contract', () => {
//   let requestorDidData: DidData;
//   let requestorDidDocument: DidDocument;
//   let recipientDidData: DidData;
//   let recipientDidDocument: DidDocument;

//   beforeAll(async () => {
//     requestorDidData = await generateDid(
//       domain,
//       nodeUtils.generateP256ECDHKeyPair,
//       nodeUtils.generateP256KeyPair
//     );

//     requestorDidDocument =
//       didDocumentUtils.generateDidDocument(requestorDidData);

//     recipientDidData = await generateDid(
//       domain,
//       nodeUtils.generateP256ECDHKeyPair,
//       nodeUtils.generateP256KeyPair
//     );

//     recipientDidDocument =
//       didDocumentUtils.generateDidDocument(recipientDidData);

//     const webDidResolverSpy = jest.spyOn(
//       didDocumentUtils,
//       'resolveDidDocument'
//     );

//     when(webDidResolverSpy)
//       .calledWith(requestorDidData.did)
//       .mockResolvedValue({
//         didDocument: requestorDidDocument,
//       } as any);

//     when(webDidResolverSpy)
//       .calledWith(recipientDidData.did)
//       .mockResolvedValue({
//         didDocument: recipientDidDocument,
//       } as any);
//   });

//   it('should generate communication contract request and sign it', async () => {
//     const secretContractKey = nodeUtils.randomBytesHex();

//     const signedCommunicationContractRequest =
//       await generateCommunicationContractSignatureRequest(
//         requestorDidData,
//         recipientDidData.did,
//         secretContractKey
//       );

//     const communicationContractRequestVerificationResult =
//       await verifyCommunicationContractSignatureRequest(
//         signedCommunicationContractRequest
//       );

//     expect(communicationContractRequestVerificationResult).toStrictEqual({
//       requestorDidDocument,
//       communicationContractRequest: {
//         requestorDid: requestorDidData.did,
//         requestorPublicSigningKeyId: `${requestorDidData.did}#${requestorDidData.keys.signingKeyPair.public.kid}`,
//         recipientDid: recipientDidData.did,
//         recipientPublicSigningKeyId: `${recipientDidData.did}#${recipientDidData.keys.signingKeyPair.public.kid}`,
//         recipientEncryptedCommunicationSecretKey: expect.any(String),
//       },
//     });

//     const signedCommunicationContract = await signCommunicationContract(
//       signedCommunicationContractRequest,
//       recipientDidData
//     );

//     const communicationContractVerificationResult =
//       await verifyCommunicationContract(signedCommunicationContract);

//     expect(communicationContractVerificationResult).toStrictEqual({
//       requestorDidDocument,
//       recipientDidDocument,
//       communicationContract: {
//         requestorSignature: signedCommunicationContractRequest,
//         requestorEncryptedCommunicationSecretKey: expect.any(String),
//       },
//       recipientEncryptedCommunicationSecretKey: expect.any(String),
//       requestorEncryptedCommunicationSecretKey: expect.any(String),
//     });

//     const decryptedRecipientContractKey = await decryptPayload(
//       recipientDidData.keys.encryptionKeyPair.private,
//       communicationContractVerificationResult.recipientEncryptedCommunicationSecretKey
//     );

//     const decryptedRequestorContractKey = await decryptPayload(
//       requestorDidData.keys.encryptionKeyPair.private,
//       communicationContractVerificationResult.requestorEncryptedCommunicationSecretKey
//     );

//     expect(decryptedRecipientContractKey).toStrictEqual(secretContractKey);
//     expect(decryptedRequestorContractKey).toStrictEqual(secretContractKey);
//   });

//   it('should fail communication contract request verification if it has expired', async () => {
//     const secretContractKey = nodeUtils.randomBytesHex();

//     const expiredCommunicationContractRequest =
//       await generateCommunicationContractSignatureRequest(
//         requestorDidData,
//         recipientDidData.did,
//         secretContractKey,
//         Date.now() / 1000 - 1
//       );

//     await expect(
//       verifyCommunicationContractSignatureRequest(
//         expiredCommunicationContractRequest
//       )
//     ).rejects.toThrowError(
//       'Communication contract request invalid: Contract has expired.'
//     );
//   });

//   it('should fail communication contract verification if it has expired', async () => {
//     const secretContractKey = nodeUtils.randomBytesHex();

//     const communicationContractRequest =
//       await generateCommunicationContractSignatureRequest(
//         requestorDidData,
//         recipientDidData.did,
//         secretContractKey
//       );

//     const expiredCommunicationContract = await signCommunicationContract(
//       communicationContractRequest,
//       recipientDidData,
//       Date.now() / 1000 - 1
//     );

//     await expect(
//       verifyCommunicationContract(expiredCommunicationContract)
//     ).rejects.toThrowError(
//       'Communication contract invalid: Contract has expired.'
//     );
//   });
// });
