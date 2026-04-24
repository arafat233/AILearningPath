import { test, expect } from '../helpers/fixtures.js';
import { injectAuth, waitForPage } from '../helpers/auth.js';

test.describe('Practice — Topic Selector', () => {
  test.beforeEach(async ({ page }) => {
    await injectAuth(page);
    await page.goto('/practice');
    await waitForPage(page);
    await page.waitForTimeout(1500);
  });

  test('page loads with "Practice" heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Practice');
  });

  test('"Select Topic" section is visible', async ({ page }) => {
    await expect(page.locator('text=Select Topic')).toBeVisible();
  });

  test('topic buttons are visible', async ({ page }) => {
    const topicBtns  = page.locator('.grid button');
    const loadingMsg = page.locator('text=Loading topics');
    const hasTopics  = await topicBtns.count() > 0;
    const hasLoading = await loadingMsg.isVisible().catch(() => false);
    if (!hasTopics && !hasLoading) {
      throw new Error('No topic buttons and no loading indicator — topics failed to load');
    }
  });

  test('"Start Practice →" is disabled when no topic selected', async ({ page }) => {
    const btn = page.locator('button:has-text("Start Practice")');
    await expect(btn).toBeDisabled();
  });

  test('selecting a topic enables "Start Practice →"', async ({ page }) => {
    const topicBtns = page.locator('.grid button');
    if (await topicBtns.count() === 0) return;
    await topicBtns.first().click();
    await expect(page.locator('button:has-text("Start Practice")')).toBeEnabled();
  });
});

test.describe('Practice — Question Flow', () => {
  test.beforeEach(async ({ page }) => {
    await injectAuth(page);
    await page.goto('/practice');
    await waitForPage(page);
    await page.waitForTimeout(1500);

    const topicBtns = page.locator('.grid button');
    if (await topicBtns.count() === 0) {
      test.skip(true, 'No topics — run "npm run seed" in backend');
      return;
    }
    await topicBtns.first().click();
    await page.click('button:has-text("Start Practice")');
    await page.waitForSelector('button:has-text("← Topics")', { timeout: 20_000 });
  });

  test('question text and answer options are visible', async ({ page }) => {
    await expect(page.locator('h2, [class*="font-semibold"]').first()).toBeVisible();
    const optionBtns = page.locator('button').filter({ hasText: /^[ABCD]\.\s/ });
    await expect(optionBtns.first()).toBeVisible();
  });

  test('"← Topics" back button is visible', async ({ page }) => {
    await expect(page.locator('button:has-text("← Topics")')).toBeVisible();
  });

  test('session score counter is visible', async ({ page }) => {
    await expect(page.locator('text=correct')).toBeVisible();
  });

  test('confidence buttons (low / medium / high) are visible', async ({ page }) => {
    await expect(page.locator('button:has-text("low")')).toBeVisible();
    await expect(page.locator('button:has-text("medium")')).toBeVisible();
    await expect(page.locator('button:has-text("high")')).toBeVisible();
  });

  test('clicking a confidence level highlights it', async ({ page }) => {
    await page.click('button:has-text("medium")');
    const medBtn = page.locator('button:has-text("medium")');
    await expect(medBtn).toHaveClass(/bg-apple-blue|text-white/);
  });

  test('"💡 Get Hint" button is visible before answering', async ({ page }) => {
    await expect(page.locator('button:has-text("Get Hint")')).toBeVisible();
  });

  test('"Get Hint" fetches and shows a hint', async ({ page }) => {
    await page.click('button:has-text("Get Hint")');
    await expect(
      page.locator('text=Hint, text=Think step by step, button:has-text("Hint shown")').first()
    ).toBeVisible({ timeout: 15_000 });
  });

  test('clicking answer option shows feedback (Correct / Incorrect)', async ({ page }) => {
    await page.locator('button').filter({ hasText: /^A\.\s/ }).first().click();
    await expect(
      page.locator('text=Correct, text=Incorrect').first()
    ).toBeVisible({ timeout: 15_000 });
  });

  test('feedback card has "Next Question →" button', async ({ page }) => {
    await page.locator('button').filter({ hasText: /^A\.\s/ }).first().click();
    await page.waitForSelector('text=Correct, text=Incorrect', { timeout: 15_000 });
    await expect(page.locator('button:has-text("Next Question")')).toBeVisible();
  });

  test('"Report this question" flag button is visible after answering', async ({ page }) => {
    await page.locator('button').filter({ hasText: /^A\.\s/ }).first().click();
    await page.waitForSelector('text=Correct, text=Incorrect', { timeout: 15_000 });
    await expect(page.locator('button:has-text("Report this question")')).toBeVisible();
  });

  test('"Report" flag changes to "Reported — thanks"', async ({ page }) => {
    await page.locator('button').filter({ hasText: /^A\.\s/ }).first().click();
    await page.waitForSelector('text=Correct, text=Incorrect', { timeout: 15_000 });
    await page.click('button:has-text("Report this question")');
    await expect(page.locator('text=Reported — thanks')).toBeVisible({ timeout: 5_000 });
  });

  test('"Next Question →" loads next question', async ({ page }) => {
    await page.locator('button').filter({ hasText: /^A\.\s/ }).first().click();
    await page.waitForSelector('text=Correct, text=Incorrect', { timeout: 15_000 });
    await page.click('button:has-text("Next Question")');
    await page.waitForTimeout(3000);
    const hasNewQ   = await page.locator('button').filter({ hasText: /^A\.\s/ }).count() > 0;
    const backOnSel = await page.locator('button:has-text("Start Practice")').isVisible().catch(() => false);
    if (!hasNewQ && !backOnSel) {
      throw new Error('"Next Question →" did not load a new question or return to topic selector');
    }
  });

  test('"← Topics" returns to topic selector', async ({ page }) => {
    await page.click('button:has-text("← Topics")');
    await expect(
      page.locator('text=Select Topic, button:has-text("Start Practice")').first()
    ).toBeVisible();
  });
});
