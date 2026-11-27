import { lazy, useRef, useState, useEffect } from 'react';
import { useStore } from '../store';
import { examples } from '../content/examples';
import { outcomes, type Language } from '../types';
import type { ParseResponse, ParseRequest } from '../worker/parser.worker';
import { displayedFile } from '../worker/thunderbird';
const Results = lazy(() => import('./Results').then((m) => ({ default: m.Results })));
const max = 5 * 1024 * 1024;
export function Analyzer({ lang }: { lang: Language }) {
  const t = (it: string, en: string) => (lang === 'it' ? it : en);
  const [raw, setRaw] = useState(''),
    [file, setFile] = useState<File | null>(null),
    [receiver, setReceiver] = useState(''),
    [mode, setMode] = useState('file'),
    [status, setStatus] = useState(''),
    [over, setOver] = useState(false);
  const result = useStore((s) => s.analysis),
    setResult = useStore((s) => s.setAnalysis);
  const worker = useRef<Worker | null>(null),
    generation = useRef(0),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined),
    picker = useRef<HTMLInputElement>(null);
  function stop() {
    generation.current++;
    worker.current?.terminate();
    worker.current = null;
    clearTimeout(timer.current);
  }
  useEffect(
    () => () => {
      stop();
      useStore.getState().clearAnalysis();
    },
    []
  );
  function reset() {
    stop();
    setResult(null);
    setStatus('');
  }
  function choose(f: File | undefined) {
    if (!f) return;
    reset();
    setMode('file');
    setRaw('');
    setFile(f.size <= max ? f : null);
    if (f.size > max) setStatus('error');
  }
  useEffect(() => {
    if (location.protocol !== 'moz-extension:') return;
    let live = true;
    displayedFile().then(
      (f) => {
        if (live) {
          if (f.size <= max) setFile(f);
          else setStatus('error');
        }
      },
      () => {
        if (live) setStatus('error');
      }
    );
    return () => {
      live = false;
    };
  }, []);
  async function run(source: string | File) {
    reset();
    const id = generation.current;
    setStatus('busy');
    function finish(error = false) {
      if (id !== generation.current) return;
      stop();
      setStatus(error ? 'error' : '');
    }
    try {
      if (typeof source === 'string' ? !source.trim() || source.length > max : source.size > max) {
        finish(true);
        return;
      }
      const input = typeof source === 'string' ? source : await source.arrayBuffer();
      if (id !== generation.current) return;
      const w = new Worker(new URL('../worker/parser.worker.ts', import.meta.url), { type: 'module' });
      worker.current = w;
      timer.current = setTimeout(() => finish(true), 6000);
      w.onerror = () => finish(true);
      w.onmessage = ({ data }: MessageEvent<ParseResponse>) => {
        if (id !== generation.current) return;
        if (data.ok) setResult(data.result);
        finish(!data.ok);
      };
      w.postMessage(
        {
          input,
          receiver,
          kind: typeof source !== 'string' && /\.msg$/i.test(source.name) ? 'msg' : 'auto'
        } satisfies ParseRequest,
        typeof input === 'string' ? [] : [input]
      );
    } catch {
      finish(true);
    }
  }
  return (
    <>
      <p className="sr-only" role="status" aria-atomic="true">
        {result &&
          [
            outcomes[result.outcome][lang],
            result.coverage.hasFullHeaders
              ? t('From e Received presenti.', 'From and Received present.')
              : t('From o Received mancanti.', 'From or Received missing.'),
            result.coverage.recipientAuthResults
              ? t('Autenticazione del ricevente disponibile.', 'Receiver authentication available.')
              : t('Autenticazione del ricevente non disponibile.', 'Receiver authentication unavailable.')
          ].join(' ')}
      </p>
      <header className="intro">
        <h1>{t('Analizza un’email', 'Analyze an email')}</h1>
        <p>
          {t(
            'Esamina mittente, link e autenticazione. Il messaggio resta nel tuo browser.',
            'Inspect the sender, links and authentication. The message stays in your browser.'
          )}
        </p>
      </header>
      <div className="workspace">
        <section className="card input-card">
          <h2>{t('Messaggio da esaminare', 'Message to inspect')}</h2>
          <div className="tabs">
            {[
              ['file', t('Carica un file', 'Upload a file')],
              ['paste', t('Incolla testo', 'Paste text')]
            ].map(([k, v]) => (
              <button
                key={k}
                aria-pressed={mode === k}
                onClick={() => {
                  reset();
                  setMode(k);
                }}
              >
                {v}
              </button>
            ))}
          </div>
          {mode === 'file' ? (
            <div
              className={'drop ' + (over ? 'over' : '')}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(true);
              }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setOver(false);
                choose(e.dataTransfer.files[0]);
              }}
            >
              <span aria-hidden="true" className="mail-icon">
                ✉
              </span>
              <strong>{file?.name ?? t('Trascina qui il messaggio', 'Drop your message here')}</strong>
              <small>.EML / .MSG · 5 MiB max</small>
              <button onClick={() => picker.current?.click()}>{t('Scegli file', 'Choose file')}</button>
              <input
                hidden
                ref={picker}
                type="file"
                accept=".eml,.msg"
                aria-label={t('File email', 'Email file')}
                onChange={(e) => {
                  choose(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </div>
          ) : (
            <label>
              {t('Email grezza o header originali', 'Raw email or original headers')}
              <textarea
                rows={7}
                maxLength={max}
                placeholder={'From: …\\nSubject: …'}
                value={raw}
                onChange={(e) => {
                  reset();
                  setRaw(e.target.value);
                }}
              />
            </label>
          )}
          <details>
            <summary>{t('Servizio di ricezione e guida agli header', 'Receiving service and header guide')}</summary>
            <p>
              {t(
                'Gmail: Mostra originale. Outlook: Visualizza dettagli messaggio. Thunderbird: Visualizza sorgente. Copia le intestazioni nell’ordine originale.',
                'Gmail: Show original. Outlook: View message details. Thunderbird: View source. Copy the headers in their original order.'
              )}
            </p>
            <label>
              {t('Server del tuo servizio di posta (facoltativo)', 'Your mail service hostname (optional)')}
              <input
                value={receiver}
                maxLength={253}
                placeholder="mx.example.org"
                onChange={(e) => {
                  reset();
                  setReceiver(e.target.value);
                }}
              />
            </label>
            <p>
              {t('Usa un nome fornito dal tuo amministratore.', 'Use a hostname supplied by your mail administrator.')}
            </p>
          </details>
          <div className="actions">
            <button
              className="primary"
              disabled={status === 'busy' || !(mode === 'file' ? file : raw.trim())}
              onClick={() => void run(mode === 'file' ? file! : raw)}
            >
              {status === 'busy' ? t('Analisi in corso…', 'Analyzing…') : t('Analizza messaggio', 'Analyze message')} →
            </button>
            <button
              onClick={() => {
                reset();
                setRaw('');
                setFile(null);
                setReceiver('');
              }}
            >
              {t('Cancella analisi', 'Clear analysis')}
            </button>
          </div>
          {status === 'error' && (
            <p role="alert">
              {t(
                'Dati insufficienti. Il formato è illeggibile o supera i limiti. Prova con i soli header.',
                'Insufficient data. The format is unreadable or exceeds limits. Try pasting only the headers.'
              )}
            </p>
          )}
        </section>
        <aside className="card examples">
          <h2>{t('Prova un esempio', 'Try a sample')}</h2>
          <p>
            {t(
              'Apri un caso sintetico per vedere come si leggono le evidenze.',
              'Open a synthetic case to explore its evidence.'
            )}
          </p>
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => {
                const input = ex.message(lang);
                setFile(null);
                setRaw(input);
                setMode('paste');
                void run(input);
              }}
            >
              <span>{ex.title[lang]}</span>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </aside>
      </div>
      {result && <Results result={result} lang={lang} />}
    </>
  );
}
