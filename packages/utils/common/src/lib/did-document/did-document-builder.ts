import {
  DidDocument,
  DidDocumentAssertionMethod,
  DidDocumentAuthentication,
  DidDocumentKeyAgreement,
  DidDocumentService,
  DidDocumentVerificationMethod,
  DidDocumentVerificationMethodType,
} from './did-document.interfaces';
import { Validator } from 'jsonschema';
import {
  verificationMethodSchema,
  didDocumentServiceSchema,
  didDocumentSchema,
} from './did-document.schema';

export class DidDocumentBuilder {
  private didDocument: Partial<DidDocument> = {
    assertionMethod: [],
    verificationMethod: [],
    authentication: [],
    keyAgreement: [],
    alsoKnownAs: [],
    service: [],
  };

  private static readonly CONTEXT_SECURITY_SUITES = new Map<string, string>([
    [
      DidDocumentVerificationMethodType.JsonWebKey2020,
      'https://w3id.org/security/suites/jws-2020/v1',
    ],
  ]);

  /**
   * @url https://www.w3.org/TR/did-spec-registries/#id
   */
  setId(id: string): DidDocumentBuilder {
    this.didDocument.id = id;

    return this;
  }

  setAlias(alias: string): DidDocumentBuilder {
    this.didDocument.alias = alias;

    return this;
  }

  /**
   * @url https://www.w3.org/TR/did-spec-registries/#controller
   */
  addController(controllerId: string): DidDocumentBuilder {
    this.didDocument.controller = controllerId;

    return this;
  }

  /**
   * @url https://www.w3.org/TR/did-spec-registries/#alsoknownas
   */
  addAlsoKnownAs(alsoKnownAs: string): DidDocumentBuilder {
    if (!this.didDocument.alsoKnownAs) {
      this.didDocument.alsoKnownAs = [alsoKnownAs];
    } else {
      this.didDocument.alsoKnownAs.push(alsoKnownAs);
    }

    return this;
  }

  /**
   * @url https://www.w3.org/TR/did-spec-registries/#verificationmethod
   */
  addVerificationMethod(
    verificationMethod: DidDocumentVerificationMethod
  ): DidDocumentBuilder {
    if (!this.didDocument.verificationMethod) {
      this.didDocument.verificationMethod = [verificationMethod];
    } else {
      this.didDocument.verificationMethod.push(verificationMethod);
    }

    return this;
  }

  /**
   * @url https://www.w3.org/TR/did-spec-registries/#authentication
   */
  addAuthentication(
    authentication: DidDocumentAuthentication
  ): DidDocumentBuilder {
    if (!this.didDocument.authentication) {
      this.didDocument.authentication = [authentication];
    } else {
      this.didDocument.authentication.push(authentication);
    }

    return this;
  }

  /**
   * @url https://www.w3.org/TR/did-spec-registries/#assertionmethod
   */
  addAssertionMethod(
    assertionMethod: DidDocumentAssertionMethod
  ): DidDocumentBuilder {
    if (!this.didDocument.assertionMethod) {
      this.didDocument.assertionMethod = [assertionMethod];
    } else {
      this.didDocument.assertionMethod.push(assertionMethod);
    }

    return this;
  }

  /**
   * @url https://www.w3.org/TR/did-spec-registries/#keyagreement
   */
  addKeyAgreement(keyAgreement: DidDocumentKeyAgreement): DidDocumentBuilder {
    if (!this.didDocument.keyAgreement) {
      this.didDocument.keyAgreement = [keyAgreement];
    } else {
      this.didDocument.keyAgreement.push(keyAgreement);
    }

    return this;
  }

  /**
   * @url https://www.w3.org/TR/did-spec-registries/#service-properties
   */
  addServiceEndpoint(service: DidDocumentService): DidDocumentBuilder {
    if (!this.didDocument.service) {
      this.didDocument.service = [service];
    } else {
      this.didDocument.service.push(service);
    }

    return this;
  }

  generateContext(): string[] {
    const baseContext = new Set(['https://www.w3.org/ns/did/v1']);

    const keys = [
      ...this.didDocument.verificationMethod ?? [],
      ...this.didDocument.authentication ?? [],
      ...this.didDocument.assertionMethod ?? [],
      ...this.didDocument.keyAgreement ?? [],
    ];

    keys.forEach((key) => {
      if (typeof key === 'string' || baseContext.has(key.type)) {
        return;
      }

      const contextSecuritySuite: string | undefined =
        DidDocumentBuilder.CONTEXT_SECURITY_SUITES.get(key.type);

      if (contextSecuritySuite) {
        baseContext.add(contextSecuritySuite);
      } else {
        console.log('Undefined context security suite');
      }
    });

    return Array.from(baseContext);
  }

  validate(): DidDocumentBuilder {
    const uniqueKeyIds = new Set<string>();

    const keys = [
      ...this.didDocument.verificationMethod ?? [],
      ...this.didDocument.authentication ?? [],
      ...this.didDocument.assertionMethod ?? [],
      ...this.didDocument.keyAgreement ?? [],
    ];

    keys.forEach((key) => {
      if (typeof key === 'string') {
        return;
      }

      if (uniqueKeyIds.has(key.id)) {
        throw new Error(`Key: ${key.id} is not unique`);
      }

      uniqueKeyIds.add(key.id);
    });

    return this;
  }

  load(didDocument: DidDocument): DidDocumentBuilder {
    const validator = new Validator();

    validator.addSchema(verificationMethodSchema, '/VerificationMethod');
    validator.addSchema(didDocumentServiceSchema, '/DidDocumentService');
    validator.validate(didDocument, didDocumentSchema, {
      throwError: true,
    });

    this.didDocument = didDocument;

    return this;
  }

  build(): DidDocument {
    const context = this.generateContext();

    if (this.didDocument.id === undefined) {
      throw new Error('Id is required');
    }

    return {
      '@context': context,
      ...this.didDocument,
    } as DidDocument;
  }
}
