import { useState } from 'react';
import { SCENARIOS, type Scenario } from '../content/dailyChallenge';
import type { Language } from '../types';
import { download } from '../report/download';
function validScenario(s: unknown): s is Scenario {
  if (!s || typeof s !== 'object') return false;
  const row = s as Record<string, unknown>;
  return (
    typeof row.id === 'string' &&
    row.id.length > 0 &&
    row.id.length <= 64 &&
    [1, 2, 3].includes(Number(row.level)) &&
    typeof row.level === 'number' &&
    ['legitimate', 'phishing', 'verify-elsewhere'].includes(String(row.answer)) &&
    ['title', 'observed', 'whyItMatters', 'safeAction', 'whatYouCannotConclude'].every((k) => {
      const v = row[k] as Record<string, unknown> | null;
      return v && ['it', 'en'].every((l) => typeof v[l] === 'string' && v[l].length > 0 && v[l].length <= 4000);
    })
  );
}
export function Trainer({
  lang,
  custom,
  onSave
}: {
  lang: Language;
  custom: Scenario[];
  onSave: (s: Scenario[]) => void;
}) {
  const it = lang === 'it',
    [draft, setDraft] = useState(() => JSON.stringify(custom.length ? custom : [SCENARIOS[0]], null, 2)),
    [feedback, setFeedback] = useState('');
  function apply() {
    try {
      const data: unknown = JSON.parse(draft);
      if (
        !Array.isArray(data) ||
        !data.length ||
        data.length > 80 ||
        !data.every(validScenario) ||
        new Set(data.map((x) => x.id)).size !== data.length
      )
        throw Error();
      onSave(data);
      setFeedback(it ? 'Set pronto nel gioco.' : 'Set ready in the game.');
    } catch {
      setFeedback(
        it
          ? 'Controlla i campi bilingui, i livelli e gli identificativi univoci.'
          : 'Check bilingual fields, levels and unique IDs.'
      );
    }
  }
  return (
    <>
      <header className="intro">
        <h1>{it ? 'Laboratorio formatori' : 'Trainer workshop'}</h1>
        <p>
          {it
            ? 'Prepara casi fittizi bilingui e provali nella modalità Set del formatore.'
            : 'Prepare bilingual fictitious cases and play them in Trainer set mode.'}
        </p>
      </header>
      <section className="card">
        <h2>{it ? 'Editor di scenari' : 'Scenario editor'}</h2>
        <label>
          JSON
          <textarea
            rows={14}
            value={draft}
            maxLength={500000}
            onChange={(e) => {
              setDraft(e.target.value);
              setFeedback('');
            }}
          />
        </label>
        <div className="actions">
          <button className="primary" onClick={apply}>
            {it ? 'Applica set' : 'Apply set'}
          </button>
          <button onClick={() => download(new Blob([draft], { type: 'application/json' }), 'biteradar-scenarios.json')}>
            {it ? 'Esporta JSON' : 'Export JSON'}
          </button>
          <a href="#game">Spot the Phish →</a>
        </div>
        <p role="status">{feedback}</p>
      </section>
    </>
  );
}
