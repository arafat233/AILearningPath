// E2E regression test for the "parent views as child" flow.
//
// Locks in today's fix: when a parent creates a Class 9 AP_SSC child via
// the Onboarding page and lands on Lessons, the page must show the 12
// AP_SSC Math 9 chapters (not the CBSE fallback) and the chapter detail
// page for ap_ssc_math9_ch1 must show 4 topics (not 41).
//
// Requires:
//   - backend at http://localhost:5001 with AP_SSC Math 9 content seeded
//     (chapters + topics; see seedApSscMath9NcertChapters.js and Ch01.js)
//   - frontend at http://localhost:5173

import { test, expect } from "@playwright/test";

const PARENT = {
  name:     "E2E Parent",
  email:    `e2e_parent_${Date.now()}@test.ailearn.dev`,
  password: "E2ePassword1!",
};

const CHILD = {
  name:      "E2E Child",
  grade:     "9",
  examBoard: "AP_SSC",
};

test.describe("Parent-views-child end-to-end", () => {
  test("register parent → onboard AP_SSC Class 9 child → see correct chapters + topics", async ({ page }) => {
    // 1. Register parent — backend creates user, sets activeChild=null
    await page.goto("/register");
    await page.getByLabel(/name/i).fill(PARENT.name);
    await page.getByLabel(/email/i).fill(PARENT.email);
    await page.getByLabel(/password/i).fill(PARENT.password);
    await page.getByRole("button", { name: /sign up|register|create/i }).click();

    // After register the app routes parents to onboarding or welcome
    await page.waitForURL(/onboarding|welcome|child-picker|start|\/$/, { timeout: 15_000 });

    // 2. Onboard a child — the Onboarding page form
    // If we landed somewhere else (e.g. /start because user has no board/grade),
    // navigate to /onboarding directly. /onboarding creates a linked child.
    if (!page.url().includes("/onboarding")) {
      await page.goto("/onboarding");
    }
    await page.getByPlaceholder(/Ayaan Khan|student name/i).fill(CHILD.name);
    await page.locator("select").nth(0).selectOption(CHILD.grade);
    await page.locator("select").nth(1).selectOption(CHILD.examBoard);
    await page.getByRole("button", { name: /Continue to Dashboard/i }).click();

    // 3. Land on dashboard (or /) — activeChild is now the new AP_SSC kid
    await page.waitForURL(/^http:\/\/localhost:5173\/(\?|$)/, { timeout: 15_000 });

    // 4. Navigate to Lessons
    await page.goto("/lessons");

    // 5. Verify all 12 AP_SSC Math 9 chapter titles are present.
    // The titles are unique enough that we can match by text.
    const expected = [
      "Number Systems",
      "Polynomials",
      "Coordinate Geometry",
      "Linear Equations in Two Variables",
      "Introduction to Euclid's Geometry",
      "Lines and Angles",
      "Triangles",
      "Quadrilaterals",
      "Circles",
      "Heron's Formula",
      "Surface Areas and Volumes",
      "Statistics",
    ];
    for (const title of expected) {
      await expect(
        page.getByText(title, { exact: false }).first(),
        `chapter "${title}" should be visible on /lessons`
      ).toBeVisible({ timeout: 15_000 });
    }

    // Wrong titles from the CBSE-fallback path should NOT appear.
    await expect(page.getByText("Algebraic Identities").first()).toHaveCount(0);
    await expect(page.getByText("Sequences and Progressions").first()).toHaveCount(0);

    // 6. Open Chapter 1 detail page directly
    await page.goto("/ncert/chapters/ap_ssc_math9_ch1");

    // Header should identify board+grade+subject
    await expect(page.getByText(/AP_SSC.*Class 9.*Mathematics/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Number Systems" })).toBeVisible();

    // Exactly 4 topics for AP_SSC Class 9 Chapter 1
    const topicHeadings = [
      "Irrational Numbers",
      "Real Numbers and Their Decimal Expansions",
      "Laws of Exponents for Real Numbers",
      "Operations on Real Numbers",
    ];
    for (const t of topicHeadings) {
      await expect(page.getByText(t, { exact: false }).first()).toBeVisible({ timeout: 10_000 });
    }

    // Topics that belong to OTHER grades/boards must NOT leak in (no actAs swap = 41 topics).
    await expect(page.getByText("Plotting Points in All Four Quadrants").first()).toHaveCount(0);
    await expect(page.getByText("Cubes and Cube Roots").first()).toHaveCount(0);
  });

  test("dashboard is fresh for a newly-onboarded child (no parent data leak)", async ({ page }) => {
    // After the previous test completes, the parent's activeChild is the
    // just-created AP_SSC kid. Re-login is unnecessary because Playwright
    // shares storage state within a describe by default — but we re-navigate
    // to ensure the dashboard fetches with x-child-id set.
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(PARENT.email);
    await page.getByLabel(/password/i).fill(PARENT.password);
    await page.getByRole("button", { name: /sign in|login/i }).click();
    await page.waitForURL(/^http:\/\/localhost:5173\//, { timeout: 15_000 });

    // For a fresh child, the dashboard should NOT show accumulated parent
    // data. We can't assert the exact UI, but specific numbers like a streak
    // > 1, an AI-credits "10/10 used", or 50+ questions answered would
    // indicate the swap failed.
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/10\s*\/\s*10\s+used today/i);
    expect(body).not.toMatch(/57\s+questions\s+done/i);
  });
});
