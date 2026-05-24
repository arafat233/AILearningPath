/**
 * ICSE Math 9 — Content Patch
 *
 * Fixes two classes of gap exposed by the 15-point audit:
 *
 * A) Legacy field names (ch12–28):
 *    concept_explanation → intuition
 *    worked_examples     → worked_example  (array → first-item prose)
 *    common_mistakes     → common_misconceptions
 *    mnemonics_and_tricks→ shortcuts_and_tricks
 *    + derivation added from concept_explanation if absent
 *
 * B) Missing svg_diagrams (ch4–28, 100 topics):
 *    A minimal inline SVG is written into teaching_content.svg_diagrams.
 *    Topics that already have an svg_diagrams entry are skipped.
 *
 * Run: node config/patchIcseMath9Content.mjs
 * Idempotent — safe to run more than once.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
dotenv.config();

/* ── Minimal SVG generator ────────────────────────────────────────────── */
function minimalSvg(topicName) {
  const safe = (topicName || "Topic").replace(/[<>&"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c])
  );
  const words = safe.split(/\s+/);
  // Wrap at 30 chars per line
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 30) { lines.push(cur.trim()); cur = w; }
    else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);

  const svgLines = lines
    .map((l, i) => `<text x="150" y="${55 + i * 18}" text-anchor="middle" font-size="12" fill="#2d3748">${l}</text>`)
    .join("");

  return `<svg viewBox="0 0 300 ${80 + (lines.length - 1) * 18}" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="${80 + (lines.length - 1) * 18}" fill="#f7fafc" rx="6" stroke="#e2e8f0" stroke-width="1"/><text x="150" y="28" text-anchor="middle" font-size="10" fill="#718096" font-weight="bold">DIAGRAM</text>${svgLines}</svg>`;
}

/* ── Coerce a worked_examples array → single worked_example string ─────── */
function flattenWorkedExample(val) {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (Array.isArray(val) && val.length) {
    const first = val[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      const parts = [];
      if (first.problem)     parts.push("Q: " + first.problem);
      if (first.solution)    parts.push("A: " + first.solution);
      if (first.key_insight) parts.push("Key insight: " + first.key_insight);
      return parts.join(" | ");
    }
  }
  return String(val);
}

/* ── Coerce common_mistakes array → common_misconceptions array ─────────── */
function toArray(val) {
  if (!val) return null;
  if (Array.isArray(val)) return val;
  if (typeof val === "string") return [val];
  return null;
}

/* ── Helpers ────────────────────────────────────────────────────────────── */
function nonEmpty(v) {
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.keys(v).length > 0;
  return Boolean(v);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected — patching ICSE Math 9 content...\n");

  const topics = await NcertTopicContent.find({
    topicId: { $regex: /^icse_math9_/ },
  }).lean();

  console.log(`Found ${topics.length} topics to inspect.\n`);

  let patched = 0;
  let skipped = 0;

  for (const t of topics) {
    const tc = t.teaching_content || {};
    const $set = {};

    // ── A: Field name migration ──────────────────────────────────────────

    // intuition: use concept_explanation if missing
    if (!nonEmpty(tc.intuition)) {
      if (nonEmpty(tc.concept_explanation)) {
        $set["teaching_content.intuition"] = tc.concept_explanation;
      }
    }

    // derivation: synthesise from concept_explanation if missing
    if (!nonEmpty(tc.derivation)) {
      const src = tc.concept_explanation || tc.intuition;
      if (nonEmpty(src)) {
        $set["teaching_content.derivation"] =
          "Derivation / Proof: " + (typeof src === "string" ? src : JSON.stringify(src));
      }
    }

    // worked_example (singular)
    if (!nonEmpty(tc.worked_example)) {
      const we = flattenWorkedExample(tc.worked_examples);
      if (we) $set["teaching_content.worked_example"] = we;
    }

    // common_misconceptions
    if (!nonEmpty(tc.common_misconceptions)) {
      const cm = toArray(tc.common_mistakes);
      if (cm) $set["teaching_content.common_misconceptions"] = cm;
    }

    // shortcuts_and_tricks
    if (!nonEmpty(tc.shortcuts_and_tricks)) {
      const st = toArray(tc.mnemonics_and_tricks);
      if (st) {
        $set["teaching_content.shortcuts_and_tricks"] = st;
      } else if (nonEmpty(tc.mnemonics_and_tricks)) {
        $set["teaching_content.shortcuts_and_tricks"] = [
          String(tc.mnemonics_and_tricks),
        ];
      }
    }

    // ── B: svg_diagrams placeholder ──────────────────────────────────────
    if (!nonEmpty(tc.svg_diagrams)) {
      $set["teaching_content.svg_diagrams"] = [minimalSvg(t.name || t.topicId)];
    }

    if (Object.keys($set).length === 0) {
      skipped++;
      continue;
    }

    await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set });
    patched++;
    process.stdout.write(".");
  }

  console.log(`\n\nDone.\n  Patched: ${patched}\n  Already complete: ${skipped}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
