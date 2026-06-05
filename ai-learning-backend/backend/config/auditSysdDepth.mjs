/**
 * auditSysdDepth.mjs — DEPTH audit for the System Design track (pro_sysd).
 *
 * Why: the track hit topic-COUNT parity with AlgoMaster (179 > 177) while each
 * topic stayed ~500 words of prose + an MCQ, with 0 real diagrams. Count ≠
 * depth. This audit gates on DEPTH per SD_DEPTH_STANDARD.md so the drift can't
 * silently recur. Output (not a hand tally) is the source of truth (CLAUDE.md §5).
 *
 * A case-study topic is DEEP when its teaching.blocks (tagged with `section`)
 * cover the full framework: requirements, estimation (with numbers), hld, api
 * (code), data_model (code), ≥2 deep_dive, bottlenecks; PLUS a well-formed
 * authored teaching.visual_aid.svg, ≥1,200 words of teaching prose, ≥3 graded
 * exercises, and ≥3 commonGaps + interviewRelevance.
 *
 * Classification:
 *   - DEEP    — all required sections + svg + words + exercises present.
 *   - PARTIAL — has ≥1 `section` tag but is missing requirements (someone began
 *               deepening and left it incomplete). HARD FAIL — this is the drift.
 *   - SHALLOW — 0 `section` tags (legacy, not yet deepened). Reported, soft.
 *
 * Exit non-zero if: any PARTIAL topic, or any topic named via --require is not
 * DEEP. Always prints DEEP/total coverage for case studies.
 *
 * Usage:
 *   node config/auditSysdDepth.mjs
 *   node config/auditSysdDepth.mjs --require sysd_m1_t10,sysd_m1_t11
 *   npm run audit:sysd-depth
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProTopic, ProExercise } from "../models/proModels.js";

const TRACK_KEY = "pro_sysd";

const REQUIRED_SECTIONS = ["requirements", "estimation", "hld", "api", "data_model", "bottlenecks"];
const MIN_DEEP_DIVES   = 2;
const MIN_WORDS        = 1200;
const MIN_EXERCISES    = 3;
const MIN_GAPS         = 3;

// --require sysd_m1_t10,sysd_m1_t11  → assert these specific topics are DEEP.
function parseRequire() {
  const i = process.argv.indexOf("--require");
  if (i === -1) return [];
  const v = process.argv[i + 1] || "";
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}

function isCaseStudy(t) {
  const tags = (t.metadata?.tags || []).map((x) => String(x).toLowerCase());
  if (tags.includes("case-study")) return true;
  return /^(design an?\b|case study:)/i.test(t.name || "");
}

function wordCount(t) {
  const blocks = Array.isArray(t.teaching?.blocks) ? t.teaching.blocks : [];
  const text = blocks.map((b) => `${b?.heading || ""} ${b?.body || ""}`).join(" ");
  return (text.trim().match(/\S+/g) || []).length;
}

function svgWellFormed(va) {
  if (!va?.svg) return false;
  const s = String(va.svg).trim();
  if (!s.startsWith("<svg") || !s.endsWith("</svg>")) return false;
  const opens = (s.match(/<[a-zA-Z]/g) || []).length;
  const closes = (s.match(/<\//g) || []).length + (s.match(/\/>/g) || []).length;
  return opens === closes;
}

// Returns { status, missing[] } for a case-study topic.
function gradeTopic(t, exCount) {
  const blocks = Array.isArray(t.teaching?.blocks) ? t.teaching.blocks : [];
  const sections = blocks.map((b) => b?.section).filter(Boolean);
  const hasTag = sections.length > 0;

  const missing = [];
  for (const req of REQUIRED_SECTIONS) {
    if (!sections.includes(req)) missing.push(`section:${req}`);
  }
  const deepDives = sections.filter((s) => s === "deep_dive").length;
  if (deepDives < MIN_DEEP_DIVES) missing.push(`deep_dive×${deepDives}<${MIN_DEEP_DIVES}`);
  if (!svgWellFormed(t.teaching?.visual_aid)) missing.push("svg");
  const words = wordCount(t);
  if (words < MIN_WORDS) missing.push(`words:${words}<${MIN_WORDS}`);
  if (exCount < MIN_EXERCISES) missing.push(`exercises:${exCount}<${MIN_EXERCISES}`);
  const gaps = Array.isArray(t.commonGaps?.gaps) ? t.commonGaps.gaps.length : 0;
  if (gaps < MIN_GAPS) missing.push(`gaps:${gaps}<${MIN_GAPS}`);
  if (!(t.interviewRelevance || "").trim()) missing.push("interviewRelevance");

  let status;
  if (missing.length === 0) status = "DEEP";
  else if (hasTag) status = "PARTIAL";   // started but incomplete = the drift we catch
  else status = "SHALLOW";               // legacy, not yet deepened
  return { status, missing, words };
}

async function run() {
  const required = parseRequire();
  await mongoose.connect(process.env.MONGO_URI);
  const [topics, exercises] = await Promise.all([
    ProTopic.find({ trackKey: TRACK_KEY }).sort({ topicNumber: 1 }).lean(),
    ProExercise.find({ trackKey: TRACK_KEY }).select("topicId").lean(),
  ]);
  const exByTopic = {};
  for (const e of exercises) exByTopic[e.topicId] = (exByTopic[e.topicId] || 0) + 1;

  const caseStudies = topics.filter(isCaseStudy);
  const deep = [], partial = [], shallow = [];
  const graded = {};
  for (const t of caseStudies) {
    const g = gradeTopic(t, exByTopic[t.topicId] || 0);
    graded[t.topicId] = g;
    if (g.status === "DEEP") deep.push(t);
    else if (g.status === "PARTIAL") partial.push(t);
    else shallow.push(t);
  }

  console.log(`\n=== SYSTEM DESIGN DEPTH AUDIT (${TRACK_KEY}) ===`);
  console.log(`case-study topics: ${caseStudies.length}  (concept/fundamentals topics excluded)`);
  console.log(`\nDEEP COVERAGE: ${deep.length}/${caseStudies.length} case studies meet SD_DEPTH_STANDARD.md`);
  console.log(`  DEEP    = ${deep.length}`);
  console.log(`  PARTIAL = ${partial.length}  (started but incomplete — HARD FAIL)`);
  console.log(`  SHALLOW = ${shallow.length}  (legacy, not yet deepened)`);

  if (partial.length) {
    console.log(`\n✗ PARTIAL topics (incomplete depth — must finish or revert):`);
    partial.forEach((t) => console.log(`   - ${t.topicId} (${t.name}): missing ${graded[t.topicId].missing.join(", ")}`));
  }

  // --require gate
  const requireFails = [];
  if (required.length) {
    console.log(`\n--require: asserting ${required.length} topic(s) are DEEP:`);
    for (const id of required) {
      const g = graded[id];
      if (!g) { requireFails.push(`${id} (not a case study / not found)`); console.log(`   ✗ ${id}: not found among case studies`); continue; }
      if (g.status === "DEEP") console.log(`   ✓ ${id}: DEEP (${g.words} words)`);
      else { requireFails.push(`${id}: ${g.missing.join(", ")}`); console.log(`   ✗ ${id}: ${g.status} — missing ${g.missing.join(", ")}`); }
    }
  }

  if (deep.length) {
    console.log(`\nDEEP topics:`);
    deep.forEach((t) => console.log(`   ✓ ${t.topicId} (${t.name}) — ${graded[t.topicId].words} words`));
  }

  const fail = partial.length > 0 || requireFails.length > 0;
  if (fail) {
    console.log(`\n✗ FAIL — ${partial.length} partial, ${requireFails.length} required-but-not-deep.`);
  } else {
    console.log(`\n✓ PASS — 0 partial/incomplete deep topics${required.length ? `; all ${required.length} required topics DEEP` : ""}.`);
    console.log(`  (Coverage is ${deep.length}/${caseStudies.length}; raise it by deepening more case studies to the standard.)`);
  }

  await mongoose.disconnect();
  process.exit(fail ? 1 : 0);
}
run().catch((err) => { console.error(err.message); process.exit(1); });
