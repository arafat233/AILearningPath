import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch9 = "Boxes and Sketches";
const ch10 = "Tenths and Hundredths";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"5", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  // ch9 3d_shapes
  Q("math5_ch9_3d_q1","math5_ch9_3d_shapes","Cube has ___ faces.",[m("4"),c("6"),g("8"),e("12")],"6 square faces.",["Top, bottom, front, back, left, right."],"6.","easy",ch9),
  Q("math5_ch9_3d_q2","math5_ch9_3d_shapes","Cube has ___ edges.",[m("6"),m("8"),c("12"),e("24")],"12 edges where faces meet.",["12 lines between faces."],"12.","medium",ch9),
  Q("math5_ch9_3d_q3","math5_ch9_3d_shapes","Cube has ___ vertices.",[m("6"),c("8"),g("12"),e("4")],"8 corners.",["Each corner is a vertex.","8 corners."],"8.","medium",ch9),
  Q("math5_ch9_3d_q4","math5_ch9_3d_shapes","Sphere has ___ flat faces.",[c("0"),m("1"),g("2"),e("6")],"All curved.",["No flat faces."],"0.","easy",ch9),
  Q("math5_ch9_3d_q5","math5_ch9_3d_shapes","Cylinder has ___ flat faces.",[m("0"),m("1"),c("2"),e("3")],"Top and bottom circles.",["Top + bottom = 2 flat."],"2.","easy",ch9),
  Q("math5_ch9_3d_q6","math5_ch9_3d_shapes","Cone has ___ vertices.",[m("0"),c("1"),g("2"),e("4")],"Pointed tip = 1 vertex.",["Tip = vertex."],"1.","medium",ch9),
  Q("math5_ch9_3d_q7","math5_ch9_3d_shapes","Cuboid has ___ faces.",[m("4"),c("6"),g("8"),e("12")],"Like cube, 6.",["6 rectangular faces."],"6.","easy",ch9),
  Q("math5_ch9_3d_q8","math5_ch9_3d_shapes","Pyramid (square base) has ___ faces.",[m("4"),c("5"),g("6"),e("8")],"1 base + 4 triangles.",["1 base + 4 sides = 5."],"5.","medium",ch9),
  // ch9 nets_cube
  Q("math5_ch9_nc_q1","math5_ch9_nets_cube","Net of a cube has ___ squares.",[m("4"),c("6"),g("8"),e("12")],"6 faces = 6 squares.",["1 square per face."],"6.","easy",ch9),
  Q("math5_ch9_nc_q2","math5_ch9_nets_cube","Cube nets: there are ___ distinct ones.",[m("6"),c("11"),g("4"),e("12")],"11 distinct cube nets.",["Mathematical fact: 11 nets."],"11.","hard",ch9),
  Q("math5_ch9_nc_q3","math5_ch9_nets_cube","A net is an ___ shape.",[c("Unfolded"),e("Round"),m("3D"),g("Random")],"Net = unfolded.",["Flat pattern that folds into 3D."],"Unfolded.","easy",ch9),
  Q("math5_ch9_nc_q4","math5_ch9_nets_cube","Cube net is a flat pattern that folds into a…",[c("Cube"),e("Sphere"),m("Cone"),g("Pyramid")],"Cube net → cube.",["Folding = construction."],"Cube.","easy",ch9),
  Q("math5_ch9_nc_q5","math5_ch9_nets_cube","Cross-shape (6 squares) is a valid cube net?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"Yes, T or cross shapes work.",["Common cube net."],"Yes.","medium",ch9),
  Q("math5_ch9_nc_q6","math5_ch9_nets_cube","Pyramid (sq base) net has ___ shapes.",[m("4"),c("5 (1 square + 4 triangles)"),g("6"),e("8")],"1 sq + 4 tri.",["Base + sides."],"1 sq + 4 tri.","hard",ch9),
  Q("math5_ch9_nc_q7","math5_ch9_nets_cube","Cylinder net has ___ shapes.",[c("2 circles + 1 rectangle"),e("Just circles"),m("Just rectangle"),g("Triangle")],"Top, bottom circles + curved side as rectangle.",["Side unrolls to rectangle."],"2 circles + 1 rectangle.","hard",ch9),
  Q("math5_ch9_nc_q8","math5_ch9_nets_cube","Cone net has…",[c("1 circle + 1 sector"),e("Just circle"),m("Square"),g("Triangle")],"Base + sector (curved side).",["Base + curved side flattened."],"Circle + sector.","hard",ch9),
  // ch9 views_objects
  Q("math5_ch9_vo_q1","math5_ch9_views_objects","Standard views are…",[c("Top, front, side"),e("Inside"),m("Bottom"),g("Random")],"3 main views.",["Top, front, side."],"3 views.","easy",ch9),
  Q("math5_ch9_vo_q2","math5_ch9_views_objects","Cube from any side looks like a…",[c("Square"),e("Triangle"),m("Rectangle"),g("Circle")],"All 6 faces squares.",["Cube face = square."],"Square.","easy",ch9),
  Q("math5_ch9_vo_q3","math5_ch9_views_objects","Cone from above (point down): top view = ?",[c("Circle"),e("Triangle"),m("Square"),g("Cone")],"Circular base from top.",["Looking down sees base."],"Circle.","medium",ch9),
  Q("math5_ch9_vo_q4","math5_ch9_views_objects","Cylinder from side: profile = ?",[m("Circle"),c("Rectangle"),g("Triangle"),e("Square")],"Side = rectangle (curved unrolled).",["Side profile = rectangle."],"Rectangle.","easy",ch9),
  Q("math5_ch9_vo_q5","math5_ch9_views_objects","To fully describe 3D, you need…",[c("3 views"),e("1"),m("2"),g("5")],"Top + front + side.",["3 views suffice."],"3.","medium",ch9),
  Q("math5_ch9_vo_q6","math5_ch9_views_objects","Sphere from any angle looks like a…",[c("Circle"),e("Square"),m("Triangle"),g("Ellipse")],"Round from all angles.",["Sphere = round.","Always circle."],"Circle.","easy",ch9),
  Q("math5_ch9_vo_q7","math5_ch9_views_objects","Cuboid front and top are…",[c("Often different rectangles"),e("Always same"),m("Triangles"),g("Circles")],"Different sides have different dimensions.",["L×H vs L×W."],"Different.","medium",ch9),
  Q("math5_ch9_vo_q8","math5_ch9_views_objects","Pyramid from above (sq base) = ?",[m("Triangle"),c("Square (with diagonals or X)"),g("Rectangle"),e("Circle")],"Square base from top, with apex projected to center.",["Square + X from apex projection."],"Square + diagonals.","hard",ch9),
  // ch9 building_models
  Q("math5_ch9_bm_q1","math5_ch9_building_models","To build a paper cube, you need a…",[c("Net (cut + fold + tape)"),e("Square only"),m("Triangle"),g("Random")],"Net method.",["Cut → fold → tape."],"Net.","easy",ch9),
  Q("math5_ch9_bm_q2","math5_ch9_building_models","Score fold lines means…",[c("Lightly cut for clean fold"),e("Skip them"),m("Draw on them"),g("Random")],"Score = light cut.",["Light cut on fold line.","Easier fold."],"Score = light cut.","hard",ch9),
  Q("math5_ch9_bm_q3","math5_ch9_building_models","Tape or glue the…",[c("Edges of net"),e("Center"),m("Outside"),g("Random")],"Tape edges to hold shape.",["Tape connects edges."],"Edges.","medium",ch9),
  Q("math5_ch9_bm_q4","math5_ch9_building_models","Why use paper models?",[c("To visualize 3D shapes"),e("Decoration"),m("Random"),g("To eat")],"Models help understand 3D.",["3D abstract.","Models concrete."],"Visualize.","medium",ch9),
  Q("math5_ch9_bm_q5","math5_ch9_building_models","After cutting net, next step?",[c("Fold along lines"),e("Eat it"),m("Throw"),g("Random")],"Fold.",["Cut → fold."],"Fold.","easy",ch9),
  Q("math5_ch9_bm_q6","math5_ch9_building_models","Best paper for models?",[c("Thick (cardstock)"),e("Tissue"),m("Random"),g("Wet")],"Thick paper holds shape.",["Stiff paper = stable model."],"Thick.","medium",ch9),
  Q("math5_ch9_bm_q7","math5_ch9_building_models","Cone has ___ pieces for net.",[m("1"),c("2 (circle + sector)"),g("4"),e("6")],"Base + curved side.",["Base circle + curved sector."],"2.","hard",ch9),
  Q("math5_ch9_bm_q8","math5_ch9_building_models","Tools for building models?",[c("Scissors, ruler, glue/tape"),e("Just hands"),m("Random"),g("Computer only")],"Scissors + ruler + adhesive.",["Cut, measure, attach."],"Tools.","easy",ch9),

  // ch10 decimals_intro
  Q("math5_ch10_di_q1","math5_ch10_decimals_intro","Decimal point separates…",[c("Whole and fractional parts"),e("Two numbers"),m("Random"),g("Negative")],"Whole left, fraction right.",["Before dot = whole.","After dot = parts of 1."],"Whole.fraction.","easy",ch10),
  Q("math5_ch10_di_q2","math5_ch10_decimals_intro","0.5 means…",[c("5 tenths = 1/2"),e("5 wholes"),m("5"),g("50")],"0.5 = 5/10 = 1/2.",["Tenths place: 5."],"5 tenths.","easy",ch10),
  Q("math5_ch10_di_q3","math5_ch10_decimals_intro","1st place after decimal is…",[c("Tenths"),e("Hundredths"),m("Ones"),g("Thousandths")],"Tenths.",["Position 1: tenths."],"Tenths.","easy",ch10),
  Q("math5_ch10_di_q4","math5_ch10_decimals_intro","2nd place after decimal is…",[m("Tenths"),c("Hundredths"),g("Thousandths"),e("Ones")],"Hundredths.",["Position 2: hundredths."],"Hundredths.","easy",ch10),
  Q("math5_ch10_di_q5","math5_ch10_decimals_intro","0.25 = ?",[c("25 hundredths"),e("25 tenths"),m("2.5"),g("250")],"25/100.",["0.25 = 25 hundredths."],"25/100.","medium",ch10),
  Q("math5_ch10_di_q6","math5_ch10_decimals_intro","More decimal digits = bigger? T/F",[e("True"),c("False"),m("Sometimes"),g("Cannot tell")],"0.10 = 0.1; more digits doesn't always mean bigger.",["Trailing zeros don't change value."],"Not always.","medium",ch10),
  Q("math5_ch10_di_q7","math5_ch10_decimals_intro","Convert 1/2 to decimal:",[c("0.5"),m("0.2"),g("1.2"),e("0.1")],"1 ÷ 2 = 0.5.",["1 ÷ 2 = 0.5."],"½ = 0.5.","easy",ch10),
  Q("math5_ch10_di_q8","math5_ch10_decimals_intro","Convert 3/4 to decimal:",[c("0.75"),m("0.34"),g("0.43"),e("0.7")],"3 ÷ 4 = 0.75.",["3 ÷ 4 = 0.75."],"¾ = 0.75.","medium",ch10),
  // ch10 tenths
  Q("math5_ch10_te_q1","math5_ch10_tenths","1 tenth = ?",[c("0.1"),m("0.01"),g("1"),e("10")],"0.1 = 1/10.",["First decimal place."],"0.1.","easy",ch10),
  Q("math5_ch10_te_q2","math5_ch10_tenths","0.7 = ___ tenths.",[c("7"),m("0.7"),g("70"),e("0.07")],"7 tenths.",["0.7 = 7 × 0.1."],"7.","easy",ch10),
  Q("math5_ch10_te_q3","math5_ch10_tenths","½ in decimal = ___ tenths.",[c("5 tenths (0.5)"),m("2 tenths"),g("0.05"),e("1.5")],"½ = 5/10 = 5 tenths.",["½ = 5/10 = 0.5."],"5 tenths.","medium",ch10),
  Q("math5_ch10_te_q4","math5_ch10_tenths","0.3 + 0.4 = ?",[c("0.7"),m("0.07"),g("0.34"),e("7")],"3+4 = 7 tenths.",["0.3 + 0.4 = 0.7."],"Add tenths.","easy",ch10),
  Q("math5_ch10_te_q5","math5_ch10_tenths","0.5 + 0.5 = ?",[c("1 (whole)"),m("0.10"),g("0.55"),e("10")],"5+5 = 10 tenths = 1.",["10 tenths = 1 whole."],"= 1.","easy",ch10),
  Q("math5_ch10_te_q6","math5_ch10_tenths","Tenths fraction: 4/10 = ?",[c("0.4"),m("0.04"),g("40"),e("4")],"4/10 = 0.4.",["0.4."],"4/10 = 0.4.","easy",ch10),
  Q("math5_ch10_te_q7","math5_ch10_tenths","0.9 + 0.1 = ?",[c("1"),m("0.10"),g("0.91"),e("0.91")],"10 tenths = 1.",["0.9 + 0.1 = 1.0."],"Add tenths.","medium",ch10),
  Q("math5_ch10_te_q8","math5_ch10_tenths","Which is bigger: 0.5 or 0.3?",[c("0.5"),e("0.3"),m("Equal"),g("Cannot tell")],"5 tenths > 3 tenths.",["Compare tenths."],"0.5.","easy",ch10),
  // ch10 hundredths
  Q("math5_ch10_hu_q1","math5_ch10_hundredths","1 hundredth = ?",[m("0.1"),c("0.01"),g("0.001"),e("1")],"1/100.",["2nd decimal place."],"0.01.","easy",ch10),
  Q("math5_ch10_hu_q2","math5_ch10_hundredths","0.25 = ___ hundredths.",[c("25"),m("2.5"),g("250"),e("2")],"25 hundredths.",["0.25 = 25/100."],"25.","medium",ch10),
  Q("math5_ch10_hu_q3","math5_ch10_hundredths","0.50 = ?",[c("50 hundredths = ½"),e("5 wholes"),m("0.05"),g("500")],"50/100 = 1/2.",["0.50 = 50/100 = ½."],"50/100 = ½.","medium",ch10),
  Q("math5_ch10_hu_q4","math5_ch10_hundredths","0.75 = ?",[c("75 hundredths = ¾"),m("0.7"),g("0.075"),e("75")],"75/100 = 3/4.",["0.75 = 75/100 = ¾."],"75/100 = ¾.","medium",ch10),
  Q("math5_ch10_hu_q5","math5_ch10_hundredths","Compare 0.5 and 0.50.",[e("0.5 bigger"),m("0.50 bigger"),c("Equal"),g("Cannot say")],"Trailing zero doesn't change value.",["0.5 = 0.50."],"Equal.","medium",ch10),
  Q("math5_ch10_hu_q6","math5_ch10_hundredths","0.07 = ?",[c("7 hundredths"),e("7 tenths"),m("0.7"),g("70")],"7 in hundredths place.",["0.07: 0 tenths, 7 hundredths."],"7/100.","medium",ch10),
  Q("math5_ch10_hu_q7","math5_ch10_hundredths","Hundredths fraction: 23/100 = ?",[c("0.23"),m("2.3"),g("0.023"),e("23")],"23/100 = 0.23.",["23 hundredths = 0.23."],"23/100 = 0.23.","medium",ch10),
  Q("math5_ch10_hu_q8","math5_ch10_hundredths","Which is bigger: 0.25 or 0.5?",[e("0.25"),c("0.5"),m("Equal"),g("Cannot tell")],"0.5 = 0.50 > 0.25.",["0.50 > 0.25."],"0.5 bigger.","medium",ch10),
  // ch10 decimal_operations
  Q("math5_ch10_do_q1","math5_ch10_decimal_operations","1.25 + 2.5 = ?",[c("3.75"),m("3.5"),g("3.30"),e("3.75")],"Align decimals.",["1.25 + 2.50 = 3.75."],"Align decimals.","medium",ch10),
  Q("math5_ch10_do_q2","math5_ch10_decimal_operations","Add 0.3 + 0.45 = ?",[c("0.75"),m("0.48"),g("0.30"),e("0.345")],"0.30 + 0.45 = 0.75.",["Add trailing 0.","0.30 + 0.45 = 0.75."],"Align.","medium",ch10),
  Q("math5_ch10_do_q3","math5_ch10_decimal_operations","To add decimals, line up the…",[c("Decimal points"),e("First digit"),m("Last digit"),g("Random")],"Aligns place values correctly.",["Decimal points aligned."],"Decimal points.","easy",ch10),
  Q("math5_ch10_do_q4","math5_ch10_decimal_operations","5.5 − 2.25 = ?",[c("3.25"),m("3.30"),g("2.75"),e("3.5")],"5.50 − 2.25 = 3.25.",["5.50 − 2.25 = 3.25."],"Align decimals.","medium",ch10),
  Q("math5_ch10_do_q5","math5_ch10_decimal_operations","2.5 + 1.75 = ?",[c("4.25"),m("4.5"),g("3.75"),e("4")],"2.50 + 1.75 = 4.25.",["Align."],"Align.","medium",ch10),
  Q("math5_ch10_do_q6","math5_ch10_decimal_operations","10 − 0.5 = ?",[c("9.5"),m("9.0"),g("10.5"),e("0.5")],"10.0 − 0.5 = 9.5.",["Subtract."],"Subtract.","easy",ch10),
  Q("math5_ch10_do_q7","math5_ch10_decimal_operations","0.75 + 0.25 = ?",[c("1 (or 1.00)"),m("0.100"),g("1.25"),e("0.5")],"0.75 + 0.25 = 1.00.",["Sums to 1."],"Add.","medium",ch10),
  Q("math5_ch10_do_q8","math5_ch10_decimal_operations","Why add trailing zeros?",[c("To match number of decimal places"),e("Decoration"),m("Random"),g("Make bigger")],"Aligns place values.",["0.5 = 0.50 for adding to 0.25."],"Match places.","hard",ch10),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 5 Math v2 questions (Ch9-10).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
