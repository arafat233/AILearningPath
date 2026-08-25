/**
 * Seed: E2E test fixtures.
 *
 * The Playwright suite needs two things the e2e database never had, which is
 * why practice.spec.js and viewAsChild.spec.js failed on every CI run:
 *
 *   1. A login account. practice.spec.js logs in as E2E_EMAIL/E2E_PASSWORD
 *      (defaulting to test@ailearn.dev / TestPassword1!) in a beforeEach and
 *      says so in its own header comment — but nothing ever created that user.
 *      ci.yml points MONGO_URI at a fresh ai_learning_e2e, so the login always
 *      failed and every test in the file timed out looking for a sidebar that
 *      an unauthenticated visitor never sees.
 *
 *   2. AP_SSC Math 9 content. viewAsChild.spec.js asserts 12 chapters and
 *      exactly 4 topics on ap_ssc_math9_ch1. That comes from
 *      seedApSscMath9NcertChapters.js + seedApSscMath9Ch01.js, run separately
 *      here so CI does not pay for seed:ap-ssc-math9-all (every chapter, all
 *      content, all question banks) to satisfy two assertions.
 *
 * Password is hashed with bcrypt at cost 12 to match authController.register —
 * login does bcrypt.compare against it, so a plaintext seed would not log in.
 *
 * Idempotent: upserts by email, safe to re-run. Refuses to touch a database
 * whose name does not look like a test DB, so a mispointed MONGO_URI cannot
 * inject a known-password account into real data.
 *
 * Usage: node config/seedE2eFixtures.js
 */
import mongoose from "mongoose";
import bcrypt   from "bcryptjs";
import dotenv   from "dotenv";
import { User } from "../models/index.js";

dotenv.config();

const EMAIL    = process.env.E2E_EMAIL    || "test@ailearn.dev";
const PASSWORD = process.env.E2E_PASSWORD || "TestPassword1!";
const URI      = process.env.MONGO_URI;

if (!URI) {
  console.error("✗ MONGO_URI is not set.");
  process.exit(1);
}

// Guard: this script writes an account whose password is public knowledge.
const dbName = (URI.split("/").pop() || "").split("?")[0];
if (!/e2e|test/i.test(dbName)) {
  console.error(`✗ Refusing to seed E2E fixtures into "${dbName}" — the database name must contain "e2e" or "test".`);
  process.exit(1);
}

await mongoose.connect(URI);

const hashed = await bcrypt.hash(PASSWORD, 12);
// examBoard + grade matter beyond login: navService.tracksForUser derives the
// implicit school track from them, so without them the sidebar renders without
// the nav links practice.spec.js clicks.
const res = await User.updateOne(
  { email: EMAIL },
  {
    $set: {
      name:        "E2E Test User",
      password:    hashed,
      role:        "student",
      grade:       "10",
      examBoard:   "CBSE",
      activeTrack: "school",
    },
    $setOnInsert: {
      tracks: [{ key: "school", role: "learner", enrolledAt: new Date() }],
    },
  },
  { upsert: true },
);

const action = res.upsertedCount ? "created" : "updated";
console.log(`✓ E2E user ${action}: ${EMAIL} (db: ${dbName})`);

await mongoose.disconnect();
process.exit(0);
