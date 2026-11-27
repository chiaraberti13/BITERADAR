# Release validation

## Synthetic corpus

Run `npm ci`, `npm run verify`, `npx playwright install --with-deps chromium`, `npm run test:e2e` and `npm run test:lighthouse`. The production preview applies the headers in `vercel.json`. The Lighthouse gate checks mobile performance and accessibility and writes its report to `.lighthouseci/report.json`. The accessibility scan and keyboard smoke tests cover 390, 768 and 1280 px. Test with a screen reader before claiming full WCAG conformance.

`src/lib/corpus.test.ts` contains labelled messages including forwarding, conflicting or external receivers, benign newsletters and incomplete inputs. A wrong outcome fails the suite. The two synthetic files in `tests/corpus/` describe the same library receipt. The Outlook fixture is a generated compound file with UTF-16LE MAPI streams and a synthetic plain-text attachment. No fixture was exported from a real mailbox.

## Parsers and privacy

EML uses postal-mime in a disposable worker. Outlook's Apache-2.0 @kenjiuno/msgreader 1.29.0 was considered. The application uses a small GPL-covered read-only CFB/MAPI adapter instead. It bounds directory and chain traversal, caps bytes before allocation and never opens embedded messages. Unicode properties, common ANSI fallback, MIME transport headers, plaintext, HTML and ordinary by-value attachments are supported. Unsupported compound layouts, embedded Outlook items, or limits return an insufficient-data error. Non-Western ANSI messages without Unicode properties may decode inaccurately. RTF-only bodies are unavailable. Compare [MS-OXMSG](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxmsg/) and [MS-CFB](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-cfb/).

Maximum input is 5 MiB, worker lifetime 6 seconds, header bytes 128 KiB, top-level header fields 512, MIME nesting 16, boundary lines 256, attachments 64, distinct links 256. Attachment signatures and static PDF/Office markers are indicators. Compressed, encrypted or obfuscated content may conceal markers. IDN similarity uses the pinned unicode-confusables dataset and reports the decoded spelling alongside an ASCII skeleton where available. See [UTS #39](https://www.unicode.org/reports/tr39/).

No analytics. App, public guides and packaged assets may be requested from the hosting origin. Only those static files are precached. A user-initiated DNS query sends the sender domain or its DMARC label to Google's DNS resolver without cookies or referrer. No message or report enters network requests, URL state or persistent storage. Local preferences are limited to theme and language. The Thunderbird popup reads the single displayed message after the user opens the action. Build it with `npm run package:thunderbird`. The output is `build/biteradar-thunderbird.xpi`. Load the XPI with Thunderbird's add-on tools for client acceptance testing.

## Optional post-release study with participants

Use [the bilingual workshop kit](../public/awareness-kit.md). Recruit at least five non-expert volunteers. With consent, record anonymous yes/no responses to three questions: What does the outcome mean? Does a neutral outcome establish authenticity? What would you do next? Record individual pre/post scores on unseen scenarios. Compute each proportion over participants who completed the task and retain counts alongside percentages. Publish measured results only after the session. Targets are 80% for each comprehension question and a measurable pre/post change. The automated suite cannot supply those observations.

## Community scenarios

Submit fictitious, bilingual cases through a pull request. Use a unique ID, the three-way answer and the observation, explanation, limit and safe action fields used in the trainer editor. Review factual accuracy, invented identities, localization and spoiler-free feedback before adding a case to the curated collection. Leave personal mail and identifiable organizations out of contributions.

## Report and Thunderbird acceptance, 2026-11-27

Playwright imports a synthetic message, includes its identity fields and redacts a case identifier through the preview selection control. It compares the downloaded HTML document text and the text extracted by Poppler from Chromium’s printed PDF with the final preview, retaining the receipt identifier and excluding the recipient, manually redacted identifier and email body. Browser tests require the `pdftotext` binary (Ubuntu package `poppler-utils`).

The unchanged build XPI was temporarily installed in a disposable Thunderbird ESR 153.8.0 profile. Opening `tests/corpus/receipt.eml`, selecting the message action and invoking analysis in the popup produced “Nessun segnale evidente rilevato”. The headless test used a QA-only window actor added to the disposable Thunderbird installation to operate and read the remote popup. The actor is outside the extension and distribution.

## Ripetizione del collaudo del 27 novembre 2026

Con Node 24.22.3 sono passati formattazione, controllo dei tipi, lint, build e 48 test unitari. La copertura V8 è stata del 92,06% per le istruzioni e dell’87,17% per i rami. L’audit npm ha riportato zero vulnerabilità. I 10 test end-to-end sono passati con Playwright 1.56.1 e Chromium Headless Shell 141.0.7390.37. Comprendono lavoro offline, redazione ed esportazione HTML/PDF, tastiera e scansioni axe. Lighthouse sulla build locale ha misurato 97/100 per le prestazioni mobili e 100/100 per l’accessibilità automatica. Anche la generazione e il controllo di integrità ZIP del pacchetto Thunderbird sono riusciti.

Sul [sito di produzione](https://biteradar-h8xa.vercel.app/) sono stati aperti i cinque esempi italiani in sessioni browser separate. Conferma biblioteca e Newsletter hanno restituito “Nessun segnale evidente rilevato”, Mittente discordante “Segnali forti di rischio”, Richiesta amministrativa “Elementi sospetti da verificare” ed Estratto incompleto “Dati insufficienti”.

La prova con lettore di schermo desktop resta aperta. Nell’ambiente locale la creazione del socket Unix per D-Bus è stata rifiutata, impedendo la verifica con Orca tramite AT-SPI. Per il test di comprensione con cinque volontari mancano ancora osservazioni individuali e punteggi prima e dopo il laboratorio.

## Accettazione simulata della v1.0

Il criterio concordato per questa release è tecnico. Eseguire `npm run test:e2e` dopo la build. In cinque contesti Chromium distinti, `simulation.spec.ts` apre i cinque esempi italiani, verifica l’esito atteso, l’avvertenza sull’autenticità e il passo successivo. Attiva i controlli con Invio, verifica l’esito nel report e raggiunge la risposta motivata del gioco. Gli snapshot ARIA verificano il testo esposto per esito, anteprima e feedback. La suite comprende anche scansioni axe e controllo della regione live.

Il test della campagna usa nove casi distinti e una sequenza di risposte nota. I valori attesi sono 1/3 prima, 3/3 dopo e 4/9 complessivi. Sono valori di collaudo del conteggio. Non sono state raccolte risposte di partecipanti né registrazioni vocali da un lettore di schermo. La verifica con utenti e tecnologia assistiva resta nel protocollo per il follow-up sul campo.
