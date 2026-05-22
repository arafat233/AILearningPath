import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch3 = "How Many Squares?";
const ch4 = "Parts and Wholes";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"5", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  // ch3 area_grids
  Q("math5_ch3_ag_q1","math5_ch3_area_grids","Area by counting squares: 5 whole squares + 2 halves = ?",[c("6 sq units"),m("7"),g("5.5"),e("9")],"5 + 2×0.5 = 6.",["5 + 1 = 6."],"Whole + halves.","easy",ch3),
  Q("math5_ch3_ag_q2","math5_ch3_area_grids","Half a square = ?",[m("1"),c("0.5"),g("2"),e("0")],"½ × 1 = 0.5 sq units.",["½ sq unit."],"Half = 0.5.","easy",ch3),
  Q("math5_ch3_ag_q3","math5_ch3_area_grids","Why count squares for area?",[c("Direct visual measure"),e("Hard"),m("Random"),g("Decoration")],"Squares give clear visual area.",["Each square = 1 unit."],"Visual.","medium",ch3),
  Q("math5_ch3_ag_q4","math5_ch3_area_grids","6 whole + 4 halves = ?",[c("8 sq units"),m("10"),g("6"),e("4")],"6 + 2 = 8.",["6 + 4×0.5 = 6+2 = 8."],"Halves to wholes.","medium",ch3),
  Q("math5_ch3_ag_q5","math5_ch3_area_grids","Area units are…",[e("Length units"),c("Square units"),m("Volume units"),g("None")],"Area = square units.",["Sq units (cm², m², etc.)."],"Sq units.","easy",ch3),
  Q("math5_ch3_ag_q6","math5_ch3_area_grids","A triangle on grid covers 3 whole + 2 half = ?",[c("4 sq units"),m("5"),g("3"),e("6")],"3 + 1 = 4.",["3 + 2×0.5 = 4."],"Sum.","medium",ch3),
  Q("math5_ch3_ag_q7","math5_ch3_area_grids","Counting squares works for…",[m("Any shape with corners"),c("Any flat shape on grid"),g("Only rectangles"),e("3D")],"Any 2D shape on grid.",["Works for any shape."],"Any shape on grid.","medium",ch3),
  Q("math5_ch3_ag_q8","math5_ch3_area_grids","8 whole + 6 halves = ?",[c("11 sq units"),m("14"),g("8"),e("12")],"8 + 3 = 11.",["8 + 6×0.5 = 11."],"+ halves.","medium",ch3),
  // ch3 area_rectangles
  Q("math5_ch3_ar_q1","math5_ch3_area_rectangles","Rectangle 5 × 3. Area?",[c("15"),m("8"),g("16"),e("30")],"5 × 3 = 15.",["l × w = 5 × 3 = 15."],"l × w.","easy",ch3),
  Q("math5_ch3_ar_q2","math5_ch3_area_rectangles","Square side 6. Area?",[m("24"),c("36"),g("12"),e("48")],"6 × 6 = 36.",["6² = 36."],"s².","easy",ch3),
  Q("math5_ch3_ar_q3","math5_ch3_area_rectangles","Rectangle area formula?",[m("2(l+w)"),c("l × w"),g("l + w"),e("l − w")],"Area = l × w.",["Area uses ×, perimeter uses +."],"l × w.","easy",ch3),
  Q("math5_ch3_ar_q4","math5_ch3_area_rectangles","8 × 5 rectangle area?",[m("13"),c("40"),g("26"),e("64")],"8 × 5 = 40.",["8 × 5 = 40."],"× sides.","easy",ch3),
  Q("math5_ch3_ar_q5","math5_ch3_area_rectangles","Area 24, length 6, width?",[m("18"),c("4"),g("12"),e("8")],"24 ÷ 6 = 4.",["A = l × w. 24/6 = 4."],"Inverse.","medium",ch3),
  Q("math5_ch3_ar_q6","math5_ch3_area_rectangles","Square side 10. Area?",[m("40"),c("100"),g("20"),e("400")],"10 × 10 = 100.",["10² = 100."],"100.","easy",ch3),
  Q("math5_ch3_ar_q7","math5_ch3_area_rectangles","Rectangle 12 × 4. Area?",[c("48"),m("32"),g("16"),e("144")],"12 × 4 = 48.",["12 × 4 = 48."],"× sides.","medium",ch3),
  Q("math5_ch3_ar_q8","math5_ch3_area_rectangles","Area unit for cm × cm?",[m("cm"),c("cm²"),g("cm³"),e("m²")],"cm × cm = cm².",["Area unit = sq cm."],"cm².","easy",ch3),
  // ch3 area_irregular
  Q("math5_ch3_ai_q1","math5_ch3_area_irregular","To find area of irregular shape, divide into…",[e("Curves"),c("Known shapes (rectangles, triangles)"),m("Single piece"),g("3D parts")],"Divide into known shapes, sum areas.",["Split into simple parts.","Sum each area."],"Divide + sum.","medium",ch3),
  Q("math5_ch3_ai_q2","math5_ch3_area_irregular","L-shape: 2 rectangles, areas 6 and 4. Total?",[g("2"),c("10"),m("24"),e("6")],"6 + 4 = 10.",["Sum the parts."],"Sum.","easy",ch3),
  Q("math5_ch3_ai_q3","math5_ch3_area_irregular","Irregular shape: 5 + 3 + 2 (rectangles). Total area?",[c("10"),m("8"),g("30"),e("5")],"5 + 3 + 2 = 10.",["Sum all."],"Add all parts.","easy",ch3),
  Q("math5_ch3_ai_q4","math5_ch3_area_irregular","To find area, you can also subtract…",[c("Missing piece from bounding rectangle"),e("Nothing"),m("Random"),g("Length")],"Bound + subtract missing = same as adding parts.",["Big rect − missing piece = irregular area."],"Subtract method.","hard",ch3),
  Q("math5_ch3_ai_q5","math5_ch3_area_irregular","Hexagon: 6 triangles each 5 sq units. Area?",[g("11"),c("30"),m("5"),e("36")],"6 × 5 = 30.",["Sum 6 triangles."],"× by count.","medium",ch3),
  Q("math5_ch3_ai_q6","math5_ch3_area_irregular","Triangle area = ½ × base × height. For base 4, height 3 = ?",[m("12"),c("6"),g("7"),e("3.5")],"½ × 4 × 3 = 6.",["½ × 4 × 3 = 6."],"½bh.","hard",ch3),
  Q("math5_ch3_ai_q7","math5_ch3_area_irregular","Cross-shape = 4 rectangles + 1 square in centre. Areas 3, 3, 3, 3, 9. Total?",[c("21"),m("15"),g("9"),e("12")],"3+3+3+3+9 = 21.",["Sum all parts."],"Sum.","hard",ch3),
  Q("math5_ch3_ai_q8","math5_ch3_area_irregular","Shape covers 7 whole + 6 halves on grid. Area?",[c("10"),m("13"),g("7"),e("6")],"7 + 3 = 10.",["7 + 6×0.5 = 10."],"Sum.","medium",ch3),
  // ch3 perimeter_area
  Q("math5_ch3_pa_q1","math5_ch3_perimeter_area","Perimeter is in ___ units; area in ___ units.",[c("Length; square"),e("Square; length"),m("Both length"),g("Both square")],"Perimeter = length; area = sq.",["P units: cm.","A units: cm²."],"Diff units.","medium",ch3),
  Q("math5_ch3_pa_q2","math5_ch3_perimeter_area","Rectangle 5 × 3: A and P?",[c("A=15, P=16"),m("A=8, P=15"),g("A=15, P=15"),e("A=15, P=30")],"5×3=15; 2(5+3)=16.",["A: 5×3=15.","P: 2(5+3)=16."],"Separate formulas.","medium",ch3),
  Q("math5_ch3_pa_q3","math5_ch3_perimeter_area","Two rectangles with same area can have different…",[c("Perimeters"),e("Areas"),m("Nothing"),g("Always same")],"Same area, different P possible.",["4×4: A=16, P=16.","2×8: A=16, P=20."],"Same A, diff P.","hard",ch3),
  Q("math5_ch3_pa_q4","math5_ch3_perimeter_area","For fencing, you need…",[e("Area"),c("Perimeter"),m("Volume"),g("Diagonal")],"Fence goes around = P.",["Fence = around.","P measures around."],"Fence = P.","easy",ch3),
  Q("math5_ch3_pa_q5","math5_ch3_perimeter_area","For carpeting, you need…",[c("Area"),m("Perimeter"),g("Both"),e("Neither")],"Carpet covers floor = A.",["Carpet = cover.","A measures cover."],"Carpet = A.","easy",ch3),
  Q("math5_ch3_pa_q6","math5_ch3_perimeter_area","Square side 4: A = ?, P = ?",[c("A=16, P=16"),m("A=8, P=16"),g("A=16, P=8"),e("A=4, P=16")],"4²=16; 4×4=16.",["A=s²=16.","P=4s=16."],"s² and 4s.","medium",ch3),
  Q("math5_ch3_pa_q7","math5_ch3_perimeter_area","Same perimeter, different shapes can have different…",[c("Areas"),e("Perimeters"),m("Nothing"),g("Always same")],"Same P, different A possible.",["6×6 vs 3×9 both have P=24, but A=36 vs 27."],"Same P, diff A.","hard",ch3),
  Q("math5_ch3_pa_q8","math5_ch3_perimeter_area","To paint a wall, calculate…",[c("Area"),m("Perimeter"),g("Volume"),e("Both")],"Wall surface = area.",["Painting = covering."],"Painting = A.","easy",ch3),

  // ch4 fractions_review
  Q("math5_ch4_fr_q1","math5_ch4_fractions_review","Fraction means…",[e("Whole number"),c("Part of a whole"),m("Decimal"),g("Random")],"Part of whole.",["Numerator/denominator."],"Part/whole.","easy",ch4),
  Q("math5_ch4_fr_q2","math5_ch4_fractions_review","In 3/8, denominator is…",[c("8"),e("3"),m("11"),g("5")],"Bottom = denominator.",["Bottom = 8."],"Bottom.","easy",ch4),
  Q("math5_ch4_fr_q3","math5_ch4_fractions_review","Bigger denominator means…",[e("Bigger fraction"),c("Smaller pieces"),m("Same"),g("Random")],"More parts in same whole = smaller pieces.",["More cuts = smaller pieces."],"More parts = smaller.","medium",ch4),
  Q("math5_ch4_fr_q4","math5_ch4_fractions_review","½ + ½ = ?",[e("½"),c("1"),m("¼"),g("¾")],"2/2 = 1.",["½ + ½ = 2/2 = 1."],"Halves = whole.","easy",ch4),
  Q("math5_ch4_fr_q5","math5_ch4_fractions_review","Of these, biggest fraction?",[c("¾"),m("⅛"),e("½"),g("⅓")],"3/4 = 0.75 > ½ = 0.5 > ⅓ ≈ 0.33 > ⅛.",["Compare values."],"Bigger value.","medium",ch4),
  Q("math5_ch4_fr_q6","math5_ch4_fractions_review","3/4 means…",[c("3 parts of 4 equal parts"),e("4 parts of 3"),m("3 minus 4"),g("4 plus 3")],"3 out of 4.",["3 taken from 4 total."],"3 of 4.","easy",ch4),
  Q("math5_ch4_fr_q7","math5_ch4_fractions_review","Numerator > denominator means…",[c("Improper fraction (> 1 whole)"),e("Always wrong"),m("Equal"),g("Random")],"Improper: 5/4, 7/3, etc.",["Top > bottom: improper.","Value > 1."],"Improper.","hard",ch4),
  Q("math5_ch4_fr_q8","math5_ch4_fractions_review","Mixed number: 1½ = ?",[c("3/2"),m("½"),g("2"),e("1/2")],"1 + ½ = 3/2.",["1 = 2/2.","2/2 + 1/2 = 3/2."],"Mixed to improper.","medium",ch4),
  // ch4 equivalent_fractions
  Q("math5_ch4_ef_q1","math5_ch4_equivalent_fractions","½ = ?",[c("2/4"),m("3/4"),g("1/3"),e("1")],"× top and bottom by 2: 2/4.",["½ × 2/2 = 2/4."],"Multiply both.","easy",ch4),
  Q("math5_ch4_ef_q2","math5_ch4_equivalent_fractions","Equivalent fractions have…",[c("Same value, different form"),e("Different values"),m("Random"),g("Bigger value")],"Same value.",["½ = 2/4 = 3/6 = 4/8.","All equal."],"Same value.","medium",ch4),
  Q("math5_ch4_ef_q3","math5_ch4_equivalent_fractions","To find equivalent, multiply top and bottom by…",[c("Same number"),e("Different numbers"),m("Random"),g("Just top")],"Both must be multiplied by same value.",["× same number both."],"Same multiplier.","medium",ch4),
  Q("math5_ch4_ef_q4","math5_ch4_equivalent_fractions","Simplify 6/8?",[c("3/4"),m("1/2"),g("6/8"),e("2/4")],"Divide both by 2: 6/8 = 3/4.",["6÷2 / 8÷2 = 3/4."],"÷ common factor.","medium",ch4),
  Q("math5_ch4_ef_q5","math5_ch4_equivalent_fractions","Are 1/3 and 4/12 equivalent?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"1/3 × 4/4 = 4/12.",["1/3 × 4 = 4/12."],"Multiply check.","medium",ch4),
  Q("math5_ch4_ef_q6","math5_ch4_equivalent_fractions","Lowest form of 12/16?",[c("3/4"),m("6/8"),g("12/16"),e("4/4")],"GCD is 4. 12/4 = 3. 16/4 = 4.",["12 ÷ 4 = 3.","16 ÷ 4 = 4.","→ 3/4."],"Divide by GCD.","hard",ch4),
  Q("math5_ch4_ef_q7","math5_ch4_equivalent_fractions","½ written as 6ths?",[c("3/6"),m("6/6"),g("1/6"),e("2/6")],"½ × 3/3 = 3/6.",["½ × 3 = 3.","Bottom 2 × 3 = 6.","3/6."],"Multiply.","medium",ch4),
  Q("math5_ch4_ef_q8","math5_ch4_equivalent_fractions","Which is NOT equivalent to ⅓?",[e("2/6"),m("3/9"),c("3/6"),g("4/12")],"3/6 = ½, not ⅓.",["⅓ = 2/6 = 3/9 = 4/12.","3/6 = ½ (different)."],"Cross-check.","hard",ch4),
  // ch4 comparing_fractions
  Q("math5_ch4_cf_q1","math5_ch4_comparing_fractions","Which is bigger: 1/2 or 1/3?",[c("1/2"),e("1/3"),m("Equal"),g("Cannot say")],"½ = 0.5 > ⅓ ≈ 0.33.",["Smaller bottom = bigger piece."],"½ > ⅓.","medium",ch4),
  Q("math5_ch4_cf_q2","math5_ch4_comparing_fractions","Compare 2/3 and 3/4?",[e("2/3"),c("3/4"),m("Equal"),g("Cannot say")],"2/3 = 8/12, 3/4 = 9/12. 9 > 8.",["Common denom 12.","8 vs 9 → 3/4."],"Common denom.","medium",ch4),
  Q("math5_ch4_cf_q3","math5_ch4_comparing_fractions","To compare fractions, find…",[c("Common denominator"),e("Common numerator"),m("Random"),g("Their sum")],"Common denominator makes comparing easy.",["Same bottom.","Then compare tops."],"Common bottom.","medium",ch4),
  Q("math5_ch4_cf_q4","math5_ch4_comparing_fractions","Same denominator, bigger numerator = ___ fraction.",[c("Bigger"),e("Smaller"),m("Equal"),g("Random")],"Same bottom: bigger top = bigger fraction.",["Same bottom.","Compare tops."],"Bigger top wins.","easy",ch4),
  Q("math5_ch4_cf_q5","math5_ch4_comparing_fractions","Smallest of 1/2, 1/4, 1/8?",[e("1/2"),m("1/4"),c("1/8"),g("All equal")],"Same numerator: bigger bottom = smaller fraction.",["Same top.","Bigger bottom = smaller."],"Bigger bottom = smaller.","medium",ch4),
  Q("math5_ch4_cf_q6","math5_ch4_comparing_fractions","Compare 5/8 and 3/4?",[e("5/8"),c("3/4"),m("Equal"),g("Cannot say")],"3/4 = 6/8. 6 > 5.",["3/4 = 6/8.","6/8 vs 5/8: 6 > 5."],"Common denom.","medium",ch4),
  Q("math5_ch4_cf_q7","math5_ch4_comparing_fractions","2/3 vs 4/6?",[e("2/3"),m("4/6"),c("Equal"),g("Cannot say")],"4/6 = 2/3 (simplify).",["4/6 ÷ 2/2 = 2/3.","Equal."], "Simplify.","medium",ch4),
  Q("math5_ch4_cf_q8","math5_ch4_comparing_fractions","Cross-multiply check: a/b vs c/d. If ad > bc, then…",[c("a/b > c/d"),e("a/b < c/d"),m("Equal"),g("Random")],"ad > bc → a/b > c/d.",["Cross-multiply.","ad vs bc."],"Cross-multiply.","hard",ch4),
  // ch4 fraction_operations
  Q("math5_ch4_fo_q1","math5_ch4_fraction_operations","1/4 + 1/4 = ?",[c("2/4 = 1/2"),m("2/8"),g("1/8"),e("1")],"Same denom: 1+1 = 2/4 = ½.",["Same bottom.","Add tops."],"Add tops.","easy",ch4),
  Q("math5_ch4_fo_q2","math5_ch4_fraction_operations","1/3 + 1/3 = ?",[c("2/3"),m("2/6"),g("1/6"),e("1")],"1+1 = 2/3.",["Add tops: 1+1=2.","Bottom: 3."],"Add tops.","easy",ch4),
  Q("math5_ch4_fo_q3","math5_ch4_fraction_operations","1/2 + 1/3 = ?",[m("2/5"),c("5/6"),g("2/3"),e("1")],"Common denom 6: 3/6 + 2/6 = 5/6.",["½ = 3/6.","⅓ = 2/6.","Sum = 5/6."],"Common denom first.","hard",ch4),
  Q("math5_ch4_fo_q4","math5_ch4_fraction_operations","3/5 − 1/5 = ?",[c("2/5"),m("4/5"),g("2/10"),e("3/4")],"Same denom: 3−1 = 2/5.",["Subtract tops: 3-1=2.","Same bottom: 5."],"Subtract tops.","easy",ch4),
  Q("math5_ch4_fo_q5","math5_ch4_fraction_operations","Different denominators need…",[c("Common denominator first"),e("Just add"),m("Random"),g("Skip")],"Find common before adding/subtracting.",["Different bottoms = find common.","Then add/sub tops."],"Common first.","medium",ch4),
  Q("math5_ch4_fo_q6","math5_ch4_fraction_operations","2/3 − 1/6 = ?",[c("1/2"),m("1/3"),g("1/9"),e("3/6")],"Common 6: 4/6 − 1/6 = 3/6 = ½.",["2/3 = 4/6.","4/6 − 1/6 = 3/6 = ½."],"Common denom.","hard",ch4),
  Q("math5_ch4_fo_q7","math5_ch4_fraction_operations","Adding fractions: add denominators?",[e("Yes"),c("No, keep same"),m("Sometimes"),g("Multiply")],"Keep same denom, add tops.",["Same bottom = stay.","Add tops only."],"Don't add bottoms.","medium",ch4),
  Q("math5_ch4_fo_q8","math5_ch4_fraction_operations","1/8 + 3/8 = ?",[c("4/8 = 1/2"),m("4/16"),g("3/8"),e("3/16")],"1+3 = 4/8 = ½.",["Same bottom: 8.","Add tops: 4/8 = ½."],"Same bottom.","easy",ch4),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 5 Math v2 questions (Ch3-4).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
