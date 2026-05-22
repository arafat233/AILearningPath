import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch13 = "Connecting the Dots";
const ch14 = "Constructions and Tilings";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"7", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math7_ch13_cd_q1","math7_ch13_collecting_data","Data collection starts with…",[c("A question"),e("A chart"),m("Random"),g("Tools")],"Question first.",["Decide what to find."],"Question.","easy",ch13),
  Q("math7_ch13_cd_q2","math7_ch13_collecting_data","Tally marks help to…",[c("Count fast"),e("Decorate"),m("Random"),g("Hide")],"Quick counting.",["1 mark per item."],"Count fast.","easy",ch13),
  Q("math7_ch13_cd_q3","math7_ch13_collecting_data","Tally for 5:",[c("|||| with cross"),m("|||||"),g("5"),e("V")],"4 vertical + 1 cross.",["||||̸."],"Cross 5th.","medium",ch13),
  Q("math7_ch13_cd_q4","math7_ch13_collecting_data","After tallying, ___",[c("Organize in table"),e("Throw away"),m("Random"),g("Eat")],"Organize.",["Tally → table."],"Organize.","medium",ch13),
  Q("math7_ch13_cd_q5","math7_ch13_collecting_data","Survey 30 students: question?",[c("Specific and clear"),e("Random"),m("Multi-part"),g("Hidden")],"Clear questions.",["Clear question."],"Clear.","easy",ch13),
  Q("math7_ch13_cd_q6","math7_ch13_collecting_data","To compare categories, use…",[c("Bar graph"),e("Single number"),m("Random"),g("Just data")],"Bar graphs.",["Visual compare."],"Bar.","medium",ch13),
  Q("math7_ch13_cd_q7","math7_ch13_collecting_data","Tally |||||̸ |||| ||| = ?",[c("12"),m("11"),g("13"),e("10")],"5+4+3.",["5+4+3=12."],"Sum.","medium",ch13),
  Q("math7_ch13_cd_q8","math7_ch13_collecting_data","Data accuracy depends on…",[c("Honest tally + clear question"),e("Random"),m("Speed"),g("Color")],"Quality input.",["Honest data = accurate."],"Honesty.","medium",ch13),
  Q("math7_ch13_bg_q1","math7_ch13_bar_graphs","Bar graph x-axis:",[c("Categories"),e("Values"),m("Title"),g("Random")],"Categories.",["x = labels."],"Categories.","easy",ch13),
  Q("math7_ch13_bg_q2","math7_ch13_bar_graphs","y-axis:",[c("Values"),e("Names"),m("Random"),g("Total")],"Values.",["y = numbers."],"Values.","easy",ch13),
  Q("math7_ch13_bg_q3","math7_ch13_bar_graphs","Taller bar means…",[c("Bigger value"),e("Smaller"),m("Same"),g("Random")],"Direct.",["Bigger height = bigger value."],"Bigger.","easy",ch13),
  Q("math7_ch13_bg_q4","math7_ch13_bar_graphs","Bar widths should be…",[c("Equal"),e("Different"),m("Random"),g("Triangular")],"Same.",["Equal for fair compare."],"Equal.","medium",ch13),
  Q("math7_ch13_bg_q5","math7_ch13_bar_graphs","Most popular = ___?",[c("Tallest bar"),e("Shortest"),m("Random"),g("Middle")],"Most popular = max.",["Max height."],"Max.","easy",ch13),
  Q("math7_ch13_bg_q6","math7_ch13_bar_graphs","Bar at gridline 4, scale 1=5. Value?",[c("20"),m("4"),g("9"),e("100")],"4×5.",["Grid × scale."],"× scale.","medium",ch13),
  Q("math7_ch13_bg_q7","math7_ch13_bar_graphs","Bar A=20, B=15. Difference?",[c("5"),m("35"),g("300"),e("3")],"20−15.",["Subtract."],"Subtract.","easy",ch13),
  Q("math7_ch13_bg_q8","math7_ch13_bar_graphs","Bar graph helps…",[c("Compare categories visually"),e("Hide data"),m("Random"),g("Decoration")],"Visual compare.",["Visualization."],"Visualize.","medium",ch13),
  Q("math7_ch13_mm_q1","math7_ch13_mean_median","Mean of 2, 4, 6, 8, 10?",[c("6"),m("4"),g("30"),e("5")],"Sum/count.",["30/5=6."],"Sum/count.","easy",ch13),
  Q("math7_ch13_mm_q2","math7_ch13_mean_median","Mean = ?",[c("Sum / count"),e("Middle"),m("Random"),g("Largest")],"Average.",["Total/count."],"Total/count.","easy",ch13),
  Q("math7_ch13_mm_q3","math7_ch13_mean_median","Median = ?",[c("Middle value (sorted)"),e("Largest"),m("Random"),g("Sum")],"Middle.",["Sort, take middle."],"Middle.","easy",ch13),
  Q("math7_ch13_mm_q4","math7_ch13_mean_median","Median of 1, 3, 5, 7, 9?",[c("5"),m("3"),g("25"),e("4")],"Middle.",["Sorted: 1,3,5,7,9. Middle=5."],"Middle.","easy",ch13),
  Q("math7_ch13_mm_q5","math7_ch13_mean_median","Median of even count: ?",[c("Average of 2 middle values"),e("Just middle"),m("Random"),g("First")],"Two middles.",["Avg of two middles."],"Avg middles.","hard",ch13),
  Q("math7_ch13_mm_q6","math7_ch13_mean_median","Mean of 5, 10, 15?",[c("10"),m("15"),g("5"),e("30")],"30/3.",["30/3=10."],"Sum/count.","medium",ch13),
  Q("math7_ch13_mm_q7","math7_ch13_mean_median","Mean and median are both measures of…",[c("Centre / central tendency"),e("Spread"),m("Range"),g("Random")],"Centre.",["Both centre measures."],"Centre.","medium",ch13),
  Q("math7_ch13_mm_q8","math7_ch13_mean_median","Median of 2, 5, 7, 10 (even count)?",[c("6"),m("7"),g("5"),e("3.5")],"Avg of 5, 7.",["(5+7)/2=6."],"Avg of 2 middles.","hard",ch13),
  Q("math7_ch13_mo_q1","math7_ch13_mode","Mode = ?",[c("Most frequent value"),e("Mean"),m("Median"),g("Random")],"Frequency.",["Most often."],"Most frequent.","easy",ch13),
  Q("math7_ch13_mo_q2","math7_ch13_mode","Mode of 2, 3, 3, 5, 7?",[c("3"),m("5"),g("4"),e("Random")],"3 appears most.",["Most frequent."],"Most freq.","easy",ch13),
  Q("math7_ch13_mo_q3","math7_ch13_mode","Can data have 2 modes?",[c("Yes (bimodal)"),e("No"),m("Sometimes"),g("Random")],"Bimodal.",["Two values tied for most frequent."],"Bimodal.","medium",ch13),
  Q("math7_ch13_mo_q4","math7_ch13_mode","Mode of 1, 2, 3, 4, 5?",[c("No mode (all unique)"),e("3"),m("1"),g("5")],"No repeats.",["No mode if all unique."],"No mode.","medium",ch13),
  Q("math7_ch13_mo_q5","math7_ch13_mode","Mode useful for…",[c("Categorical data"),e("Random"),m("Only numbers"),g("Cannot")],"Most common category.",["Survey results."],"Categories.","medium",ch13),
  Q("math7_ch13_mo_q6","math7_ch13_mode","Mode of red, blue, red, green, red?",[c("Red"),e("Blue"),m("Green"),g("None")],"Red appears 3 times.",["Most frequent = red."],"Most freq.","easy",ch13),
  Q("math7_ch13_mo_q7","math7_ch13_mode","Mode of 5, 5, 5, 5?",[c("5"),m("None"),g("Random"),e("Cannot")],"All same.",["5 appears all times."],"5.","easy",ch13),
  Q("math7_ch13_mo_q8","math7_ch13_mode","Mode is the…",[c("Most common value"),e("Sum"),m("Average"),g("Middle")],"By definition.",["Most frequent."],"Most.","easy",ch13),

  Q("math7_ch14_cb_q1","math7_ch14_construction_basics","Tools for construction:",[c("Ruler + compass"),e("Just hands"),m("Random"),g("Calculator")],"Geometry tools.",["Standard tools."],"Ruler + compass.","easy",ch14),
  Q("math7_ch14_cb_q2","math7_ch14_construction_basics","Compass is for…",[c("Drawing arcs/circles"),e("Lines"),m("Random"),g("Angles")],"Arcs.",["Compass = circles."],"Arcs.","easy",ch14),
  Q("math7_ch14_cb_q3","math7_ch14_construction_basics","Construction lines should be…",[c("Light"),e("Bold"),m("Random"),g("Coloured")],"Light = can erase.",["Light pencil."],"Light.","medium",ch14),
  Q("math7_ch14_cb_q4","math7_ch14_construction_basics","Compass tip on…",[c("Centre"),e("Edge"),m("Random"),g("Inside")],"Pivot point.",["Steel point = centre."],"Centre.","easy",ch14),
  Q("math7_ch14_cb_q5","math7_ch14_construction_basics","Copy a segment using…",[c("Compass to measure"),e("Estimation"),m("Random"),g("Ruler")],"Compass transfer.",["Open compass to length."],"Compass transfer.","medium",ch14),
  Q("math7_ch14_cb_q6","math7_ch14_construction_basics","Mark a point with…",[c("Sharp dot"),e("Big circle"),m("Random"),g("Line")],"Precision.",["Sharp dot."],"Sharp dot.","easy",ch14),
  Q("math7_ch14_cb_q7","math7_ch14_construction_basics","Bisect a line: use…",[c("Perpendicular bisector"),e("Random"),m("Just middle"),g("Eye estimate")],"Construct method.",["Arcs from each end."],"Bisector.","medium",ch14),
  Q("math7_ch14_cb_q8","math7_ch14_construction_basics","Why construct precisely?",[c("Geometric accuracy"),e("Decoration"),m("Random"),g("Speed")],"Accuracy.",["Math accuracy."],"Accuracy.","medium",ch14),
  Q("math7_ch14_ct_q1","math7_ch14_construction_triangles","SSS construction needs…",[c("3 side lengths"),e("3 angles"),m("Random"),g("1 side")],"Side-Side-Side.",["3 sides."],"3 sides.","medium",ch14),
  Q("math7_ch14_ct_q2","math7_ch14_construction_triangles","SAS construction:",[c("2 sides + included angle"),e("All sides"),m("Random"),g("3 angles")],"S-A-S.",["Sides on either side of angle."],"SAS.","medium",ch14),
  Q("math7_ch14_ct_q3","math7_ch14_construction_triangles","ASA construction:",[c("2 angles + included side"),e("All angles"),m("Random"),g("All sides")],"A-S-A.",["Angle-Side-Angle."],"ASA.","medium",ch14),
  Q("math7_ch14_ct_q4","math7_ch14_construction_triangles","Construct triangle 3,4,5:",[c("Base 5, arcs 3 and 4 to find apex"),e("Random"),m("Just measure"),g("Cannot")],"SSS method.",["Arcs from ends."],"Arcs.","medium",ch14),
  Q("math7_ch14_ct_q5","math7_ch14_construction_triangles","If arcs don't meet, ___",[c("Triangle inequality violated"),e("Always"),m("Random"),g("Compass broken")],"Triangle impossible.",["a+b > c required."],"Inequality.","hard",ch14),
  Q("math7_ch14_ct_q6","math7_ch14_construction_triangles","Triangle inequality:",[c("Sum of 2 sides > 3rd"),e("All equal"),m("Random"),g("Sum 180")],"Standard.",["a+b > c."],"Sum > 3rd.","medium",ch14),
  Q("math7_ch14_ct_q7","math7_ch14_construction_triangles","Equilateral construction:",[c("Equal arcs from both ends of base"),e("Random"),m("Just draw"),g("Cannot")],"Equal sides.",["All arcs same radius."],"Equal arcs.","medium",ch14),
  Q("math7_ch14_ct_q8","math7_ch14_construction_triangles","Construct given angle: use…",[c("Protractor or compass"),e("Ruler only"),m("Random"),g("Estimate")],"Protractor easier.",["Protractor or arc method."],"Protractor.","easy",ch14),
  Q("math7_ch14_ti_q1","math7_ch14_tilings","Tiling means…",[c("Cover with shapes (no gaps)"),e("Random"),m("Cut shapes"),g("Decoration only")],"Tessellation.",["No gaps, no overlap."],"Cover.","easy",ch14),
  Q("math7_ch14_ti_q2","math7_ch14_tilings","Square tiles…",[c("Tile perfectly"),e("Cannot tile"),m("Random"),g("Only with circles")],"Yes.",["Squares tessellate."],"Yes.","easy",ch14),
  Q("math7_ch14_ti_q3","math7_ch14_tilings","Regular pentagon tiles plane?",[e("Yes"),c("No"),m("Sometimes"),g("Cannot say")],"Regular pentagon leaves gaps.",["Pentagonal angle 108° doesn't fit."],"No.","hard",ch14),
  Q("math7_ch14_ti_q4","math7_ch14_tilings","Hexagons tile?",[c("Yes (honeycomb)"),e("No"),m("Sometimes"),g("Random")],"Yes.",["Honeycomb pattern."],"Yes.","medium",ch14),
  Q("math7_ch14_ti_q5","math7_ch14_tilings","Circles tile?",[e("Yes"),c("No (gaps)"),m("Sometimes"),g("Cannot say")],"Curved edges leave gaps.",["Round → gaps."],"No.","medium",ch14),
  Q("math7_ch14_ti_q6","math7_ch14_tilings","Angles at tile meeting point sum to:",[c("360°"),m("180°"),g("90°"),e("270°")],"Full turn.",["Vertex = 360°."],"360°.","hard",ch14),
  Q("math7_ch14_ti_q7","math7_ch14_tilings","Equilateral triangle: at vertex…",[c("6 meet (60° × 6)"),m("3"),g("4"),e("5")],"60° fits 6 times.",["360/60 = 6."],"6 meet.","hard",ch14),
  Q("math7_ch14_ti_q8","math7_ch14_tilings","Tiles are usually…",[c("Same width"),e("Random sizes"),m("Triangular"),g("Different")],"Same for fairness.",["Equal tiles for fit."],"Same.","medium",ch14),
  Q("math7_ch14_te_q1","math7_ch14_tessellation","Tessellation is…",[c("Tiling pattern in art/nature"),e("Random"),m("Empty"),g("Decoration only")],"Artful tiling.",["Patterns covering plane."],"Tiling pattern.","easy",ch14),
  Q("math7_ch14_te_q2","math7_ch14_tessellation","Honeycomb tessellation:",[c("Hexagonal cells"),m("Triangles"),g("Squares"),e("Random")],"Hexagons.",["Bees use hexagons."],"Hexagons.","easy",ch14),
  Q("math7_ch14_te_q3","math7_ch14_tessellation","M.C. Escher art uses…",[c("Tessellations"),e("Random"),m("Just colors"),g("Photos")],"Famous tessellations.",["Escher = tessellation art."],"Escher.","hard",ch14),
  Q("math7_ch14_te_q4","math7_ch14_tessellation","Tiling without gaps requires…",[c("Angle sum at vertex = 360°"),e("Random"),m("Just 180"),g("90")],"Full turn.",["360° at each meeting."],"360°.","medium",ch14),
  Q("math7_ch14_te_q5","math7_ch14_tessellation","Islamic art commonly uses…",[c("Geometric tessellations"),e("Random"),m("Just lines"),g("Photos")],"Complex tessellations.",["Geometric tilings."],"Tessellations.","medium",ch14),
  Q("math7_ch14_te_q6","math7_ch14_tessellation","Repeating unit in tessellation:",[c("Tile (motif)"),e("Random"),m("Whole picture"),g("None")],"Unit tile.",["Smallest repeat block."],"Unit tile.","medium",ch14),
  Q("math7_ch14_te_q7","math7_ch14_tessellation","Tessellation by squares only fills plane?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"Squares tile easily.",["Square grid."],"Yes.","easy",ch14),
  Q("math7_ch14_te_q8","math7_ch14_tessellation","Mix of shapes can tile:",[c("Yes (e.g., squares + triangles)"),e("No"),m("Sometimes only"),g("Random")],"Semi-regular tilings.",["Combinations work."],"Yes.","medium",ch14),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 7 Math v2 questions (Ch13-14).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
