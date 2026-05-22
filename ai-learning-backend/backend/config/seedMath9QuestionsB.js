import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";

dotenv.config();

const questions = [
  // ── Chapter 5: Circles ──────────────────────────────────────────────────
  {
    questionId: "math9_ch5_q1",
    topic: "math9_ch5", topicId: "math9_ch5",
    subtopic: "Perpendicular from centre",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "A chord AB of a circle has length 24 cm. The perpendicular from centre O to AB meets it at M. If OM = 5 cm, find the radius of the circle.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "13 cm", type: "correct", logicTag: "" },
      { text: "12 cm", type: "concept_error", logicTag: "used_full_chord_not_half" },
      { text: "10 cm", type: "calculation_error", logicTag: "forgot_half_chord" },
      { text: "17 cm", type: "calculation_error", logicTag: "added_not_pythagoras" },
    ],
    solutionSteps: [
      "Perp from centre bisects chord: AM = AB/2 = 12 cm.",
      "OA² = OM² + AM² = 25 + 144 = 169.",
      "OA = 13 cm = radius.",
    ],
    shortcut: "Form right triangle: r² = (half-chord)² + (distance from centre)².",
  },
  {
    questionId: "math9_ch5_q2",
    topic: "math9_ch5", topicId: "math9_ch5",
    subtopic: "Inscribed angle theorem",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "An arc subtends an angle of 100° at the centre. What angle does it subtend at any point on the major arc?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.3, marks: 1, isAIGenerated: true,
    options: [
      { text: "50°", type: "correct", logicTag: "" },
      { text: "100°", type: "concept_error", logicTag: "confused_centre_and_circumference" },
      { text: "200°", type: "calculation_error", logicTag: "doubled_instead_of_halved" },
      { text: "80°", type: "concept_error", logicTag: "subtracted_from_130" },
    ],
    solutionSteps: [
      "Inscribed angle = (1/2) × central angle.",
      "= 100°/2 = 50°.",
    ],
    shortcut: "Angle at circumference = half the central angle for the same arc.",
  },
  {
    questionId: "math9_ch5_q3",
    topic: "math9_ch5", topicId: "math9_ch5",
    subtopic: "Cyclic quadrilateral",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "PQRS is a cyclic quadrilateral. If ∠P = 75°, find ∠R.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.3, marks: 1, isAIGenerated: true,
    options: [
      { text: "75°", type: "concept_error", logicTag: "assumed_equal_opposite_angles" },
      { text: "105°", type: "correct", logicTag: "" },
      { text: "90°", type: "misinterpretation", logicTag: "assumed_right_angle" },
      { text: "115°", type: "calculation_error", logicTag: "wrong_subtraction" },
    ],
    solutionSteps: [
      "Opposite angles of cyclic quadrilateral are supplementary.",
      "∠P + ∠R = 180° → 75° + ∠R = 180° → ∠R = 105°.",
    ],
    shortcut: "Cyclic quad: opposite angles add to 180°.",
  },
  {
    questionId: "math9_ch5_q4",
    topic: "math9_ch5", topicId: "math9_ch5",
    subtopic: "Angle in semicircle",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "AB is a diameter of a circle and C is a point on the circle. What is ∠ACB?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "45°", type: "misinterpretation", logicTag: "assumed_half_of_90" },
      { text: "60°", type: "misinterpretation", logicTag: "assumed_equilateral" },
      { text: "90°", type: "correct", logicTag: "" },
      { text: "180°", type: "concept_error", logicTag: "confused_with_straight_line" },
    ],
    solutionSteps: [
      "AB is a diameter → arc AB subtends 180° at centre.",
      "Angle at circumference = 180°/2 = 90°.",
      "∠ACB = 90° (angle in a semicircle).",
    ],
    shortcut: "Angle in a semicircle is always 90°.",
  },
  {
    questionId: "math9_ch5_q5",
    topic: "math9_ch5", topicId: "math9_ch5",
    subtopic: "Equal chords",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Two chords of a circle are equal. What can you say about their distances from the centre?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.25, marks: 1, isAIGenerated: true,
    options: [
      { text: "The longer chord is closer to the centre", type: "concept_error", logicTag: "inverted_relationship" },
      { text: "They are equidistant from the centre", type: "correct", logicTag: "" },
      { text: "One distance is double the other", type: "misinterpretation", logicTag: "wrong_relationship" },
      { text: "Cannot be determined", type: "concept_error", logicTag: "forgot_theorem" },
    ],
    solutionSteps: [
      "Theorem: Equal chords are equidistant from the centre.",
      "Conversely, chords equidistant from centre are equal.",
    ],
    shortcut: "Equal chords ↔ equal distances from centre (two-way theorem).",
  },

  // ── Chapter 6: Perimeter and Area ───────────────────────────────────────
  {
    questionId: "math9_ch6_q1",
    topic: "math9_ch6", topicId: "math9_ch6",
    subtopic: "Heron's formula",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Find the area of a triangle with sides 3 cm, 4 cm, and 5 cm using Heron's formula.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "5 cm²", type: "calculation_error", logicTag: "wrong_heron_computation" },
      { text: "6 cm²", type: "correct", logicTag: "" },
      { text: "7.5 cm²", type: "calculation_error", logicTag: "used_wrong_formula" },
      { text: "12 cm²", type: "calculation_error", logicTag: "used_perimeter_as_area" },
    ],
    solutionSteps: [
      "s = (3+4+5)/2 = 6.",
      "A = √[6(6−3)(6−4)(6−5)] = √[6×3×2×1] = √36 = 6 cm².",
    ],
    shortcut: "3-4-5 is a right triangle: A = ½×3×4 = 6 cm² (same result, quicker check).",
  },
  {
    questionId: "math9_ch6_q2",
    topic: "math9_ch6", topicId: "math9_ch6",
    subtopic: "Arc length",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Find the arc length of a sector with radius 7 cm and central angle 90°. (Use π = 22/7)",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "11 cm", type: "correct", logicTag: "" },
      { text: "22 cm", type: "calculation_error", logicTag: "forgot_angle_fraction" },
      { text: "44 cm", type: "calculation_error", logicTag: "used_full_circumference" },
      { text: "7 cm", type: "calculation_error", logicTag: "used_radius_as_arc" },
    ],
    solutionSteps: [
      "Arc length = (θ/360°) × 2πr",
      "= (90/360) × 2 × (22/7) × 7",
      "= (1/4) × 44 = 11 cm.",
    ],
    shortcut: "90° = quarter of circle. Arc = C/4 = 2πr/4.",
  },
  {
    questionId: "math9_ch6_q3",
    topic: "math9_ch6", topicId: "math9_ch6",
    subtopic: "Sector area",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Find the area of a sector with radius 6 cm and central angle 60°. (Use π = 22/7)",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.45, marks: 1, isAIGenerated: true,
    options: [
      { text: "132/7 cm²", type: "calculation_error", logicTag: "wrong_fraction" },
      { text: "132/7 cm²", type: "calculation_error", logicTag: "wrong_fraction" },
      { text: "18.86 cm² (approx)", type: "correct", logicTag: "" },
      { text: "36π cm²", type: "concept_error", logicTag: "used_full_circle_area" },
    ],
    solutionSteps: [
      "Sector area = (θ/360°) × πr²",
      "= (60/360) × (22/7) × 36",
      "= (1/6) × (22×36/7) = (1/6) × (792/7) = 132/7 ≈ 18.86 cm².",
    ],
    shortcut: "60° = 1/6 of full circle. Area = πr²/6.",
  },
  {
    questionId: "math9_ch6_q4",
    topic: "math9_ch6", topicId: "math9_ch6",
    subtopic: "Heron's formula semi-perimeter",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "A triangle has sides 13 cm, 14 cm, 15 cm. What is its semi-perimeter?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.15, marks: 1, isAIGenerated: true,
    options: [
      { text: "42 cm", type: "concept_error", logicTag: "used_perimeter_not_semi" },
      { text: "21 cm", type: "correct", logicTag: "" },
      { text: "20 cm", type: "calculation_error", logicTag: "wrong_sum" },
      { text: "14 cm", type: "misinterpretation", logicTag: "used_middle_side" },
    ],
    solutionSteps: [
      "Perimeter = 13 + 14 + 15 = 42 cm.",
      "Semi-perimeter s = 42/2 = 21 cm.",
    ],
    shortcut: "s = (sum of all sides) ÷ 2.",
  },
  {
    questionId: "math9_ch6_q5",
    topic: "math9_ch6", topicId: "math9_ch6",
    subtopic: "Circle area",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "The circumference of a circle is 44 cm. Find its area. (Use π = 22/7)",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "154 cm²", type: "correct", logicTag: "" },
      { text: "176 cm²", type: "calculation_error", logicTag: "wrong_radius" },
      { text: "44 cm²", type: "concept_error", logicTag: "used_circumference_as_area" },
      { text: "616 cm²", type: "calculation_error", logicTag: "used_diameter_as_radius" },
    ],
    solutionSteps: [
      "2πr = 44 → r = 44/(2 × 22/7) = 44 × 7/44 = 7 cm.",
      "Area = πr² = (22/7) × 49 = 22 × 7 = 154 cm².",
    ],
    shortcut: "From circumference, find r first: r = C/(2π). Then area = πr².",
  },

  // ── Chapter 7: Probability ──────────────────────────────────────────────
  {
    questionId: "math9_ch7_q1",
    topic: "math9_ch7", topicId: "math9_ch7",
    subtopic: "Basic probability",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "A fair die is rolled once. What is the probability of getting a prime number?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.25, marks: 1, isAIGenerated: true,
    options: [
      { text: "1/6", type: "calculation_error", logicTag: "counted_only_one_prime" },
      { text: "1/3", type: "calculation_error", logicTag: "counted_two_primes" },
      { text: "1/2", type: "correct", logicTag: "" },
      { text: "2/3", type: "calculation_error", logicTag: "overcounted_primes" },
    ],
    solutionSteps: [
      "Sample space = {1,2,3,4,5,6}. |S| = 6.",
      "Primes = {2, 3, 5}. Count = 3.",
      "P(prime) = 3/6 = 1/2.",
    ],
    shortcut: "Primes on a die: 2, 3, 5 — exactly three out of six.",
  },
  {
    questionId: "math9_ch7_q2",
    topic: "math9_ch7", topicId: "math9_ch7",
    subtopic: "Complement rule",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "If P(E) = 3/7, what is P(not E)?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "3/7", type: "concept_error", logicTag: "same_probability" },
      { text: "4/7", type: "correct", logicTag: "" },
      { text: "7/3", type: "concept_error", logicTag: "inverted_fraction" },
      { text: "1/7", type: "calculation_error", logicTag: "wrong_subtraction" },
    ],
    solutionSteps: [
      "P(not E) = 1 − P(E) = 1 − 3/7 = 4/7.",
    ],
    shortcut: "P(E') = 1 − P(E). Always.",
  },
  {
    questionId: "math9_ch7_q3",
    topic: "math9_ch7", topicId: "math9_ch7",
    subtopic: "Impossible and certain events",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "What is the probability of getting a 7 when rolling a standard die?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.1, marks: 1, isAIGenerated: true,
    options: [
      { text: "1/6", type: "concept_error", logicTag: "confused_with_regular_outcome" },
      { text: "7/6", type: "concept_error", logicTag: "probability_exceeds_1" },
      { text: "0", type: "correct", logicTag: "" },
      { text: "1", type: "concept_error", logicTag: "treated_as_certain" },
    ],
    solutionSteps: [
      "A standard die has faces {1,2,3,4,5,6}. 7 is not a possible outcome.",
      "P(7) = 0/6 = 0 (impossible event).",
    ],
    shortcut: "Outcome not in sample space → P = 0.",
  },
  {
    questionId: "math9_ch7_q4",
    topic: "math9_ch7", topicId: "math9_ch7",
    subtopic: "Card probability",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "One card is drawn from a pack of 52 cards. What is the probability it is a king?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "1/52", type: "calculation_error", logicTag: "counted_one_king_only" },
      { text: "1/13", type: "correct", logicTag: "" },
      { text: "4/52 simplified wrong", type: "calculation_error", logicTag: "wrong_simplification" },
      { text: "1/4", type: "concept_error", logicTag: "confused_suit_with_rank" },
    ],
    solutionSteps: [
      "Total cards = 52. Kings = 4 (one per suit).",
      "P(king) = 4/52 = 1/13.",
    ],
    shortcut: "Each rank (king, queen, etc.) has 4 cards → P = 4/52 = 1/13.",
  },
  {
    questionId: "math9_ch7_q5",
    topic: "math9_ch7", topicId: "math9_ch7",
    subtopic: "Experimental probability",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "A coin is tossed 500 times and tails appears 280 times. Find the experimental probability of tails.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "0.5", type: "concept_error", logicTag: "used_theoretical_not_experimental" },
      { text: "0.56", type: "correct", logicTag: "" },
      { text: "0.44", type: "calculation_error", logicTag: "calculated_heads_probability" },
      { text: "280", type: "concept_error", logicTag: "gave_frequency_not_probability" },
    ],
    solutionSteps: [
      "Experimental P(tails) = frequency / total trials = 280/500 = 0.56.",
    ],
    shortcut: "Experimental probability = (times event occurred) ÷ (total trials).",
  },

  // ── Chapter 8: Sequences and Progressions ───────────────────────────────
  {
    questionId: "math9_ch8_q1",
    topic: "math9_ch8", topicId: "math9_ch8",
    subtopic: "AP nth term",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Find the 10th term of the AP: 2, 5, 8, 11, …",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.25, marks: 1, isAIGenerated: true,
    options: [
      { text: "29", type: "correct", logicTag: "" },
      { text: "30", type: "calculation_error", logicTag: "used_n_instead_of_n_minus_1" },
      { text: "27", type: "calculation_error", logicTag: "off_by_one" },
      { text: "32", type: "calculation_error", logicTag: "added_wrong_number_of_d" },
    ],
    solutionSteps: [
      "a = 2, d = 3.",
      "T₁₀ = a + (10−1)d = 2 + 9×3 = 2 + 27 = 29.",
    ],
    shortcut: "Tₙ = a + (n−1)d. Use (n−1), not n.",
  },
  {
    questionId: "math9_ch8_q2",
    topic: "math9_ch8", topicId: "math9_ch8",
    subtopic: "AP sum",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Find the sum of first 10 terms of the AP: 1, 3, 5, 7, …",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.35, marks: 1, isAIGenerated: true,
    options: [
      { text: "55", type: "calculation_error", logicTag: "summed_11_terms" },
      { text: "100", type: "correct", logicTag: "" },
      { text: "90", type: "calculation_error", logicTag: "wrong_last_term" },
      { text: "50", type: "concept_error", logicTag: "divided_by_extra_2" },
    ],
    solutionSteps: [
      "a = 1, d = 2, n = 10.",
      "S₁₀ = 10/2 × [2(1) + (10−1)(2)] = 5 × [2 + 18] = 5 × 20 = 100.",
    ],
    shortcut: "Sum of first n odd numbers = n². Here n=10, so S = 100.",
  },
  {
    questionId: "math9_ch8_q3",
    topic: "math9_ch8", topicId: "math9_ch8",
    subtopic: "GP nth term",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Find the 5th term of the GP: 3, 6, 12, 24, …",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.3, marks: 1, isAIGenerated: true,
    options: [
      { text: "36", type: "concept_error", logicTag: "added_common_difference" },
      { text: "48", type: "correct", logicTag: "" },
      { text: "96", type: "calculation_error", logicTag: "computed_6th_term" },
      { text: "32", type: "calculation_error", logicTag: "wrong_ratio" },
    ],
    solutionSteps: [
      "a = 3, r = 2.",
      "T₅ = ar⁴ = 3 × 2⁴ = 3 × 16 = 48.",
    ],
    shortcut: "Tₙ = arⁿ⁻¹. Exponent is n−1, not n.",
  },
  {
    questionId: "math9_ch8_q4",
    topic: "math9_ch8", topicId: "math9_ch8",
    subtopic: "Infinite GP sum",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "Find the sum of the infinite GP: 1 + 1/3 + 1/9 + 1/27 + …",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "1", type: "concept_error", logicTag: "confused_with_first_term" },
      { text: "2/3", type: "calculation_error", logicTag: "computed_1_minus_r" },
      { text: "3/2", type: "correct", logicTag: "" },
      { text: "3", type: "calculation_error", logicTag: "forgot_denominator" },
    ],
    solutionSteps: [
      "a = 1, r = 1/3. |r| < 1 → sum converges.",
      "S∞ = a/(1−r) = 1/(1 − 1/3) = 1/(2/3) = 3/2.",
    ],
    shortcut: "S∞ = a/(1−r). Check |r|<1 first.",
  },
  {
    questionId: "math9_ch8_q5",
    topic: "math9_ch8", topicId: "math9_ch8",
    subtopic: "Common difference",
    subject: "Mathematics", grade: "9", examBoard: "CBSE",
    questionText: "In an AP, the 3rd term is 12 and the 7th term is 24. Find the common difference.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.4, marks: 1, isAIGenerated: true,
    options: [
      { text: "2", type: "calculation_error", logicTag: "divided_by_wrong_number" },
      { text: "3", type: "correct", logicTag: "" },
      { text: "4", type: "calculation_error", logicTag: "off_by_one_in_gap" },
      { text: "6", type: "concept_error", logicTag: "took_difference_not_per_step" },
    ],
    solutionSteps: [
      "T₇ − T₃ = (7−3)d = 4d.",
      "24 − 12 = 12 = 4d → d = 3.",
    ],
    shortcut: "Difference between Tₘ and Tₙ = (m−n)d. Divide to get d.",
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

  console.log(`\nSeeded ${questions.length} questions for Math9 ch5–ch8. (${inserted} inserted / ${updated} updated)`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
