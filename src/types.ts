export type Language = 'it' | 'en';
export type Theme = 'dark' | 'light';
export type Localized = Record<Language, string>;
export const bi = (it: string, en: string): Localized => ({ it, en });
export type Outcome = 'strong-risk' | 'suspicious' | 'no-signal' | 'insufficient-data';
export type Severity = 'high' | 'medium' | 'low';
export type EvidenceQuality = 'verified' | 'reported';
export interface Rule {
  id: string;
  version: number;
  correlationGroup: string;
  severity: Severity;
  evidence: Localized;
  interpretation: Localized;
  limits: Localized;
  legitimateExplanations: Record<Language, string[]>;
}
export interface Signal {
  rule: Rule;
  evidenceQuality: EvidenceQuality;
  detail: string;
}
export interface Coverage {
  hasFullHeaders: boolean;
  recipientAuthResults: boolean;
  extractedLinks: number;
  hasHtmlBody: boolean;
  attachmentsAnalyzed: boolean;
  dnsLookupPerformed: boolean;
}
export interface Header {
  key: string;
  value: string;
}
export interface Link {
  target: string;
  label: string;
  host: string;
  mismatch: boolean;
}
export interface AttachmentInfo {
  name: string;
  type: string;
  signature: string;
  size: number;
  sha256: string;
  flags: string[];
}
export interface ParsedEmail {
  headers: Header[];
  from: string;
  fromDomain: string;
  displayName: string;
  subject: string;
  replyTo: string;
  returnPath: string;
  sender: string;
  textBody: string;
  safeHtml: string;
  links: Link[];
  attachments: AttachmentInfo[];
}
export interface AuthMethod {
  method: string;
  result: string;
  domain: string;
}
export interface AuthRecord {
  service: string;
  trusted: boolean;
  methods: AuthMethod[];
  raw: string;
}
export interface AnalysisResult {
  outcome: Outcome;
  signals: Signal[];
  coverage: Coverage;
  engineVersion: string;
  email: ParsedEmail;
  auth: AuthRecord[];
  boundary: string | null;
}
export const outcomes: Record<Outcome, Localized> = {
  'strong-risk': bi('Segnali forti di rischio', 'Strong risk signals'),
  suspicious: bi('Elementi sospetti da verificare', 'Suspicious elements to verify'),
  'no-signal': bi('Nessun segnale evidente rilevato', 'No obvious signal detected'),
  'insufficient-data': bi('Dati insufficienti', 'Insufficient data')
};
