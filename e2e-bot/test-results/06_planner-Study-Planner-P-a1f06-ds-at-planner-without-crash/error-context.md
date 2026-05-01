# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 06_planner.spec.js >> Study Planner Page >> page loads at /planner without crash
- Location: tests\06_planner.spec.js:11:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /planner/
Received string:  "http://localhost:5173/start"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://localhost:5173/start"

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
  4  | test.describe('Study Planner Page', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await injectAuth(page);
  7  |     await page.goto('/planner');
  8  |     await waitForPage(page);
  9  |   });
  10 | 
  11 |   test('page loads at /planner without crash', async ({ page }) => {
> 12 |     await expect(page).toHaveURL(/planner/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  13 |     await expect(page.locator('body')).not.toBeEmpty();
  14 |   });
  15 | 
  16 |   test('page heading is visible', async ({ page }) => {
  17 |     await expect(page.locator('h1, h2').first()).toBeVisible();
  18 |   });
  19 | 
  20 |   test('plan content or empty state is shown', async ({ page }) => {
  21 |     await page.waitForTimeout(2500);
  22 |     await expect(page.locator('[class*="card"], [class*="plan"], h1, h2').first()).toBeVisible();
  23 |   });
  24 | 
  25 |   test('"Start" / practice button is visible and enabled if plan exists', async ({ page }) => {
  26 |     await page.waitForTimeout(2500);
  27 |     const startBtn = page.locator('button').filter({ hasText: /start|practice|today/i });
  28 |     if (await startBtn.count() > 0) {
  29 |       await expect(startBtn.first()).toBeEnabled();
  30 |     }
  31 |   });
  32 | 
  33 |   test('"Complete" button works if tasks are shown', async ({ page }) => {
  34 |     await page.waitForTimeout(2000);
  35 |     const completeBtn = page.locator('button').filter({ hasText: /complete|done|mark/i });
  36 |     if (await completeBtn.count() === 0) return;
  37 |     await completeBtn.first().click();
  38 |     await page.waitForTimeout(1000);
  39 |     await expect(page.locator('body')).not.toBeEmpty();
  40 |   });
  41 | });
  42 | 
```