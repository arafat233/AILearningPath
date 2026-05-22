import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch7 = "Can You See the Pattern?";
const ch8 = "Mapping Your Way";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"5", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  // ch7 number_patterns
  Q("math5_ch7_np_q1","math5_ch7_number_patterns","Next in 5, 10, 15, 20, ?",[c("25"),m("21"),g("30"),e("100")],"+5 each step.",["+5: 20+5=25."],"+5.","easy",ch7),
  Q("math5_ch7_np_q2","math5_ch7_number_patterns","Pattern 2, 4, 8, 16. Rule?",[m("+2"),c("×2"),g("−2"),e("÷2")],"Each = previous × 2.",["Ratio = 2."],"Doubling.","medium",ch7),
  Q("math5_ch7_np_q3","math5_ch7_number_patterns","Next: 100, 90, 80, 70, ?",[m("75"),c("60"),g("65"),e("50")],"−10 each.",["−10."],"−10.","easy",ch7),
  Q("math5_ch7_np_q4","math5_ch7_number_patterns","First check ___ to find rule.",[c("Differences"),e("Colors"),m("Length"),g("Random")],"Differences reveal arithmetic pattern.",["Differences first."],"Differences.","easy",ch7),
  Q("math5_ch7_np_q5","math5_ch7_number_patterns","Next: 1, 3, 9, 27, ?",[c("81"),m("54"),g("36"),e("45")],"× 3.",["27 × 3 = 81."],"× 3.","medium",ch7),
  Q("math5_ch7_np_q6","math5_ch7_number_patterns","Pattern 7, 14, 21, 28: rule?",[c("+7"),m("×7"),g("−7"),e("÷7")],"Constant +7.",["7, 14, 21: diff 7."],"+7.","easy",ch7),
  Q("math5_ch7_np_q7","math5_ch7_number_patterns","Missing: 4, 8, ?, 32, 64",[c("16"),m("12"),g("20"),e("24")],"× 2 each step.",["8×2=16."],"×2.","medium",ch7),
  Q("math5_ch7_np_q8","math5_ch7_number_patterns","Next: 5, 10, 20, 40, ?",[c("80"),m("60"),g("50"),e("100")],"× 2.",["40 × 2 = 80."],"×2.","medium",ch7),
  // ch7 shape_patterns
  Q("math5_ch7_sp_q1","math5_ch7_shape_patterns","Pattern □△□△□___. Next?",[c("△"),e("□"),m("○"),g("Cannot tell")],"Unit □△. After □ → △.",["Unit: □△."],"Unit then repeat.","easy",ch7),
  Q("math5_ch7_sp_q2","math5_ch7_shape_patterns","Repeating part of pattern is called…",[c("Unit"),e("End"),m("Sum"),g("Total")],"Unit = repeating block.",["Smallest repeat = unit."],"Unit.","easy",ch7),
  Q("math5_ch7_sp_q3","math5_ch7_shape_patterns","Pattern ⭐⭐○⭐⭐○. Unit length?",[m("2"),c("3"),g("6"),e("1")],"⭐⭐○ = 3 items.",["Block of 3."],"3.","medium",ch7),
  Q("math5_ch7_sp_q4","math5_ch7_shape_patterns","7th letter in ABABAB ?",[c("A"),e("B"),m("AB"),g("Cannot say")],"Position 7 odd = A.",["Unit AB.","Odd = A."],"Position pattern.","hard",ch7),
  Q("math5_ch7_sp_q5","math5_ch7_shape_patterns","Continue: ○□△○□△ ___",[c("○"),m("□"),g("△"),e("⭐")],"Unit ○□△. After △ → ○.",["Restart unit."],"Cycle.","medium",ch7),
  Q("math5_ch7_sp_q6","math5_ch7_shape_patterns","Smallest repeating block is the…",[c("Unit"),e("Last shape"),m("First two"),g("Random")],"Unit = smallest repeat.",["Min block."],"Smallest.","easy",ch7),
  Q("math5_ch7_sp_q7","math5_ch7_shape_patterns","In ⬛⬛⬜⬛⬛⬜, count ⬛ per unit?",[m("1"),c("2"),g("3"),e("6")],"Unit ⬛⬛⬜. ⬛=2.",["Count in unit."],"Per unit.","medium",ch7),
  Q("math5_ch7_sp_q8","math5_ch7_shape_patterns","Shape patterns help us…",[c("Predict next"),e("Hide things"),m("Random"),g("Confuse")],"Patterns let us predict.",["Pattern = predictable."],"Predict.","easy",ch7),
  // ch7 growing_patterns
  Q("math5_ch7_gp_q1","math5_ch7_growing_patterns","1, 3, 6, 10, ?",[c("15"),m("13"),g("16"),e("11")],"Diffs +2,+3,+4 → next +5 → 15.",["Triangular numbers."],"+1 each diff.","hard",ch7),
  Q("math5_ch7_gp_q2","math5_ch7_growing_patterns","Growing pattern means…",[c("Differences change steadily"),e("Random"),m("Same"),g("Constant")],"Differences themselves form pattern.",["Diff of diffs."],"Changing diffs.","medium",ch7),
  Q("math5_ch7_gp_q3","math5_ch7_growing_patterns","Differences of 2, 5, 9, 14: ?",[c("Increasing: +3, +4, +5"),e("Constant"),m("Random"),g("Decreasing")],"+3, +4, +5.",["Diffs grow by 1."],"Increasing.","medium",ch7),
  Q("math5_ch7_gp_q4","math5_ch7_growing_patterns","Next: 2, 5, 9, 14, ?",[c("20"),m("19"),g("18"),e("17")],"Diffs +3,+4,+5,+6 → 14+6=20.",["Next diff +6.","14+6=20."],"+1 to diff.","hard",ch7),
  Q("math5_ch7_gp_q5","math5_ch7_growing_patterns","5, 10, 15, 20 is growing pattern?",[e("Yes"),c("No (arithmetic, constant +5)"),m("Sometimes"),g("Cannot tell")],"Constant diff = arithmetic, not growing.",["+5 constant.","Not growing."],"Constant ≠ growing.","medium",ch7),
  Q("math5_ch7_gp_q6","math5_ch7_growing_patterns","100, 98, 95, 91 is…",[c("Growing (declining) pattern"),e("Arithmetic"),m("Random"),g("Constant")],"Diffs −2,−3,−4 (growing in magnitude).",["Diffs increase in absolute value."],"Growing decline.","hard",ch7),
  Q("math5_ch7_gp_q7","math5_ch7_growing_patterns","To check growing pattern, look at…",[c("Differences of differences"),e("First term only"),m("Total"),g("Random")],"Diffs of diffs reveals growing.",["Compute diffs, then diffs of diffs."],"Diffs of diffs.","hard",ch7),
  Q("math5_ch7_gp_q8","math5_ch7_growing_patterns","0, 1, 3, 6, 10 rule:",[c("Add increasing 1, 2, 3, 4..."),e("+1 each"),m("Random"),g("× by 2")],"Triangular numbers.",["Diffs: 1, 2, 3, 4..."],"Add 1, 2, 3, ...","hard",ch7),
  // ch7 rotational_patterns
  Q("math5_ch7_rp_q1","math5_ch7_rotational_patterns","Pinwheel uses…",[c("Rotational symmetry"),e("None"),m("Line symmetry"),g("Random")],"Pinwheels rotate around center.",["Rotation around center."],"Rotational.","medium",ch7),
  Q("math5_ch7_rp_q2","math5_ch7_rotational_patterns","Mandala has often ___ symmetry.",[c("Both line + rotational"),e("None"),m("Only line"),g("Only rotational")],"Mandalas combine both.",["Lines + rotation centers."],"Both.","hard",ch7),
  Q("math5_ch7_rp_q3","math5_ch7_rotational_patterns","Rotational pattern: shape repeats around a…",[c("Center point"),e("Line"),m("Triangle"),g("Random")],"Around center.",["Center is fixed.","Pattern rotates."],"Center.","medium",ch7),
  Q("math5_ch7_rp_q4","math5_ch7_rotational_patterns","Star with 5 points has ___-fold rotational symmetry.",[c("5"),m("2"),g("10"),e("1")],"5 points → 5 matches per 360°.",["5 points = 5-fold."],"Points = order.","medium",ch7),
  Q("math5_ch7_rp_q5","math5_ch7_rotational_patterns","Spiral is a ___ pattern.",[c("Rotational + growing"),e("Constant"),m("Linear"),g("None")],"Spiral grows AND rotates.",["Spiral curves outward.","Combines both."],"Spiral.","hard",ch7),
  Q("math5_ch7_rp_q6","math5_ch7_rotational_patterns","Fan blades typically rotate by angle…",[c("360 / number of blades"),e("180"),m("90 always"),g("Random")],"Equal angle per blade.",["360°/n where n=blades."],"Equal angles.","medium",ch7),
  Q("math5_ch7_rp_q7","math5_ch7_rotational_patterns","Rotation in nature: example?",[c("Sunflower seed spiral"),e("Straight road"),m("Square box"),g("Random")],"Sunflowers spiral.",["Phyllotaxis = spiral pattern."],"Sunflower.","medium",ch7),
  Q("math5_ch7_rp_q8","math5_ch7_rotational_patterns","To draw rotational pattern, rotate around…",[c("Fixed centre"),e("Random point"),m("Edge"),g("Vertex only")],"Fixed center for rotation.",["Pick center.","Rotate by fixed angle."],"Fixed centre.","medium",ch7),

  // ch8 maps_reading
  Q("math5_ch8_mr_q1","math5_ch8_maps_reading","Map shows places from a…",[c("Top view"),e("Side view"),m("Front view"),g("Inside")],"Bird's eye = top.",["Maps = bird's eye."],"Top view.","easy",ch8),
  Q("math5_ch8_mr_q2","math5_ch8_maps_reading","Map's legend explains…",[c("Symbols"),e("Title only"),m("Page number"),g("Map author")],"Legend = key for symbols.",["Each symbol has meaning."],"Symbols.","easy",ch8),
  Q("math5_ch8_mr_q3","math5_ch8_maps_reading","What does blue typically mean on maps?",[m("Roads"),c("Water"),g("Parks"),e("Buildings")],"Blue = water.",["Standard convention."],"Blue = water.","easy",ch8),
  Q("math5_ch8_mr_q4","math5_ch8_maps_reading","Green on maps usually means…",[m("Water"),m("Roads"),c("Parks/Vegetation"),e("Buildings")],"Green = parks/forests.",["Vegetation = green."],"Green = parks.","easy",ch8),
  Q("math5_ch8_mr_q5","math5_ch8_maps_reading","First thing to check on a map?",[c("Title and legend"),e("Page number"),m("Author"),g("Random")],"Context first.",["Title: what map shows.","Legend: meaning of symbols."],"Title + legend.","medium",ch8),
  Q("math5_ch8_mr_q6","math5_ch8_maps_reading","Compass rose shows…",[c("Directions (N, E, S, W)"),e("Time"),m("Scale"),g("Random")],"Direction indicator.",["N, E, S, W."],"Directions.","easy",ch8),
  Q("math5_ch8_mr_q7","math5_ch8_maps_reading","Why use symbols on maps?",[c("Compact representation"),e("Decoration"),m("Random"),g("To confuse")],"Symbols save space.",["Saves space.","Quick recognition."],"Compact.","medium",ch8),
  Q("math5_ch8_mr_q8","math5_ch8_maps_reading","Globe is a map of…",[c("The whole Earth"),e("One city"),m("Moon"),g("A country")],"3D Earth model.",["Globe = Earth."],"Earth.","easy",ch8),
  // ch8 map_scale
  Q("math5_ch8_ms_q1","math5_ch8_map_scale","Scale 1 cm = 10 km. 5 cm = ?",[c("50 km"),m("5 km"),g("500 km"),e("0.5 km")],"5 × 10.",["× scale."],"× scale.","easy",ch8),
  Q("math5_ch8_ms_q2","math5_ch8_map_scale","Scale 1:1000 means…",[c("1 unit map = 1000 units real"),e("1 cm = 1 cm"),m("1 m = 1 cm"),g("Random")],"Ratio scale.",["Map:Real = 1:1000."],"Ratio.","hard",ch8),
  Q("math5_ch8_ms_q3","math5_ch8_map_scale","Scale 1 cm = 1 km. Real distance 8 km. Map distance?",[c("8 cm"),m("0.8 cm"),g("80 cm"),e("1 cm")],"8 ÷ 1 = 8 cm.",["Real ÷ scale = map."],"÷.","medium",ch8),
  Q("math5_ch8_ms_q4","math5_ch8_map_scale","Scale 1 cm = 5 km. 4 cm map = ?",[c("20 km"),m("4 km"),g("9 km"),e("1.25 km")],"4 × 5 = 20.",["× scale."],"× scale.","medium",ch8),
  Q("math5_ch8_ms_q5","math5_ch8_map_scale","Why is scale important?",[c("To know real distances"),e("For decoration"),m("Required"),g("Random")],"Scale converts map to real.",["Real = map × scale."],"Conversion.","easy",ch8),
  Q("math5_ch8_ms_q6","math5_ch8_map_scale","Map distance 6 cm, scale 1 cm = 2 km. Real?",[c("12 km"),m("3 km"),g("8 km"),e("6 cm")],"6 × 2.",["6 × 2 = 12 km."],"× scale.","medium",ch8),
  Q("math5_ch8_ms_q7","math5_ch8_map_scale","Scale 2 cm = 1 km. Real distance 5 km = ___ map distance.",[c("10 cm"),m("5 cm"),g("2.5 cm"),e("1 cm")],"5 × 2 = 10 cm.",["Real × 2 cm/km = 10."],"Use ratio.","hard",ch8),
  Q("math5_ch8_ms_q8","math5_ch8_map_scale","Smaller scale (1:50000 vs 1:1000) shows…",[c("Larger area, less detail"),e("Same"),m("Less area"),g("More detail")],"Smaller scale = bigger area shown, less detail.",["Smaller scale → bigger area, less detail."],"Smaller scale = bigger area.","hard",ch8),
  // ch8 directions_compass
  Q("math5_ch8_dc_q1","math5_ch8_directions_compass","Compass shows ___ directions.",[c("4 cardinal (N,E,S,W)"),e("8"),m("10"),g("2")],"4 main directions.",["NEWS."],"4.","easy",ch8),
  Q("math5_ch8_dc_q2","math5_ch8_directions_compass","On maps, north is usually…",[c("Up"),e("Down"),m("Left"),g("Right")],"Standard: north up.",["Convention."],"North up.","easy",ch8),
  Q("math5_ch8_dc_q3","math5_ch8_directions_compass","If north is up, west is…",[m("Up"),m("Right"),c("Left"),e("Down")],"NEWS clockwise.",["W = left when N up."],"Left.","easy",ch8),
  Q("math5_ch8_dc_q4","math5_ch8_directions_compass","Opposite of south?",[c("North"),m("East"),g("West"),e("Up")],"S ↔ N.",["Opposites: N-S, E-W."],"N.","easy",ch8),
  Q("math5_ch8_dc_q5","math5_ch8_directions_compass","Sun rises in the…",[c("East"),m("West"),g("North"),e("South")],"East = sunrise.",["East = sun rises."],"East.","easy",ch8),
  Q("math5_ch8_dc_q6","math5_ch8_directions_compass","NEWS clockwise from N:",[c("N, E, S, W"),e("N, S, E, W"),m("N, W, E, S"),g("N, W, S, E")],"Clockwise: N→E→S→W.",["NEWS clockwise."],"NEWS.","medium",ch8),
  Q("math5_ch8_dc_q7","math5_ch8_directions_compass","8 directions add intermediate: NE, NW, SE, SW. Total = ?",[m("4"),c("8"),g("12"),e("16")],"4 main + 4 intermediate = 8.",["Main + intercardinal."],"8.","medium",ch8),
  Q("math5_ch8_dc_q8","math5_ch8_directions_compass","Walking north then turning left (90°) → facing…",[m("South"),c("West"),g("East"),e("North")],"N + left 90° = W.",["From N, left = W."],"Left from N = W.","hard",ch8),
  // ch8 route_planning
  Q("math5_ch8_rp_q1","math5_ch8_route_planning","Route A-B-C distances 5 + 3 = ?",[c("8 km"),m("15 km"),g("2 km"),e("5 km")],"Sum legs.",["5 + 3 = 8."],"Sum.","easy",ch8),
  Q("math5_ch8_rp_q2","math5_ch8_route_planning","Total distance home to school via market: home-market 2 km, market-school 1 km. Total?",[c("3 km"),m("1 km"),g("4 km"),e("2 km")],"2 + 1 = 3.",["Sum legs."],"Sum.","easy",ch8),
  Q("math5_ch8_rp_q3","math5_ch8_route_planning","Two routes: A=10 km, B=7 km. Shorter?",[m("A"),c("B"),g("Same"),e("Cannot say")],"7 < 10.",["Compare distances."],"Smaller.","easy",ch8),
  Q("math5_ch8_rp_q4","math5_ch8_route_planning","Route is faster if…",[c("Shorter and good road"),e("Always shortest"),m("Random"),g("Longest")],"Faster ≠ always shortest.",["Short + good road = fast."],"Both factors.","medium",ch8),
  Q("math5_ch8_rp_q5","math5_ch8_route_planning","Round trip A → B → A. One way 50 km. Total?",[m("50 km"),c("100 km"),g("25 km"),e("150 km")],"2 × 50.",["Round trip = 2 × one-way."],"× 2.","easy",ch8),
  Q("math5_ch8_rp_q6","math5_ch8_route_planning","Routes: A 8 km, B 10 km with shortcut 2 km. B's effective = ?",[c("8 km"),m("10 km"),g("12 km"),e("2 km")],"With shortcut, 10 − 2 = 8 km.",["10 − 2 shortcut = 8."],"Subtract shortcut.","hard",ch8),
  Q("math5_ch8_rp_q7","math5_ch8_route_planning","Plan route considering…",[c("Distance and road quality"),e("Just distance"),m("Random"),g("Just quality")],"Both matter.",["Distance × quality."],"Both.","medium",ch8),
  Q("math5_ch8_rp_q8","math5_ch8_route_planning","Total of 3 segments: 5 + 8 + 7 = ?",[c("20 km"),m("15 km"),g("12 km"),e("25 km")],"Add all.",["5+8+7 = 20."],"Sum all.","easy",ch8),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 5 Math v2 questions (Ch7-8).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
