# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 07_profile.spec.js >> Profile Page >> plan badge or subscription info is visible
- Location: tests\07_profile.spec.js:26:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: [class*="badge"], text=Free, text=Pro, text=Plan >> nth=0
Expected: visible
Error: Unexpected token "=" while parsing css selector "[class*="badge"], text=Free, text=Pro, text=Plan". Did you mean to CSS.escape it?

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for [class*="badge"], text=Free, text=Pro, text=Plan >> nth=0

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e6]: A
  - heading "Your personal AI study coach" [level=1] [ref=e7]:
    - text: Your personal
    - text: AI study coach
  - paragraph [ref=e8]: Builds a plan around your weak spots, tracks your progress, and explains every mistake — like a private tutor.
  - button "Start my learning journey →" [ref=e9] [cursor=pointer]
  - paragraph [ref=e10]:
    - text: Already have an account?
    - link "Sign in" [ref=e11] [cursor=pointer]:
      - /url: /login
```

# Test source

```ts
  1  | import { test, expect } from '../helpers/fixtures.js';
  2  | import { injectAuth, waitForPage } from '../helpers/auth.js';
  3  | 
  4  | test.describe('Profile Page', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await injectAuth(page);
  7  |     await page.goto('/profile');
  8  |     await waitForPage(page);
  9  |   });
  10 | 
  11 |   test('page loads at /profile without crash', async ({ page }) => {
  12 |     await expect(page).toHaveURL(/profile/);
  13 |     await expect(page.locator('body')).not.toBeEmpty();
  14 |   });
  15 | 
  16 |   test('page heading is visible', async ({ page }) => {
  17 |     await expect(page.locator('h1').first()).toBeVisible();
  18 |   });
  19 | 
  20 |   test('avatar / user name is visible', async ({ page }) => {
  21 |     await page.waitForTimeout(1500);
  22 |     const avatar = page.locator('[class*="rounded-full"], text=Test Bot').first();
  23 |     await expect(avatar).toBeVisible();
  24 |   });
  25 | 
  26 |   test('plan badge or subscription info is visible', async ({ page }) => {
  27 |     await page.waitForTimeout(1500);
  28 |     await expect(
  29 |       page.locator('[class*="badge"], text=Free, text=Pro, text=Plan').first()
> 30 |     ).toBeVisible();
     |       ^ Error: expect(locator).toBeVisible() failed
  31 |   });
  32 | 
  33 |   test('profile input fields are visible and editable', async ({ page }) => {
  34 |     await page.waitForTimeout(1500);
  35 |     const inputs = page.locator('input, select');
  36 |     await expect(inputs.first()).toBeVisible();
  37 |   });
  38 | 
  39 |   test('Save button is present and clickable', async ({ page }) => {
  40 |     await page.waitForTimeout(1500);
  41 |     const saveBtn = page.locator('button[type="submit"], button:has-text("Save")').first();
  42 |     await expect(saveBtn).toBeVisible();
  43 |     await expect(saveBtn).toBeEnabled();
  44 |   });
  45 | 
  46 |   test('Save button submits and stays on /profile', async ({ page }) => {
  47 |     await page.waitForTimeout(1500);
  48 |     const saveBtn = page.locator('button[type="submit"], button:has-text("Save")').first();
  49 |     if (await saveBtn.isVisible()) {
  50 |       await saveBtn.click();
  51 |       await page.waitForTimeout(2000);
  52 |       await expect(page).toHaveURL(/profile/);
  53 |     }
  54 |   });
  55 | });
  56 | 
```