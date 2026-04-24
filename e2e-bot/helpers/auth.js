/**
 * helpers/auth.js
 * injectAuth(page) — reads the saved JWT and injects it into
 * localStorage as Zustand's "auth-storage" key BEFORE the page loads.
 * This is more reliable than Playwright storageState for SPA apps.
 */
import { readFileSync } from 'fs';

export const TEST_EMAIL    = process.env.TEST_EMAIL    || 'testbot@ailearning.dev';
export const TEST_PASSWORD = process.env.TEST_PASSWORD || 'TestBot@12345';

/** Call this in beforeEach for every test that needs a logged-in user. */
export async function injectAuth(page) {
  let authData = {};
  try {
    authData = JSON.parse(readFileSync('.auth/token.json', 'utf8'));
  } catch {
    console.warn('   ⚠️  .auth/token.json not found — run global setup first');
    return;
  }

  if (!authData.token) {
    console.warn('   ⚠️  No token in .auth/token.json — tests will run logged out');
    return;
  }

  // Inject token into localStorage in the format Zustand persist expects:
  // key: "auth-storage"  value: { state: { token, user }, version: 0 }
  await page.addInitScript((data) => {
    localStorage.setItem('auth-storage', JSON.stringify({
      state:   { token: data.token, user: data.user },
      version: 0,
    }));
  }, authData);
}

/** Waits for any loading spinner to disappear. */
export async function waitForPage(page, timeout = 20_000) {
  await page.waitForSelector('.animate-spin', { state: 'detached', timeout }).catch(() => {});
  await page.waitForLoadState('domcontentloaded');
}
