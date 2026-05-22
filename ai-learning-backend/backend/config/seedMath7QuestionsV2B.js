import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch3 = "A Peek Beyond the Point";
const ch4 = "Letter-Numbers";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"7", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math7_ch3_dr_q1","math7_ch3_decimals_review","0.5 = ?",[c("5/10 = ½"),m("5"),g("0.05"),e("50")],"Tenths.",["½."],"½.","easy",ch3),
  Q("math7_ch3_dr_q2","math7_ch3_decimals_review","0.25 = ?",[c("¼"),m("½"),g("¾"),e("1/25")],"25/100.",["1/4."],"¼.","easy",ch3),
  Q("math7_ch3_dr_q3","math7_ch3_decimals_review","First decimal place =",[c("Tenths"),e("Hundredths"),m("Ones"),g("Random")],"1/10.",["Tenths."],"Tenths.","easy",ch3),
  Q("math7_ch3_dr_q4","math7_ch3_decimals_review","2nd place =",[m("Tenths"),c("Hundredths"),g("Thousandths"),e("Ones")],"1/100.",["Hundredths."],"Hundredths.","easy",ch3),
  Q("math7_ch3_dr_q5","math7_ch3_decimals_review","0.75 = ?",[c("¾"),m("¼"),g("⅔"),e("⅛")],"75/100.",["¾."],"¾.","medium",ch3),
  Q("math7_ch3_dr_q6","math7_ch3_decimals_review","Decimals are…",[c("Fractions in 10s"),e("Integers"),m("Random"),g("Whole")],"Tenths, hundredths.",["Base 10 fractions."],"Base 10.","medium",ch3),
  Q("math7_ch3_dr_q7","math7_ch3_decimals_review","0.5 + 0.5 = ?",[c("1"),m("0.10"),g("0.55"),e("10")],"Tenths sum.",["1 whole."],"= 1.","easy",ch3),
  Q("math7_ch3_dr_q8","math7_ch3_decimals_review","More decimal digits = bigger? T/F",[e("True"),c("False"),m("Sometimes"),g("Cannot say")],"0.50 = 0.5.",["Trailing 0 same."],"Not always.","medium",ch3),
  Q("math7_ch3_pv_q1","math7_ch3_place_value_decimal","0.347: digit in hundredths place?",[c("4"),m("3"),g("7"),e("0")],"2nd after decimal.",["3 tenths, 4 hundredths, 7 thousandths."],"2nd place.","medium",ch3),
  Q("math7_ch3_pv_q2","math7_ch3_place_value_decimal","Thousandths = ?",[c("1/1000"),m("1/100"),g("1000"),e("1/10")],"3rd place.",["Position 3."],"1/1000.","easy",ch3),
  Q("math7_ch3_pv_q3","math7_ch3_place_value_decimal","0.005 = ?",[c("5 thousandths"),m("5 hundredths"),g("5"),e("500")],"3rd place.",["0.005 = 5/1000."],"3rd place.","medium",ch3),
  Q("math7_ch3_pv_q4","math7_ch3_place_value_decimal","Place value of 7 in 0.07?",[c("0.07 (7 hundredths)"),m("7"),g("0.7"),e("0.007")],"Hundredths.",["2nd decimal: 7 × 0.01."],"× 0.01.","medium",ch3),
  Q("math7_ch3_pv_q5","math7_ch3_place_value_decimal","Each place right is ___ of previous.",[c("1/10"),m("×10"),g("Same"),e("1/100")],"Decimal pattern.",["Each ÷ 10."],"÷ 10.","medium",ch3),
  Q("math7_ch3_pv_q6","math7_ch3_place_value_decimal","0.234 = ?",[c("2 tenths + 3 hundredths + 4 thousandths"),m("234"),g("23.4"),e("0.0234")],"Place values.",["Each digit × its place."],"Expand.","medium",ch3),
  Q("math7_ch3_pv_q7","math7_ch3_place_value_decimal","0.1 + 0.01 = ?",[c("0.11"),m("0.2"),g("0.001"),e("0.10")],"Tenth + hundredth.",["0.10 + 0.01 = 0.11."],"Align.","medium",ch3),
  Q("math7_ch3_pv_q8","math7_ch3_place_value_decimal","0.999 < 1. T/F?",[c("True"),e("False"),m("Sometimes"),g("Cannot say")],"Just under 1.",["0.999 < 1."],"Less than 1.","easy",ch3),
  Q("math7_ch3_cd_q1","math7_ch3_comparing_decimals","Bigger: 0.3 or 0.25?",[c("0.3"),e("0.25"),m("Equal"),g("Cannot say")],"30 > 25 hundredths.",["0.30 > 0.25."],"Align + compare.","medium",ch3),
  Q("math7_ch3_cd_q2","math7_ch3_comparing_decimals","Compare 0.5 vs 0.50.",[e("0.5"),m("0.50"),c("Equal"),g("Cannot say")],"Trailing 0 doesn't change.",["Equal."],"Trailing 0 same.","medium",ch3),
  Q("math7_ch3_cd_q3","math7_ch3_comparing_decimals","Order: 0.1, 0.01, 0.11.",[c("0.01, 0.1, 0.11"),e("0.1, 0.01, 0.11"),m("0.11, 0.1, 0.01"),g("Random")],"Smallest first.",["Compare tenths/hundredths."],"Smallest first.","medium",ch3),
  Q("math7_ch3_cd_q4","math7_ch3_comparing_decimals","To compare, align decimal points.",[c("True"),e("False"),m("Sometimes"),g("Random")],"Align for clarity.",["Align decimals."],"Align.","easy",ch3),
  Q("math7_ch3_cd_q5","math7_ch3_comparing_decimals","Bigger: 1.05 or 1.5?",[e("1.05"),c("1.5"),m("Equal"),g("Cannot say")],"1.50 > 1.05.",["Add trailing 0: 1.05 vs 1.50."],"Compare aligned.","medium",ch3),
  Q("math7_ch3_cd_q6","math7_ch3_comparing_decimals","Compare 0.001 vs 0.01.",[e("0.001"),c("0.01"),m("Equal"),g("Cannot say")],"10 > 1 thousandths.",["0.001 < 0.010."],"Align.","medium",ch3),
  Q("math7_ch3_cd_q7","math7_ch3_comparing_decimals","Smallest of 0.5, 0.05, 0.5, 0.555?",[c("0.05"),m("0.5"),g("0.555"),e("0.50")],"Smallest tenths.",["0.05 = 0.050."],"Align + compare.","hard",ch3),
  Q("math7_ch3_cd_q8","math7_ch3_comparing_decimals","Decimal point alignment matters because…",[c("Same place values compared"),e("Decoration"),m("Random"),g("Hide")],"Position = value.",["Same place values."],"Position.","medium",ch3),
  Q("math7_ch3_df_q1","math7_ch3_decimal_fractions","0.5 as fraction:",[c("1/2"),m("5/100"),g("1/5"),e("5/1")],"5/10 = 1/2.",["Simplify."],"1/2.","easy",ch3),
  Q("math7_ch3_df_q2","math7_ch3_decimal_fractions","0.4 as fraction:",[c("2/5"),m("1/4"),g("4/10"),e("4")],"4/10 = 2/5.",["Simplify 4/10."],"Simplify.","medium",ch3),
  Q("math7_ch3_df_q3","math7_ch3_decimal_fractions","3/4 as decimal:",[c("0.75"),m("0.34"),g("0.43"),e("0.7")],"3÷4.",["Divide."],"Divide.","easy",ch3),
  Q("math7_ch3_df_q4","math7_ch3_decimal_fractions","0.125 = ?",[c("1/8"),m("1/4"),g("1/16"),e("125/1000")],"125/1000 = 1/8.",["Simplify."],"Simplify.","medium",ch3),
  Q("math7_ch3_df_q5","math7_ch3_decimal_fractions","2/5 = ?",[c("0.4"),m("0.25"),g("0.5"),e("0.04")],"2÷5.",["Divide."],"Divide.","medium",ch3),
  Q("math7_ch3_df_q6","math7_ch3_decimal_fractions","Convert decimal to fraction: place value.",[c("True"),e("False"),m("Sometimes"),g("Random")],"Place values reveal fraction.",["Use place values."],"Place values.","medium",ch3),
  Q("math7_ch3_df_q7","math7_ch3_decimal_fractions","0.6 as fraction:",[c("3/5"),m("1/2"),g("6/10"),e("3/10")],"6/10 = 3/5.",["Simplify."],"Simplify.","medium",ch3),
  Q("math7_ch3_df_q8","math7_ch3_decimal_fractions","Convert fraction to decimal: divide.",[c("True"),e("False"),m("Sometimes"),g("Multiply")],"Top ÷ bottom.",["Divide top by bottom."],"Divide.","easy",ch3),

  Q("math7_ch4_vi_q1","math7_ch4_variables_intro","Variables are…",[c("Letters representing unknowns"),e("Fixed numbers"),m("Random"),g("Constants")],"x, y, z = unknown.",["Letters = unknowns."],"Unknowns.","easy",ch4),
  Q("math7_ch4_vi_q2","math7_ch4_variables_intro","If x = 4, 2x = ?",[c("8"),m("6"),g("24"),e("16")],"2×4.",["2×4=8."],"Sub + compute.","easy",ch4),
  Q("math7_ch4_vi_q3","math7_ch4_variables_intro","Variables can…",[c("Take any value"),e("Be fixed"),m("Random"),g("Be color")],"Vary.",["Any value."],"Vary.","easy",ch4),
  Q("math7_ch4_vi_q4","math7_ch4_variables_intro","Common variable letters?",[c("x, y, z, n"),e("a, b, c"),m("Random"),g("All work")],"Conventionally.",["x most common."],"x, y, z.","easy",ch4),
  Q("math7_ch4_vi_q5","math7_ch4_variables_intro","2 × x is written as…",[c("2x"),e("x2"),m("2+x"),g("x²")],"Coefficient before.",["2x convention."],"2x.","medium",ch4),
  Q("math7_ch4_vi_q6","math7_ch4_variables_intro","If y = 0, evaluate 3y + 5.",[c("5"),m("0"),g("3"),e("8")],"3×0+5.",["3×0=0, +5=5."],"× 0 = 0.","easy",ch4),
  Q("math7_ch4_vi_q7","math7_ch4_variables_intro","Algebra uses…",[c("Variables and operations"),e("Just numbers"),m("Random"),g("Only constants")],"Variables in equations.",["Letters + ops."],"Letters + ops.","easy",ch4),
  Q("math7_ch4_vi_q8","math7_ch4_variables_intro","Coefficient of x in 5x?",[c("5"),m("1"),g("x"),e("0")],"Number multiplying.",["5x: coefficient 5."],"Number.","medium",ch4),
  Q("math7_ch4_we_q1","math7_ch4_writing_expressions","'Twice x' in algebra:",[c("2x"),e("x²"),m("x/2"),g("x+2")],"× 2.",["2 × x = 2x."],"× 2.","easy",ch4),
  Q("math7_ch4_we_q2","math7_ch4_writing_expressions","'x plus 5':",[c("x + 5"),e("5x"),m("x − 5"),g("x/5")],"+.",["x + 5."],"Plus = +.","easy",ch4),
  Q("math7_ch4_we_q3","math7_ch4_writing_expressions","'5 less than x':",[c("x − 5"),e("5 − x"),m("x + 5"),g("5x")],"x minus 5.",["x − 5 (not 5 − x)."],"x − 5.","medium",ch4),
  Q("math7_ch4_we_q4","math7_ch4_writing_expressions","'thrice y':",[c("3y"),e("y³"),m("y+3"),g("y/3")],"3 × y.",["× 3."],"3y.","easy",ch4),
  Q("math7_ch4_we_q5","math7_ch4_writing_expressions","Age in 3 years (currently x):",[c("x + 3"),e("3x"),m("x − 3"),g("3 − x")],"+ 3.",["Current + 3."],"+ years.","medium",ch4),
  Q("math7_ch4_we_q6","math7_ch4_writing_expressions","'half of x':",[c("x/2"),e("2x"),m("x²"),g("x+½")],"÷ 2.",["x/2 = ½x."],"÷ 2.","easy",ch4),
  Q("math7_ch4_we_q7","math7_ch4_writing_expressions","'twice x increased by 5':",[c("2x + 5"),m("2(x+5)"),g("x + 10"),e("x²+5")],"2x then +5.",["2x first, then +5."],"Order matters.","medium",ch4),
  Q("math7_ch4_we_q8","math7_ch4_writing_expressions","'x squared':",[c("x²"),e("2x"),m("x+2"),g("x/2")],"Multiplied by self.",["x × x = x²."],"x².","medium",ch4),
  Q("math7_ch4_se_q1","math7_ch4_simple_equations","x + 3 = 7. x = ?",[c("4"),m("10"),g("3"),e("21")],"x = 7−3.",["Subtract 3 both sides."],"Isolate x.","easy",ch4),
  Q("math7_ch4_se_q2","math7_ch4_simple_equations","2x = 10. x = ?",[c("5"),m("12"),g("20"),e("8")],"÷ 2.",["x = 10/2 = 5."],"÷ 2.","easy",ch4),
  Q("math7_ch4_se_q3","math7_ch4_simple_equations","x − 4 = 6. x = ?",[c("10"),m("2"),g("24"),e("−10")],"x = 6+4.",["+4 both sides."],"+ 4.","easy",ch4),
  Q("math7_ch4_se_q4","math7_ch4_simple_equations","x/3 = 6. x = ?",[c("18"),m("2"),g("9"),e("3")],"× 3.",["× 3 both sides."],"× 3.","easy",ch4),
  Q("math7_ch4_se_q5","math7_ch4_simple_equations","Equation has __ sign.",[c("="),e("+"),m("×"),g("−")],"Equality.",["= sign distinguishes."],"=.","easy",ch4),
  Q("math7_ch4_se_q6","math7_ch4_simple_equations","2x + 3 = 11. x = ?",[c("4"),m("7"),g("8"),e("5.5")],"2x = 8, x = 4.",["Subtract 3, divide 2."],"2 steps.","medium",ch4),
  Q("math7_ch4_se_q7","math7_ch4_simple_equations","x + 5 = 5. x = ?",[c("0"),m("5"),g("10"),e("−5")],"x=0.",["5+0=5."],"Subtract.","easy",ch4),
  Q("math7_ch4_se_q8","math7_ch4_simple_equations","To solve, do same to ___",[c("Both sides"),e("One side"),m("Random"),g("Variable only")],"Preserve balance.",["Same to both."],"Both sides.","medium",ch4),
  Q("math7_ch4_su_q1","math7_ch4_substituting","x = 4. Find 2x − 1.",[c("7"),m("3"),g("9"),e("8")],"8 − 1.",["2×4−1=7."],"Sub.","easy",ch4),
  Q("math7_ch4_su_q2","math7_ch4_substituting","x = 3, y = 2. Find xy.",[c("6"),m("5"),g("32"),e("0")],"3×2.",["x × y = 6."],"×.","easy",ch4),
  Q("math7_ch4_su_q3","math7_ch4_substituting","x = 5. Find x² − 3x.",[c("10"),m("15"),g("22"),e("12")],"25−15.",["25 − 15 = 10."],"Square + sub.","medium",ch4),
  Q("math7_ch4_su_q4","math7_ch4_substituting","a = −2. Find 3a + 6.",[c("0"),m("12"),g("−12"),e("−6")],"−6+6.",["3×(−2)+6=0."],"Watch signs.","medium",ch4),
  Q("math7_ch4_su_q5","math7_ch4_substituting","x = 2: x² + 2x + 1.",[c("9"),m("7"),g("11"),e("4")],"4+4+1.",["4+4+1=9."],"Full eval.","medium",ch4),
  Q("math7_ch4_su_q6","math7_ch4_substituting","If x = y = 5: x + y.",[c("10"),m("5"),g("25"),e("55")],"5+5.",["10."],"Plug both."," easy",ch4),
  Q("math7_ch4_su_q7","math7_ch4_substituting","x = 10: 100 / x.",[c("10"),m("100"),g("1"),e("1000")],"100/10.",["10."],"÷.","easy",ch4),
  Q("math7_ch4_su_q8","math7_ch4_substituting","Why substitute?",[c("Find numerical value"),e("Decoration"),m("Random"),g("Hide")],"Compute result.",["Get a number."],"Get number.","easy",ch4),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 7 Math v2 questions (Ch3-4).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
