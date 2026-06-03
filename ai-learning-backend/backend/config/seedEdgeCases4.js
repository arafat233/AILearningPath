/**
 * seedEdgeCases4.js — GAP #6 edge-case catalog, batch 4 (~48).
 * COMPLETES four patterns: strings (13), palindrome (12), pattern-matching (12),
 * trie (11). Data-only. Verify: node config/auditEdgeCases.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const c = (cs, h) => ({ case: cs, handling: h });

const A = {
  // ───────────────────────── strings (13) ─────────────────────────
  java_m31_t1_ex_11: [
    c("Nested brackets", "Use a stack of (prevString, count) so inner expansions nest correctly."),
    c("Multi-digit counts", "Accumulate digits (k = k*10 + d) before the '['."),
    c("No brackets", "Plain string passes through unchanged."),
  ],
  java_m31_t1_ex_12: [
    c("numRows = 1", "No zigzag — return the string as-is."),
    c("String shorter than numRows", "Some rows stay empty; concatenation still works."),
    c("Direction flips", "Reverse at the top and bottom rows only."),
  ],
  java_m31_t1_ex_13: [
    c("All unique chars", "Counts are 1 → omit the count digit."),
    c("Run length ≥ 10", "Write each digit separately (in place)."),
    c("Single char", "Stays a single char, no count."),
    c("In-place write pointer", "Read can run ahead of write; never overwrite unread input."),
  ],
  java_m31_t1_ex_14: [
    c("'.' and '..' segments", "'.' is a no-op; '..' pops the stack (if non-empty)."),
    c("Multiple slashes", "Split collapses empty segments."),
    c("Root path '/'", "Empty stack → return \"/\"."),
    c("Trailing slash", "Don't emit a trailing '/' when joining."),
  ],
  java_m31_t1_ex_15: [
    c("Mutable vs immutable", "Use StringBuilder for repeated edits; String + in a loop is O(n²)."),
    c("Empty string", "Return the identity early."),
    c("ASCII vs Unicode", "int[26] only for lowercase a–z; otherwise use a map."),
  ],
  java_m31_t1_ex_16: [
    c("Empty list", "Encode/decode round-trips to an empty list."),
    c("Strings containing the delimiter", "Length-prefix (len + '#' + str) avoids delimiter collisions."),
    c("Empty strings in the list", "Length 0 is encoded explicitly and restored."),
  ],
  java_m31_t1_ex_3: [
    c("Empty string", "Both approaches return empty; no allocations needed."),
    c("Single concatenation", "Difference is negligible; the gap shows at scale."),
    c("Loop of n appends", "String + is O(n²) (new object each time); StringBuilder is O(n)."),
  ],
  java_m31_t1_ex_4: [
    c("Empty or single char", "Reversal is a no-op."),
    c("Two-pointer swap", "Stop when L ≥ R; the middle char (odd length) stays put."),
    c("Unicode surrogate pairs", "Naive char swap can break surrogate pairs — note the caveat."),
  ],
  java_m31_t1_ex_5: [
    c("Different lengths", "Not anagrams → false immediately."),
    c("Empty strings", "Two empties are anagrams → true."),
    c("Case / non-letters", "Decide the alphabet; int[26] assumes lowercase a–z."),
    c("Unicode", "Fall back to a HashMap when beyond a–z."),
  ],
  java_m31_t1_ex_6: [
    c("Subtractive pairs (IV, IX, ...)", "If a smaller numeral precedes a larger, subtract it."),
    c("Single numeral", "Return its value directly."),
    c("Invalid input", "Assume well-formed per the problem; otherwise validate."),
  ],
  java_m31_t1_ex_7: [
    c("Leading whitespace / sign", "Skip spaces, capture an optional +/−."),
    c("Overflow", "Clamp to Integer.MAX_VALUE / MIN_VALUE."),
    c("Non-digit after digits", "Stop parsing at the first non-digit."),
    c("Empty or no digits", "Return 0."),
  ],
  java_m31_t1_ex_8: [
    c("Empty array", "No common prefix → \"\"."),
    c("One string is empty", "Common prefix is \"\"."),
    c("No shared prefix", "Return \"\" once the first mismatch is found."),
    c("All identical", "Prefix is the whole string."),
  ],
  java_m31_t1_ex_9: [
    c("n = 1", "Base case is \"1\"."),
    c("Long runs", "Counts can exceed 9 — emit multi-digit counts."),
    c("Read-then-describe", "Group consecutive equal digits each iteration."),
  ],

  // ───────────────────────── palindrome (12) ─────────────────────────
  java_m31_t3_ex_11: [
    c("Even vs odd centers", "Manacher transforms with separators so both center types are uniform."),
    c("Single char", "Trivially a palindrome of length 1."),
    c("All same char", "Whole string is the longest palindrome — radius grows to the ends."),
  ],
  java_m31_t3_ex_12: [
    c("Word that is itself a palindrome", "Pairs with the empty string (both orders)."),
    c("Empty string in the list", "Pairs with every palindromic word."),
    c("Duplicate words", "Index pairs (i, j) with i ≠ j; watch self-pairing."),
  ],
  java_m31_t3_ex_13: [
    c("Already a palindrome", "0 insertions."),
    c("Single char / empty", "0 insertions."),
    c("DP relation", "insertions = n − LPS(s); reuse longest palindromic subsequence."),
  ],
  java_m31_t3_ex_14: [
    c("Even length", "Every char count must be even."),
    c("Odd length", "Exactly one char may have an odd count."),
    c("More than one odd count", "Cannot rearrange into a palindrome → false."),
  ],
  java_m31_t3_ex_3: [
    c("Empty string", "Vacuously a palindrome → true."),
    c("Only non-alphanumeric", "All skipped → true."),
    c("Mixed case", "Normalise case before comparing."),
    c("Single char", "True."),
  ],
  java_m31_t3_ex_4: [
    c("Single char", "Longest is length 1."),
    c("All same char", "Whole string is the answer."),
    c("Even and odd centers", "Expand around both i and i,i+1."),
    c("No palindrome > 1", "Return any single char."),
  ],
  java_m31_t3_ex_5: [
    c("Already a palindrome", "No deletion needed → true."),
    c("One mismatch", "Try skipping the left OR the right char, then verify."),
    c("Two+ mismatches", "More than one deletion needed → false."),
  ],
  java_m31_t3_ex_6: [
    c("Single char", "Counts as 1 palindromic substring."),
    c("All same char", "n(n+1)/2 palindromic substrings."),
    c("No repeats", "Exactly n (each single char)."),
    c("Even/odd centers", "Expand around 2n−1 centers."),
  ],
  java_m31_t3_ex_7: [
    c("Single char", "One partition: [c]."),
    c("Whole string is a palindrome", "One valid partition is the string itself."),
    c("No multi-char palindromes", "Falls back to all single chars."),
  ],
  java_m31_t3_ex_8: [
    c("Already a palindrome", "0 cuts."),
    c("All distinct chars", "n−1 cuts."),
    c("DP on cuts", "Precompute isPalindrome[i][j] to make the cut DP O(n²)."),
  ],
  java_m31_t3_ex_9: [
    c("Single char", "LPS length 1."),
    c("Already a palindrome", "LPS equals the whole length."),
    c("No repeated chars", "LPS is 1."),
    c("DP table", "dp[i][j] from matching ends inward."),
  ],
  java_m31_t3_ex_15: [
    c("Expand-around-center vs DP", "Center expansion is O(n²) time/O(1) space; DP is O(n²)/O(n²) but reusable."),
    c("Even and odd centers", "Always handle both i and (i, i+1) centers."),
    c("Subsequence vs substring", "Substring must be contiguous; subsequence (LPS) need not be."),
  ],

  // ───────────────────────── pattern-matching (12) ─────────────────────────
  java_m31_t2_ex_11: [
    c("Different lengths", "Can't be a rotation → false."),
    c("Identical strings", "A string is a rotation of itself → true."),
    c("Search in s+s", "B is a rotation iff it's a substring of A+A (KMP)."),
  ],
  java_m31_t2_ex_12: [
    c("Overlapping matches", "After a hit, j = lps[j−1] to allow overlap."),
    c("Pattern longer than text", "0 occurrences."),
    c("Empty pattern", "Define behaviour (often n+1 or 0) explicitly."),
  ],
  java_m31_t2_ex_13: [
    c("lps[0] always 0", "A single char has no proper prefix-suffix."),
    c("Repeated prefixes", "Fall back to lps[len−1] on mismatch, never below 0."),
    c("All same char", "lps grows 0,1,2,… across the pattern."),
  ],
  java_m31_t2_ex_14: [
    c("Pattern spans rows/cols", "Run KMP per row and/or column as 1-D strings."),
    c("Pattern longer than a line", "No match in that orientation."),
    c("Empty matrix", "Guard before scanning."),
  ],
  java_m31_t2_ex_15: [
    c("KMP vs Rabin–Karp", "KMP: no text backtrack, O(n+m); RK: rolling hash, good for multi-pattern."),
    c("Empty text or pattern", "Return the defined identity."),
    c("Worst-case naive", "Both beat O(nm) on adversarial inputs."),
  ],
  java_m31_t2_ex_3: [
    c("Single-char pattern", "lps is [0]."),
    c("No repeats", "lps stays all zeros."),
    c("Full periodicity", "lps[n−1] reveals the smallest repeating unit."),
  ],
  java_m31_t2_ex_4: [
    c("Pattern not present", "Return −1."),
    c("Match at index 0", "Found immediately."),
    c("Pattern longer than text", "−1 without scanning."),
    c("Empty pattern", "Conventionally matches at 0."),
  ],
  java_m31_t2_ex_5: [
    c("Overlapping occurrences", "Use lps to continue from j = lps[j−1] after each match."),
    c("No occurrence", "Return an empty list."),
    c("Pattern == text", "Single match at index 0."),
  ],
  java_m31_t2_ex_6: [
    c("Single char repeated", "\"aaaa\" tiles \"a\" → true."),
    c("No repeat", "lps-based period check fails → false."),
    c("Period test", "n % (n − lps[n−1]) == 0 (and lps[n−1] > 0)."),
  ],
  java_m31_t2_ex_7: [
    c("Empty needle", "Conventionally return 0."),
    c("Needle longer than haystack", "Return −1."),
    c("No occurrence", "Return −1."),
    c("KMP vs indexOf", "Both correct; KMP guarantees linear worst case."),
  ],
  java_m31_t2_ex_8: [
    c("Already a palindrome", "Prepend nothing."),
    c("Empty string", "Return empty."),
    c("KMP on s + '#' + reverse(s)", "Longest prefix-palindrome = lps of the combined string."),
  ],
  java_m31_t2_ex_9: [
    c("Hash collision", "On a hash match, verify chars to rule out false positives."),
    c("Rolling update", "Remove the leading char and add the trailing char in O(1)."),
    c("Pattern longer than text", "0 matches."),
  ],

  // ───────────────────────── trie (11) ─────────────────────────
  java_m35_t5_ex_1: [
    c("Empty string insert/search", "Mark/check isEnd at the root node."),
    c("Search a prefix that isn't a word", "Path exists but isEnd is false → search returns false."),
    c("Missing path", "Absent child link → not found."),
  ],
  java_m35_t5_ex_2: [
    c("startsWith vs search", "startsWith ignores isEnd; search requires it."),
    c("Inserting a duplicate word", "Idempotent — just re-marks isEnd."),
    c("Word that is a prefix of another", "Both isEnd flags coexist on the shared path."),
  ],
  java_m35_t5_ex_3: [
    c("Prefix with no completions", "Return an empty suggestion list."),
    c("Prefix is itself a word", "Include it if isEnd is set."),
    c("Empty prefix", "Suggest from the root (all words)."),
  ],
  java_m35_t5_ex_4: [
    c("Word with no matching root", "Keep the original word."),
    c("Multiple roots match", "Replace with the SHORTEST root."),
    c("Root equals the word", "Replace with itself (still shortest)."),
  ],
  java_m35_t5_ex_5: [
    c("Repeated letters on the board", "Mark visited cells during DFS; un-mark on backtrack."),
    c("Word not on the board", "DFS exhausts without reaching isEnd."),
    c("Duplicate words found", "Dedup results via a set; prune trie nodes once collected."),
  ],
  java_m35_t5_ex_6: [
    c("'.' wildcard", "Recurse over all children at a '.' position."),
    c("All dots", "Matches any word of that length — explore every branch."),
    c("Word absent", "Return false after exhausting branches."),
  ],
  java_m35_t5_ex_7: [
    c("Tie on length", "Pick the lexicographically smallest."),
    c("Word missing an intermediate prefix", "Only valid if every prefix is itself a word."),
    c("No buildable word", "Return \"\"."),
  ],
  java_m35_t5_ex_8: [
    c("Overwriting a key", "sum reflects the latest value, not the accumulation of old ones."),
    c("Prefix with no keys", "sum returns 0."),
    c("Prefix equals a full key", "Includes that key's value plus deeper ones."),
  ],
  java_m35_t5_ex_9: [
    c("Single number", "Max XOR pair needs ≥ 2 values; one element → 0 (or undefined)."),
    c("All identical", "Every XOR is 0 → max is 0."),
    c("Bitwise trie depth", "Insert 32-bit paths MSB-first; greedily pick the opposite bit."),
  ],
  java_m35_t5_ex_10: [
    c("Shared prefixes", "Nodes are reused — memory ∝ distinct prefixes, not total length."),
    c("Empty trie", "All searches return false."),
    c("isEnd vs path", "A node on a path isn't a word unless isEnd is set."),
  ],
  java_m35_t5_ex_11: [
    c("insert/search/startsWith", "All O(len); independent of the number of stored words."),
    c("Empty string", "Handled at the root via isEnd."),
    c("Memory for sparse alphabets", "Prefer a HashMap of children over a fixed 26-array when sparse."),
  ],
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Exr = mongoose.connection.collection("proexercises");
  let updated = 0, missing = 0;
  for (const [exerciseId, edge_cases] of Object.entries(A)) {
    const r = await Exr.updateOne({ exerciseId }, { $set: { edge_cases } });
    if (r.matchedCount === 0) { console.error(`✗ MISSING: ${exerciseId}`); missing++; } else updated++;
  }
  console.log(`✅ edge-cases-4: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
