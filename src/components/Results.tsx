import { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { outcomes, type AnalysisResult, type Language } from '../types';
import { defang, ips } from '../lib/indicators';
import { lookupDomain } from '../lib/dns';
import { Glossary } from './Glossary';
import { Report } from './Report';

export function Results({ result: r, lang }: { result: AnalysisResult; lang: Language }) {
  const t = (it: string, en: string) => (lang === 'it' ? it : en);
  const [tab, setTab] = useState('evidence'),
    [html, setHtml] = useState(false),
    [dns, setDns] = useState(''),
    [copied, setCopied] = useState('');
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  const { email: e, coverage: c } = r;
  const indicators = [
    ...new Set(
      [
        e.fromDomain,
        ...e.links.map((l) => l.host),
        ...ips(
          e.headers
            .filter((h) => h.key === 'received')
            .map((h) => h.value)
            .join('\n')
        ),
        ...e.attachments.map((a) => a.sha256)
      ].filter(Boolean)
    )
  ].map(defang);
  const tabs = [
    ['evidence', t('Evidenze', 'Evidence')],
    ['message', t('Messaggio', 'Message')],
    ['indicators', 'IOC / DNS'],
    ['report', 'Report']
  ];
  const action =
    r.outcome === 'insufficient-data'
      ? t(
          'Apri il messaggio originale e copia gli header completi.',
          'Open the original message and copy the full headers.'
        )
      : t(
          'Prima di rispondere o pagare, contatta il mittente con un recapito già noto.',
          'Before replying or paying, contact the sender using a previously known channel.'
        );
  return (
    <section className="result" aria-label={t('Risultato', 'Result')}>
      <div className={'verdict ' + r.outcome} role="status">
        <h2>
          {{ 'strong-risk': '▲', suspicious: '◇', 'no-signal': '○', 'insufficient-data': '?' }[r.outcome]}{' '}
          {outcomes[r.outcome][lang]}
        </h2>
        <p>{action}</p>
        <p>
          {t(
            'L’assenza di segnali evidenti non garantisce l’autenticità.',
            'An absence of obvious signals does not guarantee authenticity.'
          )}
        </p>
      </div>
      <section className="card">
        <h3>{t('Copertura dell’analisi', 'Analysis coverage')}</h3>
        <ul className="coverage">
          {[
            [c.hasFullHeaders, 'From + Received'],
            [c.recipientAuthResults, t('Autenticazione del ricevente', 'Receiver authentication')],
            [c.hasHtmlBody, t('Corpo HTML', 'HTML body')],
            [c.attachmentsAnalyzed, t('Metadati allegati', 'Attachment metadata')],
            [!!c.extractedLinks, 'URL · ' + c.extractedLinks],
            [!!dns && dns.startsWith('SPF'), t('Consultazione DNS', 'DNS lookup')]
          ].map(([ok, label]) => (
            <li key={String(label)}>
              {ok ? '✔' : '—'} {label}
            </li>
          ))}
        </ul>
        <Glossary lang={lang} />
      </section>
      <nav className="tabs" aria-label={t('Dettagli dell’analisi', 'Analysis details')}>
        {tabs.map(([key, label]) => (
          <button aria-pressed={tab === key} onClick={() => setTab(key)} key={key}>
            {label}
          </button>
        ))}
      </nav>
      {tab === 'evidence' && (
        <section className="card">
          <h2>
            {t('Evidenze', 'Evidence')} <small>{r.signals.length}</small>
          </h2>
          {!r.signals.length && <p>{t('Nessuna regola attivata.', 'No rule triggered.')}</p>}
          {r.signals.map((s) => (
            <details key={s.rule.id}>
              <summary>{s.rule.evidence[lang]}</summary>
              <p>{s.rule.interpretation[lang]}</p>
              <code>{defang(s.detail)}</code>
              <p>
                {s.evidenceQuality === 'verified'
                  ? t('✔ Riportato dal ricevente identificato', '✔ Reported by the identified receiver')
                  : t('◌ Osservato nel messaggio', '◌ Observed in the message')}
              </p>
              <p>
                {s.rule.limits[lang]} {s.rule.legitimateExplanations[lang].join(' ')}
              </p>
            </details>
          ))}
          <details>
            <summary>{t('Dettagli di autenticazione e inoltro', 'Authentication and forwarding details')}</summary>
            <p>
              {t('Ricevente', 'Receiver')} · {r.boundary ?? '—'}
            </p>
            {r.auth.map((a, i) => (
              <p key={i}>
                <strong>{a.trusted ? t('Ricevente', 'Receiver') : t('Non verificabile', 'Unverified')}</strong>
                <br />
                <code>{a.raw}</code>
              </p>
            ))}
            {e.headers
              .filter(
                (h) =>
                  h.key.startsWith('arc-') || h.key === 'list-id' || h.key.startsWith('resent-') || h.key === 'received'
              )
              .map((h, i) => (
                <p key={i}>
                  <code>
                    {h.key}: {defang(h.value)}
                  </code>
                </p>
              ))}
            <p>
              {t(
                'Gli header ARC e di lista sono contesto. Le firme non sono ricalcolate.',
                'ARC and list headers supply context. Signatures are not recalculated.'
              )}
            </p>
          </details>
        </section>
      )}
      {tab === 'message' && (
        <section className="card">
          <h2>{e.subject || t('Senza oggetto', 'No subject')}</h2>
          <dl>
            {[
              ['From', e.displayName + ' ' + e.from],
              ['Sender', e.sender],
              ['Reply-To', e.replyTo],
              ['Return-Path', e.returnPath]
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{defang(v) || '—'}</dd>
              </div>
            ))}
          </dl>
          {e.safeHtml && (
            <button aria-pressed={html} onClick={() => setHtml(!html)}>
              {html ? t('Vista testo', 'Text view') : t('Vista HTML isolata', 'Isolated HTML view')}
            </button>
          )}
          {html ? (
            <iframe
              sandbox=""
              title={t('Corpo email isolato', 'Isolated email body')}
              srcDoc={
                '<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; base-uri \'none\'; form-action \'none\'">' +
                DOMPurify.sanitize(e.safeHtml, {
                  ALLOWED_TAGS: [
                    'p',
                    'br',
                    'b',
                    'strong',
                    'i',
                    'em',
                    'u',
                    'ul',
                    'ol',
                    'li',
                    'div',
                    'span',
                    'h1',
                    'h2',
                    'h3',
                    'table',
                    'tr',
                    'td',
                    'th',
                    'blockquote',
                    'mark',
                    'pre'
                  ],
                  ALLOWED_ATTR: []
                })
              }
            />
          ) : (
            <pre>{defang(e.textBody) || t('Corpo assente', 'Body absent')}</pre>
          )}
        </section>
      )}
      {tab === 'indicators' && (
        <section className="card">
          <h2>{t('Indicatori osservati', 'Observed indicators')}</h2>
          <pre>{indicators.join('\n') || '—'}</pre>
          <button
            disabled={!indicators.length}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(indicators.join('\n'));
                setCopied(t('Copiati', 'Copied'));
              } catch {
                setCopied(t('Seleziona e copia il testo.', 'Select and copy the text.'));
              }
            }}
          >
            {t('Copia indicatori', 'Copy indicators')}
          </button>{' '}
          <span role="status">{copied}</span>
          <h3>{t('Destinazioni dei link', 'Link destinations')}</h3>
          {e.links.map((l, i) => (
            <p key={i}>
              <code>
                {defang(l.label)} → {defang(l.target)}
              </code>
            </p>
          ))}
          <h3>{t('Allegati', 'Attachments')}</h3>
          {e.attachments.map((a, i) => (
            <p key={i}>
              {a.name} · {a.size} B · {a.type} · {a.signature} {a.flags.join(', ')}
              <br />
              <code>{a.sha256}</code>
            </p>
          ))}
          <h3>DNS over HTTPS</h3>
          <p>
            {t(
              'Su richiesta, Google DNS riceve il dominio del mittente e il tuo IP. I record di oggi non provano cosa fosse pubblicato all’invio.',
              'On request, Google DNS receives the sender domain and your IP. Today’s records do not establish what was published at delivery.'
            )}
          </p>
          <button
            disabled={!e.fromDomain}
            onClick={async () => {
              abort.current?.abort();
              const ctl = new AbortController();
              abort.current = ctl;
              setDns('…');
              try {
                const value = await lookupDomain(e.fromDomain, ctl.signal);
                if (!ctl.signal.aborted) setDns(value);
              } catch {
                if (!ctl.signal.aborted) setDns(t('Servizio non disponibile.', 'Service unavailable.'));
              }
            }}
          >
            {t('Consulta DNS per ', 'Look up DNS for ') + defang(e.fromDomain)}
          </button>
          <pre role="status">{dns}</pre>
        </section>
      )}
      {tab === 'report' && <Report result={r} lang={lang} key={lang} />}
    </section>
  );
}
