/**
 * CBSE Class 6 Mathematics — Curriculum seed
 * Textbook: "Ganita Prakash Grade 6" (NCERT 2026, single book)
 * 10 chapters. Safe to re-run.
 * Usage: node config/seedMath6Curriculum.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Chapter } from "../models/chapterModel.js";

const chapters = [
  {
    chapterNumber: 1,
    title: "Patterns in Mathematics",
    subject: "Mathematics",
    grade: "6",
    board: "CBSE",
    unit: "Number System",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Introduces mathematics as the search for patterns. Explores number sequences (counting numbers, odd, even, triangular, square, cube, Fibonacci), visual patterns, and why patterns matter in mathematics and the real world.",
    sections: [
      {
        sectionNumber: "1.1",
        title: "What is Mathematics?",
        microConcepts: [
          { title: "Mathematics as pattern discovery and explanation" },
          { title: "Patterns in nature, science, and daily life" },
          { title: "Mathematics as both art and science" },
        ],
      },
      {
        sectionNumber: "1.2",
        title: "Number Sequences",
        microConcepts: [
          { title: "Counting numbers: 1, 2, 3, 4, …" },
          { title: "Even numbers: 0, 2, 4, 6, … and odd numbers: 1, 3, 5, 7, …" },
          { title: "Square numbers: 1, 4, 9, 16, 25, … (n²)" },
          { title: "Triangular numbers: 1, 3, 6, 10, 15, … (n(n+1)/2)" },
          { title: "Cube numbers: 1, 8, 27, 64, …  (n³)" },
          { title: "Fibonacci numbers: 1, 1, 2, 3, 5, 8, 13, … (each term = sum of two before)" },
          { title: "Powers of 2: 1, 2, 4, 8, 16, … (2^n)" },
        ],
      },
      {
        sectionNumber: "1.3",
        title: "Visual and Geometric Patterns",
        microConcepts: [
          { title: "Dot patterns forming triangles and squares" },
          { title: "Growing patterns: predicting the next term" },
          { title: "Patterns in number tables (multiplication tables)" },
        ],
      },
    ],
    keyFormulas: [
      "nth triangular number = n(n+1)/2",
      "nth square number = n²",
      "Fibonacci: F(n) = F(n−1) + F(n−2)",
    ],
    examTips: [
      "To find a missing term in a sequence, identify the rule first (add, multiply, or Fibonacci-like).",
      "Triangular numbers: 1, 3, 6, 10, 15, 21 — each adds the next counting number.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Patterns", questionCount: 8 }],
  },
  {
    chapterNumber: 2,
    title: "Lines and Angles",
    subject: "Mathematics",
    grade: "6",
    board: "CBSE",
    unit: "Geometry",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Explores the basic building blocks of geometry: points, lines, rays, line segments, and angles. Covers types of angles, measurement with a protractor, and pairs of angles.",
    sections: [
      {
        sectionNumber: "2.1",
        title: "Points, Lines, Rays, and Line Segments",
        microConcepts: [
          { title: "Point: precise location, no size" },
          { title: "Line: extends infinitely in both directions, named by two points" },
          { title: "Ray: starts at a point, extends infinitely in one direction" },
          { title: "Line segment: part of a line between two points, has finite length" },
        ],
      },
      {
        sectionNumber: "2.2",
        title: "Angles",
        microConcepts: [
          { title: "Angle: formed by two rays sharing a common endpoint (vertex)" },
          { title: "Acute angle: less than 90°" },
          { title: "Right angle: exactly 90°" },
          { title: "Obtuse angle: between 90° and 180°" },
          { title: "Straight angle: exactly 180°" },
          { title: "Reflex angle: between 180° and 360°" },
          { title: "Measuring angles with a protractor" },
        ],
      },
      {
        sectionNumber: "2.3",
        title: "Pairs of Angles",
        microConcepts: [
          { title: "Complementary angles: sum = 90°" },
          { title: "Supplementary angles: sum = 180°" },
          { title: "Adjacent angles: share a vertex and a common arm" },
        ],
      },
    ],
    keyFormulas: [
      "Complementary: ∠A + ∠B = 90°",
      "Supplementary: ∠A + ∠B = 180°",
    ],
    examTips: [
      "Complementary = 90° (think right angle). Supplementary = 180° (think straight line).",
      "A reflex angle is the 'other side' of an angle: reflex = 360° − interior angle.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Lines and Angles", questionCount: 10 }],
  },
  {
    chapterNumber: 3,
    title: "Number Play",
    subject: "Mathematics",
    grade: "6",
    board: "CBSE",
    unit: "Number System",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Explores numbers through puzzles and games — positional patterns, Kaprekar's constant, palindromes, magic squares, and creative uses of numbers.",
    sections: [
      {
        sectionNumber: "3.1",
        title: "Numbers Can Tell Us Things",
        microConcepts: [
          { title: "Positional number games: each person calls a number based on their position" },
          { title: "Numbers carry information beyond counting" },
        ],
      },
      {
        sectionNumber: "3.2",
        title: "Supercells and Number Puzzles",
        microConcepts: [
          { title: "Supercell: a number greater than all its neighbours" },
          { title: "Exploring digit rearrangements and differences" },
          { title: "Kaprekar's constant: 6174 for 4-digit numbers" },
        ],
      },
      {
        sectionNumber: "3.3",
        title: "Palindromes and Magic Squares",
        microConcepts: [
          { title: "Palindrome numbers: read the same forwards and backwards" },
          { title: "Magic squares: each row, column and diagonal sums to the same number" },
        ],
      },
    ],
    keyFormulas: [
      "Kaprekar process: arrange digits descending − ascending; repeat → reaches 6174",
    ],
    examTips: [
      "In magic squares, all rows, columns, and diagonals must have the same sum.",
      "A palindrome number reads the same both ways (e.g. 121, 1331).",
    ],
    exercises: [{ exerciseNumber: 1, title: "Number Play", questionCount: 8 }],
  },
  {
    chapterNumber: 4,
    title: "Data Handling and Presentation",
    subject: "Mathematics",
    grade: "6",
    board: "CBSE",
    unit: "Data Handling",
    examMarks: 6,
    estimatedWeeks: 1,
    overview: "Introduction to collecting, organising, and presenting data — tally marks, frequency tables, pictographs, and bar graphs.",
    sections: [
      {
        sectionNumber: "4.1",
        title: "Collecting and Organising Data",
        microConcepts: [
          { title: "Data: a collection of facts, numbers, observations, or descriptions" },
          { title: "Tally marks: groups of 5 for easy counting" },
          { title: "Frequency table: category and its count" },
        ],
      },
      {
        sectionNumber: "4.2",
        title: "Pictographs",
        microConcepts: [
          { title: "Pictograph: uses pictures/symbols to represent data" },
          { title: "Key: each symbol represents a fixed number of items" },
          { title: "Reading and drawing pictographs" },
        ],
      },
      {
        sectionNumber: "4.3",
        title: "Bar Graphs",
        microConcepts: [
          { title: "Bar graph: rectangular bars, height = frequency" },
          { title: "Scale on axis: choose suitable scale" },
          { title: "Interpreting bar graphs to compare categories" },
        ],
      },
    ],
    keyFormulas: [
      "Frequency = count of occurrences of a value",
    ],
    examTips: [
      "Always read the key/scale before interpreting a pictograph or bar graph.",
      "In a bar graph, the width of bars should be equal; only the height varies.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Data Handling", questionCount: 8 }],
  },
  {
    chapterNumber: 5,
    title: "Prime Time",
    subject: "Mathematics",
    grade: "6",
    board: "CBSE",
    unit: "Number System",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Explores prime and composite numbers, common multiples, common factors, LCM, and HCF through the Idli-Vada game and real-life problems.",
    sections: [
      {
        sectionNumber: "5.1",
        title: "Common Multiples and Common Factors",
        microConcepts: [
          { title: "Multiple: result of multiplying a number by a counting number" },
          { title: "Common multiple: a multiple shared by two or more numbers" },
          { title: "Factor: a number that divides exactly (no remainder)" },
          { title: "Common factor: a factor shared by two or more numbers" },
        ],
      },
      {
        sectionNumber: "5.2",
        title: "Prime and Composite Numbers",
        microConcepts: [
          { title: "Prime: exactly 2 factors (1 and itself)" },
          { title: "Composite: more than 2 factors" },
          { title: "1 is neither prime nor composite" },
          { title: "2 is the only even prime" },
          { title: "Sieve of Eratosthenes: method to find all primes" },
        ],
      },
      {
        sectionNumber: "5.3",
        title: "Prime Factorisation, LCM and HCF",
        microConcepts: [
          { title: "Every composite number = product of prime factors (unique)" },
          { title: "LCM: smallest common multiple of two or more numbers" },
          { title: "HCF: largest common factor of two or more numbers" },
          { title: "HCF × LCM = product of the two numbers" },
        ],
      },
    ],
    keyFormulas: [
      "HCF × LCM = a × b (for two numbers)",
      "LCM: highest powers of all primes; HCF: lowest powers of common primes",
    ],
    examTips: [
      "1 is NOT prime. 2 is the smallest prime.",
      "LCM is always ≥ both numbers; HCF is always ≤ both numbers.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Prime Time", questionCount: 10 }],
  },
  {
    chapterNumber: 6,
    title: "Perimeter and Area",
    subject: "Mathematics",
    grade: "6",
    board: "CBSE",
    unit: "Mensuration",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Covers perimeter (distance around a shape) and area (surface covered) for rectangles, squares, and triangles, with real-life applications.",
    sections: [
      {
        sectionNumber: "6.1",
        title: "Perimeter",
        microConcepts: [
          { title: "Perimeter: total distance along the boundary of a closed figure" },
          { title: "Perimeter of rectangle = 2(l + b)" },
          { title: "Perimeter of square = 4s" },
          { title: "Perimeter of triangle = a + b + c" },
        ],
      },
      {
        sectionNumber: "6.2",
        title: "Area",
        microConcepts: [
          { title: "Area: amount of surface enclosed by a closed figure" },
          { title: "Area of rectangle = l × b" },
          { title: "Area of square = s²" },
          { title: "Area of triangle = ½ × base × height" },
          { title: "Unit: cm², m², km²" },
        ],
      },
      {
        sectionNumber: "6.3",
        title: "Relationship Between Perimeter and Area",
        microConcepts: [
          { title: "Shapes with same perimeter can have different areas" },
          { title: "Shapes with same area can have different perimeters" },
        ],
      },
    ],
    keyFormulas: [
      "Perimeter of rectangle = 2(l + b)",
      "Area of rectangle = l × b",
      "Area of triangle = ½ × base × height",
      "Area of square = side²",
    ],
    examTips: [
      "Perimeter uses length units (cm, m); Area uses square units (cm², m²).",
      "Height of a triangle must be perpendicular to the base.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Perimeter and Area", questionCount: 10 }],
  },
  {
    chapterNumber: 7,
    title: "Fractions",
    subject: "Mathematics",
    grade: "6",
    board: "CBSE",
    unit: "Fractions and Decimals",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Introduces fractions as equal parts of a whole, equivalent fractions, comparing fractions, and addition and subtraction of fractions.",
    sections: [
      {
        sectionNumber: "7.1",
        title: "Fractions as Equal Shares",
        microConcepts: [
          { title: "Fraction: represents equal parts of a whole (numerator/denominator)" },
          { title: "Proper fraction: numerator < denominator" },
          { title: "Improper fraction: numerator ≥ denominator" },
          { title: "Mixed number: whole number + proper fraction" },
        ],
      },
      {
        sectionNumber: "7.2",
        title: "Equivalent Fractions and Comparing",
        microConcepts: [
          { title: "Equivalent fractions: same value, different numerator/denominator" },
          { title: "Simplest form: HCF of numerator and denominator = 1" },
          { title: "Comparing fractions: use LCM of denominators (LCD)" },
        ],
      },
      {
        sectionNumber: "7.3",
        title: "Addition and Subtraction of Fractions",
        microConcepts: [
          { title: "Same denominator: add/subtract numerators, keep denominator" },
          { title: "Different denominators: find LCD, convert, then add/subtract" },
        ],
      },
    ],
    keyFormulas: [
      "Equivalent fraction: a/b = (a×n)/(b×n)",
      "Simplest form: divide numerator and denominator by their HCF",
    ],
    examTips: [
      "To compare fractions with different denominators, convert to same denominator using LCM.",
      "Simplify fractions by dividing by HCF of numerator and denominator.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Fractions", questionCount: 10 }],
  },
  {
    chapterNumber: 8,
    title: "Playing with Constructions",
    subject: "Mathematics",
    grade: "6",
    board: "CBSE",
    unit: "Geometry",
    examMarks: 6,
    estimatedWeeks: 1,
    overview: "Introduces geometric construction using ruler and compass — drawing circles, copying line segments, and constructing artwork and geometric figures.",
    sections: [
      {
        sectionNumber: "8.1",
        title: "Compass and Ruler",
        microConcepts: [
          { title: "Compass: draws circles and arcs; fixed radius = distance from centre" },
          { title: "Circle: all points equidistant from the centre" },
          { title: "Radius, diameter, circumference" },
        ],
      },
      {
        sectionNumber: "8.2",
        title: "Constructing Figures",
        microConcepts: [
          { title: "Copying a line segment using compass" },
          { title: "Drawing a circle of given radius" },
          { title: "Constructing artwork using arcs (eyes, flowers)" },
          { title: "Perpendicular lines: meeting at exactly 90°" },
        ],
      },
    ],
    keyFormulas: [
      "Diameter = 2 × radius",
      "All points on a circle are equidistant from its centre",
    ],
    examTips: [
      "In constructions, never use a protractor — only ruler and compass.",
      "The compass opening = the radius of the arc/circle being drawn.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Constructions", questionCount: 8 }],
  },
  {
    chapterNumber: 9,
    title: "Symmetry",
    subject: "Mathematics",
    grade: "6",
    board: "CBSE",
    unit: "Geometry",
    examMarks: 6,
    estimatedWeeks: 1,
    overview: "Introduces line symmetry and rotational symmetry — identifying lines of symmetry, order of rotational symmetry, and symmetric figures in nature and art.",
    sections: [
      {
        sectionNumber: "9.1",
        title: "Line Symmetry",
        microConcepts: [
          { title: "Line of symmetry: divides figure into two mirror-image halves" },
          { title: "A figure can have 0, 1, or more lines of symmetry" },
          { title: "Regular polygon with n sides has n lines of symmetry" },
        ],
      },
      {
        sectionNumber: "9.2",
        title: "Rotational Symmetry",
        microConcepts: [
          { title: "Rotational symmetry: figure looks the same after a rotation less than 360°" },
          { title: "Order of rotational symmetry: number of times it looks the same in one full turn" },
          { title: "Angle of rotation = 360° ÷ order" },
        ],
      },
    ],
    keyFormulas: [
      "Angle of rotation = 360° ÷ order of symmetry",
      "Regular n-gon: n lines of symmetry, order of rotational symmetry = n",
    ],
    examTips: [
      "Every figure has rotational symmetry of order 1 (a full 360° turn). We usually say order ≥ 2 to be interesting.",
      "A square has 4 lines of symmetry and rotational symmetry of order 4.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Symmetry", questionCount: 8 }],
  },
  {
    chapterNumber: 10,
    title: "The Other Side of Zero",
    subject: "Mathematics",
    grade: "6",
    board: "CBSE",
    unit: "Number System",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Introduces integers — negative numbers, the number line, ordering integers, and addition and subtraction of integers.",
    sections: [
      {
        sectionNumber: "10.1",
        title: "Negative Numbers and the Number Line",
        microConcepts: [
          { title: "Integers: …, −3, −2, −1, 0, 1, 2, 3, …" },
          { title: "Negative numbers: less than zero (temperature, floors below ground, debt)" },
          { title: "Number line: negative numbers to the left of 0, positive to the right" },
          { title: "Comparing integers: right > left on the number line" },
        ],
      },
      {
        sectionNumber: "10.2",
        title: "Addition and Subtraction of Integers",
        microConcepts: [
          { title: "Adding positive integer: move right on number line" },
          { title: "Adding negative integer: move left on number line" },
          { title: "Subtracting = adding the opposite: a − b = a + (−b)" },
          { title: "Rules: same sign → add magnitudes; different signs → subtract, take sign of larger" },
        ],
      },
    ],
    keyFormulas: [
      "a − b = a + (−b)",
      "|a| = distance from 0 (absolute value)",
    ],
    examTips: [
      "On the number line, −5 is to the LEFT of −2, so −5 < −2.",
      "Subtracting a negative = adding a positive: 3 − (−4) = 3 + 4 = 7.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Integers", questionCount: 10 }],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  for (const ch of chapters) {
    await Chapter.findOneAndUpdate(
      { subject: ch.subject, grade: ch.grade, board: ch.board, chapterNumber: ch.chapterNumber },
      ch,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ Ch${ch.chapterNumber}: ${ch.title}`);
  }

  console.log(`\nSeeded ${chapters.length} chapters for CBSE Class 6 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
