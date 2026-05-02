import { test, expect } from "@playwright/test";

// Requires a seeded test account. Set these env vars in CI:
//   E2E_EMAIL, E2E_PASSWORD
const EMAIL    = process.env.E2E_EMAIL    || "test@ailearn.dev";
const PASSWORD = process.env.E2E_PASSWORD || "TestPassword1!";

async function login(page) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(EMAIL);
  await page.getByLabel(/password/i).fill(PASSWORD);
  await page.getByRole("button", { name: /sign in|login/i }).click();
  await page.waitForURL(/dashboard|\//);
}

test.describe("Practice flow", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("navigate to Practice page", async ({ page }) => {
    await page.goto("/practice");
    await expect(page).toHaveURL(/practice/);
    // Subject/topic selector or question card should be visible
    await expect(
      page.getByText(/select|topic|start|maths|mathematics/i).first()
    ).toBeVisible({ timeout: 8_000 });
  });

  test("dashboard shows streak and stats", async ({ page }) => {
    await page.goto("/");
    // Stats section should be present (streak, questions answered, etc.)
    await expect(
      page.getByText(/streak|question|correct|today/i).first()
    ).toBeVisible({ timeout: 8_000 });
  });

  test("analytics page loads charts", async ({ page }) => {
    await page.goto("/analytics");
    // Should show at least one heading or chart element
    await expect(
      page.getByText(/analytics|performance|accuracy/i).first()
    ).toBeVisible({ timeout: 8_000 });
  });

  test("settings page is accessible", async ({ page }) => {
    await page.goto("/settings");
    await expect(
      page.getByText(/settings|account|subscription/i).first()
    ).toBeVisible({ timeout: 8_000 });
  });
});

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("sidebar links navigate to correct pages", async ({ page }) => {
    for (const { label, url } of [
      { label: "Learn",     url: /lessons/ },
      { label: "Practice",  url: /practice/ },
      { label: "Analytics", url: /analytics/ },
    ]) {
      await page.goto("/");
      await page.getByRole("link", { name: label }).first().click();
      await expect(page).toHaveURL(url, { timeout: 8_000 });
    }
  });

  test("sign-out returns to login page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /sign out|logout/i }).click();
    await expect(page).toHaveURL(/login/, { timeout: 8_000 });
  });
});
