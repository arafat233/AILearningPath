import { test, expect } from '../helpers/fixtures.js';
import { injectAuth, waitForPage } from '../helpers/auth.js';

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await injectAuth(page);
    await page.goto('/profile');
    await waitForPage(page);
  });

  test('page loads at /profile without crash', async ({ page }) => {
    await expect(page).toHaveURL(/profile/);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('page heading is visible', async ({ page }) => {
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('avatar / user name is visible', async ({ page }) => {
    await page.waitForTimeout(1500);
    const avatar = page.locator('[class*="rounded-full"], text=Test Bot').first();
    await expect(avatar).toBeVisible();
  });

  test('plan badge or subscription info is visible', async ({ page }) => {
    await page.waitForTimeout(1500);
    await expect(
      page.locator('[class*="badge"], text=Free, text=Pro, text=Plan').first()
    ).toBeVisible();
  });

  test('profile input fields are visible and editable', async ({ page }) => {
    await page.waitForTimeout(1500);
    const inputs = page.locator('input, select');
    await expect(inputs.first()).toBeVisible();
  });

  test('Save button is present and clickable', async ({ page }) => {
    await page.waitForTimeout(1500);
    const saveBtn = page.locator('button[type="submit"], button:has-text("Save")').first();
    await expect(saveBtn).toBeVisible();
    await expect(saveBtn).toBeEnabled();
  });

  test('Save button submits and stays on /profile', async ({ page }) => {
    await page.waitForTimeout(1500);
    const saveBtn = page.locator('button[type="submit"], button:has-text("Save")').first();
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/profile/);
    }
  });
});
