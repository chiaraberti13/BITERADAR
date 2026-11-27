import { expect, test } from '@playwright/test';

const cases = [
  ['Conferma biblioteca', 'Nessun segnale evidente rilevato'],
  ['Mittente discordante', 'Segnali forti di rischio'],
  ['Richiesta amministrativa', 'Elementi sospetti da verificare'],
  ['Newsletter', 'Nessun segnale evidente rilevato'],
  ['Estratto incompleto', 'Dati insufficienti']
];

for (const [sample, outcome] of cases) {
  test('simulazione guidata: ' + sample, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: sample, exact: true }).press('Enter');
    const result = page.getByRole('region', { name: 'Risultato' });
    await expect(result.getByRole('heading', { name: new RegExp(outcome) })).toBeVisible();
    await expect(result).toContainText('L’assenza di segnali evidenti non garantisce l’autenticità.');
    await expect(result).toContainText(
      outcome === 'Dati insufficienti' ? 'copia gli header completi' : 'contatta il mittente con un recapito già noto'
    );
    await expect(page.getByRole('status')).toContainText(outcome);
    expect(await page.getByRole('status').ariaSnapshot()).toContain(outcome);
    await result.getByRole('button', { name: 'Report', exact: true }).press('Enter');
    const report = result.getByRole('textbox', { name: 'Anteprima modificabile' });
    await expect(report).toHaveValue(new RegExp(outcome));
    expect(await result.ariaSnapshot()).toContain('textbox "Anteprima modificabile"');
    await page.getByRole('link', { name: 'Spot the Phish', exact: true }).press('Enter');
    await page.getByRole('button', { name: 'Legittima', exact: true }).press('Enter');
    const feedback = page.getByRole('heading', { name: /Risposta motivata/ });
    await expect(feedback).toBeVisible();
    expect(await feedback.ariaSnapshot()).toContain('Risposta motivata');
  });
}
