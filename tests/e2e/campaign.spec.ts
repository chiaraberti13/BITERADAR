import { expect, test } from '@playwright/test';
import { SCENARIOS } from '../../src/content/dailyChallenge';

test('campaign uses nine distinct cases and scores the pre-test and post-test separately', async ({ page }) => {
  await page.goto('/#game');
  await page.getByRole('button', { name: 'Campagna awareness' }).click();
  const card = page.locator('.game-card');
  const seen = new Set<string>();
  const labels = {
    legitimate: 'Legittima',
    phishing: 'Phishing',
    'verify-elsewhere': 'Verifico tramite un altro canale'
  };

  for (let i = 0; i < 9; i++) {
    const phase = i < 3 ? 'Pre-test' : i < 6 ? 'Allenamento' : 'Post-test';
    await expect(card.locator('small')).toHaveText(phase + ' · ' + (i + 1) + '/9');
    const title = await card.getByRole('heading', { level: 2 }).innerText();
    const scenario = SCENARIOS.find((item) => item.title.it === title);
    if (!scenario || seen.has(scenario.id)) throw Error('Scenario inatteso o ripetuto: ' + title);
    seen.add(scenario.id);
    const correct = labels[scenario.answer];
    const wrong = correct === 'Phishing' ? 'Legittima' : 'Phishing';
    await card.getByRole('button', { name: i === 0 || i >= 6 ? correct : wrong, exact: true }).click();
    await expect(card.getByRole('heading', { name: /Risposta motivata/ })).toHaveCount(i < 3 ? 0 : 1);
    await card.getByRole('button', { name: i === 8 ? /Vedi risultato/ : /Prossimo caso/ }).click();
  }

  await expect(card).toContainText('Pre: 1/3 · Post: 3/3');
  await expect(card.locator('.score')).toHaveText('4 / 9');
  await card.getByRole('button', { name: 'Ricomincia' }).click();
  await expect(card.locator('small')).toHaveText('Pre-test · 1/9');
  await expect(card.getByRole('button', { name: 'Legittima', exact: true })).toBeEnabled();
});
