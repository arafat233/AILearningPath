/**
 * CBSE Class 9 Mathematics — Topic DAG (prerequisite graph)
 *
 * Creates one Topic node per standardized sub-topic (cbse_math9_*), with a
 * linear prerequisite chain WITHIN each chapter (s1 → s2 → s3 → s4).
 * Chapters are kept independent — each chapter's first sub-topic has no
 * prerequisite — so the planner can schedule chapters in parallel. Richer
 * cross-chapter edges can be layered on later if the planner needs them;
 * the per-topic `prerequisite_knowledge` prose already records the real
 * conceptual dependencies for the study UI.
 *
 * Topic `name` is read from the NcertTopicContent docs in the DB so it can
 * never drift from the content seed. Safe to re-run (upsert on topicId).
 *
 * Usage: node config/seedCbseMath9TopicDAG.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Topic } from "../models/index.js";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

// Ordered sub-topics per chapter — the intended study order.
const CHAPTERS = [
  ["cbse_math9_ch1_cartesian_plane", "cbse_math9_ch1_plotting_points", "cbse_math9_ch1_distance_formula", "cbse_math9_ch1_section_formula"],
  ["cbse_math9_ch2_poly_basics", "cbse_math9_ch2_zeroes", "cbse_math9_ch2_remainder_theorem", "cbse_math9_ch2_factor_theorem"],
  ["cbse_math9_ch3_number_systems", "cbse_math9_ch3_irrational_representation", "cbse_math9_ch3_decimal_expansions", "cbse_math9_ch3_real_operations"],
  ["cbse_math9_ch4_basic_identities", "cbse_math9_ch4_cube_identities", "cbse_math9_ch4_three_variable_identities", "cbse_math9_ch4_factorising_with_identities"],
  ["cbse_math9_ch5_circle_basics", "cbse_math9_ch5_chord_theorems", "cbse_math9_ch5_angle_theorems", "cbse_math9_ch5_cyclic_quadrilaterals"],
  ["cbse_math9_ch6_basics_triangle_area", "cbse_math9_ch6_herons_formula", "cbse_math9_ch6_quadrilateral_areas", "cbse_math9_ch6_composite_areas"],
  ["cbse_math9_ch7_random_experiments", "cbse_math9_ch7_empirical_probability", "cbse_math9_ch7_probability_range", "cbse_math9_ch7_probability_applications"],
  ["cbse_math9_ch8_sequences_basics", "cbse_math9_ch8_arithmetic_progressions", "cbse_math9_ch8_ap_sum", "cbse_math9_ch8_geometric_progressions"],
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const docs = await NcertTopicContent.find({ topicId: /^cbse_math9_/ }, { topicId: 1, name: 1 }).lean();
  const nameOf = new Map(docs.map((d) => [d.topicId, d.name]));

  let upserts = 0, missing = 0;
  for (const chapter of CHAPTERS) {
    for (let idx = 0; idx < chapter.length; idx++) {
      const topicId = chapter[idx];
      const name = nameOf.get(topicId);
      if (!name) {
        console.warn(`⚠ no NcertTopicContent for ${topicId} — node skipped`);
        missing++;
        continue;
      }
      await Topic.updateOne(
        { topicId },
        { $set: {
            topicId,
            name,
            subject:       "Mathematics",
            grade:         "9",
            level:         idx,
            prerequisites: idx > 0 ? [chapter[idx - 1]] : [],
        } },
        { upsert: true },
      );
      upserts++;
      console.log(`✓ ${topicId}  (level ${idx}, prereq: ${idx > 0 ? chapter[idx - 1] : "none"})`);
    }
  }

  console.log(`\nCBSE Math 9 TopicDAG: ${upserts} nodes upserted${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
