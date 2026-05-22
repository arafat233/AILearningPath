import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch9 = "The Baudhayana-Pythagoras Theorem";
const ch10 = "Proportional Reasoning - 2";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"8", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math8_ch9_rt_q1","math8_ch9_right_triangle","Right triangle has __ angle equal to 90°.",[c("One"),m("Two"),g("Three"),e("None")],"By definition.",["Exactly one right angle."],"One 90°.","easy",ch9),
  Q("math8_ch9_rt_q2","math8_ch9_right_triangle","Hypotenuse is the…",[c("Longest side, opposite right angle"),e("Shortest"),m("Random"),g("Same as base")],"Definition.",["Across right angle."],"Longest = hypotenuse.","medium",ch9),
  Q("math8_ch9_rt_q3","math8_ch9_right_triangle","Other 2 sides of right triangle are called…",[c("Legs"),e("Hypotenuses"),m("Random"),g("Base only")],"Forming right angle.",["Two legs meet at right angle."],"Legs.","medium",ch9),
  Q("math8_ch9_rt_q4","math8_ch9_right_triangle","Sum of other 2 angles in right triangle:",[c("90°"),m("180°"),g("60°"),e("45°")],"180 − 90.",["180 − 90 = 90."],"90°.","medium",ch9),
  Q("math8_ch9_rt_q5","math8_ch9_right_triangle","Identify right triangle by:",[c("Right angle marker"),e("Random"),m("Color"),g("Cannot")],"Symbol.",["Small square at corner."],"Square symbol.","easy",ch9),
  Q("math8_ch9_rt_q6","math8_ch9_right_triangle","If one acute = 30°, other = ?",[c("60°"),m("30°"),g("90°"),e("180°")],"180−90−30.",["90−30=60."],"180 − 90 − x.","medium",ch9),
  Q("math8_ch9_rt_q7","math8_ch9_right_triangle","Can a right triangle be equilateral?",[e("Yes"),c("No"),m("Sometimes"),g("Cannot say")],"Equilateral = 60° each.",["Right requires 90°."],"No.","hard",ch9),
  Q("math8_ch9_rt_q8","math8_ch9_right_triangle","Isosceles right triangle angles:",[c("45-45-90"),m("30-60-90"),g("60-60-60"),e("Random")],"Two equal + 90.",["180−90 = 90, split."],"45-45-90.","hard",ch9),
  Q("math8_ch9_pt_q1","math8_ch9_pythagoras_theorem","Pythagoras: a² + b² = ?",[c("c² (hypotenuse²)"),m("c"),g("2c"),e("Random")],"Standard.",["Sum of squares = hypotenuse²."],"c².","easy",ch9),
  Q("math8_ch9_pt_q2","math8_ch9_pythagoras_theorem","3² + 4² = ?",[c("5² = 25"),m("12"),g("7"),e("9")],"9+16=25.",["c² = 25, c = 5."],"Pythagorean triple.","easy",ch9),
  Q("math8_ch9_pt_q3","math8_ch9_pythagoras_theorem","Hypotenuse with legs 6, 8:",[c("10"),m("14"),g("100"),e("48")],"36+64=100.",["√100=10."],"Pythagoras.","medium",ch9),
  Q("math8_ch9_pt_q4","math8_ch9_pythagoras_theorem","Pythagorean triple (3,4,5):",[c("Yes (3²+4²=5²)"),e("No"),m("Sometimes"),g("Cannot say")],"Classic.",["9+16=25."],"3-4-5.","easy",ch9),
  Q("math8_ch9_pt_q5","math8_ch9_pythagoras_theorem","Another triple (5,12,?):",[c("13"),m("17"),g("12"),e("15")],"25+144=169.",["√169=13."],"5-12-13.","medium",ch9),
  Q("math8_ch9_pt_q6","math8_ch9_pythagoras_theorem","Theorem applies only to…",[c("Right triangles"),e("All triangles"),m("Equilateral"),g("Random")],"Right triangle property.",["Right angle required."],"Right triangles.","medium",ch9),
  Q("math8_ch9_pt_q7","math8_ch9_pythagoras_theorem","8-15-? triple:",[c("17"),m("18"),g("23"),e("13")],"64+225=289=17².",["√289=17."],"8-15-17.","hard",ch9),
  Q("math8_ch9_pt_q8","math8_ch9_pythagoras_theorem","Verify triangle 5,12,13 is right:",[c("5²+12²=13² ✓"),m("Not right"),g("Equilateral"),e("Random")],"25+144=169=13².",["Pythagoras holds."],"Verify.","medium",ch9),
  Q("math8_ch9_pa_q1","math8_ch9_pythagoras_applications","Ladder leans on wall. Bottom 3m from wall, ladder 5m. Wall height it reaches?",[c("4m"),m("8m"),g("2m"),e("4")],"5²−3²=16.",["√16=4."],"Pythagoras.","medium",ch9),
  Q("math8_ch9_pa_q2","math8_ch9_pythagoras_applications","Find missing leg if hypotenuse 13, leg 12:",[c("5"),m("25"),g("1"),e("169")],"169−144=25.",["√25=5."],"Pythagoras.","medium",ch9),
  Q("math8_ch9_pa_q3","math8_ch9_pythagoras_applications","Distance from (0,0) to (3,4):",[c("5"),m("7"),g("12"),e("25")],"3²+4²=25.",["√25=5."],"Distance formula.","medium",ch9),
  Q("math8_ch9_pa_q4","math8_ch9_pythagoras_applications","Pythagoras useful for…",[c("Finding distances and sides"),e("Random"),m("Volume"),g("None")],"Geometry.",["Sides and distances."],"Sides/distances.","easy",ch9),
  Q("math8_ch9_pa_q5","math8_ch9_pythagoras_applications","Diagonal of 6×8 rectangle:",[c("10"),m("14"),g("48"),e("100")],"Use Pythagoras.",["√(36+64) = 10."],"Pythagoras.","medium",ch9),
  Q("math8_ch9_pa_q6","math8_ch9_pythagoras_applications","Diagonal of unit square:",[c("√2 ≈ 1.41"),m("1"),g("2"),e("√3")],"1²+1²=2.",["√2."],"√2.","hard",ch9),
  Q("math8_ch9_pa_q7","math8_ch9_pythagoras_applications","Wall 9m, base 12m. Diagonal?",[c("15m"),m("21m"),g("3m"),e("Random")],"81+144=225.",["√225=15."],"Pythagoras.","medium",ch9),
  Q("math8_ch9_pa_q8","math8_ch9_pythagoras_applications","Need hypotenuse? Add ___",[c("Squares of legs, then √"),e("Legs directly"),m("Random"),g("Subtract")],"Pythagoras.",["c² = a² + b²."],"Squares + √.","medium",ch9),
  Q("math8_ch9_pd_q1","math8_ch9_pythagoras_distances","Find distance between (0,0) and (5,12):",[c("13"),m("17"),g("7"),e("60")],"5²+12²=169.",["√169=13."],"Distance.","medium",ch9),
  Q("math8_ch9_pd_q2","math8_ch9_pythagoras_distances","Distance formula: d = ?",[c("√((x₂-x₁)²+(y₂-y₁)²)"),e("Random"),m("|x₂-x₁|"),g("Sum")],"Pythagoras applied.",["Coordinates → distance."],"Pythagorean distance.","hard",ch9),
  Q("math8_ch9_pd_q3","math8_ch9_pythagoras_distances","Distance (1,1) to (4,5):",[c("5"),m("7"),g("3"),e("25")],"3²+4²=25.",["√25=5."],"Distance.","medium",ch9),
  Q("math8_ch9_pd_q4","math8_ch9_pythagoras_distances","Distance from (0,0) to (a,b):",[c("√(a²+b²)"),e("a+b"),m("|a-b|"),g("Random")],"Pythagorean.",["Origin to (a,b)."],"√(a²+b²).","medium",ch9),
  Q("math8_ch9_pd_q5","math8_ch9_pythagoras_distances","Straight line distance vs path:",[c("Pythagoras gives straight"),e("Path"),m("Random"),g("Same")],"Direct = hypotenuse.",["Diagonal shortest."],"Diagonal.","hard",ch9),
  Q("math8_ch9_pd_q6","math8_ch9_pythagoras_distances","Distance is always…",[c("Non-negative"),e("Random"),m("Negative"),g("Zero")],"Cannot be negative.",["√ gives non-negative."],"≥ 0.","medium",ch9),
  Q("math8_ch9_pd_q7","math8_ch9_pythagoras_distances","Distance (2,3) to (5,7):",[c("5"),m("7"),g("3"),e("25")],"3²+4²=25.",["√(9+16)=5."],"Pythagoras.","medium",ch9),
  Q("math8_ch9_pd_q8","math8_ch9_pythagoras_distances","Diagonal of cube side 1:",[c("√3"),m("√2"),g("1"),e("3")],"Edge to opposite vertex.",["1²+1²+1²=3, √3."],"3D Pythagoras.","hard",ch9),

  Q("math8_ch10_mp_q1","math8_ch10_more_proportions","If a:b = c:d, then…",[c("ad = bc"),e("ac = bd"),m("Random"),g("a+d = b+c")],"Cross multiplication.",["Cross product."],"ad = bc.","medium",ch10),
  Q("math8_ch10_mp_q2","math8_ch10_more_proportions","Solve 3:5 = x:10:",[c("6"),m("3"),g("5"),e("15")],"3×10 = 5x. x=6.",["Cross."],"Cross.","medium",ch10),
  Q("math8_ch10_mp_q3","math8_ch10_more_proportions","Solve 4:6 = 8:x:",[c("12"),m("8"),g("6"),e("4")],"Cross: 4x=48.",["x = 12."],"Cross-multiply.","medium",ch10),
  Q("math8_ch10_mp_q4","math8_ch10_more_proportions","Means of proportion 2:3 = 4:6:",[c("3 and 4"),m("2 and 6"),g("Random"),e("All four")],"Middle terms.",["b, c."],"Middle.","hard",ch10),
  Q("math8_ch10_mp_q5","math8_ch10_more_proportions","Extremes of 2:3 = 4:6:",[c("2 and 6"),m("3 and 4"),g("Random"),e("All four")],"Outer.",["a, d."],"Outer.","hard",ch10),
  Q("math8_ch10_mp_q6","math8_ch10_more_proportions","Check 5:8 = 15:24:",[c("Yes (equal)"),e("No"),m("Sometimes"),g("Cannot say")],"5×24 = 8×15.",["120 = 120."],"Cross-multiply.","medium",ch10),
  Q("math8_ch10_mp_q7","math8_ch10_more_proportions","If a:b :: 6:9 and a = 4, b = ?",[c("6"),m("9"),g("4"),e("13.5")],"Cross.",["4 × 9 = 6b. b = 6."],"Cross.","medium",ch10),
  Q("math8_ch10_mp_q8","math8_ch10_more_proportions","Why proportions useful?",[c("Solving real ratio problems"),e("Random"),m("Decoration"),g("Hide")],"Real applications.",["Scaling, mixing, etc."],"Scaling.","medium",ch10),
  Q("math8_ch10_sc_q1","math8_ch10_scale","Map scale 1:1000 means…",[c("1 unit map = 1000 real"),e("1 cm = 1 km"),m("Random"),g("Cannot say")],"Ratio.",["1:1000 ratio."],"Ratio.","medium",ch10),
  Q("math8_ch10_sc_q2","math8_ch10_scale","Scale 1 cm = 100 m. 5 cm = ?",[c("500 m"),m("100 m"),g("50 m"),e("5 km")],"× scale.",["5 × 100 = 500."],"× scale.","easy",ch10),
  Q("math8_ch10_sc_q3","math8_ch10_scale","Scale 1:50 means…",[c("1 unit map = 50 real"),e("1 cm = 50 cm"),m("1:50 of model"),g("Random")],"Ratio.",["Map smaller than real."],"Map:real.","hard",ch10),
  Q("math8_ch10_sc_q4","math8_ch10_scale","To enlarge by 3×, multiply dimensions by:",[c("3"),m("1/3"),g("9"),e("6")],"Direct multiply.",["× 3 each side."],"× 3.","medium",ch10),
  Q("math8_ch10_sc_q5","math8_ch10_scale","Real distance 200 km, scale 1 cm = 50 km. Map:",[c("4 cm"),m("200 cm"),g("10 cm"),e("0.4 cm")],"÷ scale.",["200/50=4."],"÷ scale.","medium",ch10),
  Q("math8_ch10_sc_q6","math8_ch10_scale","Big scale (1:10000) vs small (1:1000): which is more detailed?",[c("1:1000 (closer to real)"),e("1:10000"),m("Same"),g("Random")],"Larger ratio fraction = closer.",["1:1000 = ¹⁄₁₀₀₀ > 1:10000."],"Bigger ratio = more detail.","hard",ch10),
  Q("math8_ch10_sc_q7","math8_ch10_scale","Toy car scale 1:20. If real car 4 m, toy = ?",[c("20 cm (0.2 m)"),m("80 m"),g("2 cm"),e("4 m")],"÷ 20.",["4/20 = 0.2 m = 20 cm."],"÷ scale.","medium",ch10),
  Q("math8_ch10_sc_q8","math8_ch10_scale","Scale factor in geometry:",[c("Ratio of similar sides"),e("Random"),m("Areas"),g("None")],"Linear scale.",["Linear ratio."],"Side ratio.","medium",ch10),
  Q("math8_ch10_ss_q1","math8_ch10_similar_shapes","Similar shapes have…",[c("Same shape, different size"),e("Same shape and size"),m("Different shape"),g("Random")],"Definition.",["Similar ≠ congruent."],"Same shape.","medium",ch10),
  Q("math8_ch10_ss_q2","math8_ch10_similar_shapes","Corresponding sides of similar triangles are…",[c("Proportional"),e("Equal"),m("Random"),g("Sum 180")],"Proportional.",["Ratios equal."],"Proportional.","medium",ch10),
  Q("math8_ch10_ss_q3","math8_ch10_similar_shapes","Corresponding angles of similar triangles:",[c("Equal"),e("Different"),m("Sum 180"),g("Random")],"Same shape.",["All angles match."],"Equal.","medium",ch10),
  Q("math8_ch10_ss_q4","math8_ch10_similar_shapes","Scale factor in similar shapes = ?",[c("Ratio of corresponding sides"),e("Random"),m("Area ratio"),g("Just 1")],"Linear scale.",["Side1/side1' = k."],"Side ratio.","hard",ch10),
  Q("math8_ch10_ss_q5","math8_ch10_similar_shapes","If sides of similar triangles are 3:5, areas are:",[c("9:25"),m("3:5"),g("15"),e("Random")],"Squared.",["(3/5)² = 9/25."],"Square ratio.","hard",ch10),
  Q("math8_ch10_ss_q6","math8_ch10_similar_shapes","Are all squares similar?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"Same shape.",["Same shape, sizes differ."],"Yes.","medium",ch10),
  Q("math8_ch10_ss_q7","math8_ch10_similar_shapes","Are all circles similar?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"Same shape.",["All round."],"Yes.","easy",ch10),
  Q("math8_ch10_ss_q8","math8_ch10_similar_shapes","Are all rectangles similar?",[e("Yes"),c("No (need same length:width ratio)"),m("Sometimes"),g("Cannot say")],"Different L:W.",["Need same L:W ratio."],"Need same ratio.","hard",ch10),
  Q("math8_ch10_dv_q1","math8_ch10_direct_inverse","Direct variation: y = ?",[c("kx (k is constant)"),e("k/x"),m("k + x"),g("Random")],"y = kx.",["Linear with k."],"y = kx.","medium",ch10),
  Q("math8_ch10_dv_q2","math8_ch10_direct_inverse","Inverse variation: y = ?",[c("k/x"),e("kx"),m("k + x"),g("Random")],"y = k/x.",["xy = k."],"y = k/x.","medium",ch10),
  Q("math8_ch10_dv_q3","math8_ch10_direct_inverse","More workers → less time. This is…",[c("Inverse variation"),e("Direct"),m("Random"),g("No variation")],"Time ÷ workers.",["Less per worker."],"Inverse.","medium",ch10),
  Q("math8_ch10_dv_q4","math8_ch10_direct_inverse","More distance → more time at constant speed.",[c("Direct"),e("Inverse"),m("Random"),g("None")],"Both increase.",["t = d/v."],"Direct.","medium",ch10),
  Q("math8_ch10_dv_q5","math8_ch10_direct_inverse","If y = 2x, doubling x doubles y. This is…",[c("Direct"),e("Inverse"),m("Random"),g("None")],"Linear.",["Linear → direct."],"Direct.","easy",ch10),
  Q("math8_ch10_dv_q6","math8_ch10_direct_inverse","If x doubles, y halves. This is…",[c("Inverse"),e("Direct"),m("Random"),g("None")],"Inverse.",["xy = constant."],"Inverse.","medium",ch10),
  Q("math8_ch10_dv_q7","math8_ch10_direct_inverse","Identify variation: time vs speed (fixed distance):",[c("Inverse"),e("Direct"),m("Random"),g("None")],"Faster → less time.",["t = d/v."],"Inverse.","hard",ch10),
  Q("math8_ch10_dv_q8","math8_ch10_direct_inverse","Direct variation, k = ?",[c("Constant of proportionality"),e("Variable"),m("Random"),g("Zero")],"Constant.",["y/x = constant = k."],"Constant.","medium",ch10),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 8 Math v2 questions (Ch9-10).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
