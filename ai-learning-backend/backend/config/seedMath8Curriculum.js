/**
 * CBSE Class 8 Mathematics — Curriculum Seed
 * Textbook: "Ganita Prakash Grade 8 Part I + Part II" (NCERT 2026)
 * 14 chapters (7 per part). Safe to re-run (upserts on subject+grade+board+chapterNumber).
 * Usage: node config/seedMath8Curriculum.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Chapter } from "../models/chapterModel.js";

const CHAPTERS = [
  {
    chapterNumber: 1,
    title: "A Square and A Cube",
    subject: "Mathematics",
    grade: "8",
    board: "CBSE",
    unit: "Number Systems",
    examMarks: 10,
    estimatedWeeks: 3,
    overview: "Explores perfect squares and perfect cubes through the locker puzzle and other patterns. Covers square roots (prime factorisation and long division methods) and cube roots. Builds number sense for recognising and working with square and cube numbers.",
    sections: [
      {
        sectionNumber: "1.1",
        title: "Square Numbers",
        microConcepts: [
          { title: "Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, …" },
          { title: "Properties: unit digits of squares can only be 0,1,4,5,6,9" },
          { title: "Odd numbers between consecutive squares: between n² and (n+1)² there are 2n odd numbers" },
          { title: "Sum of first n odd numbers = n²" },
          { title: "Pythagorean triplets from perfect squares: (3,4,5), (5,12,13)" },
        ],
      },
      {
        sectionNumber: "1.2",
        title: "Square Roots",
        microConcepts: [
          { title: "Square root definition: if x² = y then √y = x" },
          { title: "Method 1 — Prime factorisation: pair identical prime factors" },
          { title: "Method 2 — Long division: digit-pair grouping from right" },
          { title: "Square roots of decimals and fractions" },
          { title: "Estimating irrational square roots between consecutive integers" },
        ],
      },
      {
        sectionNumber: "1.3",
        title: "Cube Numbers",
        microConcepts: [
          { title: "Perfect cubes: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000" },
          { title: "Cube of negative integer: (−n)³ = −n³" },
          { title: "Difference of cubes pattern: n³ − (n−1)³ = 3n² − 3n + 1" },
        ],
      },
      {
        sectionNumber: "1.4",
        title: "Cube Roots",
        microConcepts: [
          { title: "Cube root definition: ∛y = x if x³ = y" },
          { title: "Prime factorisation: make groups of three identical primes" },
          { title: "Cube roots of negative numbers: ∛(−8) = −2" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Sum of first n odd numbers = n²",
      "Square root by prime factorisation: pair prime factors, one from each pair",
      "Cube root by prime factorisation: triple prime factors, one from each triple",
      "Pythagorean triplet for m > 1: (2m, m²−1, m²+1)",
    ],
    examTips: [
      "Squares of numbers 1–30 and cubes of numbers 1–10 must be memorised",
      "Unit digit of square: 2→4, 3→9, 4→6, 5→5, 6→6, 7→9, 8→4, 9→1",
      "A number whose unit digit is 2, 3, 7, or 8 is NEVER a perfect square",
      "For cube roots by prime factorisation, factors must form complete groups of 3",
    ],
    exercises: [
      { exerciseNumber: "Exercise 1.1", questionCount: 6, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 1.2", questionCount: 5, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 1.3", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 1.4", questionCount: 5, types: ["Short Answer"] },
    ],
  },

  {
    chapterNumber: 2,
    title: "Power Play",
    subject: "Mathematics",
    grade: "8",
    board: "CBSE",
    unit: "Number Systems",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Investigates powers and exponents through paper-folding and exponential growth. Establishes all laws of exponents, introduces negative and zero exponents, and applies powers in expressing very large and very small numbers in standard form (scientific notation).",
    sections: [
      {
        sectionNumber: "2.1",
        title: "Experiencing the Power Play",
        microConcepts: [
          { title: "aⁿ = a × a × a × … (n times); a is base, n is exponent" },
          { title: "Exponential growth: doublings grow faster than linear growth" },
          { title: "Comparing expressions: 2¹⁰ vs 10² (1024 vs 100)" },
        ],
      },
      {
        sectionNumber: "2.2",
        title: "Laws of Exponents",
        microConcepts: [
          { title: "Product law: aᵐ × aⁿ = aᵐ⁺ⁿ" },
          { title: "Quotient law: aᵐ ÷ aⁿ = aᵐ⁻ⁿ (a ≠ 0)" },
          { title: "Power of a power: (aᵐ)ⁿ = aᵐⁿ" },
          { title: "Power of a product: (ab)ⁿ = aⁿbⁿ" },
          { title: "Power of a quotient: (a/b)ⁿ = aⁿ/bⁿ" },
        ],
      },
      {
        sectionNumber: "2.3",
        title: "Zero and Negative Exponents",
        microConcepts: [
          { title: "Zero exponent: a⁰ = 1 for all a ≠ 0" },
          { title: "Negative exponent: a⁻ⁿ = 1/aⁿ" },
          { title: "Reciprocal: (a/b)⁻ⁿ = (b/a)ⁿ" },
        ],
      },
      {
        sectionNumber: "2.4",
        title: "Standard Form (Scientific Notation)",
        microConcepts: [
          { title: "Standard form: a × 10ⁿ where 1 ≤ a < 10 and n ∈ ℤ" },
          { title: "Very large numbers: 3,000,000 = 3 × 10⁶" },
          { title: "Very small numbers: 0.000045 = 4.5 × 10⁻⁵" },
          { title: "Operations in standard form: multiply/divide coefficients and add/subtract exponents" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "aᵐ × aⁿ = aᵐ⁺ⁿ",
      "aᵐ ÷ aⁿ = aᵐ⁻ⁿ",
      "(aᵐ)ⁿ = aᵐⁿ",
      "(ab)ⁿ = aⁿbⁿ",
      "a⁰ = 1 (a ≠ 0)",
      "a⁻ⁿ = 1/aⁿ",
      "Standard form: a × 10ⁿ, 1 ≤ a < 10",
    ],
    examTips: [
      "(-1)ⁿ = 1 if n is even; (-1)ⁿ = -1 if n is odd",
      "Any base to power 0 equals 1 (except 0⁰ which is indeterminate)",
      "To compare powers: convert to same base or same exponent",
      "In standard form, the coefficient must be ≥ 1 and < 10",
    ],
    exercises: [
      { exerciseNumber: "Exercise 2.1", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 2.2", questionCount: 6, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 2.3", questionCount: 5, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 3,
    title: "A Story of Numbers",
    subject: "Mathematics",
    grade: "8",
    board: "CBSE",
    unit: "Number Systems — History",
    examMarks: 6,
    estimatedWeeks: 2,
    overview: "A historical journey through the evolution of number representation — from tally marks and body-part counting to Babylonian base-60, Egyptian symbols, and the revolutionary Hindu-Arabic place-value system. Includes exploration of bases other than 10.",
    sections: [
      {
        sectionNumber: "3.1",
        title: "Reema's Curiosity — Early Number Systems",
        microConcepts: [
          { title: "One-to-one mapping: associating objects with counters (sticks, pebbles)" },
          { title: "Tally marks: grouping in fives for easy counting" },
          { title: "Body-part counting systems: toes, fingers, limbs as numerals" },
          { title: "Limitations of early systems: no place value, no zero" },
        ],
      },
      {
        sectionNumber: "3.2",
        title: "Ancient Written Number Systems",
        microConcepts: [
          { title: "Egyptian hieroglyphic numerals (additive, base 10)" },
          { title: "Babylonian cuneiform: positional base-60 system (sexagesimal)" },
          { title: "Roman numerals: subtractive notation (IV = 4, IX = 9)" },
          { title: "Greek alphabetic numerals" },
        ],
      },
      {
        sectionNumber: "3.3",
        title: "The Hindu-Arabic Place-Value System",
        microConcepts: [
          { title: "Place value: value of a digit depends on its position" },
          { title: "Ten symbols (0–9) can represent any number — why this is powerful" },
          { title: "Zero (śūnya): enables positional notation (307 ≠ 37)" },
          { title: "Indian contribution: Brahmagupta's rules for zero (628 CE)" },
          { title: "Spread to Europe via Arabic scholars (hence 'Arabic numerals')" },
        ],
      },
      {
        sectionNumber: "3.4",
        title: "Other Bases",
        microConcepts: [
          { title: "Base 2 (binary): digits 0 and 1; powers of 2" },
          { title: "Base 8 (octal) and base 16 (hexadecimal) in computing" },
          { title: "Converting between base 10 and other bases" },
          { title: "Why computers use base 2: two electrical states (on/off)" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Place value of digit d at position n (from right, starting at 0): d × 10ⁿ",
      "Binary: 1010₂ = 1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 10₁₀",
    ],
    examTips: [
      "Roman numerals: I=1, V=5, X=10, L=50, C=100, D=500, M=1000",
      "Subtractive rule in Roman: smaller before larger means subtract (IV=4, XC=90)",
      "In any base b, digits go from 0 to b−1",
      "Base 60 legacy: 60 seconds in a minute, 60 minutes in an hour, 360° in a circle",
    ],
    exercises: [
      { exerciseNumber: "Exercise 3.1", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 3.2", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 3.3", questionCount: 4, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 4,
    title: "Quadrilaterals",
    subject: "Mathematics",
    grade: "8",
    board: "CBSE",
    unit: "Geometry",
    examMarks: 12,
    estimatedWeeks: 3,
    overview: "Studies properties of quadrilaterals — rectangles, squares, parallelograms, rhombuses, trapeziums, and kites. Proves that the angle sum of any quadrilateral is 360° and explores the hierarchy of quadrilaterals. Includes construction and area problems.",
    sections: [
      {
        sectionNumber: "4.1",
        title: "Rectangles and Squares",
        microConcepts: [
          { title: "Rectangle: 4 right angles, opposite sides equal and parallel, diagonals equal and bisect each other" },
          { title: "Square: all properties of rectangle PLUS all sides equal, diagonals bisect at 90°" },
          { title: "Diagonal of rectangle: d = √(l² + b²)" },
          { title: "Diagonal of square: d = a√2" },
        ],
      },
      {
        sectionNumber: "4.2",
        title: "Parallelogram",
        microConcepts: [
          { title: "Parallelogram: opposite sides equal and parallel, opposite angles equal" },
          { title: "Adjacent angles of parallelogram are supplementary (sum 180°)" },
          { title: "Diagonals of parallelogram bisect each other (but are not equal)" },
          { title: "Area = base × height" },
        ],
      },
      {
        sectionNumber: "4.3",
        title: "Rhombus and Kite",
        microConcepts: [
          { title: "Rhombus: parallelogram with all sides equal; diagonals bisect at 90°" },
          { title: "Area of rhombus = (d₁ × d₂)/2 where d₁, d₂ are diagonals" },
          { title: "Kite: two pairs of adjacent equal sides; one diagonal bisects the other at 90°" },
          { title: "Area of kite = (d₁ × d₂)/2" },
        ],
      },
      {
        sectionNumber: "4.4",
        title: "Trapezium",
        microConcepts: [
          { title: "Trapezium: exactly one pair of parallel sides (called bases)" },
          { title: "Isosceles trapezium: non-parallel sides equal; base angles equal; diagonals equal" },
          { title: "Area of trapezium = ½ × (sum of parallel sides) × height" },
        ],
      },
      {
        sectionNumber: "4.5",
        title: "Angle Sum and Hierarchy",
        microConcepts: [
          { title: "Angle sum of any quadrilateral = 360° (split into two triangles)" },
          { title: "Hierarchy: Square ⊂ Rectangle ⊂ Parallelogram ⊂ Quadrilateral" },
          { title: "Hierarchy: Rhombus ⊂ Parallelogram; Square = Rhombus ∩ Rectangle" },
        ],
      },
    ],
    theorems: [
      { name: "Angle Sum of Quadrilateral", statement: "The sum of all interior angles of a quadrilateral is 360°." },
      { name: "Parallelogram Property", statement: "In a parallelogram, opposite sides are equal, opposite angles are equal, and diagonals bisect each other." },
    ],
    keyFormulas: [
      "Angle sum of quadrilateral: ∠A + ∠B + ∠C + ∠D = 360°",
      "Area of parallelogram: A = base × height",
      "Area of rhombus/kite: A = (d₁ × d₂)/2",
      "Area of trapezium: A = ½(a + b) × h, where a and b are parallel sides",
      "Diagonal of rectangle: d = √(l² + b²)",
    ],
    examTips: [
      "Every square is a rectangle, rhombus, and parallelogram — but not vice versa",
      "Diagonals are equal only in rectangles and isosceles trapeziums (among common quadrilaterals)",
      "Adjacent angles in a parallelogram sum to 180° — use this to find unknown angles",
      "Rhombus diagonals are perpendicular bisectors of each other",
    ],
    exercises: [
      { exerciseNumber: "Exercise 4.1", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 4.2", questionCount: 6, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 4.3", questionCount: 5, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 4.4", questionCount: 4, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 5,
    title: "Number Play",
    subject: "Mathematics",
    grade: "8",
    board: "CBSE",
    unit: "Number Theory",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Investigates divisibility, factors, multiples, and number patterns through puzzles and exploration. Covers divisibility rules, prime factorisation, HCF, LCM, and surprising properties of consecutive numbers.",
    sections: [
      {
        sectionNumber: "5.1",
        title: "Multiples and Sums of Consecutive Numbers",
        microConcepts: [
          { title: "Sum of 2 consecutive integers is always odd" },
          { title: "Sum of 3 consecutive integers is divisible by 3" },
          { title: "Sum of k consecutive integers: divisible by k if k is odd" },
          { title: "Which numbers CAN'T be written as sum of consecutive integers? (Powers of 2)" },
        ],
      },
      {
        sectionNumber: "5.2",
        title: "Divisibility Rules",
        microConcepts: [
          { title: "Divisibility by 2: unit digit is 0,2,4,6,8" },
          { title: "Divisibility by 3: sum of digits divisible by 3" },
          { title: "Divisibility by 4: last two digits divisible by 4" },
          { title: "Divisibility by 5: unit digit is 0 or 5" },
          { title: "Divisibility by 6: divisible by both 2 and 3" },
          { title: "Divisibility by 8: last three digits divisible by 8" },
          { title: "Divisibility by 9: sum of digits divisible by 9" },
          { title: "Divisibility by 11: alternating sum of digits divisible by 11" },
        ],
      },
      {
        sectionNumber: "5.3",
        title: "Prime Factorisation, HCF, and LCM",
        microConcepts: [
          { title: "Prime factorisation: express as product of primes (factor tree)" },
          { title: "HCF: product of lowest powers of common prime factors" },
          { title: "LCM: product of highest powers of all prime factors" },
          { title: "Relationship: HCF × LCM = Product of two numbers" },
        ],
      },
      {
        sectionNumber: "5.4",
        title: "Number Patterns and Letter-Number Puzzles",
        microConcepts: [
          { title: "Using algebra to prove number pattern claims" },
          { title: "Reversing two-digit number: if AB − BA = 9(a−b)" },
          { title: "Magic squares and digit puzzles" },
        ],
      },
    ],
    theorems: [
      { name: "HCF–LCM Relationship", statement: "For two positive integers a and b: HCF(a,b) × LCM(a,b) = a × b." },
    ],
    keyFormulas: [
      "HCF(a,b) × LCM(a,b) = a × b",
      "Sum of n consecutive integers starting at a: nа + n(n-1)/2",
      "Two-digit number AB = 10a + b",
    ],
    examTips: [
      "Divisibility by 11 trick: (sum of digits at odd positions) − (sum at even positions) = 0 or ±11",
      "For HCF and LCM: always do prime factorisation first",
      "If HCF = 1, the numbers are coprime (relatively prime)",
      "LCM of two coprime numbers = their product",
    ],
    exercises: [
      { exerciseNumber: "Exercise 5.1", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 5.2", questionCount: 6, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 5.3", questionCount: 5, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 6,
    title: "We Distribute, Yet Things Multiply",
    subject: "Mathematics",
    grade: "8",
    board: "CBSE",
    unit: "Algebra",
    examMarks: 12,
    estimatedWeeks: 3,
    overview: "Develops algebraic expressions through the distributive property. Covers multiplication of binomials and trinomials, the three standard algebraic identities, and factorisation using common factors, grouping, and identities.",
    sections: [
      {
        sectionNumber: "6.1",
        title: "Distributive Law and Multiplication of Polynomials",
        microConcepts: [
          { title: "Distributive law: a(b+c) = ab + ac" },
          { title: "Monomial × monomial: multiply coefficients, add exponents" },
          { title: "Monomial × binomial: a(b+c) = ab + ac" },
          { title: "Binomial × binomial: FOIL method — (a+b)(c+d) = ac + ad + bc + bd" },
        ],
      },
      {
        sectionNumber: "6.2",
        title: "Standard Algebraic Identities",
        microConcepts: [
          { title: "(a + b)² = a² + 2ab + b² (square of a sum)" },
          { title: "(a − b)² = a² − 2ab + b² (square of a difference)" },
          { title: "(a + b)(a − b) = a² − b² (difference of squares)" },
          { title: "Geometric proofs: area models for each identity" },
        ],
      },
      {
        sectionNumber: "6.3",
        title: "Factorisation",
        microConcepts: [
          { title: "Common factor method: take out HCF of all terms" },
          { title: "Grouping method: split 4 terms into 2 pairs, factor each" },
          { title: "Using identity (a²−b²): spot difference of squares" },
          { title: "Using identity (a±b)²: recognise perfect square trinomial" },
        ],
      },
      {
        sectionNumber: "6.4",
        title: "Division of Algebraic Expressions",
        microConcepts: [
          { title: "Monomial ÷ monomial: divide coefficients, subtract exponents" },
          { title: "Polynomial ÷ monomial: divide each term separately" },
          { title: "Polynomial ÷ polynomial: factorise and cancel" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "(a + b)² = a² + 2ab + b²",
      "(a − b)² = a² − 2ab + b²",
      "(a + b)(a − b) = a² − b²",
      "FOIL: (a+b)(c+d) = ac + ad + bc + bd",
    ],
    examTips: [
      "Before expanding, check if the expression fits a known identity — saves steps",
      "For (a+b)²: middle term is always 2ab (positive); for (a−b)² it's −2ab",
      "a²−b² must have MINUS between two perfect squares — cannot be factored otherwise",
      "Verify factorisation by expanding back: F × A should equal original expression",
    ],
    exercises: [
      { exerciseNumber: "Exercise 6.1", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 6.2", questionCount: 6, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 6.3", questionCount: 5, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 6.4", questionCount: 4, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 7,
    title: "Proportional Reasoning - 1",
    subject: "Mathematics",
    grade: "8",
    board: "CBSE",
    unit: "Ratio and Proportion",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Explores proportional relationships through the lens of digital images and similarity. Establishes the ratio test for proportionality, introduces direct proportion, and applies proportional reasoning to real-world contexts like recipes, maps, and scale models.",
    sections: [
      {
        sectionNumber: "7.1",
        title: "Observing Similarity in Change",
        microConcepts: [
          { title: "Proportional change: when all dimensions scale by the same factor" },
          { title: "Non-proportional change: distortion when dimensions change by different factors" },
          { title: "Ratio: a/b compares two quantities of the same kind" },
          { title: "Proportion: a/b = c/d, or a : b :: c : d" },
        ],
      },
      {
        sectionNumber: "7.2",
        title: "Direct Proportion",
        microConcepts: [
          { title: "Direct proportion: as x increases, y increases by the same factor" },
          { title: "Constant of proportionality: k = y/x is constant" },
          { title: "Graph of direct proportion: straight line through origin" },
          { title: "Applications: speed-distance, cost-quantity, recipe scaling" },
        ],
      },
      {
        sectionNumber: "7.3",
        title: "Inverse Proportion",
        microConcepts: [
          { title: "Inverse proportion: as x increases, y decreases so that xy = constant" },
          { title: "Constant product: x₁y₁ = x₂y₂" },
          { title: "Graph of inverse proportion: rectangular hyperbola" },
          { title: "Applications: speed-time, number of workers-days, pipes-filling time" },
        ],
      },
      {
        sectionNumber: "7.4",
        title: "Ratio and Unitary Method",
        microConcepts: [
          { title: "Unitary method: find value for 1 unit, then scale up" },
          { title: "Compound ratio: (a:b) compounded with (c:d) = ac:bd" },
          { title: "Continued proportion: a:b = b:c → b² = ac (b is geometric mean)" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Direct proportion: y/x = k (constant); y = kx",
      "Inverse proportion: xy = k (constant); x₁y₁ = x₂y₂",
      "Proportion: a/b = c/d → ad = bc (cross-multiplication)",
      "Geometric mean: b² = ac when a, b, c are in continued proportion",
    ],
    examTips: [
      "Direct proportion: MORE → MORE; Inverse proportion: MORE → LESS",
      "Always check: is the situation direct or inverse before setting up the equation",
      "In cross-multiplication: product of means = product of extremes (a:b::c:d → bc = ad)",
      "Unitary method is safest when unsure — find value for 1 first",
    ],
    exercises: [
      { exerciseNumber: "Exercise 7.1", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 7.2", questionCount: 5, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 7.3", questionCount: 5, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 8,
    title: "Fractions in Disguise",
    subject: "Mathematics",
    grade: "8",
    board: "CBSE",
    unit: "Comparing Quantities",
    examMarks: 10,
    estimatedWeeks: 3,
    overview: "Reveals percentages as fractions with denominator 100. Converts freely between fractions, decimals, and percentages. Applies percentages to profit/loss, discount, simple interest, and compound interest. Introduces the percentage change formula.",
    sections: [
      {
        sectionNumber: "1.1",
        title: "Fractions as Percentages",
        microConcepts: [
          { title: "Per cent (%) = per hundred: 25% = 25/100 = 0.25" },
          { title: "Converting fraction to %: multiply by 100" },
          { title: "Converting % to fraction: divide by 100 and simplify" },
          { title: "x% of y = (x/100) × y" },
        ],
      },
      {
        sectionNumber: "1.2",
        title: "Percentage Change",
        microConcepts: [
          { title: "Percentage increase = (increase/original) × 100" },
          { title: "Percentage decrease = (decrease/original) × 100" },
          { title: "Finding new value after % change: new = original × (1 ± %/100)" },
        ],
      },
      {
        sectionNumber: "1.3",
        title: "Profit, Loss, and Discount",
        microConcepts: [
          { title: "Profit = SP − CP; Loss = CP − SP; always calculated on CP" },
          { title: "Profit % = (Profit/CP) × 100; Loss % = (Loss/CP) × 100" },
          { title: "Discount = Marked Price − Selling Price; Discount% on Marked Price" },
          { title: "Net SP after discount: SP = MP × (1 − discount%/100)" },
        ],
      },
      {
        sectionNumber: "1.4",
        title: "Simple and Compound Interest",
        microConcepts: [
          { title: "Simple Interest (SI): I = PRT/100 where P=principal, R=rate, T=time" },
          { title: "Amount = P + SI = P(1 + RT/100)" },
          { title: "Compound Interest (CI): A = P(1 + R/100)ⁿ" },
          { title: "CI > SI for same P, R, T when n > 1; difference = P(R/100)²" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "x% of y = xy/100",
      "Profit % = (SP − CP)/CP × 100",
      "Loss % = (CP − SP)/CP × 100",
      "SI = PRT/100; Amount = P + SI",
      "CI Amount: A = P(1 + R/100)ⁿ",
      "Discount % = (Discount/MP) × 100",
    ],
    examTips: [
      "Profit and Loss are ALWAYS calculated on Cost Price (CP), not Selling Price",
      "Discount is ALWAYS calculated on Marked Price (MP), not Cost Price",
      "For CI: n = number of years; if compounded half-yearly, halve R and double n",
      "Percentage change: divide by original (not final) — common mistake to divide by final",
    ],
    exercises: [
      { exerciseNumber: "Exercise 1.1", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 1.2", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 1.3", questionCount: 6, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 1.4", questionCount: 5, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 9,
    title: "The Baudhayana-Pythagoras Theorem",
    subject: "Mathematics",
    grade: "8",
    board: "CBSE",
    unit: "Geometry",
    examMarks: 10,
    estimatedWeeks: 3,
    overview: "Proves the Pythagorean theorem geometrically through Baudhayana's Sulba Sutra construction. Establishes √2 as irrational, explores Pythagorean triples, and applies the theorem to find distances in practical problems.",
    sections: [
      {
        sectionNumber: "2.1",
        title: "Doubling and Halving a Square",
        microConcepts: [
          { title: "Baudhayana's construction: diagonal of unit square = √2" },
          { title: "Square with double area: side = √2 (not 2)" },
          { title: "√2 is irrational — proof by contradiction" },
          { title: "Decimal expansion of √2: 1.41421356… (non-terminating, non-repeating)" },
        ],
      },
      {
        sectionNumber: "2.2",
        title: "The Pythagorean Theorem",
        microConcepts: [
          { title: "Right triangle: the side opposite 90° is the hypotenuse (longest side)" },
          { title: "Pythagorean theorem: a² + b² = c² (legs a, b; hypotenuse c)" },
          { title: "Geometric proof: area of square on hypotenuse = sum of squares on legs" },
          { title: "Converse: if a²+b²=c², then the triangle has a right angle" },
        ],
      },
      {
        sectionNumber: "2.3",
        title: "Pythagorean Triples",
        microConcepts: [
          { title: "Pythagorean triple: three integers (a, b, c) with a²+b²=c²" },
          { title: "Common triples: (3,4,5), (5,12,13), (8,15,17), (7,24,25)" },
          { title: "Multiples of triples: (6,8,10), (9,12,15), … are also Pythagorean triples" },
          { title: "Generating formula: m²−n², 2mn, m²+n² for m > n" },
        ],
      },
      {
        sectionNumber: "2.4",
        title: "Applications",
        microConcepts: [
          { title: "Finding missing side of right triangle" },
          { title: "Diagonal of rectangle: d² = l² + b²" },
          { title: "Height of equilateral triangle: h = (√3/2)a" },
          { title: "Distance problems: ladder against wall, pole with wire" },
        ],
      },
    ],
    theorems: [
      { name: "Pythagoras Theorem", statement: "In a right-angled triangle, the square of the hypotenuse equals the sum of squares of the other two sides: c² = a² + b²." },
      { name: "Converse of Pythagoras", statement: "If in a triangle c² = a² + b², then the angle opposite c is a right angle." },
    ],
    keyFormulas: [
      "Pythagorean theorem: a² + b² = c²",
      "Hypotenuse of right triangle: c = √(a² + b²)",
      "Diagonal of rectangle: d = √(l² + b²)",
      "Height of equilateral triangle: h = (√3/2)a",
    ],
    examTips: [
      "Hypotenuse is ALWAYS the side opposite the right angle (longest side)",
      "Check if a triple is Pythagorean: compute a²+b² and see if it equals c²",
      "Common mistake: squaring legs and forgetting to take square root for hypotenuse",
      "If given hypotenuse and one leg: leg = √(c² − a²)",
    ],
    exercises: [
      { exerciseNumber: "Exercise 2.1", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 2.2", questionCount: 5, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 2.3", questionCount: 5, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 2.4", questionCount: 4, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 10,
    title: "Proportional Reasoning - 2",
    subject: "Mathematics",
    grade: "8",
    board: "CBSE",
    unit: "Ratio and Proportion",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Extends proportional reasoning to maps and scale drawings, compound ratios, and multi-term ratios. Applies proportionality to direct and inverse proportion problems in practical contexts including construction mixtures and speed/distance.",
    sections: [
      {
        sectionNumber: "3.1",
        title: "Proportionality — A Quick Recap",
        microConcepts: [
          { title: "Proportional relationship: same ratio between all corresponding pairs" },
          { title: "Ratio notation: a : b and fraction a/b are equivalent" },
          { title: "Testing proportionality: all ratios must be equal" },
        ],
      },
      {
        sectionNumber: "3.2",
        title: "Ratios in Maps",
        microConcepts: [
          { title: "Map scale: ratio of map distance to actual distance (1 : 50000)" },
          { title: "Actual distance = map distance × scale factor" },
          { title: "Map distance = actual distance ÷ scale factor" },
          { title: "Scale 1 : n means 1 cm on map = n cm in reality" },
        ],
      },
      {
        sectionNumber: "3.3",
        title: "Multi-Term Ratios and Compound Ratios",
        microConcepts: [
          { title: "Three-term ratio a:b:c for mixing (cement:sand:gravel = 1:2:4)" },
          { title: "Extending to equal ratios: 8:4:2:1 :: 4:2:1:0.5" },
          { title: "Dividing quantities in given ratio" },
          { title: "Compounding two ratios: (a:b) and (c:d) gives ac:bd" },
        ],
      },
      {
        sectionNumber: "3.4",
        title: "Proportional Problem Solving",
        microConcepts: [
          { title: "Identifying direct vs inverse proportion in context" },
          { title: "Setting up proportion equations" },
          { title: "Problems involving more than two quantities" },
          { title: "Speed-time-distance: speed = distance/time" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Map: actual = map distance × scale denominator",
      "Direct proportion: x₁/y₁ = x₂/y₂",
      "Inverse proportion: x₁y₁ = x₂y₂",
      "Speed = Distance / Time",
    ],
    examTips: [
      "Map scale 1:50000 means 1 cm = 50000 cm = 500 m = 0.5 km in real life",
      "Always convert units before applying scale",
      "Dividing in ratio p:q:r — total parts = p+q+r, each share = (p or q or r)/(p+q+r) × total",
      "More workers → fewer days (inverse); more speed → less time (inverse)",
    ],
    exercises: [
      { exerciseNumber: "Exercise 3.1", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 3.2", questionCount: 5, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 3.3", questionCount: 4, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 11,
    title: "Exploring Some Geometric Themes",
    subject: "Mathematics",
    grade: "8",
    board: "CBSE",
    unit: "Geometry — Shapes",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Investigates two geometric themes: fractals (self-similar shapes like Sierpinski Carpet, Sierpinski Gasket, Koch Snowflake) and visualisation of 3D solid shapes through nets, cross-sections, and three standard views (front, side, top).",
    sections: [
      {
        sectionNumber: "4.1",
        title: "Fractals",
        microConcepts: [
          { title: "Fractal: shape that looks the same at different scales (self-similar)" },
          { title: "Sierpinski Carpet: divide square into 9 equal parts, remove centre, repeat" },
          { title: "Sierpinski Gasket (Triangle): divide triangle into 4, remove central, repeat" },
          { title: "Koch Snowflake: on each side replace middle third with equilateral triangle" },
          { title: "Fractals in nature: ferns, coastlines, snowflakes, tree branching" },
        ],
      },
      {
        sectionNumber: "4.2",
        title: "Visualising Solid Shapes",
        microConcepts: [
          { title: "Net of a solid: 2D unfolding that folds into the 3D shape" },
          { title: "Nets of cube, cuboid, cylinder, cone, pyramid" },
          { title: "Front view, side view, top view (orthographic projections)" },
          { title: "Cross-section: shape obtained by cutting a solid with a plane" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Sierpinski Carpet: at step n, area remaining = (8/9)ⁿ of original",
      "Koch Snowflake perimeter: grows by factor 4/3 each step → infinite",
    ],
    examTips: [
      "Fractals have infinite detail — zooming in reveals the same pattern",
      "Net of a cube has 6 faces; opposite faces must not overlap when folded",
      "Front view shows height and width; side view shows height and depth; top view shows width and depth",
      "Cross-section of a cone by a horizontal plane is a circle; by a vertical plane through apex is a triangle",
    ],
    exercises: [
      { exerciseNumber: "Exercise 4.1", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 4.2", questionCount: 5, types: ["Short Answer", "Long Answer"] },
    ],
  },

  {
    chapterNumber: 12,
    title: "Tales by Dots and Lines",
    subject: "Mathematics",
    grade: "8",
    board: "CBSE",
    unit: "Data Handling",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Deepens understanding of the mean and median through dot plots and line plots. Explores how mean shifts when data changes (effect of adding/removing/scaling values). Introduces mode and discusses the choice of appropriate measure of central tendency.",
    sections: [
      {
        sectionNumber: "5.1",
        title: "The Balancing Act — Mean as Centre",
        microConcepts: [
          { title: "Mean = sum of all values ÷ number of values" },
          { title: "Mean as balance point: sum of deviations above = sum of deviations below" },
          { title: "Effect of adding a value: mean shifts toward the new value" },
          { title: "Effect of multiplying all values by k: new mean = k × old mean" },
          { title: "Effect of adding constant c to all values: new mean = old mean + c" },
        ],
      },
      {
        sectionNumber: "5.2",
        title: "Median and Choosing the Right Measure",
        microConcepts: [
          { title: "Median: middle value when data is sorted (average of two middle if even count)" },
          { title: "Median is not affected by extreme values (outliers)" },
          { title: "Mode: most frequently occurring value(s)" },
          { title: "When to use mean vs median: mean for symmetric data, median for skewed/outlier data" },
        ],
      },
      {
        sectionNumber: "5.3",
        title: "Dot Plots and Line Plots",
        microConcepts: [
          { title: "Dot plot: each data value represented by a dot above a number line" },
          { title: "Reading distribution: clusters, gaps, outliers" },
          { title: "Comparing two distributions using dot plots" },
          { title: "Line plot (frequency line graph) for grouped data" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Mean = (Σxᵢ) / n",
      "Median (odd n): middle value at position (n+1)/2",
      "Median (even n): average of n/2-th and (n/2+1)-th values",
      "If each value multiplied by k: new mean = k × old mean",
      "If constant c added to each value: new mean = old mean + c",
    ],
    examTips: [
      "Always SORT data before finding median",
      "For even number of values: median = average of two middle values",
      "Mean is sensitive to outliers; median is resistant — know which to use",
      "Mode can have more than one value (bimodal data) or none (all unique)",
    ],
    exercises: [
      { exerciseNumber: "Exercise 5.1", questionCount: 4, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 5.2", questionCount: 5, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 5.3", questionCount: 4, types: ["Short Answer"] },
    ],
  },

  {
    chapterNumber: 13,
    title: "Algebra Play",
    subject: "Mathematics",
    grade: "8",
    board: "CBSE",
    unit: "Algebra — Equations",
    examMarks: 10,
    estimatedWeeks: 3,
    overview: "Uses algebra to explain and invent number tricks and puzzles. Covers solving linear equations with the variable on both sides, equations with fractions, and word problems. Introduces equations with two variables and their graphical representation.",
    sections: [
      {
        sectionNumber: "6.1",
        title: "Think-of-a-Number Tricks",
        microConcepts: [
          { title: "Using algebra to explain why number tricks work" },
          { title: "Generalising specific examples: replace number with variable x" },
          { title: "Inventing new tricks: design steps that always return the same number" },
        ],
      },
      {
        sectionNumber: "6.2",
        title: "Linear Equations — Both Sides",
        microConcepts: [
          { title: "Equation: statement that two expressions are equal" },
          { title: "Variable on both sides: 3x + 4 = x + 12 → 2x = 8 → x = 4" },
          { title: "Transposing: move term to other side, change sign" },
          { title: "Solving equations with brackets: expand first, then collect terms" },
        ],
      },
      {
        sectionNumber: "6.3",
        title: "Equations with Fractions",
        microConcepts: [
          { title: "Multiply both sides by LCM of all denominators to clear fractions" },
          { title: "Cross-multiplication for equations of the form a/b = c/d" },
        ],
      },
      {
        sectionNumber: "6.4",
        title: "Word Problems Using Equations",
        microConcepts: [
          { title: "Translate word problem to equation: define variable, form equation" },
          { title: "Age problems, number problems, geometry problems" },
          { title: "Check: substitute answer back into original problem statement" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Linear equation: ax + b = cx + d → (a−c)x = d−b → x = (d−b)/(a−c)",
      "Cross-multiplication: a/b = c/d → ad = bc",
      "Clearing fractions: multiply both sides by LCM of denominators",
    ],
    examTips: [
      "Always verify the solution by substituting back into the original equation",
      "Change side = change sign: +3 moves to other side as −3",
      "For fraction equations: multiply by LCM FIRST before doing anything else",
      "Define your variable clearly in word problems: 'Let x = the unknown'",
    ],
    exercises: [
      { exerciseNumber: "Exercise 6.1", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 6.2", questionCount: 6, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 6.3", questionCount: 5, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 6.4", questionCount: 4, types: ["Long Answer"] },
    ],
  },

  {
    chapterNumber: 14,
    title: "Area",
    subject: "Mathematics",
    grade: "8",
    board: "CBSE",
    unit: "Mensuration",
    examMarks: 10,
    estimatedWeeks: 3,
    overview: "Derives area formulas for all standard plane figures — triangles, quadrilaterals, circles — and applies them to composite figures. Emphasises proof by dissection and rearrangement, and connects area to perimeter for optimisation reasoning.",
    sections: [
      {
        sectionNumber: "7.1",
        title: "Rectangles and Squares",
        microConcepts: [
          { title: "Area of rectangle = length × breadth" },
          { title: "Area of square = side²" },
          { title: "Area by unit-square counting: number of non-overlapping 1×1 squares" },
          { title: "Conservation of area: dissection and rearrangement preserve area" },
        ],
      },
      {
        sectionNumber: "7.2",
        title: "Triangle and Parallelogram",
        microConcepts: [
          { title: "Area of parallelogram = base × perpendicular height" },
          { title: "Area of triangle = ½ × base × height" },
          { title: "Proof: triangle is half of parallelogram on same base and between same parallels" },
          { title: "Height must be perpendicular to the base — not the slant side" },
        ],
      },
      {
        sectionNumber: "7.3",
        title: "Trapezium, Rhombus, and General Quadrilateral",
        microConcepts: [
          { title: "Area of trapezium = ½ × (a + b) × h (a, b are parallel sides)" },
          { title: "Area of rhombus = ½ × d₁ × d₂ (d₁, d₂ are diagonals)" },
          { title: "Area of general quadrilateral by splitting into two triangles" },
        ],
      },
      {
        sectionNumber: "7.4",
        title: "Circle and Composite Figures",
        microConcepts: [
          { title: "Area of circle = πr²; Circumference = 2πr" },
          { title: "Area of semicircle = πr²/2" },
          { title: "Composite figures: break into known shapes, add or subtract areas" },
          { title: "Shaded region = total area − unshaded area" },
        ],
      },
    ],
    theorems: [],
    keyFormulas: [
      "Area of rectangle: l × b",
      "Area of triangle: ½ × base × height",
      "Area of parallelogram: base × height",
      "Area of trapezium: ½(a + b) × h",
      "Area of rhombus: ½ × d₁ × d₂",
      "Area of circle: πr²",
      "Circumference: 2πr",
    ],
    examTips: [
      "Height = perpendicular distance between base and opposite side (never the slant)",
      "For composite figures: identify basic shapes first, then add or subtract",
      "Use π = 22/7 when radius is a multiple of 7; else 3.14",
      "Area is in square units (cm², m²); perimeter is in linear units (cm, m)",
    ],
    exercises: [
      { exerciseNumber: "Exercise 7.1", questionCount: 5, types: ["Short Answer"] },
      { exerciseNumber: "Exercise 7.2", questionCount: 5, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 7.3", questionCount: 6, types: ["Short Answer", "Long Answer"] },
      { exerciseNumber: "Exercise 7.4", questionCount: 5, types: ["Long Answer"] },
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
  console.log(`\nSeeded ${CHAPTERS.length} chapters for CBSE Class 8 Mathematics.`);
  await mongoose.disconnect();
}
seedCurriculum().catch((err) => { console.error(err); process.exit(1); });
