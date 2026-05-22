import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch5 = "Prime Time";
const ch6 = "Perimeter and Area";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"6", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  // ch5 prime_numbers
  Q("math6_ch5_pn_q1","math6_ch5_prime_numbers","Smallest prime?",[c("2"),m("1"),g("3"),e("0")],"2 = smallest.",["1 excluded."],"2.","easy",ch5),
  Q("math6_ch5_pn_q2","math6_ch5_prime_numbers","Is 11 prime?",[c("Yes"),e("No"),m("Composite"),g("Even")],"Only 1 and 11 divide.",["Test divisors 2-10."],"Yes.","easy",ch5),
  Q("math6_ch5_pn_q3","math6_ch5_prime_numbers","Is 1 prime?",[e("Yes"),c("No"),m("Sometimes"),g("Random")],"By definition primes > 1.",["1 excluded by definition."],"No.","medium",ch5),
  Q("math6_ch5_pn_q4","math6_ch5_prime_numbers","Only even prime?",[c("2"),m("4"),g("6"),e("None")],"All other evens ÷ 2.",["2 is unique."],"2.","medium",ch5),
  Q("math6_ch5_pn_q5","math6_ch5_prime_numbers","Is 15 prime?",[e("Yes"),c("No (3×5)"),m("Sometimes"),g("Cannot say")],"3 × 5 = 15.",["15 ÷ 3 = 5."],"No.","easy",ch5),
  Q("math6_ch5_pn_q6","math6_ch5_prime_numbers","First 5 primes?",[c("2, 3, 5, 7, 11"),m("1, 2, 3, 5, 7"),g("2, 3, 4, 5, 7"),e("3, 5, 7, 11, 13")],"Starts at 2.",["2, 3, 5, 7, 11."],"Memorize.","medium",ch5),
  Q("math6_ch5_pn_q7","math6_ch5_prime_numbers","To check if N prime, test divisors up to…",[c("√N"),m("N/2"),g("N"),e("10")],"Sqrt limit.",["If no divisor ≤ √N, prime."],"√N.","hard",ch5),
  Q("math6_ch5_pn_q8","math6_ch5_prime_numbers","Is 29 prime?",[c("Yes"),e("No"),m("Sometimes"),g("Even")],"No divisor 2-5.",["√29 ≈ 5.4.","Test 2,3,5: none divide."],"Yes.","medium",ch5),
  // ch5 composite_numbers
  Q("math6_ch5_cn_q1","math6_ch5_composite_numbers","Composite numbers have…",[c("More than 2 factors"),e("Only 2 factors"),m("Only 1"),g("Random")],"More factors.",["≥ 3 factors."],"> 2 factors.","easy",ch5),
  Q("math6_ch5_cn_q2","math6_ch5_composite_numbers","Smallest composite?",[c("4"),m("2"),g("6"),e("1")],"4 = 2×2.",["1 not, 2,3 prime, 4 composite."],"4.","medium",ch5),
  Q("math6_ch5_cn_q3","math6_ch5_composite_numbers","Is 12 composite?",[c("Yes"),e("No"),m("Prime"),g("Random")],"Many factors.",["12 = 2×6 etc."],"Yes.","easy",ch5),
  Q("math6_ch5_cn_q4","math6_ch5_composite_numbers","Is 23 composite?",[e("Yes"),c("No (prime)"),m("Even"),g("Random")],"23 = prime.",["Test divisors."],"No, prime.","medium",ch5),
  Q("math6_ch5_cn_q5","math6_ch5_composite_numbers","Composite or prime: 0?",[e("Composite"),m("Prime"),c("Neither"),g("Both")],"0 special: not prime, not composite.",["0 excluded."],"Neither.","hard",ch5),
  Q("math6_ch5_cn_q6","math6_ch5_composite_numbers","First 5 composites?",[c("4, 6, 8, 9, 10"),m("4, 5, 6, 7, 8"),g("6, 8, 9, 10, 12"),e("Random")],"Skips primes.",["4, 6, 8, 9, 10."],"Skip primes.","medium",ch5),
  Q("math6_ch5_cn_q7","math6_ch5_composite_numbers","Is 100 composite?",[c("Yes"),e("No"),m("Prime"),g("Cannot tell")],"Many factors.",["100 = 4 × 25."],"Yes.","easy",ch5),
  Q("math6_ch5_cn_q8","math6_ch5_composite_numbers","Is 1 composite?",[e("Yes"),c("No"),m("Sometimes"),g("Random")],"1 has 1 factor only.",["1 = neither prime nor composite."],"No.","medium",ch5),
  // ch5 prime_factorization
  Q("math6_ch5_pf_q1","math6_ch5_prime_factorization","Prime factorization of 12?",[c("2 × 2 × 3"),m("4 × 3"),g("12"),e("6 × 2")],"All factors prime.",["12=4×3=2×2×3."],"Prime factors.","medium",ch5),
  Q("math6_ch5_pf_q2","math6_ch5_prime_factorization","Prime factorization of 30?",[c("2 × 3 × 5"),m("6 × 5"),g("2 × 15"),e("30")],"All factors prime.",["30=2×3×5."],"Primes only.","medium",ch5),
  Q("math6_ch5_pf_q3","math6_ch5_prime_factorization","Factor tree starts with…",[c("The number"),e("1"),m("Random"),g("0")],"Start at N.",["Top: N."],"N at top.","easy",ch5),
  Q("math6_ch5_pf_q4","math6_ch5_prime_factorization","Prime factorization of 24?",[c("2 × 2 × 2 × 3"),m("4 × 6"),g("8 × 3"),e("24")],"All prime.",["24=2×12=2×2×6=2×2×2×3."],"Decompose.","medium",ch5),
  Q("math6_ch5_pf_q5","math6_ch5_prime_factorization","Prime factorization is…",[c("Unique"),e("Many"),m("Random"),g("Useless")],"Unique up to order.",["One per number."],"Unique.","hard",ch5),
  Q("math6_ch5_pf_q6","math6_ch5_prime_factorization","Prime factorization of 8?",[c("2³ (2×2×2)"),m("4 × 2"),g("8"),e("2 × 6")],"All primes.",["8 = 2 × 2 × 2 = 2³."],"All 2s.","easy",ch5),
  Q("math6_ch5_pf_q7","math6_ch5_prime_factorization","Prime factorization of 50?",[c("2 × 5²"),m("10 × 5"),g("25 × 2"),e("50")],"Primes only.",["50 = 2 × 25 = 2 × 5²."],"Primes.","medium",ch5),
  Q("math6_ch5_pf_q8","math6_ch5_prime_factorization","Factor 100 prime:",[c("2² × 5²"),m("10 × 10"),g("4 × 25"),e("100")],"Reduce to primes.",["100 = 4 × 25 = 2² × 5²."],"Reduce.","hard",ch5),
  // ch5 co_prime
  Q("math6_ch5_cp_q1","math6_ch5_co_prime","Co-prime means…",[c("HCF = 1"),e("Both prime"),m("Equal"),g("Composite")],"Share no common factor > 1.",["HCF = 1."],"HCF=1.","medium",ch5),
  Q("math6_ch5_cp_q2","math6_ch5_co_prime","Are 8 and 9 co-prime?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot tell")],"Factors 8: 1,2,4,8. Of 9: 1,3,9. Common: 1.",["HCF=1."],"Yes.","medium",ch5),
  Q("math6_ch5_cp_q3","math6_ch5_co_prime","Are 6 and 9 co-prime?",[e("Yes"),c("No"),m("Sometimes"),g("Cannot tell")],"Both divisible by 3.",["HCF = 3, not 1."],"No.","medium",ch5),
  Q("math6_ch5_cp_q4","math6_ch5_co_prime","Co-prime numbers need NOT be prime themselves. T/F",[c("True"),e("False"),m("Sometimes"),g("Cannot say")],"E.g., 8 and 9 co-prime but neither prime.",["8 composite, 9 composite, yet co-prime."],"Not necessarily prime.","hard",ch5),
  Q("math6_ch5_cp_q5","math6_ch5_co_prime","Are 14 and 25 co-prime?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot tell")],"14=2×7, 25=5². No common.",["HCF=1."],"Yes.","medium",ch5),
  Q("math6_ch5_cp_q6","math6_ch5_co_prime","HCF of co-prime numbers = ?",[c("1"),m("Smallest"),g("Largest"),e("0")],"By definition.",["Co-prime → HCF=1."],"1.","easy",ch5),
  Q("math6_ch5_cp_q7","math6_ch5_co_prime","Co-prime useful for…",[c("Fraction simplification"),e("Random"),m("Counting"),g("Hide numbers")],"Co-prime form = simplest fraction.",["Co-prime denominators."],"Simplify.","hard",ch5),
  Q("math6_ch5_cp_q8","math6_ch5_co_prime","Are 7 and 14 co-prime?",[e("Yes"),c("No"),m("Sometimes"),g("Cannot tell")],"7 divides both.",["HCF=7."],"No.","medium",ch5),

  // ch6 perimeter_basics
  Q("math6_ch6_pb_q1","math6_ch6_perimeter_basics","Perimeter is the…",[c("Distance around shape"),e("Area"),m("Diagonal"),g("Volume")],"Boundary length.",["Around shape."],"Around.","easy",ch6),
  Q("math6_ch6_pb_q2","math6_ch6_perimeter_basics","Triangle sides 4, 5, 6. P?",[c("15"),m("60"),g("9"),e("11")],"Sum.",["4+5+6=15."],"Sum sides.","easy",ch6),
  Q("math6_ch6_pb_q3","math6_ch6_perimeter_basics","Square side 8. P?",[c("32"),m("64"),g("16"),e("8")],"4×8.",["P = 4s."],"4s.","easy",ch6),
  Q("math6_ch6_pb_q4","math6_ch6_perimeter_basics","Rectangle 6×4. P?",[c("20"),m("24"),g("10"),e("16")],"2(6+4).",["P = 2(l+w)."],"2(l+w).","easy",ch6),
  Q("math6_ch6_pb_q5","math6_ch6_perimeter_basics","Square P formula:",[c("4s"),m("s²"),g("2s"),e("s")],"4 equal sides.",["P = 4s."],"4s.","easy",ch6),
  Q("math6_ch6_pb_q6","math6_ch6_perimeter_basics","Rectangle P formula:",[m("l × w"),c("2(l + w)"),g("l + w"),e("4l")],"Sum of all sides.",["2 lengths + 2 widths."],"2(l+w).","easy",ch6),
  Q("math6_ch6_pb_q7","math6_ch6_perimeter_basics","Hexagon (regular) side 3. P?",[c("18"),m("9"),g("36"),e("12")],"6×3.",["P = 6s."],"6s.","medium",ch6),
  Q("math6_ch6_pb_q8","math6_ch6_perimeter_basics","Equilateral triangle side 7. P?",[c("21"),m("14"),g("49"),e("28")],"3×7.",["P = 3s."],"3s.","easy",ch6),
  // ch6 area_rectangles
  Q("math6_ch6_ar_q1","math6_ch6_area_rectangles","Rectangle 5×3. Area?",[c("15"),m("8"),g("16"),e("30")],"l × w.",["5×3=15."],"l×w.","easy",ch6),
  Q("math6_ch6_ar_q2","math6_ch6_area_rectangles","Square side 7. Area?",[c("49"),m("28"),g("14"),e("21")],"7².",["49."],"s².","easy",ch6),
  Q("math6_ch6_ar_q3","math6_ch6_area_rectangles","Area unit:",[c("Sq units (cm², m²)"),e("Length units"),m("Volume"),g("Weight")],"Sq.",["sq units."],"sq.","medium",ch6),
  Q("math6_ch6_ar_q4","math6_ch6_area_rectangles","Rectangle 10×4. Area?",[c("40"),m("14"),g("28"),e("100")],"40.",["10×4=40."],"l×w.","easy",ch6),
  Q("math6_ch6_ar_q5","math6_ch6_area_rectangles","Square side 9. Area?",[c("81"),m("36"),g("27"),e("90")],"81.",["9²=81."],"s².","easy",ch6),
  Q("math6_ch6_ar_q6","math6_ch6_area_rectangles","Floor 6m × 4m. Area?",[c("24 m²"),m("10 m²"),g("20 m²"),e("48 m²")],"24.",["6×4=24."],"l×w.","medium",ch6),
  Q("math6_ch6_ar_q7","math6_ch6_area_rectangles","If A=42, l=6, w=?",[c("7"),m("6"),g("36"),e("48")],"42/6.",["w = A/l = 42/6 = 7."],"Inverse.","medium",ch6),
  Q("math6_ch6_ar_q8","math6_ch6_area_rectangles","Area increases when…",[c("Sides grow"),e("Sides shrink"),m("No change"),g("Random")],"Bigger sides = bigger area.",["A ∝ sides."],"Sides up.","medium",ch6),
  // ch6 area_triangles
  Q("math6_ch6_at_q1","math6_ch6_area_triangles","Triangle area formula:",[c("½ × b × h"),m("b × h"),g("b + h"),e("2bh")],"½bh.",["A = ½bh."],"½bh.","medium",ch6),
  Q("math6_ch6_at_q2","math6_ch6_area_triangles","Base 4, height 3. Area?",[c("6"),m("12"),g("7"),e("9")],"½×4×3.",["½ × 12 = 6."],"½bh.","easy",ch6),
  Q("math6_ch6_at_q3","math6_ch6_area_triangles","Base 10, height 5. Area?",[c("25"),m("50"),g("15"),e("100")],"½×10×5.",["50/2=25."],"½bh.","medium",ch6),
  Q("math6_ch6_at_q4","math6_ch6_area_triangles","Height must be ___ to base.",[c("Perpendicular"),e("Parallel"),m("Random"),g("Equal")],"Perpendicular = vertical to base.",["⊥ to base."],"Perpendicular.","medium",ch6),
  Q("math6_ch6_at_q5","math6_ch6_area_triangles","Base 6, height 4. Area?",[c("12"),m("24"),g("10"),e("48")],"½×6×4.",["24/2=12."],"½bh.","easy",ch6),
  Q("math6_ch6_at_q6","math6_ch6_area_triangles","Half of base×height:",[c("Triangle area"),e("Rectangle"),m("Square"),g("Random")],"½bh = triangle.",["Triangle = half rectangle."],"½ rect.","medium",ch6),
  Q("math6_ch6_at_q7","math6_ch6_area_triangles","Right triangle: legs 6, 8. Area?",[c("24"),m("48"),g("14"),e("32")],"½×6×8.",["48/2=24."],"½ × legs.","medium",ch6),
  Q("math6_ch6_at_q8","math6_ch6_area_triangles","Triangle base 5 cm, height 4 cm. Area?",[c("10 cm²"),m("20 cm²"),g("9 cm²"),e("12 cm²")],"½ × 5 × 4 = 10.",["½ × 20 = 10 cm²."],"½bh.","medium",ch6),
  // ch6 real_problems
  Q("math6_ch6_rp_q1","math6_ch6_real_problems","Fencing a garden uses…",[c("Perimeter"),e("Area"),m("Volume"),g("Diagonal")],"Around = P.",["Fence around."],"P.","easy",ch6),
  Q("math6_ch6_rp_q2","math6_ch6_real_problems","Tiling a floor uses…",[c("Area"),m("Perimeter"),g("Volume"),e("Diagonal")],"Covering = A.",["Cover whole."],"A.","easy",ch6),
  Q("math6_ch6_rp_q3","math6_ch6_real_problems","Fence 10×8 garden, cost ₹50/m. Total?",[c("₹1800"),m("₹4000"),g("₹500"),e("₹1500")],"P=36; 36×50=1800.",["P=36 m; cost 36×50=1800."],"P × rate.","hard",ch6),
  Q("math6_ch6_rp_q4","math6_ch6_real_problems","Carpet 5×4 floor at ₹100/m². Cost?",[c("₹2000"),m("₹900"),g("₹400"),e("₹1500")],"A=20; ×100=2000.",["A=20 m²; cost=20×100=2000."],"A × rate.","hard",ch6),
  Q("math6_ch6_rp_q5","math6_ch6_real_problems","Paint a wall 3×4 m at ₹200/m². Cost?",[c("₹2400"),m("₹1400"),g("₹400"),e("₹600")],"A=12; ×200=2400.",["A=12; 12×200=2400."],"A × rate.","medium",ch6),
  Q("math6_ch6_rp_q6","math6_ch6_real_problems","Garden 20×15 m. Fence length?",[c("70 m"),m("35 m"),g("300 m"),e("60 m")],"P = 2(20+15) = 70.",["2(20+15)=70."],"2(l+w).","medium",ch6),
  Q("math6_ch6_rp_q7","math6_ch6_real_problems","Floor 6m × 5m, 1m × 1m tiles. # tiles?",[c("30"),m("11"),g("60"),e("36")],"A=30, each=1.",["30 ÷ 1 = 30."],"A ÷ tile.","hard",ch6),
  Q("math6_ch6_rp_q8","math6_ch6_real_problems","Wall A=15 m², paint ₹250/m². Cost?",[c("₹3750"),m("₹250"),g("₹450"),e("₹2500")],"15×250=3750.",["A × rate."],"A × rate.","medium",ch6),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 6 Math v2 questions (Ch5-6).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
