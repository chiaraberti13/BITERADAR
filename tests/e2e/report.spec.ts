import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

test('HTML and printed PDF preserve the redacted preview', async ({ page }, info) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Incolla testo' }).click();
  await page
    .getByLabel('Email grezza o header originali')
    .fill(
      [
        'Authentication-Results: mx.google.com; dmarc=pass header.from=riva.example',
        'Received: from relay.example by mx.google.com',
        'From: sender@riva.example',
        'To: private@lab.example',
        'Subject: KEEP-214 CASE-PRIVATE',
        '',
        'EXCLUDED-BODY'
      ].join('\r\n')
    );
  await page.getByRole('button', { name: 'Analizza messaggio' }).click();
  await page.getByRole('button', { name: 'Report', exact: true }).click();
  await page.getByLabel('Mittente, oggetto e destinatari').check();
  const preview = page.getByLabel('Anteprima modificabile');
  await preview.evaluate((node: HTMLTextAreaElement) => {
    const start = node.value.indexOf('CASE-PRIVATE');
    node.focus();
    node.setSelectionRange(start, start + 'CASE-PRIVATE'.length);
  });
  await page.getByRole('button', { name: 'Oscura selezione' }).click();
  const expected = await preview.inputValue();
  expect(expected).toContain('KEEP-214 [OSCURATO]');
  expect(expected).not.toMatch(/CASE-PRIVATE|EXCLUDED-BODY|private@lab/);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'HTML ↓' }).click();
  const html = await readFile((await (await pending).path())!, 'utf8');
  const exported = await page.evaluate(
    (source) => new DOMParser().parseFromString(source, 'text/html').querySelector('pre')?.textContent,
    html
  );
  expect(exported).toBe(expected);
  const path = info.outputPath('report.pdf');
  await page.pdf({ path, format: 'A4', displayHeaderFooter: false });
  const pdf = execFileSync('pdftotext', ['-layout', path, '-'], { encoding: 'utf8' });
  const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
  expect(normalize(pdf)).toBe(normalize(expected));
});
