/// <reference lib="webworker" />
import type { ParsedEmail } from '../types';

/**
 * Email parsing Web Worker (see docs/ROADMAP.md §"Isolamento dei contenuti ostili").
 *
 * All email content is treated as hostile. Parsing runs here, off the main thread, with
 * resource limits (max file size, MIME nesting depth, number of parts, timeout). On
 * limit breach the worker fails gently and the outcome becomes ❔. `.eml` is parsed with
 * postal-mime; `.msg` support (Fase 2) runs here too with the same limits.
 *
 * Fase 1 implements this; for now it is a typed placeholder.
 */

export interface ParseRequest {
  kind: 'eml' | 'headers';
  raw: string;
}

export type ParseResponse = { ok: true; email: ParsedEmail } | { ok: false; error: string };

// TODO(Fase 1): wire postal-mime and enforce the resource limits, then postMessage a ParseResponse.
export {};
