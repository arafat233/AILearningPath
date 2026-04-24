import { test, expect } from '../helpers/fixtures.js';
import { injectAuth, waitForPage } from '../helpers/auth.js';

test.describe('Analytics Page', () => {
  test.beforeEach(async ({ page }) => {
    await injectAuth(page);
    await page.goto('/analytics');
    await waitForPage(page);
  });

  test('page loads at /analytics without crash', async ({ page }) => {
    await expect(page).toHaveURL(/analytics/);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('page heading is visible', async ({ page }) => {
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('stat cards or data sections are visible', async ({ page }) => {
    await page.waitForTimeout(2000);
    const hasContent = await page.locator('[class*="card"], [class*="stat"], [class*="grid"]').count() > 0;
    if (!hasContent) throw new Error('Analytics page has no content — may have crashed');
  });

  test('Accuracy stat is displayed', async ({ page }) => {
    await page.waitForTimeout(2000);
    await expect(
      page.locator('text=Accuracy, text=Overall, text=Score').first()
    ).toBeVisible();
  });

  test('no critical JS console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
    await injectAuth(page);
    await page.goto('/analytics');
    await waitForPage(page);
    await page.waitForTimeout(1500);
    const critical = errors.filter((e) => !e.includes('favicon') && !e.includes('net::ERR'));
    if (critical.length > 0) throw new Error(`Console errors: ${critical.slice(0, 3).join(' | ')}`);
  });
});
