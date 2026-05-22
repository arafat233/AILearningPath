import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch5 = "Parallel and Intersecting Lines";
const ch6 = "Number Play";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"7", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math7_ch5_pl_q1","math7_ch5_parallel_lines","Parallel lines…",[c("Never meet"),e("Always meet"),m("Cross at 90°"),g("Random")],"Constant distance.",["Equal spacing."],"Never meet.","easy",ch5),
  Q("math7_ch5_pl_q2","math7_ch5_parallel_lines","Symbol for parallel?",[c("||"),m("⊥"),g("="),e("+")],"|| means parallel.",["Two vertical lines."],"||.","easy",ch5),
  Q("math7_ch5_pl_q3","math7_ch5_parallel_lines","Railway tracks are…",[c("Parallel"),e("Perpendicular"),m("Random"),g("Curved")],"Stay same distance.",["Trains need parallel."],"Parallel.","easy",ch5),
  Q("math7_ch5_pl_q4","math7_ch5_parallel_lines","Distance between parallel lines is…",[c("Constant"),e("Random"),m("Decreasing"),g("Zero")],"Always same.",["Same distance always."],"Constant.","medium",ch5),
  Q("math7_ch5_pl_q5","math7_ch5_parallel_lines","Opposite sides of rectangle are…",[c("Parallel"),e("Perpendicular"),m("Random"),g("Crossed")],"Opposite sides parallel.",["Top || bottom, left || right."],"Parallel.","easy",ch5),
  Q("math7_ch5_pl_q6","math7_ch5_parallel_lines","Two lines with same slope are…",[c("Parallel"),e("Perpendicular"),m("Crossed"),g("Random")],"Same slope = parallel.",["Equal slope."],"Same slope.","hard",ch5),
  Q("math7_ch5_pl_q7","math7_ch5_parallel_lines","Parallel lines in 3D space:",[c("Never meet, on same plane"),e("Always meet"),m("Random"),g("Cannot exist")],"Same plane, never meet.",["Same plane required."],"Same plane.","hard",ch5),
  Q("math7_ch5_pl_q8","math7_ch5_parallel_lines","Letters with parallel lines:",[c("H, M, N"),e("A, V"),m("O, C"),g("Random")],"H has 2 verticals.",["H, M, N have parallels."],"H, M, N.","medium",ch5),
  Q("math7_ch5_il_q1","math7_ch5_intersecting_lines","Intersecting lines meet at…",[c("One point"),e("Two points"),m("Many points"),g("No point")],"Single intersection.",["Cross at point."],"One point.","easy",ch5),
  Q("math7_ch5_il_q2","math7_ch5_intersecting_lines","Letter 'X' has __ intersecting lines.",[c("2"),m("4"),g("8"),e("1")],"X = 2 crossing.",["Two lines cross."],"2.","easy",ch5),
  Q("math7_ch5_il_q3","math7_ch5_intersecting_lines","Two intersecting lines form __ angles.",[c("4"),m("2"),g("8"),e("1")],"4 angles at crossing.",["4 angles."],"4.","medium",ch5),
  Q("math7_ch5_il_q4","math7_ch5_intersecting_lines","Sum of all 4 angles at intersection:",[c("360°"),m("180°"),g("90°"),e("270°")],"Full circle.",["Around point = 360°."],"360°.","medium",ch5),
  Q("math7_ch5_il_q5","math7_ch5_intersecting_lines","If one angle = 70°, opposite = ?",[c("70°"),m("110°"),g("90°"),e("180°")],"Vertically opposite.",["Opposite angles equal."],"Equal.","medium",ch5),
  Q("math7_ch5_il_q6","math7_ch5_intersecting_lines","Adjacent angles at intersection sum to:",[c("180°"),m("90°"),g("360°"),e("270°")],"Linear pair.",["Form a line: 180°."],"180°.","medium",ch5),
  Q("math7_ch5_il_q7","math7_ch5_intersecting_lines","Perpendicular intersection: all 4 angles = ?",[c("90°"),m("180°"),g("45°"),e("Different")],"All 4 equal at 90°.",["90° each."],"90° each.","medium",ch5),
  Q("math7_ch5_il_q8","math7_ch5_intersecting_lines","Examples of intersecting lines:",[c("Scissors, junction"),e("Railway"),m("Walls"),g("Stairs")],"Scissors cross.",["Scissors blades cross."],"Crosses.","easy",ch5),
  Q("math7_ch5_ai_q1","math7_ch5_angles_intersection","Vertically opposite angles are…",[c("Equal"),e("Different"),m("Supplementary"),g("Complementary")],"By theorem.",["Always equal."],"Equal.","medium",ch5),
  Q("math7_ch5_ai_q2","math7_ch5_angles_intersection","If one angle is 50°, adjacent = ?",[c("130°"),m("50°"),g("90°"),e("180°")],"Linear pair sums to 180.",["180−50=130."],"180 − angle.","medium",ch5),
  Q("math7_ch5_ai_q3","math7_ch5_angles_intersection","Linear pair sums to:",[c("180°"),m("90°"),g("360°"),e("270°")],"Straight line angle.",["Together form straight line."],"180°.","easy",ch5),
  Q("math7_ch5_ai_q4","math7_ch5_angles_intersection","If a = 60° at intersection, the four angles are:",[c("60, 120, 60, 120"),m("60, 60, 60, 60"),g("60, 90, 60, 90"),e("Random")],"Vertically opposite + linear pair.",["Opposites: 60, 60. Adjacent: 120, 120."],"Pairs.","hard",ch5),
  Q("math7_ch5_ai_q5","math7_ch5_angles_intersection","Vertically opposite angles share a…",[c("Vertex (point), not side"),e("Side"),m("Both"),g("Neither")],"Same vertex, opposite arms.",["Share vertex only."],"Vertex only.","hard",ch5),
  Q("math7_ch5_ai_q6","math7_ch5_angles_intersection","If two lines are perpendicular, all angles =",[c("90°"),m("Various"),g("180°"),e("45°")],"Perpendicular.",["All 4 = 90°."],"All 90°.","medium",ch5),
  Q("math7_ch5_ai_q7","math7_ch5_angles_intersection","Sum of adjacent angles in linear pair:",[c("180°"),m("90°"),g("360°"),e("270°")],"Straight line.",["Linear pair = supplementary."],"180°.","medium",ch5),
  Q("math7_ch5_ai_q8","math7_ch5_angles_intersection","Two angles supplementary:",[c("Sum to 180°"),e("Sum to 90°"),m("Equal"),g("Random")],"Sum to 180°.",["Definition."],"Sum = 180.","medium",ch5),
  Q("math7_ch5_tr_q1","math7_ch5_transversal","Transversal is a line that…",[c("Crosses two or more lines"),e("Is parallel"),m("Is perpendicular"),g("Single line")],"Cuts across.",["Crosses multiple lines."],"Cuts across.","medium",ch5),
  Q("math7_ch5_tr_q2","math7_ch5_transversal","Corresponding angles on parallel lines cut by transversal:",[c("Equal"),e("Sum to 180"),m("Different"),g("Random")],"By theorem.",["Same position on each line."],"Equal.","hard",ch5),
  Q("math7_ch5_tr_q3","math7_ch5_transversal","Alternate angles on parallel lines:",[c("Equal"),e("Different"),m("Sum to 90"),g("Random")],"By theorem.",["Z-shape."],"Equal.","hard",ch5),
  Q("math7_ch5_tr_q4","math7_ch5_transversal","Co-interior angles on parallel lines sum to:",[c("180°"),m("90°"),g("360°"),e("Equal")],"Supplementary.",["Same side of transversal between parallels."],"180°.","hard",ch5),
  Q("math7_ch5_tr_q5","math7_ch5_transversal","Transversal cuts at how many angles per line?",[c("4 each, 8 total"),m("2 each"),g("1 each"),e("8 each")],"4 per intersection × 2 lines.",["8 angles total."],"8 total.","medium",ch5),
  Q("math7_ch5_tr_q6","math7_ch5_transversal","If corresponding angle = 70°, the other corresponding = ?",[c("70°"),m("110°"),g("90°"),e("180°")],"Equal.",["Same as first."],"Equal.","medium",ch5),
  Q("math7_ch5_tr_q7","math7_ch5_transversal","Z-pattern angles are called…",[c("Alternate angles"),e("Corresponding"),m("Co-interior"),g("Adjacent")],"Z-shape.",["Alternate = Z."],"Z = alternate.","hard",ch5),
  Q("math7_ch5_tr_q8","math7_ch5_transversal","F-pattern angles are called…",[c("Corresponding"),e("Alternate"),m("Co-interior"),g("Random")],"F-shape.",["F = corresponding."],"F = corresponding.","hard",ch5),

  Q("math7_ch6_np_q1","math7_ch6_number_patterns","Next: 1, 3, 5, 7, ?",[c("9"),m("8"),g("10"),e("12")],"Odd numbers.",["+2 each."],"+2.","easy",ch6),
  Q("math7_ch6_np_q2","math7_ch6_number_patterns","Pattern 1, 4, 9, 16: rule?",[c("Squares (n²)"),e("+ 3"),m("× 2"),g("Random")],"1², 2², 3², 4².",["Squares."],"Squares.","medium",ch6),
  Q("math7_ch6_np_q3","math7_ch6_number_patterns","Triangular numbers: 1, 3, 6, 10. Next?",[c("15"),m("16"),g("12"),e("14")],"+5.",["Differences: 2,3,4,5."],"Triangular.","hard",ch6),
  Q("math7_ch6_np_q4","math7_ch6_number_patterns","Pattern 2, 4, 8, 16: next?",[c("32"),m("24"),g("18"),e("64")],"× 2.",["Doubling."],"× 2.","easy",ch6),
  Q("math7_ch6_np_q5","math7_ch6_number_patterns","Fibonacci: each =",[c("Sum of 2 previous"),e("Difference"),m("Product"),g("Random")],"By definition.",["F(n) = F(n-1) + F(n-2)."],"Sum 2.","medium",ch6),
  Q("math7_ch6_np_q6","math7_ch6_number_patterns","100, 90, 80, 70: rule?",[c("− 10"),e("+ 10"),m("× 0.9"),g("÷ 10")],"Subtract 10.",["Constant decrease."],"−10.","easy",ch6),
  Q("math7_ch6_np_q7","math7_ch6_number_patterns","To find a pattern, look at…",[c("Differences"),e("Random"),m("Length"),g("Color")],"Differences reveal rule.",["Differences."],"Differences.","easy",ch6),
  Q("math7_ch6_np_q8","math7_ch6_number_patterns","Pattern 1, 8, 27, 64: rule?",[c("Cubes (n³)"),e("+7"),m("× n"),g("Random")],"1³, 2³, 3³, 4³.",["Cubes."],"Cubes.","hard",ch6),
  Q("math7_ch6_ms_q1","math7_ch6_magic_squares","Magic square sums:",[c("Rows, columns, diagonals equal"),e("Random"),m("Just rows"),g("Just columns")],"All equal.",["3 directions."],"All equal.","medium",ch6),
  Q("math7_ch6_ms_q2","math7_ch6_magic_squares","3×3 magic square 1-9: constant?",[c("15"),m("12"),g("9"),e("45")],"45/3.",["Sum 1-9 = 45, ÷3 = 15."],"15.","hard",ch6),
  Q("math7_ch6_ms_q3","math7_ch6_magic_squares","Magic square is __ symmetric.",[c("Often rotationally"),e("Never"),m("Random"),g("Asymmetric")],"Many magic squares have symmetry.",["Common symmetry."],"Rotational.","hard",ch6),
  Q("math7_ch6_ms_q4","math7_ch6_magic_squares","Lo Shu is a classic…",[c("3×3 magic square"),e("Random number"),m("Cube"),g("Pattern")],"Ancient Chinese.",["Famous 3×3."],"Lo Shu.","hard",ch6),
  Q("math7_ch6_ms_q5","math7_ch6_magic_squares","All rows in magic square sum to:",[c("Same constant"),e("Different"),m("Zero"),g("Random")],"Constant sum.",["Same value."],"Same.","easy",ch6),
  Q("math7_ch6_ms_q6","math7_ch6_magic_squares","To check magic square:",[c("Sum each direction"),e("Just look"),m("Random"),g("Count digits")],"Verify sums.",["Sum rows/cols/diag."],"Sum each.","medium",ch6),
  Q("math7_ch6_ms_q7","math7_ch6_magic_squares","Centre of 3×3 magic square (1-9) is:",[c("5"),m("1"),g("9"),e("3")],"Centre = magic / 3 = 5.",["Magic constant ÷ 3 = 5."],"Centre = 5.","hard",ch6),
  Q("math7_ch6_ms_q8","math7_ch6_magic_squares","Magic squares teach…",[c("Number patterns and symmetry"),e("Random"),m("Just numbers"),g("Colors")],"Math patterns.",["Patterns."],"Patterns.","medium",ch6),
  Q("math7_ch6_pz_q1","math7_ch6_number_puzzles","Number trick: pick N, do ops, get fixed result.",[c("Yes, possible"),e("Impossible"),m("Random"),g("Cannot say")],"Algebra tricks.",["Algebraic identities."],"Yes.","medium",ch6),
  Q("math7_ch6_pz_q2","math7_ch6_number_puzzles","Pick N, double it, add 6, halve, subtract N. Result?",[c("3"),m("Original"),g("0"),e("Random")],"2N → 2N+6 → N+3 → 3.",["x→2x→2x+6→x+3→3."],"Always 3.","hard",ch6),
  Q("math7_ch6_pz_q3","math7_ch6_number_puzzles","Pick a digit, multiply by 9, sum the digits. Result?",[c("9"),m("Original"),g("Random"),e("18")],"Multiples of 9 digit sum to 9.",["1×9=9, 2×9=18 (1+8=9), etc."],"9.","hard",ch6),
  Q("math7_ch6_pz_q4","math7_ch6_number_puzzles","Number puzzles reveal…",[c("Patterns and rules"),e("Random"),m("Magic"),g("None")],"Hidden patterns.",["Pattern reveal."],"Patterns.","medium",ch6),
  Q("math7_ch6_pz_q5","math7_ch6_number_puzzles","Palindromic number:",[c("Reads same forward and backward"),e("Random"),m("Equal"),g("Cannot say")],"Like 121, 1331.",["Same both ways."],"Same both ways.","medium",ch6),
  Q("math7_ch6_pz_q6","math7_ch6_number_puzzles","Pick N, add 5, multiply by 2, subtract 10. Result?",[c("2N"),m("N"),g("0"),e("Random")],"(N+5)×2−10 = 2N.",["Algebra: 2N+10−10."],"2N.","hard",ch6),
  Q("math7_ch6_pz_q7","math7_ch6_number_puzzles","Pascal's triangle entries are…",[c("Sums of 2 above"),e("Random"),m("Multiples"),g("Squares")],"Each = sum above.",["Add two above."],"Sum 2 above.","hard",ch6),
  Q("math7_ch6_pz_q8","math7_ch6_number_puzzles","Number puzzles develop…",[c("Logical thinking"),e("Hide things"),m("Random"),g("Color sense")],"Logic.",["Logic."],"Logic.","easy",ch6),
  Q("math7_ch6_dv_q1","math7_ch6_divisibility","Divisible by 2 if…",[c("Ends in 0/2/4/6/8"),e("Sum even"),m("Ends 5"),g("Random")],"Even ending.",["Last digit even."],"Even ending.","easy",ch6),
  Q("math7_ch6_dv_q2","math7_ch6_divisibility","Divisible by 3 if…",[c("Digit sum ÷ 3"),e("Ends 3"),m("Random"),g("Even")],"Sum of digits test.",["Sum digits."],"Digit sum.","medium",ch6),
  Q("math7_ch6_dv_q3","math7_ch6_divisibility","Divisible by 5 if…",[c("Ends in 0 or 5"),e("Ends 1"),m("Even"),g("Random")],"Multiples of 5.",["Last digit 0 or 5."],"0 or 5.","easy",ch6),
  Q("math7_ch6_dv_q4","math7_ch6_divisibility","Divisible by 9 if…",[c("Digit sum ÷ 9"),e("Ends 9"),m("Random"),g("Even")],"Sum test.",["Digit sum ÷ 9."],"Digit sum.","medium",ch6),
  Q("math7_ch6_dv_q5","math7_ch6_divisibility","Is 234 ÷ 3?",[c("Yes (2+3+4=9)"),e("No"),m("Sometimes"),g("Cannot tell")],"Sum 9 ÷ 3.",["2+3+4=9, 9÷3."],"Sum test.","medium",ch6),
  Q("math7_ch6_dv_q6","math7_ch6_divisibility","Is 720 ÷ 9?",[c("Yes (sum=9)"),e("No"),m("Sometimes"),g("Cannot tell")],"7+2+0=9.",["Sum 9 ÷ 9."],"Sum test.","medium",ch6),
  Q("math7_ch6_dv_q7","math7_ch6_divisibility","Divisible by 10 if…",[c("Ends in 0"),m("Ends 5"),g("Random"),e("Sum 10")],"Trailing 0.",["End = 0."],"Ends 0.","easy",ch6),
  Q("math7_ch6_dv_q8","math7_ch6_divisibility","Is 125 ÷ 5?",[c("Yes (ends 5)"),e("No"),m("Sometimes"),g("Cannot say")],"Ends 5.",["125 ends in 5."],"Ends 5.","easy",ch6),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 7 Math v2 questions (Ch5-6).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
