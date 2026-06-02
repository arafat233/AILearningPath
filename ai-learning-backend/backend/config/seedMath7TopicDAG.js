/**
 * CBSE Class 7 Mathematics — Topic DAG (prerequisite graph)
 *
 * Creates ONE Topic node per sub-topic (math7_chN_xxx) — 60 nodes total —
 * matching the topic-level standard used by CBSE Math 8/9 and ICSE Math 9/10.
 *
 * Edges:
 *   • Linear prerequisite chain WITHIN each chapter (s1 → s2 → s3 → s4),
 *     following the intended study order.
 *   • Cross-chapter edges: the first sub-topic of a dependent chapter takes
 *     the LAST sub-topic of each prerequisite chapter as a prerequisite.
 *     These carry over the conceptual dependencies the original chapter-level
 *     DAG encoded (e.g. congruence needs lines + triangles first).
 *
 * Topic `name` is read from the NcertTopicContent docs in the DB so it can
 * never drift from the content seed. The obsolete 15 chapter-level nodes
 * (bare `math7_chN`) are removed so the graph shape matches the benchmark.
 * Safe to re-run (upsert on topicId).
 *
 * Usage: node config/seedMath7TopicDAG.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Topic } from "../models/index.js";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

// Ordered sub-topics per chapter — the intended study order (NOT alphabetical).
const CHAPTERS = [
  // Ch1 — Large Numbers Around Us
  ["math7_ch1_place_value", "math7_ch1_lakhs_crores", "math7_ch1_comparing_large", "math7_ch1_rounding"],
  // Ch2 — Arithmetic Expressions
  ["math7_ch2_expressions_intro", "math7_ch2_evaluating", "math7_ch2_order_operations", "math7_ch2_brackets"],
  // Ch3 — A Peek Beyond the Point (decimals)
  ["math7_ch3_decimals_review", "math7_ch3_place_value_decimal", "math7_ch3_comparing_decimals", "math7_ch3_decimal_fractions"],
  // Ch4 — Letter-Numbers (variables & expressions)
  ["math7_ch4_variables_intro", "math7_ch4_writing_expressions", "math7_ch4_substituting", "math7_ch4_simple_equations"],
  // Ch5 — Parallel and Intersecting Lines
  ["math7_ch5_intersecting_lines", "math7_ch5_angles_intersection", "math7_ch5_parallel_lines", "math7_ch5_transversal"],
  // Ch6 — Number Play
  ["math7_ch6_number_patterns", "math7_ch6_divisibility", "math7_ch6_magic_squares", "math7_ch6_number_puzzles"],
  // Ch7 — A Tale of Three Intersecting Lines (triangles)
  ["math7_ch7_triangle_basics", "math7_ch7_triangle_types", "math7_ch7_angle_sum", "math7_ch7_triangle_properties"],
  // Ch8 — Working with Fractions
  ["math7_ch8_fraction_operations", "math7_ch8_mixed_numbers", "math7_ch8_fraction_word", "math7_ch8_fraction_decimal"],
  // Ch9 — Geometric Twins (congruence)
  ["math7_ch9_congruence_intro", "math7_ch9_congruent_triangles", "math7_ch9_sss_sas", "math7_ch9_real_congruence"],
  // Ch10 — Operations with Integers
  ["math7_ch10_integers_intro", "math7_ch10_addition_subtraction", "math7_ch10_multiplication", "math7_ch10_division"],
  // Ch11 — Finding Common Ground (HCF & LCM)
  ["math7_ch11_hcf", "math7_ch11_lcm", "math7_ch11_hcf_lcm_relation", "math7_ch11_word_problems"],
  // Ch12 — Another Peek Beyond the Point (decimal operations)
  ["math7_ch12_decimal_addition", "math7_ch12_decimal_subtraction", "math7_ch12_decimal_multiplication", "math7_ch12_decimal_division"],
  // Ch13 — Connecting the Dots (data handling)
  ["math7_ch13_collecting_data", "math7_ch13_bar_graphs", "math7_ch13_mean_median", "math7_ch13_mode"],
  // Ch14 — Constructions and Tilings
  ["math7_ch14_construction_basics", "math7_ch14_construction_triangles", "math7_ch14_tilings", "math7_ch14_tessellation"],
  // Ch15 — Finding the Unknown (linear equations)
  ["math7_ch15_equations_intro", "math7_ch15_balance_method", "math7_ch15_solving_simple", "math7_ch15_word_problems"],
];

// Cross-chapter prerequisites (0-based chapter indices). The first sub-topic of
// the keyed chapter additionally depends on the LAST sub-topic of each listed
// prerequisite chapter. Carried over from the original chapter-level DAG.
const CROSS = {
  1: [0],      // Ch2 Arithmetic Expressions ← Ch1 Large Numbers
  3: [1],      // Ch4 Letter-Numbers         ← Ch2 Arithmetic Expressions
  5: [0],      // Ch6 Number Play            ← Ch1 Large Numbers
  6: [4],      // Ch7 Triangles              ← Ch5 Lines
  7: [2],      // Ch8 Fractions              ← Ch3 Decimals
  8: [4, 6],   // Ch9 Congruence             ← Ch5 Lines, Ch7 Triangles
  9: [1],      // Ch10 Integers              ← Ch2 Arithmetic Expressions
  10: [5],     // Ch11 HCF/LCM               ← Ch6 Number Play
  11: [2, 7],  // Ch12 Decimal ops           ← Ch3 Decimals, Ch8 Fractions
  12: [0],     // Ch13 Data                  ← Ch1 Large Numbers
  13: [4, 6],  // Ch14 Constructions         ← Ch5 Lines, Ch7 Triangles
  14: [3, 9],  // Ch15 Equations             ← Ch4 Letter-Numbers, Ch10 Integers
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const docs = await NcertTopicContent.find(
    { topicId: /^math7_/ },
    { topicId: 1, name: 1 }
  ).lean();
  const nameOf = new Map(docs.map((d) => [d.topicId, d.name]));

  let upserts = 0, missing = 0;
  for (let ch = 0; ch < CHAPTERS.length; ch++) {
    const chapter = CHAPTERS[ch];
    for (let idx = 0; idx < chapter.length; idx++) {
      const topicId = chapter[idx];
      const name = nameOf.get(topicId);
      if (!name) {
        console.warn(`⚠ no NcertTopicContent for ${topicId} — node skipped`);
        missing++;
        continue;
      }

      const prerequisites = idx > 0
        ? [chapter[idx - 1]]
        : (CROSS[ch] || []).map((ci) => CHAPTERS[ci][CHAPTERS[ci].length - 1]);

      await Topic.updateOne(
        { topicId },
        {
          $set: {
            topicId,
            name,
            subject: "Mathematics",
            grade: "7",
            level: idx,
            prerequisites,
          },
        },
        { upsert: true }
      );
      upserts++;
      console.log(`✓ ${topicId}  (level ${idx}, prereq: ${prerequisites.length ? prerequisites.join(", ") : "none"})`);
    }
  }

  // Remove the obsolete chapter-level nodes (bare math7_chN) so the graph
  // shape matches the topic-level benchmark (CBSE 8/9, ICSE 9/10).
  const stale = await Topic.deleteMany({ topicId: { $regex: /^math7_ch\d+$/ } });
  if (stale.deletedCount) console.log(`\n🧹 removed ${stale.deletedCount} obsolete chapter-level nodes`);

  console.log(`\nCBSE Math 7 TopicDAG: ${upserts} nodes upserted${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
  process.exit(missing ? 1 : 0);
}

run().catch((err) => { console.error(err); process.exit(1); });
