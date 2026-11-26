import { describe, it, expect } from 'vitest';
import { parse } from '../worker/parse';
import { analyze } from './scoring';
import { examples } from '../content/examples';
import { asMarkdown, reportText, asHtml } from '../report';
import { dailyScenario, SCENARIOS } from '../content/dailyChallenge';
import { ips } from './indicators';
import { lookalike } from './lookalike';
import { inspectFile } from '../worker/attachments';
const trace = 'Received: from relay.example by mx.google.com; Wed, 4 Mar 2026 12:00:00 +0000';
const auth = 'Authentication-Results: mx.google.com; ';
const from = 'From: desk@riva.example';
const pass = auth + 'dmarc=pass header.from=riva.example';
const fail = auth + 'dmarc=fail header.from=riva.example';
const message = (...lines: string[]) => lines.join('\r\n');
const run = async (raw: string, receiver = '') => analyze(await parse(raw), receiver);
describe('labelled synthetic corpus', () => {
  for (const lang of ['it', 'en'] as const)
    for (const [i, s] of examples.entries()) {
      it(lang + ' ' + s.title[lang], async () =>
        expect((await run(s.message(lang))).outcome).toBe(
          ['no-signal', 'strong-risk', 'suspicious', 'no-signal', 'insufficient-data'][i]
        )
      );
    }
  const cases: [string, string, string, string?][] = [
    ['untrusted result', message(trace, fail, from), 'suspicious', 'auth.dmarc.fail'],
    ['different service', message(fail.replace('mx.google.com', 'unlisted.example'), trace, from), 'suspicious'],
    ['body quotation', message(trace, from, '', fail), 'insufficient-data'],
    ['missing From', message(pass, trace), 'insufficient-data'],
    ['duplicate From', message(pass, trace, from, from), 'insufficient-data'],
    ['missing trace', message(fail, from), 'insufficient-data'],
    ['contradiction', message(pass, trace, fail, from), 'suspicious', 'auth.conflict'],
    ['unrelated DMARC', message(fail.replace('riva.example', 'other.example'), trace, from), 'insufficient-data'],
    ['aligned SPF', message(auth + 'spf=pass smtp.mailfrom=sender@riva.example', trace, from), 'no-signal'],
    [
      'misaligned SPF',
      message(auth + 'spf=pass smtp.mailfrom=elsewhere.example', trace, from),
      'suspicious',
      'auth.alignment'
    ],
    ['aligned DKIM', message(auth + 'dkim=pass header.d=riva.example', trace, from), 'no-signal'],
    [
      'another DKIM aligns',
      message(auth + 'dkim=pass header.d=elsewhere.example; dkim=pass header.d=riva.example', trace, from),
      'no-signal'
    ],
    ['DMARC covers alignment', message(pass + '; spf=pass smtp.mailfrom=other.example', trace, from), 'no-signal'],
    ['role on company domain', message(pass, trace, 'From: Direzione <director@riva.example>'), 'no-signal'],
    ['reply elsewhere', message(pass, trace, from, 'Reply-To: other@reply.example'), 'suspicious', 'identity.reply'],
    ['normal reply', message(pass, trace, from, 'Reply-To: other@riva.example'), 'no-signal'],
    [
      'urgent newsletter',
      message(pass, trace, from, 'Subject: urgente', 'List-Id: <news.riva.example>'),
      'no-signal',
      'body.urgency'
    ],
    ['ARC context', message(fail, trace, 'ARC-Seal: i=1; cv=pass', from), 'strong-risk'],
    ['internal hop', message('Received: from mx.google.com by mx.google.com', pass, trace, from), 'no-signal'],
    [
      'suffix impersonation',
      message(pass, trace.replace('mx.google.com', 'mx.google.com.example'), from),
      'insufficient-data'
    ],
    [
      'Outlook',
      message(
        pass.replace('mx.google.com', 'in.protection.outlook.com'),
        trace.replace('mx.google.com', 'in.protection.outlook.com'),
        from
      ),
      'no-signal'
    ],
    ['compauth only', message(auth + 'compauth=pass', trace, from), 'insufficient-data'],
    ['folded', message(auth.trimEnd(), ' dmarc=pass header.from=riva.example', trace, from), 'no-signal'],
    [
      'anchor mismatch',
      message(pass, trace, from, 'Content-Type: text/html', '', '<a href="https://b.example/">https://a.example/</a>'),
      'suspicious',
      'link.mismatch'
    ],
    [
      'anchor same',
      message(pass, trace, from, 'Content-Type: text/html', '', '<a href="https://a.example/">https://a.example/</a>'),
      'no-signal'
    ],
    ['empty body', message(trace, from), 'insufficient-data']
  ];
  for (const [name, raw, outcome, rule] of cases)
    it(name, async () => {
      const result = await run(raw);
      expect(result.outcome).toBe(outcome);
      if (rule) expect(result.signals.map((s) => s.rule.id)).toContain(rule);
    });
});
it('explicit receiving host binds to delivery trace', async () => {
  const raw = message(pass, trace, from).replaceAll('mx.google.com', 'mx.inbox.example');
  expect((await run(raw, 'mx.inbox.example')).outcome).toBe('no-signal');
});
it('redacts and quotes reports', async () => {
  const r = await run(
    message(
      pass,
      trace,
      from,
      'To: learner@lab.example',
      'Subject: learner@lab.example 192.168.1.2',
      '',
      'https://news.example/?key=secret'
    )
  );
  const text = reportText(r, 'it', { identity: true, trace: true, indicators: true });
  expect(text).not.toMatch(/learner@|192\.168|key=secret/);
  expect(asMarkdown(text)).toMatch(/^ {4}/);
  expect(asHtml('<article>', 'it')).toContain('&lt;article&gt;');
});
it('limits input and rejects a truncated MSG', async () => {
  await expect(parse(new ArrayBuffer(513), 'msg')).rejects.toThrow();
  await expect(parse('x'.repeat(5 * 1024 * 1024 + 1))).rejects.toThrow();
});
it('daily UTC and factual indicators', () => {
  expect(dailyScenario(new Date('2026-11-26T00:00:00Z'))).toEqual(dailyScenario(new Date('2026-11-26T23:59:59Z')));
  expect(SCENARIOS).toHaveLength(24);
  expect(ips('192.0.2.1 [IPv6:2001:db8::1] 999.2.3.4')).toEqual(['192.0.2.1', '2001:db8::1']);
  expect(lookalike('ordinary.example')).toBe('');
  expect(lookalike('xn--80ak6aa92e.example')).toBeTruthy();
});
it('attachment metadata only', async () => {
  const a = await inspectFile('note.txt', 'text/plain', new TextEncoder().encode('%PDF-1.7 /EmbeddedFile'));
  expect(a.flags).toContain('PDF /EmbeddedFile');
  expect(a.sha256).toHaveLength(64);
});
