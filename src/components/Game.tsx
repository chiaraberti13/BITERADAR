import { useState } from 'react';
import { SCENARIOS, dailyScenario, type GameAnswer, type Scenario } from '../content/dailyChallenge';
import { download } from '../report/download';
import type { Language } from '../types';
const answers: GameAnswer[] = ['legitimate', 'phishing', 'verify-elsewhere'];
export function Game({ lang, custom = [] }: { lang: Language; custom?: Scenario[] }) {
  const t = (it: string, en: string) => (lang === 'it' ? it : en);
  const [mode, setMode] = useState('practice'),
    [level, setLevel] = useState(1),
    [index, setIndex] = useState(0),
    [picks, setPicks] = useState<GameAnswer[]>([]),
    [day, setDay] = useState(() => new Date()),
    [notice, setNotice] = useState('');
  const pool =
    mode === 'daily'
      ? [dailyScenario(day)!]
      : mode === 'campaign'
        ? [...SCENARIOS.slice(0, 3), ...SCENARIOS.slice(8, 11), ...SCENARIOS.slice(18, 21)]
        : mode === 'custom'
          ? custom
          : SCENARIOS.filter((s) => s.level === level);
  const s = pool[index],
    picked = picks[index],
    complete = index >= pool.length;
  const score = picks.filter((p, i) => p === pool[i]?.answer).length;
  const labels = [
    t('Legittima', 'Legitimate'),
    t('Phishing', 'Phishing'),
    t('Verifico tramite un altro canale', 'Verify through another channel')
  ];
  const share =
    'BiteRadar · ' +
    (mode === 'daily' ? 'Daily ' + day.toISOString().slice(0, 10) : mode + ' ' + level) +
    ' · ' +
    score +
    '/' +
    pool.length;
  function restart(m: string, l = level) {
    setMode(m);
    setLevel(l);
    setPicks([]);
    setIndex(0);
    setDay(new Date());
    setNotice('');
  }
  async function card() {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="480"><rect width="100%" height="100%" fill="#102022"/><circle cx="840" cy="30" r="230" fill="none" stroke="#397974" stroke-width="3"/><text x="60" y="185" font-family="sans-serif" font-size="68" fill="#e9fff3">Spot the Phish</text><text x="60" y="280" font-family="sans-serif" font-size="30" fill="#88ebc7">' +
      share +
      '</text></svg>';
    const img = new Image(),
      url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    try {
      img.src = url;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = 960;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw Error();
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((b) => {
        if (b) download(b, 'biteradar-score.png');
      }, 'image/png');
    } catch {
      setNotice(t('Immagine non disponibile.', 'Image unavailable.'));
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  return (
    <>
      <header className="intro">
        <h1>Spot the Phish</h1>
        <p>
          {t(
            'Leggi il caso, scegli come agire e confronta il tuo ragionamento con le evidenze.',
            'Read the case, choose how to act and compare your reasoning with the evidence.'
          )}
        </p>
      </header>
      <div className="game-layout">
        <aside className="card">
          <h2>{t('Modalità', 'Mode')}</h2>
          {[
            ['practice', t('Allenamento', 'Practice')],
            ['daily', t('Sfida del giorno', 'Daily challenge')],
            ['campaign', t('Campagna awareness', 'Awareness campaign')],
            ...(custom.length ? [['custom', t('Set del formatore', 'Trainer set')]] : [])
          ].map(([k, v]) => (
            <button className="choice" key={k} aria-pressed={mode === k} onClick={() => restart(k)}>
              {v}
            </button>
          ))}
          {mode === 'practice' && (
            <label>
              {t('Difficoltà', 'Difficulty')}
              <select value={level} onChange={(e) => restart(mode, +e.target.value)}>
                {[1, 2, 3].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
          )}
        </aside>
        <section className="card game-card">
          {complete ? (
            <>
              <h2>{t('Sessione completata', 'Session complete')}</h2>
              <p className="score">
                {score} / {pool.length}
              </p>
              {mode === 'campaign' && (
                <p>
                  {t('Badge · Campagna completata', 'Badge · Campaign complete')}
                  <br />
                  Pre: {picks.slice(0, 3).filter((p, i) => p === pool[i].answer).length}/3 · Post:{' '}
                  {picks.slice(6).filter((p, i) => p === pool[i + 6].answer).length}/3
                </p>
              )}
              <button onClick={() => restart(mode)}>{t('Ricomincia', 'Restart')}</button>
            </>
          ) : (
            <>
              <small>
                {mode === 'daily'
                  ? day.toISOString().slice(0, 10)
                  : mode === 'campaign'
                    ? ['Pre-test', t('Allenamento', 'Practice'), 'Post-test'][Math.floor(index / 3)]
                    : t('Scenario', 'Scenario')}{' '}
                · {index + 1}/{pool.length}
              </small>
              <h2>{s.title[lang]}</h2>
              <blockquote>{s.observed[lang]}</blockquote>
              {answers.map((a, i) => (
                <button
                  className="choice"
                  key={a}
                  disabled={!!picked}
                  aria-pressed={picked === a}
                  onClick={() => setPicks([...picks, a])}
                >
                  {labels[i]}
                </button>
              ))}
              {picked && (
                <div aria-live="polite">
                  {(mode !== 'campaign' || index >= 3) && (
                    <>
                      <h3>
                        {t('Risposta motivata', 'Reasoned answer')} · {labels[answers.indexOf(s.answer)]}
                      </h3>
                      <p>{s.whyItMatters[lang]}</p>
                      <p>{s.whatYouCannotConclude[lang]}</p>
                      <p>
                        <strong>{s.safeAction[lang]}</strong>
                      </p>
                    </>
                  )}
                  <button className="primary" onClick={() => setIndex(index + 1)}>
                    {index + 1 === pool.length ? t('Vedi risultato', 'View result') : t('Prossimo caso', 'Next case')} →
                  </button>
                </div>
              )}
            </>
          )}
          {complete && (
            <>
              <pre>{share}</pre>
              <div className="actions">
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(share);
                      setNotice(t('Copiato', 'Copied'));
                    } catch {
                      setNotice(t('Copia il testo qui sopra.', 'Copy the text above.'));
                    }
                  }}
                >
                  {t('Copia risultato', 'Copy result')}
                </button>
                <button onClick={() => void card()}>PNG ↓</button>
              </div>
              <p role="status">{notice}</p>
            </>
          )}
        </section>
      </div>
    </>
  );
}
