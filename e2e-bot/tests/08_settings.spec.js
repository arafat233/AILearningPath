import { test, expect } from '../helpers/fixtures.js';
import { injectAuth, waitForPage } from '../helpers/auth.js';

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await injectAuth(page);
    await page.goto('/settings');
    await waitForPage(page);
  });

  test('page loads at /settings without crash', async ({ page }) => {
    await expect(page).toHaveURL(/settings/);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('"Settings" heading is visible', async ({ page }) => {
    await expect(page.locator('h1:has-text("Settings")')).toBeVisible();
  });

  test('Full Name input is visible and editable', async ({ page }) => {
    await page.waitForTimeout(1500);
    const nameInput = page.locator('input[placeholder="Your full name"]');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toBeEnabled();
  });

  test('Exam Date input is visible', async ({ page }) => {
    await page.waitForTimeout(1500);
    await expect(page.locator('input[type="date"]')).toBeVisible();
  });

  test('Grade select dropdown has options', async ({ page }) => {
    await page.waitForTimeout(1500);
    const gradeSelect = page.locator('select').first();
    await expect(gradeSelect).toBeVisible();
    expect(await gradeSelect.locator('option').count()).toBeGreaterThan(0);
  });

  test('Study Goal select has 4 goal options', async ({ page }) => {
    await page.waitForTimeout(1500);
    const goalSelect = page.locator('select').last();
    await expect(goalSelect).toBeVisible();
    expect(await goalSelect.locator('option').count()).toBeGreaterThanOrEqual(4);
  });

  test('"Save changes" button is visible and enabled', async ({ page }) => {
    await page.waitForTimeout(1500);
    await expect(page.locator('button:has-text("Save changes")')).toBeEnabled();
  });

  test('"Save changes" shows success message', async ({ page }) => {
    await page.waitForTimeout(1500);
    await page.click('button:has-text("Save changes")');
    await expect(
      page.locator('text=updated successfully, text=Saving').first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('Subscription / plan info is visible', async ({ page }) => {
    await page.waitForTimeout(1500);
    await expect(
      page.locator('text=Current Plan, text=Free, text=Upgrade').first()
    ).toBeVisible();
  });

  test('"Upgrade"/"Manage" button navigates to /pricing', async ({ page }) => {
    await page.waitForTimeout(1500);
    const btn = page.locator('button:has-text("Upgrade"), button:has-text("Manage")').first();
    if (await btn.isVisible()) {
      await btn.click();
      await expect(page).toHaveURL(/pricing/);
    }
  });
});
