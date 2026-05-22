import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch15 = "Finding the Unknown";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"7", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math7_ch15_ei_q1","math7_ch15_equations_intro","Equation has __ sign.",[c("="),e("+"),m("×"),g("−")],"Equality.",["= distinguishes."],"=.","easy",ch15),
  Q("math7_ch15_ei_q2","math7_ch15_equations_intro","x + 3 = 7 is a/an…",[c("Equation"),e("Expression"),m("Random"),g("Inequality")],"Has =.",["= makes it equation."],"Equation.","easy",ch15),
  Q("math7_ch15_ei_q3","math7_ch15_equations_intro","Solution of equation = ?",[c("Value of variable making it true"),e("Random"),m("Always 0"),g("Half")],"Satisfies equation.",["x value: LHS=RHS."],"Satisfies.","medium",ch15),
  Q("math7_ch15_ei_q4","math7_ch15_equations_intro","Variable in 2x + 1 = 5:",[c("x"),m("2"),g("1"),e("5")],"Letter = variable.",["x is unknown."],"x.","easy",ch15),
  Q("math7_ch15_ei_q5","math7_ch15_equations_intro","LHS and RHS mean…",[c("Left and Right Hand Side"),e("Random"),m("Sum"),g("Subtract")],"Sides of equation.",["LHS = left, RHS = right of =."],"L/R sides.","easy",ch15),
  Q("math7_ch15_ei_q6","math7_ch15_equations_intro","Equation is balanced when…",[c("LHS = RHS"),e("LHS > RHS"),m("Random"),g("Cannot")],"Balance.",["Both sides equal."],"= true.","easy",ch15),
  Q("math7_ch15_ei_q7","math7_ch15_equations_intro","Equation vs expression?",[c("Equation has =; expression doesn't"),e("Same"),m("Random"),g("Reversed")],"Key difference.",["= sign present?"],"= test.","medium",ch15),
  Q("math7_ch15_ei_q8","math7_ch15_equations_intro","Coefficient of x in 5x + 2:",[c("5"),m("2"),g("x"),e("7")],"Number times x.",["5 × x."],"Number coef.","medium",ch15),
  Q("math7_ch15_ss_q1","math7_ch15_solving_simple","x + 3 = 7. x = ?",[c("4"),m("10"),g("3"),e("21")],"x = 7-3.",["−3 both sides."],"Isolate x.","easy",ch15),
  Q("math7_ch15_ss_q2","math7_ch15_solving_simple","2x = 10. x = ?",[c("5"),m("12"),g("20"),e("8")],"÷ 2.",["÷ 2 both sides."],"÷ 2.","easy",ch15),
  Q("math7_ch15_ss_q3","math7_ch15_solving_simple","x − 4 = 6. x = ?",[c("10"),m("2"),g("24"),e("−10")],"x = 6+4.",["+ 4 both sides."],"+ 4.","easy",ch15),
  Q("math7_ch15_ss_q4","math7_ch15_solving_simple","x/3 = 6. x = ?",[c("18"),m("2"),g("9"),e("3")],"× 3.",["× 3 both."],"× 3.","easy",ch15),
  Q("math7_ch15_ss_q5","math7_ch15_solving_simple","2x + 3 = 11. x = ?",[c("4"),m("7"),g("8"),e("5.5")],"2x = 8, x = 4.",["Subtract 3, divide 2."],"2 steps.","medium",ch15),
  Q("math7_ch15_ss_q6","math7_ch15_solving_simple","3x − 5 = 10. x = ?",[c("5"),m("15"),g("1"),e("45")],"3x = 15, x = 5.",["+5, ÷3."],"2 steps.","medium",ch15),
  Q("math7_ch15_ss_q7","math7_ch15_solving_simple","x + 5 = 5. x = ?",[c("0"),m("5"),g("10"),e("−5")],"Subtract 5.",["x = 5−5=0."],"= 0.","easy",ch15),
  Q("math7_ch15_ss_q8","math7_ch15_solving_simple","5x = 0. x = ?",[c("0"),m("5"),g("1"),e("Random")],"÷ 5.",["× 5 → 0."],"= 0.","easy",ch15),
  Q("math7_ch15_wp_q1","math7_ch15_word_problems","'5 less than thrice a number is 10.' Equation?",[c("3x − 5 = 10"),m("5 − 3x = 10"),g("3x + 5 = 10"),e("Random")],"Translate carefully.",["Thrice = 3x. 5 less = −5."],"3x − 5.","hard",ch15),
  Q("math7_ch15_wp_q2","math7_ch15_word_problems","'A number plus 7 equals 15.' Equation?",[c("x + 7 = 15"),m("x − 7 = 15"),g("7x = 15"),e("Random")],"Plus = +.",["x + 7 = 15."],"+.","easy",ch15),
  Q("math7_ch15_wp_q3","math7_ch15_word_problems","Riya's age is x. In 5 years she will be 18. Equation?",[c("x + 5 = 18"),m("x − 5 = 18"),g("5x = 18"),e("Random")],"Future age.",["x + 5 = 18."],"+5.","medium",ch15),
  Q("math7_ch15_wp_q4","math7_ch15_word_problems","Solve x + 5 = 18.",[c("13"),m("23"),g("5"),e("18")],"x = 13.",["−5."],"Subtract.","easy",ch15),
  Q("math7_ch15_wp_q5","math7_ch15_word_problems","'Twice a number is 14.' x = ?",[c("7"),m("14"),g("2"),e("28")],"2x = 14, x = 7.",["14/2."],"÷ 2.","medium",ch15),
  Q("math7_ch15_wp_q6","math7_ch15_word_problems","'A number divided by 3 is 5.' x = ?",[c("15"),m("3"),g("5"),e("8")],"x/3=5.",["× 3."],"× 3.","medium",ch15),
  Q("math7_ch15_wp_q7","math7_ch15_word_problems","Translate word → equation needs:",[c("Define variable, identify operations"),e("Random"),m("Guess"),g("Just write")],"Systematic.",["Variable + ops."],"Systematic.","medium",ch15),
  Q("math7_ch15_wp_q8","math7_ch15_word_problems","Triple a number plus 4 = 19. x = ?",[c("5"),m("15"),g("69"),e("63")],"3x + 4 = 19; x = 5.",["3x = 15; x = 5."],"2 steps.","hard",ch15),
  Q("math7_ch15_bm_q1","math7_ch15_balance_method","Balance method: same operation to ___",[c("Both sides"),e("One side"),m("Random"),g("Variable only")],"Preserves equality.",["Both sides same."],"Both sides.","easy",ch15),
  Q("math7_ch15_bm_q2","math7_ch15_balance_method","2x + 3 = 7. First step?",[c("Subtract 3 both sides"),e("Divide 2"),m("Random"),g("Add 3")],"Isolate 2x.",["−3 first."],"− first.","medium",ch15),
  Q("math7_ch15_bm_q3","math7_ch15_balance_method","After 2x = 4, do…",[c("Divide both by 2"),e("Add 2"),m("Random"),g("Multiply")],"Isolate x.",["÷ 2 both sides."],"÷ 2.","medium",ch15),
  Q("math7_ch15_bm_q4","math7_ch15_balance_method","If add 5 to LHS, must do same to…",[c("RHS"),e("Nothing"),m("Variable"),g("Random")],"Balance.",["Both sides."],"RHS too.","easy",ch15),
  Q("math7_ch15_bm_q5","math7_ch15_balance_method","Why balance method works?",[c("Maintains equality"),e("Random"),m("Decoration"),g("Just convention")],"Equal stays equal.",["Same to both = balance."],"Equality.","medium",ch15),
  Q("math7_ch15_bm_q6","math7_ch15_balance_method","Solve x/4 = 3 using balance:",[c("× 4 both: x = 12"),m("Add 4"),g("Random"),e("÷ 4")],"× 4.",["x = 12."],"× both.","medium",ch15),
  Q("math7_ch15_bm_q7","math7_ch15_balance_method","Solve 3x − 6 = 0:",[c("3x = 6, x = 2"),m("x = 6"),g("x = 18"),e("x = 0")],"+ 6, ÷ 3.",["3x = 6, x = 2."],"2 steps.","medium",ch15),
  Q("math7_ch15_bm_q8","math7_ch15_balance_method","Best way to verify solution:",[c("Substitute back"),e("Random"),m("Guess"),g("Skip")],"Plug in.",["Substitute, check LHS = RHS."],"Substitute.","medium",ch15),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 7 Math v2 questions (Ch15).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
