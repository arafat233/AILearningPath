/**
 * CBSE Class 5 Mathematics — NcertTopicContent seed
 * Flat teaching_content format (isSciLike path on frontend)
 * 14 topics. Safe to re-run.
 * Usage: node config/seedMath5Content.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

dotenv.config();

const contents = [
  {
    topicId: "math5_ch1",
    title: "The Fish Tale",
    teaching_content: {
      intuition: "Numbers can be huge — fishermen catch thousands of fish and sell them by weight. This chapter uses real stories to make big numbers and simple fractions feel natural, not scary.",
      process_explanation: "Large numbers: group digits in sets of 3 from the right — ones, thousands, lakhs. Read 3,25,000 as 'three lakh twenty-five thousand'. Fractions arise when you share a catch: if 4 people share 12 fish equally, each gets 12/4 = 3 fish.",
      worked_example: "A boat brings 1,25,000 fish in a year. Write it in words: one lakh twenty-five thousand. If the boat catches 500 fish on Monday and sells 3/5 of them, how many are sold? 3/5 × 500 = 300 fish sold.",
      common_misconceptions: "Students often confuse 'lakh' and 'thousand' place values when writing large numbers. Remember: 1 lakh = 1,00,000 (6 digits).",
      shortcuts_and_tricks: "To quickly find a fraction of a quantity, divide by the denominator first, then multiply by the numerator. 3/5 of 500 → 500÷5=100, then 100×3=300.",
      key_takeaway: "Big numbers become manageable when you group digits, and fractions become concrete when you use real sharing situations.",
    },
  },
  {
    topicId: "math5_ch2",
    title: "Shapes and Angles",
    teaching_content: {
      intuition: "An angle is the opening between two rays meeting at a point — like the hands of a clock or the corner of a page. The bigger the opening, the bigger the angle.",
      process_explanation: "Types: Right angle = 90° (corner of a square), Acute angle < 90°, Obtuse angle > 90° and < 180°, Straight angle = 180°. Measure with a protractor: place the centre on the vertex, align one ray with 0°, read where the other ray points.",
      worked_example: "Measure the angle between the hour and minute hand at 3:00. The minute hand is at 12 (0°) and the hour hand is at 3 (90°). The angle is 90° — a right angle.",
      common_misconceptions: "Students mistake the direction of measurement — always measure from the base ray (0°). Also, an obtuse angle looks 'blunt' but is still less than 180°.",
      shortcuts_and_tricks: "Clock trick: each hour mark = 30°. From 12 to 3 = 3 × 30° = 90°.",
      key_takeaway: "Angles describe how much 'opening' there is between two lines. Right = 90°, Acute < 90°, Obtuse between 90° and 180°.",
    },
  },
  {
    topicId: "math5_ch3",
    title: "How Many Squares?",
    teaching_content: {
      intuition: "Area is the amount of surface a shape covers. The simplest way to measure it is to count how many unit squares fit inside — like tiling a floor with tiles.",
      process_explanation: "Count full squares: each counts as 1. Count half squares: two halves = 1 full square. For irregular shapes, trace onto squared paper and count. Estimate by rounding: shapes that are mostly full count as 1, mostly empty count as 0.",
      worked_example: "A leaf is traced on squared paper. It covers 8 full squares and 6 half squares. Area ≈ 8 + (6÷2) = 8 + 3 = 11 square units.",
      common_misconceptions: "Students count border squares as full squares even when they are clearly less than half. Only count a boundary square if it's more than half inside the shape.",
      shortcuts_and_tricks: "Pair up all the half squares first — every pair gives you 1 full square. Then add to the full-square count.",
      key_takeaway: "Area = number of unit squares that fit inside a shape. Count full squares + pair up halves.",
    },
  },
  {
    topicId: "math5_ch4",
    title: "Parts and Wholes",
    teaching_content: {
      intuition: "When you share a pizza among friends, each slice is a fraction of the whole pizza. Fractions describe equal parts — the bottom number (denominator) says how many equal parts the whole is split into, and the top (numerator) says how many parts you have.",
      process_explanation: "Equivalent fractions: multiply (or divide) numerator and denominator by the same number. 1/2 = 2/4 = 3/6. Simplest form: divide both by their GCD. Comparing: if denominators are the same, the bigger numerator is larger; otherwise, convert to a common denominator.",
      worked_example: "Are 2/3 and 4/6 equivalent? 4/6 ÷ 2/2 = 2/3. Yes! To compare 3/4 and 5/8: convert 3/4 = 6/8. Since 6/8 > 5/8, so 3/4 > 5/8.",
      common_misconceptions: "Students think 1/4 > 1/3 because 4 > 3. Wrong: the bigger the denominator, the smaller each piece. 1/4 < 1/3.",
      shortcuts_and_tricks: "To compare two fractions quickly: cross multiply. 3/4 vs 5/8 → 3×8=24 vs 5×4=20. Since 24>20, so 3/4 > 5/8.",
      key_takeaway: "Equivalent fractions look different but represent the same amount. Always simplify by dividing by the GCD.",
    },
  },
  {
    topicId: "math5_ch5",
    title: "Does it Look the Same?",
    teaching_content: {
      intuition: "Symmetry is nature's way of balancing things — butterflies, leaves, snowflakes all have symmetry. A shape is symmetric if one half is a mirror image of the other half.",
      process_explanation: "Line symmetry: a line that divides a shape into two identical halves. To check, fold along the line — if both halves match, it's a line of symmetry. Rotational symmetry: a shape has rotational symmetry if it looks the same after being rotated less than 360°. The number of times it matches in one full rotation is the order.",
      worked_example: "Does the letter H have line symmetry? Fold vertically — left and right match ✓. Fold horizontally — top and bottom match ✓. H has 2 lines of symmetry. Does a square have rotational symmetry? Yes, order 4 — it looks the same after 90°, 180°, 270°, 360°.",
      common_misconceptions: "Students confuse lines of symmetry with diagonals. Not all diagonals are lines of symmetry — only those that produce two identical halves.",
      shortcuts_and_tricks: "For regular polygons: number of lines of symmetry = number of sides. Order of rotational symmetry = number of sides.",
      key_takeaway: "Line symmetry → fold test (both halves match). Rotational symmetry → spin test (looks same after partial rotation).",
    },
  },
  {
    topicId: "math5_ch6",
    title: "Be My Multiple, I'll Be Your Factor",
    teaching_content: {
      intuition: "If 3 × 4 = 12, then 3 and 4 are factors of 12, and 12 is a multiple of both 3 and 4. Factors are the numbers you multiply together; multiples are what you get after multiplying.",
      process_explanation: "Factors of 12: find all pairs whose product is 12 → 1×12, 2×6, 3×4. Factors: {1,2,3,4,6,12}. Prime numbers have exactly 2 factors: 1 and themselves. HCF = highest number that divides both; LCM = smallest number divisible by both. Shortcut: HCF × LCM = product of the two numbers.",
      worked_example: "Find HCF and LCM of 12 and 18. Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. HCF = 6 (highest common factor). LCM = 12×18 ÷ 6 = 36.",
      common_misconceptions: "Students mix up HCF and LCM. HCF is always ≤ both numbers; LCM is always ≥ both numbers.",
      shortcuts_and_tricks: "To find LCM quickly: LCM = (product of both numbers) ÷ HCF.",
      key_takeaway: "HCF is the biggest shared factor; LCM is the smallest shared multiple. HCF × LCM = product of the two numbers.",
    },
  },
  {
    topicId: "math5_ch7",
    title: "Can You See the Pattern?",
    teaching_content: {
      intuition: "Patterns are everywhere — in floors, wallpaper, music, and numbers. Recognising the rule behind a pattern lets you predict what comes next without counting every step.",
      process_explanation: "Number patterns: find the constant difference (arithmetic), or ratio (geometric). Shapes: look for what changes (colour, size, orientation) and what stays the same. To extend: apply the same rule to the next term.",
      worked_example: "Pattern: 3, 7, 11, 15, ... → difference is +4 each time. Next two terms: 15+4=19, 19+4=23. Shape pattern: ▲, ▲▲, ▲▲▲, ... → 1 more triangle each step. After the 4th step: 4 triangles.",
      common_misconceptions: "Students assume every pattern adds the same number. Check by testing the difference between every consecutive pair, not just the first two.",
      shortcuts_and_tricks: "For an arithmetic pattern with first term 'a' and common difference 'd', the nth term = a + (n-1) × d.",
      key_takeaway: "Find the rule, then apply it. Arithmetic patterns add the same amount; geometric patterns multiply by the same amount.",
    },
  },
  {
    topicId: "math5_ch8",
    title: "Mapping Your Way",
    teaching_content: {
      intuition: "A map is a bird's-eye view of the world drawn small. A scale tells you how many real kilometres one centimetre on the map represents — so you can calculate actual distances.",
      process_explanation: "Directions: N, S, E, W, NE, NW, SE, SW. Map scale: if 1 cm = 5 km, then a line of 4 cm on the map = 4 × 5 = 20 km in real life. To find map distance from real distance: divide by scale factor.",
      worked_example: "A map has scale 1 cm = 10 km. Two towns are 3.5 cm apart on the map. Real distance = 3.5 × 10 = 35 km. If two places are 80 km apart in reality, map distance = 80 ÷ 10 = 8 cm.",
      common_misconceptions: "Students multiply when they should divide (and vice versa) when switching between map and real distances. Always ask: am I going from map to real (×scale) or real to map (÷scale)?",
      shortcuts_and_tricks: "Make a simple table: Map × Scale = Real. Cover the unknown and use the other two.",
      key_takeaway: "Real distance = Map distance × Scale factor. Map distance = Real distance ÷ Scale factor.",
    },
  },
  {
    topicId: "math5_ch9",
    title: "Boxes and Sketches",
    teaching_content: {
      intuition: "3D shapes are all around us — boxes, dice, cans. A net is what you get when you 'unfold' a 3D shape flat — like unfolding a cereal box. Understanding nets helps you see how 3D shapes are built from 2D faces.",
      process_explanation: "Key properties: Cube → 6 faces (all squares), 12 edges, 8 vertices. Cuboid → 6 faces (rectangles), 12 edges, 8 vertices. Euler's formula: Faces + Vertices − Edges = 2. A net must fold back into the 3D shape without overlapping faces.",
      worked_example: "A cube has F=6, V=8, E=12. Check: 6 + 8 − 12 = 2 ✓. For a triangular prism: F=5, V=6, E=9. Check: 5 + 6 − 9 = 2 ✓.",
      common_misconceptions: "Not every cross-shaped arrangement of 6 squares is a valid net of a cube — some squares overlap when folded. Test by mentally folding each face.",
      shortcuts_and_tricks: "A cube has exactly 11 distinct nets — all are valid. When in doubt, fold it on paper.",
      key_takeaway: "F + V − E = 2 for any convex 3D shape. A net unfolds a 3D shape into a flat 2D pattern.",
    },
  },
  {
    topicId: "math5_ch10",
    title: "Tenths and Hundredths",
    teaching_content: {
      intuition: "Decimals extend our number system past whole numbers. Just as 10 ones = 1 ten, 10 tenths = 1 one. The decimal point separates the whole-number part from the fractional part.",
      process_explanation: "Place value: ...hundreds | tens | ones . tenths | hundredths... Reading 3.47: three ones, four tenths, seven hundredths. Converting: 3/10 = 0.3; 47/100 = 0.47. Comparing: align decimal points and compare digit by digit from left to right.",
      worked_example: "Write 2/5 as a decimal. 2/5 = 4/10 = 0.4. Write 0.75 as a fraction: 75/100 = 3/4. Compare 0.6 and 0.58: 0.6 = 0.60 → 0.60 > 0.58.",
      common_misconceptions: "Students think 0.58 > 0.6 because 58 > 6. Always compare after aligning decimal points: 0.60 vs 0.58 — the tenths digits differ (6 > 5), so 0.60 > 0.58.",
      shortcuts_and_tricks: "To compare decimals, add trailing zeros so both have the same number of decimal places, then compare as whole numbers.",
      key_takeaway: "Tenths = first decimal place (÷10). Hundredths = second decimal place (÷100). Align decimal points to compare.",
    },
  },
  {
    topicId: "math5_ch11",
    title: "Area and Its Boundary",
    teaching_content: {
      intuition: "Perimeter is how far you walk around a shape (the fence); area is how much grass is inside (the lawn). Two shapes can have the same perimeter but completely different areas, and vice versa.",
      process_explanation: "Perimeter of rectangle = 2(l + b). Area of rectangle = l × b. Area of square = side². Shapes with same area can have different perimeters: a 4×6 rectangle and a 2×12 rectangle both have area 24 cm² but perimeters 20 cm and 28 cm respectively.",
      worked_example: "A rectangle has l=9 cm, b=4 cm. Perimeter = 2(9+4) = 26 cm. Area = 9×4 = 36 cm². A square with area 36 cm² has side = √36 = 6 cm. Its perimeter = 4×6 = 24 cm.",
      common_misconceptions: "Students use the same formula for perimeter and area, or forget to double in the perimeter formula. Remember: perimeter uses + and ×2; area uses only ×.",
      shortcuts_and_tricks: "For a square: if you know the area, the side = √area. Perimeter = 4 × side.",
      key_takeaway: "Perimeter goes around; area fills the inside. P = 2(l+b); A = l×b. Changing shape can change perimeter while keeping area constant.",
    },
  },
  {
    topicId: "math5_ch12",
    title: "Smart Charts",
    teaching_content: {
      intuition: "Charts turn rows of numbers into visual pictures that are easier to understand at a glance. A bar graph uses bars — the taller the bar, the larger the value.",
      process_explanation: "Pictograph: each symbol represents a fixed quantity (the key). Bar graph: each bar's height represents a value on the y-axis. To read: find the bar, look across to the y-axis. To draw: choose a scale, label axes, draw bars proportionally. Interpreting: find maximum, minimum, total, difference.",
      worked_example: "Bar graph: Monday=40 books, Tuesday=25, Wednesday=35, Thursday=50, Friday=30. Most books: Thursday (50). Least: Tuesday (25). Total = 40+25+35+50+30 = 180. Difference between most and least = 50−25 = 25.",
      common_misconceptions: "Students read the bar label on x-axis but forget to read the height on y-axis. Always look at the y-axis value, not just the bar's rough position.",
      shortcuts_and_tricks: "In a bar graph, the scale (e.g., each unit = 5 books) is always shown on the y-axis. Read the height and multiply by the scale.",
      key_takeaway: "Bar graphs compare quantities visually. Read the height of each bar on the y-axis. Total = sum of all bar values.",
    },
  },
  {
    topicId: "math5_ch13",
    title: "Ways to Multiply and Divide",
    teaching_content: {
      intuition: "Multiplication is repeated addition done efficiently; division is fair sharing or repeated subtraction. Smart strategies — like breaking numbers apart — make even large calculations manageable.",
      process_explanation: "Multiplication: expanded form (125 × 3 = 100×3 + 25×3 = 300 + 75 = 375); lattice method for large numbers. Division: long division — Divide, Multiply, Subtract, Bring down (DMSB). Always verify: Dividend = Divisor × Quotient + Remainder.",
      worked_example: "248 × 6: 200×6=1200, 40×6=240, 8×6=48. Total = 1200+240+48 = 1488. Divide 857 by 6: 6 goes into 8 once (6), remainder 2; bring down 5 → 25; 6 goes into 25 four times (24), remainder 1; bring down 7 → 17; 6 goes into 17 twice (12), remainder 5. Quotient = 142, Remainder = 5. Check: 6×142+5 = 852+5 = 857 ✓.",
      common_misconceptions: "Students forget to bring down the next digit in long division, or misplace the partial product in multiplication.",
      shortcuts_and_tricks: "Multiply by 5 → multiply by 10 then divide by 2. Multiply by 9 → multiply by 10 then subtract the number.",
      key_takeaway: "Dividend = Divisor × Quotient + Remainder. Break large numbers into parts for easier multiplication.",
    },
  },
  {
    topicId: "math5_ch14",
    title: "How Big? How Heavy?",
    teaching_content: {
      intuition: "We measure weight in grams and kilograms, and liquid volume in millilitres and litres. Understanding conversions lets you solve real problems — like whether a bag is overweight at the airport.",
      process_explanation: "Weight: 1 kg = 1000 g. To convert kg → g: multiply by 1000. To convert g → kg: divide by 1000. Capacity: 1 L = 1000 mL. Mixed units: 2 kg 350 g = 2350 g. Comparing: always convert to the same unit first.",
      worked_example: "A bag weighs 3 kg 750 g. Convert to grams: 3×1000 + 750 = 3750 g. A bottle holds 1 L 200 mL. Convert to mL: 1×1000 + 200 = 1200 mL. If you pour out 450 mL, what's left? 1200 − 450 = 750 mL = 0 L 750 mL.",
      common_misconceptions: "Students convert kg to g by multiplying by 100 (wrong) instead of 1000. Remember: kilo- always means 1000.",
      shortcuts_and_tricks: "Kilo = 1000 in all units: 1 kg = 1000 g, 1 km = 1000 m, 1 kL = 1000 L.",
      key_takeaway: "1 kg = 1000 g; 1 L = 1000 mL. To combine mixed units, convert everything to the smaller unit, then calculate.",
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  for (const doc of contents) {
    await NcertTopicContent.findOneAndUpdate(
      { topicId: doc.topicId },
      doc,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${doc.topicId}: ${doc.title}`);
  }

  console.log(`\nSeeded ${contents.length} NcertTopicContent documents for Class 5 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
