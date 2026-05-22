import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch5 = "Does it Look the Same?";
const ch6 = "Be My Multiple, I'll Be Your Factor";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"5", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  // ch5 symmetry_intro
  Q("math5_ch5_si_q1","math5_ch5_symmetry_intro","Symmetric means…",[c("Both halves match when folded"),e("Has 4 corners"),m("Is round"),g("Random")],"Folding makes halves overlap.",["Fold test."],"Fold test.","easy",ch5),
  Q("math5_ch5_si_q2","math5_ch5_symmetry_intro","A butterfly is symmetric because…",[c("Both wings match"),e("Has many colors"),m("Can fly"),g("Random")],"Wings mirror each other.",["Left wing matches right wing."],"Mirror match.","easy",ch5),
  Q("math5_ch5_si_q3","math5_ch5_symmetry_intro","Letter 'A' is symmetric (vertical fold). T/F?",[c("True"),e("False"),m("Sometimes"),g("Cannot say")],"A folds along vertical axis.",["Fold vertically: both halves of A match."],"Vertical symmetry.","easy",ch5),
  Q("math5_ch5_si_q4","math5_ch5_symmetry_intro","Letter 'F' is symmetric. T/F?",[e("True"),c("False"),m("Sometimes"),g("Cannot say")],"F is not symmetric.",["No fold makes F match itself."],"F no symmetry.","medium",ch5),
  Q("math5_ch5_si_q5","math5_ch5_symmetry_intro","To check symmetry, you can…",[c("Fold and see if halves match"),e("Count corners"),m("Measure perimeter"),g("Random")],"Folding tests symmetry.",["Fold along potential axis.","Halves match → symmetric."],"Fold test.","medium",ch5),
  Q("math5_ch5_si_q6","math5_ch5_symmetry_intro","Symmetric shapes look…",[c("Balanced"),e("Random"),m("Lopsided"),g("Weird")],"Symmetric = balanced look.",["Balance is the key visual quality."],"Balanced.","medium",ch5),
  Q("math5_ch5_si_q7","math5_ch5_symmetry_intro","All shapes are symmetric. T/F?",[e("True"),c("False"),m("Sometimes"),g("Only squares")],"Many shapes (e.g. scalene triangle) have no symmetry.",["Counter-example: scalene triangle.","No matching fold."],"Not all.","easy",ch5),
  Q("math5_ch5_si_q8","math5_ch5_symmetry_intro","Mirror images are…",[c("Symmetric to each other"),e("Random"),m("Different shapes"),g("Triangles")],"Object + mirror image = symmetric pair.",["Mirror flips left/right.","Pair is symmetric."],"Mirror = symmetric.","medium",ch5),
  // ch5 line_symmetry
  Q("math5_ch5_ls_q1","math5_ch5_line_symmetry","Square has ___ lines of symmetry.",[m("1"),m("2"),c("4"),e("8")],"2 mid-lines + 2 diagonals = 4.",["V, H, 2 diagonals."],"Square = 4 lines.","medium",ch5),
  Q("math5_ch5_ls_q2","math5_ch5_line_symmetry","Rectangle has ___ lines.",[m("1"),c("2"),g("4"),e("0")],"Vertical + horizontal mid-lines. Diagonals don't work.",["Only 2 (no diagonals since unequal sides)."],"Rect = 2.","medium",ch5),
  Q("math5_ch5_ls_q3","math5_ch5_line_symmetry","Circle has ___ lines.",[m("4"),g("8"),c("Infinitely many"),e("None")],"Every diameter is a line of symmetry.",["Any diameter works.","Infinite."],"Circle = infinite.","medium",ch5),
  Q("math5_ch5_ls_q4","math5_ch5_line_symmetry","Equilateral triangle has ___ lines.",[m("1"),m("2"),c("3"),e("0")],"3 lines, vertex to midpoint of opposite side.",["3 vertices, 1 line each."],"Equilateral = 3.","medium",ch5),
  Q("math5_ch5_ls_q5","math5_ch5_line_symmetry","Letter 'H' has ___ lines.",[m("1"),c("2"),g("4"),e("0")],"Vertical and horizontal both work for H.",["Vertical fold matches.","Horizontal fold matches."],"H = 2.","medium",ch5),
  Q("math5_ch5_ls_q6","math5_ch5_line_symmetry","Letter 'O' has ___ lines.",[m("1"),m("2"),c("Infinite (treated as circle)"),e("4")],"O is round → infinite lines.",["Approximate as circle.","Infinite."],"O ≈ circle.","hard",ch5),
  Q("math5_ch5_ls_q7","math5_ch5_line_symmetry","Letter 'P' has ___ lines.",[c("0"),m("1"),g("2"),e("4")],"P is not symmetric.",["No fold makes P match itself."],"P = 0.","hard",ch5),
  Q("math5_ch5_ls_q8","math5_ch5_line_symmetry","Lines of symmetry can be…",[c("Vertical, horizontal, diagonal"),e("Only vertical"),m("Only horizontal"),g("Only diagonal")],"Any orientation.",["Lines run any direction.","All orientations possible."],"Any direction.","medium",ch5),
  // ch5 rotational_symmetry
  Q("math5_ch5_rs_q1","math5_ch5_rotational_symmetry","Rotational symmetry: shape matches after…",[c("Partial rotation"),e("No rotation"),m("Translation"),g("Reflection")],"Match after rotating less than 360°.",["Rotate < 360° and matches.","Rotational symmetry."],"Partial rotation match.","medium",ch5),
  Q("math5_ch5_rs_q2","math5_ch5_rotational_symmetry","Square has rotational symmetry of order…",[m("2"),c("4"),g("8"),e("1")],"Every 90° matches → order 4.",["360/90 = 4."],"Order 4.","medium",ch5),
  Q("math5_ch5_rs_q3","math5_ch5_rotational_symmetry","Order of rotational symmetry = ?",[c("Number of matches in one full turn"),e("Number of lines"),m("Number of sides"),g("Random")],"How many times shape matches in 360°.",["Count matches per 360°."],"Matches in 360°.","medium",ch5),
  Q("math5_ch5_rs_q4","math5_ch5_rotational_symmetry","Equilateral triangle: order = ?",[m("2"),c("3"),g("6"),e("1")],"Every 120° matches → 3.",["120, 240, 360. 3 matches."],"Order 3.","medium",ch5),
  Q("math5_ch5_rs_q5","math5_ch5_rotational_symmetry","Order 1 means…",[c("No rotational symmetry"),e("Lots"),m("Two-way"),g("Full")],"Only matches at 360° (= same).",["Order 1 = no symmetry."],"Order 1 = none.","hard",ch5),
  Q("math5_ch5_rs_q6","math5_ch5_rotational_symmetry","Circle order = ?",[m("4"),g("8"),c("Infinite"),e("1")],"Any rotation matches.",["Any angle.","Infinite order."],"Circle = infinite.","medium",ch5),
  Q("math5_ch5_rs_q7","math5_ch5_rotational_symmetry","Rectangle (non-square) order = ?",[m("4"),c("2"),g("1"),e("None")],"180° matches, 90° doesn't.",["Order 2: matches at 180°."],"Rect = 2.","hard",ch5),
  Q("math5_ch5_rs_q8","math5_ch5_rotational_symmetry","Smallest rotation for square that matches?",[c("90°"),m("180°"),g("60°"),e("45°")],"90° smallest.",["360/4 = 90°."],"360 ÷ order.","medium",ch5),
  // ch5 symmetry_designs
  Q("math5_ch5_sd_q1","math5_ch5_symmetry_designs","Rangoli often uses…",[c("Symmetry"),e("Random"),m("Asymmetry"),g("Only colors")],"Rangoli is highly symmetric.",["Rangoli = symmetric patterns.","Balanced design."],"Rangoli symmetric.","easy",ch5),
  Q("math5_ch5_sd_q2","math5_ch5_symmetry_designs","Snowflakes are typically…",[c("6-fold symmetric"),e("Random"),m("Asymmetric"),g("Square")],"Snowflakes have 6-fold rotational symmetry.",["6 arms.","60° rotations match."],"Snowflake = 6-fold.","medium",ch5),
  Q("math5_ch5_sd_q3","math5_ch5_symmetry_designs","To make a symmetric design, you can…",[c("Fold paper, draw on half"),e("Random scribble"),m("Skip steps"),g("Use only one color")],"Fold + draw + unfold = symmetric.",["Fold paper.","Draw on one half.","Open: symmetric design."],"Fold technique.","medium",ch5),
  Q("math5_ch5_sd_q4","math5_ch5_symmetry_designs","Symmetric designs look…",[c("Balanced and pleasing"),e("Boring"),m("Random"),g("Triangular")],"Balance = visual appeal.",["Symmetric = balanced + pleasing."],"Balance pleases.","medium",ch5),
  Q("math5_ch5_sd_q5","math5_ch5_symmetry_designs","Mandala has…",[c("Both line and rotational symmetry"),e("Only line"),m("Only rotational"),g("None")],"Mandalas have both.",["Lines + rotational center.","Both symmetries."],"Mandala = both.","hard",ch5),
  Q("math5_ch5_sd_q6","math5_ch5_symmetry_designs","Tie-dye pattern often has…",[c("Rotational symmetry"),e("Lines only"),m("None"),g("Asymmetric")],"Tie-dye usually rotates from a center.",["Center radiates outward.","Rotational symmetry."],"Tie-dye = rotational.","medium",ch5),
  Q("math5_ch5_sd_q7","math5_ch5_symmetry_designs","Symmetry is found in…",[c("Nature, art, architecture"),e("Just math"),m("Only buildings"),g("Random")],"Symmetry everywhere.",["Flowers, faces, buildings.","Symmetric everywhere."],"Everywhere.","easy",ch5),
  Q("math5_ch5_sd_q8","math5_ch5_symmetry_designs","To check a design's symmetry, you can…",[c("Look for fold lines and rotation centers"),e("Count colors"),m("Random"),g("Smell it")],"Inspect for axes and rotation centers.",["Find fold axes.","Find rotation centers.","If found → symmetric."],"Find axes/centers.","medium",ch5),

  // ch6 multiples
  Q("math5_ch6_mu_q1","math5_ch6_multiples","First 5 multiples of 3 are…",[c("3, 6, 9, 12, 15"),e("1, 2, 3, 4, 5"),m("3, 5, 7, 9, 11"),g("3, 12, 15, 18, 21")],"Table of 3.",["3 × 1 = 3, 3×2=6, ..., 3×5=15."],"× by 1-5.","easy",ch6),
  Q("math5_ch6_mu_q2","math5_ch6_multiples","Is 28 a multiple of 7?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"7 × 4 = 28.",["28 ÷ 7 = 4 exactly.","Yes."],"Check divisibility.","easy",ch6),
  Q("math5_ch6_mu_q3","math5_ch6_multiples","Multiples of 5 always end in…",[c("0 or 5"),e("1 or 6"),m("Any digit"),g("Only 0")],"Multiples of 5.",["5, 10, 15, ...: ends in 0 or 5."],"0 or 5.","easy",ch6),
  Q("math5_ch6_mu_q4","math5_ch6_multiples","Smallest multiple of 9 greater than 50?",[c("54"),m("45"),g("63"),e("50")],"9 × 6 = 54.",["50/9 ≈ 5.5.","Next: 9×6 = 54."],"Find next multiple.","medium",ch6),
  Q("math5_ch6_mu_q5","math5_ch6_multiples","Multiples of N are always…",[c("Divisible by N"),e("Greater than 100"),m("Even"),g("Random")],"By definition.",["Multiple of N = N × k.","Divisible by N."],"By definition.","medium",ch6),
  Q("math5_ch6_mu_q6","math5_ch6_multiples","Is 35 a multiple of 7?",[c("Yes"),e("No"),m("Only sometimes"),g("Cannot say")],"7 × 5 = 35.",["7 × 5 = 35.","Yes."],"Check ÷.","easy",ch6),
  Q("math5_ch6_mu_q7","math5_ch6_multiples","First 3 multiples of 11?",[c("11, 22, 33"),e("11, 12, 13"),m("11, 121, 1331"),g("11, 21, 31")],"11 × 1, 2, 3.",["11, 22, 33."],"Table of 11.","medium",ch6),
  Q("math5_ch6_mu_q8","math5_ch6_multiples","Is 100 a multiple of 25?",[c("Yes"),e("No"),m("Cannot tell"),g("Sometimes")],"25 × 4 = 100.",["100 ÷ 25 = 4. Yes."],"Check.","medium",ch6),
  // ch6 factors
  Q("math5_ch6_fa_q1","math5_ch6_factors","Factors of 12 are…",[c("1, 2, 3, 4, 6, 12"),e("12, 24, 36"),m("1, 12"),g("2, 3, 4")],"Numbers dividing 12 exactly.",["1×12, 2×6, 3×4 → factors 1,2,3,4,6,12."],"Pair factors.","medium",ch6),
  Q("math5_ch6_fa_q2","math5_ch6_factors","Is 5 a factor of 30?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"5 × 6 = 30.",["30 ÷ 5 = 6 exactly. Yes."],"Check exact division.","easy",ch6),
  Q("math5_ch6_fa_q3","math5_ch6_factors","Number of factors of 12?",[m("4"),c("6"),g("12"),e("3")],"1,2,3,4,6,12 = 6 factors.",["List: 6 factors."],"Count.","medium",ch6),
  Q("math5_ch6_fa_q4","math5_ch6_factors","1 is a factor of…",[c("Every number"),e("Nothing"),m("Just itself"),g("Even numbers")],"1 divides every number.",["1 × N = N for any N.","1 is universal factor."],"1 always.","easy",ch6),
  Q("math5_ch6_fa_q5","math5_ch6_factors","Factors of 20?",[c("1, 2, 4, 5, 10, 20"),e("1, 2, 5, 10"),m("20, 40, 60"),g("1, 20")],"Pairs: 1×20, 2×10, 4×5.",["1,2,4,5,10,20."],"List all pairs.","medium",ch6),
  Q("math5_ch6_fa_q6","math5_ch6_factors","Smallest factor of any number > 1?",[c("1"),e("2"),m("The number itself"),g("Cannot tell")],"1 is the smallest factor.",["1 divides everything."],"1 = smallest.","easy",ch6),
  Q("math5_ch6_fa_q7","math5_ch6_factors","Number is divisible by all its…",[e("Multiples"),c("Factors"),m("Halves"),g("Squares")],"Factors divide the number exactly.",["Factor N = divisor."],"By factors.","medium",ch6),
  Q("math5_ch6_fa_q8","math5_ch6_factors","Factors of 7 (prime)?",[c("1, 7"),e("1, 2, 7"),m("Just 7"),g("None")],"Prime: only 1 and itself.",["7 = prime.","Factors: 1, 7."],"Prime = 2 factors.","medium",ch6),
  // ch6 common_multiples
  Q("math5_ch6_cm_q1","math5_ch6_common_multiples","Common multiples of 4 and 6: smallest?",[c("12"),m("24"),g("48"),e("6")],"Multiples of 4: 4,8,12. Of 6: 6,12. Common: 12.",["List multiples.","Find smallest shared."],"LCM = 12.","medium",ch6),
  Q("math5_ch6_cm_q2","math5_ch6_common_multiples","LCM of 2 and 3?",[m("1"),c("6"),g("12"),e("5")],"LCM = 2 × 3 (coprime).",["6 = first common multiple."],"LCM = product if coprime.","medium",ch6),
  Q("math5_ch6_cm_q3","math5_ch6_common_multiples","LCM means…",[c("Least Common Multiple"),e("Largest"),m("Random"),g("Greatest common divisor")],"LCM = least common multiple.",["L = least.","C = common.","M = multiple."],"LCM = least common.","easy",ch6),
  Q("math5_ch6_cm_q4","math5_ch6_common_multiples","LCM of 4 and 8?",[m("4"),c("8"),g("32"),e("16")],"8 is multiple of 4. LCM = 8.",["8 is multiple of both."],"Bigger if multiple.","medium",ch6),
  Q("math5_ch6_cm_q5","math5_ch6_common_multiples","Common multiples are…",[c("Infinitely many"),e("Exactly one"),m("Random"),g("None")],"Multiples are infinite, so common multiples are infinite.",["For 4 and 6: 12, 24, 36, ...","Infinite."],"Infinite.","medium",ch6),
  Q("math5_ch6_cm_q6","math5_ch6_common_multiples","LCM of 3 and 5?",[c("15"),m("8"),g("30"),e("3")],"3, 6, 9, 12, 15 ; 5, 10, 15.",["15 common."],"15.","medium",ch6),
  Q("math5_ch6_cm_q7","math5_ch6_common_multiples","LCM is useful for…",[c("Adding fractions with different denominators"),e("Random"),m("Counting"),g("Subtraction only")],"LCM = common denominator for fractions.",["LCM finds common denominators."],"Fraction math.","hard",ch6),
  Q("math5_ch6_cm_q8","math5_ch6_common_multiples","LCM of 6 and 9?",[c("18"),m("3"),g("54"),e("6")],"Multiples: 6,12,18 ; 9, 18.",["18 common."],"18.","medium",ch6),
  // ch6 common_factors
  Q("math5_ch6_cf_q1","math5_ch6_common_factors","Common factors of 12 and 18: list.",[c("1, 2, 3, 6"),e("1, 6"),m("12, 18"),g("12, 6, 1")],"Factors of 12: 1,2,3,4,6,12. Of 18: 1,2,3,6,9,18. Common: 1,2,3,6.",["List each, find shared."],"Intersection.","medium",ch6),
  Q("math5_ch6_cf_q2","math5_ch6_common_factors","HCF of 12 and 18?",[c("6"),m("3"),g("36"),e("1")],"Highest common factor = 6.",["Common: 1,2,3,6.","Highest: 6."],"Largest common.","medium",ch6),
  Q("math5_ch6_cf_q3","math5_ch6_common_factors","HCF means…",[c("Highest Common Factor"),e("Smallest"),m("Random"),g("Multiple")],"H = highest. C = common. F = factor.",["Largest factor both share."],"HCF = highest.","easy",ch6),
  Q("math5_ch6_cf_q4","math5_ch6_common_factors","HCF of 8 and 12?",[c("4"),m("2"),g("24"),e("1")],"Common: 1,2,4. Highest: 4.",["Factors of 8: 1,2,4,8.","Of 12: 1,2,3,4,6,12.","HCF = 4."],"Largest shared.","medium",ch6),
  Q("math5_ch6_cf_q5","math5_ch6_common_factors","If HCF of two numbers = 1, they are…",[c("Coprime"),e("Equal"),m("Multiples"),g("Negative")],"Coprime = no common factor > 1.",["HCF = 1.","Share only 1.","Coprime."],"Coprime.","hard",ch6),
  Q("math5_ch6_cf_q6","math5_ch6_common_factors","HCF of 15 and 25?",[c("5"),m("1"),g("75"),e("10")],"Common: 1, 5. HCF = 5.",["15: 1,3,5,15.","25: 1,5,25.","HCF=5."],"Largest shared.","medium",ch6),
  Q("math5_ch6_cf_q7","math5_ch6_common_factors","HCF is useful for…",[c("Simplifying fractions"),e("Random"),m("Counting"),g("Time")],"Divide top and bottom by HCF to simplify.",["6/8 ÷ 2/2 = 3/4 (HCF=2)."],"Simplification.","hard",ch6),
  Q("math5_ch6_cf_q8","math5_ch6_common_factors","HCF of 14 and 21?",[c("7"),m("3"),g("2"),e("42")],"14: 1,2,7,14. 21: 1,3,7,21. HCF=7.",["List and find max common."],"7.","medium",ch6),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 5 Math v2 questions (Ch5-6).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
