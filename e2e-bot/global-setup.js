/**
 * global-setup.js
 * Runs ONCE before all tests.
 * Registers the test user (if needed) then calls the login API
 * directly and saves the JWT + user object to .auth/token.json.
 * Tests inject this token into localStorage — no storageState needed.
 */
import { writeFileSync, mkdirSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const EMAIL      = process.env.TEST_EMAIL    || 'testbot@ailearning.dev';
const PASSWORD   = process.env.TEST_PASSWORD || 'TestBot@12345';
const BACKEND    = process.env.BACKEND_URL   || 'http://localhost:5001/api';

export default async function globalSetup() {
  mkdirSync('.auth', { recursive: true });
  console.log(`\n🤖 Setting up test account: ${EMAIL}`);

  // ── 1. Register (ignore 409 if already exists) ──────────────────
  try {
    const res = await fetch(`${BACKEND}/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name: 'Test Bot', email: EMAIL, password: PASSWORD, grade: '10' }),
    });
    const json = await res.json();
    if (res.ok) {
      console.log('   ✅ Account registered');
    } else if (res.status === 409) {
      console.log('   ℹ️  Account already exists — logging in');
    } else {
      console.warn(`   ⚠️  Register returned ${res.status}: ${json.error || json.message}`);
    }
  } catch (err) {
    console.error(`   ❌ Could not reach backend at ${BACKEND}: ${err.message}`);
    console.error('   Is the backend running? (port 5001)\n');
    writeFileSync('.auth/token.json', JSON.stringify({}));
    return;
  }

  // ── 2. Login → get JWT ───────────────────────────────────────────
  try {
    const res  = await fetch(`${BACKEND}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });
    const json = await res.json();

    if (!res.ok) throw new Error(json.error || `Login failed (${res.status})`);

    const { token, user } = json.data;
    writeFileSync('.auth/token.json', JSON.stringify({ token, user }, null, 2));
    console.log(`   ✅ Logged in as ${user.name} — token saved to .auth/token.json\n`);
  } catch (err) {
    console.error(`   ❌ Login failed: ${err.message}\n`);
    writeFileSync('.auth/token.json', JSON.stringify({}));
  }
}
