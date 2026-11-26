# Changelog

All notable changes to BiteRadar are documented in this file. The project follows [Semantic Versioning](https://semver.org/) and keeps this structure compatible with [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The rule engine carries its own separate version, reported in every analysis report.

## [Unreleased]

Use this section only for changes already merged into `main` but not yet included in a tagged release.

## [1.0.0-rc.1] — 2026-11-26

- Local EML and Outlook MSG parsing in a bounded worker, trust boundary, versioned rules, attachment metadata and opt-in DNS.
- Redacted report preview and Markdown, HTML and print-to-PDF exports.
- Bilingual practice, UTC challenge, 24 scenarios, trainer sets, pre/post campaign and score cards.
- Offline application, six static learning pages, Thunderbird package and workshop kit.
- Labelled synthetic corpus, browser privacy and accessibility checks and Lighthouse gate.

### Repository foundations

- Repository scaffolding and GitHub-facing governance aligned with the account template: bilingual `README.md` / `README.it.md` with the shared banner and badge row, `LICENSE` (GPL-3.0), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, this changelog, `descrizione.md`, `.github` templates, and the baseline tooling configuration (`.editorconfig`, `.prettierrc.json`, `.nvmrc`, `.npmrc`, `.gitignore`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `vercel.json`, `index.html`).
- Scaffolding e governance GitHub-facing allineati al template dell'account: `README.md` / `README.it.md` bilingui con banner e riga di badge condivisi, `LICENSE` (GPL-3.0), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, questo changelog, `descrizione.md`, i template `.github` e la configurazione di tooling di base (`.editorconfig`, `.prettierrc.json`, `.nvmrc`, `.npmrc`, `.gitignore`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `vercel.json`, `index.html`).
- Project setup and roadmap document (`docs/ROADMAP.md`, v3.0): trust model, four analysis outcomes, versioned rule engine, client-side architecture, phased roadmap and KPIs.
- Documento di impostazione e roadmap (`docs/ROADMAP.md`, v3.0): modello di fiducia, esiti a quattro livelli, motore di regole versionato, architettura client-side, roadmap a fasi e KPI.
- `src/` skeleton mirroring the planned architecture (`worker/`, `lib/`, `rules/`, `content/`, `report/`, `components/`, `i18n/`) with the application entry point, in-memory store, shared type contracts and typed IT/EN UI catalogs.
- Scheletro `src/` che rispecchia l'architettura prevista (`worker/`, `lib/`, `rules/`, `content/`, `report/`, `components/`, `i18n/`) con entry point dell'applicazione, store in memoria, contratti di tipo condivisi e cataloghi UI IT/EN tipizzati.
