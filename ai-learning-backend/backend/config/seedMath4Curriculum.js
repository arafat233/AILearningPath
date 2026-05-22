/**
 * CBSE Class 4 Mathematics — Chapter (Curriculum) seed
 * Textbook: "Math Magic" Grade 4 (NCERT)
 * 14 chapters. Safe to re-run.
 * Usage: node config/seedMath4Curriculum.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Chapter } from "../models/chapterModel.js";

const chapters = [
  {
    grade: "4", subject: "Mathematics", chapterNumber: 1,
    title: "Building with Bricks",
    description: "Exploring shapes, patterns, and spatial understanding through brick-building activities.",
    sections: [
      { sectionNumber: "1.1", title: "Brick Patterns",     microConcepts: [{ title: "2D and 3D brick arrangements" }, { title: "recognising patterns in structures" }] },
      { sectionNumber: "1.2", title: "Shapes from Bricks", microConcepts: [{ title: "faces of bricks" }, { title: "counting bricks in a stack" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Identify and create brick patterns", "Understand 3D shapes through hands-on activity"],
    prerequisiteChapters: [],
  },
  {
    grade: "4", subject: "Mathematics", chapterNumber: 2,
    title: "Long and Short",
    description: "Measuring and comparing lengths using standard units (cm, m, km) and estimating distances.",
    sections: [
      { sectionNumber: "2.1", title: "Measuring Length",    microConcepts: [{ title: "centimetre and metre" }, { title: "using a ruler" }] },
      { sectionNumber: "2.2", title: "Kilometre",          microConcepts: [{ title: "kilometre" }, { title: "converting km to m" }] },
      { sectionNumber: "2.3", title: "Estimating Length",  microConcepts: [{ title: "estimation strategies" }, { title: "comparing lengths" }] },
    ],
    keyFormulas: ["1 m = 100 cm", "1 km = 1000 m"],
    learningObjectives: ["Measure lengths using standard units", "Convert between units of length", "Estimate lengths"],
    prerequisiteChapters: [],
  },
  {
    grade: "4", subject: "Mathematics", chapterNumber: 3,
    title: "A Trip to Bhopal",
    description: "Applying multiplication and money concepts through real-life travel and shopping problems.",
    sections: [
      { sectionNumber: "3.1", title: "Money Problems",       microConcepts: [{ title: "rupees and paise" }, { title: "addition and subtraction of money" }] },
      { sectionNumber: "3.2", title: "Multiplication of Money", microConcepts: [{ title: "multiplying a price by quantity" }, { title: "finding total cost" }] },
    ],
    keyFormulas: ["Total cost = Price × Quantity", "1 rupee = 100 paise"],
    learningObjectives: ["Solve money problems involving multiplication", "Make change and calculate totals"],
    prerequisiteChapters: [],
  },
  {
    grade: "4", subject: "Mathematics", chapterNumber: 4,
    title: "Tick-Tick-Tick",
    description: "Reading clocks, understanding hours and minutes, and calculating time intervals.",
    sections: [
      { sectionNumber: "4.1", title: "Reading the Clock",   microConcepts: [{ title: "hour and minute hands" }, { title: "reading time to nearest 5 minutes" }] },
      { sectionNumber: "4.2", title: "Time Duration",       microConcepts: [{ title: "elapsed time" }, { title: "AM and PM" }] },
    ],
    keyFormulas: ["1 hour = 60 minutes", "1 minute = 60 seconds"],
    learningObjectives: ["Read analogue and digital clocks", "Calculate time duration"],
    prerequisiteChapters: [],
  },
  {
    grade: "4", subject: "Mathematics", chapterNumber: 5,
    title: "The Way The World Looks",
    description: "Understanding top views, front views, and side views of 3D objects; introduction to mapping.",
    sections: [
      { sectionNumber: "5.1", title: "Different Views",  microConcepts: [{ title: "top view" }, { title: "front view" }, { title: "side view" }] },
      { sectionNumber: "5.2", title: "Simple Maps",      microConcepts: [{ title: "bird's-eye view" }, { title: "directions on a map" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Identify top, front, and side views of objects", "Read simple maps"],
    prerequisiteChapters: [],
  },
  {
    grade: "4", subject: "Mathematics", chapterNumber: 6,
    title: "The Junk Seller",
    description: "Using weight and money in practical buying and selling situations; estimating and comparing weights.",
    sections: [
      { sectionNumber: "6.1", title: "Buying and Selling",  microConcepts: [{ title: "profit and cost" }, { title: "estimating value" }] },
      { sectionNumber: "6.2", title: "Weight Problems",     microConcepts: [{ title: "kilogram and gram" }, { title: "comparing weights" }] },
    ],
    keyFormulas: ["1 kg = 1000 g"],
    learningObjectives: ["Solve practical weight and money problems", "Estimate and compare weights"],
    prerequisiteChapters: [],
  },
  {
    grade: "4", subject: "Mathematics", chapterNumber: 7,
    title: "Jugs and Mugs",
    description: "Measuring capacity (volume of liquid) using litres and millilitres; practical problems.",
    sections: [
      { sectionNumber: "7.1", title: "Litre and Millilitre", microConcepts: [{ title: "litre" }, { title: "millilitre" }, { title: "converting L and mL" }] },
      { sectionNumber: "7.2", title: "Capacity Problems",    microConcepts: [{ title: "adding and subtracting capacity" }, { title: "estimation of capacity" }] },
    ],
    keyFormulas: ["1 L = 1000 mL"],
    learningObjectives: ["Measure capacity in litres and millilitres", "Solve capacity word problems"],
    prerequisiteChapters: [],
  },
  {
    grade: "4", subject: "Mathematics", chapterNumber: 8,
    title: "Carts and Wheels",
    description: "Exploring circles, radius, diameter, and circumference through the context of wheels.",
    sections: [
      { sectionNumber: "8.1", title: "Circles",            microConcepts: [{ title: "centre" }, { title: "radius" }, { title: "diameter" }] },
      { sectionNumber: "8.2", title: "Comparing Circles",  microConcepts: [{ title: "comparing radii" }, { title: "diameter = 2 × radius" }] },
    ],
    keyFormulas: ["Diameter = 2 × Radius"],
    learningObjectives: ["Identify parts of a circle", "Use the relationship between diameter and radius"],
    prerequisiteChapters: [],
  },
  {
    grade: "4", subject: "Mathematics", chapterNumber: 9,
    title: "Halves and Quarters",
    description: "Understanding fractions as equal parts: halves, quarters, and three-quarters in real contexts.",
    sections: [
      { sectionNumber: "9.1", title: "Halves",    microConcepts: [{ title: "half of a whole" }, { title: "1/2 of a quantity" }] },
      { sectionNumber: "9.2", title: "Quarters",  microConcepts: [{ title: "quarter of a whole" }, { title: "1/4 and 3/4" }] },
    ],
    keyFormulas: ["1 whole = 2 halves = 4 quarters"],
    learningObjectives: ["Identify halves and quarters of shapes and quantities", "Compare halves and quarters"],
    prerequisiteChapters: [],
  },
  {
    grade: "4", subject: "Mathematics", chapterNumber: 10,
    title: "Play with Patterns",
    description: "Identifying, continuing, and creating patterns using numbers, shapes, and colours.",
    sections: [
      { sectionNumber: "10.1", title: "Number Patterns",  microConcepts: [{ title: "counting patterns" }, { title: "odd and even number patterns" }] },
      { sectionNumber: "10.2", title: "Shape Patterns",   microConcepts: [{ title: "repeating shape patterns" }, { title: "tiling patterns" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Identify and extend patterns", "Create patterns using given rules"],
    prerequisiteChapters: [],
  },
  {
    grade: "4", subject: "Mathematics", chapterNumber: 11,
    title: "Tables and Shares",
    description: "Multiplication tables (up to 12×12), division as equal sharing, and relating multiplication to division.",
    sections: [
      { sectionNumber: "11.1", title: "Multiplication Tables",   microConcepts: [{ title: "tables from 2 to 12" }, { title: "commutativity of multiplication" }] },
      { sectionNumber: "11.2", title: "Division as Sharing",     microConcepts: [{ title: "equal sharing" }, { title: "division as inverse of multiplication" }] },
    ],
    keyFormulas: ["a × b = b × a", "If a × b = c then c ÷ a = b"],
    learningObjectives: ["Recall multiplication tables up to 12×12", "Understand and perform division"],
    prerequisiteChapters: [],
  },
  {
    grade: "4", subject: "Mathematics", chapterNumber: 12,
    title: "How Heavy? How Light?",
    description: "Estimating, comparing, and measuring weights; solving problems involving balance and mass.",
    sections: [
      { sectionNumber: "12.1", title: "Estimating Weight",    microConcepts: [{ title: "heavier and lighter" }, { title: "balance scale" }] },
      { sectionNumber: "12.2", title: "Units of Weight",      microConcepts: [{ title: "gram and kilogram" }, { title: "mixed weight problems" }] },
    ],
    keyFormulas: ["1 kg = 1000 g"],
    learningObjectives: ["Estimate and compare weights", "Solve weight word problems"],
    prerequisiteChapters: [],
  },
  {
    grade: "4", subject: "Mathematics", chapterNumber: 13,
    title: "Fields and Fences",
    description: "Calculating perimeter and area of rectangles and squares in the context of fields and fencing.",
    sections: [
      { sectionNumber: "13.1", title: "Perimeter",   microConcepts: [{ title: "perimeter of rectangle" }, { title: "perimeter of square" }] },
      { sectionNumber: "13.2", title: "Area",        microConcepts: [{ title: "area by counting squares" }, { title: "area of rectangle" }] },
    ],
    keyFormulas: ["Perimeter of rectangle = 2(l + b)", "Area of rectangle = l × b"],
    learningObjectives: ["Calculate perimeter and area of rectangles", "Solve real-life fencing and field problems"],
    prerequisiteChapters: [],
  },
  {
    grade: "4", subject: "Mathematics", chapterNumber: 14,
    title: "Smart Charts",
    description: "Collecting, organising, and interpreting data using tally marks, tables, and pictographs.",
    sections: [
      { sectionNumber: "14.1", title: "Tally Marks and Tables", microConcepts: [{ title: "tally marks" }, { title: "frequency table" }] },
      { sectionNumber: "14.2", title: "Pictographs",            microConcepts: [{ title: "reading pictographs" }, { title: "making pictographs" }] },
    ],
    keyFormulas: [],
    learningObjectives: ["Record data using tally marks", "Read and create pictographs"],
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
  console.log(`\nSeeded ${chapters.length} chapters for CBSE Class 4 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
