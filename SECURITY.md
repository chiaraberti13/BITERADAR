# Security Policy

## Supported versions

Security fixes target the latest revision on the default branch unless a release is explicitly documented as supported.

## Scope

The client-side React application, the `.eml`/`.msg` parser and Web Worker, the trust model and rule engine, the content-isolation layer, the report/redaction pipeline, educational game datasets, the build pipeline, deployment configuration and dependency supply chain.

## Reporting

Do not open a public issue for an unpatched vulnerability. Use GitHub private vulnerability reporting / Security Advisories when available. Include the affected commit/version, impact, minimal reproducible proof, environment assumptions and possible mitigations. **Never attach a real email with personal data** — reproduce with a synthetic sample and remove unrelated sensitive data.

## Responsible testing

Test only systems, data, devices and networks you own or are explicitly authorized to assess. No denial of service, destructive actions, persistence, social engineering, unauthorized interception or third-party access.

## Security requirements

Keep secrets outside source control; treat all email content (headers, body, attachments, file names) as hostile; validate untrusted input and fail safely; never relax the `<iframe sandbox>`, the app CSP or the Web Worker resource limits; keep analysis honest — never present a clean result as "safe" and never present reported, non-verifiable evidence as a confirmed fact. No upload, telemetry, persistence of email content, or network request outside the published network inventory may be introduced without a documented, reviewed exception.

## Disclosure

Allow reasonable remediation time and coordinate publication of exploit-enabling details.

## Private reporting process

Use **Report a vulnerability** in the repository Security tab if private reporting is available. Otherwise use a verified private contact published by the repository owner. If no private contact is available, open a public issue asking only for a private contact, without vulnerability details. Do not publish exploit details, credentials, personal data or sensitive logs in public issues.

Include the affected revision, environment, impact and minimal synthetic reproduction. Coordinate disclosure with the maintainer. Acknowledgement and remediation depend on availability and severity; no fixed response deadline is guaranteed.
