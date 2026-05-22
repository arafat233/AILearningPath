import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch1 = "Patterns in Mathematics";
const ch2 = "Lines and Angles";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"6", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  // ch1 number_patterns
  Q("math6_ch1_np_q1","math6_ch1_number_patterns","Next: 5, 10, 15, 20, ?",[c("25"),m("21"),g("30"),e("100")],"+5 each.",["Rule: +5."],"+5.","easy",ch1),
  Q("math6_ch1_np_q2","math6_ch1_number_patterns","Pattern 2, 4, 8, 16: rule?",[m("+2"),c("× 2"),g("− 2"),e("÷ 2")],"Doubling.",["Each = prev × 2."],"× 2.","medium",ch1),
  Q("math6_ch1_np_q3","math6_ch1_number_patterns","Next: 1, 4, 9, 16, ?",[c("25"),m("20"),g("36"),e("32")],"Squares: 1², 2², 3², 4², 5².",["Square numbers."],"n².","hard",ch1),
  Q("math6_ch1_np_q4","math6_ch1_number_patterns","Differences method finds…",[c("Pattern rule"),e("Random"),m("Sum"),g("Average")],"Differences reveal additive rule.",["Diff = +rule."],"Diff method.","medium",ch1),
  Q("math6_ch1_np_q5","math6_ch1_number_patterns","Next: 100, 90, 80, 70, ?",[c("60"),m("75"),g("65"),e("50")],"−10 each.",["−10."],"−10.","easy",ch1),
  Q("math6_ch1_np_q6","math6_ch1_number_patterns","Next: 3, 9, 27, ?",[c("81"),m("54"),g("90"),e("36")],"× 3.",["27 × 3 = 81."],"× 3.","medium",ch1),
  Q("math6_ch1_np_q7","math6_ch1_number_patterns","Missing: 5, 10, ?, 20, 25",[c("15"),m("12"),g("18"),e("16")],"+5.",["+5 each."],"+5.","easy",ch1),
  Q("math6_ch1_np_q8","math6_ch1_number_patterns","Pattern 1, 8, 27, 64: rule?",[c("Cubes (n³)"),m("+ 7"),g("× 8"),e("× n")],"1³, 2³, 3³, 4³.",["Cubes!"],"Cubes.","hard",ch1),
  // ch1 shape_patterns
  Q("math6_ch1_sp_q1","math6_ch1_shape_patterns","Pattern □△□△□___?",[c("△"),e("□"),m("○"),g("Cannot tell")],"Unit □△.",["Repeat unit."],"Unit + repeat.","easy",ch1),
  Q("math6_ch1_sp_q2","math6_ch1_shape_patterns","Repeating block called…",[c("Unit"),e("End"),m("Random"),g("Total")],"Unit = repeating block.",["Block name = unit."],"Unit.","easy",ch1),
  Q("math6_ch1_sp_q3","math6_ch1_shape_patterns","Pattern AABBAABB: unit length?",[c("4 (AABB)"),m("2"),g("8"),e("1")],"AABB repeats.",["Smallest repeat."],"4.","medium",ch1),
  Q("math6_ch1_sp_q4","math6_ch1_shape_patterns","Continue: ○□△○□△ ___?",[c("○"),m("□"),g("△"),e("⭐")],"After △ restart with ○.",["Unit ○□△."],"Restart unit.","medium",ch1),
  Q("math6_ch1_sp_q5","math6_ch1_shape_patterns","7th in ABABAB?",[c("A"),e("B"),m("AB"),g("Cannot say")],"Odd positions = A.",["A or B by position."],"Position cycle.","hard",ch1),
  Q("math6_ch1_sp_q6","math6_ch1_shape_patterns","Pattern ⭐⭐○⭐⭐○: count ⭐ per unit?",[m("1"),c("2"),g("3"),e("6")],"⭐⭐○ unit: 2 ⭐.",["Count in unit."],"Per unit.","medium",ch1),
  Q("math6_ch1_sp_q7","math6_ch1_shape_patterns","To find pattern, find…",[c("Smallest repeating block"),e("Whole pattern"),m("Random shape"),g("Last shape")],"Smallest block = unit.",["Minimum repeat."],"Smallest repeat.","medium",ch1),
  Q("math6_ch1_sp_q8","math6_ch1_shape_patterns","Patterns can be in…",[c("Numbers, shapes, sounds"),e("Only numbers"),m("Only shapes"),g("Random")],"All sequences.",["Patterns everywhere."],"Everywhere.","easy",ch1),
  // ch1 fibonacci
  Q("math6_ch1_fi_q1","math6_ch1_fibonacci","Fibonacci: each is sum of…",[c("Previous two"),e("Previous three"),m("All before"),g("Random")],"By definition.",["F(n) = F(n-1) + F(n-2)."],"Sum prev 2.","medium",ch1),
  Q("math6_ch1_fi_q2","math6_ch1_fibonacci","Fibonacci: 1, 1, 2, 3, 5, 8, ?",[c("13"),m("11"),g("15"),e("12")],"5+8=13.",["5+8=13."],"Add prev 2.","medium",ch1),
  Q("math6_ch1_fi_q3","math6_ch1_fibonacci","Start 2, 3. Next 3 terms?",[c("5, 8, 13"),m("4, 5, 6"),g("6, 9, 12"),e("3, 6, 9")],"2+3=5, 3+5=8, 5+8=13.",["Each = prev sum."],"Sum prev 2.","medium",ch1),
  Q("math6_ch1_fi_q4","math6_ch1_fibonacci","Fibonacci appears in…",[c("Sunflowers, pinecones"),e("Random"),m("Squares"),g("Buildings")],"Nature shows Fibonacci.",["Spiral patterns in nature."],"Nature.","hard",ch1),
  Q("math6_ch1_fi_q5","math6_ch1_fibonacci","Is 1, 2, 4, 7 Fibonacci?",[e("Yes"),c("No"),m("Sometimes"),g("Cannot tell")],"1+2=3 ≠ 4. Not Fibonacci.",["Test: 1+2=3, not 4."],"Test sum.","medium",ch1),
  Q("math6_ch1_fi_q6","math6_ch1_fibonacci","Fibonacci 6th term (1,1,2,3,5,?)?",[c("8"),m("9"),g("10"),e("13")],"3+5=8.",["3+5=8."],"Sum.","easy",ch1),
  Q("math6_ch1_fi_q7","math6_ch1_fibonacci","Ratio of consecutive Fibonacci approaches…",[c("Golden ratio (~1.618)"),e("1"),m("0"),g("2")],"As n→∞, F(n+1)/F(n) → φ.",["Golden ratio limit."],"Golden ratio.","hard",ch1),
  Q("math6_ch1_fi_q8","math6_ch1_fibonacci","Start 1, 1. 7th term?",[c("13"),m("12"),g("15"),e("21")],"1,1,2,3,5,8,13.",["List 7 terms."],"Build list.","medium",ch1),
  // ch1 pattern_rules
  Q("math6_ch1_pr_q1","math6_ch1_pattern_rules","Rule for 2, 6, 18, 54?",[c("× 3"),m("+ 4"),g("− 12"),e("× 2")],"Ratio 3.",["6/2=3.","18/6=3."],"× 3.","medium",ch1),
  Q("math6_ch1_pr_q2","math6_ch1_pattern_rules","100, 90, 80, 70 rule?",[c("− 10"),m("+ 10"),g("× 0.9"),e("÷ 10")],"−10.",["Constant decrease."],"−10.","easy",ch1),
  Q("math6_ch1_pr_q3","math6_ch1_pattern_rules","To find rule: try…",[c("+, −, ×, ÷"),e("Color"),m("Random"),g("Single op only")],"Test operations.",["Try multiple operations."],"Try all.","medium",ch1),
  Q("math6_ch1_pr_q4","math6_ch1_pattern_rules","Apply '× 2' from 3: 3, ?, ?, ?",[c("6, 12, 24"),m("5, 7, 9"),g("9, 27, 81"),e("3, 6, 12")],"× 2 each.",["3×2=6, 6×2=12, 12×2=24."],"Iterate.","medium",ch1),
  Q("math6_ch1_pr_q5","math6_ch1_pattern_rules","Rule for 1, 4, 9, 16?",[c("n² (squares)"),e("+ 3"),m("× n"),g("Random")],"Squares.",["1², 2², 3², 4²."],"Squares.","hard",ch1),
  Q("math6_ch1_pr_q6","math6_ch1_pattern_rules","Apply '−5' from 50: 50, ?, ?, ?",[c("45, 40, 35"),m("55, 60, 65"),g("45, 50, 55"),e("50, 45, 40")],"−5 each.",["50, 45, 40, 35."],"Subtract.","easy",ch1),
  Q("math6_ch1_pr_q7","math6_ch1_pattern_rules","Test rule on…",[c("Every given term"),e("Just first"),m("Random"),g("Last only")],"All terms verify.",["Each must fit."],"All terms.","medium",ch1),
  Q("math6_ch1_pr_q8","math6_ch1_pattern_rules","Rule for 1, 8, 27, 64?",[c("n³ (cubes)"),m("× 8"),g("+ 7"),e("Random")],"Cubes.",["1³, 2³, 3³, 4³."],"Cubes.","hard",ch1),

  // ch2 lines_types
  Q("math6_ch2_lt_q1","math6_ch2_lines_types","A line segment has…",[c("2 endpoints"),e("1 endpoint"),m("No endpoint"),g("3 endpoints")],"Segment = bounded.",["Segment has 2 fixed endpoints."],"2 endpoints.","easy",ch2),
  Q("math6_ch2_lt_q2","math6_ch2_lines_types","A ray has…",[c("1 endpoint, extends infinitely"),e("2 endpoints"),m("No endpoints"),g("3 endpoints")],"Ray = start + infinite direction.",["1 fixed point + 1 infinite."],"1 endpoint.","medium",ch2),
  Q("math6_ch2_lt_q3","math6_ch2_lines_types","A line is…",[c("Infinite in both directions"),e("Bounded"),m("Curved"),g("A point")],"Line = no endpoints.",["Extends both ways infinitely."],"Infinite.","easy",ch2),
  Q("math6_ch2_lt_q4","math6_ch2_lines_types","Symbol AB̅ usually means…",[c("Line segment"),e("Line"),m("Ray"),g("Point")],"Bar over AB = segment.",["AB̅ = segment."],"Bar = segment.","medium",ch2),
  Q("math6_ch2_lt_q5","math6_ch2_lines_types","Symbol AB→ means…",[c("Ray"),e("Line"),m("Segment"),g("Point")],"Arrow = ray.",["AB→ = ray starting at A."],"Arrow = ray.","medium",ch2),
  Q("math6_ch2_lt_q6","math6_ch2_lines_types","Light beam from torch is like a…",[c("Ray"),e("Segment"),m("Line"),g("Curve")],"Starts at source, extends.",["Source + direction = ray."],"Light = ray.","easy",ch2),
  Q("math6_ch2_lt_q7","math6_ch2_lines_types","Edge of a ruler is a…",[c("Line segment"),e("Line"),m("Ray"),g("Curve")],"Bounded between two ends.",["Has 2 endpoints."],"Edge = segment.","easy",ch2),
  Q("math6_ch2_lt_q8","math6_ch2_lines_types","Which extends infinitely both ways?",[c("Line"),e("Segment"),m("Ray"),g("Point")],"Line.",["No endpoints."],"Line infinite.","easy",ch2),
  // ch2 angles_types
  Q("math6_ch2_at_q1","math6_ch2_angles_types","45° is…",[c("Acute"),e("Right"),m("Obtuse"),g("Straight")],"< 90°.",["Acute < 90°."],"Acute.","easy",ch2),
  Q("math6_ch2_at_q2","math6_ch2_angles_types","Right angle = ?",[c("90°"),m("45°"),g("180°"),e("60°")],"Right = 90°.",["Right = 90°."],"90°.","easy",ch2),
  Q("math6_ch2_at_q3","math6_ch2_angles_types","Obtuse is between…",[m("0-90"),c("90-180"),g("180-360"),e("Exactly 90")],"Obtuse: 90 < x < 180.",["Wide angles."],"90-180.","medium",ch2),
  Q("math6_ch2_at_q4","math6_ch2_angles_types","Straight angle = ?",[m("90°"),c("180°"),g("360°"),e("45°")],"Half turn.",["180° = half rotation."],"180°.","easy",ch2),
  Q("math6_ch2_at_q5","math6_ch2_angles_types","Reflex angle is > ?",[c("180°"),m("90°"),g("360°"),e("45°")],"Beyond straight.",["180 < reflex < 360."],"> 180°.","hard",ch2),
  Q("math6_ch2_at_q6","math6_ch2_angles_types","120° is…",[e("Acute"),m("Right"),c("Obtuse"),g("Reflex")],"90 < 120 < 180.",["Obtuse range."],"Obtuse.","medium",ch2),
  Q("math6_ch2_at_q7","math6_ch2_angles_types","Full angle = ?",[m("180°"),c("360°"),g("90°"),e("270°")],"Full turn = 360°.",["Complete circle."],"360°.","medium",ch2),
  Q("math6_ch2_at_q8","math6_ch2_angles_types","60° is…",[c("Acute"),m("Right"),g("Obtuse"),e("Straight")],"< 90°.",["Acute < 90°."],"Acute.","easy",ch2),
  // ch2 parallel_perpendicular
  Q("math6_ch2_pp_q1","math6_ch2_parallel_perpendicular","Parallel lines…",[c("Never meet"),e("Always meet"),m("Cross at 90°"),g("Random")],"Constant distance.",["Same distance apart always.","No intersection."],"Never meet.","medium",ch2),
  Q("math6_ch2_pp_q2","math6_ch2_parallel_perpendicular","Perpendicular lines meet at…",[c("90°"),m("45°"),g("180°"),e("60°")],"Definition.",["Perp = 90° intersection."],"90°.","easy",ch2),
  Q("math6_ch2_pp_q3","math6_ch2_parallel_perpendicular","Railway tracks are…",[c("Parallel"),e("Perpendicular"),m("Curved"),g("Random")],"Stay equal distance.",["Trains need parallel tracks."],"Parallel.","easy",ch2),
  Q("math6_ch2_pp_q4","math6_ch2_parallel_perpendicular","Letter 'T' has…",[c("Perpendicular lines"),e("Parallel"),m("Both"),g("Neither")],"T = horizontal + vertical = perp.",["Horizontal meets vertical at 90°."],"Perpendicular.","medium",ch2),
  Q("math6_ch2_pp_q5","math6_ch2_parallel_perpendicular","Letter 'H' has…",[c("Parallel and perpendicular"),e("Only parallel"),m("Only perp"),g("Neither")],"H has 2 verticals (parallel) connected by horizontal (perp).",["Verticals parallel.","Horizontal perp to them."],"Both.","hard",ch2),
  Q("math6_ch2_pp_q6","math6_ch2_parallel_perpendicular","Tools to verify perpendicular?",[c("Set square / protractor"),e("Ruler only"),m("Compass"),g("Random")],"Set square has 90°.",["Set square or protractor."],"Set square.","medium",ch2),
  Q("math6_ch2_pp_q7","math6_ch2_parallel_perpendicular","Two roads cross at a junction. If junction is L-shape, roads are…",[c("Perpendicular"),e("Parallel"),m("Slanted"),g("Random")],"L = 90°.",["L shape = perpendicular."],"Perp.","medium",ch2),
  Q("math6_ch2_pp_q8","math6_ch2_parallel_perpendicular","Parallel lines have ___ slope.",[c("Same"),e("Different"),m("Random"),g("Zero always")],"Same slope = parallel.",["Equal slope = parallel."],"Same slope.","hard",ch2),
  // ch2 measuring_angles
  Q("math6_ch2_ma_q1","math6_ch2_measuring_angles","Tool to measure angles?",[m("Ruler"),c("Protractor"),g("Compass"),e("Scale")],"Protractor measures degrees.",["Designed for angles."],"Protractor.","easy",ch2),
  Q("math6_ch2_ma_q2","math6_ch2_measuring_angles","Standard protractor: 0 to…",[m("90"),c("180"),g("360"),e("100")],"Half-circle.",["180°."],"0-180.","easy",ch2),
  Q("math6_ch2_ma_q3","math6_ch2_measuring_angles","Centre of protractor goes on…",[c("Vertex of angle"),m("One arm"),g("Bisector"),e("Far point")],"Vertex aligns with centre.",["Centre = vertex."],"Vertex.","medium",ch2),
  Q("math6_ch2_ma_q4","math6_ch2_measuring_angles","Protractor has __ scales?",[c("2 (inner and outer)"),e("1"),m("4"),g("3")],"Two scales for direction.",["Use correct scale matching start arm."],"2 scales.","medium",ch2),
  Q("math6_ch2_ma_q5","math6_ch2_measuring_angles","Each small division = ?",[c("1°"),m("5°"),g("10°"),e("90°")],"1° smallest.",["Smallest = 1°."],"1°.","medium",ch2),
  Q("math6_ch2_ma_q6","math6_ch2_measuring_angles","Read scale matching ___ arm.",[c("Starting"),e("Last"),m("Either"),g("Vertex")],"Match scale start with starting arm.",["Choose 0 on starting arm."],"Starting arm.","hard",ch2),
  Q("math6_ch2_ma_q7","math6_ch2_measuring_angles","To draw 30° angle, you…",[c("Place protractor; mark 30°; draw"),e("Random"),m("Use ruler"),g("Compass alone")],"Use protractor for accuracy.",["Place + mark + draw."],"Protractor.","medium",ch2),
  Q("math6_ch2_ma_q8","math6_ch2_measuring_angles","For angles > 180°, use…",[c("Subtract from 360°"),e("Cannot measure"),m("Random"),g("Halve it")],"Reflex angles via complement.",["360 − measured."],"360 − x.","hard",ch2),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 6 Math v2 questions (Ch1-2).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
