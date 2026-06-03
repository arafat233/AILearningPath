/**
 * AP SSC Class 8 Math — Ch2 Linear Equations in One Variable — Questions (MCQ).
 * 5 MCQ × 4 topics = 20. Usage: node config/seedApSscMath8QuestionsCh02.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 2, CHAP = "Linear Equations in One Variable";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (text, logicTag) => ({ text, type: "correct", logicTag });
const W = (text, logicTag) => ({ text, type: "concept_error", logicTag });
const T1 = "ap_ssc_math8_ch2_solving_simple", T2 = "ap_ssc_math8_ch2_variable_both_sides",
      T3 = "ap_ssc_math8_ch2_reducing_to_linear", T4 = "ap_ssc_math8_ch2_word_problems";

const QUESTIONS = [
  mcq("ap_ssc8_ch2_ss_a01", T1, "Solving Simple Equations", "Solve a linear equation", "easy", "apply",
    "Solve: 3x + 5 = 20.", [C("x = 5", "ok"), W("x = 15", "no_div"), W("x = 25/3", "add"), W("x = 7.5", "wrong")]),
  mcq("ap_ssc8_ch2_ss_a02", T1, "Solving Simple Equations", "Transposing", "easy", "understand",
    "When +5 is transposed to the other side of an equation, it becomes:", [C("−5", "flip"), W("+5", "same"), W("×5", "mul"), W("÷5", "div")]),
  mcq("ap_ssc8_ch2_ss_a03", T1, "Solving Simple Equations", "Solve a linear equation", "medium", "apply",
    "Solve: 2x − 7 = 11.", [C("x = 9", "ok"), W("x = 2", "sub"), W("x = 18", "no_div"), W("x = 4", "half")]),
  mcq("ap_ssc8_ch2_ss_a04", T1, "Solving Simple Equations", "Undo division", "easy", "apply",
    "Solve: x/3 = 4.", [C("x = 12", "mul"), W("x = 4/3", "div"), W("x = 7", "add"), W("x = 1", "wrong")]),
  mcq("ap_ssc8_ch2_ss_a05", T1, "Solving Simple Equations", "Identify a linear equation", "easy", "remember",
    "Which is a linear equation in ONE variable?", [C("2x + 3 = 7", "linear"), W("x² + 1 = 0", "quadratic"), W("x + y = 5", "two_var"), W("1/x = 2", "not_poly")]),

  mcq("ap_ssc8_ch2_bs_a01", T2, "Variables on Both Sides", "Solve with variables both sides", "medium", "apply",
    "Solve: 5x − 2 = 3x + 8.", [C("x = 5", "ok"), W("x = 3", "wrong"), W("x = 10", "no_div"), W("x = −5", "sign")]),
  mcq("ap_ssc8_ch2_bs_a02", T2, "Variables on Both Sides", "Gather variable terms", "medium", "apply",
    "Solve: 7x = 4x + 9.", [C("x = 3", "ok"), W("x = 9", "no_gather"), W("x = 11/4", "wrong"), W("x = 1", "wrong2")]),
  mcq("ap_ssc8_ch2_bs_a03", T2, "Variables on Both Sides", "Sign on transposing a variable", "easy", "understand",
    "Transposing 3x to the other side makes it:", [C("−3x", "flip"), W("+3x", "same"), W("3", "drop_var"), W("x/3", "div")]),
  mcq("ap_ssc8_ch2_bs_a04", T2, "Variables on Both Sides", "Solve with variables both sides", "medium", "apply",
    "Solve: 6x + 5 = 2x + 21.", [C("x = 4", "ok"), W("x = 6.5", "wrong"), W("x = 16", "no_div"), W("x = 26/8", "wrong2")]),
  mcq("ap_ssc8_ch2_bs_a05", T2, "Variables on Both Sides", "Cancelling x-terms", "hard", "analyze",
    "If, while solving, the x-terms cancel and you get 7 = 7, the equation has:",
    [C("Infinitely many solutions", "identity"), W("No solution", "contradiction"), W("Exactly one solution", "one"), W("x = 7", "misread")]),

  mcq("ap_ssc8_ch2_rl_a01", T3, "Reducible to Linear", "Cross-multiplication", "medium", "apply",
    "Solve: (x + 1)/(2x + 3) = 3/8.", [C("x = 1/2", "ok"), W("x = 2", "wrong"), W("x = −1", "sign"), W("x = 5", "wrong2")]),
  mcq("ap_ssc8_ch2_rl_a02", T3, "Reducible to Linear", "Clearing fractions by LCM", "easy", "understand",
    "To clear fractions in x/2 + x/3 = 5, multiply every term by:", [C("6 (the LCM)", "lcm"), W("5", "rhs"), W("2", "one_den"), W("3", "other_den")]),
  mcq("ap_ssc8_ch2_rl_a03", T3, "Reducible to Linear", "Removing brackets", "medium", "apply",
    "Solve: 3(x − 2) = 2(x + 1).", [C("x = 8", "ok"), W("x = 4", "wrong"), W("x = −8", "sign"), W("x = 1", "wrong2")]),
  mcq("ap_ssc8_ch2_rl_a04", T3, "Reducible to Linear", "Solve fractional equation", "medium", "apply",
    "Solve: x/2 + x/3 = 5.", [C("x = 6", "ok"), W("x = 5", "wrong"), W("x = 30", "no_div"), W("x = 1", "wrong2")]),
  mcq("ap_ssc8_ch2_rl_a05", T3, "Reducible to Linear", "When to cross-multiply", "easy", "understand",
    "Two equal fractions (one on each side) are best solved by:",
    [C("Cross-multiplication", "cross"), W("Adding the denominators", "add_den"), W("Squaring both sides", "square"), W("Ignoring the denominators", "ignore")]),

  mcq("ap_ssc8_ch2_wp_a01", T4, "Word Problems", "Consecutive odd numbers", "medium", "apply",
    "The sum of two consecutive odd numbers is 56. The numbers are:", [C("27 and 29", "ok"), W("28 and 30", "even"), W("26 and 30", "wrong"), W("27 and 28", "not_odd")]),
  mcq("ap_ssc8_ch2_wp_a02", T4, "Word Problems", "Translate words to algebra", "easy", "understand",
    "'Three less than twice a number x' is written as:", [C("2x − 3", "ok"), W("3 − 2x", "reversed"), W("2(x − 3)", "bracket"), W("3x − 2", "swap")]),
  mcq("ap_ssc8_ch2_wp_a03", T4, "Word Problems", "Form and solve", "medium", "apply",
    "A number is doubled and 5 is added to get 17. The number is:", [C("6", "ok"), W("11", "no_undo"), W("12", "wrong"), W("8.5", "half")]),
  mcq("ap_ssc8_ch2_wp_a04", T4, "Word Problems", "Consecutive even numbers", "easy", "remember",
    "Consecutive even numbers are written as x, x+2, x+4, … because they step by:", [C("2", "ok"), W("1", "consecutive"), W("4", "wrong"), W("0.5", "wrong2")]),
  mcq("ap_ssc8_ch2_wp_a05", T4, "Word Problems", "First step", "easy", "understand",
    "The first step in solving a word problem is to:", [C("Let the unknown be a variable (x)", "let_x"), W("Multiply everything by 10", "mul10"), W("Guess the answer", "guess"), W("Draw a graph", "graph")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch2 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
