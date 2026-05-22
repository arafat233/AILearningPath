/**
 * CBSE Class 8 Mathematics — NcertTopicContent seed
 * Textbook: "Ganita Prakash Grade 8 Part I + Part II" (NCERT 2026)
 * 14 chapters, one document per chapter. Safe to re-run (upserts on topicId).
 * Usage: node config/seedMath8Content.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

dotenv.config();

const topics = [
  {
    topicId: "math8_ch1",
    subject: "Mathematics",
    chapterNumber: 1,
    name: "A Square and A Cube",
    teaching_content: {
      intuition: "Perfect squares come from the area of a square: a square with side 5 has area 25, so 25 is a perfect square. The locker puzzle shows this beautifully — only lockers whose numbers are perfect squares (1, 4, 9, 16, 25…) are left open, because perfect squares are the only numbers with an ODD count of factors (each factor pairs up except when a factor multiplied by itself gives the number). Cubes extend this idea to 3D: a cube with side 3 has volume 27, so 27 is a perfect cube.",
      process_explanation: `Square roots and cube roots step by step:

FINDING SQUARE ROOT by prime factorisation:
1. Find the prime factorisation of the number.
2. Pair up identical prime factors.
3. Take one factor from each pair.
4. Multiply those to get the square root.
Example: √324 → 324 = 2²×3⁴ → √324 = 2¹×3² = 2×9 = 18.

FINDING SQUARE ROOT by long division:
1. Group digits in pairs from right (for decimals: from decimal point outward).
2. Find largest integer whose square ≤ first group.
3. Subtract, bring down next pair; double current quotient as new divisor prefix.
4. Repeat until done.

IDENTIFYING PERFECT SQUARES:
• Unit digit can only be 0, 1, 4, 5, 6, or 9 (never 2, 3, 7, 8).
• The number of zeros at the end must be even.

CUBE ROOTS by prime factorisation:
1. Find the prime factorisation.
2. Group identical primes in triples.
3. Take one factor from each triple and multiply.
Example: ∛1728 → 1728 = 2⁶×3³ → ∛1728 = 2²×3 = 12.`,
      worked_example: `Example 1: Is 1764 a perfect square? If yes, find its square root.
Unit digit of 1764 is 4 ✓ (could be a perfect square).
Prime factorisation: 1764 = 2² × 3² × 7² = (2×3×7)².
Yes, 1764 is a perfect square. √1764 = 2×3×7 = 42.

Example 2: Find the smallest number by which 2592 must be multiplied to make it a perfect square.
2592 = 2⁵ × 3⁴.
The factor 2 appears an odd number of times (5). To make all exponents even, multiply by 2.
Answer: multiply by 2 → 2592 × 2 = 5184 = 72².

Example 3: Find ∛13824.
13824 = 2⁹ × 3³ = (2³)³ × 3³ = (8×3)³ = 24³.
∛13824 = 24.

Example 4 (CBSE pattern): Find the smallest number by which 675 must be divided to make it a perfect cube.
675 = 3³ × 5². Factor 5 appears only twice (not a multiple of 3). Divide by 5²=25.
675 ÷ 25 = 27 = 3³. Answer: divide by 25.`,
      common_misconceptions: `• "Every number ending in 1 or 4 is a perfect square" — FALSE. 11 ends in 1 but is not a perfect square. Unit digit is necessary but not sufficient.
• "√(a+b) = √a + √b" — COMPLETELY WRONG. √(9+16) = √25 = 5, not 3+4=7.
• "The square root of a negative number is the negative of the square root" — square roots of negative numbers do not exist in real numbers.
• Confusing square root with halving: √100 = 10, NOT 50.
• For cube roots: ∛(−8) = −2 (cube roots of negative numbers DO exist and are negative).`,
      shortcuts_and_tricks: `• Squares to memorise: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36, 7²=49, 8²=64, 9²=81, 10²=100, 11²=121, 12²=144, 13²=169, 14²=196, 15²=225, 20²=400, 25²=625, 30²=900.
• Cubes to memorise: 1³=1, 2³=8, 3³=27, 4³=64, 5³=125, 6³=216, 7³=343, 8³=512, 9³=729, 10³=1000.
• Quick check for perfect square: if any prime factor has an odd exponent → NOT a perfect square.
• Sum of first n odd numbers = n² (so sum 1+3+5+7+9 = 5² = 25).
• Pythagorean triplet with smallest member m (odd): (m, (m²−1)/2, (m²+1)/2).`,
      key_takeaway: "A perfect square has every prime factor appearing an even number of times; a perfect cube has every prime factor in multiples of three. Square roots pair up prime factors; cube roots triple them up.",
    },
  },

  {
    topicId: "math8_ch2",
    subject: "Mathematics",
    chapterNumber: 2,
    name: "Power Play",
    teaching_content: {
      intuition: "Fold a piece of paper once — you get 2 layers. Fold again — 4 layers. Fold 10 times — 2¹⁰ = 1024 layers! That is the power of exponents: a small number of steps produces astronomically large results. Powers let us write and work with very large numbers (like the distance from Earth to the Sun: 1.5 × 10¹¹ m) and very small numbers (like the size of an atom: 1 × 10⁻¹⁰ m) without writing endless zeros.",
      process_explanation: `LAWS OF EXPONENTS — applied step by step:

1. PRODUCT LAW: aᵐ × aⁿ = aᵐ⁺ⁿ (same base → add exponents)
   Example: 3⁴ × 3² = 3⁶ = 729.

2. QUOTIENT LAW: aᵐ ÷ aⁿ = aᵐ⁻ⁿ (same base → subtract exponents)
   Example: 5⁷ ÷ 5³ = 5⁴ = 625.

3. POWER OF A POWER: (aᵐ)ⁿ = aᵐⁿ (multiply exponents)
   Example: (2³)⁴ = 2¹² = 4096.

4. POWER OF A PRODUCT: (ab)ⁿ = aⁿbⁿ
   Example: (2×3)⁴ = 2⁴×3⁴ = 16×81 = 1296.

5. POWER OF A QUOTIENT: (a/b)ⁿ = aⁿ/bⁿ
   Example: (2/3)³ = 8/27.

6. ZERO EXPONENT: a⁰ = 1 for any a ≠ 0 (because aⁿ ÷ aⁿ = aⁿ⁻ⁿ = a⁰ = 1).

7. NEGATIVE EXPONENT: a⁻ⁿ = 1/aⁿ
   Example: 2⁻³ = 1/8; (2/3)⁻² = (3/2)² = 9/4.

STANDARD FORM (Scientific Notation):
• Write as a × 10ⁿ where 1 ≤ a < 10.
• Move decimal point: right → positive n; left → negative n.
• 0.000045 = 4.5 × 10⁻⁵ (decimal moved 5 places right).
• 3,240,000 = 3.24 × 10⁶ (decimal moved 6 places left).`,
      worked_example: `Example 1: Simplify (2³ × 3² × 4) / (4² × 3).
= (8 × 9 × 4) / (16 × 3) = 288 / 48 = 6.
Or using laws: 2³ × 3² × 2² / (2⁴ × 3) = 2³⁺²⁻⁴ × 3²⁻¹ = 2¹ × 3¹ = 6.

Example 2: Find the value of (2/3)⁻³ × (3/4)⁰ × (4/5)².
= (3/2)³ × 1 × (4/5)²
= 27/8 × 16/25
= 432/200 = 54/25.

Example 3: Express 0.000007 in standard form.
0.000007 = 7 × 10⁻⁶ (decimal moved 6 places right).

Example 4 (CBSE pattern): Simplify and express as a power of 3:
(3⁴ × 3⁻²) ÷ 3⁵ = 3⁴⁺⁽⁻²⁾⁻⁵ = 3⁴⁻²⁻⁵ = 3⁻³ = 1/27.`,
      common_misconceptions: `• "a⁻ⁿ means the number is negative" — WRONG. 2⁻³ = 1/8 which is positive.
• "aᵐ × aⁿ = aᵐⁿ" — WRONG. Same base and MULTIPLICATION means ADD exponents: aᵐ⁺ⁿ. Multiply exponents only for (aᵐ)ⁿ.
• "0⁰ = 1" — this is actually indeterminate/undefined (0⁰ is a special case — don't apply the rule a⁰=1 when a=0).
• "(a+b)ⁿ = aⁿ + bⁿ" — COMPLETELY WRONG. (2+3)² = 25, but 2²+3² = 13.
• Forgetting that the law applies only when the BASE is the same: 2³ × 3⁴ cannot be simplified using the product law.`,
      shortcuts_and_tricks: `• (−1)ⁿ = 1 if n is even; (−1)ⁿ = −1 if n is odd.
• To compare 2⁵⁰ and 5²⁰: express both as powers of 10 using logs, OR estimate: 2¹⁰ ≈ 10³, so 2⁵⁰ = (2¹⁰)⁵ ≈ 10¹⁵; 5²⁰ = (5⁴)⁵ = 625⁵ ≈ (10³)⁵ × 0.625⁵ < 10¹⁵ → 2⁵⁰ > 5²⁰.
• Flipping a negative exponent: a⁻ⁿ = 1/aⁿ and (a/b)⁻ⁿ = (b/a)ⁿ.
• Standard form: count decimal places moved; right means negative exponent.`,
      key_takeaway: "The six laws of exponents (product, quotient, power of power, power of product, zero exponent, negative exponent) allow simplification of complex expressions. Scientific notation expresses any number as a × 10ⁿ (1 ≤ a < 10), making very large and very small quantities manageable.",
    },
  },

  {
    topicId: "math8_ch3",
    subject: "Mathematics",
    chapterNumber: 3,
    name: "A Story of Numbers",
    teaching_content: {
      intuition: "Every civilisation needed to count — but the HOW varied wildly. Early humans used fingers, pebbles, notches on bones. The Babylonians developed a positional system based on 60 (which is why we still have 60 seconds and 60 minutes). But it was Indian mathematicians who gave the world the most powerful tool: zero and a base-10 place-value system, allowing ten symbols to represent every number ever needed.",
      process_explanation: `KEY NUMBER SYSTEMS through history:

1. TALLY MARKS (prehistoric): vertical strokes, grouped in 5s. Still used today for quick counting.

2. EGYPTIAN HIEROGLYPHICS (∼3000 BCE): different symbols for 1, 10, 100, 1000, etc. Additive — just write symbols for each value and add. No place value, no zero.

3. BABYLONIAN CUNEIFORM (∼2000 BCE): base-60 positional system using just two symbols (wedge for 1, chevron for 10). Positional — same symbol means different value based on position. No zero symbol (gaps caused ambiguity).

4. ROMAN NUMERALS (∼300 BCE): I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Subtractive notation: IV=4 (one before five), IX=9. Still used for clock faces, chapters, events.

5. HINDU-ARABIC PLACE-VALUE SYSTEM (India, ∼5th century CE): ten digits (0–9), position determines value, zero as a digit. Brahmagupta (628 CE) formulated rules for computing with zero. This spread via Arab scholars to Europe.

BINARY NUMBERS (Base 2):
• Digits: 0 and 1 only.
• Place values: …16, 8, 4, 2, 1.
• Convert decimal to binary: repeatedly divide by 2, read remainders bottom-up.
  Example: 13 → 13÷2=6R1, 6÷2=3R0, 3÷2=1R1, 1÷2=0R1 → 1101₂.
• Convert binary to decimal: 1101₂ = 1×8 + 1×4 + 0×2 + 1×1 = 13.`,
      worked_example: `Example 1: Write 1947 in Roman numerals.
1947 = 1000 + 900 + 40 + 7
= M + CM + XL + VII = MCMXLVII.

Example 2: Convert 25 to binary.
25 ÷ 2 = 12 R 1
12 ÷ 2 = 6  R 0
6  ÷ 2 = 3  R 0
3  ÷ 2 = 1  R 1
1  ÷ 2 = 0  R 1
Read remainders bottom-up: 11001₂.
Check: 16 + 8 + 0 + 0 + 1 = 25 ✓

Example 3: Convert 101101₂ to decimal.
= 1×32 + 0×16 + 1×8 + 1×4 + 0×2 + 1×1
= 32 + 8 + 4 + 1 = 45.

Example 4: Why can't IIII be used for 4 in standard Roman numerals?
Standard Roman numeral system uses subtractive notation: IV (one before five = 4). IIII was used in older texts and on clock faces, but standard convention requires IV.`,
      common_misconceptions: `• "All ancient number systems are primitive" — The Babylonian base-60 system was sophisticated and positional; its legacy (degrees, minutes, seconds) survives today.
• "Roman numerals can go on forever" — they become unwieldy for large numbers; MMMCMXCIX = 3999 is the practical maximum without extensions.
• "Zero was always obvious" — zero as a number (not just a placeholder) was a genuine intellectual breakthrough; Brahmagupta was one of the first to define rules for arithmetic with zero.
• "Binary is hard" — it uses the same place-value logic as base 10, just with powers of 2 instead of powers of 10.`,
      shortcuts_and_tricks: `• Roman numeral subtractive rule: a smaller value BEFORE a larger value means subtract.
  Valid: IV(4), IX(9), XL(40), XC(90), CD(400), CM(900).
  Invalid: IC, VX, etc. — only one smaller before one larger.
• Binary to decimal: write out 1, 2, 4, 8, 16, 32 under each bit from right, multiply by bit, sum up.
• Decimal to binary shortcut: subtract largest power of 2 that fits, record 1; otherwise 0.
• Base-60 legacy: a full circle has 360° = 6 × 60 (Babylonian influence on ancient Greek astronomy).`,
      key_takeaway: "Number representation evolved from tally marks to sophisticated positional systems. The Hindu-Arabic base-10 system with zero — India's greatest mathematical gift to the world — enables any number to be written with just 10 symbols, making arithmetic efficient and universally accessible.",
    },
  },

  {
    topicId: "math8_ch4",
    subject: "Mathematics",
    chapterNumber: 4,
    name: "Quadrilaterals",
    teaching_content: {
      intuition: "A quadrilateral is any closed shape with 4 sides. The word comes from Latin: 'quadri' (four) + 'latus' (side). The family is rich — rectangles, squares, parallelograms, rhombuses, trapeziums, kites — each with its own special set of properties about side lengths, angles, and diagonals. Every quadrilateral, no matter how irregular, has angles summing to 360° because it can always be split into two triangles (each 180°).",
      process_explanation: `ANGLE SUM PROPERTY:
Any quadrilateral ABCD: ∠A + ∠B + ∠C + ∠D = 360°.
Proof: Draw diagonal AC, splitting into triangles ABC and ACD.
Each triangle has angle sum 180°, so total = 360°.

PARALLELOGRAM PROPERTIES (applies to rectangle, rhombus, square):
• Opposite sides are equal and parallel: AB = CD, BC = AD, AB ∥ CD, BC ∥ AD.
• Opposite angles are equal: ∠A = ∠C, ∠B = ∠D.
• Adjacent angles are supplementary: ∠A + ∠B = 180°.
• Diagonals bisect each other: diagonals cut each other at midpoints.

SPECIAL PARALLELOGRAMS:
Rectangle: all angles 90°, diagonals equal.
Rhombus: all sides equal, diagonals perpendicular bisectors of each other.
Square: all sides equal AND all angles 90°; diagonals equal AND perpendicular.

TRAPEZIUM: exactly one pair of parallel sides.
• Angles on the same leg are supplementary (co-interior angles).
• Isosceles trapezium: non-parallel sides equal; base angles equal; diagonals equal.

KITE: two pairs of adjacent equal sides.
• One diagonal (between the unequal vertices) bisects the other at 90°.
• One pair of opposite angles are equal (the angles between unequal sides).`,
      worked_example: `Example 1: In parallelogram ABCD, ∠A = 70°. Find all angles.
∠C = ∠A = 70° (opposite angles).
∠B = 180° − 70° = 110° (adjacent angles supplementary).
∠D = ∠B = 110°.

Example 2: The diagonals of a rhombus are 16 cm and 12 cm. Find the side.
Half-diagonals: 8 cm and 6 cm. These form legs of a right triangle.
Side = √(8² + 6²) = √(64 + 36) = √100 = 10 cm.

Example 3: In quadrilateral PQRS, ∠P = 80°, ∠Q = 110°, ∠R = 95°. Find ∠S.
∠P + ∠Q + ∠R + ∠S = 360°.
80 + 110 + 95 + ∠S = 360.
∠S = 360 − 285 = 75°.

Example 4: Find the area of a trapezium with parallel sides 8 cm and 5 cm, height 6 cm.
Area = ½ × (8 + 5) × 6 = ½ × 13 × 6 = 39 cm².`,
      common_misconceptions: `• "A square is not a rectangle" — FALSE. A square satisfies all properties of a rectangle (4 right angles, opposite sides equal) — it is a special rectangle.
• "The height of a parallelogram is the slant side" — WRONG. Height is the PERPENDICULAR distance between parallel sides.
• "All rhombuses are squares" — FALSE. A rhombus has all equal sides but angles need not be 90°; a square additionally requires 90° angles.
• "Diagonals of a rectangle are perpendicular" — WRONG. Rectangle diagonals are equal and bisect each other, but they are not perpendicular (unless it's a square).`,
      shortcuts_and_tricks: `• Hierarchy trick: Square is a rhombus (all sides equal) AND a rectangle (all angles 90°).
• For any parallelogram: sum of squares of diagonals = 2 × (sum of squares of sides).
• Rhombus area: if you know diagonals, use ½d₁d₂ — no need for height.
• Trapezium median (mid-segment): connects midpoints of non-parallel sides = ½(sum of parallel sides).
• To verify if a quadrilateral is a parallelogram: check if diagonals bisect each other.`,
      key_takeaway: "All quadrilaterals have angle sum 360°. Parallelograms (including rectangles, rhombuses, and squares) have equal opposite sides, equal opposite angles, supplementary adjacent angles, and mutually bisecting diagonals. Each special type adds further constraints on angles or side lengths.",
    },
  },

  {
    topicId: "math8_ch5",
    subject: "Mathematics",
    chapterNumber: 5,
    name: "Number Play",
    teaching_content: {
      intuition: "Numbers have hidden patterns waiting to be discovered. Why can you always tell if 2547 is divisible by 9 just by adding its digits? (2+5+4+7=18, divisible by 9 → yes!). Why is 2 the only even prime? Why can every odd number be written as a sum of two consecutive integers but powers of 2 cannot be? Number theory reveals the structure beneath arithmetic — and these patterns have real applications from cryptography to error-checking codes.",
      process_explanation: `DIVISIBILITY RULES:
• By 2: last digit is even (0,2,4,6,8).
• By 3: sum of all digits is divisible by 3.
• By 4: last two digits form a number divisible by 4.
• By 5: last digit is 0 or 5.
• By 6: divisible by both 2 AND 3.
• By 8: last three digits form a number divisible by 8.
• By 9: sum of all digits is divisible by 9.
• By 10: last digit is 0.
• By 11: alternating sum of digits (from left) is 0 or divisible by 11.
  Example: 29876 → 2−9+8−7+6 = 0 ✓ → divisible by 11.

HCF and LCM by PRIME FACTORISATION:
Step 1: Write prime factorisation of each number.
Step 2: HCF = product of LOWEST powers of COMMON primes.
Step 3: LCM = product of HIGHEST powers of ALL primes.
Example: HCF and LCM of 36 and 60.
  36 = 2² × 3²;  60 = 2² × 3 × 5.
  HCF = 2² × 3 = 12;  LCM = 2² × 3² × 5 = 180.
  Check: 12 × 180 = 2160 = 36 × 60 ✓.

CONSECUTIVE NUMBER SUMS:
• Sum of ANY 2 consecutive integers = odd number.
• Sum of ANY 3 consecutive integers is divisible by 3 (middle × 3).
• A number can be written as a sum of consecutive positive integers if and only if it is NOT a power of 2.`,
      worked_example: `Example 1: Test if 7128 is divisible by 8.
Last 3 digits: 128. 128 ÷ 8 = 16. Yes, 7128 is divisible by 8.

Example 2: Find HCF and LCM of 84 and 120.
84 = 2² × 3 × 7.
120 = 2³ × 3 × 5.
HCF = 2² × 3 = 12.
LCM = 2³ × 3 × 5 × 7 = 840.
Verify: 12 × 840 = 10080 = 84 × 120 ✓.

Example 3: The HCF of two numbers is 18 and their LCM is 360. One number is 72. Find the other.
Other number = (HCF × LCM) / first number = (18 × 360) / 72 = 6480 / 72 = 90.

Example 4 (digit puzzle using algebra): A two-digit number is 4 times the sum of its digits. If 27 is added to it, the digits reverse. Find the number.
Let digits be a (tens) and b (units). Number = 10a + b.
Condition 1: 10a + b = 4(a + b) → 6a = 3b → b = 2a.
Condition 2: 10a + b + 27 = 10b + a → 9a − 9b = −27 → b − a = 3.
From b = 2a and b − a = 3: a = 3, b = 6. Number = 36.`,
      common_misconceptions: `• "1 is a prime number" — FALSE. By definition, primes have exactly 2 factors (1 and itself); 1 has only 1 factor.
• "HCF is always smaller than both numbers" — TRUE, but students sometimes confuse HCF and LCM and choose the larger value for HCF.
• "Divisibility by 6 = check last digit" — WRONG. Must check BOTH: even AND sum of digits divisible by 3.
• "Any number that is divisible by 9 is divisible by 3" — TRUE. But NOT vice versa (e.g., 12 is divisible by 3 but not 9).
• "HCF × LCM = product" works only for TWO numbers, not three or more.`,
      shortcuts_and_tricks: `• Divisibility by 11: pair digits from right, take difference of sums of odd-position and even-position digits.
• Quick HCF: if one number divides the other, HCF = smaller number.
• LCM of consecutive integers n and (n+1) = n(n+1) since HCF(n,n+1) = 1.
• A perfect square has ALL prime factors with even exponents → even number of factors → locker stays closed (except 1, which toggles once).
• LCM useful for: "when do two events coincide again?" (e.g., buses arriving every 12 min and 18 min → LCM(12,18) = 36 min).`,
      key_takeaway: "Divisibility rules allow instant testing without long division. HCF (greatest common divisor) is built from the lowest powers of common prime factors; LCM uses highest powers of all factors. Their product always equals the product of the two original numbers.",
    },
  },

  {
    topicId: "math8_ch6",
    subject: "Mathematics",
    chapterNumber: 6,
    name: "We Distribute, Yet Things Multiply",
    teaching_content: {
      intuition: "When you buy 5 notebooks at ₹12 each, you don't compute 5 × (10 + 2) — you just know 5×12=60. But algebraically, 5(10+2) = 50+10 = 60. That's the distributive law. In algebra, this same idea lets us expand (a+b)² geometrically — literally draw a square of side (a+b) and count the four rectangle areas: a², ab, ab, b². The result a²+2ab+b² is an identity — it's true for ALL values of a and b.",
      process_explanation: `MULTIPLICATION OF ALGEBRAIC EXPRESSIONS:

Monomial × Monomial: multiply coefficients, add exponents.
  3x² × 4x³ = 12x⁵.

Monomial × Binomial: distribute the monomial.
  3x(2x + 5) = 6x² + 15x.

Binomial × Binomial (FOIL): multiply each term of first by each term of second.
  (a + b)(c + d) = ac + ad + bc + bd.
  (x + 3)(x − 2) = x² − 2x + 3x − 6 = x² + x − 6.

THREE STANDARD IDENTITIES:
1. (a + b)² = a² + 2ab + b²
2. (a − b)² = a² − 2ab + b²
3. (a + b)(a − b) = a² − b²

FACTORISATION METHODS:
Method 1 — Common factor: take out HCF.
  6x²y − 4xy² = 2xy(3x − 2y).

Method 2 — Grouping (4-term expressions):
  ax + ay + bx + by = a(x+y) + b(x+y) = (a+b)(x+y).

Method 3 — Identity (a²−b²):
  x² − 49 = x² − 7² = (x+7)(x−7).

Method 4 — Perfect square trinomial:
  x² + 6x + 9 = (x+3)² [since 2×3 = 6 and 3² = 9].

DIVISION: factorise and cancel.
  (x² − 9) ÷ (x + 3) = (x+3)(x−3)/(x+3) = x − 3.`,
      worked_example: `Example 1: Expand (2x + 3y)².
= (2x)² + 2(2x)(3y) + (3y)² = 4x² + 12xy + 9y².

Example 2: Factorise 25a² − 16b².
= (5a)² − (4b)² = (5a + 4b)(5a − 4b).

Example 3: Evaluate 103² using identity.
103² = (100 + 3)² = 100² + 2×100×3 + 3² = 10000 + 600 + 9 = 10609.

Example 4: Factorise 2x² + 8x + 8.
= 2(x² + 4x + 4) = 2(x + 2)². [Since x² + 4x + 4 = (x+2)²].

Example 5 (CBSE pattern): Simplify (a+b)² − (a−b)².
= (a²+2ab+b²) − (a²−2ab+b²) = 4ab.`,
      common_misconceptions: `• "(a + b)² = a² + b²" — THE MOST COMMON MISTAKE IN ALGEBRA. The middle term 2ab is always missing in this error.
• "a² − b² = (a−b)²" — WRONG. a²−b² = (a+b)(a−b). (a−b)² = a²−2ab+b².
• "Factorisation is done — just take out one common factor" — may need to factor again if result still has factors.
• Dividing expressions: remember to state restrictions (denominator ≠ 0).
• In grouping, the sign inside the bracket must be adjusted when a negative is factored out: x² − ax − bx + ab = x(x−a) − b(x−a) = (x−b)(x−a).`,
      shortcuts_and_tricks: `• Compute mentally using identities: 99² = (100−1)² = 10000−200+1 = 9801.
• 98 × 102 = (100−2)(100+2) = 100²−4 = 9996.
• To check factorisation: substitute any value (e.g., x=1) in both original and factored form — they must be equal.
• Perfect square trinomial check: coefficient of x² and constant must be perfect squares, middle term = 2√(first)×√(last).`,
      key_takeaway: "The distributive law underlies all algebraic multiplication. The three identities — (a±b)², (a+b)(a−b) — are the most tested factorisation tools in CBSE exams and must be recognised on sight.",
    },
  },

  {
    topicId: "math8_ch7",
    subject: "Mathematics",
    chapterNumber: 7,
    name: "Proportional Reasoning - 1",
    teaching_content: {
      intuition: "When you resize a photo on your phone, a 'good' resize keeps width and height changing by the same factor — the image looks the same. A 'bad' resize stretches only one dimension — the image looks distorted. This is proportional vs non-proportional change. Proportional reasoning is the mathematical way to ensure 'things stay in balance' when scaling — whether it's recipes, maps, currency conversion, or architectural models.",
      process_explanation: `RATIO AND PROPORTION:
• Ratio a:b = a/b. Always in simplest form.
• Proportion: a:b = c:d, or a/b = c/d.
  Cross-multiplication: ad = bc.
• Proportion terms: a and d are extremes; b and c are means.
  Product of means = product of extremes: bc = ad.

DIRECT PROPORTION (MORE → MORE):
• As x increases, y increases proportionally.
• y/x = k (constant ratio k = constant of proportionality).
• y = kx; graph is a straight line through origin.
• Formula: y₁/x₁ = y₂/x₂ (or x₁/y₁ = x₂/y₂).

INVERSE PROPORTION (MORE → LESS):
• As x increases, y decreases so that xy remains constant.
• x × y = k.
• x₁ × y₁ = x₂ × y₂.
• Graph: hyperbola in first quadrant.
• Real examples: speed↑ → time↓ for same distance; workers↑ → days↓ to finish job.

UNITARY METHOD:
Step 1: Find value for 1 unit of the given quantity.
Step 2: Multiply by the required number of units.
This always works regardless of direct or inverse.`,
      worked_example: `Example 1: 8 taps fill a tank in 27 minutes. How long for 12 taps?
More taps → less time → INVERSE proportion.
8 × 27 = 12 × t → t = 216/12 = 18 minutes.

Example 2: A map has scale 1:25000. Two cities are 4 cm apart on the map. Find actual distance.
Actual = 4 × 25000 = 100000 cm = 1 km.

Example 3: 6 kg of apples cost ₹420. What do 10 kg cost?
Cost ∝ weight → DIRECT proportion.
6/420 = 10/x → x = (10 × 420)/6 = ₹700.

Example 4: A recipe for 4 people needs 300 g of rice. How much for 7 people?
More people → more rice → DIRECT: 300/4 = x/7 → x = 525 g.`,
      common_misconceptions: `• "All problems are direct proportion" — always check whether MORE gives MORE or MORE gives LESS.
• "a:b = b:a" — WRONG. Ratio is ordered: 3:5 ≠ 5:3.
• In inverse proportion: setting up x₁/x₂ = y₁/y₂ instead of x₁y₁ = x₂y₂.
• Forgetting units: 1 km = 1000 m = 100000 cm — always convert to same unit before computing scale.
• Proportion "product of means = product of extremes": applies to 4-term proportion only, not to ratios alone.`,
      shortcuts_and_tricks: `• Identify direct vs inverse: ask "if I double x, what happens to y?" Double→double = direct; double→halve = inverse.
• Continued proportion: a, b, c in continued proportion → a/b = b/c → b² = ac (b is geometric mean of a and c).
• Quick proportion solving: x/a = y/b → x = ay/b. Always cross-multiply, then divide.
• Scale factor conversion: 1:n means 1 unit on model = n units in real. Scale up: multiply by n. Scale down: divide by n.`,
      key_takeaway: "Direct proportion means a constant ratio (y/x = k); inverse proportion means a constant product (xy = k). Identifying which type applies is the crucial first step, done by asking: does more of x give more or less of y?",
    },
  },

  {
    topicId: "math8_ch8",
    subject: "Mathematics",
    chapterNumber: 8,
    name: "Fractions in Disguise",
    teaching_content: {
      intuition: "Percentages are just fractions in disguise: 25% literally means 25 out of every 100. They are a universal comparison tool — 'sale 40% off' is clearer than 'sale 2/5 off' to most people. Percentages power everything in commerce: profit and loss are percentages of cost price, bank interest is a percentage of principal, discounts are percentages of marked price.",
      process_explanation: `PERCENTAGES — conversions:
• Fraction to %: multiply by 100. Example: 3/5 = 60%.
• % to fraction: divide by 100, simplify. Example: 35% = 35/100 = 7/20.
• Decimal to %: multiply by 100. Example: 0.045 = 4.5%.
• x% of y: compute (x/100) × y.

PERCENTAGE CHANGE:
• % increase = (increase / original) × 100.
• % decrease = (decrease / original) × 100.
• After r% increase: new value = original × (1 + r/100).
• After r% decrease: new value = original × (1 − r/100).

PROFIT AND LOSS:
• Profit = SP − CP; Loss = CP − SP.
• Profit % = (Profit / CP) × 100; Loss % = (Loss / CP) × 100.
• To find SP given CP and profit%: SP = CP × (100 + profit%)/100.
• To find CP given SP and profit%: CP = SP × 100/(100 + profit%).

DISCOUNT:
• Discount = MP − SP; Discount % = (Discount / MP) × 100.
• SP after discount: SP = MP × (100 − discount%)/100.

SIMPLE INTEREST: I = P × R × T / 100.
• Amount A = P + I = P(1 + RT/100).

COMPOUND INTEREST: A = P(1 + R/100)ⁿ.
• CI = A − P = P[(1 + R/100)ⁿ − 1].
• For half-yearly: R becomes R/2, n becomes 2n.`,
      worked_example: `Example 1: A shopkeeper buys a fan for ₹1800 and sells it at a 15% profit. Find SP.
SP = 1800 × (100+15)/100 = 1800 × 115/100 = ₹2070.

Example 2: A jacket marked at ₹2500 is sold with 20% discount. What does the customer pay?
SP = 2500 × (100−20)/100 = 2500 × 0.80 = ₹2000.

Example 3: Find CI on ₹10000 at 10% per annum for 2 years.
A = 10000 × (1 + 10/100)² = 10000 × 1.21 = ₹12100.
CI = 12100 − 10000 = ₹2100.
SI for same: 10000 × 10 × 2/100 = ₹2000. CI > SI by ₹100.

Example 4 (finding CP): A dealer sells a TV for ₹18000 at 20% profit. Find CP.
CP = 18000 × 100/(100+20) = 18000 × 100/120 = ₹15000.`,
      common_misconceptions: `• "Profit % is calculated on SP" — WRONG. Both profit% and loss% are always on COST PRICE.
• "Discount % is calculated on CP" — WRONG. Discount % is always on MARKED PRICE.
• "25% profit then 25% discount gives no profit" — WRONG. They operate on different bases, giving a loss.
• "Compound interest just adds more interest" — CI applies interest on previous year's amount, not original principal.
• "A 10% rise followed by 10% fall returns to original" — WRONG: 100 → 110 → 99. Net change = −1%.`,
      shortcuts_and_tricks: `• "Successive percentages" — multiply multipliers: 20% up then 10% down = 1.2 × 0.9 = 1.08 = 8% net gain.
• CP from SP and profit%: CP = SP × 100/(100 + profit%).
• MP from SP and discount%: MP = SP × 100/(100 − discount%).
• CI interest for 2 years: CI = SI + SI × r/100 (extra interest in year 2 on year 1's interest).
• Mental percentage: 10% = move decimal left one place. 5% = half of 10%. 1% = divide by 100.`,
      key_takeaway: "Percentages are fractions over 100. Profit/Loss% uses Cost Price as base; Discount% uses Marked Price as base. Compound interest A = P(1+R/100)ⁿ grows faster than simple interest because each period earns interest on the growing amount, not just the original principal.",
    },
  },

  {
    topicId: "math8_ch9",
    subject: "Mathematics",
    chapterNumber: 9,
    name: "The Baudhayana-Pythagoras Theorem",
    teaching_content: {
      intuition: "Almost 2800 years before Pythagoras (c. 570 BCE), the Indian mathematician Baudhayana (c. 800 BCE) recorded in the Śulba-Sūtra: 'The diagonal of a rectangle produces by itself both the areas which its length and breadth produce separately.' This is the Pythagorean theorem. The diagonal of a unit square has length √2 — a number that cannot be expressed as any fraction, revealing that irrational numbers are geometrically natural and unavoidable.",
      process_explanation: `THE PYTHAGOREAN THEOREM:
In a right triangle with legs a and b and hypotenuse c:
  a² + b² = c²

GEOMETRIC PROOF (area approach):
1. Draw a square of side (a+b).
2. Inside, place four identical right triangles each with legs a, b.
3. The remaining region in the middle is a square of side c.
4. Area of big square = (a+b)² = a²+2ab+b².
5. Four triangles = 4 × ½ab = 2ab; inner square = c².
6. So a²+2ab+b² = 2ab + c² → c² = a² + b².

CONVERSE: If a²+b² = c² then the angle opposite c is 90°.

IRRATIONAL NUMBERS:
• √2 is irrational: cannot be expressed as p/q.
• Proof by contradiction: assume √2 = p/q in lowest terms.
  Then p² = 2q² → p is even → p = 2k → 4k² = 2q² → q is even.
  But then p/q is NOT in lowest terms — contradiction!
• Decimal: √2 ≈ 1.41421356… (non-terminating, non-repeating).

PYTHAGOREAN TRIPLES:
• A triple (a, b, c) where all three are positive integers and a²+b²=c².
• Primitive triples: (3,4,5), (5,12,13), (8,15,17), (7,24,25), (20,21,29).
• Generating formula: for m > n > 0: a=m²−n², b=2mn, c=m²+n².`,
      worked_example: `Example 1: Find the hypotenuse of a right triangle with legs 9 cm and 40 cm.
c = √(9² + 40²) = √(81 + 1600) = √1681 = 41 cm.
(9, 40, 41) is a Pythagorean triple!)

Example 2: A ladder 15 m long leans against a wall. The foot is 9 m from the wall. How high does the ladder reach?
h = √(15² − 9²) = √(225 − 81) = √144 = 12 m.

Example 3: Show that (5, 12, 13) is a Pythagorean triple.
5² + 12² = 25 + 144 = 169 = 13². ✓

Example 4: The diagonal of a rectangle is 17 cm and one side is 8 cm. Find the other side.
Other side = √(17² − 8²) = √(289 − 64) = √225 = 15 cm.
Check: 8² + 15² = 64 + 225 = 289 = 17² ✓.`,
      common_misconceptions: `• "Pythagoras theorem applies to all triangles" — ONLY right triangles.
• "Any three numbers form a Pythagorean triple" — WRONG. Only specific sets: (3,4,5) yes; (3,4,6) no.
• "The hypotenuse is always the longest side" — TRUE in a right triangle, but students sometimes take the wrong side as hypotenuse.
• "√2 ≈ 1.4 is exact" — it is an approximation; √2 is irrational with infinite non-repeating decimals.
• "Multiples of a Pythagorean triple are always primitive triples" — they are Pythagorean triples but NOT primitive (e.g., (6,8,10) is derived from (3,4,5)).`,
      shortcuts_and_tricks: `• Memorise the 5 most common triples: (3,4,5), (5,12,13), (8,15,17), (7,24,25), (6,8,10).
• All multiples of (3,4,5) are triples: (6,8,10), (9,12,15), (12,16,20)…
• Quick check: if the two given sides match a known triple ratio, the third side follows.
• Height of equilateral triangle of side a: drop perpendicular → splits into right triangles with hyp=a, one leg=a/2; height = √(a²−a²/4) = a√3/2.
• Distance formula between two points = Pythagorean theorem in disguise.`,
      key_takeaway: "In any right triangle, c² = a² + b² where c is the hypotenuse. This theorem, known in India since Baudhayana (∼800 BCE), is fundamental to all of geometry. √2 — the diagonal of a unit square — is irrational, demonstrating that not all geometric lengths can be rational numbers.",
    },
  },

  {
    topicId: "math8_ch10",
    subject: "Mathematics",
    chapterNumber: 10,
    name: "Proportional Reasoning - 2",
    teaching_content: {
      intuition: "A map of India might have the scale 1:5,000,000 — meaning 1 cm on the map represents 50 km on the ground. Proportional reasoning is the tool that converts between map and reality, between model and structure, between recipe for 4 and recipe for 7. Chapter 10 extends this to more complex situations: multiple quantities proportional simultaneously, scale drawings, and compound ratios.",
      process_explanation: `MAP SCALES:
• Scale is written as a ratio 1:n (model:real).
• Map distance → actual: multiply by n (scale denominator).
• Actual → map distance: divide by n.
• Always use consistent units: convert to cm before applying scale.
  Example: scale 1:50000. Map distance 3 cm → actual = 3 × 50000 = 150000 cm = 1.5 km.

MULTI-TERM RATIOS:
• Three quantities a:b:c → share A in this ratio:
  Each part = A × (respective ratio) / (sum of ratios).
  Example: divide 720 in ratio 3:4:5.
  Total parts = 12; shares = 720×3/12, 720×4/12, 720×5/12 = 180, 240, 300.

COMPOUND RATIOS:
• Compound ratio of (a:b) and (c:d) = ac:bd.
  Example: compound of 3:4 and 8:9 = 24:36 = 2:3.

DIRECT AND INVERSE IN CONTEXT:
• Always identify the proportion type from the context.
• Set up equation and solve.
• Speed problems: speed × time = distance (constant) → speed and time are inversely proportional for fixed distance.
• Worker problems: (workers) × (days) = (total work) → inversely proportional.`,
      worked_example: `Example 1: Map scale 1:4000000. Distance between two cities on map is 2.5 cm. Find actual distance.
Actual = 2.5 × 4000000 = 10000000 cm = 100 km.

Example 2: 15 workers can build a wall in 24 days. In how many days can 9 workers build it?
Workers × days = constant (inverse proportion).
15 × 24 = 9 × d → d = 360/9 = 40 days.

Example 3: A car covers 180 km at 60 km/h. At what speed must it travel the same distance in 2.5 hours?
Distance = 180 km (constant). Speed and time are inversely proportional.
60 × 3 = v × 2.5 → v = 180/2.5 = 72 km/h.

Example 4: Divide ₹4500 among A, B, C in the ratio 2:3:4.
Total parts = 9. A = 4500×2/9 = 1000, B = 1500, C = 2000.`,
      common_misconceptions: `• Confusing scale 1:50000 with "1 cm = 50 km" — actually 1 cm = 50000 cm = 500 m = 0.5 km. Check units carefully.
• In ratio division: students sometimes use the ratio values themselves as amounts instead of proportional shares.
• "More workers always means fewer days" — true ONLY if each worker works at the same rate and they don't get in each other's way.
• Compound ratio: (a:b) and (c:d) → students sometimes add instead of multiply: (a+c):(b+d) is WRONG.`,
      shortcuts_and_tricks: `• Scale 1:n means actual = n × map. Scale n:1 (like architectural drawings) means actual = map/n.
• Ratio division quick check: sum of shares = sum of parts × (original/total ratio) should equal original amount.
• Three quantities in proportion a:b:c — all three divide a total proportionally; always verify sum of shares = total.
• For worker problems: total work units = workers × days. Set equal for two scenarios.`,
      key_takeaway: "Map scales apply the ratio 1:n to convert between model and reality. Multi-term ratios divide quantities proportionally. Direct proportion keeps ratios constant; inverse proportion keeps products constant. Always identify the type before setting up the equation.",
    },
  },

  {
    topicId: "math8_ch11",
    subject: "Mathematics",
    chapterNumber: 11,
    name: "Exploring Some Geometric Themes",
    teaching_content: {
      intuition: "A fern leaf looks like a tiny version of the whole fern. A broccoli floret looks like a tiny broccoli. A coastline looks jagged at every scale. These are fractals — shapes that repeat their own pattern at ever-smaller sizes. They are mathematically fascinating because their perimeters can be infinite while their areas remain finite. The second theme is visualising 3D objects in 2D: how does a cube look when 'unfolded' (its net)? What shape do you see from the front, side, and top?",
      process_explanation: `FRACTALS — construction step by step:

Sierpinski Gasket (Triangle):
Step 0: Start with a filled equilateral triangle.
Step 1: Divide into 4 equal triangles; remove the centre one.
Step 2: Repeat for each of the 3 remaining triangles.
Step n: 3ⁿ triangles remain; area = (3/4)ⁿ of original → approaches 0.

Koch Snowflake:
Step 0: Equilateral triangle.
Step 1: Replace the middle third of each side with an outward equilateral triangle peak.
Step 2: Repeat for all sides.
Perimeter × 4/3 each step → infinite perimeter; enclosed area → finite limit.

VISUALISING SOLID SHAPES:

NET: A net is a flat unfolded version that, when folded along edges, forms the 3D shape.
• Cube: 6 identical squares arranged in a cross or T or L pattern (11 valid nets).
• Cuboid: 6 rectangles (3 pairs of equal faces).
• Cylinder: 2 circles + 1 rectangle (the curved surface).
• Cone: 1 circle (base) + 1 sector (curved surface).

ORTHOGRAPHIC VIEWS (three views):
• Front view: looking from front (shows height and width).
• Side view: looking from right (shows height and depth).
• Top view: looking from above (shows width and depth).

CROSS-SECTIONS:
• Sphere: any cross-section is a circle.
• Cone: horizontal cross-section → circle; vertical through apex → triangle.
• Cylinder: horizontal → circle; vertical → rectangle.`,
      worked_example: `Example 1: How many triangles remain after 3 steps of constructing the Sierpinski Gasket?
Step 0: 1 triangle. Step 1: 3. Step 2: 9. Step 3: 27 = 3³ triangles.

Example 2: The perimeter of a Koch Snowflake after each step multiplies by 4/3. Start with a triangle of perimeter 12 cm. What is the perimeter after 3 steps?
P₃ = 12 × (4/3)³ = 12 × 64/27 = 768/27 ≈ 28.4 cm.

Example 3: How many faces, edges, and vertices does a cube have?
Faces: 6. Edges: 12. Vertices: 8. Euler's formula: F + V − E = 6 + 8 − 12 = 2 ✓.

Example 4: Which of the following is a valid net of a cube?
[Six squares must be connected edge-to-edge; when folded no face overlaps another and all 6 faces are covered.]
The standard cross-shaped net with 4 in a row and 1 on each side of the second square is valid.`,
      common_misconceptions: `• "A fractal's area is infinite" — WRONG for Sierpinski: its area approaches 0. Koch snowflake's area is finite though its perimeter is infinite.
• "Any 6-square arrangement is a net of a cube" — WRONG. Some arrangements cannot fold into a cube (e.g., a 1×6 row of squares — the end faces would overlap).
• "Side view and front view are the same" — only for symmetric objects; always take views from the specified directions.
• "Euler's formula works for all shapes" — it applies to convex polyhedra (and simply connected solids): F + V − E = 2.`,
      shortcuts_and_tricks: `• Euler's formula F + V − E = 2 for any convex polyhedron (F = faces, V = vertices, E = edges).
• Cube: 6F, 8V, 12E → 6+8−12 = 2 ✓.
• Tetrahedron: 4F, 4V, 6E → 4+4−6 = 2 ✓.
• Valid cube nets: there are exactly 11 distinct nets for a cube.
• For fractals: count remaining pieces after each iteration, multiply by same factor each step (geometric sequence).`,
      key_takeaway: "Fractals are self-similar shapes whose perimeter can grow without bound while area shrinks to zero. 3D shapes can be represented as 2D nets (for folding), orthographic views (front/side/top), and cross-sections. Euler's formula F+V−E=2 holds for all convex polyhedra.",
    },
  },

  {
    topicId: "math8_ch12",
    subject: "Mathematics",
    chapterNumber: 12,
    name: "Tales by Dots and Lines",
    teaching_content: {
      intuition: "Imagine 10 people with salaries. If the CEO earns ₹10 crore and others earn ₹30,000, the 'average' salary looks much higher than what most people earn. That's because the mean gets pulled toward extreme values. The median — the middle value — is more honest here. Data visualisation (dot plots, line graphs) makes these differences visible at a glance, turning raw numbers into a story.",
      process_explanation: `MEAN (Arithmetic Average):
• Mean = (sum of all values) / (number of values).
• For data x₁, x₂, …, xₙ: Mean x̄ = (Σxᵢ)/n.

EFFECT OF OPERATIONS ON MEAN:
• Add constant c to every value: new mean = x̄ + c.
• Multiply every value by k: new mean = k × x̄.
• Removing a value equal to mean: mean is unchanged.
• Adding a value equal to mean: mean is unchanged.

MEDIAN (Middle value):
• Sort data in ascending order.
• Odd n: median = value at position (n+1)/2.
• Even n: median = average of values at positions n/2 and (n/2)+1.

MODE (Most frequent value):
• Value that appears most often.
• A dataset can be unimodal, bimodal, or multimodal.
• If all values appear once: no mode.

CHOOSING THE MEASURE:
• Mean: best when data is symmetric and no outliers.
• Median: better when data is skewed or has outliers.
• Mode: best for categorical data or identifying most popular value.

DOT PLOTS:
• Each data point = one dot above the number line.
• Easy to spot clusters, gaps, outliers, and symmetry.
• Can overlay two datasets for comparison.`,
      worked_example: `Example 1: Find mean, median, mode of: 3, 7, 4, 3, 8, 9, 3, 5, 7.
Sorted: 3, 3, 3, 4, 5, 7, 7, 8, 9. n = 9.
Mean = (3+3+3+4+5+7+7+8+9)/9 = 49/9 ≈ 5.44.
Median = 5th value = 5.
Mode = 3 (appears 3 times).

Example 2: The mean of 5 numbers is 18. If each number is multiplied by 3, what is the new mean?
New mean = 3 × 18 = 54.

Example 3: A class of 30 students has mean marks 72. 10 new students join with mean marks 60. Find overall mean.
Total marks of original 30: 30 × 72 = 2160.
Total marks of 10 new: 10 × 60 = 600.
Overall mean = (2160 + 600) / 40 = 2760/40 = 69.

Example 4: Why would median be a better measure than mean for: 2, 3, 4, 5, 100?
Mean = 114/5 = 22.8 (pulled by outlier 100).
Median = 4 (middle value; not affected by 100).
Median better represents the typical value.`,
      common_misconceptions: `• "Median = middle value of unsorted data" — MUST sort first; otherwise the middle position gives a random value.
• "Mode is the most common value — just pick the largest" — WRONG. Largest value is not necessarily most frequent.
• "Mean is always between min and max" — TRUE, but students sometimes compute mean > max by arithmetic errors.
• "Adding an outlier doesn't change the median much" — TRUE (median is resistant), but mean changes significantly.
• "There's always exactly one mode" — data can have zero modes (all unique) or multiple modes.`,
      shortcuts_and_tricks: `• Mean balance point: sum of (each value − mean) = 0. Useful for checking.
• To find a missing value given mean: (mean × n) − sum of known values = missing value.
• If n is odd: median position = (n+1)/2. If n is even: average positions n/2 and n/2+1.
• To compare two data sets: if one has higher mean AND higher median, it generally has larger typical values.
• Effect of scaling on median: works same as mean — multiply all → median × same multiplier.`,
      key_takeaway: "Mean equals total divided by count; it is sensitive to outliers. Median is the middle value of sorted data; it is resistant to outliers. Mode is the most frequent value. Dot plots reveal distribution shape, clusters, and outliers that single numbers cannot convey.",
    },
  },

  {
    topicId: "math8_ch13",
    subject: "Mathematics",
    chapterNumber: 13,
    name: "Algebra Play",
    teaching_content: {
      intuition: "Think of a number. Double it. Add 10. Halve the result. Subtract your original number. Your answer is 5. How? Let the number be x: 2x → 2x+10 → x+5 → x+5−x = 5. Algebra explains why these tricks always work — and lets us invent new ones. More powerfully, algebra translates real problems ('the sum of two numbers is 30, one is twice the other') into equations we can solve systematically.",
      process_explanation: `SOLVING LINEAR EQUATIONS — variable on both sides:
Step 1: Expand all brackets.
Step 2: Collect variable terms on one side (transpose: change sign when crossing =).
Step 3: Collect constants on the other side.
Step 4: Divide by coefficient of variable.
Step 5: Verify by substituting back.

Example: 3(x + 4) = 2x + 18.
3x + 12 = 2x + 18.
3x − 2x = 18 − 12.
x = 6. Check: 3(10) = 30 = 2(6)+18 = 30 ✓.

CLEARING FRACTIONS:
• Multiply BOTH sides by LCM of denominators.
Example: x/3 + (x−2)/4 = 2.
LCM of 3 and 4 = 12. Multiply: 4x + 3(x−2) = 24.
4x + 3x − 6 = 24 → 7x = 30 → x = 30/7.

CROSS-MULTIPLICATION: a/b = c/d → ad = bc.
Example: (x+3)/5 = (x−1)/3.
3(x+3) = 5(x−1) → 3x+9 = 5x−5 → 14 = 2x → x = 7.

WORD PROBLEM STRATEGY:
1. Identify the unknown — assign variable x.
2. Form the equation from the conditions.
3. Solve the equation.
4. Verify the answer in the original problem statement.`,
      worked_example: `Example 1 (number trick): Think of a number. Multiply by 5. Add 12. Subtract twice the original. The result is always 12. Why?
Let number = x. 5x + 12 − 2x = 3x + 12. If we then subtract 3 times the original: 3x + 12 − 3x = 12. ✓

Example 2: The sum of three consecutive integers is 48. Find them.
Let integers be n, n+1, n+2.
n + n+1 + n+2 = 48 → 3n + 3 = 48 → n = 15.
Numbers: 15, 16, 17. Check: 15+16+17 = 48 ✓.

Example 3: Riya is 6 years older than Priya. In 5 years, Riya will be twice Priya's current age. Find their current ages.
Let Priya = x. Riya = x + 6.
In 5 years, Riya = x + 6 + 5 = x + 11.
Condition: x + 11 = 2x → x = 11.
Priya = 11, Riya = 17. Check: 17+5 = 22 = 2×11 ✓.

Example 4: Solve (2x+1)/3 − (x−2)/2 = 1.
LCM = 6. Multiply: 2(2x+1) − 3(x−2) = 6.
4x + 2 − 3x + 6 = 6 → x + 8 = 6 → x = −2.`,
      common_misconceptions: `• "Transpose means copy to other side unchanged" — WRONG. Sign CHANGES: +5 becomes −5 when transposed.
• "I can add different quantities: x/3 + x/4 = x/7" — WRONG. Add fractions with common denominator: x/3 + x/4 = 4x/12 + 3x/12 = 7x/12.
• "Multiply by LCM only on the fraction side" — WRONG. Multiply BOTH sides by LCM to keep equation balanced.
• "More than one solution exists for a linear equation" — a linear equation has EXACTLY one solution (unless it simplifies to 0=0 or 0=non-zero).
• Forgetting to verify: always substitute back and check against original word problem, not just the algebraic equation.`,
      shortcuts_and_tricks: `• Transposing: + becomes −, − becomes +, × becomes ÷, ÷ becomes ×.
• Cross-multiply ONLY when both sides are single fractions: a/b = c/d.
• For consecutive integers: n, n+1, n+2 (their sum = 3n+3). For consecutive even/odd: n, n+2, n+4 (sum = 3n+6).
• Age problems: if current age is x, age k years later = x+k; k years ago = x−k.
• "Think of a number" trick design: operations that cancel the original number always produce a constant result.`,
      key_takeaway: "Linear equations with one variable have exactly one solution. Solve by isolating the variable: transpose terms (changing sign), clear fractions by multiplying by LCM, and always verify the solution in the original problem. Algebra reveals WHY number tricks work by replacing the specific number with a variable.",
    },
  },

  {
    topicId: "math8_ch14",
    subject: "Mathematics",
    chapterNumber: 14,
    name: "Area",
    teaching_content: {
      intuition: "Area answers 'how much surface?' — how much paint to cover a wall, how much carpet to buy, how much land a farmer owns. Every area formula comes from the rectangle formula (length × width) through clever cutting and rearranging. A parallelogram is literally a rectangle in disguise: cut a triangle from one end and paste it to the other, and you get a rectangle with the same base and height.",
      process_explanation: `AREA FORMULAS derived from first principles:

Rectangle: A = l × b (foundation of all other formulas).

Parallelogram:
Cut a right triangle from one end and move to other side → forms a rectangle.
A = base × perpendicular height (height ⊥ to base, NOT the slant side).

Triangle (= half parallelogram):
A = ½ × base × height.
(A diagonal of a parallelogram divides it into 2 equal triangles.)

Trapezium (two parallel sides a and b, height h):
Duplicate and rotate → forms a parallelogram with base (a+b) and height h.
A = ½ × (a + b) × h.

Rhombus (diagonals d₁ and d₂):
Four right triangles with legs d₁/2 and d₂/2.
A = 4 × ½ × (d₁/2)(d₂/2) = ½ × d₁ × d₂.

Circle:
A = πr² (π ≈ 22/7 when r is multiple of 7; else 3.14).
Circumference C = 2πr.

COMPOSITE FIGURES:
1. Identify simple shapes within the composite.
2. Calculate area of each part separately.
3. Add (for total area) or subtract (for shaded regions).

UNIT CONVERSION:
1 m² = 10000 cm²; 1 km² = 1000000 m² = 10⁶ m².`,
      worked_example: `Example 1: Find the area of a parallelogram with base 14 cm and height 9 cm.
A = 14 × 9 = 126 cm².

Example 2: A trapezium has parallel sides 10 cm and 6 cm, height 8 cm. Find its area.
A = ½ × (10 + 6) × 8 = ½ × 16 × 8 = 64 cm².

Example 3: A rhombus has diagonals 18 cm and 24 cm. Find (a) area, (b) side.
(a) Area = ½ × 18 × 24 = 216 cm².
(b) Half-diagonals: 9 and 12. Side = √(9² + 12²) = √(81+144) = √225 = 15 cm.

Example 4 (composite): A square of side 14 cm has a circle of radius 7 cm cut from its centre. Find the remaining area.
Area of square = 14² = 196 cm².
Area of circle = π × 7² = 22/7 × 49 = 154 cm².
Remaining area = 196 − 154 = 42 cm².`,
      common_misconceptions: `• "Height of parallelogram = slant side" — WRONG. Height is the perpendicular distance, which requires a perpendicular dropped from one side to the other.
• "Area of rhombus = side²" — WRONG (that formula is for squares). Rhombus area = ½d₁d₂.
• "Perimeter and area are proportional" — WRONG. Doubling each dimension quadruples area but doubles perimeter.
• "Area of composite figure = sum of all visible shapes' areas" — watch for overlap or shared regions that should not be double-counted.
• Unit errors: 5 m² ≠ 500 cm². Correct: 5 m² = 5 × 10000 = 50000 cm².`,
      shortcuts_and_tricks: `• Parallelogram and rectangle on same base between same parallels: same area.
• Triangle area = ½ × parallelogram area (on same base and between same parallels).
• Quick circle area: r=7→A=154; r=14→A=616; r=21→A=1386 (multiples of 7, use π=22/7).
• For shaded region between two circles (concentric): A = π(R²−r²) = π(R+r)(R−r).
• Heron's formula for triangle when height is unknown: A = √[s(s−a)(s−b)(s−c)], s = (a+b+c)/2.`,
      key_takeaway: "All area formulas reduce to base × height at their core. Parallelogram: A = bh; Triangle: A = ½bh; Trapezium: A = ½(a+b)h; Rhombus: A = ½d₁d₂; Circle: A = πr². Height must always be perpendicular to the base, never the slant side.",
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

  console.log(`\nSeeded ${topics.length} NcertTopicContent documents for Class 8 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
