/**
 * CBSE Class 3 Mathematics — MCQ seed (Part B: Ch 8–14)
 * 5 questions per chapter = 35 total. Safe to re-run.
 * Usage: node config/seedMath3QuestionsB.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";

dotenv.config();

const questions = [
  // ── Chapter 8: Who is Heavier? ────────────────────────────────────────────
  {
    questionId: "math3_ch8_q1", topicId: "math3_ch8",
    text: "1 kilogram = _____ grams",
    options: [
      { text: "1000",  type: "correct",       logicTag: "1 kg = 1000 g; kilo means one thousand" },
      { text: "100",   type: "concept_error", logicTag: "100 g = 1 hectogram; 1 kg = 1000 g" },
      { text: "10",    type: "concept_error", logicTag: "10 g is a small fraction of a kg" },
      { text: "10000", type: "concept_error", logicTag: "10000 g = 10 kg, not 1 kg" },
    ],
    explanation: "1 kilogram = 1000 grams. 'Kilo' means one thousand.",
    solutionSteps: ["Kilo = 1000.", "1 kg = 1000 g."],
    shortcut: "kg to g: add three zeros. 3 kg = 3000 g.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Who is Heavier?",
  },
  {
    questionId: "math3_ch8_q2", topicId: "math3_ch8",
    text: "Which is heavier — 2 kg 500 g or 2400 g?",
    options: [
      { text: "2 kg 500 g",     type: "correct",       logicTag: "2 kg 500 g = 2500 g > 2400 g" },
      { text: "2400 g",         type: "concept_error", logicTag: "2400 g < 2500 g" },
      { text: "They are equal", type: "concept_error", logicTag: "2500 ≠ 2400" },
      { text: "Cannot compare", type: "concept_error", logicTag: "convert to same unit then compare" },
    ],
    explanation: "2 kg 500 g = 2000+500 = 2500 g. 2500 g > 2400 g → 2 kg 500 g is heavier.",
    solutionSteps: ["2 kg 500 g = 2500 g.", "2500 > 2400.", "2 kg 500 g is heavier."],
    shortcut: "Convert both to grams, then compare.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Who is Heavier?",
  },
  {
    questionId: "math3_ch8_q3", topicId: "math3_ch8",
    text: "A bag of rice weighs 5 kg. What is its weight in grams?",
    options: [
      { text: "5000 g", type: "correct",           logicTag: "5 kg = 5 × 1000 = 5000 g" },
      { text: "500 g",  type: "calculation_error", logicTag: "multiplied by 100 instead of 1000" },
      { text: "50 g",   type: "concept_error",     logicTag: "far too small for a bag of rice" },
      { text: "5 g",    type: "concept_error",     logicTag: "5 g is about the weight of a marble" },
    ],
    explanation: "1 kg = 1000 g, so 5 kg = 5 × 1000 = 5000 g.",
    solutionSteps: ["1 kg = 1000 g.", "5 kg = 5 × 1000 = 5000 g."],
    shortcut: "kg × 1000 = g.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Who is Heavier?",
  },
  {
    questionId: "math3_ch8_q4", topicId: "math3_ch8",
    text: "A marble weighs about 5 ___",
    options: [
      { text: "grams",     type: "correct",       logicTag: "a marble weighs approximately 5 g — correct unit for a small object" },
      { text: "kilograms", type: "concept_error", logicTag: "5 kg is the weight of a bag of rice, not a marble" },
      { text: "litres",    type: "concept_error", logicTag: "litres measure capacity, not weight" },
      { text: "metres",    type: "concept_error", logicTag: "metres measure length, not weight" },
    ],
    explanation: "Small light objects like marbles are measured in grams. 5 g is a sensible estimate for a marble.",
    solutionSteps: ["Marble is small and light.", "Use grams for light objects.", "A marble ≈ 5 grams."],
    shortcut: "Light objects (feather, coin, marble) → grams. Heavy objects (bag, person) → kilograms.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Who is Heavier?",
  },
  {
    questionId: "math3_ch8_q5", topicId: "math3_ch8",
    text: "On a balance scale, side A goes down. What does this tell us?",
    options: [
      { text: "Side A is heavier",   type: "correct",       logicTag: "the heavier side sinks on a balance scale" },
      { text: "Side A is lighter",   type: "concept_error", logicTag: "the lighter side goes UP" },
      { text: "Both sides are equal",type: "concept_error", logicTag: "if equal, both sides stay level" },
      { text: "Side B is heavier",   type: "concept_error", logicTag: "side B goes UP because it is lighter" },
    ],
    explanation: "On a balance scale, the heavier side sinks down. Side A going down → Side A is heavier.",
    solutionSteps: ["Heavy side sinks.", "Side A sinks → Side A is heavier."],
    shortcut: "Down = heavier. Up = lighter. Level = equal.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Who is Heavier?",
  },

  // ── Chapter 9: How Many Times? ─────────────────────────────────────────────
  {
    questionId: "math3_ch9_q1", topicId: "math3_ch9",
    text: "What is 6 × 4?",
    options: [
      { text: "24", type: "correct",           logicTag: "6×4 = 6+6+6+6 = 24" },
      { text: "10", type: "concept_error",     logicTag: "10 = 6+4 (addition, not multiplication)" },
      { text: "18", type: "calculation_error", logicTag: "18 = 6×3, off by one group" },
      { text: "28", type: "calculation_error", logicTag: "28 = 7×4, off by one" },
    ],
    explanation: "6 × 4 = 6+6+6+6 = 24. Know your tables: 6×4=24.",
    solutionSteps: ["6+6=12, 12+6=18, 18+6=24.", "Answer: 24."],
    shortcut: "Times table: 6×4=24.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "How Many Times?",
  },
  {
    questionId: "math3_ch9_q2", topicId: "math3_ch9",
    text: "Which of these is the same as 5 + 5 + 5?",
    options: [
      { text: "5 × 3", type: "correct",       logicTag: "5 added 3 times = 5×3" },
      { text: "5 + 3", type: "concept_error", logicTag: "5+3=8, not the same as 5+5+5=15" },
      { text: "5 × 5", type: "concept_error", logicTag: "5×5=25, not 15" },
      { text: "5 ÷ 3", type: "concept_error", logicTag: "division is the opposite of multiplication" },
    ],
    explanation: "5+5+5 = 5 repeated 3 times = 5×3 = 15.",
    solutionSteps: ["Count how many times 5 appears: 3 times.", "Repeated addition = multiplication.", "5×3=15."],
    shortcut: "Count the groups → that's the multiplier.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "How Many Times?",
  },
  {
    questionId: "math3_ch9_q3", topicId: "math3_ch9",
    text: "What is 7 × 0?",
    options: [
      { text: "0",  type: "correct",       logicTag: "any number × 0 = 0" },
      { text: "7",  type: "concept_error", logicTag: "7×1=7, but 7×0=0" },
      { text: "1",  type: "concept_error", logicTag: "any number × 1 = itself; × 0 = 0" },
      { text: "70", type: "concept_error", logicTag: "7×10=70, but 7×0=0" },
    ],
    explanation: "Any number multiplied by 0 is always 0. 7 groups of 0 objects = 0 objects.",
    solutionSteps: ["7×0 means 7 groups with 0 in each.", "0+0+0+0+0+0+0=0.", "Answer: 0."],
    shortcut: "Zero rule: anything × 0 = 0.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "How Many Times?",
  },
  {
    questionId: "math3_ch9_q4", topicId: "math3_ch9",
    text: "There are 4 boxes with 9 pencils in each. How many pencils are there in total?",
    options: [
      { text: "36", type: "correct",           logicTag: "4 × 9 = 36" },
      { text: "13", type: "concept_error",     logicTag: "4+9=13 (addition, not multiplication)" },
      { text: "27", type: "calculation_error", logicTag: "3×9=27, off by one box" },
      { text: "40", type: "calculation_error", logicTag: "4×10=40, wrong number of pencils per box" },
    ],
    explanation: "Equal groups → multiply. 4 boxes × 9 pencils = 4×9 = 36.",
    solutionSteps: ["Equal groups → multiply.", "4×9=36."],
    shortcut: "Equal groups: groups × items per group = total.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "How Many Times?",
  },
  {
    questionId: "math3_ch9_q5", topicId: "math3_ch9",
    text: "3 × 8 = 8 × ___. What fills the blank?",
    options: [
      { text: "3",  type: "correct",           logicTag: "commutativity: 3×8 = 8×3" },
      { text: "0",  type: "concept_error",     logicTag: "8×0=0, not 24" },
      { text: "24", type: "misinterpretation", logicTag: "24 is the answer to 3×8, not what goes in the blank" },
      { text: "8",  type: "concept_error",     logicTag: "8×8=64, not 24" },
    ],
    explanation: "Commutativity: a×b = b×a. So 3×8 = 8×3. Blank = 3.",
    solutionSteps: ["3×8=24.", "8×___=24 → ___=3.", "Blank = 3."],
    shortcut: "Commutativity: flip the order, same answer.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "How Many Times?",
  },

  // ── Chapter 10: Play with Patterns ────────────────────────────────────────
  {
    questionId: "math3_ch10_q1", topicId: "math3_ch10",
    text: "What comes next in the sequence: 5, 10, 15, 20, ___?",
    options: [
      { text: "25", type: "correct",           logicTag: "rule: add 5; 20+5=25" },
      { text: "24", type: "calculation_error", logicTag: "off by 1 — rule is +5 not +4" },
      { text: "30", type: "calculation_error", logicTag: "skipped one step — 30 is two steps ahead" },
      { text: "22", type: "calculation_error", logicTag: "22 does not follow the +5 rule" },
    ],
    explanation: "Differences: 5,5,5 → rule: add 5. Next: 20+5=25.",
    solutionSteps: ["Differences: 10−5=5, 15−10=5, 20−15=5.", "Rule: +5.", "Next: 20+5=25."],
    shortcut: "Write differences to find the rule.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Play with Patterns",
  },
  {
    questionId: "math3_ch10_q2", topicId: "math3_ch10",
    text: "What is the rule of the pattern: 2, 4, 6, 8, 10?",
    options: [
      { text: "Add 2",       type: "correct",           logicTag: "each term is 2 more than the previous" },
      { text: "Multiply by 2",type: "concept_error",    logicTag: "multiply by 2: 2,4,8,16 — different pattern" },
      { text: "Add 4",       type: "calculation_error", logicTag: "add 4: 2,6,10 — skips terms" },
      { text: "Subtract 2",  type: "concept_error",     logicTag: "subtract 2 gives a decreasing sequence" },
    ],
    explanation: "4−2=2, 6−4=2, 8−6=2 → rule: Add 2. These are the even numbers.",
    solutionSteps: ["Differences: all = 2.", "Rule: Add 2."],
    shortcut: "Even numbers follow 'add 2' starting from 2.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Play with Patterns",
  },
  {
    questionId: "math3_ch10_q3", topicId: "math3_ch10",
    text: "What comes next in the shape pattern: △, □, △, □, △, ___?",
    options: [
      { text: "□",  type: "correct",       logicTag: "repeating unit is △□; after △ comes □" },
      { text: "△",  type: "concept_error", logicTag: "△ just appeared; the rule alternates △□" },
      { text: "○",  type: "guessing",      logicTag: "a circle is not part of this pattern" },
      { text: "△□", type: "concept_error", logicTag: "only one shape comes next, not two" },
    ],
    explanation: "Repeating unit: △□. Last shape was △, so next = □.",
    solutionSteps: ["Repeating unit: △□.", "Last: △.", "Next: □."],
    shortcut: "Find the repeating unit, then continue it.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Play with Patterns",
  },
  {
    questionId: "math3_ch10_q4", topicId: "math3_ch10",
    text: "Fill in the blank: 3, 6, 9, ___, 15",
    options: [
      { text: "12", type: "correct",           logicTag: "rule: add 3; 9+3=12, then 12+3=15 ✓" },
      { text: "11", type: "calculation_error", logicTag: "11 does not follow the +3 rule" },
      { text: "10", type: "calculation_error", logicTag: "10 is not a multiple of 3" },
      { text: "13", type: "calculation_error", logicTag: "13 is not a multiple of 3" },
    ],
    explanation: "Rule: add 3 (multiples of 3). After 9: 9+3=12. Check: 12+3=15 ✓.",
    solutionSteps: ["Rule: +3.", "9+3=12.", "12+3=15 ✓. Answer: 12."],
    shortcut: "Check both sides: blank−9 = 15−blank = 3.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Play with Patterns",
  },
  {
    questionId: "math3_ch10_q5", topicId: "math3_ch10",
    text: "Which number pattern follows the rule 'subtract 5'?",
    options: [
      { text: "30, 25, 20, 15", type: "correct",       logicTag: "30−5=25, 25−5=20, 20−5=15 ✓" },
      { text: "30, 35, 40, 45", type: "concept_error", logicTag: "this is add 5, not subtract 5" },
      { text: "5, 10, 15, 20",  type: "concept_error", logicTag: "this is add 5 starting from 5" },
      { text: "25, 30, 35, 40", type: "concept_error", logicTag: "this is add 5 starting from 25" },
    ],
    explanation: "Subtract 5 gives a decreasing pattern. Starting from 30: 30, 25, 20, 15.",
    solutionSteps: ["Rule: subtract 5.", "30−5=25, 25−5=20, 20−5=15."],
    shortcut: "Subtract → decreasing. Add → increasing.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Play with Patterns",
  },

  // ── Chapter 11: Jugs and Mugs ──────────────────────────────────────────────
  {
    questionId: "math3_ch11_q1", topicId: "math3_ch11",
    text: "1 litre = _____ millilitres",
    options: [
      { text: "1000", type: "correct",       logicTag: "1 L = 1000 mL" },
      { text: "100",  type: "concept_error", logicTag: "100 mL = 1 dL; 1 L = 1000 mL" },
      { text: "10",   type: "concept_error", logicTag: "10 mL is a teaspoon, not a litre" },
      { text: "1",    type: "concept_error", logicTag: "1 mL is a tiny drop" },
    ],
    explanation: "1 litre = 1000 millilitres. 'Milli' means one-thousandth.",
    solutionSteps: ["Milli = 1/1000.", "1 L = 1000 mL."],
    shortcut: "L to mL: add three zeros (same as kg to g).",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Jugs and Mugs",
  },
  {
    questionId: "math3_ch11_q2", topicId: "math3_ch11",
    text: "A teaspoon holds about 5 ___",
    options: [
      { text: "mL", type: "correct",       logicTag: "a teaspoon holds about 5 mL — small unit for small volume" },
      { text: "L",  type: "concept_error", logicTag: "5 L is a large bucket; a teaspoon is tiny" },
      { text: "kg", type: "concept_error", logicTag: "kg measures weight, not capacity" },
      { text: "cm", type: "concept_error", logicTag: "cm measures length, not capacity" },
    ],
    explanation: "A teaspoon is a very small container — about 5 millilitres. Litres are for large containers.",
    solutionSteps: ["Small amounts → mL. Large amounts → L.", "A teaspoon ≈ 5 mL."],
    shortcut: "mL for drops/spoons; L for bottles/buckets.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Jugs and Mugs",
  },
  {
    questionId: "math3_ch11_q3", topicId: "math3_ch11",
    text: "2 L 500 mL = _____ mL",
    options: [
      { text: "2500",  type: "correct",           logicTag: "2×1000+500=2500 mL" },
      { text: "250",   type: "calculation_error", logicTag: "divided by 10 instead of converting" },
      { text: "2050",  type: "calculation_error", logicTag: "wrongly placed digits" },
      { text: "25000", type: "calculation_error", logicTag: "multiplied by too large a factor" },
    ],
    explanation: "2 L = 2×1000 = 2000 mL. 2000+500 = 2500 mL.",
    solutionSteps: ["2 L = 2000 mL.", "2000+500 = 2500 mL."],
    shortcut: "L × 1000 + extra mL = total mL.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Jugs and Mugs",
  },
  {
    questionId: "math3_ch11_q4", topicId: "math3_ch11",
    text: "A bucket holds 10 L and a glass holds 200 mL. How many glasses fill the bucket?",
    options: [
      { text: "50", type: "correct",           logicTag: "10 L = 10000 mL; 10000÷200=50" },
      { text: "10", type: "calculation_error", logicTag: "divided litres by mL without converting" },
      { text: "20", type: "calculation_error", logicTag: "used 10×200 instead of division" },
      { text: "5",  type: "calculation_error", logicTag: "off by a factor of 10" },
    ],
    explanation: "10 L = 10000 mL. 10000 ÷ 200 = 50 glasses.",
    solutionSteps: ["10 L = 10000 mL.", "10000 ÷ 200 = 50."],
    shortcut: "Convert to same unit before dividing.",
    difficulty: "hard", subject: "Mathematics", grade: "3", chapter: "Jugs and Mugs",
  },
  {
    questionId: "math3_ch11_q5", topicId: "math3_ch11",
    text: "Which holds more — 3 L or 2800 mL?",
    options: [
      { text: "3 L",        type: "correct",       logicTag: "3 L = 3000 mL > 2800 mL" },
      { text: "2800 mL",    type: "concept_error", logicTag: "2800 mL < 3000 mL" },
      { text: "Equal",      type: "concept_error", logicTag: "3000 ≠ 2800" },
      { text: "Cannot tell",type: "concept_error", logicTag: "convert to same unit then compare" },
    ],
    explanation: "3 L = 3000 mL. 3000 > 2800 → 3 L holds more.",
    solutionSteps: ["3 L = 3000 mL.", "3000 vs 2800.", "3000 > 2800 → 3 L is more."],
    shortcut: "Convert to same unit before comparing.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Jugs and Mugs",
  },

  // ── Chapter 12: Can We Share? ─────────────────────────────────────────────
  {
    questionId: "math3_ch12_q1", topicId: "math3_ch12",
    text: "What is 18 ÷ 3?",
    options: [
      { text: "6",  type: "correct",           logicTag: "18÷3=6; verify: 6×3=18 ✓" },
      { text: "15", type: "concept_error",     logicTag: "15 = 18−3 (subtraction not division)" },
      { text: "9",  type: "calculation_error", logicTag: "9 = 18÷2, not 18÷3" },
      { text: "3",  type: "calculation_error", logicTag: "3 is the divisor, not the quotient" },
    ],
    explanation: "18 ÷ 3 = 6. Check: 6×3=18 ✓.",
    solutionSteps: ["3×6=18 ✓", "18÷3=6."],
    shortcut: "Use multiplication to find division answers.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Can We Share?",
  },
  {
    questionId: "math3_ch12_q2", topicId: "math3_ch12",
    text: "20 sweets shared equally among 4 children. How many does each child get?",
    options: [
      { text: "5",  type: "correct",           logicTag: "20÷4=5" },
      { text: "4",  type: "calculation_error", logicTag: "confused divisor with quotient" },
      { text: "16", type: "concept_error",     logicTag: "20−4=16 (subtraction not division)" },
      { text: "80", type: "concept_error",     logicTag: "20×4=80 (multiplication not division)" },
    ],
    explanation: "Equally shared → divide. 20÷4=5. Check: 5×4=20 ✓.",
    solutionSteps: ["Equally shared → divide.", "20÷4=5.", "Check: 5×4=20 ✓."],
    shortcut: "Equal sharing = divide total by number of sharers.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Can We Share?",
  },
  {
    questionId: "math3_ch12_q3", topicId: "math3_ch12",
    text: "How do you verify that 24 ÷ 6 = 4 is correct?",
    options: [
      { text: "4 × 6 = 24",   type: "correct",       logicTag: "quotient × divisor = dividend" },
      { text: "24 × 6 = 144", type: "concept_error", logicTag: "multiplying dividend by divisor doesn't verify division" },
      { text: "6 + 4 = 10",   type: "concept_error", logicTag: "addition has nothing to do with verifying division" },
      { text: "24 − 6 = 18",  type: "concept_error", logicTag: "subtraction doesn't verify division" },
    ],
    explanation: "Verify division: quotient × divisor = dividend. 4×6=24 ✓.",
    solutionSteps: ["Check: quotient × divisor = dividend.", "4×6=24 ✓. Verified."],
    shortcut: "Division inverse = multiplication. Always check with ×.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Can We Share?",
  },
  {
    questionId: "math3_ch12_q4", topicId: "math3_ch12",
    text: "17 ÷ 5 gives quotient ___ and remainder ___",
    options: [
      { text: "3 remainder 2", type: "correct",           logicTag: "5×3=15, 17−15=2 → quotient=3, remainder=2" },
      { text: "4 remainder 3", type: "calculation_error", logicTag: "5×4=20>17, cannot have quotient 4" },
      { text: "5 remainder 0", type: "calculation_error", logicTag: "5×5=25>17, incorrect" },
      { text: "3 remainder 5", type: "calculation_error", logicTag: "remainder must be less than divisor (< 5)" },
    ],
    explanation: "Largest multiple of 5 ≤ 17: 5×3=15. Remainder: 17−15=2. Quotient=3, remainder=2.",
    solutionSteps: ["5×3=15 (closest multiple ≤ 17).", "Remainder=17−15=2.", "Quotient=3, remainder=2."],
    shortcut: "Remainder must always be smaller than the divisor.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Can We Share?",
  },
  {
    questionId: "math3_ch12_q5", topicId: "math3_ch12",
    text: "30 books arranged in groups of 6. How many groups are there?",
    options: [
      { text: "5",  type: "correct",           logicTag: "30÷6=5 groups" },
      { text: "6",  type: "calculation_error", logicTag: "confused divisor with quotient" },
      { text: "24", type: "concept_error",     logicTag: "30−6=24 (subtraction not division)" },
      { text: "36", type: "concept_error",     logicTag: "30+6=36 (addition not division)" },
    ],
    explanation: "Equal grouping → divide. 30÷6=5 groups. Check: 5×6=30 ✓.",
    solutionSteps: ["Groups → divide total by group size.", "30÷6=5.", "Check: 5×6=30 ✓."],
    shortcut: "Total ÷ group size = number of groups.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Can We Share?",
  },

  // ── Chapter 13: Smart Charts! ─────────────────────────────────────────────
  {
    questionId: "math3_ch13_q1", topicId: "math3_ch13",
    text: "Four vertical tally marks with one diagonal crossing through them represents:",
    options: [
      { text: "5",  type: "correct",           logicTag: "4 verticals + 1 diagonal crossing = 5 tally marks" },
      { text: "4",  type: "concept_error",     logicTag: "4 is just the vertical lines; the diagonal adds the 5th" },
      { text: "6",  type: "calculation_error", logicTag: "off by one — one gate mark = exactly 5" },
      { text: "10", type: "concept_error",     logicTag: "10 = two complete gate marks" },
    ],
    explanation: "4 vertical marks + 1 diagonal crossing = 5. This 'gate' pattern makes counting in fives easy.",
    solutionSteps: ["4 verticals + 1 diagonal = 5.", "One gate = 5."],
    shortcut: "One gate = 5. Two gates = 10. Count gates × 5, add extra marks.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Smart Charts!",
  },
  {
    questionId: "math3_ch13_q2", topicId: "math3_ch13",
    text: "In a pictograph, each star represents 5 students. If 3 stars are shown, how many students does that represent?",
    options: [
      { text: "15", type: "correct",           logicTag: "3 × 5 = 15 students" },
      { text: "5",  type: "calculation_error", logicTag: "value of one star, not three" },
      { text: "3",  type: "concept_error",     logicTag: "counted pictures instead of multiplying by value" },
      { text: "8",  type: "calculation_error", logicTag: "added instead of multiplied (3+5=8)" },
    ],
    explanation: "Each star = 5 students. 3 stars = 3×5 = 15 students.",
    solutionSteps: ["Value per symbol = 5.", "3 symbols × 5 = 15 students."],
    shortcut: "Symbols × value per symbol. Always check the key.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Smart Charts!",
  },
  {
    questionId: "math3_ch13_q3", topicId: "math3_ch13",
    text: "A survey shows: Mango=12, Apple=8, Banana=10. Which is most popular?",
    options: [
      { text: "Mango",    type: "correct",           logicTag: "12 is the highest count" },
      { text: "Apple",    type: "calculation_error", logicTag: "8 is the lowest count" },
      { text: "Banana",   type: "calculation_error", logicTag: "10 is in the middle" },
      { text: "All equal",type: "concept_error",     logicTag: "12, 10, and 8 are all different" },
    ],
    explanation: "Most popular = highest count. Mango has 12, which is greater than Banana (10) and Apple (8).",
    solutionSteps: ["Compare: 12, 8, 10.", "Largest = 12 (Mango).", "Mango is most popular."],
    shortcut: "Most popular = largest number in chart.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Smart Charts!",
  },
  {
    questionId: "math3_ch13_q4", topicId: "math3_ch13",
    text: "How many tally marks are needed to record the number 13?",
    options: [
      { text: "Two gate-bundles plus three single marks",  type: "correct",           logicTag: "13 = 5+5+3" },
      { text: "Thirteen single marks in a row",           type: "concept_error",     logicTag: "correct count but wrong format — must group in fives" },
      { text: "Two gate-bundles plus four single marks",  type: "calculation_error", logicTag: "that would be 14, not 13" },
      { text: "One gate-bundle plus three single marks",  type: "calculation_error", logicTag: "that would be 8, not 13" },
    ],
    explanation: "13 = 10+3 = two bundles of five plus three singles.",
    solutionSteps: ["13 = 5+5+3.", "Two gate-bundles + 3 singles."],
    shortcut: "Divide by 5: 13÷5=2 remainder 3 → 2 gates + 3 singles.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Smart Charts!",
  },
  {
    questionId: "math3_ch13_q5", topicId: "math3_ch13",
    text: "What MUST you always check before reading a pictograph?",
    options: [
      { text: "The key (what each symbol represents)", type: "correct",       logicTag: "without the key you cannot calculate actual values" },
      { text: "The title of the chart",               type: "partial_logic", logicTag: "title helps but does not give you the count" },
      { text: "The colour of the symbols",            type: "concept_error", logicTag: "colour is decorative; the key value is what matters" },
      { text: "The size of the symbols",              type: "concept_error", logicTag: "size does not determine value — the key does" },
    ],
    explanation: "The key tells you how many items each symbol represents. Without it you cannot calculate actual numbers.",
    solutionSteps: ["Each symbol = a number of items.", "The key tells you that number.", "Always read the key first."],
    shortcut: "Key first, always. No key = no correct reading.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Smart Charts!",
  },

  // ── Chapter 14: Rupees and Paise ──────────────────────────────────────────
  {
    questionId: "math3_ch14_q1", topicId: "math3_ch14",
    text: "1 rupee = _____ paise",
    options: [
      { text: "100",  type: "correct",       logicTag: "1 rupee = 100 paise" },
      { text: "10",   type: "concept_error", logicTag: "10 paise is 10% of a rupee" },
      { text: "1000", type: "concept_error", logicTag: "1000 paise = 10 rupees" },
      { text: "50",   type: "guessing",      logicTag: "50 paise = half a rupee" },
    ],
    explanation: "1 rupee = 100 paise. Like 1 metre = 100 centimetres.",
    solutionSteps: ["1 ₹ = 100 paise."],
    shortcut: "₹ to paise: ×100. Paise to ₹: ÷100.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Rupees and Paise",
  },
  {
    questionId: "math3_ch14_q2", topicId: "math3_ch14",
    text: "A book costs ₹45. You pay with a ₹50 note. What change do you get?",
    options: [
      { text: "₹5",  type: "correct",           logicTag: "50−45=5" },
      { text: "₹95", type: "concept_error",     logicTag: "added instead of subtracted" },
      { text: "₹45", type: "concept_error",     logicTag: "the cost, not the change" },
      { text: "₹15", type: "calculation_error", logicTag: "arithmetic error" },
    ],
    explanation: "Change = paid − cost = ₹50 − ₹45 = ₹5.",
    solutionSteps: ["Change = paid − cost.", "₹50 − ₹45 = ₹5."],
    shortcut: "Change = given − cost. Always.",
    difficulty: "easy", subject: "Mathematics", grade: "3", chapter: "Rupees and Paise",
  },
  {
    questionId: "math3_ch14_q3", topicId: "math3_ch14",
    text: "₹12.75 + ₹8.50 = ?",
    options: [
      { text: "₹21.25", type: "correct",           logicTag: "paise 75+50=125=₹1.25; rupees 12+8+1=21 → ₹21.25" },
      { text: "₹20.25", type: "calculation_error", logicTag: "forgot to carry the extra rupee from paise" },
      { text: "₹21.75", type: "calculation_error", logicTag: "error in paise column" },
      { text: "₹20.75", type: "calculation_error", logicTag: "two errors combined" },
    ],
    explanation: "Paise: 75+50=125=₹1 and 25p (carry ₹1). Rupees: 12+8+1=21. Total: ₹21.25.",
    solutionSteps: ["Paise: 75+50=125 → ₹1 and 25p, carry ₹1.", "Rupees: 12+8+1=21.", "Answer: ₹21.25."],
    shortcut: "Add paise, carry every 100 paise as ₹1.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Rupees and Paise",
  },
  {
    questionId: "math3_ch14_q4", topicId: "math3_ch14",
    text: "Which set of coins makes exactly ₹5.50?",
    options: [
      { text: "One ₹5 coin and one 50 paise coin", type: "correct",           logicTag: "₹5 + 50p = ₹5.50" },
      { text: "Five ₹1 coins",                     type: "calculation_error", logicTag: "five ₹1 = ₹5.00, not ₹5.50" },
      { text: "Fifty 10-paise coins",              type: "calculation_error", logicTag: "50 × 10p = 500p = ₹5.00, not ₹5.50" },
      { text: "One ₹5 note and one ₹5 coin",      type: "calculation_error", logicTag: "₹5+₹5=₹10, too much" },
    ],
    explanation: "₹5.50 = ₹5 + 50 paise. One ₹5 coin + one 50p coin = ₹5.50.",
    solutionSteps: ["₹5.50 = 5 rupees + 50 paise.", "₹5 coin + 50p coin."],
    shortcut: "Handle rupees and paise separately.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Rupees and Paise",
  },
  {
    questionId: "math3_ch14_q5", topicId: "math3_ch14",
    text: "A pen costs ₹8.25 and an eraser costs ₹3.50. What is the total cost?",
    options: [
      { text: "₹11.75", type: "correct",           logicTag: "paise 25+50=75; rupees 8+3=11 → ₹11.75" },
      { text: "₹11.50", type: "calculation_error", logicTag: "error in paise column (25+50≠50)" },
      { text: "₹12.75", type: "calculation_error", logicTag: "error in rupees column" },
      { text: "₹4.75",  type: "concept_error",     logicTag: "subtracted instead of added" },
    ],
    explanation: "Paise: 25+50=75 (no carry). Rupees: 8+3=11. Total: ₹11.75.",
    solutionSteps: ["Paise: 25+50=75 (< 100, no carry).", "Rupees: 8+3=11.", "Total: ₹11.75."],
    shortcut: "Add paise first; if < 100 no carry needed.",
    difficulty: "medium", subject: "Mathematics", grade: "3", chapter: "Rupees and Paise",
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
  console.log(`\nSeeded ${questions.length} questions for Class 3 Math (Part B, Ch 8–14).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
