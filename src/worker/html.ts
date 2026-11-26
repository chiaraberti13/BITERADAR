import { Parser } from 'htmlparser2';
import type { Link } from '../types';
export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const allowed = new Set([
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
  'pre'
]);
function web(raw: string) {
  if (raw.length > 4096 || !/^https?:\/\//i.test(raw)) return null;
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}
export function readContent(html: string, plain: string) {
  const links: Link[] = [],
    seen = new Set<string>();
  let safeHtml = '',
    body = '',
    hidden = 0,
    depth = 0,
    anchor: { href: string; text: string } | null = null;
  function add(target: string, label: string) {
    const url = web(target);
    if (!url) return;
    const key = target + '\n' + label;
    if (seen.has(key)) return;
    seen.add(key);
    if (links.length >= 256) throw Error('links');
    const visible =
      web(label.trim()) ??
      (/^(?:[a-z0-9-]+\.)+[a-z]{2,}(?:[/?#]\S*)?$/i.test(label.trim()) ? web('https://' + label.trim()) : null);
    links.push({
      target: url.href,
      label,
      host: url.hostname,
      mismatch: !!visible && visible.hostname !== url.hostname
    });
  }
  if (html) {
    const parser = new Parser(
      {
        onopentag(tag, attrs) {
          if (++depth > 128) throw Error('html');
          if (hidden || ['script', 'style', 'head', 'template', 'svg', 'math', 'iframe', 'object'].includes(tag)) {
            hidden++;
            return;
          }
          if (tag === 'a') anchor = { href: attrs.href ?? '', text: '' };
          if (allowed.has(tag)) {
            safeHtml += '<' + tag + '>';
            if (['p', 'br', 'li', 'div', 'tr'].includes(tag)) body += '\n';
          }
          if (tag === 'img') safeHtml += '[▧]';
        },
        ontext(t) {
          if (hidden) return;
          safeHtml += escapeHtml(t);
          body += t;
          if (anchor) anchor.text += t;
        },
        onclosetag(tag) {
          depth--;
          if (hidden) {
            hidden--;
            return;
          }
          if (tag === 'a' && anchor) {
            add(anchor.href, anchor.text.slice(0, 4096));
            anchor = null;
          }
          if (allowed.has(tag) && tag !== 'br') safeHtml += '</' + tag + '>';
        }
      },
      { decodeEntities: true }
    );
    parser.end(html);
  }
  for (const m of (plain || body).matchAll(/https?:\/\/[^\s<>"']+/gi)) add(m[0].replace(/[.,;)]+$/, ''), '');
  return { textBody: plain || body.trim(), safeHtml, links };
}
