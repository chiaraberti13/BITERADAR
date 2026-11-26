import { getDomain } from 'tldts';
import { rules } from '../rules';
import { domainOf, identifyTrustBoundary } from './trustModel';
import { lookalike } from './indicators';
import type { AnalysisResult, EvidenceQuality, ParsedEmail, Rule, Signal } from '../types';

export const ENGINE_VERSION = '1.0.0';
const weight = { low: 1, medium: 2, high: 3 };
const org = (d: string) => getDomain(d, { allowPrivateDomains: true }) ?? d;
export function analyze(email: ParsedEmail, receiver = ''): AnalysisResult {
  const trust = identifyTrustBoundary(email, receiver);
  const h = email.headers;
  const full =
    !!email.fromDomain && h.filter((x) => x.key === 'from').length === 1 && h.some((x) => x.key === 'received');
  const coverage = {
    hasFullHeaders: full,
    recipientAuthResults: trust.hasRecipientAuthResults,
    extractedLinks: email.links.length,
    hasHtmlBody: !!email.safeHtml,
    attachmentsAnalyzed: email.attachments.length > 0,
    dnsLookupPerformed: false
  };
  const signals = new Map<string, Signal>();
  const add = (rule: Rule, detail: string, evidenceQuality: EvidenceQuality = 'reported') => {
    const prev = signals.get(rule.correlationGroup);
    if (
      !prev ||
      weight[rule.severity] > weight[prev.rule.severity] ||
      (rule.severity === prev.rule.severity && evidenceQuality === 'verified')
    )
      signals.set(rule.correlationGroup, { rule, detail, evidenceQuality });
  };
  const seen = new Map<string, Set<string>>();
  for (const r of trust.records) {
    const quality = r.trusted ? 'verified' : 'reported';
    const passed = r.methods.filter((m) => m.result === 'pass' && m.domain && ['spf', 'dkim'].includes(m.method));
    if (
      passed.length &&
      email.fromDomain &&
      passed.every((m) => org(m.domain) !== org(email.fromDomain)) &&
      !r.methods.some((m) => m.method === 'dmarc' && m.result === 'pass' && m.domain === email.fromDomain)
    )
      add(rules.alignment, passed.map((m) => m.domain).join(', '), quality);
    for (const m of r.methods) {
      if (m.method === 'dmarc' && m.domain === email.fromDomain && m.domain && m.result === 'fail')
        add(rules.dmarc, m.domain, quality);
      if (!m.domain) continue;
      const key = m.method + ' ' + m.domain;
      const results = seen.get(key) ?? new Set<string>();
      results.add(m.result);
      seen.set(key, results);
      if (results.has('pass') && results.has('fail')) add(rules.conflict, key);
    }
  }
  if (
    /\b(ceo|cfo|direttore|amministrazione|direzione|director|finance|contabilità|payroll)\b/i.test(email.displayName) &&
    ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'libero.it'].includes(email.fromDomain)
  )
    add(rules.bec, email.from);
  const other = (s: string) => domainOf(s) && email.fromDomain && org(domainOf(s)) !== org(email.fromDomain);
  if (other(email.replyTo)) add(rules.reply, email.replyTo);
  if (other(email.returnPath)) add(rules.bounce, email.returnPath);
  if (full && !h.some((x) => x.key === 'dkim-signature')) add(rules.dkim, 'DKIM-Signature');
  if (/\b(urgente|urgently|immediately|immediato|urgent)\b/i.test(email.subject + ' ' + email.textBody))
    add(rules.urgency, 'Subject / Body');
  for (const link of email.links) if (link.mismatch) add(rules.link, link.label + ' → ' + link.target);
  for (const d of [email.fromDomain, ...email.links.map((l) => l.host)]) {
    const similar = lookalike(d);
    if (similar) add(rules.lookalike, similar);
  }
  for (const a of email.attachments) if (a.flags.length) add(rules.file, a.name + ' · ' + a.flags.join(', '));
  const findings = [...signals.values()].sort((a, b) => weight[b.rule.severity] - weight[a.rule.severity]);
  const significant = findings.some((s) => s.rule.severity !== 'low');
  const outcome = !full
    ? 'insufficient-data'
    : findings.some((s) => s.rule.severity === 'high' && s.evidenceQuality === 'verified')
      ? 'strong-risk'
      : significant
        ? 'suspicious'
        : !trust.hasRecipientAuthResults
          ? 'insufficient-data'
          : 'no-signal';
  return {
    outcome,
    signals: findings,
    coverage,
    engineVersion: ENGINE_VERSION,
    email,
    auth: trust.records,
    boundary: trust.trustedAuthServId
  };
}
