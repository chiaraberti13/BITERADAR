import { readFile } from 'node:fs/promises';
import { expect, it, vi, afterEach } from 'vitest';
import { parse } from './parse';
import { readContent } from './html';
import { analyze } from '../lib/scoring';
import { lookupDomain } from '../lib/dns';

it('reads equivalent EML and compound Outlook fixtures, including a small-stream attachment', async () => {
  const fixture = (name: string) => readFile(new URL('../../tests/corpus/' + name, import.meta.url));
  const raw = await fixture('receipt.msg');
  const msg = await parse(Uint8Array.from(raw).buffer);
  const eml = await parse((await fixture('receipt.eml')).toString());
  expect([msg.subject, msg.from, analyze(msg).outcome]).toEqual([eml.subject, eml.from, 'no-signal']);
  expect(msg.attachments[0]).toMatchObject({ name: 'note.txt', type: 'text/plain', size: 14 });
  expect(msg.textBody).toBe(eml.textBody.trim());
});
it('returns insufficient coverage for a quoted or commented method and flags conflicting trusted records', async () => {
  const trace = '\r\nReceived: from relay.example by mx.google.com\r\nFrom: a@riva.example';
  for (const note of [
    '(notes; dmarc=pass header.from=riva.example; end)',
    '"notes; dmarc=pass header.from=riva.example; end"'
  ]) {
    const r = analyze(await parse('Authentication-Results: mx.google.com; ' + note + trace));
    expect(r.outcome).toBe('insufficient-data');
  }
  expect(
    analyze(
      await parse(
        'Authentication-Results: mx.google.com; dmarc=pass header.from=riva.example\r\nAuthentication-Results: mx.google.com; dmarc=fail header.from=riva.example' +
          trace
      )
    ).outcome
  ).toBe('suspicious');
});
it('decodes MIME transfer encoding and retains only passive HTML structure', async () => {
  const html = '<div style="color:red"><img src="https://images.example/a"><b>Promemoria</b><form><input></form></div>';
  const msg = await parse(
    'From: a@riva.example\r\nContent-Type: text/html\r\nContent-Transfer-Encoding: base64\r\n\r\n' +
      Buffer.from(html).toString('base64')
  );
  expect(msg.safeHtml).toContain('<b>Promemoria</b>');
  expect(msg.safeHtml).not.toMatch(/src=|style=|<img|<form|input|https:/);
  expect(readContent('<p>leggi &lt;nota&gt;</p>', '').safeHtml).toContain('&lt;nota&gt;');
  expect(() => readContent('<div>'.repeat(140), '')).toThrow();
});
afterEach(() => vi.unstubAllGlobals());
it('sends only the selected domain to the resolver and filters DNS replies', async () => {
  const request = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      Status: 0,
      Answer: [
        { type: 16, data: '"v=spf1 -all"' },
        { type: 16, data: '"v=DMARC1; p=reject"' }
      ]
    })
  });
  vi.stubGlobal('fetch', request);
  expect(await lookupDomain('riva.example', new AbortController().signal)).toContain('DMARC');
  expect(request.mock.calls.map((x) => x[0])).toEqual([
    'https://dns.google/resolve?name=riva.example&type=TXT',
    'https://dns.google/resolve?name=_dmarc.riva.example&type=TXT'
  ]);
  await expect(lookupDomain('learner@riva.example', new AbortController().signal)).rejects.toThrow();
  expect(request).toHaveBeenCalledTimes(2);
});
