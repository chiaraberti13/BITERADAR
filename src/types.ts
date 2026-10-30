/**
 * Shared type contracts for BiteRadar.
 *
 * Evidence-first data model (see docs/ROADMAP.md): the parser reports *facts*, the
 * trust model decides whether a fact is *verifiable*, the rules produce *derivations*,
 * and the outcome is a *motivated hypothesis* with declared coverage.
 */

export type Language = 'it' | 'en';

export type Theme = 'dark' | 'light';

/** Localised string: every learner-facing text is bilingual. */
export type Localized = Record<Language, string>;

/** The four analysis outcomes. There is intentionally no "green"/"safe" outcome. */
export type Outcome =
  | 'strong-risk' // 🔴 at least one high-severity signal with trustworthy evidence
  | 'suspicious' // 🟠 medium signals, or high signals on non-verifiable evidence
  | 'no-signal' // ⚪ no significant signal and sufficient coverage
  | 'insufficient-data'; // ❔ coverage below the minimum threshold

export type Severity = 'high' | 'medium' | 'low';

/** How much we can trust the evidence a signal is built on. */
export type EvidenceQuality = 'verified' | 'reported';

/**
 * A rule is data, not code (see src/rules). Each rule documents:
 * evidence → interpretation → severity → evidence quality → limits → legitimate explanations.
 */
export interface Rule {
  id: string;
  /** Engine rule version, independent from the app SemVer. */
  version: number;
  /** Related signals in the same group do not stack; only the most severe counts. */
  correlationGroup?: string;
  severity: Severity;
  evidence: Localized;
  interpretation: Localized;
  limits: Localized;
  legitimateExplanations: Record<Language, string[]>;
}

/** A rule that fired against a parsed message, with the evidence quality in context. */
export interface Signal {
  rule: Rule;
  evidenceQuality: EvidenceQuality;
}

/** What the analysis could and could not look at. Always shown next to the outcome. */
export interface Coverage {
  hasFullHeaders: boolean;
  recipientAuthResults: boolean;
  extractedLinks: number;
  hasHtmlBody: boolean;
  attachmentsAnalyzed: boolean;
  dnsLookupPerformed: boolean;
}

/** Placeholder for the parsed message produced by the Web Worker (see src/worker). */
export interface ParsedEmail {
  headers: Record<string, string[]>;
  from?: string;
  returnPath?: string;
  replyTo?: string;
  textBody?: string;
  htmlBody?: string;
  links: string[];
}

/** The result of an analysis: a motivated hypothesis with declared coverage. */
export interface AnalysisResult {
  outcome: Outcome;
  signals: Signal[];
  coverage: Coverage;
  /** Rule-engine version used, so a report stays reproducible. */
  engineVersion: string;
}
