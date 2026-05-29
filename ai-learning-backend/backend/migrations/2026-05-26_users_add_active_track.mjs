/**
 * 2026-05-26 — backfill User.activeTrack so the sidebar TrackSwitcher
 * has something to render for existing users.
 *
 * Rule: activeTrack = tracks[0]?.key ?? "school".
 *
 * Idempotent:
 *   - Skips users where activeTrack is already a non-null string.
 *
 * PRE-FLIGHT CHECK:
 *   1. Take a mongodump (`scripts/backup.js` or `mongodump --out ...`)
 *   2. Verify .env MONGO_URI points at the right database
 *   3. Run with --dry first
 *
 * Usage:
 *   node migrations/2026-05-26_users_add_active_track.mjs --dry
 *   node migrations/2026-05-26_users_add_active_track.mjs
 */

import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/index.js";

const isDry = process.argv.includes("--dry");

await mongoose.connect(process.env.MONGO_URI);

const candidates = await User.find({
  $or: [{ activeTrack: null }, { activeTrack: { $exists: false } }],
}).select("_id tracks").lean();

console.log(`Users needing backfill: ${candidates.length}`);

if (isDry) {
  const sample = candidates.slice(0, 5).map((u) => ({
    _id: String(u._id),
    inferredActiveTrack: u.tracks?.[0]?.key ?? "school",
  }));
  console.log("\n(dry-run) sample of intended writes:");
  console.log(JSON.stringify(sample, null, 2));
  await mongoose.disconnect();
  process.exit(0);
}

let modified = 0;
for (const u of candidates) {
  const activeTrack = u.tracks?.[0]?.key ?? "school";
  await User.updateOne({ _id: u._id }, { $set: { activeTrack } });
  modified += 1;
}
console.log(`\n✓ Modified ${modified} user(s).`);

const remaining = await User.countDocuments({
  $or: [{ activeTrack: null }, { activeTrack: { $exists: false } }],
});
console.log(`Remaining without activeTrack: ${remaining}  ${remaining === 0 ? "✓" : "⚠ re-run after investigating"}`);

await mongoose.disconnect();
process.exit(0);
