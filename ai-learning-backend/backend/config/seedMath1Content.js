/**
 * CBSE Class 1 Mathematics — NcertTopicContent seed
 * Teaching content for all 13 chapters. Safe to re-run.
 * Usage: node config/seedMath1Content.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const contents = [
  {
    topicId: "math1_ch1", chapterNumber: 1, sectionNumber: "1.1",
    title: "Shapes and Space", subject: "Mathematics",
    intuition: "Everything we see has a shape. Learning to name shapes and describe where things are helps us talk about the world clearly.",
    process_explanation: "Shapes: circle (round, no corners), square (4 equal sides, 4 corners), triangle (3 sides, 3 corners), rectangle (4 sides, 4 corners — opposite sides equal). Spatial words: inside/outside (is the object in the box or out?), above/below (is it higher or lower?), near/far (is it close or far away?).",
    worked_example: "A clock face is a circle. A door is a rectangle. A traffic sign is a triangle. 'The cat is INSIDE the box.' 'The bird is ABOVE the tree.' 'The shop is FAR from here.'",
    common_misconceptions: "Children often call any shape with corners a 'square'. Clarify: a square has 4 EQUAL sides; a rectangle has 2 long sides and 2 short sides.",
    shortcuts_and_tricks: "Count corners to name a shape: 0 corners = circle, 3 corners = triangle, 4 corners = square or rectangle. Then check if all sides are equal to tell square from rectangle.",
    key_takeaway: "Four basic shapes: circle (0 corners), triangle (3 corners), square/rectangle (4 corners). Spatial words: inside/outside, above/below, near/far.",
  },
  {
    topicId: "math1_ch2", chapterNumber: 2, sectionNumber: "2.1",
    title: "Numbers from One to Nine", subject: "Mathematics",
    intuition: "Numbers tell us HOW MANY. Before we can add or subtract, we need to know what each number from 1 to 9 means and how to write it.",
    process_explanation: "Step 1: Count objects one by one, pointing to each. Step 2: The last number said is the total. Step 3: Write the numeral that matches. Zero (0) means there are NO objects. The numerals are: 1, 2, 3, 4, 5, 6, 7, 8, 9.",
    worked_example: "There are 🍎🍎🍎🍎 apples. Count: 1, 2, 3, 4. There are 4 apples. Write '4'. For zero: there are 0 bananas in an empty bowl — write '0'.",
    common_misconceptions: "Children sometimes count the same object twice or skip one. Teach them to touch each object once and move it aside after counting.",
    shortcuts_and_tricks: "Use fingers for small numbers. Hold up fingers as you count: 1 finger for 1, 2 fingers for 2 … up to 9 fingers. The number of fingers up = the number.",
    key_takeaway: "Numbers 0–9 tell us how many; always count one-to-one (one point per object); the last number said is the total.",
  },
  {
    topicId: "math1_ch3", chapterNumber: 3, sectionNumber: "3.1",
    title: "Addition", subject: "Mathematics",
    intuition: "Addition means putting two groups together to find the total. When we add, the answer is always greater than or equal to either starting number.",
    process_explanation: "Step 1: Count the first group. Step 2: Count the second group. Step 3: Put them together and count all. Step 4: Write as number sentence: first + second = total. The '+' means 'and also'; '=' means 'is the same as'.",
    worked_example: "3 cats + 2 cats: count all together 1, 2, 3, 4, 5 → 3 + 2 = 5. Or: start at 3 and count on 2 more: 3 … 4, 5 = 5.",
    common_misconceptions: "Children may restart counting from 1 instead of counting on. Teach counting on: start at the bigger number and count on the smaller.",
    shortcuts_and_tricks: "Count-on strategy: always start with the BIGGER number and count on the smaller. 2 + 6 → start at 6, count on 2: 7, 8. Answer: 8.",
    key_takeaway: "Addition = combining two groups; write as A + B = C; count-on from the bigger number to find the total.",
  },
  {
    topicId: "math1_ch4", chapterNumber: 4, sectionNumber: "4.1",
    title: "Subtraction", subject: "Mathematics",
    intuition: "Subtraction means taking away from a group. The answer is always smaller than the number we started with (unless we subtract 0).",
    process_explanation: "Step 1: Start with the total. Step 2: Cross out or remove the number taken away. Step 3: Count what is left. Step 4: Write as: total − taken away = left. The '−' means 'take away'.",
    worked_example: "5 balloons. 2 pop. How many left? 5 − 2 = 3. Draw 5 circles, cross out 2: ⊗⊗○○○ → 3 left. Check: 3 + 2 = 5 ✓",
    common_misconceptions: "Children sometimes subtract the wrong number. Always write the TOTAL (bigger number) first, then the amount taken away.",
    shortcuts_and_tricks: "Count-back strategy: start at the total and count backwards. 7 − 3: start at 7, count back 3: 6, 5, 4. Answer: 4. Check with addition: 4 + 3 = 7 ✓",
    key_takeaway: "Subtraction = taking away; write as A − B = C (A > B); count back from A by B steps; verify with addition.",
  },
  {
    topicId: "math1_ch5", chapterNumber: 5, sectionNumber: "5.1",
    title: "Numbers from Ten to Twenty", subject: "Mathematics",
    intuition: "Numbers 10 to 20 are called teen numbers. Each one is 'ten and some more' — this is the beginning of understanding place value.",
    process_explanation: "Step 1: Ten is a special number — it is 1 group of ten. Step 2: Eleven = ten + 1 more. Twelve = ten + 2 more … up to twenty = two groups of ten. Step 3: Write the numeral: 10, 11, 12, … 20. Step 4: Compare: a number that comes later when counting is greater.",
    worked_example: "13 = ten + 3. Say: 'thirteen'. Write: 13. Is 17 greater than 14? Both have 1 ten. Compare ones: 7 > 4. So 17 > 14.",
    common_misconceptions: "Children often confuse 'thirteen' (13) and 'thirty' (30). Stress: teen numbers are 13–19 and are close to 10, NOT 30 or 40.",
    shortcuts_and_tricks: "Teen numbers: 1_ (where _ is the ones digit). The 'teen' suffix tells you there is a 1 in the tens place. Exceptions: eleven (11) and twelve (12) don't use 'teen'.",
    key_takeaway: "Numbers 10–20 are 'ten and some more'; compare using the ones digit when tens are equal; eleven/twelve are special names.",
  },
  {
    topicId: "math1_ch6", chapterNumber: 6, sectionNumber: "6.1",
    title: "Time", subject: "Mathematics",
    intuition: "Time tells us WHEN things happen. The day is divided into parts (morning, afternoon, evening, night) and the week has 7 days. Knowing time helps us organise our life.",
    process_explanation: "Parts of the day: Morning (wake up, breakfast, school), Afternoon (lunch, rest), Evening (play, snack), Night (dinner, sleep). Days of the week in order: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. Yesterday = the day before today. Tomorrow = the day after today.",
    worked_example: "If today is Wednesday: yesterday = Tuesday, tomorrow = Thursday. Morning activity: brushing teeth. Evening activity: playing in the park.",
    common_misconceptions: "Children often confuse 'yesterday' and 'tomorrow'. Draw a three-day strip: Yesterday | Today | Tomorrow and point to each.",
    shortcuts_and_tricks: "Days mnemonic: 'My Tiny Wiggly Toes Feel So Soft' = Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.",
    key_takeaway: "Day has four parts (morning, afternoon, evening, night); week has 7 days in order; yesterday is before today, tomorrow is after.",
  },
  {
    topicId: "math1_ch7", chapterNumber: 7, sectionNumber: "7.1",
    title: "Measurement", subject: "Mathematics",
    intuition: "Some things are longer, taller, or heavier than others. Comparing objects directly helps us find out which is bigger or heavier without needing numbers.",
    process_explanation: "Comparing lengths: place objects side by side with one end matched; the one that sticks out more at the other end is longer. Comparing heights: stand objects on the same flat surface; the one that reaches higher is taller. Comparing weights: hold one in each hand; the hand that feels heavier is the heavier object (or use a balance scale).",
    worked_example: "Pencil vs crayon — place them side by side from the same end. If the pencil sticks out further, the pencil is longer. A giraffe is taller than a dog. A brick is heavier than a leaf.",
    common_misconceptions: "Children may not align the starting ends when comparing length. Always line up from the same end before comparing.",
    shortcuts_and_tricks: "For length: always START from the same edge. For height: always START from the same flat surface. For weight: use a balance scale — the side that goes down is heavier.",
    key_takeaway: "Compare lengths by aligning one end; compare heights from the same flat surface; compare weights by feel or balance scale.",
  },
  {
    topicId: "math1_ch8", chapterNumber: 8, sectionNumber: "8.1",
    title: "Numbers from Twenty-one to Fifty", subject: "Mathematics",
    intuition: "Numbers 21–50 build on our knowledge of tens and ones. Every number from 21 to 50 has a tens digit (2, 3, 4, or 5) and a ones digit.",
    process_explanation: "Step 1: Write the tens digit (how many groups of 10). Step 2: Write the ones digit (how many leftover). Step 3: Read: 35 = 'thirty-five'. Step 4: To compare, look at the tens digit first; if equal, look at ones.",
    worked_example: "34 = 3 tens + 4 ones = thirty-four. 47 = 4 tens + 7 ones = forty-seven. Compare 38 and 41: tens of 38 = 3, tens of 41 = 4. Since 4 > 3, 41 > 38.",
    common_misconceptions: "Children sometimes say 'fourty' instead of 'forty'. The correct spelling and saying is 'forty' (no 'u').",
    shortcuts_and_tricks: "Number names: 20=twenty, 30=thirty, 40=forty (no u!), 50=fifty. For numbers in between, say the tens word then the ones word: 43 = forty-three.",
    key_takeaway: "Numbers 21–50: tens digit tells the group of tens; ones digit tells the leftover; compare tens digits first.",
  },
  {
    topicId: "math1_ch9", chapterNumber: 9, sectionNumber: "9.1",
    title: "Data Handling", subject: "Mathematics",
    intuition: "Data means information we collect. Sorting and grouping objects helps us see patterns and answer questions like 'which is the most common?'",
    process_explanation: "Step 1: Choose ONE way to sort (by colour, shape, or size — not two at once). Step 2: Place each object in the correct group. Step 3: Count each group. Step 4: Compare: the group with the most objects = most common; least objects = least common.",
    worked_example: "Sort 8 shapes: 3 red circles, 2 blue squares, 3 red triangles. Sort by COLOUR: Red group = 6 objects, Blue group = 2 objects. Red is more common than blue.",
    common_misconceptions: "Children may sort by two attributes at once. Teach: choose ONE attribute (e.g. colour) and stick to it.",
    shortcuts_and_tricks: "After sorting, line up objects in rows. The longest row has the most; the shortest has the least. This is how a bar chart works!",
    key_takeaway: "Sort by one attribute; count each group; most = longest group, least = shortest group.",
  },
  {
    topicId: "math1_ch10", chapterNumber: 10, sectionNumber: "10.1",
    title: "Patterns", subject: "Mathematics",
    intuition: "Patterns repeat in a regular way. Finding the rule in a pattern helps us predict what comes next — this is the core of mathematical thinking.",
    process_explanation: "Step 1: Look at the first few items. Step 2: Find the repeating unit (the smallest part that repeats). Step 3: Continue the pattern by repeating the same unit. Common patterns: AB, AAB, ABC.",
    worked_example: "Red, Blue, Red, Blue, Red, ___ → unit is Red, Blue (AB pattern). Next = Blue. Big, Small, Big, Small, Big, ___ → unit is Big, Small. Next = Small.",
    common_misconceptions: "Children may extend by just repeating the last item. Always identify the FULL repeating unit first before extending.",
    shortcuts_and_tricks: "Circle the repeating unit and draw it again and again. If the unit is AB: position 1=A, 2=B, 3=A, 4=B… Odd positions = A, even positions = B.",
    key_takeaway: "Find the smallest repeating unit; extend by repeating that unit; odd/even position trick for AB patterns.",
  },
  {
    topicId: "math1_ch11", chapterNumber: 11, sectionNumber: "11.1",
    title: "Numbers", subject: "Mathematics",
    intuition: "Numbers go all the way to 99 in Class 1. Every two-digit number is made of a tens part and a ones part — this is place value.",
    process_explanation: "Step 1: For numbers 51–99, identify the tens digit and ones digit. Step 2: The tens digit × 10 gives the tens value. Step 3: Add the ones digit to get the number. Step 4: To compare, compare tens digits; if equal, compare ones digits.",
    worked_example: "72 = 7 tens + 2 ones = seventy-two. 89 = 8 tens + 9 ones = eighty-nine. Compare 65 and 68: both have 6 tens. Ones: 5 < 8. So 65 < 68.",
    common_misconceptions: "Children may read 72 as 'seven two' instead of 'seventy-two'. Practice reading: say the tens name, then the ones name joined with a hyphen for 21–99.",
    shortcuts_and_tricks: "60s: sixty-one, sixty-two … 70s: seventy-one … 80s: eighty-one … 90s: ninety-one … The pattern is the same every decade.",
    key_takeaway: "Numbers 51–99 have a tens and ones digit; read as tens-name + ones-name; compare tens first, then ones if tens are equal.",
  },
  {
    topicId: "math1_ch12", chapterNumber: 12, sectionNumber: "12.1",
    title: "Money", subject: "Mathematics",
    intuition: "Money is how we buy things. Learning to recognise coins and count small amounts prepares us for real-life shopping.",
    process_explanation: "Coins: 1 rupee (small, silver), 2 rupees (medium, silver), 5 rupees (large, gold rim). Notes: 10 rupees (paper note). To find the total: add the value of each coin/note. To decide if you have enough: compare your total with the price.",
    worked_example: "A pencil costs 3 rupees. You have: 1₹ + 1₹ + 1₹ = 3₹. You have EXACTLY enough. A rubber costs 6₹. You have: 5₹ + 2₹ = 7₹. You have ENOUGH (and get 1₹ change).",
    common_misconceptions: "Children confuse coin SIZE with coin VALUE. A 2-rupee coin may look similar to a 1-rupee coin. Teach: always look for the number or symbol stamped on the coin.",
    shortcuts_and_tricks: "Sort coins by value, biggest first: 5₹, 2₹, 1₹. Add 5-rupee coins first, then 2-rupee, then 1-rupee to get the total faster.",
    key_takeaway: "Recognise 1₹, 2₹, 5₹ coins and 10₹ note; add values to find total; compare total with price to decide if you have enough.",
  },
  {
    topicId: "math1_ch13", chapterNumber: 13, sectionNumber: "13.1",
    title: "How Many", subject: "Mathematics",
    intuition: "Counting precisely and comparing groups are fundamental skills. 'How many?' is the most basic question in mathematics.",
    process_explanation: "Counting: touch each object once, say the number, move on. The last number said is 'how many'. One-to-one matching: pair each item in one group with exactly one item in the other. If they match up exactly — same number. If one group has leftover items — that group has MORE.",
    worked_example: "Group A: 🐶🐶🐶🐶🐶 (5 dogs). Group B: 🦴🦴🦴 (3 bones). Match: dog1↔bone1, dog2↔bone2, dog3↔bone3. Dogs left over: 2. Dogs are MORE. Bones are FEWER.",
    common_misconceptions: "Children sometimes judge by the spread of objects rather than count. A spread-out group of 3 may look like more than a compact group of 5. Always count — don't judge by appearance.",
    shortcuts_and_tricks: "Match and check: draw a line from each item in one group to an item in the other. If lines are left without a partner, that group has more.",
    key_takeaway: "Count carefully one-to-one; match groups to compare; more = group with leftover items; fewer = group that runs out first.",
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
  console.log(`\nSeeded ${contents.length} NcertTopicContent docs for CBSE Class 1 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
