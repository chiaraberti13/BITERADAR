import type { Scenario } from './dailyChallenge';
import type { Localized } from '../types';
export function validScenario(s: unknown): s is Scenario {
  if (!s || typeof s !== 'object') return false;
  const row = s as Record<string, unknown>;
  return (
    typeof row.id === 'string' &&
    row.id.length > 0 &&
    row.id.length <= 64 &&
    [1, 2, 3].includes(Number(row.level)) &&
    typeof row.level === 'number' &&
    ['legitimate', 'phishing', 'verify-elsewhere'].includes(String(row.answer)) &&
    ['title', 'observed', 'whyItMatters', 'safeAction', 'whatYouCannotConclude'].every((k) => {
      const v = row[k] as Record<string, unknown> | null;
      return v && ['it', 'en'].every((l) => typeof v[l] === 'string' && v[l].length > 0 && v[l].length <= 4000);
    })
  );
}

export function validSet(data: unknown): data is Scenario[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.length <= 80 &&
    data.every(validScenario) &&
    new Set(data.map((s) => s.id)).size === data.length
  );
}
export interface Collection {
  title: Localized;
  scenarios: Scenario[];
}
export const collections = Object.values(
  import.meta.glob<Collection>('../../community/sets/*.json', { eager: true, import: 'default' })
);
