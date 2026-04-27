# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 04_practice.spec.js >> Practice — Topic Selector >> "Select Topic" section is visible
- Location: tests\04_practice.spec.js:16:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Select Topic')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Select Topic')

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
  1   | import { test, expect } from '../helpers/fixtures.js';
  2   | import { injectAuth, waitForPage } from '../helpers/auth.js';
  3   | 
  4   | test.describe('Practice — Topic Selector', () => {
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await injectAuth(page);
  7   |     await page.goto('/practice');
  8   |     await waitForPage(page);
  9   |     await page.waitForTimeout(1500);
  10  |   });
  11  | 
  12  |   test('page loads with "Practice" heading', async ({ page }) => {
  13  |     await expect(page.locator('h1')).toContainText('Practice');
  14  |   });
  15  | 
  16  |   test('"Select Topic" section is visible', async ({ page }) => {
> 17  |     await expect(page.locator('text=Select Topic')).toBeVisible();
      |                                                     ^ Error: expect(locator).toBeVisible() failed
  18  |   });
  19  | 
  20  |   test('topic buttons are visible', async ({ page }) => {
  21  |     const topicBtns  = page.locator('.grid button');
  22  |     const loadingMsg = page.locator('text=Loading topics');
  23  |     const hasTopics  = await topicBtns.count() > 0;
  24  |     const hasLoading = await loadingMsg.isVisible().catch(() => false);
  25  |     if (!hasTopics && !hasLoading) {
  26  |       throw new Error('No topic buttons and no loading indicator — topics failed to load');
  27  |     }
  28  |   });
  29  | 
  30  |   test('"Start Practice →" is disabled when no topic selected', async ({ page }) => {
  31  |     const btn = page.locator('button:has-text("Start Practice")');
  32  |     await expect(btn).toBeDisabled();
  33  |   });
  34  | 
  35  |   test('selecting a topic enables "Start Practice →"', async ({ page }) => {
  36  |     const topicBtns = page.locator('.grid button');
  37  |     if (await topicBtns.count() === 0) return;
  38  |     await topicBtns.first().click();
  39  |     await expect(page.locator('button:has-text("Start Practice")')).toBeEnabled();
  40  |   });
  41  | });
  42  | 
  43  | test.describe('Practice — Question Flow', () => {
  44  |   test.beforeEach(async ({ page }) => {
  45  |     await injectAuth(page);
  46  |     await page.goto('/practice');
  47  |     await waitForPage(page);
  48  |     await page.waitForTimeout(1500);
  49  | 
  50  |     const topicBtns = page.locator('.grid button');
  51  |     if (await topicBtns.count() === 0) {
  52  |       test.skip(true, 'No topics — run "npm run seed" in backend');
  53  |       return;
  54  |     }
  55  |     await topicBtns.first().click();
  56  |     await page.click('button:has-text("Start Practice")');
  57  |     await page.waitForSelector('button:has-text("← Topics")', { timeout: 20_000 });
  58  |   });
  59  | 
  60  |   test('question text and answer options are visible', async ({ page }) => {
  61  |     await expect(page.locator('h2, [class*="font-semibold"]').first()).toBeVisible();
  62  |     const optionBtns = page.locator('button').filter({ hasText: /^[ABCD]\.\s/ });
  63  |     await expect(optionBtns.first()).toBeVisible();
  64  |   });
  65  | 
  66  |   test('"← Topics" back button is visible', async ({ page }) => {
  67  |     await expect(page.locator('button:has-text("← Topics")')).toBeVisible();
  68  |   });
  69  | 
  70  |   test('session score counter is visible', async ({ page }) => {
  71  |     await expect(page.locator('text=correct')).toBeVisible();
  72  |   });
  73  | 
  74  |   test('confidence buttons (low / medium / high) are visible', async ({ page }) => {
  75  |     await expect(page.locator('button:has-text("low")')).toBeVisible();
  76  |     await expect(page.locator('button:has-text("medium")')).toBeVisible();
  77  |     await expect(page.locator('button:has-text("high")')).toBeVisible();
  78  |   });
  79  | 
  80  |   test('clicking a confidence level highlights it', async ({ page }) => {
  81  |     await page.click('button:has-text("medium")');
  82  |     const medBtn = page.locator('button:has-text("medium")');
  83  |     await expect(medBtn).toHaveClass(/bg-apple-blue|text-white/);
  84  |   });
  85  | 
  86  |   test('"💡 Get Hint" button is visible before answering', async ({ page }) => {
  87  |     await expect(page.locator('button:has-text("Get Hint")')).toBeVisible();
  88  |   });
  89  | 
  90  |   test('"Get Hint" fetches and shows a hint', async ({ page }) => {
  91  |     await page.click('button:has-text("Get Hint")');
  92  |     await expect(
  93  |       page.locator('text=Hint, text=Think step by step, button:has-text("Hint shown")').first()
  94  |     ).toBeVisible({ timeout: 15_000 });
  95  |   });
  96  | 
  97  |   test('clicking answer option shows feedback (Correct / Incorrect)', async ({ page }) => {
  98  |     await page.locator('button').filter({ hasText: /^A\.\s/ }).first().click();
  99  |     await expect(
  100 |       page.locator('text=Correct, text=Incorrect').first()
  101 |     ).toBeVisible({ timeout: 15_000 });
  102 |   });
  103 | 
  104 |   test('feedback card has "Next Question →" button', async ({ page }) => {
  105 |     await page.locator('button').filter({ hasText: /^A\.\s/ }).first().click();
  106 |     await page.waitForSelector('text=Correct, text=Incorrect', { timeout: 15_000 });
  107 |     await expect(page.locator('button:has-text("Next Question")')).toBeVisible();
  108 |   });
  109 | 
  110 |   test('"Report this question" flag button is visible after answering', async ({ page }) => {
  111 |     await page.locator('button').filter({ hasText: /^A\.\s/ }).first().click();
  112 |     await page.waitForSelector('text=Correct, text=Incorrect', { timeout: 15_000 });
  113 |     await expect(page.locator('button:has-text("Report this question")')).toBeVisible();
  114 |   });
  115 | 
  116 |   test('"Report" flag changes to "Reported — thanks"', async ({ page }) => {
  117 |     await page.locator('button').filter({ hasText: /^A\.\s/ }).first().click();
```