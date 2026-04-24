import { test, expect } from '../helpers/fixtures.js';
import { injectAuth, waitForPage } from '../helpers/auth.js';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await injectAuth(page);
    await page.goto('/');
    await waitForPage(page);
  });

  test('page loads without crash or "Connection Error"', async ({ page }) => {
    const errCard = page.locator('text=Connection Error');
    if (await errCard.isVisible()) {
      throw new Error('Dashboard shows "Connection Error" — backend may not be running');
    }
    await expect(page.locator('h1')).toBeVisible();
  });

  test('greeting heading is visible (Good morning/afternoon/evening)', async ({ page }) => {
    await expect(page.locator('h1').first()).toContainText(/good (morning|afternoon|evening)/i);
  });

  test('four stat cards are visible (Accuracy, Questions, Weak, Strong)', async ({ page }) => {
    await expect(page.locator('text=Overall Accuracy')).toBeVisible();
    await expect(page.locator('text=Questions Done')).toBeVisible();
    await expect(page.locator('text=Weak Areas')).toBeVisible();
    await expect(page.locator('text=Strong Areas')).toBeVisible();
  });

  test('"Start Practice →" button is visible', async ({ page }) => {
    await expect(page.locator('button:has-text("Start Practice")')).toBeVisible();
  });

  test('"Start Practice →" button navigates to /practice', async ({ page }) => {
    await page.click('button:has-text("Start Practice")');
    await expect(page).toHaveURL('/practice');
  });

  test('Topics section heading is visible', async ({ page }) => {
    await expect(page.getByText('Topics', { exact: true })).toBeVisible();
  });

  test('clicking a topic card navigates to /practice', async ({ page }) => {
    await page.waitForTimeout(1500);
    const topicCards = page.locator('button').filter({ hasText: /Grade \d|· Grade/i });
    const count = await topicCards.count();
    if (count === 0) {
      console.log('   ⚠️  No topics seeded — run "npm run seed" in backend');
      return;
    }
    await topicCards.first().click();
    await expect(page).toHaveURL('/practice');
  });

  test('AI Coach section is visible', async ({ page }) => {
    await expect(page.locator('text=AI Coach')).toBeVisible();
  });

  test('Thinking Profile section is visible', async ({ page }) => {
    await expect(page.locator('text=Thinking Profile')).toBeVisible();
  });
});
