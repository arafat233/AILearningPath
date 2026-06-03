/**
 * AP SSC Class 8 Math — Ch16 Playing with Numbers — Questions (MCQ). 5×3 = 15.
 * Usage: node config/seedApSscMath8QuestionsCh16.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 16, CHAP = "Playing with Numbers";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (t, l) => ({ text: t, type: "correct", logicTag: l });
const W = (t, l) => ({ text: t, type: "concept_error", logicTag: l });
const T1 = "ap_ssc_math8_ch16_general_form", T2 = "ap_ssc_math8_ch16_letters_for_digits",
      T3 = "ap_ssc_math8_ch16_divisibility_tests";

const QUESTIONS = [
  mcq("ap_ssc8_ch16_gf_a01", T1, "General Form", "Two-digit number", "easy", "remember", "A two-digit number with tens digit a and units digit b is written as:", [C("10a + b", "ok"), W("a + b", "wrong"), W("ab", "concat"), W("10b + a", "swap")]),
  mcq("ap_ssc8_ch16_gf_a02", T1, "General Form", "Reversed number", "medium", "apply", "Reversing the digits of 10a + b gives:", [C("10b + a", "ok"), W("10a + b", "same"), W("a + b", "wrong"), W("ba", "concat")]),
  mcq("ap_ssc8_ch16_gf_a03", T1, "General Form", "Sum with reverse", "hard", "analyze", "A two-digit number plus its reverse, (10a + b) + (10b + a), is always divisible by:", [C("11", "ok"), W("9", "wrong"), W("10", "wrong2"), W("2", "wrong3")]),
  mcq("ap_ssc8_ch16_gf_a04", T1, "General Form", "Difference with reverse", "hard", "analyze", "A two-digit number minus its reverse is always divisible by:", [C("9", "ok"), W("11", "sum"), W("10", "wrong"), W("5", "wrong2")]),
  mcq("ap_ssc8_ch16_gf_a05", T1, "General Form", "Three-digit form", "medium", "remember", "A three-digit number with digits a, b, c is written as:", [C("100a + 10b + c", "ok"), W("a + b + c", "wrong"), W("abc", "concat"), W("100c + 10b + a", "swap")]),

  mcq("ap_ssc8_ch16_ld_a01", T2, "Letters for Digits", "Cryptarithm basics", "easy", "understand", "In a cryptarithm, each letter stands for:", [C("a single distinct digit", "ok"), W("any number", "wrong"), W("a variable to solve algebraically", "wrong2"), W("an operation", "wrong3")]),
  mcq("ap_ssc8_ch16_ld_a02", T2, "Letters for Digits", "Leading digit", "easy", "remember", "In a cryptarithm, the leading (first) digit of a number cannot be:", [C("0", "ok"), W("1", "wrong"), W("9", "wrong2"), W("even", "wrong3")]),
  mcq("ap_ssc8_ch16_ld_a03", T2, "Letters for Digits", "Solve A+A units", "medium", "apply", "In A + A = 8 (units), the digit A is:", [C("4", "ok"), W("8", "wrong"), W("2", "wrong2"), W("16", "wrong3")]),
  mcq("ap_ssc8_ch16_ld_a04", T2, "Letters for Digits", "Carry reasoning", "medium", "analyze", "If B + B ends in B (B + B = B in the units place with no carry), then B is:", [C("0", "ok"), W("1", "wrong"), W("5", "wrong2"), W("9", "wrong3")]),
  mcq("ap_ssc8_ch16_ld_a05", T2, "Letters for Digits", "Distinct letters", "easy", "understand", "In a standard cryptarithm, two different letters must represent:", [C("two different digits", "ok"), W("the same digit", "wrong"), W("consecutive digits", "wrong2"), W("even digits", "wrong3")]),

  mcq("ap_ssc8_ch16_dt_a01", T3, "Divisibility Tests", "Divisible by 9", "easy", "apply", "A number is divisible by 9 if:", [C("the sum of its digits is divisible by 9", "ok"), W("it ends in 9", "wrong"), W("it is even", "wrong2"), W("its last digit is 0", "wrong3")]),
  mcq("ap_ssc8_ch16_dt_a02", T3, "Divisibility Tests", "Divisible by 3", "easy", "apply", "Which number is divisible by 3?", [C("123 (digit sum 6)", "ok"), W("124", "wrong"), W("125", "wrong2"), W("122", "wrong3")]),
  mcq("ap_ssc8_ch16_dt_a03", T3, "Divisibility Tests", "Divisible by 10", "easy", "remember", "A number is divisible by 10 if its last digit is:", [C("0", "ok"), W("5", "five"), W("any even digit", "wrong"), W("1", "wrong2")]),
  mcq("ap_ssc8_ch16_dt_a04", T3, "Divisibility Tests", "Why the digit-sum test works", "hard", "understand", "The digit-sum tests for 3 and 9 work because powers of 10 always leave remainder:", [C("1 when divided by 9 (and by 3)", "ok"), W("0", "wrong"), W("9", "wrong2"), W("3", "wrong3")]),
  mcq("ap_ssc8_ch16_dt_a05", T3, "Divisibility Tests", "Divisible by 5", "easy", "remember", "A number is divisible by 5 if its last digit is:", [C("0 or 5", "ok"), W("0 only", "wrong"), W("5 only", "wrong2"), W("even", "wrong3")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch16 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
