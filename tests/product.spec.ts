import { expect, test } from '@playwright/test';

test('creates a card, records a check-in, stops, and keeps private history', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Plan game settings before motion sickness starts.');
  await page.getByRole('link', { name: 'Make your own card' }).click();

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
  await page.goto('/new');
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
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Harbor Signal');
  await expect(page.getByText('Offline mode · your saved cards still work')).toBeVisible();
});

test('production worker excludes deployment-only configuration from its precache', async () => {
  const { readFile } = await import('node:fs/promises');
  const worker = await readFile('dist/sw.js', 'utf8');
  expect(worker).not.toContain('staticwebapp.config.json');
  expect(worker).toContain('const PRECACHE =');
});

test('rejects malformed full backups before they reach local storage', async ({ page }) => {
  await page.goto('/');
  const malformed = {
    kind: 'comfort-card-backup', version: 1, exportedAt: new Date().toISOString(), cards: [{
      id: 'bad-id', game: 'Broken Backup', platform: 'PC', baselineMinutes: 10,
      triggers: 'not-an-array', customTrigger: '',
      settings: [{ id: 'x', label: 'Setting', tip: 'tip', enabled: true, tried: false }], sessions: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }],
  };
  await page.locator('#import-file').setInputFiles({ name: 'malformed-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(malformed)) });
  await expect(page.getByText('This backup contains an invalid card. Nothing was restored.')).toBeVisible();
  await expect(page.getByText('Broken Backup')).not.toBeVisible();
  const stored = await page.evaluate(async () => new Promise<unknown[]>((resolve, reject) => {
    const request = indexedDB.open('comfort-card-local');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction('cards');
      const getAll = transaction.objectStore('cards').getAll();
      getAll.onsuccess = () => resolve(getAll.result);
      getAll.onerror = () => reject(getAll.error);
    };
  }));
  expect(stored).toEqual([]);
});

test('quarantines and lets the player remove an already-malformed saved card', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.evaluate(async () => new Promise<void>((resolve, reject) => {
    const request = indexedDB.open('comfort-card-local');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction('cards', 'readwrite');
      transaction.objectStore('cards').put({ id: 'bad-id', game: 'Broken Backup', triggers: 'not-an-array' });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
  }));
  await expect.poll(() => page.evaluate(async () => new Promise<number>((resolve, reject) => {
    const request = indexedDB.open('comfort-card-local');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const getAll = request.result.transaction('cards').objectStore('cards').getAll();
      getAll.onsuccess = () => resolve(getAll.result.length);
      getAll.onerror = () => reject(getAll.error);
    };
  }))).toBe(1);
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.getByText('One saved card needs recovery.')).toBeVisible();
  await page.getByRole('link', { name: 'Review Broken Backup' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This card cannot be opened safely.');
  await page.getByRole('button', { name: 'Remove broken record' }).click();
  await expect(page.getByText('One saved card needs recovery.')).not.toBeVisible();
  expect(errors).toEqual([]);
});

test('rejects a baseline outside the advertised 0–600 minute range', async ({ page }) => {
  await page.goto('/new');
  await page.getByLabel('Game name Required').fill('Boundary Game');
  await page.getByLabel('Usual comfortable play time Optional').fill('9999');
  await page.getByRole('button', { name: 'Make this card' }).click();
  await expect(page.getByText('Enter a whole number from 0 to 600 minutes.')).toBeVisible();
  await expect(page.getByLabel('Usual comfortable play time Optional')).toBeFocused();
  await page.getByLabel('Usual comfortable play time Optional').fill('600');
  await page.getByRole('button', { name: 'Make this card' }).click();
  await expect(page.getByText('600 baseline minutes')).toBeVisible();
});

test('shows the update action when a changed service worker is installed', async ({ page }) => {
  test.skip(test.info().project.name === 'mobile-390', 'The update transition is exercised once against the shared production build.');
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  const { readFile, writeFile } = await import('node:fs/promises');
  const original = await readFile('dist/sw.js', 'utf8');
  try {
    await writeFile('dist/sw.js', original.replace(/const VERSION = '[^']+';/, "const VERSION = 'comfort-card-test-update';"));
    await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration())?.update(); });
    await expect(page.getByText('A fresh version is ready.')).toBeVisible();
  } finally {
    await writeFile('dist/sw.js', original);
  }
});

test('uses real routes, route titles, focus, Back, and scroll restoration', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Plan game settings before motion sickness starts.');
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(350);
  await page.locator('header a[href="/new"]').evaluate((link: HTMLAnchorElement) => link.click());
  await expect(page).toHaveURL(/\/new$/);
  await expect(page).toHaveTitle('Make a card — Comfort Card');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Make a comfort card.');
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Plan game settings before motion sickness starts.');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(350);
});

test('loads both demo entry points with sample data and route metadata', async ({ page }) => {
  for (const path of ['/demo', '/?demo=1']) {
    await page.goto(path);
    await expect(page).toHaveTitle('Demo — Comfort Card');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Harbor Signal');
    await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://motion-comfort-card.sociobot.in/demo');
  }
});

test('opens the isolated query-string demo from the first screen in one click', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Harbor Signal');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
});

test('moves focus and keeps real cards hidden when navigation enters or leaves the demo', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Harbor Signal');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your notes stay yours.');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Your notes stay yours.');
});

test('keeps demo mode, title, and focus through internal navigation and Back', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Make a card' }).click();
  await expect(page).toHaveURL(/\/demo\/new$/);
  await expect(page).toHaveTitle('Demo card — Comfort Card');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Make a comfort card.');
  await page.goBack();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page).toHaveTitle('Demo — Comfort Card');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Harbor Signal');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Harbor Signal');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
});

test('renders a designed not-found page instead of the home page', async ({ page }) => {
  await page.goto('/definitely-missing');
  await expect(page).toHaveTitle('Page not found — Comfort Card');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page is not in the drawer.');
  await expect(page.getByText('Plan game settings before motion sickness starts.')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Return to your cards' })).toBeVisible();
});

test('ships complete social metadata and working legal links', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/icons/apple-touch-icon.png');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-card\.png$/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  for (const path of ['/privacy/', '/terms/']) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    await page.goto(path);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${'https://motion-comfort-card.sociobot.in'}${path}`);
  }
});

test('keeps first-screen content and controls usable at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.getByText('For players who feel sick from game motion')).toBeVisible();
  await expect(page.getByText('Works offline after the first visit')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});
