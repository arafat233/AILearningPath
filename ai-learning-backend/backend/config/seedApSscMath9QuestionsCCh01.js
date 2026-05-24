import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC";
const GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────
  // TOPIC 1 — Irrational Numbers (2 PYQ)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch1_irrational_c01",
    topicId: "ap_ssc_math9_ch1_irrational_numbers",
    topic: "Number Systems",
    subtopic: "Irrational Numbers",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "[AP SSC Board 2019] Prove that 5 − √3 is irrational.",
    questionType: "pyq",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Assume 5 − √3 is rational. Let 5 − √3 = r, where r is rational.",
      "Then √3 = 5 − r.",
      "Since 5 is rational and r is rational, 5 − r is rational → √3 is rational.",
      "But √3 is irrational (given/known). Contradiction.",
      "Therefore 5 − √3 is irrational. ∎",
    ],
    shortcut: "Isolate √3 and show it must be rational — contradiction.",
    bloomLevel: "analyse",
    conceptTested: "Irrationality proof by contradiction",
    isAIGenerated: false,
  },
  {
    questionId: "ap_ssc9_ch1_irrational_c02",
    topicId: "ap_ssc_math9_ch1_irrational_numbers",
    topic: "Number Systems",
    subtopic: "Irrational Numbers",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "[NCERT Exemplar] Insert a rational and an irrational number between 2 and 3.",
    questionType: "pyq",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "Rational number between 2 and 3: 5/2 = 2.5 (or any p/q with 2 < p/q < 3).",
      "Irrational number between 2 and 3: √5 (since √4 = 2 and √9 = 3, √5 ≈ 2.236 lies between them).",
      "Alternatively: √6 ≈ 2.449 or √7 ≈ 2.646.",
    ],
    shortcut: "Rational: average of endpoints. Irrational: √n where 4 < n < 9.",
    bloomLevel: "apply",
    conceptTested: "Inserting rational and irrational between two numbers",
    isAIGenerated: false,
  },

  // ─────────────────────────────────────────────
  // TOPIC 2 — Decimal Expansions (2 PYQ)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch1_decimal_c01",
    topicId: "ap_ssc_math9_ch1_decimal_expansions",
    topic: "Number Systems",
    subtopic: "Decimal Expansions",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "[AP SSC Board 2022] Express 0.2̄3̄ in the form p/q, where p and q are integers and q ≠ 0. (0.23 with block 23 repeating)",
    questionType: "pyq",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "Let x = 0.232323…",
      "Multiply by 100: 100x = 23.232323…",
      "100x − x = 23 → 99x = 23 → x = 23/99.",
    ],
    shortcut: "Two-digit repeating block → multiply by 100, subtract, divide by 99.",
    bloomLevel: "apply",
    conceptTested: "Converting recurring decimal to fraction",
    isAIGenerated: false,
  },
  {
    questionId: "ap_ssc9_ch1_decimal_c02",
    topicId: "ap_ssc_math9_ch1_decimal_expansions",
    topic: "Number Systems",
    subtopic: "Decimal Expansions",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "[NCERT Ex 1.3] Without performing actual division, determine whether 329/400 has a terminating or non-terminating repeating decimal expansion.",
    questionType: "pyq",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "Check if denominator 400 (in lowest terms) has only 2 and 5 as prime factors.",
      "400 = 2⁴ × 5² = 2⁴ × 25.",
      "Only prime factors are 2 and 5 → TERMINATING decimal expansion.",
      "329/400 = 0.8225 (can be verified).",
    ],
    shortcut: "400 = 2⁴ × 5² → terminating.",
    bloomLevel: "understand",
    conceptTested: "Identifying terminating decimal without long division",
    isAIGenerated: false,
  },

  // ─────────────────────────────────────────────
  // TOPIC 3 — Operations on Reals (2 PYQ)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch1_operations_c01",
    topicId: "ap_ssc_math9_ch1_operations_on_reals",
    topic: "Number Systems",
    subtopic: "Operations on Reals",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "[AP SSC Board 2020] Simplify: (√3 + √2)² − (√3 − √2)².",
    questionType: "pyq",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "(√3 + √2)² = 3 + 2√6 + 2 = 5 + 2√6.",
      "(√3 − √2)² = 3 − 2√6 + 2 = 5 − 2√6.",
      "Difference = (5 + 2√6) − (5 − 2√6) = 4√6.",
    ],
    shortcut: "Use (a+b)² − (a−b)² = 4ab. Here a = √3, b = √2 → 4√6.",
    bloomLevel: "apply",
    conceptTested: "Algebraic identity (a+b)² − (a−b)² = 4ab",
    isAIGenerated: false,
  },
  {
    questionId: "ap_ssc9_ch1_operations_c02",
    topicId: "ap_ssc_math9_ch1_operations_on_reals",
    topic: "Number Systems",
    subtopic: "Operations on Reals",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "[NCERT Exemplar] If a = 7 + 4√3, find √a − 1/√a.",
    questionType: "pyq",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "a = 7 + 4√3 = 4 + 4√3 + 3 = (2 + √3)².",
      "√a = 2 + √3.",
      "1/√a = 1/(2 + √3) = (2 − √3)/((2+√3)(2−√3)) = (2 − √3)/(4 − 3) = 2 − √3.",
      "√a − 1/√a = (2 + √3) − (2 − √3) = 2√3.",
    ],
    shortcut: "Recognise a as a perfect square: 7 + 4√3 = (2 + √3)².",
    bloomLevel: "analyse",
    conceptTested: "Perfect square surd expressions",
    isAIGenerated: false,
  },

  // ─────────────────────────────────────────────
  // TOPIC 4 — Laws of Exponents (2 PYQ)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch1_exponents_c01",
    topicId: "ap_ssc_math9_ch1_laws_of_exponents",
    topic: "Number Systems",
    subtopic: "Laws of Exponents",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "[AP SSC Board 2018] Simplify: (x^a / x^b)^(a+b) × (x^b / x^c)^(b+c) × (x^c / x^a)^(c+a).",
    questionType: "pyq",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "First factor: (x^(a−b))^(a+b) = x^((a−b)(a+b)) = x^(a²−b²).",
      "Second factor: (x^(b−c))^(b+c) = x^(b²−c²).",
      "Third factor: (x^(c−a))^(c+a) = x^(c²−a²).",
      "Product: x^(a²−b² + b²−c² + c²−a²) = x^0 = 1.",
    ],
    shortcut: "Combine the exponents: (a²−b²) + (b²−c²) + (c²−a²) = 0 → x⁰ = 1.",
    bloomLevel: "analyse",
    conceptTested: "Index law with algebraic exponents — telescoping sum",
    isAIGenerated: false,
  },
  {
    questionId: "ap_ssc9_ch1_exponents_c02",
    topicId: "ap_ssc_math9_ch1_laws_of_exponents",
    topic: "Number Systems",
    subtopic: "Laws of Exponents",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "[NCERT Ex 1.6] Find the value of: (i) 9^(3/2)  (ii) 32^(2/5)  (iii) 16^(3/4)  (iv) 125^(−1/3).",
    questionType: "pyq",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 4,
    options: [],
    solutionSteps: [
      "(i) 9^(3/2) = (√9)³ = 3³ = 27.",
      "(ii) 32^(2/5) = (⁵√32)² = 2² = 4.",
      "(iii) 16^(3/4) = (⁴√16)³ = 2³ = 8.",
      "(iv) 125^(−1/3) = 1/125^(1/3) = 1/∛125 = 1/5.",
    ],
    shortcut: "aⁿ/ᵐ = (ᵐ√a)ⁿ. Find the root first, then raise to the power.",
    bloomLevel: "apply",
    conceptTested: "Evaluating fractional exponents",
    isAIGenerated: false,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding AP SSC Math 9 — Layer C — Chapter 1 (Number Systems)…");

  let upserted = 0;
  let skipped = 0;

  for (const q of questions) {
    try {
      await Question.findOneAndUpdate(
        { questionId: q.questionId },
        { $set: q },
        { upsert: true, new: true }
      );
      console.log(`  ✓ ${q.questionId}`);
      upserted++;
    } catch (err) {
      if (err.code === 11000) {
        console.log(`  — skip ${q.questionId}`);
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
