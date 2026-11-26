import type { Language } from '../types';
const terms = [
  [
    'SPF',
    'Sender Policy Framework',
    'Il dominio di trasporto autorizza questo server?',
    'Does the transport domain authorize this server?'
  ],
  [
    'DKIM',
    'DomainKeys Identified Mail',
    'La firma del dominio copre le parti verificate del messaggio?',
    'Does the domain signature cover the verified parts of this message?'
  ],
  [
    'DMARC',
    'Domain-based Message Authentication, Reporting and Conformance',
    'Il dominio visibile è allineato con un’identità che ha superato SPF o DKIM?',
    'Does the visible domain align with an identity that passed SPF or DKIM?'
  ],
  [
    'IOC',
    'Indicator of Compromise',
    'Dominio, indirizzo IP o hash da interpretare nel contesto.',
    'A domain, IP or hash to interpret in context.'
  ]
];
export function Glossary({ lang }: { lang: Language }) {
  return (
    <div className="glossary" aria-label={lang === 'it' ? 'Glossario' : 'Glossary'}>
      {terms.map(([term, name, it, en]) => (
        <span className="term" key={term}>
          <button aria-describedby={'meaning-' + term} type="button">
            {term}
          </button>
          <span role="tooltip" id={'meaning-' + term}>
            <strong>{name}</strong>
            <br />
            {lang === 'it' ? it : en}
          </span>
        </span>
      ))}
    </div>
  );
}
