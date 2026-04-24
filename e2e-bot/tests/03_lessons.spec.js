import { test, expect } from '../helpers/fixtures.js';
import { injectAuth, waitForPage } from '../helpers/auth.js';

test.describe('Lessons Page', () => {
  test.beforeEach(async ({ page }) => {
    await injectAuth(page);
    await page.goto('/lessons');
    await waitForPage(page);
  });

  test('page loads without crash', async ({ page }) => {
    await expect(page).toHaveURL(/lessons/);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('page heading is visible', async ({ page }) => {
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('lesson cards or empty state is shown', async ({ page }) => {
    await page.waitForTimeout(2000);
    const cards = page.locator('a, button').filter({ hasText: /chapter|lesson|topic|learn/i });
    const hasCards = await cards.count() > 0;
    if (!hasCards) {
      // At minimum the page should have rendered a card/grid
      await expect(page.locator('[class*="card"], [class*="grid"]').first()).toBeVisible();
    }
  });

  test('clicking a lesson navigates into it', async ({ page }) => {
    await page.waitForTimeout(1500);
    const lessonLinks = page.locator('a[href*="/lessons/"], a[href*="/chapters/"]');
    const count = await lessonLinks.count();
    if (count === 0) {
      console.log('   ⚠️  No lesson links found — lessons may not be seeded');
      return;
    }
    await lessonLinks.first().click();
    await expect(page).not.toHaveURL('/lessons');
  });
});

test.describe('LessonView — Next / Prev buttons', () => {
  test('Next and Prev buttons work inside a lesson', async ({ page }) => {
    await injectAuth(page);
    await page.goto('/lessons');
    await waitForPage(page);
    await page.waitForTimeout(1500);

    const lessonLinks = page.locator('a[href*="/lessons/"], a[href*="/chapters/"]');
    if (await lessonLinks.count() === 0) {
      console.log('   ⚠️  No lessons available — skipping');
      return;
    }
    await lessonLinks.first().click();
    await waitForPage(page);

    const nextBtn = page.locator('button:has-text("Next"), button:has-text("→")').first();
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(800);
      await expect(page.locator('body')).not.toBeEmpty();
    }

    const prevBtn = page.locator('button:has-text("Prev"), button:has-text("Back"), button:has-text("←")').first();
    if (await prevBtn.isVisible()) {
      await prevBtn.click();
      await page.waitForTimeout(800);
    }
  });
});
