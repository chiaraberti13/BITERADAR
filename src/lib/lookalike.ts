import { toUnicode } from 'punycode/';
import { rectifyConfusion } from 'unicode-confusables';

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
