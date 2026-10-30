import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnalysisResult, Language, Theme } from './types';

/**
 * Global in-memory state.
 *
 * Privacy by design: the current analysis (which is derived from the user's email) is
 * kept only in memory and never persisted. This store is the ONLY place allowed to use
 * localStorage, and only for the versioned, allowlisted UI preferences below — language
 * and theme. No email content is ever written to any storage. See CONTRIBUTING.md and
 * eslint.config.js for the enforced boundary.
 */

interface Preferences {
  language: Language;
  theme: Theme;
}

interface State extends Preferences {
  /** Transient: cleared by "Cancella analisi" and never persisted. */
  analysis: AnalysisResult | null;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  setAnalysis: (analysis: AnalysisResult | null) => void;
  clearAnalysis: () => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      language: 'it',
      theme: 'dark',
      analysis: null,
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setAnalysis: (analysis) => set({ analysis }),
      clearAnalysis: () => set({ analysis: null })
    }),
    {
      name: 'biteradar.preferences',
      version: 1,
      // Allowlist: only UI preferences are persisted; the analysis stays in memory.
      partialize: (state): Preferences => ({ language: state.language, theme: state.theme })
    }
  )
);
