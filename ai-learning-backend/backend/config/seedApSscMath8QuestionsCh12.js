/**
 * AP SSC Class 8 Math — Ch12 Exponents and Powers — Questions (MCQ). 5×3 = 15.
 * Usage: node config/seedApSscMath8QuestionsCh12.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 12, CHAP = "Exponents and Powers";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (t, l) => ({ text: t, type: "correct", logicTag: l });
const W = (t, l) => ({ text: t, type: "concept_error", logicTag: l });
const T1 = "ap_ssc_math8_ch12_laws_of_exponents", T2 = "ap_ssc_math8_ch12_negative_exponents",
      T3 = "ap_ssc_math8_ch12_standard_form";

const QUESTIONS = [
  mcq("ap_ssc8_ch12_le_a01", T1, "Laws of Exponents", "Product law", "easy", "apply", "2³ × 2⁴ equals:", [C("2⁷", "ok"), W("2¹²", "mul"), W("4⁷", "base"), W("2¹", "sub")]),
  mcq("ap_ssc8_ch12_le_a02", T1, "Laws of Exponents", "Quotient law", "easy", "apply", "5⁶ ÷ 5² equals:", [C("5⁴", "ok"), W("5³", "div"), W("5⁸", "add"), W("1⁴", "base")]),
  mcq("ap_ssc8_ch12_le_a03", T1, "Laws of Exponents", "Power of a power", "medium", "apply", "(3²)³ equals:", [C("3⁶", "ok"), W("3⁵", "add"), W("3⁸", "wrong"), W("9³", "base")]),
  mcq("ap_ssc8_ch12_le_a04", T1, "Laws of Exponents", "Zero exponent", "easy", "remember", "For any non-zero a, a⁰ equals:", [C("1", "ok"), W("0", "zero"), W("a", "self"), W("undefined", "undef")]),
  mcq("ap_ssc8_ch12_le_a05", T1, "Laws of Exponents", "Product of powers, same exponent", "medium", "apply", "2³ × 3³ equals:", [C("6³", "ok"), W("6⁹", "mul_exp"), W("5³", "add_base"), W("6⁶", "add_exp")]),

  mcq("ap_ssc8_ch12_ne_a01", T2, "Negative Exponents", "Definition", "easy", "remember", "a⁻ⁿ is equal to:", [C("1/aⁿ", "ok"), W("−aⁿ", "sign"), W("aⁿ", "same"), W("n/a", "wrong")]),
  mcq("ap_ssc8_ch12_ne_a02", T2, "Negative Exponents", "Evaluate", "easy", "apply", "2⁻³ equals:", [C("1/8", "ok"), W("−8", "neg"), W("8", "pos"), W("−1/8", "wrong")]),
  mcq("ap_ssc8_ch12_ne_a03", T2, "Negative Exponents", "Reciprocal", "medium", "apply", "(1/3)⁻² equals:", [C("9", "ok"), W("1/9", "wrong"), W("−9", "sign"), W("6", "wrong2")]),
  mcq("ap_ssc8_ch12_ne_a04", T2, "Negative Exponents", "Combine laws", "medium", "apply", "10⁻² × 10⁵ equals:", [C("10³", "ok"), W("10⁻⁷", "sub"), W("10⁷", "wrong"), W("10⁻³", "sign")]),
  mcq("ap_ssc8_ch12_ne_a05", T2, "Negative Exponents", "Negative not negative value", "easy", "understand", "A negative exponent makes the value:", [C("a reciprocal (a fraction), not a negative number", "ok"), W("negative", "neg"), W("zero", "zero"), W("undefined", "undef")]),

  mcq("ap_ssc8_ch12_sf_a01", T3, "Standard Form", "Large number", "easy", "apply", "150000 in standard form is:", [C("1.5 × 10⁵", "ok"), W("15 × 10⁴", "not_normal"), W("1.5 × 10⁴", "wrong"), W("1.5 × 10⁶", "wrong2")]),
  mcq("ap_ssc8_ch12_sf_a02", T3, "Standard Form", "Small number", "medium", "apply", "0.00056 in standard form is:", [C("5.6 × 10⁻⁴", "ok"), W("5.6 × 10⁴", "sign"), W("56 × 10⁻⁵", "not_normal"), W("5.6 × 10⁻³", "wrong")]),
  mcq("ap_ssc8_ch12_sf_a03", T3, "Standard Form", "Mantissa range", "easy", "understand", "In standard form a × 10ⁿ, the number a satisfies:", [C("1 ≤ a < 10", "ok"), W("0 ≤ a < 1", "wrong"), W("a > 10", "wrong2"), W("any value", "any")]),
  mcq("ap_ssc8_ch12_sf_a04", T3, "Standard Form", "Convert back", "medium", "apply", "3.2 × 10³ equals:", [C("3200", "ok"), W("320", "wrong"), W("32000", "wrong2"), W("0.0032", "neg")]),
  mcq("ap_ssc8_ch12_sf_a05", T3, "Standard Form", "Why use it", "easy", "understand", "Standard form is most useful for writing numbers that are:", [C("very large or very small", "ok"), W("between 1 and 10 only", "wrong"), W("whole numbers only", "wrong2"), W("negative only", "wrong3")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch12 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
