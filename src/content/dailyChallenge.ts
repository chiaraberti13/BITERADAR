import type { Localized } from '../types';

/**
 * "Spot the Phish" scenarios and the Daily Challenge (data, bilingual, FICTITIOUS).
 *
 * All scenarios use invented or parodic brands, logos and people — never a real
 * organisation. Three answers are possible: legitimate, phishing, or "I can't tell:
 * verify through another channel". The Daily Challenge picks one email per day,
 * identically for everyone, deterministically from the UTC date over a static pool
 * (no backend), with a spoiler-free shareable result.
 *
 * Fase 3 builds this out; for now it is a typed placeholder.
 */

export type GameAnswer = 'legitimate' | 'phishing' | 'verify-elsewhere';

export interface Scenario {
  id: string;
  observed: Localized;
  whyItMatters: Localized;
  whatYouCannotConclude: Localized;
  safeAction: Localized;
  answer: GameAnswer;
}

export const SCENARIOS: Scenario[] = [];

/** Deterministic pick from the static pool by UTC date. */
export function dailyScenario(_utcDate: Date, pool: Scenario[] = SCENARIOS): Scenario | null {
  // TODO(Fase 3): hash the UTC date to an index over the pool.
  return pool[0] ?? null;
}
