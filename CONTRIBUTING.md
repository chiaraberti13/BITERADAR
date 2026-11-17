# Contributing to BiteRadar

<p align="center"><a href="#english">🇬🇧 English</a> · <a href="#italiano">🇮🇹 Italiano</a></p>

## English

This repository is a bilingual React/TypeScript email-forensics analysis assistant and "Spot the Phish" learning game, with deterministic, fully client-side analysis.

### Before you start

1. Read `README.md`, `SECURITY.md`, the [roadmap](docs/ROADMAP.md) and relevant architecture/design documentation.
2. Search existing issues and keep each pull request focused.
3. Use only owned or explicitly authorized targets, systems and datasets.
4. **Never commit a real email, credentials, tokens, private keys, personal data or sensitive evidence.** The corpus is synthetic only.
5. Report vulnerabilities privately.

### Setup

Use a supported Node.js release from `package.json#engines` and the npm version declared in `packageManager`. The commands are identical in Windows PowerShell, macOS Terminal and Linux shells:

```bash
npm ci
npm run dev
```

Vite empties its output directory before every build, so no shell-specific cleanup command is required.

### Formatting and language parity

Run `npm run format` to apply the shared Prettier rules and `npm run format:check` to verify them without changing files. Editor defaults are defined in `.editorconfig`; ESLint remains responsible for code-quality and security rules.

Every learner-facing change must keep Italian and English content equivalent, preserve technical terms and update typed i18n catalogs together. Networking, email-authentication and security claims must cite the relevant authoritative source (RFC, IANA, vendor documentation).

### Non-negotiable constraints

These are the product's guardrails — a change that weakens any of them will not be merged:

- **Privacy:** no upload, no backend, no persistence of email content; the network inventory is respected and enforced by the CSP.
- **Isolation:** email content is hostile; keep the text-first view, the empty `<iframe sandbox>`, its own CSP, DOMPurify and the Web Worker resource limits.
- **Honest outcome:** keep the trust model, declare coverage, never say "safe", never show the score as a probability or percentage.
- **Accessibility & design system:** WCAG 2.1 AA, keyboard access, meaning never by colour alone.

### Required checks

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
```

Game scenarios must stay **fictitious** (invented/parodic brands and people), and example emails must use synthetic, documentation-reserved or private targets.

### Engineering expectations

Preserve isolation and privacy guards, validate untrusted input, fail safely, keep secrets outside source control, add tests for behavioural changes, and document compatibility or schema changes (including the rule-engine version). Update English documentation first and keep Italian documentation semantically aligned.

### Pull requests

Describe what changed, why, how it was tested, affected security boundaries, compatibility impact and rollback/migration notes. Participation follows `CODE_OF_CONDUCT.md`.

Before opening a pull request, confirm that:

- [ ] the change is focused and contains no secrets, real emails, generated reports or personal data;
- [ ] Italian and English content remain semantically equivalent;
- [ ] email-authentication and security content is accurate, sourced and honest about its limits;
- [ ] privacy, isolation and "no green light" constraints are preserved;
- [ ] keyboard access, visible focus, semantics, contrast and responsive layouts are preserved;
- [ ] `npm run typecheck`, `lint`, `format:check`, `test` and `build` pass;
- [ ] documentation, changelog and roadmap reflect the actual result.

## Italiano

Questo repository ospita un assistente all'analisi forense delle email e un gioco didattico "Spot the Phish", bilingue, sviluppato con React e TypeScript e basato su un'analisi deterministica eseguita interamente nel browser.

### Prima di iniziare

1. Leggi `README.md`, `SECURITY.md`, la [roadmap](docs/ROADMAP.md) e la documentazione di architettura pertinente.
2. Controlla le issue esistenti e mantieni ogni pull request focalizzata.
3. Usa solo target, sistemi e dataset propri o esplicitamente autorizzati.
4. **Non committare mai un'email reale, credenziali, token, chiavi private, dati personali o evidenze sensibili.** Il corpus è solo sintetico.
5. Segnala privatamente le vulnerabilità.

### Setup

Usa una versione Node.js supportata da `package.json#engines` e la versione npm dichiarata in `packageManager`. I comandi sono identici in Windows PowerShell, Terminale macOS e shell Linux:

```bash
npm ci
npm run dev
```

Vite svuota la directory di output prima di ogni build, quindi non serve alcun comando di pulizia specifico della shell.

### Formattazione e parità linguistica

Esegui `npm run format` per applicare le regole Prettier condivise e `npm run format:check` per verificarle senza modificare file. Le impostazioni degli editor sono in `.editorconfig`; ESLint continua a gestire qualità e sicurezza del codice.

Ogni modifica visibile a chi usa l'app deve mantenere equivalenti italiano e inglese, preservare la terminologia tecnica e aggiornare insieme i cataloghi i18n tipizzati. Le affermazioni su rete, autenticazione email e sicurezza devono citare la fonte autorevole (RFC, IANA, documentazione del fornitore).

### Vincoli non negoziabili

Sono i paletti del prodotto — una modifica che ne indebolisce uno non verrà integrata:

- **Privacy:** nessun upload, nessun backend, nessuna persistenza dei contenuti email; l'inventario di rete è rispettato e imposto dalla CSP.
- **Isolamento:** il contenuto dell'email è ostile; mantieni la vista testuale di default, l'`<iframe sandbox>` vuoto, la sua CSP, DOMPurify e i limiti di risorse del Web Worker.
- **Onestà dell'esito:** mantieni il modello di fiducia, dichiara la copertura, non dire mai "sicura", non mostrare mai il punteggio come probabilità o percentuale.
- **Accessibilità e design system:** WCAG 2.1 AA, accesso da tastiera, significato mai affidato al solo colore.

### Controlli richiesti

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
```

Gli scenari del gioco devono restare **fittizi** (marchi e persone inventati/parodici) e le email di esempio devono usare target sintetici, riservati alla documentazione o privati.

### Aspettative tecniche

Mantieni i controlli di isolamento e privacy, valida gli input, usa comportamenti fail-safe, conserva i segreti fuori dal repository, aggiorna i test e documenta modifiche di compatibilità/schema (inclusa la versione del motore di regole). Aggiorna prima la documentazione inglese e mantieni quella italiana equivalente.

### Pull request

Descrivi cosa cambia, perché, test eseguiti, confini di sicurezza interessati, compatibilità e note di rollback/migrazione. Si applica `CODE_OF_CONDUCT.md`.

Prima di aprire una pull request, verifica che:

- [ ] la modifica sia focalizzata e non contenga segreti, email reali, report generati o dati personali;
- [ ] i contenuti italiani e inglesi restino semanticamente equivalenti;
- [ ] i contenuti su autenticazione email e sicurezza siano corretti, documentati e onesti sui propri limiti;
- [ ] i vincoli di privacy, isolamento e "nessun esito verde" siano preservati;
- [ ] accesso da tastiera, focus visibile, semantica, contrasto e layout responsive siano preservati;
- [ ] `npm run typecheck`, `lint`, `format:check`, `test` e `build` siano verdi;
- [ ] documentazione, changelog e roadmap descrivano il risultato reale.

## Segnalazioni e verifica dei contributi

Analisi locale delle evidenze nelle email e formazione sul phishing.

Usa i [modelli di segnalazione](https://github.com/chiaraberti13/BITERADAR/issues/new/choose) per bug, miglioramenti e barriere di accessibilità. Prima di aprire una nuova segnalazione verifica se ne esiste già una equivalente. Contesto utile: Browser, formato .eml o .msg, regola e messaggio sintetico senza dati personali.

Per le modifiche, compila il modello di pull request e indica verifiche eseguite, esito e verifiche non eseguite con il motivo. Mantieni le istruzioni specifiche di questo progetto e la parità delle lingue già disponibili. Non allegare dati di produzione, credenziali o dati personali; usa esempi sintetici.

Consulta [il codice di condotta](CODE_OF_CONDUCT.md), [la policy di sicurezza](SECURITY.md) e [le indicazioni di accessibilità](ACCESSIBILITY.md). Le vulnerabilità seguono esclusivamente il percorso descritto nella policy di sicurezza.
