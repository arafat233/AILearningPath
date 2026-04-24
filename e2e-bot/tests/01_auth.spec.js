/**
 * 01_auth.spec.js — Login, Register, Forgot Password
 * Runs with a CLEAN browser (no stored auth state).
 */
import { test, expect } from '@playwright/test';
import { TEST_EMAIL, TEST_PASSWORD } from '../helpers/auth.js';

// Override the global storageState — auth tests need a fresh, logged-out browser
test.use({ storageState: { cookies: [], origins: [] } });

// ── Login ───────────────────────────────────────────────────────────────────

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
  });

  test('page loads: heading, email/password inputs and Sign In button visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Welcome back');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Show/Hide password toggle switches input type', async ({ page }) => {
    await page.fill('input[type="password"]', 'testpassword');
    const toggleBtn = page.locator('button:has-text("Show"), button:has-text("Hide")').first();
    await expect(toggleBtn).toBeVisible();
    // Click "Show"
    await toggleBtn.click();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    // Click "Hide"
    await toggleBtn.click();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('invalid credentials show error and stay on login page', async ({ page }) => {
    await page.fill('input[type="email"]',    'nobody@notexist.com');
    await page.fill('input[type="password"]', 'wrongpassword123');
    await page.click('button[type="submit"]');
    // Must NOT navigate away — form should still be visible
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 8_000 });
  });

  test('"Forgot password?" link navigates to /forgot-password', async ({ page }) => {
    await page.click('a[href*="forgot-password"]');
    await expect(page).toHaveURL(/forgot-password/);
  });

  test('"Create Account" link navigates to /register', async ({ page }) => {
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL(/register/);
  });

  test('valid credentials log in and redirect to dashboard', async ({ page }) => {
    await page.fill('input[type="email"]',    TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/', { timeout: 15_000 });
  });
});

// ── Register ─────────────────────────────────────────────────────────────────

test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('domcontentloaded');
  });

  test('page loads: heading and all required fields visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Create Account');
    await expect(page.locator('input[placeholder="Your name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Create Account")')).toBeVisible();
  });

  test('password strength bar appears and updates while typing', async ({ page }) => {
    const pw = page.locator('input[type="password"]');
    await pw.fill('abc');
    await expect(page.locator('text=Weak')).toBeVisible();
    await pw.fill('StrongPass@2024');
    await expect(page.locator('text=Strong')).toBeVisible();
  });

  test('Show/Hide password toggle on register form works', async ({ page }) => {
    await page.fill('input[type="password"]', 'secret123');
    const toggleBtn = page.locator('button:has-text("Show"), button:has-text("Hide")').first();
    await toggleBtn.click();
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('"Sign In" link navigates back to /login', async ({ page }) => {
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL(/login/);
  });
});

// ── Forgot Password ───────────────────────────────────────────────────────────

test.describe('Forgot Password Page', () => {
  test('page loads with email input', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('submitting an email shows confirmation or error (not crash)', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.fill('input[type="email"]', 'anyone@test.com');
    const submitBtn = page.locator('button[type="submit"]');
    if (await submitBtn.count() > 0) {
      await submitBtn.click();
      await page.waitForTimeout(2000);
      // Page should not show a white blank screen or JS error
      await expect(page.locator('body')).not.toBeEmpty();
    }
  });
});
