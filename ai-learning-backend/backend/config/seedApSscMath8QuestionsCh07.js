/**
 * AP SSC Class 8 Math — Ch7 Cubes and Cube Roots — Questions (MCQ). 5×2 = 10.
 * Usage: node config/seedApSscMath8QuestionsCh07.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 7, CHAP = "Cubes and Cube Roots";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (t, l) => ({ text: t, type: "correct", logicTag: l });
const W = (t, l) => ({ text: t, type: "concept_error", logicTag: l });
const T1 = "ap_ssc_math8_ch7_cubes", T2 = "ap_ssc_math8_ch7_cube_roots";

const QUESTIONS = [
  mcq("ap_ssc8_ch7_cb_a01", T1, "Cubes", "Compute a cube", "easy", "apply", "The value of 6³ is:", [C("216", "ok"), W("18", "times3"), W("36", "square"), W("128", "wrong")]),
  mcq("ap_ssc8_ch7_cb_a02", T1, "Cubes", "Perfect cube test", "medium", "analyze", "Which of these is a perfect cube?", [C("64", "4cube"), W("100", "square"), W("36", "square2"), W("50", "no")]),
  mcq("ap_ssc8_ch7_cb_a03", T1, "Cubes", "Cube of a negative", "medium", "apply", "(−3)³ equals:", [C("−27", "ok"), W("27", "sign"), W("−9", "square"), W("9", "wrong")]),
  mcq("ap_ssc8_ch7_cb_a04", T1, "Cubes", "Smallest multiplier for a cube", "hard", "apply", "The smallest number to multiply 72 by to get a perfect cube is:", [C("3", "ok"), W("2", "wrong"), W("9", "wrong2"), W("72", "wrong3")]),
  mcq("ap_ssc8_ch7_cb_a05", T1, "Cubes", "Cube exponents", "easy", "understand", "In the prime factorisation of a perfect cube, each prime occurs a number of times that is a multiple of:", [C("3", "ok"), W("2", "square"), W("1", "any"), W("6", "wrong")]),

  mcq("ap_ssc8_ch7_cr_a01", T2, "Cube Roots", "Compute a cube root", "easy", "apply", "∛125 equals:", [C("5", "ok"), W("25", "wrong"), W("15", "wrong2"), W("625", "wrong3")]),
  mcq("ap_ssc8_ch7_cr_a02", T2, "Cube Roots", "Cube root by factorisation", "medium", "apply", "∛1728 equals:", [C("12", "ok"), W("14", "wrong"), W("18", "wrong2"), W("24", "wrong3")]),
  mcq("ap_ssc8_ch7_cr_a03", T2, "Cube Roots", "Grouping for cube roots", "medium", "understand", "To find a cube root by prime factorisation, you take one prime from each group of:", [C("three", "ok"), W("two", "square"), W("one", "wrong"), W("six", "wrong2")]),
  mcq("ap_ssc8_ch7_cr_a04", T2, "Cube Roots", "Cube root of a negative", "medium", "apply", "∛(−64) equals:", [C("−4", "ok"), W("4", "sign"), W("−8", "square_root"), W("8", "wrong")]),
  mcq("ap_ssc8_ch7_cr_a05", T2, "Cube Roots", "Units-digit shortcut", "hard", "analyze", "The cube root of 2197 ends in the digit:", [C("3 (∛2197 = 13)", "ok"), W("7", "wrong"), W("9", "wrong2"), W("1", "wrong3")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch7 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
