/**
 * AP SSC Class 8 Math — Ch13 Direct and Inverse Proportions — Questions (MCQ). 5×3 = 15.
 * Usage: node config/seedApSscMath8QuestionsCh13.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 13, CHAP = "Direct and Inverse Proportions";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (t, l) => ({ text: t, type: "correct", logicTag: l });
const W = (t, l) => ({ text: t, type: "concept_error", logicTag: l });
const T1 = "ap_ssc_math8_ch13_direct_proportion", T2 = "ap_ssc_math8_ch13_inverse_proportion",
      T3 = "ap_ssc_math8_ch13_proportion_word_problems";

const QUESTIONS = [
  mcq("ap_ssc8_ch13_dp_a01", T1, "Direct Proportion", "Definition", "easy", "understand", "In direct proportion, as one quantity increases the other:", [C("increases in the same ratio", "ok"), W("decreases", "inverse"), W("stays the same", "wrong"), W("becomes zero", "wrong2")]),
  mcq("ap_ssc8_ch13_dp_a02", T1, "Direct Proportion", "Constant ratio", "easy", "remember", "For directly proportional x and y, the quantity that stays constant is:", [C("y/x", "ok"), W("x − y", "diff"), W("x × y", "product"), W("x + y", "sum")]),
  mcq("ap_ssc8_ch13_dp_a03", T1, "Direct Proportion", "Solve", "medium", "apply", "If 5 pens cost ₹40, then 8 pens cost:", [C("₹64", "ok"), W("₹50", "wrong"), W("₹25", "inverse"), W("₹320", "wrong2")]),
  mcq("ap_ssc8_ch13_dp_a04", T1, "Direct Proportion", "Unitary method", "medium", "apply", "A car travels 120 km on 8 L of petrol. On 5 L it travels:", [C("75 km", "ok"), W("60 km", "wrong"), W("192 km", "wrong2"), W("40 km", "wrong3")]),
  mcq("ap_ssc8_ch13_dp_a05", T1, "Direct Proportion", "Graph", "medium", "understand", "The graph of two directly proportional quantities is:", [C("a straight line through the origin", "ok"), W("a curve", "inverse"), W("a horizontal line", "wrong"), W("a circle", "wrong2")]),

  mcq("ap_ssc8_ch13_ip_a01", T2, "Inverse Proportion", "Definition", "easy", "understand", "In inverse proportion, as one quantity increases the other:", [C("decreases so the product stays constant", "ok"), W("increases", "direct"), W("stays the same", "wrong"), W("doubles", "wrong2")]),
  mcq("ap_ssc8_ch13_ip_a02", T2, "Inverse Proportion", "Constant product", "easy", "remember", "For inversely proportional x and y, the quantity that stays constant is:", [C("x × y", "ok"), W("y/x", "direct"), W("x + y", "sum"), W("x − y", "diff")]),
  mcq("ap_ssc8_ch13_ip_a03", T2, "Inverse Proportion", "Workers and time", "medium", "apply", "6 workers finish a job in 12 days. 8 workers finish it in:", [C("9 days", "ok"), W("16 days", "direct"), W("10 days", "wrong"), W("6 days", "wrong2")]),
  mcq("ap_ssc8_ch13_ip_a04", T2, "Inverse Proportion", "Speed and time", "medium", "apply", "A trip takes 4 hours at 60 km/h. At 80 km/h it takes:", [C("3 hours", "ok"), W("5 hours", "direct"), W("2 hours", "wrong"), W("3.5 hours", "wrong2")]),
  mcq("ap_ssc8_ch13_ip_a05", T2, "Inverse Proportion", "Identify the type", "medium", "analyze", "Which pair is in INVERSE proportion?", [C("Number of workers and days to finish a fixed job", "ok"), W("Distance and cost of fuel", "direct"), W("Quantity bought and total price", "direct2"), W("Side and perimeter of a square", "direct3")]),

  mcq("ap_ssc8_ch13_wp_a01", T3, "Word Problems", "Choose method", "medium", "analyze", "More machines → less time to finish. This is an example of:", [C("inverse proportion", "ok"), W("direct proportion", "direct"), W("no proportion", "wrong"), W("partitive proportion", "wrong2")]),
  mcq("ap_ssc8_ch13_wp_a02", T3, "Word Problems", "Direct problem", "medium", "apply", "If 3 kg of rice costs ₹150, then 7 kg costs:", [C("₹350", "ok"), W("₹450", "wrong"), W("₹64", "inverse"), W("₹300", "wrong2")]),
  mcq("ap_ssc8_ch13_wp_a03", T3, "Word Problems", "Inverse problem", "medium", "apply", "Food lasts 20 days for 30 soldiers. For 40 soldiers it lasts:", [C("15 days", "ok"), W("27 days", "direct"), W("10 days", "wrong"), W("25 days", "wrong2")]),
  mcq("ap_ssc8_ch13_wp_a04", T3, "Word Problems", "Map scale (direct)", "easy", "apply", "On a map 1 cm = 5 km. A distance of 8 cm represents:", [C("40 km", "ok"), W("13 km", "add"), W("1.6 km", "inverse"), W("45 km", "wrong")]),
  mcq("ap_ssc8_ch13_wp_a05", T3, "Word Problems", "First step", "easy", "understand", "The first step in a proportion word problem is to decide whether the quantities are:", [C("directly or inversely proportional", "ok"), W("equal", "wrong"), W("prime", "wrong2"), W("integers", "wrong3")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch13 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
