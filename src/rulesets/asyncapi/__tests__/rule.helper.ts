import { Dictionary } from '@stoplight/types';
import { isAsyncApiv2, Spectral } from '../../..';
import { Rule, SpectralDiagnosticSeverity } from '../../../types';
import { IRuleset } from '../../../types/ruleset';
import { readRuleset } from '../../reader';
import { getDiagnosticSeverity } from '../../severity';

let ruleset: IRuleset;

export const buildSpectralWithRule = async (ruleName: string): Promise<[Spectral, SpectralDiagnosticSeverity]> => {
  if (ruleset === void 0) {
    ruleset = await readRuleset('spectral:asyncapi');
  }

  expect(Object.keys(ruleset.rules)).toContain(ruleName);

  const s = new Spectral();
  s.registerFormat('asyncapi2', isAsyncApiv2);

  const dic: Dictionary<Rule, string> = {};
  const rule = ruleset.rules[ruleName];
  dic[ruleName] = rule;

  if (rule.severity === void 0) {
    throw new Error('Unexpected undefined severity');
  }

  const expectedSeverity = getDiagnosticSeverity(rule.severity);

  expect(expectedSeverity).not.toEqual(-1);

  s.setRules(dic);

  return [s, expectedSeverity];
};
