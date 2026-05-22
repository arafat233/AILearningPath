/**
 * CBSE Class 5 Mathematics — Chapter (Curriculum) seed
 * Textbook: "Maths Magic" Grade 5 (NCERT)
 * 14 chapters. Safe to re-run.
 * Usage: node config/seedMath5Curriculum.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Chapter } from "../models/chapterModel.js";

const chapters = [
  {
    grade: "5",
    subject: "Mathematics",
    chapterNumber: 1,
    title: "The Fish Tale",
    description: "Exploring multiplication, large numbers, and fractions through real-world stories about fish and water.",
    sections: [
      { sectionNumber: "1.1", title: "Big Numbers in Real Life", microConcepts: [{ title: "reading and writing large numbers" }, { title: "place value up to lakhs" }] },
      { sectionNumber: "1.2", title: "Fractions in Context",     microConcepts: [{ title: "fraction as part of a whole" }, { title: "simple fractions" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Read and write numbers up to lakhs", "Understand fractions in real-world contexts"],
    prerequisiteChapters: [],
  },
  {
    grade: "5",
    subject: "Mathematics",
    chapterNumber: 2,
    title: "Shapes and Angles",
    description: "Identifying and measuring angles; understanding types of angles and their properties.",
    sections: [
      { sectionNumber: "2.1", title: "Types of Angles",    microConcepts: [{ title: "acute angle" }, { title: "obtuse angle" }, { title: "right angle" }, { title: "straight angle" }] },
      { sectionNumber: "2.2", title: "Measuring Angles",  microConcepts: [{ title: "using a protractor" }, { title: "degrees" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Identify types of angles", "Measure angles using a protractor"],
    prerequisiteChapters: [],
  },
  {
    grade: "5",
    subject: "Mathematics",
    chapterNumber: 3,
    title: "How Many Squares?",
    description: "Estimating and finding area by counting unit squares; understanding area as covering a region.",
    sections: [
      { sectionNumber: "3.1", title: "Counting Squares",         microConcepts: [{ title: "area by counting unit squares" }, { title: "full and half squares" }] },
      { sectionNumber: "3.2", title: "Estimating Area",          microConcepts: [{ title: "estimation strategies" }, { title: "comparing areas" }] },
    ],
    keyFormulas: ["Area ≈ number of unit squares covered"],
    learningObjectives: ["Estimate area by counting squares", "Compare areas of irregular shapes"],
    prerequisiteChapters: [],
  },
  {
    grade: "5",
    subject: "Mathematics",
    chapterNumber: 4,
    title: "Parts and Wholes",
    description: "Understanding fractions as parts of a whole, equivalent fractions, and fractions in everyday life.",
    sections: [
      { sectionNumber: "4.1", title: "Fractions as Parts",        microConcepts: [{ title: "numerator and denominator" }, { title: "unit fraction" }] },
      { sectionNumber: "4.2", title: "Equivalent Fractions",      microConcepts: [{ title: "making equivalent fractions" }, { title: "simplest form" }] },
      { sectionNumber: "4.3", title: "Comparing Fractions",       microConcepts: [{ title: "comparing like fractions" }, { title: "comparing unlike fractions" }] },
    ],
    keyFormulas: ["Equivalent fractions: a/b = (a×k)/(b×k)"],
    learningObjectives: ["Identify and create equivalent fractions", "Compare and order fractions"],
    prerequisiteChapters: [],
  },
  {
    grade: "5",
    subject: "Mathematics",
    chapterNumber: 5,
    title: "Does it Look the Same?",
    description: "Exploring symmetry, reflections, and rotations of shapes in 2D.",
    sections: [
      { sectionNumber: "5.1", title: "Line Symmetry",         microConcepts: [{ title: "axis of symmetry" }, { title: "mirror image" }] },
      { sectionNumber: "5.2", title: "Rotational Symmetry",   microConcepts: [{ title: "rotation" }, { title: "order of symmetry" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Identify lines of symmetry", "Understand rotational symmetry"],
    prerequisiteChapters: [],
  },
  {
    grade: "5",
    subject: "Mathematics",
    chapterNumber: 6,
    title: "Be My Multiple, I'll Be Your Factor",
    description: "Understanding factors, multiples, prime and composite numbers, LCM and HCF.",
    sections: [
      { sectionNumber: "6.1", title: "Factors and Multiples",      microConcepts: [{ title: "factor" }, { title: "multiple" }, { title: "factor pairs" }] },
      { sectionNumber: "6.2", title: "Prime and Composite Numbers", microConcepts: [{ title: "prime number" }, { title: "composite number" }, { title: "sieve of Eratosthenes" }] },
      { sectionNumber: "6.3", title: "HCF and LCM",                microConcepts: [{ title: "highest common factor" }, { title: "least common multiple" }] },
    ],
    keyFormulas: ["HCF × LCM = Product of two numbers"],
    learningObjectives: ["Find factors and multiples", "Identify prime numbers", "Calculate HCF and LCM"],
    prerequisiteChapters: [],
  },
  {
    grade: "5",
    subject: "Mathematics",
    chapterNumber: 7,
    title: "Can You See the Pattern?",
    description: "Identifying and extending number patterns, shape patterns, and patterns in nature.",
    sections: [
      { sectionNumber: "7.1", title: "Number Patterns",  microConcepts: [{ title: "arithmetic sequence" }, { title: "finding the rule" }] },
      { sectionNumber: "7.2", title: "Shape Patterns",   microConcepts: [{ title: "repeating patterns" }, { title: "growing patterns" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Identify rules in number patterns", "Extend patterns"],
    prerequisiteChapters: [],
  },
  {
    grade: "5",
    subject: "Mathematics",
    chapterNumber: 8,
    title: "Mapping Your Way",
    description: "Reading and making maps; understanding directions, scale, and distance.",
    sections: [
      { sectionNumber: "8.1", title: "Directions and Maps", microConcepts: [{ title: "compass directions" }, { title: "map reading" }] },
      { sectionNumber: "8.2", title: "Scale and Distance",  microConcepts: [{ title: "map scale" }, { title: "calculating real distance" }] },
    ],
    keyFormulas: ["Real distance = Map distance × Scale"],
    learningObjectives: ["Read simple maps", "Use scale to calculate distances"],
    prerequisiteChapters: [],
  },
  {
    grade: "5",
    subject: "Mathematics",
    chapterNumber: 9,
    title: "Boxes and Sketches",
    description: "Exploring 3D shapes: faces, edges, vertices, and their nets.",
    sections: [
      { sectionNumber: "9.1", title: "3D Shapes",       microConcepts: [{ title: "faces" }, { title: "edges" }, { title: "vertices" }, { title: "Euler's relation" }] },
      { sectionNumber: "9.2", title: "Nets of Shapes",  microConcepts: [{ title: "net of a cube" }, { title: "net of a cuboid" }] },
    ],
    keyFormulas: ["Euler's formula: F + V − E = 2"],
    learningObjectives: ["Identify faces, edges, vertices of 3D shapes", "Draw and identify nets"],
    prerequisiteChapters: [],
  },
  {
    grade: "5",
    subject: "Mathematics",
    chapterNumber: 10,
    title: "Tenths and Hundredths",
    description: "Introduction to decimal numbers: tenths, hundredths, and converting between fractions and decimals.",
    sections: [
      { sectionNumber: "10.1", title: "Tenths",           microConcepts: [{ title: "decimal as tenths" }, { title: "fraction to decimal" }] },
      { sectionNumber: "10.2", title: "Hundredths",       microConcepts: [{ title: "decimal as hundredths" }, { title: "place value in decimals" }] },
      { sectionNumber: "10.3", title: "Comparing Decimals", microConcepts: [{ title: "ordering decimals" }, { title: "decimal on number line" }] },
    ],
    keyFormulas: ["1/10 = 0.1", "1/100 = 0.01"],
    learningObjectives: ["Read and write decimals up to hundredths", "Convert between fractions and decimals"],
    prerequisiteChapters: [],
  },
  {
    grade: "5",
    subject: "Mathematics",
    chapterNumber: 11,
    title: "Area and Its Boundary",
    description: "Understanding the difference between perimeter (boundary) and area; calculating both for rectangles.",
    sections: [
      { sectionNumber: "11.1", title: "Perimeter",                 microConcepts: [{ title: "perimeter as boundary length" }, { title: "perimeter of rectangle" }] },
      { sectionNumber: "11.2", title: "Area",                      microConcepts: [{ title: "area of rectangle" }, { title: "area of square" }] },
      { sectionNumber: "11.3", title: "Area vs Perimeter",         microConcepts: [{ title: "shapes with same area but different perimeter" }, { title: "shapes with same perimeter but different area" }] },
    ],
    keyFormulas: ["Perimeter of rectangle = 2(l+b)", "Area of rectangle = l × b"],
    learningObjectives: ["Calculate area and perimeter", "Understand the difference between area and perimeter"],
    prerequisiteChapters: [],
  },
  {
    grade: "5",
    subject: "Mathematics",
    chapterNumber: 12,
    title: "Smart Charts",
    description: "Reading and creating pictographs, bar graphs, and interpreting data.",
    sections: [
      { sectionNumber: "12.1", title: "Pictographs",  microConcepts: [{ title: "reading pictographs" }, { title: "key/legend" }] },
      { sectionNumber: "12.2", title: "Bar Graphs",   microConcepts: [{ title: "reading bar graphs" }, { title: "drawing bar graphs" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Read pictographs and bar graphs", "Draw a bar graph from data"],
    prerequisiteChapters: [],
  },
  {
    grade: "5",
    subject: "Mathematics",
    chapterNumber: 13,
    title: "Ways to Multiply and Divide",
    description: "Strategies for multiplication and division of larger numbers, including estimation and word problems.",
    sections: [
      { sectionNumber: "13.1", title: "Multiplication Strategies", microConcepts: [{ title: "lattice multiplication" }, { title: "expanded form multiplication" }] },
      { sectionNumber: "13.2", title: "Division Strategies",       microConcepts: [{ title: "long division" }, { title: "estimation in division" }] },
    ],
    keyFormulas: ["Dividend = Divisor × Quotient + Remainder"],
    learningObjectives: ["Multiply 3-digit numbers", "Divide with remainder", "Estimate products and quotients"],
    prerequisiteChapters: [],
  },
  {
    grade: "5",
    subject: "Mathematics",
    chapterNumber: 14,
    title: "How Big? How Heavy?",
    description: "Measuring and comparing weight, volume, and capacity using standard units.",
    sections: [
      { sectionNumber: "14.1", title: "Weight and Mass",    microConcepts: [{ title: "gram and kilogram" }, { title: "converting units of weight" }] },
      { sectionNumber: "14.2", title: "Volume and Capacity", microConcepts: [{ title: "litre and millilitre" }, { title: "converting units of capacity" }] },
    ],
    keyFormulas: ["1 kg = 1000 g", "1 L = 1000 mL"],
    learningObjectives: ["Convert between units of weight", "Convert between units of capacity"],
    prerequisiteChapters: [],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  for (const ch of chapters) {
    await Chapter.findOneAndUpdate(
      { grade: ch.grade, subject: ch.subject, chapterNumber: ch.chapterNumber },
      ch,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ Ch${ch.chapterNumber}: ${ch.title}`);
  }

  console.log(`\nSeeded ${chapters.length} chapters for CBSE Class 5 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
