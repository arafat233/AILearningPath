/**
 * Backfill `name` + `chapterNumber` on ICSE NcertTopicContent docs.
 *
 * The ICSE Math 9/10 seed scripts (seedIcseMath9Content.js / seedIcseMath10Content.js)
 * wrote rich teaching_content but never set `name` or `chapterNumber` — both
 * schema-required and used by topic lists, NcertTopicView, and transformations
 * (found by config/auditTransformations.mjs: 176 unnamed topics).
 *
 * Both fields are derivable from the topicId itself:
 *   icse_math9_ch1_rational_numbers → chapterNumber 1, name "Rational Numbers"
 *
 * Idempotent: only touches docs missing a field; second run updates 0.
 * Verify: node config/auditTransformations.mjs → 0 unnamed topics.
 *
 * Run: node config/backfillIcseTopicNames.mjs [--dry]
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const dry = process.argv.includes("--dry");

// Standard ICSE abbreviations that should stay uppercase in titles
const ACRONYMS = new Set(["ci", "ap", "gp", "sle", "hcf", "lcm", "gst"]);

const ID_RE = /^icse_math(9|10)_ch(\d+)_(.+)$/;

function derive(topicId) {
  const m = topicId.match(ID_RE);
  if (!m) return null;
  const name = m[3]
    .split("_")
    .map((w) => (ACRONYMS.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
  return { chapterNumber: Number(m[2]), name };
}

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI not set — create backend/.env or pass it in the environment.");
  process.exit(2);
}
await mongoose.connect(process.env.MONGO_URI);

const docs = await NcertTopicContent.find(
  { topicId: /^icse_/, $or: [{ name: { $in: [null, ""] } }, { chapterNumber: null }] },
  { topicId: 1, name: 1, chapterNumber: 1 }
).lean();

let updated = 0;
const skipped = [];
for (const d of docs) {
  const derived = derive(d.topicId);
  if (!derived) { skipped.push(d.topicId); continue; }
  const set = {};
  if (!d.name?.trim()) set.name = derived.name;
  if (d.chapterNumber == null) set.chapterNumber = derived.chapterNumber;
  if (!Object.keys(set).length) continue;
  console.log(`${dry ? "[dry] " : ""}${d.topicId} → ch${derived.chapterNumber} "${set.name || d.name}"`);
  if (!dry) await NcertTopicContent.updateOne({ _id: d._id }, { $set: set });
  updated++;
}

console.log(`\n${dry ? "[dry] would update" : "Updated"} ${updated}/${docs.length} docs · ${skipped.length} unparseable topicIds`);
skipped.forEach((id) => console.log(`  ✗ ${id}`));

await mongoose.disconnect();
process.exit(skipped.length ? 1 : 0);
