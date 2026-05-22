import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch11 = "Area and Its Boundary";
const ch12 = "Smart Charts";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"5", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  // ch11 area_calculation
  Q("math5_ch11_ac_q1","math5_ch11_area_calculation","Rectangle 7 × 5. Area?",[c("35"),m("12"),g("24"),e("70")],"7×5=35.",["A = l×w."],"l×w.","easy",ch11),
  Q("math5_ch11_ac_q2","math5_ch11_area_calculation","Square side 9. Area?",[c("81"),m("36"),g("18"),e("9")],"9²=81.",["s²."],"s².","easy",ch11),
  Q("math5_ch11_ac_q3","math5_ch11_area_calculation","Rectangle area formula:",[m("2(l+w)"),c("l × w"),g("l+w"),e("l-w")],"l × w.",["Area=lw."],"l × w.","easy",ch11),
  Q("math5_ch11_ac_q4","math5_ch11_area_calculation","Square side 12. Area?",[c("144"),m("48"),g("24"),e("96")],"12²=144.",["12 × 12 = 144."],"s².","medium",ch11),
  Q("math5_ch11_ac_q5","math5_ch11_area_calculation","6 × 4 rectangle. Area?",[c("24"),m("10"),g("20"),e("48")],"24.",["6 × 4 = 24."],"l × w.","easy",ch11),
  Q("math5_ch11_ac_q6","math5_ch11_area_calculation","Floor 10m × 8m. Area?",[c("80 m²"),m("18 m²"),g("36 m²"),e("100 m²")],"10×8.",["A = 80 m²."],"l × w with units.","medium",ch11),
  Q("math5_ch11_ac_q7","math5_ch11_area_calculation","If A = 30, l = 5, w = ?",[c("6"),m("3"),g("25"),e("15")],"30÷5=6.",["w = A/l = 30/5 = 6."],"Inverse.","medium",ch11),
  Q("math5_ch11_ac_q8","math5_ch11_area_calculation","Area unit:",[c("Square units (cm², m²)"),e("Length units"),m("Volume units"),g("Weight")],"Sq units.",["A in sq units."],"Sq units.","easy",ch11),
  // ch11 perimeter_calculation
  Q("math5_ch11_pc_q1","math5_ch11_perimeter_calculation","Square side 7. P?",[c("28"),m("49"),g("14"),e("7")],"4×7.",["P = 4s."],"4s.","easy",ch11),
  Q("math5_ch11_pc_q2","math5_ch11_perimeter_calculation","Rectangle 6×4. P?",[c("20"),m("24"),g("10"),e("16")],"2(6+4)=20.",["P = 2(l+w)."],"2(l+w).","easy",ch11),
  Q("math5_ch11_pc_q3","math5_ch11_perimeter_calculation","Triangle sides 3, 4, 5. P?",[c("12"),m("60"),g("7"),e("15")],"Sum.",["3+4+5=12."],"Sum sides.","easy",ch11),
  Q("math5_ch11_pc_q4","math5_ch11_perimeter_calculation","Square P formula:",[c("4s"),m("s²"),g("2s"),e("s")],"4s.",["4 equal sides."],"4s.","easy",ch11),
  Q("math5_ch11_pc_q5","math5_ch11_perimeter_calculation","Rectangle P formula:",[m("l × w"),c("2(l + w)"),g("l + w"),e("4l")],"2(l+w).",["2 lengths + 2 widths."],"2(l+w).","easy",ch11),
  Q("math5_ch11_pc_q6","math5_ch11_perimeter_calculation","Pentagon (regular) side 4. P?",[c("20"),m("16"),g("25"),e("15")],"5×4.",["P = 5s."],"5s.","medium",ch11),
  Q("math5_ch11_pc_q7","math5_ch11_perimeter_calculation","Square side 11. P?",[c("44"),m("121"),g("22"),e("11")],"4×11.",["P = 4s = 44."],"4s.","easy",ch11),
  Q("math5_ch11_pc_q8","math5_ch11_perimeter_calculation","Hexagon (regular) side 5. P?",[c("30"),m("25"),g("60"),e("15")],"6×5.",["P = 6s."],"6s.","medium",ch11),
  // ch11 area_vs_perimeter
  Q("math5_ch11_ap_q1","math5_ch11_area_vs_perimeter","Two rectangles, same area, different perimeter. Possible?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"4×4 vs 2×8: same A but different P.",["4×4: A=16, P=16.","2×8: A=16, P=20."],"Yes possible.","hard",ch11),
  Q("math5_ch11_ap_q2","math5_ch11_area_vs_perimeter","Same perimeter, different area possible?",[c("Yes"),e("No"),m("Always equal"),g("Cannot say")],"6×6 vs 3×9 both P=24 but A=36 vs 27.",["Same P, diff A."],"Yes.","hard",ch11),
  Q("math5_ch11_ap_q3","math5_ch11_area_vs_perimeter","Area in ___ units; perimeter in ___ units.",[c("Square; length"),e("Length; square"),m("Both length"),g("Both sq")],"Different units.",["A: sq, P: linear."],"Diff units.","medium",ch11),
  Q("math5_ch11_ap_q4","math5_ch11_area_vs_perimeter","Fence garden = need…",[e("Area"),c("Perimeter"),m("Volume"),g("Diagonal")],"Around = perimeter.",["Fence around."],"P.","easy",ch11),
  Q("math5_ch11_ap_q5","math5_ch11_area_vs_perimeter","Carpet floor = need…",[c("Area"),m("Perimeter"),g("Both"),e("Neither")],"Floor coverage = area.",["Covers entire floor."],"A.","easy",ch11),
  Q("math5_ch11_ap_q6","math5_ch11_area_vs_perimeter","Rectangle 5×3: A=?, P=?",[c("A=15, P=16"),m("A=8, P=15"),g("A=16, P=15"),e("A=15, P=30")],"15 and 16.",["A: 5×3=15.","P: 2(5+3)=16."],"Separate.","medium",ch11),
  Q("math5_ch11_ap_q7","math5_ch11_area_vs_perimeter","Same area, different P: which 4×4 (square) or 2×8 has more P?",[m("4×4"),c("2×8"),g("Same"),e("Cannot say")],"4×4 P=16, 2×8 P=20.",["More elongated = more P."],"2×8.","hard",ch11),
  Q("math5_ch11_ap_q8","math5_ch11_area_vs_perimeter","Paint wall = ___?",[c("Area"),m("Perimeter"),g("Volume"),e("Diagonal")],"Coverage = area.",["Wall surface = area."],"A.","easy",ch11),
  // ch11 real_problems
  Q("math5_ch11_rp_q1","math5_ch11_real_problems","Fencing 10m × 8m garden, fence cost ₹50/m. Total cost?",[c("₹1800"),m("₹3000"),g("₹800"),e("₹500")],"P=36; 36×50=1800.",["P = 2(10+8) = 36.","Cost = 36 × 50 = 1800."],"P × cost/m.","hard",ch11),
  Q("math5_ch11_rp_q2","math5_ch11_real_problems","Carpet 4m × 3m floor at ₹100/m². Total?",[c("₹1200"),m("₹400"),g("₹700"),e("₹1400")],"A=12; ×100=1200.",["A = 12 m².","Cost = 12 × 100 = 1200."],"A × rate.","hard",ch11),
  Q("math5_ch11_rp_q3","math5_ch11_real_problems","Tiling 5×4 floor at ₹50 per sq m. Cost?",[c("₹1000"),m("₹450"),g("₹100"),e("₹900")],"5×4=20; 20×50=1000.",["A = 20 sq m.","Cost = 20 × 50 = 1000."],"A × rate.","medium",ch11),
  Q("math5_ch11_rp_q4","math5_ch11_real_problems","Fence square plot side 10m. Length?",[c("40 m"),m("100 m"),g("20 m"),e("160 m")],"P=4×10=40.",["P = 40 m."],"4s for square.","easy",ch11),
  Q("math5_ch11_rp_q5","math5_ch11_real_problems","Paint a 4×3 wall at ₹200 per sq m. Cost?",[c("₹2400"),m("₹1400"),g("₹400"),e("₹600")],"A=12; ×200=2400.",["A = 12 sq m.","Cost = 12 × 200 = 2400."],"A × rate.","medium",ch11),
  Q("math5_ch11_rp_q6","math5_ch11_real_problems","Garden 20m × 15m needs fencing. Length?",[c("70 m"),m("35 m"),g("300 m"),e("60 m")],"P = 2(20+15)=70.",["P = 2(20+15) = 70."],"2(l+w).","medium",ch11),
  Q("math5_ch11_rp_q7","math5_ch11_real_problems","Floor 6m × 5m, tiles 1m × 1m each. How many tiles?",[c("30"),m("11"),g("60"),e("36")],"A=30; each tile=1; need 30.",["A = 6×5 = 30.","Each tile = 1.","30 tiles."],"A ÷ tile.","hard",ch11),
  Q("math5_ch11_rp_q8","math5_ch11_real_problems","Wall paint at ₹250/sq m, area 18 sq m. Cost?",[c("₹4500"),m("₹250"),g("₹450"),e("₹2500")],"18×250=4500.",["Cost = A × rate."],"A × rate.","medium",ch11),

  // ch12 tables_data
  Q("math5_ch12_td_q1","math5_ch12_tables_data","Tables organize data in…",[c("Rows and columns"),e("Single line"),m("Circle"),g("Random")],"Rows × columns.",["Rows: horizontal.","Columns: vertical."],"Rows × cols.","easy",ch12),
  Q("math5_ch12_td_q2","math5_ch12_tables_data","To read a value, find row × column intersection.",[c("True"),e("False"),m("Sometimes"),g("Random")],"Intersection = cell.",["Row + column = cell."],"Intersection.","easy",ch12),
  Q("math5_ch12_td_q3","math5_ch12_tables_data","Headers (row + column labels) tell…",[c("Category names"),e("Numbers"),m("Random"),g("Sums")],"Labels = category names.",["Headers identify what data is."],"Headers.","medium",ch12),
  Q("math5_ch12_td_q4","math5_ch12_tables_data","Total row sums…",[c("All values in column"),e("First row"),m("Random"),g("Multiplied")],"Total = sum of column.",["Sum down column."],"Column sum.","medium",ch12),
  Q("math5_ch12_td_q5","math5_ch12_tables_data","Student marks table: row = student, col = subject. Cell = ?",[c("Student's mark in that subject"),e("Average"),m("Total"),g("Random")],"Cell at intersection.",["Row × column → mark."],"Intersection.","easy",ch12),
  Q("math5_ch12_td_q6","math5_ch12_tables_data","Why use tables?",[c("Organized data, easy to read"),e("Decoration"),m("Hard to read"),g("Random")],"Organized = clear.",["Tables structure data."],"Organize.","easy",ch12),
  Q("math5_ch12_td_q7","math5_ch12_tables_data","Most tables have what at top?",[c("Header row (column names)"),e("Total row"),m("Random"),g("Pictures")],"Headers at top.",["First row: column names."],"Header row.","medium",ch12),
  Q("math5_ch12_td_q8","math5_ch12_tables_data","Tables can have totals at…",[c("Row OR column ends"),e("Only top"),m("Only middle"),g("Random")],"Either end.",["Row totals at right.","Column totals at bottom."],"Either end.","medium",ch12),
  // ch12 bar_graphs
  Q("math5_ch12_bg_q1","math5_ch12_bar_graphs","Taller bar means…",[e("Smaller"),c("Bigger"),m("Same"),g("Random")],"Height = value.",["Bar height ∝ value."],"Taller = bigger.","easy",ch12),
  Q("math5_ch12_bg_q2","math5_ch12_bar_graphs","y-axis on bar graph shows…",[c("Values"),e("Names"),m("Title"),g("Colors")],"Values.",["y = quantitative."],"Values.","medium",ch12),
  Q("math5_ch12_bg_q3","math5_ch12_bar_graphs","x-axis on bar graph shows…",[m("Values"),c("Categories"),g("Title"),e("Time")],"Categories.",["x = categories."],"Categories.","medium",ch12),
  Q("math5_ch12_bg_q4","math5_ch12_bar_graphs","Bars usually have…",[c("Equal width"),e("Different widths"),m("No width"),g("Random")],"Equal width = fair compare.",["Same width.","Heights vary."],"Equal width.","medium",ch12),
  Q("math5_ch12_bg_q5","math5_ch12_bar_graphs","To find biggest category, look for…",[c("Tallest bar"),e("Shortest"),m("Random"),g("Color")],"Tallest = biggest value.",["Tallest = max."],"Tallest.","easy",ch12),
  Q("math5_ch12_bg_q6","math5_ch12_bar_graphs","Bar A=10, B=15. Difference?",[c("5"),m("25"),g("150"),e("0")],"15-10=5.",["Subtract."],"Subtract.","easy",ch12),
  Q("math5_ch12_bg_q7","math5_ch12_bar_graphs","y-axis scale 1=2 units. Bar at 4. Value?",[c("8"),m("4"),g("2"),e("16")],"4×2.",["4 marks × 2 = 8."],"× scale.","medium",ch12),
  Q("math5_ch12_bg_q8","math5_ch12_bar_graphs","Total of bars A=5, B=10, C=15?",[c("30"),m("25"),g("150"),e("10")],"5+10+15=30.",["Sum bars."],"Sum.","easy",ch12),
  // ch12 pie_charts
  Q("math5_ch12_pc_q1","math5_ch12_pie_charts","Pie chart shows parts of a…",[c("Whole (circle)"),e("Line"),m("Triangle"),g("Random")],"Circle = whole.",["Slices = parts of whole."],"Whole as circle.","medium",ch12),
  Q("math5_ch12_pc_q2","math5_ch12_pie_charts","Pie slices sum to…",[c("100% (the whole)"),e("Anything"),m("Random"),g("Just 50%")],"All parts = whole = 100%.",["Total = 100%."],"100%.","easy",ch12),
  Q("math5_ch12_pc_q3","math5_ch12_pie_charts","Biggest slice = ___?",[c("Most common / highest share"),e("Smallest"),m("Random"),g("Average")],"Biggest = biggest share.",["Visual: biggest slice = max."],"Biggest = max.","easy",ch12),
  Q("math5_ch12_pc_q4","math5_ch12_pie_charts","Pie chart of survey: 50% A, 30% B, 20% C. A is…",[c("Largest slice"),e("Smallest"),m("Same as B"),g("Random")],"50 is largest.",["50 > 30 > 20."],"Largest.","easy",ch12),
  Q("math5_ch12_pc_q5","math5_ch12_pie_charts","Why use pie chart?",[c("Show proportions visually"),e("Show time series"),m("Random"),g("Confuse")],"Proportions visible.",["Visual proportions."],"Proportions.","medium",ch12),
  Q("math5_ch12_pc_q6","math5_ch12_pie_charts","Slice angle for 25% of pie?",[c("90°"),m("45°"),g("180°"),e("100°")],"25% of 360° = 90°.",["25/100 × 360 = 90°."],"% × 360 / 100.","hard",ch12),
  Q("math5_ch12_pc_q7","math5_ch12_pie_charts","Half pie = ___?",[c("50%"),m("25%"),g("100%"),e("180%")],"Half = 50%.",["Half = 50%."],"Half = 50%.","easy",ch12),
  Q("math5_ch12_pc_q8","math5_ch12_pie_charts","Pie chart limitation:",[c("Hard with many categories"),e("Always best"),m("Random"),g("Cannot show parts")],"Many slices clutter pie.",["More than 6-7 categories = messy."],"Many categories messy.","hard",ch12),
  // ch12 data_analysis
  Q("math5_ch12_da_q1","math5_ch12_data_analysis","Most common category in survey: largest bar (or slice).",[c("True"),e("False"),m("Sometimes"),g("Random")],"Max value = most common.",["Most common = max."],"Max = most common.","easy",ch12),
  Q("math5_ch12_da_q2","math5_ch12_data_analysis","To find total students surveyed, you can…",[c("Sum all categories"),e("Pick one"),m("Random"),g("Multiply")],"Sum gives total.",["Sum all categories = total surveyed."],"Sum all.","medium",ch12),
  Q("math5_ch12_da_q3","math5_ch12_data_analysis","To find difference between two categories…",[c("Subtract values"),e("Add"),m("Multiply"),g("Random")],"Difference = subtract.",["Subtract values."],"Subtract.","easy",ch12),
  Q("math5_ch12_da_q4","math5_ch12_data_analysis","From chart: A=20, B=12, C=8. Total?",[c("40"),m("20"),g("32"),e("24")],"20+12+8.",["Sum: 40."],"Sum.","easy",ch12),
  Q("math5_ch12_da_q5","math5_ch12_data_analysis","From chart: A=20, B=12. Difference?",[c("8"),m("32"),g("240"),e("12")],"20-12.",["Subtract."],"Subtract.","easy",ch12),
  Q("math5_ch12_da_q6","math5_ch12_data_analysis","Data analysis answers questions like…",[c("Most/least common, totals, differences"),e("Just totals"),m("Random"),g("Time only")],"Various analytical questions.",["Multiple analyses possible."],"Various.","medium",ch12),
  Q("math5_ch12_da_q7","math5_ch12_data_analysis","If 30 students total, A=10. What % of students chose A?",[c("33%"),m("30%"),g("10%"),e("3%")],"10/30 ≈ 33%.",["10/30 × 100 ≈ 33.3%."],"% = part/whole × 100.","hard",ch12),
  Q("math5_ch12_da_q8","math5_ch12_data_analysis","Visualize data: best for trends over time?",[c("Line graph"),e("Pie chart"),m("Bar"),g("Just numbers")],"Line graph for trends.",["Line shows change over time."],"Line for trends.","hard",ch12),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 5 Math v2 questions (Ch11-12).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
