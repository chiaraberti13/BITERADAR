import type { AnalysisResult, Coverage, ParsedEmail } from '../types';

/**
 * Scoring engine (pure, deterministic, versioned — see docs/ROADMAP.md).
 *
 * Principles: the score is never a probability and never shown as a percentage.
 * Correlation groups mean related signals do not stack. Severity and evidence quality
 * are separate: a high-severity signal on non-verifiable evidence yields 🟠, not 🔴.
 * Below the coverage threshold the outcome is always ❔.
 *
 * Fase 1 implements this; for now it is a typed placeholder.
 */

/** Bump when the rule set or combination logic changes, so reports stay reproducible. */
export const ENGINE_VERSION = '0.1.0';

export function analyze(_email: ParsedEmail, coverage: Coverage): AnalysisResult {
  // TODO(Fase 1): run RULES, apply correlation groups and the coverage threshold.
  return {
    outcome: 'insufficient-data',
    signals: [],
    coverage,
    engineVersion: ENGINE_VERSION
  };
}
