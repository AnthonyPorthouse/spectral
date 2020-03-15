import { cloneDeep } from 'lodash';

import { Spectral, SpectralDiagnosticSeverity } from '../../../spectral';
import { buildSpectralWithRule } from './rule.helper';

const ruleName = 'asyncapi-contact-properties';
let s: Spectral;
let expectedSeverity: SpectralDiagnosticSeverity;

describe(`Rule '${ruleName}'`, () => {
  beforeAll(async () => {
    [s, expectedSeverity] = await buildSpectralWithRule(ruleName);
  });

  const doc = {
    asyncapi: '2.0.0',
    info: {
      contact: {
        name: 'stoplight',
        url: 'stoplight.io',
        email: 'support@stoplight.io',
      },
    },
  };

  test('validates a correct object', async () => {
    const results = await s.run(doc, { ignoreUnknownFormat: false });

    expect(results).toEqual([]);
  });

  test.each(['name', 'url', 'email'])('return result if contact.%s property is missing', async (property: string) => {
    const clone = cloneDeep(doc);

    delete clone.info.contact[property];

    const results = await s.run(clone, { ignoreUnknownFormat: false });

    expect(results).toEqual([
      expect.objectContaining({
        code: ruleName,
        message: 'Contact object should have `name`, `url` and `email`.',
        path: ['info', 'contact'],
        severity: expectedSeverity,
      }),
    ]);
  });
});
