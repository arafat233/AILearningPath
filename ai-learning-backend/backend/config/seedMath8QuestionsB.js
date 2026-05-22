/**
 * CBSE Class 8 Mathematics — MCQ Questions Part B (Chapters 8–14)
 * 5 questions per chapter × 7 chapters = 35 questions.
 * Safe to re-run (upserts on questionText + subject).
 * Usage: node config/seedMath8QuestionsB.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";

dotenv.config();

const questions = [
  // ── Chapter 8: Fractions in Disguise ───────────────────────────────────────
  {
    questionId: "math8_ch8_q1",
    topic: "math8_ch8", topicId: "math8_ch8",
    subtopic: "Percentages",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "What is 15% of 360?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "54", type: "correct", logicTag: "" },
      { text: "45", type: "calculation_error", logicTag: "used_10_percent_plus_half" },
      { text: "540", type: "calculation_error", logicTag: "forgot_to_divide_by_100" },
      { text: "36", type: "calculation_error", logicTag: "swapped_numbers" },
    ],
    solutionSteps: [
      "15% of 360 = (15/100) × 360 = 15 × 3.6 = 54.",
    ],
    shortcut: "10% of 360=36; 5% of 360=18. 15% = 36+18 = 54.",
  },
  {
    questionId: "math8_ch8_q2",
    topic: "math8_ch8", topicId: "math8_ch8",
    subtopic: "Profit and Loss",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A shirt costs ₹500 and is sold for ₹575. Find the profit percentage.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "15%", type: "correct", logicTag: "" },
      { text: "13%", type: "calculation_error", logicTag: "divided_by_SP_not_CP" },
      { text: "75%", type: "concept_error", logicTag: "profit_not_percentage" },
      { text: "10%", type: "calculation_error", logicTag: "arithmetic_error" },
    ],
    solutionSteps: [
      "Profit = SP − CP = 575 − 500 = ₹75.",
      "Profit % = (Profit/CP) × 100 = (75/500) × 100 = 15%.",
    ],
    shortcut: "Profit % = (75/500)×100 = 15%. Always divide by CP.",
  },
  {
    questionId: "math8_ch8_q3",
    topic: "math8_ch8", topicId: "math8_ch8",
    subtopic: "Discount",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A TV is marked at ₹25000 and sold at 20% discount. Find the selling price.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "₹20000", type: "correct", logicTag: "" },
      { text: "₹21000", type: "calculation_error", logicTag: "wrong_discount_percent" },
      { text: "₹5000", type: "concept_error", logicTag: "gave_discount_not_SP" },
      { text: "₹22500", type: "calculation_error", logicTag: "10_percent_discount" },
    ],
    solutionSteps: [
      "Discount = 20% of 25000 = (20/100) × 25000 = ₹5000.",
      "SP = MP − Discount = 25000 − 5000 = ₹20000.",
      "Or: SP = 25000 × (100−20)/100 = 25000 × 0.8 = ₹20000.",
    ],
    shortcut: "SP = MP × (1 − discount%/100) = 25000 × 0.8 = 20000.",
  },
  {
    questionId: "math8_ch8_q4",
    topic: "math8_ch8", topicId: "math8_ch8",
    subtopic: "Compound Interest",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Find the compound interest on ₹5000 at 8% per annum for 2 years.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "₹832", type: "correct", logicTag: "" },
      { text: "₹800", type: "concept_error", logicTag: "computed_simple_interest" },
      { text: "₹864", type: "calculation_error", logicTag: "wrong_rate" },
      { text: "₹1600", type: "calculation_error", logicTag: "not_divided_by_100" },
    ],
    solutionSteps: [
      "A = P(1 + R/100)ⁿ = 5000 × (1.08)² = 5000 × 1.1664 = ₹5832.",
      "CI = A − P = 5832 − 5000 = ₹832.",
      "SI would be: 5000×8×2/100 = ₹800. CI > SI by ₹32.",
    ],
    shortcut: "CI = 5000×(1.08)²−5000 = 5000×0.1664 = ₹832.",
  },
  {
    questionId: "math8_ch8_q5",
    topic: "math8_ch8", topicId: "math8_ch8",
    subtopic: "Finding CP from SP",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A dealer sells a bicycle for ₹1260 at a profit of 5%. Find the cost price.",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "₹1200", type: "correct", logicTag: "" },
      { text: "₹1197", type: "calculation_error", logicTag: "subtracted_5_percent_of_SP" },
      { text: "₹1323", type: "concept_error", logicTag: "added_profit_instead" },
      { text: "₹1260", type: "concept_error", logicTag: "SP_taken_as_CP" },
    ],
    solutionSteps: [
      "SP = CP × (100 + profit%)/100.",
      "1260 = CP × 105/100.",
      "CP = 1260 × 100/105 = 1260 × 20/21 = 60 × 20 = ₹1200.",
    ],
    shortcut: "CP = SP × 100/(100+profit%) = 1260 × 100/105 = ₹1200.",
  },

  // ── Chapter 9: The Baudhayana-Pythagoras Theorem ───────────────────────────
  {
    questionId: "math8_ch9_q1",
    topic: "math8_ch9", topicId: "math8_ch9",
    subtopic: "Pythagorean Theorem",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A right triangle has legs 8 cm and 15 cm. Find the hypotenuse.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "17 cm", type: "correct", logicTag: "" },
      { text: "23 cm", type: "calculation_error", logicTag: "added_instead_of_pythagoras" },
      { text: "√289 cm (unsimplified)", type: "partial_logic", logicTag: "forgot_square_root" },
      { text: "13 cm", type: "concept_error", logicTag: "confused_triple" },
    ],
    solutionSteps: [
      "c² = a² + b² = 8² + 15² = 64 + 225 = 289.",
      "c = √289 = 17 cm.",
      "(8, 15, 17) is a Pythagorean triple. ✓",
    ],
    shortcut: "Recognise the triple: (8,15,17). Hypotenuse = 17 cm.",
  },
  {
    questionId: "math8_ch9_q2",
    topic: "math8_ch9", topicId: "math8_ch9",
    subtopic: "Pythagorean Triples",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Which of the following is a Pythagorean triple?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.25, marks: 1, isAIGenerated: true,
    options: [
      { text: "(5, 12, 13)", type: "correct", logicTag: "" },
      { text: "(4, 5, 6)", type: "concept_error", logicTag: "consecutive_not_triple" },
      { text: "(6, 7, 8)", type: "concept_error", logicTag: "consecutive_not_triple" },
      { text: "(3, 5, 7)", type: "concept_error", logicTag: "random_numbers" },
    ],
    solutionSteps: [
      "Check (5,12,13): 5²+12² = 25+144 = 169 = 13². ✓",
      "(4,5,6): 16+25=41 ≠ 36. ✗",
      "(6,7,8): 36+49=85 ≠ 64. ✗",
      "(3,5,7): 9+25=34 ≠ 49. ✗",
    ],
    shortcut: "Memorise common triples: (3,4,5), (5,12,13), (8,15,17). Verify by a²+b²=c².",
  },
  {
    questionId: "math8_ch9_q3",
    topic: "math8_ch9", topicId: "math8_ch9",
    subtopic: "Finding a Leg",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A ladder 26 m long leans against a wall. The foot of the ladder is 10 m from the wall. How high does it reach?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "24 m", type: "correct", logicTag: "" },
      { text: "28 m", type: "calculation_error", logicTag: "added_instead_of_subtracted" },
      { text: "16 m", type: "calculation_error", logicTag: "arithmetic_error" },
      { text: "20 m", type: "calculation_error", logicTag: "guessed_triple_incorrectly" },
    ],
    solutionSteps: [
      "Ladder = hypotenuse = 26 m; distance from wall = 10 m.",
      "Height² = 26² − 10² = 676 − 100 = 576.",
      "Height = √576 = 24 m.",
      "(10, 24, 26) is a multiple of (5, 12, 13). ✓",
    ],
    shortcut: "(10,24,26) = 2×(5,12,13). Height = 24 m.",
  },
  {
    questionId: "math8_ch9_q4",
    topic: "math8_ch9", topicId: "math8_ch9",
    subtopic: "Diagonal of Rectangle",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A rectangle is 7 cm wide and 24 cm long. Find the length of its diagonal.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "25 cm", type: "correct", logicTag: "" },
      { text: "31 cm", type: "calculation_error", logicTag: "added_sides" },
      { text: "√575 cm", type: "calculation_error", logicTag: "wrong_computation" },
      { text: "24 cm", type: "concept_error", logicTag: "took_longer_side" },
    ],
    solutionSteps: [
      "Diagonal² = length² + width² = 24² + 7² = 576 + 49 = 625.",
      "Diagonal = √625 = 25 cm.",
      "(7, 24, 25) is a Pythagorean triple. ✓",
    ],
    shortcut: "Recognise (7,24,25) Pythagorean triple → diagonal = 25 cm.",
  },
  {
    questionId: "math8_ch9_q5",
    topic: "math8_ch9", topicId: "math8_ch9",
    subtopic: "Converse and Irrational Numbers",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Which statement about √2 is TRUE?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "√2 is irrational — its decimal is non-terminating and non-repeating", type: "correct", logicTag: "" },
      { text: "√2 = 1.4 exactly", type: "concept_error", logicTag: "approximation_taken_as_exact" },
      { text: "√2 is rational because it equals the diagonal of a unit square", type: "concept_error", logicTag: "geometric_construction_implies_rational" },
      { text: "√2 can be expressed as a fraction p/q", type: "concept_error", logicTag: "definition_of_rational_confused" },
    ],
    solutionSteps: [
      "Proof by contradiction: assume √2 = p/q in lowest terms.",
      "Then 2 = p²/q², so p² = 2q², making p even.",
      "Write p = 2k: 4k² = 2q² → q² = 2k², making q even.",
      "But p and q both even contradicts 'lowest terms'. ∴ √2 is irrational.",
    ],
    shortcut: "√2 ≈ 1.41421356... — decimal never terminates or repeats → irrational.",
  },

  // ── Chapter 10: Proportional Reasoning - 2 ──────────────────────────────────
  {
    questionId: "math8_ch10_q1",
    topic: "math8_ch10", topicId: "math8_ch10",
    subtopic: "Map Scales",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A map has scale 1:500000. Two cities are 6 cm apart on the map. What is the actual distance in km?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "30 km", type: "correct", logicTag: "" },
      { text: "3 km", type: "calculation_error", logicTag: "forgot_unit_conversion" },
      { text: "300 km", type: "calculation_error", logicTag: "wrong_scale_denominator" },
      { text: "0.03 km", type: "calculation_error", logicTag: "inverted_scale" },
    ],
    solutionSteps: [
      "Actual distance = map distance × scale denominator.",
      "= 6 × 500000 = 3000000 cm.",
      "Convert: 3000000 cm ÷ 100000 = 30 km.",
    ],
    shortcut: "6 cm × 500000 = 3,000,000 cm = 30 km.",
  },
  {
    questionId: "math8_ch10_q2",
    topic: "math8_ch10", topicId: "math8_ch10",
    subtopic: "Ratio Division",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Divide ₹5400 among A, B, C in the ratio 2:3:4.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.25, marks: 1, isAIGenerated: true,
    options: [
      { text: "₹1200, ₹1800, ₹2400", type: "correct", logicTag: "" },
      { text: "₹1350, ₹1800, ₹2250", type: "calculation_error", logicTag: "wrong_total_parts" },
      { text: "₹1800, ₹1800, ₹1800", type: "concept_error", logicTag: "split_equally" },
      { text: "₹1000, ₹2000, ₹2400", type: "calculation_error", logicTag: "ratio_not_applied_correctly" },
    ],
    solutionSteps: [
      "Total parts = 2+3+4 = 9. Each part = 5400/9 = 600.",
      "A = 2×600 = ₹1200.",
      "B = 3×600 = ₹1800.",
      "C = 4×600 = ₹2400.",
      "Check: 1200+1800+2400 = 5400. ✓",
    ],
    shortcut: "Each part = 5400/9 = 600. Multiply by ratio: 2,3,4 → 1200,1800,2400.",
  },
  {
    questionId: "math8_ch10_q3",
    topic: "math8_ch10", topicId: "math8_ch10",
    subtopic: "Worker Problems",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "20 workers can build a wall in 30 days. After 10 days, 5 workers leave. How many more days to finish the remaining work?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "26⅔ days", type: "correct", logicTag: "" },
      { text: "20 days", type: "calculation_error", logicTag: "ignored_worker_change" },
      { text: "30 days", type: "calculation_error", logicTag: "took_full_original_time" },
      { text: "25 days", type: "calculation_error", logicTag: "arithmetic_error" },
    ],
    solutionSteps: [
      "Total work = 20 × 30 = 600 worker-days.",
      "Work done in 10 days with 20 workers = 20 × 10 = 200 worker-days.",
      "Remaining work = 600 − 200 = 400 worker-days.",
      "Workers remaining = 20 − 5 = 15.",
      "Days to finish = 400 / 15 = 26⅔ days.",
    ],
    shortcut: "Remaining = 400 worker-days ÷ 15 workers = 80/3 = 26⅔ days.",
  },
  {
    questionId: "math8_ch10_q4",
    topic: "math8_ch10", topicId: "math8_ch10",
    subtopic: "Compound Ratio",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Find the compound ratio of 5:6 and 3:10.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "1:4", type: "correct", logicTag: "" },
      { text: "5:60", type: "partial_logic", logicTag: "not_simplified" },
      { text: "8:16", type: "concept_error", logicTag: "added_instead_of_multiplied" },
      { text: "15:60", type: "partial_logic", logicTag: "only_numerators_multiplied" },
    ],
    solutionSteps: [
      "Compound ratio of (a:b) and (c:d) = ac:bd.",
      "5:6 and 3:10 → (5×3):(6×10) = 15:60 = 1:4.",
    ],
    shortcut: "Multiply tops together and bottoms together: (5×3):(6×10) = 15:60 = 1:4.",
  },
  {
    questionId: "math8_ch10_q5",
    topic: "math8_ch10", topicId: "math8_ch10",
    subtopic: "Speed-Time-Distance",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A car travels at 80 km/h and covers a distance in 4.5 hours. At what speed must it travel to cover the same distance in 3 hours?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.7, marks: 1, isAIGenerated: true,
    options: [
      { text: "120 km/h", type: "correct", logicTag: "" },
      { text: "53⅓ km/h", type: "concept_error", logicTag: "treated_as_direct" },
      { text: "100 km/h", type: "calculation_error", logicTag: "arithmetic_error" },
      { text: "90 km/h", type: "calculation_error", logicTag: "rough_estimation" },
    ],
    solutionSteps: [
      "Distance = 80 × 4.5 = 360 km (constant).",
      "Speed and time are inversely proportional.",
      "v × 3 = 360 → v = 120 km/h.",
    ],
    shortcut: "Speed × time = distance = 360 km. New speed = 360/3 = 120 km/h.",
  },

  // ── Chapter 11: Exploring Some Geometric Themes ──────────────────────────────
  {
    questionId: "math8_ch11_q1",
    topic: "math8_ch11", topicId: "math8_ch11",
    subtopic: "Fractals",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "How many filled triangles remain after Step 3 of constructing the Sierpinski Gasket?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.25, marks: 1, isAIGenerated: true,
    options: [
      { text: "27", type: "correct", logicTag: "" },
      { text: "9", type: "calculation_error", logicTag: "only_step_2" },
      { text: "81", type: "calculation_error", logicTag: "too_many_steps" },
      { text: "12", type: "concept_error", logicTag: "wrong_pattern" },
    ],
    solutionSteps: [
      "Step 0: 1 triangle.",
      "Each step: each triangle becomes 3 triangles.",
      "Step 1: 3¹ = 3. Step 2: 3² = 9. Step 3: 3³ = 27.",
    ],
    shortcut: "After Step n: 3ⁿ triangles. Step 3: 3³ = 27.",
  },
  {
    questionId: "math8_ch11_q2",
    topic: "math8_ch11", topicId: "math8_ch11",
    subtopic: "Euler's Formula",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A polyhedron has 8 faces and 12 vertices. How many edges does it have?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "18", type: "correct", logicTag: "" },
      { text: "20", type: "calculation_error", logicTag: "added_F_and_V" },
      { text: "22", type: "calculation_error", logicTag: "wrong_Euler_formula" },
      { text: "16", type: "calculation_error", logicTag: "subtracted_wrong" },
    ],
    solutionSteps: [
      "Euler's formula: F + V − E = 2.",
      "8 + 12 − E = 2.",
      "E = 20 − 2 = 18.",
    ],
    shortcut: "E = F + V − 2 = 8 + 12 − 2 = 18.",
  },
  {
    questionId: "math8_ch11_q3",
    topic: "math8_ch11", topicId: "math8_ch11",
    subtopic: "Nets",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "How many distinct nets does a cube have?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "11", type: "correct", logicTag: "" },
      { text: "6", type: "concept_error", logicTag: "confused_with_faces" },
      { text: "8", type: "guessing", logicTag: "" },
      { text: "24", type: "concept_error", logicTag: "confused_with_symmetries" },
    ],
    solutionSteps: [
      "A cube has exactly 11 valid nets.",
      "These are 11 distinct ways to unfold a cube's 6 square faces into a flat shape.",
      "The classic cross (T-shape) is one; there are 10 others.",
    ],
    shortcut: "Memorise: exactly 11 distinct nets for a cube.",
  },
  {
    questionId: "math8_ch11_q4",
    topic: "math8_ch11", topicId: "math8_ch11",
    subtopic: "Cross Sections",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "What shape is obtained when a cone is cut by a plane parallel to its base?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "Circle", type: "correct", logicTag: "" },
      { text: "Triangle", type: "concept_error", logicTag: "vertical_cut_not_horizontal" },
      { text: "Ellipse", type: "concept_error", logicTag: "oblique_cut_not_horizontal" },
      { text: "Rectangle", type: "concept_error", logicTag: "wrong_shape" },
    ],
    solutionSteps: [
      "A horizontal cut (parallel to base) through a cone gives a circular cross-section.",
      "The circle's radius is smaller than the base radius (position-dependent).",
    ],
    shortcut: "Cone + horizontal cut = circle. Cone + vertical cut through apex = triangle.",
  },
  {
    questionId: "math8_ch11_q5",
    topic: "math8_ch11", topicId: "math8_ch11",
    subtopic: "Koch Snowflake",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "The Koch Snowflake starts with a triangle of perimeter 12 cm. The perimeter multiplies by 4/3 at each step. What is the perimeter after 2 steps?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "64/3 cm", type: "correct", logicTag: "" },
      { text: "16 cm", type: "calculation_error", logicTag: "added_instead_of_multiplied" },
      { text: "48/3 cm", type: "calculation_error", logicTag: "only_one_step" },
      { text: "12 cm", type: "concept_error", logicTag: "no_change_assumed" },
    ],
    solutionSteps: [
      "Step 0: perimeter = 12.",
      "Step 1: 12 × 4/3 = 16.",
      "Step 2: 16 × 4/3 = 64/3 ≈ 21.3 cm.",
    ],
    shortcut: "P₂ = 12 × (4/3)² = 12 × 16/9 = 192/9 = 64/3 cm.",
  },

  // ── Chapter 12: Tales by Dots and Lines ──────────────────────────────────────
  {
    questionId: "math8_ch12_q1",
    topic: "math8_ch12", topicId: "math8_ch12",
    subtopic: "Mean",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "The mean of 8 numbers is 15. One number is deleted. The new mean is 14. What was the deleted number?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.25, marks: 1, isAIGenerated: true,
    options: [
      { text: "22", type: "correct", logicTag: "" },
      { text: "14", type: "concept_error", logicTag: "confused_with_new_mean" },
      { text: "18", type: "calculation_error", logicTag: "arithmetic_error" },
      { text: "1", type: "calculation_error", logicTag: "subtracted_means" },
    ],
    solutionSteps: [
      "Original sum = 8 × 15 = 120.",
      "New sum (7 numbers) = 7 × 14 = 98.",
      "Deleted number = 120 − 98 = 22.",
    ],
    shortcut: "Deleted number = (old sum) − (new sum) = 120 − 98 = 22.",
  },
  {
    questionId: "math8_ch12_q2",
    topic: "math8_ch12", topicId: "math8_ch12",
    subtopic: "Median",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Find the median of: 5, 3, 8, 2, 9, 4, 7.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "5", type: "correct", logicTag: "" },
      { text: "8", type: "concept_error", logicTag: "unsorted_middle" },
      { text: "4", type: "calculation_error", logicTag: "wrong_position" },
      { text: "5.43", type: "concept_error", logicTag: "computed_mean_not_median" },
    ],
    solutionSteps: [
      "Sort in ascending order: 2, 3, 4, 5, 7, 8, 9.",
      "n = 7 (odd). Median position = (7+1)/2 = 4.",
      "4th value = 5.",
    ],
    shortcut: "Sort first! 7 values, middle = 4th = 5.",
  },
  {
    questionId: "math8_ch12_q3",
    topic: "math8_ch12", topicId: "math8_ch12",
    subtopic: "Effect on Mean",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "The mean of a dataset is 20. If each value is multiplied by 3 and then 5 is added, what is the new mean?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "65", type: "correct", logicTag: "" },
      { text: "60", type: "calculation_error", logicTag: "forgot_to_add_5" },
      { text: "25", type: "calculation_error", logicTag: "only_added_5" },
      { text: "23", type: "concept_error", logicTag: "wrong_order_of_operations" },
    ],
    solutionSteps: [
      "Multiplying all values by 3: new mean = 3 × 20 = 60.",
      "Adding 5 to each value: new mean = 60 + 5 = 65.",
    ],
    shortcut: "Linear transformation: new mean = 3×20 + 5 = 65.",
  },
  {
    questionId: "math8_ch12_q4",
    topic: "math8_ch12", topicId: "math8_ch12",
    subtopic: "Combined Mean",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Class A (30 students) has mean score 75. Class B (20 students) has mean score 65. Find the combined mean.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "71", type: "correct", logicTag: "" },
      { text: "70", type: "concept_error", logicTag: "simple_average_of_means" },
      { text: "72", type: "calculation_error", logicTag: "arithmetic_error" },
      { text: "68", type: "calculation_error", logicTag: "wrong_weighted_sum" },
    ],
    solutionSteps: [
      "Total marks of A = 30 × 75 = 2250.",
      "Total marks of B = 20 × 65 = 1300.",
      "Combined total = 3550; combined students = 50.",
      "Combined mean = 3550/50 = 71.",
    ],
    shortcut: "Weighted mean = (30×75 + 20×65)/(30+20) = (2250+1300)/50 = 3550/50 = 71.",
  },
  {
    questionId: "math8_ch12_q5",
    topic: "math8_ch12", topicId: "math8_ch12",
    subtopic: "Choosing the Right Measure",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A small company has 5 employees with monthly salaries: ₹25000, ₹28000, ₹30000, ₹32000, ₹500000. Which measure best represents a 'typical' salary?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "Median (₹30000)", type: "correct", logicTag: "" },
      { text: "Mean (₹123000)", type: "concept_error", logicTag: "mean_distorted_by_outlier" },
      { text: "Mode (no mode)", type: "concept_error", logicTag: "no_mode_in_this_data" },
      { text: "Range", type: "misinterpretation", logicTag: "range_is_not_central_tendency" },
    ],
    solutionSteps: [
      "Mean = (25000+28000+30000+32000+500000)/5 = 615000/5 = ₹123000 — distorted by ₹500000 outlier.",
      "Sorted data: 25000, 28000, 30000, 32000, 500000.",
      "Median = 3rd value = ₹30000 — not affected by outlier.",
      "Median better represents typical salary.",
    ],
    shortcut: "Extreme outlier → use median. Mean gets pulled up to ₹123000, misleading.",
  },

  // ── Chapter 13: Algebra Play ─────────────────────────────────────────────────
  {
    questionId: "math8_ch13_q1",
    topic: "math8_ch13", topicId: "math8_ch13",
    subtopic: "Linear Equations",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Solve for x: 5x − 3 = 3x + 9.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "x = 6", type: "correct", logicTag: "" },
      { text: "x = 3", type: "calculation_error", logicTag: "arithmetic_error" },
      { text: "x = −3", type: "concept_error", logicTag: "sign_error_in_transposing" },
      { text: "x = 12", type: "calculation_error", logicTag: "wrong_subtraction" },
    ],
    solutionSteps: [
      "5x − 3 = 3x + 9.",
      "5x − 3x = 9 + 3.",
      "2x = 12 → x = 6.",
      "Check: 5(6)−3 = 27 = 3(6)+9 = 27. ✓",
    ],
    shortcut: "Move x terms left, constants right: 2x = 12 → x = 6.",
  },
  {
    questionId: "math8_ch13_q2",
    topic: "math8_ch13", topicId: "math8_ch13",
    subtopic: "Equations with Brackets",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Solve: 4(2x + 3) = 2(3x + 11).",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.25, marks: 1, isAIGenerated: true,
    options: [
      { text: "x = 5", type: "correct", logicTag: "" },
      { text: "x = 7", type: "calculation_error", logicTag: "arithmetic_error" },
      { text: "x = 2", type: "calculation_error", logicTag: "wrong_expansion" },
      { text: "x = −5", type: "concept_error", logicTag: "sign_error" },
    ],
    solutionSteps: [
      "8x + 12 = 6x + 22.",
      "8x − 6x = 22 − 12.",
      "2x = 10 → x = 5.",
    ],
    shortcut: "Expand brackets first, then collect terms: 2x = 10 → x = 5.",
  },
  {
    questionId: "math8_ch13_q3",
    topic: "math8_ch13", topicId: "math8_ch13",
    subtopic: "Equations with Fractions",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Solve: x/4 + x/6 = 5.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "12", type: "correct", logicTag: "" },
      { text: "10", type: "calculation_error", logicTag: "wrong_LCM" },
      { text: "20", type: "calculation_error", logicTag: "did_not_simplify_fraction" },
      { text: "8", type: "calculation_error", logicTag: "arithmetic_error" },
    ],
    solutionSteps: [
      "LCM of 4 and 6 = 12. Multiply both sides by 12.",
      "3x + 2x = 60.",
      "5x = 60 → x = 12.",
      "Check: 12/4 + 12/6 = 3 + 2 = 5. ✓",
    ],
    shortcut: "Multiply by LCM(4,6)=12: 3x+2x=60 → 5x=60 → x=12.",
  },
  {
    questionId: "math8_ch13_q4",
    topic: "math8_ch13", topicId: "math8_ch13",
    subtopic: "Word Problems",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "The sum of two numbers is 84. One number is 3 times the other. Find the smaller number.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "21", type: "correct", logicTag: "" },
      { text: "63", type: "concept_error", logicTag: "found_larger_number" },
      { text: "28", type: "calculation_error", logicTag: "wrong_ratio" },
      { text: "42", type: "calculation_error", logicTag: "divided_by_2" },
    ],
    solutionSteps: [
      "Let smaller number = x. Larger = 3x.",
      "x + 3x = 84 → 4x = 84 → x = 21.",
      "Smaller number = 21; larger = 63.",
      "Check: 21 + 63 = 84. ✓",
    ],
    shortcut: "x + 3x = 84 → 4x = 84 → x = 21.",
  },
  {
    questionId: "math8_ch13_q5",
    topic: "math8_ch13", topicId: "math8_ch13",
    subtopic: "Age Problems",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Rahul is twice as old as Priya. 5 years ago Rahul was 3 times as old as Priya. Find Rahul's current age.",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "20 years", type: "correct", logicTag: "" },
      { text: "10 years", type: "concept_error", logicTag: "found_Priya_age" },
      { text: "15 years", type: "calculation_error", logicTag: "arithmetic_error" },
      { text: "25 years", type: "calculation_error", logicTag: "wrong_setup" },
    ],
    solutionSteps: [
      "Let Priya = x. Rahul = 2x.",
      "5 years ago: Rahul = 2x−5; Priya = x−5.",
      "Condition: 2x−5 = 3(x−5).",
      "2x−5 = 3x−15 → x = 10.",
      "Rahul = 2×10 = 20 years.",
    ],
    shortcut: "Set up equation for 5 years ago: 2x−5 = 3(x−5) → x=10 → Rahul=20.",
  },

  // ── Chapter 14: Area ─────────────────────────────────────────────────────────
  {
    questionId: "math8_ch14_q1",
    topic: "math8_ch14", topicId: "math8_ch14",
    subtopic: "Parallelogram",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A parallelogram has base 15 cm and height 10 cm. Find its area.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "150 cm²", type: "correct", logicTag: "" },
      { text: "75 cm²", type: "calculation_error", logicTag: "used_triangle_formula" },
      { text: "300 cm²", type: "calculation_error", logicTag: "doubled" },
      { text: "50 cm²", type: "calculation_error", logicTag: "added_sides" },
    ],
    solutionSteps: [
      "Area of parallelogram = base × height = 15 × 10 = 150 cm².",
    ],
    shortcut: "Parallelogram area = base × height. Not ½ — that's triangle.",
  },
  {
    questionId: "math8_ch14_q2",
    topic: "math8_ch14", topicId: "math8_ch14",
    subtopic: "Circle",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Find the area of a circle with radius 14 cm. (Use π = 22/7)",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "616 cm²", type: "correct", logicTag: "" },
      { text: "88 cm²", type: "concept_error", logicTag: "computed_circumference" },
      { text: "308 cm²", type: "calculation_error", logicTag: "halved_the_area" },
      { text: "196 cm²", type: "concept_error", logicTag: "computed_r_squared_only" },
    ],
    solutionSteps: [
      "Area = πr² = (22/7) × 14² = (22/7) × 196 = 22 × 28 = 616 cm².",
    ],
    shortcut: "π×14² = (22/7)×196 = 22×28 = 616 cm².",
  },
  {
    questionId: "math8_ch14_q3",
    topic: "math8_ch14", topicId: "math8_ch14",
    subtopic: "Rhombus",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "The diagonals of a rhombus are 16 cm and 12 cm. Find the area of the rhombus.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "96 cm²", type: "correct", logicTag: "" },
      { text: "192 cm²", type: "calculation_error", logicTag: "forgot_half" },
      { text: "144 cm²", type: "calculation_error", logicTag: "used_side_not_diagonal" },
      { text: "48 cm²", type: "calculation_error", logicTag: "only_one_diagonal" },
    ],
    solutionSteps: [
      "Area of rhombus = ½ × d₁ × d₂.",
      "= ½ × 16 × 12 = ½ × 192 = 96 cm².",
    ],
    shortcut: "Rhombus area = ½ × d₁ × d₂ = ½ × 16 × 12 = 96 cm².",
  },
  {
    questionId: "math8_ch14_q4",
    topic: "math8_ch14", topicId: "math8_ch14",
    subtopic: "Composite Figures",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A square of side 20 cm has a circle of diameter 14 cm cut from its centre. Find the remaining area. (π = 22/7)",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "246 cm²", type: "correct", logicTag: "" },
      { text: "400 cm²", type: "concept_error", logicTag: "forgot_to_subtract_circle" },
      { text: "154 cm²", type: "concept_error", logicTag: "gave_only_circle_area" },
      { text: "262 cm²", type: "calculation_error", logicTag: "arithmetic_error" },
    ],
    solutionSteps: [
      "Area of square = 20² = 400 cm².",
      "Radius of circle = 14/2 = 7 cm.",
      "Area of circle = (22/7) × 7² = 22 × 7 = 154 cm².",
      "Remaining area = 400 − 154 = 246 cm².",
    ],
    shortcut: "Square − circle: 400 − 154 = 246 cm².",
  },
  {
    questionId: "math8_ch14_q5",
    topic: "math8_ch14", topicId: "math8_ch14",
    subtopic: "Trapezium and Units",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A field is shaped like a trapezium with parallel sides 120 m and 80 m, and height 60 m. Find the area in hectares. (1 hectare = 10000 m²)",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "0.6 hectares", type: "correct", logicTag: "" },
      { text: "6 hectares", type: "calculation_error", logicTag: "forgot_to_divide_by_10000" },
      { text: "0.06 hectares", type: "calculation_error", logicTag: "wrong_unit_conversion" },
      { text: "1.2 hectares", type: "calculation_error", logicTag: "forgot_half" },
    ],
    solutionSteps: [
      "Area = ½ × (120 + 80) × 60 = ½ × 200 × 60 = 6000 m².",
      "In hectares: 6000 / 10000 = 0.6 hectares.",
    ],
    shortcut: "½ × 200 × 60 = 6000 m² = 0.6 hectares.",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  for (const q of questions) {
    await Question.findOneAndUpdate(
      { questionText: q.questionText, subject: q.subject },
      q,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${q.questionId}`);
  }

  console.log(`\nSeeded ${questions.length} questions for Class 8 Math (Ch 8–14).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
