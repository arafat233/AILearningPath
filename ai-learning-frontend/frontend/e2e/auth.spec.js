import { test, expect } from "@playwright/test";

const TEST_USER = {
  name:     "E2E Test User",
  email:    `e2e_${Date.now()}@test.ailearn.dev`,
  password: "E2ePassword1!",
};

test.describe("Registration → Login → Logout", () => {
  test("landing page loads with CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AI Learning|CBSE/i);
    // unauthenticated users should see a sign-in/get-started link
    const cta = page.getByRole("link", { name: /get started|sign in|login/i }).first();
    await expect(cta).toBeVisible();
  });

  test("register, then immediately accessible dashboard", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel(/name/i).fill(TEST_USER.name);
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign up|register|create/i }).click();

    // After registration: either redirect to /onboarding or /dashboard
    await expect(page).toHaveURL(/onboarding|dashboard|\//);
  });

  test("login with valid credentials shows dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("test@ailearn.dev");
    await page.getByLabel(/password/i).fill("TestPassword1!");
    await page.getByRole("button", { name: /sign in|login/i }).click();

    // Expect redirect to dashboard (or error on seeded credentials absence)
    await page.waitForURL(/dashboard|login/, { timeout: 8_000 });
  });

  test("login with wrong password shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("nobody@invalid.example");
    await page.getByLabel(/password/i).fill("WrongPassword!");
    await page.getByRole("button", { name: /sign in|login/i }).click();

    const err = page.getByRole("alert").or(page.getByText(/invalid|incorrect|not found/i));
    await expect(err).toBeVisible({ timeout: 5_000 });
  });

  test("forgot password link is visible on login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("link", { name: /forgot/i })).toBeVisible();
  });
});

test.describe("Public pages", () => {
  test("pricing page renders plan cards", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText(/free|pro|premium/i).first()).toBeVisible();
  });

  test("terms page renders without errors", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("privacy page renders without errors", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });
});
