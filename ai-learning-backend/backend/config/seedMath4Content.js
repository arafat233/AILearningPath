/**
 * CBSE Class 4 Mathematics — NcertTopicContent seed
 * Flat teaching_content format (isSciLike path on frontend)
 * 14 topics. Safe to re-run.
 * Usage: node config/seedMath4Content.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

dotenv.config();

const contents = [
  {
    topicId: "math4_ch1",
    title: "Building with Bricks",
    teaching_content: {
      intuition: "Bricks are rectangular blocks. When you build a wall or a pattern with bricks, you're doing mathematics — counting, arranging, and recognising shapes. Every wall is a real-life maths problem!",
      process_explanation: "A brick has 6 faces (like a cuboid). Bricks can be placed flat, upright, or on edge to create different patterns. When arranged in rows, we can count bricks systematically: rows × bricks per row = total. Alternating rows create a 'running bond' — the strongest pattern used in real buildings.",
      worked_example: "A wall is 4 bricks wide and 3 bricks tall. Total bricks = 4 × 3 = 12. If alternate rows are shifted by half a brick, the pattern still uses 12 bricks but the wall is stronger. How many bricks are in 5 rows of 6 bricks each? 5 × 6 = 30 bricks.",
      common_misconceptions: "Students sometimes count faces of a brick as separate bricks. Remember: one brick, six faces — not six bricks.",
      shortcuts_and_tricks: "To count bricks in a rectangular wall: rows × columns = total bricks. No need to count every brick individually.",
      key_takeaway: "A wall of bricks is an array. Total bricks = number of rows × number of bricks in each row.",
    },
  },
  {
    topicId: "math4_ch2",
    title: "Long and Short",
    teaching_content: {
      intuition: "Length is how long something is. We measure it using a ruler for short things (centimetres), a tape for medium things (metres), and estimate longer distances in kilometres. A metre is about the height of a door handle from the floor.",
      process_explanation: "Units: 1 m = 100 cm; 1 km = 1000 m. To convert metres to centimetres: multiply by 100. To convert centimetres to metres: divide by 100. Estimation: a finger's width ≈ 1 cm; arm span ≈ 1.5 m. To add lengths: convert to the same unit first, then add.",
      worked_example: "A ribbon is 2 m 35 cm long. In cm: 2 × 100 + 35 = 235 cm. Two ropes are 3 m 50 cm and 1 m 75 cm. Total = (350 + 175) cm = 525 cm = 5 m 25 cm.",
      common_misconceptions: "Students multiply by 10 instead of 100 when converting metres to centimetres. Remember: 1 metre has 100 centimetres (cent = 100).",
      shortcuts_and_tricks: "m → cm: move decimal two places right (× 100). cm → m: move decimal two places left (÷ 100).",
      key_takeaway: "1 m = 100 cm; 1 km = 1000 m. Convert to the same unit before comparing or calculating.",
    },
  },
  {
    topicId: "math4_ch3",
    title: "A Trip to Bhopal",
    teaching_content: {
      intuition: "When you go on a trip, you spend money on tickets, food, and souvenirs. Maths helps you calculate total cost, check change, and plan spending — the same skills used in real shops every day.",
      process_explanation: "Money: 1 rupee = 100 paise. Total cost = price × quantity. Change = amount paid − total cost. To find if you have enough money: add all costs and compare with the money you have. Multiplication is the fastest way to find total cost when buying multiple items at the same price.",
      worked_example: "Bus tickets cost ₹25 each. A family of 4 needs tickets. Total = ₹25 × 4 = ₹100. They pay with ₹500. Change = ₹500 − ₹100 = ₹400. If they also buy snacks costing ₹35 each for 4 people: snack total = ₹35 × 4 = ₹140. Grand total = ₹100 + ₹140 = ₹240. Remaining = ₹500 − ₹240 = ₹260.",
      common_misconceptions: "Students sometimes add instead of multiply when the same price repeats. '5 chocolates at ₹8 each' means ₹8 × 5, not ₹8 + 5.",
      shortcuts_and_tricks: "Multiply by 4: double the number, then double again. ₹25 × 4 = ₹50 × 2 = ₹100.",
      key_takeaway: "Total cost = price × quantity. Change = amount paid − total cost. 1 rupee = 100 paise.",
    },
  },
  {
    topicId: "math4_ch4",
    title: "Tick-Tick-Tick",
    teaching_content: {
      intuition: "A clock is a circle divided into 12 hours, and each hour into 60 minutes. The short hand shows hours; the long hand shows minutes. Time is all around us — school bells, meal times, and sleep schedules all depend on reading clocks correctly.",
      process_explanation: "Analogue clock: hour hand moves slowly (one full round in 12 hours); minute hand moves faster (one full round in 1 hour). Each small division = 1 minute; each large number = 5 minutes. To find elapsed time: count forward from start to end, or subtract times. AM = midnight to noon; PM = noon to midnight.",
      worked_example: "School starts at 8:30 AM and ends at 2:30 PM. Duration = 2:30 PM − 8:30 AM = 6 hours. A film starts at 4:15 PM and lasts 2 hours 30 minutes. It ends at 4:15 + 2:30 = 6:45 PM.",
      common_misconceptions: "Students confuse the hour and minute hands — the shorter hand is for hours. Also, '12 o'clock at night' is 12:00 AM (midnight), not 12 PM.",
      shortcuts_and_tricks: "To add time: add hours and minutes separately. If minutes exceed 60, carry 1 hour and subtract 60 from minutes.",
      key_takeaway: "1 hour = 60 minutes. Short hand = hours; long hand = minutes. AM = before noon; PM = after noon.",
    },
  },
  {
    topicId: "math4_ch5",
    title: "The Way The World Looks",
    teaching_content: {
      intuition: "The same object looks completely different depending on where you stand. A cup viewed from above looks like a circle; from the front, it looks like a rectangle. Maps show the top view of a place — just like looking down from a bird's eye.",
      process_explanation: "Views of 3D objects: Top view (bird's-eye view) — what you see looking straight down. Front view — what you see from directly in front. Side view — what you see from the left or right. A map is a top view of an area, drawn to scale, showing relative positions and distances.",
      worked_example: "A cylinder (like a can): top view = circle; front view = rectangle; side view = rectangle. A cube: all three views look like squares. Looking at a classroom from above, you see rectangles for desks, a large rectangle for the board, and a square for the teacher's desk.",
      common_misconceptions: "Students think the side view is always the same as the front view. This is only true for shapes that look the same from all sides (like a cube or sphere).",
      shortcuts_and_tricks: "Top view tells you shape from above; front view tells you height; side view tells you depth. Together they describe the 3D shape completely.",
      key_takeaway: "The same 3D object has different 2D appearances from different angles. A map is always the top view.",
    },
  },
  {
    topicId: "math4_ch6",
    title: "The Junk Seller",
    teaching_content: {
      intuition: "A junk seller collects old newspapers, bottles, and metal by weight and pays money based on how much the material weighs. This chapter connects weight measurement to real-life buying and selling.",
      process_explanation: "Weight units: 1 kg = 1000 g. Earning = weight × rate per kg. To compare weights, convert everything to grams. To solve: identify what is being weighed, find its weight in kg or g, multiply by the rate, and calculate total payment or change.",
      worked_example: "A junk seller pays ₹5 per kg for newspapers. Rohan sells 4 kg 500 g of newspapers. Weight = 4.5 kg. Earnings = 4.5 × ₹5 = ₹22.50. Metal is paid at ₹20 per kg. If Rohan also has 2 kg of metal: ₹20 × 2 = ₹40. Total earnings = ₹22.50 + ₹40 = ₹62.50.",
      common_misconceptions: "Students convert 4 kg 500 g as 4500 kg (wrong) instead of 4.5 kg or 4500 g. Always be clear whether you are working in kg or grams.",
      shortcuts_and_tricks: "Mixed kg and g: convert everything to grams first, then divide by 1000 to get kg for multiplication.",
      key_takeaway: "1 kg = 1000 g. Earnings = weight in kg × rate per kg. Convert to the same unit before calculating.",
    },
  },
  {
    topicId: "math4_ch7",
    title: "Jugs and Mugs",
    teaching_content: {
      intuition: "When you fill a glass with water or pour milk into a bowl, you're measuring capacity — how much liquid a container can hold. Litres and millilitres are the standard units, just like metres and centimetres are for length.",
      process_explanation: "Capacity units: 1 L = 1000 mL. Small amounts (medicine, cold drinks) are measured in mL; larger amounts (water tanks, bottles) in L. To add capacities: convert to the same unit. To find how many cups fill a jug: divide jug capacity by cup capacity.",
      worked_example: "A jug holds 2 L. A mug holds 250 mL. How many mugs fill the jug? 2 L = 2000 mL. 2000 ÷ 250 = 8 mugs. A recipe needs 1 L 500 mL of milk. The shop sells 500 mL bottles. Bottles needed = 1500 ÷ 500 = 3 bottles.",
      common_misconceptions: "Students confuse volume (capacity) with weight. A litre of water weighs 1 kg, but a litre of oil weighs less. Volume and mass are different properties.",
      shortcuts_and_tricks: "Convert L to mL by multiplying by 1000 (add three zeros). Convert mL to L by dividing by 1000 (remove three zeros).",
      key_takeaway: "1 L = 1000 mL. Capacity = how much a container holds. Always convert to the same unit before adding or comparing.",
    },
  },
  {
    topicId: "math4_ch8",
    title: "Carts and Wheels",
    teaching_content: {
      intuition: "Wheels are circles. The bigger the wheel, the farther a cart travels in one rotation. This chapter introduces the circle — one of the most important shapes in mathematics and engineering.",
      process_explanation: "Parts of a circle: Centre = the middle point. Radius = distance from centre to edge (r). Diameter = distance across the circle through the centre (d = 2r). Every point on the circle is the same distance (radius) from the centre. Comparing circles: the larger the radius, the bigger the circle.",
      worked_example: "A wheel has a radius of 35 cm. Its diameter = 2 × 35 = 70 cm. If one wheel has radius 40 cm and another has radius 30 cm, the first is larger. If the diameter of a circle is 1 m, its radius = 1 m ÷ 2 = 50 cm.",
      common_misconceptions: "Students confuse radius and diameter. Remember: diameter goes all the way across (double the radius); radius goes only halfway (from centre to edge).",
      shortcuts_and_tricks: "Diameter = 2 × radius. Radius = diameter ÷ 2. If you know one, you always know the other.",
      key_takeaway: "Diameter = 2 × Radius. Every point on a circle is the same distance from the centre.",
    },
  },
  {
    topicId: "math4_ch9",
    title: "Halves and Quarters",
    teaching_content: {
      intuition: "When you share a pizza equally between 2 friends, each gets a half. Share between 4 friends and each gets a quarter. Halves and quarters are the simplest fractions and appear in cooking, sharing, and everyday life.",
      process_explanation: "Half (1/2): divide the whole into 2 equal parts; take 1. Quarter (1/4): divide into 4 equal parts; take 1. Three-quarters (3/4): take 3 out of 4 equal parts. 1 whole = 2 halves = 4 quarters. To find 1/2 of a number: divide by 2. To find 1/4 of a number: divide by 4. To find 3/4: divide by 4, then multiply by 3.",
      worked_example: "1/2 of 24 = 24 ÷ 2 = 12. 1/4 of 24 = 24 ÷ 4 = 6. 3/4 of 24 = 6 × 3 = 18. A pizza has 8 slices. Half = 4 slices. Quarter = 2 slices. Three-quarters = 6 slices.",
      common_misconceptions: "Students think 1/4 is larger than 1/2 because 4 > 2. Wrong: more pieces means each piece is smaller. 1/4 < 1/2.",
      shortcuts_and_tricks: "Bigger denominator = smaller piece. 1/4 < 1/3 < 1/2. Think of sharing a bar of chocolate — more people = smaller pieces.",
      key_takeaway: "1/2 = divide by 2. 1/4 = divide by 4. 3/4 = divide by 4 then multiply by 3. More equal parts → each part is smaller.",
    },
  },
  {
    topicId: "math4_ch10",
    title: "Play with Patterns",
    teaching_content: {
      intuition: "Patterns are everywhere — on floors, in music, in nature. Recognising a pattern means finding the rule that connects each part. Once you know the rule, you can predict any step in the pattern without counting from the start.",
      process_explanation: "Number patterns: identify what changes between terms (add, subtract, multiply). Shape patterns: identify the repeating unit. Odd numbers: 1, 3, 5, 7, ... (add 2). Even numbers: 2, 4, 6, 8, ... (add 2). Multiplication patterns: 2×1=2, 2×2=4, 2×3=6 — the products form a pattern too.",
      worked_example: "Pattern: 5, 10, 15, 20, ___ → add 5 each time. Next: 25. Shape pattern: ○△○△○△ → repeating unit is ○△. Next two: ○△. Number of triangles needed for pattern step n: use the rule. E.g., staircase pattern — step 1 has 1, step 2 has 3, step 3 has 6 → add one more column each time.",
      common_misconceptions: "Students assume all patterns are +1 or +2. Always check the difference between multiple pairs of consecutive terms before deciding on the rule.",
      shortcuts_and_tricks: "For an addition pattern, the difference between consecutive terms is constant. For a multiplication pattern, the ratio between consecutive terms is constant.",
      key_takeaway: "Find the rule, apply it to extend the pattern. Arithmetic patterns add/subtract the same amount; geometric patterns multiply by the same amount.",
    },
  },
  {
    topicId: "math4_ch11",
    title: "Tables and Shares",
    teaching_content: {
      intuition: "Multiplication tables are shortcuts for repeated addition. Division is the reverse — splitting a total into equal groups. Knowing your tables makes multiplication and division fast and automatic.",
      process_explanation: "Multiplication: a × b = b × a (commutative). If 6 × 7 = 42, then 7 × 6 = 42 too. Division: 42 ÷ 6 = 7 (how many 6s fit into 42?). Fact families: 6 × 7 = 42; 7 × 6 = 42; 42 ÷ 6 = 7; 42 ÷ 7 = 6. Always verify: quotient × divisor = dividend.",
      worked_example: "48 pencils are shared equally among 6 children. Each gets 48 ÷ 6 = 8 pencils. Check: 8 × 6 = 48 ✓. 9 × 8 = 72. So 72 ÷ 9 = 8 and 72 ÷ 8 = 9. If 35 sweets are shared among 7 children: 35 ÷ 7 = 5 sweets each.",
      common_misconceptions: "Students think 'division makes things smaller' and so expect the quotient to always be less than the divisor. But 12 ÷ 2 = 6, and 6 > 2. The quotient can be larger than the divisor.",
      shortcuts_and_tricks: "Tables shortcut: if you know 6 × 8 = 48, you automatically know 8 × 6 = 48, 48 ÷ 8 = 6, and 48 ÷ 6 = 8. One fact gives four facts.",
      key_takeaway: "Multiplication and division are inverses. Knowing one times-table fact gives you 4 related facts (fact family).",
    },
  },
  {
    topicId: "math4_ch12",
    title: "How Heavy? How Light?",
    teaching_content: {
      intuition: "We estimate and compare weights every day — which bag is heavier, how much flour to use in a recipe, whether luggage is within the limit. A balance scale shows which side is heavier; a weighing scale shows the exact weight.",
      process_explanation: "Weight units: 1 kg = 1000 g. Lighter objects are measured in grams (a coin ≈ 5 g); heavier objects in kilograms (a school bag ≈ 4 kg). Balance problems: if both sides of a balance are equal, what is the unknown weight? Set up as an equation.",
      worked_example: "One side of a balance has a 500 g weight and 3 identical balls. The other side has a 2 kg weight. 500 g + 3 balls = 2000 g → 3 balls = 1500 g → 1 ball = 500 g. Ravi's bag weighs 3 kg 750 g. In grams: 3000 + 750 = 3750 g. Is it heavier than 4 kg? 4000 g > 3750 g, so NO.",
      common_misconceptions: "Students convert 3 kg 750 g as 3750 kg (wrong). The kg part stays as kg: 3 kg = 3000 g, then add 750 g = 3750 g total.",
      shortcuts_and_tricks: "Balance problems: what's on the left = what's on the right. Remove common items from both sides to find the unknown.",
      key_takeaway: "1 kg = 1000 g. Balance: left side weight = right side weight. Convert all to grams before comparing.",
    },
  },
  {
    topicId: "math4_ch13",
    title: "Fields and Fences",
    teaching_content: {
      intuition: "A fence goes around the edge of a field (perimeter); the field itself covers an area (area). Farmers need to know both — the length of fence to buy and the area of crop to plant. These are two different measurements of the same field.",
      process_explanation: "Perimeter of rectangle = 2(l + b); Perimeter of square = 4 × side. Area of rectangle = l × b; Area of square = side². To tile a floor: area of floor ÷ area of one tile = number of tiles. Same perimeter can give different areas (e.g., 4×6 and 3×7 both have perimeter 20, but areas 24 and 21).",
      worked_example: "A field is 12 m long and 8 m wide. Perimeter = 2(12+8) = 40 m of fencing. Area = 12 × 8 = 96 m². If a square field has side 10 m: perimeter = 4 × 10 = 40 m; area = 10 × 10 = 100 m². More area than the rectangle with the same perimeter!",
      common_misconceptions: "Students think same perimeter means same area. A square always has the most area for a given perimeter — a long thin rectangle has much less.",
      shortcuts_and_tricks: "For a given perimeter, the square encloses the most area. For tiling: tiles = floor area ÷ tile area.",
      key_takeaway: "Perimeter = boundary length. Area = surface covered. Perimeter of rectangle = 2(l+b). Area of rectangle = l × b.",
    },
  },
  {
    topicId: "math4_ch14",
    title: "Smart Charts",
    teaching_content: {
      intuition: "Data is collected information. Instead of reading a long list of numbers, a chart or pictograph gives you the picture at a glance — you can immediately see which is most, which is least, and how things compare.",
      process_explanation: "Tally marks: group in sets of 5 (||||). A frequency table lists each item and its count. Pictograph: each symbol represents a fixed number (the key). To read: count symbols × key. To draw: divide each count by the key to get the number of symbols.",
      worked_example: "Favourite fruit survey: Mango=15, Apple=10, Orange=5, Banana=20. Pictograph key: 1 symbol = 5. Symbols: Mango=3, Apple=2, Orange=1, Banana=4. Total students = 15+10+5+20 = 50. Most popular = Banana. Difference between most and least popular = 20−5 = 15.",
      common_misconceptions: "Students forget to multiply the symbol count by the key. Always ask: 'What does 1 symbol represent?' and multiply.",
      shortcuts_and_tricks: "In a tally, every time you make 4 strokes, the 5th crosses them all — this makes groups of 5 easy to count.",
      key_takeaway: "Tally marks group data in 5s. Pictograph: symbols × key = count. Total = sum of all values. Most popular = tallest bar / most symbols.",
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
  console.log(`\nSeeded ${contents.length} NcertTopicContent documents for Class 4 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
