/**
 * helpers/fixtures.js
 * Provides a custom `test` fixture that:
 *  1. Shares ONE browser context across all tests (worker scope)
 *  2. Injects the JWT token so every test starts logged in
 *  3. Reuses the same page — bot navigates within one tab
 */
import { test as base, expect } from '@playwright/test';
import { readFileSync }          from 'fs';

function loadToken() {
  try { return JSON.parse(readFileSync('.auth/token.json', 'utf8')); }
  catch { return {}; }
}

// Shared browser context — created once, kept alive the whole run
const workerContext = base.extend({
  // Override context at worker scope
  workerCtx: [async ({ browser }, use) => {
    const auth = loadToken();
    const ctx  = await browser.newContext({ viewport: { width: 1280, height: 800 } });

    // Inject JWT before every navigation so the app sees a logged-in user
    if (auth.token) {
      await ctx.addInitScript((data) => {
        localStorage.setItem('auth-storage', JSON.stringify({
          state:   { token: data.token, user: data.user },
          version: 0,
        }));
      }, auth);
    }

    await use(ctx);
    await ctx.close();
  }, { scope: 'worker' }],
});

// Single page inside that shared context
export const test = workerContext.extend({
  page: async ({ workerCtx }, use) => {
    // Reuse existing page if one already exists, otherwise open a new one
    const pages = workerCtx.pages();
    const page  = pages.length > 0 ? pages[0] : await workerCtx.newPage();
    await use(page);
    // Do NOT close — next test reuses the same tab
  },
});

export { expect };
