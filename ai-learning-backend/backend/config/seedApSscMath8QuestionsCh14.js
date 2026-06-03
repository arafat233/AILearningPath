/**
 * AP SSC Class 8 Math — Ch14 Factorisation — Questions (MCQ). 5×4 = 20.
 * Usage: node config/seedApSscMath8QuestionsCh14.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 14, CHAP = "Factorisation";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (t, l) => ({ text: t, type: "correct", logicTag: l });
const W = (t, l) => ({ text: t, type: "concept_error", logicTag: l });
const T1 = "ap_ssc_math8_ch14_common_factors", T2 = "ap_ssc_math8_ch14_regrouping",
      T3 = "ap_ssc_math8_ch14_using_identities", T4 = "ap_ssc_math8_ch14_division";

const QUESTIONS = [
  mcq("ap_ssc8_ch14_cf_a01", T1, "Common Factors", "Take out common factor", "easy", "apply", "Factorise: 6x + 9.", [C("3(2x + 3)", "ok"), W("3(2x + 9)", "wrong"), W("6(x + 9)", "wrong2"), W("3(2x − 3)", "sign")]),
  mcq("ap_ssc8_ch14_cf_a02", T1, "Common Factors", "GCF of terms", "medium", "apply", "The greatest common factor of 12x²y and 18xy² is:", [C("6xy", "ok"), W("6x²y²", "wrong"), W("3xy", "wrong2"), W("36xy", "lcm")]),
  mcq("ap_ssc8_ch14_cf_a03", T1, "Common Factors", "Factorise monomial common", "medium", "apply", "Factorise: 10a²b − 15ab².", [C("5ab(2a − 3b)", "ok"), W("5ab(2a + 3b)", "sign"), W("5(2a²b − 3ab²)", "partial"), W("ab(10a − 15b)", "no_5")]),
  mcq("ap_ssc8_ch14_cf_a04", T1, "Common Factors", "What is factorisation", "easy", "understand", "To factorise an expression means to write it as a:", [C("product of factors", "ok"), W("sum of terms", "wrong"), W("single number", "wrong2"), W("fraction", "wrong3")]),
  mcq("ap_ssc8_ch14_cf_a05", T1, "Common Factors", "Check by expanding", "easy", "understand", "A factorisation can be verified by:", [C("multiplying the factors back out", "ok"), W("adding the factors", "wrong"), W("dividing by the variable", "wrong2"), W("squaring it", "wrong3")]),

  mcq("ap_ssc8_ch14_rg_a01", T2, "Regrouping", "Factor by grouping", "medium", "apply", "Factorise: ax + ay + bx + by.", [C("(a + b)(x + y)", "ok"), W("(a + x)(b + y)", "wrong"), W("ab(x + y)", "wrong2"), W("(a + b)(x − y)", "sign")]),
  mcq("ap_ssc8_ch14_rg_a02", T2, "Regrouping", "When to regroup", "easy", "understand", "Regrouping is used when an expression has:", [C("no single common factor across all terms", "ok"), W("only one term", "wrong"), W("a perfect square", "wrong2"), W("a negative exponent", "wrong3")]),
  mcq("ap_ssc8_ch14_rg_a03", T2, "Regrouping", "Group correctly", "medium", "apply", "Factorise: x² + xy + 5x + 5y.", [C("(x + y)(x + 5)", "ok"), W("(x + 5)(x − y)", "sign"), W("x(x + y + 5)", "partial"), W("(x + y)(x − 5)", "sign2")]),
  mcq("ap_ssc8_ch14_rg_a04", T2, "Regrouping", "Common binomial factor", "medium", "understand", "After grouping ab + b + a + 1 = b(a + 1) + 1(a + 1), the common factor is:", [C("(a + 1)", "ok"), W("b", "wrong"), W("(b + 1)", "wrong2"), W("ab", "wrong3")]),
  mcq("ap_ssc8_ch14_rg_a05", T2, "Regrouping", "Rearrange terms", "hard", "apply", "Factorise: 6xy − 4y + 6 − 9x.", [C("(2y − 3)(3x − 2)", "ok"), W("(2y + 3)(3x + 2)", "sign"), W("(3x − 2)(2y + 3)", "sign2"), W("(2y − 3)(3x + 2)", "sign3")]),

  mcq("ap_ssc8_ch14_ui_a01", T3, "Using Identities", "Difference of squares", "easy", "apply", "Factorise: x² − 9.", [C("(x + 3)(x − 3)", "ok"), W("(x − 3)²", "square"), W("(x + 3)²", "square2"), W("(x − 9)(x + 1)", "wrong")]),
  mcq("ap_ssc8_ch14_ui_a02", T3, "Using Identities", "Perfect square", "medium", "apply", "Factorise: x² + 6x + 9.", [C("(x + 3)²", "ok"), W("(x + 9)(x + 1)", "wrong"), W("(x − 3)²", "sign"), W("(x + 3)(x − 3)", "diff")]),
  mcq("ap_ssc8_ch14_ui_a03", T3, "Using Identities", "Perfect square (minus)", "medium", "apply", "Factorise: a² − 10a + 25.", [C("(a − 5)²", "ok"), W("(a + 5)²", "sign"), W("(a − 5)(a + 5)", "diff"), W("(a − 25)(a − 1)", "wrong")]),
  mcq("ap_ssc8_ch14_ui_a04", T3, "Using Identities", "Mid-term split", "medium", "apply", "Factorise: x² + 7x + 12.", [C("(x + 3)(x + 4)", "ok"), W("(x + 2)(x + 6)", "wrong"), W("(x + 1)(x + 12)", "wrong2"), W("(x − 3)(x − 4)", "sign")]),
  mcq("ap_ssc8_ch14_ui_a05", T3, "Using Identities", "Recognise the identity", "easy", "understand", "The expression a² − b² is best factorised using:", [C("(a + b)(a − b)", "ok"), W("(a + b)²", "square"), W("(a − b)²", "square2"), W("grouping", "group")]),

  mcq("ap_ssc8_ch14_dv_a01", T4, "Division", "Monomial ÷ monomial", "easy", "apply", "Divide: 12x⁵ ÷ 4x²", [C("3x³", "ok"), W("3x⁷", "add"), W("3x²", "wrong"), W("8x³", "sub_coeff")]),
  mcq("ap_ssc8_ch14_dv_a02", T4, "Division", "Polynomial ÷ monomial", "medium", "apply", "Divide: (6x² + 9x) ÷ 3x", [C("2x + 3", "ok"), W("2x + 9", "partial"), W("2x² + 3", "wrong"), W("6x + 3", "wrong2")]),
  mcq("ap_ssc8_ch14_dv_a03", T4, "Division", "Factor then cancel", "medium", "apply", "Simplify: (x² − 4) ÷ (x − 2)", [C("x + 2", "ok"), W("x − 2", "wrong"), W("x² − 2", "wrong2"), W("x + 4", "wrong3")]),
  mcq("ap_ssc8_ch14_dv_a04", T4, "Division", "Law of exponents in division", "easy", "understand", "Dividing powers of the same base means you:", [C("subtract the exponents", "sub"), W("add the exponents", "add"), W("divide the exponents", "div"), W("multiply the exponents", "mul")]),
  mcq("ap_ssc8_ch14_dv_a05", T4, "Division", "Division by factorisation", "medium", "understand", "To divide one polynomial by another, the easiest first step is often to:", [C("factorise both and cancel common factors", "ok"), W("add the polynomials", "wrong"), W("square the divisor", "wrong2"), W("ignore the variable", "wrong3")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch14 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
