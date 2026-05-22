/**
 * CBSE Class 1 Mathematics — Questions Seed A (Ch 1–7)
 * 5 questions per chapter = 35 questions total. Safe to re-run.
 * Usage: node config/seedMath1QuestionsA.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const questions = [

  // ── Chapter 1: Shapes and Space ──────────────────────────────────────────
  {
    questionId: "math1_ch1_q1", topicId: "math1_ch1",
    text: "Which shape has NO corners?",
    options: [
      { text: "Circle",    type: "correct",       logicTag: "circle has no corners, only curved edge" },
      { text: "Triangle",  type: "concept_error", logicTag: "triangle has 3 corners" },
      { text: "Square",    type: "concept_error", logicTag: "square has 4 corners" },
      { text: "Rectangle", type: "concept_error", logicTag: "rectangle has 4 corners" },
    ],
    explanation: "A circle has no corners at all — its edge is perfectly round.",
    solutionSteps: ["Count corners: circle=0, triangle=3, square=4, rectangle=4.", "0 corners = circle."],
    shortcut: "No corners = circle. Round edge all the way around.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Shapes and Space",
  },
  {
    questionId: "math1_ch1_q2", topicId: "math1_ch1",
    text: "How many corners does a triangle have?",
    options: [
      { text: "3", type: "correct",          logicTag: "triangle has 3 corners" },
      { text: "4", type: "concept_error",    logicTag: "4 corners means square or rectangle" },
      { text: "2", type: "concept_error",    logicTag: "no common shape has exactly 2 corners" },
      { text: "0", type: "concept_error",    logicTag: "0 corners means circle" },
    ],
    explanation: "A triangle has 3 sides and 3 corners (where the sides meet).",
    solutionSteps: ["Tri = 3 in many languages.", "Triangle: 3 sides, 3 corners."],
    shortcut: "Tri- = 3. Triangle = 3 corners.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Shapes and Space",
  },
  {
    questionId: "math1_ch1_q3", topicId: "math1_ch1",
    text: "The ball is INSIDE the box. A moment later it is OUTSIDE the box. What happened?",
    options: [
      { text: "The ball was taken out of the box.",     type: "correct",       logicTag: "inside→outside means removed" },
      { text: "The ball got bigger.",                   type: "concept_error", logicTag: "size change is unrelated" },
      { text: "The box disappeared.",                   type: "concept_error", logicTag: "box is still there" },
      { text: "The ball went higher.",                  type: "concept_error", logicTag: "higher describes above, not outside" },
    ],
    explanation: "If the ball moves from INSIDE to OUTSIDE, it was removed from the box.",
    solutionSteps: ["Inside = within the box.", "Outside = not in the box.", "Change: someone took it out."],
    shortcut: "Inside ↔ outside: one is in, the other is not.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Shapes and Space",
  },
  {
    questionId: "math1_ch1_q4", topicId: "math1_ch1",
    text: "A bird is sitting on top of a tree. Is the bird ABOVE or BELOW the tree?",
    options: [
      { text: "Above",   type: "correct",       logicTag: "on top of = above" },
      { text: "Below",   type: "concept_error", logicTag: "below means lower than" },
      { text: "Inside",  type: "concept_error", logicTag: "inside means within" },
      { text: "Outside", type: "concept_error", logicTag: "outside is unrelated to height" },
    ],
    explanation: "On top of the tree means the bird is ABOVE the tree.",
    solutionSteps: ["Above = higher than.", "Bird is on top → above the tree."],
    shortcut: "On top = above. Underneath = below.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Shapes and Space",
  },
  {
    questionId: "math1_ch1_q5", topicId: "math1_ch1",
    text: "Which shape has 4 equal sides and 4 corners?",
    options: [
      { text: "Square",    type: "correct",       logicTag: "square has 4 equal sides" },
      { text: "Rectangle", type: "concept_error", logicTag: "rectangle has 2 pairs of equal sides, not all 4 equal" },
      { text: "Triangle",  type: "concept_error", logicTag: "triangle has 3 sides" },
      { text: "Circle",    type: "concept_error", logicTag: "circle has no sides" },
    ],
    explanation: "A square has 4 corners AND all 4 sides are the same length.",
    solutionSteps: ["4 corners: square and rectangle.", "All sides equal: only square.", "Answer: square."],
    shortcut: "Square = 4 equal sides. Rectangle = 4 sides but 2 are longer.",
    difficulty: "medium", subject: "Mathematics", grade: "1", chapter: "Shapes and Space",
  },

  // ── Chapter 2: Numbers from One to Nine ──────────────────────────────────
  {
    questionId: "math1_ch2_q1", topicId: "math1_ch2",
    text: "How many stars are there? ★ ★ ★ ★ ★ ★",
    options: [
      { text: "6", type: "correct",          logicTag: "6 stars in total" },
      { text: "5", type: "calculation_error",logicTag: "undercounted by 1" },
      { text: "7", type: "calculation_error",logicTag: "overcounted by 1" },
      { text: "4", type: "calculation_error",logicTag: "counted only some" },
    ],
    explanation: "Count each star: 1, 2, 3, 4, 5, 6. There are 6 stars.",
    solutionSteps: ["Point to each star and count.", "1-2-3-4-5-6.", "Total: 6."],
    shortcut: "Touch each item once while counting aloud.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers from One to Nine",
  },
  {
    questionId: "math1_ch2_q2", topicId: "math1_ch2",
    text: "Which number comes AFTER 7?",
    options: [
      { text: "8", type: "correct",          logicTag: "7 + 1 = 8" },
      { text: "6", type: "concept_error",    logicTag: "6 comes before 7" },
      { text: "9", type: "concept_error",    logicTag: "9 comes after 8, not directly after 7" },
      { text: "5", type: "concept_error",    logicTag: "5 is two before 7" },
    ],
    explanation: "Counting in order: … 6, 7, 8, 9. The number right after 7 is 8.",
    solutionSteps: ["Count: 1, 2, 3, 4, 5, 6, 7, 8 …", "After 7 comes 8."],
    shortcut: "After = +1. After 7 → 7+1 = 8.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers from One to Nine",
  },
  {
    questionId: "math1_ch2_q3", topicId: "math1_ch2",
    text: "An empty plate has HOW MANY apples?",
    options: [
      { text: "0", type: "correct",          logicTag: "empty means zero" },
      { text: "1", type: "concept_error",    logicTag: "1 would mean one apple is there" },
      { text: "2", type: "concept_error",    logicTag: "2 would mean two apples" },
      { text: "9", type: "concept_error",    logicTag: "9 would be many apples" },
    ],
    explanation: "Empty means NOTHING is there. Zero (0) is the number for none.",
    solutionSteps: ["Empty plate = no apples.", "No apples = 0."],
    shortcut: "Empty = 0 = nothing = none.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers from One to Nine",
  },
  {
    questionId: "math1_ch2_q4", topicId: "math1_ch2",
    text: "Which number is GREATER: 4 or 7?",
    options: [
      { text: "7",        type: "correct",       logicTag: "7 > 4 in counting order" },
      { text: "4",        type: "concept_error", logicTag: "4 < 7" },
      { text: "They are equal.", type: "concept_error", logicTag: "4 ≠ 7" },
      { text: "Cannot tell.",    type: "concept_error", logicTag: "we can compare single-digit numbers" },
    ],
    explanation: "In counting order, 7 comes after 4. A later number is greater. 7 > 4.",
    solutionSteps: ["Count: 1, 2, 3, 4, 5, 6, 7 …", "7 comes after 4 → 7 is greater."],
    shortcut: "The number that comes LATER when counting is GREATER.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers from One to Nine",
  },
  {
    questionId: "math1_ch2_q5", topicId: "math1_ch2",
    text: "What is the number just BEFORE 5?",
    options: [
      { text: "4", type: "correct",          logicTag: "4 is just before 5" },
      { text: "6", type: "concept_error",    logicTag: "6 comes after 5" },
      { text: "3", type: "concept_error",    logicTag: "3 is two before 5" },
      { text: "5", type: "concept_error",    logicTag: "5 is the number itself" },
    ],
    explanation: "Just before means 1 less. 5 − 1 = 4. The number just before 5 is 4.",
    solutionSteps: ["Just before = −1.", "5 − 1 = 4."],
    shortcut: "Before = −1. Before 5 → 4.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers from One to Nine",
  },

  // ── Chapter 3: Addition ──────────────────────────────────────────────────
  {
    questionId: "math1_ch3_q1", topicId: "math1_ch3",
    text: "2 + 3 = ?",
    options: [
      { text: "5", type: "correct",          logicTag: "2 + 3 = 5" },
      { text: "4", type: "calculation_error",logicTag: "counted on only 2 instead of 3" },
      { text: "6", type: "calculation_error",logicTag: "counted one extra" },
      { text: "1", type: "concept_error",    logicTag: "subtracted instead of added" },
    ],
    explanation: "Count 2 and then 3 more: 1, 2 … 3, 4, 5. Answer: 5.",
    solutionSteps: ["Start at 2.", "Count on 3 more: 3, 4, 5.", "2 + 3 = 5."],
    shortcut: "Start at the bigger number (3), count on 2: 4, 5. Answer: 5.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Addition",
  },
  {
    questionId: "math1_ch3_q2", topicId: "math1_ch3",
    text: "There are 4 red flowers and 3 yellow flowers. How many flowers are there altogether?",
    options: [
      { text: "7", type: "correct",          logicTag: "4 + 3 = 7" },
      { text: "1", type: "concept_error",    logicTag: "subtracted instead of added" },
      { text: "8", type: "calculation_error",logicTag: "counted one extra" },
      { text: "6", type: "calculation_error",logicTag: "undercounted" },
    ],
    explanation: "'Altogether' means add. 4 + 3 = 7 flowers.",
    solutionSteps: ["Altogether → add.", "4 + 3: start at 4, count on 3: 5, 6, 7.", "7 flowers."],
    shortcut: "Altogether, total, in all → add.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Addition",
  },
  {
    questionId: "math1_ch3_q3", topicId: "math1_ch3",
    text: "What is 5 + 0?",
    options: [
      { text: "5", type: "correct",          logicTag: "adding 0 does not change the number" },
      { text: "0", type: "concept_error",    logicTag: "0 would mean everything disappeared" },
      { text: "6", type: "calculation_error",logicTag: "added 1 instead of 0" },
      { text: "1", type: "concept_error",    logicTag: "confused 0 with 1" },
    ],
    explanation: "Adding zero means adding nothing. 5 + 0 = 5.",
    solutionSteps: ["0 means nothing to add.", "5 + 0 = 5."],
    shortcut: "Any number + 0 = that same number.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Addition",
  },
  {
    questionId: "math1_ch3_q4", topicId: "math1_ch3",
    text: "Which addition sentence matches this picture? 🐱🐱🐱 + 🐱🐱 = ?",
    options: [
      { text: "3 + 2 = 5",  type: "correct",       logicTag: "3 cats + 2 cats = 5 cats" },
      { text: "2 + 3 = 6",  type: "calculation_error",logicTag: "wrong answer" },
      { text: "5 − 2 = 3",  type: "concept_error",  logicTag: "subtraction not addition" },
      { text: "3 + 3 = 6",  type: "concept_error",  logicTag: "wrong second group size" },
    ],
    explanation: "First group has 3 cats, second group has 2 cats. 3 + 2 = 5.",
    solutionSteps: ["Count first group: 3.", "Count second group: 2.", "3 + 2 = 5."],
    shortcut: "Count each group, write the addition sentence, then add.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Addition",
  },
  {
    questionId: "math1_ch3_q5", topicId: "math1_ch3",
    text: "1 + 1 + 1 = ?",
    options: [
      { text: "3", type: "correct",          logicTag: "1+1+1 = 3" },
      { text: "2", type: "calculation_error",logicTag: "added only two 1s" },
      { text: "4", type: "calculation_error",logicTag: "counted one extra" },
      { text: "1", type: "concept_error",    logicTag: "ignored the addition" },
    ],
    explanation: "1 + 1 = 2, then 2 + 1 = 3. Or count three 1s: 1, 2, 3.",
    solutionSteps: ["1+1=2.", "2+1=3.", "Answer: 3."],
    shortcut: "Three ones = 3.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Addition",
  },

  // ── Chapter 4: Subtraction ───────────────────────────────────────────────
  {
    questionId: "math1_ch4_q1", topicId: "math1_ch4",
    text: "5 − 2 = ?",
    options: [
      { text: "3", type: "correct",          logicTag: "5 − 2 = 3" },
      { text: "7", type: "concept_error",    logicTag: "added instead of subtracted" },
      { text: "2", type: "concept_error",    logicTag: "wrote the number subtracted" },
      { text: "4", type: "calculation_error",logicTag: "counted back only 1" },
    ],
    explanation: "Start at 5, count back 2: 4, 3. Answer: 3.",
    solutionSteps: ["Start at 5.", "Count back 2: 4, 3.", "5 − 2 = 3."],
    shortcut: "Count back from the bigger number.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Subtraction",
  },
  {
    questionId: "math1_ch4_q2", topicId: "math1_ch4",
    text: "There are 6 biscuits. Mia eats 4. How many are LEFT?",
    options: [
      { text: "2",  type: "correct",          logicTag: "6 − 4 = 2" },
      { text: "10", type: "concept_error",    logicTag: "added instead" },
      { text: "4",  type: "concept_error",    logicTag: "wrote number eaten, not left" },
      { text: "3",  type: "calculation_error",logicTag: "counted back only 3" },
    ],
    explanation: "'Left' after eating means subtract. 6 − 4 = 2.",
    solutionSteps: ["6 − 4.", "Count back 4 from 6: 5, 4, 3, 2.", "2 biscuits left."],
    shortcut: "'Eaten', 'taken', 'left' → subtract.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Subtraction",
  },
  {
    questionId: "math1_ch4_q3", topicId: "math1_ch4",
    text: "What is 7 − 0?",
    options: [
      { text: "7", type: "correct",          logicTag: "subtracting 0 leaves the number unchanged" },
      { text: "0", type: "concept_error",    logicTag: "0 would mean all gone" },
      { text: "6", type: "calculation_error",logicTag: "subtracted 1 instead of 0" },
      { text: "1", type: "concept_error",    logicTag: "confused 0 with 1" },
    ],
    explanation: "Subtracting zero means taking away nothing. 7 − 0 = 7.",
    solutionSteps: ["0 means nothing taken away.", "7 − 0 = 7."],
    shortcut: "Any number − 0 = that same number.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Subtraction",
  },
  {
    questionId: "math1_ch4_q4", topicId: "math1_ch4",
    text: "8 − 8 = ?",
    options: [
      { text: "0", type: "correct",          logicTag: "same number minus itself = 0" },
      { text: "8", type: "concept_error",    logicTag: "left unchanged" },
      { text: "1", type: "concept_error",    logicTag: "confused with N−(N−1)=1" },
      { text: "16",type: "concept_error",    logicTag: "added instead" },
    ],
    explanation: "When you take all 8 away from 8, nothing is left. 8 − 8 = 0.",
    solutionSteps: ["8 − 8: take all 8 away.", "0 left.", "Any number − itself = 0."],
    shortcut: "N − N = 0 always.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Subtraction",
  },
  {
    questionId: "math1_ch4_q5", topicId: "math1_ch4",
    text: "How do you CHECK 6 − 4 = 2?",
    options: [
      { text: "Add 2 + 4; if you get 6, the answer is correct.",   type: "correct",       logicTag: "addition inverse of subtraction" },
      { text: "Subtract 2 from 4.",                               type: "concept_error", logicTag: "that gives a different answer" },
      { text: "Add 6 + 4.",                                       type: "concept_error", logicTag: "that gives 10, not a check" },
      { text: "Subtract again to check.",                         type: "concept_error", logicTag: "repeating gives same possible error" },
    ],
    explanation: "Check subtraction with addition: 2 + 4 = 6 ✓. The answer matches the original number.",
    solutionSteps: ["6 − 4 = 2.", "Check: 2 + 4 = 6 ✓"],
    shortcut: "Subtraction check: answer + number subtracted = starting number.",
    difficulty: "medium", subject: "Mathematics", grade: "1", chapter: "Subtraction",
  },

  // ── Chapter 5: Numbers from Ten to Twenty ────────────────────────────────
  {
    questionId: "math1_ch5_q1", topicId: "math1_ch5",
    text: "How do you write FIFTEEN as a numeral?",
    options: [
      { text: "15", type: "correct",          logicTag: "fifteen = 15" },
      { text: "51", type: "concept_error",    logicTag: "digits reversed" },
      { text: "50", type: "concept_error",    logicTag: "fifty, not fifteen" },
      { text: "5",  type: "concept_error",    logicTag: "only one digit" },
    ],
    explanation: "Fifteen = 10 + 5 = 15. The numeral is 15.",
    solutionSteps: ["Fifteen = one ten + five.", "Write: 15."],
    shortcut: "Teen numbers: 1_ where _ is the ones digit. Fifteen → 15.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers from Ten to Twenty",
  },
  {
    questionId: "math1_ch5_q2", topicId: "math1_ch5",
    text: "Which number is between 12 and 14?",
    options: [
      { text: "13", type: "correct",          logicTag: "12, 13, 14 — 13 is in the middle" },
      { text: "11", type: "concept_error",    logicTag: "11 is before 12" },
      { text: "15", type: "concept_error",    logicTag: "15 is after 14" },
      { text: "10", type: "concept_error",    logicTag: "10 is before 12" },
    ],
    explanation: "Counting: 12, 13, 14. The number between 12 and 14 is 13.",
    solutionSteps: ["12, ___, 14.", "One more than 12 is 13.", "13 is between 12 and 14."],
    shortcut: "Between two consecutive numbers: the middle one = first number + 1.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers from Ten to Twenty",
  },
  {
    questionId: "math1_ch5_q3", topicId: "math1_ch5",
    text: "Which is GREATER: 17 or 13?",
    options: [
      { text: "17",    type: "correct",       logicTag: "17 > 13; 17 comes later in counting" },
      { text: "13",    type: "concept_error", logicTag: "13 < 17" },
      { text: "Equal", type: "concept_error", logicTag: "17 ≠ 13" },
      { text: "Cannot tell.", type: "concept_error", logicTag: "we can compare teen numbers" },
    ],
    explanation: "Both have 1 ten. Compare ones: 7 > 3. So 17 > 13.",
    solutionSteps: ["Both in teens (10-something).", "Ones: 17 has 7, 13 has 3.", "7 > 3 → 17 > 13."],
    shortcut: "For teens, compare ones digits: bigger ones digit = greater number.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers from Ten to Twenty",
  },
  {
    questionId: "math1_ch5_q4", topicId: "math1_ch5",
    text: "What number comes JUST AFTER 19?",
    options: [
      { text: "20", type: "correct",          logicTag: "19 + 1 = 20" },
      { text: "18", type: "concept_error",    logicTag: "18 comes before 19" },
      { text: "21", type: "concept_error",    logicTag: "21 comes after 20" },
      { text: "10", type: "concept_error",    logicTag: "10 is far before 19" },
    ],
    explanation: "Just after means +1. 19 + 1 = 20.",
    solutionSteps: ["Just after = +1.", "19 + 1 = 20."],
    shortcut: "After 19 comes 20 — the first two-digit number ending in 0.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Numbers from Ten to Twenty",
  },
  {
    questionId: "math1_ch5_q5", topicId: "math1_ch5",
    text: "Which set of numbers is in the CORRECT order (smallest to largest)? ",
    options: [
      { text: "11, 14, 17, 20",  type: "correct",       logicTag: "increasing order" },
      { text: "20, 17, 14, 11",  type: "concept_error", logicTag: "decreasing order" },
      { text: "14, 11, 20, 17",  type: "concept_error", logicTag: "not in order" },
      { text: "11, 17, 14, 20",  type: "concept_error", logicTag: "17 and 14 swapped" },
    ],
    explanation: "Smallest to largest: 11 < 14 < 17 < 20. Each number is bigger than the one before.",
    solutionSteps: ["Compare: 11 < 14 < 17 < 20.", "This is increasing order."],
    shortcut: "Increasing = each number is bigger than the previous.",
    difficulty: "medium", subject: "Mathematics", grade: "1", chapter: "Numbers from Ten to Twenty",
  },

  // ── Chapter 6: Time ──────────────────────────────────────────────────────
  {
    questionId: "math1_ch6_q1", topicId: "math1_ch6",
    text: "Which activity happens in the MORNING?",
    options: [
      { text: "Brushing teeth and having breakfast.", type: "correct",       logicTag: "morning activities" },
      { text: "Going to bed and sleeping.",           type: "concept_error", logicTag: "sleeping happens at night" },
      { text: "Having dinner.",                       type: "concept_error", logicTag: "dinner is in the evening/night" },
      { text: "Watching the stars.",                  type: "concept_error", logicTag: "stars are seen at night" },
    ],
    explanation: "Morning is when we wake up. We brush teeth and have breakfast in the morning.",
    solutionSteps: ["Morning = after waking up.", "Breakfast and brushing → morning activities."],
    shortcut: "Morning: wake, brush, breakfast. Night: dinner, sleep.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Time",
  },
  {
    questionId: "math1_ch6_q2", topicId: "math1_ch6",
    text: "How many days are in ONE week?",
    options: [
      { text: "7",  type: "correct",          logicTag: "1 week = 7 days" },
      { text: "5",  type: "concept_error",    logicTag: "5 is school days, not total week" },
      { text: "10", type: "concept_error",    logicTag: "10 is more than a week" },
      { text: "30", type: "concept_error",    logicTag: "30 is about a month" },
    ],
    explanation: "One week = 7 days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.",
    solutionSteps: ["List days: Mon, Tue, Wed, Thu, Fri, Sat, Sun.", "Count: 7 days."],
    shortcut: "1 week = 7 days. Remember: MTWT FSS.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Time",
  },
  {
    questionId: "math1_ch6_q3", topicId: "math1_ch6",
    text: "If today is Friday, what day was YESTERDAY?",
    options: [
      { text: "Thursday", type: "correct",       logicTag: "Thursday comes just before Friday" },
      { text: "Saturday", type: "concept_error", logicTag: "Saturday comes after Friday" },
      { text: "Monday",   type: "concept_error", logicTag: "Monday is not just before Friday" },
      { text: "Sunday",   type: "concept_error", logicTag: "Sunday comes after Saturday" },
    ],
    explanation: "Yesterday = the day before today. The day before Friday is Thursday.",
    solutionSteps: ["Days: …Thursday, Friday, Saturday…", "Before Friday = Thursday."],
    shortcut: "Yesterday = day before today. Tomorrow = day after today.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Time",
  },
  {
    questionId: "math1_ch6_q4", topicId: "math1_ch6",
    text: "Which day comes AFTER Wednesday?",
    options: [
      { text: "Thursday", type: "correct",       logicTag: "Thursday follows Wednesday" },
      { text: "Tuesday",  type: "concept_error", logicTag: "Tuesday comes before Wednesday" },
      { text: "Friday",   type: "concept_error", logicTag: "Friday comes two after Wednesday" },
      { text: "Monday",   type: "concept_error", logicTag: "Monday is far before Wednesday" },
    ],
    explanation: "Order: …Tuesday, Wednesday, Thursday… The day after Wednesday is Thursday.",
    solutionSteps: ["Days order: Mon, Tue, Wed, Thu, Fri, Sat, Sun.", "After Wednesday = Thursday."],
    shortcut: "Know the 7 days in order; 'after' = the next day.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Time",
  },
  {
    questionId: "math1_ch6_q5", topicId: "math1_ch6",
    text: "Today is Tuesday. What day will TOMORROW be?",
    options: [
      { text: "Wednesday", type: "correct",       logicTag: "Wednesday comes after Tuesday" },
      { text: "Monday",    type: "concept_error", logicTag: "Monday comes before Tuesday" },
      { text: "Thursday",  type: "concept_error", logicTag: "Thursday is two days after Tuesday" },
      { text: "Sunday",    type: "concept_error", logicTag: "Sunday is not directly after Tuesday" },
    ],
    explanation: "Tomorrow = the day after today. After Tuesday comes Wednesday.",
    solutionSteps: ["Today: Tuesday.", "Tomorrow = next day.", "Next day: Wednesday."],
    shortcut: "Tomorrow = today + 1 day.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Time",
  },

  // ── Chapter 7: Measurement ───────────────────────────────────────────────
  {
    questionId: "math1_ch7_q1", topicId: "math1_ch7",
    text: "A pencil is longer than a crayon. A crayon is longer than an eraser. Which is the LONGEST?",
    options: [
      { text: "Pencil",  type: "correct",       logicTag: "pencil > crayon > eraser" },
      { text: "Crayon",  type: "concept_error", logicTag: "crayon is longer than eraser but shorter than pencil" },
      { text: "Eraser",  type: "concept_error", logicTag: "eraser is shortest" },
      { text: "They are all the same.", type: "concept_error", logicTag: "they differ in length" },
    ],
    explanation: "Pencil > crayon > eraser. So pencil is the longest.",
    solutionSteps: ["Pencil > crayon (given).", "Crayon > eraser (given).", "Therefore: pencil > crayon > eraser.", "Longest = pencil."],
    shortcut: "If A > B and B > C, then A is the longest.",
    difficulty: "medium", subject: "Mathematics", grade: "1", chapter: "Measurement",
  },
  {
    questionId: "math1_ch7_q2", topicId: "math1_ch7",
    text: "To compare which of two pencils is longer, you should:",
    options: [
      { text: "Place them side by side starting from the same end.",  type: "correct",       logicTag: "correct comparison technique" },
      { text: "Hold one in each hand and guess.",                     type: "concept_error", logicTag: "guessing is not accurate" },
      { text: "Compare their colours.",                              type: "concept_error", logicTag: "colour is unrelated to length" },
      { text: "Weigh them.",                                         type: "concept_error", logicTag: "weight ≠ length" },
    ],
    explanation: "Place both pencils side by side, starting from the same end. The one that sticks out more at the other end is longer.",
    solutionSteps: ["Line up pencils from the same end.", "Look at the other end.", "The one that sticks out = longer."],
    shortcut: "Always align one end before comparing length.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Measurement",
  },
  {
    questionId: "math1_ch7_q3", topicId: "math1_ch7",
    text: "Who is TALLER: a child of height 4 handspans or a child of height 6 handspans?",
    options: [
      { text: "The child who is 6 handspans tall.",  type: "correct",       logicTag: "6 > 4" },
      { text: "The child who is 4 handspans tall.",  type: "concept_error", logicTag: "4 < 6" },
      { text: "Both are the same height.",           type: "concept_error", logicTag: "4 ≠ 6" },
      { text: "Cannot compare.",                     type: "concept_error", logicTag: "same unit → can compare" },
    ],
    explanation: "6 handspans > 4 handspans. The child who is 6 handspans tall is taller.",
    solutionSteps: ["Same unit (handspan) → compare numbers.", "6 > 4.", "6-handspan child is taller."],
    shortcut: "More units = taller/longer when the same unit is used.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Measurement",
  },
  {
    questionId: "math1_ch7_q4", topicId: "math1_ch7",
    text: "On a balance scale, the side with the book goes DOWN and the side with the pen goes UP. Which is HEAVIER?",
    options: [
      { text: "The book.",  type: "correct",       logicTag: "down side = heavier" },
      { text: "The pen.",   type: "concept_error", logicTag: "pen side goes up = lighter" },
      { text: "Both are equal.", type: "concept_error", logicTag: "equal would mean level" },
      { text: "The scale is broken.", type: "concept_error", logicTag: "tipping is normal balance scale behaviour" },
    ],
    explanation: "On a balance scale, the heavier side goes DOWN. Book side is down → book is heavier.",
    solutionSteps: ["Down = heavier on a balance scale.", "Book side goes down → book is heavier."],
    shortcut: "Balance scale: down = heavy, up = light.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Measurement",
  },
  {
    questionId: "math1_ch7_q5", topicId: "math1_ch7",
    text: "Which of the following is LIGHTER?",
    options: [
      { text: "A feather",    type: "correct",       logicTag: "feather is extremely light" },
      { text: "A brick",      type: "concept_error", logicTag: "brick is very heavy" },
      { text: "A school bag", type: "concept_error", logicTag: "school bag weighs several kg" },
      { text: "A bucket of water", type: "concept_error", logicTag: "water is heavy" },
    ],
    explanation: "A feather is much lighter than a brick, school bag, or bucket of water.",
    solutionSteps: ["Compare real-life weights.", "Feather: nearly weightless.", "Others: several kilograms.", "Feather is lightest."],
    shortcut: "Feathers float in air → extremely light.",
    difficulty: "easy", subject: "Mathematics", grade: "1", chapter: "Measurement",
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
  console.log(`\nSeeded ${questions.length} questions for CBSE Class 1 Mathematics (Ch 1–7).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
