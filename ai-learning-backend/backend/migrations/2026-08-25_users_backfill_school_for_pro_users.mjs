/**
 * 2026-08-25 — backfill `{key: "school"}` for users who have an examBoard/grade
 * but whose tracks[] contains ONLY pro_* rows.
 *
 * Context: the 2026-05-26 backfill only matched `tracks: []` / missing. A user
 * who enrolled in a pro track before (or without) the school row being seeded
 * ends up with `tracks: [{key: "pro_java"}]` — non-empty, so that migration
 * skips them forever. Two ways to land there:
 *   - PUT /user/me seeds school only when `!existing?.tracks?.length`, so
 *     enrol-then-onboard never writes it.
 *   - Children created via /api/user/children before the seed existed.
 *
 * Symptom: ProDashboard renders no <TrackTabs/>, so the sidebar TrackSwitcher
 * is the only track switcher on the pro surface — and it lists exactly what
 * GET /user/nav returns. With one pro row and no school row, the user is
 * stranded on Java with no UI path back to the K-12 dashboard.
 *
 * navService.tracksForUser now derives school at read time, so this migration
 * is a data-hygiene follow-up, not a prerequisite for the fix.
 *
 * Idempotent:
 *   - Skips anyone who already has a school row.
 *   - Skips users with neither examBoard nor grade (genuine adult/pro accounts).
 *   - Never touches activeTrack — an explicit pro choice stays respected.
 *
 * Usage:
 *   node migrations/2026-08-25_users_backfill_school_for_pro_users.mjs --dry
 *   node migrations/2026-08-25_users_backfill_school_for_pro_users.mjs
 */

import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/index.js";

const isDry = process.argv.includes("--dry");

await mongoose.connect(process.env.MONGO_URI);

const query = {
  $or: [
    { examBoard: { $exists: true, $nin: [null, ""] } },
    { grade:     { $exists: true, $nin: [null, ""] } },
  ],
  "tracks.0": { $exists: true },        // has at least one track…
  "tracks.key": { $ne: "school" },      // …but none of them is school
};

const candidates = await User.find(query)
  .select("_id name examBoard grade activeTrack tracks")
  .lean();

console.log(`Users with a board/grade but no school track: ${candidates.length}`);

if (isDry) {
  console.log(JSON.stringify(
    candidates.slice(0, 10).map((u) => ({
      _id: String(u._id), name: u.name, examBoard: u.examBoard, grade: u.grade,
      activeTrack: u.activeTrack, tracks: (u.tracks || []).map((t) => t.key),
    })),
    null, 2,
  ));
  await mongoose.disconnect();
  process.exit(0);
}

let modified = 0;
for (const u of candidates) {
  // Prepend so school reads as the original enrolment, matching the ordering
  // TrackTabs/TrackSwitcher present ("School" first preserves the legacy default).
  const res = await User.updateOne(
    { _id: u._id, "tracks.key": { $ne: "school" } },
    { $push: { tracks: { $each: [{ key: "school", role: "learner", enrolledAt: new Date() }], $position: 0 } } },
  );
  if (res.modifiedCount) modified += 1;
}
console.log(`✓ Modified ${modified} user(s).`);

const remaining = await User.countDocuments(query);
console.log(`Remaining: ${remaining}  ${remaining === 0 ? "✓" : "⚠ investigate"}`);

await mongoose.disconnect();
process.exit(0);
