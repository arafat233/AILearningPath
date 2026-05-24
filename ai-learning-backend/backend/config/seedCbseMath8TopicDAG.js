/**
 * CBSE Class 8 Mathematics — Topic DAG (prerequisite graph)
 *
 * Creates one Topic node per standardized sub-topic (cbse_math8_*), with a
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
 * Usage: node config/seedCbseMath8TopicDAG.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Topic } from "../models/index.js";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

// Ordered sub-topics per chapter — the intended study order.
const CHAPTERS = [
  // Ch1 — Squares and Cubes
  [
    "cbse_math8_ch1_squares",
    "cbse_math8_ch1_cubes",
    "cbse_math8_ch1_square_roots",
    "cbse_math8_ch1_cube_roots",
  ],
  // Ch2 — Exponents and Powers
  [
    "cbse_math8_ch2_exponents_intro",
    "cbse_math8_ch2_laws_of_exponents",
    "cbse_math8_ch2_negative_exponents",
    "cbse_math8_ch2_scientific_notation",
  ],
  // Ch3 — Number Systems
  [
    "cbse_math8_ch3_number_systems",
    "cbse_math8_ch3_integers_operations",
    "cbse_math8_ch3_rational_numbers",
    "cbse_math8_ch3_irrational_numbers",
  ],
  // Ch4 — Quadrilaterals
  [
    "cbse_math8_ch4_quadrilateral_types",
    "cbse_math8_ch4_quadrilateral_properties",
    "cbse_math8_ch4_angle_sum_property",
    "cbse_math8_ch4_parallelogram_theorems",
  ],
  // Ch5 — Number Patterns
  [
    "cbse_math8_ch5_number_patterns",
    "cbse_math8_ch5_primes_and_composites",
    "cbse_math8_ch5_divisibility_rules",
    "cbse_math8_ch5_number_puzzles",
  ],
  // Ch6 — Algebra
  [
    "cbse_math8_ch6_like_and_unlike_terms",
    "cbse_math8_ch6_distributive_law",
    "cbse_math8_ch6_factorisation",
    "cbse_math8_ch6_algebraic_simplification",
  ],
  // Ch7 — Ratio and Proportion
  [
    "cbse_math8_ch7_ratios",
    "cbse_math8_ch7_proportions",
    "cbse_math8_ch7_unitary_method",
    "cbse_math8_ch7_percentages",
  ],
  // Ch8 — Fractions
  [
    "cbse_math8_ch8_complex_fractions",
    "cbse_math8_ch8_ratios_as_fractions",
    "cbse_math8_ch8_dividing_fractions",
    "cbse_math8_ch8_fraction_word_problems",
  ],
  // Ch9 — Pythagoras
  [
    "cbse_math8_ch9_right_triangles",
    "cbse_math8_ch9_pythagoras_theorem",
    "cbse_math8_ch9_applying_pythagoras",
    "cbse_math8_ch9_distance_on_grid",
  ],
  // Ch10 — Proportions and Variation
  [
    "cbse_math8_ch10_solving_proportions",
    "cbse_math8_ch10_scale_drawings",
    "cbse_math8_ch10_similar_figures",
    "cbse_math8_ch10_direct_inverse_variation",
  ],
  // Ch11 — Polygons and Symmetry
  [
    "cbse_math8_ch11_interior_angles_polygon",
    "cbse_math8_ch11_classifying_polygons",
    "cbse_math8_ch11_types_of_symmetry",
    "cbse_math8_ch11_geometric_transformations",
  ],
  // Ch12 — Graphs and Data
  [
    "cbse_math8_ch12_graphs_and_networks",
    "cbse_math8_ch12_paths_in_graphs",
    "cbse_math8_ch12_euler_paths",
    "cbse_math8_ch12_trees_in_graphs",
  ],
  // Ch13 — Linear Equations and Identities
  [
    "cbse_math8_ch13_algebraic_expressions",
    "cbse_math8_ch13_linear_equations",
    "cbse_math8_ch13_linear_inequalities",
    "cbse_math8_ch13_algebraic_identities",
  ],
  // Ch14 — Mensuration
  [
    "cbse_math8_ch14_area_of_rectangle",
    "cbse_math8_ch14_area_of_triangle",
    "cbse_math8_ch14_area_of_trapezium",
    "cbse_math8_ch14_area_of_circle",
  ],
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const docs = await NcertTopicContent.find(
    { topicId: /^cbse_math8_/ },
    { topicId: 1, name: 1 }
  ).lean();
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
        {
          $set: {
            topicId,
            name,
            subject:       "Mathematics",
            grade:         "8",
            level:         idx,
            prerequisites: idx > 0 ? [chapter[idx - 1]] : [],
          },
        },
        { upsert: true }
      );
      upserts++;
      console.log(
        `✓ ${topicId}  (level ${idx}, prereq: ${idx > 0 ? chapter[idx - 1] : "none"})`
      );
    }
  }

  console.log(
    `\nCBSE Math 8 TopicDAG: ${upserts} nodes upserted${missing ? `, ${missing} missing` : ""}.`
  );
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
