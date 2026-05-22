import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch7 = "A Tale of Three Intersecting Lines";
const ch8 = "Working with Fractions";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"7", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math7_ch7_tb_q1","math7_ch7_triangle_basics","Triangle has __ sides.",[c("3"),m("4"),g("5"),e("2")],"By definition.",["3 sides + 3 angles."],"3.","easy",ch7),
  Q("math7_ch7_tb_q2","math7_ch7_triangle_basics","Triangle has __ vertices.",[c("3"),m("4"),g("2"),e("6")],"3 corners.",["3 vertices."],"3.","easy",ch7),
  Q("math7_ch7_tb_q3","math7_ch7_triangle_basics","Side opposite to vertex A is…",[c("Side a (BC)"),m("Vertex B"),g("Vertex C"),e("Side b")],"Opposite naming.",["Side opposite = small letter."],"Opposite naming.","medium",ch7),
  Q("math7_ch7_tb_q4","math7_ch7_triangle_basics","Triangle angles sum to:",[c("180°"),m("90°"),g("360°"),e("270°")],"By theorem.",["Always 180°."],"180°.","easy",ch7),
  Q("math7_ch7_tb_q5","math7_ch7_triangle_basics","If 2 angles = 60° and 70°, third = ?",[c("50°"),m("60°"),g("180°"),e("40°")],"180−130.",["180−60−70=50."],"180 − others.","medium",ch7),
  Q("math7_ch7_tb_q6","math7_ch7_triangle_basics","All triangles have at least one…",[c("Acute angle"),e("Right angle"),m("Obtuse"),g("Straight")],"Always at least 2 acute.",["At least 2 acute."],"Acute.","medium",ch7),
  Q("math7_ch7_tb_q7","math7_ch7_triangle_basics","Polygon with fewest sides:",[c("Triangle"),m("Square"),g("Pentagon"),e("Line")],"3 sides minimum.",["Triangle = smallest polygon."],"Triangle.","easy",ch7),
  Q("math7_ch7_tb_q8","math7_ch7_triangle_basics","Triangle inequality: any 2 sides ___ third.",[c("Greater than"),e("Less than"),m("Equal"),g("Random")],"Sum > 3rd.",["a + b > c."],"> third.","medium",ch7),
  Q("math7_ch7_as_q1","math7_ch7_angle_sum","Sum of triangle angles:",[c("180°"),m("90°"),g("360°"),e("270°")],"Theorem.",["Always 180°."],"180°.","easy",ch7),
  Q("math7_ch7_as_q2","math7_ch7_angle_sum","Equilateral triangle each angle:",[c("60°"),m("90°"),g("45°"),e("180°")],"180/3.",["180 ÷ 3 = 60."],"180/3.","medium",ch7),
  Q("math7_ch7_as_q3","math7_ch7_angle_sum","If 2 angles in triangle equal 90° and 30°, third = ?",[c("60°"),m("90°"),g("180°"),e("120°")],"180−120.",["180−90−30=60."],"180 − sum.","medium",ch7),
  Q("math7_ch7_as_q4","math7_ch7_angle_sum","Exterior angle = sum of ___",[c("Two opposite interior angles"),e("Adjacent"),m("Random"),g("All angles")],"Exterior angle theorem.",["Ext = remote interior sum."],"Ext = remote sum.","hard",ch7),
  Q("math7_ch7_as_q5","math7_ch7_angle_sum","If 3 angles = 60°, 60°, 60°, triangle is…",[c("Equilateral"),m("Right"),g("Obtuse"),e("Scalene")],"All equal.",["All 60°."],"Equilateral.","easy",ch7),
  Q("math7_ch7_as_q6","math7_ch7_angle_sum","Sum of 4 angles in quadrilateral:",[c("360°"),m("180°"),g("540°"),e("90°")],"Two triangles.",["Quadrilateral = 2 triangles = 360."],"360°.","medium",ch7),
  Q("math7_ch7_as_q7","math7_ch7_angle_sum","Triangle with 2 angles 50° and 80°: third = ?",[c("50°"),m("80°"),g("180°"),e("90°")],"180−130.",["180−50−80=50."],"180 − sum.","medium",ch7),
  Q("math7_ch7_as_q8","math7_ch7_angle_sum","Right triangle: sum of other two = ?",[c("90°"),m("180°"),g("60°"),e("45°")],"180−90.",["Right angle takes 90°."],"90°.","medium",ch7),
  Q("math7_ch7_tt_q1","math7_ch7_triangle_types","All sides equal triangle:",[c("Equilateral"),m("Isosceles"),g("Scalene"),e("Right")],"All 3 equal.",["Equilateral."],"Equilateral.","easy",ch7),
  Q("math7_ch7_tt_q2","math7_ch7_triangle_types","Two sides equal:",[c("Isosceles"),m("Scalene"),g("Equilateral"),e("Right")],"2 equal sides.",["Isosceles."],"Isosceles.","easy",ch7),
  Q("math7_ch7_tt_q3","math7_ch7_triangle_types","No sides equal:",[c("Scalene"),m("Isosceles"),g("Equilateral"),e("Right")],"All different.",["Scalene."],"Scalene.","easy",ch7),
  Q("math7_ch7_tt_q4","math7_ch7_triangle_types","Triangle with 90° angle:",[c("Right"),m("Obtuse"),g("Acute"),e("Equilateral")],"One right angle.",["90° = right."],"Right.","easy",ch7),
  Q("math7_ch7_tt_q5","math7_ch7_triangle_types","All angles less than 90°:",[c("Acute"),m("Right"),g("Obtuse"),e("Equilateral")],"All acute.",["All < 90°."],"Acute.","easy",ch7),
  Q("math7_ch7_tt_q6","math7_ch7_triangle_types","One angle greater than 90°:",[c("Obtuse"),m("Right"),g("Acute"),e("Random")],"One obtuse.",["One > 90°."],"Obtuse.","medium",ch7),
  Q("math7_ch7_tt_q7","math7_ch7_triangle_types","Equilateral is also…",[c("Isosceles (all sides equal counts as 2 equal too)"),e("Scalene"),m("Right"),g("Obtuse")],"All equal → at least 2 equal.",["Equilateral ⊂ isosceles."],"Subset.","hard",ch7),
  Q("math7_ch7_tt_q8","math7_ch7_triangle_types","Right isosceles: angles?",[c("45-45-90"),m("60-60-60"),g("30-60-90"),e("Random")],"Two 45s and one 90.",["45+45+90=180."],"45-45-90.","hard",ch7),
  Q("math7_ch7_tp_q1","math7_ch7_triangle_properties","Triangle inequality:",[c("Sum of 2 sides > 3rd"),e("Sides equal"),m("Random"),g("Sum = 180")],"Required.",["a+b > c always."],"Sum > 3rd.","medium",ch7),
  Q("math7_ch7_tp_q2","math7_ch7_triangle_properties","Is triangle with sides 3, 4, 8 possible?",[e("Yes"),c("No (3+4=7 < 8)"),m("Sometimes"),g("Cannot tell")],"Inequality violated.",["3+4 = 7 < 8. No."],"Check inequality.","hard",ch7),
  Q("math7_ch7_tp_q3","math7_ch7_triangle_properties","In isosceles, angles opposite equal sides are…",[c("Equal"),e("Different"),m("Sum 180"),g("Random")],"Property.",["Equal sides → equal opposite angles."],"Equal.","medium",ch7),
  Q("math7_ch7_tp_q4","math7_ch7_triangle_properties","Equilateral all angles…",[c("60°"),m("90°"),g("45°"),e("Different")],"By symmetry.",["180/3 = 60."],"60° each.","easy",ch7),
  Q("math7_ch7_tp_q5","math7_ch7_triangle_properties","Exterior angle theorem:",[c("Ext = sum of remote interiors"),e("Ext = sum of all"),m("Random"),g("Ext = 180")],"Theorem.",["Ext = sum of 2 remote."],"Ext = sum 2 remote.","hard",ch7),
  Q("math7_ch7_tp_q6","math7_ch7_triangle_properties","Sides 5, 6, 11: triangle?",[e("Yes"),c("No (5+6=11)"),m("Sometimes"),g("Cannot tell")],"Equality, not inequality.",["5+6=11 not >."],"Strict inequality.","hard",ch7),
  Q("math7_ch7_tp_q7","math7_ch7_triangle_properties","Biggest angle opposite ___ side.",[c("Longest"),e("Shortest"),m("Random"),g("Equal")],"Property.",["Long side opposite big angle."],"Long = big angle.","hard",ch7),
  Q("math7_ch7_tp_q8","math7_ch7_triangle_properties","Smallest angle opposite ___ side.",[c("Shortest"),e("Longest"),m("Random"),g("Equal")],"Property.",["Short side opposite small angle."],"Short = small angle.","hard",ch7),

  Q("math7_ch8_fo_q1","math7_ch8_fraction_operations","½ + ⅓ = ?",[c("5/6"),m("2/5"),g("1"),e("⅙")],"Common 6.",["3/6 + 2/6 = 5/6."],"Common denom.","hard",ch8),
  Q("math7_ch8_fo_q2","math7_ch8_fraction_operations","½ × ⅓ = ?",[c("⅙"),m("⅔"),g("⅚"),e("⅙")],"Top × top, bottom × bottom.",["1×1=1, 2×3=6."],"× both.","medium",ch8),
  Q("math7_ch8_fo_q3","math7_ch8_fraction_operations","½ ÷ ¼ = ?",[c("2"),m("⅛"),g("½"),e("¼")],"× reciprocal.",["½ × 4 = 2."],"× reciprocal.","hard",ch8),
  Q("math7_ch8_fo_q4","math7_ch8_fraction_operations","Same denom: ⅖ + ⅕ = ?",[c("⅗"),m("⅖"),g("⅔"),e("⅗")],"Add tops.",["(2+1)/5 = 3/5."],"Add tops.","easy",ch8),
  Q("math7_ch8_fo_q5","math7_ch8_fraction_operations","Different denom: find ___",[c("Common denominator"),e("Common numerator"),m("Random"),g("Sum")],"Common denom for +/−.",["Common denom first."],"Common denom.","medium",ch8),
  Q("math7_ch8_fo_q6","math7_ch8_fraction_operations","⅔ × ⅗ = ?",[c("⅖"),m("⅙"),g("⅔"),e("⅓")],"6/15 = ⅖.",["6/15 simplify."],"Simplify.","hard",ch8),
  Q("math7_ch8_fo_q7","math7_ch8_fraction_operations","Subtract ¾ − ½:",[c("¼"),m("⅓"),g("⅙"),e("½")],"3/4 − 2/4.",["½ = 2/4."],"Common denom.","medium",ch8),
  Q("math7_ch8_fo_q8","math7_ch8_fraction_operations","Divide ⅔ ÷ ½:",[c("4/3 = 1⅓"),m("⅓"),g("⅙"),e("⅔")],"⅔ × 2 = 4/3.",["× reciprocal."],"× reciprocal.","hard",ch8),
  Q("math7_ch8_mn_q1","math7_ch8_mixed_numbers","2½ as improper:",[c("5/2"),m("4/2"),g("3/2"),e("2/5")],"2×2+1=5.",["× bottom + top."],"× + top.","medium",ch8),
  Q("math7_ch8_mn_q2","math7_ch8_mixed_numbers","7/3 as mixed:",[c("2⅓"),m("3⅓"),g("2⅔"),e("⅓")],"7÷3=2 r 1.",["Quotient + remainder/bottom."],"÷ bottom.","medium",ch8),
  Q("math7_ch8_mn_q3","math7_ch8_mixed_numbers","3¾ in improper:",[c("15/4"),m("12/4"),g("11/4"),e("¾")],"3×4+3=15.",["12+3=15."],"× + top.","medium",ch8),
  Q("math7_ch8_mn_q4","math7_ch8_mixed_numbers","11/2 as mixed:",[c("5½"),m("4½"),g("5"),e("11/2")],"11÷2=5 r 1.",["5 + ½."],"÷.","medium",ch8),
  Q("math7_ch8_mn_q5","math7_ch8_mixed_numbers","Add 1½ + 2½:",[c("4"),m("3"),g("4½"),e("3½")],"3/2 + 5/2 = 8/2 = 4.",["Convert and add."],"Convert + add.","medium",ch8),
  Q("math7_ch8_mn_q6","math7_ch8_mixed_numbers","Improper means top ___ bottom.",[c(">"),e("<"),m("="),g("Random")],"Top bigger.",["Top > bottom = improper."],">.","easy",ch8),
  Q("math7_ch8_mn_q7","math7_ch8_mixed_numbers","Mixed = whole + ___",[c("Proper fraction"),e("Improper"),m("Random"),g("Whole")],"Whole + part.",["Whole + proper."],"+ proper.","medium",ch8),
  Q("math7_ch8_mn_q8","math7_ch8_mixed_numbers","Add 2¼ + 1¾:",[c("4"),m("3"),g("3¾"),e("4¼")],"9/4 + 7/4 = 16/4 = 4.",["Convert + add."],"= 4.","hard",ch8),
  Q("math7_ch8_fw_q1","math7_ch8_fraction_word","½ of 60 students:",[c("30"),m("60"),g("120"),e("20")],"60/2.",["½ × 60 = 30."],"Of = ×.","easy",ch8),
  Q("math7_ch8_fw_q2","math7_ch8_fraction_word","¼ of 100:",[c("25"),m("4"),g("400"),e("50")],"100/4.",["¼ × 100 = 25."],"÷ 4.","easy",ch8),
  Q("math7_ch8_fw_q3","math7_ch8_fraction_word","⅓ of 30 chocolates:",[c("10"),m("15"),g("90"),e("3")],"30/3.",["⅓ × 30."],"÷ 3.","easy",ch8),
  Q("math7_ch8_fw_q4","math7_ch8_fraction_word","¾ of a cake = 9 slices. Total slices?",[c("12"),m("15"),g("9"),e("18")],"¾ × T = 9. T = 12.",["9 ÷ ¾ = 12."],"÷ fraction.","hard",ch8),
  Q("math7_ch8_fw_q5","math7_ch8_fraction_word","'Of' in fraction problems means…",[c("Multiply"),e("Add"),m("Subtract"),g("Divide")],"Of = ×.",["Always × in fraction problems."],"Of = ×.","medium",ch8),
  Q("math7_ch8_fw_q6","math7_ch8_fraction_word","½ + ¼ of cake left:",[c("¾"),m("⅛"),g("½"),e("1⅓")],"2/4 + 1/4 = 3/4.",["Common 4."],"Common denom.","medium",ch8),
  Q("math7_ch8_fw_q7","math7_ch8_fraction_word","Riya read ⅖ of book of 50 pages. Pages read?",[c("20"),m("10"),g("25"),e("30")],"⅖ × 50 = 20.",["2 × 10 = 20."],"× pages.","medium",ch8),
  Q("math7_ch8_fw_q8","math7_ch8_fraction_word","If ½ + ⅓ remain, eaten?",[c("⅙"),m("⅙"),g("½"),e("⅓")],"1 − (½ + ⅓) = 1/6.",["1 − 5/6 = 1/6."],"Total − left.","hard",ch8),
  Q("math7_ch8_fd_q1","math7_ch8_fraction_decimal","½ as decimal:",[c("0.5"),m("0.2"),g("0.05"),e("5")],"1÷2.",["0.5."],"÷ top/bottom.","easy",ch8),
  Q("math7_ch8_fd_q2","math7_ch8_fraction_decimal","¼ as decimal:",[c("0.25"),m("0.4"),g("0.14"),e("0.5")],"1/4.",["0.25."],"÷.","easy",ch8),
  Q("math7_ch8_fd_q3","math7_ch8_fraction_decimal","0.6 as fraction:",[c("3/5"),m("1/2"),g("6/100"),e("6")],"6/10 = 3/5.",["Simplify 6/10."],"Simplify.","medium",ch8),
  Q("math7_ch8_fd_q4","math7_ch8_fraction_decimal","¾ as decimal:",[c("0.75"),m("0.34"),g("0.43"),e("0.7")],"3/4.",["0.75."],"÷.","easy",ch8),
  Q("math7_ch8_fd_q5","math7_ch8_fraction_decimal","0.4 as fraction:",[c("2/5"),m("1/4"),g("4"),e("4/100")],"4/10 = 2/5.",["Simplify."],"Simplify.","medium",ch8),
  Q("math7_ch8_fd_q6","math7_ch8_fraction_decimal","To convert decimal to fraction, use…",[c("Place value"),e("Random"),m("Estimate"),g("Multiply")],"Place value gives fraction.",["0.X = X/10. 0.XX = XX/100."],"Place value.","medium",ch8),
  Q("math7_ch8_fd_q7","math7_ch8_fraction_decimal","To convert fraction to decimal, ___",[c("Divide top by bottom"),e("Add"),m("Multiply"),g("Square")],"Division.",["Top ÷ bottom."],"÷.","easy",ch8),
  Q("math7_ch8_fd_q8","math7_ch8_fraction_decimal","⅓ as decimal:",[c("0.333... (recurring)"),m("0.3"),g("0.33"),e("0.034")],"Repeating.",["1/3 = 0.333..."],"Recurring.","hard",ch8),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 7 Math v2 questions (Ch7-8).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
