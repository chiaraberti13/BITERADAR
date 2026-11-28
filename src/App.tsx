import { lazy, Suspense, useEffect, useState } from 'react';
import { useStore } from './store';
import { uiMessages } from './i18n';
import { Analyzer } from './components/Analyzer';
const Game = lazy(() => import('./components/Game').then((m) => ({ default: m.Game })));
const Guide = lazy(() => import('./components/Guide').then((m) => ({ default: m.Guide })));
const Trainer = lazy(() => import('./components/Trainer').then((m) => ({ default: m.Trainer })));
import type { Scenario } from './content/dailyChallenge';

export default function App() {
  const { language: lang, theme, setTheme, setLanguage } = useStore();
  const [route, setRoute] = useState(() => location.hash.slice(1) || 'analyzer');
  const [custom, setCustom] = useState<Scenario[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onHash = () => {
      setRoute(location.hash.slice(1) || 'analyzer');
      setMenuOpen(false);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.theme = theme;
  }, [lang, theme]);
  const it = lang === 'it',
    t = uiMessages(lang);
  const routes = [
    ['analyzer', t.nav.analyzer],
    ['game', 'Spot the Phish'],
    ['guide', it ? 'Guida' : 'Guide'],
    ['trainer', it ? 'Formatori' : 'Trainers']
  ];
  const current = routes.some(([r]) => r === route) || route === 'privacy' ? route : 'analyzer';
  return (
    <>
      <a
        className="skip"
        href="#content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('content')?.focus();
        }}
      >
        {t.app.skipToContent}
      </a>
      <header className="mast">
        <div className="bar">
          <a className="brand" href="#analyzer" onClick={() => setMenuOpen(false)}>
            <img src="/favicon.svg" alt="" width="38" height="38" />
            Bite<span>Radar</span>
          </a>
          <nav
            id="primary-nav"
            className={'primary-nav' + (menuOpen ? ' open' : '')}
            aria-label={it ? 'Navigazione principale' : 'Main navigation'}
          >
            {routes.map(([r, label]) => (
              <a
                key={r}
                href={'#' + r}
                aria-current={current === r ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="prefs">
            <button
              onClick={() => setLanguage(it ? 'en' : 'it')}
              aria-label={it ? 'Switch to English' : 'Passa all’italiano'}
            >
              {it ? 'EN' : 'IT'}
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? (it ? 'Tema chiaro' : 'Light theme') : it ? 'Tema scuro' : 'Dark theme'}
            >
              {theme === 'dark' ? '☼' : '☾'}
            </button>
          </div>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label={menuOpen ? (it ? 'Chiudi il menu' : 'Close menu') : it ? 'Apri il menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </header>
      <main id="content" tabIndex={-1}>
        <Suspense fallback={<p role="status">{it ? 'Caricamento…' : 'Loading…'}</p>}>
          {current === 'analyzer' ? (
            <Analyzer lang={lang} />
          ) : current === 'game' ? (
            <Game lang={lang} custom={custom} />
          ) : current === 'trainer' ? (
            <Trainer lang={lang} custom={custom} onSave={setCustom} />
          ) : (
            <Guide lang={lang} privacy={current === 'privacy'} />
          )}
        </Suspense>
      </main>
      <footer>
        <span>BiteRadar · {it ? 'Laboratorio di analisi email' : 'Email analysis lab'}</span>
        <a href="#privacy">Privacy</a>
      </footer>
    </>
  );
}
