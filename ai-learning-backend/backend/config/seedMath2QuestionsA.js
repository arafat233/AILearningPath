/**
 * CBSE Class 2 Mathematics — Questions Seed A (Ch 1–8)
 * 5 questions per chapter = 40 questions total. Safe to re-run.
 * Usage: node config/seedMath2QuestionsA.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const questions = [

  // ── Chapter 1: What is Long, What is Round? ──────────────────────────────
  {
    questionId: "math2_ch1_q1", topicId: "math2_ch1",
    text: "Which of the following objects is ROUND?",
    options: [
      { text: "A cricket ball",    type: "correct",       logicTag: "round objects roll" },
      { text: "A ruler",           type: "concept_error", logicTag: "ruler is long and flat" },
      { text: "A book",            type: "concept_error", logicTag: "book is flat, not round" },
      { text: "A door",            type: "concept_error", logicTag: "door is flat and rectangular" },
    ],
    explanation: "A cricket ball is round — it has a curved surface all around and rolls easily.",
    solutionSteps: ["Ask: does it roll in all directions?", "A ball rolls — it is round.", "A ruler, book, and door are flat — they slide."],
    shortcut: "Round objects roll; flat objects slide.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "What is Long, What is Round?",
  },
  {
    questionId: "math2_ch1_q2", topicId: "math2_ch1",
    text: "A pencil is an example of a _______ object.",
    options: [
      { text: "Long",  type: "correct",          logicTag: "pencil is long relative to width" },
      { text: "Round", type: "concept_error",    logicTag: "pencil is not a sphere" },
      { text: "Heavy", type: "misinterpretation",logicTag: "heavy describes weight not shape" },
      { text: "Short", type: "concept_error",    logicTag: "short is the opposite of long" },
    ],
    explanation: "A pencil is much longer than it is wide, so it is a long object.",
    solutionSteps: ["Compare length to width.", "Pencil: length >> width → it is long."],
    shortcut: "If one dimension is much greater than the other, the object is long.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "What is Long, What is Round?",
  },
  {
    questionId: "math2_ch1_q3", topicId: "math2_ch1",
    text: "Which of these would ROLL down a slope?",
    options: [
      { text: "An orange",      type: "correct",       logicTag: "round objects roll" },
      { text: "A wooden block", type: "concept_error", logicTag: "flat faces do not roll" },
      { text: "A flat stone",   type: "concept_error", logicTag: "flat object slides, not rolls" },
      { text: "A book",         type: "concept_error", logicTag: "book is flat rectangular" },
    ],
    explanation: "An orange is round, so it rolls down a slope. Flat objects slide rather than roll.",
    solutionSteps: ["Round/curved surface → rolls.", "Orange has curved surface all around → rolls."],
    shortcut: "Curved surface = rolling. Flat surface = sliding.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "What is Long, What is Round?",
  },
  {
    questionId: "math2_ch1_q4", topicId: "math2_ch1",
    text: "Which pair shows one LONG object and one ROUND object?",
    options: [
      { text: "A snake and a wheel",      type: "correct",       logicTag: "snake=long, wheel=round" },
      { text: "A book and a chair",       type: "concept_error", logicTag: "both are flat/rectangular" },
      { text: "A ball and a coin",        type: "concept_error", logicTag: "both are round" },
      { text: "A pencil and a ruler",     type: "concept_error", logicTag: "both are long and flat" },
    ],
    explanation: "A snake is long; a wheel is round (circular). One long + one round = correct pair.",
    solutionSteps: ["Snake → long thin object.", "Wheel → circular/round object."],
    shortcut: "Look for one object that is much longer than wide (long) and one that is circular (round).",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "What is Long, What is Round?",
  },
  {
    questionId: "math2_ch1_q5", topicId: "math2_ch1",
    text: "Sita has a coin and a matchstick. Which statement is TRUE?",
    options: [
      { text: "The coin is round; the matchstick is long.",   type: "correct",       logicTag: "coin=round, matchstick=long" },
      { text: "Both are round.",                              type: "concept_error", logicTag: "matchstick is not round" },
      { text: "The coin is long; the matchstick is round.",   type: "concept_error", logicTag: "reversed attributes" },
      { text: "Both are long.",                               type: "concept_error", logicTag: "coin is not long" },
    ],
    explanation: "A coin is a flat circular (round) object. A matchstick is long and thin.",
    solutionSteps: ["Coin: circular → round.", "Matchstick: long thin stick → long."],
    shortcut: "Circular shape = round; one direction much longer = long.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "What is Long, What is Round?",
  },

  // ── Chapter 2: Counting in Groups ────────────────────────────────────────
  {
    questionId: "math2_ch2_q1", topicId: "math2_ch2",
    text: "What comes next when counting by 2s? 2, 4, 6, 8, ___",
    options: [
      { text: "10", type: "correct",          logicTag: "add 2 to 8" },
      { text: "9",  type: "calculation_error",logicTag: "added 1 instead of 2" },
      { text: "12", type: "calculation_error",logicTag: "skipped 10" },
      { text: "11", type: "calculation_error",logicTag: "added 3" },
    ],
    explanation: "The rule is add 2 each time. 8 + 2 = 10.",
    solutionSteps: ["Pattern: add 2.", "8 + 2 = 10."],
    shortcut: "Even numbers: 2, 4, 6, 8, 10, 12 … always add 2.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Counting in Groups",
  },
  {
    questionId: "math2_ch2_q2", topicId: "math2_ch2",
    text: "There are 15 flowers arranged in groups of 5. How many groups are there?",
    options: [
      { text: "3", type: "correct",          logicTag: "15 ÷ 5 = 3 groups" },
      { text: "5", type: "concept_error",    logicTag: "confused groups with flowers per group" },
      { text: "2", type: "calculation_error",logicTag: "forgot one group" },
      { text: "4", type: "calculation_error",logicTag: "overcounted" },
    ],
    explanation: "15 flowers in groups of 5: 1st group (1–5), 2nd group (6–10), 3rd group (11–15). 3 groups.",
    solutionSteps: ["Group 1: 5 flowers.", "Group 2: 5 flowers.", "Group 3: 5 flowers.", "Total groups: 3."],
    shortcut: "Skip count by 5: 5, 10, 15 → three steps = 3 groups.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Counting in Groups",
  },
  {
    questionId: "math2_ch2_q3", topicId: "math2_ch2",
    text: "Count by 10s. What is the missing number? 10, 20, 30, ___, 50",
    options: [
      { text: "40", type: "correct",          logicTag: "30 + 10 = 40" },
      { text: "35", type: "calculation_error",logicTag: "added 5 instead of 10" },
      { text: "45", type: "calculation_error",logicTag: "added 15" },
      { text: "31", type: "calculation_error",logicTag: "added only 1" },
    ],
    explanation: "Counting by 10s: 10, 20, 30, 40, 50. The missing number is 40.",
    solutionSteps: ["Rule: add 10.", "30 + 10 = 40."],
    shortcut: "Tens pattern always ends in 0: 10, 20, 30, 40, 50.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Counting in Groups",
  },
  {
    questionId: "math2_ch2_q4", topicId: "math2_ch2",
    text: "Ravi arranges 20 buttons in pairs (groups of 2). How many pairs does he make?",
    options: [
      { text: "10", type: "correct",          logicTag: "20 ÷ 2 = 10 pairs" },
      { text: "2",  type: "concept_error",    logicTag: "confused group size with number of groups" },
      { text: "20", type: "concept_error",    logicTag: "did not group" },
      { text: "8",  type: "calculation_error",logicTag: "made counting error" },
    ],
    explanation: "Skip count by 2: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 — that is 10 steps, so 10 pairs.",
    solutionSteps: ["Groups of 2 from 20.", "Skip count by 2: 10 steps to reach 20.", "So 10 pairs."],
    shortcut: "Count the steps in the skip-count sequence to find the number of groups.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Counting in Groups",
  },
  {
    questionId: "math2_ch2_q5", topicId: "math2_ch2",
    text: "Which list shows correct skip counting by 5?",
    options: [
      { text: "5, 10, 15, 20, 25",  type: "correct",          logicTag: "each number increases by 5" },
      { text: "5, 10, 14, 20, 25",  type: "calculation_error",logicTag: "14 should be 15" },
      { text: "5, 10, 15, 21, 25",  type: "calculation_error",logicTag: "21 should be 20" },
      { text: "5, 9, 15, 20, 25",   type: "calculation_error",logicTag: "9 should be 10" },
    ],
    explanation: "Counting by 5s: add 5 each time. 5, 10, 15, 20, 25 is correct.",
    solutionSteps: ["5+5=10, 10+5=15, 15+5=20, 20+5=25."],
    shortcut: "Skip-5 numbers always end in 0 or 5.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Counting in Groups",
  },

  // ── Chapter 3: How Much Can You Carry? ───────────────────────────────────
  {
    questionId: "math2_ch3_q1", topicId: "math2_ch3",
    text: "On a balance scale, the side with the apple goes DOWN and the side with the eraser goes UP. What does this mean?",
    options: [
      { text: "The apple is heavier than the eraser.",  type: "correct",       logicTag: "down side is heavier" },
      { text: "The apple is lighter than the eraser.",  type: "concept_error", logicTag: "confused direction" },
      { text: "They weigh the same.",                   type: "concept_error", logicTag: "equal pans would be level" },
      { text: "The eraser is heavier.",                 type: "concept_error", logicTag: "reversed reasoning" },
    ],
    explanation: "On a balance scale, the heavier side goes DOWN. Apple side is down → apple is heavier.",
    solutionSteps: ["Down side = heavier.", "Apple side is down → apple is heavier."],
    shortcut: "Balance scale: down = heavy, up = light.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "How Much Can You Carry?",
  },
  {
    questionId: "math2_ch3_q2", topicId: "math2_ch3",
    text: "Which of these is HEAVIER?",
    options: [
      { text: "A bag of rice",    type: "correct",          logicTag: "rice bag weighs several kilograms" },
      { text: "A feather",        type: "concept_error",    logicTag: "feather is extremely light" },
      { text: "A piece of paper", type: "concept_error",    logicTag: "paper is very light" },
      { text: "A balloon",        type: "concept_error",    logicTag: "balloon is very light" },
    ],
    explanation: "A bag of rice weighs several kilograms — much heavier than a feather, paper, or balloon.",
    solutionSteps: ["Compare objects by their expected weight.", "Rice bag → kilograms.", "Feather/paper/balloon → grams or less."],
    shortcut: "Think: could you carry it in one hand easily? If not, it is heavy.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "How Much Can You Carry?",
  },
  {
    questionId: "math2_ch3_q3", topicId: "math2_ch3",
    text: "Priya says, 'A big cotton pillow is heavier than a small stone.' Is she correct?",
    options: [
      { text: "No, the small stone is heavier.",   type: "correct",       logicTag: "size does not determine weight" },
      { text: "Yes, bigger always means heavier.", type: "concept_error", logicTag: "bigger ≠ heavier" },
      { text: "They always weigh the same.",       type: "concept_error", logicTag: "no reason to be equal" },
      { text: "It depends on the colour.",         type: "misinterpretation", logicTag: "colour does not affect weight" },
    ],
    explanation: "A small stone is much denser than a large cotton pillow. The stone is heavier even though the pillow is bigger.",
    solutionSteps: ["Bigger size ≠ heavier weight.", "Stone is dense → heavy. Pillow is fluffy → light."],
    shortcut: "Compare weight by feel or scale, not by size alone.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "How Much Can You Carry?",
  },
  {
    questionId: "math2_ch3_q4", topicId: "math2_ch3",
    text: "Object A and Object B are placed on a balance scale and the pans are level. What can you say?",
    options: [
      { text: "A and B weigh the same.",       type: "correct",       logicTag: "level pans = equal weight" },
      { text: "A is heavier than B.",          type: "concept_error", logicTag: "heavier would tip scale" },
      { text: "B is lighter than A.",          type: "concept_error", logicTag: "lighter would tip other side" },
      { text: "The scale is broken.",          type: "misinterpretation", logicTag: "level pans is a valid result" },
    ],
    explanation: "When both pans of a balance scale are at the same level, the two objects weigh exactly the same.",
    solutionSteps: ["Level pans → equal weight.", "A = B in weight."],
    shortcut: "Level balance = equal weight.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "How Much Can You Carry?",
  },
  {
    questionId: "math2_ch3_q5", topicId: "math2_ch3",
    text: "Arrange from lightest to heaviest: a leaf, a brick, a mug of water.",
    options: [
      { text: "Leaf → mug of water → brick",    type: "correct",       logicTag: "correct weight order" },
      { text: "Brick → mug → leaf",             type: "concept_error", logicTag: "reversed order" },
      { text: "Mug → leaf → brick",             type: "concept_error", logicTag: "wrong middle item" },
      { text: "Leaf → brick → mug",             type: "concept_error", logicTag: "brick is heavier than mug" },
    ],
    explanation: "Leaf is lightest. A full mug of water is moderate. A brick is heaviest.",
    solutionSteps: ["Leaf: nearly weightless.", "Mug of water: about 250–500 g.", "Brick: about 3–5 kg.", "Order: leaf < mug < brick."],
    shortcut: "Use real-world knowledge to rank: leaves are lightest, bricks are very heavy.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "How Much Can You Carry?",
  },

  // ── Chapter 4: Counting in Tens ──────────────────────────────────────────
  {
    questionId: "math2_ch4_q1", topicId: "math2_ch4",
    text: "How many tens are in 60?",
    options: [
      { text: "6",  type: "correct",          logicTag: "60 = 6 × 10" },
      { text: "60", type: "concept_error",    logicTag: "confused total with tens count" },
      { text: "10", type: "concept_error",    logicTag: "10 is the unit size, not the count" },
      { text: "0",  type: "concept_error",    logicTag: "ignoring the tens digit" },
    ],
    explanation: "60 = 6 × 10, so there are 6 tens in 60.",
    solutionSteps: ["60 ÷ 10 = 6.", "Or count: 10, 20, 30, 40, 50, 60 → 6 steps."],
    shortcut: "The tens digit directly tells you how many tens: tens digit of 60 is 6.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Counting in Tens",
  },
  {
    questionId: "math2_ch4_q2", topicId: "math2_ch4",
    text: "What is the tens digit of the number 47?",
    options: [
      { text: "4",  type: "correct",          logicTag: "4 is in tens place" },
      { text: "7",  type: "concept_error",    logicTag: "7 is in ones place" },
      { text: "47", type: "concept_error",    logicTag: "whole number not one digit" },
      { text: "11", type: "calculation_error",logicTag: "added the digits" },
    ],
    explanation: "In 47, the digit 4 is in the tens place; it represents 40. The digit 7 is in the ones place.",
    solutionSteps: ["47: tens place = 4, ones place = 7.", "Tens digit = 4."],
    shortcut: "Left digit of a two-digit number = tens digit.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Counting in Tens",
  },
  {
    questionId: "math2_ch4_q3", topicId: "math2_ch4",
    text: "Meena has 3 bundles of 10 sticks and 5 loose sticks. How many sticks does she have in total?",
    options: [
      { text: "35", type: "correct",          logicTag: "3 tens + 5 ones = 35" },
      { text: "30", type: "calculation_error",logicTag: "ignored loose sticks" },
      { text: "53", type: "concept_error",    logicTag: "reversed tens and ones" },
      { text: "15", type: "calculation_error",logicTag: "added bundle count to sticks: 3+5+7 error" },
    ],
    explanation: "3 bundles of 10 = 30 sticks. Plus 5 loose sticks = 35 sticks total.",
    solutionSteps: ["3 × 10 = 30.", "30 + 5 = 35."],
    shortcut: "Tens + ones = two-digit number: 3 tens = 30; 30 + 5 = 35.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Counting in Tens",
  },
  {
    questionId: "math2_ch4_q4", topicId: "math2_ch4",
    text: "Which number has 5 tens and 2 ones?",
    options: [
      { text: "52", type: "correct",          logicTag: "5 tens = 50, + 2 ones = 52" },
      { text: "25", type: "concept_error",    logicTag: "swapped digits" },
      { text: "50", type: "calculation_error",logicTag: "forgot the ones" },
      { text: "57", type: "calculation_error",logicTag: "wrong ones digit" },
    ],
    explanation: "5 tens = 50; 2 ones = 2; 50 + 2 = 52.",
    solutionSteps: ["5 tens → 50.", "2 ones → 2.", "50 + 2 = 52."],
    shortcut: "Tens digit first, ones digit second: 5 tens 2 ones → 52.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Counting in Tens",
  },
  {
    questionId: "math2_ch4_q5", topicId: "math2_ch4",
    text: "Count by 10s: 40, 50, 60, ___",
    options: [
      { text: "70", type: "correct",          logicTag: "60 + 10 = 70" },
      { text: "65", type: "calculation_error",logicTag: "added 5 instead of 10" },
      { text: "61", type: "calculation_error",logicTag: "added 1" },
      { text: "100",type: "calculation_error",logicTag: "jumped too far" },
    ],
    explanation: "Skip counting by 10: 40, 50, 60, 70. Next is 70.",
    solutionSteps: ["60 + 10 = 70."],
    shortcut: "Adding 10 changes only the tens digit: 6 → 7.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Counting in Tens",
  },

  // ── Chapter 5: Patterns ──────────────────────────────────────────────────
  {
    questionId: "math2_ch5_q1", topicId: "math2_ch5",
    text: "What comes next? Red, Blue, Red, Blue, Red, ___",
    options: [
      { text: "Blue",   type: "correct",       logicTag: "ABAB pattern, next is B" },
      { text: "Red",    type: "concept_error", logicTag: "repeating A again breaks pattern" },
      { text: "Green",  type: "concept_error", logicTag: "green not in pattern" },
      { text: "Yellow", type: "concept_error", logicTag: "yellow not in pattern" },
    ],
    explanation: "The pattern is Red, Blue repeating (ABAB). After Red comes Blue.",
    solutionSteps: ["Repeating unit: Red, Blue.", "Position 5 = Red, position 6 = Blue."],
    shortcut: "Odd positions = A (Red), even positions = B (Blue).",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Patterns",
  },
  {
    questionId: "math2_ch5_q2", topicId: "math2_ch5",
    text: "What is the missing number? 5, 10, ___, 20, 25",
    options: [
      { text: "15", type: "correct",          logicTag: "skip by 5: 10+5=15" },
      { text: "12", type: "calculation_error",logicTag: "not a multiple of 5" },
      { text: "16", type: "calculation_error",logicTag: "added 6" },
      { text: "18", type: "calculation_error",logicTag: "added 8" },
    ],
    explanation: "The pattern is skip counting by 5. 10 + 5 = 15.",
    solutionSteps: ["Rule: add 5 each time.", "10 + 5 = 15."],
    shortcut: "All numbers in this pattern end in 0 or 5: 15 fits.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Patterns",
  },
  {
    questionId: "math2_ch5_q3", topicId: "math2_ch5",
    text: "Circle, Square, Triangle, Circle, Square, Triangle, Circle, ___",
    options: [
      { text: "Square",   type: "correct",       logicTag: "ABC pattern, 7th item is 2nd in unit = Square" },
      { text: "Circle",   type: "concept_error", logicTag: "circle is 1st in unit" },
      { text: "Triangle", type: "concept_error", logicTag: "triangle is 3rd in unit" },
      { text: "Rectangle",type: "concept_error", logicTag: "rectangle not in pattern" },
    ],
    explanation: "Repeating unit: Circle, Square, Triangle. The 7th item: 7 ÷ 3 = 2 remainder 1 → 1st item of unit = Circle? Wait: positions 1=C, 2=Sq, 3=Tr, 4=C, 5=Sq, 6=Tr, 7=C, 8=Sq. After Circle (7th), next (8th) is Square.",
    solutionSteps: ["Unit: Circle, Square, Triangle.", "Item 8: position in unit = 8 mod 3 = 2 → Square."],
    shortcut: "Divide position by unit length; remainder tells you which item in the unit.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Patterns",
  },
  {
    questionId: "math2_ch5_q4", topicId: "math2_ch5",
    text: "What is the rule for this number pattern? 3, 6, 9, 12, 15",
    options: [
      { text: "Add 3 each time",  type: "correct",          logicTag: "difference between terms is 3" },
      { text: "Add 2 each time",  type: "calculation_error",logicTag: "wrong difference" },
      { text: "Multiply by 2",    type: "concept_error",    logicTag: "3×2=6 but 6×2=12≠9" },
      { text: "Subtract 3",       type: "concept_error",    logicTag: "sequence is increasing" },
    ],
    explanation: "6−3=3, 9−6=3, 12−9=3, 15−12=3. The rule is add 3 each time.",
    solutionSteps: ["Find the difference: 6−3=3.", "Check: 3+3=6, 6+3=9, 9+3=12 ✓"],
    shortcut: "Subtract consecutive terms to find the rule.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Patterns",
  },
  {
    questionId: "math2_ch5_q5", topicId: "math2_ch5",
    text: "Create a pattern using the rule 'add 4'. Starting from 2, what are the first 4 numbers?",
    options: [
      { text: "2, 6, 10, 14",  type: "correct",          logicTag: "2+4=6, 6+4=10, 10+4=14" },
      { text: "2, 4, 8, 12",   type: "calculation_error",logicTag: "added 2 then doubled" },
      { text: "2, 5, 9, 13",   type: "calculation_error",logicTag: "added 3 instead of 4" },
      { text: "2, 6, 10, 15",  type: "calculation_error",logicTag: "last step error: 10+5=15" },
    ],
    explanation: "Start at 2, add 4 each time: 2, 2+4=6, 6+4=10, 10+4=14.",
    solutionSteps: ["2+4=6.", "6+4=10.", "10+4=14."],
    shortcut: "Apply the rule consistently: each new number = previous + 4.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Patterns",
  },

  // ── Chapter 6: Footprints ────────────────────────────────────────────────
  {
    questionId: "math2_ch6_q1", topicId: "math2_ch6",
    text: "Raju measures a table with his handspan and gets 8. Priya measures the same table with her bigger handspan and gets 6. Why are the numbers different?",
    options: [
      { text: "Because they used different sized units.",   type: "correct",       logicTag: "non-standard units vary by person" },
      { text: "Because the table changed size.",            type: "concept_error", logicTag: "the table is the same" },
      { text: "Because one of them cannot count.",         type: "misinterpretation",logicTag: "irrelevant" },
      { text: "Because Raju is shorter than Priya.",       type: "concept_error", logicTag: "height not relevant here" },
    ],
    explanation: "Raju's smaller handspan fits more times (8); Priya's bigger handspan fits fewer times (6). Bigger unit → smaller count.",
    solutionSteps: ["Same table, different unit sizes.", "Bigger unit → fewer counts.", "This shows we need a STANDARD unit."],
    shortcut: "Bigger non-standard unit → smaller number count. Smaller unit → larger number count.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Footprints",
  },
  {
    questionId: "math2_ch6_q2", topicId: "math2_ch6",
    text: "Anu measures a book using a pencil. She places the pencil 4 times. What is the length of the book?",
    options: [
      { text: "4 pencils long",   type: "correct",       logicTag: "length = 4 pencil units" },
      { text: "1 pencil long",    type: "concept_error", logicTag: "confused unit with count" },
      { text: "40 cm",            type: "concept_error", logicTag: "cm is a standard unit not used here" },
      { text: "8 pencils long",   type: "calculation_error",logicTag: "doubled the count" },
    ],
    explanation: "The book is 4 pencils long because she placed the pencil 4 times end to end.",
    solutionSteps: ["Non-standard unit = pencil.", "Count = 4.", "Length = 4 pencils."],
    shortcut: "Length = number of times the unit fits.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Footprints",
  },
  {
    questionId: "math2_ch6_q3", topicId: "math2_ch6",
    text: "Which object is LONGER: one that is 9 handspans long or one that is 6 handspans long? (Same person measuring.)",
    options: [
      { text: "The one that is 9 handspans long.",  type: "correct",       logicTag: "more units = longer" },
      { text: "The one that is 6 handspans long.",  type: "concept_error", logicTag: "fewer units = shorter" },
      { text: "They are the same length.",          type: "concept_error", logicTag: "9 ≠ 6" },
      { text: "Cannot compare without a ruler.",    type: "concept_error", logicTag: "same unit = comparable" },
    ],
    explanation: "When the same person uses the same unit, a larger count means a longer object. 9 > 6, so 9-handspan object is longer.",
    solutionSteps: ["Same person, same unit → counts are directly comparable.", "9 > 6 → 9-handspan object is longer."],
    shortcut: "When unit is the same: bigger count = longer object.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Footprints",
  },
  {
    questionId: "math2_ch6_q4", topicId: "math2_ch6",
    text: "What is the correct way to place a non-standard unit when measuring length?",
    options: [
      { text: "End to end with no gaps or overlaps.",  type: "correct",       logicTag: "correct measurement technique" },
      { text: "With a small gap between each unit.",   type: "concept_error", logicTag: "gaps give wrong count" },
      { text: "Overlapping each unit slightly.",       type: "concept_error", logicTag: "overlaps give wrong count" },
      { text: "Placing units side by side (parallel).",type: "concept_error", logicTag: "must be end to end" },
    ],
    explanation: "Units must be placed end to end with no gaps and no overlaps to get an accurate measurement.",
    solutionSteps: ["Place unit from start to end of first length.", "Next unit starts exactly where the previous ended.", "No gap, no overlap."],
    shortcut: "Think of placing identical tiles: they must fit perfectly edge-to-edge.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Footprints",
  },
  {
    questionId: "math2_ch6_q5", topicId: "math2_ch6",
    text: "Leena's desk is 5 pencils long. Her friend's desk is 7 pencils long. Whose desk is shorter?",
    options: [
      { text: "Leena's desk (5 pencils).",   type: "correct",       logicTag: "5 < 7" },
      { text: "Her friend's desk (7 pencils).",type: "concept_error",logicTag: "7 > 5, so it is longer" },
      { text: "Both are the same length.",   type: "concept_error", logicTag: "5 ≠ 7" },
      { text: "Cannot tell without a ruler.",type: "concept_error", logicTag: "same unit used → comparable" },
    ],
    explanation: "5 pencils < 7 pencils, so Leena's desk is shorter.",
    solutionSteps: ["Same pencil unit used.", "5 < 7.", "Leena's desk is shorter."],
    shortcut: "Fewer units = shorter, when the same unit is used.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Footprints",
  },

  // ── Chapter 7: Jugs and Mugs ─────────────────────────────────────────────
  {
    questionId: "math2_ch7_q1", topicId: "math2_ch7",
    text: "You pour water from a full mug into a bottle. The bottle is still not full. What does this tell you?",
    options: [
      { text: "The bottle holds more than the mug.",   type: "correct",       logicTag: "bottle not full after full mug" },
      { text: "The mug holds more than the bottle.",   type: "concept_error", logicTag: "mug was full but bottle not → bottle is bigger" },
      { text: "They hold the same amount.",            type: "concept_error", logicTag: "would need to fill exactly" },
      { text: "The water disappeared.",                type: "concept_error", logicTag: "conservation of volume" },
    ],
    explanation: "The full mug's water did not fill the bottle → the bottle can hold more than the mug.",
    solutionSteps: ["Mug full → poured into bottle.", "Bottle not full.", "Bottle capacity > mug capacity."],
    shortcut: "If pouring a full container into another doesn't fill it, the second is bigger.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Jugs and Mugs",
  },
  {
    questionId: "math2_ch7_q2", topicId: "math2_ch7",
    text: "A glass holds 2 cupfuls of water. A bowl holds 5 cupfuls. Which holds more?",
    options: [
      { text: "The bowl (5 cupfuls).",    type: "correct",       logicTag: "5 > 2" },
      { text: "The glass (2 cupfuls).",   type: "concept_error", logicTag: "2 < 5" },
      { text: "They hold the same.",      type: "concept_error", logicTag: "2 ≠ 5" },
      { text: "The cup holds the most.",  type: "concept_error", logicTag: "cup is the unit, not compared" },
    ],
    explanation: "5 cupfuls > 2 cupfuls, so the bowl holds more water than the glass.",
    solutionSteps: ["Compare: 5 cupfuls vs 2 cupfuls.", "5 > 2 → bowl holds more."],
    shortcut: "When using the same unit (cup), bigger count = more capacity.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Jugs and Mugs",
  },
  {
    questionId: "math2_ch7_q3", topicId: "math2_ch7",
    text: "Which word describes a container that has water up to its brim?",
    options: [
      { text: "Full",        type: "correct",       logicTag: "full = at capacity" },
      { text: "Empty",       type: "concept_error", logicTag: "empty has no water" },
      { text: "Half-full",   type: "concept_error", logicTag: "half-full = 50% capacity" },
      { text: "Overflowing", type: "concept_error", logicTag: "overflowing has water spilling out" },
    ],
    explanation: "A container filled exactly to the brim is described as FULL.",
    solutionSteps: ["Brim = top edge of the container.", "Water up to brim = full."],
    shortcut: "Full = no more can fit in without spilling.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Jugs and Mugs",
  },
  {
    questionId: "math2_ch7_q4", topicId: "math2_ch7",
    text: "Arrange these from LEAST to MOST capacity: a teaspoon, a bucket, a glass.",
    options: [
      { text: "Teaspoon → Glass → Bucket",  type: "correct",       logicTag: "correct size order" },
      { text: "Bucket → Glass → Teaspoon",  type: "concept_error", logicTag: "most to least, not least to most" },
      { text: "Glass → Teaspoon → Bucket",  type: "concept_error", logicTag: "glass is bigger than teaspoon" },
      { text: "Teaspoon → Bucket → Glass",  type: "concept_error", logicTag: "glass is smaller than bucket" },
    ],
    explanation: "Teaspoon (5 mL) < Glass (~250 mL) < Bucket (~10 L). Order: teaspoon, glass, bucket.",
    solutionSteps: ["Teaspoon is smallest.", "Glass is medium.", "Bucket is largest."],
    shortcut: "Think about real-life: how much water would each hold?",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Jugs and Mugs",
  },
  {
    questionId: "math2_ch7_q5", topicId: "math2_ch7",
    text: "A tall thin bottle and a short wide jug both hold exactly 3 cupfuls. What is TRUE?",
    options: [
      { text: "They have the same capacity.",               type: "correct",       logicTag: "same number of cupfuls = same capacity" },
      { text: "The tall bottle holds more.",                type: "concept_error", logicTag: "taller ≠ more capacity" },
      { text: "The short jug holds more.",                  type: "concept_error", logicTag: "shorter ≠ less capacity" },
      { text: "You cannot compare them without a ruler.",   type: "concept_error", logicTag: "cupful comparison is valid" },
    ],
    explanation: "Both hold 3 cupfuls → they have the same capacity, even though they look different.",
    solutionSteps: ["Both = 3 cupfuls.", "Same number of same unit → same capacity."],
    shortcut: "Capacity depends on how much fits in, not on the shape or height of the container.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Jugs and Mugs",
  },

  // ── Chapter 8: Tens and Ones ─────────────────────────────────────────────
  {
    questionId: "math2_ch8_q1", topicId: "math2_ch8",
    text: "What is the expanded form of 74?",
    options: [
      { text: "70 + 4",  type: "correct",          logicTag: "7 tens = 70, 4 ones = 4" },
      { text: "7 + 4",   type: "concept_error",    logicTag: "ignored place value" },
      { text: "40 + 7",  type: "concept_error",    logicTag: "swapped digits" },
      { text: "700 + 4", type: "concept_error",    logicTag: "7 is not in hundreds place" },
    ],
    explanation: "74: tens digit 7 = 70; ones digit 4 = 4. Expanded form: 70 + 4.",
    solutionSteps: ["Tens digit: 7 → 7 × 10 = 70.", "Ones digit: 4 → 4.", "Expanded: 70 + 4."],
    shortcut: "Two-digit number AB = A0 + B.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Tens and Ones",
  },
  {
    questionId: "math2_ch8_q2", topicId: "math2_ch8",
    text: "Which number is GREATER: 58 or 85?",
    options: [
      { text: "85",    type: "correct",       logicTag: "tens digit 8 > 5" },
      { text: "58",    type: "concept_error", logicTag: "tens digit 5 < 8" },
      { text: "Equal", type: "concept_error", logicTag: "58 ≠ 85" },
      { text: "Cannot tell from digits alone.", type: "concept_error", logicTag: "we can compare using place value" },
    ],
    explanation: "Compare tens digits first: 8 > 5, so 85 > 58.",
    solutionSteps: ["Tens of 85 = 8.", "Tens of 58 = 5.", "8 > 5 → 85 > 58."],
    shortcut: "For two-digit numbers, compare tens digits first. Larger tens → larger number.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Tens and Ones",
  },
  {
    questionId: "math2_ch8_q3", topicId: "math2_ch8",
    text: "What number is 20 + 9?",
    options: [
      { text: "29",  type: "correct",          logicTag: "2 tens + 9 ones = 29" },
      { text: "209", type: "concept_error",    logicTag: "wrote as three-digit" },
      { text: "92",  type: "concept_error",    logicTag: "swapped digits" },
      { text: "29 cannot exist.", type: "concept_error", logicTag: "29 is a valid two-digit number" },
    ],
    explanation: "20 + 9: 20 means 2 tens, plus 9 ones = twenty-nine = 29.",
    solutionSteps: ["20 = 2 tens.", "9 = 9 ones.", "Combined: 29."],
    shortcut: "Tens + ones → just write tens digit then ones digit.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Tens and Ones",
  },
  {
    questionId: "math2_ch8_q4", topicId: "math2_ch8",
    text: "Arrange from smallest to largest: 91, 19, 59",
    options: [
      { text: "19, 59, 91",   type: "correct",       logicTag: "1 < 5 < 9 in tens place" },
      { text: "91, 59, 19",   type: "concept_error", logicTag: "largest to smallest" },
      { text: "19, 91, 59",   type: "concept_error", logicTag: "wrong middle number" },
      { text: "59, 19, 91",   type: "concept_error", logicTag: "unsorted" },
    ],
    explanation: "Compare tens: 1 (in 19) < 5 (in 59) < 9 (in 91). Order: 19 < 59 < 91.",
    solutionSteps: ["Tens digits: 19→1, 59→5, 91→9.", "Order: 1 < 5 < 9 → 19, 59, 91."],
    shortcut: "Sort by tens digit first; if equal, sort by ones digit.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Tens and Ones",
  },
  {
    questionId: "math2_ch8_q5", topicId: "math2_ch8",
    text: "A number has 6 in the ones place and 3 in the tens place. What is the number?",
    options: [
      { text: "36",  type: "correct",       logicTag: "3 tens + 6 ones = 36" },
      { text: "63",  type: "concept_error", logicTag: "swapped position of digits" },
      { text: "360", type: "concept_error", logicTag: "three-digit number" },
      { text: "9",   type: "calculation_error",logicTag: "added digits 3+6" },
    ],
    explanation: "Tens digit = 3, ones digit = 6 → the number is 36.",
    solutionSteps: ["Tens place: 3.", "Ones place: 6.", "Number: 36."],
    shortcut: "Write tens digit on the left, ones digit on the right.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Tens and Ones",
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
  console.log(`\nSeeded ${questions.length} questions for CBSE Class 2 Mathematics (Ch 1–8).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
