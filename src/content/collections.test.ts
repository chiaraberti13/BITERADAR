import { expect, it } from 'vitest';
import { collections, validSet } from './collections';
it('loads reviewable bilingual sets with unique scenario identifiers', () => {
  expect(collections.length).toBeGreaterThan(0);
  const ids = [];
  for (const set of collections) {
    expect(set.title.it.trim()).toBeTruthy();
    expect(set.title.en.trim()).toBeTruthy();
    expect(validSet(set.scenarios)).toBe(true);
    ids.push(...set.scenarios.map((s) => s.id));
  }
  expect(new Set(ids).size).toBe(ids.length);
});
it('rejects incomplete or duplicated imported records', () => {
  const s = collections[0].scenarios[0];
  expect(validSet([s, s])).toBe(false);
  expect(validSet([{ ...s, safeAction: { it: '', en: 'Call' } }])).toBe(false);
  expect(validSet(null)).toBe(false);
});
