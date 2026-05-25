/**
 * 2026-05-25 — backfill User.tracks for the pro-track Java pilot.
 *
 * PRO_TRACK_PLAN.md §4.2: every existing user (created before the
 * `tracks: [...]` field was added) gets `tracks: [{ key: "school",
 *  role: "learner" }]` so the multi-track UI has something to render.
 *
 * Idempotent:
 *   - Skips users who already have at least one entry in `tracks`.
 *   - Re-running after success is a no-op.
 *
 * PRE-FLIGHT CHECK (do these before running):
 *   1. Take a mongodump (`scripts/backup.js` or `mongodump --out ...`)
 *   2. Verify the .env MONGO_URI points at the right database
 *   3. Run with --dry first to see counts; then run for real
 *
 * Usage:
 *   node migrations/2026-05-25_users_add_tracks.mjs --dry
 *   node migrations/2026-05-25_users_add_tracks.mjs
 */

import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/index.js";

const isDry = process.argv.includes("--dry");

await mongoose.connect(process.env.MONGO_URI);

const needsBackfill = await User.countDocuments({
  $or: [
    { tracks: { $exists: false } },
    { tracks: { $size: 0 } },
  ],
});
const alreadyHasTracks = await User.countDocuments({ "tracks.0": { $exists: true } });

console.log(`Users needing backfill : ${needsBackfill}`);
console.log(`Users already enrolled : ${alreadyHasTracks}`);

if (isDry) {
  console.log("\n(dry-run) would set tracks=[{ key: 'school', role: 'learner' }] on the " + needsBackfill + " users above.");
  await mongoose.disconnect();
  process.exit(0);
}

const res = await User.updateMany(
  {
    $or: [
      { tracks: { $exists: false } },
      { tracks: { $size: 0 } },
    ],
  },
  {
    $set: {
      tracks: [{
        key:        "school",
        role:       "learner",
        enrolledAt: new Date(),
      }],
    },
  }
);

console.log(`\n✓ Modified ${res.modifiedCount} user(s).`);

const verify = await User.countDocuments({
  $or: [
    { tracks: { $exists: false } },
    { tracks: { $size: 0 } },
  ],
});
console.log(`Remaining without tracks: ${verify}  ${verify === 0 ? "✓" : "⚠ re-run after investigating"}`);

await mongoose.disconnect();
process.exit(0);
