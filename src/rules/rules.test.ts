import { describe, expect, it } from 'vitest';
import { RULES } from './index';

/**
 * Integrity of the rule catalogue (data, not code). Every rule must carry complete
 * bilingual evidence/interpretation/limits and both-language legitimate explanations,
 * and ids must be unique so correlation and reporting stay deterministic.
 */
describe('RULES catalogue', () => {
  it('has at least one rule', () => {
    expect(RULES.length).toBeGreaterThan(0);
  });

  it('uses unique rule ids', () => {
    const ids = RULES.map((rule) => rule.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('declares complete bilingual content for every rule', () => {
    for (const rule of RULES) {
      for (const field of ['evidence', 'interpretation', 'limits'] as const) {
        expect(rule[field].it.trim().length, `${rule.id} ${field}.it`).toBeGreaterThan(0);
        expect(rule[field].en.trim().length, `${rule.id} ${field}.en`).toBeGreaterThan(0);
      }
      expect(rule.legitimateExplanations.it.length, `${rule.id} legit.it`).toBe(rule.legitimateExplanations.en.length);
    }
  });

  it('uses only known severities', () => {
    for (const rule of RULES) {
      expect(['high', 'medium', 'low']).toContain(rule.severity);
    }
  });
});
