import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir:       './tests',
  globalSetup:   './global-setup.js',
  fullyParallel: false,
  retries:       0,
  workers:       1,          // run one test at a time — like a real user
  timeout:       60_000,

  reporter: [
    ['list'],
    ['./reporter/issue-reporter.js'],
  ],

  use: {
    baseURL:            process.env.FRONTEND_URL || 'http://localhost:5173',
    headless:           false,   // ALWAYS open a real visible browser
    slowMo:             1200,    // human-speed — every click/type is clearly visible
    screenshot:         'only-on-failure',
    video:              'on',    // record every test so you can replay it
    viewport:           { width: 1280, height: 800 },
    actionTimeout:      20_000,
    navigationTimeout:  25_000,
    launchOptions: {
      headless: false,           // belt-and-suspenders: force headed
      args: ['--start-maximized'],
    },
  },
});
