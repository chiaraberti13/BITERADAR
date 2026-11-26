import PostalMime from 'postal-mime';
import { domainOf } from '../lib/trustModel';
import { readContent } from './html';
import { readMsg } from './msg';
import { inspectFile } from './attachments';
import type { Header, ParsedEmail } from '../types';

export const MAX_BYTES = 5 * 1024 * 1024;
export type Input = string | ArrayBuffer;
function headerBlock(raw: string): Header[] {
  const end = raw.search(/\r?\n\r?\n/),
    head = raw.slice(0, end < 0 ? undefined : end);
  if (!/^[!-9;-~]+:/.test(head)) return [];
  if (head.length > 128 * 1024) throw Error('headers');
  const list: Header[] = [];
  for (const line of head.split(/\r?\n/)) {
    if (/^[ \t]/.test(line) && list.length) {
      list[list.length - 1].value += ' ' + line.trim();
      continue;
    }
    const m = /^([!-9;-~]+):[ \t]*(.*)$/.exec(line);
    if (!m) break;
    if (list.length >= 512) throw Error('headers');
    list.push({ key: m[1].toLowerCase(), value: m[2] });
  }
  return list;
}
export async function parse(input: Input, kind: 'auto' | 'msg' = 'auto'): Promise<ParsedEmail> {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
  if (!bytes.length || bytes.length > MAX_BYTES) throw Error('size');
  const msg = kind === 'msg' || (bytes[0] === 0xd0 && bytes[1] === 0xcf);
  let raw: string,
    text = '',
    html = '',
    from = '',
    displayName = '',
    subject = '',
    replyTo = '',
    returnPath = '',
    sender = '';
  let attachments: { name: string; type: string; bytes: Uint8Array }[] = [];
  if (msg) {
    if (typeof input === 'string') throw Error('msg');
    const m = readMsg(input);
    raw = m.headers;
    text = m.text;
    html = m.html;
    from = m.from;
    displayName = m.displayName;
    subject = m.subject;
    attachments = m.attachments;
  } else raw = typeof input === 'string' ? input : new TextDecoder().decode(input);
  const headers = headerBlock(raw);
  if (headers.length) {
    let boundaries = 0;
    for (const _ of raw.matchAll(/^--[^\r\n]{1,72}\r?$/gm)) {
      void _;
      if (++boundaries > 256) throw Error('parts');
    }
    const mail = await PostalMime.parse(msg ? raw + '\r\n\r\n' : input, {
      maxNestingDepth: 16,
      maxHeadersSize: 128 * 1024,
      maxRfc822NestingDepth: 1,
      forceRfc822Attachments: true
    });
    from = mail.from?.address ?? from;
    displayName = mail.from?.name ?? displayName;
    subject = mail.subject ?? subject;
    sender = mail.sender?.address ?? '';
    replyTo = mail.replyTo?.[0]?.address ?? '';
    returnPath = mail.returnPath ?? '';
    if (!msg) {
      text = mail.text ?? '';
      html = mail.html ?? '';
      if (mail.attachments.length > 64) throw Error('parts');
      attachments = mail.attachments.map((a) => ({
        name: a.filename ?? '',
        type: a.mimeType,
        bytes: typeof a.content === 'string' ? new TextEncoder().encode(a.content) : new Uint8Array(a.content)
      }));
    }
  } else if (!msg) text = raw;
  const content = readContent(html, text);
  const metadata = [];
  for (const a of attachments) metadata.push(await inspectFile(a.name, a.type, a.bytes));
  return {
    headers,
    from,
    fromDomain: domainOf(from),
    displayName,
    subject,
    replyTo,
    returnPath,
    sender,
    ...content,
    attachments: metadata
  };
}
