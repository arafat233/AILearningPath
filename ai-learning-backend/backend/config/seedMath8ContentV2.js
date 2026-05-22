import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
dotenv.config();

const T = (topicId, chapterNumber, sectionNumber, title, intuition, process_explanation, worked_example, common_misconceptions, shortcuts_and_tricks, key_takeaway) => ({
  topicId, chapterNumber, sectionNumber, title, subject:"Mathematics", intuition, process_explanation, worked_example, common_misconceptions, shortcuts_and_tricks, key_takeaway
});

const topics = [
  // Ch1 — A Square and A Cube
  T("math8_ch1_squares",1,"1.1","Squares","Square of N = N × N = N². Represents area of square with side N.","Multiply by itself.","7² = 49.","Confusing square with double.","Memorize 1²-15².","Square = multiply by itself."),
  T("math8_ch1_cubes",1,"1.2","Cubes","Cube of N = N × N × N = N³. Represents volume of cube with side N.","Multiply by itself thrice.","3³ = 27.","Confusing with squares.","Memorize 1³-10³.","Cube = N × N × N."),
  T("math8_ch1_square_roots",1,"1.3","Square Roots","Inverse of squaring. √N = number whose square is N.","Find what number times itself gives N.","√25 = 5.","Forgetting non-perfect squares need approx.","Memorize perfect squares.","√ = inverse of square."),
  T("math8_ch1_cube_roots",1,"1.4","Cube Roots","Inverse of cubing. ∛N = number whose cube is N.","Find what number cubed gives N.","∛27 = 3.","Confusing with square roots.","Memorize perfect cubes.","∛ = inverse of cube."),

  // Ch2 — Power Play
  T("math8_ch2_exponents",2,"2.1","Exponents","Power: a^n = a × a × a × ... (n times).","Base raised to exponent.","2^4 = 2×2×2×2 = 16.","Confusing base and exponent.","Base raised to exponent.","Exponents = repeated multiplication."),
  T("math8_ch2_laws_exponents",2,"2.2","Laws of Exponents","Rules for working with powers.","a^m × a^n = a^(m+n). a^m ÷ a^n = a^(m-n). (a^m)^n = a^(mn).","2³ × 2² = 2⁵ = 32.","Mixing addition and multiplication.","Use rules carefully.","Exponent laws systematize powers."),
  T("math8_ch2_negative_powers",2,"2.3","Negative Powers","a^(-n) = 1/a^n.","Reciprocal with positive power.","2^(-3) = 1/2³ = 1/8.","Treating negative power as negative number.","Negative exponent → reciprocal.","Negative power = reciprocal."),
  T("math8_ch2_scientific_notation",2,"2.4","Scientific Notation","Express big/small numbers as a × 10^n where 1 ≤ a < 10.","Move decimal; count places for exponent.","300000 = 3 × 10⁵. 0.0003 = 3 × 10⁻⁴.","Forgetting sign of exponent.","Big → positive, small → negative.","Scientific notation simplifies big/small numbers."),

  // Ch3 — A Story of Numbers
  T("math8_ch3_number_history",3,"3.1","Number History","Numbers evolved from natural to integers to rationals to reals.","Natural: 1,2,3. Whole: + 0. Integers: + negatives. Rationals: fractions. Reals: + irrationals.","-3 is integer; ½ is rational; √2 is irrational.","Confusing types.","Each type extends previous.","Number system grew historically."),
  T("math8_ch3_integers_review",3,"3.2","Integers Review","Whole numbers + negatives.","..., -2, -1, 0, 1, 2, ...","-5 + 3 = -2.","Forgetting 0.","Include 0 and negatives.","Integers = whole + negatives + 0."),
  T("math8_ch3_rational_numbers",3,"3.3","Rational Numbers","Numbers expressible as p/q (p, q integers, q ≠ 0).","½, -¾, 5 (= 5/1) all rational.","0.5 = 1/2 rational. 0.333... = 1/3.","Thinking all decimals are rational.","p/q where q ≠ 0.","Rational = ratio of integers."),
  T("math8_ch3_irrational_numbers",3,"3.4","Irrational Numbers","Cannot be expressed as p/q.","√2, π, e are irrational.","√2 ≈ 1.41421...","Confusing with very small numbers.","Non-repeating, non-terminating decimal.","Irrational = not a fraction."),

  // Ch4 — Quadrilaterals
  T("math8_ch4_quadrilateral_types",4,"4.1","Types of Quadrilaterals","Square, rectangle, parallelogram, rhombus, trapezium, kite.","Classify by sides and angles.","Square: 4 equal sides + 4 right angles.","Confusing rhombus and square.","Each type has specific properties.","Quadrilaterals = 4-sided polygons."),
  T("math8_ch4_quadrilateral_properties",4,"4.2","Quadrilateral Properties","Each type has unique properties.","List properties: parallel sides, equal sides, angles.","Rectangle: opposite sides equal, all angles 90°.","Confusing similar shapes.","Memorize properties.","Properties define quadrilateral types."),
  T("math8_ch4_quadrilateral_angles",4,"4.3","Angle Sum","Sum of all 4 angles = 360°.","Add four angles = 360°.","Three angles 80, 90, 100; fourth = 90°.","Forgetting 360 sum.","Quadrilateral = 360°.","Quadrilateral angles sum to 360°."),
  T("math8_ch4_parallelograms",4,"4.4","Parallelograms","Opposite sides parallel + equal.","Both pairs of opposite sides parallel.","Square, rectangle, rhombus are parallelograms.","Calling trapezium parallelogram.","Both pairs parallel.","Parallelograms have parallel opposite sides."),

  // Ch5 — Number Play
  T("math8_ch5_patterns",5,"5.1","Number Patterns","Sequences with rules.","Find pattern rule.","2, 4, 8, 16: × 2.","Stopping at first pair.","Test several pairs.","Number patterns follow rules."),
  T("math8_ch5_primes_composites",5,"5.2","Primes and Composites","Prime: only 1 and itself. Composite: more factors.","Test divisibility.","7 prime, 9 composite.","Calling 1 prime.","Smallest prime = 2.","Numbers: prime or composite (except 1)."),
  T("math8_ch5_divisibility_rules",5,"5.3","Divisibility Rules","Quick tests for ÷ 2, 3, 5, 9, 10.","Apply rule based on digits.","234: 2+3+4 = 9 → ÷ 3 and ÷ 9.","Forgetting which test.","Memorize each.","Divisibility rules save time."),
  T("math8_ch5_magic_arithmetic",5,"5.4","Magic and Arithmetic Tricks","Number tricks reveal patterns.","Apply algebraic identity.","Trick: pick N, double, +6, halve, −N → 3.","Random guessing.","Use algebra.","Tricks reveal patterns."),

  // Ch6 — We Distribute Yet Things Multiply
  T("math8_ch6_distributive",6,"6.1","Distributive Property","a(b + c) = ab + ac.","Distribute multiplication over addition.","3(x + 4) = 3x + 12.","Multiplying only first term.","Distribute to each.","Distribution: a(b+c) = ab+ac."),
  T("math8_ch6_factorization",6,"6.2","Factorization","Reverse of distributive — find common factor.","Find common factor; pull out.","3x + 12 = 3(x + 4).","Missing common factors.","Look for GCD of terms.","Factorize = reverse distribute."),
  T("math8_ch6_like_terms",6,"6.3","Like Terms","Same variable + same power.","Identify; combine coefficients.","3x + 5x = 8x. 3x and 5x² are NOT like.","Treating x and x² as like.","Same variable AND power.","Like terms have same variable and power."),
  T("math8_ch6_simplification",6,"6.4","Algebraic Simplification","Combine like terms + apply rules.","Distribute, combine, simplify.","2(x + 3) + 4x = 2x + 6 + 4x = 6x + 6.","Algebra errors.","Step by step.","Simplification = clean expression."),

  // Ch7 — Proportional Reasoning 1
  T("math8_ch7_ratios",7,"7.1","Ratios","Comparison of two quantities by division.","a : b = a/b.","2 : 3 means 2 parts of 3 total.","Confusing ratio with fraction (similar).","Use : symbol.","Ratio = comparison."),
  T("math8_ch7_proportions",7,"7.2","Proportions","Equality of two ratios.","a:b :: c:d means a/b = c/d.","2:3 = 4:6.","Setting up incorrect ratios.","Cross-multiply to check.","Proportion = equal ratios."),
  T("math8_ch7_unitary",7,"7.3","Unitary Method","Find value of one unit; multiply.","Divide by quantity; multiply by needed.","If 5 pens cost ₹50, 1 pen = ₹10, 8 pens = ₹80.","Skipping unit step.","Always find unit first.","Unitary: find unit, then scale."),
  T("math8_ch7_percentages",7,"7.4","Percentages","Per hundred = /100.","Express as fraction of 100.","50% = 50/100 = ½.","Mixing % and decimal.","% = /100.","Percentages: out of 100."),

  // Ch8 — Fractions in Disguise
  T("math8_ch8_complex_fractions",8,"8.1","Complex Fractions","Fractions with fractions in numerator or denominator.","Simplify by inverting and multiplying.","(½) / (⅓) = ½ × 3 = 3/2.","Treating as regular division.","Multiply by reciprocal.","Complex fractions: invert."),
  T("math8_ch8_ratios_fractions",8,"8.2","Ratios as Fractions","Ratio a:b = a/b fraction.","Convert and apply.","2:3 = 2/3 = 0.666...","Confusing parts and total.","a:b means a/(a+b) of total.","Ratios convertible to fractions."),
  T("math8_ch8_fraction_division",8,"8.3","Fraction Division","Multiply by reciprocal.","a/b ÷ c/d = a/b × d/c.","½ ÷ ¼ = ½ × 4 = 2.","Forgetting reciprocal.","Flip second.","÷ fraction = × reciprocal."),
  T("math8_ch8_word_problems",8,"8.4","Fraction Word Problems","Apply to real situations.","Read carefully; choose operation.","¾ of 60 students = 45.","Misreading 'of'.","'Of' = ×.","Real-world fractions."),

  // Ch9 — Pythagoras
  T("math8_ch9_right_triangle",9,"9.1","Right Triangle","Triangle with one 90° angle.","Identify the right angle.","Right angle marked with small square.","Confusing right with isosceles.","One 90°.","Right triangle has 90° angle."),
  T("math8_ch9_pythagoras_theorem",9,"9.2","Pythagoras Theorem","a² + b² = c² where c is hypotenuse.","Square the legs; sum = square of hypotenuse.","3² + 4² = 5² (9 + 16 = 25).","Confusing legs and hypotenuse.","c = longest side.","Pythagoras: a² + b² = c²."),
  T("math8_ch9_pythagoras_applications",9,"9.3","Applications","Find missing sides of right triangles.","Use theorem to solve.","Legs 6 and 8: hypotenuse = √(36+64) = √100 = 10.","Forgetting to take square root.","Don't forget √.","Pythagoras finds sides."),
  T("math8_ch9_pythagoras_distances",9,"9.4","Distances","Calculate distances using right triangles.","Set up right triangle; apply theorem.","From (0,0) to (3,4): distance = 5.","Mixing distance and area.","Use coordinates.","Pythagoras computes distances."),

  // Ch10 — Proportional Reasoning 2
  T("math8_ch10_more_proportions",10,"10.1","More Proportions","Solving proportion problems.","Use cross-multiplication.","If a:b = c:d, then ad = bc.","Wrong cross.","Cross multiply correctly.","Proportions: cross-multiply."),
  T("math8_ch10_scale",10,"10.2","Scale","Ratio between map/model and real.","Use scale factor.","Scale 1:1000 means 1 cm = 1000 cm.","Forgetting scale factor.","Always use scale.","Scale relates model to real."),
  T("math8_ch10_similar_shapes",10,"10.3","Similar Shapes","Same shape, different sizes.","Corresponding sides proportional.","Two triangles with sides 3,4,5 and 6,8,10 are similar.","Similar ≠ congruent.","Sides scaled.","Similar: same shape, different size."),
  T("math8_ch10_direct_inverse",10,"10.4","Direct and Inverse Variation","Direct: y = kx. Inverse: xy = k.","Identify variation type.","Direct: more workers → more work. Inverse: more workers → less time.","Confusing direct and inverse.","Test if product or ratio is constant.","Direct vs inverse variation."),

  // Ch11 — Geometric Themes
  T("math8_ch11_angles_polygons",11,"11.1","Angles in Polygons","Sum of interior angles = (n-2) × 180°.","Apply formula for n-sided polygon.","Pentagon (n=5): 3 × 180 = 540°.","Forgetting formula.","(n-2) × 180.","Polygon interior sum formula."),
  T("math8_ch11_polygons_types",11,"11.2","Types of Polygons","By sides: triangle (3), quad (4), pentagon (5), hexagon (6), etc.","Count sides; classify.","Hexagon has 6 sides.","Confusing prefixes.","Greek prefixes.","Polygon types by # of sides."),
  T("math8_ch11_symmetry_review",11,"11.3","Symmetry","Line and rotational symmetry in shapes.","Find axes and centres.","Square: 4 lines + order 4 rotation.","Confusing types.","Both line and rotational possible.","Shapes have various symmetries."),
  T("math8_ch11_transformations",11,"11.4","Transformations","Translation, rotation, reflection, scaling.","Identify which transformation applies.","Sliding = translation. Flipping = reflection.","Mixing types.","Rigid: preserve size + shape. Scaling: changes size.","Transformations move shapes."),

  // Ch12 — Tales by Dots and Lines
  T("math8_ch12_graph_theory_intro",12,"12.1","Graphs (Networks)","Dots (vertices) connected by lines (edges).","Identify vertices and edges.","Friendship graph: people = vertices, friendships = edges.","Confusing with charts.","Vertices + edges.","Graphs = vertices + edges."),
  T("math8_ch12_paths",12,"12.2","Paths in Graphs","Sequence of edges from one vertex to another.","Trace path between vertices.","Path A → B → C connects 3 vertices.","Skipping vertices.","Follow connected edges.","Paths connect vertices."),
  T("math8_ch12_euler",12,"12.3","Euler's Path","Path using each edge exactly once.","Check degree of vertices.","Königsberg bridges: no Euler path exists.","Trying without checking degrees.","All even degree → Euler circuit.","Euler paths use each edge once."),
  T("math8_ch12_trees",12,"12.4","Trees","Graph with no cycles, all connected.","Identify if cycle exists.","Family tree.","Confusing with general graphs.","No cycles.","Trees = connected, no cycles."),

  // Ch13 — Algebra Play
  T("math8_ch13_expressions",13,"13.1","Algebraic Expressions","Combinations of variables, numbers, operations.","Read and evaluate.","2x + 5: x = 3 → 11.","Confusing expression and equation.","No = sign.","Expressions are non-equational."),
  T("math8_ch13_equations",13,"13.2","Equations","Statement of equality.","Use balance method.","2x + 5 = 11 → x = 3.","Treating as expression.","Has =.","Equations: solve for variable."),
  T("math8_ch13_inequalities",13,"13.3","Inequalities","Relations: <, >, ≤, ≥.","Solve like equations; reverse sign on multiplying/dividing by negative.","x + 3 > 5 → x > 2.","Forgetting to flip on negative.","Flip on ÷ or × by negative.","Inequalities: comparisons."),
  T("math8_ch13_identities",13,"13.4","Algebraic Identities","Always-true equalities.","Memorize key identities: (a+b)² = a² + 2ab + b² etc.","(x+3)² = x² + 6x + 9.","Forgetting middle term.","Memorize identities.","Identities simplify algebra."),

  // Ch14 — Area
  T("math8_ch14_rectangle_area",14,"14.1","Rectangle Area","A = l × w.","Multiply length and width.","5 × 3 = 15 sq units.","Confusing with perimeter.","l × w.","Rectangle area = lw."),
  T("math8_ch14_triangle_area",14,"14.2","Triangle Area","A = ½ × b × h.","Multiply base by height, halve.","Base 6, height 4: A = 12.","Confusing height with side.","½bh.","Triangle area = ½bh."),
  T("math8_ch14_trapezium_area",14,"14.3","Trapezium Area","A = ½ × (a + b) × h.","Average parallel sides, multiply by height.","Sides 5 and 7, height 4: A = ½(12)(4) = 24.","Confusing with parallelogram.","½(a+b)h.","Trapezium: average sides × height."),
  T("math8_ch14_circle_area",14,"14.4","Circle Area","A = π × r².","Square radius, multiply by π.","Radius 7: A = π × 49 ≈ 154 sq units.","Using diameter instead of radius.","Use radius.","Circle area = πr²."),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Seeding ${topics.length} Class 8 Math v2 sub-topics...`);
  for (const t of topics) {
    await NcertTopicContent.findOneAndUpdate({ topicId: t.topicId }, t, { upsert: true, new: true });
  }
  console.log(`Seeded ${topics.length} Class 8 Math v2 sub-topics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
