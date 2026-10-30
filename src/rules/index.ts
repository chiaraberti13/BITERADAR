import type { Rule } from '../types';

/**
 * Rule catalogue (data, not code).
 *
 * Adding a signal means adding a Rule here, never changing the engine. Each rule
 * documents evidence → interpretation → severity → limits → legitimate explanations.
 * See docs/ROADMAP.md §"Motore di regole e scoring" for the full v1.0 rule set.
 */

/** Example rule (DMARC fail on the From domain, from a trusted recipient). */
export const dmarcFailAligned: Rule = {
  id: 'auth.dmarc.fail',
  version: 1,
  correlationGroup: 'auth-from-domain', // related signals: only the most severe counts
  severity: 'high',
  evidence: {
    it: 'L’Authentication-Results del ricevente riporta dmarc=fail per il dominio nel campo From.',
    en: "The recipient's Authentication-Results reports dmarc=fail for the From domain."
  },
  interpretation: {
    it: 'Il dominio mostrato come mittente non ha autorizzato questo messaggio.',
    en: 'The domain shown as sender did not authorise this message.'
  },
  limits: {
    it: 'Se l’header non proviene dal ricevente fidato, il risultato non è verificabile.',
    en: 'If the header does not come from the trusted recipient, the result cannot be verified.'
  },
  legitimateExplanations: {
    it: ['Inoltro automatico', 'Mailing list che modifica il messaggio'],
    en: ['Automatic forwarding', 'Mailing list that modifies the message']
  }
};

/** Registry consumed by the scoring engine. Grows along the roadmap. */
export const RULES: Rule[] = [dmarcFailAligned];
