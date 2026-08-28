import { expect, test } from '@playwright/test';

test('creates a card, records a check-in, stops, and keeps private history', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Find a steadier way into the game.');
  await page.getByRole('link', { name: 'Make a comfort card' }).first().click();

  await page.getByLabel('Game name Required').fill('Drift Valley');
  await page.getByLabel('Platform Optional').fill('PC');
  await page.getByLabel('Usual comfortable play time Optional').fill('10');
  await page.getByRole('checkbox', { name: 'Motion blur', exact: true }).locator('..').click();
  await page.getByRole('button', { name: 'Make this card' }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Drift Valley');
  await page.getByRole('button', { name: 'Start a session' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('radio', { name: '1 Slight', exact: true }).locator('..').click();
  await page.getByRole('button', { name: 'Start 15-minute check' }).click();

  await expect(page.getByText('Session active')).toBeVisible();
  await page.getByRole('link', { name: 'Check in now' }).click();
  await page.getByRole('radio', { name: '2 Noticeable', exact: true }).locator('..').click();
  await page.getByLabel('Private note Optional').fill('Blur was still on in the cutscene.');
  await page.getByRole('button', { name: 'Save check-in' }).click();

  await expect(page.getByRole('heading', { name: 'Your symptoms increased.' })).toBeVisible();
  await page.getByRole('button', { name: 'Stop this session' }).click();
  await expect(page.getByRole('dialog')).toContainText('Step away from the motion.');
  await page.getByRole('button', { name: 'End and save session' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('You stopped at');

  await page.getByRole('link', { name: 'Back to Drift Valley' }).click();
  await expect(page.getByRole('table', { name: 'Finished sessions' })).toContainText('2 / 4');
  await page.getByRole('button', { name: 'Share clean copy' }).click();
  const shareText = await page.getByLabel('Share text').inputValue();
  expect(shareText).toContain('Motion blur');
  expect(shareText).not.toContain('cutscene');
  expect(shareText).not.toContain('2 / 4');

  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Drift Valley');
  await expect(page.getByRole('table', { name: 'Finished sessions' })).toContainText('2 / 4');
});

test('shows validation and supports a keyboard-first creation path', async ({ page }) => {
  await page.goto('/#new');
  await page.getByRole('button', { name: 'Make this card' }).click();
  await expect(page.getByText('Enter the game name to make this card.')).toBeVisible();
  await expect(page.getByLabel('Game name Required')).toBeFocused();
  await page.keyboard.type('Keyboard Quest');
  await page.keyboard.press('Tab');
  await page.keyboard.type('Steam Deck');
  await page.getByRole('button', { name: 'Make this card' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Keyboard Quest');
});

test('reloads offline after the app shell is cached', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Find a steadier way into the game.');
  await expect(page.getByText('Offline mode · your saved cards still work')).toBeVisible();
});
