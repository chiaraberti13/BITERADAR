# Security Policy

<p align="center"><a href="#english">🇬🇧 English</a> · <a href="#italiano">🇮🇹 Italiano</a></p>

## English

### Supported versions

Security fixes target the latest revision on the default branch unless a release is explicitly documented as supported.

### Scope

The client-side React application, the `.eml`/`.msg` parser and Web Worker, the trust model and rule engine, the content-isolation layer, the report/redaction pipeline, educational game datasets, the build pipeline, deployment configuration and dependency supply chain.

### Reporting

Do not open a public issue for an unpatched vulnerability. Use GitHub private vulnerability reporting / Security Advisories when available. Include the affected commit/version, impact, minimal reproducible proof, environment assumptions and possible mitigations. **Never attach a real email with personal data** — reproduce with a synthetic sample and remove unrelated sensitive data.

### Responsible testing

Test only systems, data, devices and networks you own or are explicitly authorized to assess. No denial of service, destructive actions, persistence, social engineering, unauthorized interception or third-party access.

### Security requirements

Keep secrets outside source control; treat all email content (headers, body, attachments, file names) as hostile; validate untrusted input and fail safely; never relax the `<iframe sandbox>`, the app CSP or the Web Worker resource limits; keep analysis honest — never present a clean result as "safe" and never present reported, non-verifiable evidence as a confirmed fact. No upload, telemetry, persistence of email content, or network request outside the published network inventory may be introduced without a documented, reviewed exception.

### Disclosure

Allow reasonable remediation time and coordinate publication of exploit-enabling details.

## Italiano

### Versioni supportate

Le correzioni riguardano la revisione più recente del branch predefinito, salvo release esplicitamente supportate.

### Ambito

L'applicazione React lato client, il parser `.eml`/`.msg` e il Web Worker, il modello di fiducia e il motore di regole, il livello di isolamento dei contenuti, la pipeline di report/oscuramento, i dataset didattici del gioco, la pipeline di build, la configurazione di deploy e la supply chain delle dipendenze.

### Segnalazione

Non aprire issue pubbliche per vulnerabilità non corrette. Usa la segnalazione privata / Security Advisories quando disponibile. Indica commit/versione, impatto, PoC minimo riproducibile, assunzioni ambientali e mitigazioni. **Non allegare mai un'email reale con dati personali**: riproduci con un campione sintetico ed elimina i dati sensibili non necessari.

### Test responsabili

Esegui test solo su sistemi, dati, dispositivi e reti propri o esplicitamente autorizzati. Sono esclusi DoS, azioni distruttive, persistenza, social engineering, intercettazioni non autorizzate e accessi a terzi.

### Requisiti di sicurezza

Mantieni i segreti fuori dal repository; tratta ogni contenuto dell'email (header, corpo, allegati, nomi file) come ostile; valida gli input e usa comportamenti fail-safe; non indebolire mai l'`<iframe sandbox>`, la CSP dell'app o i limiti di risorse del Web Worker; mantieni onesta l'analisi — non presentare mai un esito pulito come "sicuro" né un'evidenza riportata e non verificabile come fatto confermato. Nessun upload, telemetria, persistenza di contenuti email o richiesta di rete fuori dall'inventario pubblicato può essere introdotta senza un'eccezione documentata e revisionata.

### Divulgazione

Concedi tempo ragionevole per la correzione e coordina la pubblicazione di dettagli sfruttabili.
