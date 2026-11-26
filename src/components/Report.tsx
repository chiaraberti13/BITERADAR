import { useState, useRef } from 'react';
import type { AnalysisResult, Language } from '../types';
import { reportText, asMarkdown, asHtml, DEFAULT_FIELDS, DEFAULT_REDACTION } from '../report';

import { download } from '../report/download';
export function Report({ result, lang }: { result: AnalysisResult; lang: Language }) {
  const t = (it: string, en: string) => (lang === 'it' ? it : en);
  const [fields, setFields] = useState(DEFAULT_FIELDS),
    [redact, setRedact] = useState(true);
  const [manual, setManual] = useState<string | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const text =
    manual ??
    reportText(
      result,
      lang,
      fields,
      redact ? DEFAULT_REDACTION : { redactRecipients: false, redactPrivateIps: false, redactUrlQueryParams: false }
    );
  return (
    <section className="card">
      <h2>{t('Anteprima del report', 'Report preview')}</h2>
      <p>
        {t(
          'Controlla nomi, indirizzi e numeri di pratica. L’oscuramento automatico può lasciare dati personali.',
          'Check names, addresses and case IDs. Automatic redaction can leave personal details.'
        )}
      </p>
      <fieldset>
        <legend>{t('Campi inclusi', 'Included fields')}</legend>
        {(Object.keys(fields) as (keyof typeof fields)[]).map((k, i) => (
          <label key={k}>
            <input
              type="checkbox"
              checked={fields[k]}
              onChange={(e) => {
                setFields({ ...fields, [k]: e.target.checked });
                setManual(null);
              }}
            />
            {
              [
                t('Mittente, oggetto e destinatari', 'Sender, subject and recipients'),
                t('Traccia di consegna', 'Delivery trace'),
                t('Indicatori', 'Indicators')
              ][i]
            }
          </label>
        ))}
      </fieldset>
      <label>
        <input
          type="checkbox"
          checked={redact}
          onChange={(e) => {
            setRedact(e.target.checked);
            setManual(null);
          }}
        />
        {t('Oscura i dati personali', 'Redact personal data')}
      </label>
      <textarea
        aria-label={t('Anteprima modificabile', 'Editable preview')}
        ref={area}
        value={text}
        onChange={(e) => setManual(e.target.value)}
        rows={12}
      />
      <div className="actions">
        <button
          onClick={() => {
            const a = area.current;
            if (a && a.selectionEnd > a.selectionStart)
              setManual(text.slice(0, a.selectionStart) + t('[OSCURATO]', '[REDACTED]') + text.slice(a.selectionEnd));
          }}
        >
          {t('Oscura selezione', 'Redact selection')}
        </button>
        <button onClick={() => download(new Blob([asMarkdown(text)], { type: 'text/markdown' }), 'biteradar.md')}>
          Markdown ↓
        </button>
        <button onClick={() => download(new Blob([asHtml(text, lang)], { type: 'text/html' }), 'biteradar.html')}>
          HTML ↓
        </button>
        <button onClick={() => window.print()}>{t('Stampa / PDF', 'Print / PDF')}</button>
      </div>
      <pre className="print-report">{text}</pre>
    </section>
  );
}
