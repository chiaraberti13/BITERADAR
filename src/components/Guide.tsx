import type { Language } from '../types';
const articles = [
  [
    'Leggere gli header originali',
    'Reading original headers',
    'Copia l’originale dal servizio di ricezione. From indica il mittente dichiarato. Received descrive i passaggi di consegna. Solo la parte aggiunta dal ricevente identificato ha valore per il confine di fiducia.',
    'Copy the original from your receiving service. From identifies the claimed sender. Received describes delivery hops. Only the part added by the identified receiver counts toward the trust boundary.'
  ],
  [
    'Autenticazione e identità',
    'Authentication and identity',
    'SPF controlla l’autorizzazione del server per un dominio. DKIM firma parti del messaggio. DMARC richiede l’allineamento tra il dominio From e l’identità SPF o DKIM autenticata. BiteRadar legge i risultati riportati. Un account compromesso può superare tutti e tre i controlli.',
    'SPF checks server authorization for a domain. DKIM signs parts of a message. DMARC requires alignment between From and an authenticated SPF or DKIM identity. BiteRadar reads reported results. A compromised account may pass all three.'
  ],
  [
    'Attacco e difesa nei pagamenti',
    'Attack and defense in payments',
    'Un cambio di IBAN può arrivare da una casella autentica. Un aggressore sfrutta il ruolo dichiarato e la fretta. Una seconda approvazione e una telefonata a un recapito già registrato proteggono il pagamento. IOC significa indicatore di compromissione: un dominio o un hash osservato richiede sempre contesto.',
    'A bank account change can come from a genuine mailbox. An attacker exploits urgency and claimed authority. A second approval and a call to a previously recorded number protect the payment. IOC means indicator of compromise: an observed domain or hash always needs context.'
  ]
];
export function Guide({ lang, privacy }: { lang: Language; privacy: boolean }) {
  const it = lang === 'it';
  return (
    <>
      <header className="intro">
        <h1>{privacy ? 'Privacy' : it ? 'Guida all’analisi' : 'Analysis guide'}</h1>
      </header>
      {privacy ? (
        <section className="card">
          <h2>{it ? 'Dati e richieste di rete' : 'Data and network requests'}</h2>
          <p>
            {it
              ? 'All’apertura il servizio di hosting riceve la normale richiesta web, incluso l’IP. Il messaggio, gli allegati e il report rimangono in memoria sul dispositivo. La cancellazione rimuove l’analisi corrente. I file esportati restano nella cartella di download.'
              : 'At startup the hosting service receives the normal web request, including your IP. The message, attachments and report remain in device memory. Clearing removes the current analysis. Exported files remain in your downloads.'}
          </p>
          <p>
            {it
              ? 'Solo il controllo DNS facoltativo comunica il dominio del mittente a Google DNS, che vede anche il tuo IP. Le preferenze di lingua e tema sono locali. Nessuna telemetria o analytics.'
              : 'Only the optional DNS check sends the sender domain to Google DNS, which also sees your IP. Language and theme preferences are local. No telemetry or analytics.'}
          </p>
        </section>
      ) : (
        articles.map(([ti, te, pi, pe], i) => (
          <article key={ti} className="card">
            <h2>{it ? ti : te}</h2>
            <p>{it ? pi : pe}</p>
            {i === 1 && (
              <a href="https://www.rfc-editor.org/rfc/rfc8601" rel="noreferrer">
                RFC 8601 ↗
              </a>
            )}
          </article>
        ))
      )}
    </>
  );
}
