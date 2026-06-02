/**
 * seedM33StackQueueGaps.js — Section A of DSA_GAP_CHECKLIST.md
 *
 * Additive, idempotent. Appends the 13 missing Stack/Queue exercises (found by
 * the staying.fun cross-verification) onto EXISTING M33 topics. Touches ONLY
 * module java_m33 (Session A lane). Does NOT edit the original M33 seed.
 *
 *   T3 (Queue Fundamentals)  ← 8 queue exercises  (ex_12 … ex_19)
 *   T1 (Stack Fundamentals)  ← 4 stack exercises  (ex_15 … ex_18)
 *   T2 (Monotonic Stack)     ← 1 stack exercise   (ex_13: 132 Pattern)
 *
 * Also adds two teaching concept notes (queue rearrangement, stack rearrangement).
 * exerciseId follows the validator: ^[a-z][a-z0-9_]*_m\d+_t\d+_(ex|pm)_\d+$
 *
 * Usage: node config/seedM33StackQueueGaps.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const MODULE_ID = "java_m33";

function ex(exerciseId, topicId, position, level, type, title, instructions,
            expectedSolution, hints, testCases, starterCode = "", scenario = "") {
  return {
    exerciseId, topicId, moduleId: MODULE_ID, trackKey: "pro_java",
    position, level, type, title, instructions, expectedSolution,
    hints, testCases, starterCode, scenario,
    blanks: [], difficulty: { warmup: 0.17, easy: 0.40, medium: 0.65, hard: 0.90 }[level] ?? 0.5,
    xpReward: { warmup: 10, easy: 15, medium: 20, hard: 30 }[level] ?? 15,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// QUEUE — 8 exercises → java_m33_t3 (Queue Fundamentals)
// ─────────────────────────────────────────────────────────────────────────────
const QUEUE = [
  ex("java_m33_t3_ex_12","java_m33_t3",12,"medium","code_scratch",
    "First Non-Repeating Character in a Stream (LeetCode #387 stream variant)",
    "Process a stream of lowercase characters. After EACH character arrives, report the first non-repeating character seen so far (or '#' if none). Use a queue of candidates + a frequency map.",
    "Maintain a Queue<Character> of candidates and an int[26] frequency.\nFor each incoming char c:\n  freq[c-'a']++ ; queue.add(c)\n  while (!queue.isEmpty() && freq[queue.peek()-'a'] > 1) queue.poll();  // evict repeats from front\n  answer += queue.isEmpty() ? '#' : queue.peek();\nThe front of the queue is always the earliest still-unique char.\nO(n) total — each char enqueued and dequeued at most once.",
    ["Queue holds candidates in arrival order; freq map counts occurrences",
     "After adding a char, evict front while its frequency > 1",
     "Front of queue = first non-repeating; '#' if queue empty"],
    [{ type:"execution", input:"\"aabc\"", expected:"a#bb" },
     { type:"execution", input:"\"aaa\"",  expected:"a##" }],
    `String firstNonRepeating(String stream) {\n    // return one char per input char (or '#')\n}`),

  ex("java_m33_t3_ex_13","java_m33_t3",13,"easy","code_scratch",
    "Reverse First K Elements of a Queue",
    "Given a queue and an integer k, reverse the order of the FIRST k elements, keeping the rest in their original order.\n(Same primitive as 'reverse first k characters' of a streaming queue.)",
    "Step 1: dequeue first k elements, push onto a Stack.\nStep 2: pop the stack back into the queue (now reversed).\nStep 3: move the remaining (size-k) elements from front to back to restore their order.\nO(n) time, O(k) space.",
    ["Use a stack to reverse the first k","After re-enqueueing the reversed k, rotate the remaining n-k elements to the back","Stack reverses; rotation preserves the tail order"],
    [{ type:"execution", input:"[1,2,3,4,5],3", expected:"[3,2,1,4,5]" },
     { type:"execution", input:"[10,20,30,40],2", expected:"[20,10,30,40]" }],
    `Queue<Integer> reverseFirstK(Queue<Integer> q, int k) {\n    // your code here\n}`),

  ex("java_m33_t3_ex_14","java_m33_t3",14,"easy","code_scratch",
    "Generate Binary Numbers 1 to N (queue BFS)",
    "Generate the binary representations of numbers from 1 to n, in order, using a queue.\nReturn them as a list of strings.",
    "BFS generation:\n  queue.add(\"1\")\n  for i in 1..n:\n    s = queue.poll(); result.add(s)\n    queue.add(s + \"0\"); queue.add(s + \"1\")\nEach dequeued string is the next binary number; its children are s+'0' and s+'1'.\nO(n) — each number produced once.",
    ["Seed the queue with \"1\"","Each poll yields the next binary number","Enqueue s+\"0\" and s+\"1\" as the next candidates"],
    [{ type:"execution", input:"5", expected:"[1, 10, 11, 100, 101]" },
     { type:"execution", input:"3", expected:"[1, 10, 11]" }],
    `List<String> generateBinary(int n) {\n    // your code here\n}`),

  ex("java_m33_t3_ex_15","java_m33_t3",15,"medium","code_scratch",
    "Generate Number Pattern with Digits 1 and 2 (queue BFS)",
    "Using only the digits 1 and 2, generate the first n such numbers in increasing length/order: 1, 2, 11, 12, 21, 22, 111, …\nUse a queue (same BFS shape as generating binary numbers).",
    "BFS with two children per node:\n  queue.add(\"1\"); queue.add(\"2\")\n  for i in 1..n:\n    s = queue.poll(); result.add(s)\n    queue.add(s + \"1\"); queue.add(s + \"2\")\nFor binary it was 0/1; here it's 1/2. The queue gives the natural increasing order.",
    ["Seed with both \"1\" and \"2\"","Each node spawns s+\"1\" and s+\"2\"","Queue order gives shortest-first, then lexicographic"],
    [{ type:"execution", input:"5", expected:"[1, 2, 11, 12, 21]" },
     { type:"execution", input:"7", expected:"[1, 2, 11, 12, 21, 22, 111]" }],
    `List<String> generatePattern(int n) {\n    // your code here\n}`),

  ex("java_m33_t3_ex_16","java_m33_t3",16,"medium","code_scratch",
    "Interleave the Two Halves of a Queue",
    "Given a queue of EVEN size, interleave the first half with the second half.\nExample: [1,2,3,4,5,6] → [1,4,2,5,3,6].",
    "Step 1: push the first half onto a stack… (alternative) use a second queue.\nClean approach with an auxiliary queue:\n  half = size/2\n  move first `half` elements into a temp queue\n  then alternately: poll temp (first-half element), poll original (second-half element)\n  enqueue both back.\nO(n) time, O(n) space.",
    ["Split into first half and second half","Alternate one from each half when rebuilding","Queue of even size is guaranteed"],
    [{ type:"execution", input:"[1,2,3,4,5,6]", expected:"[1,4,2,5,3,6]" },
     { type:"execution", input:"[11,12,13,14]", expected:"[11,13,12,14]" }],
    `Queue<Integer> interleave(Queue<Integer> q) {\n    // your code here\n}`),

  ex("java_m33_t3_ex_17","java_m33_t3",17,"warmup","predict_output",
    "Trace: rotate a queue by K",
    "Queue (front → back): [1, 2, 3, 4, 5], k = 2.\nTrace rotating the queue LEFT by k (move the first k elements to the back, in order). Show the queue after each move and the final state.",
    "Rotate left by 2 = dequeue front, enqueue at back, twice:\nMove 1: poll 1, add 1 → [2,3,4,5,1]\nMove 2: poll 2, add 2 → [3,4,5,1,2]\n\nFinal: [3,4,5,1,2]\n\n(The first k elements end up at the back, preserving their order.)",
    ["Rotate left by k = (poll front, enqueue) repeated k times","Order of the moved elements is preserved","Equivalent to slicing: [k..n-1] + [0..k-1]"],
    [{ type:"text_match", expected:"[3,4,5,1,2]" }]),

  ex("java_m33_t3_ex_18","java_m33_t3",18,"easy","code_scratch",
    "Rotate a Queue by Blocks of K (reverse each block)",
    "Given a queue and block size k, reverse every consecutive block of k elements.\nExample: [1,2,3,4,5,6], k=3 → [3,2,1,6,5,4]. A final partial block (size < k) is reversed as-is.\n(This is the queue analog of reverse-k-group.)",
    "Process block by block:\n  while queue not empty:\n    take up to k elements into a stack (reverses them)\n    pop the stack back into a result queue\n  → each block is reversed independently.\nO(n) time, O(k) space.",
    ["Use a stack per block to reverse it","Take min(k, remaining) elements per block","A trailing block smaller than k is still reversed"],
    [{ type:"execution", input:"[1,2,3,4,5,6],3", expected:"[3,2,1,6,5,4]" },
     { type:"execution", input:"[1,2,3,4,5],2", expected:"[2,1,4,3,5]" }],
    `Queue<Integer> reverseInBlocks(Queue<Integer> q, int k) {\n    // your code here\n}`),

  ex("java_m33_t3_ex_19","java_m33_t3",19,"easy","code_scratch",
    "Reverse an Entire Queue using Recursion",
    "Reverse all elements of a queue using recursion (no explicit stack, no extra collection — rely on the call stack).",
    "Recursive reversal:\n  void reverse(Queue<Integer> q) {\n    if (q.isEmpty()) return;\n    int front = q.poll();      // hold the front on the call stack\n    reverse(q);                // reverse the rest\n    q.add(front);              // append held element at the back\n  }\nThe call stack holds elements in reverse order, re-appending them tail-first.\nO(n) time, O(n) recursion depth.",
    ["Poll the front, recurse, then enqueue the held element","The recursion's unwind order reverses the queue","Base case: empty queue"],
    [{ type:"execution", input:"[1,2,3,4]", expected:"[4,3,2,1]" },
     { type:"execution", input:"[7]", expected:"[7]" }],
    `void reverseQueue(Queue<Integer> q) {\n    // recursive, in place\n}`),
];

// ─────────────────────────────────────────────────────────────────────────────
// STACK — 4 exercises → java_m33_t1 (Stack Fundamentals)
// ─────────────────────────────────────────────────────────────────────────────
const STACK_T1 = [
  ex("java_m33_t1_ex_15","java_m33_t1",15,"warmup","code_scratch",
    "Reverse a String using a Stack",
    "Reverse a string by pushing every character onto a stack, then popping them off to rebuild the string.\n(Demonstrates LIFO; contrast with the O(1)-space two-pointer reversal.)",
    "Push all chars onto a Deque<Character> used as a stack, then pop into a StringBuilder.\n  for (char c : s.toCharArray()) stack.push(c);\n  while (!stack.isEmpty()) sb.append(stack.pop());\nLIFO means the last char pushed (the end of the string) comes out first.\nO(n) time, O(n) space (a two-pointer swap is O(1) space — note the trade-off).",
    ["Push every character, then pop them all","Stack = LIFO → last in, first out reverses order","Use ArrayDeque as the stack (not the legacy Stack class)"],
    [{ type:"execution", input:"\"hello\"", expected:"olleh" },
     { type:"execution", input:"\"abc\"", expected:"cba" }],
    `String reverseString(String s) {\n    // use a stack\n}`),

  ex("java_m33_t1_ex_16","java_m33_t1",16,"medium","code_scratch",
    "Sort a Stack using a Temporary Stack",
    "Sort a stack so the largest element ends on top, using only ONE additional temporary stack (no arrays, no recursion required).",
    "Insertion-style sort with a temp stack:\n  while (!input.isEmpty()) {\n    int tmp = input.pop();\n    while (!temp.isEmpty() && temp.peek() > tmp) input.push(temp.pop());\n    temp.push(tmp);\n  }\n  // temp is now sorted ascending (largest on top)\nEach element finds its sorted position by shuffling larger elements back.\nO(n²) time, O(n) space.",
    ["Pop from input, hold in tmp","While temp's top is greater than tmp, move it back to input","Push tmp onto temp when it fits in sorted order"],
    [{ type:"execution", input:"[3,1,4,2]", expected:"[1,2,3,4]" },
     { type:"execution", input:"[5,2,9]", expected:"[2,5,9]" }],
    `Deque<Integer> sortStack(Deque<Integer> input) {\n    // return sorted (largest on top)\n}`),

  ex("java_m33_t1_ex_17","java_m33_t1",17,"easy","code_scratch",
    "Reverse a Stack using Recursion",
    "Reverse a stack in place using recursion only — specifically a helper insertAtBottom().",
    "Two recursive functions:\n  reverse(stack): pop top, reverse rest, then insertAtBottom(top)\n  insertAtBottom(stack, x): if empty push x; else pop top, recurse, push top back\nThe insertAtBottom helper threads each held element to the bottom, flipping order.\nO(n²) time, O(n) recursion depth.",
    ["reverse: pop, recurse, insertAtBottom(popped)","insertAtBottom: recurse until empty, then push at the base","No extra explicit stack — the call stack does the work"],
    [{ type:"execution", input:"[1,2,3,4]", expected:"[4,3,2,1]" }],
    `void reverseStack(Deque<Integer> stack) {\n    // recursive, with insertAtBottom helper\n}`),

  ex("java_m33_t1_ex_18","java_m33_t1",18,"medium","code_scratch",
    "Validate Stack Sequences (LeetCode #946)",
    "Given two integer arrays `pushed` and `popped` (both permutations of distinct values), return true if they could be the result of a sequence of push and pop operations on an initially empty stack.",
    "Simulate with a real stack:\n  int j = 0;\n  for (int x : pushed) {\n    stack.push(x);\n    while (!stack.isEmpty() && j < popped.length && stack.peek() == popped[j]) {\n      stack.pop(); j++;\n    }\n  }\n  return stack.isEmpty();\nGreedily pop whenever the top matches the next expected popped value.\nO(n) time, O(n) space.",
    ["Push each value, then pop greedily while top == popped[j]","If the stack empties at the end, the sequence is valid","Each element pushed and popped at most once → O(n)"],
    [{ type:"execution", input:"[1,2,3,4,5],[4,5,3,2,1]", expected:"true" },
     { type:"execution", input:"[1,2,3,4,5],[4,3,5,1,2]", expected:"false" }],
    `boolean validateStackSequences(int[] pushed, int[] popped) {\n    // your code here\n}`),
];

// ─────────────────────────────────────────────────────────────────────────────
// STACK — 1 exercise → java_m33_t2 (Monotonic Stack)
// ─────────────────────────────────────────────────────────────────────────────
const STACK_T2 = [
  ex("java_m33_t2_ex_13","java_m33_t2",13,"hard","code_scratch",
    "132 Pattern (LeetCode #456)",
    "Given an array of n integers, return true if there is a 132 pattern: indices i < j < k with nums[i] < nums[k] < nums[j].",
    "Scan RIGHT to LEFT with a monotonic (decreasing) stack tracking candidate '2' values, and `third` = the best valid '2' (the nums[k]) found so far.\n  third = Integer.MIN_VALUE\n  for (i = n-1; i >= 0; i--) {\n    if (nums[i] < third) return true;          // nums[i] is the '1' → pattern found\n    while (!stack.isEmpty() && stack.peek() < nums[i]) third = stack.pop(); // pop → set the '2'\n    stack.push(nums[i]);                         // current is a candidate '3'\n  }\n  return false;\nThe popped values become `third` (the '2'), guaranteed less than some '3' to their right.\nO(n) time, O(n) space.",
    ["Scan right to left; stack holds candidate '3' (the nums[j]) values",
     "When you pop (because current is bigger), the popped value is a valid '2' = third",
     "If any element is smaller than `third`, it's the '1' → 132 pattern exists"],
    [{ type:"execution", input:"[1,2,3,4]", expected:"false" },
     { type:"execution", input:"[3,1,4,2]", expected:"true" },
     { type:"execution", input:"[-1,3,2,0]", expected:"true" }],
    `boolean find132pattern(int[] nums) {\n    // monotonic stack, scan right to left\n}`),
];

// ─────────────────────────────────────────────────────────────────────────────
// TEACHING NOTES (concept additions)
// ─────────────────────────────────────────────────────────────────────────────
const QUEUE_CONCEPT = `**Queue rearrangement & generation patterns:**

\`\`\`
1. STREAM + FREQUENCY (first non-repeating):
   Queue of candidates (arrival order) + freq map.
   Evict the front while its frequency > 1 → front is the answer.

2. REVERSE FIRST K:
   Dequeue k → stack (reverses) → re-enqueue → rotate remaining n-k to back.

3. BFS GENERATION (binary numbers, digit patterns):
   Seed the queue, poll = next output, enqueue children (s+"0"/s+"1", or s+"1"/s+"2").
   The queue yields results in shortest-first / increasing order automatically.

4. INTERLEAVE HALVES:
   Split into first/second half; alternate one element from each when rebuilding.

5. ROTATE BY K (left):
   (poll front, enqueue) repeated k times → first k move to the back, order kept.

6. REVERSE IN BLOCKS OF K:
   Per block: push up to k onto a stack, pop back → each block reversed (reverse-k-group).
\`\`\``;

const STACK_CONCEPT = `**Stack rearrangement patterns (sort / reverse / validate):**

\`\`\`
1. REVERSE via stack:    push all, pop all (LIFO flips order). O(n) space.
2. SORT a stack:         insertion-style with ONE temp stack — pop, shuffle larger
                         elements back, insert in order. O(n²).
3. REVERSE via recursion: reverse(pop, recurse, insertAtBottom). The call stack
                         replaces the explicit auxiliary stack.
4. VALIDATE push/pop seq (#946): simulate — push each, greedily pop while top ==
                         next expected. Valid iff the stack empties.
\`\`\``;

// ─────────────────────────────────────────────────────────────────────────────
// SEED
// ─────────────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Top = mongoose.connection.collection("protopics");
  const Exr = mongoose.connection.collection("proexercises");

  // Guard: confirm M33 topics exist before appending
  const t1 = await Top.findOne({ topicId: "java_m33_t1" });
  const t2 = await Top.findOne({ topicId: "java_m33_t2" });
  const t3 = await Top.findOne({ topicId: "java_m33_t3" });
  if (!t1 || !t2 || !t3) { console.error("M33 topics missing — aborting."); process.exit(1); }

  // Teaching notes (merge into existing teaching.concept_explanation)
  await Top.updateOne({ topicId: "java_m33_t3" },
    { $set: { "teaching.concept_explanation.queue_rearrangement": QUEUE_CONCEPT } });
  await Top.updateOne({ topicId: "java_m33_t1" },
    { $set: { "teaching.concept_explanation.stack_rearrangement": STACK_CONCEPT } });
  console.log("✓ teaching notes added to T3 (queue) and T1 (stack)");

  const ALL = [...QUEUE, ...STACK_T1, ...STACK_T2];
  let n = 0;
  for (const e of ALL) {
    await Exr.updateOne({ exerciseId: e.exerciseId }, { $set: e }, { upsert: true });
    n++;
  }
  console.log(`✓ ${n} exercises upserted (8 queue → T3, 4 stack → T1, 1 → T2)`);

  const total = await Exr.countDocuments({ moduleId: MODULE_ID });
  console.log(`\n✅ M33 gaps seeded. Module java_m33 now has ${total} exercises.`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
