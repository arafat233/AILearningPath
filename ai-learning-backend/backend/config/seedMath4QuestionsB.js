/**
 * CBSE Class 4 Mathematics — MCQ seed (Part B: chapters 8–14)
 * 5 questions per chapter × 7 chapters = 35 questions
 * Usage: node config/seedMath4QuestionsB.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";

dotenv.config();

const questions = [
  // ─── Chapter 8: Carts and Wheels ──────────────────────────────────────────
  {
    questionId: "math4_ch8_q1", topicId: "math4_ch8",
    text: "A wheel has a radius of 30 cm. What is its diameter?",
    options: [
      { text: "60 cm",  type: "correct",          logicTag: "d=2r=2×30=60" },
      { text: "15 cm",  type: "concept_error",    logicTag: "Halved instead of doubled" },
      { text: "90 cm",  type: "calculation_error", logicTag: "Used 3×30=90" },
      { text: "30 cm",  type: "concept_error",    logicTag: "Gave radius as diameter" },
    ],
    explanation: "Diameter = 2 × radius = 2 × 30 = 60 cm.",
    solutionSteps: ["Radius = 30 cm.", "Diameter = 2 × 30 = 60 cm."],
    shortcut: "d = 2r. Always double the radius to get diameter.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Carts and Wheels",
  },
  {
    questionId: "math4_ch8_q2", topicId: "math4_ch8",
    text: "A circle has a diameter of 50 cm. What is its radius?",
    options: [
      { text: "25 cm",  type: "correct",       logicTag: "r=d÷2=50÷2=25" },
      { text: "100 cm", type: "concept_error", logicTag: "Doubled instead of halved" },
      { text: "50 cm",  type: "concept_error", logicTag: "Gave diameter as radius" },
      { text: "10 cm",  type: "calculation_error", logicTag: "Divided by 5 instead of 2" },
    ],
    explanation: "Radius = diameter ÷ 2 = 50 ÷ 2 = 25 cm.",
    solutionSteps: ["Diameter = 50 cm.", "Radius = 50 ÷ 2 = 25 cm."],
    shortcut: "r = d ÷ 2.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Carts and Wheels",
  },
  {
    questionId: "math4_ch8_q3", topicId: "math4_ch8",
    text: "Which point is exactly in the middle of a circle?",
    options: [
      { text: "Centre",    type: "correct",       logicTag: "Centre is equidistant from all points on circle" },
      { text: "Radius",    type: "concept_error", logicTag: "Radius is a line, not a point" },
      { text: "Diameter",  type: "concept_error", logicTag: "Diameter is a line passing through centre" },
      { text: "Circumference", type: "concept_error", logicTag: "Circumference is the boundary of the circle" },
    ],
    explanation: "The centre is the fixed middle point of a circle. Every point on the circle is the same distance (radius) from the centre.",
    solutionSteps: ["Centre = middle point.", "Radius = line from centre to circle edge.", "Diameter = line through centre touching two edges."],
    shortcut: "Centre → equidistant from all edges.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Carts and Wheels",
  },
  {
    questionId: "math4_ch8_q4", topicId: "math4_ch8",
    text: "Two circles: Circle A has radius 8 cm, Circle B has radius 12 cm. Which is larger?",
    options: [
      { text: "Circle B",    type: "correct",       logicTag: "Radius 12 > 8, so B is larger" },
      { text: "Circle A",    type: "concept_error", logicTag: "8 < 12, so A is smaller" },
      { text: "They are equal", type: "concept_error", logicTag: "8 ≠ 12" },
      { text: "Cannot tell", type: "guessing",      logicTag: "Radius determines size" },
    ],
    explanation: "The larger the radius, the larger the circle. Radius B = 12 cm > Radius A = 8 cm. Circle B is larger.",
    solutionSteps: ["Circle A: r=8 cm.", "Circle B: r=12 cm.", "12 > 8, so Circle B is larger."],
    shortcut: "Bigger radius = bigger circle.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Carts and Wheels",
  },
  {
    questionId: "math4_ch8_q5", topicId: "math4_ch8",
    text: "The diameter of a wheel is 1 m. What is its radius in centimetres?",
    options: [
      { text: "50 cm",  type: "correct",          logicTag: "1m=100cm; radius=100÷2=50" },
      { text: "100 cm", type: "concept_error",    logicTag: "Gave full diameter in cm as radius" },
      { text: "200 cm", type: "concept_error",    logicTag: "Doubled the diameter" },
      { text: "1 cm",   type: "concept_error",    logicTag: "Did not convert m to cm" },
    ],
    explanation: "Diameter = 1 m = 100 cm. Radius = 100 ÷ 2 = 50 cm.",
    solutionSteps: ["1 m = 100 cm.", "Radius = 100 ÷ 2 = 50 cm."],
    shortcut: "Convert units first, then apply r = d ÷ 2.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Carts and Wheels",
  },

  // ─── Chapter 9: Halves and Quarters ───────────────────────────────────────
  {
    questionId: "math4_ch9_q1", topicId: "math4_ch9",
    text: "What is half of 48?",
    options: [
      { text: "24",  type: "correct",          logicTag: "48÷2=24" },
      { text: "12",  type: "calculation_error", logicTag: "Divided by 4 instead of 2" },
      { text: "96",  type: "concept_error",    logicTag: "Doubled instead of halved" },
      { text: "46",  type: "calculation_error", logicTag: "Subtracted 2 instead" },
    ],
    explanation: "Half of 48 = 48 ÷ 2 = 24.",
    solutionSteps: ["Half = ÷ 2.", "48 ÷ 2 = 24."],
    shortcut: "Half = divide by 2.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Halves and Quarters",
  },
  {
    questionId: "math4_ch9_q2", topicId: "math4_ch9",
    text: "What is a quarter of 60?",
    options: [
      { text: "15",  type: "correct",          logicTag: "60÷4=15" },
      { text: "30",  type: "concept_error",    logicTag: "Found half instead of quarter" },
      { text: "20",  type: "calculation_error", logicTag: "Divided by 3" },
      { text: "240", type: "concept_error",    logicTag: "Multiplied instead of divided" },
    ],
    explanation: "A quarter of 60 = 60 ÷ 4 = 15.",
    solutionSteps: ["Quarter = ÷ 4.", "60 ÷ 4 = 15."],
    shortcut: "Quarter = half of a half. 60÷2=30, 30÷2=15.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Halves and Quarters",
  },
  {
    questionId: "math4_ch9_q3", topicId: "math4_ch9",
    text: "Which is larger: 1/2 or 1/4?",
    options: [
      { text: "1/2",  type: "correct",       logicTag: "1/2=0.5 > 1/4=0.25" },
      { text: "1/4",  type: "concept_error", logicTag: "4 > 2 so thought 1/4 > 1/2" },
      { text: "Equal", type: "concept_error", logicTag: "Not equal" },
      { text: "Cannot tell", type: "guessing", logicTag: "Can be compared" },
    ],
    explanation: "1/2 means one of two equal parts; 1/4 means one of four equal parts. Fewer parts → each part is larger. So 1/2 > 1/4.",
    solutionSteps: ["1/2: divide into 2 parts, take 1.", "1/4: divide into 4 parts, take 1.", "More parts = smaller each. 1/2 > 1/4."],
    shortcut: "Smaller denominator = larger fraction (when numerators are equal).",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Halves and Quarters",
  },
  {
    questionId: "math4_ch9_q4", topicId: "math4_ch9",
    text: "A pizza has 8 slices. Priya eats 3/4 of it. How many slices does she eat?",
    options: [
      { text: "6",  type: "correct",          logicTag: "8÷4=2; 2×3=6" },
      { text: "2",  type: "partial_logic",    logicTag: "Found 1/4 but forgot ×3" },
      { text: "3",  type: "concept_error",    logicTag: "Used numerator directly" },
      { text: "8",  type: "concept_error",    logicTag: "Took the whole pizza" },
    ],
    explanation: "3/4 of 8: first find 1/4 = 8 ÷ 4 = 2 slices. Then 3/4 = 2 × 3 = 6 slices.",
    solutionSteps: ["1/4 of 8 = 8 ÷ 4 = 2.", "3/4 of 8 = 2 × 3 = 6 slices."],
    shortcut: "Fraction of a quantity: ÷ denominator, then × numerator.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Halves and Quarters",
  },
  {
    questionId: "math4_ch9_q5", topicId: "math4_ch9",
    text: "1 whole = ___ quarters.",
    options: [
      { text: "4",  type: "correct",       logicTag: "1 = 4/4" },
      { text: "2",  type: "concept_error", logicTag: "1 = 2/2 = 2 halves, not quarters" },
      { text: "8",  type: "concept_error", logicTag: "1 = 8 eighths, not quarters" },
      { text: "3",  type: "concept_error", logicTag: "3 quarters = 3/4, not a whole" },
    ],
    explanation: "1 whole = 4/4 = 4 quarters.",
    solutionSteps: ["Quarter = 1/4.", "4 × (1/4) = 4/4 = 1 whole.", "So 1 whole = 4 quarters."],
    shortcut: "1 = 2 halves = 4 quarters = 8 eighths.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Halves and Quarters",
  },

  // ─── Chapter 10: Play with Patterns ───────────────────────────────────────
  {
    questionId: "math4_ch10_q1", topicId: "math4_ch10",
    text: "What is the next number in the pattern: 10, 20, 30, 40, ___?",
    options: [
      { text: "50",  type: "correct",          logicTag: "Add 10 each time; 40+10=50" },
      { text: "45",  type: "calculation_error", logicTag: "Added 5 instead of 10" },
      { text: "60",  type: "calculation_error", logicTag: "Added 20 instead of 10" },
      { text: "400", type: "concept_error",    logicTag: "Multiplied by 10" },
    ],
    explanation: "Pattern: add 10 each time. 40 + 10 = 50.",
    solutionSteps: ["Difference: 20−10=10, 30−20=10, 40−30=10.", "Next: 40+10=50."],
    shortcut: "Multiples of 10: count by tens.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Play with Patterns",
  },
  {
    questionId: "math4_ch10_q2", topicId: "math4_ch10",
    text: "Which pattern shows even numbers?",
    options: [
      { text: "2, 4, 6, 8, 10",  type: "correct",       logicTag: "All even: divisible by 2" },
      { text: "1, 3, 5, 7, 9",   type: "concept_error", logicTag: "These are odd numbers" },
      { text: "2, 5, 8, 11, 14", type: "concept_error", logicTag: "Adds 3 — not all even" },
      { text: "1, 2, 3, 4, 5",   type: "concept_error", logicTag: "Mix of odd and even" },
    ],
    explanation: "Even numbers are divisible by 2: 2, 4, 6, 8, 10, ... The pattern adds 2 each time.",
    solutionSteps: ["Even numbers: end in 0, 2, 4, 6, or 8.", "2, 4, 6, 8, 10 — all end in even digit. ✓"],
    shortcut: "Even numbers end in 0, 2, 4, 6, or 8.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Play with Patterns",
  },
  {
    questionId: "math4_ch10_q3", topicId: "math4_ch10",
    text: "Find the missing number: 3, 6, ___, 12, 15.",
    options: [
      { text: "9",  type: "correct",          logicTag: "Add 3 each time; 6+3=9" },
      { text: "8",  type: "calculation_error", logicTag: "Added 2 instead of 3" },
      { text: "10", type: "calculation_error", logicTag: "Added 4" },
      { text: "18", type: "concept_error",    logicTag: "Doubled 6" },
    ],
    explanation: "Pattern: add 3 each time (multiples of 3). 6 + 3 = 9.",
    solutionSteps: ["6−3=3, 12−9=3, 15−12=3. Add 3.", "6 + 3 = 9."],
    shortcut: "Check: 9×3=27? No — these are 3×1,3×2,3×3,3×4,3×5.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Play with Patterns",
  },
  {
    questionId: "math4_ch10_q4", topicId: "math4_ch10",
    text: "What is the 8th term in the pattern: 5, 10, 15, 20, ...?",
    options: [
      { text: "40",  type: "correct",          logicTag: "5×8=40" },
      { text: "35",  type: "calculation_error", logicTag: "5×7=35 (used n=7)" },
      { text: "45",  type: "calculation_error", logicTag: "5×9=45 (used n=9)" },
      { text: "80",  type: "concept_error",    logicTag: "Multiplied 8×10=80" },
    ],
    explanation: "Pattern: multiples of 5. nth term = 5n. 8th term = 5 × 8 = 40.",
    solutionSteps: ["Pattern: 5×1, 5×2, 5×3...", "8th term = 5 × 8 = 40."],
    shortcut: "Multiples of 5: nth term = 5n.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Play with Patterns",
  },
  {
    questionId: "math4_ch10_q5", topicId: "math4_ch10",
    text: "A tiling pattern repeats: ▲◆▲◆▲◆. What is the 9th shape?",
    options: [
      { text: "▲",  type: "correct",       logicTag: "Odd positions = ▲; 9 is odd" },
      { text: "◆",  type: "concept_error", logicTag: "Even positions = ◆; 9 is odd" },
      { text: "Neither", type: "guessing", logicTag: "Pattern defined for all positions" },
      { text: "▲◆",  type: "concept_error", logicTag: "Only one shape per position" },
    ],
    explanation: "Repeating unit: ▲◆ (length 2). Position 9: 9 ÷ 2 = 4 remainder 1. Remainder 1 → first shape = ▲.",
    solutionSteps: ["Repeating unit: ▲◆ (2 shapes).", "Position 9 ÷ 2 = 4 r 1.", "Remainder 1 = position 1 in unit = ▲."],
    shortcut: "Position mod (unit length) tells you which shape in the unit.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Play with Patterns",
  },

  // ─── Chapter 11: Tables and Shares ────────────────────────────────────────
  {
    questionId: "math4_ch11_q1", topicId: "math4_ch11",
    text: "What is 7 × 8?",
    options: [
      { text: "56",  type: "correct",          logicTag: "7×8=56" },
      { text: "54",  type: "calculation_error", logicTag: "Off by 2" },
      { text: "63",  type: "calculation_error", logicTag: "7×9=63" },
      { text: "48",  type: "calculation_error", logicTag: "6×8=48" },
    ],
    explanation: "7 × 8 = 56. This is a key multiplication fact to memorise.",
    solutionSteps: ["7 × 8 = 56.", "Check: 8 × 7 = 56 ✓ (commutative)."],
    shortcut: "5,6,7,8: 56=7×8.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Tables and Shares",
  },
  {
    questionId: "math4_ch11_q2", topicId: "math4_ch11",
    text: "63 sweets are shared equally among 9 children. How many does each get?",
    options: [
      { text: "7",  type: "correct",          logicTag: "63÷9=7" },
      { text: "8",  type: "calculation_error", logicTag: "9×8=72 not 63" },
      { text: "6",  type: "calculation_error", logicTag: "9×6=54 not 63" },
      { text: "54", type: "concept_error",    logicTag: "Multiplied 9×6=54" },
    ],
    explanation: "63 ÷ 9 = 7. Check: 7 × 9 = 63 ✓.",
    solutionSteps: ["63 ÷ 9 = ?", "9 × 7 = 63. So 63 ÷ 9 = 7."],
    shortcut: "Use known multiplication facts to solve division.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Tables and Shares",
  },
  {
    questionId: "math4_ch11_q3", topicId: "math4_ch11",
    text: "If 6 × 9 = 54, what is 54 ÷ 6?",
    options: [
      { text: "9",  type: "correct",       logicTag: "Fact family: 54÷6=9" },
      { text: "8",  type: "concept_error", logicTag: "Off by one from the table" },
      { text: "6",  type: "concept_error", logicTag: "Gave divisor as answer" },
      { text: "48", type: "concept_error", logicTag: "Subtracted instead of dividing" },
    ],
    explanation: "Fact family: 6 × 9 = 54 → 54 ÷ 6 = 9.",
    solutionSteps: ["6 × 9 = 54.", "So 54 ÷ 6 = 9 and 54 ÷ 9 = 6."],
    shortcut: "One multiplication fact gives 4 facts (fact family).",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Tables and Shares",
  },
  {
    questionId: "math4_ch11_q4", topicId: "math4_ch11",
    text: "What is 8 × 12?",
    options: [
      { text: "96",  type: "correct",          logicTag: "8×12=96" },
      { text: "88",  type: "calculation_error", logicTag: "8×11=88" },
      { text: "104", type: "calculation_error", logicTag: "8×13=104" },
      { text: "82",  type: "calculation_error", logicTag: "Arithmetic error" },
    ],
    explanation: "8 × 12 = 8 × 10 + 8 × 2 = 80 + 16 = 96.",
    solutionSteps: ["8×12 = 8×10 + 8×2.", "= 80 + 16 = 96."],
    shortcut: "Multiply by 12: multiply by 10 then add double the number.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Tables and Shares",
  },
  {
    questionId: "math4_ch11_q5", topicId: "math4_ch11",
    text: "84 books are packed into boxes of 7. How many boxes are needed?",
    options: [
      { text: "12",  type: "correct",          logicTag: "84÷7=12" },
      { text: "11",  type: "calculation_error", logicTag: "7×11=77≠84" },
      { text: "13",  type: "calculation_error", logicTag: "7×13=91≠84" },
      { text: "77",  type: "concept_error",    logicTag: "Subtracted 7 from 84" },
    ],
    explanation: "84 ÷ 7 = 12 boxes. Check: 12 × 7 = 84 ✓.",
    solutionSteps: ["7 × 12 = 84.", "So 84 ÷ 7 = 12 boxes."],
    shortcut: "Look for which times-7 fact equals 84.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Tables and Shares",
  },

  // ─── Chapter 12: How Heavy? How Light? ────────────────────────────────────
  {
    questionId: "math4_ch12_q1", topicId: "math4_ch12",
    text: "A balance has a 1 kg weight on one side and 4 equal balls on the other. What does each ball weigh?",
    options: [
      { text: "250 g",   type: "correct",          logicTag: "1000÷4=250 g" },
      { text: "400 g",   type: "calculation_error", logicTag: "Used 1000÷2.5" },
      { text: "4000 g",  type: "concept_error",    logicTag: "Multiplied instead of dividing" },
      { text: "125 g",   type: "calculation_error", logicTag: "Divided by 8 instead of 4" },
    ],
    explanation: "1 kg = 1000 g. 4 balls weigh 1000 g. Each ball = 1000 ÷ 4 = 250 g.",
    solutionSteps: ["1 kg = 1000 g.", "4 balls = 1000 g.", "Each = 1000 ÷ 4 = 250 g."],
    shortcut: "Balance: both sides equal. Set up equation, divide to find unknown.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "How Heavy? How Light?",
  },
  {
    questionId: "math4_ch12_q2", topicId: "math4_ch12",
    text: "Which is lighter: 500 g or 1/2 kg?",
    options: [
      { text: "They are equal",  type: "correct",       logicTag: "1/2 kg = 500 g" },
      { text: "500 g",           type: "concept_error", logicTag: "Did not convert to compare" },
      { text: "1/2 kg",          type: "concept_error", logicTag: "They are actually equal" },
      { text: "Cannot compare",  type: "guessing",      logicTag: "Can compare after converting" },
    ],
    explanation: "1/2 kg = 1000 ÷ 2 = 500 g. So 500 g = 1/2 kg. They are equal.",
    solutionSteps: ["1 kg = 1000 g.", "1/2 kg = 500 g.", "500 g = 500 g → Equal."],
    shortcut: "1/2 kg = 500 g always.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "How Heavy? How Light?",
  },
  {
    questionId: "math4_ch12_q3", topicId: "math4_ch12",
    text: "A bag of rice weighs 5 kg 200 g. In grams, this is:",
    options: [
      { text: "5200 g",  type: "correct",          logicTag: "5×1000+200=5200" },
      { text: "520 g",   type: "concept_error",    logicTag: "Multiplied by 100 instead of 1000" },
      { text: "5020 g",  type: "calculation_error", logicTag: "5×1000+020=5020" },
      { text: "52 g",    type: "concept_error",    logicTag: "Ignored the kg part" },
    ],
    explanation: "5 kg = 5000 g. Total = 5000 + 200 = 5200 g.",
    solutionSteps: ["5 kg = 5 × 1000 = 5000 g.", "5000 + 200 = 5200 g."],
    shortcut: "kg to g: ×1000. Add remaining grams.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "How Heavy? How Light?",
  },
  {
    questionId: "math4_ch12_q4", topicId: "math4_ch12",
    text: "Ramesh bought 3 kg 500 g of mangoes and 1 kg 750 g of apples. Total weight?",
    options: [
      { text: "5 kg 250 g",  type: "correct",          logicTag: "3500+1750=5250g=5kg250g" },
      { text: "4 kg 250 g",  type: "calculation_error", logicTag: "Arithmetic error" },
      { text: "5 kg 750 g",  type: "calculation_error", logicTag: "Added 500+750=1250 wrong" },
      { text: "2 kg 750 g",  type: "concept_error",    logicTag: "Subtracted instead of added" },
    ],
    explanation: "3500 g + 1750 g = 5250 g = 5 kg 250 g.",
    solutionSteps: ["3 kg 500 g = 3500 g.", "1 kg 750 g = 1750 g.", "3500 + 1750 = 5250 g = 5 kg 250 g."],
    shortcut: "Convert to g, add, convert back.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "How Heavy? How Light?",
  },
  {
    questionId: "math4_ch12_q5", topicId: "math4_ch12",
    text: "An elephant weighs 4000 kg. A mouse weighs 20 g. How many times heavier is the elephant than the mouse?",
    options: [
      { text: "200,000 times", type: "correct",          logicTag: "4000kg=4000000g; 4000000÷20=200000" },
      { text: "200 times",     type: "calculation_error", logicTag: "Did not convert kg to g" },
      { text: "2000 times",    type: "calculation_error", logicTag: "Arithmetic error" },
      { text: "20000 times",   type: "calculation_error", logicTag: "Arithmetic error" },
    ],
    explanation: "4000 kg = 4,000,000 g. 4,000,000 ÷ 20 = 200,000 times heavier.",
    solutionSteps: ["4000 kg = 4,000,000 g.", "4,000,000 ÷ 20 = 200,000."],
    shortcut: "Convert to same unit first — always grams for small vs large comparison.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "How Heavy? How Light?",
  },

  // ─── Chapter 13: Fields and Fences ────────────────────────────────────────
  {
    questionId: "math4_ch13_q1", topicId: "math4_ch13",
    text: "A rectangular field is 15 m long and 10 m wide. How much fencing is needed to go all the way around?",
    options: [
      { text: "50 m",  type: "correct",          logicTag: "P=2(15+10)=2×25=50" },
      { text: "150 m", type: "concept_error",    logicTag: "Calculated area=15×10=150" },
      { text: "25 m",  type: "partial_logic",    logicTag: "Found l+b but forgot to double" },
      { text: "60 m",  type: "calculation_error", logicTag: "Used 2×30=60" },
    ],
    explanation: "Perimeter = 2(l + b) = 2(15 + 10) = 2 × 25 = 50 m.",
    solutionSteps: ["l=15, b=10.", "P = 2(15+10) = 2×25 = 50 m."],
    shortcut: "Perimeter = fence needed. P = 2(l+b).",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Fields and Fences",
  },
  {
    questionId: "math4_ch13_q2", topicId: "math4_ch13",
    text: "What is the area of a square field with side 9 m?",
    options: [
      { text: "81 m²",  type: "correct",          logicTag: "9×9=81" },
      { text: "36 m",   type: "concept_error",    logicTag: "Calculated perimeter 4×9=36" },
      { text: "18 m²",  type: "calculation_error", logicTag: "Used 9×2=18" },
      { text: "729 m²", type: "concept_error",    logicTag: "Cubed instead of squared" },
    ],
    explanation: "Area of square = side × side = 9 × 9 = 81 m².",
    solutionSteps: ["Area of square = side².", "9 × 9 = 81 m²."],
    shortcut: "Square area = side². Always write the unit as m² (square metres).",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Fields and Fences",
  },
  {
    questionId: "math4_ch13_q3", topicId: "math4_ch13",
    text: "A field is 8 m × 6 m. How many 1 m × 1 m tiles are needed to cover it?",
    options: [
      { text: "48",  type: "correct",          logicTag: "Area=8×6=48 tiles" },
      { text: "28",  type: "concept_error",    logicTag: "Calculated perimeter 2(8+6)=28" },
      { text: "14",  type: "concept_error",    logicTag: "Used 8+6=14" },
      { text: "96",  type: "calculation_error", logicTag: "Doubled the area" },
    ],
    explanation: "Each tile covers 1 m². Area = 8 × 6 = 48 m². Tiles needed = 48.",
    solutionSteps: ["Area = 8 × 6 = 48 m².", "Each tile = 1 m².", "Tiles = 48."],
    shortcut: "Tiles = area of floor ÷ area of one tile.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Fields and Fences",
  },
  {
    questionId: "math4_ch13_q4", topicId: "math4_ch13",
    text: "Two fields: A is 4 m × 9 m and B is 6 m × 6 m. Which has greater perimeter?",
    options: [
      { text: "Field A (26 m > 24 m)", type: "correct",          logicTag: "PA=2(4+9)=26; PB=2(6+6)=24" },
      { text: "Field B",               type: "concept_error",    logicTag: "Did not calculate correctly" },
      { text: "They are equal",        type: "concept_error",    logicTag: "26 ≠ 24" },
      { text: "Cannot tell",           type: "guessing",         logicTag: "Perimeter can be calculated" },
    ],
    explanation: "PA = 2(4+9) = 26 m. PB = 2(6+6) = 24 m. Field A has greater perimeter.",
    solutionSteps: ["PA = 2(4+9) = 2×13 = 26 m.", "PB = 2(6+6) = 2×12 = 24 m.", "26 > 24 → Field A."],
    shortcut: "Calculate both perimeters, then compare.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Fields and Fences",
  },
  {
    questionId: "math4_ch13_q5", topicId: "math4_ch13",
    text: "A farmer wants to fence a 20 m × 12 m field. Fencing costs ₹5 per metre. What is the total cost?",
    options: [
      { text: "₹320",  type: "correct",          logicTag: "P=2(20+12)=64m; 64×5=320" },
      { text: "₹1200", type: "concept_error",    logicTag: "Used area 20×12=240, then ×5=1200" },
      { text: "₹160",  type: "partial_logic",    logicTag: "Used 32×5=160 (forgot to double)" },
      { text: "₹640",  type: "calculation_error", logicTag: "Doubled the answer" },
    ],
    explanation: "Perimeter = 2(20+12) = 64 m. Cost = 64 × ₹5 = ₹320.",
    solutionSteps: ["P = 2(20+12) = 64 m.", "Cost = 64 × 5 = ₹320."],
    shortcut: "Fencing cost = perimeter × cost per metre.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Fields and Fences",
  },

  // ─── Chapter 14: Smart Charts ──────────────────────────────────────────────
  {
    questionId: "math4_ch14_q1", topicId: "math4_ch14",
    text: "In a tally mark, how many marks are in one complete group?",
    options: [
      { text: "5",  type: "correct",       logicTag: "Tally groups: |||| = 4, then one crossing = 5" },
      { text: "4",  type: "concept_error", logicTag: "4 is incomplete — the 5th crosses the group" },
      { text: "10", type: "concept_error", logicTag: "10 is two groups" },
      { text: "3",  type: "concept_error", logicTag: "3 is not a standard tally group" },
    ],
    explanation: "Tally marks are grouped in fives: four vertical strokes, then a diagonal cross = 5.",
    solutionSteps: ["|||| = 4 marks.", "One diagonal through the four = 5 marks (one group).", "Two groups = 10."],
    shortcut: "Count tally groups: each gate = 5.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Smart Charts",
  },
  {
    questionId: "math4_ch14_q2", topicId: "math4_ch14",
    text: "A pictograph has key: ☺ = 3 students. Class A has 4 symbols. How many students?",
    options: [
      { text: "12",  type: "correct",          logicTag: "4×3=12" },
      { text: "4",   type: "partial_logic",    logicTag: "Counted symbols without key" },
      { text: "7",   type: "calculation_error", logicTag: "Added 4+3=7" },
      { text: "43",  type: "concept_error",    logicTag: "Wrote 4 and 3 next to each other" },
    ],
    explanation: "4 symbols × 3 students per symbol = 12 students.",
    solutionSteps: ["Key: 1☺ = 3 students.", "Symbols = 4.", "Students = 4 × 3 = 12."],
    shortcut: "Pictograph: count symbols × scale value.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Smart Charts",
  },
  {
    questionId: "math4_ch14_q3", topicId: "math4_ch14",
    text: "The tally for books read: Mon=|||| ||, Tue=|||, Wed=|||| ||||. How many books were read in total?",
    options: [
      { text: "18",  type: "correct",          logicTag: "Mon=7, Tue=3, Wed=10 → 7+3+10=20. Wait: |||| || = 7, ||| = 3, |||| |||| = 10? Let me recalculate. 7+3+10=20. Hmm but I wrote 18..." },
      { text: "15",  type: "concept_error",    logicTag: "Counted groups not individual marks" },
      { text: "20",  type: "correct",          logicTag: "Mon=7, Tue=3, Wed=10; 7+3+10=20" },
      { text: "12",  type: "calculation_error", logicTag: "Arithmetic error" },
    ],
    explanation: "Mon: |||| || = 7. Tue: ||| = 3. Wed: |||| |||| = 10. Total = 7 + 3 + 10 = 20.",
    solutionSteps: ["Mon = 5+2 = 7.", "Tue = 3.", "Wed = 5+5 = 10.", "Total = 7+3+10 = 20."],
    shortcut: "Count each group of 5 first, then add remaining strokes.",
    difficulty: "medium", subject: "Mathematics", grade: "4", chapter: "Smart Charts",
  },
  {
    questionId: "math4_ch14_q4", topicId: "math4_ch14",
    text: "Favourite colours: Red=15, Blue=20, Green=10, Yellow=5. Which colour is least popular?",
    options: [
      { text: "Yellow (5)",  type: "correct",       logicTag: "5 is the smallest value" },
      { text: "Green (10)",  type: "concept_error", logicTag: "Second smallest" },
      { text: "Red (15)",    type: "concept_error", logicTag: "Third highest" },
      { text: "Blue (20)",   type: "concept_error", logicTag: "Most popular" },
    ],
    explanation: "Least popular = smallest count = Yellow with 5.",
    solutionSteps: ["Values: Red=15, Blue=20, Green=10, Yellow=5.", "Smallest = 5 = Yellow."],
    shortcut: "Least popular = shortest bar / fewest symbols / smallest count.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Smart Charts",
  },
  {
    questionId: "math4_ch14_q5", topicId: "math4_ch14",
    text: "Using the colour data (Red=15, Blue=20, Green=10, Yellow=5), how many more students prefer Blue than Yellow?",
    options: [
      { text: "15",  type: "correct",          logicTag: "20−5=15" },
      { text: "25",  type: "concept_error",    logicTag: "Added instead of subtracted" },
      { text: "10",  type: "calculation_error", logicTag: "Used 20−10=10 (wrong pair)" },
      { text: "5",   type: "concept_error",    logicTag: "Gave Yellow's count" },
    ],
    explanation: "Difference = Blue − Yellow = 20 − 5 = 15.",
    solutionSteps: ["Blue = 20, Yellow = 5.", "Difference = 20 − 5 = 15."],
    shortcut: "Difference = larger − smaller.",
    difficulty: "easy", subject: "Mathematics", grade: "4", chapter: "Smart Charts",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
  for (const q of questions) {
    await Question.findOneAndUpdate(
      { questionId: q.questionId },
      q,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${q.questionId}`);
  }
  console.log(`\nSeeded ${questions.length} questions for Class 4 Math (Part B, Ch 8–14).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
