/**
 * CBSE Class 2 Mathematics — NcertTopicContent seed
 * Teaching content for all 15 chapters. Safe to re-run.
 * Usage: node config/seedMath2Content.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const contents = [
  {
    topicId: "math2_ch1", chapterNumber: 1, sectionNumber: "1.1",
    title: "What is Long, What is Round?", subject: "Mathematics",
    intuition: "Every object around us has a shape. Some are long like a pencil; some are round like a ball. Learning to describe shapes is the first step to understanding geometry.",
    process_explanation: "Look at objects and ask: Is it long or short? Is it round (circular) or flat? Sort objects into groups by shape. A round object rolls; a flat object slides.",
    worked_example: "A cricket ball is round — it rolls in every direction. A ruler is long and flat — it slides but does not roll. A coin is round but also flat — it rolls on its edge.",
    common_misconceptions: "Children often call any big object 'long'. Clarify: long means greater length in one direction compared to width, not just big size.",
    shortcuts_and_tricks: "Roll test: if an object rolls easily on the floor, it is round/curved. Slide test: if it slides without rolling, it has at least one flat face.",
    key_takeaway: "Objects can be described as long/short and round/flat; round objects roll, flat objects slide.",
  },
  {
    topicId: "math2_ch2", chapterNumber: 2, sectionNumber: "2.1",
    title: "Counting in Groups", subject: "Mathematics",
    intuition: "Counting one by one is slow when there are many objects. Making equal groups lets us count faster — this is the beginning of multiplication.",
    process_explanation: "Step 1: Make groups of the same size (e.g., groups of 2). Step 2: Count how many groups you have. Step 3: Skip count — say 2, 4, 6, 8 … instead of 1, 2, 3, 4, 5, 6, 7, 8.",
    worked_example: "There are 10 mangoes. Make groups of 5: first group (1–5), second group (6–10). Skip count by 5: 5, 10. There are 10 mangoes in 2 groups.",
    common_misconceptions: "Children may skip a number when counting by 2s or 5s. Practice by pointing at each group as you say the skip-count number.",
    shortcuts_and_tricks: "Counting by 10s is easiest — the pattern is 10, 20, 30 … every number ends in 0. Counting by 5s: the pattern alternates 5, 10, 15, 20 — ends in 5 or 0.",
    key_takeaway: "Grouping objects equally and skip counting (by 2, 5, 10) is faster than counting one by one.",
  },
  {
    topicId: "math2_ch3", chapterNumber: 3, sectionNumber: "3.1",
    title: "How Much Can You Carry?", subject: "Mathematics",
    intuition: "Not all things weigh the same. A bag of rice is heavier than a pencil. Learning to compare weights helps us make everyday decisions.",
    process_explanation: "Step 1: Hold one object in each hand. Step 2: The hand that goes down holds the heavier object. Step 3: Use a balance scale to compare precisely — the side that goes down is heavier.",
    worked_example: "Riya holds a book in her left hand and an eraser in her right hand. Her left hand goes down — the book is heavier than the eraser.",
    common_misconceptions: "Bigger does not always mean heavier. A large balloon is lighter than a small stone. Compare by feel or scale, not by size alone.",
    shortcuts_and_tricks: "On a balance scale: the side that dips down = heavier. Equal sides = same weight. This is the same idea as an equals sign in math.",
    key_takeaway: "We compare weights using words heavy/light/heavier/lighter; a balance scale shows which object weighs more.",
  },
  {
    topicId: "math2_ch4", chapterNumber: 4, sectionNumber: "4.1",
    title: "Counting in Tens", subject: "Mathematics",
    intuition: "Our number system is built on groups of ten — once you understand tens, large numbers become easy. Ten ones make one ten; ten tens make one hundred.",
    process_explanation: "Step 1: Bundle 10 sticks together — that is one ten. Step 2: Count the bundles to find the tens digit. Step 3: Count the leftover sticks for the ones digit. Step 4: Read the number as 'tens digit, ones digit'.",
    worked_example: "You have 37 beads. Bundle 10: bundle 1 (1–10), bundle 2 (11–20), bundle 3 (21–30). Leftover: 7 beads. So: 3 tens + 7 ones = 37.",
    common_misconceptions: "When counting by 10s, children often say 10, 20, 30, 40, 50 … but then jump incorrectly. Remind: each step is exactly 10 more.",
    shortcuts_and_tricks: "Tens pattern: 10, 20, 30, 40, 50, 60, 70, 80, 90 — always ends in zero. The tens digit tells you how many bundles of 10 you have.",
    key_takeaway: "Bundling objects into tens makes counting to 99 simple; the tens digit counts bundles, the ones digit counts leftovers.",
  },
  {
    topicId: "math2_ch5", chapterNumber: 5, sectionNumber: "5.1",
    title: "Patterns", subject: "Mathematics",
    intuition: "Patterns are everywhere — in floors, clothes, and songs. Finding the rule in a pattern is the foundation of all mathematical thinking.",
    process_explanation: "Step 1: Look at the first few items in the pattern. Step 2: Find the repeating unit (the smallest group that repeats). Step 3: Continue the pattern using the same unit.",
    worked_example: "Pattern: red, blue, red, blue, red, ___. Repeating unit: red, blue. Next: blue. Number pattern: 2, 4, 6, 8, ___. Rule: add 2 each time. Next: 10.",
    common_misconceptions: "Children sometimes copy the last item rather than applying the rule. Always identify the full repeating unit first, then extend.",
    shortcuts_and_tricks: "For ABAB patterns, the positions 1, 3, 5 … are always A; positions 2, 4, 6 … are always B. For number patterns, find the difference between consecutive terms.",
    key_takeaway: "Every pattern has a repeating unit or rule; find the rule first, then extend the pattern.",
  },
  {
    topicId: "math2_ch6", chapterNumber: 6, sectionNumber: "6.1",
    title: "Footprints", subject: "Mathematics",
    intuition: "Before rulers existed, people measured using their own body parts — handspans, footsteps, and arm lengths. This shows why we need standard units.",
    process_explanation: "Step 1: Choose a non-standard unit (e.g., handspan). Step 2: Place the unit end-to-end along the object without gaps or overlaps. Step 3: Count how many units fit. Step 4: Record: 'The table is 8 handspans long'.",
    worked_example: "Arun measures a table with his pencil. He places the pencil end-to-end 5 times. The table is 5 pencils long. His friend uses a shorter pencil and gets 7. Different units give different numbers!",
    common_misconceptions: "Leaving gaps or overlapping units gives wrong counts. Units must be placed touching end-to-end with no gaps.",
    shortcuts_and_tricks: "If the object does not fit an exact number of units, say it is 'about' that many (estimate). You will learn exact cm measurement in later chapters.",
    key_takeaway: "Non-standard units can measure length, but different people get different numbers; this is why we need standard units like cm.",
  },
  {
    topicId: "math2_ch7", chapterNumber: 7, sectionNumber: "7.1",
    title: "Jugs and Mugs", subject: "Mathematics",
    intuition: "Some containers hold more water; others hold less. Capacity describes how much a container can hold — a bucketful vs a cupful.",
    process_explanation: "Step 1: Fill container A completely. Step 2: Pour it into container B. Step 3: If B overflows, B holds less than A. If B is not full, B holds more than A. Step 4: Use words: holds more, holds less, holds the same.",
    worked_example: "Fill a mug. Pour it into a bottle. The bottle is only half full. So the bottle holds MORE than the mug — the mug's capacity is less than the bottle's.",
    common_misconceptions: "Taller does not always mean more capacity. A tall thin glass may hold less than a short wide bowl. Shape matters, not just height.",
    shortcuts_and_tricks: "Use a small cup as the measuring unit: count how many cupfuls fill each container. The container needing more cups has greater capacity.",
    key_takeaway: "Capacity is how much a container holds; we compare by pouring and using words full, empty, more, less.",
  },
  {
    topicId: "math2_ch8", chapterNumber: 8, sectionNumber: "8.1",
    title: "Tens and Ones", subject: "Mathematics",
    intuition: "Every two-digit number is made of a tens part and a ones part. Understanding place value means knowing the value of each digit based on its position.",
    process_explanation: "Step 1: Write the number (e.g., 47). Step 2: The digit on the left is in the tens place — its value is 4 × 10 = 40. Step 3: The digit on the right is in the ones place — its value is 7 × 1 = 7. Step 4: Expanded form: 47 = 40 + 7.",
    worked_example: "Number: 63. Tens digit: 6 → value = 60. Ones digit: 3 → value = 3. Expanded form: 63 = 60 + 3. On an abacus: 6 beads in the tens column, 3 beads in the ones column.",
    common_misconceptions: "Children may read 47 as 'four seven' (two separate digits) instead of 'forty-seven'. Always connect the digit to its value: 4 in tens place = 40.",
    shortcuts_and_tricks: "To compare two-digit numbers: look at the tens digit first. The number with the larger tens digit is greater. If tens are equal, compare ones digits.",
    key_takeaway: "In a two-digit number, the left digit is tens, the right digit is ones; 63 = 60 + 3 (expanded form).",
  },
  {
    topicId: "math2_ch9", chapterNumber: 9, sectionNumber: "9.1",
    title: "My Funbook", subject: "Mathematics",
    intuition: "Numbers have relationships — every number has a neighbour before and after it. Seeing these connections builds number sense.",
    process_explanation: "Step 1: For 'just before', subtract 1. Step 2: For 'just after', add 1. Step 3: For 'between', find the number that fits in the gap. Step 4: For number stories, write the equation that matches the situation.",
    worked_example: "Just before 50 is 49 (50 − 1). Just after 78 is 79 (78 + 1). Between 35 and 37 is 36. Story: 'Mia has 24 stickers. She gets 5 more.' → 24 + 5 = 29 stickers.",
    common_misconceptions: "Children confuse 'just before' with 'just after'. Reinforce: before = less/smaller; after = more/larger.",
    shortcuts_and_tricks: "Number line trick: move left for 'before', right for 'after'. Drawing a simple number line helps visualise neighbour numbers.",
    key_takeaway: "Every number has a neighbour just before (−1) and just after (+1); number stories connect real situations to equations.",
  },
  {
    topicId: "math2_ch10", chapterNumber: 10, sectionNumber: "10.1",
    title: "Add our Points", subject: "Mathematics",
    intuition: "Addition combines two amounts into a total. When the ones digits add up to 10 or more, we carry a ten to the tens column.",
    process_explanation: "Step 1: Write numbers in columns (tens | ones). Step 2: Add the ones digits. Step 3: If the sum ≥ 10, write the ones digit and carry 1 to the tens column. Step 4: Add the tens digits plus any carry. Step 5: Write the full answer.",
    worked_example: "Add 36 + 47. Ones: 6 + 7 = 13 → write 3, carry 1. Tens: 3 + 4 + 1(carry) = 8. Answer: 83. Check: 36 + 47 = 83 ✓",
    common_misconceptions: "Forgetting to add the carried 1 to the tens column is the most common error. Write the carry digit clearly above the tens column.",
    shortcuts_and_tricks: "Make-10 strategy for ones: 6 + 7 → break 7 into 4 + 3, then 6 + 4 = 10, + 3 = 13. This avoids finger-counting.",
    key_takeaway: "Add ones first; if ones sum ≥ 10, carry 1 to tens; then add tens plus any carry.",
  },
  {
    topicId: "math2_ch11", chapterNumber: 11, sectionNumber: "11.1",
    title: "Lines and Lines", subject: "Mathematics",
    intuition: "All shapes are made of lines. Understanding the difference between straight, curved, open, and closed shapes is the foundation of geometry.",
    process_explanation: "Straight line: no bend, ruler-drawn. Curved line: bends smoothly. Horizontal: left-right. Vertical: up-down. Slanting: tilted. Open shape: the boundary has a gap. Closed shape: the boundary is complete with no gap.",
    worked_example: "A triangle is a closed shape made of 3 straight lines. The letter 'C' is an open shape made of a curved line. The letter 'O' is a closed shape made of a curved line.",
    common_misconceptions: "Children confuse open and closed shapes. Test: trace your finger around the boundary — if you can get 'inside' without crossing a line, it is open.",
    shortcuts_and_tricks: "Closed shapes can be filled with colour. Open shapes cannot be filled because there is a gap (the colour would 'leak' out).",
    key_takeaway: "Lines can be straight or curved, horizontal, vertical, or slanting; shapes are open (gap in boundary) or closed (no gap).",
  },
  {
    topicId: "math2_ch12", chapterNumber: 12, sectionNumber: "12.1",
    title: "Give and Take", subject: "Mathematics",
    intuition: "Subtraction is taking away from a total. When the ones digit of the bigger number is smaller than the ones digit being subtracted, we borrow a ten from the tens column.",
    process_explanation: "Step 1: Write numbers in columns. Step 2: Subtract ones. If top ones < bottom ones, borrow 1 ten from the tens column (top tens digit decreases by 1; top ones digit increases by 10). Step 3: Subtract the ones. Step 4: Subtract the tens.",
    worked_example: "52 − 27. Ones: 2 < 7, so borrow. Tens digit 5 becomes 4; ones digit 2 becomes 12. 12 − 7 = 5. Tens: 4 − 2 = 2. Answer: 25. Check: 25 + 27 = 52 ✓",
    common_misconceptions: "A common error: instead of borrowing, children subtract the smaller digit from the larger (e.g., writing 5 for 2−7 by doing 7−2). Always borrow when top ones < bottom ones.",
    shortcuts_and_tricks: "Subtraction check: add the answer back to the number you subtracted. If you get the original number, your subtraction is correct.",
    key_takeaway: "When top ones < bottom ones, borrow 1 ten (tens digit −1, ones digit +10), then subtract normally.",
  },
  {
    topicId: "math2_ch13", chapterNumber: 13, sectionNumber: "13.1",
    title: "The Longest Step", subject: "Mathematics",
    intuition: "A ruler gives us a standard way to measure length so that everyone gets the same number. The centimetre (cm) is the standard unit used in primary school.",
    process_explanation: "Step 1: Place the 0 mark of the ruler exactly at one end of the object. Step 2: Read the number where the other end of the object lines up. Step 3: That number is the length in centimetres.",
    worked_example: "A crayon is placed from 0 cm to 8 cm on the ruler. The crayon is 8 cm long. A pencil placed from 0 to 12 cm is 12 cm long. The pencil is longer.",
    common_misconceptions: "Starting measurement from 1 instead of 0 is a very common error. Always start from the 0 mark.",
    shortcuts_and_tricks: "To compare two lengths without putting them side by side, measure each in cm and compare the numbers. The longer object gives a bigger cm number.",
    key_takeaway: "Always measure from the 0 mark; the number at the other end is the length in cm.",
  },
  {
    topicId: "math2_ch14", chapterNumber: 14, sectionNumber: "14.1",
    title: "Birds Come, Birds Go", subject: "Mathematics",
    intuition: "Real-life situations often need more than one calculation. Two-step problems combine addition and subtraction, just like birds arriving at and leaving a tree.",
    process_explanation: "Step 1: Read the problem carefully. Step 2: Identify the first action (do you add or subtract?). Step 3: Solve the first step to get an intermediate answer. Step 4: Identify the second action. Step 5: Solve the second step for the final answer.",
    worked_example: "12 birds are on a tree. 5 more arrive. Then 8 fly away. How many are left? Step 1: 12 + 5 = 17 birds. Step 2: 17 − 8 = 9 birds. Answer: 9 birds remain.",
    common_misconceptions: "Children sometimes try to do both steps at once or reverse the order. Underline key words ('more arrive' = add; 'fly away' = subtract) and solve step by step.",
    shortcuts_and_tricks: "Write an intermediate answer clearly before starting the second step. This prevents mixing up the two steps.",
    key_takeaway: "Two-step problems need two calculations in order; identify the operation for each step before solving.",
  },
  {
    topicId: "math2_ch15", chapterNumber: 15, sectionNumber: "15.1",
    title: "How Many Ponytails?", subject: "Mathematics",
    intuition: "Data is information we collect by observing or asking questions. Organising it into tally marks and pictographs makes it easy to read and compare.",
    process_explanation: "Tally marks: make a vertical stroke (|) for each count; the fifth stroke is drawn across the four (IIII = 5). Count by 5s when totalling. Pictograph: each picture represents one item (or a fixed number if a key is given). Read by counting pictures.",
    worked_example: "10 children were asked their favourite fruit. Mango: 4, Apple: 3, Banana: 3. Tally for mango: |||| (4 strokes). Pictograph: draw 4 mango symbols. Most popular: mango (4 children).",
    common_misconceptions: "When the key says 1 picture = 2, children often count pictures rather than multiplying. Always check the key before reading a pictograph.",
    shortcuts_and_tricks: "Total tally marks = count all strokes. Each bundle of 5 slashes (four vertical + one diagonal) counts as 5 — multiply bundles × 5, then add leftover strokes.",
    key_takeaway: "Tally marks record data in groups of 5; pictographs show data as pictures; always read the key for a pictograph.",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
  for (const c of contents) {
    await NcertTopicContent.findOneAndUpdate(
      { topicId: c.topicId },
      c,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${c.topicId}: ${c.title}`);
  }
  console.log(`\nSeeded ${contents.length} NcertTopicContent docs for CBSE Class 2 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
