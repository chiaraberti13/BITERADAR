/**
 * Canonical Italian UI copy. Content datasets (rules, scenarios) keep their own
 * bilingual domain models; this catalog is for repeated application chrome.
 */
export const it = {
  app: {
    tagline: 'Capisci cosa un’email dimostra, cosa nasconde e cosa devi verificare — senza caricarla su un server.',
    skipToContent: 'Vai al contenuto',
    scaffoldingNotice: 'Progetto in fase di scaffolding — segui la roadmap.',
    footer: 'Assistente all’analisi · © 2026 Chiara Berti'
  },
  nav: {
    analyzer: 'Analizzatore',
    game: 'Spot the Phish',
    language: 'Lingua',
    theme: 'Tema'
  },
  outcome: {
    strongRisk: 'Segnali forti di rischio',
    suspicious: 'Elementi sospetti da verificare',
    noSignal: 'Nessun segnale evidente rilevato',
    insufficientData: 'Dati insufficienti',
    notSafeDisclaimer: 'Questo non garantisce che l’email sia autentica.'
  },
  coverage: {
    title: 'Copertura dell’analisi'
  }
};

export type UiMessages = typeof it;
