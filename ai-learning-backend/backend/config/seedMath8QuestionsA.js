/**
 * CBSE Class 8 Mathematics — MCQ Questions Part A (Chapters 1–7)
 * 5 questions per chapter × 7 chapters = 35 questions.
 * Safe to re-run (upserts on questionText + subject).
 * Usage: node config/seedMath8QuestionsA.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";

dotenv.config();

const questions = [
  // ── Chapter 1: A Square and A Cube ──────────────────────────────────────────
  {
    questionId: "math8_ch1_q1",
    topic: "math8_ch1", topicId: "math8_ch1",
    subtopic: "Perfect Squares",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Which of the following numbers is a perfect square?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "2025", type: "correct", logicTag: "" },
      { text: "2023", type: "concept_error", logicTag: "unit_digit_check_missed" },
      { text: "1027", type: "concept_error", logicTag: "unit_digit_3_not_square" },
      { text: "3072", type: "concept_error", logicTag: "unit_digit_2_not_square" },
    ],
    solutionSteps: [
      "Unit digit of 2023 is 3 → cannot be a perfect square.",
      "Unit digit of 1027 is 7 → cannot be a perfect square.",
      "Unit digit of 3072 is 2 → cannot be a perfect square.",
      "2025 = 45². Unit digit 5 ✓. Check: 45² = 2025. ✓",
    ],
    shortcut: "Squares can only end in 0,1,4,5,6,9. 2025 = 45².",
  },
  {
    questionId: "math8_ch1_q2",
    topic: "math8_ch1", topicId: "math8_ch1",
    subtopic: "Square Roots by Prime Factorisation",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Find √1764.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "42", type: "correct", logicTag: "" },
      { text: "44", type: "calculation_error", logicTag: "wrong_prime_factorisation" },
      { text: "38", type: "calculation_error", logicTag: "incomplete_factorisation" },
      { text: "54", type: "calculation_error", logicTag: "factor_not_halved" },
    ],
    solutionSteps: [
      "1764 = 4 × 441 = 4 × 9 × 49 = 2² × 3² × 7².",
      "√1764 = √(2² × 3² × 7²) = 2 × 3 × 7 = 42.",
    ],
    shortcut: "1764 = (2×3×7)² = 42².",
  },
  {
    questionId: "math8_ch1_q3",
    topic: "math8_ch1", topicId: "math8_ch1",
    subtopic: "Smallest Multiplier",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "By what smallest number should 1152 be multiplied to make it a perfect square?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "2", type: "correct", logicTag: "" },
      { text: "3", type: "concept_error", logicTag: "wrong_unpaired_factor" },
      { text: "6", type: "calculation_error", logicTag: "multiplied_extra_factors" },
      { text: "8", type: "calculation_error", logicTag: "overcorrection" },
    ],
    solutionSteps: [
      "1152 = 2⁷ × 3².",
      "Power of 2 is 7 (odd). Power of 3 is 2 (even, already paired).",
      "To make all powers even, multiply by 2¹ = 2.",
      "1152 × 2 = 2304 = 48². ✓",
    ],
    shortcut: "Find prime factors; odd-exponent primes need one more — multiply by their product.",
  },
  {
    questionId: "math8_ch1_q4",
    topic: "math8_ch1", topicId: "math8_ch1",
    subtopic: "Cube Roots",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "What is ∛13824?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "24", type: "correct", logicTag: "" },
      { text: "18", type: "calculation_error", logicTag: "incomplete_factorisation" },
      { text: "26", type: "guessing", logicTag: "" },
      { text: "12", type: "calculation_error", logicTag: "square_root_not_cube" },
    ],
    solutionSteps: [
      "13824 = 2 × 6912 = 2 × 2 × 3456 = … → 2⁹ × 3³.",
      "Group in triples: (2³)³ × 3³ = (8×3)³ = 24³.",
      "∛13824 = 24.",
    ],
    shortcut: "13824 = 8 × 1728 = 8 × 12³? No. Better: 24³ = 13824. Check: 24³ = 576×24 = 13824 ✓.",
  },
  {
    questionId: "math8_ch1_q5",
    topic: "math8_ch1", topicId: "math8_ch1",
    subtopic: "Perfect Cubes",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "The smallest number by which 2916 must be divided to make it a perfect cube is:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "4", type: "correct", logicTag: "" },
      { text: "6", type: "concept_error", logicTag: "wrong_unpaired_factor" },
      { text: "12", type: "calculation_error", logicTag: "over_divided" },
      { text: "2", type: "concept_error", logicTag: "only_partial_correction" },
    ],
    solutionSteps: [
      "2916 = 2² × 3⁶.",
      "3⁶ is already a perfect cube (exponent 6, divisible by 3). ✓",
      "2² has exponent 2, not a multiple of 3. Need to remove 2² = 4.",
      "2916 ÷ 4 = 729 = 3⁶ = (3²)³ = 9³. ✓",
    ],
    shortcut: "For perfect cube, all prime exponents must be multiples of 3. Remove extras by dividing.",
  },

  // ── Chapter 2: Power Play ───────────────────────────────────────────────────
  {
    questionId: "math8_ch2_q1",
    topic: "math8_ch2", topicId: "math8_ch2",
    subtopic: "Laws of Exponents",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Simplify: 3⁵ × 3⁻³ ÷ 3²",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "1", type: "correct", logicTag: "" },
      { text: "3", type: "calculation_error", logicTag: "wrong_sign_exponent" },
      { text: "9", type: "calculation_error", logicTag: "forgot_negative" },
      { text: "3⁰ = 0", type: "concept_error", logicTag: "zero_exponent_confusion" },
    ],
    solutionSteps: [
      "3⁵ × 3⁻³ ÷ 3² = 3^(5 + (−3) − 2) = 3^0 = 1.",
    ],
    shortcut: "Same base: add exponents for × and subtract for ÷. 5−3−2=0, and a⁰=1.",
  },
  {
    questionId: "math8_ch2_q2",
    topic: "math8_ch2", topicId: "math8_ch2",
    subtopic: "Negative Exponents",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "The value of (2/3)⁻² is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "9/4", type: "correct", logicTag: "" },
      { text: "4/9", type: "concept_error", logicTag: "forgot_to_flip" },
      { text: "−4/9", type: "concept_error", logicTag: "negative_exponent_means_negative" },
      { text: "2/3", type: "concept_error", logicTag: "exponent_ignored" },
    ],
    solutionSteps: [
      "Negative exponent flips the fraction: (2/3)⁻² = (3/2)².",
      "(3/2)² = 9/4.",
    ],
    shortcut: "(a/b)⁻ⁿ = (b/a)ⁿ. Flip and square.",
  },
  {
    questionId: "math8_ch2_q3",
    topic: "math8_ch2", topicId: "math8_ch2",
    subtopic: "Power of a Power",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Evaluate: [(2²)³]²",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "2¹²", type: "correct", logicTag: "" },
      { text: "2⁷", type: "calculation_error", logicTag: "added_instead_of_multiplied" },
      { text: "2⁶", type: "calculation_error", logicTag: "only_inner_power" },
      { text: "2⁸", type: "calculation_error", logicTag: "partial_multiplication" },
    ],
    solutionSteps: [
      "(2²)³ = 2^(2×3) = 2⁶.",
      "(2⁶)² = 2^(6×2) = 2¹².",
      "2¹² = 4096.",
    ],
    shortcut: "Power of power: multiply all exponents. 2×3×2 = 12.",
  },
  {
    questionId: "math8_ch2_q4",
    topic: "math8_ch2", topicId: "math8_ch2",
    subtopic: "Standard Form",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "The diameter of Earth is approximately 12,742 km. In standard form this is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "1.2742 × 10⁴ km", type: "correct", logicTag: "" },
      { text: "12.742 × 10³ km", type: "concept_error", logicTag: "coefficient_not_in_range" },
      { text: "1.2742 × 10⁵ km", type: "calculation_error", logicTag: "wrong_power" },
      { text: "0.12742 × 10⁵ km", type: "concept_error", logicTag: "coefficient_less_than_1" },
    ],
    solutionSteps: [
      "Standard form requires coefficient a with 1 ≤ a < 10.",
      "12742 = 1.2742 × 10⁴ (decimal moved 4 places left).",
      "12.742 × 10³ is not standard form (12.742 ≥ 10).",
    ],
    shortcut: "Coefficient must be ≥1 and <10. Count places moved = power of 10.",
  },
  {
    questionId: "math8_ch2_q5",
    topic: "math8_ch2", topicId: "math8_ch2",
    subtopic: "Comparing Powers",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Which is greater: 2¹² or 3⁸?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "3⁸", type: "correct", logicTag: "" },
      { text: "2¹²", type: "concept_error", logicTag: "larger_exponent_assumed_larger" },
      { text: "They are equal", type: "concept_error", logicTag: "arbitrary_claim" },
      { text: "Cannot be determined", type: "misinterpretation", logicTag: "unnecessary_uncertainty" },
    ],
    solutionSteps: [
      "2¹² = (2⁴)³ = 16³ = 4096.",
      "3⁸ = (3²)⁴ = 9⁴ = 6561.",
      "6561 > 4096, so 3⁸ > 2¹².",
    ],
    shortcut: "Compute both: 2¹²=4096, 3⁸=6561. 6561 > 4096.",
  },

  // ── Chapter 3: A Story of Numbers ──────────────────────────────────────────
  {
    questionId: "math8_ch3_q1",
    topic: "math8_ch3", topicId: "math8_ch3",
    subtopic: "Roman Numerals",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "What is MCMXCIX in Hindu-Arabic numerals?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.25, marks: 1, isAIGenerated: true,
    options: [
      { text: "1999", type: "correct", logicTag: "" },
      { text: "1989", type: "calculation_error", logicTag: "wrong_XC_value" },
      { text: "2099", type: "calculation_error", logicTag: "CM_as_1100" },
      { text: "1909", type: "calculation_error", logicTag: "missed_XC" },
    ],
    solutionSteps: [
      "M = 1000.",
      "CM = 900 (100 before 1000).",
      "XC = 90 (10 before 100).",
      "IX = 9 (1 before 10).",
      "Total = 1000 + 900 + 90 + 9 = 1999.",
    ],
    shortcut: "CM=900, XC=90, IX=9. M+CM+XC+IX = 1999.",
  },
  {
    questionId: "math8_ch3_q2",
    topic: "math8_ch3", topicId: "math8_ch3",
    subtopic: "Binary Numbers",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Convert 10110₂ to decimal (base 10).",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "22", type: "correct", logicTag: "" },
      { text: "18", type: "calculation_error", logicTag: "missed_one_bit" },
      { text: "26", type: "calculation_error", logicTag: "wrong_place_values" },
      { text: "110", type: "concept_error", logicTag: "read_as_decimal" },
    ],
    solutionSteps: [
      "10110₂ = 1×16 + 0×8 + 1×4 + 1×2 + 0×1",
      "= 16 + 0 + 4 + 2 + 0 = 22.",
    ],
    shortcut: "Bit weights (right to left): 1, 2, 4, 8, 16. Multiply each bit and sum.",
  },
  {
    questionId: "math8_ch3_q3",
    topic: "math8_ch3", topicId: "math8_ch3",
    subtopic: "Place Value System",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Which mathematician first formally defined rules for arithmetic with zero?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "Brahmagupta", type: "correct", logicTag: "" },
      { text: "Pythagoras", type: "concept_error", logicTag: "greek_mathematician_confusion" },
      { text: "Archimedes", type: "concept_error", logicTag: "greek_mathematician_confusion" },
      { text: "Euclid", type: "concept_error", logicTag: "greek_mathematician_confusion" },
    ],
    solutionSteps: [
      "Brahmagupta (598–668 CE) wrote Brahmasphutasiddhanta (628 CE).",
      "He was the first to define rules: a + 0 = a, a × 0 = 0, a − 0 = a.",
      "He is credited as the first to treat zero as a number in its own right.",
    ],
    shortcut: "Brahmagupta — Indian mathematician, 628 CE — first systematic rules for zero.",
  },
  {
    questionId: "math8_ch3_q4",
    topic: "math8_ch3", topicId: "math8_ch3",
    subtopic: "Binary Conversion",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Convert 45 to binary.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "101101₂", type: "correct", logicTag: "" },
      { text: "101011₂", type: "calculation_error", logicTag: "bit_order_error" },
      { text: "110101₂", type: "calculation_error", logicTag: "wrong_division" },
      { text: "100101₂", type: "calculation_error", logicTag: "missed_middle_bit" },
    ],
    solutionSteps: [
      "45 ÷ 2 = 22 R 1",
      "22 ÷ 2 = 11 R 0",
      "11 ÷ 2 = 5  R 1",
      "5  ÷ 2 = 2  R 1",
      "2  ÷ 2 = 1  R 0",
      "1  ÷ 2 = 0  R 1",
      "Read remainders bottom-up: 101101₂.",
      "Verify: 32+8+4+1 = 45. ✓",
    ],
    shortcut: "Repeatedly divide by 2, read remainders bottom-to-top.",
  },
  {
    questionId: "math8_ch3_q5",
    topic: "math8_ch3", topicId: "math8_ch3",
    subtopic: "Number System History",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "The Babylonian number system used which base?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.7, marks: 1, isAIGenerated: true,
    options: [
      { text: "60", type: "correct", logicTag: "" },
      { text: "10", type: "concept_error", logicTag: "assumes_decimal" },
      { text: "12", type: "concept_error", logicTag: "confused_with_duodecimal" },
      { text: "20", type: "concept_error", logicTag: "confused_with_vigesimal" },
    ],
    solutionSteps: [
      "The Babylonian system is sexagesimal (base 60).",
      "Legacy: 60 seconds in a minute, 60 minutes in an hour, 360° in a circle (6×60).",
      "They used positional notation — the same symbol's value depended on its position.",
    ],
    shortcut: "Babylon = Base 60 = sexagesimal. Legacy visible in time and angles.",
  },

  // ── Chapter 4: Quadrilaterals ───────────────────────────────────────────────
  {
    questionId: "math8_ch4_q1",
    topic: "math8_ch4", topicId: "math8_ch4",
    subtopic: "Angle Sum",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Three angles of a quadrilateral are 75°, 90°, and 110°. Find the fourth angle.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "85°", type: "correct", logicTag: "" },
      { text: "95°", type: "calculation_error", logicTag: "used_270_instead_of_360" },
      { text: "75°", type: "calculation_error", logicTag: "arithmetic_error" },
      { text: "105°", type: "calculation_error", logicTag: "wrong_total" },
    ],
    solutionSteps: [
      "Sum of all angles in a quadrilateral = 360°.",
      "Fourth angle = 360° − 75° − 90° − 110° = 360° − 275° = 85°.",
    ],
    shortcut: "360° − sum of three known angles.",
  },
  {
    questionId: "math8_ch4_q2",
    topic: "math8_ch4", topicId: "math8_ch4",
    subtopic: "Parallelogram Properties",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "In a parallelogram ABCD, ∠A = 65°. What is ∠C?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "65°", type: "correct", logicTag: "" },
      { text: "115°", type: "concept_error", logicTag: "adjacent_not_opposite" },
      { text: "90°", type: "concept_error", logicTag: "assumed_rectangle" },
      { text: "130°", type: "calculation_error", logicTag: "doubled" },
    ],
    solutionSteps: [
      "In a parallelogram, opposite angles are equal.",
      "∠A and ∠C are opposite angles, so ∠C = ∠A = 65°.",
    ],
    shortcut: "Opposite angles of parallelogram are equal. ∠C = ∠A = 65°.",
  },
  {
    questionId: "math8_ch4_q3",
    topic: "math8_ch4", topicId: "math8_ch4",
    subtopic: "Rhombus",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "The diagonals of a rhombus are 20 cm and 48 cm. Find the side of the rhombus.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "26 cm", type: "correct", logicTag: "" },
      { text: "34 cm", type: "calculation_error", logicTag: "used_full_diagonals_not_half" },
      { text: "52 cm", type: "calculation_error", logicTag: "doubled_half_diagonal" },
      { text: "24 cm", type: "calculation_error", logicTag: "half_diagonal_only" },
    ],
    solutionSteps: [
      "Diagonals of a rhombus bisect each other at right angles.",
      "Half-diagonals: 10 cm and 24 cm.",
      "Side = √(10² + 24²) = √(100 + 576) = √676 = 26 cm.",
    ],
    shortcut: "Use Pythagoras on half-diagonals: √(10²+24²) = √676 = 26. (10,24,26) is a Pythagorean triple (multiple of 5,12,13).",
  },
  {
    questionId: "math8_ch4_q4",
    topic: "math8_ch4", topicId: "math8_ch4",
    subtopic: "Trapezium Area",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A trapezium has parallel sides 14 cm and 10 cm, and a height of 8 cm. Find its area.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "96 cm²", type: "correct", logicTag: "" },
      { text: "192 cm²", type: "calculation_error", logicTag: "forgot_half" },
      { text: "112 cm²", type: "calculation_error", logicTag: "only_one_parallel_side" },
      { text: "80 cm²", type: "calculation_error", logicTag: "wrong_height" },
    ],
    solutionSteps: [
      "Area of trapezium = ½ × (sum of parallel sides) × height.",
      "= ½ × (14 + 10) × 8 = ½ × 24 × 8 = 96 cm².",
    ],
    shortcut: "½ × (14+10) × 8 = 12 × 8 = 96 cm².",
  },
  {
    questionId: "math8_ch4_q5",
    topic: "math8_ch4", topicId: "math8_ch4",
    subtopic: "Quadrilateral Classification",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A quadrilateral has all sides equal but no angle equal to 90°. It is a:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.7, marks: 1, isAIGenerated: true,
    options: [
      { text: "Rhombus", type: "correct", logicTag: "" },
      { text: "Square", type: "concept_error", logicTag: "square_requires_90_degrees" },
      { text: "Rectangle", type: "concept_error", logicTag: "rectangle_sides_not_all_equal" },
      { text: "Kite", type: "concept_error", logicTag: "kite_not_all_sides_equal" },
    ],
    solutionSteps: [
      "All sides equal → either rhombus or square.",
      "Square requires all angles = 90°. Not given here.",
      "Rhombus: all sides equal; angles need not be 90°.",
      "Answer: Rhombus.",
    ],
    shortcut: "All sides equal + no 90° → rhombus. All sides equal + 90° → square.",
  },

  // ── Chapter 5: Number Play ──────────────────────────────────────────────────
  {
    questionId: "math8_ch5_q1",
    topic: "math8_ch5", topicId: "math8_ch5",
    subtopic: "Divisibility",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Which of the following numbers is divisible by 11?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.25, marks: 1, isAIGenerated: true,
    options: [
      { text: "29876", type: "correct", logicTag: "" },
      { text: "12345", type: "calculation_error", logicTag: "alt_sum_not_zero" },
      { text: "67891", type: "calculation_error", logicTag: "alt_sum_not_11" },
      { text: "54321", type: "calculation_error", logicTag: "alt_sum_not_divisible" },
    ],
    solutionSteps: [
      "Divisibility rule for 11: alternating sum from left.",
      "29876: 2−9+8−7+6 = 0. Divisible by 11. ✓",
      "12345: 1−2+3−4+5 = 3. Not divisible by 11.",
      "54321: 5−4+3−2+1 = 3. Not divisible by 11.",
    ],
    shortcut: "Alternating sum of digits = 0 or ±11 → divisible by 11.",
  },
  {
    questionId: "math8_ch5_q2",
    topic: "math8_ch5", topicId: "math8_ch5",
    subtopic: "HCF and LCM",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "The HCF of 72 and 120 is 24. What is their LCM?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "360", type: "correct", logicTag: "" },
      { text: "480", type: "calculation_error", logicTag: "wrong_product" },
      { text: "240", type: "calculation_error", logicTag: "halved_product" },
      { text: "720", type: "calculation_error", logicTag: "ignored_HCF" },
    ],
    solutionSteps: [
      "HCF × LCM = product of the two numbers.",
      "24 × LCM = 72 × 120 = 8640.",
      "LCM = 8640 / 24 = 360.",
    ],
    shortcut: "LCM = (product of numbers) / HCF = (72×120)/24 = 360.",
  },
  {
    questionId: "math8_ch5_q3",
    topic: "math8_ch5", topicId: "math8_ch5",
    subtopic: "Consecutive Numbers",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "The sum of three consecutive integers is 108. Find the largest integer.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "37", type: "correct", logicTag: "" },
      { text: "36", type: "calculation_error", logicTag: "found_middle_not_largest" },
      { text: "38", type: "calculation_error", logicTag: "off_by_one" },
      { text: "35", type: "calculation_error", logicTag: "found_smallest" },
    ],
    solutionSteps: [
      "Let the three consecutive integers be n, n+1, n+2.",
      "n + n+1 + n+2 = 108 → 3n + 3 = 108 → 3n = 105 → n = 35.",
      "Integers: 35, 36, 37. Largest = 37.",
    ],
    shortcut: "Middle integer = 108/3 = 36. Largest = 36 + 1 = 37.",
  },
  {
    questionId: "math8_ch5_q4",
    topic: "math8_ch5", topicId: "math8_ch5",
    subtopic: "Prime Factorisation",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Find the LCM of 84 and 90.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "1260", type: "correct", logicTag: "" },
      { text: "756", type: "calculation_error", logicTag: "used_HCF_method_incorrectly" },
      { text: "630", type: "calculation_error", logicTag: "halved_result" },
      { text: "7560", type: "calculation_error", logicTag: "multiplied_full_without_HCF" },
    ],
    solutionSteps: [
      "84 = 2² × 3 × 7.",
      "90 = 2 × 3² × 5.",
      "LCM = 2² × 3² × 5 × 7 = 4 × 9 × 5 × 7 = 1260.",
    ],
    shortcut: "LCM takes highest power of each prime: 2²×3²×5×7 = 1260.",
  },
  {
    questionId: "math8_ch5_q5",
    topic: "math8_ch5", topicId: "math8_ch5",
    subtopic: "Number Puzzles",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A two-digit number is such that the product of its digits is 14. If 45 is added to the number, the digits interchange. Find the number.",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "27", type: "correct", logicTag: "" },
      { text: "72", type: "concept_error", logicTag: "found_reversed_number" },
      { text: "14", type: "misinterpretation", logicTag: "product_confused_with_number" },
      { text: "47", type: "calculation_error", logicTag: "wrong_factor_pair" },
    ],
    solutionSteps: [
      "Let digits be a (tens) and b (units). Product: ab = 14.",
      "Factor pairs of 14: (1,14) not valid, (2,7) ✓, (7,2) ✓.",
      "Number = 10a+b. Adding 45 reverses digits: 10a+b+45 = 10b+a.",
      "9a − 9b = −45 → b − a = 5.",
      "If a=2, b=7: b−a = 5 ✓. Product = 14 ✓. Number = 27.",
    ],
    shortcut: "Try factor pairs of 14: (2,7) gives 27. 27+45=72 (reversed). ✓",
  },

  // ── Chapter 6: We Distribute, Yet Things Multiply ───────────────────────────
  {
    questionId: "math8_ch6_q1",
    topic: "math8_ch6", topicId: "math8_ch6",
    subtopic: "Algebraic Identities",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Expand (3x + 4y)².",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "9x² + 24xy + 16y²", type: "correct", logicTag: "" },
      { text: "9x² + 16y²", type: "concept_error", logicTag: "missing_middle_term" },
      { text: "9x² − 24xy + 16y²", type: "concept_error", logicTag: "wrong_sign_middle" },
      { text: "3x² + 12xy + 4y²", type: "calculation_error", logicTag: "forgot_to_square_coefficients" },
    ],
    solutionSteps: [
      "Use (a+b)² = a²+2ab+b² with a=3x, b=4y.",
      "(3x)² + 2(3x)(4y) + (4y)² = 9x² + 24xy + 16y².",
    ],
    shortcut: "Square first term, double the product, square last term.",
  },
  {
    questionId: "math8_ch6_q2",
    topic: "math8_ch6", topicId: "math8_ch6",
    subtopic: "Mental Computation with Identities",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Using an algebraic identity, evaluate 97 × 103.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.25, marks: 1, isAIGenerated: true,
    options: [
      { text: "9991", type: "correct", logicTag: "" },
      { text: "9909", type: "calculation_error", logicTag: "subtracted_instead_of_using_identity" },
      { text: "10000", type: "calculation_error", logicTag: "ignored_difference" },
      { text: "9801", type: "concept_error", logicTag: "computed_97_squared" },
    ],
    solutionSteps: [
      "97 × 103 = (100 − 3)(100 + 3) = 100² − 3² = 10000 − 9 = 9991.",
    ],
    shortcut: "(a−b)(a+b) = a²−b². Use a=100, b=3.",
  },
  {
    questionId: "math8_ch6_q3",
    topic: "math8_ch6", topicId: "math8_ch6",
    subtopic: "Factorisation",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Factorise: 49x² − 64y².",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "(7x + 8y)(7x − 8y)", type: "correct", logicTag: "" },
      { text: "(7x − 8y)²", type: "concept_error", logicTag: "perfect_square_confusion" },
      { text: "(49x − 64y)(x + y)", type: "calculation_error", logicTag: "wrong_factorisation" },
      { text: "(7x + 8y)²", type: "concept_error", logicTag: "square_instead_of_difference" },
    ],
    solutionSteps: [
      "49x² = (7x)²; 64y² = (8y)².",
      "This is a difference of squares: a²−b² = (a+b)(a−b).",
      "49x² − 64y² = (7x + 8y)(7x − 8y).",
    ],
    shortcut: "a²−b² = (a+b)(a−b). Identify a=7x, b=8y.",
  },
  {
    questionId: "math8_ch6_q4",
    topic: "math8_ch6", topicId: "math8_ch6",
    subtopic: "Factorisation by Grouping",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Factorise: 6xy − 4y + 9x − 6.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "(3x − 2)(2y + 3)", type: "correct", logicTag: "" },
      { text: "(2x + 3)(3y − 2)", type: "calculation_error", logicTag: "wrong_grouping" },
      { text: "(6x − 4)(y + 1)", type: "calculation_error", logicTag: "incorrect_factor" },
      { text: "(3x + 2)(2y − 3)", type: "calculation_error", logicTag: "sign_error" },
    ],
    solutionSteps: [
      "Group: (6xy − 4y) + (9x − 6).",
      "= 2y(3x − 2) + 3(3x − 2).",
      "= (3x − 2)(2y + 3).",
    ],
    shortcut: "Group in pairs → common bracket (3x−2) appears in both.",
  },
  {
    questionId: "math8_ch6_q5",
    topic: "math8_ch6", topicId: "math8_ch6",
    subtopic: "Division of Polynomials",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Divide (x² − 5x + 6) by (x − 2).",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 1, isAIGenerated: true,
    options: [
      { text: "x − 3", type: "correct", logicTag: "" },
      { text: "x + 3", type: "concept_error", logicTag: "sign_error_in_factorisation" },
      { text: "x − 2", type: "concept_error", logicTag: "divided_by_same_factor" },
      { text: "x² − 3", type: "concept_error", logicTag: "degree_not_reduced" },
    ],
    solutionSteps: [
      "Factorise numerator: x²−5x+6 = (x−2)(x−3).",
      "(x−2)(x−3) ÷ (x−2) = x−3.",
    ],
    shortcut: "Factorise and cancel. x²−5x+6 = (x−2)(x−3).",
  },

  // ── Chapter 7: Proportional Reasoning - 1 ───────────────────────────────────
  {
    questionId: "math8_ch7_q1",
    topic: "math8_ch7", topicId: "math8_ch7",
    subtopic: "Direct Proportion",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "If 12 pens cost ₹156, how much do 20 pens cost?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "₹260", type: "correct", logicTag: "" },
      { text: "₹240", type: "calculation_error", logicTag: "wrong_unit_price" },
      { text: "₹280", type: "calculation_error", logicTag: "arithmetic_error" },
      { text: "₹312", type: "calculation_error", logicTag: "doubled_original" },
    ],
    solutionSteps: [
      "Cost ∝ number of pens (direct proportion).",
      "Cost per pen = 156/12 = ₹13.",
      "Cost of 20 pens = 13 × 20 = ₹260.",
    ],
    shortcut: "Unit price = 156/12 = 13. Then 13 × 20 = 260.",
  },
  {
    questionId: "math8_ch7_q2",
    topic: "math8_ch7", topicId: "math8_ch7",
    subtopic: "Inverse Proportion",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "6 workers finish a job in 10 days. How many days do 15 workers take?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "4 days", type: "correct", logicTag: "" },
      { text: "25 days", type: "concept_error", logicTag: "treated_as_direct" },
      { text: "6 days", type: "calculation_error", logicTag: "arithmetic_error" },
      { text: "3 days", type: "calculation_error", logicTag: "over_divided" },
    ],
    solutionSteps: [
      "More workers → fewer days → INVERSE proportion.",
      "6 × 10 = 15 × d → d = 60/15 = 4 days.",
    ],
    shortcut: "x₁y₁ = x₂y₂: 6×10 = 15×d → d = 4.",
  },
  {
    questionId: "math8_ch7_q3",
    topic: "math8_ch7", topicId: "math8_ch7",
    subtopic: "Ratio",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "Divide ₹8400 in the ratio 3:4.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "₹3600 and ₹4800", type: "correct", logicTag: "" },
      { text: "₹3000 and ₹4000", type: "calculation_error", logicTag: "wrong_total_parts" },
      { text: "₹4200 and ₹4200", type: "concept_error", logicTag: "split_equally" },
      { text: "₹2400 and ₹6000", type: "calculation_error", logicTag: "wrong_ratio_applied" },
    ],
    solutionSteps: [
      "Total parts = 3 + 4 = 7.",
      "First share = (3/7) × 8400 = 3600.",
      "Second share = (4/7) × 8400 = 4800.",
      "Check: 3600 + 4800 = 8400. ✓",
    ],
    shortcut: "Total parts = 7. Each part = 8400/7 = 1200. Shares: 3×1200=3600, 4×1200=4800.",
  },
  {
    questionId: "math8_ch7_q4",
    topic: "math8_ch7", topicId: "math8_ch7",
    subtopic: "Continued Proportion",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "If 4, x, 36 are in continued proportion, find x.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "12", type: "correct", logicTag: "" },
      { text: "9", type: "calculation_error", logicTag: "wrong_geometric_mean" },
      { text: "18", type: "calculation_error", logicTag: "arithmetic_mean_used" },
      { text: "16", type: "calculation_error", logicTag: "added_not_multiplied" },
    ],
    solutionSteps: [
      "For continued proportion a, b, c: b² = ac.",
      "x² = 4 × 36 = 144.",
      "x = √144 = 12.",
    ],
    shortcut: "b is geometric mean of a and c: b = √(ac) = √(4×36) = √144 = 12.",
  },
  {
    questionId: "math8_ch7_q5",
    topic: "math8_ch7", topicId: "math8_ch7",
    subtopic: "Identifying Proportion Type",
    subject: "Mathematics", grade: "8", examBoard: "CBSE",
    questionText: "A train covers a fixed distance. As speed increases from 60 km/h to 90 km/h, the time taken changes from 6 hours to how many hours?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.7, marks: 1, isAIGenerated: true,
    options: [
      { text: "4 hours", type: "correct", logicTag: "" },
      { text: "9 hours", type: "concept_error", logicTag: "treated_as_direct" },
      { text: "3 hours", type: "calculation_error", logicTag: "halved_not_scaled" },
      { text: "5 hours", type: "calculation_error", logicTag: "arithmetic_error" },
    ],
    solutionSteps: [
      "Fixed distance: speed and time are inversely proportional.",
      "60 × 6 = 90 × t → 360 = 90t → t = 4 hours.",
    ],
    shortcut: "Distance = speed × time = constant. 60×6=360=90×t → t=4.",
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

  console.log(`\nSeeded ${questions.length} questions for Class 8 Math (Ch 1–7).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
