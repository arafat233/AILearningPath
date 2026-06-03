import "dotenv/config";
import mongoose from "mongoose";
import { Topic } from "../models/index.js";

const BOARD = "AP_SSC";
const GRADE = "8";
const SUBJECT = "Mathematics";

/**
 * AP SSC Math 8 — Topic DAG
 * 56 topics across 16 chapters.
 * Topic-level granularity (1 node per sub-topic), per the project Topic DAG standard.
 * Prerequisites form a linear chain within each chapter + sensible cross-chapter edges.
 * topicId format: ap_ssc_math8_ch{N}_{slug}
 */
const t = (topicId, name, chapterName, chapterNumber, prerequisites, description, estimatedMinutes, difficulty, bloomLevels) =>
  ({ topicId, name, chapterName, chapterNumber, examBoard: BOARD, grade: GRADE, subject: SUBJECT,
     prerequisites, description, estimatedMinutes, difficulty, bloomLevels });

const topics = [
  // ─── Chapter 1 — Rational Numbers ─────────────────────────────────────────
  t("ap_ssc_math8_ch1_properties_of_operations", "Properties of Operations", "Rational Numbers", 1,
    [], "Closure, commutativity, associativity and distributivity of operations on rational numbers.", 40, "easy", ["remember", "understand", "apply"]),
  t("ap_ssc_math8_ch1_identity_and_inverse", "Identity and Inverse", "Rational Numbers", 1,
    ["ap_ssc_math8_ch1_properties_of_operations"], "Additive identity 0, multiplicative identity 1, additive and multiplicative inverses.", 35, "easy", ["understand", "apply"]),
  t("ap_ssc_math8_ch1_on_number_line", "Rational Numbers on the Number Line", "Rational Numbers", 1,
    ["ap_ssc_math8_ch1_identity_and_inverse"], "Representing rational numbers on a number line.", 30, "easy", ["understand", "apply"]),
  t("ap_ssc_math8_ch1_between_two_rationals", "Rationals Between Two Rationals", "Rational Numbers", 1,
    ["ap_ssc_math8_ch1_on_number_line"], "Finding rational numbers between any two given rationals (mean method, equivalent fractions).", 35, "medium", ["apply", "analyse"]),

  // ─── Chapter 2 — Linear Equations in One Variable ─────────────────────────
  t("ap_ssc_math8_ch2_solving_simple", "Solving Simple Equations", "Linear Equations in One Variable", 2,
    ["ap_ssc_math8_ch1_properties_of_operations"], "Solving linear equations by transposition and balancing.", 35, "easy", ["understand", "apply"]),
  t("ap_ssc_math8_ch2_variable_both_sides", "Variables on Both Sides", "Linear Equations in One Variable", 2,
    ["ap_ssc_math8_ch2_solving_simple"], "Equations with variable terms on both sides; identities and contradictions.", 40, "medium", ["apply", "analyse"]),
  t("ap_ssc_math8_ch2_reducing_to_linear", "Reducible to Linear Form", "Linear Equations in One Variable", 2,
    ["ap_ssc_math8_ch2_variable_both_sides"], "Clearing fractions by LCM, cross-multiplication, removing brackets.", 45, "medium", ["apply"]),
  t("ap_ssc_math8_ch2_word_problems", "Word Problems", "Linear Equations in One Variable", 2,
    ["ap_ssc_math8_ch2_reducing_to_linear"], "Forming and solving linear equations from word problems.", 45, "medium", ["apply", "analyse"]),

  // ─── Chapter 3 — Understanding Quadrilaterals ─────────────────────────────
  t("ap_ssc_math8_ch3_polygons_classification", "Polygons and Classification", "Understanding Quadrilaterals", 3,
    [], "Polygons, convex/concave, regular polygons, diagonals.", 35, "easy", ["remember", "understand"]),
  t("ap_ssc_math8_ch3_angle_sum_property", "Angle Sum Property", "Understanding Quadrilaterals", 3,
    ["ap_ssc_math8_ch3_polygons_classification"], "Interior and exterior angle sums of polygons; regular-polygon angles.", 40, "medium", ["apply", "analyse"]),
  t("ap_ssc_math8_ch3_kinds_of_quadrilaterals", "Kinds of Quadrilaterals", "Understanding Quadrilaterals", 3,
    ["ap_ssc_math8_ch3_angle_sum_property"], "Trapezium, parallelogram, rhombus, rectangle, square, kite — the hierarchy.", 40, "medium", ["understand", "analyse"]),
  t("ap_ssc_math8_ch3_parallelogram_properties", "Parallelogram Properties", "Understanding Quadrilaterals", 3,
    ["ap_ssc_math8_ch3_kinds_of_quadrilaterals"], "Sides, angles and diagonals of parallelograms and special quadrilaterals.", 45, "medium", ["apply", "analyse"]),

  // ─── Chapter 4 — Practical Geometry ───────────────────────────────────────
  t("ap_ssc_math8_ch4_five_measurements", "Five Measurements", "Practical Geometry", 4,
    ["ap_ssc_math8_ch3_parallelogram_properties"], "Why a unique quadrilateral needs five independent measurements.", 35, "easy", ["remember", "understand"]),
  t("ap_ssc_math8_ch4_construct_quadrilaterals", "Constructing Quadrilaterals", "Practical Geometry", 4,
    ["ap_ssc_math8_ch4_five_measurements"], "Construction from sides, diagonals and angles using compass and protractor.", 45, "medium", ["apply"]),
  t("ap_ssc_math8_ch4_special_quadrilaterals", "Special Quadrilaterals", "Practical Geometry", 4,
    ["ap_ssc_math8_ch4_construct_quadrilaterals"], "Constructing squares, rectangles, rhombuses and parallelograms from minimal data.", 40, "medium", ["apply", "analyse"]),

  // ─── Chapter 5 — Data Handling ────────────────────────────────────────────
  t("ap_ssc_math8_ch5_grouped_data", "Grouped Data", "Data Handling", 5,
    [], "Class intervals, class marks, class size, exclusive method, frequency.", 40, "easy", ["understand", "apply"]),
  t("ap_ssc_math8_ch5_histograms", "Histograms", "Data Handling", 5,
    ["ap_ssc_math8_ch5_grouped_data"], "Histograms for continuous data; difference from bar graphs; modal class.", 40, "medium", ["understand", "analyse"]),
  t("ap_ssc_math8_ch5_pie_charts", "Pie Charts", "Data Handling", 5,
    ["ap_ssc_math8_ch5_histograms"], "Representing parts of a whole; computing sector angles (1% = 3.6°).", 40, "medium", ["apply"]),
  t("ap_ssc_math8_ch5_probability", "Probability", "Data Handling", 5,
    ["ap_ssc_math8_ch5_pie_charts"], "Equally likely outcomes, probability of events, complement, range 0–1.", 40, "medium", ["understand", "apply"]),

  // ─── Chapter 6 — Squares and Square Roots ─────────────────────────────────
  t("ap_ssc_math8_ch6_properties_of_squares", "Properties of Squares", "Squares and Square Roots", 6,
    ["ap_ssc_math8_ch1_properties_of_operations"], "Patterns in square numbers, ending digits, sum of odd numbers, trailing zeros.", 40, "easy", ["remember", "understand", "analyse"]),
  t("ap_ssc_math8_ch6_finding_squares", "Finding Squares", "Squares and Square Roots", 6,
    ["ap_ssc_math8_ch6_properties_of_squares"], "Squaring using identities and shortcuts (numbers ending in 5, (a+b)²).", 40, "medium", ["apply"]),
  t("ap_ssc_math8_ch6_roots_by_factorisation", "Square Roots by Factorisation", "Squares and Square Roots", 6,
    ["ap_ssc_math8_ch6_finding_squares"], "Prime factorisation method; smallest multiplier/divisor to make a perfect square.", 45, "medium", ["apply", "analyse"]),
  t("ap_ssc_math8_ch6_roots_by_division", "Square Roots by Long Division", "Squares and Square Roots", 6,
    ["ap_ssc_math8_ch6_roots_by_factorisation"], "Long-division method for square roots, including decimals and estimation.", 45, "medium", ["apply"]),

  // ─── Chapter 7 — Cubes and Cube Roots ─────────────────────────────────────
  t("ap_ssc_math8_ch7_cubes", "Cubes", "Cubes and Cube Roots", 7,
    ["ap_ssc_math8_ch6_roots_by_division"], "Cubes of numbers, perfect cubes, prime-factor patterns (multiples of 3).", 35, "easy", ["remember", "apply", "analyse"]),
  t("ap_ssc_math8_ch7_cube_roots", "Cube Roots", "Cubes and Cube Roots", 7,
    ["ap_ssc_math8_ch7_cubes"], "Cube roots by prime factorisation; units-digit shortcut; negative cube roots.", 40, "medium", ["apply", "analyse"]),

  // ─── Chapter 8 — Comparing Quantities ─────────────────────────────────────
  t("ap_ssc_math8_ch8_ratios_percentages", "Ratios and Percentages", "Comparing Quantities", 8,
    ["ap_ssc_math8_ch1_between_two_rationals"], "Ratios, converting between ratios/fractions/percentages, percentage change.", 40, "easy", ["understand", "apply"]),
  t("ap_ssc_math8_ch8_profit_loss_discount", "Profit, Loss and Discount", "Comparing Quantities", 8,
    ["ap_ssc_math8_ch8_ratios_percentages"], "Cost/selling/marked price, profit% and loss% on CP, discount on MP.", 45, "medium", ["apply", "analyse"]),
  t("ap_ssc_math8_ch8_sales_tax_gst", "Sales Tax / GST", "Comparing Quantities", 8,
    ["ap_ssc_math8_ch8_profit_loss_discount"], "Adding GST/sales tax to a bill; backing out the base price.", 40, "medium", ["apply"]),
  t("ap_ssc_math8_ch8_compound_interest", "Compound Interest", "Comparing Quantities", 8,
    ["ap_ssc_math8_ch8_sales_tax_gst"], "Compound interest formula, CI vs SI, half-yearly compounding.", 50, "medium", ["apply", "analyse"]),

  // ─── Chapter 9 — Algebraic Expressions and Identities ─────────────────────
  t("ap_ssc_math8_ch9_terms_and_types", "Terms and Types", "Algebraic Expressions and Identities", 9,
    ["ap_ssc_math8_ch2_word_problems"], "Monomials/binomials/trinomials, like terms, coefficients, degree.", 35, "easy", ["remember", "understand"]),
  t("ap_ssc_math8_ch9_addition_subtraction", "Addition and Subtraction", "Algebraic Expressions and Identities", 9,
    ["ap_ssc_math8_ch9_terms_and_types"], "Adding and subtracting algebraic expressions by combining like terms.", 35, "easy", ["apply"]),
  t("ap_ssc_math8_ch9_multiplication", "Multiplication", "Algebraic Expressions and Identities", 9,
    ["ap_ssc_math8_ch9_addition_subtraction"], "Multiplying monomials and polynomials using the distributive law.", 45, "medium", ["apply", "analyse"]),
  t("ap_ssc_math8_ch9_identities", "Algebraic Identities", "Algebraic Expressions and Identities", 9,
    ["ap_ssc_math8_ch9_multiplication"], "Standard identities (a±b)², (a+b)(a−b), (x+a)(x+b) and applications.", 50, "medium", ["apply", "evaluate"]),

  // ─── Chapter 10 — Visualising Solid Shapes ────────────────────────────────
  t("ap_ssc_math8_ch10_views_and_nets", "Views and Nets", "Visualising Solid Shapes", 10,
    [], "Top/front/side views; nets that fold into solids.", 35, "easy", ["understand", "apply"]),
  t("ap_ssc_math8_ch10_prisms_pyramids", "Prisms and Pyramids", "Visualising Solid Shapes", 10,
    ["ap_ssc_math8_ch10_views_and_nets"], "Faces, edges and vertices of prisms and pyramids.", 40, "medium", ["understand", "apply"]),
  t("ap_ssc_math8_ch10_polyhedra_euler", "Polyhedra and Euler's Formula", "Visualising Solid Shapes", 10,
    ["ap_ssc_math8_ch10_prisms_pyramids"], "Polyhedra, Euler's formula F + V − E = 2 and its applications.", 40, "medium", ["apply", "analyse"]),

  // ─── Chapter 11 — Mensuration ─────────────────────────────────────────────
  t("ap_ssc_math8_ch11_area_trapezium_polygon", "Area of Trapezium and Polygons", "Mensuration", 11,
    ["ap_ssc_math8_ch10_polyhedra_euler"], "Area of trapezium, rhombus, general quadrilateral and irregular polygons.", 45, "medium", ["apply"]),
  t("ap_ssc_math8_ch11_surface_area_cuboid_cube", "Surface Area — Cuboid and Cube", "Mensuration", 11,
    ["ap_ssc_math8_ch11_area_trapezium_polygon"], "Total and lateral surface area of cuboids and cubes.", 45, "medium", ["apply"]),
  t("ap_ssc_math8_ch11_surface_area_cylinder", "Surface Area — Cylinder", "Mensuration", 11,
    ["ap_ssc_math8_ch11_surface_area_cuboid_cube"], "Curved and total surface area of a cylinder; the unrolled rectangle.", 45, "medium", ["apply", "analyse"]),
  t("ap_ssc_math8_ch11_volume", "Volume", "Mensuration", 11,
    ["ap_ssc_math8_ch11_surface_area_cylinder"], "Volume of cuboid, cube and cylinder; capacity and unit conversions.", 45, "medium", ["apply"]),

  // ─── Chapter 12 — Exponents and Powers ────────────────────────────────────
  t("ap_ssc_math8_ch12_laws_of_exponents", "Laws of Exponents", "Exponents and Powers", 12,
    ["ap_ssc_math8_ch6_finding_squares"], "Product, quotient and power laws; zero exponent.", 40, "easy", ["understand", "apply"]),
  t("ap_ssc_math8_ch12_negative_exponents", "Negative Exponents", "Exponents and Powers", 12,
    ["ap_ssc_math8_ch12_laws_of_exponents"], "Meaning of negative exponents as reciprocals; combining with the laws.", 40, "medium", ["apply"]),
  t("ap_ssc_math8_ch12_standard_form", "Standard Form", "Exponents and Powers", 12,
    ["ap_ssc_math8_ch12_negative_exponents"], "Writing very large and very small numbers in standard (scientific) form.", 35, "medium", ["apply"]),

  // ─── Chapter 13 — Direct and Inverse Proportions ──────────────────────────
  t("ap_ssc_math8_ch13_direct_proportion", "Direct Proportion", "Direct and Inverse Proportions", 13,
    ["ap_ssc_math8_ch8_ratios_percentages"], "Direct proportion, constant ratio, unitary method, graph through the origin.", 40, "easy", ["understand", "apply"]),
  t("ap_ssc_math8_ch13_inverse_proportion", "Inverse Proportion", "Direct and Inverse Proportions", 13,
    ["ap_ssc_math8_ch13_direct_proportion"], "Inverse proportion, constant product, workers-and-time problems.", 40, "medium", ["understand", "apply"]),
  t("ap_ssc_math8_ch13_proportion_word_problems", "Proportion Word Problems", "Direct and Inverse Proportions", 13,
    ["ap_ssc_math8_ch13_inverse_proportion"], "Deciding direct vs inverse and solving real-life proportion problems.", 45, "medium", ["apply", "analyse"]),

  // ─── Chapter 14 — Factorisation ───────────────────────────────────────────
  t("ap_ssc_math8_ch14_common_factors", "Common Factors", "Factorisation", 14,
    ["ap_ssc_math8_ch9_identities"], "Taking out the greatest common factor of an expression.", 35, "easy", ["understand", "apply"]),
  t("ap_ssc_math8_ch14_regrouping", "Factorisation by Regrouping", "Factorisation", 14,
    ["ap_ssc_math8_ch14_common_factors"], "Grouping terms to reveal a common binomial factor.", 40, "medium", ["apply", "analyse"]),
  t("ap_ssc_math8_ch14_using_identities", "Factorisation Using Identities", "Factorisation", 14,
    ["ap_ssc_math8_ch14_regrouping"], "Difference of squares, perfect-square trinomials, mid-term splitting.", 45, "medium", ["apply"]),
  t("ap_ssc_math8_ch14_division", "Division of Algebraic Expressions", "Factorisation", 14,
    ["ap_ssc_math8_ch14_using_identities"], "Dividing monomials and polynomials; factorise-and-cancel.", 40, "medium", ["apply"]),

  // ─── Chapter 15 — Introduction to Graphs ──────────────────────────────────
  t("ap_ssc_math8_ch15_coordinate_plane", "The Coordinate Plane", "Introduction to Graphs", 15,
    ["ap_ssc_math8_ch5_grouped_data"], "Axes, origin, abscissa/ordinate, plotting points.", 35, "easy", ["remember", "understand", "apply"]),
  t("ap_ssc_math8_ch15_linear_graphs", "Linear Graphs", "Introduction to Graphs", 15,
    ["ap_ssc_math8_ch15_coordinate_plane"], "Graphs of linear equations; horizontal/vertical lines; reading values.", 40, "medium", ["apply", "analyse"]),
  t("ap_ssc_math8_ch15_types_of_graphs", "Types of Graphs", "Introduction to Graphs", 15,
    ["ap_ssc_math8_ch15_linear_graphs"], "Choosing between bar graphs, histograms, pie charts and line graphs.", 35, "easy", ["understand", "analyse"]),

  // ─── Chapter 16 — Playing with Numbers ────────────────────────────────────
  t("ap_ssc_math8_ch16_general_form", "General Form of Numbers", "Playing with Numbers", 16,
    ["ap_ssc_math8_ch2_solving_simple"], "Writing numbers as 10a + b etc.; properties of a number and its reverse.", 40, "medium", ["understand", "analyse"]),
  t("ap_ssc_math8_ch16_divisibility_tests", "Divisibility Tests", "Playing with Numbers", 16,
    ["ap_ssc_math8_ch16_general_form"], "Tests for 2, 3, 5, 9, 10 and why the digit-sum tests work.", 40, "medium", ["apply", "understand"]),
  t("ap_ssc_math8_ch16_letters_for_digits", "Letters for Digits", "Playing with Numbers", 16,
    ["ap_ssc_math8_ch16_divisibility_tests"], "Cryptarithms — solving puzzles where letters stand for distinct digits.", 45, "hard", ["apply", "analyse"]),
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Seeding AP SSC Math 8 — Topic DAG (${topics.length} topics)…`);

  let upserted = 0;
  let skipped = 0;

  for (const top of topics) {
    try {
      await Topic.findOneAndUpdate({ topicId: top.topicId }, { $set: top }, { upsert: true, new: true });
      console.log(`  ✓ ${top.topicId}`);
      upserted++;
    } catch (err) {
      if (err.code === 11000) {
        console.log(`  — skip ${top.topicId}`);
        skipped++;
      } else {
        throw err;
      }
    }
  }

  console.log(`\nDone. Upserted: ${upserted}  Skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
