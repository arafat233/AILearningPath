# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02_dashboard.spec.js >> Dashboard >> Thinking Profile section is visible
- Location: tests\02_dashboard.spec.js:59:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Thinking Profile')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Thinking Profile')

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
  4  | test.describe('Dashboard', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await injectAuth(page);
  7  |     await page.goto('/');
  8  |     await waitForPage(page);
  9  |   });
  10 | 
  11 |   test('page loads without crash or "Connection Error"', async ({ page }) => {
  12 |     const errCard = page.locator('text=Connection Error');
  13 |     if (await errCard.isVisible()) {
  14 |       throw new Error('Dashboard shows "Connection Error" — backend may not be running');
  15 |     }
  16 |     await expect(page.locator('h1')).toBeVisible();
  17 |   });
  18 | 
  19 |   test('greeting heading is visible (Good morning/afternoon/evening)', async ({ page }) => {
  20 |     await expect(page.locator('h1').first()).toContainText(/good (morning|afternoon|evening)/i);
  21 |   });
  22 | 
  23 |   test('four stat cards are visible (Accuracy, Questions, Weak, Strong)', async ({ page }) => {
  24 |     await expect(page.locator('text=Overall Accuracy')).toBeVisible();
  25 |     await expect(page.locator('text=Questions Done')).toBeVisible();
  26 |     await expect(page.locator('text=Weak Areas')).toBeVisible();
  27 |     await expect(page.locator('text=Strong Areas')).toBeVisible();
  28 |   });
  29 | 
  30 |   test('"Start Practice →" button is visible', async ({ page }) => {
  31 |     await expect(page.locator('button:has-text("Start Practice")')).toBeVisible();
  32 |   });
  33 | 
  34 |   test('"Start Practice →" button navigates to /practice', async ({ page }) => {
  35 |     await page.click('button:has-text("Start Practice")');
  36 |     await expect(page).toHaveURL('/practice');
  37 |   });
  38 | 
  39 |   test('Topics section heading is visible', async ({ page }) => {
  40 |     await expect(page.getByText('Topics', { exact: true })).toBeVisible();
  41 |   });
  42 | 
  43 |   test('clicking a topic card navigates to /practice', async ({ page }) => {
  44 |     await page.waitForTimeout(1500);
  45 |     const topicCards = page.locator('button').filter({ hasText: /Grade \d|· Grade/i });
  46 |     const count = await topicCards.count();
  47 |     if (count === 0) {
  48 |       console.log('   ⚠️  No topics seeded — run "npm run seed" in backend');
  49 |       return;
  50 |     }
  51 |     await topicCards.first().click();
  52 |     await expect(page).toHaveURL('/practice');
  53 |   });
  54 | 
  55 |   test('AI Coach section is visible', async ({ page }) => {
  56 |     await expect(page.locator('text=AI Coach')).toBeVisible();
  57 |   });
  58 | 
  59 |   test('Thinking Profile section is visible', async ({ page }) => {
> 60 |     await expect(page.locator('text=Thinking Profile')).toBeVisible();
     |                                                         ^ Error: expect(locator).toBeVisible() failed
  61 |   });
  62 | });
  63 | 
```