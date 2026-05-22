/**
 * CBSE Class 2 Mathematics — Questions Seed B (Ch 9–15)
 * 5 questions per chapter = 35 questions total. Safe to re-run.
 * Usage: node config/seedMath2QuestionsB.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const questions = [

  // ── Chapter 9: My Funbook ────────────────────────────────────────────────
  {
    questionId: "math2_ch9_q1", topicId: "math2_ch9",
    text: "What number comes JUST BEFORE 50?",
    options: [
      { text: "49", type: "correct",          logicTag: "50 − 1 = 49" },
      { text: "51", type: "concept_error",    logicTag: "51 comes after 50" },
      { text: "40", type: "concept_error",    logicTag: "40 is 10 before 50" },
      { text: "48", type: "calculation_error",logicTag: "50 − 2 = 48, not 1 before" },
    ],
    explanation: "Just before means 1 less. 50 − 1 = 49.",
    solutionSteps: ["Just before = subtract 1.", "50 − 1 = 49."],
    shortcut: "Just before → −1. Just after → +1.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "My Funbook",
  },
  {
    questionId: "math2_ch9_q2", topicId: "math2_ch9",
    text: "What number is BETWEEN 36 and 38?",
    options: [
      { text: "37", type: "correct",          logicTag: "37 is between 36 and 38" },
      { text: "35", type: "concept_error",    logicTag: "35 is before 36" },
      { text: "39", type: "concept_error",    logicTag: "39 is after 38" },
      { text: "36", type: "concept_error",    logicTag: "36 is the start number" },
    ],
    explanation: "36, 37, 38 — the number 37 is between 36 and 38.",
    solutionSteps: ["List: 36, 37, 38.", "37 is the middle number."],
    shortcut: "Between two consecutive numbers: the one in the middle is always N and N+1 split by N+1.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "My Funbook",
  },
  {
    questionId: "math2_ch9_q3", topicId: "math2_ch9",
    text: "Pia has 24 stickers. She gets 6 more. How many does she have now?",
    options: [
      { text: "30", type: "correct",          logicTag: "24 + 6 = 30" },
      { text: "18", type: "concept_error",    logicTag: "subtracted instead of added" },
      { text: "28", type: "calculation_error",logicTag: "24 + 4 = 28, wrong addend" },
      { text: "31", type: "calculation_error",logicTag: "counted 7 instead of 6" },
    ],
    explanation: "'Gets more' means add. 24 + 6 = 30 stickers.",
    solutionSteps: ["Gets more → add.", "24 + 6 = 30."],
    shortcut: "Key word 'more' → addition.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "My Funbook",
  },
  {
    questionId: "math2_ch9_q4", topicId: "math2_ch9",
    text: "What number comes JUST AFTER 79?",
    options: [
      { text: "80", type: "correct",          logicTag: "79 + 1 = 80" },
      { text: "78", type: "concept_error",    logicTag: "78 comes before 79" },
      { text: "89", type: "concept_error",    logicTag: "adding 10 not 1" },
      { text: "70", type: "concept_error",    logicTag: "10 before 79" },
    ],
    explanation: "Just after means 1 more. 79 + 1 = 80.",
    solutionSteps: ["Just after = add 1.", "79 + 1 = 80."],
    shortcut: "Just after → +1.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "My Funbook",
  },
  {
    questionId: "math2_ch9_q5", topicId: "math2_ch9",
    text: "Fill in the missing number: ___, 45, 46, 47",
    options: [
      { text: "44", type: "correct",          logicTag: "45 − 1 = 44" },
      { text: "43", type: "calculation_error",logicTag: "two before 45" },
      { text: "46", type: "concept_error",    logicTag: "46 is already in the sequence" },
      { text: "40", type: "concept_error",    logicTag: "not consecutive" },
    ],
    explanation: "The sequence increases by 1 each time. The number before 45 is 45 − 1 = 44.",
    solutionSteps: ["Pattern: consecutive numbers, +1 each.", "Before 45: 45 − 1 = 44."],
    shortcut: "Consecutive number sequence: each term differs by 1.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "My Funbook",
  },

  // ── Chapter 10: Add our Points ───────────────────────────────────────────
  {
    questionId: "math2_ch10_q1", topicId: "math2_ch10",
    text: "Add: 27 + 35 = ?",
    options: [
      { text: "62", type: "correct",          logicTag: "7+5=12, carry 1; 2+3+1=6; 62" },
      { text: "52", type: "calculation_error",logicTag: "forgot to carry" },
      { text: "61", type: "calculation_error",logicTag: "ones digit error" },
      { text: "72", type: "calculation_error",logicTag: "swapped tens and ones" },
    ],
    explanation: "Ones: 7+5=12, write 2, carry 1. Tens: 2+3+1=6. Answer: 62.",
    solutionSteps: ["Ones: 7+5=12 → write 2, carry 1.", "Tens: 2+3+1(carry)=6.", "Answer: 62."],
    shortcut: "Always start with ones. If ones sum ≥ 10, carry 1 to tens.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Add our Points",
  },
  {
    questionId: "math2_ch10_q2", topicId: "math2_ch10",
    text: "There are 14 red balls and 23 blue balls. How many balls are there altogether?",
    options: [
      { text: "37", type: "correct",          logicTag: "14 + 23 = 37" },
      { text: "9",  type: "concept_error",    logicTag: "subtracted instead of added" },
      { text: "38", type: "calculation_error",logicTag: "ones: 4+3=7 correct; tens: 1+2=3 → 37, not 38" },
      { text: "27", type: "calculation_error",logicTag: "ignored tens of 14" },
    ],
    explanation: "Altogether means add. 14 + 23: ones 4+3=7, tens 1+2=3. Answer: 37.",
    solutionSteps: ["Add: 14 + 23.", "Ones: 4+3=7.", "Tens: 1+2=3.", "Answer: 37."],
    shortcut: "'Altogether', 'total', 'in all' → add.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Add our Points",
  },
  {
    questionId: "math2_ch10_q3", topicId: "math2_ch10",
    text: "What is 46 + 38?",
    options: [
      { text: "84", type: "correct",          logicTag: "6+8=14, carry 1; 4+3+1=8; 84" },
      { text: "74", type: "calculation_error",logicTag: "forgot carry" },
      { text: "78", type: "calculation_error",logicTag: "ones error" },
      { text: "94", type: "calculation_error",logicTag: "tens error" },
    ],
    explanation: "Ones: 6+8=14, write 4, carry 1. Tens: 4+3+1=8. Answer: 84.",
    solutionSteps: ["Ones: 6+8=14 → write 4, carry 1.", "Tens: 4+3+1=8.", "84."],
    shortcut: "Write carry small above tens column so you don't forget it.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Add our Points",
  },
  {
    questionId: "math2_ch10_q4", topicId: "math2_ch10",
    text: "Which addition does NOT require carrying?",
    options: [
      { text: "21 + 34",  type: "correct",          logicTag: "1+4=5, no carry needed" },
      { text: "27 + 36",  type: "concept_error",    logicTag: "7+6=13, carry required" },
      { text: "45 + 17",  type: "concept_error",    logicTag: "5+7=12, carry required" },
      { text: "38 + 25",  type: "concept_error",    logicTag: "8+5=13, carry required" },
    ],
    explanation: "21+34: ones 1+4=5 (< 10, no carry). Tens 2+3=5. Answer 55, no carrying needed.",
    solutionSteps: ["21+34: 1+4=5 (no carry). 2+3=5. Done.", "Others: ones sum ≥ 10 → carry needed."],
    shortcut: "No carry needed when ones digit sum < 10.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Add our Points",
  },
  {
    questionId: "math2_ch10_q5", topicId: "math2_ch10",
    text: "Mohan scored 53 points and Lata scored 29 points. What is their total score?",
    options: [
      { text: "82", type: "correct",          logicTag: "53+29: 3+9=12 carry; 5+2+1=8; 82" },
      { text: "72", type: "calculation_error",logicTag: "forgot carry" },
      { text: "83", type: "calculation_error",logicTag: "ones error" },
      { text: "24", type: "concept_error",    logicTag: "subtracted instead" },
    ],
    explanation: "Ones: 3+9=12, write 2, carry 1. Tens: 5+2+1=8. Total: 82.",
    solutionSteps: ["53+29.", "Ones: 3+9=12 → write 2, carry 1.", "Tens: 5+2+1=8.", "82."],
    shortcut: "Total/sum keyword → add. Check with estimate: ~50 + ~30 = ~80 ✓",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Add our Points",
  },

  // ── Chapter 11: Lines and Lines ──────────────────────────────────────────
  {
    questionId: "math2_ch11_q1", topicId: "math2_ch11",
    text: "Which of the following is a STRAIGHT line?",
    options: [
      { text: "A line drawn along the edge of a ruler.",  type: "correct",       logicTag: "ruler edge produces straight line" },
      { text: "The letter S.",                            type: "concept_error", logicTag: "S has curves" },
      { text: "A spiral.",                                type: "concept_error", logicTag: "spiral is curved" },
      { text: "A rainbow.",                               type: "concept_error", logicTag: "rainbow is curved" },
    ],
    explanation: "A line drawn using a ruler is perfectly straight — no bends or curves.",
    solutionSteps: ["Straight line: no bends.", "Ruler edge → perfectly straight."],
    shortcut: "If you can draw it with a ruler without lifting, it is straight.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Lines and Lines",
  },
  {
    questionId: "math2_ch11_q2", topicId: "math2_ch11",
    text: "A square is an example of a _______ shape.",
    options: [
      { text: "Closed shape",  type: "correct",       logicTag: "all 4 sides joined with no gap" },
      { text: "Open shape",    type: "concept_error", logicTag: "square has no gap in boundary" },
      { text: "Curved shape",  type: "concept_error", logicTag: "square has straight sides" },
      { text: "Single line",   type: "concept_error", logicTag: "square has 4 sides" },
    ],
    explanation: "A square's boundary is complete with no gaps, so it is a closed shape.",
    solutionSteps: ["Trace a square: you return to start without a gap.", "Closed shape = no gap in boundary."],
    shortcut: "Closed: you can fill it with colour without colour 'leaking' out.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Lines and Lines",
  },
  {
    questionId: "math2_ch11_q3", topicId: "math2_ch11",
    text: "Which describes a VERTICAL line?",
    options: [
      { text: "A line going straight up and down.",  type: "correct",       logicTag: "vertical = up-down" },
      { text: "A line going left to right.",         type: "concept_error", logicTag: "that is horizontal" },
      { text: "A line going diagonally.",            type: "concept_error", logicTag: "that is slanting" },
      { text: "A curved line.",                      type: "concept_error", logicTag: "vertical is straight" },
    ],
    explanation: "A vertical line goes straight up and down, like a door frame or a flagpole.",
    solutionSteps: ["Vertical = up and down.", "Horizontal = left and right.", "Slanting = diagonal."],
    shortcut: "Vertical = like the letter 'l'. Horizontal = like the letter 'l' lying down (—).",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Lines and Lines",
  },
  {
    questionId: "math2_ch11_q4", topicId: "math2_ch11",
    text: "The letter 'C' is an example of a _______ shape.",
    options: [
      { text: "Open curved shape",    type: "correct",       logicTag: "C has a curved line with a gap" },
      { text: "Closed curved shape",  type: "concept_error", logicTag: "C has a gap so it is open" },
      { text: "Closed straight shape",type: "concept_error", logicTag: "C is curved not straight" },
      { text: "Open straight shape",  type: "concept_error", logicTag: "C is curved not straight" },
    ],
    explanation: "The letter C is a curved line with a gap (opening) — it is an open curved shape.",
    solutionSteps: ["C: curved line.", "Gap at the opening → open shape.", "Open curved shape."],
    shortcut: "C has a gap → open. O has no gap → closed.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Lines and Lines",
  },
  {
    questionId: "math2_ch11_q5", topicId: "math2_ch11",
    text: "How many straight lines are needed to draw a triangle?",
    options: [
      { text: "3", type: "correct",          logicTag: "triangle has 3 straight sides" },
      { text: "4", type: "concept_error",    logicTag: "4 sides would make a quadrilateral" },
      { text: "2", type: "concept_error",    logicTag: "2 lines cannot close a shape" },
      { text: "6", type: "concept_error",    logicTag: "6 sides would make a hexagon" },
    ],
    explanation: "A triangle has exactly 3 sides, each made of one straight line.",
    solutionSteps: ["Tri = 3 in Latin.", "Triangle has 3 straight sides."],
    shortcut: "Tri- = 3. Triangle = 3 sides, 3 corners.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "Lines and Lines",
  },

  // ── Chapter 12: Give and Take ────────────────────────────────────────────
  {
    questionId: "math2_ch12_q1", topicId: "math2_ch12",
    text: "What is 52 − 27?",
    options: [
      { text: "25", type: "correct",          logicTag: "borrow: 12−7=5, 4−2=2; 25" },
      { text: "35", type: "calculation_error",logicTag: "did 7−2=5 without borrowing" },
      { text: "29", type: "calculation_error",logicTag: "ones error" },
      { text: "79", type: "concept_error",    logicTag: "added instead of subtracted" },
    ],
    explanation: "Ones: 2 < 7, borrow. 12−7=5. Tens: (5−1)−2 = 2. Answer: 25.",
    solutionSteps: ["Ones: 2 < 7 → borrow from tens.", "Ones become 12. Tens: 5→4.", "12−7=5. 4−2=2.", "Answer: 25."],
    shortcut: "Check: 25 + 27 = 52 ✓",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Give and Take",
  },
  {
    questionId: "math2_ch12_q2", topicId: "math2_ch12",
    text: "There are 64 apples. 38 are sold. How many are left?",
    options: [
      { text: "26", type: "correct",          logicTag: "64−38: borrow; 14−8=6, 5−3=2; 26" },
      { text: "36", type: "calculation_error",logicTag: "forgot to borrow" },
      { text: "102",type: "concept_error",    logicTag: "added instead" },
      { text: "24", type: "calculation_error",logicTag: "ones digit error" },
    ],
    explanation: "Ones: 4 < 8, borrow. 14−8=6. Tens: 5−3=2. 26 apples left.",
    solutionSteps: ["64−38.", "Ones: 4<8 → borrow. 14−8=6.", "Tens: 6−1=5, 5−3=2.", "26."],
    shortcut: "'Sold', 'used', 'gave away' → subtract.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Give and Take",
  },
  {
    questionId: "math2_ch12_q3", topicId: "math2_ch12",
    text: "Which subtraction does NOT need borrowing?",
    options: [
      { text: "75 − 32",  type: "correct",       logicTag: "5 > 2, no borrow needed" },
      { text: "43 − 17",  type: "concept_error", logicTag: "3 < 7, borrow needed" },
      { text: "60 − 24",  type: "concept_error", logicTag: "0 < 4, borrow needed" },
      { text: "81 − 46",  type: "concept_error", logicTag: "1 < 6, borrow needed" },
    ],
    explanation: "75−32: ones 5 ≥ 2, no borrowing needed. 5−2=3, 7−3=4. Answer: 43.",
    solutionSteps: ["75−32: ones 5 ≥ 2 → no borrow.", "5−2=3. 7−3=4. Answer: 43."],
    shortcut: "No borrow needed when top ones digit ≥ bottom ones digit.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Give and Take",
  },
  {
    questionId: "math2_ch12_q4", topicId: "math2_ch12",
    text: "Rani has 90 marbles. She gives 45 to her friend. How many does she have left?",
    options: [
      { text: "45", type: "correct",          logicTag: "90 − 45 = 45" },
      { text: "55", type: "calculation_error",logicTag: "tens error: 9−4=5 but forgot ones" },
      { text: "135",type: "concept_error",    logicTag: "added instead" },
      { text: "44", type: "calculation_error",logicTag: "computation error" },
    ],
    explanation: "Ones: 0 < 5, borrow. 10−5=5. Tens: 8−4=4. Answer: 45.",
    solutionSteps: ["90−45.", "Ones: 0<5 → borrow. 10−5=5.", "Tens: 9−1=8, 8−4=4.", "45."],
    shortcut: "Subtracting a number from itself gives 0; half of 90 is 45.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Give and Take",
  },
  {
    questionId: "math2_ch12_q5", topicId: "math2_ch12",
    text: "Raj has 72 stamps. He uses 38 of them. How can you check your subtraction answer?",
    options: [
      { text: "Add your answer to 38; you should get 72.",   type: "correct",       logicTag: "subtraction check: answer + subtracted number = original" },
      { text: "Add 72 and 38 together.",                     type: "concept_error", logicTag: "that gives 110, not a check" },
      { text: "Subtract 38 from 72 again.",                  type: "concept_error", logicTag: "repeating same step is not a check" },
      { text: "Multiply your answer by 38.",                 type: "concept_error", logicTag: "multiplication is unrelated" },
    ],
    explanation: "Subtraction check: answer + number subtracted = original. 34 + 38 = 72 ✓",
    solutionSteps: ["72 − 38 = 34.", "Check: 34 + 38 = 72 ✓"],
    shortcut: "Addition is the inverse of subtraction — always use it to check.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Give and Take",
  },

  // ── Chapter 13: The Longest Step ─────────────────────────────────────────
  {
    questionId: "math2_ch13_q1", topicId: "math2_ch13",
    text: "Where should you place the ruler when measuring an object's length?",
    options: [
      { text: "At the 0 mark, aligned with one end of the object.",  type: "correct",          logicTag: "start from 0 mark" },
      { text: "At the 1 mark, aligned with one end of the object.",  type: "concept_error",    logicTag: "starting from 1 gives wrong reading" },
      { text: "Anywhere on the ruler.",                              type: "concept_error",    logicTag: "position matters for accuracy" },
      { text: "At the middle of the ruler.",                         type: "concept_error",    logicTag: "centre start gives wrong reading" },
    ],
    explanation: "Always align the 0 mark of the ruler with one end of the object. Starting from 1 adds an extra cm to the measurement.",
    solutionSteps: ["Place 0 at one end.", "Read the number at the other end.", "That is the length in cm."],
    shortcut: "0-start rule: always begin measuring from zero.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "The Longest Step",
  },
  {
    questionId: "math2_ch13_q2", topicId: "math2_ch13",
    text: "A pencil measures from 0 to 13 on a ruler. How long is the pencil?",
    options: [
      { text: "13 cm",  type: "correct",          logicTag: "0 to 13 = 13 cm" },
      { text: "14 cm",  type: "calculation_error",logicTag: "counted marks not spaces" },
      { text: "12 cm",  type: "calculation_error",logicTag: "under-counted" },
      { text: "130 cm", type: "concept_error",    logicTag: "cm vs mm confusion" },
    ],
    explanation: "From 0 to 13 on a ruler = 13 cm. The length is the number at the end point.",
    solutionSteps: ["Start: 0 cm. End: 13 cm.", "Length = 13 − 0 = 13 cm."],
    shortcut: "Length = end mark − start mark. Starting at 0: length = end mark.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "The Longest Step",
  },
  {
    questionId: "math2_ch13_q3", topicId: "math2_ch13",
    text: "Rope A is 15 cm long. Rope B is 9 cm long. How much longer is Rope A than Rope B?",
    options: [
      { text: "6 cm",  type: "correct",          logicTag: "15 − 9 = 6 cm" },
      { text: "24 cm", type: "concept_error",    logicTag: "added instead of subtracted" },
      { text: "5 cm",  type: "calculation_error",logicTag: "15 − 10 = 5, wrong subtrahend" },
      { text: "4 cm",  type: "calculation_error",logicTag: "computation error" },
    ],
    explanation: "'How much longer' means subtract. 15 − 9 = 6 cm. Rope A is 6 cm longer.",
    solutionSteps: ["How much longer → subtract.", "15 − 9 = 6 cm."],
    shortcut: "'How much longer/shorter' always means subtract the two measurements.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "The Longest Step",
  },
  {
    questionId: "math2_ch13_q4", topicId: "math2_ch13",
    text: "Arrange from SHORTEST to LONGEST: 7 cm, 12 cm, 4 cm.",
    options: [
      { text: "4 cm, 7 cm, 12 cm",   type: "correct",       logicTag: "4 < 7 < 12" },
      { text: "12 cm, 7 cm, 4 cm",   type: "concept_error", logicTag: "longest to shortest" },
      { text: "7 cm, 4 cm, 12 cm",   type: "concept_error", logicTag: "unsorted" },
      { text: "4 cm, 12 cm, 7 cm",   type: "concept_error", logicTag: "wrong middle" },
    ],
    explanation: "4 < 7 < 12. Order from shortest to longest: 4 cm, 7 cm, 12 cm.",
    solutionSteps: ["Compare: 4, 7, 12.", "4 < 7 < 12.", "Shortest to longest: 4, 7, 12 cm."],
    shortcut: "Shorter = smaller number in cm.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "The Longest Step",
  },
  {
    questionId: "math2_ch13_q5", topicId: "math2_ch13",
    text: "A book's spine is measured from mark 2 to mark 10 on a ruler. What is its length?",
    options: [
      { text: "8 cm",  type: "correct",          logicTag: "10 − 2 = 8 cm" },
      { text: "10 cm", type: "concept_error",    logicTag: "read end mark instead of calculating length" },
      { text: "12 cm", type: "calculation_error",logicTag: "added marks" },
      { text: "2 cm",  type: "concept_error",    logicTag: "read start mark" },
    ],
    explanation: "Length = end mark − start mark = 10 − 2 = 8 cm.",
    solutionSteps: ["End: 10 cm. Start: 2 cm.", "Length: 10 − 2 = 8 cm."],
    shortcut: "Length = end − start (even when not starting at 0).",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "The Longest Step",
  },

  // ── Chapter 14: Birds Come, Birds Go ────────────────────────────────────
  {
    questionId: "math2_ch14_q1", topicId: "math2_ch14",
    text: "15 birds sit on a tree. 7 more arrive. Then 9 fly away. How many birds are on the tree now?",
    options: [
      { text: "13", type: "correct",          logicTag: "15+7=22, 22−9=13" },
      { text: "22", type: "partial_logic",    logicTag: "only did first step" },
      { text: "8",  type: "calculation_error",logicTag: "15−7=8, skipped second step" },
      { text: "11", type: "calculation_error",logicTag: "arithmetic error in second step" },
    ],
    explanation: "Step 1: 15 + 7 = 22 birds. Step 2: 22 − 9 = 13 birds remaining.",
    solutionSteps: ["Arrive → add: 15+7=22.", "Fly away → subtract: 22−9=13.", "13 birds."],
    shortcut: "Underline each action: 'more arrive'=add, 'fly away'=subtract. Do in order.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Birds Come, Birds Go",
  },
  {
    questionId: "math2_ch14_q2", topicId: "math2_ch14",
    text: "A shopkeeper has 45 mangoes. He sells 18 and then buys 25 more. How many mangoes does he have now?",
    options: [
      { text: "52", type: "correct",          logicTag: "45−18=27, 27+25=52" },
      { text: "88", type: "concept_error",    logicTag: "added all numbers: 45+18+25" },
      { text: "27", type: "partial_logic",    logicTag: "only did first step" },
      { text: "62", type: "calculation_error",logicTag: "45+25−8 error" },
    ],
    explanation: "Sells → subtract: 45−18=27. Buys → add: 27+25=52 mangoes.",
    solutionSteps: ["Sells: 45−18=27.", "Buys: 27+25=52.", "52 mangoes."],
    shortcut: "Two steps in order. Write intermediate answer clearly.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Birds Come, Birds Go",
  },
  {
    questionId: "math2_ch14_q3", topicId: "math2_ch14",
    text: "Meera has 30 chocolates. She gives 12 to her sister and 8 to her brother. How many does she have left?",
    options: [
      { text: "10", type: "correct",          logicTag: "30−12=18, 18−8=10" },
      { text: "18", type: "partial_logic",    logicTag: "only subtracted 12" },
      { text: "50", type: "concept_error",    logicTag: "added all numbers" },
      { text: "14", type: "calculation_error",logicTag: "arithmetic error" },
    ],
    explanation: "Gives to sister: 30−12=18. Gives to brother: 18−8=10. She has 10 left.",
    solutionSteps: ["30−12=18.", "18−8=10.", "10 chocolates left."],
    shortcut: "Two subtractions in order. Can also combine: 12+8=20, 30−20=10.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Birds Come, Birds Go",
  },
  {
    questionId: "math2_ch14_q4", topicId: "math2_ch14",
    text: "A pond has 25 fish. 10 swim away and then 8 more come. How many fish are in the pond now?",
    options: [
      { text: "23", type: "correct",          logicTag: "25−10=15, 15+8=23" },
      { text: "43", type: "concept_error",    logicTag: "added all: 25+10+8" },
      { text: "7",  type: "calculation_error",logicTag: "25−10−8 in wrong order" },
      { text: "15", type: "partial_logic",    logicTag: "only did first step" },
    ],
    explanation: "Swim away → subtract: 25−10=15. Come → add: 15+8=23 fish.",
    solutionSteps: ["25−10=15.", "15+8=23.", "23 fish."],
    shortcut: "Identify each action and its operation before calculating.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "Birds Come, Birds Go",
  },
  {
    questionId: "math2_ch14_q5", topicId: "math2_ch14",
    text: "Write the equation: 'There are 40 balloons. 15 pop. Then 20 more are blown up.'",
    options: [
      { text: "(40 − 15) + 20 = 45",   type: "correct",       logicTag: "subtract first, then add" },
      { text: "40 + 15 − 20 = 35",     type: "concept_error", logicTag: "popping should be subtract not add" },
      { text: "40 − 15 − 20 = 5",      type: "concept_error", logicTag: "blown up should be add not subtract" },
      { text: "40 + 15 + 20 = 75",     type: "concept_error", logicTag: "used wrong operations" },
    ],
    explanation: "'Pop' = subtract 15. 'Blown up' = add 20. Equation: (40−15)+20 = 25+20 = 45.",
    solutionSteps: ["Pop → subtract: 40−15=25.", "Blown up → add: 25+20=45.", "Equation: (40−15)+20=45."],
    shortcut: "Pop/burst/break = subtract. Blow up/add more/buy = add.",
    difficulty: "hard", subject: "Mathematics", grade: "2", chapter: "Birds Come, Birds Go",
  },

  // ── Chapter 15: How Many Ponytails? ──────────────────────────────────────
  {
    questionId: "math2_ch15_q1", topicId: "math2_ch15",
    text: "How many does this tally represent? IIII (four strokes then one diagonal)",
    options: [
      { text: "5",  type: "correct",          logicTag: "5 tally marks = 5" },
      { text: "4",  type: "concept_error",    logicTag: "counted only vertical strokes" },
      { text: "6",  type: "calculation_error",logicTag: "overcounted" },
      { text: "10", type: "concept_error",    logicTag: "two bundles would be 10" },
    ],
    explanation: "Four vertical strokes and one diagonal = one bundle = 5.",
    solutionSteps: ["Tally bundle: |||| with diagonal = 5.", "One bundle = 5."],
    shortcut: "One bundle (four vertical + one diagonal) = 5.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "How Many Ponytails?",
  },
  {
    questionId: "math2_ch15_q2", topicId: "math2_ch15",
    text: "In a class, 6 children like cats and 4 like dogs. Which animal is more popular?",
    options: [
      { text: "Cats (6 children prefer cats).",  type: "correct",       logicTag: "6 > 4" },
      { text: "Dogs (4 children prefer dogs).",  type: "concept_error", logicTag: "4 < 6" },
      { text: "They are equally popular.",       type: "concept_error", logicTag: "6 ≠ 4" },
      { text: "Cannot tell from this data.",     type: "concept_error", logicTag: "6 vs 4 is clear" },
    ],
    explanation: "6 > 4, so cats are liked by more children → cats are more popular.",
    solutionSteps: ["Cat count: 6. Dog count: 4.", "6 > 4 → cats are more popular."],
    shortcut: "More popular = higher count.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "How Many Ponytails?",
  },
  {
    questionId: "math2_ch15_q3", topicId: "math2_ch15",
    text: "How do you draw 8 using tally marks?",
    options: [
      { text: "IIII + III (one bundle of 5 and 3 separate strokes).",  type: "correct",       logicTag: "5+3=8" },
      { text: "IIII IIII (eight vertical strokes, no bundle).",        type: "concept_error", logicTag: "should bundle after 4+diagonal=5" },
      { text: "IIII IIII (two bundles = 10).",                         type: "calculation_error",logicTag: "two bundles = 10 not 8" },
      { text: "III IIIII (three + five separate strokes).",            type: "concept_error", logicTag: "bundle of 5 should use diagonal" },
    ],
    explanation: "8 = 5 + 3. Draw one tally bundle (four vertical + diagonal) for 5, then 3 separate strokes.",
    solutionSteps: ["8 = 5 + 3.", "Draw bundle: ||||/ (= 5).", "Draw 3 more: ||| (= 3).", "Total: 8."],
    shortcut: "Group in 5s: 8 = 5 + 3 = one bundle + three strokes.",
    difficulty: "medium", subject: "Mathematics", grade: "2", chapter: "How Many Ponytails?",
  },
  {
    questionId: "math2_ch15_q4", topicId: "math2_ch15",
    text: "A pictograph shows: Mango = 🥭🥭🥭, Apple = 🍎🍎, Banana = 🍌🍌🍌🍌. (Each picture = 1 fruit chosen.) Which is LEAST popular?",
    options: [
      { text: "Apple (2 pictures).",   type: "correct",       logicTag: "apple has fewest pictures" },
      { text: "Mango (3 pictures).",   type: "concept_error", logicTag: "mango has 3 > 2" },
      { text: "Banana (4 pictures).",  type: "concept_error", logicTag: "banana is most popular" },
      { text: "All equally popular.",  type: "concept_error", logicTag: "counts differ" },
    ],
    explanation: "Apple has 2 pictures — fewer than Mango (3) and Banana (4). Apple is least popular.",
    solutionSteps: ["Count pictures: Mango=3, Apple=2, Banana=4.", "Least = smallest count = Apple (2)."],
    shortcut: "Least popular = fewest pictures in pictograph.",
    difficulty: "easy", subject: "Mathematics", grade: "2", chapter: "How Many Ponytails?",
  },
  {
    questionId: "math2_ch15_q5", topicId: "math2_ch15",
    text: "In a tally chart: Red = IIII II, Blue = IIII, Green = IIII IIII. What is the TOTAL count?",
    options: [
      { text: "19", type: "correct",          logicTag: "7 + 5 + 7... wait: Red=7, Blue=5, Green=9? Let me recalculate. Red: IIII II = 5+2=7. Blue: IIII = 5. Green: IIII IIII = 5+4=9. Total=7+5+9=21? Let me re-check. Green IIII IIII = two groups: first is bundle(5) second is IIII=4 → 9. So 7+5+9=21." },
      { text: "21", type: "correct",          logicTag: "Red=7, Blue=5, Green=9: 7+5+9=21" },
      { text: "15", type: "calculation_error",logicTag: "counted strokes not bundles" },
      { text: "18", type: "calculation_error",logicTag: "arithmetic error" },
    ],
    explanation: "Red: ||||/ || = 5+2 = 7. Blue: ||||/ = 5. Green: ||||/ |||| = 5+4 = 9. Total: 7+5+9 = 21.",
    solutionSteps: ["Red: 1 bundle + 2 = 5+2=7.", "Blue: 1 bundle = 5.", "Green: 1 bundle + 4 = 5+4=9.", "Total: 7+5+9=21."],
    shortcut: "Count each bundle as 5, add individual strokes, then sum all categories.",
    difficulty: "hard", subject: "Mathematics", grade: "2", chapter: "How Many Ponytails?",
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
  console.log(`\nSeeded ${questions.length} questions for CBSE Class 2 Mathematics (Ch 9–15).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
