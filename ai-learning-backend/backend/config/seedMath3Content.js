/**
 * CBSE Class 3 Mathematics — NcertTopicContent seed
 * "Math Magic Grade 3" (NCERT) — flat teaching_content format. Safe to re-run.
 * Usage: node config/seedMath3Content.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

dotenv.config();

const topics = [
  {
    topicId: "math3_ch1", chapterNumber: 1, sectionNumber: "1",
    title: "Where to Look From", subject: "Mathematics",
    intuition: "Everything looks different depending on where you stand. A cup seen from above looks like a circle; from the side it looks like a rectangle. Your viewpoint changes the shape you see — the object itself never changes.",
    process_explanation: "Identify the position of the viewer (top, front, or side). Draw or describe what the object looks like from that specific angle. Top view = looking straight down. Front view = looking straight ahead. Side view = looking from either side.",
    worked_example: "A rectangular box: top view → rectangle (length × width). Front view → rectangle (length × height). Side view → rectangle (width × height). A cylinder from the top → circle; from the side → rectangle.",
    common_misconceptions: "Students think the shape of an object changes between views — it doesn't. Only the view changes. A cube looks like a square from every side because all faces are equal squares.",
    shortcuts_and_tricks: "Use real objects at home. Look at a glass from directly above (circle), then from the side (rectangle). Sketch both views. Every 3D object gives three different 2D views.",
    key_takeaway: "The same object shows different shapes from different viewpoints. Top, front, and side views are all valid descriptions of the same 3D object.",
  },
  {
    topicId: "math3_ch2", chapterNumber: 2, sectionNumber: "2",
    title: "Fun with Numbers", subject: "Mathematics",
    intuition: "Numbers up to 1000 follow the same pattern as smaller numbers — hundreds are just tens of tens. Place value is the key: each position is worth 10 times the position to its right.",
    process_explanation: "Break any 3-digit number into hundreds, tens, and ones using a place-value chart. To write a number: hundreds digit first, then tens, then ones. To compare two numbers: compare hundreds first; if equal, compare tens; if still equal, compare ones.",
    worked_example: "457: 4 hundreds, 5 tens, 7 ones. Expanded form: 400 + 50 + 7. Compare 457 and 439: hundreds equal (4 = 4) → compare tens: 5 > 3, so 457 > 439. Number name: four hundred fifty-seven.",
    common_misconceptions: "Writing 'four hundred fifty seven' as 400507 is wrong — each place holds exactly one digit. 457 has three digits, not six.",
    shortcuts_and_tricks: "The first digit of a 3-digit number gives its approximate size instantly — 7__ is bigger than 5__ without checking further digits.",
    key_takeaway: "Place value (hundreds, tens, ones) is the foundation of all large-number work. Master it and every operation — addition, subtraction, comparison — becomes logical.",
  },
  {
    topicId: "math3_ch3", chapterNumber: 3, sectionNumber: "3",
    title: "Give and Take", subject: "Mathematics",
    intuition: "Adding combines groups; subtracting removes a part. When ones overflow past 9 you carry the extra ten to the tens column. When you don't have enough to subtract, you borrow a ten from the tens column.",
    process_explanation: "Add right to left: ones → tens → hundreds. If sum of ones > 9, write the units digit and carry 1 to tens. For subtraction, if the top digit is smaller, borrow 1 ten (= 10 ones) from the tens column; the tens column loses 1.",
    worked_example: "348 + 275: ones 8+5=13 → write 3 carry 1. Tens 4+7+1=12 → write 2 carry 1. Hundreds 3+2+1=6. Answer: 623. Subtraction 523−168: ones 3<8 → borrow, 13−8=5. Tens (4−1=3)<6 → borrow, 13−6=7. Hundreds 4−1=3. Answer: 355.",
    common_misconceptions: "Forgetting to add the carried 1 to the next column. Also: subtracting the smaller digit from the larger one regardless of position (e.g. writing 523−168 as 465) — always subtract top minus bottom after borrowing.",
    shortcuts_and_tricks: "Check subtraction by adding back: 355 + 168 should equal 523. If it does, your answer is correct.",
    key_takeaway: "Work right to left. Carry when adding overflows past 9. Borrow when subtracting needs more than available. Always verify subtraction by adding.",
  },
  {
    topicId: "math3_ch4", chapterNumber: 4, sectionNumber: "4",
    title: "Long and Short", subject: "Mathematics",
    intuition: "Length measures how far from one end to another. Standard units (cm, m) mean everyone gets the same answer. Without standards, my 'hand-span' and your 'hand-span' are different lengths.",
    process_explanation: "Place the ruler so the 0 mark is at one end of the object. Read the number at the other end — that is the length. Use cm for small objects (pencil, book spine) and m for large objects (door, classroom). Convert: 1 m = 100 cm.",
    worked_example: "Pencil from 0 to 14 cm mark → length = 14 cm. Door is 2 m tall = 2 × 100 = 200 cm. Compare: 1 m 50 cm vs 140 cm → 150 cm vs 140 cm → 1 m 50 cm is longer.",
    common_misconceptions: "Starting from the 1 mark instead of the 0 mark makes every measurement 1 cm too short. Also: forgetting to convert before comparing (you cannot compare 2 m with 150 cm directly without converting).",
    shortcuts_and_tricks: "To convert m and cm to just cm: multiply metres by 100 and add the extra cm. E.g. 3 m 45 cm = 300 + 45 = 345 cm.",
    key_takeaway: "Always start from 0. Use cm for small, m for large. 1 m = 100 cm. Convert to the same unit before comparing.",
  },
  {
    topicId: "math3_ch5", chapterNumber: 5, sectionNumber: "5",
    title: "Shapes and Designs", subject: "Mathematics",
    intuition: "Shapes have properties — sides, corners, angles. Patterns repeat shapes by a rule. Symmetry means one half mirrors the other. Tessellation means shapes fit together perfectly with no gaps.",
    process_explanation: "Count sides and corners to name a shape. Find lines of symmetry by folding — if both halves match exactly, that fold is a line of symmetry. To check tessellation: try fitting the same shape repeatedly — squares, equilateral triangles, and regular hexagons tessellate perfectly.",
    worked_example: "Square: 4 equal sides, 4 corners, 4 lines of symmetry. A rectangle has only 2 lines of symmetry (through midpoints of opposite sides, not diagonals). Circles do not tessellate — gaps appear between them.",
    common_misconceptions: "Any line through a shape's centre is NOT always a line of symmetry — only lines where both halves are mirror images count. A rectangle's diagonal is NOT a line of symmetry.",
    shortcuts_and_tricks: "Cut out and fold the shape to find symmetry lines — no calculations needed. If both layers sit perfectly on top of each other, you found a symmetry line.",
    key_takeaway: "Shapes: count sides and corners. Symmetry: fold test — both halves must match. Tessellation: shape tiles with no gaps. Squares and equilateral triangles tessellate; circles do not.",
  },
  {
    topicId: "math3_ch6", chapterNumber: 6, sectionNumber: "6",
    title: "Fun with Give and Take", subject: "Mathematics",
    intuition: "Addition and subtraction applied to real situations. Three or more numbers are added column by column the same way as two. Word problems need you to choose the right operation before calculating.",
    process_explanation: "For three-number addition, add column by column right to left, carrying whenever a column's sum exceeds 9. For word problems: 'combined/altogether/total/in all' → add. 'Gave away/spent/lost/left/remaining' → subtract. Estimate first to check your answer.",
    worked_example: "125 + 248 + 316: ones 5+8+6=19 → write 9 carry 1. Tens 2+4+1+1=8. Hundreds 1+2+3=6. Answer: 689. Word problem: 'Ravi had 324 marbles, gave 178 away. How many left?' 324 − 178 = 146.",
    common_misconceptions: "In word problems, adding when you should subtract — always identify the action before picking the operation. 'How many more?' means subtract, not add.",
    shortcuts_and_tricks: "Estimate before computing: 324 − 178 ≈ 300 − 200 = 100. The exact answer (146) should be near 100. If you get 446, the estimate catches the error.",
    key_takeaway: "Read word problems twice: identify the operation, then solve. Estimation catches large errors. 'Total/combined' = add; 'left/remaining/gave' = subtract.",
  },
  {
    topicId: "math3_ch7", chapterNumber: 7, sectionNumber: "7",
    title: "Time Goes On", subject: "Mathematics",
    intuition: "Time is organised into repeating units: 60 minutes make an hour, 24 hours make a day, 7 days make a week, 12 months make a year. A clock face is a circular number line that repeats every 12 hours.",
    process_explanation: "On an analogue clock: short hand = hours (points to the hour); long hand = minutes (each small mark = 1 minute, each number = 5 minutes). Half-past = 30 min after the hour (long hand on 6). Quarter-past = 15 min after (long hand on 3). Duration = end time − start time.",
    worked_example: "Hour hand on 3, minute hand on 6 → 3:30 (half-past three). School starts 9:00, ends 3:00 → duration = 6 hours. Monday + 5 days = Saturday (count on the week).",
    common_misconceptions: "Confusing the hour and minute hands — the shorter, slower hand always shows the hour. Also: thinking 'half-past' means the hour hand is at the halfway mark between two hours.",
    shortcuts_and_tricks: "The minute hand travels the full clock face in exactly 1 hour. Every number it passes = 5 more minutes. So '3' on the minute hand = 15 minutes.",
    key_takeaway: "Short hand = hours, long hand = minutes. Half-past = 30 min; quarter-past = 15 min; quarter-to = 45 min past (15 min before the next hour).",
  },
  {
    topicId: "math3_ch8", chapterNumber: 8, sectionNumber: "8",
    title: "Who is Heavier?", subject: "Mathematics",
    intuition: "Weight measures how heavy something is. We use grams (g) for light objects and kilograms (kg) for heavy ones — just as we use cm for short distances and m for long ones. 1 kg = 1000 g.",
    process_explanation: "Read a weighing scale by finding where the pointer settles against the numbered markings. Convert: multiply kg by 1000 to get g; divide g by 1000 to get kg. To compare, convert both to the same unit.",
    worked_example: "Bag of rice: 2 kg = 2000 g. Pencil: about 5 g. Compare 1 kg 750 g and 1800 g: 1750 g vs 1800 g → 1800 g is heavier. Total: 500 g + 1 kg 200 g = 500 g + 1200 g = 1700 g = 1 kg 700 g.",
    common_misconceptions: "A bigger-looking object is not always heavier — a large foam ball weighs less than a small iron ball. Also: confusing g and kg (1 kg ≠ 10 g).",
    shortcuts_and_tricks: "kg → g: just add three zeros. 3 kg = 3000 g. g → kg: remove three zeros (only works for multiples of 1000).",
    key_takeaway: "1 kg = 1000 g. Use g for light objects, kg for heavy. Convert to the same unit before comparing or adding weights.",
  },
  {
    topicId: "math3_ch9", chapterNumber: 9, sectionNumber: "9",
    title: "How Many Times?", subject: "Mathematics",
    intuition: "Multiplication is a shortcut for repeated addition. Instead of writing 4+4+4+4+4, we write 4×5=20. Arrays (rows and columns) show why 3×4 and 4×3 give the same answer.",
    process_explanation: "Step 1: Recognise the repeated group (4 boxes, 6 pencils each → 6+6+6+6 = 4×6). Step 2: Recall the table fact. Step 3: Verify with repeated addition or the commutative property (a×b = b×a). Any number × 0 = 0. Any number × 1 = itself.",
    worked_example: "4 baskets, 6 mangoes each: 4×6=24. Verify: 6+6+6+6=24 ✓. Commutativity: 6×4=24 also. In an array: 4 rows of 6 dots = 24 dots total.",
    common_misconceptions: "Students think 0×6 = 6 — any number multiplied by 0 is always 0. Also: confusing × with + when reading tables (6×3 ≠ 6+3).",
    shortcuts_and_tricks: "×5 table always ends in 0 or 5. ×10 table: just add a zero. ×2 table: double the number. ×9 trick: fingers on both hands — fold the nth finger and count left (tens) and right (ones).",
    key_takeaway: "Multiplication = repeated addition. a×b = b×a. Any number ×0=0, ×1 = itself. Learn tables 2–5 for speed.",
  },
  {
    topicId: "math3_ch10", chapterNumber: 10, sectionNumber: "10",
    title: "Play with Patterns", subject: "Mathematics",
    intuition: "Patterns are hidden rules. Once you find the rule (add 3, alternate colours, skip-count by 2), you can extend the pattern as far as you like. Patterns are the early seeds of algebra.",
    process_explanation: "Step 1: Look at consecutive terms and calculate the difference or change. Step 2: Name the rule (add 5, subtract 2, alternate ABAB). Step 3: Apply the rule to find missing or next terms. For shape patterns, identify the repeating unit.",
    worked_example: "Number: 3, 6, 9, 12, ___ → differences all +3 → rule: add 3 → next: 15. Shape: △□△□△___ → repeating unit is △□ → next: □. Missing term: 5, ___, 15, 20 → differences: 5, 5 → missing = 10.",
    common_misconceptions: "Confusing repeating patterns (ABABAB — same element repeats) with growing patterns (1,2,3,4 — size increases each time). Check: does each term grow, or does the sequence repeat?",
    shortcuts_and_tricks: "Write differences between consecutive terms. If all differences are identical, the pattern is simple addition/subtraction. If differences double, it may be multiplication.",
    key_takeaway: "Find the rule → apply the rule. Difference between consecutive terms reveals an addition/subtraction pattern. Identify repeating units in shape patterns.",
  },
  {
    topicId: "math3_ch11", chapterNumber: 11, sectionNumber: "11",
    title: "Jugs and Mugs", subject: "Mathematics",
    intuition: "Capacity is how much a container can hold. We use millilitres (mL) for small amounts and litres (L) for large ones — the same prefix logic as grams and kilograms. 1 L = 1000 mL.",
    process_explanation: "Read a measuring jug at eye level — look at the number aligned with the bottom of the liquid surface. Convert: L × 1000 = mL; mL ÷ 1000 = L. Compare capacities by converting to the same unit first.",
    worked_example: "A water bottle: 500 mL. A bucket: 10 L = 10000 mL. Difference: 10000−500=9500 mL. To fill the bucket with the bottle: 10000÷500 = 20 trips. Compare: 2 L 300 mL vs 2500 mL → 2300 mL vs 2500 mL → 2500 mL is more.",
    common_misconceptions: "A taller container is not always bigger — capacity depends on shape, not just height. A tall narrow tube may hold less than a short wide bowl.",
    shortcuts_and_tricks: "L → mL: add three zeros (same trick as kg → g). mL → L: remove three zeros. The prefix 'milli' always means one-thousandth.",
    key_takeaway: "1 L = 1000 mL. Use mL for small amounts, L for large. Convert to the same unit before comparing. Height alone does not determine capacity.",
  },
  {
    topicId: "math3_ch12", chapterNumber: 12, sectionNumber: "12",
    title: "Can We Share?", subject: "Mathematics",
    intuition: "Division answers two questions: (1) If items are shared equally, how many does each person get? (2) If each group gets a fixed amount, how many groups form? Both situations use the same division operation.",
    process_explanation: "Sharing: 12 ÷ 4 = 3 — distribute 1 to each person in turn until done; each person gets 3. Grouping: 12 ÷ 4 = 3 — fill groups of 4 until none left; 3 groups form. Verify: quotient × divisor + remainder = dividend. Remainder occurs when items don't divide evenly.",
    worked_example: "20 apples among 5 baskets: 20 ÷ 5 = 4. Verify: 4×5=20 ✓. With remainder: 17 ÷ 5 = 3 remainder 2 (3 groups of 5 = 15, with 2 left over). Verify: 3×5+2=17 ✓.",
    common_misconceptions: "Division always produces a whole number — not true, remainders are perfectly valid. Also: confusing the divisor and dividend (12÷4 ≠ 4÷12).",
    shortcuts_and_tricks: "Use multiplication to check division: if 15÷3=5, then 5×3 must equal 15. If it doesn't, revise.",
    key_takeaway: "Division = sharing equally OR grouping equally. Check with multiplication. Remainders are valid when items don't divide perfectly.",
  },
  {
    topicId: "math3_ch13", chapterNumber: 13, sectionNumber: "13",
    title: "Smart Charts!", subject: "Mathematics",
    intuition: "Data is collected information. Organising it into charts makes comparisons easy. Tally marks group items in fives for fast counting. Pictographs use pictures to represent numbers — always check the key.",
    process_explanation: "Step 1: Collect data (count or survey). Step 2: Record with tally marks (4 vertical + 1 diagonal = group of 5). Step 3: Transfer to pictograph — each symbol represents a fixed number (shown in the key). Read: count symbols × value per symbol.",
    worked_example: "Survey: favourite fruit. Mango: 12, Apple: 8, Banana: 10. If 🍎 = 2 students: Mango = 6 symbols, Apple = 4 symbols, Banana = 5 symbols. Most popular = Mango (6 symbols). Difference: 12−8=4 more students chose Mango over Apple.",
    common_misconceptions: "Forgetting to check the key — if each picture = 5 students, 3 pictures = 15, not 3. Also: tally marks must be in groups of 5, not just any grouping.",
    shortcuts_and_tricks: "Count tally groups in fives: 5, 10, 15 … then add the remaining individual marks. Much faster than counting one by one.",
    key_takeaway: "Organise data with tally marks (groups of 5). Display with pictographs. Always check the key for what each symbol represents. Most/least popular is read directly from the chart.",
  },
  {
    topicId: "math3_ch14", chapterNumber: 14, sectionNumber: "14",
    title: "Rupees and Paise", subject: "Mathematics",
    intuition: "Money uses the same decimal place-value idea as regular numbers. Rupees are the main unit; paise are fractions of a rupee. 1 rupee = 100 paise — just like 1 metre = 100 centimetres.",
    process_explanation: "Add money by keeping rupees and paise separate; add each column, carrying from paise to rupees when paise reach 100. Find change by subtracting: change = amount given − cost. To make an amount, list the coins/notes that sum to the total.",
    worked_example: "Cost ₹35.50, pay ₹50: change = 5000 paise − 3550 paise = 1450 paise = ₹14.50. Add: ₹12.75 + ₹8.50 → paise: 75+50=125 paise = ₹1.25; rupees: 12+8+1=₹21. Total: ₹21.25.",
    common_misconceptions: "Leaving paise as a large number — 125 paise must be converted to ₹1.25, not written as ₹__125. Also: confusing ₹ and paise when the decimal point is omitted.",
    shortcuts_and_tricks: "Convert all amounts to paise (multiply rupees by 100, add paise), do the arithmetic, then convert back. ₹12.75 = 1275 paise; ₹8.50 = 850 paise; 1275+850=2125 paise = ₹21.25.",
    key_takeaway: "1 ₹ = 100 paise. Add rupees and paise separately, carrying from paise when ≥ 100. Change = given − cost. Converting to paise makes arithmetic simpler.",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
  for (const t of topics) {
    await NcertTopicContent.findOneAndUpdate(
      { topicId: t.topicId },
      t,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${t.topicId}: ${t.title}`);
  }
  console.log(`\nSeeded ${topics.length} NcertTopicContent documents for Class 3 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
