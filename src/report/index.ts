import { outcomes, type AnalysisResult, type Language } from '../types';
import { defang } from '../lib/indicators';
import { escapeHtml } from '../worker/html';

export interface RedactionOptions {
  redactRecipients: boolean;
  redactPrivateIps: boolean;
  redactUrlQueryParams: boolean;
}
export const DEFAULT_REDACTION: RedactionOptions = {
  redactRecipients: true,
  redactPrivateIps: true,
  redactUrlQueryParams: true
};
export interface Fields {
  identity: boolean;
  trace: boolean;
  indicators: boolean;
}
export const DEFAULT_FIELDS: Fields = { identity: false, trace: false, indicators: true };
export function reportText(
  result: AnalysisResult,
  lang: Language,
  fields = DEFAULT_FIELDS,
  options = DEFAULT_REDACTION
) {
  const t = (it: string, en: string) => (lang === 'it' ? it : en),
    mask = t('[OSCURATO]', '[REDACTED]');
  const { email, coverage } = result;
  const recipients = email.headers.filter((h) => ['to', 'cc', 'bcc', 'delivered-to', 'x-original-to'].includes(h.key));
  const parts = [
    'BiteRadar · ' + result.engineVersion,
    outcomes[result.outcome][lang],
    t('Azione: verifica tramite un contatto già noto.', 'Action: verify through a previously known contact.'),
    t('Un esito neutro non garantisce autenticità.', 'A neutral outcome does not guarantee authenticity.'),
    '',
    t('Copertura', 'Coverage'),
    'From + Received: ' + (coverage.hasFullHeaders ? '✔' : '—'),
    'Authentication-Results: ' + (coverage.recipientAuthResults ? result.boundary : '—'),
    'HTML: ' + (coverage.hasHtmlBody ? '✔' : '—'),
    'URL: ' + coverage.extractedLinks,
    t('Allegati: ', 'Attachments: ') + email.attachments.length,
    t('DNS: non usato nel verdetto', 'DNS: excluded from the verdict'),
    '',
    ...result.signals.flatMap((s) => [
      s.rule.id + ' · ' + s.rule.evidence[lang],
      s.detail,
      s.rule.interpretation[lang],
      s.rule.limits[lang],
      ...s.rule.legitimateExplanations[lang],
      ''
    ])
  ];
  if (fields.identity)
    parts.push(
      'From: ' + email.from,
      'Subject: ' + email.subject,
      ...recipients.map((h) => h.key + ': ' + (options.redactRecipients ? mask : h.value))
    );
  if (fields.trace)
    parts.push(
      ...email.headers
        .filter((h) => ['received', 'authentication-results'].includes(h.key))
        .map((h) => h.key + ': ' + h.value)
    );
  if (fields.indicators)
    parts.push(...email.links.map((l) => l.target), ...email.attachments.map((a) => a.name + ' SHA-256 ' + a.sha256));
  // eslint-disable-next-line no-control-regex -- remove control characters from exported text
  let report = parts.join('\n').replace(/[\u0000-\u0008\u000b-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, '');
  if (options.redactRecipients)
    for (const h of recipients) {
      for (const token of [h.value, ...(h.value.match(/[^\s<>,;"]+@[^\s<>,;"]+/g) ?? [])])
        if (token.trim()) report = report.replaceAll(token, mask);
    }
  if (options.redactPrivateIps)
    report = report.replace(/\b(?:10\.\d{1,3}|192\.168|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b/g, mask);
  if (options.redactUrlQueryParams) report = report.replace(/(https?:\/\/[^\s?#<>]*)(?:[?#][^\s<>]*)/gi, '$1' + mask);
  return report.replace(/https?:\/\/[^\s<>]+/gi, (s) => defang(s));
}
// A literal block protects every line, including attacker-controlled Markdown punctuation.
export function asMarkdown(text: string) {
  return (
    text
      .split('\n')
      .map((l) => '    ' + l)
      .join('\n') + '\n'
  );
}
export function toMarkdown(result: AnalysisResult, options = DEFAULT_REDACTION) {
  return asMarkdown(reportText(result, 'it', DEFAULT_FIELDS, options));
}
export function asHtml(text: string, lang: Language) {
  return (
    '<!doctype html><html lang="' +
    lang +
    '"><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src ' +
    "'none'" +
    '"><title>BiteRadar</title><pre>' +
    escapeHtml(text) +
    '</pre></html>'
  );
}
