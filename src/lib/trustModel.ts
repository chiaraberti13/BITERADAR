import type { ParsedEmail } from '../types';

/**
 * Trust model (pure logic — see docs/ROADMAP.md §"Come si stabilisce il confine di fiducia").
 *
 * Only the `Authentication-Results` added by the trusted recipient count; everything
 * below the trust boundary is "reported, not verifiable". Conflicting authentication
 * headers are flagged as a possible forgery. Based on RFC 8601 and RFC 8617 (ARC).
 *
 * Fase 1 implements this; for now it is a typed placeholder.
 */

export interface TrustBoundary {
  /** authserv-id of the identified trusted recipient, if any. */
  trustedAuthServId: string | null;
  /** Whether a recipient Authentication-Results header was found. */
  hasRecipientAuthResults: boolean;
}

export function identifyTrustBoundary(_email: ParsedEmail): TrustBoundary {
  // TODO(Fase 1): identify the recipient (first Received, Delivered-To, known
  // authserv-ids) and keep only the auth results above the entry hop.
  return { trustedAuthServId: null, hasRecipientAuthResults: false };
}
