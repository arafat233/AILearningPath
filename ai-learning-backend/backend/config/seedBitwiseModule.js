/**
 * seedBitwiseModule.js — Pro Java M47 "Bitwise Operations"
 *
 * Upserts:
 *   - 1 ProModule  (java_m47)
 *   - 5 ProTopics  (java_m47_t1 … java_m47_t5)
 *   - 15 ProExercises (code_scratch, predict_output, fill_blank, pattern_match)
 *
 * Idempotent: safe to re-run.
 * Usage: node config/seedBitwiseModule.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";

const TRACK   = "pro_java";
const MOD_ID  = "java_m47";

// ── helpers ──────────────────────────────────────────────────────────────────

async function upsertModule() {
  return ProModule.findOneAndUpdate(
    { moduleId: MOD_ID },
    {
      trackKey:       TRACK,
      moduleId:       MOD_ID,
      moduleNumber:   47,
      name:           "Bitwise Operations",
      slug:           "bitwise-operations",
      description:    "AND, OR, XOR, shifts, bit-manipulation tricks, and the classic interview problems — single number, missing number, XOR swap, and subset enumeration.",
      estimatedHours: 3,
      prerequisites:  ["java_m1"],
      status:         "live",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

// ── topics ───────────────────────────────────────────────────────────────────

const TOPICS = [
  // ── T1 ──────────────────────────────────────────────────────────────────────
  {
    trackKey:    TRACK,
    moduleId:    MOD_ID,
    topicId:     "java_m47_t1",
    topicNumber: 1,
    name:        "Bitwise Operators & Bit Representation",
    slug:        "bitwise-operators",
    difficulty:  0.2,
    estimatedMinutes: 30,
    xpReward:    50,
    prerequisites: [],
    visualizer:  { kind: "bitwise", config: {} },
    metadata: {
      tags: ["bitwise", "operators", "binary", "representation"],
      estimated_minutes: 30,
      difficulty: 1,
    },
    hook: "Every integer in your program is just 1s and 0s — bitwise operators let you manipulate individual bits directly, unlocking O(1) tricks that no arithmetic formula can match.",
    teaching: {
      blocks: [
        {
          type: "paragraph",
          content: "Java stores integers as 32-bit two's complement numbers. The bitwise operators act on each bit position independently, so a single instruction operates on all 32 bits simultaneously.",
        },
        {
          type: "list",
          content: "AND  (&)  — bit is 1 only if BOTH bits are 1\nOR   (|)  — bit is 1 if EITHER bit is 1\nXOR  (^)  — bit is 1 if the bits DIFFER\nNOT  (~)  — flips every bit (0→1, 1→0)\nLeft shift  (<<)  — shifts bits left, fills right with 0s; equivalent to × 2^n\nRight shift (>>)  — shifts bits right, fills left with sign bit (arithmetic)\nUnsigned right shift (>>>) — shifts bits right, always fills left with 0s",
        },
        {
          type: "paragraph",
          content: "8-bit representation example: the decimal 5 is 0000 0101 and decimal 3 is 0000 0011.\n5 & 3 = 0000 0001 = 1\n5 | 3 = 0000 0111 = 7\n5 ^ 3 = 0000 0110 = 6",
        },
        {
          type: "code",
          content: "int a = 5;   // 0101 in binary\nint b = 3;   // 0011 in binary\n\nSystem.out.println(a & b);  // 0001 = 1\nSystem.out.println(a | b);  // 0111 = 7\nSystem.out.println(a ^ b);  // 0110 = 6\nSystem.out.println(~a);     // ...11111010 = -6 (two's complement)\nSystem.out.println(a << 1); // 1010 = 10  (a × 2)\nSystem.out.println(a >> 1); // 0010 = 2   (a ÷ 2)",
        },
        {
          type: "paragraph",
          content: "Use Integer.toBinaryString(n) to inspect any number's bit pattern during debugging.",
        },
      ],
    },
    commonGaps: {
      items: [
        "Confusing & (bitwise AND) with && (logical AND) — they behave differently on non-boolean values.",
        "Forgetting that >> is arithmetic (sign-extends) while >>> is logical (zero-fills) — matters for negative numbers.",
        "Assuming left-shift always equals multiplication by 2 — overflows silently for large values.",
      ],
    },
    interviewRelevance: "Bitwise operators appear in almost every bit-manipulation interview question. Recognising 'and with a mask' vs 'xor to toggle' vs 'shift to scale' is the foundational vocabulary.",
    industryApplications: {
      examples: [
        "Networking: subnet masks are bitwise AND between an IP and a mask.",
        "Graphics: ARGB colour values packed into a single int; channels extracted via masks and shifts.",
        "Permissions / flags: Linux file permissions (rwx) stored as a 9-bit integer.",
      ],
    },
  },

  // ── T2 ──────────────────────────────────────────────────────────────────────
  {
    trackKey:    TRACK,
    moduleId:    MOD_ID,
    topicId:     "java_m47_t2",
    topicNumber: 2,
    name:        "Bit Manipulation Tricks",
    slug:        "bit-manipulation-tricks",
    difficulty:  0.35,
    estimatedMinutes: 35,
    xpReward:    50,
    prerequisites: ["java_m47_t1"],
    visualizer:  null,
    metadata: {
      tags: ["bit-manipulation", "masks", "get-bit", "set-bit", "clear-bit"],
      estimated_minutes: 35,
      difficulty: 2,
    },
    hook: "Four one-liners — get, set, clear, toggle — let you treat any integer as a compact boolean array. Mastering these unlocks every interview bit problem.",
    teaching: {
      blocks: [
        {
          type: "paragraph",
          content: "A bitmask is a value used with a bitwise operator to isolate, set, or clear a specific bit. The canonical masks are built with a left-shift: `1 << i` creates a mask with only bit i set.",
        },
        {
          type: "code",
          content: "// Get bit i  — is bit i set?\nboolean getBit(int n, int i) {\n    return (n & (1 << i)) != 0;\n}\n\n// Set bit i  — force bit i to 1\nint setBit(int n, int i) {\n    return n | (1 << i);\n}\n\n// Clear bit i  — force bit i to 0\nint clearBit(int n, int i) {\n    return n & ~(1 << i);\n}\n\n// Toggle bit i  — flip bit i\nint toggleBit(int n, int i) {\n    return n ^ (1 << i);\n}",
        },
        {
          type: "paragraph",
          content: "Two especially useful tricks that interviewers test directly:",
        },
        {
          type: "list",
          content: "n & (n - 1) — clears the lowest set bit of n. If the result is 0, n was a power of 2.\nn & (-n) — isolates the lowest set bit of n (all other bits become 0). Useful for Binary Indexed Tree (Fenwick Tree) operations.",
        },
        {
          type: "code",
          content: "// n & (n-1): clear lowest set bit\n// 12 = 1100, 12-1 = 1011, 12 & 11 = 1000 = 8\nSystem.out.println(12 & (12 - 1));  // 8\n\n// n & (-n): isolate lowest set bit\n// 12 = 1100, -12 in two's complement = 0100, 12 & -12 = 0100 = 4\nSystem.out.println(12 & -12);  // 4",
        },
      ],
    },
    commonGaps: {
      items: [
        "Using `i` instead of `1 << i` as the mask — this tests the i-th value, not the i-th bit.",
        "Forgetting that clearBit needs NOT (~) before AND — a common mistake is writing n & (1 << i) which sets the bit, not clears it.",
        "Not knowing `n & (n-1)` — this appears in at least 5 common interview questions.",
      ],
    },
    interviewRelevance: "Get/set/clear/toggle appear verbatim in system-design interviews (permissions, feature flags). `n & (n-1)` and `n & -n` appear in problems about powers of two, counting bits, and tree indices.",
    industryApplications: {
      examples: [
        "Feature flags: a single integer stores 32 on/off toggles; individual flags read/written with getBit/setBit.",
        "Fenwick Tree (Binary Indexed Tree): uses n & -n to find the responsible range in O(log n) prefix-sum updates.",
      ],
    },
  },

  // ── T3 ──────────────────────────────────────────────────────────────────────
  {
    trackKey:    TRACK,
    moduleId:    MOD_ID,
    topicId:     "java_m47_t3",
    topicNumber: 3,
    name:        "Power of 2 & Bit Counting",
    slug:        "power-of-2-bit-counting",
    difficulty:  0.35,
    estimatedMinutes: 30,
    xpReward:    50,
    prerequisites: ["java_m47_t2"],
    visualizer:  null,
    metadata: {
      tags: ["power-of-two", "popcount", "Brian-Kernighan", "set-bits"],
      estimated_minutes: 30,
      difficulty: 2,
    },
    hook: "Checking powers of two and counting set bits are the two most common 'warm-up' bit problems in technical screens — know them cold.",
    teaching: {
      blocks: [
        {
          type: "paragraph",
          content: "A power of 2 has exactly one bit set. Subtracting 1 flips that bit and all lower bits. So `n & (n-1)` is 0 if and only if n is a power of 2 (n > 0).",
        },
        {
          type: "code",
          content: "boolean isPowerOfTwo(int n) {\n    return n > 0 && (n & (n - 1)) == 0;\n}\n\n// Examples\nSystem.out.println(isPowerOfTwo(8));   // true  (1000)\nSystem.out.println(isPowerOfTwo(6));   // false (0110)",
        },
        {
          type: "paragraph",
          content: "Counting set bits naively loops 32 times. Brian Kernighan's algorithm loops exactly as many times as there are set bits — O(number of set bits), typically much faster.",
        },
        {
          type: "code",
          content: "int countSetBits(int n) {\n    int count = 0;\n    while (n != 0) {\n        n = n & (n - 1);  // strip lowest set bit\n        count++;\n    }\n    return count;\n}\n\n// 13 = 1101 has 3 set bits\nSystem.out.println(countSetBits(13));  // 3",
        },
        {
          type: "paragraph",
          content: "Java's standard library provides Integer.bitCount(n) which uses a SWAR (SIMD Within A Register) trick and is faster than Brian Kernighan for large inputs — use it in production. Implement Kernighan to demonstrate you understand the algorithm.",
        },
      ],
    },
    commonGaps: {
      items: [
        "Missing the `n > 0` guard in isPowerOfTwo — the formula returns true for n = 0, which is not a power of two.",
        "Using a 32-iteration loop instead of Kernighan — shows you don't know the O(set bits) optimisation.",
        "Forgetting Integer.bitCount() exists in Java — interviewers may ask 'what's the built-in?'",
      ],
    },
    interviewRelevance: "isPowerOfTwo and countSetBits appear as both standalone questions and sub-problems in harder problems (e.g., 'sum of all XOR subsets' requires popcount awareness).",
    industryApplications: {
      examples: [
        "Memory allocators: allocating blocks in powers of 2 and checking alignment with bitwise AND.",
        "Hamming distance: counting differing bits between two values is used in error detection codes and nearest-neighbour search.",
      ],
    },
  },

  // ── T4 ──────────────────────────────────────────────────────────────────────
  {
    trackKey:    TRACK,
    moduleId:    MOD_ID,
    topicId:     "java_m47_t4",
    topicNumber: 4,
    name:        "Interview Problems: Single Number & Missing Number",
    slug:        "single-number-missing-number",
    difficulty:  0.45,
    estimatedMinutes: 35,
    xpReward:    50,
    prerequisites: ["java_m47_t3"],
    visualizer:  null,
    metadata: {
      tags: ["XOR", "single-number", "missing-number", "interview"],
      estimated_minutes: 35,
      difficulty: 3,
    },
    hook: "XOR is the Swiss Army knife of interview problems — two canonical problems that appear in every company's question bank require nothing else.",
    teaching: {
      blocks: [
        {
          type: "paragraph",
          content: "XOR has three properties that make it uniquely powerful for these problems:\n1. a ^ a = 0  (any value XORed with itself is 0)\n2. a ^ 0 = a  (any value XORed with 0 is itself)\n3. XOR is commutative and associative, so order does not matter.",
        },
        {
          type: "paragraph",
          content: "Problem 1 — Single Number: given an array where every element appears exactly twice except one, find the lone element. XOR all values; paired values cancel to 0, leaving only the single number.",
        },
        {
          type: "code",
          content: "int singleNumber(int[] arr) {\n    int result = 0;\n    for (int x : arr) {\n        result ^= x;\n    }\n    return result;\n}\n\n// [2, 3, 2, 4, 4]  →  3\nSystem.out.println(singleNumber(new int[]{2, 3, 2, 4, 4}));  // 3",
        },
        {
          type: "paragraph",
          content: "Problem 2 — Missing Number: given an array of n distinct integers from 0 to n with one missing, find the missing value. XOR all array values with all indices 0..n; everything pairs except the missing number.",
        },
        {
          type: "code",
          content: "int missingNumber(int[] arr) {\n    int n = arr.length;\n    int result = n;          // start with n itself\n    for (int i = 0; i < n; i++) {\n        result ^= i ^ arr[i];  // XOR index and value together\n    }\n    return result;\n}\n\n// [3, 0, 1]  →  2 is missing\nSystem.out.println(missingNumber(new int[]{3, 0, 1}));  // 2",
        },
      ],
    },
    commonGaps: {
      items: [
        "Reaching for a HashSet or sorting first — these use O(n) space or O(n log n) time; XOR is O(n) time and O(1) space.",
        "Forgetting to initialise result to n in missingNumber — the last index (n) has no corresponding array position.",
        "Not being able to explain WHY XOR works — memorising the code without internalising the cancellation property fails the 'explain your reasoning' follow-up.",
      ],
    },
    interviewRelevance: "LeetCode 136 (Single Number) and LeetCode 268 (Missing Number) are 'easy' tags but asked in Amazon, Google, and Microsoft screens as warm-up problems. The interviewer expects O(1) space.",
    industryApplications: {
      examples: [
        "Checksums: XOR-based parity bits detect single-bit errors in RAID-5 and network protocols.",
        "Cryptography: one-time-pad XOR encryption is information-theoretically secure when the key is truly random.",
      ],
    },
  },

  // ── T5 ──────────────────────────────────────────────────────────────────────
  {
    trackKey:    TRACK,
    moduleId:    MOD_ID,
    topicId:     "java_m47_t5",
    topicNumber: 5,
    name:        "Bitwise in Practice: Swap, Masks, Flags",
    slug:        "bitwise-practice",
    difficulty:  0.5,
    estimatedMinutes: 35,
    xpReward:    50,
    prerequisites: ["java_m47_t4"],
    visualizer:  null,
    metadata: {
      tags: ["XOR-swap", "bitmask", "subsets", "flags", "enumeration"],
      estimated_minutes: 35,
      difficulty: 3,
    },
    hook: "Bitmask subset enumeration is the secret weapon behind exponential-space problems solved in linear memory — and XOR swap is the classic trivia that every interviewer expects you to know.",
    teaching: {
      blocks: [
        {
          type: "paragraph",
          content: "XOR Swap: swap two integers without a temporary variable using three XOR operations. Works because XOR is its own inverse.",
        },
        {
          type: "code",
          content: "void xorSwap(int[] arr, int i, int j) {\n    if (i != j) {          // IMPORTANT: skip if same index\n        arr[i] ^= arr[j];  // step 1\n        arr[j] ^= arr[i];  // step 2\n        arr[i] ^= arr[j];  // step 3\n    }\n}\n\n// Manual trace: a=5 (0101), b=3 (0011)\n// step1: a = 0101 ^ 0011 = 0110  (6)\n// step2: b = 0011 ^ 0110 = 0101  (5)\n// step3: a = 0110 ^ 0101 = 0011  (3)\n// result: a=3, b=5  ✓",
        },
        {
          type: "paragraph",
          content: "Bitmask for subset enumeration: for a set of n elements, there are 2^n subsets. Each integer from 0 to (1<<n)-1 encodes exactly one subset — bit i being 1 means element i is included.",
        },
        {
          type: "code",
          content: "// Print all subsets of [a, b, c]\nString[] items = {\"a\", \"b\", \"c\"};\nint n = items.length;\n\nfor (int mask = 0; mask < (1 << n); mask++) {\n    System.out.print(\"{ \");\n    for (int i = 0; i < n; i++) {\n        if ((mask & (1 << i)) != 0) {\n            System.out.print(items[i] + \" \");\n        }\n    }\n    System.out.println(\"}\");\n}\n// Output: {} {a} {b} {a b} {c} {a c} {b c} {a b c}",
        },
        {
          type: "paragraph",
          content: "Bitmask flags: store multiple boolean settings in a single integer. Each flag is a constant defined as a power of 2.",
        },
        {
          type: "code",
          content: "static final int READ    = 1;   // 001\nstatic final int WRITE   = 2;   // 010\nstatic final int EXECUTE = 4;   // 100\n\nint permissions = READ | WRITE;           // 011 = 3\n\nboolean canRead    = (permissions & READ)    != 0;  // true\nboolean canExecute = (permissions & EXECUTE) != 0;  // false\n\n// Grant execute\npermissions |= EXECUTE;   // 111 = 7\n\n// Revoke write\npermissions &= ~WRITE;    // 101 = 5",
        },
      ],
    },
    commonGaps: {
      items: [
        "XOR swap breaks when i == j — the value becomes 0 at step 1; always guard with if (i != j).",
        "Off-by-one in subset enumeration: loop should be mask < (1 << n), not mask <= (1 << n) — the upper bound is exclusive.",
        "Defining flags as 1,2,3,4 instead of 1,2,4,8 — flags must be powers of 2 or they overlap.",
      ],
    },
    interviewRelevance: "Subset enumeration with bitmasks is required for O(2^n) brute-force solutions in DP problems like 'Minimum Cost to Connect All Points' and 'Shortest Superstring'. XOR swap is a classic trivia question.",
    industryApplications: {
      examples: [
        "Permission systems: Unix chmod uses 3 bits per actor (rwx); Java NIO PosixFilePermission uses an EnumSet backed by bitmasks.",
        "TSP / Hamiltonian path: bitmask DP over subsets is the standard O(n² × 2^n) solution for small n.",
      ],
    },
  },
];

// ── exercises ────────────────────────────────────────────────────────────────

const EXERCISES = [

  // ══════════════════════════════════════════════════════════════════════════
  // T1 — Bitwise Operators & Bit Representation
  // ══════════════════════════════════════════════════════════════════════════

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t1",
    exerciseId:   "java_m47_t1_ex_1",
    position:     1,
    level:        "warmup",
    type:         "predict_output",
    title:        "Predict: AND, OR, XOR with 5 and 3",
    scenario:     "What does Java print for the following three statements? Work through the 8-bit representation of 5 (0000 0101) and 3 (0000 0011) to find each answer.",
    instructions: "Write the three outputs, one per line, in the order AND → OR → XOR.",
    starterCode:  "int a = 5, b = 3;\nSystem.out.println(a & b);\nSystem.out.println(a | b);\nSystem.out.println(a ^ b);",
    expectedSolution: "1\n7\n6",
    hints:        ["AND keeps a bit only when BOTH inputs have a 1.", "OR keeps a bit when AT LEAST ONE input has a 1.", "XOR keeps a bit only when the two inputs DIFFER."],
    blanks:       [],
    testCases:    [
      { type: "expected_stdout", stdin: "", expected_stdout: "1\n7\n6" },
    ],
    xpReward:   5,
    difficulty: 0.1,
  },

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t1",
    exerciseId:   "java_m47_t1_ex_2",
    position:     2,
    level:        "warmup",
    type:         "fill_blank",
    title:        "Fill the blank: bitwise AND",
    scenario:     "Complete the expression so that `result` holds the bitwise AND of `a` and `b`.",
    instructions: "Replace the blank with the correct operator.",
    starterCode:  "int a = 12, b = 10;\nint result = a ___ b;\nSystem.out.println(result);",
    expectedSolution: "&",
    hints:        ["There is a single-character bitwise AND operator in Java."],
    blanks:       [{ answer: "&", placeholder: "___" }],
    testCases:    [
      { type: "expected_stdout", stdin: "", expected_stdout: "8" },
    ],
    xpReward:   5,
    difficulty: 0.1,
  },

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t1",
    exerciseId:   "java_m47_t1_ex_3",
    position:     3,
    level:        "easy",
    type:         "predict_output",
    title:        "Predict: left shift and right shift",
    scenario:     "What does Java print for the following two statements? Use binary reasoning.",
    instructions: "Write the two outputs separated by a newline.",
    starterCode:  "int x = 7;\nSystem.out.println(x << 2);\nSystem.out.println(x >> 1);",
    expectedSolution: "28\n3",
    hints:        ["Left shift by 2 is equivalent to multiplying by 4.", "Right shift by 1 is integer division by 2."],
    blanks:       [],
    testCases:    [
      { type: "expected_stdout", stdin: "", expected_stdout: "28\n3" },
    ],
    xpReward:   10,
    difficulty: 0.2,
  },

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t1",
    exerciseId:   "java_m47_t1_pm_1",
    position:     4,
    level:        "easy",
    type:         "pattern_match",
    title:        "Pattern: single non-duplicate in O(n) time, O(1) space",
    scenario:     "Every element in an array appears exactly twice except one. You must find that element in O(n) time and O(1) extra space. A hash map would work but needs O(n) space. Which technique does better?",
    instructions: "Select the pattern that solves this in O(n) / O(1).",
    starterCode:  "",
    expectedSolution: "bit_manipulation",
    hints:        ["XOR of a number with itself is 0. XOR of a number with 0 is itself. XOR all elements together."],
    blanks:       [{ options: ["bit_manipulation", "hash_map", "sorting", "dynamic_programming"] }],
    testCases:    [{ type: "pattern_match", correct: "bit_manipulation", explanation: "XOR all elements: duplicates cancel (a^a=0), leaving the single element. O(n) time, O(1) space — the canonical bit manipulation trick." }],
    xpReward:   10,
    difficulty: 0.2,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // T2 — Bit Manipulation Tricks
  // ══════════════════════════════════════════════════════════════════════════

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t2",
    exerciseId:   "java_m47_t2_ex_1",
    position:     1,
    level:        "easy",
    type:         "code_scratch",
    title:        "Implement getBit(n, i)",
    scenario:     "Write a method that returns true if the i-th bit (0-indexed from the right) of integer n is set, false otherwise.",
    instructions: "Read n and i from two separate lines of stdin. Print 'true' or 'false'.",
    starterCode:  "import java.util.Scanner;\npublic class Main {\n    static boolean getBit(int n, int i) {\n        // TODO\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int i = sc.nextInt();\n        System.out.println(getBit(n, i));\n    }\n}",
    expectedSolution: "static boolean getBit(int n, int i) {\n    return (n & (1 << i)) != 0;\n}",
    hints:        ["Build a mask with only bit i set: (1 << i).", "AND n with the mask; if the result is non-zero, the bit was set."],
    blanks:       [],
    testCases:    [
      { type: "expected_stdout", stdin: "5\n0", expected_stdout: "true" },
      { type: "expected_stdout", stdin: "5\n1", expected_stdout: "false" },
      { type: "expected_stdout", stdin: "12\n3", expected_stdout: "true" },
      { type: "expected_stdout", stdin: "12\n0", expected_stdout: "false" },
    ],
    xpReward:   10,
    difficulty: 0.2,
  },

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t2",
    exerciseId:   "java_m47_t2_ex_2",
    position:     2,
    level:        "easy",
    type:         "code_scratch",
    title:        "Implement setBit(n, i)",
    scenario:     "Write a method that returns n with its i-th bit (0-indexed from the right) forced to 1.",
    instructions: "Read n and i from two separate lines of stdin. Print the resulting integer.",
    starterCode:  "import java.util.Scanner;\npublic class Main {\n    static int setBit(int n, int i) {\n        // TODO\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int i = sc.nextInt();\n        System.out.println(setBit(n, i));\n    }\n}",
    expectedSolution: "static int setBit(int n, int i) {\n    return n | (1 << i);\n}",
    hints:        ["OR with a mask that has only bit i set.", "Use (1 << i) to create the mask."],
    blanks:       [],
    testCases:    [
      { type: "expected_stdout", stdin: "5\n1", expected_stdout: "7" },
      { type: "expected_stdout", stdin: "8\n0", expected_stdout: "9" },
      { type: "expected_stdout", stdin: "0\n3", expected_stdout: "8" },
    ],
    xpReward:   10,
    difficulty: 0.2,
  },

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t2",
    exerciseId:   "java_m47_t2_ex_3",
    position:     3,
    level:        "medium",
    type:         "fill_blank",
    title:        "Fill the blank: n & (n-1) trick",
    scenario:     "Complete the expression that clears the lowest set bit of n.",
    instructions: "Replace the blank so the expression evaluates to n with its lowest set bit cleared.",
    starterCode:  "int n = 12;\nint result = n ___ (n - 1);\nSystem.out.println(result);  // expected: 8",
    expectedSolution: "&",
    hints:        ["n-1 flips all bits from the lowest set bit downward; AND with n cancels them."],
    blanks:       [{ answer: "&", placeholder: "___" }],
    testCases:    [
      { type: "expected_stdout", stdin: "", expected_stdout: "8" },
    ],
    xpReward:   15,
    difficulty: 0.4,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // T3 — Power of 2 & Bit Counting
  // ══════════════════════════════════════════════════════════════════════════

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t3",
    exerciseId:   "java_m47_t3_ex_1",
    position:     1,
    level:        "easy",
    type:         "code_scratch",
    title:        "isPowerOfTwo(n)",
    scenario:     "Write a method that returns true if n is a positive power of 2, false otherwise. Use the bitwise trick — no loops allowed.",
    instructions: "Read n from stdin. Print 'true' or 'false'.",
    starterCode:  "import java.util.Scanner;\npublic class Main {\n    static boolean isPowerOfTwo(int n) {\n        // TODO: one line, no loops\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(isPowerOfTwo(n));\n    }\n}",
    expectedSolution: "static boolean isPowerOfTwo(int n) {\n    return n > 0 && (n & (n - 1)) == 0;\n}",
    hints:        ["A power of 2 has exactly one bit set.", "n & (n-1) clears the lowest set bit — what is the result for a power of 2?", "Guard against n = 0."],
    blanks:       [],
    testCases:    [
      { type: "expected_stdout", stdin: "8",  expected_stdout: "true" },
      { type: "expected_stdout", stdin: "1",  expected_stdout: "true" },
      { type: "expected_stdout", stdin: "6",  expected_stdout: "false" },
      { type: "expected_stdout", stdin: "0",  expected_stdout: "false" },
      { type: "expected_stdout", stdin: "16", expected_stdout: "true" },
    ],
    xpReward:   10,
    difficulty: 0.2,
  },

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t3",
    exerciseId:   "java_m47_t3_ex_2",
    position:     2,
    level:        "medium",
    type:         "code_scratch",
    title:        "countSetBits(n) — Brian Kernighan",
    scenario:     "Count the number of 1-bits in n using Brian Kernighan's algorithm (repeatedly clear the lowest set bit). Do not use Integer.bitCount().",
    instructions: "Read n from stdin. Print the number of set bits.",
    starterCode:  "import java.util.Scanner;\npublic class Main {\n    static int countSetBits(int n) {\n        // TODO\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(countSetBits(n));\n    }\n}",
    expectedSolution: "static int countSetBits(int n) {\n    int count = 0;\n    while (n != 0) {\n        n = n & (n - 1);\n        count++;\n    }\n    return count;\n}",
    hints:        ["Each iteration of n = n & (n-1) removes exactly one set bit.", "Count how many iterations you need before n becomes 0."],
    blanks:       [],
    testCases:    [
      { type: "expected_stdout", stdin: "13", expected_stdout: "3" },
      { type: "expected_stdout", stdin: "0",  expected_stdout: "0" },
      { type: "expected_stdout", stdin: "15", expected_stdout: "4" },
      { type: "expected_stdout", stdin: "1",  expected_stdout: "1" },
    ],
    xpReward:   15,
    difficulty: 0.4,
  },

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t3",
    exerciseId:   "java_m47_t3_pm_1",
    position:     3,
    level:        "easy",
    type:         "pattern_match",
    title:        "Pattern: check power of 2 in O(1)",
    scenario:     "You need to check if n is a power of 2 in O(1) time with no loops or division. Which technique applies?",
    instructions: "Select the pattern that enables an O(1) solution.",
    starterCode:  "",
    expectedSolution: "bit_manipulation",
    hints:        ["Powers of 2 have exactly one bit set. There is a one-liner using & that checks this."],
    blanks:       [{ options: ["bit_manipulation", "binary_search", "hash_map", "greedy"] }],
    testCases:    [{ type: "pattern_match", correct: "bit_manipulation", explanation: "n > 0 && (n & (n-1)) == 0 exploits the bit structure of powers of 2 — no loops, no division, O(1). Classic bit manipulation." }],
    xpReward:   10,
    difficulty: 0.2,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // T4 — Single Number & Missing Number
  // ══════════════════════════════════════════════════════════════════════════

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t4",
    exerciseId:   "java_m47_t4_ex_1",
    position:     1,
    level:        "medium",
    type:         "code_scratch",
    title:        "Single Number (XOR)",
    scenario:     "Every element in the array appears exactly twice except one. Find and return the element that appears only once. O(n) time, O(1) space required.",
    instructions: "Read n (array length) on the first line, then n space-separated integers on the second line. Print the single number.",
    starterCode:  "import java.util.Scanner;\npublic class Main {\n    static int singleNumber(int[] arr) {\n        // TODO\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        System.out.println(singleNumber(arr));\n    }\n}",
    expectedSolution: "static int singleNumber(int[] arr) {\n    int result = 0;\n    for (int x : arr) result ^= x;\n    return result;\n}",
    hints:        ["a ^ a = 0 for any a.", "XOR all values; duplicates cancel to 0 leaving only the unique element."],
    blanks:       [],
    testCases:    [
      { type: "expected_stdout", stdin: "5\n2 3 2 4 4",    expected_stdout: "3" },
      { type: "expected_stdout", stdin: "1\n7",            expected_stdout: "7" },
      { type: "expected_stdout", stdin: "7\n1 1 2 3 3 4 2", expected_stdout: "4" },
    ],
    xpReward:   15,
    difficulty: 0.4,
  },

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t4",
    exerciseId:   "java_m47_t4_ex_2",
    position:     2,
    level:        "medium",
    type:         "code_scratch",
    title:        "Missing Number (XOR)",
    scenario:     "Given an array of n distinct integers in the range [0, n] with exactly one number missing, find the missing number. O(n) time, O(1) space.",
    instructions: "Read n on the first line, then n space-separated integers on the second line. Print the missing number.",
    starterCode:  "import java.util.Scanner;\npublic class Main {\n    static int missingNumber(int[] arr) {\n        // TODO\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        System.out.println(missingNumber(arr));\n    }\n}",
    expectedSolution: "static int missingNumber(int[] arr) {\n    int n = arr.length;\n    int result = n;\n    for (int i = 0; i < n; i++) result ^= i ^ arr[i];\n    return result;\n}",
    hints:        ["XOR all indices 0..n with all array values; every present number cancels.", "Initialise result to n so that n itself is included in the XOR."],
    blanks:       [],
    testCases:    [
      { type: "expected_stdout", stdin: "3\n3 0 1",   expected_stdout: "2" },
      { type: "expected_stdout", stdin: "1\n0",       expected_stdout: "1" },
      { type: "expected_stdout", stdin: "4\n0 1 3 4", expected_stdout: "2" },
    ],
    xpReward:   15,
    difficulty: 0.4,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // T5 — Bitwise in Practice: Swap, Masks, Flags
  // ══════════════════════════════════════════════════════════════════════════

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t5",
    exerciseId:   "java_m47_t5_ex_1",
    position:     1,
    level:        "medium",
    type:         "code_scratch",
    title:        "XOR Swap Without Temp",
    scenario:     "Swap two integers in an array at indices i and j using only XOR — no temporary variable allowed.",
    instructions: "Read two integers a and b on the first line. Print them swapped on one line separated by a space.",
    starterCode:  "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        // TODO: swap a and b using XOR, no temp variable\n        System.out.println(a + \" \" + b);\n    }\n}",
    expectedSolution: "if (a != b) {\n    a ^= b;\n    b ^= a;\n    a ^= b;\n}",
    hints:        ["Three XOR assignments; the order matters.", "Guard against a == b — XOR of a value with itself is 0, which would zero out both variables."],
    blanks:       [],
    testCases:    [
      { type: "expected_stdout", stdin: "5 3",   expected_stdout: "3 5" },
      { type: "expected_stdout", stdin: "10 20", expected_stdout: "20 10" },
      { type: "expected_stdout", stdin: "7 7",   expected_stdout: "7 7" },
    ],
    xpReward:   15,
    difficulty: 0.4,
  },

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t5",
    exerciseId:   "java_m47_t5_ex_2",
    position:     2,
    level:        "hard",
    type:         "code_scratch",
    title:        "Count subsets with XOR equal to target",
    scenario:     "Given an array of n non-negative integers and a target value k, count all subsets whose XOR equals k. Use bitmask enumeration over all 2^n subsets.",
    instructions: "Read n on the first line, n space-separated integers on the second line, and k on the third line. Print the count of subsets.",
    starterCode:  "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // TODO: enumerate all 2^n subsets using bitmask\n        int count = 0;\n        System.out.println(count);\n    }\n}",
    expectedSolution: "for (int mask = 0; mask < (1 << n); mask++) {\n    int xorVal = 0;\n    for (int i = 0; i < n; i++) {\n        if ((mask & (1 << i)) != 0) xorVal ^= arr[i];\n    }\n    if (xorVal == k) count++;\n}",
    hints:        ["Each mask from 0 to (1<<n)-1 represents one subset.", "Bit i in the mask indicates whether arr[i] is included.", "XOR the included elements and compare to k."],
    blanks:       [],
    testCases:    [
      { type: "expected_stdout", stdin: "3\n1 2 3\n2", expected_stdout: "2" },
      { type: "expected_stdout", stdin: "2\n1 1\n0",   expected_stdout: "2" },
      { type: "expected_stdout", stdin: "3\n5 5 5\n5", expected_stdout: "4" },
    ],
    xpReward:   20,
    difficulty: 0.6,
  },

  {
    trackKey:     TRACK,
    moduleId:     MOD_ID,
    topicId:      "java_m47_t5",
    exerciseId:   "java_m47_t5_pm_1",
    position:     3,
    level:        "medium",
    type:         "pattern_match",
    title:        "Pattern: enumerate all subsets",
    scenario:     "You need to check all possible combinations of n items (n ≤ 20) without recursion. Which technique iterates over all 2^n subsets in O(2^n) time with O(1) extra space?",
    instructions: "Select the technique.",
    starterCode:  "",
    expectedSolution: "bit_manipulation",
    hints:        ["Each integer from 0 to 2^n - 1 encodes exactly one subset — check each bit position."],
    blanks:       [{ options: ["bit_manipulation", "backtracking", "dynamic_programming", "dfs"] }],
    testCases:    [{ type: "pattern_match", correct: "bit_manipulation", explanation: "Iterating mask 0..(1<<n)-1 and reading each bit as include/exclude enumerates all 2^n subsets with no call stack — O(2^n) time, O(1) extra space. This is bit manipulation, not backtracking." }],
    xpReward:   15,
    difficulty: 0.4,
  },
];

// ── main ─────────────────────────────────────────────────────────────────────

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB. Seeding M47 Bitwise Operations…\n");

  let modulesUpserted   = 0;
  let topicsUpserted    = 0;
  let exercisesUpserted = 0;

  // 1. Module
  await upsertModule();
  modulesUpserted++;
  console.log(`✓ ProModule:  ${MOD_ID}`);

  // 2. Topics
  for (const topic of TOPICS) {
    await ProTopic.findOneAndUpdate(
      { topicId: topic.topicId },
      { $set: topic },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    topicsUpserted++;
    console.log(`  ✓ ProTopic: ${topic.topicId}  "${topic.name}"`);
  }

  // 3. Exercises
  for (const ex of EXERCISES) {
    await ProExercise.findOneAndUpdate(
      { exerciseId: ex.exerciseId },
      { $set: ex },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    exercisesUpserted++;
    console.log(`  ✓ ProExercise: ${ex.exerciseId}  [${ex.type}/${ex.level}]`);
  }

  console.log(`\nDone — ${modulesUpserted} module, ${topicsUpserted} topics, ${exercisesUpserted} exercises upserted.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
