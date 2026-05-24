/**
 * ICSE Class 9 Mathematics — Topic DAG (prerequisite graph)
 *
 * Creates / updates one Topic node per standardised sub-topic (icse_math9_*),
 * with a linear prerequisite chain WITHIN each chapter (t0 → t1 → t2 → t3).
 * Chapters are independent — each chapter's first topic has no prerequisites —
 * so the planner can schedule chapters in parallel or sequence as it sees fit.
 *
 * Topic `name` is read from the `topics` collection (NOT NcertTopicContent,
 * which has no `name` field for ICSE content). All 112 topics are given
 * human-readable labels via NAME_OVERRIDES below.
 *
 * Safe to re-run — all writes are upserts keyed on `topicId`.
 *
 * Usage: node config/seedIcseMath9TopicDAG.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Topic } from "../models/index.js";

// ─── Human-readable name overrides ────────────────────────────────────────────
const NAME_OVERRIDES = {
  // Ch 1 — Rational and Irrational Numbers
  icse_math9_ch1_rational_numbers:  "Rational Numbers",
  icse_math9_ch1_irrational_numbers:"Irrational Numbers",
  icse_math9_ch1_surds_operations:  "Surds and Operations",
  icse_math9_ch1_rationalization:   "Rationalization of Surds",

  // Ch 2 — Compound Interest (without using formula)
  icse_math9_ch2_ci_concept:       "Compound Interest — Concept",
  icse_math9_ch2_ci_yearly:        "Compound Interest Yearly",
  icse_math9_ch2_ci_half_yearly:   "Compound Interest Half-Yearly",
  icse_math9_ch2_ci_problems:      "Compound Interest Problems",

  // Ch 3 — Compound Interest (using formula)
  icse_math9_ch3_ci_formula:             "CI Formula Derivation",
  icse_math9_ch3_ci_formula_applications:"CI Formula Applications",
  icse_math9_ch3_ci_growth_decay:        "Growth and Decay",
  icse_math9_ch3_ci_formula_problems:    "CI Formula Problems",

  // Ch 4 — Expansions (Identities)
  icse_math9_ch4_expansion_basics:       "Expansion Basics",
  icse_math9_ch4_algebraic_identities:   "Algebraic Identities",
  icse_math9_ch4_special_products:       "Special Products",
  icse_math9_ch4_expansion_applications: "Expansion Applications",

  // Ch 5 — Factorisation
  icse_math9_ch5_factoring_basics:      "Factorisation Basics",
  icse_math9_ch5_factoring_identities:  "Factorisation using Identities",
  icse_math9_ch5_factoring_quadratics:  "Factorising Quadratics",
  icse_math9_ch5_factoring_polynomials: "Factorising Polynomials",

  // Ch 6 — Simultaneous (Linear) Equations
  icse_math9_ch6_sle_substitution:  "Simultaneous Equations — Substitution",
  icse_math9_ch6_sle_elimination:   "Simultaneous Equations — Elimination",
  icse_math9_ch6_sle_graphical:     "Simultaneous Equations — Graphical",
  icse_math9_ch6_sle_word_problems: "Simultaneous Equations — Word Problems",

  // Ch 7 — Indices (Exponents)
  icse_math9_ch7_laws_of_indices:   "Laws of Indices",
  icse_math9_ch7_negative_indices:  "Negative Indices",
  icse_math9_ch7_fractional_indices:"Fractional Indices",
  icse_math9_ch7_indices_problems:  "Indices — Problems",

  // Ch 8 — Logarithms
  icse_math9_ch8_log_definition:   "Logarithm — Definition",
  icse_math9_ch8_log_laws:         "Laws of Logarithms",
  icse_math9_ch8_log_equations:    "Logarithmic Equations",
  icse_math9_ch8_log_applications: "Logarithm Applications",

  // Ch 9 — Triangles (Congruency in Triangles)
  icse_math9_ch9_triangle_congruence: "Triangle Congruence",
  icse_math9_ch9_congruence_criteria: "Congruence Criteria (SAS/ASA/SSS/RHS)",
  icse_math9_ch9_triangle_properties: "Triangle Properties",
  icse_math9_ch9_triangle_problems:   "Congruence Problems",

  // Ch 10 — Isosceles Triangle
  icse_math9_ch10_isosceles_properties:"Isosceles Triangle Properties",
  icse_math9_ch10_isosceles_theorems:  "Isosceles Triangle Theorems",
  icse_math9_ch10_equilateral_triangle:"Equilateral Triangle",
  icse_math9_ch10_isosceles_problems:  "Isosceles Triangle Problems",

  // Ch 11 — Inequalities
  icse_math9_ch11_inequality_basics:   "Inequality Basics",
  icse_math9_ch11_triangle_inequalities:"Triangle Inequalities",
  icse_math9_ch11_inequality_theorems: "Inequality Theorems",
  icse_math9_ch11_inequality_problems: "Inequality Problems",

  // Ch 12 — Midpoint and Intercept Theorems
  icse_math9_ch12_midpoint_theorem:  "Mid-Point Theorem",
  icse_math9_ch12_converse_midpoint: "Converse of Mid-Point Theorem",
  icse_math9_ch12_intercept_theorem: "Intercept Theorem",
  icse_math9_ch12_midpoint_problems: "Midpoint and Intercept Problems",

  // Ch 13 — Pythagoras Theorem
  icse_math9_ch13_pythagoras_theorem:      "Pythagoras Theorem",
  icse_math9_ch13_pythagoras_converse:     "Converse of Pythagoras Theorem",
  icse_math9_ch13_pythagoras_applications: "Pythagoras Applications",
  icse_math9_ch13_pythagoras_problems:     "Pythagoras Problems",

  // Ch 14 — Rectilinear Figures (Quadrilaterals)
  icse_math9_ch14_quadrilateral_properties:"Quadrilateral Properties",
  icse_math9_ch14_parallelogram_theorems:  "Parallelogram Theorems",
  icse_math9_ch14_special_quadrilaterals:  "Special Quadrilaterals",
  icse_math9_ch14_rectilinear_problems:    "Rectilinear Figure Problems",

  // Ch 15 — Construction of Polygons
  icse_math9_ch15_basic_constructions:        "Basic Constructions",
  icse_math9_ch15_triangle_construction:      "Triangle Construction",
  icse_math9_ch15_quadrilateral_construction: "Quadrilateral Construction",
  icse_math9_ch15_polygon_construction:       "Polygon Construction",

  // Ch 16 — Area Theorems (Plane Figures)
  icse_math9_ch16_area_parallelogram:     "Area of Parallelogram",
  icse_math9_ch16_area_triangle:         "Area of Triangle",
  icse_math9_ch16_area_theorems_proof:   "Area Theorem Proofs",
  icse_math9_ch16_area_theorem_problems: "Area Theorem Problems",

  // Ch 17 — Circle (Chord Properties)
  icse_math9_ch17_circle_basics:    "Circle Basics",
  icse_math9_ch17_chord_properties: "Chord Properties",
  icse_math9_ch17_arc_properties:   "Arc Properties",
  icse_math9_ch17_circle_problems:  "Circle Problems",

  // Ch 18 — Statistics
  icse_math9_ch18_data_collection:        "Data Collection",
  icse_math9_ch18_frequency_distribution: "Frequency Distribution",
  icse_math9_ch18_graphical_representation:"Graphical Representation",
  icse_math9_ch18_statistics_problems:    "Statistics Problems",

  // Ch 19 — Mean and Median
  icse_math9_ch19_mean_calculation:          "Mean Calculation",
  icse_math9_ch19_median_calculation:        "Median Calculation",
  icse_math9_ch19_mode_calculation:          "Mode Calculation",
  icse_math9_ch19_central_tendency_problems: "Central Tendency Problems",

  // Ch 20 — Area and Perimeter of Plane Figures
  icse_math9_ch20_area_plane_figures:        "Area of Plane Figures",
  icse_math9_ch20_perimeter_plane_figures:   "Perimeter of Plane Figures",
  icse_math9_ch20_circle_area_perimeter:     "Circle Area and Perimeter",
  icse_math9_ch20_area_perimeter_problems:   "Area and Perimeter Problems",

  // Ch 21 — Solids (Surface Area and Volume)
  icse_math9_ch21_cuboid_cylinder:  "Cuboid and Cylinder",
  icse_math9_ch21_cone_pyramid:     "Cone and Pyramid",
  icse_math9_ch21_sphere_hemisphere:"Sphere and Hemisphere",
  icse_math9_ch21_solid_problems:   "Solid Problems",

  // Ch 22 — Trigonometrical Ratios
  icse_math9_ch22_trig_ratios_definition:   "Trigonometric Ratios — Definition",
  icse_math9_ch22_trig_ratios_complementary:"Complementary Angle Ratios",
  icse_math9_ch22_trig_tables_use:          "Using Trigonometric Tables",
  icse_math9_ch22_trig_ratios_problems:     "Trigonometric Ratios Problems",

  // Ch 23 — Trigonometrical Ratios of Standard Angles
  icse_math9_ch23_standard_angles_0_30_45:  "Standard Angles 0°, 30°, 45°",
  icse_math9_ch23_standard_angles_60_90:    "Standard Angles 60°, 90°",
  icse_math9_ch23_trig_standard_identities: "Trig Standard Identities",
  icse_math9_ch23_standard_angles_problems: "Standard Angles Problems",

  // Ch 24 — Solution of Right Triangles
  icse_math9_ch24_right_triangle_solution: "Right Triangle Solution",
  icse_math9_ch24_finding_sides:           "Finding Sides of Right Triangles",
  icse_math9_ch24_finding_angles:          "Finding Angles of Right Triangles",
  icse_math9_ch24_right_triangle_problems: "Right Triangle Problems",

  // Ch 25 — Complementary Angles
  icse_math9_ch25_complementary_trig:          "Complementary Angles in Trig",
  icse_math9_ch25_complementary_identities:    "Complementary Trig Identities",
  icse_math9_ch25_complementary_applications:  "Complementary Angle Applications",
  icse_math9_ch25_complementary_problems:      "Complementary Angle Problems",

  // Ch 26 — Co-ordinate Geometry
  icse_math9_ch26_cartesian_plane:    "Cartesian Plane",
  icse_math9_ch26_plotting_points:    "Plotting Points",
  icse_math9_ch26_distance_midpoint:  "Distance and Midpoint Formula",
  icse_math9_ch26_coordinate_problems:"Coordinate Geometry Problems",

  // Ch 27 — Graphical Solution of Linear Equations
  icse_math9_ch27_linear_graphs:          "Linear Graphs",
  icse_math9_ch27_graphical_equations:    "Graphical Equations",
  icse_math9_ch27_simultaneous_graphical: "Simultaneous Equations Graphically",
  icse_math9_ch27_graphical_problems:     "Graphical Problems",

  // Ch 28 — Distance Formula
  icse_math9_ch28_distance_formula:      "Distance Formula",
  icse_math9_ch28_distance_applications: "Distance Formula Applications",
  icse_math9_ch28_collinearity:          "Collinearity",
  icse_math9_ch28_distance_problems:     "Distance Formula Problems",
};

// ─── Chapter → ordered sub-topic arrays ───────────────────────────────────────
// Order within each chapter = logical study sequence.
// 28 chapters × 4 topics = 112 nodes.
const CHAPTERS = [
  // Ch 1 — Rational and Irrational Numbers
  [
    "icse_math9_ch1_rational_numbers",
    "icse_math9_ch1_irrational_numbers",
    "icse_math9_ch1_surds_operations",
    "icse_math9_ch1_rationalization",
  ],
  // Ch 2 — Compound Interest (without formula)
  [
    "icse_math9_ch2_ci_concept",
    "icse_math9_ch2_ci_yearly",
    "icse_math9_ch2_ci_half_yearly",
    "icse_math9_ch2_ci_problems",
  ],
  // Ch 3 — Compound Interest (using formula)
  [
    "icse_math9_ch3_ci_formula",
    "icse_math9_ch3_ci_formula_applications",
    "icse_math9_ch3_ci_growth_decay",
    "icse_math9_ch3_ci_formula_problems",
  ],
  // Ch 4 — Expansions (Identities)
  [
    "icse_math9_ch4_expansion_basics",
    "icse_math9_ch4_algebraic_identities",
    "icse_math9_ch4_special_products",
    "icse_math9_ch4_expansion_applications",
  ],
  // Ch 5 — Factorisation
  [
    "icse_math9_ch5_factoring_basics",
    "icse_math9_ch5_factoring_identities",
    "icse_math9_ch5_factoring_quadratics",
    "icse_math9_ch5_factoring_polynomials",
  ],
  // Ch 6 — Simultaneous Equations
  [
    "icse_math9_ch6_sle_substitution",
    "icse_math9_ch6_sle_elimination",
    "icse_math9_ch6_sle_graphical",
    "icse_math9_ch6_sle_word_problems",
  ],
  // Ch 7 — Indices (Exponents)
  [
    "icse_math9_ch7_laws_of_indices",
    "icse_math9_ch7_negative_indices",
    "icse_math9_ch7_fractional_indices",
    "icse_math9_ch7_indices_problems",
  ],
  // Ch 8 — Logarithms
  [
    "icse_math9_ch8_log_definition",
    "icse_math9_ch8_log_laws",
    "icse_math9_ch8_log_equations",
    "icse_math9_ch8_log_applications",
  ],
  // Ch 9 — Triangles (Congruency)
  [
    "icse_math9_ch9_triangle_congruence",
    "icse_math9_ch9_congruence_criteria",
    "icse_math9_ch9_triangle_properties",
    "icse_math9_ch9_triangle_problems",
  ],
  // Ch 10 — Isosceles Triangle
  [
    "icse_math9_ch10_isosceles_properties",
    "icse_math9_ch10_isosceles_theorems",
    "icse_math9_ch10_equilateral_triangle",
    "icse_math9_ch10_isosceles_problems",
  ],
  // Ch 11 — Inequalities
  [
    "icse_math9_ch11_inequality_basics",
    "icse_math9_ch11_triangle_inequalities",
    "icse_math9_ch11_inequality_theorems",
    "icse_math9_ch11_inequality_problems",
  ],
  // Ch 12 — Midpoint and Intercept Theorems
  [
    "icse_math9_ch12_midpoint_theorem",
    "icse_math9_ch12_converse_midpoint",
    "icse_math9_ch12_intercept_theorem",
    "icse_math9_ch12_midpoint_problems",
  ],
  // Ch 13 — Pythagoras Theorem
  [
    "icse_math9_ch13_pythagoras_theorem",
    "icse_math9_ch13_pythagoras_converse",
    "icse_math9_ch13_pythagoras_applications",
    "icse_math9_ch13_pythagoras_problems",
  ],
  // Ch 14 — Rectilinear Figures (Quadrilaterals)
  [
    "icse_math9_ch14_quadrilateral_properties",
    "icse_math9_ch14_parallelogram_theorems",
    "icse_math9_ch14_special_quadrilaterals",
    "icse_math9_ch14_rectilinear_problems",
  ],
  // Ch 15 — Construction of Polygons
  [
    "icse_math9_ch15_basic_constructions",
    "icse_math9_ch15_triangle_construction",
    "icse_math9_ch15_quadrilateral_construction",
    "icse_math9_ch15_polygon_construction",
  ],
  // Ch 16 — Area Theorems
  [
    "icse_math9_ch16_area_parallelogram",
    "icse_math9_ch16_area_triangle",
    "icse_math9_ch16_area_theorems_proof",
    "icse_math9_ch16_area_theorem_problems",
  ],
  // Ch 17 — Circle (Chord Properties)
  [
    "icse_math9_ch17_circle_basics",
    "icse_math9_ch17_chord_properties",
    "icse_math9_ch17_arc_properties",
    "icse_math9_ch17_circle_problems",
  ],
  // Ch 18 — Statistics
  [
    "icse_math9_ch18_data_collection",
    "icse_math9_ch18_frequency_distribution",
    "icse_math9_ch18_graphical_representation",
    "icse_math9_ch18_statistics_problems",
  ],
  // Ch 19 — Mean and Median
  [
    "icse_math9_ch19_mean_calculation",
    "icse_math9_ch19_median_calculation",
    "icse_math9_ch19_mode_calculation",
    "icse_math9_ch19_central_tendency_problems",
  ],
  // Ch 20 — Area and Perimeter of Plane Figures
  [
    "icse_math9_ch20_area_plane_figures",
    "icse_math9_ch20_perimeter_plane_figures",
    "icse_math9_ch20_circle_area_perimeter",
    "icse_math9_ch20_area_perimeter_problems",
  ],
  // Ch 21 — Solids (Surface Area and Volume)
  [
    "icse_math9_ch21_cuboid_cylinder",
    "icse_math9_ch21_cone_pyramid",
    "icse_math9_ch21_sphere_hemisphere",
    "icse_math9_ch21_solid_problems",
  ],
  // Ch 22 — Trigonometrical Ratios
  [
    "icse_math9_ch22_trig_ratios_definition",
    "icse_math9_ch22_trig_ratios_complementary",
    "icse_math9_ch22_trig_tables_use",
    "icse_math9_ch22_trig_ratios_problems",
  ],
  // Ch 23 — Trigonometrical Ratios of Standard Angles
  [
    "icse_math9_ch23_standard_angles_0_30_45",
    "icse_math9_ch23_standard_angles_60_90",
    "icse_math9_ch23_trig_standard_identities",
    "icse_math9_ch23_standard_angles_problems",
  ],
  // Ch 24 — Solution of Right Triangles
  [
    "icse_math9_ch24_right_triangle_solution",
    "icse_math9_ch24_finding_sides",
    "icse_math9_ch24_finding_angles",
    "icse_math9_ch24_right_triangle_problems",
  ],
  // Ch 25 — Complementary Angles
  [
    "icse_math9_ch25_complementary_trig",
    "icse_math9_ch25_complementary_identities",
    "icse_math9_ch25_complementary_applications",
    "icse_math9_ch25_complementary_problems",
  ],
  // Ch 26 — Co-ordinate Geometry
  [
    "icse_math9_ch26_cartesian_plane",
    "icse_math9_ch26_plotting_points",
    "icse_math9_ch26_distance_midpoint",
    "icse_math9_ch26_coordinate_problems",
  ],
  // Ch 27 — Graphical Solution of Linear Equations
  [
    "icse_math9_ch27_linear_graphs",
    "icse_math9_ch27_graphical_equations",
    "icse_math9_ch27_simultaneous_graphical",
    "icse_math9_ch27_graphical_problems",
  ],
  // Ch 28 — Distance Formula
  [
    "icse_math9_ch28_distance_formula",
    "icse_math9_ch28_distance_applications",
    "icse_math9_ch28_collinearity",
    "icse_math9_ch28_distance_problems",
  ],
];

// ─── Cross-chapter prerequisite edges ─────────────────────────────────────────
// Key insight links between chapters (topic A must be mastered before topic B).
// Format: [prerequisiteTopicId, dependentTopicId]
const CROSS_CHAPTER_EDGES = [
  // Number systems flow
  ["icse_math9_ch1_rationalization",       "icse_math9_ch7_fractional_indices"],   // surds → fractional indices
  ["icse_math9_ch1_rationalization",       "icse_math9_ch8_log_definition"],        // number sense → logs
  // Compound interest: ch2 is manual, ch3 uses formula
  ["icse_math9_ch2_ci_problems",           "icse_math9_ch3_ci_formula"],            // manual CI → formula
  // Algebra chain
  ["icse_math9_ch4_expansion_applications","icse_math9_ch5_factoring_identities"],  // expansions → factorisation
  ["icse_math9_ch5_factoring_quadratics",  "icse_math9_ch6_sle_substitution"],      // factorisation → simultaneous
  ["icse_math9_ch7_indices_problems",      "icse_math9_ch8_log_laws"],              // indices → log laws
  // Algebra → graphical
  ["icse_math9_ch6_sle_graphical",         "icse_math9_ch27_linear_graphs"],        // simultaneous graphical
  // Geometry chain
  ["icse_math9_ch9_triangle_properties",   "icse_math9_ch10_isosceles_properties"], // congruence → isosceles
  ["icse_math9_ch9_triangle_properties",   "icse_math9_ch11_inequality_basics"],    // triangle → inequalities
  ["icse_math9_ch9_triangle_problems",     "icse_math9_ch12_midpoint_theorem"],     // triangles → midpoint
  ["icse_math9_ch12_midpoint_theorem",     "icse_math9_ch13_pythagoras_theorem"],   // midpoint → Pythagoras
  ["icse_math9_ch9_congruence_criteria",   "icse_math9_ch14_parallelogram_theorems"],// congruence → parallelograms
  ["icse_math9_ch14_rectilinear_problems", "icse_math9_ch15_triangle_construction"],// quads → constructions
  ["icse_math9_ch16_area_parallelogram",   "icse_math9_ch20_area_plane_figures"],   // area theorems → area/perimeter
  ["icse_math9_ch17_circle_basics",        "icse_math9_ch20_circle_area_perimeter"],// circle → circle area
  ["icse_math9_ch20_area_perimeter_problems","icse_math9_ch21_cuboid_cylinder"],    // 2D area → 3D solids
  // Trig chain: Pythagoras → trig ratios → standard angles → right triangle solution → complementary
  ["icse_math9_ch13_pythagoras_theorem",   "icse_math9_ch22_trig_ratios_definition"],
  ["icse_math9_ch22_trig_ratios_problems", "icse_math9_ch23_standard_angles_0_30_45"],
  ["icse_math9_ch23_standard_angles_problems","icse_math9_ch24_right_triangle_solution"],
  ["icse_math9_ch24_right_triangle_problems","icse_math9_ch25_complementary_trig"],
  // Coordinate geometry chain
  ["icse_math9_ch26_distance_midpoint",    "icse_math9_ch28_distance_formula"],     // ch26 midpoint → ch28 distance
  ["icse_math9_ch27_simultaneous_graphical","icse_math9_ch28_collinearity"],        // graphs → collinearity
  // Statistics chain
  ["icse_math9_ch18_statistics_problems",  "icse_math9_ch19_mean_calculation"],     // data → mean/median
];

// ─── Runner ────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  let created = 0;
  let updated = 0;

  // Build all nodes first (upsert each topic)
  for (let chIdx = 0; chIdx < CHAPTERS.length; chIdx++) {
    const chapter = CHAPTERS[chIdx];
    const chapterNumber = chIdx + 1;

    for (let topicIdx = 0; topicIdx < chapter.length; topicIdx++) {
      const topicId = chapter[topicIdx];
      const name = NAME_OVERRIDES[topicId] || topicId;

      // Within-chapter prerequisites: every topic after the first depends on the previous
      const prerequisites = topicIdx > 0 ? [chapter[topicIdx - 1]] : [];

      const doc = {
        topicId,
        name,
        subject:     "Mathematics",
        grade:       "9",
        examBoard:   "ICSE",
        chapterNumber,
        prerequisites,
        difficulty:  topicIdx < 2 ? "easy" : topicIdx < 3 ? "medium" : "hard",
        estimatedMinutes: 45,
        tags: ["icse", "math", "class9", `ch${chapterNumber}`],
      };

      const existing = await Topic.findOne({ topicId });
      if (existing) {
        await Topic.findOneAndUpdate({ topicId }, { $set: doc }, { new: true });
        updated++;
      } else {
        await Topic.create(doc);
        created++;
      }
    }
  }

  console.log(`Nodes — created: ${created}, updated: ${updated}`);

  // Add cross-chapter prerequisite edges
  let edgesAdded = 0;
  for (const [prereqId, dependentId] of CROSS_CHAPTER_EDGES) {
    const dependent = await Topic.findOne({ topicId: dependentId });
    if (!dependent) {
      console.warn(`  WARN: dependent topic not found: ${dependentId}`);
      continue;
    }
    if (!dependent.prerequisites.includes(prereqId)) {
      await Topic.findOneAndUpdate(
        { topicId: dependentId },
        { $addToSet: { prerequisites: prereqId } },
        { new: true }
      );
      edgesAdded++;
    }
  }

  console.log(`Cross-chapter edges added: ${edgesAdded}`);
  console.log(`Total nodes: ${CHAPTERS.flat().length}`);
  console.log("ICSE Math 9 Topic DAG seeded successfully.");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
