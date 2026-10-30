import { uiMessages } from './i18n';
import { useStore } from './store';

/**
 * Application shell (skeleton).
 *
 * This is a placeholder root while the repository is scaffolded. The Analyzer and the
 * "Spot the Phish" game are built out along docs/ROADMAP.md (Fase 1 and Fase 3).
 */
export default function App() {
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);
  const t = uiMessages(language);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '16px',
        textAlign: 'center'
      }}
    >
      <div style={{ maxWidth: '40rem' }}>
        <p style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
          [ CYBERSECURITY ]
        </p>
        <h1 style={{ fontSize: '2.75rem', margin: '0.25rem 0' }}>BiteRadar</h1>
        <p style={{ color: 'var(--color-ink-secondary)' }}>{t.app.tagline}</p>
        <p style={{ color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          {t.app.scaffoldingNotice}
        </p>
        <button
          type="button"
          onClick={() => setLanguage(language === 'it' ? 'en' : 'it')}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            border: '1px solid var(--color-stroke)',
            background: 'var(--color-surface-subtle)',
            color: 'var(--color-ink-primary)',
            cursor: 'pointer'
          }}
        >
          {t.nav.language}: {language.toUpperCase()}
        </button>
      </div>
    </main>
  );
}
