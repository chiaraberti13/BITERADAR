import { toUnicode } from 'punycode/';
import { rectifyConfusion } from 'unicode-confusables';

export function defang(value: string) {
  return value
    .replace(/https?:\/\//gi, (s) => (s.toLowerCase() === 'https://' ? 'hxxps[:]//' : 'hxxp[:]//'))
    .replace(/\./g, '[.]')
    .replace(/@/g, '[@]');
}
export function lookalike(host: string) {
  if (!host.includes('xn--')) return '';
  try {
    const decoded = toUnicode(host);
    if (!/\P{ASCII}/u.test(decoded)) return '';
    const skeleton = rectifyConfusion(decoded.normalize('NFD'));
    return skeleton !== decoded && /^[a-z0-9.-]+$/i.test(skeleton) ? decoded + ' → ' + skeleton : '';
  } catch {
    return '';
  }
}
export function ips(raw: string) {
  const ipv4 = raw.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) ?? [];
  const ipv6 = (raw.match(/\[(?:IPv6:)?[a-f0-9:]+\]/gi) ?? [])
    .map((v) => v.slice(1, -1).replace(/^IPv6:/i, ''))
    .filter((v) => {
      try {
        return v.includes(':') && !!new URL('http://[' + v + ']').hostname;
      } catch {
        return false;
      }
    });
  return [...new Set([...ipv4.filter((ip) => ip.split('.').every((s) => +s <= 255)), ...ipv6])];
}
