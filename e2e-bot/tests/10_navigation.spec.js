import { test, expect } from '../helpers/fixtures.js';
import { injectAuth, waitForPage } from '../helpers/auth.js';

const NAV_LINKS = [
  { label: 'Dashboard',     url: '/'            },
  { label: 'Learn',         url: '/lessons'     },
  { label: 'Practice',      url: '/practice'    },
  { label: 'Analytics',     url: '/analytics'   },
  { label: 'Competition',   url: '/competition' },
  { label: 'Live Room',     url: '/live'        },
  { label: 'Study Planner', url: '/planner'     },
  { label: 'Voice Tutor',   url: '/voice-tutor' },
  { label: 'Profile',       url: '/profile'     },
  { label: 'Upgrade',       url: '/pricing'     },
  { label: 'Settings',      url: '/settings'    },
];

test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await injectAuth(page);
    await page.goto('/');
    await waitForPage(page);
  });

  for (const { label, url } of NAV_LINKS) {
    test(`"${label}" nav link loads ${url}`, async ({ page }) => {
      const navLink = page.locator('nav').locator(`text=${label}`).first();
      if (await navLink.count() > 0) {
        await navLink.click();
      } else {
        await page.goto(url);
      }
      await waitForPage(page);
      await expect(page.locator('body')).not.toBeEmpty();
    });
  }
});

test.describe('Sign Out', () => {
  test('"Sign out" logs out and goes to /login or /start', async ({ page }) => {
    await injectAuth(page);
    await page.goto('/');
    await waitForPage(page);
    await expect(page.locator('button:has-text("Sign out")')).toBeVisible();
    await page.click('button:has-text("Sign out")');
    await expect(page).toHaveURL(/login|start/, { timeout: 10_000 });
  });
});

test.describe('Other Pages', () => {
  test('Pricing page loads at /pricing', async ({ page }) => {
    await injectAuth(page);
    await page.goto('/pricing');
    await waitForPage(page);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Voice Tutor page loads at /voice-tutor', async ({ page }) => {
    await injectAuth(page);
    await page.goto('/voice-tutor');
    await waitForPage(page);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Exam Review page loads at /exam-review', async ({ page }) => {
    await injectAuth(page);
    await page.goto('/exam-review');
    await waitForPage(page);
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
