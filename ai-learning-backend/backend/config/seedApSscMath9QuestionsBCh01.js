import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC";
const GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────
  // TOPIC 1 — Irrational Numbers (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch1_irrational_b01",
    topicId: "ap_ssc_math9_ch1_irrational_numbers",
    topic: "Number Systems",
    subtopic: "Irrational Numbers",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "Prove that √2 is an irrational number.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Assume √2 is rational. Then √2 = p/q where p, q are integers with no common factor and q ≠ 0.",
      "Squaring both sides: 2 = p²/q²  ⟹  p² = 2q².",
      "So p² is even, which means p is even. Write p = 2m.",
      "Then (2m)² = 2q²  ⟹  4m² = 2q²  ⟹  q² = 2m².",
      "So q² is even, hence q is even.",
      "Both p and q are even — they share factor 2. This contradicts our assumption that p/q is in lowest terms.",
      "Therefore √2 is irrational. ∎",
    ],
    shortcut: "Proof by contradiction: assume rational → both p, q even → contradiction.",
    bloomLevel: "analyse",
    conceptTested: "Proof of irrationality by contradiction",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch1_irrational_b02",
    topicId: "ap_ssc_math9_ch1_irrational_numbers",
    topic: "Number Systems",
    subtopic: "Irrational Numbers",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "Classify each of the following as rational or irrational and justify your answer:\n(i) √23  (ii) √225  (iii) 0.3796  (iv) 7.478478…  (v) 1.101001000100001…",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 5,
    options: [],
    solutionSteps: [
      "(i) √23 — 23 is not a perfect square, so √23 is irrational.",
      "(ii) √225 = 15 — 225 = 15², so √225 = 15, which is rational.",
      "(iii) 0.3796 — terminating decimal; can be written as 3796/10000, so rational.",
      "(iv) 7.478478… — non-terminating but repeating (block '478'), so rational.",
      "(v) 1.101001000100001… — non-terminating and non-repeating (pattern of extra zeros grows), so irrational.",
    ],
    shortcut: "Terminating or repeating decimal → rational. Non-terminating, non-repeating → irrational.",
    bloomLevel: "understand",
    conceptTested: "Identifying rational vs. irrational numbers",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch1_irrational_b03",
    topicId: "ap_ssc_math9_ch1_irrational_numbers",
    topic: "Number Systems",
    subtopic: "Irrational Numbers",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "Represent √5 on the number line using a geometric construction. Describe all steps.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Mark O at 0 on the number line. Mark A at 2 units (OA = 2).",
      "Draw AB ⊥ OA with AB = 1 unit. Join OB.",
      "By Pythagoras: OB = √(2² + 1²) = √5.",
      "With centre O and radius OB, draw an arc to cut the number line at point P.",
      "OP = OB = √5. So P represents √5 on the number line.",
    ],
    shortcut: "Use (2,1) right triangle → hypotenuse = √5; swing arc to number line.",
    bloomLevel: "apply",
    conceptTested: "Geometric representation of irrational numbers",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch1_irrational_b04",
    topicId: "ap_ssc_math9_ch1_irrational_numbers",
    topic: "Number Systems",
    subtopic: "Irrational Numbers",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "Show that 3 + 2√5 is irrational, given that √5 is irrational.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "Assume 3 + 2√5 is rational. Then 3 + 2√5 = r, where r is rational.",
      "Rearranging: 2√5 = r − 3  ⟹  √5 = (r − 3)/2.",
      "Since r is rational, r − 3 is rational, and (r − 3)/2 is rational.",
      "But this says √5 is rational — a contradiction of the given fact that √5 is irrational.",
      "Therefore our assumption is wrong, and 3 + 2√5 is irrational. ∎",
    ],
    shortcut: "Isolate the irrational part; if it equals a rational expression → contradiction.",
    bloomLevel: "analyse",
    conceptTested: "Proving irrationality using contradiction",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 2 — Decimal Expansions (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch1_decimal_b01",
    topicId: "ap_ssc_math9_ch1_decimal_expansions",
    topic: "Number Systems",
    subtopic: "Decimal Expansions",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "Without performing long division, state whether the decimal expansion of the following will terminate or not. Give reasons.\n(i) 13/3125  (ii) 17/8  (iii) 64/455  (iv) 15/1600",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 4,
    options: [],
    solutionSteps: [
      "A fraction p/q (in lowest terms) has a terminating decimal iff q has only 2 and 5 as prime factors.",
      "(i) 13/3125: 3125 = 5⁵ — only factor 5. So TERMINATING.",
      "(ii) 17/8: 8 = 2³ — only factor 2. So TERMINATING.",
      "(iii) 64/455: 455 = 5 × 7 × 13 — has prime factor 7. So NON-TERMINATING REPEATING.",
      "(iv) 15/1600: 15/1600 = 3/320; 320 = 2⁶ × 5 — only 2s and 5s. So TERMINATING.",
    ],
    shortcut: "Check prime factorisation of denominator (after reducing). Only 2s and 5s → terminating.",
    bloomLevel: "understand",
    conceptTested: "Terminating vs non-terminating decimal expansion",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch1_decimal_b02",
    topicId: "ap_ssc_math9_ch1_decimal_expansions",
    topic: "Number Systems",
    subtopic: "Decimal Expansions",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "Express the following in the form p/q, where p and q are integers and q ≠ 0:\n(i) 0.6̄  (ii) 0.47̄  (iii) 0.001̄",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "(i) Let x = 0.6666…  ⟹  10x = 6.6666…  ⟹  10x − x = 6  ⟹  9x = 6  ⟹  x = 6/9 = 2/3.",
      "(ii) Let x = 0.4777…  ⟹  10x = 4.777…  ⟹  100x = 47.777…",
      "     100x − 10x = 47.777… − 4.777… = 43  ⟹  90x = 43  ⟹  x = 43/90.",
      "(iii) Let x = 0.001001001…  ⟹  1000x = 1.001001…",
      "      1000x − x = 1  ⟹  999x = 1  ⟹  x = 1/999.",
    ],
    shortcut: "Multiply by 10^(non-repeating digits + repeating block length) and subtract to eliminate repeating part.",
    bloomLevel: "apply",
    conceptTested: "Converting recurring decimal to p/q form",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch1_decimal_b03",
    topicId: "ap_ssc_math9_ch1_decimal_expansions",
    topic: "Number Systems",
    subtopic: "Decimal Expansions",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "Write the decimal expansion of 1/7 and identify the repeating block. Hence write the decimal expansions of 2/7, 3/7, and 4/7 without performing long division.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "1/7 = 0.142857142857… = 0.̄1̄4̄2̄8̄5̄7̄. Repeating block: 142857.",
      "2/7 = 2 × (1/7) = 0.285714285714… = 0.̄2̄8̄5̄7̄1̄4̄  (cyclic shift of 142857).",
      "3/7 = 3 × (1/7) = 0.428571428571… = 0.̄4̄2̄8̄5̄7̄1̄.",
      "4/7 = 4 × (1/7) = 0.571428571428… = 0.̄5̄7̄1̄4̄2̄8̄.",
    ],
    shortcut: "Multiples of 1/7 are cyclic permutations of the block 142857.",
    bloomLevel: "apply",
    conceptTested: "Cyclic patterns in recurring decimals",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch1_decimal_b04",
    topicId: "ap_ssc_math9_ch1_decimal_expansions",
    topic: "Number Systems",
    subtopic: "Decimal Expansions",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "Find three rational numbers between 2/7 and 3/7. Write two of them in decimal form.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "Method: use mean or multiply numerator and denominator.",
      "2/7 = 20/70, 3/7 = 30/70.",
      "Rational numbers between 20/70 and 30/70: 21/70 = 3/10, 25/70 = 5/14, 28/70 = 2/5.",
      "Decimal form: 3/10 = 0.3; 2/5 = 0.4.",
      "So three rationals between 2/7 and 3/7 are: 3/10, 5/14, 2/5.",
    ],
    shortcut: "Convert to common denominator → pick any numerators strictly between them → simplify.",
    bloomLevel: "apply",
    conceptTested: "Finding rational numbers in an interval",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 3 — Operations on Reals (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch1_operations_b01",
    topicId: "ap_ssc_math9_ch1_operations_on_reals",
    topic: "Number Systems",
    subtopic: "Operations on Reals",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "Rationalise the denominator and simplify:\n(i) 1/(√5 + √2)  (ii) (√6 − √5)/(√6 + √5)  (iii) (√7 − 1)/(√7 + 1)",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 6,
    options: [],
    solutionSteps: [
      "(i) 1/(√5 + √2) × (√5 − √2)/(√5 − √2) = (√5 − √2)/(5 − 2) = (√5 − √2)/3.",
      "(ii) (√6 − √5)/(√6 + √5) × (√6 − √5)/(√6 − √5)",
      "    = (√6 − √5)²/(6 − 5) = (6 − 2√30 + 5)/1 = 11 − 2√30.",
      "(iii) (√7 − 1)/(√7 + 1) × (√7 − 1)/(√7 − 1)",
      "    = (√7 − 1)²/(7 − 1) = (7 − 2√7 + 1)/6 = (8 − 2√7)/6 = (4 − √7)/3.",
    ],
    shortcut: "Multiply by conjugate (change sign between the surds) to use a² − b² = (a+b)(a−b).",
    bloomLevel: "apply",
    conceptTested: "Rationalisation of surds",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch1_operations_b02",
    topicId: "ap_ssc_math9_ch1_operations_on_reals",
    topic: "Number Systems",
    subtopic: "Operations on Reals",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "Simplify: (√3 + √7)(√3 − √7) + (√5 + 1)² − 3√28.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "(√3 + √7)(√3 − √7) = 3 − 7 = −4.",
      "(√5 + 1)² = 5 + 2√5 + 1 = 6 + 2√5.",
      "3√28 = 3 × 2√7 = 6√7.",
      "Total: −4 + 6 + 2√5 − 6√7 = 2 + 2√5 − 6√7.",
    ],
    shortcut: "Use (a+b)(a−b) = a²−b², (a+b)² = a²+2ab+b², and simplify surds before combining.",
    bloomLevel: "apply",
    conceptTested: "Operations with surds",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch1_operations_b03",
    topicId: "ap_ssc_math9_ch1_operations_on_reals",
    topic: "Number Systems",
    subtopic: "Operations on Reals",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "If a = 2 + √3, find the value of a − 1/a.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "a = 2 + √3.",
      "1/a = 1/(2 + √3) = (2 − √3)/((2 + √3)(2 − √3)) = (2 − √3)/(4 − 3) = 2 − √3.",
      "a − 1/a = (2 + √3) − (2 − √3) = 2√3.",
    ],
    shortcut: "Find 1/a by rationalising, then subtract. Note a and 1/a are conjugates here.",
    bloomLevel: "apply",
    conceptTested: "Algebraic manipulations with surds",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch1_operations_b04",
    topicId: "ap_ssc_math9_ch1_operations_on_reals",
    topic: "Number Systems",
    subtopic: "Operations on Reals",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "If x = 3 − 2√2, show that √x + 1/√x = 2√2.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "x = 3 − 2√2 = 2 − 2√2 + 1 = (√2 − 1)².",
      "Therefore √x = √2 − 1  (taking positive root).",
      "1/√x = 1/(√2 − 1) = (√2 + 1)/((√2)² − 1²) = (√2 + 1)/1 = √2 + 1.",
      "√x + 1/√x = (√2 − 1) + (√2 + 1) = 2√2. ∎",
    ],
    shortcut: "Recognise x as a perfect square of a surd; find √x, then rationalise 1/√x.",
    bloomLevel: "analyse",
    conceptTested: "Perfect square identities with surds",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 4 — Laws of Exponents (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch1_exponents_b01",
    topicId: "ap_ssc_math9_ch1_laws_of_exponents",
    topic: "Number Systems",
    subtopic: "Laws of Exponents",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "Simplify, giving your answers in simplest radical form:\n(i) (√5)⁻² × 5^(3/2)  (ii) 8^(1/3) + (−8)^(1/3) + 27^(1/3)  (iii) (64)^(−1/6) ÷ (32)^(−1/5)",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 6,
    options: [],
    solutionSteps: [
      "(i) (√5)⁻² = (5^(1/2))⁻² = 5⁻¹ = 1/5.",
      "    5^(3/2) = (√5)³ = 5√5.",
      "    Product = (1/5)(5√5) = √5.",
      "(ii) 8^(1/3) = 2; (−8)^(1/3) = −2; 27^(1/3) = 3.",
      "    Sum = 2 + (−2) + 3 = 3.",
      "(iii) 64^(−1/6) = 1/64^(1/6) = 1/2; 32^(−1/5) = 1/32^(1/5) = 1/2.",
      "    Quotient = (1/2) ÷ (1/2) = 1.",
    ],
    shortcut: "Convert everything to fractional exponents using aⁿ/ᵐ = (ᵐ√a)ⁿ, then apply laws.",
    bloomLevel: "apply",
    conceptTested: "Fractional and negative exponents",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch1_exponents_b02",
    topicId: "ap_ssc_math9_ch1_laws_of_exponents",
    topic: "Number Systems",
    subtopic: "Laws of Exponents",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "If 2^x = 3^y = 6^z, prove that 1/x + 1/y = 1/z.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "Let 2^x = 3^y = 6^z = k (say).",
      "Then 2 = k^(1/x), 3 = k^(1/y), 6 = k^(1/z).",
      "Since 6 = 2 × 3: k^(1/z) = k^(1/x) × k^(1/y) = k^(1/x + 1/y).",
      "Equating exponents: 1/z = 1/x + 1/y. ∎",
    ],
    shortcut: "Set equal to k, express base as k^(exponent), use the product of bases.",
    bloomLevel: "analyse",
    conceptTested: "Exponent laws — proof type",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch1_exponents_b03",
    topicId: "ap_ssc_math9_ch1_laws_of_exponents",
    topic: "Number Systems",
    subtopic: "Laws of Exponents",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "Find the value of x in each:\n(i) (4/9)^x × (9/4)^(2x) = (8/27)^0\n(ii) 5^(2x−1) − 25 × 5^(x−1) = 0",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "(i) Any number raised to 0 is 1 (provided base ≠ 0). So RHS = 1.",
      "    LHS = (4/9)^x × (9/4)^(2x) = (4/9)^x × (4/9)^(−2x) = (4/9)^(x − 2x) = (4/9)^(−x).",
      "    (4/9)^(−x) = 1 = (4/9)^0  ⟹  −x = 0  ⟹  x = 0.",
      "(ii) 5^(2x−1) − 25 × 5^(x−1) = 0.",
      "    5^(2x) / 5 − 5² × 5^x / 5 = 0  ⟹  5^(2x)/5 − 5^(x+1) = 0.",
      "    Multiply throughout by 5: 5^(2x) − 5^(x+2) = 0  ⟹  5^(2x) = 5^(x+2).",
      "    2x = x + 2  ⟹  x = 2.",
    ],
    shortcut: "For exponent equations: get the same base on both sides, then equate exponents.",
    bloomLevel: "apply",
    conceptTested: "Solving exponential equations",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch1_exponents_b04",
    topicId: "ap_ssc_math9_ch1_laws_of_exponents",
    topic: "Number Systems",
    subtopic: "Laws of Exponents",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 1,
    questionText:
      "Write each of the following as a power of 2 and simplify:\n(i) (∜16) × (8)^(2/3) ÷ (32)^(1/5)\n(ii) (√8 × ∛4) / (4^(3/2))",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 4,
    options: [],
    solutionSteps: [
      "(i) ∜16 = 16^(1/4) = (2⁴)^(1/4) = 2¹ = 2.",
      "    8^(2/3) = (2³)^(2/3) = 2² = 4.",
      "    32^(1/5) = (2⁵)^(1/5) = 2¹ = 2.",
      "    Result = 2 × 4 ÷ 2 = 4 = 2².",
      "(ii) √8 = (2³)^(1/2) = 2^(3/2); ∛4 = (2²)^(1/3) = 2^(2/3).",
      "    Numerator = 2^(3/2) × 2^(2/3) = 2^(3/2 + 2/3) = 2^(9/6 + 4/6) = 2^(13/6).",
      "    4^(3/2) = (2²)^(3/2) = 2³ = 8.",
      "    Result = 2^(13/6) / 2³ = 2^(13/6 − 18/6) = 2^(−5/6) = 1/2^(5/6).",
    ],
    shortcut: "Express all numbers as powers of 2 first, then apply product/quotient/power rules.",
    bloomLevel: "apply",
    conceptTested: "Laws of indices with fractional exponents",
    isAIGenerated: true,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding AP SSC Math 9 — Layer B — Chapter 1 (Number Systems)…");

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
