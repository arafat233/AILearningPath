import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
dotenv.config();

const T = (topicId, chapterNumber, sectionNumber, title, intuition, process_explanation, worked_example, common_misconceptions, shortcuts_and_tricks, key_takeaway) => ({
  topicId, chapterNumber, sectionNumber, title, subject:"Mathematics", intuition, process_explanation, worked_example, common_misconceptions, shortcuts_and_tricks, key_takeaway
});

const topics = [
  // Ch1 — Patterns in Mathematics
  T("math6_ch1_number_patterns",1,"1.1","Number Patterns","Numbers in sequence follow rules (add, subtract, multiply, divide).","Find differences or ratios between consecutive terms.","2, 4, 6, 8: +2 each. 3, 9, 27, 81: ×3.","Stopping at one pair; missing the rule.","Check at least 3 differences.","Number patterns follow rules; find them via differences/ratios."),
  T("math6_ch1_shape_patterns",1,"1.2","Shape Patterns","Shapes repeat in patterns; find the unit.","Identify smallest repeating block.","□△□△ → unit □△.","Missing the unit.","Find smallest repeat.","Shape patterns: unit then repeat."),
  T("math6_ch1_fibonacci",1,"1.3","Fibonacci-like Sequences","Each number is sum of previous two.","Start with 2 numbers; add to get next.","1, 1, 2, 3, 5, 8, 13...","Confusing with arithmetic patterns.","Add prev + previous.","Fibonacci sequences sum the prior two."),
  T("math6_ch1_pattern_rules",1,"1.4","Finding Pattern Rules","Every pattern has a rule.","Try +, −, ×, ÷, exponents until one fits all terms.","2, 6, 18: ×3 each.","Trying only one operation.","Test all operations.","Find rule by testing operations."),

  // Ch2 — Lines and Angles
  T("math6_ch2_lines_types",2,"2.1","Types of Lines","Lines: straight, curved, ray (from point), segment (between two points), line (infinite both ways).","Identify endpoints to classify.","AB segment has 2 endpoints. Ray starts at A goes to B.","Confusing line, segment, ray.","Endpoints count.","Line types: by endpoints."),
  T("math6_ch2_angles_types",2,"2.2","Types of Angles","Acute < 90°, Right = 90°, Obtuse > 90° (< 180°), Straight = 180°, Reflex > 180°.","Compare angle to standard reference.","45° = acute. 120° = obtuse.","Confusing obtuse and reflex.","A-R-O-S-R by size.","Angle types by size."),
  T("math6_ch2_parallel_perpendicular",2,"2.3","Parallel and Perpendicular Lines","Parallel: never meet. Perpendicular: meet at 90°.","Check spacing (parallel) and angle (perpendicular).","Railway tracks: parallel. Cross at junction: often perpendicular.","Calling intersecting lines parallel.","Parallel = equidistant. Perp = 90°.","Lines: parallel or perpendicular by angle/distance."),
  T("math6_ch2_measuring_angles",2,"2.4","Measuring Angles","Use a protractor: align centre at vertex.","Centre at vertex; one arm at 0°; read where the other arm crosses scale.","Read 75° as the angle.","Reading wrong scale.","Match scale start.","Protractor measures degrees."),

  // Ch3 — Number Play
  T("math6_ch3_number_properties",3,"3.1","Number Properties","Numbers have properties: even/odd, prime/composite, divisibility.","Apply rules: ends in 0/2/4/6/8 = even.","6 even, 7 odd; 7 prime, 6 composite.","Mixing odd/even with prime.","Check rules.","Properties classify numbers."),
  T("math6_ch3_divisibility_rules",3,"3.2","Divisibility Rules","Quick tests for divisibility by 2, 3, 5, 9, 10.","÷ 2: ends 0/2/4/6/8. ÷3: digits sum÷3. ÷5: ends 0/5. ÷9: digits sum÷9. ÷10: ends 0.","234: digits 2+3+4=9, ÷3 yes.","Forgetting which rule applies.","Memorize each rule.","Divisibility rules speed checks."),
  T("math6_ch3_factors_multiples",3,"3.3","Factors and Multiples","Factor divides evenly. Multiple is the result of multiplication.","List factors of N. List multiples = N×1, N×2...","12 factors: 1,2,3,4,6,12. Multiples: 12, 24, 36.","Confusing factors with multiples.","Factor ÷ divides; multiple = ×.","Factors and multiples are inverse."),
  T("math6_ch3_number_games",3,"3.4","Number Puzzles and Games","Magic squares, number tricks reveal patterns.","Apply rules of the puzzle.","3×3 magic square: rows/cols/diagonals same sum.","Random guessing.","Use pattern.","Number puzzles teach properties."),

  // Ch4 — Data Handling and Presentation
  T("math6_ch4_collecting_data",4,"4.1","Collecting Data","Data: facts and figures gathered to answer questions.","Decide question; survey; record (tally); organize.","Survey favorite sport: ask 30 students, tally answers.","Skipping the tally step.","Tally as you go.","Data collection = ask + tally + organize."),
  T("math6_ch4_bar_graphs",4,"4.2","Bar Graphs","Bars of different heights show data values.","y-axis = value, x-axis = category. Heights compare.","Cricket=15, Football=10. Cricket bar taller.","Misreading scale.","Check scale first.","Bar graphs show categorical data."),
  T("math6_ch4_pictographs",4,"4.3","Pictographs","Symbols represent counts; each = key value.","Read key; count symbols × key.","Each ★ = 5; 4 stars = 20.","Forgetting the key.","× by key.","Pictographs use symbols."),
  T("math6_ch4_data_interpretation",4,"4.4","Data Interpretation","Answer questions from graphs: most, least, total, differences.","Read graph carefully; compute.","Bar chart of pets: most common = tallest bar.","Misreading the wrong bar.","Trace bar to scale.","Charts answer data questions."),

  // Ch5 — Prime Time
  T("math6_ch5_prime_numbers",5,"5.1","Prime Numbers","Prime: only factors are 1 and itself.","Check if any number 2 to √N divides N.","2, 3, 5, 7, 11, 13 are prime.","Counting 1 as prime (it's not).","Test divisors up to √N.","Prime = only 1 and itself as factors."),
  T("math6_ch5_composite_numbers",5,"5.2","Composite Numbers","Composite: has more than 2 factors.","Find at least one divisor besides 1 and N.","4 = 2×2; 6 = 2×3.","Confusing prime and composite.","If divisor < N, composite.","Composite numbers have many factors."),
  T("math6_ch5_prime_factorization",5,"5.3","Prime Factorization","Express number as product of primes.","Divide by smallest primes successively.","12 = 2 × 2 × 3.","Listing all factors instead of primes.","Use factor tree.","Prime factorization: unique."),
  T("math6_ch5_co_prime",5,"5.4","Co-prime Numbers","Co-prime: HCF = 1.","Find HCF of two numbers; if = 1, co-prime.","8 and 9 co-prime (HCF=1).","Thinking prime means co-prime.","HCF check.","Co-prime: share no factor > 1."),

  // Ch6 — Perimeter and Area
  T("math6_ch6_perimeter_basics",6,"6.1","Perimeter","Distance around a closed shape.","Add all side lengths.","Triangle 3,4,5: P = 12.","Confusing with area.","Sum sides.","Perimeter = around."),
  T("math6_ch6_area_rectangles",6,"6.2","Area of Rectangles","Area = l × w.","Multiply dimensions.","5 × 3 = 15 sq units.","Adding instead of multiplying.","l × w.","Rectangle area = lw."),
  T("math6_ch6_area_triangles",6,"6.3","Area of Triangles","Area = ½ × base × height.","Identify base and height (perpendicular).","Base 4, height 3: A = ½ × 12 = 6.","Confusing slant height with perpendicular height.","½ × b × h.","Triangle area = ½bh."),
  T("math6_ch6_real_problems",6,"6.4","Real-World Area/Perimeter","Apply to fencing, carpeting, tiling.","Choose perimeter or area based on task.","Fence 10×8 garden: P=36 m.","Mixing area and perimeter.","Fence=P; carpet=A.","Real problems combine area/perimeter."),

  // Ch7 — Fractions
  T("math6_ch7_fractions_review",7,"7.1","Fractions Review","Fraction = part / whole.","Numerator/denominator.","3/8 = 3 of 8 equal parts.","Bigger denominator → smaller piece.","Smaller bottom = bigger piece.","Fraction = part of whole."),
  T("math6_ch7_equivalent_fractions",7,"7.2","Equivalent Fractions","Same value, different form.","Multiply top and bottom by same number.","½ = 2/4 = 3/6.","Multiplying only one part.","× both.","Equivalent fractions: × both."),
  T("math6_ch7_fraction_operations",7,"7.3","Fraction Operations","Add, subtract, multiply, divide fractions.","Same denom: add tops. Multiply: tops × tops, bottoms × bottoms. Divide: multiply by reciprocal.","½ + ¼ = 2/4 + 1/4 = 3/4. ½ × ½ = 1/4.","Adding both top and bottom.","Common denom for add/sub.","Fraction operations have rules."),
  T("math6_ch7_mixed_numbers",7,"7.4","Mixed Numbers","Combination of whole and fraction.","Mixed: 1½ = 1 + ½. Improper: 3/2.","1½ = 3/2 (× 2 + 1 = 3).","Confusing mixed and improper.","Convert as needed.","Mixed numbers: whole + fraction."),

  // Ch8 — Playing with Constructions
  T("math6_ch8_basic_constructions",8,"8.1","Basic Constructions","Use ruler + compass to draw shapes.","Mark points; draw lines/arcs.","Construct segment of 5 cm.","Skipping construction lines.","Use compass to copy lengths.","Constructions with ruler and compass."),
  T("math6_ch8_triangles_construction",8,"8.2","Triangle Construction","Construct triangles given sides or angles.","SSS, SAS, ASA methods.","SSS: sides 3, 4, 5 → unique triangle.","Mismatching sides.","Use compass + ruler.","Triangles by SSS, SAS, ASA."),
  T("math6_ch8_angle_bisector",8,"8.3","Angle Bisector","Divides angle into two equal halves.","Arc from vertex, arcs from arc points; connect.","Bisect 60° → two 30° angles.","Random line through angle.","Compass arcs.","Angle bisector: equal halves."),
  T("math6_ch8_perpendicular_bisector",8,"8.4","Perpendicular Bisector","Divides segment into two equal parts at 90°.","Equal arcs from each endpoint; connect intersections.","Bisect AB at midpoint with perpendicular.","Line through midpoint without 90°.","Arc method.","Perpendicular bisector: equal halves at right angle."),

  // Ch9 — Symmetry
  T("math6_ch9_line_symmetry",9,"9.1","Line Symmetry","Shape divided by line; halves match.","Find fold lines.","Square: 4 lines. Rectangle: 2.","Counting too many lines.","Try V, H, diagonals.","Line symmetry = fold match."),
  T("math6_ch9_rotational_symmetry",9,"9.2","Rotational Symmetry","Shape matches after rotation < 360°.","Find smallest rotation angle that matches.","Square: order 4 (90° rotations).","Confusing with line symmetry.","360 / order = smallest angle.","Rotational: partial rotation matches."),
  T("math6_ch9_point_symmetry",9,"9.3","Point Symmetry","Shape matches after 180° rotation about a centre.","Rotate 180°; check matching.","S, Z, H have point symmetry.","Confusing with line symmetry.","180° rotation test.","Point symmetry: 180° match."),
  T("math6_ch9_symmetric_shapes",9,"9.4","Symmetric Shapes in Nature/Art","Symmetry in flowers, snowflakes, designs.","Identify type of symmetry in objects.","Butterfly: line. Pinwheel: rotational.","Missing rotational vs line.","Both types possible.","Symmetry surrounds us."),

  // Ch10 — The Other Side of Zero
  T("math6_ch10_negative_numbers",10,"10.1","Negative Numbers","Numbers below zero: −1, −2, −3...","Represent on number line, left of zero.","Temperature −5°C means below freezing.","Confusing with positive.","< 0 means negative.","Negatives extend the number line."),
  T("math6_ch10_number_line",10,"10.2","Number Line","Visual scale showing positives, zero, negatives.","Mark equal intervals; place numbers.","−3, −2, −1, 0, 1, 2, 3.","Skipping zero.","Equal spacing.","Number line: visualize numbers."),
  T("math6_ch10_negative_operations",10,"10.3","Operations with Negatives","Adding/subtracting negatives.","+(−n) = −n. −(−n) = +n.","5 + (−3) = 2. 4 − (−2) = 6.","Mixing signs.","Same signs add; different subtract.","Negative operations: sign rules."),
  T("math6_ch10_real_world_negatives",10,"10.4","Real-World Negatives","Temperature, debts, elevation below sea level.","Use negative to model real situations.","Temperature −10°C, debt of ₹500 = −500.","Calling them just 'smaller'.","Negative = direction.","Real life uses negatives."),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Seeding ${topics.length} Class 6 Math v2 sub-topics...`);
  for (const t of topics) {
    await NcertTopicContent.findOneAndUpdate({ topicId: t.topicId }, t, { upsert: true, new: true });
  }
  console.log(`Seeded ${topics.length} Class 6 Math v2 sub-topics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
