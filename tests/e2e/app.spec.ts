import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('local analysis, isolated body, redacted report and clearing', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (r) => {
    if (/^https?:/.test(r.url()) && !r.url().startsWith('http://127.0.0.1:4173/')) external.push(r.url());
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Incolla testo' }).click();
  const message = [
    'Authentication-Results: mx.google.com; dmarc=fail header.from=riva.example',
    'Received: from relay.example by mx.google.com',
    'From: me@riva.example',
    'To: learner@lab.example',
    'Content-Type: text/html',
    '',
    '<p>Documento</p><img src="https://images.example/photo"><a href="https://portal.example/?token=private">https://read.example</a>'
  ].join('\r\n');
  await page.getByLabel('Email grezza o header originali').fill(message);
  await page.getByRole('button', { name: 'Analizza messaggio' }).click();
  await expect(page.getByRole('heading', { name: '▲ Segnali forti di rischio' })).toBeVisible();
  await page.getByRole('button', { name: 'Messaggio', exact: true }).click();
  await page.getByRole('button', { name: 'Vista HTML isolata' }).click();
  await expect(page.frameLocator('iframe').locator('body')).toContainText('Documento');
  await expect(page.frameLocator('iframe').locator('img,a,form,script,style')).toHaveCount(0);
  await page.getByRole('button', { name: 'Report', exact: true }).click();
  const preview = page.getByLabel('Anteprima modificabile');
  await expect(preview).not.toHaveValue(/learner@|token=private/);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Markdown' }).click();
  expect((await download).suggestedFilename()).toBe('biteradar.md');
  await page.getByRole('button', { name: 'Cancella analisi' }).click();
  await expect(preview).toHaveCount(0);
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toMatch(/riva|learner|token/);
  expect(external).toEqual([]);
});
test('daily result, bilingual controls and PNG', async ({ page }) => {
  await page.goto('/#game');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await page.getByRole('button', { name: 'Daily challenge' }).click();
  await page.getByRole('button', { name: 'Verify through another channel' }).click();
  await page.getByRole('button', { name: 'View result' }).click();
  await expect(page.getByText(/BiteRadar · Daily/)).toBeVisible();
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'PNG' }).click();
  expect((await event).suggestedFilename()).toBe('biteradar-score.png');
});
for (const width of [390, 768, 1280])
  test('keyboard and axe at ' + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Vai al contenuto' })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(scan.violations).toEqual([]);
  });

test('offline reload can analyse an Outlook message without storing it', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise((resolve) =>
        navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true })
      );
  });
  await context.setOffline(true);
  await page.reload();
  await page.locator('input[type=file]').setInputFiles('tests/corpus/receipt.msg');
  await page.getByRole('button', { name: 'Analizza messaggio' }).click();
  await expect(page.getByRole('heading', { name: '○ Nessun segnale evidente rilevato' })).toBeVisible();
  await page.getByRole('button', { name: 'IOC / DNS' }).click();
  await expect(page.getByText(/note\.txt/)).toBeVisible();
  const urls = await page.evaluate(async () => {
    const names = await caches.keys();
    const c = await caches.open(names.find((n) => n.startsWith('biteradar-assets-'))!);
    return (await c.keys()).map((k) => k.url);
  });
  expect(
    urls.every(
      (url) => new URL(url).origin === 'http://127.0.0.1:4173' && !url.includes('?') && !url.includes('receipt')
    )
  ).toBe(true);
});
test('trainer applies a bilingual set and checks it through the game', async ({ page }) => {
  await page.goto('/#trainer');
  await page.getByRole('button', { name: 'Applica set' }).click();
  await page.getByRole('link', { name: 'Spot the Phish →' }).click();
  await page.getByRole('button', { name: 'Set del formatore' }).click();
  await expect(page.getByRole('heading', { name: 'Prestito rinnovato' })).toBeVisible();
});
