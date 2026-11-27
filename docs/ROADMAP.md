<p align="center"><sub>Progetto · documento di impostazione e roadmap · v3.0 · 2026-10-30</sub></p>

# 📡 BiteRadar — Phishing Forensics & "Spot the Phish"

> **Capisci cosa un'email dimostra, cosa nasconde e cosa devi verificare — senza caricarla su un server.**
> _Understand what an email proves, what it hides and what you still need to check — without uploading it anywhere._

**Nome:** `BiteRadar` è un nome proprio e indipendente, non legato all'ecosistema Olympus. Evoca un "radar" che individua l'abboccata del phishing e si adatta al mini-gioco "Spot the Phish". **Nota di disponibilità:** esiste già un'app di pesca _BiteRadar_ (Google Play) e il dominio `bite-radar.pages.dev` risulta occupato. L'ambito è diverso dalla sicurezza, ma va considerato per dominio e handle. Il nome resta modificabile.

> 🧭 **In una riga:** BiteRadar è un **assistente all'analisi**, trasparente e didattico, non un "rilevatore" che emette sentenze. Mostra le evidenze, dichiara cosa non ha potuto controllare e suggerisce l'azione sicura. Il gioco allena a ragionare allo stesso modo.

---

## 🆕 Cosa cambia rispetto alla v2.1

| Area           | v2.1                                           | v3.0                                                                                                                                    |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Verdetto       | Semaforo verde/giallo/rosso                    | **4 esiti + copertura dell'analisi**; nessun esito significa "puoi fidarti"                                                             |
| Header         | Letti come fatti                               | **Modello di fiducia**: solo gli `Authentication-Results` del ricevente fidato contano; il resto è "riportato, non verificabile"        |
| Autenticazione | SPF/DKIM/DMARC pass/fail                       | Aggiunto **allineamento DMARC**, lettura ARC, rilevamento di header contraffatti o in conflitto                                         |
| Scoring        | Somma di segnali pesati                        | Regole con **evidenza → interpretazione → peso → limiti → spiegazioni legittime**, gruppi di correlazione, motore versionato            |
| BEC            | Non coperto                                    | Regola **"nome visualizzato aziendale + provider gratuito"**                                                                            |
| Formati        | Solo `.eml`                                    | `.eml` + header incollati (MVP), **`.msg` di Outlook** (v0.2)                                                                           |
| Isolamento     | DOMPurify                                      | **Vista testuale di default**, HTML in `<iframe sandbox>` con CSP propria, parsing in **Web Worker** con limiti                         |
| Privacy        | "Unica rete: DNS" (in contrasto con analytics) | **Inventario delle richieste di rete**, imposto via CSP; report con **anteprima e oscuramento**                                         |
| MVP            | Ampio                                          | **Ridotto**: DoH, allegati, omoglifi estesi e gioco spostati a dopo                                                                     |
| Gioco          | Legittima / phishing                           | **Terza risposta "verifico tramite un altro canale"**, scenari ingannevoli in entrambe le direzioni, **Sfida del giorno** senza spoiler |
| Team           | 24 ruoli                                       | **3 "cappelli"** operativi; i ruoli restano come appendice di copertura                                                                 |
| KPI e mercato  | Affermazioni assolute                          | **Ipotesi da validare**; prima metriche di comprensione e falsi positivi, poi traffico                                                  |

---

## ⏱️ Stima di sviluppo (ipotesi)

| Traguardo                                          | Durata (team piccolo dedicato) | Effort             |
| -------------------------------------------------- | ------------------------------ | ------------------ |
| MVP v0.1 — Analyzer essenziale                     | ~3–4 settimane                 | ~20 gg/uomo        |
| v0.2 — Formati reali e vista HTML isolata          | +2 settimane                   | ~12 gg/uomo        |
| **v1.0 "da colloquio"** — gioco e analisi avanzata | **~9–12 settimane totali**     | **~60–75 gg/uomo** |
| Fase crescita                                      | continua                       | —                  |

_Ipotesi: team di 1–3 persone che coprono i [3 cappelli](#-il-team-3-cappelli). Una sola persona part-time → ×2–3. I tempi vanno ricalibrati dopo la Fase 0._

---

## 📑 Indice

1. [TL;DR](#-tldr)
2. [Contesto e ipotesi di mercato](#-contesto-e-ipotesi-di-mercato)
3. [Pubblico, personas e casi d'uso](#-pubblico-personas-e-casi-duso)
4. [Proposta di valore](#-proposta-di-valore)
5. [Cosa BiteRadar può e non può affermare](#-cosa-biteradar-può-e-non-può-affermare)
6. [Esiti dell'analisi e copertura](#-esiti-dellanalisi-e-copertura)
7. [Motore di regole e scoring](#-motore-di-regole-e-scoring)
8. [Funzionalità per rilascio](#-funzionalità-per-rilascio)
9. [Architettura tecnica e stack](#-architettura-tecnica-e-stack)
10. [Isolamento dei contenuti ostili](#-isolamento-dei-contenuti-ostili)
11. [Privacy, rete e report](#-privacy-rete-e-report)
12. [Design, UI/UX e identità visiva](#-design-uiux-e-identità-visiva)
13. [Usabilità per utenti non esperti](#-usabilità-per-utenti-non-esperti)
14. [Accessibilità](#-accessibilità)
15. [Il gioco "Spot the Phish"](#-il-gioco-spot-the-phish)
16. [Qualità: corpus sintetico etichettato](#-qualità-corpus-sintetico-etichettato)
17. [Etica e aspetti legali](#-etica-e-aspetti-legali)
18. [Modello di sviluppo e governance](#-modello-di-sviluppo-e-governance)
19. [Hosting e deploy (Vercel)](#-hosting-e-deploy-vercel)
20. [Comunicazione, crescita e SEO](#-comunicazione-crescita-e-seo)
21. [KPI e metriche (ipotesi)](#-kpi-e-metriche-ipotesi)
22. [Il team: 3 cappelli](#-il-team-3-cappelli)
23. [Roadmap a fasi + tempi](#-roadmap-a-fasi--tempi)
24. [Rischi e mitigazioni](#-rischi-e-mitigazioni)
25. [Appendice: ruoli coperti](#-appendice-ruoli-coperti)

---

## 🎯 TL;DR

BiteRadar ha **due anime complementari**:

1. **Assistente all'analisi forense di email, interamente nel browser.** Incolli un'email grezza (`.eml`, `.msg` o i soli header). BiteRadar mostra:
   - chi dichiara di averla inviata e da dove arriva davvero;
   - cosa riportano **SPF, DKIM e DMARC**, se sono **allineati** e se quell'header è **attendibile**;
   - i link estratti e resi non cliccabili ("defanged");
   - gli **indizi trovati**, ciascuno con il proprio _perché_ e i propri _limiti_;
   - **cosa non è stato possibile controllare**.
2. **Gioco "Spot the Phish".** Scenari realistici in cui la risposta può essere _legittima_, _phishing_ o _"non posso stabilirlo: verifico altrove"_. Include una **Sfida del giorno** con risultato condivisibile senza spoiler.

- **Formato:** SPA statica, 100% client-side. Le email contengono dati personali e **non lasciano il browser**.
- **Perché porta traffico (ipotesi):** i quiz anti-phishing sono un formato con buona circolazione; l'analizzatore è uno strumento pratico e riutilizzabile.

---

## 🔍 Contesto e ipotesi di mercato

> Le affermazioni seguenti sono **ipotesi di lavoro**, da confermare con fonti citate prima del lancio. Non sono basi certe del prodotto.

- **Il phishing è uno dei vettori d'attacco più diffusi e un tema costante.** Da verificare con report aggiornati (es. Verizon DBIR, ENISA Threat Landscape) e citare la fonte nel README.
- **I quiz anti-phishing circolano bene** (es. il _phishing quiz_ di Jigsaw/Google): bisogno universale e punteggio da confrontare.
- **Possibile spazio scoperto:** gli analizzatori di header esistenti sono spesso tecnici e in cloud; i quiz raramente collegano il gioco a un analizzatore. **Da validare** con un'analisi della concorrenza documentata (tabella strumento → funzioni → privacy → lingua) prima di affermare che "nessuno lo fa".
- **Valore come portfolio:** metodo e comunicazione del rischio. Un'analisi che dichiara i propri limiti è più convincente di un verdetto netto. Fonte coerente: [TryHackMe – portfolio](https://tryhackme.com/resources/blog/how-to-build-a-cyber-security-portfolio-that-gets-you-hired-in-2027).

---

## 👥 Pubblico, personas e casi d'uso

**Persona A — "Giulia, help-desk / aspirante SOC".** Fa triage di email segnalate. Usa Outlook: trascina l'email sul desktop e ottiene un file **`.msg`**, non un `.eml`. Le serve un'analisi rapida da allegare al ticket, **con i dati personali oscurati**.

**Persona B — "Franco, titolare di PMI senza SOC".** Ha ricevuto un'email strana. Vuole capire in 30 secondi, in italiano semplice, **cosa fare**. Non deve uscirne convinto che un esito tranquillo significhi "è sicura".

**Persona C — "Studenti e curiosi".** Arrivano dal gioco o dalla Sfida del giorno e restano per imparare.

**Casi d'uso tipici**

1. "Incollo l'`.eml` → DMARC fallito per il dominio nel `From`, link testuale diverso dalla destinazione reale → **esito: segnali forti di rischio**, con il perché e l'azione consigliata."
2. "Incollo un'email del 'direttore' da un indirizzo Gmail. SPF, DKIM e DMARC risultano tutti superati → **esito: elementi sospetti da verificare**. La regola BEC spiega che l'autenticazione conferma solo il provider, non l'identità."
3. "Esporto un report in Markdown, controllo l'anteprima, oscuro i destinatari e lo allego al ticket."
4. "Il team fa la Sfida del giorno e confronta i risultati su Slack."

---

## 💎 Proposta di valore

1. **Onestà sui limiti:** ogni analisi dichiara cosa è stato verificato, cosa è solo riportato e cosa manca.
2. **Analizzatore e gioco si alimentano:** le regole del motore sono gli stessi indizi che il gioco insegna, compresi i loro limiti.
3. **Privacy by design, imposta tecnicamente:** nessun upload; le uniche richieste di rete sono elencate e bloccate dalla CSP.
4. **Comprensibile ai non esperti**, con dettagli tecnici espandibili per chi li vuole.
5. **Formati reali** (`.eml`, `.msg`, header incollati), bilingue IT/EN, accessibile.

---

## 🧱 Cosa BiteRadar può e non può affermare

Questa sezione è il **modello di fiducia** del prodotto. Ogni testo dell'interfaccia deve rispettarlo.

| Funzione                            | Cosa BiteRadar può affermare                                       | Cosa **non** può affermare                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Lettura di `Authentication-Results` | "Il server _X_ di chi ha ricevuto l'email riporta `dkim=pass`"     | Che la firma DKIM sia valida: BiteRadar non la ricalcola                                                    |
| Attendibilità di quell'header       | Attendibile solo se aggiunto dal **ricevente fidato** (vedi sotto) | Nulla, se l'header compare sotto il confine di fiducia o ha un mittente sconosciuto                         |
| Catena `Received`                   | I salti aggiunti dall'infrastruttura del ricevente                 | Che i salti più in basso siano veri: un mittente può inventarli                                             |
| Lookup DNS (DoH, opzionale)         | "Il dominio pubblica **oggi** questo record SPF/DMARC"             | Che il record fosse lo stesso al momento dell'invio, né che il messaggio sia autentico                      |
| Autenticazione superata             | "Il messaggio risulta autorizzato dal dominio _Y_"                 | Che il mittente sia chi dice di essere: un account compromesso o un indirizzo gratuito superano i controlli |
| Nessun segnale trovato              | "Non abbiamo rilevato segnali evidenti con i dati disponibili"     | **Mai** "l'email è sicura"                                                                                  |

### Come si stabilisce il confine di fiducia

1. **Identificare il ricevente.** Dal primo `Received` in alto, da `Delivered-To` e dagli `authserv-id` noti (es. `mx.google.com`, `*.protection.outlook.com`). Se resta ambiguo, l'interfaccia chiede: _"Da quale servizio hai scaricato l'email?"_.
2. **Considerare solo gli `Authentication-Results` del ricevente**, cioè quelli con il suo `authserv-id` e posizionati sopra il salto in cui l'email è entrata nella sua infrastruttura. Riferimento: [RFC 8601](https://www.rfc-editor.org/rfc/rfc8601).
3. **Tutto il resto è "riportato, non verificabile":** header sotto il confine, `authserv-id` sconosciuti, risultati inseriti nel corpo originale.
4. **Header in conflitto** (es. due `Authentication-Results` con esiti opposti) → segnale di anomalia: _"possibile header contraffatto"_.
5. **Formati specifici dei provider:** parser tollerante (es. il campo `compauth` di Microsoft 365, header senza `authserv-id`). Principio **"skip, never guess"**: se un header non è interpretabile con certezza, si dichiara come non interpretato.
6. **ARC** ([RFC 8617](https://www.rfc-editor.org/rfc/rfc8617)): gli header `ARC-*` di inoltri e mailing list vengono **letti e mostrati** come contesto, non usati per ribaltare un esito negativo.

---

## 🚦 Esiti dell'analisi e copertura

Il semaforo a tre colori è sostituito da **quattro esiti**. Ognuno ha icona, etichetta testuale e frase di sintesi, quindi non dipende dal solo colore.

| Esito                                   | Quando                                                             | Frase tipo                                                                                                                    |
| --------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| 🔴 **Segnali forti di rischio**         | Almeno un segnale di gravità alta con evidenza attendibile         | "Questa email dice di arrivare da _banca.it_, ma il server di chi l'ha ricevuta segnala che _banca.it_ non l'ha autorizzata." |
| 🟠 **Elementi sospetti da verificare**  | Segnali medi, oppure segnali alti con evidenza non verificabile    | "Alcuni elementi sono insoliti. Verifica con il mittente tramite un canale che conosci già."                                  |
| ⚪ **Nessun segnale evidente rilevato** | Nessun segnale significativo e copertura sufficiente               | "Non abbiamo rilevato segnali evidenti. Questo **non garantisce** che l'email sia autentica."                                 |
| ❔ **Dati insufficienti**               | Copertura sotto la soglia minima (es. solo il corpo, senza header) | "Con i dati forniti non possiamo valutare l'email. Prova a incollare gli header completi."                                    |

**Non esiste un esito verde.** Il colore neutro (⚪) evita che l'utente legga "via libera".

### Pannello "Copertura dell'analisi"

Sempre visibile accanto all'esito. Esempio:

```
Copertura dell'analisi
✔ Header completi presenti
✔ Authentication-Results del ricevente trovato (mx.google.com)
✔ Link estratti: 3
✖ Corpo HTML non disponibile (incollati solo gli header)
✖ Allegati non analizzati
– Lookup DNS non eseguito (opzionale)
```

---

## ⚖️ Motore di regole e scoring

**Principi:** deterministico, trasparente, versionato. **Il punteggio non è una probabilità** e non viene mai mostrato come percentuale.

### Scheda di ogni regola (dati, non codice)

Ogni regola documenta: **evidenza → interpretazione → gravità → qualità dell'evidenza → limiti → spiegazioni legittime**.

Esempio di regola nel file `src/rules/auth.ts`:

```ts
export const dmarcFailAligned: Rule = {
  id: 'auth.dmarc.fail',
  version: 1,
  correlationGroup: 'auth-from-domain', // segnali correlati: conta solo il più grave
  severity: 'high',
  evidence: {
    it: "L'Authentication-Results del ricevente riporta dmarc=fail per il dominio nel campo From.",
    en: "The recipient's Authentication-Results reports dmarc=fail for the From domain."
  },
  interpretation: {
    it: 'Il dominio mostrato come mittente non ha autorizzato questo messaggio.',
    en: 'The domain shown as sender did not authorise this message.'
  },
  limits: {
    it: "Se l'header non proviene dal ricevente fidato, il risultato non è verificabile.",
    en: 'If the header does not come from the trusted recipient, the result cannot be verified.'
  },
  legitimateExplanations: {
    it: ['Inoltro automatico', 'Mailing list che modifica il messaggio'],
    en: ['Automatic forwarding', 'Mailing list that modifies the message']
  }
};
```

### Regole chiave della v1.0

| Regola                                                                                                             | Perché conta                                                                          | Limiti / spiegazioni legittime                                         |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **DMARC fail** (ricevente fidato)                                                                                  | Il dominio nel `From` non ha autorizzato l'invio                                      | Inoltri, mailing list (controllare ARC)                                |
| **SPF/DKIM pass ma non allineati** con il dominio nel `From` ([RFC 7489](https://www.rfc-editor.org/rfc/rfc7489))  | "Autenticato", ma per un altro dominio: possibile spoofing del mittente visualizzato  | Servizi di invio terzi configurati male                                |
| **Nome visualizzato aziendale/di ruolo + provider gratuito** (es. `"Mario Rossi (Amministrazione)" <x@gmail.com>`) | Schema tipico della BEC; l'autenticazione risulta superata perché conferma solo Gmail | Piccole attività che usano davvero indirizzi gratuiti                  |
| **`Reply-To` su dominio diverso dal `From`**                                                                       | Le risposte finiscono a un terzo                                                      | Frequente in newsletter e ticketing                                    |
| **`From` ≠ `Return-Path`**                                                                                         | Da solo è **debole**                                                                  | Normale nelle newsletter: gravità bassa                                |
| **Testo del link ≠ destinazione reale**                                                                            | Il link mostra un indirizzo e porta altrove                                           | Tracciamento dei click nelle newsletter                                |
| **Header di autenticazione in conflitto**                                                                          | Possibile contraffazione                                                              | Più ricevitori in catena (es. gateway di sicurezza)                    |
| **DKIM assente**                                                                                                   | Da solo **non dimostra** un attacco                                                   | Molti server legittimi non firmano                                     |
| **Linguaggio d'urgenza**                                                                                           | Leva psicologica comune                                                               | Le email legittime possono essere urgenti: gravità bassa, mai decisiva |

### Regole di combinazione

- **Gruppi di correlazione:** dentro lo stesso gruppo conta solo il segnale più grave, non la somma. Esempio: "DMARC fail" e "SPF non allineato" sullo stesso dominio non si sommano.
- **Gravità e qualità dell'evidenza sono separate:** un segnale grave basato su un header non verificabile porta a 🟠, non a 🔴.
- **Soglia di copertura:** sotto la soglia l'esito è sempre ❔, qualunque siano i segnali.
- **Versione del motore** (`engine: 1.3.0`) riportata in ogni report, così un'analisi resta riproducibile.

---

## 🧰 Funzionalità per rilascio

### MVP — v0.1 (≈3–4 settimane)

- **Input:** incolla o trascina `.eml`, oppure incolla i soli header. Guida "Come copiare gli header" per Gmail, Outlook e Thunderbird: è la soluzione per Outlook finché non arriva il supporto `.msg`.
- **Mittenti:** visualizzato vs reale (`From` / `Return-Path` / `Reply-To` / `Sender`).
- **Autenticazione con modello di fiducia:** SPF/DKIM/DMARC dal ricevente fidato, **allineamento DMARC**, conflitti tra header.
- **Regola BEC** (nome visualizzato + provider gratuito).
- **Link:** estrazione defanged (`hxxp://`, `[.]`), mai cliccabili; confronto testo del link vs destinazione.
- **Esiti a 4 livelli + pannello copertura + elenco evidenze** con limiti e spiegazioni legittime.
- **Vista solo testuale** del corpo (nessun rendering HTML nell'MVP).
- **Report Markdown** con anteprima e oscuramento base (vedi [report](#report-esportabili-e-oscuramento)).
- **Pulsante "Cancella analisi".**
- **5 email sintetiche di esempio**, i18n IT/EN, tema chiaro/scuro, accessibilità AA.

### v0.2 — Formati reali (≈+2 settimane)

- **Supporto `.msg` di Outlook** con parser client-side, es. [`@kenjiuno/msgreader`](https://www.npmjs.com/package/@kenjiuno/msgreader), eseguito nel Web Worker con gli stessi limiti di sicurezza.
- **Vista HTML opzionale** in `<iframe>` isolato (vedi [isolamento](#-isolamento-dei-contenuti-ostili)), con evidenziazione degli indizi.
- **Lettura ARC** e riconoscimento di inoltri e mailing list per ridurre i falsi positivi.

### v1.0 — Prodotto completo (≈9–12 settimane totali)

- **Gioco "Spot the Phish"** con 3 risposte, livelli e **Sfida del giorno** (vedi [gioco](#-il-gioco-spot-the-phish)).
- **Pannello IOC:** domini, IP e hash defangati e copiabili, senza query automatiche a terzi.
- **Lookup DoH opzionale**, su clic esplicito: invia **solo il nome del dominio**; mostra "record pubblicati oggi".
- **Domini sosia e omoglifi:** decodifica IDN/punycode, confronto con le tabelle di confusabili di [Unicode UTS #39](https://www.unicode.org/reports/tr39/). Rilevamento presentato come "da verificare", mai come certezza.
- **Metadati degli allegati, senza esecuzione:** tipo reale vs estensione, flag macro Office, flag `JavaScript` / `EmbeddedFile` nei PDF.
- **Report** anche in HTML e PDF.
- **Spiegazioni "Attacco vs Difesa":** come è costruito l'inganno e come si difende un'organizzazione (DMARC in `p=reject`, filtri, formazione).

### Fase crescita (continua)

Editor di scenari per formatori, modalità campagna awareness con badge, PWA offline-first, estensione "analizza questa email" (dove l'API del client lo consente), libreria di scenari della community revisionata.

---

## 🏗️ Architettura tecnica e stack

Tutto **client-side**.

| Area                    | Scelta                                                            | Documentazione                                                                                                                               |
| ----------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Linguaggio / UI / Build | **TypeScript + React 19 + Vite**                                  | [react.dev](https://react.dev), [vite.dev](https://vite.dev)                                                                                 |
| Stile                   | **Tailwind CSS**                                                  | [tailwindcss.com/docs](https://tailwindcss.com/docs)                                                                                         |
| Stato                   | **Zustand** (solo in memoria, nessuna persistenza dei dati email) | [zustand.docs.pmnd.rs](https://zustand.docs.pmnd.rs/)                                                                                        |
| Parsing `.eml`          | **`postal-mime`**                                                 | [github.com/postalsys/postal-mime](https://github.com/postalsys/postal-mime)                                                                 |
| Parsing `.msg`          | **`@kenjiuno/msgreader`** (da valutare in Fase 0)                 | [npmjs.com/package/@kenjiuno/msgreader](https://www.npmjs.com/package/@kenjiuno/msgreader)                                                   |
| Isolamento parsing      | **Web Worker**                                                    | [MDN – Web Workers API](https://developer.mozilla.org/docs/Web/API/Web_Workers_API)                                                          |
| Sanificazione HTML      | **DOMPurify** + `<iframe sandbox>`                                | [DOMPurify](https://github.com/cure53/DOMPurify), [MDN – iframe sandbox](https://developer.mozilla.org/docs/Web/HTML/Element/iframe#sandbox) |
| DNS opzionale           | **DNS-over-HTTPS** (Cloudflare 1.1.1.1)                           | [DoH docs](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/)                                                             |
| Test                    | **Vitest + Playwright**                                           | [vitest.dev](https://vitest.dev), [playwright.dev](https://playwright.dev)                                                                   |
| Hosting                 | **Vercel**                                                        | [vercel.com/docs](https://vercel.com/docs)                                                                                                   |

**Principi (DNA AEGIS "evidence-first"):**

- **Osservato / Enrichment / Derivato / Ipotesi** separati: il parser riporta _fatti_; il modello di fiducia stabilisce se un fatto è _verificabile_; le regole producono _derivazioni_; l'esito è un'_ipotesi motivata_ con copertura dichiarata.
- **Scoring deterministico e versionato:** nessun "modello magico".
- **Nessun upload, nessun backend.**
- **Regole e scenari come dati:** aggiungere un segnale o uno scenario significa modificare dati, non codice.

```
src/
├─ worker/     # parsing .eml/.msg nel Web Worker, con limiti di risorse
├─ lib/        # modello di fiducia, estrazione URL/IOC, motore di scoring (puro, testato)
├─ rules/      # regole: evidenza, interpretazione, gravità, limiti, spiegazioni legittime
├─ content/    # scenari del gioco e Sfida del giorno (dati, bilingui, FITTIZI)
├─ report/     # esportazione con escaping e oscuramento
├─ components/ # Analyzer, OutcomePanel, CoveragePanel, EvidenceList,
│              # SandboxedBody, RedactionPreview, PhishGame, DailyChallenge
├─ store.ts    # stato in memoria (analisi corrente, punteggio, lingua, tema)
└─ i18n/
tests/
└─ corpus/     # corpus sintetico etichettato (vedi sezione Qualità)
```

---

## 🛡️ Isolamento dei contenuti ostili

Il contenuto dell'email (header, corpo, allegati, nomi file) va trattato **sempre come ostile**. DOMPurify è un livello di difesa, non l'intera difesa.

### Requisiti verificabili

1. **Vista testuale come default.** L'HTML si apre solo su richiesta.
2. **HTML sanificato e isolato in `<iframe>` con `sandbox` vuoto.** Un `sandbox` senza valori applica tutte le restrizioni: niente script, form, popup, navigazione; l'iframe ha un'origine opaca e non può raggiungere lo stato dell'app.

   Componente `src/components/SandboxedBody.tsx`:

   ```tsx
   const csp = "default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src 'none'; form-action 'none'";

   const srcDoc = `<!doctype html><html><head>
   <meta http-equiv="Content-Security-Policy" content="${csp}">
   </head><body>${sanitizedHtml}</body></html>`;

   <iframe
     sandbox="" // massima restrizione: NON aggiungere allow-scripts né allow-same-origin
     srcDoc={srcDoc}
     referrerPolicy="no-referrer"
     title={t('email.body.isolated')}
   />;
   ```

   > ⚠️ Non usare `allow-same-origin`: renderebbe l'iframe accessibile dalla pagina principale e, combinato con `allow-scripts`, annullerebbe la sandbox.

3. **Nessuna risorsa esterna:** immagini remote, CSS esterni, font, frame e media bloccati (anti tracking-pixel). Le immagini remote sono sostituite da un segnaposto con il dominio defangato.
4. **Parsing in Web Worker con limiti:** dimensione massima del file, profondità di annidamento MIME, numero di parti, timeout. Al superamento: errore gentile ed esito ❔.
5. **Nessuna persistenza:** nessun contenuto email in `localStorage`, IndexedDB, log, analytics o crash report.
6. **"Cancella analisi":** svuota lo stato, termina il Worker, revoca gli `ObjectURL`.
7. **CSP dell'app** stringente: niente `eval`, `connect-src` limitato alle sole origini dell'[inventario di rete](#inventario-delle-richieste-di-rete).
8. **Report:** oggetti, nomi e URL vengono **escapati** prima dell'esportazione, per evitare iniezioni di Markdown/HTML nel documento generato.

---

## 🔐 Privacy, rete e report

### Inventario delle richieste di rete

La v2.1 affermava "unica funzione di rete: DNS" e allo stesso tempo prevedeva analytics. La v3.0 risolve la contraddizione con un inventario esplicito, pubblicato nella pagina Privacy e **imposto dalla CSP** (`connect-src`).

| Richiesta                                                                                                  | Quando                                    | Dati inviati                                                | Disattivabile         |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------- | --------------------- |
| Caricamento dell'app (CDN Vercel)                                                                          | All'apertura                              | Richiesta HTTP standard (IP, user-agent)                    | No                    |
| Lookup DoH                                                                                                 | Solo su clic esplicito                    | **Solo il nome del dominio** mittente                       | Sì, spento di default |
| Analytics aggregate cookieless (es. [Vercel Web Analytics](https://vercel.com/docs/analytics) o Plausible) | Visite e eventi tipo "partita completata" | **Nessun contenuto email**, nessun identificativo personale | Sì                    |
| Qualsiasi altra                                                                                            | —                                         | —                                                           | Bloccata dalla CSP    |

**GDPR by design:** minimizzazione, nessuna conservazione, pagina Privacy dedicata. La scelta definitiva dello strumento di analytics va documentata in Fase 0.

### Report esportabili e oscuramento

Un report può contenere indirizzi, IP, oggetti e token nei link. Per questo:

1. **Anteprima obbligatoria** prima dell'esportazione.
2. **Selezione dei campi** da includere.
3. **Oscuramento automatico** (attivo di default), con sostituzione `[OSCURATO]`:
   - destinatari (`To`, `Cc`, `Delivered-To`);
   - IP privati RFC 1918 negli header `Received` (`10.x`, `172.16–31.x`, `192.168.x`);
   - parametri delle query string negli URL (spesso contengono token o l'indirizzo della vittima).
4. **Oscuramento manuale** con selezione del testo (nomi propri, numeri di pratica).
5. **Avviso visibile:** _"L'oscuramento automatico non garantisce l'anonimizzazione completa. Controlla l'anteprima."_

**Gioco:** la condivisione include solo punteggio e identificativo del set, mai contenuti.

---

## 🎨 Design, UI/UX e identità visiva

- **Metafora del radar:** palette scura con un accento luminoso (oro/ciano) che "aggancia" gli indizi nell'email.
- **Esiti senza verde:** rosso, arancio, neutro e grigio-punto-interrogativo, sempre con icona ed etichetta.
- **Due esperienze coerenti:** Analyzer (serio, forense) e Game (giocoso, a carte) condividono il design system con "temperatura" diversa.
- **Evidenza visiva degli indizi:** highlight sui punti critici + tooltip "perché conta / cosa non dimostra" (micro-diagrammi SVG).
- **Distinzione visiva tra "verificato" e "riportato":** badge diversi (es. ✔ verificato dal ricevente / ◌ riportato, non verificabile).
- **Share card** del punteggio (SVG→PNG) e **testo della Sfida del giorno**.

---

## 🧑‍🎓 Usabilità per utenti non esperti

Requisito esplicito: utilizzabile via web **anche da chi non è esperto**.

- **Linguaggio semplice di default:** "questa email dice di arrivare da X, ma in realtà parte da Y". I dettagli tecnici si espandono con "Mostra dettagli tecnici".
- **Incolla e basta:** area unica per incollare o trascinare `.eml` / `.msg` / header, con riconoscimento automatico del formato.
- **Azione consigliata sempre presente**, anche con esito ⚪: es. _"Se ti chiede pagamenti o credenziali, verifica con il mittente tramite un contatto che già conosci."_
- **Onboarding** con email di esempio sintetiche → risultato in un clic.
- **Glossario inline** (SPF, DKIM, DMARC, allineamento, IOC) on-hover e on-focus.
- **Errori gentili** e nessun gergo non spiegato.

**Criteri di accettazione (verificati con test utente):**

1. Una persona non esperta capisce in una frase l'esito e il motivo.
2. **Distingue "nessun segnale rilevato" da "email sicura".**
3. Sa quale azione compiere.

---

## ♿ Accessibilità

**WCAG 2.1 AA:** contrasto, navigazione completa da tastiera, screen reader (esito e copertura annunciati con `aria-live`), significati mai affidati al solo colore, `prefers-reduced-motion`, responsive 390/768 px. L'`<iframe>` del corpo ha un `title` descrittivo e la vista testuale è sempre disponibile come alternativa. axe in CI + verifica manuale prima di ogni release.

---

## 🎮 Il gioco "Spot the Phish"

### Obiettivo didattico

Insegnare a **ragionare sulle evidenze**, non scorciatoie come "errori grammaticali = phishing".

### Tre risposte possibili

1. **Legittima**
2. **Phishing**
3. **"Non posso stabilirlo: verifico tramite un altro canale"** — spesso la risposta più corretta nella realtà, e il gioco la premia.

### Struttura di ogni scenario (dati, bilingui, fittizi)

| Campo                        | Contenuto                                      |
| ---------------------------- | ---------------------------------------------- |
| Cosa hai osservato           | Gli indizi presenti                            |
| Perché conta                 | Il meccanismo dell'inganno o della legittimità |
| Cosa **non** puoi concludere | Il limite dell'indizio                         |
| Azione sicura                | Cosa fare nella realtà                         |

### Composizione del set

- Phishing evidenti (per i livelli iniziali).
- **Email legittime dall'aspetto sospetto** (newsletter con `Return-Path` diverso, avvisi urgenti veri).
- **Phishing ben scritti con autenticazione superata** (account compromesso, BEC da provider gratuito).
- Casi in cui la risposta corretta è la verifica tramite altro canale.

### Sfida del giorno

- **Un'email al giorno, uguale per tutti**, scelta in modo deterministico dalla data UTC su un pool statico. Nessun backend.
- **Risultato condivisibile senza spoiler** (non rivela il verdetto):

  ```
  📡 BiteRadar Daily #42
  🔍 Indizi trovati: 4/4
  ⏱️ 24s
  🟩🟩🟩🟩
  ```

- La modalità libera resta disponibile con livelli di difficoltà.

---

## 🧪 Qualità: corpus sintetico etichettato

La coverage ≥ 80% su `lib/` resta un gate, ma **non garantisce la correttezza**. Serve un corpus di email **sintetiche** (mai reali), ciascuna con l'esito atteso e i segnali attesi.

| Categoria                                                          | Scopo                                  |
| ------------------------------------------------------------------ | -------------------------------------- |
| Legittime multi-provider (Gmail, Microsoft 365, provider italiani) | Misurare i falsi positivi              |
| Newsletter e servizi di invio terzi                                | `From` ≠ `Return-Path` legittimo       |
| Inoltri e mailing list (con e senza ARC)                           | Autenticazione alterata legittimamente |
| Header `Authentication-Results` contraffatti o in conflitto        | Modello di fiducia                     |
| SPF/DKIM superati ma non allineati                                 | Regola di allineamento                 |
| BEC da provider gratuito                                           | Regola nome visualizzato               |
| MIME malformato, annidamenti estremi, file enormi                  | Robustezza e limiti del Worker         |
| HTML ostile (payload XSS noti, CSS malevolo, tracking pixel)       | Isolamento                             |
| `.msg` di Outlook                                                  | Parser `.msg`                          |

**Metriche del corpus in CI:** tasso di falsi positivi sulle legittime, tasso di esiti ❔ attesi, nessuna regressione degli esiti tra versioni del motore.

---

## ⚖️ Etica e aspetti legali

- **Tutti gli scenari sono fittizi:** marchi, loghi e persone inventati o parodici, nessuna imitazione di organizzazioni reali.
- **Disclaimer:** BiteRadar è un **supporto all'analisi**, non un verdetto tecnico o legale. Falsi positivi e negativi sono possibili e spiegati.
- **Nel repository solo email sintetiche**, mai `.eml`/`.msg` reali con dati personali.
- Licenza **GPL-3.0**.

---

## 🛠️ Modello di sviluppo e governance

> Requisito: **il team ha totale libertà di sviluppo coerente col progetto** e **ogni modifica va pubblicata sul `main` del repo**.

**Libertà entro vincoli non negoziabili:**

1. **Privacy:** zero upload, inventario di rete rispettato, GDPR.
2. **Sicurezza:** contenuto email ostile, isolamento come da sezione dedicata.
3. **Onestà dell'esito:** modello di fiducia, copertura dichiarata, mai "sicura".
4. Design system e accessibilità.

**Workflow Git — ogni modifica su `main` (GitHub Flow):**

1. `main` sempre **deployabile** e **protetto** (PR obbligatoria, CI verde + review).
2. Feature branch (`feat/…`, `fix/…`) → **Pull Request** → CI + **preview deploy Vercel**.
3. Review con checklist (inclusi i 3 vincoli sopra) → **merge su `main`** → **deploy automatico in produzione**.
4. **Conventional Commits** ([spec](https://www.conventionalcommits.org/)) + **SemVer** per l'app + **versione separata del motore di regole** + changelog.

**Gate bloccanti:** ESLint, TypeScript strict, Vitest (coverage su `lib/`), **corpus etichettato senza regressioni**, build, axe, audit dipendenze, Lighthouse CI, **test della CSP** (nessuna richiesta fuori inventario in e2e).

---

## ▲ Hosting e deploy (Vercel)

**Scelta consigliata: [Vercel](https://vercel.com/docs)** per la SPA statica:

- **Production su `main`:** ogni merge pubblica in produzione, con rollback immediato.
- **Preview deploy per ogni PR:** per validare esiti, testi e gioco prima del merge.
- **Zero-config** per Vite, HTTPS, CDN, dominio personalizzato (consigliato un sottodominio del tuo sito, vista la nota su `bite-radar.*`).
- **Header di sicurezza** (CSP, `Referrer-Policy`, `Permissions-Policy`) configurati in `vercel.json`.
- **Costo:** piano Hobby gratuito, pensato per uso personale non commerciale. Verificare i [termini aggiornati](https://vercel.com/docs/plans/hobby) prima del lancio.

**Alternative:** Cloudflare Pages, GitHub Pages (senza preview per PR nativi).

---

## 📣 Comunicazione, crescita e SEO

**Loop di crescita (ipotesi):** la **Sfida del giorno** crea ritorno quotidiano e condivisione → chi gioca scopre l'**analizzatore** → chi cerca "analizza header email" arriva via SEO → ogni pagina rimanda al tuo profilo.

- **SEO:** "come capire se un'email è phishing", "email header analyzer", "SPF DKIM DMARC spiegato", "allineamento DMARC", "file .msg analizzare".
- **Lancio duale:** community tecnica (r/cybersecurity, r/blueteamsec, HN) e generalista (LinkedIn, divulgazione).
- **Posizionamento nei testi:** "assistente all'analisi", mai "rilevatore infallibile".
- **Awareness kit** gratuito per PMI e scuole → backlink.

---

## 📊 KPI e metriche (ipotesi)

Tutti i valori sono **ipotesi da validare**. L'ordine conta: prima la qualità, poi il traffico.

### 1. Qualità e comprensione (prima del lancio)

| Metrica                                                      | Obiettivo iniziale       | Fonte                     |
| ------------------------------------------------------------ | ------------------------ | ------------------------- |
| Non esperti che comprendono esito e motivo                   | ≥ 80%                    | Test utente (5–8 persone) |
| Non esperti che distinguono "non rilevato" da "sicuro"       | ≥ 80%                    | Test utente               |
| Non esperti che indicano l'azione corretta                   | ≥ 80%                    | Test utente               |
| Falsi positivi 🔴 su email legittime del corpus              | ≤ 5%                     | Corpus in CI              |
| Miglioramento decisionale su scenari **nuovi** dopo il gioco | Miglioramento misurabile | Test pre/post             |

### 2. Adozione (dopo il lancio)

| Metrica                                    | 3 mesi      | 12 mesi     | Fonte                |
| ------------------------------------------ | ----------- | ----------- | -------------------- |
| Visitatori unici / mese                    | 3.000       | 30.000+     | Analytics cookieless |
| Partite / mese                             | 1.000       | 15.000+     | Evento aggregato     |
| Giocatori di ritorno alla Sfida del giorno | da misurare | da misurare | Evento aggregato     |
| Stelle GitHub                              | 150         | 1.200+      | GitHub               |
| Query SEO in top-10                        | 6           | 50+         | Search Console       |
| Lighthouse (Perf/A11y)                     | ≥ 90        | ≥ 95        | Lighthouse CI        |

---

## 🧑‍🤝‍🧑 Il team: 3 cappelli

Un team di 1–3 persone copre tutto il lavoro con **tre cappelli**. Ogni cappello ha un responsabile anche quando la stessa persona ne indossa più di uno.

| Cappello                    | Responsabilità                                                                                          | Competenze chiave                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **1. Core & Security**      | Parser `.eml`/`.msg`, modello di fiducia, regole e scoring, isolamento, DoH, corpus e test              | Standard email (RFC 5322, 7208, 6376, 7489, 8601, 8617), secure coding, Vitest/Playwright |
| **2. Product & Experience** | Flussi Analyzer e Game, UI, accessibilità, testi in linguaggio semplice, scenari didattici, test utente | React, design system, SVG, WCAG, UX writing, security awareness                           |
| **3. Delivery & Growth**    | CI/CD, Vercel, release, privacy e licenze, SEO, contenuti, community, analytics                         | GitHub Actions, GDPR, SEO, content marketing                                              |

L'elenco completo dei ruoli e la loro mappatura sui cappelli è in [appendice](#-appendice-ruoli-coperti).

---

## 🗺️ Roadmap a fasi + tempi

> Legenda stato `[ ]`/`[~]`/`[x]` · priorità **P0**→**P3** · cappelli: **C** = Core & Security, **P** = Product & Experience, **D** = Delivery & Growth. Settimane (W1…) indicative.

**Stato di rilascio al 27 novembre 2026.** Versione candidata `1.0.0-rc.1`, motore `1.0.1`. Il [protocollo di verifica](VALIDATION.md) descrive corpus, limiti, comandi e prove con utenti. Il sito pubblico risponde HTTP 200 con CSP, Referrer-Policy e Permissions-Policy. Vercel ha pubblicato `main` sul piano Hobby. Il caricamento dell’analizzatore è stato verificato sul [sito di produzione](https://biteradar-h8xa.vercel.app/). Per questa lavorazione è stata richiesta la pubblicazione diretta su `main`. La protezione con PR obbligatoria resta aperta.

Le prove locali coprono le quattro classi di esito, i report, la modalità offline e l’accessibilità automatizzata. Il kit contiene la scheda per i cinque partecipanti e la campagna usa casi distinti per pre-test e post-test. Restano da raccogliere i risultati con partecipanti reali e i dati di adozione. Per la v1.0 il criterio di accettazione è il collaudo simulato documentato nel protocollo. La raccolta iniziale è sintetica e i contributi della community richiedono revisione.

### Criteri di chiusura della candidata

Baseline verificata sul commit `6168b04`. La [CI della candidata](https://github.com/chiaraberti13/BITERADAR/actions/runs/45959144246) ha superato 48 test Vitest, 8 prove browser, audit dipendenze e build del pacchetto Thunderbird. Lighthouse sulla pagina iniziale ha misurato 97/100 per le prestazioni e 100/100 per l’accessibilità. Le caselle delle fasi descrivono l’implementazione. Per decidere il rilascio valgono le prove sotto.

| Criterio                     | Evidenza disponibile                                                                                                                                                                                                  | Decisione e lavoro residuo                                                                                                                                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Analisi e falsi positivi     | Corpus con quattro esiti, conflitti, allineamento e BEC. Il gate ammette al massimo il 5% di esiti rossi su 12 fixture legittime ed è passato, quindi 0/12.                                                           | Chiuso sul corpus corrente. Rieseguire lo stesso insieme quando cambia il motore.                                                                                                                                                        |
| Formati e isolamento         | EML e MSG equivalenti con allegato sintetico, MSG troncato, HTML filtrato, immagini e link rimossi nell’iframe, nessuna richiesta esterna nel percorso E2E esercitato.                                                | Chiuso per i campioni provati. Il confronto tra versioni richiede denominatori e fixture identici.                                                                                                                                       |
| Report e riservatezza        | Test su oscuramento, anteprima, download Markdown, cancellazione e preferenze. HTML e stampa PDF hanno già codice.                                                                                                    | Chiuso su Chromium: HTML scaricato e testo del PDF stampato coincidono con l’anteprima dopo oscuramento manuale. Il test verifica sia i dati esclusi sia quelli mantenuti.                                                               |
| Gioco, formazione e offline  | Sfida UTC, risultato condivisibile, PNG, raccolta modificabile e giocabile. Un test ricarica l’app offline e analizza un MSG.                                                                                         | Campagna collaudata su nove casi distinti, con conteggio separato pre/post, badge disponibile e riavvio. La misurazione con partecipanti è demandata al follow-up sul campo.                                                             |
| Comprensione e accessibilità | Axe sulla pagina iniziale a tre larghezze e sui percorsi esito, report e gioco; navigazione da tastiera provata in Chromium. Il test browser verifica anche l’aggiornamento della regione live con esito e copertura. | Cinque casi sintetici verificano esito, limite e azione suggerita. Tastiera e snapshot ARIA coprono esito, report e gioco. Comprensione umana e resa vocale restano da valutare sul campo.                                               |
| Estensione Thunderbird       | Pacchetto installato e popup aperto su una ricevuta sintetica in ESR 153.8. Il test web sullo stesso formato passa.                                                                                                   | Chiuso sul caso sintetico in Thunderbird ESR 153.8: avviata l’analisi nel popup e osservato l’esito atteso sul messaggio aperto.                                                                                                         |
| Distribuzione e governance   | Build statica, header e CI funzionanti. Analizzatore raggiungibile in produzione.                                                                                                                                     | Preview riuscita sulla PR #1 e deploy riuscito sul commit di merge `fb46c27`. Header HTTP verificati sul dominio pubblico. La protezione con PR obbligatoria resta una decisione distinta dalla pubblicazione diretta richiesta su main. |
| Crescita                     | Editor, raccolta e kit distribuiti.                                                                                                                                                                                   | Misurare adozione reale dopo la pubblicazione. Il traguardo continuo della fase 4 resta separato dai gate della candidata.                                                                                                               |

Il collaudo tecnico della candidata comprende le cinque simulazioni. La ricerca con partecipanti e la prova con lettore di schermo reale proseguono dopo il rilascio.

### 🟥 Fase 0 — Fondamenta (W1 · P0)

**Obiettivo:** repo, CI/CD e deploy funzionanti; parsing header minimo end-to-end; decisioni aperte chiuse.

- [x] (D) Repo, licenza GPL-3.0, README, CONTRIBUTING, template issue/PR.
- [x] (C) Scaffolding React / TS strict / Vite / Tailwind / Zustand + Web Worker.
- [~] (D) CI (lint, type, test, build, axe) + **branch protection su `main`** + Conventional Commits.
- [x] (D) **Vercel**: production su `main` + preview per PR + header di sicurezza.
- [x] (C) Tipi condivisi: osservato / enrichment / derivato / ipotesi; schema delle regole.
- [x] (C) Parser header di base con primo `.eml` sintetico.
- [x] (C) **Valutazione del parser `.msg`** (licenza, manutenzione, comportamento su file malformati).
- [x] (D) **Decisione sull'analytics** e stesura dell'inventario di rete.
- [x] (C+P) Prima versione del corpus sintetico (10–15 casi).

**Exit gate:** PR di esempio con preview deploy, mergiata su `main` e in produzione; inventario di rete approvato.

### 🟧 Fase 1 — MVP Analyzer v0.1 (W2–W4 · P0/P1)

**Obiettivo:** analisi onesta e comprensibile anche ai non esperti.

**Core & Security**

- [x] Parser `.eml` completo nel Worker, con limiti di risorse.
- [x] **Modello di fiducia**: identificazione del ricevente, confine, header in conflitto.
- [x] SPF/DKIM/DMARC + **allineamento**; regola **BEC**; regola link testo-vs-destinazione.
- [x] Motore di scoring con gruppi di correlazione, qualità dell'evidenza, soglia di copertura, versione.
- [x] Report Markdown con escaping e oscuramento automatico.

**Product & Experience**

- [x] Area incolla/trascina, guida "Come copiare gli header".
- [x] `OutcomePanel` (4 esiti), `CoveragePanel`, `EvidenceList` con limiti e spiegazioni legittime.
- [x] Vista solo testuale; "Cancella analisi"; anteprima di esportazione.
- [x] Linguaggio semplice, onboarding, 5 esempi sintetici, glossario, IT/EN, tema chiaro/scuro.

**Qualità**

- [x] Corpus ampliato (≥ 30 casi); coverage `lib/` ≥ 80%; e2e (incolla → esito → report); axe.
- [x] **Accettazione simulata su cinque esempi** con verifica del significato esposto, del limite di autenticità e del passo successivo.

**Exit gate:** informazioni per interpretare l’esito e scegliere il passo successivo verificate nei cinque casi; falsi positivi 🔴 ≤ 5% sul corpus; controlli automatici axe, tastiera e snapshot ARIA.

### 🟨 Fase 2 — Formati reali v0.2 (W5–W6 · P1)

- [x] (C) Supporto **`.msg`** nel Worker, con casi malformati nel corpus.
- [x] (C+P) **Vista HTML** in `<iframe sandbox="">` con CSP propria e segnaposto per le immagini remote.
- [x] (C) Lettura **ARC**, riconoscimento di inoltri e mailing list.
- [x] (C) Suite di payload HTML ostili nel corpus.

**Exit gate:** nessun payload del corpus esegue codice o carica risorse; falsi positivi stabili o in calo.

### 🟩 Fase 3 — Gioco + v1.0 (W7–W10/12 · P1)

**Gioco**

- [x] (P) 20–30 **scenari fittizi** bilingui con struttura osservato / perché / cosa non concludere / azione sicura.
- [x] (P) Meccanica a **3 risposte**, livelli, share card SVG→PNG.
- [x] (P+C) **Sfida del giorno** deterministica, testo condivisibile senza spoiler.

**Analyzer avanzato**

- [x] (C) Pannello IOC; lookup DoH opzionale; domini sosia e omoglifi (UTS #39); metadati allegati senza esecuzione.
- [x] (C) Report HTML e PDF.

**Contenuti e crescita**

- [x] (D) Spiegazioni "Attacco vs Difesa"; 2–3 articoli; README con GIF/screenshot; pagine SEO.
- [x] (P) **Percorso pre/post** collaudato in browser: tre casi iniziali, tre di allenamento e tre finali distinti, punteggi separati e riavvio.
- [x] (P) **Verifica simulata dei punteggi pre/post** con sequenza di risposte prestabilita. La variazione osservata su persone resta una misura post-rilascio.

**Deliverable:** v1.0 taggata (SemVer), versione del motore, changelog, pagina sul sito, materiali di lancio.
**Exit gate:** Lighthouse Perf/A11y ≥ 90; nessuna regressione del corpus; nessun blocker privacy/sicurezza; nessuna richiesta di rete fuori inventario.

### 🟦 Fase 4 — Awareness e crescita (continua · P2/P3)

- [x] Editor di scenari per formatori; modalità campagna awareness con badge.
- [x] PWA offline-first; estensione "analizza questa email".
- [x] Libreria scenari community (revisionata); SEO programmatico; awareness kit.

**Exit gate (continuo):** crescita misurabile; adozione del kit da parte di terzi.

**Totale a v1.0: ~10 settimane di calendario (realistico 9–12 con buffer), ~60–75 gg/uomo.**

---

## ⚠️ Rischi e mitigazioni

| Rischio                                             | Prob. | Impatto | Mitigazione                                                                                             |
| --------------------------------------------------- | ----- | ------- | ------------------------------------------------------------------------------------------------------- |
| Utente interpreta un esito tranquillo come "sicura" | Alta  | Alto    | Nessun esito verde, frase di avvertenza fissa, azione consigliata sempre presente, test utente dedicato |
| Header di autenticazione contraffatti               | Media | Alto    | Modello di fiducia, solo `authserv-id` del ricevente, conflitti segnalati                               |
| Falsi positivi su newsletter, inoltri, mailing list | Alta  | Medio   | Spiegazioni legittime per regola, ARC, gravità bassa dei segnali deboli, corpus legittimo in CI         |
| Dati personali nelle email                          | Alta  | Alto    | Zero upload e persistenza, inventario di rete imposto dalla CSP, "Cancella analisi"                     |
| Dati personali nei report condivisi                 | Media | Alto    | Anteprima obbligatoria, oscuramento automatico + manuale, avviso sui limiti                             |
| Contenuto ostile colpisce l'app                     | Media | Alto    | Vista testuale di default, iframe con sandbox vuoto e CSP, DOMPurify, Worker con limiti                 |
| Parser `.msg` vulnerabile o non mantenuto           | Media | Medio   | Valutazione in Fase 0, esecuzione nel Worker, casi malformati nel corpus                                |
| Esito frainteso come certezza                       | Media | Medio   | Niente percentuali, copertura dichiarata, linguaggio prudente                                           |
| Scenari che imitano brand reali                     | Media | Medio   | Scenari fittizi, loghi inventati o parodici, disclaimer                                                 |
| Variabilità degli header tra provider               | Media | Medio   | Parser tollerante, "skip, never guess", test multi-provider                                             |
| Affermazioni di mercato non dimostrate              | Media | Basso   | Fonti citate, analisi della concorrenza documentata                                                     |

---

## 📎 Appendice: ruoli coperti

Elenco dei ruoli che un prodotto completo richiede, con il cappello che li copre.

| Area                       | Ruoli                                                                                                            | Cappello                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Prodotto & gestione        | Product Owner, Tech Lead / Architect, Project Manager                                                            | C (architettura) · P (prodotto) · D (pianificazione) |
| Ingegneria                 | Frontend, Core/Logic (parser, scoring), Platform/Build (Worker, PWA, DoH), Data/Content (regole, scenari)        | C · P (frontend)                                     |
| Design & UX                | UX Designer/Researcher, UI Designer, Interaction/Motion, Design System/Brand, Accessibility Specialist           | P                                                    |
| Sicurezza & privacy        | Email Security / DFIR SME, Social Engineering / Awareness SME, AppSec, Privacy Engineer / DPO, Legal / Licensing | C (tecnica) · P (awareness) · D (privacy, legale)    |
| Qualità & delivery         | QA / Test Automation, DevOps / Release, SRE / Performance                                                        | C (test) · D (release, performance)                  |
| Contenuti & localizzazione | Content Designer / UX Writer, Technical Writer, i18n Specialist                                                  | P · D (documentazione)                               |
| Crescita & dati            | SEO, Growth/Marketing, DevRel/Community, Social/Visual content, Data Analyst                                     | D                                                    |

---

<p align="center"><sub>Documento di impostazione — base di sviluppo. Nomi, priorità e tempi sono ipotesi adattabili.</sub></p>

**Aggiornamento del 27 novembre.** La raccolta bilingue _Segreteria e fornitori_ contiene tre casi selezionabili, modificabili ed esportabili dal laboratorio formatori. Il catalogo valida i campi e gli identificativi in CI. In Thunderbird ESR 153.8 il pacchetto è stato installato temporaneamente e il pulsante del messaggio ha aperto il popup su una ricevuta sintetica. Il collaudo successivo ha confermato l’esito dentro il popup.
