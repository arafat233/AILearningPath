/**
 * enrichMath7.js — v3 enrichment for CBSE Class 7 Math (ROADMAP / CONTENT_STATUS).
 *
 * The 60 `math7_*` topics ship in v2 format and pass 8/15 of the Math Content
 * Checklist (audit:math --board=CBSE --grade=7). This script PATCHES the 7
 * missing fields per topic to reach 15/15, WITHOUT touching the existing
 * teaching_content keys (intuition/derivation/worked_example/...):
 *
 *   top-level:        key_formulas, prerequisite_knowledge
 *   teaching_content: visual_description, svg_diagrams, when_to_use_this_method,
 *                     edge_cases, video_script_hooks
 *
 * Content is grounded in the NCERT "Ganita Prakash" Grade 7 textbook
 * (C:\...\CBSE 7th class math, gegp101–108 = Ch1–8, gegp201–207 = Ch9–15).
 *
 * Uses dot-notation $set so teaching_content sub-fields merge in place.
 * Idempotent. Accumulates chapter-by-chapter — re-run after adding a chapter.
 *
 * Usage:  node config/enrichMath7.js            # patch every topic present in ENRICH
 *         node config/enrichMath7.js --ch=1      # only chapter 1's topics
 * npm:    npm run enrich:math7
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith("--")).map(a => a.slice(2).split("=")));
const chFilter = args.ch ? `math7_ch${args.ch}_` : null;

// Small helper to keep SVGs compact + valid. Each is a clean, self-contained
// diagram matching the topic's visual_description.
function svg(id, title, inner) {
  return { id, title, svg: `<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">${inner}</svg>` };
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 1 — Large Numbers Around Us
// ─────────────────────────────────────────────────────────────────────────────
const ENRICH = {
  math7_ch1_lakhs_crores: {
    key_formulas: [
      { formula: "1 lakh = 1,00,000 = 100 × 1,000", explanation: "A hundred thousand — the smallest 6-digit number (1 followed by 5 zeros)." },
      { formula: "1 crore = 1,00,00,000 = 100 × 1 lakh", explanation: "A hundred lakhs — the smallest 8-digit number (1 followed by 7 zeros)." },
      { formula: "1 arab = 100 crore = 1,00,00,00,000", explanation: "A hundred crores (1 followed by 9 zeros)." },
    ],
    prerequisite_knowledge: ["place value up to thousands", "reading and writing whole numbers", "multiplying by 10, 100 and 1000"],
    visual_description: "A place-value chart with the Indian-system groups — Crores | Lakhs | Thousands | Ones — showing 1,00,000 starting the 6-digit (lakh) group and 1,00,00,000 starting the 8-digit (crore) group, with commas in the 3-2-2-2 pattern from the right.",
    svg_diagrams: [svg("math7_ch1_lakhs_crores_groups", "Indian place-value groups (3-2-2-2)",
      `<text x="20" y="30" font-weight="bold">Indian system — comma grouping</text>
       <rect x="20" y="50" width="120" height="40" fill="#e0f2fe" stroke="#0369a1"/><text x="40" y="75">Crores</text>
       <rect x="150" y="50" width="120" height="40" fill="#fef9c3" stroke="#a16207"/><text x="178" y="75">Lakhs</text>
       <rect x="280" y="50" width="120" height="40" fill="#dcfce7" stroke="#15803d"/><text x="300" y="75">Thousands</text>
       <rect x="410" y="50" width="90" height="40" fill="#fae8ff" stroke="#a21caf"/><text x="438" y="75">Ones</text>
       <text x="20" y="130" font-size="15">1,00,00,000 = 1 crore</text>
       <text x="20" y="160" font-size="15">1,00,000 = 1 lakh</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Reading/writing Indian figures (₹ amounts, population, budgets)", "News and census data quoting lakh/crore"],
      use_other_when: ["International/scientific contexts → use the million/billion (3-3-3) system instead"],
    },
    edge_cases: [
      { case: "99,999 + 1", value: "1,00,000 (one lakh)", reasoning: "The largest 5-digit number rolls over into the smallest 6-digit number.", where_it_appears: "Thousands → lakhs boundary." },
      { case: "99,99,999 + 1", value: "1,00,00,000 (one crore)", reasoning: "The largest 7-digit number rolls over into the smallest 8-digit number.", where_it_appears: "Lakhs → crores boundary." },
    ],
    video_script_hooks: {
      opening_hook: "India once grew about ONE LAKH varieties of rice. If you tasted a new one every single day, could you finish them in a 100-year life? No — 100 years is only about 36,500 days!",
      concept_reveal: "One lakh is 1 followed by five zeros (1,00,000). One crore is a hundred lakhs — 1 followed by seven zeros (1,00,00,000).",
    },
  },

  math7_ch1_place_value: {
    key_formulas: [
      { formula: "Value of a digit = digit × place value", explanation: "e.g. the 7 in 7,00,000 is worth 7 × 1,00,000 = seven lakh." },
      { formula: "Indian places (right→left): Ones, Tens, Hundreds, Thousands, Ten-thousands, Lakhs, Ten-lakhs, Crores …", explanation: "Each place is 10× the one to its right." },
    ],
    prerequisite_knowledge: ["the base-ten place value idea", "knowing lakhs and crores", "expanded form of a number"],
    visual_description: "A digit-by-digit place-value table for 3,45,678 showing each digit above its place name (Lakhs, Ten-thousands, Thousands, Hundreds, Tens, Ones) and its expanded value, e.g. 3×1,00,000 + 4×10,000 + 5×1,000 + 6×100 + 7×10 + 8.",
    svg_diagrams: [svg("math7_ch1_place_value_chart", "Place-value breakdown of 3,45,678",
      `<text x="20" y="28" font-weight="bold">3,45,678 in the Indian place-value chart</text>
       ${["L","TTh","Th","H","T","O"].map((p,i)=>`<rect x="${20+i*88}" y="50" width="84" height="36" fill="#f1f5f9" stroke="#475569"/><text x="${52+i*88}" y="73" text-anchor="middle">${p}</text>`).join("")}
       ${["3","4","5","6","7","8"].map((d,i)=>`<text x="${62+i*88}" y="120" text-anchor="middle" font-size="20" font-weight="bold">${d}</text>`).join("")}
       <text x="20" y="160" font-size="12">3×100000 + 4×10000 + 5×1000 + 6×100 + 7×10 + 8</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Writing a number in expanded form", "Identifying the value a digit contributes", "Comparing numbers digit by digit"],
      use_other_when: ["Pure counting or estimation, where exact place value isn't needed → round instead"],
    },
    edge_cases: [
      { case: "Zero as a place-holder, e.g. 3,05,007", value: "0 contributes nothing but holds the place", reasoning: "Removing the zeros would change every other digit's place value.", where_it_appears: "Numbers with empty middle places." },
      { case: "Same digits, different places (e.g. the two 5s in 5,50,000)", value: "5,00,000 vs 50,000", reasoning: "A digit's worth depends on its position, not just its face value.", where_it_appears: "Face value vs place value questions." },
    ],
    video_script_hooks: {
      opening_hook: "The same digit 5 can be worth five, or fifty thousand, or five lakh — it all depends on WHERE it stands.",
      concept_reveal: "Every place is ten times the place to its right. That single rule builds every large number you'll ever read.",
    },
  },

  math7_ch1_comparing_large: {
    key_formulas: [
      { formula: "More digits ⇒ larger number", explanation: "Any 7-digit number is bigger than any 6-digit number." },
      { formula: "Same digit-count ⇒ compare left to right", explanation: "Compare the leftmost (highest place) digits first; at the first difference, the bigger digit wins." },
    ],
    prerequisite_knowledge: ["place value in large numbers", "ordering single digits", "reading lakhs and crores"],
    visual_description: "Two large numbers stacked and right-aligned with their place-value columns lined up; an arrow scans from the leftmost column rightward to the first column where the digits differ, circling the larger digit to decide which number is greater.",
    svg_diagrams: [svg("math7_ch1_comparing_align", "Compare by aligning place-value columns",
      `<text x="20" y="28" font-weight="bold">Compare 3,45,678 and 3,45,876</text>
       <text x="40" y="70" font-family="monospace" font-size="18">3 4 5 6 7 8</text>
       <text x="40" y="100" font-family="monospace" font-size="18">3 4 5 8 7 6</text>
       <line x1="36" y1="110" x2="190" y2="110" stroke="#475569"/>
       <circle cx="121" cy="93" r="13" fill="none" stroke="#dc2626" stroke-width="2"/>
       <text x="210" y="100" fill="#dc2626">8 &gt; 6 → 3,45,876 is larger</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Ordering quantities (populations, prices) ascending/descending", "Deciding which of two figures is greater"],
      use_other_when: ["Numbers are close and only a rough sense is needed → estimate/round first"],
    },
    edge_cases: [
      { case: "Leading zeros, e.g. 045,678 vs 45,678", value: "Equal", reasoning: "Leading zeros don't change a number's value; count significant digits only.", where_it_appears: "Numbers written with stray leading zeros." },
      { case: "All compared digits equal until the last", value: "Decide at the final differing place", reasoning: "Keep scanning right until digits differ — don't stop early.", where_it_appears: "Numbers differing only in the ones/tens." },
    ],
    video_script_hooks: {
      opening_hook: "Which is bigger: 9,99,999 or 10,00,000? The smaller-looking digits win — because counting the digits comes first.",
      concept_reveal: "Step 1: more digits wins. Step 2: equal digits? Scan left to right to the first difference.",
    },
  },

  math7_ch1_rounding: {
    key_formulas: [
      { formula: "Round to nearest 10/100/1000/lakh: look at the next digit", explanation: "If it is 5 or more, round up; if 4 or less, round down (keep the place digit)." },
      { formula: "Estimate ≈ round each number, then operate", explanation: "Rounding before adding/subtracting gives a quick, close-enough answer." },
    ],
    prerequisite_knowledge: ["place value in large numbers", "comparing digits (≥5 vs <5)", "number line idea of 'nearer to'"],
    visual_description: "A number line segment from 1,00,000 to 2,00,000 with the midpoint 1,50,000 marked; the value 1,37,000 is plotted and an arrow shows it is nearer to 1,00,000, so it rounds to 1,00,000 (nearest lakh).",
    svg_diagrams: [svg("math7_ch1_rounding_numberline", "Rounding 1,37,000 to the nearest lakh",
      `<text x="20" y="28" font-weight="bold">Nearest lakh: 1,37,000 → 1,00,000</text>
       <line x1="40" y1="110" x2="520" y2="110" stroke="#475569" stroke-width="2"/>
       <line x1="40" y1="100" x2="40" y2="120" stroke="#475569"/><text x="20" y="145">1,00,000</text>
       <line x1="280" y1="100" x2="280" y2="120" stroke="#94a3b8"/><text x="250" y="145" fill="#64748b">1,50,000</text>
       <line x1="520" y1="100" x2="520" y2="120" stroke="#475569"/><text x="500" y="145">2,00,000</text>
       <circle cx="218" cy="110" r="6" fill="#dc2626"/><text x="180" y="90" fill="#dc2626">1,37,000</text>
       <path d="M218 110 L70 110" stroke="#dc2626" stroke-width="2" marker-end="url(#a)"/>
       <defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker></defs>`)],
    when_to_use_this_method: {
      use_this_when: ["Estimating totals/populations quickly", "Checking whether a calculated answer is reasonable", "Reporting figures 'about' a round value"],
      use_other_when: ["Money to the rupee, measurements, or any exact answer is required → don't round"],
    },
    edge_cases: [
      { case: "The next digit is exactly 5, e.g. 1,50,000 to nearest lakh", value: "Rounds up to 2,00,000", reasoning: "The standard rule rounds 5 upward.", where_it_appears: "Halfway values." },
      { case: "Rounding up causes a carry, e.g. 99,600 to nearest thousand", value: "1,00,000", reasoning: "Rounding the 9s up cascades into a new higher place.", where_it_appears: "Numbers just below a place boundary." },
    ],
    video_script_hooks: {
      opening_hook: "A town's population is 1,06,000. The news says 'about one lakh'. Were they lying? No — they rounded.",
      concept_reveal: "To round, peek at the very next digit: 5 or more rounds up, 4 or less stays. That's the whole trick.",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const entries = Object.entries(ENRICH).filter(([id]) => !chFilter || id.startsWith(chFilter));
  if (!entries.length) { console.log(`Nothing to enrich for filter ${chFilter || "(all)"}.`); await mongoose.disconnect(); return; }

  let patched = 0, missing = 0;
  for (const [topicId, f] of entries) {
    const set = {
      key_formulas:           f.key_formulas,
      prerequisite_knowledge: f.prerequisite_knowledge,
      "teaching_content.visual_description":      f.visual_description,
      "teaching_content.svg_diagrams":            f.svg_diagrams,
      "teaching_content.when_to_use_this_method": f.when_to_use_this_method,
      "teaching_content.edge_cases":              f.edge_cases,
      "teaching_content.video_script_hooks":      f.video_script_hooks,
    };
    const r = await NcertTopicContent.updateOne({ topicId }, { $set: set });
    if (r.matchedCount === 0) { console.log(`  ✗ MISSING in DB: ${topicId}`); missing++; }
    else { console.log(`  ✓ enriched ${topicId}`); patched++; }
  }
  console.log(`\nDone — ${patched} enriched, ${missing} missing (of ${entries.length}).`);
  await mongoose.disconnect();
  process.exit(missing ? 1 : 0);
}
run().catch((e) => { console.error("enrichMath7 failed:", e.message); process.exit(1); });
