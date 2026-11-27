import { useState } from 'react';
import { SCENARIOS, type Scenario } from '../content/dailyChallenge';
import type { Language } from '../types';
import { download } from '../report/download';
import { collections, validSet } from '../content/collections';
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
      if (!validSet(data)) throw Error();
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
        <h2>{it ? 'Raccolte di scenari' : 'Scenario library'}</h2>
        {collections.map((set) => (
          <button
            key={set.title.en}
            onClick={() => {
              onSave(set.scenarios);
              setDraft(JSON.stringify(set.scenarios, null, 2));
              setFeedback(it ? 'Raccolta pronta nel gioco.' : 'Collection ready in the game.');
            }}
          >
            {set.title[lang]} · {set.scenarios.length}
          </button>
        ))}
      </section>
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
          <a href="/awareness-kit.md" download>
            {it ? 'Scarica kit awareness' : 'Download workshop kit'}
          </a>
          <a href="#game">Spot the Phish →</a>
        </div>
        <p role="status">{feedback}</p>
      </section>
    </>
  );
}
