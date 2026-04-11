/**
 * CBSE Class 10 Mathematics — Complete Curriculum Seed
 * Source: NCERT Class 10 Mathematics Textbook
 * Run: node backend/config/seedMathCurriculum.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Chapter } from "../models/chapterModel.js";

const CHAPTERS = [
  {
    chapterNumber: 1,
    title: "Real Numbers",
    subject: "Mathematics",
    grade: "10",
    board: "CBSE",
    unit: "Number Systems",
    examMarks: 6,
    estimatedWeeks: 2,
    overview:
      "Explores the properties of real numbers including the Fundamental Theorem of Arithmetic, Euclid's Division Lemma, and decimal expansions of rational and irrational numbers.",
    sections: [
      {
        sectionNumber: "1.1",
        title: "Introduction",
        microConcepts: [
          { title: "Recap of natural, whole, integer, rational, irrational numbers" },
          { title: "Number line and real numbers" },
        ],
      },
      {
        sectionNumber: "1.2",
        title: "The Fundamental Theorem of Arithmetic",
        microConcepts: [
          { title: "Every composite number has a unique prime factorisation" },
          { title: "Euclid's Division Lemma: a = bq + r, 0 ≤ r < b" },
          { title: "Finding HCF using prime factorisation" },
          { title: "Finding LCM using prime factorisation" },
          { title: "Relation: HCF(a,b) × LCM(a,b) = a × b" },
        ],
      },
      {
        sectionNumber: "1.3",
        title: "Irrational Numbers",
        microConcepts: [
          { title: "Definition: non-terminating, non-repeating decimals" },
          { title: "Proof by contradiction that √2 is irrational" },
          { title: "Proofs that √3, √5, √p (prime p) are irrational" },
          { title: "Sum/product of rational and irrational is irrational" },
        ],
      },
      {
        sectionNumber: "1.4",
        title: "Rational Numbers and Their Decimal Expansions",
        microConcepts: [
          { title: "Terminating decimal ↔ denominator of form 2ⁿ × 5ᵐ" },
          { title: "Non-terminating repeating decimal ↔ other denominators" },
          { title: "Converting repeating decimals to p/q form" },
        ],
      },
    ],
    theorems: [
      { name: "Fundamental Theorem of Arithmetic", statement: "Every integer greater than 1 is either prime or can be expressed as a unique product of primes." },
      { name: "Euclid's Division Lemma", statement: "For positive integers a and b, there exist unique q and r such that a = bq + r, 0 ≤ r < b." },
      { name: "Irrational Root Theorem", statement: "If p is a prime and p divides a², then p divides a." },
    ],
    keyFormulas: [
      "HCF(a,b) × LCM(a,b) = a × b",
      "a = bq + r (Euclid's Division)",
      "Terminating decimal condition: denominator = 2ⁿ5ᵐ",
    ],
    examTips: [
      "Always verify HCF × LCM = product of numbers as a check",
      "For irrational proofs, always use contradiction method",
      "Identify terminating vs non-terminating by simplifying fraction first",
      "HCF is always ≤ LCM; if equal, both numbers are the same",
    ],
    exercises: [
      { exerciseNumber: "Exercise 1.1", questionCount: 5, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 1.2", questionCount: 7, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 2,
    title: "Polynomials",
    subject: "Mathematics",
    grade: "10",
    board: "CBSE",
    unit: "Algebra",
    examMarks: 6,
    estimatedWeeks: 2,
    overview:
      "Covers the geometric interpretation of zeros of polynomials and the relationship between zeros and coefficients for linear, quadratic, and cubic polynomials.",
    sections: [
      {
        sectionNumber: "2.1",
        title: "Introduction",
        microConcepts: [
          { title: "Degree of a polynomial" },
          { title: "Linear, quadratic, cubic polynomials" },
        ],
      },
      {
        sectionNumber: "2.2",
        title: "Geometrical Meaning of the Zeroes of a Polynomial",
        microConcepts: [
          { title: "Zeros are x-coordinates where graph cuts x-axis" },
          { title: "Linear polynomial: exactly 1 zero" },
          { title: "Quadratic polynomial: 0, 1, or 2 zeros" },
          { title: "Cubic polynomial: 1, 2, or 3 zeros" },
        ],
      },
      {
        sectionNumber: "2.3",
        title: "Relationship Between Zeroes and Coefficients",
        microConcepts: [
          { title: "Quadratic ax²+bx+c: α+β = -b/a, αβ = c/a" },
          { title: "Cubic ax³+bx²+cx+d: α+β+γ = -b/a" },
          { title: "Cubic: αβ+βγ+γα = c/a, αβγ = -d/a" },
          { title: "Forming polynomials from given zeros" },
        ],
      },
      {
        sectionNumber: "2.4",
        title: "Division Algorithm for Polynomials",
        microConcepts: [
          { title: "p(x) = g(x)·q(x) + r(x), deg r < deg g" },
          { title: "Long division of polynomials" },
          { title: "Finding remaining zeros using one known zero" },
        ],
      },
    ],
    theorems: [
      { name: "Division Algorithm for Polynomials", statement: "For polynomials p(x) and g(x) ≠ 0, unique q(x) and r(x) exist such that p(x) = g(x)·q(x) + r(x), where r(x) = 0 or deg r < deg g." },
    ],
    keyFormulas: [
      "Sum of zeros (quadratic): α+β = -b/a",
      "Product of zeros (quadratic): αβ = c/a",
      "Sum of zeros (cubic): α+β+γ = -b/a",
      "Sum of products of pairs (cubic): αβ+βγ+γα = c/a",
      "Product of zeros (cubic): αβγ = -d/a",
    ],
    examTips: [
      "A quadratic with equal zeros has discriminant = 0",
      "Always verify by substituting zeros back into polynomial",
      "When dividing, ensure dividend is written in decreasing degree order",
    ],
    exercises: [
      { exerciseNumber: "Exercise 2.1", questionCount: 1, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 2.2", questionCount: 2, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 3,
    title: "Pair of Linear Equations in Two Variables",
    subject: "Mathematics",
    grade: "10",
    board: "CBSE",
    unit: "Algebra",
    examMarks: 8,
    estimatedWeeks: 3,
    overview:
      "Studies systems of two linear equations, their graphical and algebraic solutions, and consistency conditions.",
    sections: [
      {
        sectionNumber: "3.1",
        title: "Introduction",
        microConcepts: [
          { title: "Linear equation in two variables: ax + by + c = 0" },
          { title: "Solution as ordered pair (x, y)" },
        ],
      },
      {
        sectionNumber: "3.2",
        title: "Pair of Linear Equations in Two Variables",
        microConcepts: [
          { title: "Consistent system: at least one solution" },
          { title: "Inconsistent system: no solution (parallel lines)" },
          { title: "Dependent/coincident: infinite solutions" },
          { title: "Conditions: a₁/a₂ ≠ b₁/b₂ (unique), a₁/a₂ = b₁/b₂ ≠ c₁/c₂ (no solution), a₁/a₂ = b₁/b₂ = c₁/c₂ (infinite)" },
        ],
      },
      {
        sectionNumber: "3.3",
        title: "Graphical Method",
        microConcepts: [
          { title: "Plot two lines; intersection = solution" },
          { title: "Parallel lines → no solution" },
          { title: "Coincident lines → infinite solutions" },
        ],
      },
      {
        sectionNumber: "3.4",
        title: "Algebraic Methods",
        microConcepts: [
          { title: "Substitution method: express one variable in terms of other" },
          { title: "Elimination method: make coefficients equal, add/subtract" },
          { title: "Cross-multiplication: x/(b₁c₂-b₂c₁) = y/(c₁a₂-c₂a₁) = 1/(a₁b₂-a₂b₁)" },
        ],
      },
      {
        sectionNumber: "3.5",
        title: "Equations Reducible to a Pair of Linear Equations",
        microConcepts: [
          { title: "Substitution to linearise (e.g. 1/x = p, 1/y = q)" },
          { title: "Word problems: age, coins, speed" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Cross-multiplication: x = (b₁c₂-b₂c₁)/(a₁b₂-a₂b₁)",
      "Consistency condition: a₁/a₂, b₁/b₂, c₁/c₂ comparison",
    ],
    examTips: [
      "Always check consistency before solving",
      "Cross-multiplication is fastest for board exams",
      "Frame two equations carefully from word problems — identify unknowns first",
    ],
    exercises: [
      { exerciseNumber: "Exercise 3.1", questionCount: 3, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 3.2", questionCount: 7, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 3.3", questionCount: 3, types: ["Long Answer"] },
      { exerciseNumber: "Exercise 3.4", questionCount: 2, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 4,
    title: "Quadratic Equations",
    subject: "Mathematics",
    grade: "10",
    board: "CBSE",
    unit: "Algebra",
    examMarks: 6,
    estimatedWeeks: 2,
    overview:
      "Covers standard form, factorisation, completing the square, the quadratic formula, and the nature of roots using the discriminant.",
    sections: [
      {
        sectionNumber: "4.1",
        title: "Introduction",
        microConcepts: [
          { title: "Standard form: ax² + bx + c = 0, a ≠ 0" },
          { title: "Examples from real life (area, speed problems)" },
        ],
      },
      {
        sectionNumber: "4.2",
        title: "Quadratic Equations",
        microConcepts: [
          { title: "Identifying quadratic equations" },
          { title: "Writing equations in standard form" },
        ],
      },
      {
        sectionNumber: "4.3",
        title: "Solution by Factorisation",
        microConcepts: [
          { title: "Splitting middle term: find p, q such that p+q=b, pq=ac" },
          { title: "Zero-product property: if AB=0, then A=0 or B=0" },
        ],
      },
      {
        sectionNumber: "4.4",
        title: "Solution by Completing the Square",
        microConcepts: [
          { title: "Adding and subtracting (b/2a)² to form perfect square" },
          { title: "Deriving the quadratic formula" },
          { title: "x = [-b ± √(b²-4ac)] / 2a" },
        ],
      },
      {
        sectionNumber: "4.5",
        title: "Nature of Roots",
        microConcepts: [
          { title: "Discriminant D = b²-4ac" },
          { title: "D > 0: two distinct real roots" },
          { title: "D = 0: two equal real roots (x = -b/2a)" },
          { title: "D < 0: no real roots" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Quadratic formula: x = [-b ± √(b²-4ac)] / 2a",
      "Discriminant: D = b² - 4ac",
      "Sum of roots: α+β = -b/a",
      "Product of roots: αβ = c/a",
    ],
    examTips: [
      "Always try factorisation first — it's faster",
      "If asked to find k for equal roots, set D = 0",
      "Check your roots by substituting back",
      "D < 0 means 'no real solution' — state this clearly",
    ],
    exercises: [
      { exerciseNumber: "Exercise 4.1", questionCount: 2, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 4.2", questionCount: 6, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 4.3", questionCount: 5, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 4.4", questionCount: 5, types: ["Short Answer"] },
    ],
  },

  {
    chapterNumber: 5,
    title: "Arithmetic Progressions",
    subject: "Mathematics",
    grade: "10",
    board: "CBSE",
    unit: "Algebra",
    examMarks: 5,
    estimatedWeeks: 2,
    overview:
      "Studies sequences with constant difference, nth term formula, and sum of first n terms using two different formulae.",
    sections: [
      {
        sectionNumber: "5.1",
        title: "Introduction",
        microConcepts: [
          { title: "Sequence vs series" },
          { title: "Common difference d = aₙ₊₁ - aₙ" },
        ],
      },
      {
        sectionNumber: "5.2",
        title: "Arithmetic Progressions",
        microConcepts: [
          { title: "Definition: each term differs by constant d" },
          { title: "Finite vs infinite AP" },
          { title: "Identifying APs from sequences" },
        ],
      },
      {
        sectionNumber: "5.3",
        title: "nth Term of an AP",
        microConcepts: [
          { title: "aₙ = a + (n-1)d" },
          { title: "Finding n when aₙ is given" },
          { title: "Last term l = a + (n-1)d" },
        ],
      },
      {
        sectionNumber: "5.4",
        title: "Sum of First n Terms of an AP",
        microConcepts: [
          { title: "Sₙ = n/2 × [2a + (n-1)d]" },
          { title: "Sₙ = n/2 × [a + l] (when last term known)" },
          { title: "aₙ = Sₙ - Sₙ₋₁" },
          { title: "Arithmetic mean: A = (a+b)/2" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "nth term: aₙ = a + (n-1)d",
      "Sum: Sₙ = n/2 × [2a + (n-1)d]",
      "Sum (with last term): Sₙ = n/2 × [a + l]",
      "nth term from sum: aₙ = Sₙ - Sₙ₋₁",
    ],
    examTips: [
      "For 3 terms in AP, take a-d, a, a+d to simplify",
      "For 4 terms in AP, take a-3d, a-d, a+d, a+3d",
      "Always verify by checking common difference",
      "Sum formula with last term is faster when l is given",
    ],
    exercises: [
      { exerciseNumber: "Exercise 5.1", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 5.2", questionCount: 20, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 5.3", questionCount: 20, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 5.4", questionCount: 5, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 6,
    title: "Triangles",
    subject: "Mathematics",
    grade: "10",
    board: "CBSE",
    unit: "Geometry",
    examMarks: 15,
    estimatedWeeks: 3,
    overview:
      "Studies similar figures, criteria for similarity of triangles, the relationship between areas of similar triangles, and the Pythagoras theorem with its converse.",
    sections: [
      {
        sectionNumber: "6.1",
        title: "Introduction",
        microConcepts: [
          { title: "Congruent vs similar figures" },
          { title: "Scale factor" },
        ],
      },
      {
        sectionNumber: "6.2",
        title: "Similar Figures",
        microConcepts: [
          { title: "All squares are similar; all circles are similar" },
          { title: "Equilateral triangles are similar" },
          { title: "Similar polygons: corresponding angles equal, corresponding sides proportional" },
        ],
      },
      {
        sectionNumber: "6.3",
        title: "Similarity of Triangles",
        microConcepts: [
          { title: "AA (Angle-Angle) criterion" },
          { title: "SSS (Side-Side-Side) criterion" },
          { title: "SAS (Side-Angle-Side) criterion" },
          { title: "Basic Proportionality Theorem (BPT / Thales): DE ∥ BC → AD/DB = AE/EC" },
          { title: "Converse of BPT" },
        ],
      },
      {
        sectionNumber: "6.4",
        title: "Criteria for Similarity of Triangles",
        microConcepts: [
          { title: "Proof of AA similarity" },
          { title: "Applying similarity to find unknown sides" },
        ],
      },
      {
        sectionNumber: "6.5",
        title: "Areas of Similar Triangles",
        microConcepts: [
          { title: "ar(△ABC)/ar(△PQR) = (AB/PQ)² = (BC/QR)² = (CA/RP)²" },
          { title: "Ratio of areas = square of ratio of corresponding sides" },
        ],
      },
      {
        sectionNumber: "6.6",
        title: "Pythagoras Theorem",
        microConcepts: [
          { title: "In right △: AC² = AB² + BC²" },
          { title: "Proof using similar triangles" },
          { title: "Converse: if AC² = AB² + BC², angle B = 90°" },
        ],
      },
    ],
    theorems: [
      { name: "Basic Proportionality Theorem (Thales)", statement: "If a line is drawn parallel to one side of a triangle intersecting the other two sides, it divides those two sides in the same ratio." },
      { name: "Converse of BPT", statement: "If a line divides two sides of a triangle in the same ratio, it is parallel to the third side." },
      { name: "AA Similarity", statement: "If two angles of one triangle are equal to two angles of another triangle, the triangles are similar." },
      { name: "Areas of Similar Triangles", statement: "The ratio of areas of two similar triangles equals the square of the ratio of their corresponding sides." },
      { name: "Pythagoras Theorem", statement: "In a right-angled triangle, the square of the hypotenuse equals the sum of squares of the other two sides." },
      { name: "Converse of Pythagoras", statement: "If the square of one side equals the sum of squares of the other two sides, the angle opposite to the first side is 90°." },
    ],
    keyFormulas: [
      "BPT: AD/DB = AE/EC (DE ∥ BC)",
      "Area ratio: ar(△1)/ar(△2) = (side₁/side₂)²",
      "Pythagoras: a² + b² = c²",
    ],
    examTips: [
      "State the theorem name before using it in proofs",
      "For BPT problems, identify which line is parallel first",
      "Pythagorean triplets to memorise: (3,4,5), (5,12,13), (8,15,17)",
      "In similarity proofs, always establish AA, SSS, or SAS explicitly",
    ],
    exercises: [
      { exerciseNumber: "Exercise 6.1", questionCount: 3, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 6.2", questionCount: 10, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 6.3", questionCount: 16, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 6.4", questionCount: 9, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 6.5", questionCount: 17, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 6.6", questionCount: 10, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 7,
    title: "Coordinate Geometry",
    subject: "Mathematics",
    grade: "10",
    board: "CBSE",
    unit: "Coordinate Geometry",
    examMarks: 10,
    estimatedWeeks: 2,
    overview:
      "Applies algebra to geometry using the coordinate plane. Covers distance formula, section formula, and area of a triangle using coordinates.",
    sections: [
      {
        sectionNumber: "7.1",
        title: "Introduction",
        microConcepts: [
          { title: "Cartesian plane recap" },
          { title: "Quadrants and axes" },
        ],
      },
      {
        sectionNumber: "7.2",
        title: "Distance Formula",
        microConcepts: [
          { title: "d = √[(x₂-x₁)² + (y₂-y₁)²]" },
          { title: "Distance from origin: √(x²+y²)" },
          { title: "Proving collinearity using distance" },
          { title: "Identifying type of quadrilateral from vertices" },
        ],
      },
      {
        sectionNumber: "7.3",
        title: "Section Formula",
        microConcepts: [
          { title: "Internal division: P = ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))" },
          { title: "Midpoint formula: ((x₁+x₂)/2, (y₁+y₂)/2)" },
          { title: "External division (reference only)" },
          { title: "Finding trisection points" },
        ],
      },
      {
        sectionNumber: "7.4",
        title: "Area of a Triangle",
        microConcepts: [
          { title: "Area = ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|" },
          { title: "Collinear points → area = 0" },
          { title: "Finding k when three points are collinear" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Distance: d = √[(x₂-x₁)² + (y₂-y₁)²]",
      "Section formula: ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))",
      "Midpoint: ((x₁+x₂)/2, (y₁+y₂)/2)",
      "Area of △: ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|",
    ],
    examTips: [
      "For rhombus: all sides equal, diagonals bisect each other",
      "For square: all sides equal + diagonals equal",
      "Area formula is fastest for collinearity check",
      "Always take absolute value in area formula",
    ],
    exercises: [
      { exerciseNumber: "Exercise 7.1", questionCount: 10, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 7.2", questionCount: 10, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 7.3", questionCount: 5, types: ["Long Answer"] },
      { exerciseNumber: "Exercise 7.4", questionCount: 8, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 8,
    title: "Introduction to Trigonometry",
    subject: "Mathematics",
    grade: "10",
    board: "CBSE",
    unit: "Trigonometry",
    examMarks: 12,
    estimatedWeeks: 3,
    overview:
      "Introduces trigonometric ratios, their values for standard angles, complementary angle relations, and the three fundamental identities.",
    sections: [
      {
        sectionNumber: "8.1",
        title: "Introduction",
        microConcepts: [
          { title: "Trigonometry: measurement of triangles" },
          { title: "Application in navigation, surveying, architecture" },
        ],
      },
      {
        sectionNumber: "8.2",
        title: "Trigonometric Ratios",
        microConcepts: [
          { title: "sin θ = opposite/hypotenuse" },
          { title: "cos θ = adjacent/hypotenuse" },
          { title: "tan θ = opposite/adjacent = sin θ/cos θ" },
          { title: "cosec θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ" },
          { title: "Ratios depend only on angle, not triangle size" },
        ],
      },
      {
        sectionNumber: "8.3",
        title: "Trigonometric Ratios of Some Specific Angles",
        microConcepts: [
          { title: "sin 0°=0, cos 0°=1, tan 0°=0" },
          { title: "sin 30°=1/2, cos 30°=√3/2, tan 30°=1/√3" },
          { title: "sin 45°=1/√2, cos 45°=1/√2, tan 45°=1" },
          { title: "sin 60°=√3/2, cos 60°=1/2, tan 60°=√3" },
          { title: "sin 90°=1, cos 90°=0, tan 90°=undefined" },
        ],
      },
      {
        sectionNumber: "8.4",
        title: "Trigonometric Ratios of Complementary Angles",
        microConcepts: [
          { title: "sin(90°-θ) = cos θ, cos(90°-θ) = sin θ" },
          { title: "tan(90°-θ) = cot θ, cot(90°-θ) = tan θ" },
          { title: "sec(90°-θ) = cosec θ, cosec(90°-θ) = sec θ" },
        ],
      },
      {
        sectionNumber: "8.5",
        title: "Trigonometric Identities",
        microConcepts: [
          { title: "sin²θ + cos²θ = 1" },
          { title: "1 + tan²θ = sec²θ" },
          { title: "1 + cot²θ = cosec²θ" },
          { title: "Proving identities: work on one side only" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "sin²θ + cos²θ = 1",
      "1 + tan²θ = sec²θ",
      "1 + cot²θ = cosec²θ",
      "tan θ = sin θ / cos θ",
      "sin(90°-θ) = cos θ",
    ],
    examTips: [
      "Memorise the table for 0°, 30°, 45°, 60°, 90° — it appears in every exam",
      "For identity proofs, start with the more complex side",
      "sin increases 0→1 as θ goes 0°→90°; cos decreases 1→0",
      "To prove identities, convert everything to sin and cos",
    ],
    exercises: [
      { exerciseNumber: "Exercise 8.1", questionCount: 11, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 8.2", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 8.3", questionCount: 7, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 8.4", questionCount: 5, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 9,
    title: "Some Applications of Trigonometry",
    subject: "Mathematics",
    grade: "10",
    board: "CBSE",
    unit: "Trigonometry",
    examMarks: 5,
    estimatedWeeks: 1,
    overview:
      "Applies trigonometric ratios to real-world problems involving heights of towers, distances, and angles of elevation and depression.",
    sections: [
      {
        sectionNumber: "9.1",
        title: "Introduction",
        microConcepts: [
          { title: "Real-life uses: astronomy, engineering, navigation" },
        ],
      },
      {
        sectionNumber: "9.2",
        title: "Heights and Distances",
        microConcepts: [
          { title: "Angle of elevation: looking up from horizontal" },
          { title: "Angle of depression: looking down from horizontal" },
          { title: "Line of sight, horizontal line" },
          { title: "Setting up right triangle from word problem" },
          { title: "Problems with one observer" },
          { title: "Problems with two observers (two triangles)" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "tan(angle of elevation) = height / horizontal distance",
      "tan(angle of depression) = vertical drop / horizontal distance",
    ],
    examTips: [
      "Always draw a neat diagram first",
      "Angle of elevation = angle of depression (alternate interior angles)",
      "Use tan for height-distance problems; sin/cos rarely needed",
      "Heights must be positive — check your setup",
    ],
    exercises: [
      { exerciseNumber: "Exercise 9.1", questionCount: 16, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 10,
    title: "Circles",
    subject: "Mathematics",
    grade: "10",
    board: "CBSE",
    unit: "Geometry",
    examMarks: 5,
    estimatedWeeks: 1,
    overview:
      "Studies tangents to a circle — their properties, the number of tangents from an external point, and key theorems.",
    sections: [
      {
        sectionNumber: "10.1",
        title: "Introduction",
        microConcepts: [
          { title: "Circle terms: centre, radius, chord, arc, sector" },
          { title: "Secant vs tangent" },
        ],
      },
      {
        sectionNumber: "10.2",
        title: "Tangent to a Circle",
        microConcepts: [
          { title: "Tangent touches circle at exactly one point" },
          { title: "Tangent is perpendicular to radius at point of contact" },
          { title: "No tangent can be drawn from a point inside the circle" },
          { title: "Exactly one tangent from a point on the circle" },
          { title: "Exactly two tangents from an external point" },
        ],
      },
      {
        sectionNumber: "10.3",
        title: "Number of Tangents from a Point on a Circle",
        microConcepts: [
          { title: "Length of tangent from external point P: PT = √(PO²-r²)" },
          { title: "Two tangents from external point are equal in length" },
          { title: "PA = PB (P external, A and B tangent points)" },
        ],
      },
    ],
    theorems: [
      { name: "Tangent-Radius Theorem", statement: "The tangent at any point of a circle is perpendicular to the radius through the point of contact." },
      { name: "Equal Tangents Theorem", statement: "The lengths of the two tangents drawn from an external point to a circle are equal." },
    ],
    keyFormulas: [
      "Tangent length from external point: PT = √(PO²-r²)",
      "PA = PB (tangents from same external point)",
    ],
    examTips: [
      "Draw OP ⊥ tangent in every problem",
      "Equal tangents theorem is used in almost every circles problem",
      "∠OAP = 90° where A is point of tangency and O is centre",
    ],
    exercises: [
      { exerciseNumber: "Exercise 10.1", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 10.2", questionCount: 13, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 11,
    title: "Areas Related to Circles",
    subject: "Mathematics",
    grade: "10",
    board: "CBSE",
    unit: "Mensuration",
    examMarks: 10,
    estimatedWeeks: 2,
    overview:
      "Calculates areas and perimeters of sectors, segments, and combinations of plane figures involving circles.",
    sections: [
      {
        sectionNumber: "11.1",
        title: "Introduction",
        microConcepts: [
          { title: "Review: circumference = 2πr, area = πr²" },
        ],
      },
      {
        sectionNumber: "11.2",
        title: "Perimeter and Area of a Circle — A Review",
        microConcepts: [
          { title: "Circumference = 2πr" },
          { title: "Area = πr²" },
          { title: "π ≈ 22/7 or 3.14" },
        ],
      },
      {
        sectionNumber: "11.3",
        title: "Areas of Sector and Segment of a Circle",
        microConcepts: [
          { title: "Sector: region between two radii and the arc" },
          { title: "Area of sector = (θ/360°) × πr²" },
          { title: "Length of arc = (θ/360°) × 2πr" },
          { title: "Segment: region between chord and arc" },
          { title: "Area of minor segment = area of sector − area of triangle" },
          { title: "Area of major segment = πr² − minor segment area" },
        ],
      },
      {
        sectionNumber: "11.4",
        title: "Areas of Combinations of Plane Figures",
        microConcepts: [
          { title: "Shaded area = total area − unshaded area" },
          { title: "Combining circles, triangles, squares, rectangles" },
          { title: "Quadrant and semicircle areas" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Area of sector = (θ/360) × πr²",
      "Arc length = (θ/360) × 2πr",
      "Area of triangle in sector: ½r²sin θ",
      "Segment area = sector area − triangle area",
    ],
    examTips: [
      "For 30-60-90 triangle area: use ½r²sin60° = (√3/4)r²",
      "Always check if angle is in degrees, not radians",
      "Shaded region problems: draw and label all parts first",
      "Use π = 22/7 unless decimal answer is expected",
    ],
    exercises: [
      { exerciseNumber: "Exercise 11.1", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 11.2", questionCount: 14, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 11.3", questionCount: 16, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 12,
    title: "Surface Areas and Volumes",
    subject: "Mathematics",
    grade: "10",
    board: "CBSE",
    unit: "Mensuration",
    examMarks: 10,
    estimatedWeeks: 3,
    overview:
      "Computes surface areas and volumes of combinations of 3D solids and conversion between shapes, including the frustum of a cone.",
    sections: [
      {
        sectionNumber: "12.1",
        title: "Introduction",
        microConcepts: [
          { title: "Review: cube, cuboid, cylinder, cone, sphere formulas" },
        ],
      },
      {
        sectionNumber: "12.2",
        title: "Surface Area of a Combination of Solids",
        microConcepts: [
          { title: "Total surface area = sum of exposed surfaces" },
          { title: "Remove the joined surfaces from the total" },
          { title: "Examples: cone on cylinder, hemisphere on cylinder" },
        ],
      },
      {
        sectionNumber: "12.3",
        title: "Volume of a Combination of Solids",
        microConcepts: [
          { title: "Total volume = sum of individual volumes" },
          { title: "Capsule = cylinder + 2 hemispheres" },
          { title: "Rocket = cone + cylinder" },
        ],
      },
      {
        sectionNumber: "12.4",
        title: "Conversion of Solid from One Shape to Another",
        microConcepts: [
          { title: "Volume is conserved on melting/recasting" },
          { title: "Number of smaller solids = large volume / small volume" },
        ],
      },
      {
        sectionNumber: "12.5",
        title: "Frustum of a Cone",
        microConcepts: [
          { title: "Frustum: cone with top cut off" },
          { title: "Slant height: l = √[h² + (r₁-r₂)²]" },
          { title: "Curved surface area = π(r₁+r₂)l" },
          { title: "Total surface area = π(r₁+r₂)l + π(r₁²+r₂²)" },
          { title: "Volume = πh/3 × (r₁²+r₂²+r₁r₂)" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Cylinder: CSA = 2πrh, TSA = 2πr(r+h), V = πr²h",
      "Cone: CSA = πrl, TSA = πr(r+l), V = ⅓πr²h, l = √(r²+h²)",
      "Sphere: SA = 4πr², V = (4/3)πr³",
      "Hemisphere: CSA = 2πr², TSA = 3πr², V = (2/3)πr³",
      "Frustum: CSA = π(r₁+r₂)l, V = πh/3(r₁²+r₂²+r₁r₂)",
    ],
    examTips: [
      "For conversion problems, equate volumes",
      "Frustum formulas are frequently tested — memorise all three",
      "TSA of combined solid: add surfaces of each, subtract hidden circular faces",
      "Slant height of frustum includes h, not height of original cone",
    ],
    exercises: [
      { exerciseNumber: "Exercise 12.1", questionCount: 9, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 12.2", questionCount: 8, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 12.3", questionCount: 9, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 13,
    title: "Statistics",
    subject: "Mathematics",
    grade: "10",
    board: "CBSE",
    unit: "Statistics and Probability",
    examMarks: 11,
    estimatedWeeks: 3,
    overview:
      "Covers mean, mode, and median for grouped data using direct, assumed mean, and step-deviation methods, plus graphical representation using ogives.",
    sections: [
      {
        sectionNumber: "13.1",
        title: "Introduction",
        microConcepts: [
          { title: "Grouped vs ungrouped data" },
          { title: "Class interval, class mark (midpoint)" },
        ],
      },
      {
        sectionNumber: "13.2",
        title: "Mean of Grouped Data",
        microConcepts: [
          { title: "Direct method: x̄ = Σfxᵢ/Σf" },
          { title: "Assumed mean method: x̄ = a + Σfdᵢ/Σf (dᵢ = xᵢ - a)" },
          { title: "Step-deviation method: x̄ = a + (Σfuᵢ/Σf)×h (uᵢ = dᵢ/h)" },
        ],
      },
      {
        sectionNumber: "13.3",
        title: "Mode of Grouped Data",
        microConcepts: [
          { title: "Modal class: class with highest frequency" },
          { title: "Mode = l + [(f₁-f₀)/(2f₁-f₀-f₂)] × h" },
        ],
      },
      {
        sectionNumber: "13.4",
        title: "Median of Grouped Data",
        microConcepts: [
          { title: "Cumulative frequency table" },
          { title: "Median class: cf just exceeds n/2" },
          { title: "Median = l + [(n/2 - cf)/f] × h" },
        ],
      },
      {
        sectionNumber: "13.5",
        title: "Graphical Representation of Cumulative Frequency",
        microConcepts: [
          { title: "Less than ogive: plot (upper limit, cf)" },
          { title: "More than ogive: plot (lower limit, cf)" },
          { title: "Intersection of two ogives → median" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Mean (direct): x̄ = Σfxᵢ / Σf",
      "Mean (assumed): x̄ = a + Σfdᵢ/Σf",
      "Mean (step-deviation): x̄ = a + (Σfuᵢ/Σf)×h",
      "Mode = l + [(f₁-f₀)/(2f₁-f₀-f₂)] × h",
      "Median = l + [(n/2 - cf)/f] × h",
    ],
    examTips: [
      "Step-deviation is fastest when class width h is uniform",
      "Always verify: mode and median should be in or near modal/median class range",
      "Ogive problems: draw both less-than and more-than ogives for median",
      "cf in median formula is cumulative frequency BEFORE the median class",
    ],
    exercises: [
      { exerciseNumber: "Exercise 13.1", questionCount: 9, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 13.2", questionCount: 6, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 13.3", questionCount: 7, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 13.4", questionCount: 3, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 14,
    title: "Probability",
    subject: "Mathematics",
    grade: "10",
    board: "CBSE",
    unit: "Statistics and Probability",
    examMarks: 5,
    estimatedWeeks: 1,
    overview:
      "Introduces classical probability, equally likely outcomes, complementary events, and simple probability problems using cards, dice, and other experiments.",
    sections: [
      {
        sectionNumber: "14.1",
        title: "Introduction",
        microConcepts: [
          { title: "Experimental vs theoretical probability" },
          { title: "As trials increase, experimental → theoretical probability" },
        ],
      },
      {
        sectionNumber: "14.2",
        title: "Probability — A Theoretical Approach",
        microConcepts: [
          { title: "Sample space S: set of all possible outcomes" },
          { title: "Event E: subset of sample space" },
          { title: "P(E) = Number of favourable outcomes / Total outcomes" },
          { title: "0 ≤ P(E) ≤ 1" },
          { title: "P(E) + P(Ē) = 1 (complementary events)" },
          { title: "Sure event: P = 1; impossible event: P = 0" },
          { title: "Playing cards: 52 cards, 4 suits, face cards" },
          { title: "Dice: 6 faces, sample space size = 6ⁿ for n dice" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "P(E) = favourable outcomes / total equally likely outcomes",
      "P(Ē) = 1 - P(E)",
      "0 ≤ P(E) ≤ 1",
    ],
    examTips: [
      "List sample space explicitly for small problems",
      "52-card deck: 4 suits × 13 cards; 12 face cards (J, Q, K) × 4",
      "P(at least one) = 1 - P(none)",
      "Distinguish 'at least' from 'exactly' in problem statements",
    ],
    exercises: [
      { exerciseNumber: "Exercise 14.1", questionCount: 25, types: ["Short Answer", "Long Answer"] },
    ],
  },
];

async function seedCurriculum() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  for (const ch of CHAPTERS) {
    await Chapter.findOneAndUpdate(
      { subject: ch.subject, grade: ch.grade, board: ch.board, chapterNumber: ch.chapterNumber },
      ch,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ Chapter ${ch.chapterNumber}: ${ch.title}`);
  }

  console.log(`\nSeeded ${CHAPTERS.length} chapters for CBSE Class 10 Mathematics.`);
  await mongoose.disconnect();
}

seedCurriculum().catch((err) => {
  console.error(err);
  process.exit(1);
});
