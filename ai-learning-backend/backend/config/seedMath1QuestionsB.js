/**
 * CBSE Class 1 Mathematics — Questions Seed B (Ch 8–13)
 * 5 questions per chapter = 30 questions total. Safe to re-run.
 * Usage: node config/seedMath1QuestionsB.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const questions = [

  // ── Chapter 8: Numbers from Twenty-one to Fifty ──────────────────────────
  {
    questionId: "math1_ch8_q1", topicId: "math1_ch8",
    text: "How do you write THIRTY-FIVE as a numeral?",
    options: [
      { text: "35",  type: "correct",       logicTag: "thirty-five = 35" },
      { text: "53",  type: "concept_error", logicTag: "digits reversed" },
      { text: "30",  type: "concept_error", logicTag: "thirty, not thirty-five" },
      { text: "305", type: "concept_error", logicTag: "three-digit number" },
    ],
    explanation: "Thirty-five = 3 tens + 5 ones = 35.",
    solutionSteps: ["Thirty = 30 (3 tens).", "Five = 5 ones.", "35."],
    shortcut: "Tens name → tens digit; ones name → ones digit. Thirty-five → 35.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers from Twenty-one to Fifty",
  },
  {
    questionId: "math1_ch8_q2", topicId: "math1_ch8",
    text: "Which number is GREATER: 29 or 32?",
    options: [
      { text: "32",    type: "correct",       logicTag: "3 tens > 2 tens" },
      { text: "29",    type: "concept_error", logicTag: "2 tens < 3 tens" },
      { text: "Equal", type: "concept_error", logicTag: "29 ≠ 32" },
      { text: "Cannot tell.", type: "concept_error", logicTag: "we can compare tens digits" },
    ],
    explanation: "Compare tens: 29 has 2 tens, 32 has 3 tens. 3 > 2, so 32 > 29.",
    solutionSteps: ["29: tens = 2.", "32: tens = 3.", "3 > 2 → 32 > 29."],
    shortcut: "Compare tens digits first: larger tens digit = greater number.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers from Twenty-one to Fifty",
  },
  {
    questionId: "math1_ch8_q3", topicId: "math1_ch8",
    text: "Arrange from SMALLEST to LARGEST: 45, 27, 38.",
    options: [
      { text: "27, 38, 45",  type: "correct",       logicTag: "2<3<4 tens" },
      { text: "45, 38, 27",  type: "concept_error", logicTag: "largest to smallest" },
      { text: "38, 27, 45",  type: "concept_error", logicTag: "wrong order" },
      { text: "27, 45, 38",  type: "concept_error", logicTag: "wrong middle" },
    ],
    explanation: "Tens: 27=2, 38=3, 45=4. Order: 27 < 38 < 45.",
    solutionSteps: ["Tens digits: 45→4, 27→2, 38→3.", "Order: 2 < 3 < 4 → 27, 38, 45."],
    shortcut: "Sort by tens digit, then by ones if tens are equal.",
    difficulty: "medium", subject: "Mathematics", grade: "1", chapter: "Numbers from Twenty-one to Fifty",
  },
  {
    questionId: "math1_ch8_q4", topicId: "math1_ch8",
    text: "What number comes JUST BEFORE 40?",
    options: [
      { text: "39", type: "correct",          logicTag: "40 − 1 = 39" },
      { text: "41", type: "concept_error",    logicTag: "41 comes after 40" },
      { text: "30", type: "concept_error",    logicTag: "30 is 10 before 40" },
      { text: "49", type: "concept_error",    logicTag: "49 is after 40" },
    ],
    explanation: "Just before = −1. 40 − 1 = 39.",
    solutionSteps: ["Just before = −1.", "40 − 1 = 39."],
    shortcut: "Just before 40: the last number in the 30s is 39.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers from Twenty-one to Fifty",
  },
  {
    questionId: "math1_ch8_q5", topicId: "math1_ch8",
    text: "How many tens and ones are in 43?",
    options: [
      { text: "4 tens and 3 ones",  type: "correct",       logicTag: "43 = 4×10 + 3" },
      { text: "3 tens and 4 ones",  type: "concept_error", logicTag: "digits reversed" },
      { text: "4 tens and 0 ones",  type: "concept_error", logicTag: "forgot ones" },
      { text: "40 tens and 3 ones", type: "concept_error", logicTag: "tens digit is 4 not 40" },
    ],
    explanation: "43: tens digit = 4 (4 tens = 40), ones digit = 3 (3 ones). 4 tens + 3 ones = 43.",
    solutionSteps: ["Left digit = tens: 4 tens.", "Right digit = ones: 3 ones.", "43 = 4 tens + 3 ones."],
    shortcut: "Left digit → tens; right digit → ones.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers from Twenty-one to Fifty",
  },

  // ── Chapter 9: Data Handling ─────────────────────────────────────────────
  {
    questionId: "math1_ch9_q1", topicId: "math1_ch9",
    text: "You have red, blue, and green blocks. Which ONE attribute could you sort them by?",
    options: [
      { text: "Colour",             type: "correct",       logicTag: "colour is one attribute" },
      { text: "Colour and size",    type: "concept_error", logicTag: "two attributes at once" },
      { text: "Taste",              type: "concept_error", logicTag: "blocks have no taste" },
      { text: "How old they are",   type: "concept_error", logicTag: "blocks don't have age" },
    ],
    explanation: "Sort by ONE attribute at a time. Colour is the natural attribute given here.",
    solutionSteps: ["Choose one attribute: colour.", "Put red together, blue together, green together."],
    shortcut: "Sort by ONE attribute: colour, shape, OR size — not two at once.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Data Handling",
  },
  {
    questionId: "math1_ch9_q2", topicId: "math1_ch9",
    text: "After sorting, the red group has 5 objects and the blue group has 3. Which group has MORE?",
    options: [
      { text: "Red (5 objects).",  type: "correct",       logicTag: "5 > 3" },
      { text: "Blue (3 objects).", type: "concept_error", logicTag: "3 < 5" },
      { text: "Both the same.",    type: "concept_error", logicTag: "5 ≠ 3" },
      { text: "Cannot tell.",      type: "concept_error", logicTag: "5 vs 3 is directly comparable" },
    ],
    explanation: "5 > 3. The red group has more objects.",
    solutionSteps: ["Red: 5. Blue: 3.", "5 > 3 → red has more."],
    shortcut: "More = larger count.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Data Handling",
  },
  {
    questionId: "math1_ch9_q3", topicId: "math1_ch9",
    text: "Arjun sorts 10 fruits: 4 mangoes, 3 bananas, 3 apples. Which fruit is the MOST common?",
    options: [
      { text: "Mangoes (4).",  type: "correct",       logicTag: "4 > 3" },
      { text: "Bananas (3).",  type: "concept_error", logicTag: "3 < 4" },
      { text: "Apples (3).",   type: "concept_error", logicTag: "3 < 4" },
      { text: "All the same.", type: "concept_error", logicTag: "4 ≠ 3" },
    ],
    explanation: "Most common = largest count. Mangoes have 4, which is more than 3.",
    solutionSteps: ["Counts: mango=4, banana=3, apple=3.", "Most = 4 → mango."],
    shortcut: "Most common = largest group after sorting.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Data Handling",
  },
  {
    questionId: "math1_ch9_q4", topicId: "math1_ch9",
    text: "What does sorting help us find out?",
    options: [
      { text: "Which group has the most or least.",           type: "correct",       logicTag: "sorting → comparing group sizes" },
      { text: "How heavy each object is.",                   type: "concept_error", logicTag: "sorting by weight is a different activity" },
      { text: "The colour of every object.",                 type: "concept_error", logicTag: "colour is used TO sort, not found BY sorting" },
      { text: "Nothing useful.",                             type: "concept_error", logicTag: "sorting is very useful for data" },
    ],
    explanation: "After sorting into groups and counting, we can see which group is the most or least common.",
    solutionSteps: ["Sort → groups.", "Count each group.", "Compare counts → most/least."],
    shortcut: "Sort → count → compare.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Data Handling",
  },
  {
    questionId: "math1_ch9_q5", topicId: "math1_ch9",
    text: "If you line up sorted groups as rows, which row tells you the LEAST popular item?",
    options: [
      { text: "The shortest row.",  type: "correct",       logicTag: "fewest objects = shortest row" },
      { text: "The longest row.",   type: "concept_error", logicTag: "longest = most popular" },
      { text: "The middle row.",    type: "concept_error", logicTag: "middle row has medium count" },
      { text: "All rows are the same.", type: "concept_error", logicTag: "rows may differ in length" },
    ],
    explanation: "The shortest row has the fewest objects — that is the least popular.",
    solutionSteps: ["Short row = few objects = least popular.", "Long row = many objects = most popular."],
    shortcut: "Shortest row = least. Longest row = most.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Data Handling",
  },

  // ── Chapter 10: Patterns ─────────────────────────────────────────────────
  {
    questionId: "math1_ch10_q1", topicId: "math1_ch10",
    text: "What comes next? 🔴🔵🔴🔵🔴 ___",
    options: [
      { text: "🔵 (Blue)",   type: "correct",       logicTag: "AB pattern, next is B" },
      { text: "🔴 (Red)",    type: "concept_error", logicTag: "red is in odd positions" },
      { text: "🟢 (Green)",  type: "concept_error", logicTag: "green not in pattern" },
      { text: "🟡 (Yellow)", type: "concept_error", logicTag: "yellow not in pattern" },
    ],
    explanation: "Pattern: Red, Blue, Red, Blue, Red, Blue … The next item after Red is Blue.",
    solutionSteps: ["Unit: Red, Blue (AB).", "Position 5 = Red, position 6 = Blue.", "Next: Blue."],
    shortcut: "Odd positions = Red (A), even positions = Blue (B).",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Patterns",
  },
  {
    questionId: "math1_ch10_q2", topicId: "math1_ch10",
    text: "🔺🔲🔲🔺🔲🔲🔺 ___ What comes next?",
    options: [
      { text: "🔲🔲 (Two squares)",  type: "correct",       logicTag: "ABB pattern: after triangle come two squares" },
      { text: "🔺 (Triangle)",       type: "concept_error", logicTag: "triangle comes after two squares" },
      { text: "🔲 (One square)",     type: "concept_error", logicTag: "there are two squares in the unit" },
      { text: "Nothing",             type: "concept_error", logicTag: "the pattern continues" },
    ],
    explanation: "Pattern unit: Triangle, Square, Square (ABB). After Triangle come two squares.",
    solutionSteps: ["Unit: Triangle, Square, Square.", "After 🔺 in the unit come 🔲🔲.", "Next: 🔲🔲."],
    shortcut: "Find the repeating unit first, then continue it.",
    difficulty: "medium", subject: "Mathematics", grade: "1", chapter: "Patterns",
  },
  {
    questionId: "math1_ch10_q3", topicId: "math1_ch10",
    text: "Big, Small, Big, Small, Big, ___",
    options: [
      { text: "Small",      type: "correct",       logicTag: "AB pattern, after Big comes Small" },
      { text: "Big",        type: "concept_error", logicTag: "Big comes in odd positions" },
      { text: "Medium",     type: "concept_error", logicTag: "Medium is not in pattern" },
      { text: "Very Big",   type: "concept_error", logicTag: "Very Big not in pattern" },
    ],
    explanation: "Unit: Big, Small (AB). After Big (position 5) comes Small (position 6).",
    solutionSteps: ["Unit: Big, Small.", "Position 5 = Big, position 6 = Small.", "Next: Small."],
    shortcut: "Odd = Big, Even = Small for this AB pattern.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Patterns",
  },
  {
    questionId: "math1_ch10_q4", topicId: "math1_ch10",
    text: "What is the REPEATING UNIT in this pattern? 🟡🟢🟣🟡🟢🟣🟡🟢🟣",
    options: [
      { text: "🟡🟢🟣 (Yellow, Green, Purple)", type: "correct",       logicTag: "three-item ABC unit" },
      { text: "🟡🟢 (Yellow, Green)",            type: "concept_error", logicTag: "incomplete unit" },
      { text: "🟡 (Yellow only)",                type: "concept_error", logicTag: "only one item of the unit" },
      { text: "🟡🟢🟣🟡 (Four items)",           type: "concept_error", logicTag: "too long; unit starts repeating at 4th" },
    ],
    explanation: "The pattern repeats every 3 items: Yellow, Green, Purple. Unit size = 3.",
    solutionSteps: ["Identify where the pattern restarts.", "It restarts at position 4 (Yellow again).", "Unit: Yellow, Green, Purple."],
    shortcut: "Find when the pattern restarts — those items before that point form the unit.",
    difficulty: "medium", subject: "Mathematics", grade: "1", chapter: "Patterns",
  },
  {
    questionId: "math1_ch10_q5", topicId: "math1_ch10",
    text: "Create the next TWO items for this pattern: ⭐🌙⭐🌙⭐🌙 ___ ___",
    options: [
      { text: "⭐ then 🌙",  type: "correct",       logicTag: "AB continues: star then moon" },
      { text: "🌙 then ⭐",  type: "concept_error", logicTag: "moon would come first in next pair" },
      { text: "⭐ then ⭐",  type: "concept_error", logicTag: "two stars break the pattern" },
      { text: "🌙 then 🌙",  type: "concept_error", logicTag: "two moons break the pattern" },
    ],
    explanation: "Unit: Star, Moon (AB). Position 7 = Star, position 8 = Moon.",
    solutionSteps: ["Unit: Star, Moon.", "Positions 7 and 8: Star, Moon.", "⭐ then 🌙."],
    shortcut: "Extend by repeating the unit: Star, Moon, Star, Moon …",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Patterns",
  },

  // ── Chapter 11: Numbers ──────────────────────────────────────────────────
  {
    questionId: "math1_ch11_q1", topicId: "math1_ch11",
    text: "How do you say the number 73?",
    options: [
      { text: "Seventy-three",  type: "correct",          logicTag: "7 tens = seventy, 3 ones = three" },
      { text: "Thirty-seven",   type: "concept_error",    logicTag: "digits reversed" },
      { text: "Seven-three",    type: "concept_error",    logicTag: "not a proper number name" },
      { text: "Seventy",        type: "concept_error",    logicTag: "missing the ones digit" },
    ],
    explanation: "73: 7 tens = seventy, 3 ones = three. Say: seventy-three.",
    solutionSteps: ["Tens digit: 7 → seventy.", "Ones digit: 3 → three.", "Combined: seventy-three."],
    shortcut: "Say tens name then ones name joined with a hyphen.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers",
  },
  {
    questionId: "math1_ch11_q2", topicId: "math1_ch11",
    text: "Which number is SMALLEST: 86, 68, 78?",
    options: [
      { text: "68",  type: "correct",       logicTag: "6 tens < 7 tens < 8 tens" },
      { text: "86",  type: "concept_error", logicTag: "86 is largest" },
      { text: "78",  type: "concept_error", logicTag: "78 is in the middle" },
      { text: "All equal.", type: "concept_error", logicTag: "they differ in tens digit" },
    ],
    explanation: "Compare tens: 68=6, 78=7, 86=8. Smallest tens = 6 → 68 is smallest.",
    solutionSteps: ["Tens: 68→6, 78→7, 86→8.", "Smallest tens = 6 → 68."],
    shortcut: "Smallest tens digit = smallest number.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers",
  },
  {
    questionId: "math1_ch11_q3", topicId: "math1_ch11",
    text: "What is 60 + 9?",
    options: [
      { text: "69",  type: "correct",          logicTag: "60 = 6 tens, +9 ones = 69" },
      { text: "96",  type: "concept_error",    logicTag: "digits reversed" },
      { text: "609", type: "concept_error",    logicTag: "three-digit number" },
      { text: "70",  type: "calculation_error",logicTag: "confused 9 with 10" },
    ],
    explanation: "60 is 6 tens; add 9 ones: 69.",
    solutionSteps: ["60 + 9.", "60 = 6 tens.", "9 ones.", "6 tens + 9 ones = 69."],
    shortcut: "Tens + ones → write tens digit then ones digit: 60+9 = 69.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers",
  },
  {
    questionId: "math1_ch11_q4", topicId: "math1_ch11",
    text: "Compare: 55 and 59. Which is GREATER?",
    options: [
      { text: "59",    type: "correct",       logicTag: "same tens, compare ones: 9 > 5" },
      { text: "55",    type: "concept_error", logicTag: "5 < 9 in ones" },
      { text: "Equal", type: "concept_error", logicTag: "55 ≠ 59" },
      { text: "Cannot tell.", type: "concept_error", logicTag: "we can compare using place value" },
    ],
    explanation: "Both have 5 tens. Compare ones: 9 > 5. So 59 > 55.",
    solutionSteps: ["Tens equal (both 5).", "Compare ones: 9 > 5.", "59 > 55."],
    shortcut: "Equal tens → compare ones. Bigger ones = greater number.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers",
  },
  {
    questionId: "math1_ch11_q5", topicId: "math1_ch11",
    text: "Which number has 8 in the TENS place?",
    options: [
      { text: "85",  type: "correct",       logicTag: "85: tens digit = 8" },
      { text: "58",  type: "concept_error", logicTag: "58: ones digit = 8, tens = 5" },
      { text: "18",  type: "concept_error", logicTag: "18: ones digit = 8, tens = 1" },
      { text: "80",  type: "concept_error", logicTag: "80 does have 8 in tens but has 0 ones — less distinctive" },
    ],
    explanation: "In 85: the left digit (8) is in the tens place. 8 tens = 80.",
    solutionSteps: ["Tens place = left digit of two-digit number.", "85: left digit = 8.", "8 is in tens place."],
    shortcut: "LEFT digit = tens place. RIGHT digit = ones place.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers",
  },

  // ── Chapter 12: Money ────────────────────────────────────────────────────
  {
    questionId: "math1_ch12_q1", topicId: "math1_ch12",
    text: "Riya has one 5-rupee coin and one 2-rupee coin. How much money does she have?",
    options: [
      { text: "₹7",  type: "correct",          logicTag: "5 + 2 = 7 rupees" },
      { text: "₹52", type: "concept_error",    logicTag: "wrote as two-digit not added" },
      { text: "₹3",  type: "calculation_error",logicTag: "subtracted instead" },
      { text: "₹10", type: "calculation_error",logicTag: "wrong addition" },
    ],
    explanation: "5 rupees + 2 rupees = 7 rupees.",
    solutionSteps: ["5 + 2 = 7.", "Riya has ₹7."],
    shortcut: "Add coin values together to find total money.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Money",
  },
  {
    questionId: "math1_ch12_q2", topicId: "math1_ch12",
    text: "A toy costs ₹8. Arjun has one 5-rupee coin and one 1-rupee coin. Can he buy the toy?",
    options: [
      { text: "No, he has only ₹6.",  type: "correct",       logicTag: "5+1=6 < 8" },
      { text: "Yes, he has enough.",  type: "concept_error", logicTag: "6 < 8, not enough" },
      { text: "Yes, he has exactly.", type: "concept_error", logicTag: "6 ≠ 8" },
      { text: "He has ₹10.",          type: "calculation_error",logicTag: "added incorrectly" },
    ],
    explanation: "5 + 1 = ₹6. The toy costs ₹8. Since 6 < 8, he cannot buy it.",
    solutionSteps: ["Total: 5 + 1 = 6.", "Price: 8.", "6 < 8 → not enough."],
    shortcut: "Compare total with price. If total < price → not enough.",
    difficulty: "medium", subject: "Mathematics", grade: "1", chapter: "Money",
  },
  {
    questionId: "math1_ch12_q3", topicId: "math1_ch12",
    text: "Which set of coins makes exactly ₹5?",
    options: [
      { text: "One 5-rupee coin.",                 type: "correct",       logicTag: "one ₹5 coin = ₹5" },
      { text: "One 2-rupee coin and one 1-rupee.", type: "concept_error", logicTag: "2+1=3 ≠ 5" },
      { text: "Two 1-rupee coins.",                type: "concept_error", logicTag: "1+1=2 ≠ 5" },
      { text: "One 2-rupee and two 2-rupee.",      type: "concept_error", logicTag: "2+2+2=6 ≠ 5" },
    ],
    explanation: "One 5-rupee coin has value ₹5, which is exactly what is needed.",
    solutionSteps: ["Target: ₹5.", "One ₹5 coin = ₹5 ✓"],
    shortcut: "A single 5-rupee coin always makes exactly ₹5.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Money",
  },
  {
    questionId: "math1_ch12_q4", topicId: "math1_ch12",
    text: "Which has MORE value: a 5-rupee coin or two 2-rupee coins?",
    options: [
      { text: "Two 2-rupee coins (₹4 total) — wait. 5 rupee coin is worth more.", type: "correct", logicTag: "₹5 > ₹4" },
      { text: "The 5-rupee coin (₹5).", type: "correct", logicTag: "₹5 > two ₹2 coins (₹4)" },
      { text: "Two 2-rupee coins (₹4).", type: "concept_error", logicTag: "4 < 5" },
      { text: "They are equal.",         type: "concept_error", logicTag: "5 ≠ 4" },
    ],
    explanation: "One 5-rupee coin = ₹5. Two 2-rupee coins = ₹2 + ₹2 = ₹4. Since 5 > 4, the 5-rupee coin has more value.",
    solutionSteps: ["₹5 coin = ₹5.", "2 × ₹2 = ₹4.", "₹5 > ₹4 → 5-rupee coin has more value."],
    shortcut: "Always calculate the total first before comparing.",
    difficulty: "medium", subject: "Mathematics", grade: "1", chapter: "Money",
  },
  {
    questionId: "math1_ch12_q5", topicId: "math1_ch12",
    text: "A lollipop costs ₹3. You give a ₹5 coin. How much CHANGE do you get?",
    options: [
      { text: "₹2",  type: "correct",          logicTag: "5 − 3 = 2" },
      { text: "₹8",  type: "concept_error",    logicTag: "added instead of subtracted" },
      { text: "₹3",  type: "concept_error",    logicTag: "wrote the price, not change" },
      { text: "₹5",  type: "concept_error",    logicTag: "wrote what was paid, not change" },
    ],
    explanation: "Change = amount paid − cost = 5 − 3 = ₹2.",
    solutionSteps: ["Paid: ₹5. Cost: ₹3.", "Change = 5 − 3 = ₹2."],
    shortcut: "Change = paid − cost. Always subtract the price from what you gave.",
    difficulty: "medium", subject: "Mathematics", grade: "1", chapter: "Money",
  },

  // ── Chapter 13: How Many ─────────────────────────────────────────────────
  {
    questionId: "math1_ch13_q1", topicId: "math1_ch13",
    text: "Group A has 🐕🐕🐕🐕 dogs and Group B has 🦴🦴🦴🦴🦴 bones. Which group has MORE?",
    options: [
      { text: "Group B (5 bones — more than 4 dogs).", type: "correct",       logicTag: "5 > 4" },
      { text: "Group A (4 dogs — more).",              type: "concept_error", logicTag: "4 < 5" },
      { text: "Both are equal.",                        type: "concept_error", logicTag: "4 ≠ 5" },
      { text: "Cannot tell.",                           type: "concept_error", logicTag: "we can count and compare" },
    ],
    explanation: "Group A: 4 dogs. Group B: 5 bones. 5 > 4, so Group B has more.",
    solutionSteps: ["Count A: 4.", "Count B: 5.", "5 > 4 → Group B has more."],
    shortcut: "Count each group, then compare the numbers.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "How Many",
  },
  {
    questionId: "math1_ch13_q2", topicId: "math1_ch13",
    text: "There are 7 cups and 7 saucers. When you match them one-to-one, what happens?",
    options: [
      { text: "Each cup matches exactly one saucer; they are equal in number.", type: "correct",       logicTag: "7 pairs, no leftovers" },
      { text: "There are leftover cups.",                                         type: "concept_error", logicTag: "would need cups > saucers" },
      { text: "There are leftover saucers.",                                      type: "concept_error", logicTag: "would need saucers > cups" },
      { text: "You cannot match them.",                                           type: "concept_error", logicTag: "7 = 7, they match perfectly" },
    ],
    explanation: "7 cups and 7 saucers: pair each cup with a saucer. All 7 pairs match with no leftovers → equal number.",
    solutionSteps: ["Match: cup1↔saucer1, cup2↔saucer2 … cup7↔saucer7.", "No leftovers on either side.", "Equal: 7 = 7."],
    shortcut: "No leftovers after matching = equal number.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "How Many",
  },
  {
    questionId: "math1_ch13_q3", topicId: "math1_ch13",
    text: "Priya counts her crayons by touching each one. She says '1, 2, 3, 3, 4'. What mistake did she make?",
    options: [
      { text: "She said '3' twice — she counted one crayon twice.",  type: "correct",       logicTag: "each object must be counted once" },
      { text: "She counted too fast.",                               type: "concept_error", logicTag: "speed is not the issue described" },
      { text: "She started from the wrong crayon.",                  type: "concept_error", logicTag: "starting point doesn't matter" },
      { text: "She forgot the number 2.",                            type: "concept_error", logicTag: "she said 2 correctly" },
    ],
    explanation: "She said '3' twice — that means she counted the same crayon two times. Each crayon should only be counted ONCE.",
    solutionSteps: ["Correct count: 1, 2, 3, 4, 5 … (each different number once).", "Error: repeated 3 → counted same crayon twice."],
    shortcut: "One count per object. Move each counted item aside to avoid double-counting.",
    difficulty: "medium", subject: "Mathematics", grade: "1", chapter: "How Many",
  },
  {
    questionId: "math1_ch13_q4", topicId: "math1_ch13",
    text: "Which word describes a group with FEWER items?",
    options: [
      { text: "Fewer",  type: "correct",          logicTag: "fewer = less in number" },
      { text: "More",   type: "concept_error",    logicTag: "more = greater in number" },
      { text: "Same",   type: "concept_error",    logicTag: "same = equal" },
      { text: "Bigger", type: "concept_error",    logicTag: "bigger describes size, not number" },
    ],
    explanation: "Fewer means less in number. The group with fewer items has a smaller count.",
    solutionSteps: ["Fewer = smaller number of items.", "More = larger number.", "Same = equal."],
    shortcut: "More > same > fewer.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "How Many",
  },
  {
    questionId: "math1_ch13_q5", topicId: "math1_ch13",
    text: "Set P has 9 objects and Set Q has 6 objects. How many MORE objects does Set P have than Set Q?",
    options: [
      { text: "3",  type: "correct",          logicTag: "9 − 6 = 3" },
      { text: "15", type: "concept_error",    logicTag: "added instead of subtracted" },
      { text: "6",  type: "concept_error",    logicTag: "wrote Set Q count" },
      { text: "2",  type: "calculation_error",logicTag: "miscounted" },
    ],
    explanation: "'How many more' means subtract. 9 − 6 = 3. Set P has 3 more than Set Q.",
    solutionSteps: ["How many more → subtract.", "9 − 6 = 3.", "Set P has 3 more."],
    shortcut: "'How many more' → subtract the smaller from the larger.",
    difficulty: "medium", subject: "Mathematics", grade: "1", chapter: "How Many",
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
  console.log(`\nSeeded ${questions.length} questions for CBSE Class 1 Mathematics (Ch 8–13).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
