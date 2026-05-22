import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch3 = "A Story of Numbers";
const ch4 = "Quadrilaterals";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"8", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math8_ch3_nh_q1","math8_ch3_number_history","Smallest natural number?",[c("1"),m("0"),g("-1"),e("2")],"Natural starts at 1.",["N = {1, 2, 3, ...}."],"1.","easy",ch3),
  Q("math8_ch3_nh_q2","math8_ch3_number_history","Whole numbers include…",[c("0 and naturals"),e("Only positives"),m("Negatives"),g("Random")],"0 + naturals.",["W = {0, 1, 2, ...}."],"+ 0.","easy",ch3),
  Q("math8_ch3_nh_q3","math8_ch3_number_history","Integers include…",[c("Negatives, 0, positives"),e("Only naturals"),m("Just positives"),g("Random")],"Full set.",["Z = {..., -1, 0, 1, ...}."],"+ negatives.","easy",ch3),
  Q("math8_ch3_nh_q4","math8_ch3_number_history","Rationals are…",[c("Numbers expressible as p/q"),e("Only fractions"),m("All decimals"),g("Random")],"p/q form.",["Includes integers (n/1) and fractions."],"p/q.","medium",ch3),
  Q("math8_ch3_nh_q5","math8_ch3_number_history","Is 0 a rational?",[c("Yes (0/1)"),e("No"),m("Sometimes"),g("Cannot say")],"0 = 0/1.",["0/1 valid."],"Yes.","medium",ch3),
  Q("math8_ch3_nh_q6","math8_ch3_number_history","Irrationals like…",[c("√2, π"),e("½"),m("3"),g("0.5")],"Non-repeating decimals.",["√2 ≈ 1.41421..."],"√2, π.","medium",ch3),
  Q("math8_ch3_nh_q7","math8_ch3_number_history","Real numbers = ?",[c("Rationals + irrationals"),e("Just rationals"),m("Just integers"),g("Random")],"All on number line.",["R = Q ∪ Irrationals."],"Real = all.","hard",ch3),
  Q("math8_ch3_nh_q8","math8_ch3_number_history","Order of extension: N → W → Z → ?",[c("Q (rationals)"),e("Random"),m("Integers"),g("Stop")],"Then rationals.",["N ⊂ W ⊂ Z ⊂ Q."],"Q next.","medium",ch3),
  Q("math8_ch3_ir_q1","math8_ch3_integers_review","Is -7 an integer?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"Negative whole.",["Yes."],"Yes.","easy",ch3),
  Q("math8_ch3_ir_q2","math8_ch3_integers_review","Is 1.5 an integer?",[e("Yes"),c("No"),m("Sometimes"),g("Cannot say")],"Decimal.",["Not whole."],"No.","easy",ch3),
  Q("math8_ch3_ir_q3","math8_ch3_integers_review","Sum of two integers is…",[c("Always an integer"),e("Sometimes"),m("Never"),g("Random")],"Closed under addition.",["Property of integers."],"Always.","medium",ch3),
  Q("math8_ch3_ir_q4","math8_ch3_integers_review","Difference of two integers is…",[c("Always integer"),e("Sometimes"),m("Never"),g("Random")],"Closed.",["Subtraction closed."],"Always.","medium",ch3),
  Q("math8_ch3_ir_q5","math8_ch3_integers_review","Product of two integers is…",[c("Always integer"),e("Sometimes"),m("Never"),g("Random")],"Closed under multiplication.",["× closed."],"Always.","medium",ch3),
  Q("math8_ch3_ir_q6","math8_ch3_integers_review","Quotient of two integers is…",[c("Not always integer"),e("Always"),m("Never"),g("Random")],"½ is not integer.",["÷ may give fractions."],"Not always.","medium",ch3),
  Q("math8_ch3_ir_q7","math8_ch3_integers_review","-5 + 3 = ?",[c("-2"),m("2"),g("-8"),e("8")],"Sign of bigger.",["Net -2."],"Subtract magnitudes.","easy",ch3),
  Q("math8_ch3_ir_q8","math8_ch3_integers_review","Opposite of -8?",[c("8"),m("-8"),g("0"),e("64")],"Negate.",["−(−8) = 8."],"Negate.","easy",ch3),
  Q("math8_ch3_rn_q1","math8_ch3_rational_numbers","Is ⅔ rational?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"Fraction.",["2/3 form."],"Yes.","easy",ch3),
  Q("math8_ch3_rn_q2","math8_ch3_rational_numbers","Is 5 rational?",[c("Yes (5/1)"),e("No"),m("Sometimes"),g("Cannot say")],"5 = 5/1.",["Integers are rational."],"Yes.","medium",ch3),
  Q("math8_ch3_rn_q3","math8_ch3_rational_numbers","0.5 = ?",[c("1/2 (rational)"),e("Irrational"),m("Integer"),g("Random")],"Decimal to fraction.",["0.5 = 1/2."],"Rational.","easy",ch3),
  Q("math8_ch3_rn_q4","math8_ch3_rational_numbers","Repeating decimals are…",[c("Rational"),e("Irrational"),m("Sometimes"),g("Random")],"All terminating + repeating = rational.",["0.333... = 1/3."],"Rational.","hard",ch3),
  Q("math8_ch3_rn_q5","math8_ch3_rational_numbers","Sum of two rationals is…",[c("Always rational"),e("Sometimes"),m("Random"),g("Irrational")],"Closed.",["Closed under +."],"Always.","medium",ch3),
  Q("math8_ch3_rn_q6","math8_ch3_rational_numbers","0.333... is rational?",[c("Yes (= 1/3)"),e("No"),m("Sometimes"),g("Cannot say")],"Repeating = rational.",["1/3."],"Yes.","medium",ch3),
  Q("math8_ch3_rn_q7","math8_ch3_rational_numbers","p/q where q = 0 is…",[c("Undefined (not rational)"),e("Rational"),m("Random"),g("Zero")],"Cannot divide by 0.",["q ≠ 0 required."],"q ≠ 0.","medium",ch3),
  Q("math8_ch3_rn_q8","math8_ch3_rational_numbers","-7/4 is…",[c("Rational"),e("Irrational"),m("Integer"),g("Random")],"Fraction form.",["−7/4 = p/q."],"Rational.","medium",ch3),
  Q("math8_ch3_in_q1","math8_ch3_irrational_numbers","√2 is…",[c("Irrational"),e("Rational"),m("Integer"),g("Random")],"Cannot express as p/q.",["√2 ≈ 1.41421..., non-repeating."],"Irrational.","medium",ch3),
  Q("math8_ch3_in_q2","math8_ch3_irrational_numbers","π is approximately…",[c("3.14159"),m("3"),g("22"),e("314")],"Famous irrational.",["Non-terminating, non-repeating."],"3.14...","easy",ch3),
  Q("math8_ch3_in_q3","math8_ch3_irrational_numbers","Decimal representation of irrational:",[c("Non-terminating, non-repeating"),e("Terminating"),m("Repeating"),g("Random")],"Forever and unique pattern.",["No pattern."],"Non-repeating.","hard",ch3),
  Q("math8_ch3_in_q4","math8_ch3_irrational_numbers","Is √4 irrational?",[e("Yes"),c("No (=2)"),m("Sometimes"),g("Cannot say")],"√4 = 2 (integer).",["Perfect square."],"No.","medium",ch3),
  Q("math8_ch3_in_q5","math8_ch3_irrational_numbers","e (Euler's number) is…",[c("Irrational (≈2.718)"),e("Rational"),m("Random"),g("Integer")],"Famous irrational.",["e ≈ 2.71828..."],"Irrational.","hard",ch3),
  Q("math8_ch3_in_q6","math8_ch3_irrational_numbers","√3 is…",[c("Irrational"),e("Rational"),m("Integer"),g("Random")],"Not perfect square.",["√3 ≈ 1.732..."],"Irrational.","medium",ch3),
  Q("math8_ch3_in_q7","math8_ch3_irrational_numbers","Sum of two irrationals is…",[c("Sometimes rational, sometimes irrational"),e("Always irrational"),m("Always rational"),g("Cannot say")],"Not closed.",["√2 + (−√2) = 0 (rational)."],"Sometimes.","hard",ch3),
  Q("math8_ch3_in_q8","math8_ch3_irrational_numbers","0.1010010001... (non-repeating) is…",[c("Irrational"),e("Rational"),m("Integer"),g("Random")],"Pattern but non-repeating.",["Non-repeating digits."],"Irrational.","hard",ch3),

  Q("math8_ch4_qt_q1","math8_ch4_quadrilateral_types","Square has all sides…",[c("Equal"),e("Different"),m("Random"),g("Random length")],"All 4 equal.",["Square = 4 equal."],"All equal.","easy",ch4),
  Q("math8_ch4_qt_q2","math8_ch4_quadrilateral_types","Rectangle: opposite sides…",[c("Equal"),e("All equal"),m("Random"),g("Different")],"2 pairs.",["L = L', W = W'."],"Opposite equal.","easy",ch4),
  Q("math8_ch4_qt_q3","math8_ch4_quadrilateral_types","Parallelogram: opposite sides…",[c("Equal and parallel"),e("Different"),m("Random"),g("Perpendicular")],"Both pairs.",["Definition."],"|| + equal.","medium",ch4),
  Q("math8_ch4_qt_q4","math8_ch4_quadrilateral_types","Rhombus: all sides…",[c("Equal"),e("Random"),m("Different"),g("Parallel")],"All 4 equal but not necessarily 90°.",["Like square but angles vary."],"All equal.","medium",ch4),
  Q("math8_ch4_qt_q5","math8_ch4_quadrilateral_types","Trapezium has…",[c("At least 1 pair parallel sides"),e("All parallel"),m("None parallel"),g("Random")],"1 pair.",["Only 1 pair parallel."],"1 pair ||.","medium",ch4),
  Q("math8_ch4_qt_q6","math8_ch4_quadrilateral_types","Kite has…",[c("2 pairs of adjacent equal sides"),e("All sides equal"),m("Random"),g("Parallel")],"Two pairs adjacent.",["Like rhombus but adjacent."],"2 pairs adj.","hard",ch4),
  Q("math8_ch4_qt_q7","math8_ch4_quadrilateral_types","Square is also a…",[c("Rectangle, rhombus, parallelogram"),e("None"),m("Trapezium"),g("Kite")],"Square has all properties.",["Square: all + equal angles."],"All applicable.","hard",ch4),
  Q("math8_ch4_qt_q8","math8_ch4_quadrilateral_types","Quadrilateral has…",[c("4 sides"),m("3"),g("5"),e("Variable")],"By definition.",["Quad = 4 sides."],"4 sides.","easy",ch4),
  Q("math8_ch4_qp_q1","math8_ch4_quadrilateral_properties","Rectangle diagonals are…",[c("Equal"),e("Different"),m("Random"),g("Perpendicular")],"Property.",["Both diagonals equal."],"Equal.","medium",ch4),
  Q("math8_ch4_qp_q2","math8_ch4_quadrilateral_properties","Square diagonals…",[c("Equal AND perpendicular"),e("Different"),m("Random"),g("Parallel")],"Both properties.",["Equal + perp."],"Both.","medium",ch4),
  Q("math8_ch4_qp_q3","math8_ch4_quadrilateral_properties","Parallelogram diagonals…",[c("Bisect each other"),e("Equal"),m("Perpendicular"),g("Random")],"Cross at midpoints.",["Each cuts other in half."],"Bisect.","medium",ch4),
  Q("math8_ch4_qp_q4","math8_ch4_quadrilateral_properties","Rhombus diagonals are…",[c("Perpendicular"),e("Equal"),m("Parallel"),g("Random")],"At 90°.",["Cross at right angles."],"Perpendicular.","medium",ch4),
  Q("math8_ch4_qp_q5","math8_ch4_quadrilateral_properties","Kite diagonals…",[c("Perpendicular (one bisects the other)"),e("Equal"),m("Parallel"),g("Random")],"Asymmetric.",["One bisects other at 90°."],"Perp.","hard",ch4),
  Q("math8_ch4_qp_q6","math8_ch4_quadrilateral_properties","Trapezium has __ parallel sides.",[c("Exactly 1 pair"),m("2 pairs"),g("None"),e("All")],"By definition.",["Only 1 pair parallel."],"1 pair.","medium",ch4),
  Q("math8_ch4_qp_q7","math8_ch4_quadrilateral_properties","Rhombus opposite angles are…",[c("Equal"),e("Different"),m("Random"),g("90°")],"Property of parallelogram.",["Parallelogram property."],"Equal.","medium",ch4),
  Q("math8_ch4_qp_q8","math8_ch4_quadrilateral_properties","Rectangle is also a…",[c("Parallelogram"),e("Rhombus"),m("Square"),g("Trapezium")],"Both pairs parallel.",["Rectangle ⊂ parallelogram."],"Parallelogram.","medium",ch4),
  Q("math8_ch4_qa_q1","math8_ch4_quadrilateral_angles","Quadrilateral angle sum = ?",[c("360°"),m("180°"),g("540°"),e("270°")],"Theorem.",["Sum = 360°."],"360°.","medium",ch4),
  Q("math8_ch4_qa_q2","math8_ch4_quadrilateral_angles","If 3 angles = 80°, 90°, 100°, fourth = ?",[c("90°"),m("180°"),g("270°"),e("70°")],"360−270.",["360 − 270 = 90."],"360 − sum.","medium",ch4),
  Q("math8_ch4_qa_q3","math8_ch4_quadrilateral_angles","All angles in square = ?",[c("90°"),m("60°"),g("45°"),e("180°")],"Right angles.",["All 90°."],"90° each.","easy",ch4),
  Q("math8_ch4_qa_q4","math8_ch4_quadrilateral_angles","Trapezium angles sum to:",[c("360°"),m("180°"),g("90°"),e("540°")],"All quadrilaterals.",["360° for any quadrilateral."],"360°.","medium",ch4),
  Q("math8_ch4_qa_q5","math8_ch4_quadrilateral_angles","Rectangle: 4 angles each:",[c("90°"),m("60°"),g("180°"),e("45°")],"All right.",["All 90°."],"90°.","easy",ch4),
  Q("math8_ch4_qa_q6","math8_ch4_quadrilateral_angles","Parallelogram: adjacent angles…",[c("Sum 180°"),e("Equal"),m("Sum 90°"),g("Random")],"Co-interior.",["Adjacent supplementary."],"Sum 180°.","hard",ch4),
  Q("math8_ch4_qa_q7","math8_ch4_quadrilateral_angles","If angle 1 = 70° in parallelogram, opposite = ?",[c("70°"),m("110°"),g("90°"),e("180°")],"Opposite equal.",["Parallelogram: opposite equal."],"Equal.","medium",ch4),
  Q("math8_ch4_qa_q8","math8_ch4_quadrilateral_angles","Adjacent of 70° in parallelogram = ?",[c("110°"),m("70°"),g("90°"),e("180°")],"Supplementary.",["180 − 70 = 110."],"Sum 180.","medium",ch4),
  Q("math8_ch4_pg_q1","math8_ch4_parallelograms","Parallelogram has…",[c("2 pairs of parallel sides"),e("1 pair"),m("None"),g("All sides equal")],"Definition.",["Both pairs parallel."],"2 pairs ||.","easy",ch4),
  Q("math8_ch4_pg_q2","math8_ch4_parallelograms","Which is not a parallelogram?",[c("Trapezium (only 1 pair parallel)"),e("Square"),m("Rectangle"),g("Rhombus")],"Trapezium.",["Trapezium has only 1 pair."],"Trapezium.","medium",ch4),
  Q("math8_ch4_pg_q3","math8_ch4_parallelograms","Opposite angles in parallelogram are…",[c("Equal"),e("Sum 180"),m("Different"),g("Random")],"Property.",["A = C, B = D."],"Equal.","medium",ch4),
  Q("math8_ch4_pg_q4","math8_ch4_parallelograms","Adjacent angles in parallelogram are…",[c("Supplementary"),e("Equal"),m("Random"),g("Right")],"Co-interior.",["Sum 180."],"Sum 180.","medium",ch4),
  Q("math8_ch4_pg_q5","math8_ch4_parallelograms","Diagonals of parallelogram…",[c("Bisect each other"),e("Equal"),m("Perpendicular"),g("Random")],"Cross at midpoints.",["Each cuts other in half."],"Bisect.","medium",ch4),
  Q("math8_ch4_pg_q6","math8_ch4_parallelograms","Special parallelograms include…",[c("Rectangle, rhombus, square"),e("Trapezium"),m("Random"),g("Kite")],"Special cases.",["Square ⊂ rhombus and rectangle."],"R, R, S.","medium",ch4),
  Q("math8_ch4_pg_q7","math8_ch4_parallelograms","Parallelogram with all right angles is…",[c("Rectangle"),e("Rhombus"),m("Trapezium"),g("Random")],"Definition.",["Right angles → rectangle."],"Rectangle.","medium",ch4),
  Q("math8_ch4_pg_q8","math8_ch4_parallelograms","Parallelogram with all sides equal is…",[c("Rhombus"),e("Rectangle"),m("Trapezium"),g("Random")],"Definition.",["Equal sides → rhombus."],"Rhombus.","medium",ch4),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 8 Math v2 questions (Ch3-4).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
