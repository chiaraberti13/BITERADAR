# Contributing to BiteRadar

This repository is a bilingual React/TypeScript email-forensics analysis assistant and "Spot the Phish" learning game, with deterministic, fully client-side analysis.

## Before you start

1. Read `README.md`, `SECURITY.md`, the [roadmap](docs/ROADMAP.md) and relevant architecture/design documentation.
2. Search existing issues and keep each pull request focused.
3. Use only owned or explicitly authorized targets, systems and datasets.
4. **Never commit a real email, credentials, tokens, private keys, personal data or sensitive evidence.** The corpus is synthetic only.
5. Report vulnerabilities privately.

## Setup

Use a supported Node.js release from `package.json#engines` and the npm version declared in `packageManager`. The commands are identical in Windows PowerShell, macOS Terminal and Linux shells:

```bash
npm ci
npm run dev
```

Vite empties its output directory before every build, so no shell-specific cleanup command is required.

## Formatting and language parity

Run `npm run format` to apply the shared Prettier rules and `npm run format:check` to verify them without changing files. Editor defaults are defined in `.editorconfig`; ESLint remains responsible for code-quality and security rules.

Every learner-facing change must keep Italian and English content equivalent, preserve technical terms and update typed i18n catalogs together. Networking, email-authentication and security claims must cite the relevant authoritative source (RFC, IANA, vendor documentation).

## Non-negotiable constraints

These are the product's guardrails — a change that weakens any of them will not be merged:

- **Privacy:** no upload, no backend, no persistence of email content; the network inventory is respected and enforced by the CSP.
- **Isolation:** email content is hostile; keep the text-first view, the empty `<iframe sandbox>`, its own CSP, DOMPurify and the Web Worker resource limits.
- **Honest outcome:** keep the trust model, declare coverage, never say "safe", never show the score as a probability or percentage.
- **Accessibility & design system:** WCAG 2.1 AA, keyboard access, meaning never by colour alone.

## Required checks

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
```

Game scenarios must stay **fictitious** (invented/parodic brands and people), and example emails must use synthetic, documentation-reserved or private targets.

## Engineering expectations

Preserve isolation and privacy guards, validate untrusted input, fail safely, keep secrets outside source control, add tests for behavioural changes, and document compatibility or schema changes (including the rule-engine version). Write documentation in English and keep README.md and README.it.md semantically aligned.

## Pull requests

Describe what changed, why, how it was tested, affected security boundaries, compatibility impact and rollback/migration notes. Participation follows `CODE_OF_CONDUCT.md`.

Before opening a pull request, confirm that:

- [ ] the change is focused and contains no secrets, real emails, generated reports or personal data;
- [ ] Italian and English content remain semantically equivalent;
- [ ] email-authentication and security content is accurate, sourced and honest about its limits;
- [ ] privacy, isolation and "no green light" constraints are preserved;
- [ ] keyboard access, visible focus, semantics, contrast and responsive layouts are preserved;
- [ ] `npm run typecheck`, `lint`, `format:check`, `test` and `build` pass;
- [ ] documentation, changelog and roadmap reflect the actual result.

## Reporting and contribution checks

Use the [issue templates](https://github.com/chiaraberti13/BITERADAR/issues/new/choose) and check for duplicates first. Useful context: Browser, .eml or .msg format, rule and synthetic message without personal data.

Write community and technical documentation in English; maintain equivalent English and Italian READMEs. Preserve existing application translations. Fill in the pull request template with commands, results and checks not performed, including the reason. Use synthetic examples without secrets or personal data.

See [the code of conduct](CODE_OF_CONDUCT.md), [security policy](SECURITY.md) and [accessibility statement](ACCESSIBILITY.md). Report vulnerabilities only through the security policy process.
