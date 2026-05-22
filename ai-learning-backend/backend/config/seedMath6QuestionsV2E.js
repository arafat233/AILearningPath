import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch9 = "Symmetry";
const ch10 = "The Other Side of Zero";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"6", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  // ch9 line_symmetry
  Q("math6_ch9_ls_q1","math6_ch9_line_symmetry","Square has ___ lines of symmetry.",[c("4"),m("2"),g("8"),e("1")],"2 mid + 2 diag.",["V, H, 2 diag = 4."],"4.","medium",ch9),
  Q("math6_ch9_ls_q2","math6_ch9_line_symmetry","Rectangle has ___ lines.",[c("2"),m("4"),g("1"),e("0")],"V + H mid lines.",["No diag (unequal sides)."],"2.","medium",ch9),
  Q("math6_ch9_ls_q3","math6_ch9_line_symmetry","Circle has ___ lines.",[c("Infinite"),m("4"),g("8"),e("None")],"Any diameter.",["Every diameter is a line."],"Infinite.","medium",ch9),
  Q("math6_ch9_ls_q4","math6_ch9_line_symmetry","Letter 'A' has ___ lines.",[c("1"),m("2"),g("3"),e("0")],"Vertical.",["Vertical fold."],"1.","easy",ch9),
  Q("math6_ch9_ls_q5","math6_ch9_line_symmetry","Letter 'F' has ___ lines.",[c("0"),m("1"),g("2"),e("4")],"None.",["F not symmetric."],"0.","medium",ch9),
  Q("math6_ch9_ls_q6","math6_ch9_line_symmetry","Equilateral triangle: ___ lines.",[c("3"),m("1"),g("2"),e("4")],"3 medians.",["Each vertex to midpoint."],"3.","medium",ch9),
  Q("math6_ch9_ls_q7","math6_ch9_line_symmetry","Letter 'H' has ___ lines.",[c("2"),m("1"),g("4"),e("0")],"V + H.",["Both fold work."],"2.","medium",ch9),
  Q("math6_ch9_ls_q8","math6_ch9_line_symmetry","Regular hexagon: ___ lines.",[c("6"),m("3"),g("12"),e("4")],"3 vertex + 3 mid.",["6 axes."],"6.","hard",ch9),
  // ch9 rotational_symmetry
  Q("math6_ch9_rs_q1","math6_ch9_rotational_symmetry","Square: rotational symmetry order = ?",[c("4"),m("2"),g("8"),e("1")],"90° rotations.",["360/90 = 4."],"4.","medium",ch9),
  Q("math6_ch9_rs_q2","math6_ch9_rotational_symmetry","Order = number of ___",[c("Matches per 360°"),e("Sides"),m("Random"),g("Angles")],"By definition.",["Count matches in full turn."],"Matches per 360°.","medium",ch9),
  Q("math6_ch9_rs_q3","math6_ch9_rotational_symmetry","Equilateral triangle order?",[c("3"),m("2"),g("6"),e("1")],"120° rotations.",["360/120 = 3."],"3.","medium",ch9),
  Q("math6_ch9_rs_q4","math6_ch9_rotational_symmetry","Order 1 means…",[c("No rotational symmetry"),e("Two-way"),m("Full"),g("Random")],"Only at 360° (no symmetry).",["Order 1 = no symmetry."],"None.","hard",ch9),
  Q("math6_ch9_rs_q5","math6_ch9_rotational_symmetry","Smallest rotation for square that matches?",[c("90°"),m("180°"),g("45°"),e("60°")],"360/4.",["360/order."],"360/4.","medium",ch9),
  Q("math6_ch9_rs_q6","math6_ch9_rotational_symmetry","Circle order = ?",[c("Infinite"),m("4"),g("8"),e("1")],"Any rotation matches.",["Infinite matches."],"Infinite.","medium",ch9),
  Q("math6_ch9_rs_q7","math6_ch9_rotational_symmetry","Rectangle (non-square) order?",[c("2"),m("4"),g("1"),e("None")],"180° works, 90 doesn't.",["Order 2."],"2.","hard",ch9),
  Q("math6_ch9_rs_q8","math6_ch9_rotational_symmetry","Regular hexagon order?",[c("6"),m("3"),g("12"),e("2")],"60° rotations.",["360/60=6."],"6.","hard",ch9),
  // ch9 point_symmetry
  Q("math6_ch9_ps_q1","math6_ch9_point_symmetry","Point symmetry: rotate 180° around centre matches.",[c("True"),e("False"),m("Sometimes"),g("Random")],"By definition.",["180° rotation."],"180°.","medium",ch9),
  Q("math6_ch9_ps_q2","math6_ch9_point_symmetry","Letter 'S' has point symmetry. T/F?",[c("True"),e("False"),m("Sometimes"),g("Cannot say")],"180° rotation of S = S.",["S rotates to S."],"True.","medium",ch9),
  Q("math6_ch9_ps_q3","math6_ch9_point_symmetry","Letter 'H' has point symmetry. T/F?",[c("True"),e("False"),m("Random"),g("Cannot say")],"Yes.",["H rotates 180° = H."],"True.","medium",ch9),
  Q("math6_ch9_ps_q4","math6_ch9_point_symmetry","Letter 'A' has point symmetry?",[e("True"),c("False"),m("Sometimes"),g("Random")],"No (only line symmetry).",["A rotated 180° = upside-down A, not A."],"False.","medium",ch9),
  Q("math6_ch9_ps_q5","math6_ch9_point_symmetry","Point symmetry = rotational symmetry of order…",[c("2"),m("4"),g("1"),e("Infinite")],"Order 2.",["Match at 180°."],"2.","hard",ch9),
  Q("math6_ch9_ps_q6","math6_ch9_point_symmetry","Symbol 'Z' has point symmetry?",[c("True"),e("False"),m("Sometimes"),g("Cannot say")],"Yes.",["Z 180° = Z."],"True.","medium",ch9),
  Q("math6_ch9_ps_q7","math6_ch9_point_symmetry","Square has point symmetry?",[c("True"),e("False"),m("Sometimes"),g("Cannot say")],"Yes (180° matches).",["Square = order 4 includes order 2."],"True.","medium",ch9),
  Q("math6_ch9_ps_q8","math6_ch9_point_symmetry","Triangle equilateral has point symmetry?",[e("True"),c("False"),m("Sometimes"),g("Random")],"Order 3 only — 180° doesn't match.",["360/3 = 120; 180 not multiple."],"False.","hard",ch9),
  // ch9 symmetric_shapes
  Q("math6_ch9_ss_q1","math6_ch9_symmetric_shapes","Butterfly has ___ symmetry.",[c("Line (vertical axis)"),e("Point"),m("None"),g("Random")],"Wings mirror each other.",["Body = axis of symmetry."],"Line.","easy",ch9),
  Q("math6_ch9_ss_q2","math6_ch9_symmetric_shapes","Pinwheel has ___ symmetry.",[c("Rotational"),e("Line"),m("None"),g("Random")],"Rotates around center.",["Blades same after rotation."],"Rotational.","easy",ch9),
  Q("math6_ch9_ss_q3","math6_ch9_symmetric_shapes","Snowflake usually has ___ symmetry.",[c("6-fold rotational + lines"),e("None"),m("Just line"),g("Random")],"Both types.",["6 arms, lines and rotation."],"Both.","medium",ch9),
  Q("math6_ch9_ss_q4","math6_ch9_symmetric_shapes","Letter 'O' has…",[c("Both (line + rotational)"),e("None"),m("Just line"),g("Just rotational")],"Like circle.",["Multiple lines + rotations."],"Both.","medium",ch9),
  Q("math6_ch9_ss_q5","math6_ch9_symmetric_shapes","Common nature symmetries:",[c("Flowers, leaves, animals"),e("Random"),m("Buildings only"),g("Math only")],"Many.",["Nature is symmetric."],"Many.","easy",ch9),
  Q("math6_ch9_ss_q6","math6_ch9_symmetric_shapes","Mandala has…",[c("Both line and rotational"),e("Just line"),m("Just rotation"),g("None")],"Highly symmetric.",["Both types."],"Both.","medium",ch9),
  Q("math6_ch9_ss_q7","math6_ch9_symmetric_shapes","Asymmetric shape examples:",[c("Scalene triangle, ?"),e("Equilateral"),m("Square"),g("Circle")],"No symmetry.",["Scalene = no equal sides."],"Scalene.","hard",ch9),
  Q("math6_ch9_ss_q8","math6_ch9_symmetric_shapes","Symmetry in architecture:",[c("Common, for beauty + structure"),e("Random"),m("Hide"),g("None")],"Buildings use symmetry.",["Taj Mahal etc."],"Common.","medium",ch9),

  // ch10 negative_numbers
  Q("math6_ch10_nn_q1","math6_ch10_negative_numbers","Negative numbers are…",[c("Below zero"),e("Above zero"),m("Same as zero"),g("Random")],"< 0.",["Left of 0 on number line."],"< 0.","easy",ch10),
  Q("math6_ch10_nn_q2","math6_ch10_negative_numbers","−5 + 5 = ?",[c("0"),m("10"),g("−10"),e("−5")],"Add opposite.",["−5 + 5 = 0."],"Opposite.","easy",ch10),
  Q("math6_ch10_nn_q3","math6_ch10_negative_numbers","Temperature −10°C is…",[c("Below freezing"),e("Above"),m("Same as 10"),g("Random")],"Cold.",["Cold side."],"Below freezing.","easy",ch10),
  Q("math6_ch10_nn_q4","math6_ch10_negative_numbers","Opposite of 7 is…",[c("−7"),m("0"),g("14"),e("1/7")],"Same distance from 0, opposite sign.",["Negate."],"−7.","easy",ch10),
  Q("math6_ch10_nn_q5","math6_ch10_negative_numbers","Compare −3 vs −7. Bigger?",[c("−3"),e("−7"),m("Equal"),g("Cannot say")],"Closer to 0 = bigger.",["−3 > −7 (less negative = bigger)."],"Less negative.","medium",ch10),
  Q("math6_ch10_nn_q6","math6_ch10_negative_numbers","Sum −2 + 7 = ?",[c("5"),m("−5"),g("9"),e("−9")],"Net positive.",["Bigger positive wins."],"5.","medium",ch10),
  Q("math6_ch10_nn_q7","math6_ch10_negative_numbers","Sea level: 0. Below = ?",[c("Negative"),e("Positive"),m("Zero"),g("Random")],"Negative.",["Below 0 = negative."],"Negative.","medium",ch10),
  Q("math6_ch10_nn_q8","math6_ch10_negative_numbers","Negative × Negative = ?",[c("Positive"),e("Negative"),m("Zero"),g("Random")],"Sign rule.",["(−)(−) = +."],"+.","hard",ch10),
  // ch10 number_line
  Q("math6_ch10_nl_q1","math6_ch10_number_line","Number line shows…",[c("All numbers in order"),e("Just integers"),m("Random"),g("Only positives")],"Visual scale.",["From −∞ to +∞."],"All numbers.","easy",ch10),
  Q("math6_ch10_nl_q2","math6_ch10_number_line","On a number line, −2 is ___ of 0.",[c("Left"),e("Right"),m("Above"),g("Below")],"Negative = left.",["Negatives left of 0."],"Left.","easy",ch10),
  Q("math6_ch10_nl_q3","math6_ch10_number_line","Distance between −3 and 3 on line:",[c("6"),m("0"),g("3"),e("−6")],"|3 − (−3)| = 6.",["3 + 3 = 6 units."],"Sum absolute values.","medium",ch10),
  Q("math6_ch10_nl_q4","math6_ch10_number_line","From −2, move right 3. Where?",[c("1"),m("−5"),g("3"),e("−1")],"−2 + 3 = 1.",["Right = +."],"Right = +.","easy",ch10),
  Q("math6_ch10_nl_q5","math6_ch10_number_line","From 5, move left 8. Where?",[c("−3"),m("13"),g("3"),e("−5")],"5 − 8 = −3.",["Left = −."],"Left = −.","medium",ch10),
  Q("math6_ch10_nl_q6","math6_ch10_number_line","Zero is at the ___ of the line.",[c("Middle / centre"),e("Far left"),m("Far right"),g("Random")],"Middle.",["Zero divides + and −."],"Middle.","easy",ch10),
  Q("math6_ch10_nl_q7","math6_ch10_number_line","Bigger number is to the ___ on line.",[c("Right"),e("Left"),m("Above"),g("Below")],"Right = bigger.",["Right > left."],"Right.","medium",ch10),
  Q("math6_ch10_nl_q8","math6_ch10_number_line","Equal intervals on line are…",[c("Same spaced"),e("Random"),m("Bigger right"),g("Variable")],"Uniform.",["Equal spacing."],"Equal.","easy",ch10),
  // ch10 negative_operations
  Q("math6_ch10_no_q1","math6_ch10_negative_operations","5 + (−3) = ?",[c("2"),m("8"),g("−2"),e("−8")],"5−3.",["Adding negative = subtract."],"Subtract.","medium",ch10),
  Q("math6_ch10_no_q2","math6_ch10_negative_operations","4 − (−2) = ?",[c("6"),m("2"),g("−6"),e("−2")],"4+2.",["Subtracting negative = add."],"−(−) = +.","medium",ch10),
  Q("math6_ch10_no_q3","math6_ch10_negative_operations","−3 + (−4) = ?",[c("−7"),m("7"),g("−1"),e("1")],"Both negative add magnitudes.",["−(3+4)=−7."],"Add negatives.","medium",ch10),
  Q("math6_ch10_no_q4","math6_ch10_negative_operations","Subtract negatives: a − (−b) = ?",[c("a + b"),e("a − b"),m("−a + b"),g("−a − b")],"− − = +.",["Two negatives → positive."],"a+b.","medium",ch10),
  Q("math6_ch10_no_q5","math6_ch10_negative_operations","−10 + 4 = ?",[c("−6"),m("6"),g("−14"),e("14")],"Magnitude 6, sign of bigger (negative).",["10 > 4, so negative."],"|diff|, sign of bigger.","medium",ch10),
  Q("math6_ch10_no_q6","math6_ch10_negative_operations","−5 × 2 = ?",[c("−10"),m("10"),g("−3"),e("3")],"Negative × positive.",["(−)(+) = (−)."],"− × +.","medium",ch10),
  Q("math6_ch10_no_q7","math6_ch10_negative_operations","(−4) × (−3) = ?",[c("12"),m("−12"),g("7"),e("−7")],"Both negative.",["(−)(−) = +."],"− × − = +.","medium",ch10),
  Q("math6_ch10_no_q8","math6_ch10_negative_operations","8 − 12 = ?",[c("−4"),m("4"),g("20"),e("−20")],"Smaller − bigger = negative.",["8−12 = −4."],"< 0.","medium",ch10),
  // ch10 real_world_negatives
  Q("math6_ch10_rw_q1","math6_ch10_real_world_negatives","Temperature −5°C means…",[c("5° below freezing"),e("5° above"),m("Random"),g("Zero")],"Cold.",["Below 0°C = negative."],"Below 0.","easy",ch10),
  Q("math6_ch10_rw_q2","math6_ch10_real_world_negatives","Debt of ₹500 = ?",[c("−500"),m("500"),g("0"),e("1000")],"Debt is negative.",["Owe = negative."],"−500.","medium",ch10),
  Q("math6_ch10_rw_q3","math6_ch10_real_world_negatives","Elevation 100 m below sea level?",[c("−100 m"),m("100 m"),g("Zero"),e("Cannot")],"Below sea = negative.",["Below 0 = negative."],"−100.","medium",ch10),
  Q("math6_ch10_rw_q4","math6_ch10_real_world_negatives","Bank balance after withdrawing more than balance?",[c("Negative"),e("Zero"),m("Positive"),g("Random")],"Overdraft.",["Bank shows negative."],"Negative.","medium",ch10),
  Q("math6_ch10_rw_q5","math6_ch10_real_world_negatives","Profit −₹500 means…",[c("Loss of ₹500"),e("Gain"),m("Random"),g("Zero")],"Loss.",["Negative profit = loss."],"Loss.","medium",ch10),
  Q("math6_ch10_rw_q6","math6_ch10_real_world_negatives","Temperature drops 5°C from 3°C. New temp?",[c("−2°C"),m("8°C"),g("−8°C"),e("2°C")],"3 − 5.",["3−5 = −2°C."],"Subtract.","medium",ch10),
  Q("math6_ch10_rw_q7","math6_ch10_real_world_negatives","Time before noon = ?",[c("Negative (in 12-hour)"),e("Positive"),m("Same"),g("Random")],"Could be modelled as negative.",["Pre-noon vs post-noon."],"Negative.","hard",ch10),
  Q("math6_ch10_rw_q8","math6_ch10_real_world_negatives","Dead Sea is at −430 m. Highest mountain +8848 m. Difference?",[c("9278 m"),m("8418 m"),g("8848 m"),e("430 m")],"8848 − (−430) = 9278.",["8848 + 430 = 9278."],"−(−) = +.","hard",ch10),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 6 Math v2 questions (Ch9-10).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
