# BiteRadar — Descrizione del progetto

> Documento pensato per accompagnare il curriculum. Spiega **cosa fa** l'applicazione,
> **come è stata sviluppata** dal punto di vista tecnico e **quale è stato il mio ruolo**
> e le competenze che il progetto dimostra.

---

## 1. In una frase

**BiteRadar** è un'applicazione web di **analisi forense delle email**, bilingue (Italiano/Inglese),
che permette di capire se un'email è un tentativo di phishing leggendo le evidenze reali — header,
autenticazione (SPF/DKIM/DMARC), link, mittente dichiarato vs reale — **senza mai caricare l'email
su un server**: tutta l'analisi avviene nel browser.

L'idea è trasformare un'attività normalmente da esperti — leggere gli header di un'email e capire
cosa dimostrano davvero — in un **assistente trasparente e didattico** che mostra le prove, dichiara
cosa non ha potuto verificare e suggerisce l'azione sicura, affiancato da un gioco ("Spot the Phish")
che allena a ragionare allo stesso modo.

---

## 2. Cosa fa l'app (funzionalità per l'utente)

### 🔬 Analizzatore forense (la sezione principale)

L'utente incolla o trascina un'email grezza (`.eml`, `.msg` o i soli header) e ottiene:

- **Mittente visualizzato vs reale** (`From` / `Return-Path` / `Reply-To` / `Sender`).
- **Autenticazione con modello di fiducia:** cosa riportano SPF, DKIM e DMARC, se sono allineati e —
  soprattutto — se quell'header è attendibile (aggiunto dal ricevente fidato) o solo "riportato".
- **Link estratti e resi non cliccabili ("defanged")**, con confronto tra testo del link e destinazione.
- **Esito a 4 livelli** (🔴 segnali forti · 🟠 sospetto · ⚪ nessun segnale evidente · ❔ dati insufficienti)
  con un **pannello di copertura** che dichiara cosa è stato analizzato e cosa no. Non esiste un esito verde:
  un'analisi pulita non significa mai "è sicura".
- **Elenco delle evidenze**, ognuna con il proprio *perché*, i propri *limiti* e le possibili
  *spiegazioni legittime* (inoltri, mailing list, newsletter…).

### 🎮 Gioco "Spot the Phish"

Scenari realistici con **tre risposte**: legittima, phishing o *"non posso stabilirlo: verifico tramite
un altro canale"* — spesso la risposta più corretta nella realtà. Include una **Sfida del giorno**,
uguale per tutti e scelta in modo deterministico dalla data, con risultato condivisibile senza spoiler.

### 🔒 Privacy e sicurezza come funzionalità

- **Nessun upload, nessun backend:** l'email non lascia il browser.
- **Vista testuale di default;** l'HTML, se aperto, è sanificato e isolato in un `<iframe sandbox>` con CSP propria.
- **Parsing in Web Worker** con limiti di risorse (dimensione, profondità MIME, timeout).
- **Report esportabili** con anteprima obbligatoria e oscuramento automatico dei dati personali.

---

## 3. Come è stata sviluppata (aspetti tecnici)

### Stack tecnologico

| Area          | Tecnologia         | Ruolo nel progetto                                               |
| ------------- | ------------------ | ---------------------------------------------------------------- |
| Linguaggio    | **TypeScript**     | Tipizzazione statica di dati e stato, meno errori a runtime      |
| UI            | **React 19**       | Costruzione dell'interfaccia a componenti                        |
| Build tool    | **Vite**           | Dev server rapido e bundling di produzione                       |
| Stile         | **Tailwind CSS**   | Design system utility-first, look coerente e responsivo          |
| Stato         | **Zustand**        | Store centralizzato in memoria (nessuna persistenza dei dati email) |
| Parsing `.eml`| **postal-mime**    | Parsing MIME lato client                                         |
| Isolamento    | **Web Worker + `<iframe sandbox>` + DOMPurify** | Trattare il contenuto ostile dell'email in sicurezza |
| Test          | **Vitest + Playwright** | Test unitari della logica pura e smoke test end-to-end      |

### Architettura (DNA "evidence-first")

Il progetto separa nettamente **osservato / enrichment / derivato / ipotesi**: il parser riporta *fatti*,
il modello di fiducia stabilisce se un fatto è *verificabile*, le regole producono *derivazioni* e l'esito
è un'*ipotesi motivata* con copertura dichiarata.

- **`src/types.ts`** — i tipi condivisi: email parsata, header, risultati di autenticazione, regole, esiti.
- **`src/lib/`** — la **logica pura e testata**: modello di fiducia, estrazione URL/IOC, motore di scoring.
- **`src/rules/`** — le **regole come dati**: ogni regola documenta evidenza, interpretazione, gravità,
  qualità dell'evidenza, limiti e spiegazioni legittime. Aggiungere un segnale significa modificare dati, non codice.
- **`src/worker/`** — il parsing `.eml`/`.msg` isolato in un **Web Worker** con limiti di risorse.
- **`src/content/`** — gli **scenari del gioco** (dati bilingui e fittizi) e la Sfida del giorno.
- **`src/report/`** — l'esportazione con escaping e oscuramento.
- **`src/store.ts`** — lo **stato in memoria** con Zustand; solo le preferenze (lingua, tema) sono persistite.
- **`src/components/`** e **`src/i18n/`** — i componenti UI e i cataloghi di traduzione tipizzati.

### Qualità del progetto (test e CI)

La logica pura (modello di fiducia e motore di scoring) è coperta da **test unitari** (Vitest) con soglie
bloccanti; un **corpus sintetico etichettato** (mai email reali) misura i falsi positivi e impedisce
regressioni degli esiti tra versioni del motore. Smoke test end-to-end con Playwright e controlli di
accessibilità completano i gate.

---

## 4. Il mio ruolo e contributo nel progetto

> ⚠️ _Questa sezione è una traccia da personalizzare: mantieni solo le affermazioni che corrispondono
> davvero alla tua parte di lavoro e taglia il resto — un CV è più forte quando è verificabile._

Nel progetto ho:

- **Progettato il modello di fiducia** che distingue gli header attendibili (aggiunti dal ricevente fidato)
  da quelli solo "riportati", traducendo RFC 8601/8617 in regole applicabili.
- **Progettato l'architettura evidence-first** e modulare, separando dati (regole, scenari), logica pura
  e testata, tipi/contratti, stato e componenti UI.
- **Impostato il livello di isolamento** dei contenuti ostili (vista testuale di default, `<iframe sandbox>`
  con CSP propria, parsing nel Web Worker con limiti) e il modello privacy by design senza backend.
- **Definito il motore di regole e di scoring** deterministico e versionato, con gruppi di correlazione,
  separazione tra gravità ed evidenza e soglia di copertura.
- **Implementato il bilinguismo (IT/EN)** con cataloghi tipizzati senza dipendenze esterne.

---

## 5. Competenze dimostrate

**Sviluppo front-end** — React 19 + TypeScript, stato con Zustand, Tailwind CSS, Web Worker.
**Ingegneria del software** — architettura evidence-first, separazione dati/logica/UI, i18n senza dipendenze, test unitari e CI.
**Dominio: email security** — SPF/DKIM/DMARC e allineamento, lettura degli header e della catena `Received`, ARC, BEC, difesa dal phishing.
**Trasversali** — comunicazione del rischio onesta sui limiti, UI/UX accessibile, documentazione chiara (README bilingue, questo documento).

---

## 6. Come si avvia (per chi vuole provarlo)

```bash
# Requisiti: Node.js 24 LTS
npm ci            # installa le versioni esatte registrate nel lockfile
npm run dev       # avvia solo su loopback: http://127.0.0.1:3000
npm run build     # crea la build di produzione
npm test          # esegue i test (Vitest)
npm run typecheck # controllo dei tipi TypeScript
```

Il comando predefinito non espone il server agli altri dispositivi. L'applicazione è una SPA statica,
interamente lato client: nessun dato email viene inviato o conservato.

---

_BiteRadar — © Chiara Berti, 2026. Assistente all'analisi a scopo educativo e difensivo._
