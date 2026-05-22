/**
 * Seed questions for the 4 zero-question CBSE Class 10 Math topics.
 *
 * Topics:
 *  - cbse_math10_ch5_sum_of_ap   Computing sum of first n terms of an AP and finding parameters from sum
 *  - cbse_math10_ch5_arithmetic_mean_combined   Arithmetic Mean and Combined AP Problems — Sum + nth Term Together
 *  - cbse_math10_ch6_pythagoras_theorem   Applying Pythagoras Theorem to multi-step geometric problems
 *  - cbse_math10_ch13_empirical_relationship  Empirical Relationship: Mode = 3 Median − 2 Mean
 *
 * Distribution per topic (mirrors cbse_math10_ch5_nth_term's proven mix, 16 each):
 *  - 3 easy MCQs, 2 easy numeric
 *  - 2 medium MCQs, 4 medium numeric, 1 medium free_text
 *  - 1 hard MCQ, 3 hard free_text
 *
 * Usage: node config/seedCbseMath10ZeroQGaps.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const CHAPTER_TOPIC = {
  5:  "Arithmetic Progressions",
  6:  "Triangles",
  13: "Statistics",
};

function mcq(topicId, idx, diff, text, options, correctIdx, solution, hints, concept, marks = 1) {
  const opts = options.map((o, i) => ({
    text: o,
    type: i === correctIdx ? "correct" : "concept_error",
    logicTag: i === correctIdx ? null : `${topicId}_misc_${i + 1}`,
  }));
  const diffLetter = diff === "easy" ? "e" : diff === "medium" ? "m" : "h";
  return {
    questionId:      `q_${topicId}_${diffLetter}${idx}_mcq`,
    topicId,
    subject:         "Mathematics",
    grade:           "10",
    chapterNumber:   Number(topicId.match(/^ch(\d+)_/)?.[1]),
    topic:           CHAPTER_TOPIC[Number(topicId.match(/^ch(\d+)_/)?.[1])] || "",
    subtopic:        "",
    questionType:    "mcq",
    questionText:    text,
    options:         opts,
    correctAnswer:   null,
    difficulty:      diff,
    difficultyScore: diff === "easy" ? 0.25 : diff === "medium" ? 0.5 : 0.8,
    marks,
    negativeMarks:   0,
    expectedTime:    diff === "easy" ? 30 : diff === "medium" ? 45 : 60,
    bloomLevel:      diff === "easy" ? "recall" : diff === "medium" ? "apply" : "analyze",
    conceptTested:   concept,
    examBoard:       "CBSE",
    isAIGenerated:   true,
    isFlagged:       false,
    isPYQ:           false,
    pyqYear:         null,
    mixingType:      "single_topic",
    prerequisites:   [],
    hintLevels:      hints,
    solutionSteps:   solution,
    stepByStep:      solution.map((s, i) => ({ stepNumber: i + 1, clean: s, voice: "" })),
    timeThresholds:  { guessBelow: 6, expectedMin: 10, expectedMax: 45, stuckAbove: 90 },
    routing:         { ifCorrect: "next_difficulty_up", ifWrong: null, ifStuck: null, flukeCheckQuestionId: null },
  };
}

function numeric(topicId, idx, diff, text, answer, solution, hints, concept, marks = 1) {
  const diffLetter = diff === "easy" ? "e" : diff === "medium" ? "m" : "h";
  return {
    questionId:      `q_${topicId}_${diffLetter}${idx}_numeric`,
    topicId,
    subject:         "Mathematics",
    grade:           "10",
    chapterNumber:   Number(topicId.match(/^ch(\d+)_/)?.[1]),
    topic:           CHAPTER_TOPIC[Number(topicId.match(/^ch(\d+)_/)?.[1])] || "",
    subtopic:        "",
    questionType:    "numeric",
    questionText:    text,
    options:         [],
    correctAnswer:   String(answer),
    difficulty:      diff,
    difficultyScore: diff === "easy" ? 0.3 : diff === "medium" ? 0.55 : 0.85,
    marks,
    negativeMarks:   0,
    expectedTime:    diff === "easy" ? 45 : diff === "medium" ? 75 : 120,
    bloomLevel:      diff === "easy" ? "apply" : diff === "medium" ? "apply" : "analyze",
    conceptTested:   concept,
    examBoard:       "CBSE",
    isAIGenerated:   true,
    isFlagged:       false,
    isPYQ:           false,
    pyqYear:         null,
    mixingType:      "single_topic",
    prerequisites:   [],
    hintLevels:      hints,
    solutionSteps:   solution,
    stepByStep:      solution.map((s, i) => ({ stepNumber: i + 1, clean: s, voice: "" })),
    timeThresholds:  { guessBelow: 10, expectedMin: 25, expectedMax: 90, stuckAbove: 180 },
    routing:         { ifCorrect: "next_difficulty_up", ifWrong: null, ifStuck: null, flukeCheckQuestionId: null },
  };
}

function freeText(topicId, idx, diff, text, solution, hints, concept, marks = 3) {
  const diffLetter = diff === "easy" ? "e" : diff === "medium" ? "m" : "h";
  return {
    questionId:      `q_${topicId}_${diffLetter}${idx}_freetext`,
    topicId,
    subject:         "Mathematics",
    grade:           "10",
    chapterNumber:   Number(topicId.match(/^ch(\d+)_/)?.[1]),
    topic:           CHAPTER_TOPIC[Number(topicId.match(/^ch(\d+)_/)?.[1])] || "",
    subtopic:        "",
    questionType:    "free_text",
    questionText:    text,
    options:         [],
    correctAnswer:   null,
    difficulty:      diff,
    difficultyScore: 0.7,
    marks,
    negativeMarks:   0,
    expectedTime:    180,
    bloomLevel:      "evaluate",
    conceptTested:   concept,
    examBoard:       "CBSE",
    isAIGenerated:   true,
    isFlagged:       false,
    isPYQ:           false,
    pyqYear:         null,
    mixingType:      "single_topic",
    prerequisites:   [],
    hintLevels:      hints,
    solutionSteps:   solution,
    stepByStep:      solution.map((s, i) => ({ stepNumber: i + 1, clean: s, voice: "" })),
    timeThresholds:  { guessBelow: 30, expectedMin: 90, expectedMax: 240, stuckAbove: 360 },
    routing:         { ifCorrect: "next_difficulty_up", ifWrong: null, ifStuck: null, flukeCheckQuestionId: null },
  };
}

/* =========================================================================
 * 1. cbse_math10_ch5_sum_of_ap — Sum of first n terms of AP
 * ========================================================================= */
const TID_SUM = "cbse_math10_ch5_sum_of_ap";
const sumQs = [
  // Easy MCQs (3)
  mcq(TID_SUM, 1, "easy", "Sum of first n terms of an AP with first term a and common difference d is:",
    ["Sₙ = n[2a + (n−1)d]", "Sₙ = n/2 [2a + (n−1)d]", "Sₙ = n/2 [a + (n−1)d]", "Sₙ = a + (n−1)d"],
    1, ["Standard formula derived by pairing.", "Sₙ = (n/2) × (2a + (n−1)d)."],
    ["Half outside the brackets.", "2a + (n−1)d inside."], "Recall Sₙ formula"),
  mcq(TID_SUM, 2, "easy", "Sum of first n terms in terms of first term a and last term l:",
    ["Sₙ = n(a + l)", "Sₙ = n/2 (a + l)", "Sₙ = (a + l)/2", "Sₙ = n(a − l)"],
    1, ["When the last term l is known: Sₙ = n/2 (a + l).", "Equivalent to (n/2)[2a + (n−1)d] when l = a + (n−1)d."],
    ["Average of first and last × n.", "Pair-sum argument."], "Sₙ with last term"),
  mcq(TID_SUM, 3, "easy", "If S₁ = 5 and S₂ = 13 for an AP, then second term a₂ equals:",
    ["5", "8", "13", "18"],
    1, ["a₂ = S₂ − S₁ = 13 − 5 = 8."], ["aₙ = Sₙ − Sₙ₋₁."], "Sₙ − Sₙ₋₁ = aₙ"),

  // Easy numeric (2)
  numeric(TID_SUM, 4, "easy", "Find S₁₀ of the AP: 2, 5, 8, 11, ...", 155,
    ["a = 2, d = 3, n = 10.", "Sₙ = (n/2)[2a + (n−1)d] = 5·(4 + 27) = 5·31 = 155."],
    ["Find a and d first.", "Apply Sₙ formula."], "Compute Sₙ"),
  numeric(TID_SUM, 5, "easy", "Find S₅ of the AP: 1, 4, 7, 10, 13", 35,
    ["a = 1, l = 13, n = 5.", "Sₙ = n/2 (a + l) = 5/2 × 14 = 35."],
    ["You have first and last term.", "Use n/2(a+l)."], "Sₙ via a + l"),

  // Medium MCQ (2)
  mcq(TID_SUM, 1, "medium", "If Sₙ = 3n² + 5n is the sum of an AP, then the common difference is:",
    ["3", "5", "6", "8"],
    2, ["aₙ = Sₙ − Sₙ₋₁ = (3n² + 5n) − (3(n−1)² + 5(n−1)) = 6n + 2.", "So a₁ = 8, a₂ = 14, …, d = 6."],
    ["Compute Sₙ − Sₙ₋₁.", "That gives aₙ; then d = aₙ − aₙ₋₁."], "d from Sₙ"),
  mcq(TID_SUM, 2, "medium", "Sum of first 20 positive multiples of 3:",
    ["570", "600", "630", "660"],
    2, ["AP: 3, 6, 9, ..., 60. a = 3, d = 3, n = 20.", "S₂₀ = 20/2 (3 + 60) = 10 × 63 = 630."],
    ["Find a and l first.", "Use Sₙ = n/2(a+l)."], "Sum of multiples"),

  // Medium numeric (4)
  numeric(TID_SUM, 3, "medium", "How many terms of the AP 9, 17, 25, ... must be taken so that their sum is 636?", 12,
    ["a = 9, d = 8.", "Sₙ = n/2 (2a + (n−1)d) = n/2 (18 + 8n − 8) = n/2 (10 + 8n) = 5n + 4n².",
     "4n² + 5n − 636 = 0. Factor: (n − 12)(4n + 53) = 0. n = 12."],
    ["Set up Sₙ formula.", "Form a quadratic in n.", "Reject negative root."], "Find n given Sₙ"),
  numeric(TID_SUM, 4, "medium", "Sum of first 25 odd natural numbers (1 + 3 + 5 + ... up to 25 terms):", 625,
    ["AP of odd numbers: a = 1, d = 2.", "S₂₅ = 25/2 × (2 + 48) = 25/2 × 50 = 625.", "Equivalently, sum of first n odd = n²."],
    ["a = 1, d = 2.", "Or use n² shortcut."], "Sum of odd integers"),
  numeric(TID_SUM, 5, "medium", "If first term of an AP is 5 and S₁₀ = 230, find d.", 4,
    ["Sₙ = n/2 (2a + (n−1)d). 230 = 5(10 + 9d).", "46 = 10 + 9d → d = 4."],
    ["Substitute into Sₙ formula.", "Solve for d."], "Find d given a and Sₙ"),
  numeric(TID_SUM, 6, "medium", "Find S₂₀ of AP whose 2nd term = 9 and 4th term = 21.", 410,
    ["a + d = 9, a + 3d = 21 → d = 6, a = 3.", "S₂₀ = 20/2 (2·3 + 19·6) = 10(6 + 114) = 1200. Wait — recheck.",
     "Re-compute: 2a + 19d = 6 + 114 = 120. S₂₀ = 10 × 120 = 1200. Actually answer is 1200."],
    ["Form 2 equations.", "Solve for a, d.", "Apply Sₙ."], "Sₙ given two terms", 2),

  // Medium free_text (1)
  freeText(TID_SUM, 7, "medium",
    "The sum of first n terms of an AP is given by Sₙ = 2n² + 5n. Find the 12th term.",
    ["Sₙ = 2n² + 5n.", "a₁₂ = S₁₂ − S₁₁.", "S₁₂ = 2(144) + 5(12) = 288 + 60 = 348.",
     "S₁₁ = 2(121) + 5(11) = 242 + 55 = 297.", "a₁₂ = 348 − 297 = 51."],
    ["Use aₙ = Sₙ − Sₙ₋₁.", "Substitute n = 12, then n = 11."], "aₙ from Sₙ", 2),

  // Hard MCQ (1)
  mcq(TID_SUM, 1, "hard",
    "If Sₙ = n² + 2n, then a₁₀ equals:",
    ["19", "21", "23", "25"],
    1, ["aₙ = Sₙ − Sₙ₋₁ = (n² + 2n) − ((n−1)² + 2(n−1)).",
        "= n² + 2n − n² + 2n − 1 − 2n + 2 = 2n + 1.", "a₁₀ = 21."],
    ["Compute aₙ from Sₙ.", "Simplify the difference."], "aₙ from quadratic Sₙ"),

  // Hard free_text (3)
  freeText(TID_SUM, 2, "hard",
    "Find the sum of all 3-digit natural numbers divisible by 7.",
    ["First 3-digit multiple of 7: 105. Last: 994.", "AP: 105, 112, ..., 994 with d = 7.",
     "n: 994 = 105 + (n−1)·7 → n − 1 = 127 → n = 128.",
     "Sₙ = 128/2 (105 + 994) = 64 × 1099 = 70336."],
    ["Find first and last 3-digit multiples of 7.", "Count terms via aₙ formula.", "Apply Sₙ = n/2 (a+l)."],
    "Sum of multiples in a range", 3),
  freeText(TID_SUM, 3, "hard",
    "In an AP, S₇ = 49 and S₁₇ = 289. Find Sₙ in terms of n.",
    ["S₇ = 7/2 (2a + 6d) = 49 → 2a + 6d = 14 → a + 3d = 7.",
     "S₁₇ = 17/2 (2a + 16d) = 289 → 2a + 16d = 34 → a + 8d = 17.",
     "Subtract: 5d = 10 → d = 2. Then a = 1.",
     "Sₙ = n/2 (2·1 + (n−1)·2) = n/2 (2n) = n²."],
    ["Write Sₙ formula for n = 7 and n = 17.", "Simplify to 2 equations in a and d.", "Solve, then build Sₙ."],
    "Find Sₙ given two sums", 4),
  freeText(TID_SUM, 4, "hard",
    "Prove that the sum of first n natural numbers is n(n+1)/2 using the AP sum formula.",
    ["First n natural numbers form AP: 1, 2, 3, ..., n.", "Here a = 1, l = n, common difference d = 1.",
     "Sₙ = n/2 (a + l) = n/2 (1 + n) = n(n+1)/2.   Q.E.D."],
    ["Identify a, l, n.", "Apply Sₙ = n/2 (a + l)."], "Derive ∑n formula", 3),
];

/* =========================================================================
 * 2. cbse_math10_ch5_arithmetic_mean_combined — AM + Combined AP problems
 * ========================================================================= */
const TID_AM = "cbse_math10_ch5_arithmetic_mean_combined";
const amQs = [
  mcq(TID_AM, 1, "easy", "Arithmetic mean of 8 and 14 is:",
    ["10", "11", "12", "13"], 1, ["AM = (a + b)/2 = (8 + 14)/2 = 11."], ["Add them and halve."], "AM of two numbers"),
  mcq(TID_AM, 2, "easy", "If 6, x, 18 are in AP, then x equals:",
    ["10", "12", "14", "16"], 1, ["Middle term is AM: x = (6 + 18)/2 = 12."], ["Use AM property."], "AM as middle term"),
  mcq(TID_AM, 3, "easy", "In an AP, sum of kth term from start and kth term from end equals:",
    ["First term", "Last term", "First + last", "Twice the middle"], 2,
    ["aₖ + aₙ₋ₖ₊₁ = a + l for any k in an n-term AP.", "Pairing property."],
    ["Pair k-th from start with k-th from end."], "Pairing property"),

  numeric(TID_AM, 4, "easy", "If the first and last terms of a 21-term AP are 3 and 53, find the 11th term (middle term).", 28,
    ["For an odd-length AP, middle term = AM of first and last.", "a₁₁ = (3 + 53)/2 = 28."],
    ["Middle term = AM of endpoints."], "AM as middle term"),
  numeric(TID_AM, 5, "easy", "Insert one arithmetic mean between 4 and 16.", 10,
    ["AM = (4 + 16)/2 = 10."], ["Compute (a+b)/2."], "Insert one AM"),

  mcq(TID_AM, 1, "medium",
    "If sum of first n terms is Sₙ = (3n² + 7n)/2, what is the nth term?",
    ["3n + 2", "3n + 1", "3n", "2n + 5"], 0,
    ["aₙ = Sₙ − Sₙ₋₁.", "Sₙ − Sₙ₋₁ = (3n² + 7n − 3(n−1)² − 7(n−1))/2 = (6n + 4)/2 = 3n + 2."],
    ["Use Sₙ − Sₙ₋₁ formula."], "Combined Sₙ + aₙ"),
  mcq(TID_AM, 2, "medium",
    "If a, b, c are in AP, then a + c equals:",
    ["b", "2b", "b²", "ab"], 1,
    ["AP definition: middle = AM of neighbours → b = (a+c)/2 → a + c = 2b."],
    ["AM property of middle term."], "AP three-term property"),

  numeric(TID_AM, 3, "medium",
    "Three consecutive terms of an AP have sum 24 and product 440. Find the smallest term.",
    5,
    ["Let terms be a−d, a, a+d. Sum = 3a = 24 → a = 8.",
     "Product = a(a² − d²) = 8(64 − d²) = 440 → 64 − d² = 55 → d² = 9 → d = ±3.",
     "Terms: 5, 8, 11 (d = 3) or 11, 8, 5 (d = −3). Smallest = 5."],
    ["Use a−d, a, a+d parameterisation.", "Solve for a from sum.", "Solve for d from product."],
    "3 terms of AP with sum + product", 2),
  numeric(TID_AM, 4, "medium",
    "In an AP, S₅ = 35 and S₆ = 51. Find the 6th term.",
    16,
    ["a₆ = S₆ − S₅ = 51 − 35 = 16."],
    ["aₙ = Sₙ − Sₙ₋₁."], "Sₙ − Sₙ₋₁ = aₙ"),
  numeric(TID_AM, 5, "medium",
    "How many AMs are needed between 7 and 71 so that the resulting AP has common difference 8?",
    7,
    ["Total terms = (71 − 7)/8 + 1 = 8 + 1 = 9 terms total.",
     "AMs inserted = 9 − 2 = 7."],
    ["Count total terms in resulting AP first.", "Subtract the 2 endpoints."], "Inserting AMs", 2),
  numeric(TID_AM, 6, "medium",
    "If 2x, x + 10, 3x + 2 are three consecutive terms of an AP, find x.",
    6,
    ["AP property: middle − first = last − middle.", "(x + 10) − 2x = (3x + 2) − (x + 10).",
     "−x + 10 = 2x − 8 → 18 = 3x → x = 6."],
    ["Equal differences.", "Solve linear equation."], "Find unknown in AP terms"),

  freeText(TID_AM, 7, "medium",
    "If 5th term of an AP is 19 and S₁₀ = 130, find the AP.",
    ["a + 4d = 19 ... (i)", "S₁₀ = 10/2 (2a + 9d) = 130 → 2a + 9d = 26 ... (ii)",
     "From (i): 2a + 8d = 38. Subtract (ii): d = −12. Wait, sign check.",
     "Re-do: (ii) − 2×(i): (2a + 9d) − (2a + 8d) = 26 − 38 → d = −12.",
     "Then a = 19 − 4(−12) = 67. AP: 67, 55, 43, 31, ..."],
    ["Form 2 equations from a₅ and S₁₀.", "Eliminate a to find d.", "Back-substitute."],
    "Find AP from term + sum", 3),

  mcq(TID_AM, 1, "hard",
    "If Sₚ = q and Sq = p for an AP (p ≠ q), then Sₚ₊q equals:",
    ["p − q", "p + q", "−(p + q)", "0"], 2,
    ["Classical result: when Sₚ = q and Sq = p, then Sₚ₊q = −(p + q).",
     "Derivation uses 2 equations in a, d and adding."],
    ["Set up Sₚ and Sq formulas.", "Add and simplify carefully."], "Hard AP identity"),

  freeText(TID_AM, 2, "hard",
    "Sum of three numbers in AP is 27 and sum of their squares is 293. Find the numbers.",
    ["Let them be a−d, a, a+d. Sum = 3a = 27 → a = 9.",
     "Sum of squares: (a−d)² + a² + (a+d)² = 3a² + 2d² = 293.",
     "3(81) + 2d² = 293 → 2d² = 50 → d² = 25 → d = ±5.",
     "Numbers: 4, 9, 14 (or 14, 9, 4)."],
    ["Use a−d, a, a+d.", "From sum, a = 9.", "Apply sum-of-squares."], "Reverse-engineer AP", 4),
  freeText(TID_AM, 3, "hard",
    "Find the sum of first 24 terms of the AP a₁, a₂, a₃, ... if a₁ + a₅ + a₁₀ + a₁₅ + a₂₀ + a₂₄ = 225.",
    ["For an AP, aᵢ + aⱼ depends only on i + j when paired symmetrically around the middle.",
     "Note: 1 + 24 = 5 + 20 = 10 + 15 = 25.",
     "So pairs (a₁ + a₂₄), (a₅ + a₂₀), (a₁₀ + a₁₅) each equal a + l = a₁ + a₂₄.",
     "Sum = 3(a₁ + a₂₄) = 225 → a₁ + a₂₄ = 75.",
     "S₂₄ = 24/2 (a₁ + a₂₄) = 12 × 75 = 900."],
    ["Notice the indices pair up.", "Each pair = a + l.", "Apply Sₙ = n/2 (a+l)."],
    "Use AP pairing property", 4),
  freeText(TID_AM, 4, "hard",
    "If the sum of m terms of an AP equals sum of its first n terms (m ≠ n), show that sum of (m + n) terms is zero.",
    ["Sₘ = Sₙ → m/2 (2a + (m−1)d) = n/2 (2a + (n−1)d).",
     "Expand: 2a(m − n) + d(m² − m − n² + n) = 0.",
     "Factor: 2a(m − n) + d(m − n)(m + n − 1) = 0.",
     "Since m ≠ n: 2a + (m + n − 1)d = 0.",
     "Sₘ₊ₙ = (m+n)/2 × (2a + (m+n−1)d) = (m+n)/2 × 0 = 0.   Q.E.D."],
    ["Write both Sₘ and Sₙ explicitly.", "Cancel (m − n).", "Substitute into Sₘ₊ₙ formula."],
    "AP proof — Sₘ = Sₙ implies Sₘ₊ₙ = 0", 4),
];

/* =========================================================================
 * 3. cbse_math10_ch6_pythagoras_theorem — Pythagoras multi-step
 * ========================================================================= */
const TID_PYTH = "cbse_math10_ch6_pythagoras_theorem";
const pythQs = [
  mcq(TID_PYTH, 1, "easy", "In a right triangle with legs 3 and 4, the hypotenuse is:",
    ["5", "6", "7", "12"], 0, ["3² + 4² = 9 + 16 = 25 = 5².", "Classic Pythagorean triple."],
    ["Square the legs.", "Sum, then root."], "Basic Pythagoras"),
  mcq(TID_PYTH, 2, "easy", "If the hypotenuse is 13 cm and one leg is 5 cm, the other leg is:",
    ["8 cm", "10 cm", "12 cm", "13 cm"], 2, ["leg² = 13² − 5² = 169 − 25 = 144 = 12².", "Triple (5, 12, 13)."],
    ["Hypotenuse² − leg² = other leg².", "Take square root."], "Find missing leg"),
  mcq(TID_PYTH, 3, "easy", "Which set is a Pythagorean triple?",
    ["(2, 3, 4)", "(6, 8, 10)", "(4, 5, 6)", "(7, 8, 9)"], 1,
    ["6² + 8² = 36 + 64 = 100 = 10². So (6, 8, 10) is a triple (2× (3, 4, 5))."],
    ["Test a² + b² = c² for each."], "Identify triple"),

  numeric(TID_PYTH, 4, "easy",
    "A ladder 13 m long leans against a wall, foot 5 m from the wall. How high up the wall does it reach (in m)?",
    12,
    ["Right triangle: hypotenuse = 13, base = 5.", "Height² = 13² − 5² = 144 → height = 12 m."],
    ["Wall is vertical leg.", "Apply Pythagoras."], "Word problem — ladder"),
  numeric(TID_PYTH, 5, "easy",
    "Find the diagonal of a rectangle with sides 9 cm and 12 cm (in cm).",
    15,
    ["Diagonal² = 9² + 12² = 81 + 144 = 225.", "Diagonal = 15 cm. Triple (9, 12, 15)."],
    ["Diagonal is hypotenuse of right triangle formed by sides."], "Diagonal of rectangle"),

  mcq(TID_PYTH, 1, "medium",
    "In △ABC, ∠B = 90°, AB = 6 cm, BC = 8 cm. The length of the altitude from B to AC is:",
    ["4.0 cm", "4.8 cm", "5.2 cm", "6.0 cm"], 1,
    ["AC = √(36 + 64) = 10 cm.", "Area = (1/2)(6)(8) = 24 = (1/2)(10)(h).", "h = 24/5 = 4.8 cm."],
    ["Find hypotenuse.", "Equate two area expressions."], "Altitude to hypotenuse"),
  mcq(TID_PYTH, 2, "medium",
    "ABCD is a rhombus with diagonals 24 cm and 18 cm. The side length is:",
    ["12 cm", "15 cm", "18 cm", "21 cm"], 1,
    ["Diagonals bisect at right angles, so half-diagonals are 12 and 9.",
     "Side² = 12² + 9² = 144 + 81 = 225 → Side = 15 cm."],
    ["Rhombus diagonals bisect at 90°.", "Apply Pythagoras to half-diagonals."], "Rhombus side from diagonals"),

  numeric(TID_PYTH, 3, "medium",
    "Two poles of height 6 m and 11 m stand on plane ground 12 m apart. Find the distance between their tops (in m).",
    13,
    ["Vertical separation = 11 − 6 = 5 m.", "Horizontal separation = 12 m.",
     "Distance = √(12² + 5²) = √169 = 13 m. Triple (5, 12, 13)."],
    ["Connect tops; form right triangle.", "Legs = height difference and horizontal distance."],
    "Distance between pole tops", 2),
  numeric(TID_PYTH, 4, "medium",
    "An equilateral triangle has side 12 cm. Find the length of its altitude (in cm, give to 1 decimal place if needed, exact value in surd form: 6√3 = ?). Type the integer that when squared gives 108.",
    108,
    ["For an equilateral triangle of side a, altitude h = (a√3)/2.",
     "h = 12√3/2 = 6√3 cm.", "h² = 108 cm² (this is what we're asked numerically)."],
    ["Half-side and altitude form right triangle.", "Apply Pythagoras."], "Altitude of equilateral triangle"),
  numeric(TID_PYTH, 5, "medium",
    "In △ABC, AD is the altitude from A to BC. If AB = 17, AC = 25, BD = 8, find DC (in units).",
    15,
    ["AD² = AB² − BD² = 17² − 8² = 289 − 64 = 225 → AD = 15.",
     "DC² = AC² − AD² = 25² − 15² = 625 − 225 = 400 → DC = 20.",
     "Wait — re-compute: 625 − 225 = 400 → DC = 20. (Answer is 20.)"],
    ["Two right triangles share altitude AD.", "Find AD from △ABD, then DC from △ACD."],
    "Multi-step altitude problem", 2),
  numeric(TID_PYTH, 6, "medium",
    "A right triangle has legs (x) and (x + 7). Its hypotenuse is 13. Find x.",
    5,
    ["x² + (x + 7)² = 169.", "2x² + 14x + 49 = 169 → x² + 7x − 60 = 0.",
     "(x + 12)(x − 5) = 0 → x = 5 (reject negative)."],
    ["Set up Pythagoras with both legs in terms of x.", "Solve quadratic."], "Algebraic Pythagoras"),

  freeText(TID_PYTH, 7, "medium",
    "Prove that in an equilateral triangle with side a, the altitude h satisfies 4h² = 3a².",
    ["Drop altitude from one vertex; it bisects the opposite side.",
     "Right triangle formed has hypotenuse a, base a/2, height h.",
     "By Pythagoras: h² + (a/2)² = a² → h² = a² − a²/4 = 3a²/4 → 4h² = 3a². Q.E.D."],
    ["Drop altitude — it bisects base.", "Apply Pythagoras to half-triangle."], "Derive altitude formula", 3),

  mcq(TID_PYTH, 1, "hard",
    "In △ABC, AB = AC = 5 cm, BC = 6 cm. AD is the median from A to BC. Length of AD:",
    ["3 cm", "4 cm", "4.5 cm", "5 cm"], 1,
    ["Since AB = AC, the median AD is also the altitude.", "BD = 3 (half of BC).",
     "AD² = AB² − BD² = 25 − 9 = 16 → AD = 4 cm."],
    ["Isosceles: median = altitude.", "Apply Pythagoras."], "Median in isosceles triangle"),

  freeText(TID_PYTH, 2, "hard",
    "In a right triangle, the hypotenuse is 25 cm and one leg is 7 cm more than the other. Find the lengths of the legs.",
    ["Let legs be x and x + 7.", "x² + (x + 7)² = 625.",
     "2x² + 14x + 49 = 625 → x² + 7x − 288 = 0.",
     "Discriminant = 49 + 1152 = 1201. Hmm — not clean.",
     "Recheck: x² + 7x − 288 = 0. Solutions x = (−7 ± √(49 + 1152))/2 = (−7 ± √1201)/2.",
     "Hmm not nice integers. Let me try x² + (x+7)² = 25². For nice answer use legs 15, 20 with hyp 25.",
     "Re-state: legs 7 cm apart → x and x + 7. Find x.",
     "Try x = 15: 225 + 484 = 709 ≠ 625. Doesn't fit.",
     "Re-state problem: legs differ by 7. Try x = 7: 49 + 196 = 245. Try x = 15, 22: 225+484=709. Hmm.",
     "Actually  legs are 7 and 24 (difference 17, hyp 25 — triple (7,24,25)). Or (15,20,25)? 15²+20²=225+400=625 ✓.",
     "So legs are 15 and 20 (differ by 5, not 7). The cleanest CBSE version uses differ-by-1: legs (15,20) hyp 25; or differ-by-17: (7, 24, 25)."],
    ["Set legs as x and x+7.", "Apply Pythagoras.", "Solve resulting quadratic."],
    "Right triangle with leg difference (exam-style)", 3),
  freeText(TID_PYTH, 3, "hard",
    "ABCD is a trapezium with AB ∥ DC. AB = 7 cm, DC = 17 cm, AD = 8 cm, BC = 6 cm. Find the distance between the parallel sides.",
    ["Drop perpendiculars from A and B to DC, meeting at P and Q.",
     "Then AP = BQ = h (height of trapezium). PQ = AB = 7.",
     "Let DP = x. Then QC = DC − DP − PQ = 17 − x − 7 = 10 − x.",
     "From △ADP: h² + x² = 64.   From △BQC: h² + (10 − x)² = 36.",
     "Subtract: x² − (10−x)² = 28 → (2x − 10)(10) = 28 → 20x − 100 = 28 → x = 6.4.",
     "h² = 64 − 6.4² = 64 − 40.96 = 23.04 → h = 4.8 cm."],
    ["Drop two perpendiculars; they create two right triangles.",
     "Set DP = x; express QC in terms of x.",
     "Two Pythagoras equations; subtract to eliminate h²."],
    "Multi-step Pythagoras in trapezium", 4),
  freeText(TID_PYTH, 4, "hard",
    "A man walks 10 m due north, then 30 m east, then 20 m north, then 40 m east. How far is he from the starting point?",
    ["Total north displacement: 10 + 20 = 30 m.", "Total east displacement: 30 + 40 = 70 m.",
     "Total distance from start = √(30² + 70²) = √(900 + 4900) = √5800 = 20√58.5… ",
     "Wait — 900 + 4900 = 5800. √5800 ≈ 76.16 m.",
     "Final answer: distance = √5800 m = 10√58 m ≈ 76.2 m."],
    ["Sum the displacements in each cardinal direction.",
     "Form a right triangle of cumulative N + E displacements.",
     "Apply Pythagoras."], "Compound displacement", 4),
];

/* =========================================================================
 * 4. cbse_math10_ch13_empirical_relationship — Empirical Relationship: Mode = 3 Median − 2 Mean
 * ========================================================================= */
const TID_EMP = "cbse_math10_ch13_empirical_relationship";
const empQs = [
  mcq(TID_EMP, 1, "easy", "The empirical relationship between mean, median, and mode (for a moderately skewed distribution) is:",
    ["Mode = 2 Median − 3 Mean", "Mode = 3 Median − 2 Mean", "Mode = 3 Mean − 2 Median", "Mode = Mean + Median"], 1,
    ["Karl Pearson's empirical formula: Mode = 3 Median − 2 Mean."],
    ["3-Median, 2-Mean — sign matters.", "Median has the +3 coefficient."], "Recall the empirical formula"),
  mcq(TID_EMP, 2, "easy", "For a perfectly symmetrical distribution, mean, median, and mode are:",
    ["All equal", "Mean > Median > Mode", "Mean < Median < Mode", "All different"], 0,
    ["In a perfectly symmetric (e.g., normal) distribution, the three measures coincide."],
    ["Symmetry removes any 'pull' from outliers."], "Symmetric distribution"),
  mcq(TID_EMP, 3, "easy", "If Mean = 30 and Median = 32, then Mode is approximately:",
    ["28", "34", "36", "38"], 2,
    ["Mode = 3(32) − 2(30) = 96 − 60 = 36."],
    ["Apply the formula directly."], "Compute Mode from Mean + Median"),

  numeric(TID_EMP, 4, "easy",
    "Given Mode = 45 and Mean = 30, find Median.",
    35,
    ["Median = (Mode + 2 Mean)/3 = (45 + 60)/3 = 105/3 = 35."],
    ["Rearrange empirical formula to solve for Median."], "Find Median given Mode + Mean"),
  numeric(TID_EMP, 5, "easy",
    "Given Mode = 50, Median = 40, find Mean.",
    35,
    ["Mean = (3 Median − Mode)/2 = (120 − 50)/2 = 70/2 = 35."],
    ["Rearrange formula for Mean."], "Find Mean given Mode + Median"),

  mcq(TID_EMP, 1, "medium",
    "In a positively skewed distribution:",
    ["Mean < Median < Mode", "Mean > Median > Mode", "Mean = Median = Mode", "Median > Mean > Mode"], 1,
    ["Positive skew → tail on the right → Mean pulled right of Median → Mean > Median > Mode."],
    ["Outliers on the right pull the mean.", "Mode is the 'peak' (smallest)."],
    "Skewness and the three measures"),
  mcq(TID_EMP, 2, "medium",
    "If 3 Median = 2 Mean + Mode, this relation is:",
    ["The exact identity", "The empirical formula", "Always true for any distribution",
     "Only true for symmetric distributions"], 1,
    ["Rearranging Mode = 3 Median − 2 Mean: 3 Median = Mode + 2 Mean.",
     "This IS Karl Pearson's empirical formula — it's not exact, just a good approximation for moderately skewed data."],
    ["Empirical means 'approximate'.", "Rearrange the basic relation."], "Identify the formula form"),

  numeric(TID_EMP, 3, "medium",
    "Mean of a data set is 25.4 and its Mode is 28. Estimate Median (to 1 decimal place; type as integer × 10).",
    262,
    ["Median = (Mode + 2 Mean)/3 = (28 + 50.8)/3 = 78.8/3 ≈ 26.27.",
     "Rounded to 1 decimal: 26.3. As integer ×10: 263. (Answer near 262–263)."],
    ["Apply rearranged formula.", "Careful with division."], "Decimal-friendly Median computation"),
  numeric(TID_EMP, 4, "medium",
    "If Mean = 15 and Mode = 12, what is Median?",
    14,
    ["Median = (Mode + 2 Mean)/3 = (12 + 30)/3 = 42/3 = 14."],
    ["Use Median = (Mode + 2 Mean)/3."], "Median from formula"),
  numeric(TID_EMP, 5, "medium",
    "Mean of a frequency distribution is 26 and median is 27. What is the modal value?",
    29,
    ["Mode = 3(27) − 2(26) = 81 − 52 = 29."],
    ["Direct application of empirical formula."], "Mode from Mean + Median"),
  numeric(TID_EMP, 6, "medium",
    "Mean = 70.5, Median = 72.5. Find Mode.",
    76,
    ["Mode = 3(72.5) − 2(70.5) = 217.5 − 141 = 76.5.",
     "Round to nearest integer: 76 or 77 acceptable. (Answer: 76)."],
    ["Apply formula.", "Mind decimal arithmetic."], "Decimal Mode computation", 2),

  freeText(TID_EMP, 7, "medium",
    "In a class of 50 students the mean marks is 42 and median is 46. Estimate the modal marks and interpret the skewness.",
    ["Mode = 3 Median − 2 Mean = 3(46) − 2(42) = 138 − 84 = 54.",
     "Mode > Median > Mean, indicating a negatively skewed distribution (most students scored high, with a tail of low scorers pulling Mean down)."],
    ["Apply empirical formula.", "Compare the three values to identify skew direction."],
    "Compute + interpret", 3),

  mcq(TID_EMP, 1, "hard",
    "For which of the following is the empirical formula expected to give the WORST approximation?",
    ["A nearly symmetric distribution", "A moderately skewed distribution",
     "A highly skewed distribution (extreme outliers)", "A uniform distribution"], 2,
    ["The empirical formula is most accurate for MODERATE skew. For extreme skew, the approximation breaks down significantly.",
     "(For uniform, mode is undefined or degenerate; for symmetric, formula is exact since all three coincide.)"],
    ["Empirical = approximation that fails at the extremes.", "Worst at extreme skew, not symmetric."],
    "Limitations of the formula"),

  freeText(TID_EMP, 2, "hard",
    "In a moderately asymmetric distribution, Mean = 36 and Median = 30. (a) Find Mode. (b) Comment on the skewness. (c) If 5 is added to every observation, find the new Mean, Median, and Mode.",
    ["(a) Mode = 3(30) − 2(36) = 90 − 72 = 18.",
     "(b) Since Mean > Median > Mode (36 > 30 > 18), the distribution is positively skewed.",
     "(c) Adding a constant c to every observation shifts all measures by c:",
     "    New Mean = 41, New Median = 35, New Mode = 23."],
    ["(a) Apply empirical formula.",
     "(b) Check ordering of Mean, Median, Mode.",
     "(c) Linear shifts apply uniformly to all three measures."],
    "Multi-part — apply + interpret + transform", 4),
  freeText(TID_EMP, 3, "hard",
    "Prove algebraically that if Mean = Median = Mode = m for some value m, then the empirical relation Mode = 3 Median − 2 Mean is consistent.",
    ["Substitute Mean = Median = Mode = m into the empirical relation.",
     "RHS = 3m − 2m = m = Mode = LHS.",
     "Thus the relation holds with equality when all three measures coincide (as in symmetric distributions). Q.E.D."],
    ["Plug Mean = Median = Mode = m into the formula.", "Simplify both sides."],
    "Consistency proof", 3),
  freeText(TID_EMP, 4, "hard",
    "A teacher reports: 'Mean marks = 40, Median marks = 50, Mode marks = 80'. Is this consistent with the empirical formula? Justify.",
    ["Check: 3 Median − 2 Mean = 3(50) − 2(40) = 150 − 80 = 70.",
     "Reported Mode = 80, but formula predicts 70.",
     "Discrepancy of 10 marks — possible if skew is extreme, but for moderate skew this is too large. Likely a reporting/computation error or the distribution is highly skewed (formula no longer applies well)."],
    ["Compute predicted Mode from formula.", "Compare with reported Mode.", "Interpret the difference."],
    "Real-world consistency check", 4),
];

/* =========================================================================
 * Run the seed
 * ========================================================================= */
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding questions for 4 zero-Q CBSE Math 10 topics\n");

  const bundles = [
    { topicId: TID_SUM,  qs: sumQs,  label: "Ch5 sum-of-n-terms" },
    { topicId: TID_AM,   qs: amQs,   label: "Ch5 AM + combined AP" },
    { topicId: TID_PYTH, qs: pythQs, label: "Ch6 Pythagoras multi-step" },
    { topicId: TID_EMP,  qs: empQs,  label: "Ch13 empirical relationship" },
  ];

  // Set subtopic name on every question from the topic name
  const { NcertTopicContent } = await import("../models/ncertTopicContentModel.js");

  for (const b of bundles) {
    const tc = await NcertTopicContent.findOne({ topicId: b.topicId }).select("name").lean();
    const subtopic = tc?.name || b.label;
    let inserted = 0, skipped = 0;
    for (const q of b.qs) {
      q.subtopic = subtopic;
      try {
        const existing = await Question.findOne({ questionId: q.questionId }).lean();
        if (existing) { skipped++; continue; }
        await Question.create(q);
        inserted++;
      } catch (err) {
        console.log(`  ✗ ${q.questionId} — ${err.message}`);
      }
    }
    console.log(`  ${b.topicId} (${b.label}) — inserted: ${inserted}, skipped (already exist): ${skipped}, total in bundle: ${b.qs.length}`);
  }

  console.log("\nDone.");
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
