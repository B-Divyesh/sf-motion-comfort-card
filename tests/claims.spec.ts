import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const MEDICAL_SCOPE = 'Comfort Card is not medical advice. It cannot tell you whether a game is safe or comfortable for you.';

async function enterRealApp(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
}

async function makeRealCard(page: import('@playwright/test').Page, game: string): Promise<void> {
  await page.getByRole('link', { name: 'Make your own card' }).click();
  await page.getByLabel('Game name Required').fill(game);
  await page.getByRole('button', { name: 'Make this card' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(game);
}

test('@claim:demo-isolation demo changes are temporary and cannot change real cards', async ({ page }) => {
  await enterRealApp(page);
  await makeRealCard(page, 'Real Reef');

  await page.goto('/demo');
  await expect(page.getByText('Real Reef')).toHaveCount(0);
  const motionBlur = page.getByRole('checkbox', { name: /Turn motion blur off/ });
  await expect(motionBlur).not.toBeChecked();
  await motionBlur.locator('..').click();
  await expect(motionBlur).toBeChecked();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('checkbox', { name: /Turn motion blur off/ })).not.toBeChecked();
  await page.reload();
  await expect(page.getByRole('checkbox', { name: /Turn motion blur off/ })).not.toBeChecked();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByText('Real Reef')).toBeVisible();
});

test('@claim:core-card-workflow sample shows a complete game-specific settings plan and check-in', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Harbor Signal');
  await expect(page.getByRole('heading', { name: 'Settings plan' })).toBeVisible();
  await expect(page.getByText('Bobbing boat camera', { exact: true })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: /Turn head bob or camera sway off/ })).toBeChecked();
  await expect(page.getByRole('table', { name: 'Finished sessions' })).toContainText('1 / 4');
});

test('@claim:local-private full demo flow sends no third-party requests or tracking', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start a session' }).click();
  await page.getByRole('radio', { name: '1 Slight', exact: true }).check();
  await page.getByRole('button', { name: 'Start 15-minute check' }).click();
  await page.getByRole('link', { name: 'Check in now' }).click();
  await page.getByRole('radio', { name: '1 Slight', exact: true }).check();
  await page.getByLabel('Private note Optional').fill('Temporary demo note');
  await page.getByRole('button', { name: 'Save check-in' }).click();

  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(databases).not.toContain('comfort-card-local');
});

test('@claim:clean-share clean sharing excludes all private session details', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Share clean copy' }).click();
  const text = await page.getByLabel('Share text').inputValue();
  expect(text).toContain('Harbor Signal');
  expect(text).toContain('Turn camera shake off');
  expect(text).not.toContain('Camera shake was off');
  expect(text).not.toContain('2026-08-27');
  expect(text).not.toContain('24 min');
  expect(text).not.toContain('1 / 4');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download card' }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  const { readFile } = await import('node:fs/promises');
  const payload = JSON.parse(await readFile(path!, 'utf8')) as Record<string, unknown>;
  const serialized = JSON.stringify(payload);
  expect(serialized).toContain('Harbor Signal');
  for (const privateField of ['sessions', 'checkIns', 'startedAt', 'endedAt', 'baselineSymptom', 'note']) {
    expect(serialized).not.toContain(privateField);
  }
});

test('@claim:check-in-interval a 15-minute check-in timer can be paused and stopped', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start a session' }).click();
  await page.getByRole('radio', { name: '0 None', exact: true }).check();
  await page.getByRole('button', { name: 'Start 15-minute check' }).click();
  await expect(page.getByText('Next gentle check-in')).toBeVisible();
  const displayed = await page.locator('[data-session-timer]').textContent();
  expect(displayed).toMatch(/^(15:00|14:5[89])$/);
  await page.getByRole('button', { name: 'Pause timer' }).click();
  await expect(page.getByRole('button', { name: 'Resume timer' })).toBeVisible();
  const paused = await page.locator('[data-session-timer]').textContent();
  await page.waitForTimeout(1_100);
  await expect(page.locator('[data-session-timer]')).toHaveText(paused ?? '');
  await page.getByRole('button', { name: 'Stop now' }).click();
  await page.getByRole('button', { name: 'End and save session' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('You stopped at');
});

test('@claim:offline-reload demo and sample card reload offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Harbor Signal');
  await expect(page.getByText('Offline mode · your saved cards still work')).toBeVisible();
});

test('@claim:free-core-workflow card planning and check-ins require no account or payment', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start a session' }).click();
  await page.getByRole('radio', { name: '0 None', exact: true }).check();
  await page.getByRole('button', { name: 'Start 15-minute check' }).click();
  await expect(page.getByText('Session active')).toBeVisible();
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
  await expect(page.getByText(/checkout|subscribe|payment/i)).toHaveCount(0);
});

test('@claim:local-persistence a real card survives a browser reload', async ({ page }) => {
  await enterRealApp(page);
  await makeRealCard(page, 'Quiet Orbit');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Quiet Orbit');
});

test('@claim:backup-restore a downloaded full backup restores a saved card', async ({ page }) => {
  await enterRealApp(page);
  await makeRealCard(page, 'Backup Bay');
  await page.getByRole('button', { name: 'Start a session' }).click();
  await page.getByRole('radio', { name: '0 None', exact: true }).check();
  await page.getByRole('button', { name: 'Start 15-minute check' }).click();
  await page.getByRole('link', { name: 'Check in now' }).click();
  await page.getByRole('radio', { name: '2 Noticeable', exact: true }).check();
  await page.getByLabel('Private note Optional').fill('Restored private note');
  await page.getByRole('button', { name: 'Save check-in' }).click();
  await page.getByRole('button', { name: 'End and save' }).click();
  await page.getByRole('link', { name: 'Back to Backup Bay' }).click();
  await page.getByRole('link', { name: 'Your cards' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Back up cards' }).click();
  const backup = await downloadPromise;
  const path = await backup.path();
  expect(path).toBeTruthy();
  const { readFile } = await import('node:fs/promises');
  const payload = JSON.parse(await readFile(path!, 'utf8')) as { cards: Array<{ sessions: Array<{ checkIns: Array<{ symptomLevel: number; note: string }> }> }> };
  expect(payload.cards[0].sessions[0].checkIns[0]).toMatchObject({ symptomLevel: 2, note: 'Restored private note' });
  await page.evaluate(async () => new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase('comfort-card-local');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  }));
  await page.reload();
  await expect(page.getByText('No game cards yet')).toBeVisible();
  await page.locator('#import-file').setInputFiles(path!);
  await expect(page.getByText('Backup Bay')).toBeVisible();
  await page.getByText('Backup Bay').click();
  await expect(page.getByRole('table', { name: 'Finished sessions' })).toContainText('2 / 4');
});

test('@claim:medical-scope every public surface states the same medical and safety limit', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.care-note')).toContainText(MEDICAL_SCOPE);

  await page.goto('/terms/');
  await expect(page.getByText(MEDICAL_SCOPE, { exact: true })).toBeVisible();

  await page.goto('/demo');
  await page.getByRole('button', { name: 'Share clean copy' }).click();
  await expect(page.getByLabel('Share text')).toHaveValue(new RegExp(MEDICAL_SCOPE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  const readme = await readFile('README.md', 'utf8');
  expect(readme.match(new RegExp(MEDICAL_SCOPE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))).toHaveLength(1);
});

test('@claim:pwa-routing production worker controls direct routes offline and missing URLs keep a styled 404', async ({ page, context }) => {
  const [manifestSource, worker, hostConfigSource, indexSource, appSource] = await Promise.all([
    readFile('dist/manifest.webmanifest', 'utf8'),
    readFile('dist/sw.js', 'utf8'),
    readFile('dist/staticwebapp.config.json', 'utf8'),
    readFile('dist/index.html', 'utf8'),
    readFile('src/main.ts', 'utf8'),
  ]);
  const manifest = JSON.parse(manifestSource) as { start_url: string };
  const version = manifest.start_url.match(/^\/?\?v=(comfort-card-[a-f0-9]{12})$/)?.[1];
  expect(version).toBeTruthy();
  expect(worker).toContain(`const VERSION = '${version}';`);
  expect(worker).toContain('const PRECACHE =');
  expect(worker).toContain('if (url.origin !== self.location.origin) return;');
  expect(worker).toContain('"/"');
  const appBundle = indexSource.match(/\/assets\/[^"']+\.js/)?.[0];
  expect(appBundle).toBeTruthy();
  expect(worker).toContain(appBundle);
  expect(appSource).toContain("'serviceWorker' in navigator && import.meta.env.PROD");

  const hostConfig = JSON.parse(hostConfigSource) as {
    routes?: Array<{ route?: string; rewrite?: string }>;
    responseOverrides?: Record<string, { rewrite?: string; statusCode?: number }>;
  };
  expect(hostConfig.routes).toEqual(expect.arrayContaining([
    expect.objectContaining({ route: '/demo*', rewrite: '/index.html' }),
    expect.objectContaining({ route: '/new', rewrite: '/index.html' }),
    expect.objectContaining({ route: '/card/*', rewrite: '/index.html' }),
  ]));
  expect(hostConfig.responseOverrides?.['404']).toEqual(expect.objectContaining({ rewrite: '/404.html', statusCode: 404 }));

  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

  await page.goto('/privacy/');
  await expect(page).toHaveTitle('Privacy — Comfort Card');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your notes stay yours.');

  await page.goto('/demo');
  await context.setOffline(true);
  await page.reload();
  await expect(page).toHaveTitle('Demo — Comfort Card');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Harbor Signal');
  await expect(page.getByText('Offline mode · your saved cards still work')).toBeVisible();

  await context.setOffline(false);
  await page.goto('/definitely-missing');
  await expect(page).toHaveTitle('Page not found — Comfort Card');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page is not in the drawer.');
});
