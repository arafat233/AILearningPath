import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch7 = "Fractions";
const ch8 = "Playing with Constructions";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"6", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  // ch7 fractions_review
  Q("math6_ch7_fr_q1","math6_ch7_fractions_review","Fraction = ?",[c("Part / Whole"),e("Whole + part"),m("Random"),g("Decimal only")],"Part of a whole.",["Numerator/denominator."],"Part of whole.","easy",ch7),
  Q("math6_ch7_fr_q2","math6_ch7_fractions_review","In 5/8, numerator?",[c("5"),m("8"),g("3"),e("13")],"Top.",["Top = numerator."],"Top.","easy",ch7),
  Q("math6_ch7_fr_q3","math6_ch7_fractions_review","½ + ½ = ?",[c("1"),e("½"),m("¼"),g("2")],"2/2 = 1.",["½ + ½ = 1."],"Whole.","easy",ch7),
  Q("math6_ch7_fr_q4","math6_ch7_fractions_review","Bigger denominator = ?",[c("Smaller piece"),e("Bigger"),m("Same"),g("Random")],"More parts, smaller each.",["More cuts = smaller."],"Smaller piece.","medium",ch7),
  Q("math6_ch7_fr_q5","math6_ch7_fractions_review","Improper fraction: top > bottom. Example?",[c("5/3"),m("3/5"),g("1/2"),e("0/4")],"5 > 3.",["Top > bottom = improper."],"Top > bottom.","medium",ch7),
  Q("math6_ch7_fr_q6","math6_ch7_fractions_review","Compare 3/4 vs 2/3?",[c("3/4 > 2/3"),e("Equal"),m("2/3 > 3/4"),g("Cannot tell")],"Common 12: 9/12 vs 8/12.",["Cross-mult: 9 vs 8."],"3/4 bigger.","medium",ch7),
  Q("math6_ch7_fr_q7","math6_ch7_fractions_review","Mixed 1½ = ?",[c("3/2"),m("½"),g("2"),e("1.2")],"1 + ½ = 3/2.",["1=2/2, +½=3/2."],"3/2.","medium",ch7),
  Q("math6_ch7_fr_q8","math6_ch7_fractions_review","¾ of 20 = ?",[c("15"),m("5"),g("10"),e("80")],"¾ × 20.",["20×3/4 = 15."],"Multiply.","medium",ch7),
  // ch7 equivalent_fractions
  Q("math6_ch7_ef_q1","math6_ch7_equivalent_fractions","½ = ?",[c("2/4"),m("3/4"),g("4/4"),e("1")],"× 2/2 = 2/4.",["Multiply both by 2."],"× both.","easy",ch7),
  Q("math6_ch7_ef_q2","math6_ch7_equivalent_fractions","To find equivalent, multiply…",[c("Top AND bottom by same"),e("Only top"),m("Only bottom"),g("Random")],"Both.",["× both keeps value."],"× both same.","easy",ch7),
  Q("math6_ch7_ef_q3","math6_ch7_equivalent_fractions","Simplify 8/12?",[c("2/3"),m("4/6"),g("1/2"),e("8/12")],"÷ 4: 2/3.",["GCD 4: ÷ both."],"÷ GCD.","medium",ch7),
  Q("math6_ch7_ef_q4","math6_ch7_equivalent_fractions","Equivalent to 1/3?",[c("4/12"),m("3/1"),g("1/12"),e("3/3")],"× 4/4.",["1/3 × 4 = 4/12."],"× same.","medium",ch7),
  Q("math6_ch7_ef_q5","math6_ch7_equivalent_fractions","Lowest form of 24/36?",[c("2/3"),m("12/18"),g("6/9"),e("4/6")],"GCD=12.",["24/12 / 36/12 = 2/3."],"÷ GCD.","hard",ch7),
  Q("math6_ch7_ef_q6","math6_ch7_equivalent_fractions","Are 6/8 and 3/4 equivalent?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"6÷2/8÷2 = 3/4.",["Simplify 6/8."],"Yes.","medium",ch7),
  Q("math6_ch7_ef_q7","math6_ch7_equivalent_fractions","½ in 8ths?",[c("4/8"),m("8/8"),g("1/8"),e("2/8")],"× 4/4.",["½ × 4 = 4/8."],"× 4.","medium",ch7),
  Q("math6_ch7_ef_q8","math6_ch7_equivalent_fractions","NOT equivalent to ⅔?",[e("4/6"),m("6/9"),c("3/6"),g("8/12")],"3/6 = ½, not ⅔.",["3/6 simplifies to ½."],"Cross check.","hard",ch7),
  // ch7 fraction_operations
  Q("math6_ch7_fo_q1","math6_ch7_fraction_operations","Same denom: 2/5 + 1/5 = ?",[c("3/5"),m("3/10"),g("2/10"),e("4/5")],"Add tops.",["Same bottom."],"Add tops.","easy",ch7),
  Q("math6_ch7_fo_q2","math6_ch7_fraction_operations","Different denom: ½ + ⅓ = ?",[c("5/6"),m("2/5"),g("1"),e("2/6")],"Common 6: 3/6+2/6=5/6.",["½=3/6, ⅓=2/6, sum 5/6."],"Common denom.","hard",ch7),
  Q("math6_ch7_fo_q3","math6_ch7_fraction_operations","½ × ½ = ?",[c("¼"),m("½"),g("1"),e("2/4")],"½×½ = ¼.",["Top×top, bottom×bottom."],"× both.","medium",ch7),
  Q("math6_ch7_fo_q4","math6_ch7_fraction_operations","½ ÷ ¼ = ?",[c("2"),m("⅛"),g("½"),e("¼")],"½ × 4/1 = 2.",["Reciprocal: ½ × 4."],"× reciprocal.","hard",ch7),
  Q("math6_ch7_fo_q5","math6_ch7_fraction_operations","Multiply fractions: ___ × ___",[c("Top × top; bottom × bottom"),e("Cross-multiply"),m("Add"),g("Random")],"Direct.",["Numerators × numerators, denoms × denoms."],"× both.","medium",ch7),
  Q("math6_ch7_fo_q6","math6_ch7_fraction_operations","Divide: invert second and ___",[c("Multiply"),e("Add"),m("Subtract"),g("Divide again")],"× reciprocal.",["a/b ÷ c/d = a/b × d/c."],"× reciprocal.","medium",ch7),
  Q("math6_ch7_fo_q7","math6_ch7_fraction_operations","Subtract: 3/4 − 1/4 = ?",[c("½"),m("¼"),g("1"),e("3/16")],"3−1=2/4 = ½.",["Same bottom: subtract tops."],"Subtract tops.","easy",ch7),
  Q("math6_ch7_fo_q8","math6_ch7_fraction_operations","½ + ¼ = ?",[c("¾"),m("⅙"),g("⅛"),e("1")],"2/4 + 1/4 = 3/4.",["Common 4."],"Common denom.","medium",ch7),
  // ch7 mixed_numbers
  Q("math6_ch7_mn_q1","math6_ch7_mixed_numbers","2½ in improper:",[c("5/2"),m("2.5"),g("3/2"),e("1/2")],"2 = 4/2, +1/2 = 5/2.",["Whole × bottom + top."],"× + top.","medium",ch7),
  Q("math6_ch7_mn_q2","math6_ch7_mixed_numbers","7/3 as mixed:",[c("2⅓"),m("2¼"),g("3⅓"),e("3⅔")],"7÷3 = 2 r 1.",["Quotient 2, remainder 1, over 3."],"÷ bottom.","medium",ch7),
  Q("math6_ch7_mn_q3","math6_ch7_mixed_numbers","Mixed has…",[c("Whole + fraction part"),e("Two wholes"),m("Just fraction"),g("Random")],"Combined.",["Whole + proper fraction."],"W + fraction.","easy",ch7),
  Q("math6_ch7_mn_q4","math6_ch7_mixed_numbers","Convert 9/4:",[c("2¼"),m("4/9"),g("3⅓"),e("¼")],"9÷4=2 r 1.",["2 + 1/4."],"÷ bottom.","medium",ch7),
  Q("math6_ch7_mn_q5","math6_ch7_mixed_numbers","Improper > 1 always?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot tell")],"Top > bottom = > 1.",["Top > bottom = > 1."],"Yes.","medium",ch7),
  Q("math6_ch7_mn_q6","math6_ch7_mixed_numbers","Convert 3¼ to improper:",[c("13/4"),m("12/4"),g("11/4"),e("3.25")],"3×4+1=13.",["3×4=12, +1=13. Over 4."],"× + top.","medium",ch7),
  Q("math6_ch7_mn_q7","math6_ch7_mixed_numbers","11/2 as mixed:",[c("5½"),m("4½"),g("5"),e("11/2")],"11÷2=5 r 1.",["5 + ½."],"÷.","medium",ch7),
  Q("math6_ch7_mn_q8","math6_ch7_mixed_numbers","Add 1½ + 2¼:",[c("3¾"),m("3⅓"),g("4"),e("3½")],"3/2 + 9/4 = 6/4 + 9/4 = 15/4 = 3¾.",["Convert to improper, add, convert back."],"Convert + add.","hard",ch7),

  // ch8 basic_constructions
  Q("math6_ch8_bc_q1","math6_ch8_basic_constructions","Tools for construction:",[c("Ruler + compass"),e("Just hands"),m("Ruler only"),g("Random")],"Ruler + compass standard.",["Ruler for lines, compass for arcs."],"Ruler + compass.","easy",ch8),
  Q("math6_ch8_bc_q2","math6_ch8_basic_constructions","Compass draws…",[c("Arcs and circles"),e("Lines only"),m("Triangles"),g("Random")],"Curves.",["Compass = circle tool."],"Arcs.","easy",ch8),
  Q("math6_ch8_bc_q3","math6_ch8_basic_constructions","Construction lines should be…",[c("Light"),e("Bold"),m("Random"),g("Coloured")],"Lightly drawn for reference.",["Light pencil; can erase."],"Light.","medium",ch8),
  Q("math6_ch8_bc_q4","math6_ch8_basic_constructions","To copy a line segment, use…",[c("Compass to set length"),e("Random"),m("Just ruler"),g("Eye estimate")],"Compass sets length, then transfer.",["Open compass to length.","Transfer arc."],"Compass length.","medium",ch8),
  Q("math6_ch8_bc_q5","math6_ch8_basic_constructions","To draw 5 cm segment, use…",[c("Ruler with 5 cm mark"),e("Random"),m("Compass"),g("Estimate")],"Ruler for length.",["Mark 0 and 5 cm."],"Ruler.","easy",ch8),
  Q("math6_ch8_bc_q6","math6_ch8_basic_constructions","Pencil tip should be…",[c("Sharp"),e("Dull"),m("Doesn't matter"),g("Random")],"Sharp for accuracy.",["Sharp pencil = precise."],"Sharp.","medium",ch8),
  Q("math6_ch8_bc_q7","math6_ch8_basic_constructions","To construct a circle, use…",[c("Compass"),e("Ruler"),m("Protractor"),g("Random")],"Compass.",["Compass swings."],"Compass.","easy",ch8),
  Q("math6_ch8_bc_q8","math6_ch8_basic_constructions","Steel point of compass goes on…",[c("Centre"),e("Edge"),m("Outside"),g("Random")],"Fixed point.",["Centre = pivot."],"Centre.","medium",ch8),
  // ch8 triangles_construction
  Q("math6_ch8_tc_q1","math6_ch8_triangles_construction","SSS construction means…",[c("Given 3 sides"),e("Given 1 side"),m("Given 2 sides"),g("Given 3 angles")],"Side-Side-Side.",["3 sides → unique triangle."],"3 sides.","medium",ch8),
  Q("math6_ch8_tc_q2","math6_ch8_triangles_construction","SAS means…",[c("Side-Angle-Side"),e("Side-Angle-Angle"),m("Random"),g("All sides")],"Two sides + included angle.",["S-A-S pattern."],"SAS.","medium",ch8),
  Q("math6_ch8_tc_q3","math6_ch8_triangles_construction","ASA means…",[c("Angle-Side-Angle"),e("All angles"),m("All sides"),g("Random")],"Two angles + side between.",["A-S-A pattern."],"ASA.","medium",ch8),
  Q("math6_ch8_tc_q4","math6_ch8_triangles_construction","To construct triangle with sides 3, 4, 5:",[c("Draw base 5, arc 3 and 4 to find apex"),e("Random"),m("Just measure"),g("Cannot")],"SSS with compass arcs.",["Base 5, arc 3 from A, arc 4 from B, intersect."],"Arc method.","hard",ch8),
  Q("math6_ch8_tc_q5","math6_ch8_triangles_construction","Equilateral triangle: all sides…",[c("Equal"),e("Different"),m("Random"),g("Sum 180")],"All sides equal.",["Equilateral = equal sides."],"Equal.","easy",ch8),
  Q("math6_ch8_tc_q6","math6_ch8_triangles_construction","Construct equilateral triangle, side 5 cm:",[c("Use arcs of 5 cm from both ends of 5 cm base"),e("Random"),m("Just draw"),g("Cannot")],"Two arcs meet at apex.",["Arcs of equal radius."],"Arcs equal.","medium",ch8),
  Q("math6_ch8_tc_q7","math6_ch8_triangles_construction","If two arcs don't meet, what's wrong?",[c("Sides too short"),e("Too long"),m("Random"),g("Compass broken")],"Triangle inequality violated.",["Sides must satisfy triangle inequality."],"Sides too short.","hard",ch8),
  Q("math6_ch8_tc_q8","math6_ch8_triangles_construction","Triangle inequality: sum of any 2 sides > ?",[c("Third side"),e("Sum of all"),m("Random"),g("Largest")],"Sum of 2 sides > 3rd.",["Triangle inequality."],"Third side.","hard",ch8),
  // ch8 angle_bisector
  Q("math6_ch8_ab_q1","math6_ch8_angle_bisector","Angle bisector divides angle into…",[c("Two equal halves"),e("Random"),m("Three"),g("Four")],"Equal halves.",["Half + half."],"Two equal.","easy",ch8),
  Q("math6_ch8_ab_q2","math6_ch8_angle_bisector","To bisect angle, use…",[c("Compass arcs"),e("Just ruler"),m("Random"),g("Protractor only")],"Arc method.",["Arc from vertex, then arcs from arc points."],"Arcs.","medium",ch8),
  Q("math6_ch8_ab_q3","math6_ch8_angle_bisector","Bisect 60° → each half = ?",[c("30°"),m("60°"),g("90°"),e("120°")],"60/2=30.",["Half of 60."],"Half.","easy",ch8),
  Q("math6_ch8_ab_q4","math6_ch8_angle_bisector","Bisect 90° → each = ?",[c("45°"),m("90°"),g("180°"),e("30°")],"45.",["Half 90."],"Half.","easy",ch8),
  Q("math6_ch8_ab_q5","math6_ch8_angle_bisector","Bisector starts at…",[c("Vertex"),e("Far point"),m("Random"),g("Midpoint")],"Vertex of angle.",["From corner."],"Vertex.","medium",ch8),
  Q("math6_ch8_ab_q6","math6_ch8_angle_bisector","Bisector is unique?",[c("Yes (for each angle, one bisector)"),e("Many"),m("None"),g("Two")],"Unique.",["One bisector per angle."],"Unique.","medium",ch8),
  Q("math6_ch8_ab_q7","math6_ch8_angle_bisector","Bisect 180° (straight) → ?",[c("90° each"),m("180°"),g("0°"),e("60°")],"90.",["Half 180."],"Half.","easy",ch8),
  Q("math6_ch8_ab_q8","math6_ch8_angle_bisector","Bisector goes through ___ of angle.",[c("Inside (between arms)"),e("Outside"),m("Random"),g("Tip")],"Inside angle.",["Between the two arms."],"Inside.","medium",ch8),
  // ch8 perpendicular_bisector
  Q("math6_ch8_pb_q1","math6_ch8_perpendicular_bisector","Perpendicular bisector cuts segment into…",[c("Two equal halves at 90°"),e("Random"),m("Three"),g("Unequal halves")],"Equal halves + 90°.",["Half + perpendicular."],"Equal + 90°.","medium",ch8),
  Q("math6_ch8_pb_q2","math6_ch8_perpendicular_bisector","To construct: arcs of ___ from each endpoint.",[c("Same radius (> half segment)"),e("Different"),m("Random"),g("Tiny")],"Equal arcs.",["Radius > half segment.","Arcs meet on either side."],"Equal arcs.","hard",ch8),
  Q("math6_ch8_pb_q3","math6_ch8_perpendicular_bisector","Perpendicular bisector passes through…",[c("Midpoint"),e("Endpoints"),m("Random"),g("One end")],"Midpoint of segment.",["Through midpoint, perpendicular."],"Midpoint.","medium",ch8),
  Q("math6_ch8_pb_q4","math6_ch8_perpendicular_bisector","Bisect 10 cm segment: midpoint?",[c("At 5 cm"),m("3 cm"),g("7 cm"),e("10 cm")],"Half.",["10/2 = 5 cm."],"Half.","easy",ch8),
  Q("math6_ch8_pb_q5","math6_ch8_perpendicular_bisector","All points on perp bisector are…",[c("Equidistant from endpoints"),e("Random"),m("Just midpoint"),g("Outside")],"Equidistant property.",["Any point on perp bisector: same distance from both endpoints."],"Equidistant.","hard",ch8),
  Q("math6_ch8_pb_q6","math6_ch8_perpendicular_bisector","Perpendicular bisector is…",[c("Unique"),e("Multiple"),m("None"),g("Random")],"One per segment.",["Each segment has 1 perp bisector."],"Unique.","medium",ch8),
  Q("math6_ch8_pb_q7","math6_ch8_perpendicular_bisector","Angle with segment is…",[c("90°"),m("180°"),g("45°"),e("60°")],"Perpendicular.",["⊥ = 90°."],"90°.","easy",ch8),
  Q("math6_ch8_pb_q8","math6_ch8_perpendicular_bisector","Application of perp bisector:",[c("Find equidistant points"),e("Random"),m("Color"),g("Decoration")],"Equidistance locus.",["Useful in geometry/finding centers."],"Equidistance.","hard",ch8),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 6 Math v2 questions (Ch7-8).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
