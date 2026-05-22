import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

dotenv.config();

const topics = [
  {
    topicId: "math9_ch1",
    subject: "Mathematics",
    chapterNumber: 1,
    name: "Orienting Yourself: The Use of Coordinates",
    teaching_content: {
      intuition: "Every point in a flat plane can be uniquely pinned down by two numbers — just like a city grid where 'go 3 blocks east and 5 blocks north' leaves no ambiguity. The Cartesian coordinate system formalises this idea: a horizontal number line (x-axis) crosses a vertical number line (y-axis) at the origin (0, 0), creating four quadrants.",
      process_explanation: `1. Draw two perpendicular lines: x-axis (horizontal) and y-axis (vertical) meeting at origin O(0,0).
2. Every point P is written as an ordered pair (x, y) where x = horizontal distance (right is +, left is −) and y = vertical distance (up is +, down is −).
3. The four quadrants: Q1 (+,+), Q2 (−,+), Q3 (−,−), Q4 (+,−).
4. To plot P(3, −2): move 3 right on x-axis, then 2 down.
5. Distance between two points A(x₁,y₁) and B(x₂,y₂): d = √[(x₂−x₁)² + (y₂−y₁)²].
6. Midpoint of AB: M = ((x₁+x₂)/2, (y₁+y₂)/2).`,
      worked_example: `Example 1: Plot A(2,3), B(−1,4), C(−3,−2) and identify their quadrants.
A(2,3) → Q1 (both positive)
B(−1,4) → Q2 (x negative, y positive)
C(−3,−2) → Q3 (both negative)

Example 2: Find distance between P(1,2) and Q(4,6).
d = √[(4−1)² + (6−2)²] = √[9 + 16] = √25 = 5 units.

Example 3: Find midpoint of P(1,2) and Q(5,8).
M = ((1+5)/2, (2+8)/2) = (3, 5).`,
      common_misconceptions: `• Swapping x and y: (3,2) is NOT the same as (2,3). The first coordinate is always x (horizontal).
• Forgetting that the origin (0,0) lies on both axes — it belongs to neither quadrant.
• Sign errors: points on the negative x-axis have y=0, not a negative y.
• Distance formula uses squares, so (x₂−x₁)² is always positive regardless of order.`,
      shortcuts_and_tricks: `• A point on the x-axis always has y=0; a point on the y-axis always has x=0.
• Quick quadrant check: signs of (x,y) tell you the quadrant — (+,+)→Q1, (−,+)→Q2, (−,−)→Q3, (+,−)→Q4.
• Distance from origin to P(a,b) = √(a²+b²) — a special case of the distance formula.
• The midpoint is just the average of x-coordinates and average of y-coordinates.`,
      key_takeaway: "A coordinate pair (x, y) uniquely identifies every point on a plane. The sign of each coordinate tells the quadrant, and the distance formula d=√[(Δx)²+(Δy)²] measures straight-line distance between any two points.",
    },
  },
  {
    topicId: "math9_ch2",
    subject: "Mathematics",
    chapterNumber: 2,
    name: "Introduction to Linear Polynomials",
    teaching_content: {
      intuition: "A polynomial is an expression built from a variable raised to whole-number powers with constant multipliers. The simplest non-trivial polynomial is linear: p(x) = ax + b, a straight-line relationship. Where this line crosses the x-axis — where p(x) = 0 — is called the zero (or root) of the polynomial.",
      process_explanation: `1. A linear polynomial has the form p(x) = ax + b, a ≠ 0.
2. Degree = 1 (highest power of x is 1).
3. To find the zero: set p(x) = 0 → ax + b = 0 → x = −b/a.
4. The graph of y = ax + b is a straight line; it cuts the x-axis exactly once (at x = −b/a).
5. Value of p(x) at x = k: substitute x = k into the expression.
6. A constant polynomial (a=0, b≠0) has no zero; the zero polynomial (a=0,b=0) has every number as a zero.`,
      worked_example: `Example 1: p(x) = 2x − 6. Find zero.
Set 2x − 6 = 0 → x = 3. Zero is 3. Check: p(3) = 2(3)−6 = 0 ✓

Example 2: p(x) = −3x + 9. Graph cuts x-axis at?
−3x + 9 = 0 → x = 3. The graph crosses x-axis at (3, 0).

Example 3: Is x = −1 a zero of p(x) = 5x + 5?
p(−1) = 5(−1) + 5 = −5 + 5 = 0. Yes, −1 is a zero.`,
      common_misconceptions: `• Confusing the zero of the polynomial with y = 0 on the graph: both mean the same thing (the x-intercept), but students often write x = 0 instead.
• Thinking a constant like p(x) = 7 has a zero — it does not (no x makes 7 = 0).
• Sign error: for p(x) = ax + b, zero is x = −b/a, NOT +b/a.`,
      shortcuts_and_tricks: `• Linear polynomial always has exactly one zero: x = −b/a.
• To verify a zero k: compute p(k); if you get 0, it's confirmed.
• If a > 0 the line slopes upward; if a < 0 it slopes downward — useful for sketching.`,
      key_takeaway: "A linear polynomial p(x) = ax + b (a≠0) has exactly one zero at x = −b/a. Its graph is a straight line crossing the x-axis at that point.",
    },
  },
  {
    topicId: "math9_ch3",
    subject: "Mathematics",
    chapterNumber: 3,
    name: "The World of Numbers",
    teaching_content: {
      intuition: "Numbers evolved historically: first counting numbers (natural numbers), then zero was invented (giving whole numbers), then negatives (integers), then fractions (rationals), and finally the discovery that some lengths — like the diagonal of a unit square — cannot be expressed as fractions (irrationals). Together rationals and irrationals fill the entire number line — the real numbers.",
      process_explanation: `Number hierarchy:
1. Natural numbers ℕ: {1, 2, 3, …} — counting.
2. Whole numbers W: {0, 1, 2, 3, …} — ℕ ∪ {0}.
3. Integers ℤ: {…,−2,−1,0,1,2,…} — whole numbers + negatives.
4. Rational numbers ℚ: numbers expressible as p/q (p,q ∈ ℤ, q≠0). Decimals either terminate or repeat.
5. Irrational numbers: cannot be expressed as p/q. Decimals are non-terminating, non-repeating. Examples: √2, √3, π.
6. Real numbers ℝ = ℚ ∪ irrationals — every point on the number line.

Identifying irrationals: √n is irrational if n is not a perfect square.
Rationalising: multiply and divide by the conjugate, e.g. 1/√2 = √2/2.`,
      worked_example: `Example 1: Classify 0.142857142857…
Repeating block "142857" → rational (= 1/7).

Example 2: Is √5 rational?
5 is not a perfect square → √5 is irrational.

Example 3: Simplify 1/(√3 − 1).
Multiply by (√3+1)/(√3+1): = (√3+1)/((√3)²−1²) = (√3+1)/2.

Example 4: Represent √2 on number line.
Construct right triangle with legs 1, 1. Hypotenuse = √2. Arc it onto the number line.`,
      common_misconceptions: `• All square roots are irrational — FALSE. √4 = 2 (rational), √9 = 3 (rational).
• π = 22/7 — FALSE. 22/7 is a rational approximation; π is genuinely irrational.
• Zero is not a rational number — FALSE. 0 = 0/1 is rational.
• Every decimal is irrational — FALSE. Terminating and repeating decimals are rational.`,
      shortcuts_and_tricks: `• Quick test: if a square root produces a whole number, it's rational.
• Every integer is a rational number: n = n/1.
• To convert repeating decimal to fraction: let x = 0.̄3, then 10x = 3.̄3, subtract: 9x = 3, x = 1/3.
• Rationalisation trick: multiply by conjugate (a+b)/(a+b) to clear radicals from denominators.`,
      key_takeaway: "Real numbers = rationals + irrationals. Rationals have terminating or repeating decimals; irrationals (like √2 and π) have infinite non-repeating decimals. Every point on the number line corresponds to exactly one real number.",
    },
  },
  {
    topicId: "math9_ch4",
    subject: "Mathematics",
    chapterNumber: 4,
    name: "Exploring Algebraic Identities",
    teaching_content: {
      intuition: "An algebraic identity is an equation that holds for ALL values of the variable(s). Unlike an equation with a specific solution, an identity is universally true. These identities are powerful shortcuts: instead of multiplying out (a+b)² every time, we recall the result directly and save time in exams.",
      process_explanation: `Standard identities to memorise:
1. (a + b)² = a² + 2ab + b²
2. (a − b)² = a² − 2ab + b²
3. (a + b)(a − b) = a² − b²
4. (x + a)(x + b) = x² + (a+b)x + ab
5. (a + b)³ = a³ + 3a²b + 3ab² + b³
6. (a − b)³ = a³ − 3a²b + 3ab² − b³
7. a³ + b³ = (a + b)(a² − ab + b²)
8. a³ − b³ = (a − b)(a² + ab + b²)
9. (a + b + c)² = a² + b² + c² + 2ab + 2bc + 2ca

Using identities for factorisation:
• Recognise the pattern, match a and b, apply the identity in reverse.`,
      worked_example: `Example 1: Expand (2x + 3y)².
= (2x)² + 2(2x)(3y) + (3y)² = 4x² + 12xy + 9y².

Example 2: Evaluate 103² using identity.
103² = (100 + 3)² = 100² + 2(100)(3) + 3² = 10000 + 600 + 9 = 10609.

Example 3: Factorise x² − 9.
x² − 9 = x² − 3² = (x+3)(x−3). [using a²−b²]

Example 4: Find (a+b+c)² if a+b+c = 5 and ab+bc+ca = 7.
(a+b+c)² = a²+b²+c² + 2(ab+bc+ca)
25 = a²+b²+c² + 14 → a²+b²+c² = 11.`,
      common_misconceptions: `• (a + b)² = a² + b² — WRONG. Middle term 2ab is missing. This is the most common algebra error.
• (a − b)² = a² − b² — WRONG. Correct: a² − 2ab + b².
• a³ + b³ = (a + b)³ — WRONG. (a+b)³ has extra terms 3a²b + 3ab².
• Forgetting sign changes when applying (a−b)³: middle terms alternate signs.`,
      shortcuts_and_tricks: `• For computing squares near round numbers: 98² = (100−2)² = 10000 − 400 + 4 = 9604.
• Difference of squares: spot when two terms are perfect squares separated by subtraction.
• Sum/difference of cubes: if you see x³ ± 8, recognise 8 = 2³ and apply identity.
• (a+b+c)²: when sum is known and sum-of-products is known, find sum-of-squares instantly.`,
      key_takeaway: "Algebraic identities are universally-true shortcuts. The most important: (a±b)² = a²±2ab+b², a²−b² = (a+b)(a−b), and the cube identities. Knowing them saves calculation time and powers factorisation.",
    },
  },
  {
    topicId: "math9_ch5",
    subject: "Mathematics",
    chapterNumber: 5,
    name: "I'm Up and Down, and Round and Round",
    teaching_content: {
      intuition: "A circle is the set of all points in a plane at a fixed distance (radius) from a fixed point (centre). Chords are line segments connecting two points on the circle. Key insight: the perpendicular from the centre to a chord always bisects it — a deeply symmetric property that underlies many theorems.",
      process_explanation: `Key definitions:
• Circle: locus of points at distance r from centre O.
• Chord: line segment with both endpoints on the circle.
• Diameter: longest chord passing through centre (length = 2r).
• Arc: part of the circumference between two points.

Major theorems:
1. Perpendicular from centre to chord bisects the chord (and vice-versa).
2. Equal chords are equidistant from the centre; chords equidistant from centre are equal.
3. Angle subtended by an arc at the centre = 2 × angle subtended at any point on the remaining arc.
4. Angles in the same segment are equal.
5. Angle in a semicircle = 90°.
6. Opposite angles of a cyclic quadrilateral are supplementary (sum = 180°).`,
      worked_example: `Example 1: Chord AB = 16 cm. Perpendicular from centre O meets AB at M. If OM = 6 cm, find radius.
AM = AB/2 = 8 cm (perp bisects chord).
OA² = OM² + AM² = 36 + 64 = 100 → OA = 10 cm = radius.

Example 2: Arc PQ subtends 80° at centre O. What angle does it subtend at point R on the major arc?
Angle at circumference = (1/2) × central angle = 40°.

Example 3: ABCD is a cyclic quadrilateral. ∠A = 110°. Find ∠C.
∠A + ∠C = 180° → ∠C = 70°.`,
      common_misconceptions: `• The perpendicular bisector of a chord passes through the centre — students often forget the direction (it's centre → chord, not chord → random point).
• Angle in a semicircle: the 90° is at the circumference, not at the centre.
• Confusing major and minor arc/segment when applying the inscribed angle theorem.`,
      shortcuts_and_tricks: `• Perpendicular from centre halves the chord — form a right triangle and use Pythagoras.
• If the question mentions "angle in a semicircle" → answer is 90° (look for diameter).
• Cyclic quadrilateral: opposite angles add to 180°; use this to find unknowns quickly.
• Equal chords ↔ equal distances from centre — a two-way test.`,
      key_takeaway: "The perpendicular from centre bisects any chord. Central angle = 2 × inscribed angle. Opposite angles of a cyclic quadrilateral sum to 180°. These three facts solve most circle problems.",
    },
  },
  {
    topicId: "math9_ch6",
    subject: "Mathematics",
    chapterNumber: 6,
    name: "Measuring Space: Perimeter and Area",
    teaching_content: {
      intuition: "Perimeter measures the boundary of a figure (useful for fencing); area measures the interior space (useful for carpeting). For standard shapes there are direct formulas. For irregular triangles, Heron's formula is the go-to tool. Circles introduce arc length and sector area — proportional slices of the full circumference and area.",
      process_explanation: `Key formulas:
Rectangle: P = 2(l+b), A = l×b
Square: P = 4s, A = s²
Triangle: A = ½ × base × height
Heron's formula: A = √[s(s−a)(s−b)(s−c)] where s = (a+b+c)/2
Parallelogram: A = base × height
Circle: Circumference C = 2πr, Area A = πr²
Arc length: l = (θ/360°) × 2πr
Sector area: A = (θ/360°) × πr²

Steps for Heron:
1. Find semi-perimeter s = (a+b+c)/2.
2. Compute (s−a), (s−b), (s−c).
3. Multiply: s(s−a)(s−b)(s−c).
4. Take square root.`,
      worked_example: `Example 1: Triangle with sides 5, 6, 7 cm. Find area using Heron's.
s = (5+6+7)/2 = 9
s−a=4, s−b=3, s−c=2
A = √(9×4×3×2) = √216 = 6√6 cm².

Example 2: Arc length for radius 14 cm, angle 90°.
l = (90/360) × 2π × 14 = (1/4) × 28π = 7π ≈ 22 cm.

Example 3: Area of sector radius 10 cm, angle 60°.
A = (60/360) × π × 100 = (1/6) × 100π = 50π/3 cm².`,
      common_misconceptions: `• Using diameter instead of radius in circle formulas: A = πr², not πd².
• Forgetting to use semi-perimeter (half of perimeter) in Heron's formula.
• Confusing arc length (1D boundary) with sector area (2D region).
• Not converting angle to the correct fraction of 360° when calculating arc/sector.`,
      shortcuts_and_tricks: `• For a right triangle with legs a, b: A = ½ab (no need for Heron's).
• Sector area = (1/2) × r × arc length — useful when arc length is already known.
• For equilateral triangle side a: A = (√3/4)a² (a derived Heron result worth memorising).
• Quick check: area units are always squared (cm², m²); perimeter/arc units are linear.`,
      key_takeaway: "Area of irregular triangles uses Heron's formula with semi-perimeter s. Circle sectors scale by θ/360: arc length = (θ/360)×2πr, sector area = (θ/360)×πr². Always use radius, not diameter, in circle formulas.",
    },
  },
  {
    topicId: "math9_ch7",
    subject: "Mathematics",
    chapterNumber: 7,
    name: "The Mathematics of Maybe: Introduction to Probability",
    teaching_content: {
      intuition: "Probability quantifies uncertainty on a scale from 0 (impossible) to 1 (certain). It can be measured experimentally (how often something happened in many trials) or computed theoretically (counting equally-likely outcomes). Both approaches converge: as experiments increase, experimental probability approaches theoretical probability.",
      process_explanation: `1. Experiment: an action with observable outcomes (e.g., rolling a die).
2. Sample space S: set of all possible outcomes. |S| = total outcomes.
3. Event E: a subset of S.
4. Theoretical probability: P(E) = (number of favourable outcomes) / (total outcomes).
   Valid only when all outcomes are equally likely.
5. Experimental probability: P(E) = (frequency of E) / (total trials).
6. Properties: 0 ≤ P(E) ≤ 1. P(S) = 1. P(∅) = 0. P(E') = 1 − P(E).
7. Complementary event E': everything NOT in E.`,
      worked_example: `Example 1: A fair die is thrown once. P(getting a 4)?
S = {1,2,3,4,5,6}, |S| = 6. Favourable = {4}, count = 1.
P(4) = 1/6.

Example 2: A bag has 3 red, 5 blue balls. P(picking red)?
Total = 8. P(red) = 3/8.

Example 3: A coin tossed 200 times, heads appeared 110 times. Experimental P(heads)?
= 110/200 = 0.55.

Example 4: P(not getting a 4) when die is thrown?
P(not 4) = 1 − P(4) = 1 − 1/6 = 5/6.`,
      common_misconceptions: `• P(E) can be greater than 1 — IMPOSSIBLE. Probability is always in [0, 1].
• Equal probability for any two outcomes — FALSE unless outcomes are equally likely.
• Experimental and theoretical probabilities must match exactly — they converge only in the long run.
• Confusing "at least one" with "exactly one" when framing events.`,
      shortcuts_and_tricks: `• List the sample space first — never skip this step for small experiments.
• Use complement: P(at least one) = 1 − P(none). Often faster than direct counting.
• For cards: total = 52, each suit has 13 cards, each rank has 4 cards.
• For dice: total outcomes for n dice = 6ⁿ.`,
      key_takeaway: "Probability P(E) = (favourable outcomes)/(total equally-likely outcomes), always in [0,1]. The complement rule P(E') = 1 − P(E) is your fastest shortcut. Experimental probability approximates theoretical probability over many trials.",
    },
  },
  {
    topicId: "math9_ch8",
    subject: "Mathematics",
    chapterNumber: 8,
    name: "Predicting What Comes Next: Exploring Sequences and Progressions",
    teaching_content: {
      intuition: "A sequence is an ordered list of numbers following a rule. In an Arithmetic Progression (AP) each term is obtained by adding a constant difference d. In a Geometric Progression (GP) each term is obtained by multiplying by a constant ratio r. Recognising the pattern lets us jump to any term or sum thousands of terms instantly.",
      process_explanation: `Arithmetic Progression (AP):
• General form: a, a+d, a+2d, …
• nth term: Tₙ = a + (n−1)d
• Sum of first n terms: Sₙ = n/2 [2a + (n−1)d] = n/2 (first + last)
• Common difference d = T₂ − T₁ (any consecutive pair)

Geometric Progression (GP):
• General form: a, ar, ar², …
• nth term: Tₙ = arⁿ⁻¹
• Sum of n terms (r ≠ 1): Sₙ = a(rⁿ − 1)/(r − 1)
• Sum of infinite GP (|r| < 1): S∞ = a/(1−r)
• Common ratio r = T₂/T₁`,
      worked_example: `Example 1 (AP): Find 15th term of 3, 7, 11, …
d = 4, a = 3. T₁₅ = 3 + 14×4 = 3 + 56 = 59.

Example 2 (AP sum): Sum of first 20 terms of 5, 8, 11, …
a=5, d=3. S₂₀ = 20/2 [2(5) + 19(3)] = 10[10+57] = 10×67 = 670.

Example 3 (GP): Find 6th term of 2, 6, 18, …
r = 3, a = 2. T₆ = 2 × 3⁵ = 2 × 243 = 486.

Example 4 (infinite GP): Sum of 1 + 1/2 + 1/4 + …
a=1, r=1/2. S∞ = 1/(1−1/2) = 1/(1/2) = 2.`,
      common_misconceptions: `• Using n instead of (n−1) in Tₙ formula: Tₙ = a + (n−1)d, NOT a + nd.
• Confusing d (difference) with r (ratio): AP uses addition, GP uses multiplication.
• Sum formula confusion: the second form Sₙ = n/2(first + last) only works when the last term is known.
• Assuming all sequences are AP or GP — some are neither.`,
      shortcuts_and_tricks: `• Three terms in AP: use a−d, a, a+d (middle term is always the average).
• Three terms in GP: use a/r, a, ar (middle term squared = product of outer terms).
• Sum of first n natural numbers = n(n+1)/2 — a special AP with a=1, d=1.
• To find n when Tₙ is known: solve n = (Tₙ − a)/d + 1.`,
      key_takeaway: "AP: nth term Tₙ = a+(n−1)d; sum Sₙ = n/2[2a+(n−1)d]. GP: nth term Tₙ = arⁿ⁻¹; infinite sum S∞ = a/(1−r) for |r|<1. Identify the type first, then apply the correct formula.",
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  for (const topic of topics) {
    await NcertTopicContent.findOneAndUpdate(
      { topicId: topic.topicId },
      topic,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${topic.topicId}: ${topic.name}`);
  }

  console.log(`\nSeeded ${topics.length} NcertTopicContent entries for Class 9 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
