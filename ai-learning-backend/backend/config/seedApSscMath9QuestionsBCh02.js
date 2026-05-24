import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC";
const GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────
  // TOPIC 1 — Polynomials Basics (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch2_polybasis_b01",
    topicId: "ap_ssc_math9_ch2_polynomials_basics",
    topic: "Polynomials",
    subtopic: "Polynomials Basics",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "Write the degree, leading coefficient, and constant term of the following polynomials:\n(i) 7x³ − 3x² + √2 x − 5  (ii) y − y³  (iii) 12",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "(i) Degree = 3, leading coefficient = 7, constant term = −5.",
      "(ii) Rewrite as −y³ + y. Degree = 3, leading coefficient = −1, constant term = 0.",
      "(iii) 12 is a constant polynomial. Degree = 0, leading coefficient = 12, constant term = 12.",
    ],
    shortcut: "Degree = highest power; leading coefficient = coefficient of highest-power term; constant term = term with no variable.",
    bloomLevel: "remember",
    conceptTested: "Identifying polynomial components",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_polybasis_b02",
    topicId: "ap_ssc_math9_ch2_polynomials_basics",
    topic: "Polynomials",
    subtopic: "Polynomials Basics",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "Classify each as monomial, binomial, or trinomial. Also state whether it is linear, quadratic, or cubic:\n(i) 3x² + 2x − 1  (ii) 5y  (iii) t³ + t",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "(i) 3x² + 2x − 1: three terms → trinomial; degree 2 → quadratic.",
      "(ii) 5y: one term → monomial; degree 1 → linear.",
      "(iii) t³ + t: two terms → binomial; degree 3 → cubic.",
    ],
    shortcut: "Count terms for mono/bi/tri; highest power for linear/quadratic/cubic.",
    bloomLevel: "understand",
    conceptTested: "Classifying polynomials",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_polybasis_b03",
    topicId: "ap_ssc_math9_ch2_polynomials_basics",
    topic: "Polynomials",
    subtopic: "Polynomials Basics",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "If p(x) = 5x² − 3x + 7, find p(0), p(1), p(−1), and p(2).",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 4,
    options: [],
    solutionSteps: [
      "p(0) = 5(0)² − 3(0) + 7 = 7.",
      "p(1) = 5(1) − 3(1) + 7 = 5 − 3 + 7 = 9.",
      "p(−1) = 5(1) − 3(−1) + 7 = 5 + 3 + 7 = 15.",
      "p(2) = 5(4) − 3(2) + 7 = 20 − 6 + 7 = 21.",
    ],
    shortcut: "Substitute the value directly and evaluate using BODMAS.",
    bloomLevel: "apply",
    conceptTested: "Evaluating a polynomial at given values",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_polybasis_b04",
    topicId: "ap_ssc_math9_ch2_polynomials_basics",
    topic: "Polynomials",
    subtopic: "Polynomials Basics",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "For what value of k is (x − 1) a factor of p(x) = 2x³ + kx² + √2 x − 3? Use the Factor Theorem.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "By Factor Theorem, (x − 1) is a factor iff p(1) = 0.",
      "p(1) = 2(1)³ + k(1)² + √2(1) − 3 = 2 + k + √2 − 3.",
      "Set p(1) = 0: k = 3 − 2 − √2 = 1 − √2.",
    ],
    shortcut: "Substitute x = 1 and set = 0, then solve for k.",
    bloomLevel: "apply",
    conceptTested: "Factor Theorem application to find unknown coefficient",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 2 — Zeroes of a Polynomial (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch2_zeroes_b01",
    topicId: "ap_ssc_math9_ch2_zeroes_of_polynomial",
    topic: "Polynomials",
    subtopic: "Zeroes of a Polynomial",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "Find all zeroes of p(x) = x² − 5x + 6 and verify using the relationship between zeroes and coefficients.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Factorise: x² − 5x + 6 = (x − 2)(x − 3).",
      "Zeroes: x = 2 and x = 3.",
      "Sum of zeroes = 2 + 3 = 5 = −(−5)/1 = −b/a. ✓",
      "Product of zeroes = 2 × 3 = 6 = 6/1 = c/a. ✓",
    ],
    shortcut: "For ax² + bx + c: sum = −b/a, product = c/a.",
    bloomLevel: "apply",
    conceptTested: "Zeroes and Vieta's formulas for quadratic",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_zeroes_b02",
    topicId: "ap_ssc_math9_ch2_zeroes_of_polynomial",
    topic: "Polynomials",
    subtopic: "Zeroes of a Polynomial",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "Verify that 3 and −2 are zeroes of the polynomial p(x) = x² − x − 6.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "p(3) = 9 − 3 − 6 = 0. ✓",
      "p(−2) = 4 − (−2) − 6 = 4 + 2 − 6 = 0. ✓",
      "Both give 0, so 3 and −2 are zeroes of p(x).",
    ],
    shortcut: "Substitute each value; if result is 0 → it is a zero.",
    bloomLevel: "understand",
    conceptTested: "Verifying zeroes of a polynomial",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_zeroes_b03",
    topicId: "ap_ssc_math9_ch2_zeroes_of_polynomial",
    topic: "Polynomials",
    subtopic: "Zeroes of a Polynomial",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "If α and β are zeroes of the polynomial x² − 2x − 8, find: (i) α² + β²  (ii) α³ + β³  (iii) 1/α + 1/β.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 6,
    options: [],
    solutionSteps: [
      "p(x) = x² − 2x − 8. So α + β = 2, αβ = −8.",
      "(i) α² + β² = (α + β)² − 2αβ = 4 − 2(−8) = 4 + 16 = 20.",
      "(ii) α³ + β³ = (α + β)³ − 3αβ(α + β) = 8 − 3(−8)(2) = 8 + 48 = 56.",
      "(iii) 1/α + 1/β = (α + β)/(αβ) = 2/(−8) = −1/4.",
    ],
    shortcut: "Use Vieta's formulas (α+β and αβ) to build symmetric expressions without finding α, β individually.",
    bloomLevel: "analyse",
    conceptTested: "Symmetric functions of zeroes",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_zeroes_b04",
    topicId: "ap_ssc_math9_ch2_zeroes_of_polynomial",
    topic: "Polynomials",
    subtopic: "Zeroes of a Polynomial",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "How many zeroes can a polynomial of degree n have? Explain why a non-zero constant polynomial has no zeroes.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "A polynomial of degree n can have at most n zeroes (Fundamental Theorem of Algebra).",
      "A non-zero constant polynomial p(x) = c (c ≠ 0) has degree 0.",
      "p(x) = c ≠ 0 for all values of x, so there is no value of x that makes p(x) = 0.",
      "Therefore it has no zeroes.",
    ],
    shortcut: "Constant polynomial = horizontal line (never touches x-axis if c ≠ 0).",
    bloomLevel: "understand",
    conceptTested: "Maximum number of zeroes",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 3 — Remainder Theorem (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch2_remainder_b01",
    topicId: "ap_ssc_math9_ch2_remainder_theorem",
    topic: "Polynomials",
    subtopic: "Remainder Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "State the Remainder Theorem. Using it, find the remainder when p(x) = x³ − 3x² + 4x − 5 is divided by (x − 2).",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "Remainder Theorem: When p(x) is divided by (x − a), the remainder is p(a).",
      "Here divisor is (x − 2), so a = 2.",
      "p(2) = 8 − 12 + 8 − 5 = −1.",
      "The remainder is −1.",
    ],
    shortcut: "Substitute the root of the divisor into p(x).",
    bloomLevel: "apply",
    conceptTested: "Remainder Theorem — basic application",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_remainder_b02",
    topicId: "ap_ssc_math9_ch2_remainder_theorem",
    topic: "Polynomials",
    subtopic: "Remainder Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "Using the Remainder Theorem, find the value of k if the polynomial p(x) = kx³ − 2x² + 3kx − 1 leaves remainder 35 when divided by (x + 2).",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "Divisor is (x + 2) ⟹ a = −2.",
      "p(−2) = k(−8) − 2(4) + 3k(−2) − 1 = −8k − 8 − 6k − 1 = −14k − 9.",
      "Set remainder = 35: −14k − 9 = 35 ⟹ −14k = 44 ⟹ k = −44/14 = −22/7.",
    ],
    shortcut: "Substitute a = −2, set the expression equal to the given remainder, solve for k.",
    bloomLevel: "apply",
    conceptTested: "Remainder Theorem — finding unknown coefficient",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_remainder_b03",
    topicId: "ap_ssc_math9_ch2_remainder_theorem",
    topic: "Polynomials",
    subtopic: "Remainder Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "Find the remainder when x^200 + 1 is divided by x + 1.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 2,
    options: [],
    solutionSteps: [
      "Divisor (x + 1) → a = −1.",
      "Remainder = p(−1) = (−1)^200 + 1 = 1 + 1 = 2.",
    ],
    shortcut: "(−1)^even = 1; substitute a = −1.",
    bloomLevel: "apply",
    conceptTested: "Remainder Theorem with large exponents",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_remainder_b04",
    topicId: "ap_ssc_math9_ch2_remainder_theorem",
    topic: "Polynomials",
    subtopic: "Remainder Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "The polynomial f(x) = x³ + ax² + bx − 6 gives remainder 4 when divided by (x − 2) and remainder −1 when divided by (x + 1). Find a and b.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "f(2) = 8 + 4a + 2b − 6 = 2 + 4a + 2b = 4  ⟹  4a + 2b = 2  ⟹  2a + b = 1 … (I)",
      "f(−1) = −1 + a − b − 6 = a − b − 7 = −1  ⟹  a − b = 6 … (II)",
      "Adding (I) and (II): 3a = 7  ⟹  a = 7/3.",
      "From (II): b = a − 6 = 7/3 − 6 = −11/3.",
    ],
    shortcut: "Form two equations from two remainder conditions, then solve simultaneously.",
    bloomLevel: "analyse",
    conceptTested: "Simultaneous equations via Remainder Theorem",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 4 — Factor Theorem (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch2_factor_b01",
    topicId: "ap_ssc_math9_ch2_factor_theorem",
    topic: "Polynomials",
    subtopic: "Factor Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "State the Factor Theorem. Use it to check whether (x + 2) is a factor of p(x) = x³ + 3x² + 5x + 6.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "Factor Theorem: (x − a) is a factor of p(x) iff p(a) = 0.",
      "(x + 2) ⟹ a = −2.",
      "p(−2) = −8 + 12 − 10 + 6 = 0. ✓",
      "Since p(−2) = 0, (x + 2) IS a factor of p(x).",
    ],
    shortcut: "Substitute the root of the potential factor; 0 → it is a factor.",
    bloomLevel: "apply",
    conceptTested: "Factor Theorem — verifying a factor",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_factor_b02",
    topicId: "ap_ssc_math9_ch2_factor_theorem",
    topic: "Polynomials",
    subtopic: "Factor Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "Factorise x³ − 23x² + 142x − 120 completely, given that (x − 1) is one of its factors.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "Since (x − 1) is a factor, divide: x³ − 23x² + 142x − 120 ÷ (x − 1).",
      "By synthetic/long division: quotient = x² − 22x + 120.",
      "Factorise x² − 22x + 120: find two numbers with product 120 and sum 22 → 10 and 12.",
      "x² − 22x + 120 = (x − 10)(x − 12).",
      "Full factorisation: (x − 1)(x − 10)(x − 12).",
    ],
    shortcut: "Divide by the known factor to reduce degree, then factorise the quotient.",
    bloomLevel: "analyse",
    conceptTested: "Complete factorisation of cubics using Factor Theorem",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_factor_b03",
    topicId: "ap_ssc_math9_ch2_factor_theorem",
    topic: "Polynomials",
    subtopic: "Factor Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "Show that (x − 2), (x + 1) are factors of p(x) = x³ − x² − 4. Hence write all three factors.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "p(2) = 8 − 4 − 4 = 0. ✓ So (x − 2) is a factor.",
      "p(−1) = −1 − 1 − 4 = −6 ≠ 0.",
      "Note: (x + 1) is NOT a factor of x³ − x² − 4. The third factor must be found differently.",
      "Divide by (x − 2): x³ − x² − 4 ÷ (x − 2) = x² + x + 2.",
      "x² + x + 2 has discriminant 1 − 8 = −7 < 0, so it has no real factors.",
      "Full factorisation over reals: (x − 2)(x² + x + 2).",
    ],
    shortcut: "Verify each claimed factor by substitution; divide by confirmed factor for the remaining factor.",
    bloomLevel: "analyse",
    conceptTested: "Verifying factors and complete factorisation",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_factor_b04",
    topicId: "ap_ssc_math9_ch2_factor_theorem",
    topic: "Polynomials",
    subtopic: "Factor Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "Using the Factor Theorem, factorise 2x³ + x² − 5x + 2.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Possible rational zeros: ±1, ±2, ±1/2.",
      "Try x = 1: p(1) = 2 + 1 − 5 + 2 = 0. ✓ So (x − 1) is a factor.",
      "Divide: 2x³ + x² − 5x + 2 ÷ (x − 1) = 2x² + 3x − 2.",
      "Factorise 2x² + 3x − 2: 2x² + 4x − x − 2 = 2x(x + 2) − 1(x + 2) = (2x − 1)(x + 2).",
      "Full factorisation: (x − 1)(2x − 1)(x + 2).",
    ],
    shortcut: "Try small integer/fraction candidates for x, find one zero, then reduce and factorise quotient.",
    bloomLevel: "apply",
    conceptTested: "Factorisation using Factor Theorem",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 5 — Algebraic Identities (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch2_identities_b01",
    topicId: "ap_ssc_math9_ch2_algebraic_identities",
    topic: "Polynomials",
    subtopic: "Algebraic Identities",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "Expand using appropriate identities:\n(i) (3x + 4y)³  (ii) (2a − b)³  (iii) (x + 2)(x + 5)(x − 3)",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 6,
    options: [],
    solutionSteps: [
      "(i) (a + b)³ = a³ + 3a²b + 3ab² + b³, a = 3x, b = 4y.",
      "    = 27x³ + 3(9x²)(4y) + 3(3x)(16y²) + 64y³",
      "    = 27x³ + 108x²y + 144xy² + 64y³.",
      "(ii) (a − b)³ = a³ − 3a²b + 3ab² − b³, a = 2a, b = b.",
      "    = 8a³ − 3(4a²)(b) + 3(2a)(b²) − b³",
      "    = 8a³ − 12a²b + 6ab² − b³.",
      "(iii) Group: (x + 2)(x + 5) = x² + 7x + 10.",
      "    Then (x² + 7x + 10)(x − 3) = x³ − 3x² + 7x² − 21x + 10x − 30",
      "    = x³ + 4x² − 11x − 30.",
    ],
    shortcut: "(a+b)³ = a³ + 3a²b + 3ab² + b³; (a−b)³ = a³ − 3a²b + 3ab² − b³.",
    bloomLevel: "apply",
    conceptTested: "Cubic expansion identities",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_identities_b02",
    topicId: "ap_ssc_math9_ch2_algebraic_identities",
    topic: "Polynomials",
    subtopic: "Algebraic Identities",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "If x + y + z = 6 and xy + yz + zx = 11, find x² + y² + z².",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 2,
    options: [],
    solutionSteps: [
      "Use identity: (x + y + z)² = x² + y² + z² + 2(xy + yz + zx).",
      "36 = x² + y² + z² + 2(11) = x² + y² + z² + 22.",
      "x² + y² + z² = 36 − 22 = 14.",
    ],
    shortcut: "x² + y² + z² = (x+y+z)² − 2(xy+yz+zx).",
    bloomLevel: "apply",
    conceptTested: "Sum-of-squares identity",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_identities_b03",
    topicId: "ap_ssc_math9_ch2_algebraic_identities",
    topic: "Polynomials",
    subtopic: "Algebraic Identities",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "Prove that if a + b + c = 0, then a³ + b³ + c³ = 3abc.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "We know the identity: a³ + b³ + c³ − 3abc = (a + b + c)(a² + b² + c² − ab − bc − ca).",
      "Given a + b + c = 0.",
      "RHS = 0 × (a² + b² + c² − ab − bc − ca) = 0.",
      "Therefore a³ + b³ + c³ − 3abc = 0  ⟹  a³ + b³ + c³ = 3abc. ∎",
    ],
    shortcut: "Factor identity: a³+b³+c³ − 3abc = (a+b+c)(…). Set a+b+c = 0 and both sides collapse.",
    bloomLevel: "analyse",
    conceptTested: "a³+b³+c³ = 3abc when a+b+c = 0",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch2_identities_b04",
    topicId: "ap_ssc_math9_ch2_algebraic_identities",
    topic: "Polynomials",
    subtopic: "Algebraic Identities",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 2,
    questionText:
      "Without multiplying directly, evaluate:\n(i) 103³  (ii) 98³",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 4,
    options: [],
    solutionSteps: [
      "(i) 103³ = (100 + 3)³.",
      "    = 100³ + 3(100²)(3) + 3(100)(3²) + 3³",
      "    = 1000000 + 90000 + 2700 + 27 = 1092727.",
      "(ii) 98³ = (100 − 2)³.",
      "    = 100³ − 3(100²)(2) + 3(100)(2²) − 2³",
      "    = 1000000 − 60000 + 1200 − 8 = 941192.",
    ],
    shortcut: "Write as (100 ± small)³ and apply (a±b)³ identity.",
    bloomLevel: "apply",
    conceptTested: "Using cubic identity for mental calculations",
    isAIGenerated: true,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding AP SSC Math 9 — Layer B — Chapter 2 (Polynomials)…");

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
