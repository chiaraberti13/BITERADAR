import type { AnalysisResult } from '../types';

/**
 * Report export with escaping and redaction (see docs/ROADMAP.md §"Privacy, rete e report").
 *
 * A report can contain addresses, IPs, subjects and tokens in links. Export therefore
 * requires a mandatory preview, field selection, automatic redaction (recipients,
 * RFC 1918 IPs in Received, URL query-string parameters) plus manual redaction, and
 * escapes subjects/names/URLs to prevent Markdown/HTML injection in the generated file.
 *
 * Fase 1 implements this; for now it is a typed placeholder.
 */

export interface RedactionOptions {
  redactRecipients: boolean;
  redactPrivateIps: boolean;
  redactUrlQueryParams: boolean;
}

export const DEFAULT_REDACTION: RedactionOptions = {
  redactRecipients: true,
  redactPrivateIps: true,
  redactUrlQueryParams: true
};

export function toMarkdown(_result: AnalysisResult, _options: RedactionOptions = DEFAULT_REDACTION): string {
  // TODO(Fase 1): render the outcome, coverage and evidence with escaping and redaction.
  return '';
}
