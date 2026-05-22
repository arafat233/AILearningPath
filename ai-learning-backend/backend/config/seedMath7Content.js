/**
 * CBSE Class 7 Mathematics — NcertTopicContent seed
 * Textbook: "Ganita Prakash Grade 7 Part I + Part II" (NCERT 2026)
 * 15 chapters, flat teaching_content format. Safe to re-run.
 * Usage: node config/seedMath7Content.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

dotenv.config();

const topics = [
  {
    topicId: "math7_ch1",
    name: "Large Numbers Around Us",
    subject: "Mathematics",
    chapterNumber: 1,
    teaching_content: {
      intuition: "India uses its own number system where groups of digits are named differently from the international system. After a thousand comes ten-thousand, then one lakh (1,00,000), then ten-lakh, then one crore (1,00,00,000). Understanding large numbers helps us make sense of population figures, distances, and budgets we encounter every day.",
      process_explanation: "Place value in the Indian system: units, tens, hundreds, thousands, ten-thousands, lakhs, ten-lakhs, crores. Commas are placed after 3 digits from the right, then after every 2 digits: 1,23,45,678. To read, start from the leftmost group and name each group. For rounding to the nearest lakh, look at the ten-thousands digit: ≥5 rounds up, <5 rounds down.",
      worked_example: "Write 78,23,456 in words and round to the nearest lakh.\nStep 1: Group digits from right — 78,23,456 → 7 crores, 8 ten-lakhs, 2 lakhs, 3 ten-thousands, 4 hundreds, 5 tens, 6 units → 'Seven crore eighty-two lakh thirty-four hundred fifty-six' → Seventy-eight lakh twenty-three thousand four hundred fifty-six.\nStep 2: Nearest lakh — ten-thousands digit is 2 (<5), so round down → 78,00,000.",
      common_misconceptions: "Many students confuse the Indian and International systems. In International: thousand → million (10 lakh) → billion (100 crore). In Indian: thousand → lakh → crore. Do not use million/billion when asked for Indian system.",
      shortcuts_and_tricks: "Quick lakh check: a lakh has 6 digits (1,00,000). A crore has 8 digits (1,00,00,000). Count digits to identify the magnitude instantly.",
      key_takeaway: "In the Indian place value system, 1 lakh = 1,00,000 and 1 crore = 1,00,00,000. Commas separate groups of 3 (from right), then 2s. Rounding uses the digit one place to the right of the target place.",
    },
  },
  {
    topicId: "math7_ch2",
    name: "Arithmetic Expressions",
    subject: "Mathematics",
    chapterNumber: 2,
    teaching_content: {
      intuition: "When we write '3 + 4 × 2', does it equal 14 (doing left to right) or 11 (doing multiplication first)? Mathematicians agreed on a universal order called BODMAS so every expression has exactly one value. This prevents ambiguity in science, engineering, and everyday calculations.",
      process_explanation: "BODMAS order: Brackets → Orders (powers/roots) → Division → Multiplication → Addition → Subtraction. Division and Multiplication have equal priority — evaluate left to right. Same for Addition and Subtraction. Evaluate innermost brackets first if nested. An expression has a single value; an equation has a solution.",
      worked_example: "Evaluate: 24 ÷ (2 + 4) × 3 − 1\nStep 1 (Brackets): 2 + 4 = 6 → 24 ÷ 6 × 3 − 1\nStep 2 (Division, left to right): 24 ÷ 6 = 4 → 4 × 3 − 1\nStep 3 (Multiplication): 4 × 3 = 12 → 12 − 1\nStep 4 (Subtraction): 12 − 1 = 11\nAnswer: 11",
      common_misconceptions: "Students often compute left to right ignoring BODMAS. 2 + 3 × 4 = 14 (NOT 20). Also remember: when two operations have equal priority (like × and ÷), work left to right.",
      shortcuts_and_tricks: "Use the mnemonic 'Big Old Dragons Must Always Sleep' or simply 'BODMAS'. Add extra brackets around the parts you are evaluating to avoid confusion.",
      key_takeaway: "BODMAS ensures every arithmetic expression has a unique value: Brackets first, then Division/Multiplication (left to right), then Addition/Subtraction (left to right).",
    },
  },
  {
    topicId: "math7_ch3",
    name: "A Peek Beyond the Point",
    subject: "Mathematics",
    chapterNumber: 3,
    teaching_content: {
      intuition: "A ruler can measure centimetres, but a screw might be 2.7 cm long — between 2 and 3. Decimals let us express parts of a whole using the same base-10 system we already know. Each place to the right of the decimal point is one-tenth of the previous place.",
      process_explanation: "Place value: the digit after the decimal point represents tenths (1/10), next is hundredths (1/100), next thousandths (1/1000). To add or subtract decimals: align decimal points, fill in trailing zeros so both numbers have the same decimal places, then add/subtract as whole numbers, keeping the decimal point in place.",
      worked_example: "Add 3.7 + 12.45\nStep 1 — Align:   3.70\n               +12.45\nStep 2 — Add right to left: 0+5=5, 7+4=11 (write 1 carry 1), 3+2+1=6, 1 → 16.15\nAnswer: 16.15",
      common_misconceptions: "Students sometimes align the last digits instead of the decimal points, giving wrong answers. Always write 3.7 as 3.70 when adding with 12.45 to prevent digit-alignment errors.",
      shortcuts_and_tricks: "Trailing zeros after the decimal point do not change the value: 3.7 = 3.70 = 3.700. Use this to make all numbers have the same number of decimal places before operating.",
      key_takeaway: "Decimals extend the place value system: tenths = 0.1, hundredths = 0.01. Always align decimal points when adding or subtracting.",
    },
  },
  {
    topicId: "math7_ch4",
    name: "Letter-Numbers",
    subject: "Mathematics",
    chapterNumber: 4,
    teaching_content: {
      intuition: "If Shabnam is always 3 years older than Aftab, we cannot write this as a single number — it changes as Aftab's age changes. By using a letter 'a' for Aftab's age, we write Shabnam's age as 'a + 3'. This one expression works for ALL possible values of a. That is the power of algebra.",
      process_explanation: "A variable is a letter that stands for an unknown or changing number. An algebraic expression combines variables and constants using operations (e.g. 2x + 5). To evaluate, substitute the given value of the variable and compute using BODMAS. Expressions can also represent patterns: e.g. the nth odd number is 2n−1.",
      worked_example: "If x = 4, find the value of 3x² − 2x + 1.\nStep 1: Substitute x=4 → 3(4²) − 2(4) + 1\nStep 2: 4² = 16 → 3×16 − 8 + 1\nStep 3: 48 − 8 + 1 = 41\nAnswer: 41",
      common_misconceptions: "Students confuse 2x (2 times x) with x² (x squared). Also, 'ab' means a multiplied by b, not a followed by b as a two-digit number.",
      shortcuts_and_tricks: "Always substitute with parentheses: replace x with (value). This prevents sign errors, e.g. if x = −3, then x² = (−3)² = 9, not −9.",
      key_takeaway: "A variable letter represents a number that can vary. An expression like 3x + 5 has different values for different values of x. Evaluate by substituting the value into the expression.",
    },
  },
  {
    topicId: "math7_ch5",
    name: "Parallel and Intersecting Lines",
    subject: "Mathematics",
    chapterNumber: 5,
    teaching_content: {
      intuition: "Railway tracks run parallel — they never meet. A road crossing them at an angle is a transversal. Angles formed at these crossings have predictable relationships. These relationships are used in architecture, engineering, and even tiling designs.",
      process_explanation: "When two lines intersect, they form 4 angles. Vertically opposite angles (across the point) are equal. Adjacent angles are supplementary (sum to 180°). When a transversal cuts parallel lines: corresponding angles are equal, alternate interior angles are equal, and co-interior (same-side interior) angles add to 180°. To prove lines parallel, check if any of these angle conditions hold.",
      worked_example: "Two parallel lines are cut by a transversal. One alternate interior angle is 65°. Find all 8 angles.\nAlternate interior angle on other side = 65° (alternate interior angles equal)\nCorresponding angles = 65°\nVertically opposite to 65° = 65°\nSupplementary angles = 180° − 65° = 115°\nSo angles are: 65°, 115°, 65°, 115° on each parallel line. Total 8 angles: four 65° and four 115°.",
      common_misconceptions: "Co-interior angles are often confused with alternate angles. Co-interior angles are on the SAME side of the transversal and ADD to 180°. Alternate angles are on OPPOSITE sides and are EQUAL.",
      shortcuts_and_tricks: "Remember 'F-angles' (corresponding, F shape), 'Z-angles' (alternate, Z shape), 'C-angles' (co-interior, C or U shape). Draw the letter to identify the angle pair.",
      key_takeaway: "Parallel lines cut by a transversal: corresponding angles equal (F), alternate angles equal (Z), co-interior angles supplementary (C/U). Vertically opposite angles are always equal.",
    },
  },
  {
    topicId: "math7_ch6",
    name: "Number Play",
    subject: "Mathematics",
    chapterNumber: 6,
    teaching_content: {
      intuition: "Numbers have fascinating hidden patterns — some can only be divided evenly by 1 and themselves (primes), while others have many factors. Divisibility rules let us check these without actually dividing, which is very useful for large numbers.",
      process_explanation: "Divisibility rules: by 2 (last digit even), by 3 (digit sum divisible by 3), by 5 (last digit 0 or 5), by 9 (digit sum divisible by 9), by 10 (last digit 0), by 11 (alternating digit sum is 0 or divisible by 11). A prime number has exactly two factors: 1 and itself. The Sieve of Eratosthenes finds all primes by eliminating multiples.",
      worked_example: "Test 1764 for divisibility by 2, 3, 9:\nBy 2: last digit 4 (even) → Yes ✓\nBy 3: 1+7+6+4 = 18, 18÷3 = 6 → Yes ✓\nBy 9: 18÷9 = 2 → Yes ✓\nSo 1764 is divisible by 2, 3, and 9.",
      common_misconceptions: "Students think if a number is divisible by 9 it must be divisible by 3 (true), but forget that divisible by 3 does NOT guarantee divisibility by 9. Example: 12 is divisible by 3 but not 9.",
      shortcuts_and_tricks: "For divisibility by 6: number must be divisible by BOTH 2 and 3. For divisibility by 12: must be divisible by BOTH 3 and 4 (not 2 and 6, since 2 and 6 are not coprime).",
      key_takeaway: "Divisibility rules offer quick checks without division. Prime numbers have exactly 2 factors. 1 is neither prime nor composite. 2 is the only even prime.",
    },
  },
  {
    topicId: "math7_ch7",
    name: "A Tale of Three Intersecting Lines",
    subject: "Mathematics",
    chapterNumber: 7,
    teaching_content: {
      intuition: "A triangle is the simplest closed shape made by three straight lines. No matter what kind of triangle you draw — tiny, huge, squished, or tall — the three angles always add up to exactly 180°. This is one of geometry's most beautiful and useful facts.",
      process_explanation: "Types by sides: equilateral (all equal), isosceles (two equal), scalene (all different). Types by angles: acute (all <90°), right (one =90°), obtuse (one >90°). Angle sum property: ∠A + ∠B + ∠C = 180°. Exterior angle theorem: an exterior angle equals the sum of the two non-adjacent interior angles. To construct an equilateral triangle with side s: draw a segment, use compass arcs of radius s from each end — intersection is the third vertex.",
      worked_example: "In triangle ABC, ∠A = 55°, ∠B = 75°. Find ∠C and the exterior angle at C.\nStep 1: ∠C = 180° − 55° − 75° = 50°\nStep 2: Exterior angle at C = 180° − 50° = 130°\nCheck using exterior angle theorem: 55° + 75° = 130° ✓",
      common_misconceptions: "Students apply the angle sum to quadrilaterals (which is 360°). Also, the exterior angle theorem works only for the exterior angle at ONE vertex, not all three simultaneously.",
      shortcuts_and_tricks: "If two angles of a triangle are known, find the third instantly: third angle = 180° − (sum of other two). For right triangles, the two acute angles always sum to 90°.",
      key_takeaway: "Sum of angles in a triangle = 180°. Exterior angle = sum of two non-adjacent interior angles. Types classified by sides (equilateral/isosceles/scalene) or angles (acute/right/obtuse).",
    },
  },
  {
    topicId: "math7_ch8",
    name: "Working with Fractions",
    subject: "Mathematics",
    chapterNumber: 8,
    teaching_content: {
      intuition: "Half of a half is a quarter — multiplying fractions gives a smaller result (when both are proper fractions). Dividing by a fraction is the same as multiplying by its flip (reciprocal). These operations appear constantly in cooking, measurement, and probability.",
      process_explanation: "Multiplication: (a/b) × (c/d) = ac/bd. Simplify by cancelling common factors before multiplying. The word 'of' in a problem means multiply: 2/3 of 15 = (2/3) × 15 = 10. Division: to divide by c/d, multiply by d/c (the reciprocal). Mixed numbers must be converted to improper fractions before operating.",
      worked_example: "Calculate: 2⅓ ÷ 1¾\nStep 1 — Convert to improper: 2⅓ = 7/3, 1¾ = 7/4\nStep 2 — Divide = multiply by reciprocal: 7/3 × 4/7\nStep 3 — Cancel 7s: 1/3 × 4/1 = 4/3\nStep 4 — Convert: 4/3 = 1⅓\nAnswer: 1⅓",
      common_misconceptions: "Students add fractions when they should multiply: 1/2 of 1/3 is NOT 1/2 + 1/3. Also, the reciprocal of 3/4 is 4/3, not 4/3 with a sign change.",
      shortcuts_and_tricks: "Cross-cancel before multiplying: in (6/7) × (14/9), cancel 6 and 9 by 3 (get 2 and 3), and cancel 7 and 14 by 7 (get 1 and 2). Result = (2×2)/(3×1) = 4/3.",
      key_takeaway: "Fraction multiplication: multiply numerators and denominators. Fraction division: multiply by the reciprocal. 'Of' means multiply. Always convert mixed numbers to improper fractions first.",
    },
  },
  {
    topicId: "math7_ch9",
    name: "Geometric Twins",
    subject: "Mathematics",
    chapterNumber: 9,
    teaching_content: {
      intuition: "Two triangles are 'twins' (congruent) if one can be placed exactly on top of the other. You don't need to measure all 6 parts (3 sides, 3 angles) — just 3 correctly chosen measurements are enough to guarantee congruence. This is the foundation of geometric proof.",
      process_explanation: "Congruence (≅) means same shape AND size. For triangles: SSS (all three sides equal), SAS (two sides and the included angle), ASA (two angles and the included side), RHS (right angle + hypotenuse + one side). CPCT: once triangles are proved congruent, all corresponding parts are equal. Order of vertices in congruence notation matters: △ABC ≅ △PQR means A↔P, B↔Q, C↔R.",
      worked_example: "In △ABC and △PQR: AB=PQ=5cm, BC=QR=7cm, ∠B=∠Q=60°. Prove congruence.\nTwo sides AB=PQ, BC=QR and included angle ∠B=∠Q — this is SAS criterion.\n∴ △ABC ≅ △PQR (SAS)\nBy CPCT: AC = PR and ∠A = ∠P.",
      common_misconceptions: "SSA (two sides and non-included angle) does NOT guarantee congruence — it can give two possible triangles. Only the four stated criteria (SSS, SAS, ASA, RHS) are valid.",
      shortcuts_and_tricks: "Check which criterion to use: if the angle given is BETWEEN the two sides → SAS. If the angle is NOT between them → may be AAS or could be invalid (SSA). When in doubt, draw a diagram.",
      key_takeaway: "Two triangles are congruent if SSS, SAS, ASA, or RHS holds. CPCT lets us conclude equality of remaining parts after proving congruence. Vertex order in △ABC ≅ △PQR is critical.",
    },
  },
  {
    topicId: "math7_ch10",
    name: "Operations with Integers",
    subject: "Mathematics",
    chapterNumber: 10,
    teaching_content: {
      intuition: "Temperature can drop below zero, bank accounts can go into debt — we need numbers less than zero. Multiplying two negatives gives a positive because 'the opposite of the opposite' is the original direction. These rules extend arithmetic to the whole number line.",
      process_explanation: "Integer multiplication sign rules: (+)×(+)=+, (−)×(−)=+, (+)×(−)=−, (−)×(+)=−. Shortcut: count negative signs — even count = positive result, odd count = negative. Division follows the same sign rules. Any integer × 0 = 0. For product of multiple integers, multiply magnitudes and apply the sign rule.",
      worked_example: "Calculate: (−3) × (−4) × (−2)\nStep 1: Magnitude = 3×4×2 = 24\nStep 2: Count negatives: 3 (odd) → negative\nAnswer: −24\nVerify: (−3)×(−4) = 12, then 12×(−2) = −24 ✓",
      common_misconceptions: "Students think −3² = 9, but actually −3² means −(3²) = −9. If you want (−3)², write parentheses explicitly. The base is 3, not −3, unless brackets enclose the negative.",
      shortcuts_and_tricks: "For division: (−24) ÷ (−6) — both negative → positive = 4. Quick check: same signs give positive, different signs give negative.",
      key_takeaway: "Multiplication/division of integers: same signs → positive result; different signs → negative result. Count negatives: even = positive, odd = negative. Always apply to magnitude first, then assign sign.",
    },
  },
  {
    topicId: "math7_ch11",
    name: "Finding Common Ground",
    subject: "Mathematics",
    chapterNumber: 11,
    teaching_content: {
      intuition: "HCF (Highest Common Factor) answers 'what is the largest equal group we can split these into?'. LCM (Lowest Common Multiple) answers 'when do two repeating events first occur together?'. These two ideas are used constantly in scheduling, tiling, and fraction arithmetic.",
      process_explanation: "HCF by prime factorisation: factorise both numbers → take common primes with LOWEST powers → multiply them. LCM by prime factorisation: take ALL primes with HIGHEST powers → multiply them. Key relation: HCF × LCM = Product of the two numbers (for two numbers only). For adding/subtracting fractions, the LCM of denominators is used as the LCD.",
      worked_example: "Find HCF and LCM of 36 and 48.\n36 = 2² × 3²\n48 = 2⁴ × 3\nHCF: common primes, lowest powers = 2² × 3 = 12\nLCM: all primes, highest powers = 2⁴ × 3² = 16 × 9 = 144\nVerify: 12 × 144 = 1728 = 36 × 48 ✓",
      common_misconceptions: "Students often mix up HCF and LCM rules. HCF uses LOWEST powers of common factors; LCM uses HIGHEST powers of ALL factors. Never use all factors for HCF or only common ones for LCM.",
      shortcuts_and_tricks: "HCF × LCM = product of two numbers. If you find HCF, get LCM instantly: LCM = (product) ÷ HCF. Much faster than full factorisation.",
      key_takeaway: "HCF = product of common prime factors with lowest powers. LCM = product of all prime factors with highest powers. HCF × LCM = a × b (for two numbers). Use HCF for 'largest group'; LCM for 'first coincidence'.",
    },
  },
  {
    topicId: "math7_ch12",
    name: "Another Peek Beyond the Point",
    subject: "Mathematics",
    chapterNumber: 12,
    teaching_content: {
      intuition: "Multiplying 2.5 × 1.3 — work out 25 × 13 = 325, then place two decimal points from the right to get 3.25. The decimal point shifts based on how many decimal digits were in the factors. This pattern connects decimal multiplication directly to whole-number multiplication.",
      process_explanation: "Multiplication: ignore decimal points, multiply as whole numbers, then count TOTAL decimal places in both factors — place that many from the right in the product. Shortcut: decimal × 10 shifts point 1 right; decimal × 0.1 shifts point 1 left. Division: decimal ÷ whole — divide as normal and align decimal in quotient. Decimal ÷ decimal — multiply both by 10/100 until divisor is a whole number, then divide.",
      worked_example: "Calculate 3.14 × 0.6\nStep 1: 314 × 6 = 1884\nStep 2: Decimal places — 3.14 has 2, 0.6 has 1 → total 3 places\nStep 3: Place decimal: 1.884\nAnswer: 1.884\n\nCalculate 7.2 ÷ 0.4:\nMultiply both by 10: 72 ÷ 4 = 18\nAnswer: 18",
      common_misconceptions: "Students count decimal places in only one factor instead of both. In 3.14 × 0.6, both sets of decimal digits count: 2 + 1 = 3 decimal places in product.",
      shortcuts_and_tricks: "To divide by a decimal, convert to division by a whole number: 4.5 ÷ 0.15 → multiply both by 100 → 450 ÷ 15 = 30.",
      key_takeaway: "Decimal multiplication: multiply as whole numbers, then place decimal point based on total decimal digits. Decimal division: convert divisor to whole number by multiplying both by 10/100/1000.",
    },
  },
  {
    topicId: "math7_ch13",
    name: "Connecting the Dots",
    subject: "Mathematics",
    chapterNumber: 13,
    teaching_content: {
      intuition: "Data is everywhere — scores, temperatures, distances. We summarise data using single numbers: the mean (average), the median (middle), or the mode (most common). Each tells a different story. A class average can hide the fact that half the class scored very low — statistics helps us see through such situations.",
      process_explanation: "Mean = (sum of all values) ÷ (number of values). Median: arrange in ascending order; if odd count, median is the middle value; if even count, median = average of the two middle values. Mode = value that appears most often (can be multiple or none). Range = maximum − minimum. Bar graphs and pictographs display frequencies — read axis labels and scale carefully.",
      worked_example: "Data: 4, 7, 2, 9, 7, 5, 3\nStep 1 — Sort: 2, 3, 4, 5, 7, 7, 9\nMean: (2+3+4+5+7+7+9)/7 = 37/7 ≈ 5.29\nMedian: 7 values → middle (4th) = 5\nMode: 7 (appears twice)\nRange: 9−2 = 7",
      common_misconceptions: "Students often pick the middle position without sorting first. Always SORT the data before finding the median. Also, the mean is not always a whole number.",
      shortcuts_and_tricks: "For median with even number of data points: average the two middle values. Example: data 3,5,7,9 → median = (5+7)/2 = 6 (not 5 or 7).",
      key_takeaway: "Mean = sum/count. Median = middle value after sorting. Mode = most frequent. Always sort before finding median. Range = max − min gives the spread of data.",
    },
  },
  {
    topicId: "math7_ch14",
    name: "Constructions and Tilings",
    subject: "Mathematics",
    chapterNumber: 14,
    teaching_content: {
      intuition: "Using only a compass and ruler (no protractor), we can construct exact geometric figures — perpendicular bisectors, angle bisectors, and more. Tessellations (tilings) use geometry to cover a plane without gaps or overlaps, as seen in bathroom tiles, honeycomb, and Islamic art.",
      process_explanation: "Perpendicular bisector of segment AB: open compass to more than half AB; draw arcs above and below from A and B; the two intersection points define the perpendicular bisector. Angle bisector: draw arc from vertex, then equal arcs from the two intersection points on the sides. For tessellations: only regular polygons whose interior angle divides 360° evenly can tile alone — equilateral triangle (60°, 6 fit), square (90°, 4 fit), regular hexagon (120°, 3 fit).",
      worked_example: "Construct the perpendicular bisector of a 6 cm segment AB.\nStep 1: Set compass to ~4 cm (more than half of 6 cm).\nStep 2: Draw arcs above and below AB from A.\nStep 3: Without changing compass, draw arcs from B.\nStep 4: Label intersection points P (above) and Q (below). Line PQ is the perpendicular bisector.\nPQ bisects AB at 90° and each half = 3 cm.",
      common_misconceptions: "Students use a protractor for constructions that require only compass and ruler — this is not acceptable. The construction must work purely with compass arcs. Also, the compass opening must remain the same when drawing the second pair of arcs in the perpendicular bisector construction.",
      shortcuts_and_tricks: "For perpendicular bisector: any two points equidistant from both endpoints of a segment lie on the perpendicular bisector. Use this property to check your construction.",
      key_takeaway: "Perpendicular bisector: arcs from both endpoints at equal radius, connect intersection points. Angle bisector: arc from vertex, equal arcs from sides. Regular tessellations: only triangle, square, hexagon tile the plane alone.",
    },
  },
  {
    topicId: "math7_ch15",
    name: "Finding the Unknown",
    subject: "Mathematics",
    chapterNumber: 15,
    teaching_content: {
      intuition: "If a weighing scale is balanced and you add the same weight to both sides, it stays balanced. Equations work the same way — any operation done to both sides preserves equality. This 'balance' model lets us isolate the unknown and find its value.",
      process_explanation: "A simple equation has one variable and one solution. To solve: isolate the variable by performing inverse operations on both sides. Transposition: moving a term from one side changes its sign (+ becomes −, × becomes ÷). Steps: (1) bring variable terms to one side; (2) bring constants to the other; (3) divide both sides by the coefficient of the variable. Always verify by substituting back into the original equation.",
      worked_example: "Solve: 3x − 5 = 2x + 7\nStep 1: Bring x terms left: 3x − 2x = 7 + 5\nStep 2: Simplify: x = 12\nVerify: LHS = 3(12)−5 = 31, RHS = 2(12)+7 = 31 ✓\nAnswer: x = 12",
      common_misconceptions: "When transposing, students forget to change the sign. If 2x + 5 = 11, moving 5 to the right gives 2x = 11 − 5 = 6 (not 11 + 5). The sign always changes when crossing the equality sign.",
      shortcuts_and_tricks: "Always verify your solution by substituting back. If LHS = RHS, the solution is correct. If they differ, recheck your transposition steps.",
      key_takeaway: "Solve equations by keeping balance: same operation on both sides. Transposition: moving a term across = changes its sign. Always verify by substituting the solution back into the original equation.",
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  for (const t of topics) {
    await NcertTopicContent.findOneAndUpdate(
      { topicId: t.topicId },
      t,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${t.topicId}: ${t.name}`);
  }

  console.log(`\nSeeded ${topics.length} NcertTopicContent documents for Class 7 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
