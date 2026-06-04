/**
 * seedEdgeCases7.js — GAP #6 edge-case catalog, batch 7 (~46).
 * COMPLETES dynamic-programming (30) + backtracking (16). Data-only.
 * Verify: node config/auditEdgeCases.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const c = (cs, h) => ({ case: cs, handling: h });

const A = {
  // ───────────────────────── dynamic-programming (30) ─────────────────────────
  java_m31_t5_ex_11: [
    c("Empty pattern", "Matches only an empty string."),
    c("'*' matches empty", "A star can consume zero characters."),
    c("Consecutive stars", "Collapse them; behaviour is the same as one."),
    c("'?' on empty string", "Needs a char to match — fails at the end."),
  ],
  java_m31_t5_ex_12: [
    c("One string empty", "Delete all of the other (sum its ASCII)."),
    c("Identical strings", "Delete nothing → 0."),
    c("No common chars", "Delete everything from both."),
  ],
  java_m31_t5_ex_13: [
    c("Length mismatch", "If len(s1)+len(s2) ≠ len(s3) → false fast."),
    c("Empty s1 or s2", "s3 must equal the other string."),
    c("Both empty", "s3 must be empty → true."),
  ],
  java_m31_t5_ex_14: [
    c("One string empty", "Edits = length of the other."),
    c("Identical strings", "0 edits."),
    c("Rolling rows", "Keep only prev/curr rows → O(min(m,n)) space."),
  ],
  java_m31_t5_ex_15: [
    c("Empty inputs", "Base row/column of the DP table is all zeros."),
    c("Match vs mismatch", "Match → diagonal; mismatch → neighbours."),
    c("Reusability", "LCS/edit-distance/interleaving share one 2-D skeleton."),
  ],
  java_m31_t5_ex_3: [
    c("One string empty", "LCS length 0."),
    c("Identical strings", "LCS equals the full length."),
    c("No common chars", "LCS 0."),
  ],
  java_m31_t5_ex_4: [
    c("One string empty", "Edits = length of the other (all inserts/deletes)."),
    c("Identical strings", "0 edits."),
    c("Single-char difference", "One replace."),
  ],
  java_m31_t5_ex_5: [
    c("No common substring", "Length 0."),
    c("Substring vs subsequence", "Reset dp[i][j] to 0 on a mismatch (must be contiguous)."),
    c("Identical strings", "Whole length."),
  ],
  java_m31_t5_ex_6: [
    c("Single char", "LPS length 1."),
    c("Already a palindrome", "LPS equals the length."),
    c("No repeats", "LPS 1."),
  ],
  java_m31_t5_ex_7: [
    c("Already a palindrome", "0 insertions."),
    c("Empty/single char", "0 insertions."),
    c("Relation to LPS", "insertions = n − LPS(s)."),
  ],
  java_m31_t5_ex_8: [
    c("Target longer than source", "0 distinct subsequences."),
    c("Empty target", "Exactly 1 (the empty subsequence)."),
    c("Overflow", "Counts can be huge — use long or modulo."),
  ],
  java_m31_t5_ex_9: [
    c("One string empty", "SCS is the other string."),
    c("Identical strings", "SCS equals either string."),
    c("Relation to LCS", "len(SCS) = m + n − LCS."),
  ],
  java_m41_t1_ex_2: [
    c("n = 0 or 1", "Base cases return n directly."),
    c("Large n overflow", "Fibonacci grows fast — use long/BigInteger or modulo."),
    c("O(1) space", "Keep only the last two values."),
  ],
  java_m41_t1_ex_3: [
    c("n = 0 or 1", "1 way."),
    c("Overflow", "Ways grow like Fibonacci — mind the type."),
    c("Rolling state", "Only prev two counts are needed."),
  ],
  java_m41_t1_ex_4: [
    c("Two steps", "Start free from step 0 or 1."),
    c("Single step", "Cost is 0 (start past it)."),
    c("Answer", "min(dp[n−1], dp[n−2])."),
  ],
  java_m41_t2_ex_1: [
    c("Empty array", "0."),
    c("Single house", "Rob it."),
    c("Two houses", "Max of the two (can't rob adjacent)."),
  ],
  java_m41_t2_ex_2: [
    c("amount = 0", "0 coins."),
    c("Unreachable amount", "Return −1."),
    c("Coin larger than amount", "Skipped in the DP."),
  ],
  java_m41_t2_ex_3: [
    c("Empty array", "LIS 0."),
    c("Strictly decreasing", "LIS 1."),
    c("Duplicates", "Strictly increasing → equal values don't extend; use lower_bound in the O(n log n) variant."),
  ],
  java_m41_t2_ex_4: [
    c("First element 0 (n>1)", "Can't move → false."),
    c("Single element", "Already at the end → true."),
    c("Greedy reach", "maxReach must cover the last index."),
  ],
  java_m41_t2_ex_5: [
    c("Single step", "Cost 0 (start beyond)."),
    c("Two steps", "Start free from either."),
    c("Rolling DP", "Only the previous two costs matter."),
  ],
  java_m41_t2_ex_6: [
    c("Circular constraint", "Can't rob both first and last."),
    c("Single house", "Rob it (special-case the ring)."),
    c("Two runs", "Max of robbing [0..n−2] and [1..n−1]."),
  ],
  java_m41_t3_ex_1: [
    c("1×n or n×1 grid", "Exactly 1 path."),
    c("Single cell", "1 path."),
    c("Large grids overflow", "Path counts grow combinatorially — use long."),
  ],
  java_m41_t3_ex_2: [
    c("One string empty", "Edits equal the other's length."),
    c("Identical strings", "0 edits."),
    c("2-D table base row/col", "Initialise with 0..m and 0..n."),
  ],
  java_m41_t3_ex_3: [
    c("Zero capacity", "Value 0."),
    c("Item heavier than capacity", "Skipped (can't take it)."),
    c("0/1 vs unbounded", "0/1 uses each item once — iterate capacity descending if 1-D."),
  ],
  java_m41_t3_ex_4: [
    c("One string empty", "LCS 0."),
    c("Identical strings", "Full length."),
    c("No common chars", "LCS 0."),
  ],
  java_m41_t3_ex_5: [
    c("Single row", "The apex value."),
    c("Bottom-up collapse", "dp[i] = val + min(below-left, below-right)."),
    c("Negative values", "No pruning; the DP still works."),
  ],
  java_m41_t4_ex_1: [
    c("Empty tree", "0."),
    c("Single node", "Rob it."),
    c("Return {rob, skip}", "rob = val + children.skip; skip = Σ max(child)."),
  ],
  java_m41_t4_ex_2: [
    c("Single balloon", "Its solo value."),
    c("Empty", "0."),
    c("Boundary 1s", "Pad both ends with virtual 1-valued balloons."),
  ],
  java_m41_t4_ex_3: [
    c("Single matrix", "0 multiplications."),
    c("Two matrices", "One product cost."),
    c("Interval DP", "Try every split k between i and j."),
  ],
  java_m41_t5_ex_1: [
    c("Odd total sum", "Can't split into equal halves → false."),
    c("Empty / single element", "Only target 0 is reachable."),
    c("Target = sum/2", "Boolean 0/1-knapsack reachability."),
  ],

  // ───────────────────────── backtracking (16) ─────────────────────────
  java_m40_t1_ex_2: [
    c("Empty set", "Single subset: []."),
    c("Single element", "[[], [x]]."),
    c("2ⁿ growth", "Exponential output — small n only."),
  ],
  java_m40_t1_ex_3: [
    c("Single node", "One leaf path."),
    c("Empty tree", "0 paths."),
    c("Count at leaves", "+1 only when a leaf is reached."),
  ],
  java_m40_t1_ex_4: [
    c("n = 0", "One result: the empty string."),
    c("Balance pruning", "Add ')' only while close < open."),
    c("Catalan count", "Number of valid strings = Catalan(n)."),
  ],
  java_m40_t2_ex_1: [
    c("Duplicates", "Use a used[] per level to skip duplicate permutations."),
    c("Single element", "One permutation."),
    c("n! growth", "Factorial output — small n only."),
  ],
  java_m40_t2_ex_2: [
    c("k = 0", "One combination: []."),
    c("k = n", "One combination: the whole set."),
    c("Prune", "Stop when remaining elements < needed."),
  ],
  java_m40_t2_ex_3: [
    c("Reuse allowed", "Pass the same start index to allow repeats."),
    c("No combination sums to target", "Empty result."),
    c("Sort + prune", "Stop a branch when the remainder goes negative."),
  ],
  java_m40_t2_ex_4: [
    c("Duplicates", "Sort, then skip nums[i]==nums[i−1] at the same level."),
    c("Empty input", "[[]]."),
    c("All identical", "Subsets like [], [x], [x,x], … (deduped)."),
  ],
  java_m40_t2_ex_5: [
    c("Duplicates", "Same-level skip avoids duplicate subsets."),
    c("Empty input", "[[]]."),
    c("Sorted precondition", "Sorting is required for the skip rule to work."),
  ],
  java_m40_t3_ex_1: [
    c("n = 1", "1 solution."),
    c("n = 2 or 3", "0 solutions."),
    c("Diagonals", "Track r+c and r−c plus columns to detect attacks."),
  ],
  java_m40_t3_ex_2: [
    c("Symmetry", "Could halve work by mirroring the first row (optional)."),
    c("Prune early", "Abandon a row as soon as no safe column exists."),
    c("n = 8", "92 solutions."),
  ],
  java_m40_t3_ex_3: [
    c("Already-filled cells", "Fixed constraints — don't overwrite."),
    c("No valid digit", "Backtrack (reset the cell)."),
    c("Validity check", "Row, column, and 3×3 box must all stay unique."),
  ],
  java_m40_t4_ex_2: [
    c("Repeated letters on board", "Mark visited during DFS; un-mark on backtrack."),
    c("Word longer than board cells", "Cannot fit → false."),
    c("Word absent", "DFS exhausts → false."),
  ],
  java_m40_t4_ex_3: [
    c("Walls block all paths", "0 paths."),
    c("Start == end", "One trivial path."),
    c("Mark on the path", "Un-mark when returning so other paths can reuse cells."),
  ],
  java_m40_t5_ex_1: [
    c("Empty digits", "Empty result."),
    c("Digit '1' / '0'", "Map to no letters — handle or skip."),
    c("Combination count", "Product of letters-per-digit."),
  ],
  java_m40_t5_ex_2: [
    c("Single char", "One partition: [c]."),
    c("Whole string is a palindrome", "Includes the string itself."),
    c("No multi-char palindrome", "Falls back to all single chars."),
  ],
  java_m40_t5_ex_3: [
    c("n = 0", "Empty string only."),
    c("Open/close limits", "open ≤ n, close ≤ open."),
    c("Catalan count", "Total results = Catalan(n)."),
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
  console.log(`✅ edge-cases-7: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
