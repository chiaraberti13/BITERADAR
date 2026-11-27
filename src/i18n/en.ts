import type { UiMessages } from './it';

/** English UI copy. TypeScript requires the exact same key shape as the Italian catalog. */
export const en: UiMessages = {
  app: {
    tagline:
      'Understand what an email proves, what it hides and what you still need to check — without uploading it anywhere.',
    skipToContent: 'Skip to content',
    scaffoldingNotice: 'Project in scaffolding phase — follow the roadmap.',
    footer: 'Analysis assistant · © 2026 Chiara Berti'
  },
  nav: {
    analyzer: 'Analyzer',
    game: 'Spot the Phish',
    language: 'Language',
    theme: 'Theme'
  },
  outcome: {
    strongRisk: 'Strong risk signals',
    suspicious: 'Suspicious elements to verify',
    noSignal: 'No obvious signals detected',
    insufficientData: 'Insufficient data',
    notSafeDisclaimer: 'This does not guarantee the email is authentic.'
  },
  coverage: {
    title: 'Analysis coverage'
  }
};
