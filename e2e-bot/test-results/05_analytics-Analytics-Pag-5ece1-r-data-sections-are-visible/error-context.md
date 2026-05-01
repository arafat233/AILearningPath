# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 05_analytics.spec.js >> Analytics Page >> stat cards or data sections are visible
- Location: tests\05_analytics.spec.js:20:3

# Error details

```
Error: Analytics page has no content — may have crashed
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
  4  | test.describe('Analytics Page', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await injectAuth(page);
  7  |     await page.goto('/analytics');
  8  |     await waitForPage(page);
  9  |   });
  10 | 
  11 |   test('page loads at /analytics without crash', async ({ page }) => {
  12 |     await expect(page).toHaveURL(/analytics/);
  13 |     await expect(page.locator('body')).not.toBeEmpty();
  14 |   });
  15 | 
  16 |   test('page heading is visible', async ({ page }) => {
  17 |     await expect(page.locator('h1, h2').first()).toBeVisible();
  18 |   });
  19 | 
  20 |   test('stat cards or data sections are visible', async ({ page }) => {
  21 |     await page.waitForTimeout(2000);
  22 |     const hasContent = await page.locator('[class*="card"], [class*="stat"], [class*="grid"]').count() > 0;
> 23 |     if (!hasContent) throw new Error('Analytics page has no content — may have crashed');
     |                            ^ Error: Analytics page has no content — may have crashed
  24 |   });
  25 | 
  26 |   test('Accuracy stat is displayed', async ({ page }) => {
  27 |     await page.waitForTimeout(2000);
  28 |     await expect(
  29 |       page.locator('text=Accuracy, text=Overall, text=Score').first()
  30 |     ).toBeVisible();
  31 |   });
  32 | 
  33 |   test('no critical JS console errors on load', async ({ page }) => {
  34 |     const errors = [];
  35 |     page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  36 |     await injectAuth(page);
  37 |     await page.goto('/analytics');
  38 |     await waitForPage(page);
  39 |     await page.waitForTimeout(1500);
  40 |     const critical = errors.filter((e) => !e.includes('favicon') && !e.includes('net::ERR'));
  41 |     if (critical.length > 0) throw new Error(`Console errors: ${critical.slice(0, 3).join(' | ')}`);
  42 |   });
  43 | });
  44 | 
```