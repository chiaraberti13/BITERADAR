// Network inventory exception: a user-initiated TXT lookup, credentials omitted.
// Never accept an endpoint, query string, mailbox or message from the UI.
export async function lookupDomain(domain: string, signal: AbortSignal) {
  if (domain.length > 253 || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain))
    throw Error('domain');
  const records = [];
  for (const [label, name] of [
    ['SPF', domain],
    ['DMARC', '_dmarc.' + domain]
  ]) {
    // eslint-disable-next-line no-restricted-syntax -- sole opt-in resolver in the published inventory
    const response = await fetch('https://dns.google/resolve?name=' + encodeURIComponent(name) + '&type=TXT', {
      signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      cache: 'no-store',
      redirect: 'error'
    });
    if (!response.ok) throw Error('dns');
    const data = (await response.json()) as { Status: number; Answer?: { type: number; data: string }[] };
    if (![0, 3].includes(data.Status)) throw Error('dns');
    const matches = (data.Answer ?? []).filter(
      (a) => a.type === 16 && (label === 'SPF' ? /^"?v=spf1\b/i : /^"?v=DMARC1\b/i).test(a.data)
    );
    records.push(label + ' · ' + (matches.map((x) => x.data).join('\n') || '—'));
  }
  return records.join('\n');
}
