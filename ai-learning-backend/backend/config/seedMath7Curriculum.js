/**
 * CBSE Class 7 Mathematics — Curriculum seed
 * Textbook: "Ganita Prakash Grade 7 Part I + Part II" (NCERT 2026)
 * 15 chapters (Part I: ch1-8, Part II: ch9-15). Safe to re-run.
 * Usage: node config/seedMath7Curriculum.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Chapter } from "../models/chapterModel.js";

const chapters = [
  {
    chapterNumber: 1,
    title: "Large Numbers Around Us",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Number System",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Explores large numbers up to crores using the Indian place value system, reading and writing large numbers, and estimation techniques.",
    sections: [
      {
        sectionNumber: "1.1",
        title: "A Lakh Varieties",
        microConcepts: [
          { title: "Place value up to lakh: units, tens, hundreds, thousands, ten-thousands, lakhs" },
          { title: "Reading and writing 6-digit numbers in Indian system" },
          { title: "Indian commas: 3 from right then every 2 digits" },
        ],
      },
      {
        sectionNumber: "1.2",
        title: "Numbers Beyond a Lakh",
        microConcepts: [
          { title: "Ten-lakh and crore in the Indian system" },
          { title: "1 crore = 100 lakhs = 1,00,00,000" },
          { title: "Comparison with International system: million, billion" },
        ],
      },
      {
        sectionNumber: "1.3",
        title: "Estimation and Rounding",
        microConcepts: [
          { title: "Rounding to nearest thousand, ten-thousand, lakh" },
          { title: "Decision digit: look at one place to the right of rounding place" },
          { title: "Estimation in real-life contexts: population, budget" },
        ],
      },
    ],
    keyFormulas: [
      "1 lakh = 1,00,000",
      "1 crore = 1,00,00,000 = 100 lakhs",
    ],
    examTips: [
      "Always use Indian commas: 1,00,000 (lakh); 1,00,00,000 (crore).",
      "Rounding: look at the digit to the right of the rounding place.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Large Numbers", questionCount: 8 }],
  },
  {
    chapterNumber: 2,
    title: "Arithmetic Expressions",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Arithmetic",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Introduces arithmetic expressions, BODMAS order of operations, and comparing expressions using <, >, = signs.",
    sections: [
      {
        sectionNumber: "2.1",
        title: "Simple Expressions",
        microConcepts: [
          { title: "Arithmetic expression: a mathematical phrase with numbers and operations" },
          { title: "Value of an expression: the number it evaluates to" },
          { title: "Equality sign: 13 + 2 = 15" },
        ],
      },
      {
        sectionNumber: "2.2",
        title: "Order of Operations (BODMAS)",
        microConcepts: [
          { title: "BODMAS: Brackets → Orders → Division → Multiplication → Addition → Subtraction" },
          { title: "Division and multiplication: equal priority, evaluate left to right" },
          { title: "Addition and subtraction: equal priority, evaluate left to right" },
        ],
      },
      {
        sectionNumber: "2.3",
        title: "Comparing Expressions",
        microConcepts: [
          { title: "Using <, >, = to compare expressions by their values" },
          { title: "Equivalent expressions: different forms, same value" },
        ],
      },
    ],
    keyFormulas: [
      "BODMAS: Brackets → Orders → Division → Multiplication → Addition → Subtraction",
    ],
    examTips: [
      "Always evaluate inside brackets first before applying other operations.",
      "Division and multiplication have equal priority — evaluate left to right.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Arithmetic Expressions", questionCount: 10 }],
  },
  {
    chapterNumber: 3,
    title: "A Peek Beyond the Point",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Fractions and Decimals",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Introduces decimal fractions, place value in decimals (tenths, hundredths), and addition/subtraction of decimals.",
    sections: [
      {
        sectionNumber: "3.1",
        title: "The Need for Smaller Units",
        microConcepts: [
          { title: "Tenths: 1/10 = 0.1" },
          { title: "Hundredths: 1/100 = 0.01" },
          { title: "Decimal notation and reading decimals from a ruler" },
        ],
      },
      {
        sectionNumber: "3.2",
        title: "Place Value in Decimals",
        microConcepts: [
          { title: "Decimal place value chart: units . tenths hundredths thousandths" },
          { title: "Trailing zeros do not change value: 3.7 = 3.70" },
        ],
      },
      {
        sectionNumber: "3.3",
        title: "Addition and Subtraction of Decimals",
        microConcepts: [
          { title: "Align decimal points before operating" },
          { title: "Write trailing zeros to equalise decimal places" },
          { title: "Carry and borrow work the same as whole numbers" },
        ],
      },
    ],
    keyFormulas: [
      "1 tenth = 0.1 = 1/10",
      "1 hundredth = 0.01 = 1/100",
    ],
    examTips: [
      "Always align decimal points when adding or subtracting.",
      "Write trailing zeros to make both numbers have equal decimal places.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Decimals", questionCount: 10 }],
  },
  {
    chapterNumber: 4,
    title: "Letter-Numbers",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Algebra",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Introduces the concept of using letters to represent numbers (variables), forming algebraic expressions, and understanding simple algebraic relations.",
    sections: [
      {
        sectionNumber: "4.1",
        title: "The Notion of Letter-Numbers",
        microConcepts: [
          { title: "Variable: a letter representing an unknown or changing number" },
          { title: "Expressions like a + 3 represent relationships concisely" },
          { title: "Evaluating by substituting a specific value" },
        ],
      },
      {
        sectionNumber: "4.2",
        title: "Patterns and Generalisation",
        microConcepts: [
          { title: "Number patterns expressed as algebraic expressions" },
          { title: "nth term: general rule for a sequence (e.g. 2n−1 for odd numbers)" },
          { title: "Testing the rule with specific values" },
        ],
      },
    ],
    keyFormulas: [
      "Algebraic expression: combination of variables and constants (e.g. 2x + 3)",
    ],
    examTips: [
      "When substituting, replace every instance of the variable.",
      "Use parentheses when substituting negative numbers.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Letter-Numbers", questionCount: 10 }],
  },
  {
    chapterNumber: 5,
    title: "Parallel and Intersecting Lines",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Geometry",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Explores angles formed when lines intersect, vertically opposite angles, and properties of parallel lines cut by a transversal.",
    sections: [
      {
        sectionNumber: "5.1",
        title: "Intersecting Lines",
        microConcepts: [
          { title: "Point of intersection: where two lines meet" },
          { title: "Four angles formed at the intersection" },
          { title: "Vertically opposite angles are equal" },
          { title: "Adjacent angles at intersection are supplementary (sum 180°)" },
        ],
      },
      {
        sectionNumber: "5.2",
        title: "Parallel Lines and Transversal",
        microConcepts: [
          { title: "Corresponding angles (F-shape): equal when lines parallel" },
          { title: "Alternate interior angles (Z-shape): equal when lines parallel" },
          { title: "Co-interior / same-side interior angles (C-shape): sum 180° when parallel" },
          { title: "Converse: if angle condition holds, lines are parallel" },
        ],
      },
    ],
    keyFormulas: [
      "Vertically opposite angles are equal",
      "Corresponding angles (parallel lines) are equal",
      "Alternate interior angles (parallel lines) are equal",
      "Co-interior angles (parallel lines) sum to 180°",
    ],
    examTips: [
      "Identify the angle pair type first: F (corresponding), Z (alternate), C (co-interior).",
      "Co-interior angles are supplementary; alternate angles are equal.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Lines and Angles", questionCount: 10 }],
  },
  {
    chapterNumber: 6,
    title: "Number Play",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Number System",
    examMarks: 6,
    estimatedWeeks: 1,
    overview: "Explores patterns in numbers, divisibility rules, prime and composite numbers, and the Sieve of Eratosthenes.",
    sections: [
      {
        sectionNumber: "6.1",
        title: "Divisibility Rules",
        microConcepts: [
          { title: "Divisible by 2: last digit even" },
          { title: "Divisible by 3: digit sum divisible by 3" },
          { title: "Divisible by 5: last digit 0 or 5" },
          { title: "Divisible by 9: digit sum divisible by 9" },
          { title: "Divisible by 11: alternating digit sum divisible by 11" },
        ],
      },
      {
        sectionNumber: "6.2",
        title: "Prime and Composite Numbers",
        microConcepts: [
          { title: "Prime: exactly 2 factors (1 and itself)" },
          { title: "Composite: more than 2 factors" },
          { title: "1 is neither prime nor composite" },
          { title: "Sieve of Eratosthenes to find primes" },
        ],
      },
    ],
    keyFormulas: [
      "Divisible by 3: digit sum ÷ 3",
      "Divisible by 9: digit sum ÷ 9",
      "Divisible by 11: (odd-position sum) − (even-position sum) divisible by 11",
    ],
    examTips: [
      "1 is neither prime nor composite.",
      "2 is the only even prime number.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Number Play", questionCount: 8 }],
  },
  {
    chapterNumber: 7,
    title: "A Tale of Three Intersecting Lines",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Geometry",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Studies triangles — their types, angle sum property, exterior angle theorem, and construction of equilateral triangles.",
    sections: [
      {
        sectionNumber: "7.1",
        title: "Types of Triangles",
        microConcepts: [
          { title: "By sides: equilateral, isosceles, scalene" },
          { title: "By angles: acute, right, obtuse" },
        ],
      },
      {
        sectionNumber: "7.2",
        title: "Angle Sum Property",
        microConcepts: [
          { title: "Sum of angles of any triangle = 180°" },
          { title: "Proof using parallel lines through a vertex" },
        ],
      },
      {
        sectionNumber: "7.3",
        title: "Exterior Angle Theorem",
        microConcepts: [
          { title: "Exterior angle = sum of two non-adjacent interior angles" },
          { title: "Exterior angle is greater than either non-adjacent interior angle" },
        ],
      },
      {
        sectionNumber: "7.4",
        title: "Constructing Equilateral Triangles",
        microConcepts: [
          { title: "Compass and ruler construction: arcs of equal radius from each end" },
          { title: "All angles of equilateral triangle = 60°" },
        ],
      },
    ],
    keyFormulas: [
      "∠A + ∠B + ∠C = 180°",
      "Exterior angle = sum of two non-adjacent interior angles",
    ],
    examTips: [
      "In a right triangle the two acute angles sum to 90°.",
      "Equilateral triangle: all angles = 60°.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Triangles", questionCount: 10 }],
  },
  {
    chapterNumber: 8,
    title: "Working with Fractions",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Fractions and Decimals",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Covers multiplication and division of fractions, reciprocals, and fraction word problems.",
    sections: [
      {
        sectionNumber: "8.1",
        title: "Multiplication of Fractions",
        microConcepts: [
          { title: "Fraction × whole number: multiply numerator" },
          { title: "Fraction × fraction: (a/b) × (c/d) = ac/bd" },
          { title: "'Of' means multiply: 2/3 of 15 = 2/3 × 15" },
          { title: "Area model for fraction multiplication" },
        ],
      },
      {
        sectionNumber: "8.2",
        title: "Division of Fractions",
        microConcepts: [
          { title: "Reciprocal: flip numerator and denominator" },
          { title: "Divide = multiply by reciprocal: a/b ÷ c/d = a/b × d/c" },
          { title: "Convert mixed numbers to improper fractions first" },
        ],
      },
    ],
    keyFormulas: [
      "a/b × c/d = ac/bd",
      "a/b ÷ c/d = a/b × d/c",
    ],
    examTips: [
      "'Of' in a word problem means multiply.",
      "Always simplify/cancel before multiplying.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Fractions", questionCount: 10 }],
  },
  {
    chapterNumber: 9,
    title: "Geometric Twins",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Geometry",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Introduces congruence of geometric figures and the SSS, SAS, ASA, RHS congruence criteria for triangles.",
    sections: [
      {
        sectionNumber: "9.1",
        title: "Congruent Figures",
        microConcepts: [
          { title: "Congruence: same shape AND same size" },
          { title: "Notation: △ABC ≅ △PQR (order of vertices matters)" },
          { title: "Corresponding parts: matched vertices, sides, angles" },
        ],
      },
      {
        sectionNumber: "9.2",
        title: "Congruence Criteria for Triangles",
        microConcepts: [
          { title: "SSS: three pairs of equal sides" },
          { title: "SAS: two sides and the included angle" },
          { title: "ASA: two angles and the included side" },
          { title: "RHS: right angle, hypotenuse, one side (right triangles only)" },
          { title: "SSA is NOT a valid criterion (ambiguous case)" },
        ],
      },
      {
        sectionNumber: "9.3",
        title: "CPCT",
        microConcepts: [
          { title: "CPCT: Corresponding Parts of Congruent Triangles are equal" },
          { title: "Only usable AFTER congruence is proved" },
        ],
      },
    ],
    keyFormulas: [
      "SSS, SAS, ASA, RHS are valid congruence criteria",
      "CPCT: all corresponding parts equal once congruence is established",
    ],
    examTips: [
      "Vertex ORDER in △ABC ≅ △PQR is critical: A↔P, B↔Q, C↔R.",
      "CPCT can only be applied after proving congruence.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Congruence", questionCount: 10 }],
  },
  {
    chapterNumber: 10,
    title: "Operations with Integers",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Number System",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Extends integer knowledge to multiplication and division, including sign rules and integer word problems.",
    sections: [
      {
        sectionNumber: "10.1",
        title: "Recap and Multiplication of Integers",
        microConcepts: [
          { title: "(+) × (+) = (+)" },
          { title: "(−) × (−) = (+)" },
          { title: "(+) × (−) = (−)" },
          { title: "Even number of negative factors → positive product" },
          { title: "Odd number of negative factors → negative product" },
        ],
      },
      {
        sectionNumber: "10.2",
        title: "Division of Integers",
        microConcepts: [
          { title: "Same signs → positive quotient" },
          { title: "Different signs → negative quotient" },
          { title: "Division by zero is undefined" },
        ],
      },
    ],
    keyFormulas: [
      "(−) × (−) = (+), (+) × (−) = (−)",
      "Same rule applies to division",
    ],
    examTips: [
      "Count negative signs: even = positive, odd = negative.",
      "−3² = −9 (not 9); (−3)² = 9 — brackets matter.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Integers", questionCount: 10 }],
  },
  {
    chapterNumber: 11,
    title: "Finding Common Ground",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Number System",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Covers HCF and LCM — prime factorisation method, division method, and real-life applications.",
    sections: [
      {
        sectionNumber: "11.1",
        title: "Highest Common Factor (HCF)",
        microConcepts: [
          { title: "HCF = product of common prime factors with lowest powers" },
          { title: "Prime factorisation method for HCF" },
          { title: "Real-life: largest equal group size" },
        ],
      },
      {
        sectionNumber: "11.2",
        title: "Lowest Common Multiple (LCM)",
        microConcepts: [
          { title: "LCM = product of all prime factors with highest powers" },
          { title: "Prime factorisation method for LCM" },
          { title: "Real-life: first time two events coincide" },
        ],
      },
      {
        sectionNumber: "11.3",
        title: "Relationship Between HCF and LCM",
        microConcepts: [
          { title: "HCF × LCM = product of the two numbers" },
          { title: "Use this to find LCM when HCF is known" },
        ],
      },
    ],
    keyFormulas: [
      "HCF × LCM = a × b (for two numbers a and b)",
    ],
    examTips: [
      "HCF: lowest powers of COMMON primes. LCM: highest powers of ALL primes.",
      "'Largest group' → HCF. 'First coincidence' → LCM.",
    ],
    exercises: [{ exerciseNumber: 1, title: "HCF and LCM", questionCount: 10 }],
  },
  {
    chapterNumber: 12,
    title: "Another Peek Beyond the Point",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Fractions and Decimals",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Extends decimal knowledge to multiplication and division, including the decimal point shift rule.",
    sections: [
      {
        sectionNumber: "12.1",
        title: "Multiplying Decimals",
        microConcepts: [
          { title: "Multiply as whole numbers, then count total decimal places" },
          { title: "Decimal × 10: shift point 1 right; × 100: shift 2 right" },
          { title: "Decimal × 0.1: shift point 1 left" },
        ],
      },
      {
        sectionNumber: "12.2",
        title: "Dividing Decimals",
        microConcepts: [
          { title: "Decimal ÷ whole number: align decimal in quotient" },
          { title: "Decimal ÷ decimal: multiply both by 10/100 to clear decimal in divisor" },
        ],
      },
    ],
    keyFormulas: [
      "Total decimal places in product = sum of decimal places in both factors",
      "Decimal × 10^n: shift decimal n places right",
    ],
    examTips: [
      "Count decimal places in BOTH factors for the product.",
      "To divide by decimal, multiply both by same power of 10 first.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Decimal Operations", questionCount: 10 }],
  },
  {
    chapterNumber: 13,
    title: "Connecting the Dots",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Data Handling",
    examMarks: 6,
    estimatedWeeks: 1,
    overview: "Introduction to data handling: organising data, mean, median, mode, range, and reading bar graphs.",
    sections: [
      {
        sectionNumber: "13.1",
        title: "Organising Data",
        microConcepts: [
          { title: "Tally marks and frequency tables" },
          { title: "Range = maximum − minimum" },
        ],
      },
      {
        sectionNumber: "13.2",
        title: "Measures of Central Tendency",
        microConcepts: [
          { title: "Mean = sum ÷ count" },
          { title: "Median: sort data, pick middle value" },
          { title: "Mode: value that appears most often" },
          { title: "A dataset can be bimodal (two modes)" },
        ],
      },
      {
        sectionNumber: "13.3",
        title: "Graphs",
        microConcepts: [
          { title: "Bar graphs: frequency on y-axis, category on x-axis" },
          { title: "Pictographs: each symbol represents a fixed quantity" },
        ],
      },
    ],
    keyFormulas: [
      "Mean = (sum of all values) / (number of values)",
      "Range = Maximum − Minimum",
    ],
    examTips: [
      "Always sort data before finding median.",
      "If even count, median = average of two middle values.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Data Handling", questionCount: 8 }],
  },
  {
    chapterNumber: 14,
    title: "Constructions and Tilings",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Geometry",
    examMarks: 6,
    estimatedWeeks: 1,
    overview: "Geometric constructions using compass and ruler — perpendicular bisector, angle bisector — and exploring tessellations.",
    sections: [
      {
        sectionNumber: "14.1",
        title: "Geometric Constructions",
        microConcepts: [
          { title: "Perpendicular bisector: arcs from both endpoints at equal radius >half segment" },
          { title: "Angle bisector: arc from vertex, equal arcs from intersection points on sides" },
          { title: "Copying a given angle using compass" },
        ],
      },
      {
        sectionNumber: "14.2",
        title: "Tilings and Tessellations",
        microConcepts: [
          { title: "Tessellation: covering the plane with shapes, no gaps or overlaps" },
          { title: "Only equilateral triangle (60°), square (90°), regular hexagon (120°) tessellate alone" },
          { title: "Interior angle must divide 360° evenly for regular tessellation" },
        ],
      },
    ],
    keyFormulas: [
      "Interior angle of regular polygon = (n−2)×180°/n",
      "For solo tessellation: 360° ÷ interior angle = whole number",
    ],
    examTips: [
      "Perpendicular bisector: compass must be set to MORE than half the segment.",
      "Only 3 regular polygons tessellate alone: equilateral triangle, square, regular hexagon.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Constructions", questionCount: 8 }],
  },
  {
    chapterNumber: 15,
    title: "Finding the Unknown",
    subject: "Mathematics",
    grade: "7",
    board: "CBSE",
    unit: "Algebra",
    examMarks: 8,
    estimatedWeeks: 2,
    overview: "Introduces simple linear equations in one variable — forming equations, solving by balancing, and word problems.",
    sections: [
      {
        sectionNumber: "15.1",
        title: "Equations and the Balance Model",
        microConcepts: [
          { title: "Equation: two expressions set equal, has a solution" },
          { title: "Balance model: same operation on both sides preserves equality" },
        ],
      },
      {
        sectionNumber: "15.2",
        title: "Solving Equations",
        microConcepts: [
          { title: "Transposition: moving a term across = changes its sign" },
          { title: "Collect variable terms on one side, constants on other" },
          { title: "Divide both sides by coefficient of variable" },
          { title: "Always verify by substituting solution back" },
        ],
      },
      {
        sectionNumber: "15.3",
        title: "Word Problems as Equations",
        microConcepts: [
          { title: "Assign variable to unknown, form equation from given conditions" },
          { title: "Solve and interpret the answer in context" },
        ],
      },
    ],
    keyFormulas: [
      "If a + b = c → a = c − b",
      "If ax = b → x = b/a",
    ],
    examTips: [
      "Sign changes when a term crosses the equality sign (transposition).",
      "Always verify: substitute solution back into original equation.",
    ],
    exercises: [{ exerciseNumber: 1, title: "Equations", questionCount: 10 }],
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

  console.log(`\nSeeded ${chapters.length} chapters for CBSE Class 7 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
