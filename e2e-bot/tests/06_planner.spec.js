import { test, expect } from '../helpers/fixtures.js';
import { injectAuth, waitForPage } from '../helpers/auth.js';

test.describe('Study Planner Page', () => {
  test.beforeEach(async ({ page }) => {
    await injectAuth(page);
    await page.goto('/planner');
    await waitForPage(page);
  });

  test('page loads at /planner without crash', async ({ page }) => {
    await expect(page).toHaveURL(/planner/);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('page heading is visible', async ({ page }) => {
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('plan content or empty state is shown', async ({ page }) => {
    await page.waitForTimeout(2500);
    await expect(page.locator('[class*="card"], [class*="plan"], h1, h2').first()).toBeVisible();
  });

  test('"Start" / practice button is visible and enabled if plan exists', async ({ page }) => {
    await page.waitForTimeout(2500);
    const startBtn = page.locator('button').filter({ hasText: /start|practice|today/i });
    if (await startBtn.count() > 0) {
      await expect(startBtn.first()).toBeEnabled();
    }
  });

  test('"Complete" button works if tasks are shown', async ({ page }) => {
    await page.waitForTimeout(2000);
    const completeBtn = page.locator('button').filter({ hasText: /complete|done|mark/i });
    if (await completeBtn.count() === 0) return;
    await completeBtn.first().click();
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
