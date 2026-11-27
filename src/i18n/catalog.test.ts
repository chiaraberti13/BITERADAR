import { describe, expect, it } from 'vitest';
import { en } from './en';
import { it as itCatalog } from './it';

/**
 * The Italian and English UI catalogs must stay in lockstep: same key structure and no
 * empty strings. TypeScript already enforces the shape of `en` against `it`; this guards
 * against drift in nested keys and placeholder/empty values.
 */
type Catalog = Record<string, Record<string, string>>;

describe('UI catalogs', () => {
  it('expose the same sections and keys in both languages', () => {
    const itc = itCatalog as unknown as Catalog;
    const enc = en as unknown as Catalog;
    expect(Object.keys(enc).sort()).toEqual(Object.keys(itc).sort());
    for (const section of Object.keys(itc)) {
      expect(Object.keys(enc[section]).sort(), section).toEqual(Object.keys(itc[section]).sort());
    }
  });

  it('has no empty strings', () => {
    for (const catalog of [itCatalog, en] as unknown as Catalog[]) {
      for (const section of Object.keys(catalog)) {
        for (const key of Object.keys(catalog[section])) {
          expect(catalog[section][key].trim().length, `${section}.${key}`).toBeGreaterThan(0);
        }
      }
    }
  });
});
