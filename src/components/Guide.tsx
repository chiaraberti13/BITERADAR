import type { Language } from '../types';
import guides from '../content/guides.json';
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
              ? 'Solo il controllo DNS facoltativo comunica il dominio del mittente a Google DNS, che vede anche il tuo IP. Le preferenze di lingua e tema sono locali. La modalità offline conserva solo i file pubblici dell’app. Nessuna telemetria o analytics.'
              : 'Only the optional DNS check sends the sender domain to Google DNS, which also sees your IP. Language and theme preferences are local. Offline mode caches public app assets only. No telemetry or analytics.'}
          </p>
        </section>
      ) : (
        guides.map((guide) => (
          <article className="card" key={guide.slug}>
            <h2>
              <a href={'/learn/' + lang + '/' + guide.slug + '/'}>{guide.title[lang]}</a>
            </h2>
            <p>{guide.sections[0][lang]}</p>
          </article>
        ))
      )}
    </>
  );
}
