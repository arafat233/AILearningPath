# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 03_lessons.spec.js >> Lessons Page >> page loads without crash
- Location: tests\03_lessons.spec.js:11:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /lessons/
Received string:  "http://localhost:5173/start"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    8 × unexpected value "http://localhost:5173/start"

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
  4  | test.describe('Lessons Page', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await injectAuth(page);
  7  |     await page.goto('/lessons');
  8  |     await waitForPage(page);
  9  |   });
  10 | 
  11 |   test('page loads without crash', async ({ page }) => {
> 12 |     await expect(page).toHaveURL(/lessons/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  13 |     await expect(page.locator('body')).not.toBeEmpty();
  14 |   });
  15 | 
  16 |   test('page heading is visible', async ({ page }) => {
  17 |     await expect(page.locator('h1, h2').first()).toBeVisible();
  18 |   });
  19 | 
  20 |   test('lesson cards or empty state is shown', async ({ page }) => {
  21 |     await page.waitForTimeout(2000);
  22 |     const cards = page.locator('a, button').filter({ hasText: /chapter|lesson|topic|learn/i });
  23 |     const hasCards = await cards.count() > 0;
  24 |     if (!hasCards) {
  25 |       // At minimum the page should have rendered a card/grid
  26 |       await expect(page.locator('[class*="card"], [class*="grid"]').first()).toBeVisible();
  27 |     }
  28 |   });
  29 | 
  30 |   test('clicking a lesson navigates into it', async ({ page }) => {
  31 |     await page.waitForTimeout(1500);
  32 |     const lessonLinks = page.locator('a[href*="/lessons/"], a[href*="/chapters/"]');
  33 |     const count = await lessonLinks.count();
  34 |     if (count === 0) {
  35 |       console.log('   ⚠️  No lesson links found — lessons may not be seeded');
  36 |       return;
  37 |     }
  38 |     await lessonLinks.first().click();
  39 |     await expect(page).not.toHaveURL('/lessons');
  40 |   });
  41 | });
  42 | 
  43 | test.describe('LessonView — Next / Prev buttons', () => {
  44 |   test('Next and Prev buttons work inside a lesson', async ({ page }) => {
  45 |     await injectAuth(page);
  46 |     await page.goto('/lessons');
  47 |     await waitForPage(page);
  48 |     await page.waitForTimeout(1500);
  49 | 
  50 |     const lessonLinks = page.locator('a[href*="/lessons/"], a[href*="/chapters/"]');
  51 |     if (await lessonLinks.count() === 0) {
  52 |       console.log('   ⚠️  No lessons available — skipping');
  53 |       return;
  54 |     }
  55 |     await lessonLinks.first().click();
  56 |     await waitForPage(page);
  57 | 
  58 |     const nextBtn = page.locator('button:has-text("Next"), button:has-text("→")').first();
  59 |     if (await nextBtn.isVisible()) {
  60 |       await nextBtn.click();
  61 |       await page.waitForTimeout(800);
  62 |       await expect(page.locator('body')).not.toBeEmpty();
  63 |     }
  64 | 
  65 |     const prevBtn = page.locator('button:has-text("Prev"), button:has-text("Back"), button:has-text("←")').first();
  66 |     if (await prevBtn.isVisible()) {
  67 |       await prevBtn.click();
  68 |       await page.waitForTimeout(800);
  69 |     }
  70 |   });
  71 | });
  72 | 
```