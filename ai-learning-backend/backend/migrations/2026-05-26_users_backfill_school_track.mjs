/**
 * 2026-05-26 — backfill `tracks: [{key: "school"}]` for legacy users who
 * have an `examBoard` set but an empty `tracks[]` array.
 *
 * Context: the original 2026-05-25_users_add_tracks migration ran before
 * the multi-track sidebar, and only added school tracks to users who
 * existed at that moment. Children created via /api/user/children and
 * self-onboarders who completed PUT /user/me afterwards were left with
 * `tracks: []`. The new proService.enroll has guard rails for this, but
 * the inconsistency makes the TrackSwitcher and `crossMode` logic harder
 * to reason about. Clean it up.
 *
 * Idempotent:
 *   - Only touches users where `tracks` is missing OR length 0.
 *   - Skips users without examBoard (they're not school users).
 *   - Preserves any existing activeTrack value.
 *
 * Usage:
 *   node migrations/2026-05-26_users_backfill_school_track.mjs --dry
 *   node migrations/2026-05-26_users_backfill_school_track.mjs
 */

import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/index.js";

const isDry = process.argv.includes("--dry");

await mongoose.connect(process.env.MONGO_URI);

const candidates = await User.find({
  examBoard: { $exists: true, $ne: null, $ne: "" },
  $or: [{ tracks: { $exists: false } }, { tracks: { $size: 0 } }],
}).select("_id name examBoard activeTrack").lean();

console.log(`Legacy users to backfill: ${candidates.length}`);

if (isDry) {
  console.log(JSON.stringify(
    candidates.slice(0, 10).map((u) => ({
      _id: String(u._id), name: u.name, examBoard: u.examBoard, activeTrack: u.activeTrack,
    })),
    null, 2,
  ));
  await mongoose.disconnect();
  process.exit(0);
}

let modified = 0;
for (const u of candidates) {
  const ops = {
    $push: { tracks: { key: "school", role: "learner", enrolledAt: new Date() } },
  };
  if (!u.activeTrack) ops.$set = { activeTrack: "school" };
  const res = await User.updateOne({ _id: u._id }, ops);
  if (res.modifiedCount) modified += 1;
}
console.log(`✓ Modified ${modified} user(s).`);

const remaining = await User.countDocuments({
  examBoard: { $exists: true, $ne: null, $ne: "" },
  $or: [{ tracks: { $exists: false } }, { tracks: { $size: 0 } }],
});
console.log(`Remaining with examBoard but no tracks: ${remaining}  ${remaining === 0 ? "✓" : "⚠ investigate"}`);

await mongoose.disconnect();
process.exit(0);
