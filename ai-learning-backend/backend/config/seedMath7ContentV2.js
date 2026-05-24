import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
dotenv.config();

const T = (topicId, chapterNumber, _sectionNumber, title, intuition, process_explanation, worked_example, common_misconceptions, shortcuts_and_tricks, key_takeaway) => ({
  topicId,
  chapterNumber,
  subject: "Mathematics",
  name: title,
  teaching_content: { intuition, derivation: process_explanation, process_explanation, worked_example, common_misconceptions, shortcuts_and_tricks, key_takeaway },
});

const topics = [
  // Ch1
  T("math7_ch1_lakhs_crores",1,"1.1","Lakhs and Crores","Indian system: 1 lakh = 100,000; 1 crore = 10,000,000.","Read with Indian commas: ##,##,###.","12,50,000 = 12 lakh 50 thousand.","Mixing Indian and western systems.","Indian commas: 2-2-3.","Indian system uses lakhs and crores."),
  T("math7_ch1_place_value",1,"1.2","Place Value in Large Numbers","Each digit's value depends on position.","Identify position: ones, tens, hundreds, thousands, lakhs, crores.","In 5,67,89,012: 5 = 5 crore.","Position mistakes.","Position = power of 10.","Place value = digit × place."),
  T("math7_ch1_comparing_large",1,"1.3","Comparing Large Numbers","Compare from leftmost digit.","More digits = bigger. Same digits: compare leftmost first.","12,34,567 > 9,99,999 (more digits).","Comparing right to left.","Leftmost digit first.","Compare large numbers leftmost first."),
  T("math7_ch1_rounding",1,"1.4","Rounding Large Numbers","Round to nearest 10, 100, 1000, etc.","Look at digit to the right of rounding place. ≥5 round up, < 5 round down.","456 to nearest 100 = 500. 432 to nearest 100 = 400.","Looking at wrong digit.","Right digit ≥ 5: round up.","Rounding gives approximations."),

  // Ch2
  T("math7_ch2_expressions_intro",2,"2.1","Arithmetic Expressions","Expressions combine numbers with operations.","Read left to right with order of operations.","2 + 3 × 4 = 14 (× before +).","Doing left to right always.","BODMAS rule.","Expressions need order of operations."),
  T("math7_ch2_order_operations",2,"2.2","Order of Operations (BODMAS)","Brackets, Orders (powers), Division/Multiplication, Addition/Subtraction.","Apply BODMAS strictly.","(2+3) × 4 = 20. 2 + 3 × 4 = 14.","Ignoring BODMAS.","BODMAS step by step.","Order: brackets, powers, ×/÷, +/−."),
  T("math7_ch2_brackets",2,"2.3","Brackets in Expressions","Brackets change order of operations.","Evaluate inside brackets first.","(5 − 2) × 3 = 9. 5 − 2 × 3 = −1.","Skipping brackets.","Inside brackets first.","Brackets override default order."),
  T("math7_ch2_evaluating",2,"2.4","Evaluating Expressions","Substitute values and compute.","Replace variables; apply BODMAS.","If a=3: 2a + 1 = 7.","Forgetting to substitute fully.","Substitute then compute.","Evaluation: substitute + compute."),

  // Ch3
  T("math7_ch3_decimals_review",3,"3.1","Decimals Review","Decimals: tenths, hundredths, thousandths.","Place value continues right of decimal point.","0.25 = 25 hundredths.","Trailing zeros change value (they don't).","Place values: 1/10, 1/100, 1/1000.","Decimals extend place value."),
  T("math7_ch3_place_value_decimal",3,"3.2","Place Value of Decimals","Each position right of decimal = 1/10 of previous.","Tenths: 1/10, hundredths: 1/100.","0.347: 3 tenths, 4 hundredths, 7 thousandths.","Confusing tenths and hundredths.","Position determines value.","Decimal place value = fraction of 1."),
  T("math7_ch3_comparing_decimals",3,"3.3","Comparing Decimals","Compare position by position.","Align decimal points; compare digits left to right.","0.3 > 0.25 (3 tenths > 2 tenths).","Comparing without aligning.","Align and compare.","Align decimals to compare."),
  T("math7_ch3_decimal_fractions",3,"3.4","Decimals and Fractions","Decimals = fractions in /10, /100, /1000 form.","Convert: 0.5 = 5/10 = 1/2.","0.75 = 75/100 = 3/4.","Forgetting to simplify.","Simplify after converting.","Decimals are fractions."),

  // Ch4
  T("math7_ch4_variables_intro",4,"4.1","Introduction to Variables","Letters (variables) represent unknown numbers.","x, y, z stand for any number.","If x = 5, then 2x = 10.","Treating variables as fixed.","Variable can take any value.","Variables represent unknowns."),
  T("math7_ch4_writing_expressions",4,"4.2","Writing Expressions","Translate words to algebra.","'Twice x' = 2x. 'x plus 5' = x + 5.","Age in 3 years: x + 3.","Mistranslating words.","Each operation has a phrase.","Convert words to algebra carefully."),
  T("math7_ch4_simple_equations",4,"4.3","Simple Equations","Equation: expression = expression.","Use balance to solve.","x + 3 = 7. → x = 4.","Mixing equations and expressions.","Equation has =; expression doesn't.","Equations have equality."),
  T("math7_ch4_substituting",4,"4.4","Substituting Values","Replace variable with number; compute.","Plug in value; calculate.","Find 2x + 1 at x = 4: 9.","Forgetting to apply all operations.","Substitute then evaluate.","Substitution checks expressions."),

  // Ch5
  T("math7_ch5_parallel_lines",5,"5.1","Parallel Lines","Lines that never meet, same distance always.","Mark || on parallel lines.","Railway tracks.","Calling intersecting lines parallel.","Never meet.","Parallel = constant distance."),
  T("math7_ch5_intersecting_lines",5,"5.2","Intersecting Lines","Lines that cross at a point.","Identify the intersection point.","X-shape lines cross at one point.","Confusing with parallel.","Cross = intersect.","Intersecting lines meet."),
  T("math7_ch5_angles_intersection",5,"5.3","Angles at Intersection","Vertically opposite angles are equal.","Two lines cross → 4 angles; opposites equal.","If angle = 60°, opposite = 60°.","Confusing adjacent and opposite.","Opposite angles equal.","Crossing lines: vertically opposite angles."),
  T("math7_ch5_transversal",5,"5.4","Transversal","Line cutting two parallel lines.","Creates corresponding, alternate, co-interior angles.","Corresponding angles equal; alternate equal; co-interior sum to 180°.","Confusing types of angle pairs.","Memorize: corresp/alt/co-int.","Transversal angle relationships."),

  // Ch6
  T("math7_ch6_number_patterns",6,"6.1","Number Patterns","Sequences with rules.","Find differences or ratios.","2, 4, 8, 16: × 2.","Stopping at one pair.","Test multiple terms.","Find pattern rule."),
  T("math7_ch6_magic_squares",6,"6.2","Magic Squares","Rows, columns, diagonals sum to constant.","3×3 with 1-9: constant 15.","Lo Shu square: classic 3×3.","Random arrangement.","Constant sum.","Magic squares have equal sums."),
  T("math7_ch6_number_puzzles",6,"6.3","Number Puzzles","Tricks with patterns.","Apply rules to find answers.","Trick: pick number, do ops, predict result.","Random guessing.","Use pattern.","Puzzles teach patterns."),
  T("math7_ch6_divisibility",6,"6.4","Divisibility Tests","Quick rules for divisibility.","÷ 2: even. ÷ 3: digit sum ÷ 3. ÷ 5: ends 0/5. ÷ 9: digit sum ÷ 9.","234 ÷ 3: 2+3+4=9, yes.","Forgetting rules.","Memorize each rule.","Divisibility rules speed checks."),

  // Ch7
  T("math7_ch7_triangle_basics",7,"7.1","Triangle Basics","3 sides, 3 angles, 3 vertices.","Identify sides and angles.","Triangle ABC: sides a, b, c; angles A, B, C.","Confusing side with vertex.","Sides opposite vertices.","Triangle = 3 sides + 3 angles."),
  T("math7_ch7_angle_sum",7,"7.2","Angle Sum of Triangle","Sum of 3 angles = 180°.","Add all 3 angles = 180°.","Angles 60, 60, 60: equilateral.","Sum > 180 = impossible.","Always 180°.","Triangle angles sum to 180°."),
  T("math7_ch7_triangle_types",7,"7.3","Types of Triangles","By sides: equilateral, isosceles, scalene. By angles: acute, right, obtuse.","Classify by sides AND angles.","30-60-90 = right + scalene.","Mixing classifications.","Two classifications.","Triangles classified by sides and angles."),
  T("math7_ch7_triangle_properties",7,"7.4","Triangle Properties","Triangle inequality: any 2 sides > 3rd. Exterior angle = sum of opposite interior.","Verify properties.","3+4 > 5 ✓; ext = sum of remote.","Forgetting inequality.","Inequality + ext angle theorem.","Key triangle properties."),

  // Ch8
  T("math7_ch8_fraction_operations",8,"8.1","Fraction Operations","Add, subtract, multiply, divide.","Same denom for +/−; cross or product for ×; reciprocal for ÷.","½ + ⅓ = 5/6. ½ × ⅓ = 1/6.","Adding both top and bottom.","Common denom for +/−.","Master 4 operations."),
  T("math7_ch8_mixed_numbers",8,"8.2","Mixed Numbers","Whole + fraction.","Convert mixed ↔ improper as needed.","2½ = 5/2. 7/3 = 2⅓.","Confusion between forms.","Convert via × bottom + top.","Mixed and improper forms."),
  T("math7_ch8_fraction_word",8,"8.3","Fraction Word Problems","Apply fractions to real scenarios.","Read carefully; choose operation.","½ of 60 = 30 students.","Misreading 'of' as 'and'.","'of' = ×.","Real-world fractions."),
  T("math7_ch8_fraction_decimal",8,"8.4","Fractions and Decimals","Convert between fractions and decimals.","Fraction → decimal: divide top by bottom. Decimal → fraction: place value, then simplify.","¾ = 0.75. 0.6 = 6/10 = 3/5.","Forgetting to simplify.","Divide for fraction to decimal.","Fractions ↔ decimals."),

  // Ch9
  T("math7_ch9_congruence_intro",9,"9.1","Congruence","Same shape AND same size.","Two shapes are congruent if all corresponding sides and angles equal.","Two equilateral triangles with same side = congruent.","Similar ≠ congruent.","Same size + shape.","Congruence = identical."),
  T("math7_ch9_congruent_triangles",9,"9.2","Congruent Triangles","Use SSS, SAS, ASA, RHS rules.","Match 3 elements; conclude congruence.","SSS: 3 sides match → congruent.","Random matching.","Match by SSS/SAS/ASA/RHS.","Congruence rules."),
  T("math7_ch9_sss_sas",9,"9.3","SSS, SAS, ASA, RHS","Different criteria for congruence.","SSS = all sides. SAS = 2 sides + included angle. ASA = 2 angles + included side. RHS for right triangles.","2 sides + included angle = SAS.","Wrong criterion choice.","Match elements precisely.","Congruence rules: SSS, SAS, ASA, RHS."),
  T("math7_ch9_real_congruence",9,"9.4","Real-World Congruence","Manufactured parts are congruent.","Identify congruent objects.","Coins, bricks, mass-produced items.","Calling similar things congruent.","Identical = congruent.","Congruence in manufacturing."),

  // Ch10
  T("math7_ch10_integers_intro",10,"10.1","Integers","Positive, negative numbers, and zero.","Numbers on a number line.","..., −3, −2, −1, 0, 1, 2, 3, ...","Forgetting zero is an integer.","Integers include zero.","Integers = whole + negatives."),
  T("math7_ch10_addition_subtraction",10,"10.2","Adding/Subtracting Integers","Use sign rules and number line.","Same signs: add magnitudes; different: subtract.","−5 + 3 = −2. 4 − (−2) = 6.","Sign mistakes.","Apply rules carefully.","Sign rules for + and −."),
  T("math7_ch10_multiplication",10,"10.3","Multiplying Integers","(+)(+)=+, (−)(−)=+, (+)(−)=−.","Multiply absolute values; determine sign.","(−4)(3) = −12. (−3)(−5) = 15.","Sign confusion.","Same signs: +. Different: −.","× sign rules."),
  T("math7_ch10_division",10,"10.4","Dividing Integers","Same sign rules as multiplication.","Divide absolute values; apply sign rule.","−12 ÷ 4 = −3. −15 ÷ −5 = 3.","Same sign mistakes.","Same as ×.","÷ sign rules."),

  // Ch11
  T("math7_ch11_hcf",11,"11.1","Highest Common Factor (HCF)","Largest factor shared.","List factors; find biggest common.","HCF(12, 18) = 6.","Random largest of one.","Largest common factor.","HCF = biggest shared factor."),
  T("math7_ch11_lcm",11,"11.2","Least Common Multiple (LCM)","Smallest multiple shared.","List multiples; find smallest common.","LCM(4, 6) = 12.","Confusing with HCF.","Smallest common multiple.","LCM = smallest shared multiple."),
  T("math7_ch11_hcf_lcm_relation",11,"11.3","HCF and LCM Relation","HCF × LCM = product of numbers.","For two numbers: HCF × LCM = a × b.","HCF(8,12)=4, LCM=24. 4×24 = 96 = 8×12.","Forgetting this relation.","Useful for verification.","HCF × LCM = product."),
  T("math7_ch11_word_problems",11,"11.4","HCF/LCM Word Problems","Real applications.","Buses leaving every N minutes: LCM. Largest piece: HCF.","2 buses at 6, 9 min intervals meet at LCM = 18 min.","Wrong choice (HCF vs LCM).","LCM: meetings. HCF: largest piece.","HCF/LCM solve real problems."),

  // Ch12
  T("math7_ch12_decimal_addition",12,"12.1","Decimal Addition","Align decimal points; add.","Add column by column.","1.25 + 2.5 = 3.75.","Misaligning.","Add zeros to align.","Decimal + aligned."),
  T("math7_ch12_decimal_subtraction",12,"12.2","Decimal Subtraction","Align points; subtract.","Borrow as needed.","5.5 − 2.25 = 3.25.","Misalignment.","Align decimals.","Decimal − aligned."),
  T("math7_ch12_decimal_multiplication",12,"12.3","Decimal Multiplication","Multiply; count decimal places.","Multiply without decimal; count total decimal places in factors.","0.5 × 0.3 = 0.15 (1+1 = 2 places).","Misplacing decimal.","Sum decimal places.","Decimal × needs place count."),
  T("math7_ch12_decimal_division",12,"12.4","Decimal Division","Move decimals; divide.","Move decimal in both divisor and dividend equally.","6.3 ÷ 0.7 = 63 ÷ 7 = 9.","Forgetting to move decimal in dividend.","Move both same number of places.","Decimal ÷ needs shifting."),

  // Ch13
  T("math7_ch13_collecting_data",13,"13.1","Data Collection","Tally and record.","Decide question; ask; tally; organize.","Survey ages of class.","Skipping tally step.","Tally as you go.","Data: ask, tally, organize."),
  T("math7_ch13_bar_graphs",13,"13.2","Bar Graphs","Visualize categorical data.","x = categories, y = counts. Bars compare.","Best subject preference.","Misreading scale.","Check axes first.","Bar graphs compare categories."),
  T("math7_ch13_mean_median",13,"13.3","Mean and Median","Mean = average. Median = middle.","Mean = sum/count. Median = middle (sort first).","Data: 2, 4, 5, 6, 8. Mean = 25/5 = 5. Median = 5.","Confusing mean and median.","Mean: average. Median: middle.","Mean and median measure centre."),
  T("math7_ch13_mode",13,"13.4","Mode","Most frequent value.","Find the most common value.","Data: 2, 3, 3, 5, 7. Mode = 3.","Multiple modes possible.","Most frequent.","Mode = most frequent."),

  // Ch14
  T("math7_ch14_construction_basics",14,"14.1","Construction Basics","Use ruler + compass.","Mark precisely; light lines.","Draw segment of given length.","Heavy lines.","Light pencil.","Construction needs precision."),
  T("math7_ch14_construction_triangles",14,"14.2","Constructing Triangles","SSS, SAS, ASA constructions.","Use compass and ruler accurately.","SSS: 3,4,5 triangle.","Wrong measurements.","Check measurements.","Construct triangles by criteria."),
  T("math7_ch14_tilings",14,"14.3","Tilings","Cover plane with shapes.","Identify the repeating unit.","Squares, hexagons tile perfectly.","Random arrangements.","Find unit + repeat.","Tilings cover without gaps."),
  T("math7_ch14_tessellation",14,"14.4","Tessellation Patterns","Patterns of tiles in art and nature.","Identify symmetry and rotations.","Islamic art: complex tessellations.","Confusing with patterns.","Tile + repeat.","Tessellation = artful tiling."),

  // Ch15
  T("math7_ch15_equations_intro",15,"15.1","Equations Introduction","Statement of equality.","Use balance principle.","x + 3 = 7.","Treating equations as expressions.","Has = sign.","Equations relate two sides."),
  T("math7_ch15_solving_simple",15,"15.2","Solving Simple Equations","Do same to both sides.","Isolate variable step by step.","x + 3 = 7 → x = 4.","Doing different things to each side.","Balance: same to both.","Solve = isolate variable."),
  T("math7_ch15_word_problems",15,"15.3","Equation Word Problems","Translate words to equations.","Define variable; write equation; solve.","'5 less than thrice a number is 10.' 3x − 5 = 10.","Misreading words.","Define variable first.","Word → equation → solve."),
  T("math7_ch15_balance_method",15,"15.4","Balance Method","Both sides stay equal.","Add/subtract same; multiply/divide same.","2x + 3 = 7 → 2x = 4 → x = 2.","One-side operations.","Apply to both sides.","Balance preserves equality."),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Seeding ${topics.length} Class 7 Math v2 sub-topics...`);
  for (const t of topics) {
    await NcertTopicContent.findOneAndUpdate({ topicId: t.topicId }, { $set: t }, { upsert: true, new: true });
  }
  console.log(`Seeded ${topics.length} Class 7 Math v2 sub-topics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
