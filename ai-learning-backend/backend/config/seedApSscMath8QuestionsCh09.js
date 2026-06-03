/**
 * AP SSC Class 8 Math — Ch9 Algebraic Expressions and Identities — Questions (MCQ). 5×4 = 20.
 * Usage: node config/seedApSscMath8QuestionsCh09.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 9, CHAP = "Algebraic Expressions and Identities";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (t, l) => ({ text: t, type: "correct", logicTag: l });
const W = (t, l) => ({ text: t, type: "concept_error", logicTag: l });
const T1 = "ap_ssc_math8_ch9_terms_and_types", T2 = "ap_ssc_math8_ch9_addition_subtraction",
      T3 = "ap_ssc_math8_ch9_multiplication", T4 = "ap_ssc_math8_ch9_identities";

const QUESTIONS = [
  mcq("ap_ssc8_ch9_tt_a01", T1, "Terms and Types", "Classify by terms", "easy", "remember", "An expression with exactly three terms is called a:", [C("trinomial", "ok"), W("binomial", "two"), W("monomial", "one"), W("polynomial of degree 3", "degree")]),
  mcq("ap_ssc8_ch9_tt_a02", T1, "Terms and Types", "Like terms", "easy", "understand", "Which pair are like terms?", [C("3x²y and −7x²y", "ok"), W("3x²y and 3xy²", "swap"), W("3x and 3x²", "power"), W("3x and 3y", "var")]),
  mcq("ap_ssc8_ch9_tt_a03", T1, "Terms and Types", "Coefficient", "easy", "remember", "The numerical coefficient of −5xy is:", [C("−5", "ok"), W("5", "sign"), W("xy", "var"), W("−5xy", "whole")]),
  mcq("ap_ssc8_ch9_tt_a04", T1, "Terms and Types", "Degree of a term", "medium", "apply", "The degree of the term 4x²y³ is:", [C("5", "ok"), W("6", "wrong"), W("2", "x_only"), W("3", "y_only")]),
  mcq("ap_ssc8_ch9_tt_a05", T1, "Terms and Types", "Monomial", "easy", "remember", "Which of these is a monomial?", [C("7xy", "ok"), W("x + y", "binom"), W("x + y + z", "trinom"), W("x² − 1", "binom2")]),

  mcq("ap_ssc8_ch9_as_a01", T2, "Addition & Subtraction", "Add like terms", "easy", "apply", "5a + 3a equals:", [C("8a", "ok"), W("15a", "mul"), W("8a²", "power"), W("53a", "concat")]),
  mcq("ap_ssc8_ch9_as_a02", T2, "Addition & Subtraction", "Subtract expressions", "medium", "apply", "(7x + 4) − (3x + 9) equals:", [C("4x − 5", "ok"), W("4x + 5", "sign"), W("10x − 5", "add"), W("4x + 13", "wrong")]),
  mcq("ap_ssc8_ch9_as_a03", T2, "Addition & Subtraction", "Only like terms combine", "easy", "understand", "3x + 2y cannot be simplified further because:", [C("x and y are unlike terms", "unlike"), W("the numbers differ", "numbers"), W("addition is not allowed", "wrong"), W("it is a monomial", "monomial")]),
  mcq("ap_ssc8_ch9_as_a04", T2, "Addition & Subtraction", "Add polynomials", "medium", "apply", "(2x² + 3x) + (x² − x) equals:", [C("3x² + 2x", "ok"), W("3x² + 4x", "sign"), W("2x² + 2x", "wrong"), W("3x³ + 2x", "power")]),
  mcq("ap_ssc8_ch9_as_a05", T2, "Addition & Subtraction", "Sign on removing brackets", "medium", "understand", "Removing the brackets in −(a − b) gives:", [C("−a + b", "ok"), W("−a − b", "sign"), W("a − b", "nochange"), W("a + b", "wrong")]),

  mcq("ap_ssc8_ch9_ml_a01", T3, "Multiplication", "Monomial × monomial", "easy", "apply", "(3x²)(4x³) equals:", [C("12x⁵", "ok"), W("12x⁶", "mul_power"), W("7x⁵", "add_coeff"), W("12x", "wrong")]),
  mcq("ap_ssc8_ch9_ml_a02", T3, "Multiplication", "Monomial × binomial", "medium", "apply", "2x(x + 3) equals:", [C("2x² + 6x", "ok"), W("2x² + 3", "no_dist"), W("2x + 6x", "no_power"), W("2x² + 6", "wrong")]),
  mcq("ap_ssc8_ch9_ml_a03", T3, "Multiplication", "Binomial × binomial", "medium", "apply", "(x + 2)(x + 3) equals:", [C("x² + 5x + 6", "ok"), W("x² + 6", "no_mid"), W("x² + 6x + 6", "wrong"), W("x² + 5x + 5", "wrong2")]),
  mcq("ap_ssc8_ch9_ml_a04", T3, "Multiplication", "Laws of exponents in product", "easy", "understand", "When multiplying powers of the same base, you:", [C("add the exponents", "add"), W("multiply the exponents", "mul"), W("subtract the exponents", "sub"), W("keep the larger exponent", "max")]),
  mcq("ap_ssc8_ch9_ml_a05", T3, "Multiplication", "Distribution count", "medium", "analyze", "Multiplying a binomial by a binomial produces, before simplifying, how many products?", [C("4", "ok"), W("2", "wrong"), W("3", "wrong2"), W("1", "wrong3")]),

  mcq("ap_ssc8_ch9_id_a01", T4, "Identities", "(a+b)²", "easy", "remember", "(a + b)² equals:", [C("a² + 2ab + b²", "ok"), W("a² + b²", "no_mid"), W("a² − 2ab + b²", "minus"), W("2a + 2b", "linear")]),
  mcq("ap_ssc8_ch9_id_a02", T4, "Identities", "(a−b)²", "easy", "remember", "(a − b)² equals:", [C("a² − 2ab + b²", "ok"), W("a² − b²", "diff"), W("a² + 2ab + b²", "plus"), W("a² + b²", "no_mid")]),
  mcq("ap_ssc8_ch9_id_a03", T4, "Identities", "(a+b)(a−b)", "easy", "remember", "(a + b)(a − b) equals:", [C("a² − b²", "ok"), W("a² + b²", "plus"), W("(a − b)²", "wrong"), W("a² − 2ab + b²", "wrong2")]),
  mcq("ap_ssc8_ch9_id_a04", T4, "Identities", "Apply identity", "medium", "apply", "Using an identity, 102 × 98 equals:", [C("9996", "ok"), W("10000", "wrong"), W("9998", "wrong2"), W("9996.0 wrong", "dummy")]),
  mcq("ap_ssc8_ch9_id_a05", T4, "Identities", "(x+a)(x+b)", "medium", "apply", "(x + 5)(x + 2) equals:", [C("x² + 7x + 10", "ok"), W("x² + 10x + 7", "swap"), W("x² + 7x + 7", "wrong"), W("x² + 10", "no_mid")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch9 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
