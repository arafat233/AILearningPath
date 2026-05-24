import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC";
const GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────
  // TOPIC 1 — Polynomials Basics (2 PYQ)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch2_polybasis_c01",
    topicId: "ap_ssc_math9_ch2_polynomials_basics",
    topic: "Polynomials",
    subtopic: "Polynomials Basics",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "[NCERT Ex 2.1] Which of the following expressions are polynomials in one variable and which are not? State reasons.\n(i) 4x² − 3x + 7  (ii) y² + √2  (iii) 3√t + t√2  (iv) y + 2/y  (v) x¹⁰ + y³ + t⁵⁰",
    questionType: "pyq",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 5,
    options: [],
    solutionSteps: [
      "(i) 4x² − 3x + 7: polynomial in one variable x. ✓",
      "(ii) y² + √2: polynomial in one variable y (√2 is a constant). ✓",
      "(iii) 3√t + t√2 = 3t^(1/2) + √2 t: exponent 1/2 is not a whole number → NOT a polynomial.",
      "(iv) y + 2/y = y + 2y^(−1): negative exponent → NOT a polynomial.",
      "(v) x¹⁰ + y³ + t⁵⁰: polynomial but in THREE variables x, y, t → NOT a polynomial in one variable.",
    ],
    shortcut: "Polynomial in one variable: all exponents are non-negative integers; only one variable.",
    bloomLevel: "understand",
    conceptTested: "Identifying polynomials in one variable",
    isAIGenerated: false,
  },
  {
    questionId: "ap_ssc9_ch2_polybasis_c02",
    topicId: "ap_ssc_math9_ch2_polynomials_basics",
    topic: "Polynomials",
    subtopic: "Polynomials Basics",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "[AP SSC Board 2021] If p(x) = x³ − 2x² + kx − 5 and p(−2) = 3, find the value of k.",
    questionType: "pyq",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "p(−2) = (−2)³ − 2(−2)² + k(−2) − 5 = −8 − 8 − 2k − 5 = −21 − 2k.",
      "Set p(−2) = 3: −21 − 2k = 3 → −2k = 24 → k = −12.",
    ],
    shortcut: "Substitute x = −2 into p(x), set equal to 3, solve for k.",
    bloomLevel: "apply",
    conceptTested: "Evaluating polynomial and finding unknown coefficient",
    isAIGenerated: false,
  },

  // ─────────────────────────────────────────────
  // TOPIC 2 — Zeroes of a Polynomial (2 PYQ)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch2_zeroes_c01",
    topicId: "ap_ssc_math9_ch2_zeroes_of_polynomial",
    topic: "Polynomials",
    subtopic: "Zeroes of a Polynomial",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "[NCERT Ex 2.2] Find the zeroes of the polynomial p(x) = (x − 2)² − (x + 2)².",
    questionType: "pyq",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "Expand: (x−2)² − (x+2)² = [(x−2) − (x+2)][(x−2) + (x+2)] [using a²−b² = (a−b)(a+b)]",
      "= [x−2−x−2][x−2+x+2]",
      "= (−4)(2x) = −8x.",
      "Set −8x = 0 → x = 0.",
      "The only zero is x = 0.",
    ],
    shortcut: "Apply (a²−b²) = (a−b)(a+b) before expanding; then solve.",
    bloomLevel: "apply",
    conceptTested: "Finding zeroes using factorisation",
    isAIGenerated: false,
  },
  {
    questionId: "ap_ssc9_ch2_zeroes_c02",
    topicId: "ap_ssc_math9_ch2_zeroes_of_polynomial",
    topic: "Polynomials",
    subtopic: "Zeroes of a Polynomial",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "[AP SSC Board 2023] If the zeroes of the quadratic polynomial x² + (a+1)x + b are 2 and −3, find a and b.",
    questionType: "pyq",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "For zeroes 2 and −3 of x² + (a+1)x + b:",
      "Sum of zeroes = 2 + (−3) = −1 = −(a+1)/1 → a+1 = 1 → a = 0.",
      "Product of zeroes = 2 × (−3) = −6 = b/1 → b = −6.",
    ],
    shortcut: "Sum = −(coeff of x) / (leading coeff); product = constant / leading coeff.",
    bloomLevel: "apply",
    conceptTested: "Vieta's formulas — finding coefficients from zeroes",
    isAIGenerated: false,
  },

  // ─────────────────────────────────────────────
  // TOPIC 3 — Remainder Theorem (2 PYQ)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch2_remainder_c01",
    topicId: "ap_ssc_math9_ch2_remainder_theorem",
    topic: "Polynomials",
    subtopic: "Remainder Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "[AP SSC Board 2019] Find the remainder when x³ + 3x² + 3x + 1 is divided by (i) x + 1  (ii) x + π  (iii) 5 + 2x.",
    questionType: "pyq",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "(i) x = −1: p(−1) = −1 + 3 − 3 + 1 = 0. Remainder = 0.",
      "(ii) x = −π: p(−π) = (−π)³ + 3(−π)² + 3(−π) + 1 = −π³ + 3π² − 3π + 1 = (1−π)³.",
      "(iii) 5 + 2x = 0 → x = −5/2: p(−5/2) = (−5/2)³ + 3(−5/2)² + 3(−5/2) + 1",
      "     = −125/8 + 75/4 − 15/2 + 1 = −125/8 + 150/8 − 60/8 + 8/8 = (−125+150−60+8)/8 = −27/8.",
    ],
    shortcut: "Substitute the root of each divisor into p(x).",
    bloomLevel: "apply",
    conceptTested: "Remainder Theorem — multiple cases",
    isAIGenerated: false,
  },
  {
    questionId: "ap_ssc9_ch2_remainder_c02",
    topicId: "ap_ssc_math9_ch2_remainder_theorem",
    topic: "Polynomials",
    subtopic: "Remainder Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "[NCERT Exemplar] If the polynomial f(x) = x⁴ − 2x³ + 3x² − ax + b gives remainder 5 when divided by (x − 1) and remainder 19 when divided by (x + 1), find a and b. Hence find the remainder when f(x) is divided by (x − 2).",
    questionType: "pyq",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "f(1) = 1 − 2 + 3 − a + b = 2 − a + b = 5 → −a + b = 3. … (I)",
      "f(−1) = 1 + 2 + 3 + a + b = 6 + a + b = 19 → a + b = 13. … (II)",
      "Adding (I) and (II): 2b = 16 → b = 8.",
      "From (II): a = 13 − 8 = 5.",
      "f(2) = 16 − 16 + 12 − 5(2) + 8 = 16 − 16 + 12 − 10 + 8 = 10.",
      "Remainder when divided by (x − 2) = 10.",
    ],
    shortcut: "Set up two equations from two remainders; solve simultaneously; then find f(2).",
    bloomLevel: "analyse",
    conceptTested: "Remainder Theorem — simultaneous equations and follow-up",
    isAIGenerated: false,
  },

  // ─────────────────────────────────────────────
  // TOPIC 4 — Factor Theorem (2 PYQ)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch2_factor_c01",
    topicId: "ap_ssc_math9_ch2_factor_theorem",
    topic: "Polynomials",
    subtopic: "Factor Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "[AP SSC Board 2022] Factorise: x³ − 3x² − 9x − 5.",
    questionType: "pyq",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Try x = 5: p(5) = 125 − 75 − 45 − 5 = 0. ✓ (x − 5) is a factor.",
      "Divide: x³ − 3x² − 9x − 5 ÷ (x − 5) = x² + 2x + 1 = (x + 1)².",
      "Full factorisation: (x − 5)(x + 1)².",
    ],
    shortcut: "Try factors of −5 (±1, ±5). Find zero, divide, factorise quotient.",
    bloomLevel: "apply",
    conceptTested: "Cubic factorisation using Factor Theorem",
    isAIGenerated: false,
  },
  {
    questionId: "ap_ssc9_ch2_factor_c02",
    topicId: "ap_ssc_math9_ch2_factor_theorem",
    topic: "Polynomials",
    subtopic: "Factor Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "[NCERT Ex 2.4] Factorise: 12x² − 7x + 1 using the splitting-the-middle-term method. Also verify using the Factor Theorem.",
    questionType: "pyq",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Product = 12 × 1 = 12. Sum = −7. Factors: −3 and −4 (since (−3)(−4) = 12 and −3 + (−4) = −7).",
      "12x² − 3x − 4x + 1 = 3x(4x − 1) − 1(4x − 1) = (3x − 1)(4x − 1).",
      "Verify via Factor Theorem:",
      "  Zeroes are x = 1/3 and x = 1/4.",
      "  p(1/3) = 12(1/9) − 7(1/3) + 1 = 4/3 − 7/3 + 3/3 = 0. ✓",
      "  p(1/4) = 12(1/16) − 7(1/4) + 1 = 3/4 − 7/4 + 4/4 = 0. ✓",
    ],
    shortcut: "Split middle term into two parts that multiply to ac and add to b. Then group and factor.",
    bloomLevel: "apply",
    conceptTested: "Quadratic factorisation and Factor Theorem verification",
    isAIGenerated: false,
  },

  // ─────────────────────────────────────────────
  // TOPIC 5 — Algebraic Identities (2 PYQ)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch2_identities_c01",
    topicId: "ap_ssc_math9_ch2_algebraic_identities",
    topic: "Polynomials",
    subtopic: "Algebraic Identities",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "[AP SSC Board 2020] If x + y + z = 0, find x³ + y³ + z³.",
    questionType: "pyq",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "Identity: a³ + b³ + c³ − 3abc = (a + b + c)(a² + b² + c² − ab − bc − ca).",
      "Given: x + y + z = 0.",
      "x³ + y³ + z³ − 3xyz = 0 × (…) = 0.",
      "Therefore x³ + y³ + z³ = 3xyz.",
    ],
    shortcut: "When a + b + c = 0, always a³ + b³ + c³ = 3abc.",
    bloomLevel: "apply",
    conceptTested: "Sum of cubes when sum = 0",
    isAIGenerated: false,
  },
  {
    questionId: "ap_ssc9_ch2_identities_c02",
    topicId: "ap_ssc_math9_ch2_algebraic_identities",
    topic: "Polynomials",
    subtopic: "Algebraic Identities",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "[NCERT Ex 2.5] Factorise: 27x³ + y³ + z³ − 9xyz.",
    questionType: "pyq",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "Recognise: 27x³ = (3x)³, y³, z³.",
      "Identity: a³ + b³ + c³ − 3abc = (a + b + c)(a² + b² + c² − ab − bc − ca).",
      "Here a = 3x, b = y, c = z.",
      "27x³ + y³ + z³ − 9xyz = (3x)³ + y³ + z³ − 3(3x)(y)(z).",
      "= (3x + y + z)[(3x)² + y² + z² − (3x)(y) − (y)(z) − (z)(3x)]",
      "= (3x + y + z)(9x² + y² + z² − 3xy − yz − 3xz).",
    ],
    shortcut: "Match 27x³ + y³ + z³ − 9xyz to the a³+b³+c³−3abc identity with a=3x, b=y, c=z.",
    bloomLevel: "apply",
    conceptTested: "Sum of cubes factorisation identity",
    isAIGenerated: false,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding AP SSC Math 9 — Layer C — Chapter 2 (Polynomials)…");

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
