# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01_auth.spec.js >> Login Page >> invalid credentials show error and stay on login page
- Location: tests\01_auth.spec.js:38:3

# Error details

```
TimeoutError: page.click: Timeout 20000ms exceeded.
Call log:
  - waiting for locator('button[type="submit"]')

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e7]: A
  - generic [ref=e8]:
    - heading "Welcome back" [level=1] [ref=e9]
    - paragraph [ref=e10]: Sign in to your learning dashboard
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: Email
        - textbox "you@example.com" [ref=e14]: nobody@notexist.com
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e17]: Password
          - link "Forgot password?" [ref=e18] [cursor=pointer]:
            - /url: /forgot-password
        - generic [ref=e19]:
          - textbox "••••••••" [active] [ref=e20]: wrongpassword123
          - button "Show" [ref=e21] [cursor=pointer]
      - button "Sign In" [ref=e22] [cursor=pointer]
    - paragraph [ref=e24]:
      - text: Don't have an account?
      - link "Create Account" [ref=e25] [cursor=pointer]:
        - /url: /register
```

# Test source

```ts
  1   | /**
  2   |  * 01_auth.spec.js — Login, Register, Forgot Password
  3   |  * Runs with a CLEAN browser (no stored auth state).
  4   |  */
  5   | import { test, expect } from '@playwright/test';
  6   | import { TEST_EMAIL, TEST_PASSWORD } from '../helpers/auth.js';
  7   | 
  8   | // Override the global storageState — auth tests need a fresh, logged-out browser
  9   | test.use({ storageState: { cookies: [], origins: [] } });
  10  | 
  11  | // ── Login ───────────────────────────────────────────────────────────────────
  12  | 
  13  | test.describe('Login Page', () => {
  14  |   test.beforeEach(async ({ page }) => {
  15  |     await page.goto('/login');
  16  |     await page.waitForLoadState('domcontentloaded');
  17  |   });
  18  | 
  19  |   test('page loads: heading, email/password inputs and Sign In button visible', async ({ page }) => {
  20  |     await expect(page.locator('h1')).toContainText('Welcome back');
  21  |     await expect(page.locator('input[type="email"]')).toBeVisible();
  22  |     await expect(page.locator('input[type="password"]')).toBeVisible();
  23  |     await expect(page.locator('button[type="submit"]')).toBeVisible();
  24  |   });
  25  | 
  26  |   test('Show/Hide password toggle switches input type', async ({ page }) => {
  27  |     await page.fill('input[type="password"]', 'testpassword');
  28  |     const toggleBtn = page.locator('button:has-text("Show"), button:has-text("Hide")').first();
  29  |     await expect(toggleBtn).toBeVisible();
  30  |     // Click "Show"
  31  |     await toggleBtn.click();
  32  |     await expect(page.locator('input[type="text"]')).toBeVisible();
  33  |     // Click "Hide"
  34  |     await toggleBtn.click();
  35  |     await expect(page.locator('input[type="password"]')).toBeVisible();
  36  |   });
  37  | 
  38  |   test('invalid credentials show error and stay on login page', async ({ page }) => {
  39  |     await page.fill('input[type="email"]',    'nobody@notexist.com');
  40  |     await page.fill('input[type="password"]', 'wrongpassword123');
> 41  |     await page.click('button[type="submit"]');
      |                ^ TimeoutError: page.click: Timeout 20000ms exceeded.
  42  |     // Must NOT navigate away — form should still be visible
  43  |     await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 8_000 });
  44  |   });
  45  | 
  46  |   test('"Forgot password?" link navigates to /forgot-password', async ({ page }) => {
  47  |     await page.click('a[href*="forgot-password"]');
  48  |     await expect(page).toHaveURL(/forgot-password/);
  49  |   });
  50  | 
  51  |   test('"Create Account" link navigates to /register', async ({ page }) => {
  52  |     await page.click('a[href="/register"]');
  53  |     await expect(page).toHaveURL(/register/);
  54  |   });
  55  | 
  56  |   test('valid credentials log in and redirect to dashboard', async ({ page }) => {
  57  |     await page.fill('input[type="email"]',    TEST_EMAIL);
  58  |     await page.fill('input[type="password"]', TEST_PASSWORD);
  59  |     await page.click('button[type="submit"]');
  60  |     await expect(page).toHaveURL('/', { timeout: 15_000 });
  61  |   });
  62  | });
  63  | 
  64  | // ── Register ─────────────────────────────────────────────────────────────────
  65  | 
  66  | test.describe('Register Page', () => {
  67  |   test.beforeEach(async ({ page }) => {
  68  |     await page.goto('/register');
  69  |     await page.waitForLoadState('domcontentloaded');
  70  |   });
  71  | 
  72  |   test('page loads: heading and all required fields visible', async ({ page }) => {
  73  |     await expect(page.locator('h1')).toContainText('Create Account');
  74  |     await expect(page.locator('input[placeholder="Your name"]')).toBeVisible();
  75  |     await expect(page.locator('input[type="email"]')).toBeVisible();
  76  |     await expect(page.locator('input[type="password"]')).toBeVisible();
  77  |     await expect(page.locator('button:has-text("Create Account")')).toBeVisible();
  78  |   });
  79  | 
  80  |   test('password strength bar appears and updates while typing', async ({ page }) => {
  81  |     const pw = page.locator('input[type="password"]');
  82  |     await pw.fill('abc');
  83  |     await expect(page.locator('text=Weak')).toBeVisible();
  84  |     await pw.fill('StrongPass@2024');
  85  |     await expect(page.locator('text=Strong')).toBeVisible();
  86  |   });
  87  | 
  88  |   test('Show/Hide password toggle on register form works', async ({ page }) => {
  89  |     await page.fill('input[type="password"]', 'secret123');
  90  |     const toggleBtn = page.locator('button:has-text("Show"), button:has-text("Hide")').first();
  91  |     await toggleBtn.click();
  92  |     await expect(page.locator('input[type="text"]')).toBeVisible();
  93  |   });
  94  | 
  95  |   test('"Sign In" link navigates back to /login', async ({ page }) => {
  96  |     await page.click('a[href="/login"]');
  97  |     await expect(page).toHaveURL(/login/);
  98  |   });
  99  | });
  100 | 
  101 | // ── Forgot Password ───────────────────────────────────────────────────────────
  102 | 
  103 | test.describe('Forgot Password Page', () => {
  104 |   test('page loads with email input', async ({ page }) => {
  105 |     await page.goto('/forgot-password');
  106 |     await page.waitForLoadState('domcontentloaded');
  107 |     await expect(page.locator('input[type="email"]')).toBeVisible();
  108 |   });
  109 | 
  110 |   test('submitting an email shows confirmation or error (not crash)', async ({ page }) => {
  111 |     await page.goto('/forgot-password');
  112 |     await page.fill('input[type="email"]', 'anyone@test.com');
  113 |     const submitBtn = page.locator('button[type="submit"]');
  114 |     if (await submitBtn.count() > 0) {
  115 |       await submitBtn.click();
  116 |       await page.waitForTimeout(2000);
  117 |       // Page should not show a white blank screen or JS error
  118 |       await expect(page.locator('body')).not.toBeEmpty();
  119 |     }
  120 |   });
  121 | });
  122 | 
```