import { useEffect, useState } from 'react';
import { useStore } from './store';
import { uiMessages } from './i18n';
import { Analyzer } from './components/Analyzer';
import { Game } from './components/Game';
import { Guide } from './components/Guide';
import { Trainer } from './components/Trainer';
import type { Scenario } from './content/dailyChallenge';

export default function App() {
  const { language: lang, theme, setTheme, setLanguage } = useStore();
  const [route, setRoute] = useState(() => location.hash.slice(1) || 'analyzer');
  const [custom, setCustom] = useState<Scenario[]>([]);
  useEffect(() => {
    const onHash = () => setRoute(location.hash.slice(1) || 'analyzer');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
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
          <a className="brand" href="#analyzer">
            <img src="/favicon.svg" alt="" width="38" height="38" />
            Bite<span>Radar</span>
          </a>
          <nav aria-label={it ? 'Navigazione principale' : 'Main navigation'}>
            {routes.map(([r, label]) => (
              <a key={r} href={'#' + r} aria-current={current === r ? 'page' : undefined}>
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
        </div>
      </header>
      <main id="content" tabIndex={-1}>
        {current === 'analyzer' ? (
          <Analyzer lang={lang} />
        ) : current === 'game' ? (
          <Game lang={lang} custom={custom} />
        ) : current === 'trainer' ? (
          <Trainer lang={lang} custom={custom} onSave={setCustom} />
        ) : (
          <Guide lang={lang} privacy={current === 'privacy'} />
        )}
      </main>
      <footer>
        <span>BiteRadar · {it ? 'Laboratorio di analisi email' : 'Email analysis lab'}</span>
        <a href="#privacy">Privacy</a>
      </footer>
    </>
  );
}
