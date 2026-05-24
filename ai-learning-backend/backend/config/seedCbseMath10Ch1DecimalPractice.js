/**
 * Seed 7 practice questions for cbse_math10_ch1_decimal_expansions (p1–p7).
 *
 * Matches the _pN pattern used by the other Ch1 practice sets
 * (euclid_division_lemma p1–p7, lcm_and_hcf p1–p8, etc.).
 *
 * Mix:
 *   p1 — easy   MCQ      Identify terminating fraction from options
 *   p2 — easy   numeric  Express terminating decimal as fraction (give numerator)
 *   p3 — medium MCQ      Classify expansion of 13/3125
 *   p4 — medium free_text  Justify non-terminating expansion of 29/343
 *   p5 — medium free_text  Convert 0.̄2̄3 (= 0.232323…) to p/q
 *   p6 — hard   free_text  Prove 17/125 terminates; find the decimal
 *   p7 — hard   free_text  Critique flawed student reasoning; verify
 *
 * Usage: node config/seedCbseMath10Ch1DecimalPractice.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
dotenv.config();

const BASE = "cbse_math10_ch1_decimal_expansions";

const questions = [
  /* ── p1  easy MCQ ────────────────────────────────────────────────────── */
  {
    questionId:      `q_${BASE}_p1_mcq`,
    topicId:         `${BASE}_p1`,
    subject:         "Mathematics",
    grade:           "10",
    chapterNumber:   1,
    topic:           "Real Numbers",
    questionType:    "mcq",
    questionText:    "Which of the following fractions has a TERMINATING decimal expansion?",
    options: [
      { text: "3/7",   type: "concept_error", logicTag: `${BASE}_denom_not_2_5` },
      { text: "5/12",  type: "concept_error", logicTag: `${BASE}_denom_not_2_5` },
      { text: "7/80",  type: "correct",       logicTag: null },
      { text: "11/42", type: "concept_error", logicTag: `${BASE}_denom_not_2_5` },
    ],
    correctAnswer:   null,
    difficulty:      "easy",
    difficultyScore: 0.25,
    marks:           1,
    negativeMarks:   0,
    expectedTime:    30,
    bloomLevel:      "recall",
    conceptTested:   "Termination condition: denominator = 2ᵐ × 5ⁿ",
    examBoard:       "CBSE",
    isAIGenerated:   true,
    isFlagged:       false,
    isPYQ:           false,
    pyqYear:         null,
    mixingType:      "single_topic",
    prerequisites:   [],
    hintLevels:      [
      "Check the prime factorisation of each denominator.",
      "A fraction terminates iff its denominator (in lowest terms) has only 2s and 5s as prime factors.",
    ],
    solutionSteps:   [
      "Check each denominator in lowest terms.",
      "3/7: denom = 7 (prime, ≠ 2 or 5) → non-terminating.",
      "5/12: 12 = 2² × 3 (has factor 3) → non-terminating.",
      "7/80: 80 = 2⁴ × 5 (only 2s and 5s) → TERMINATING. ✓",
      "11/42: 42 = 2 × 3 × 7 (has 3 and 7) → non-terminating.",
    ],
    stepByStep: [
      { stepNumber: 1, clean: "Factorise each denominator.", voice: "" },
      { stepNumber: 2, clean: "7/80: 80 = 2⁴ × 5 → terminates.", voice: "" },
    ],
    timeThresholds:  { guessBelow: 6, expectedMin: 10, expectedMax: 45, stuckAbove: 90 },
    routing:         { ifCorrect: "next_difficulty_up", ifWrong: null, ifStuck: null, flukeCheckQuestionId: null },
  },

  /* ── p2  easy numeric ─────────────────────────────────────────────────── */
  {
    questionId:      `q_${BASE}_p2_numeric`,
    topicId:         `${BASE}_p2`,
    subject:         "Mathematics",
    grade:           "10",
    chapterNumber:   1,
    topic:           "Real Numbers",
    questionType:    "numeric",
    questionText:    "Express 0.625 as a fraction in its simplest form. What is the numerator?",
    options:         [],
    correctAnswer:   "5",
    difficulty:      "easy",
    difficultyScore: 0.3,
    marks:           1,
    negativeMarks:   0,
    expectedTime:    40,
    bloomLevel:      "apply",
    conceptTested:   "Converting terminating decimal to fraction",
    examBoard:       "CBSE",
    isAIGenerated:   true,
    isFlagged:       false,
    isPYQ:           false,
    pyqYear:         null,
    mixingType:      "single_topic",
    prerequisites:   [],
    hintLevels:      [
      "0.625 has 3 decimal places → write over 1000.",
      "625/1000 — now simplify by dividing by GCD.",
    ],
    solutionSteps:   [
      "0.625 = 625/1000.",
      "GCD(625, 1000): 625 = 5⁴, 1000 = 2³ × 5³ → GCD = 5³ = 125.",
      "625/1000 = 5/8.",
      "Numerator = 5.",
    ],
    stepByStep: [
      { stepNumber: 1, clean: "625/1000 → divide by 125 → 5/8.", voice: "" },
    ],
    timeThresholds:  { guessBelow: 8, expectedMin: 15, expectedMax: 60, stuckAbove: 120 },
    routing:         { ifCorrect: "next_difficulty_up", ifWrong: null, ifStuck: null, flukeCheckQuestionId: null },
  },

  /* ── p3  medium MCQ ───────────────────────────────────────────────────── */
  {
    questionId:      `q_${BASE}_p3_mcq`,
    topicId:         `${BASE}_p3`,
    subject:         "Mathematics",
    grade:           "10",
    chapterNumber:   1,
    topic:           "Real Numbers",
    questionType:    "mcq",
    questionText:    "The decimal expansion of 13/3125 is:",
    options: [
      { text: "Terminating",                    type: "correct",       logicTag: null },
      { text: "Non-terminating, repeating",     type: "concept_error", logicTag: `${BASE}_denom_not_2_5` },
      { text: "Non-terminating, non-repeating", type: "concept_error", logicTag: `${BASE}_denom_not_2_5` },
      { text: "Cannot be determined",           type: "concept_error", logicTag: `${BASE}_denom_not_2_5` },
    ],
    correctAnswer:   null,
    difficulty:      "medium",
    difficultyScore: 0.5,
    marks:           1,
    negativeMarks:   0,
    expectedTime:    45,
    bloomLevel:      "apply",
    conceptTested:   "Termination condition applied to a power-of-5 denominator",
    examBoard:       "CBSE",
    isAIGenerated:   true,
    isFlagged:       false,
    isPYQ:           false,
    pyqYear:         null,
    mixingType:      "single_topic",
    prerequisites:   [],
    hintLevels:      [
      "Factorise 3125.",
      "3125 = 5⁵. Does it have any prime factor other than 2 or 5?",
    ],
    solutionSteps:   [
      "3125 = 5⁵.",
      "Denominator in lowest terms (GCD(13,3125)=1) = 5⁵ = 2⁰ × 5⁵.",
      "Only prime factors are 2 and 5 → decimal expansion TERMINATES.",
      "Verification: 13/3125 = 13 × 2⁵ / (5⁵ × 2⁵) = 416/100000 = 0.00416.",
    ],
    stepByStep: [
      { stepNumber: 1, clean: "3125 = 5⁵ → only 2s and 5s → terminates.", voice: "" },
      { stepNumber: 2, clean: "13/3125 = 0.00416.", voice: "" },
    ],
    timeThresholds:  { guessBelow: 8, expectedMin: 20, expectedMax: 60, stuckAbove: 120 },
    routing:         { ifCorrect: "next_difficulty_up", ifWrong: null, ifStuck: null, flukeCheckQuestionId: null },
  },

  /* ── p4  medium free_text ─────────────────────────────────────────────── */
  {
    questionId:      `q_${BASE}_p4_freetext`,
    topicId:         `${BASE}_p4`,
    subject:         "Mathematics",
    grade:           "10",
    chapterNumber:   1,
    topic:           "Real Numbers",
    questionType:    "free_text",
    questionText:    "Without actual division, determine whether 29/343 has a terminating or non-terminating decimal expansion. Justify your answer.",
    options:         [],
    correctAnswer:   null,
    difficulty:      "medium",
    difficultyScore: 0.55,
    marks:           2,
    negativeMarks:   0,
    expectedTime:    120,
    bloomLevel:      "apply",
    conceptTested:   "Applying termination theorem — non-2/5 denominator",
    examBoard:       "CBSE",
    isAIGenerated:   true,
    isFlagged:       false,
    isPYQ:           false,
    pyqYear:         null,
    mixingType:      "single_topic",
    prerequisites:   [],
    hintLevels:      [
      "First check: is 29/343 already in lowest terms?",
      "Factorise 343.",
    ],
    solutionSteps:   [
      "Step 1: Check if fraction is in lowest terms. GCD(29, 343): 29 is prime; 343 = 7³. Since 29 ≠ 7, GCD = 1. Already in lowest terms.",
      "Step 2: Factorise denominator. 343 = 7³.",
      "Step 3: Apply theorem. The denominator 7³ contains the prime factor 7, which is neither 2 nor 5.",
      "Conclusion: 29/343 has a NON-TERMINATING, repeating decimal expansion.",
    ],
    stepByStep: [
      { stepNumber: 1, clean: "GCD(29,343) = 1 → already in lowest terms.", voice: "" },
      { stepNumber: 2, clean: "343 = 7³ → prime factor 7 (≠ 2,5).", voice: "" },
      { stepNumber: 3, clean: "Non-terminating, repeating decimal.", voice: "" },
    ],
    timeThresholds:  { guessBelow: 15, expectedMin: 45, expectedMax: 150, stuckAbove: 240 },
    routing:         { ifCorrect: "next_difficulty_up", ifWrong: null, ifStuck: null, flukeCheckQuestionId: null },
  },

  /* ── p5  medium free_text ─────────────────────────────────────────────── */
  {
    questionId:      `q_${BASE}_p5_freetext`,
    topicId:         `${BASE}_p5`,
    subject:         "Mathematics",
    grade:           "10",
    chapterNumber:   1,
    topic:           "Real Numbers",
    questionType:    "free_text",
    questionText:    "Express the recurring decimal 0.2323… (i.e. 0.̄2̄3) as a fraction p/q in simplest form.",
    options:         [],
    correctAnswer:   null,
    difficulty:      "medium",
    difficultyScore: 0.55,
    marks:           2,
    negativeMarks:   0,
    expectedTime:    150,
    bloomLevel:      "apply",
    conceptTested:   "Converting a purely recurring decimal to a fraction",
    examBoard:       "CBSE",
    isAIGenerated:   true,
    isFlagged:       false,
    isPYQ:           false,
    pyqYear:         null,
    mixingType:      "single_topic",
    prerequisites:   [],
    hintLevels:      [
      "Let x = 0.232323…",
      "Multiply x by 100 (the period is 2 digits) to shift the decimal by one full cycle.",
      "Subtract x from 100x to eliminate the recurring part.",
    ],
    solutionSteps:   [
      "Let x = 0.232323…",
      "Multiply both sides by 100: 100x = 23.232323…",
      "Subtract: 100x − x = 23.232323… − 0.232323…",
      "99x = 23.",
      "x = 23/99.",
      "Check: GCD(23, 99) = 1 (23 is prime, 99 = 9 × 11). Already in simplest form.",
      "Answer: 23/99.",
    ],
    stepByStep: [
      { stepNumber: 1, clean: "x = 0.2323…, 100x = 23.2323…", voice: "" },
      { stepNumber: 2, clean: "99x = 23 → x = 23/99.", voice: "" },
    ],
    timeThresholds:  { guessBelow: 15, expectedMin: 60, expectedMax: 180, stuckAbove: 300 },
    routing:         { ifCorrect: "next_difficulty_up", ifWrong: null, ifStuck: null, flukeCheckQuestionId: null },
  },

  /* ── p6  hard free_text ───────────────────────────────────────────────── */
  {
    questionId:      `q_${BASE}_p6_freetext`,
    topicId:         `${BASE}_p6`,
    subject:         "Mathematics",
    grade:           "10",
    chapterNumber:   1,
    topic:           "Real Numbers",
    questionType:    "free_text",
    questionText:    "Prove that 17/125 has a terminating decimal expansion. Also find the decimal value.",
    options:         [],
    correctAnswer:   null,
    difficulty:      "hard",
    difficultyScore: 0.8,
    marks:           3,
    negativeMarks:   0,
    expectedTime:    180,
    bloomLevel:      "analyze",
    conceptTested:   "Proving termination and deriving decimal via 10ⁿ trick",
    examBoard:       "CBSE",
    isAIGenerated:   true,
    isFlagged:       false,
    isPYQ:           false,
    pyqYear:         null,
    mixingType:      "single_topic",
    prerequisites:   [],
    hintLevels:      [
      "Check GCD(17,125) first.",
      "125 = 5³. To write as a fraction over a power of 10, you need equal powers of 2 and 5.",
      "Multiply numerator and denominator by 2³.",
    ],
    solutionSteps:   [
      "Step 1: GCD(17, 125) = 1 (17 is prime, 125 = 5³). Fraction is in lowest terms.",
      "Step 2: Denominator = 5³ = 2⁰ × 5³. It has only the prime factor 5 (no primes other than 2 or 5).",
      "By the termination theorem, 17/125 has a TERMINATING decimal expansion.",
      "Step 3: Find the decimal. Multiply numerator and denominator by 2³ = 8 to get a power-of-10 denominator.",
      "17/125 = (17 × 8)/(125 × 8) = 136/1000 = 0.136.",
    ],
    stepByStep: [
      { stepNumber: 1, clean: "125 = 5³ → only factor is 5 → terminates.", voice: "" },
      { stepNumber: 2, clean: "17/125 × (8/8) = 136/1000 = 0.136.", voice: "" },
    ],
    timeThresholds:  { guessBelow: 20, expectedMin: 90, expectedMax: 240, stuckAbove: 360 },
    routing:         { ifCorrect: "next_difficulty_up", ifWrong: null, ifStuck: null, flukeCheckQuestionId: null },
  },

  /* ── p7  hard free_text ───────────────────────────────────────────────── */
  {
    questionId:      `q_${BASE}_p7_freetext`,
    topicId:         `${BASE}_p7`,
    subject:         "Mathematics",
    grade:           "10",
    chapterNumber:   1,
    topic:           "Real Numbers",
    questionType:    "free_text",
    questionText:    "A student claims: '33/50 has a terminating decimal because 50 is an even number.' Is the student's reasoning correct? Justify your answer and verify by finding the decimal.",
    options:         [],
    correctAnswer:   null,
    difficulty:      "hard",
    difficultyScore: 0.8,
    marks:           3,
    negativeMarks:   0,
    expectedTime:    180,
    bloomLevel:      "evaluate",
    conceptTested:   "Critiquing flawed reasoning; applying termination theorem correctly",
    examBoard:       "CBSE",
    isAIGenerated:   true,
    isFlagged:       false,
    isPYQ:           false,
    pyqYear:         null,
    mixingType:      "single_topic",
    prerequisites:   [],
    hintLevels:      [
      "Is 'even denominator' the correct condition for termination?",
      "The correct condition involves prime factorisation, not just parity.",
      "Factorise 50 and check the condition properly.",
    ],
    solutionSteps:   [
      "The student's conclusion (terminates) is correct, but the reasoning is WRONG.",
      "Being even is NOT sufficient for termination. For example, 1/6 has an even denominator (6 = 2 × 3) yet is non-terminating (0.1666…).",
      "Correct reasoning: Check if the denominator (in lowest terms) has only 2 and 5 as prime factors.",
      "GCD(33, 50) = 1 (33 = 3 × 11; 50 = 2 × 5²; no common factors).",
      "Denominator = 50 = 2 × 5². Prime factors are only 2 and 5. → TERMINATING.",
      "Verification: 33/50 = (33 × 2)/(50 × 2) = 66/100 = 0.66.",
    ],
    stepByStep: [
      { stepNumber: 1, clean: "Even denominator alone does not guarantee termination (e.g. 1/6 = 0.1666…).", voice: "" },
      { stepNumber: 2, clean: "50 = 2 × 5² → only prime factors 2 and 5 → terminates (correct conclusion, wrong reason).", voice: "" },
      { stepNumber: 3, clean: "33/50 = 66/100 = 0.66.", voice: "" },
    ],
    timeThresholds:  { guessBelow: 20, expectedMin: 90, expectedMax: 240, stuckAbove: 360 },
    routing:         { ifCorrect: "next_difficulty_up", ifWrong: null, ifStuck: null, flukeCheckQuestionId: null },
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding practice questions for cbse_math10_ch1_decimal_expansions (p1–p7)\n");

  // Fetch subtopic name from NcertTopicContent
  const tc = await NcertTopicContent.findOne({ topicId: BASE }).select("name").lean();
  const subtopic = tc?.name || "Decimal Expansions of Rational Numbers";

  let inserted = 0, skipped = 0;
  for (const q of questions) {
    q.subtopic = subtopic;
    const existing = await Question.findOne({ questionId: q.questionId }).lean();
    if (existing) { skipped++; console.log(`  skip  ${q.questionId}`); continue; }
    await Question.create(q);
    inserted++;
    console.log(`  insert ${q.questionId}  (${q.topicId})`);
  }

  console.log(`\nDone — inserted: ${inserted}, skipped: ${skipped}`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
