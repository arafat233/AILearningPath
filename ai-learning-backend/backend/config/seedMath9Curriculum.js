/**
 * CBSE Class 9 Mathematics — Curriculum Seed
 * Textbook: "Ganita Manjari Grade 9 Part I" (NCERT 2026)
 * 8 chapters. Safe to re-run (upserts on subject+grade+board+chapterNumber).
 * Usage: node config/seedMath9Curriculum.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Chapter } from "../models/chapterModel.js";

const CHAPTERS = [
  {
    chapterNumber: 1,
    title: "Orienting Yourself: The Use of Coordinates",
    subject: "Mathematics",
    grade: "9",
    board: "CBSE",
    unit: "Coordinate Geometry",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Introduces the 2-D Cartesian coordinate system — axes, origin, quadrants, and plotting points. Builds geometric intuition by locating points on graph paper and understanding how coordinates describe position.",
    sections: [
      {
        sectionNumber: "1.1",
        title: "Introduction",
        microConcepts: [
          { title: "What is a coordinate system? Grid-based thinking" },
          { title: "Historical roots: Sindhu-Sarasvatī Civilisation grid cities" },
          { title: "Brahmagupta's coordinate system and Indian astronomy" },
        ],
      },
      {
        sectionNumber: "1.2",
        title: "Settling In",
        microConcepts: [
          { title: "Locating a point in a plane using two numbers" },
          { title: "Directed distances: left/right and up/down from origin" },
          { title: "Ordered pair (x, y): x is horizontal, y is vertical" },
        ],
      },
      {
        sectionNumber: "1.3",
        title: "The 2-D Cartesian Coordinate System",
        microConcepts: [
          { title: "x-axis (horizontal) and y-axis (vertical)" },
          { title: "Origin O = (0, 0); four quadrants I, II, III, IV" },
          { title: "Quadrant signs: I(+,+), II(−,+), III(−,−), IV(+,−)" },
          { title: "Points on axes: (x, 0) on x-axis; (0, y) on y-axis" },
          { title: "Plotting and reading coordinates on graph paper" },
          { title: "Distance from axes: |y| = distance from x-axis; |x| = distance from y-axis" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Ordered pair: (x, y) — x is abscissa, y is ordinate",
      "Origin: (0, 0)",
      "Quadrant I: x > 0, y > 0",
      "Quadrant II: x < 0, y > 0",
      "Quadrant III: x < 0, y < 0",
      "Quadrant IV: x > 0, y < 0",
    ],
    examTips: [
      "Always write coordinates as (x, y) — x first, then y",
      "A point on the x-axis has y = 0; a point on the y-axis has x = 0",
      "Origin belongs to no quadrant — it is ON both axes",
      "Quadrant memory trick: start top-right, go anti-clockwise: I → II → III → IV",
    ],
    exercises: [
      { exerciseNumber: "Exercise 1.1", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 1.2", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 1.3", questionCount: 6, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 2,
    title: "Introduction to Linear Polynomials",
    subject: "Mathematics",
    grade: "9",
    board: "CBSE",
    unit: "Algebra",
    examMarks: 10,
    estimatedWeeks: 3,
    overview: "Introduces linear polynomials (degree 1) and their connection to straight-line graphs. Covers evaluating, adding, and subtracting polynomials; finding zeros; and understanding linear relationships as functions.",
    sections: [
      {
        sectionNumber: "2.1",
        title: "Introduction",
        microConcepts: [
          { title: "Algebraic expressions vs polynomials" },
          { title: "Degree of a polynomial; linear = degree 1" },
          { title: "Standard form: ax + b, a ≠ 0" },
        ],
      },
      {
        sectionNumber: "2.2",
        title: "Linear Polynomials",
        microConcepts: [
          { title: "Evaluating p(x) at a given x value" },
          { title: "Zero of a linear polynomial: p(x) = 0 → x = −b/a" },
          { title: "Every linear polynomial has exactly one zero" },
        ],
      },
      {
        sectionNumber: "2.3",
        title: "Exploring Linear Patterns",
        microConcepts: [
          { title: "Patterns that grow by a constant amount → linear" },
          { title: "Building a table of values for p(x) = ax + b" },
          { title: "First differences are constant for linear polynomials" },
        ],
      },
      {
        sectionNumber: "2.5",
        title: "Linear Relationships",
        microConcepts: [
          { title: "Real-world situations modelled by ax + b (cost, distance)" },
          { title: "Interpreting slope (a) as rate of change" },
          { title: "Interpreting y-intercept (b) as initial value" },
        ],
      },
      {
        sectionNumber: "2.6",
        title: "Visualising Linear Relationships",
        microConcepts: [
          { title: "Graph of y = ax + b is a straight line" },
          { title: "x-intercept: where graph crosses x-axis (y = 0)" },
          { title: "y-intercept: where graph crosses y-axis (x = 0)" },
          { title: "Slope: positive → line rises left-to-right; negative → falls" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Linear polynomial: p(x) = ax + b, a ≠ 0",
      "Zero of p(x): x = −b/a",
      "Graph: straight line with slope a and y-intercept b",
    ],
    examTips: [
      "Zero of p(x) is the x-value where p(x) = 0, not y = 0 on the graph",
      "Slope = coefficient of x = 'rise over run'",
      "Two points determine a unique straight line",
      "If a = 0, it's a constant — not a linear polynomial",
    ],
    exercises: [
      { exerciseNumber: "Exercise 2.1", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 2.2", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 2.3", questionCount: 6, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 3,
    title: "The World of Numbers",
    subject: "Mathematics",
    grade: "9",
    board: "CBSE",
    unit: "Number Systems",
    examMarks: 12,
    estimatedWeeks: 3,
    overview: "A deep exploration of number systems: natural numbers, integers, rational numbers, and irrational numbers. Includes the Indian contribution to zero (śūnya), arithmetic of integers, rational number properties, and locating numbers on the number line.",
    sections: [
      {
        sectionNumber: "3.1",
        title: "The Arithmetic of Integers",
        microConcepts: [
          { title: "Integers: …−3, −2, −1, 0, 1, 2, 3, …" },
          { title: "Addition, subtraction, multiplication of integers" },
          { title: "Sign rules: (−)(−) = +, (−)(+) = −" },
          { title: "Division of integers; integer division is not always an integer" },
        ],
      },
      {
        sectionNumber: "3.2",
        title: "The Revolution of Śūnya: Zero",
        microConcepts: [
          { title: "Brahmagupta's rules for zero (Brahmasphutasiddhanta, 628 CE)" },
          { title: "Zero as additive identity: a + 0 = a" },
          { title: "a × 0 = 0 for all a; division by zero is undefined" },
          { title: "Historical significance of zero in Indian mathematics" },
        ],
      },
      {
        sectionNumber: "3.3",
        title: "Integers: Expanding the Horizon",
        microConcepts: [
          { title: "Absolute value |a|: distance from zero on number line" },
          { title: "Ordering integers on the number line" },
          { title: "Properties: commutative, associative, distributive" },
          { title: "Additive inverse: a + (−a) = 0" },
        ],
      },
      {
        sectionNumber: "3.4",
        title: "Filling the Spaces: Fractions and Rational Numbers",
        microConcepts: [
          { title: "Rational numbers: p/q where p, q ∈ ℤ, q ≠ 0" },
          { title: "Equivalent fractions; lowest form" },
          { title: "Between any two rationals, infinitely many rationals exist" },
          { title: "Rational numbers on the number line" },
          { title: "Irrational numbers: cannot be written as p/q (e.g. √2, π)" },
          { title: "Real numbers: union of rationals and irrationals" },
        ],
      },
    ],
    theorems: [
      { name: "Density of Rationals", statement: "Between any two distinct rational numbers, there exists infinitely many rational numbers." },
    ],
    keyFormulas: [
      "Rational number: p/q, q ≠ 0",
      "Additive inverse of a: −a",
      "Multiplicative inverse of a (a≠0): 1/a",
      "|a| = a if a ≥ 0; |a| = −a if a < 0",
    ],
    examTips: [
      "Every integer is a rational number (write n as n/1)",
      "Irrational numbers have non-terminating, non-repeating decimal expansions",
      "√2 ≈ 1.414; √3 ≈ 1.732 — useful for MCQs",
      "0 is neither positive nor negative, but it is an integer and a rational number",
    ],
    exercises: [
      { exerciseNumber: "Exercise 3.1", questionCount: 6, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 3.2", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 3.3", questionCount: 7, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 3.4", questionCount: 6, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 4,
    title: "Exploring Algebraic Identities",
    subject: "Mathematics",
    grade: "9",
    board: "CBSE",
    unit: "Algebra",
    examMarks: 10,
    estimatedWeeks: 3,
    overview: "Develops algebraic identities through visual/geometric proofs using algebra tiles. Covers expansion of (a+b)², (a−b)², (a+b)(a−b), and factorisation techniques including grouping and the splitting middle term method.",
    sections: [
      {
        sectionNumber: "4.1",
        title: "Introduction",
        microConcepts: [
          { title: "Identity vs equation: identity holds for all values of the variable" },
          { title: "Recap of algebraic expressions and like terms" },
        ],
      },
      {
        sectionNumber: "4.2",
        title: "Visualising Identities",
        microConcepts: [
          { title: "(a+b)² = a² + 2ab + b²: geometric square proof" },
          { title: "(a−b)² = a² − 2ab + b²: geometric proof" },
          { title: "(a+b)(a−b) = a² − b²: difference of squares" },
        ],
      },
      {
        sectionNumber: "4.3",
        title: "Factorisation of Algebraic Expressions",
        microConcepts: [
          { title: "Common factor method: HCF of all terms" },
          { title: "Grouping method: split into pairs, factor each pair" },
          { title: "Identifying identity patterns in expressions" },
        ],
      },
      {
        sectionNumber: "4.5",
        title: "Factorisation Using Algebra Tiles",
        microConcepts: [
          { title: "Representing x² + bx + c as a rectangle" },
          { title: "Splitting middle term: find p, q such that p + q = b, pq = c" },
        ],
      },
      {
        sectionNumber: "4.7",
        title: "Finding New Identities",
        microConcepts: [
          { title: "(a+b+c)² = a² + b² + c² + 2ab + 2bc + 2ca" },
          { title: "(a+b)³ = a³ + 3a²b + 3ab² + b³" },
          { title: "(a−b)³ = a³ − 3a²b + 3ab² − b³" },
          { title: "a³ + b³ = (a+b)(a² − ab + b²)" },
          { title: "a³ − b³ = (a−b)(a² + ab + b²)" },
        ],
      },
      {
        sectionNumber: "4.8",
        title: "Simplifying Rational Expressions",
        microConcepts: [
          { title: "Factorising numerator and denominator; cancelling common factors" },
          { title: "Restrictions on variable: denominator ≠ 0" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "(a+b)² = a² + 2ab + b²",
      "(a−b)² = a² − 2ab + b²",
      "(a+b)(a−b) = a² − b²",
      "(a+b+c)² = a²+b²+c²+2ab+2bc+2ca",
      "(a+b)³ = a³+3a²b+3ab²+b³",
      "(a−b)³ = a³−3a²b+3ab²−b³",
      "a³+b³ = (a+b)(a²−ab+b²)",
      "a³−b³ = (a−b)(a²+ab+b²)",
    ],
    examTips: [
      "Always check if an expression fits a known identity before expanding",
      "For (a±b)³: middle signs alternate (+−+ or −+−)",
      "a²−b² = (a+b)(a−b) is the most-tested identity",
      "To verify an identity, substitute any value for the variable",
    ],
    exercises: [
      { exerciseNumber: "Exercise 4.1", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 4.2", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 4.3", questionCount: 6, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 4.4", questionCount: 5, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 5,
    title: "I'm Up and Down, and Round and Round",
    subject: "Mathematics",
    grade: "9",
    board: "CBSE",
    unit: "Geometry — Circles",
    examMarks: 12,
    estimatedWeeks: 3,
    overview: "A thorough introduction to circles: definitions, symmetry properties, chord theorems, and the relationship between chords, perpendicular bisectors, and the centre.",
    sections: [
      {
        sectionNumber: "5.1",
        title: "Definitions",
        microConcepts: [
          { title: "Circle: set of all points equidistant from a fixed centre" },
          { title: "Radius, diameter, chord, arc (minor/major), sector, segment" },
          { title: "Semicircle; diameter is the longest chord" },
        ],
      },
      {
        sectionNumber: "5.2",
        title: "Symmetries of a Circle",
        microConcepts: [
          { title: "A circle has infinite lines of symmetry through the centre" },
          { title: "Every diameter is a line of symmetry" },
          { title: "Rotational symmetry of infinite order" },
        ],
      },
      {
        sectionNumber: "5.3",
        title: "How Many Circles?",
        microConcepts: [
          { title: "A unique circle passes through any three non-collinear points" },
          { title: "No circle passes through three collinear points" },
          { title: "Infinitely many circles pass through one or two points" },
        ],
      },
      {
        sectionNumber: "5.4",
        title: "Chords and the Angles They Subtend",
        microConcepts: [
          { title: "Equal chords subtend equal angles at the centre" },
          { title: "Converse: equal angles subtend equal chords" },
          { title: "Angle subtended by a chord: central angle vs inscribed angle" },
        ],
      },
      {
        sectionNumber: "5.5",
        title: "Midpoints and Perpendicular Bisectors of Chords",
        microConcepts: [
          { title: "Perpendicular from centre to a chord bisects the chord" },
          { title: "Converse: line from centre bisecting a chord is perpendicular to it" },
          { title: "Perpendicular bisector of any chord passes through the centre" },
        ],
      },
      {
        sectionNumber: "5.6",
        title: "Distance of Chords from the Centre",
        microConcepts: [
          { title: "Equal chords are equidistant from the centre" },
          { title: "Converse: chords equidistant from centre are equal" },
          { title: "Longer chord is closer to the centre; diameter has zero distance" },
        ],
      },
    ],
    theorems: [
      { name: "Equal Chord — Equal Central Angle", statement: "Equal chords of a circle subtend equal angles at the centre; and conversely." },
      { name: "Perpendicular from Centre", statement: "The perpendicular from the centre of a circle to a chord bisects the chord." },
      { name: "Equal Chords — Equal Distance", statement: "Equal chords of a circle are equidistant from the centre; and conversely." },
      { name: "Unique Circle", statement: "There is exactly one circle passing through three non-collinear points." },
    ],
    keyFormulas: [
      "Distance from centre to chord: d = √(r² − (l/2)²) where l = chord length",
      "Chord length: l = 2√(r² − d²) where d = distance from centre",
    ],
    examTips: [
      "In any chord problem, draw the perpendicular from centre — it creates a right triangle",
      "Use Pythagoras: r² = d² + (l/2)²",
      "Diameter is the longest chord (d = 0 from centre)",
      "State the theorem name before using it in proofs",
    ],
    exercises: [
      { exerciseNumber: "Exercise 5.1", questionCount: 3, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 5.2", questionCount: 5, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 5.3", questionCount: 6, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 5.4", questionCount: 5, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 6,
    title: "Measuring Space: Perimeter and Area",
    subject: "Mathematics",
    grade: "9",
    board: "CBSE",
    unit: "Mensuration",
    examMarks: 12,
    estimatedWeeks: 3,
    overview: "Derives and applies perimeter and area formulas for triangles, quadrilaterals, and circles. Introduces the C/D ratio (π), arc length, and sector area. Emphasises dimensional analysis and unit conversion.",
    sections: [
      {
        sectionNumber: "6.1",
        title: "Perimeter of a Shape",
        microConcepts: [
          { title: "Perimeter: total boundary length" },
          { title: "Rectangle: P = 2(l + b)" },
          { title: "Square: P = 4a; Triangle: P = a + b + c" },
          { title: "Heron's formula for area of scalene triangle" },
        ],
      },
      {
        sectionNumber: "6.2",
        title: "Perimeter of a Circle — The C/D Ratio",
        microConcepts: [
          { title: "Circumference C = πd = 2πr" },
          { title: "π is the ratio C/D for any circle — constant ≈ 3.14159" },
          { title: "π is irrational — Āryabhaṭa's approximation 62832/20000" },
          { title: "Area of circle = πr²" },
        ],
      },
      {
        sectionNumber: "6.4",
        title: "Length of an Arc of a Circle",
        microConcepts: [
          { title: "Arc length = (θ/360°) × 2πr" },
          { title: "Area of sector = (θ/360°) × πr²" },
          { title: "Area of minor segment = sector area − triangle area" },
        ],
      },
      {
        sectionNumber: "6.5",
        title: "Problems, Puzzles, and Paradoxes on Perimeter",
        microConcepts: [
          { title: "Perimeter vs area: same perimeter can give different areas" },
          { title: "Isoperimetric problem: circle has maximum area for given perimeter" },
          { title: "Unit consistency: always convert to same unit before calculating" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Circumference: C = 2πr",
      "Area of circle: A = πr²",
      "Arc length: l = (θ/360) × 2πr",
      "Area of sector: A = (θ/360) × πr²",
      "Heron's formula: A = √[s(s−a)(s−b)(s−c)], s = (a+b+c)/2",
      "Rectangle area: A = l × b",
    ],
    examTips: [
      "Use π = 22/7 when radius is a multiple of 7; else use 3.14",
      "Heron's formula works for any triangle — no need for height",
      "Sector + triangle → segment area calculation is frequently tested",
      "Always write units (cm², m²) in the final answer",
    ],
    exercises: [
      { exerciseNumber: "Exercise 6.1", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 6.2", questionCount: 6, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 6.3", questionCount: 8, types: ["Long Answer"] },
      { exerciseNumber: "Exercise 6.4", questionCount: 5, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 7,
    title: "The Mathematics of Maybe: Introduction to Probability",
    subject: "Mathematics",
    grade: "9",
    board: "CBSE",
    unit: "Statistics and Probability",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Introduces probability as a measurement of likelihood. Covers experimental probability, theoretical probability, sample spaces, and simple probability calculations using coins, dice, and cards.",
    sections: [
      {
        sectionNumber: "7.1",
        title: "What is Probability?",
        microConcepts: [
          { title: "Randomness: outcomes we cannot predict with certainty" },
          { title: "Probability scale: 0 (impossible) to 1 (certain)" },
          { title: "Complementary events: P(E) + P(Ē) = 1" },
        ],
      },
      {
        sectionNumber: "7.2",
        title: "Measuring Probability Objectively",
        microConcepts: [
          { title: "Experimental (empirical) probability: P(E) = frequency / total trials" },
          { title: "Law of large numbers: as trials increase, experimental → theoretical" },
          { title: "Theoretical probability: assumes equally likely outcomes" },
        ],
      },
      {
        sectionNumber: "7.3",
        title: "Elements of Probability: Sample Spaces and Events",
        microConcepts: [
          { title: "Sample space S: set of all possible outcomes" },
          { title: "Event E: subset of S; P(E) = n(E)/n(S)" },
          { title: "Coin: S = {H, T}; Dice: S = {1,2,3,4,5,6}" },
          { title: "Mutually exclusive events: A ∩ B = ∅" },
          { title: "Certain event: P = 1; Impossible event: P = 0" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Theoretical probability: P(E) = n(E) / n(S)",
      "Complementary: P(Ē) = 1 − P(E)",
      "0 ≤ P(E) ≤ 1",
      "Experimental probability: P(E) ≈ frequency / total trials",
    ],
    examTips: [
      "Always list the sample space explicitly for small experiments",
      "P(E) + P(Ē) = 1 → very useful shortcut",
      "For two dice: n(S) = 36; for three coins: n(S) = 8 = 2³",
      "Probability is always between 0 and 1 — check your answer",
    ],
    exercises: [
      { exerciseNumber: "Exercise 7.1", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 7.2", questionCount: 8, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 7.3", questionCount: 10, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 8,
    title: "Predicting What Comes Next: Exploring Sequences and Progressions",
    subject: "Mathematics",
    grade: "9",
    board: "CBSE",
    unit: "Algebra — Sequences",
    examMarks: 10,
    estimatedWeeks: 3,
    overview: "Explores sequences: explicit rules, recursive rules, arithmetic progressions (AP), and geometric progressions (GP). Derives the sum of first n natural numbers and introduces GP as preparation for Class 10 topics.",
    sections: [
      {
        sectionNumber: "8.1",
        title: "Introduction to Sequences",
        microConcepts: [
          { title: "Sequence: ordered list of numbers following a pattern" },
          { title: "Finite vs infinite sequences" },
          { title: "General term aₙ: the nth term of a sequence" },
        ],
      },
      {
        sectionNumber: "8.2",
        title: "Explicit Rule for a Sequence",
        microConcepts: [
          { title: "Explicit formula: aₙ expressed directly in terms of n" },
          { title: "Example: aₙ = 2n + 1 gives 3, 5, 7, 9, …" },
          { title: "Finding any term without listing all previous terms" },
        ],
      },
      {
        sectionNumber: "8.3",
        title: "Recursive Rule for a Sequence",
        microConcepts: [
          { title: "Recursive formula: aₙ defined using previous term(s)" },
          { title: "Example: aₙ = aₙ₋₁ + 3, a₁ = 2 gives 2, 5, 8, 11, …" },
          { title: "Fibonacci sequence: aₙ = aₙ₋₁ + aₙ₋₂" },
        ],
      },
      {
        sectionNumber: "8.4",
        title: "Arithmetic Progressions",
        microConcepts: [
          { title: "AP: constant common difference d = aₙ₊₁ − aₙ" },
          { title: "nth term: aₙ = a + (n−1)d" },
          { title: "Identifying APs; finding missing terms" },
        ],
      },
      {
        sectionNumber: "8.5",
        title: "Sum of the First n Natural Numbers",
        microConcepts: [
          { title: "Gauss's trick: pair first and last terms" },
          { title: "Sₙ = n(n+1)/2 for 1+2+3+…+n" },
          { title: "Sum of first n odd numbers = n²" },
        ],
      },
      {
        sectionNumber: "8.6",
        title: "Geometric Progressions",
        microConcepts: [
          { title: "GP: constant common ratio r = aₙ₊₁/aₙ" },
          { title: "nth term: aₙ = a·rⁿ⁻¹" },
          { title: "Identifying GPs; real-world GP (compound interest, population)" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "AP nth term: aₙ = a + (n−1)d",
      "Sum of AP: Sₙ = n/2 × [2a + (n−1)d]",
      "GP nth term: aₙ = a·rⁿ⁻¹",
      "Sum 1 to n: Sₙ = n(n+1)/2",
      "Sum of first n odd numbers: n²",
      "Sum of first n even numbers: n(n+1)",
    ],
    examTips: [
      "For AP: always verify d is constant by checking consecutive differences",
      "For 3 terms in AP: use a−d, a, a+d — sum gives 3a",
      "GP check: ratio must be same between ALL consecutive terms",
      "Gauss sum formula Sₙ = n(n+1)/2 is often tested directly",
    ],
    exercises: [
      { exerciseNumber: "Exercise 8.1", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 8.2", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 8.3", questionCount: 5, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 8.4", questionCount: 8, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 8.5", questionCount: 5, types: ["Short Answer", "Long Answer"] },
    ],
  },
];

async function seedCurriculum() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10_000 });
  console.log("MongoDB connected");
  for (const ch of CHAPTERS) {
    await Chapter.findOneAndUpdate(
      { subject: ch.subject, grade: ch.grade, board: ch.board, chapterNumber: ch.chapterNumber },
      ch,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ Ch${ch.chapterNumber}: ${ch.title}`);
  }
  console.log(`\nSeeded ${CHAPTERS.length} chapters for CBSE Class 9 Mathematics.`);
  await mongoose.disconnect();
}
seedCurriculum().catch((err) => { console.error(err); process.exit(1); });
