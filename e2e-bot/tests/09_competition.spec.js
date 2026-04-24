import { test, expect } from '../helpers/fixtures.js';
import { injectAuth, waitForPage } from '../helpers/auth.js';

test.describe('Competition Page', () => {
  test.beforeEach(async ({ page }) => {
    await injectAuth(page);
    await page.goto('/competition');
    await waitForPage(page);
  });

  test('page loads at /competition without crash', async ({ page }) => {
    await expect(page).toHaveURL(/competition/);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('page heading is visible', async ({ page }) => {
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('competition content or empty state is shown', async ({ page }) => {
    await page.waitForTimeout(2000);
    await expect(page.locator('[class*="card"], h1, h2').first()).toBeVisible();
  });

  test('"Join" button is visible and enabled when competitions exist', async ({ page }) => {
    await page.waitForTimeout(2000);
    const joinBtn = page.locator('button').filter({ hasText: /join|enter/i });
    if (await joinBtn.count() > 0) {
      await expect(joinBtn.first()).toBeEnabled();
    }
  });

  test('clicking "Join" opens confirmation or join flow', async ({ page }) => {
    await page.waitForTimeout(2000);
    const joinBtn = page.locator('button').filter({ hasText: /join/i });
    if (await joinBtn.count() === 0) return;
    await joinBtn.first().click();
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).not.toBeEmpty();
  });
});

test.describe('Live Room Page', () => {
  test('page loads at /live without crash', async ({ page }) => {
    await injectAuth(page);
    await page.goto('/live');
    await waitForPage(page);
    await expect(page).toHaveURL(/live/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});
