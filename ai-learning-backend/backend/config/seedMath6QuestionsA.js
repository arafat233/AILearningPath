/**
 * CBSE Class 6 Mathematics — MCQ seed (Ch 1–5)
 * 5 questions per chapter = 25 questions total.
 * Usage: node config/seedMath6QuestionsA.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";

dotenv.config();

const questions = [
  // ── Ch 1: Patterns in Mathematics ──────────────────────────────────────
  {
    questionId: "math6_ch1_q1",
    questionText: "What is the 7th triangular number?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Patterns in Mathematics", topic: "math6_ch1", topicId: "math6_ch1",
    difficulty: "easy", type: "mcq",
    options: [
      { text: "28", isCorrect: true,  type: "correct",           logicTag: "T(7) = 7×8/2 = 28" },
      { text: "21", isCorrect: false, type: "calculation_error", logicTag: "T(6) = 21, off by one" },
      { text: "49", isCorrect: false, type: "concept_error",     logicTag: "gives 7², confuses with square numbers" },
      { text: "35", isCorrect: false, type: "partial_logic",     logicTag: "adds 8 to T(6) incorrectly" },
    ],
    solutionSteps: ["T(n) = n(n+1)/2", "T(7) = 7×8/2 = 56/2 = 28"],
    shortcut: "Triangular numbers: 1,3,6,10,15,21,28 — each adds the next counting number.",
  },
  {
    questionId: "math6_ch1_q2",
    questionText: "Which of the following is a Fibonacci number?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Patterns in Mathematics", topic: "math6_ch1", topicId: "math6_ch1",
    difficulty: "easy", type: "mcq",
    options: [
      { text: "34", isCorrect: true,  type: "correct",           logicTag: "Fibonacci: 1,1,2,3,5,8,13,21,34" },
      { text: "32", isCorrect: false, type: "concept_error",     logicTag: "32 = 2^5, a power of 2 not Fibonacci" },
      { text: "36", isCorrect: false, type: "concept_error",     logicTag: "36 = 6², a square number" },
      { text: "30", isCorrect: false, type: "guessing",          logicTag: "not in Fibonacci sequence" },
    ],
    solutionSteps: ["Fibonacci: 1,1,2,3,5,8,13,21,34,55,…", "34 = 21+13 ✓"],
    shortcut: "Memorise Fibonacci to 55: 1,1,2,3,5,8,13,21,34,55.",
  },
  {
    questionId: "math6_ch1_q3",
    questionText: "What is the sum of the first 6 odd numbers?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Patterns in Mathematics", topic: "math6_ch1", topicId: "math6_ch1",
    difficulty: "medium", type: "mcq",
    options: [
      { text: "36", isCorrect: true,  type: "correct",           logicTag: "sum of first n odd numbers = n²; 6²=36" },
      { text: "21", isCorrect: false, type: "concept_error",     logicTag: "gives triangular number T(6)" },
      { text: "42", isCorrect: false, type: "calculation_error", logicTag: "arithmetic error" },
      { text: "30", isCorrect: false, type: "partial_logic",     logicTag: "adds 1+3+5+7+9 only (5 terms)" },
    ],
    solutionSteps: ["Pattern: sum of first n odd numbers = n²", "First 6 odd: 1+3+5+7+9+11 = 36", "Also: 6² = 36 ✓"],
    shortcut: "Sum of first n odd numbers always equals n². No need to add each one.",
  },
  {
    questionId: "math6_ch1_q4",
    questionText: "The 10th term of the sequence of powers of 2 (starting from 2^0) is:",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Patterns in Mathematics", topic: "math6_ch1", topicId: "math6_ch1",
    difficulty: "medium", type: "mcq",
    options: [
      { text: "512", isCorrect: true,  type: "correct",           logicTag: "sequence: 1,2,4,8,… = 2^0,2^1,…; 10th = 2^9=512" },
      { text: "1024",isCorrect: false, type: "calculation_error", logicTag: "2^10=1024, off by one (11th term)" },
      { text: "256", isCorrect: false, type: "partial_logic",     logicTag: "2^8=256, off by one (9th term)" },
      { text: "20",  isCorrect: false, type: "concept_error",     logicTag: "multiplies 2×10 instead of raising to power" },
    ],
    solutionSteps: ["Sequence: 2^0, 2^1, 2^2, …, 2^(n−1)", "10th term = 2^(10−1) = 2^9 = 512"],
    shortcut: "Powers of 2 starting from 1: the nth term = 2^(n−1). 10th = 2^9 = 512.",
  },
  {
    questionId: "math6_ch1_q5",
    questionText: "Which number is both a square number and a triangular number (other than 1)?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Patterns in Mathematics", topic: "math6_ch1", topicId: "math6_ch1",
    difficulty: "hard", type: "mcq",
    options: [
      { text: "36", isCorrect: true,  type: "correct",           logicTag: "36 = 6² and T(8) = 36" },
      { text: "25", isCorrect: false, type: "partial_logic",     logicTag: "25 = 5² but not triangular" },
      { text: "16", isCorrect: false, type: "concept_error",     logicTag: "16 = 4² but not triangular" },
      { text: "10", isCorrect: false, type: "calculation_error", logicTag: "10 is triangular (T5) but not a square" },
    ],
    solutionSteps: ["Square numbers: 1,4,9,16,25,36,49,…", "Triangular numbers: 1,3,6,10,15,21,28,36,…", "36 = 6² = T(8) ✓"],
    shortcut: "Check small square numbers against triangular list: 1(both), 36(both), 1225(both). Answer in range is 36.",
  },

  // ── Ch 2: Lines and Angles ─────────────────────────────────────────────
  {
    questionId: "math6_ch2_q1",
    questionText: "The complement of 54° is:",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Lines and Angles", topic: "math6_ch2", topicId: "math6_ch2",
    difficulty: "easy", type: "mcq",
    options: [
      { text: "36°",  isCorrect: true,  type: "correct",           logicTag: "90 − 54 = 36" },
      { text: "126°", isCorrect: false, type: "concept_error",     logicTag: "gives supplement instead of complement" },
      { text: "46°",  isCorrect: false, type: "calculation_error", logicTag: "arithmetic error" },
      { text: "54°",  isCorrect: false, type: "guessing",          logicTag: "repeats given angle" },
    ],
    solutionSteps: ["Complementary angles sum to 90°", "Complement = 90° − 54° = 36°"],
    shortcut: "Complement = 90° − angle. Supplement = 180° − angle.",
  },
  {
    questionId: "math6_ch2_q2",
    questionText: "An angle of 155° is best described as:",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Lines and Angles", topic: "math6_ch2", topicId: "math6_ch2",
    difficulty: "easy", type: "mcq",
    options: [
      { text: "Obtuse", isCorrect: true,  type: "correct",           logicTag: "90° < 155° < 180°" },
      { text: "Acute",  isCorrect: false, type: "concept_error",     logicTag: "acute is <90°" },
      { text: "Reflex", isCorrect: false, type: "concept_error",     logicTag: "reflex is >180°" },
      { text: "Straight",isCorrect: false,type: "calculation_error", logicTag: "straight is exactly 180°" },
    ],
    solutionSteps: ["Acute: <90°", "Right: =90°", "Obtuse: 90°–180°", "155° falls between 90° and 180° → Obtuse"],
    shortcut: "Between 90 and 180 = Obtuse. Greater than 180 = Reflex.",
  },
  {
    questionId: "math6_ch2_q3",
    questionText: "Two supplementary angles are in the ratio 2:3. Find the larger angle.",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Lines and Angles", topic: "math6_ch2", topicId: "math6_ch2",
    difficulty: "medium", type: "mcq",
    options: [
      { text: "108°", isCorrect: true,  type: "correct",           logicTag: "5 parts=180; each part=36; larger=3×36=108" },
      { text: "72°",  isCorrect: false, type: "partial_logic",     logicTag: "gives the smaller angle (2×36)" },
      { text: "120°", isCorrect: false, type: "concept_error",     logicTag: "uses complementary (90°) base" },
      { text: "90°",  isCorrect: false, type: "guessing",          logicTag: "assumes right angle" },
    ],
    solutionSteps: ["Supplementary: sum = 180°", "Parts: 2+3 = 5; each part = 180/5 = 36°", "Larger angle = 3 × 36° = 108°"],
    shortcut: "Sum of ratio parts × each part = total angle. Each part = total ÷ sum of ratios.",
  },
  {
    questionId: "math6_ch2_q4",
    questionText: "What is the reflex angle corresponding to 65°?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Lines and Angles", topic: "math6_ch2", topicId: "math6_ch2",
    difficulty: "medium", type: "mcq",
    options: [
      { text: "295°", isCorrect: true,  type: "correct",           logicTag: "360 − 65 = 295" },
      { text: "115°", isCorrect: false, type: "concept_error",     logicTag: "gives supplement 180−65" },
      { text: "25°",  isCorrect: false, type: "calculation_error", logicTag: "gives complement 90−65" },
      { text: "245°", isCorrect: false, type: "partial_logic",     logicTag: "subtracts 65 from wrong base" },
    ],
    solutionSteps: ["Reflex angle = 360° − interior angle", "Reflex = 360° − 65° = 295°"],
    shortcut: "Reflex = 360° − angle. Always between 180° and 360°.",
  },
  {
    questionId: "math6_ch2_q5",
    questionText: "A line segment differs from a ray in that:",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Lines and Angles", topic: "math6_ch2", topicId: "math6_ch2",
    difficulty: "hard", type: "mcq",
    options: [
      { text: "A line segment has two endpoints; a ray has one",     isCorrect: true,  type: "correct",           logicTag: "segment bounded both ends; ray bounded one end" },
      { text: "A line segment is curved; a ray is straight",         isCorrect: false, type: "concept_error",     logicTag: "both are straight" },
      { text: "A ray has two endpoints; a line segment has one",     isCorrect: false, type: "misinterpretation", logicTag: "reverses the definition" },
      { text: "A line segment extends infinitely; a ray does not",   isCorrect: false, type: "concept_error",     logicTag: "reverses the property; ray extends infinitely" },
    ],
    solutionSteps: ["Line segment: bounded at BOTH ends by two endpoints, has a finite length.", "Ray: bounded at ONE endpoint; extends infinitely in the other direction.", "Line: no endpoints, extends infinitely in both directions."],
    shortcut: "Segment = 2 endpoints (finite). Ray = 1 endpoint (infinite one way). Line = 0 endpoints (infinite both ways).",
  },

  // ── Ch 3: Number Play ───────────────────────────────────────────────────
  {
    questionId: "math6_ch3_q1",
    questionText: "What is Kaprekar's constant for 4-digit numbers?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Number Play", topic: "math6_ch3", topicId: "math6_ch3",
    difficulty: "easy", type: "mcq",
    options: [
      { text: "6174", isCorrect: true,  type: "correct",           logicTag: "Kaprekar's constant for 4-digit numbers" },
      { text: "495",  isCorrect: false, type: "concept_error",     logicTag: "495 is Kaprekar's constant for 3-digit numbers" },
      { text: "1000", isCorrect: false, type: "guessing",          logicTag: "random guess" },
      { text: "9999", isCorrect: false, type: "guessing",          logicTag: "random guess" },
    ],
    solutionSteps: ["Kaprekar process: arrange digits descending − ascending, repeat.", "For any 4-digit number (not all same), always converges to 6174."],
    shortcut: "Kaprekar's constant: 4 digits → 6174; 3 digits → 495.",
  },
  {
    questionId: "math6_ch3_q2",
    questionText: "Which of the following is a palindrome number?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Number Play", topic: "math6_ch3", topicId: "math6_ch3",
    difficulty: "easy", type: "mcq",
    options: [
      { text: "12321", isCorrect: true,  type: "correct",           logicTag: "reads 12321 forwards and backwards" },
      { text: "12345", isCorrect: false, type: "concept_error",     logicTag: "reversed is 54321 ≠ 12345" },
      { text: "12231", isCorrect: false, type: "calculation_error", logicTag: "reversed is 13221 ≠ 12231" },
      { text: "11213", isCorrect: false, type: "partial_logic",     logicTag: "reversed is 31211 ≠ 11213" },
    ],
    solutionSteps: ["Palindrome: reads same forwards and backwards.", "12321 reversed: 12321 ✓"],
    shortcut: "Write the number backwards — if identical to original, it's a palindrome.",
  },
  {
    questionId: "math6_ch3_q3",
    questionText: "In a 3×3 magic square using numbers 1–9, what is the magic sum?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Number Play", topic: "math6_ch3", topicId: "math6_ch3",
    difficulty: "medium", type: "mcq",
    options: [
      { text: "15", isCorrect: true,  type: "correct",           logicTag: "3(3²+1)/2 = 3×10/2 = 15" },
      { text: "45", isCorrect: false, type: "concept_error",     logicTag: "45 is the sum of all 9 numbers, not one row" },
      { text: "12", isCorrect: false, type: "calculation_error", logicTag: "arithmetic error" },
      { text: "18", isCorrect: false, type: "partial_logic",     logicTag: "divides 45 by 3 incorrectly" },
    ],
    solutionSteps: ["Sum of 1 to 9 = 45", "3 rows of equal sum → magic sum = 45/3 = 15"],
    shortcut: "Magic sum for n×n using 1 to n²: sum = n(n²+1)/2. For 3×3: 3×10/2 = 15.",
  },
  {
    questionId: "math6_ch3_q4",
    questionText: "Apply Kaprekar's process to 5432. What is the result after one step?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Number Play", topic: "math6_ch3", topicId: "math6_ch3",
    difficulty: "medium", type: "mcq",
    options: [
      { text: "3087", isCorrect: true,  type: "correct",           logicTag: "5432 − 2345 = 3087" },
      { text: "3177", isCorrect: false, type: "calculation_error", logicTag: "arithmetic error" },
      { text: "6174", isCorrect: false, type: "partial_logic",     logicTag: "Kaprekar's constant, not first step result" },
      { text: "2997", isCorrect: false, type: "concept_error",     logicTag: "wrong digit arrangement" },
    ],
    solutionSteps: ["Arrange digits descending: 5432", "Arrange digits ascending: 2345", "5432 − 2345 = 3087"],
    shortcut: "Step 1: sort descending (5432) − sort ascending (2345) = 3087.",
  },
  {
    questionId: "math6_ch3_q5",
    questionText: "A number is a 'supercell' in a grid if it is greater than all its neighbours. Which property must a supercell have relative to all 8 surrounding numbers?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Number Play", topic: "math6_ch3", topicId: "math6_ch3",
    difficulty: "hard", type: "mcq",
    options: [
      { text: "It must be strictly greater than every adjacent cell",      isCorrect: true,  type: "correct",           logicTag: "supercell > all 8 neighbours (or fewer at edges)" },
      { text: "It must be the maximum in the entire grid",                isCorrect: false, type: "concept_error",     logicTag: "only needs to beat local neighbours, not global max" },
      { text: "It must be greater than the cells directly above and below only", isCorrect: false, type: "misinterpretation", logicTag: "neighbours include diagonals too" },
      { text: "It must be an even number",                                isCorrect: false, type: "guessing",          logicTag: "parity is irrelevant" },
    ],
    solutionSteps: ["Supercell: a number greater than ALL its adjacent neighbours.", "Neighbours include up, down, left, right, and diagonal cells.", "A supercell does not need to be the largest in the whole grid — just locally largest."],
    shortcut: "Supercell = local maximum. Compare to all touching cells (up to 8 for interior cells).",
  },

  // ── Ch 4: Data Handling and Presentation ────────────────────────────────
  {
    questionId: "math6_ch4_q1",
    questionText: "In a pictograph, one symbol represents 5 students. If the cricket bar shows 4 symbols, how many students chose cricket?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Data Handling and Presentation", topic: "math6_ch4", topicId: "math6_ch4",
    difficulty: "easy", type: "mcq",
    options: [
      { text: "20", isCorrect: true,  type: "correct",           logicTag: "4 symbols × 5 = 20" },
      { text: "4",  isCorrect: false, type: "concept_error",     logicTag: "counts symbols without applying key" },
      { text: "9",  isCorrect: false, type: "calculation_error", logicTag: "adds 4+5 instead of multiplying" },
      { text: "25", isCorrect: false, type: "partial_logic",     logicTag: "adds one extra symbol by mistake" },
    ],
    solutionSteps: ["Key: 1 symbol = 5 students", "4 symbols × 5 = 20 students"],
    shortcut: "Pictograph count = number of symbols × key value. Always multiply by the key.",
  },
  {
    questionId: "math6_ch4_q2",
    questionText: "A bar graph shows monthly savings. January bar reaches 350 on a scale of 0–500 with intervals of 50. What is the saving?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Data Handling and Presentation", topic: "math6_ch4", topicId: "math6_ch4",
    difficulty: "easy", type: "mcq",
    options: [
      { text: "₹350", isCorrect: true,  type: "correct",           logicTag: "bar reaches 350 on the scale" },
      { text: "₹300", isCorrect: false, type: "calculation_error", logicTag: "reads one interval below" },
      { text: "₹400", isCorrect: false, type: "calculation_error", logicTag: "reads one interval above" },
      { text: "₹7",   isCorrect: false, type: "concept_error",     logicTag: "counts tick marks instead of reading value" },
    ],
    solutionSteps: ["Scale: 0 to 500, interval 50.", "Bar height = 350 → saving = ₹350."],
    shortcut: "Read the axis value at the TOP of the bar, not the number of bars or intervals.",
  },
  {
    questionId: "math6_ch4_q3",
    questionText: "Data: 3,5,3,7,5,3,8,3. What is the frequency of the number 3?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Data Handling and Presentation", topic: "math6_ch4", topicId: "math6_ch4",
    difficulty: "medium", type: "mcq",
    options: [
      { text: "4", isCorrect: true,  type: "correct",           logicTag: "3 appears at positions 1,3,6,8 → 4 times" },
      { text: "3", isCorrect: false, type: "calculation_error", logicTag: "misses one occurrence" },
      { text: "2", isCorrect: false, type: "partial_logic",     logicTag: "counts only first two" },
      { text: "5", isCorrect: false, type: "concept_error",     logicTag: "counts something else" },
    ],
    solutionSteps: ["Data: 3,5,3,7,5,3,8,3", "Count 3s: positions 1,3,6,8 → frequency = 4"],
    shortcut: "Use tally marks: put a mark for each 3 you encounter, group in fives.",
  },
  {
    questionId: "math6_ch4_q4",
    questionText: "Which type of graph is best for showing how a quantity changes over time?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Data Handling and Presentation", topic: "math6_ch4", topicId: "math6_ch4",
    difficulty: "medium", type: "mcq",
    options: [
      { text: "Line graph",      isCorrect: true,  type: "correct",           logicTag: "line graphs show trends over time" },
      { text: "Pictograph",      isCorrect: false, type: "concept_error",     logicTag: "pictographs compare categories at one time" },
      { text: "Bar graph",       isCorrect: false, type: "partial_logic",     logicTag: "bar graphs compare categories, not ideal for trends" },
      { text: "Tally chart",     isCorrect: false, type: "concept_error",     logicTag: "tally charts organise data, not display trends" },
    ],
    solutionSteps: ["Line graph: points plotted over time, connected by lines — shows trend.", "Best for continuous data (temperature over days, height over years)."],
    shortcut: "Time on x-axis + continuous data = line graph. Comparing categories = bar graph.",
  },
  {
    questionId: "math6_ch4_q5",
    questionText: "30 students were surveyed about their favourite subject. If the bar for Maths shows 12 students, what fraction of the class prefers Maths?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Data Handling and Presentation", topic: "math6_ch4", topicId: "math6_ch4",
    difficulty: "hard", type: "mcq",
    options: [
      { text: "2/5", isCorrect: true,  type: "correct",           logicTag: "12/30 = 2/5" },
      { text: "1/3", isCorrect: false, type: "calculation_error", logicTag: "12/36 not 12/30" },
      { text: "2/3", isCorrect: false, type: "concept_error",     logicTag: "fraction of those NOT choosing Maths" },
      { text: "12",  isCorrect: false, type: "partial_logic",     logicTag: "gives count not fraction" },
    ],
    solutionSteps: ["Fraction = Maths students / Total = 12/30", "HCF(12,30)=6 → 12/30 = 2/5"],
    shortcut: "Fraction from bar graph = (bar height) ÷ (total). Simplify using HCF.",
  },

  // ── Ch 5: Prime Time ───────────────────────────────────────────────────
  {
    questionId: "math6_ch5_q1",
    questionText: "Which of the following is a prime number?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Prime Time", topic: "math6_ch5", topicId: "math6_ch5",
    difficulty: "easy", type: "mcq",
    options: [
      { text: "29", isCorrect: true,  type: "correct",           logicTag: "29 has no factors other than 1 and 29" },
      { text: "27", isCorrect: false, type: "concept_error",     logicTag: "27 = 3³, composite" },
      { text: "21", isCorrect: false, type: "concept_error",     logicTag: "21 = 3×7, composite" },
      { text: "1",  isCorrect: false, type: "misinterpretation", logicTag: "1 is neither prime nor composite" },
    ],
    solutionSteps: ["29: check primes up to √29≈5.4 → test 2,3,5", "29÷2 no, 29÷3 no, 29÷5 no → prime"],
    shortcut: "Check divisibility only up to √n. For 29, test 2, 3, 5 only.",
  },
  {
    questionId: "math6_ch5_q2",
    questionText: "Find the LCM of 12 and 18.",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Prime Time", topic: "math6_ch5", topicId: "math6_ch5",
    difficulty: "easy", type: "mcq",
    options: [
      { text: "36", isCorrect: true,  type: "correct",           logicTag: "LCM(12,18): 12=2²×3, 18=2×3² → 2²×3²=36" },
      { text: "6",  isCorrect: false, type: "concept_error",     logicTag: "6 is the HCF, not LCM" },
      { text: "72", isCorrect: false, type: "calculation_error", logicTag: "product 12×18/HCF = 216/6 = 36, not 72" },
      { text: "24", isCorrect: false, type: "partial_logic",     logicTag: "2×12=24, not LCM" },
    ],
    solutionSteps: ["12 = 2² × 3", "18 = 2 × 3²", "LCM = highest powers of all primes: 2² × 3² = 4×9 = 36"],
    shortcut: "LCM(12,18) = 12×18/HCF(12,18) = 216/6 = 36.",
  },
  {
    questionId: "math6_ch5_q3",
    questionText: "HCF of two numbers is 6 and their product is 216. Find their LCM.",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Prime Time", topic: "math6_ch5", topicId: "math6_ch5",
    difficulty: "medium", type: "mcq",
    options: [
      { text: "36", isCorrect: true,  type: "correct",           logicTag: "LCM = product/HCF = 216/6 = 36" },
      { text: "6",  isCorrect: false, type: "concept_error",     logicTag: "gives HCF again" },
      { text: "216",isCorrect: false, type: "partial_logic",     logicTag: "gives the product" },
      { text: "12", isCorrect: false, type: "calculation_error", logicTag: "arithmetic error" },
    ],
    solutionSteps: ["HCF × LCM = product of two numbers", "6 × LCM = 216", "LCM = 216 ÷ 6 = 36"],
    shortcut: "LCM = (product of numbers) ÷ HCF.",
  },
  {
    questionId: "math6_ch5_q4",
    questionText: "What is the prime factorisation of 360?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Prime Time", topic: "math6_ch5", topicId: "math6_ch5",
    difficulty: "medium", type: "mcq",
    options: [
      { text: "2³ × 3² × 5", isCorrect: true,  type: "correct",           logicTag: "360 = 8×45 = 8×9×5 = 2³×3²×5" },
      { text: "2² × 3 × 5²", isCorrect: false, type: "calculation_error", logicTag: "wrong powers" },
      { text: "2 × 3 × 5 × 12", isCorrect: false, type: "concept_error", logicTag: "12 is not prime" },
      { text: "2⁴ × 3 × 5",  isCorrect: false, type: "partial_logic",    logicTag: "wrong power of 2" },
    ],
    solutionSteps: ["360 ÷ 2 = 180", "180 ÷ 2 = 90", "90 ÷ 2 = 45", "45 ÷ 3 = 15", "15 ÷ 3 = 5", "5 is prime", "360 = 2³ × 3² × 5"],
    shortcut: "Divide repeatedly by 2 first, then 3, then 5, until prime.",
  },
  {
    questionId: "math6_ch5_q5",
    questionText: "Three traffic lights change every 30, 45, and 60 seconds. They all change together at 8:00 AM. When do they next change together?",
    subject: "Mathematics", grade: "6", board: "CBSE",
    chapter: "Prime Time", topic: "math6_ch5", topicId: "math6_ch5",
    difficulty: "hard", type: "mcq",
    options: [
      { text: "8:03 AM", isCorrect: true,  type: "correct",           logicTag: "LCM(30,45,60)=180s=3min → 8:03 AM" },
      { text: "8:01 AM", isCorrect: false, type: "calculation_error", logicTag: "uses 60 seconds instead of LCM" },
      { text: "8:45 AM", isCorrect: false, type: "concept_error",     logicTag: "confuses LCM with the largest interval" },
      { text: "8:02 AM", isCorrect: false, type: "partial_logic",     logicTag: "arithmetic error on LCM" },
    ],
    solutionSteps: ["LCM(30,45,60):", "30=2×3×5, 45=3²×5, 60=2²×3×5", "LCM=2²×3²×5=180 seconds=3 minutes", "8:00 AM + 3 min = 8:03 AM"],
    shortcut: "Simultaneous events → LCM of their intervals. 180 seconds = 3 minutes.",
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

  console.log(`\nSeeded ${questions.length} questions for Class 6 Math (Ch 1–5).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
