import type { AuthMethod, AuthRecord, ParsedEmail } from '../types';

export function domainOf(address: string): string {
  return (address.trim().match(/@([a-z0-9.-]+)>?$/i)?.[1] ?? '').toLowerCase();
}

function hostClause(value: string, clause: 'from' | 'by') {
  // Remove comments before reading an SMTP trace clause. Ambiguous traces stay untrusted.
  const trace = value.split(';')[0].replace(/\([^()]*\)/g, ' ');
  if (/[()]/.test(trace)) return '';
  return trace.match(new RegExp('(?:^|\\s)' + clause + '\\s+([a-z0-9.-]+)(?=\\s|$)', 'i'))?.[1]?.toLowerCase() ?? '';
}
function family(host: string) {
  if (host === 'mx.google.com') return 'google';
  if (/^(?:[a-z0-9-]+\.)+protection\.outlook\.com$/.test(host)) return 'outlook';
  return '';
}
function parseMethods(value: string): AuthMethod[] {
  return value
    .split(';')
    .slice(1)
    .flatMap((clause) => {
      const cleaned = clause.replace(/\([^()]*\)/g, ' ').trim();
      const match =
        /^(spf|dkim|dmarc|compauth)=(pass|fail|softfail|neutral|none|temperror|permerror|bestguesspass)\b/i.exec(
          cleaned
        );
      if (!match) return [];
      const method = match[1].toLowerCase();
      const prop = method === 'dmarc' ? 'header\\.from' : method === 'dkim' ? 'header\\.d' : 'smtp\\.mailfrom';
      const identity = new RegExp('(?:^|\\s)' + prop + '=([^\\s;]+)', 'i').exec(cleaned)?.[1] ?? '';
      return [
        {
          method,
          result: match[2].toLowerCase(),
          domain: identity.toLowerCase().split('@').pop()!.replace(/^<|>$/g, '')
        }
      ];
    });
}
export function identifyTrustBoundary(email: Pick<ParsedEmail, 'headers'>, receiver = '') {
  const headers = email.headers;
  const first = headers.findIndex((h) => h.key === 'received');
  const top = first >= 0 ? hostClause(headers[first].value, 'by') : '';
  const selected = receiver.trim().toLowerCase();
  const provider = family(top);
  const belongs = (host: string) => !!host && (selected ? host === selected : !!provider && family(host) === provider);
  let boundary = -1;
  if (belongs(top)) {
    for (let i = first; i < headers.length; i++) {
      if (headers[i].key !== 'received') continue;
      if (!belongs(hostClause(headers[i].value, 'by'))) break;
      const from = hostClause(headers[i].value, 'from');
      if (!from) break;
      if (!belongs(from)) {
        boundary = i;
        break;
      }
    }
  }
  const records: AuthRecord[] = headers.flatMap((h, i) => {
    if (h.key !== 'authentication-results') return [];
    const service = /^([a-z0-9.-]+)\s*(?:1\s*)?;/i.exec(h.value)?.[1].toLowerCase() ?? '';
    return [{ service, trusted: i < boundary && belongs(service), methods: parseMethods(h.value), raw: h.value }];
  });
  return {
    trustedAuthServId: boundary >= 0 ? top : null,
    hasRecipientAuthResults: records.some((r) => r.trusted && r.methods.some((m) => m.method !== 'compauth')),
    records
  };
}
