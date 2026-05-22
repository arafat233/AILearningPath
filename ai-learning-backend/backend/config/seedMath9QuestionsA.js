import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";

dotenv.config();

const questions = [
  // ── Chapter 1: Coordinates ──────────────────────────────────────────────
  {
    questionId: "math9_ch1_q1",
    topic: "math9_ch1", topicId: "math9_ch1",
    subtopic: "Quadrants",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "In which quadrant does the point (−4, 7) lie?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Quadrant I", type: "concept_error", logicTag: "both_positive_confusion" },
      { text: "Quadrant II", type: "correct", logicTag: "" },
      { text: "Quadrant III", type: "concept_error", logicTag: "sign_confusion" },
      { text: "Quadrant IV", type: "concept_error", logicTag: "swapped_signs" },
    ],
    solutionSteps: ["x = −4 (negative), y = 7 (positive).", "Negative x and positive y → Quadrant II."],
    shortcut: "Signs (−,+) always → Q2.",
  },
  {
    questionId: "math9_ch1_q2",
    topic: "math9_ch1", topicId: "math9_ch1",
    subtopic: "Distance formula",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "What is the distance between A(1, 2) and B(4, 6)?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.25, marks: 1, isAIGenerated: true,
    options: [
      { text: "3 units", type: "calculation_error", logicTag: "forgot_y_difference" },
      { text: "4 units", type: "calculation_error", logicTag: "forgot_x_difference" },
      { text: "5 units", type: "correct", logicTag: "" },
      { text: "7 units", type: "calculation_error", logicTag: "added_not_squared" },
    ],
    solutionSteps: [
      "d = √[(4−1)² + (6−2)²]",
      "= √[9 + 16] = √25 = 5 units.",
    ],
    shortcut: "3-4-5 right triangle pattern.",
  },
  {
    questionId: "math9_ch1_q3",
    topic: "math9_ch1", topicId: "math9_ch1",
    subtopic: "Midpoint",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Find the midpoint of segment joining P(2, 4) and Q(8, 10).",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "(5, 7)", type: "correct", logicTag: "" },
      { text: "(6, 7)", type: "calculation_error", logicTag: "wrong_x_average" },
      { text: "(5, 6)", type: "calculation_error", logicTag: "wrong_y_average" },
      { text: "(10, 14)", type: "concept_error", logicTag: "added_instead_of_averaged" },
    ],
    solutionSteps: [
      "Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2)",
      "= ((2+8)/2, (4+10)/2) = (5, 7).",
    ],
    shortcut: "Average of x-coordinates, average of y-coordinates.",
  },
  {
    questionId: "math9_ch1_q4",
    topic: "math9_ch1", topicId: "math9_ch1",
    subtopic: "Axes",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "A point lies on the y-axis. Which of the following must be true?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Its x-coordinate is 0", type: "correct", logicTag: "" },
      { text: "Its y-coordinate is 0", type: "concept_error", logicTag: "axis_confusion" },
      { text: "Both coordinates are 0", type: "concept_error", logicTag: "only_origin" },
      { text: "Its x-coordinate equals its y-coordinate", type: "misinterpretation", logicTag: "line_y_equals_x_confusion" },
    ],
    solutionSteps: ["Any point on the y-axis has the form (0, k) where k can be any real number.", "So x-coordinate = 0."],
    shortcut: "y-axis: x=0. x-axis: y=0.",
  },
  {
    questionId: "math9_ch1_q5",
    topic: "math9_ch1", topicId: "math9_ch1",
    subtopic: "Distance from origin",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "What is the distance of the point (−3, 4) from the origin?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.25, marks: 1, isAIGenerated: true,
    options: [
      { text: "1 unit", type: "calculation_error", logicTag: "subtracted_coordinates" },
      { text: "5 units", type: "correct", logicTag: "" },
      { text: "7 units", type: "calculation_error", logicTag: "added_not_squared" },
      { text: "25 units", type: "calculation_error", logicTag: "forgot_square_root" },
    ],
    solutionSteps: [
      "d = √[(−3)² + 4²] = √[9 + 16] = √25 = 5 units.",
    ],
    shortcut: "3-4-5 Pythagorean triple.",
  },

  // ── Chapter 2: Linear Polynomials ──────────────────────────────────────
  {
    questionId: "math9_ch2_q1",
    topic: "math9_ch2", topicId: "math9_ch2",
    subtopic: "Zero of polynomial",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "What is the zero of the polynomial p(x) = 3x − 9?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "x = 3", type: "correct", logicTag: "" },
      { text: "x = −3", type: "calculation_error", logicTag: "sign_error" },
      { text: "x = 9", type: "concept_error", logicTag: "forgot_divide_by_a" },
      { text: "x = 0", type: "concept_error", logicTag: "set_x_zero_not_p_zero" },
    ],
    solutionSteps: ["Set p(x) = 0: 3x − 9 = 0 → 3x = 9 → x = 3."],
    shortcut: "Zero = −b/a = −(−9)/3 = 3.",
  },
  {
    questionId: "math9_ch2_q2",
    topic: "math9_ch2", topicId: "math9_ch2",
    subtopic: "Degree",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Which of the following is a linear polynomial?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.15, marks: 1, isAIGenerated: true,
    options: [
      { text: "3x² − 2", type: "concept_error", logicTag: "quadratic_confused_with_linear" },
      { text: "7x − 5", type: "correct", logicTag: "" },
      { text: "x³ + 1", type: "concept_error", logicTag: "cubic_confused_with_linear" },
      { text: "5", type: "concept_error", logicTag: "constant_confused_with_linear" },
    ],
    solutionSteps: ["A linear polynomial has degree 1.", "7x − 5 has highest power of x equal to 1 → linear."],
    shortcut: "Degree 1 = linear. Only one x, no exponent.",
  },
  {
    questionId: "math9_ch2_q3",
    topic: "math9_ch2", topicId: "math9_ch2",
    subtopic: "Verification of zero",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Is x = −2 a zero of p(x) = 4x + 8?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Yes, because p(−2) = 0", type: "correct", logicTag: "" },
      { text: "No, because p(−2) = 16", type: "calculation_error", logicTag: "sign_error_in_substitution" },
      { text: "No, because p(−2) = −8", type: "calculation_error", logicTag: "dropped_constant" },
      { text: "Yes, because p(0) = 8", type: "concept_error", logicTag: "checked_wrong_value" },
    ],
    solutionSteps: ["p(−2) = 4(−2) + 8 = −8 + 8 = 0.", "Since p(−2) = 0, x = −2 is indeed a zero."],
    shortcut: "Substitute and check if result is 0.",
  },
  {
    questionId: "math9_ch2_q4",
    topic: "math9_ch2", topicId: "math9_ch2",
    subtopic: "Graph of linear polynomial",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "The graph of a linear polynomial is always a —",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.15, marks: 1, isAIGenerated: true,
    options: [
      { text: "Straight line", type: "correct", logicTag: "" },
      { text: "Parabola", type: "concept_error", logicTag: "quadratic_graph_confusion" },
      { text: "Circle", type: "misinterpretation", logicTag: "wrong_shape" },
      { text: "Hyperbola", type: "misinterpretation", logicTag: "wrong_curve" },
    ],
    solutionSteps: ["y = ax + b is the slope-intercept form of a straight line.", "Every linear polynomial graphs as a straight line."],
    shortcut: "Linear → line. Quadratic → parabola.",
  },
  {
    questionId: "math9_ch2_q5",
    topic: "math9_ch2", topicId: "math9_ch2",
    subtopic: "Zero of polynomial",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Find the zero of p(x) = −5x + 20.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "x = 4", type: "correct", logicTag: "" },
      { text: "x = −4", type: "calculation_error", logicTag: "sign_error" },
      { text: "x = 20", type: "concept_error", logicTag: "used_constant_as_zero" },
      { text: "x = −20", type: "calculation_error", logicTag: "divided_wrong" },
    ],
    solutionSteps: ["−5x + 20 = 0 → −5x = −20 → x = 4."],
    shortcut: "x = −b/a = −20/(−5) = 4.",
  },

  // ── Chapter 3: World of Numbers ─────────────────────────────────────────
  {
    questionId: "math9_ch3_q1",
    topic: "math9_ch3", topicId: "math9_ch3",
    subtopic: "Rational vs irrational",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Which of the following is an irrational number?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "√16", type: "concept_error", logicTag: "perfect_square_is_rational" },
      { text: "√25", type: "concept_error", logicTag: "perfect_square_is_rational" },
      { text: "√7", type: "correct", logicTag: "" },
      { text: "0.333…", type: "concept_error", logicTag: "repeating_decimal_is_rational" },
    ],
    solutionSteps: ["√16 = 4, √25 = 5 — both rational.", "0.333… = 1/3 — rational (repeating).", "√7 is not a perfect square → irrational."],
    shortcut: "√n irrational ↔ n is not a perfect square.",
  },
  {
    questionId: "math9_ch3_q2",
    topic: "math9_ch3", topicId: "math9_ch3",
    subtopic: "Number classification",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Every integer is a —",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.15, marks: 1, isAIGenerated: true,
    options: [
      { text: "Rational number", type: "correct", logicTag: "" },
      { text: "Irrational number", type: "concept_error", logicTag: "confused_classification" },
      { text: "Natural number", type: "concept_error", logicTag: "negatives_are_not_natural" },
      { text: "Whole number", type: "concept_error", logicTag: "negatives_are_not_whole" },
    ],
    solutionSteps: ["Any integer n can be written as n/1.", "So every integer is a rational number (p/q form with q=1)."],
    shortcut: "Integer n = n/1 → always rational.",
  },
  {
    questionId: "math9_ch3_q3",
    topic: "math9_ch3", topicId: "math9_ch3",
    subtopic: "Decimal classification",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Which decimal represents a rational number?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "0.10110111011110…", type: "concept_error", logicTag: "non_repeating_irrational" },
      { text: "0.121212…", type: "correct", logicTag: "" },
      { text: "3.14159265…", type: "concept_error", logicTag: "pi_is_irrational" },
      { text: "1.41421356…", type: "concept_error", logicTag: "sqrt2_is_irrational" },
    ],
    solutionSteps: ["0.121212… has repeating block '12' → rational (= 12/99 = 4/33).", "Non-terminating, non-repeating → irrational."],
    shortcut: "Repeating decimal → rational. Non-repeating, non-terminating → irrational.",
  },
  {
    questionId: "math9_ch3_q4",
    topic: "math9_ch3", topicId: "math9_ch3",
    subtopic: "Rationalisation",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Rationalise the denominator of 1/√5.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "√5/5", type: "correct", logicTag: "" },
      { text: "5/√5", type: "concept_error", logicTag: "inverted_rationalisation" },
      { text: "1/5", type: "calculation_error", logicTag: "dropped_root" },
      { text: "√5", type: "calculation_error", logicTag: "forgot_denominator" },
    ],
    solutionSteps: [
      "Multiply numerator and denominator by √5:",
      "1/√5 × √5/√5 = √5/(√5)² = √5/5.",
    ],
    shortcut: "Multiply by √n/√n to clear √n from denominator.",
  },
  {
    questionId: "math9_ch3_q5",
    topic: "math9_ch3", topicId: "math9_ch3",
    subtopic: "Number hierarchy",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Which set does −7 belong to?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.15, marks: 1, isAIGenerated: true,
    options: [
      { text: "Natural numbers", type: "concept_error", logicTag: "negatives_not_natural" },
      { text: "Whole numbers", type: "concept_error", logicTag: "negatives_not_whole" },
      { text: "Integers and rational numbers", type: "correct", logicTag: "" },
      { text: "Irrational numbers", type: "concept_error", logicTag: "confused_irrational" },
    ],
    solutionSteps: ["−7 is negative → not natural or whole.", "−7 ∈ ℤ (integers).", "−7 = −7/1 ∈ ℚ (rational).", "So: integers AND rational numbers."],
    shortcut: "Every integer is rational. Negative integers are NOT natural or whole.",
  },

  // ── Chapter 4: Algebraic Identities ─────────────────────────────────────
  {
    questionId: "math9_ch4_q1",
    topic: "math9_ch4", topicId: "math9_ch4",
    subtopic: "Square identities",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Expand (x + 5)².",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "x² + 25", type: "concept_error", logicTag: "missing_middle_term" },
      { text: "x² + 10x + 25", type: "correct", logicTag: "" },
      { text: "x² + 5x + 25", type: "calculation_error", logicTag: "wrong_middle_term_coefficient" },
      { text: "x² − 10x + 25", type: "calculation_error", logicTag: "wrong_sign_middle_term" },
    ],
    solutionSteps: ["(a+b)² = a² + 2ab + b²", "(x+5)² = x² + 2(x)(5) + 5² = x² + 10x + 25."],
    shortcut: "Middle term = 2 × first × second.",
  },
  {
    questionId: "math9_ch4_q2",
    topic: "math9_ch4", topicId: "math9_ch4",
    subtopic: "Difference of squares",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Factorise x² − 49.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "(x − 7)²", type: "concept_error", logicTag: "confused_with_square_identity" },
      { text: "(x + 7)(x − 7)", type: "correct", logicTag: "" },
      { text: "(x + 7)²", type: "concept_error", logicTag: "wrong_identity" },
      { text: "x(x − 49)", type: "concept_error", logicTag: "factored_incorrectly" },
    ],
    solutionSteps: ["49 = 7²", "x² − 49 = x² − 7² = (x+7)(x−7). [a²−b² = (a+b)(a−b)]"],
    shortcut: "Spot perfect squares on both sides with a minus → difference of squares.",
  },
  {
    questionId: "math9_ch4_q3",
    topic: "math9_ch4", topicId: "math9_ch4",
    subtopic: "Square identities application",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Using identity, compute 97².",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.35, marks: 1, isAIGenerated: true,
    options: [
      { text: "9409", type: "correct", logicTag: "" },
      { text: "9400", type: "calculation_error", logicTag: "forgot_last_term" },
      { text: "9604", type: "calculation_error", logicTag: "used_wrong_base" },
      { text: "9000", type: "calculation_error", logicTag: "dropped_cross_term" },
    ],
    solutionSteps: [
      "97² = (100 − 3)² = 100² − 2(100)(3) + 3²",
      "= 10000 − 600 + 9 = 9409.",
    ],
    shortcut: "Express as (round number ± small number)² and apply identity.",
  },
  {
    questionId: "math9_ch4_q4",
    topic: "math9_ch4", topicId: "math9_ch4",
    subtopic: "Sum of squares",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "If a + b = 6 and ab = 8, find a² + b².",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "20", type: "correct", logicTag: "" },
      { text: "36", type: "concept_error", logicTag: "used_sum_squared_directly" },
      { text: "28", type: "calculation_error", logicTag: "wrong_subtraction" },
      { text: "16", type: "calculation_error", logicTag: "used_product_only" },
    ],
    solutionSteps: [
      "(a+b)² = a² + 2ab + b²",
      "36 = a² + b² + 2(8)",
      "a² + b² = 36 − 16 = 20.",
    ],
    shortcut: "a² + b² = (a+b)² − 2ab.",
  },
  {
    questionId: "math9_ch4_q5",
    topic: "math9_ch4", topicId: "math9_ch4",
    subtopic: "Cube identity",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Factorise 8x³ − 27.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.45, marks: 1, isAIGenerated: true,
    options: [
      { text: "(2x − 3)(4x² + 6x + 9)", type: "correct", logicTag: "" },
      { text: "(2x − 3)³", type: "concept_error", logicTag: "confused_cube_identity" },
      { text: "(2x − 3)(4x² − 6x + 9)", type: "calculation_error", logicTag: "wrong_sign_in_factor" },
      { text: "(2x + 3)(4x² − 6x + 9)", type: "calculation_error", logicTag: "wrong_sign_in_first_factor" },
    ],
    solutionSteps: [
      "8x³ = (2x)³, 27 = 3³.",
      "a³ − b³ = (a−b)(a² + ab + b²)",
      "= (2x−3)((2x)² + (2x)(3) + 3²) = (2x−3)(4x² + 6x + 9).",
    ],
    shortcut: "Recognise cube terms; apply a³−b³ = (a−b)(a²+ab+b²).",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  let inserted = 0, updated = 0;
  for (const q of questions) {
    const result = await Question.findOneAndUpdate(
      { questionId: q.questionId },
      q,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (result.__v === undefined || result.isNew) inserted++;
    else updated++;
  }

  console.log(`\nSeeded ${questions.length} questions for Math9 ch1–ch4. (${inserted} inserted / ${updated} updated)`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
