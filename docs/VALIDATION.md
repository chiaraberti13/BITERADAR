# Release validation

## Synthetic corpus

Run `npm ci`, `npm run verify`, `npx playwright install --with-deps chromium`, `npm run test:e2e` and `npm run test:lighthouse`. The production preview applies the headers in `vercel.json`. The Lighthouse gate checks mobile performance and accessibility and writes its report to `.lighthouseci/report.json`. The accessibility scan and keyboard smoke tests cover 390, 768 and 1280 px. Test with a screen reader before claiming full WCAG conformance.

`src/lib/corpus.test.ts` contains labelled messages including forwarding, conflicting or external receivers, benign newsletters and incomplete inputs. A wrong outcome fails the suite. The two synthetic files in `tests/corpus/` describe the same library receipt. The Outlook fixture is a generated compound file with UTF-16LE MAPI streams and a synthetic plain-text attachment. No fixture was exported from a real mailbox.

## Parsers and privacy

EML uses postal-mime in a disposable worker. Outlook's Apache-2.0 @kenjiuno/msgreader 1.29.0 was considered. The application uses a small GPL-covered read-only CFB/MAPI adapter instead. It bounds directory and chain traversal, caps bytes before allocation and never opens embedded messages. Unicode properties, common ANSI fallback, MIME transport headers, plaintext, HTML and ordinary by-value attachments are supported. Unsupported compound layouts, embedded Outlook items, or limits return an insufficient-data error. Non-Western ANSI messages without Unicode properties may decode inaccurately. RTF-only bodies are unavailable. Compare [MS-OXMSG](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxmsg/) and [MS-CFB](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-cfb/).

Maximum input is 5 MiB, worker lifetime 6 seconds, header bytes 128 KiB, top-level header fields 512, MIME nesting 16, boundary lines 256, attachments 64, distinct links 256. Attachment signatures and static PDF/Office markers are indicators. Compressed, encrypted or obfuscated content may conceal markers. IDN similarity uses the pinned unicode-confusables dataset and reports the decoded spelling alongside an ASCII skeleton where available. See [UTS #39](https://www.unicode.org/reports/tr39/).

No analytics. App, public guides and packaged assets may be requested from the hosting origin. Only those static files are precached. A user-initiated DNS query sends the sender domain or its DMARC label to Google's DNS resolver without cookies or referrer. No message or report enters network requests, URL state or persistent storage. Local preferences are limited to theme and language. The Thunderbird popup reads the single displayed message after the user opens the action. Build it with `npm run package:thunderbird`. The output is `build/biteradar-thunderbird.xpi`. Load the XPI with Thunderbird's add-on tools for client acceptance testing.

## Acceptance with participants

Use [the bilingual workshop kit](../public/awareness-kit.md). Recruit at least five non-expert volunteers. With consent, record anonymous yes/no responses to three questions: What does the outcome mean? Does a neutral outcome establish authenticity? What would you do next? Record individual pre/post scores on unseen scenarios. Compute each proportion over participants who completed the task and retain counts alongside percentages. Publish measured results only after the session. Targets are 80% for each comprehension question and a measurable pre/post change. The automated suite cannot supply those observations.

## Community scenarios

Submit fictitious, bilingual cases through a pull request. Use a unique ID, the three-way answer and the observation, explanation, limit and safe action fields used in the trainer editor. Review factual accuracy, invented identities, localization and spoiler-free feedback before adding a case to the curated collection. Leave personal mail and identifiable organizations out of contributions.

## Report and Thunderbird acceptance, 2026-11-27

Playwright imports a synthetic message, includes its identity fields and redacts a case identifier through the preview selection control. It compares the downloaded HTML document text and the text extracted by Poppler from Chromium’s printed PDF with the final preview, retaining the receipt identifier and excluding the recipient, manually redacted identifier and email body. Browser tests require the `pdftotext` binary (Ubuntu package `poppler-utils`).

The unchanged build XPI was temporarily installed in a disposable Thunderbird ESR 153.8.0 profile. Opening `tests/corpus/receipt.eml`, selecting the message action and invoking analysis in the popup produced “Nessun segnale evidente rilevato”. The headless test used a QA-only window actor added to the disposable Thunderbird installation to operate and read the remote popup. The actor is outside the extension and distribution.
