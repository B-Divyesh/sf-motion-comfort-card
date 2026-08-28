import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/', '/#new', '/privacy/', '/terms/']) {
  test(`has no serious accessibility violations at ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    const result = await new AxeBuilder({ page }).analyze();
    const important = result.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(important, important.map((violation) => `${violation.id}: ${violation.help}`).join('\n')).toEqual([]);
  });
}

test('keeps one h1 and designed focus at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll');
});
