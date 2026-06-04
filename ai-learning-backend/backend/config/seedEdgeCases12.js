/**
 * seedEdgeCases12.js — GAP #6 edge-case catalog, FINAL batch 12 (~78).
 * COMPLETES hashing (78) → 598/598 (100%). Data-only.
 * Verify: node config/auditEdgeCases.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const c = (cs, h) => ({ case: cs, handling: h });

const A = {
  // ── M31 T4: anagram / frequency ──
  java_m31_t4_ex_11: [
    c("One string empty", "Steps = length of the other."),
    c("Identical strings", "0 steps."),
    c("Frequency diff", "Sum of positive count differences."),
  ],
  java_m31_t4_ex_12: [
    c("k ≥ distinct words", "Return all distinct words."),
    c("Frequency ties", "Break ties lexicographically per the spec."),
    c("Single word", "It is the only result."),
  ],
  java_m31_t4_ex_13: [
    c("k ≥ distinct chars", "Whole string qualifies."),
    c("k = 0", "Empty window only."),
    c("Shrink trigger", "When distinct exceeds k, advance left."),
  ],
  java_m31_t4_ex_14: [
    c("String shorter than 3", "0 good substrings."),
    c("All same char", "No 3-distinct window → 0."),
    c("Fixed window of 3", "Count windows with all-distinct chars."),
  ],
  java_m31_t4_ex_15: [
    c("Lowercase only", "int[26] beats a HashMap."),
    c("Sliding window", "A match-counter avoids re-comparing each step."),
    c("Empty input", "Return the identity."),
  ],
  java_m31_t4_ex_16: [
    c("Pattern longer than text", "No permutation possible → false."),
    c("Repeated chars in pattern", "Compare full frequency, not a set."),
    c("Match-counter", "Slide a fixed window; all 26 buckets equal → true."),
  ],
  java_m31_t4_ex_17: [
    c("Missing a required letter", "Answer 0."),
    c("Letters needing two copies", "Divide l/o counts by 2."),
    c("Answer", "min over b,a,l/2,o/2,n."),
  ],
  java_m31_t4_ex_3: [
    c("Different lengths", "Not anagrams → false."),
    c("Empty strings", "Two empties are anagrams → true."),
    c("Alphabet scope", "int[26] for lowercase; HashMap for Unicode."),
  ],
  java_m31_t4_ex_4: [
    c("Note longer than magazine", "Impossible → false."),
    c("Empty note", "Trivially true."),
    c("Letter shortage", "Any required letter exceeding supply → false."),
  ],
  java_m31_t4_ex_5: [
    c("Empty input list", "Empty result."),
    c("All unique (no anagrams)", "Each word is its own group."),
    c("Canonical key", "Sorted chars or a 26-count signature groups anagrams."),
  ],
  java_m31_t4_ex_6: [
    c("Pattern longer than text", "Empty result."),
    c("Overlapping matches", "Slide by one; record every valid start."),
    c("Repeated chars in pattern", "Full-frequency comparison."),
  ],
  java_m31_t4_ex_7: [
    c("All chars repeat", "Return −1 (no unique char)."),
    c("First char unique", "Return index 0."),
    c("Empty string", "Return −1."),
  ],
  java_m31_t4_ex_8: [
    c("t longer than s", "No window → empty string."),
    c("No covering window", "Return \"\"."),
    c("Repeated chars in t", "Match by count, not presence."),
  ],
  java_m31_t4_ex_9: [
    c("All same char", "One frequency group."),
    c("Frequency ties", "Any order among equal-frequency chars is fine."),
    c("Empty string", "Return empty."),
  ],

  // ── M34 T1: HashMap fundamentals ──
  java_m34_t1_ex_1: [
    c("Key absent", "getOrDefault avoids null handling."),
    c("Null keys/values", "HashMap allows one null key — be deliberate."),
    c("Overwrite", "put replaces the existing value."),
  ],
  java_m34_t1_ex_2: [
    c("Empty input", "Empty frequency map."),
    c("Single element", "Count 1."),
    c("merge/compute", "Use merge(k,1,Integer::sum) for concise counting."),
  ],
  java_m34_t1_ex_3: [
    c("No solution", "Return empty/sentinel per spec."),
    c("Duplicate values", "Map value→index; the complement check handles dups."),
    c("Same element twice", "Don't pair an index with itself."),
  ],
  java_m34_t1_ex_4: [
    c("k = 0", "Seed {0:1} to count zero-sum subarrays."),
    c("Negative numbers", "Prefix + count map (a window fails)."),
    c("Whole-array match", "Caught by the seeded 0 prefix."),
  ],
  java_m34_t1_ex_5: [
    c("Load factor exceeded", "Capacity doubles; entries rehash."),
    c("Resize cost", "Occasional O(n); amortised O(1) puts."),
    c("Poor hashCode", "Many collisions degrade to O(n) per bucket."),
  ],
  java_m34_t1_ex_6: [
    c("All chars repeat", "No first-unique → return the sentinel."),
    c("Empty string", "No unique char."),
    c("Single char", "It is unique."),
  ],
  java_m34_t1_ex_7: [
    c("All same value", "Map 0↔1; longest balanced subarray via first-seen prefix."),
    c("No balanced subarray", "Length 0."),
    c("Seed {0:-1}", "Lets a balanced prefix from index 0 count."),
  ],
  java_m34_t1_ex_8: [
    c("Need ordering", "TreeMap (sorted) vs HashMap (none) vs LinkedHashMap (insertion)."),
    c("Range queries", "Only TreeMap supports floor/ceiling/subMap."),
    c("Performance", "Hash O(1) vs Tree O(log n)."),
  ],
  java_m34_t1_ex_9: [
    c("Empty array", "Longest run 0."),
    c("Duplicates", "Set collapses them."),
    c("Only count run starts", "Begin at x where x−1 is absent → O(n)."),
  ],
  java_m34_t1_ex_10: [
    c("Empty arrays", "0 tuples."),
    c("Many zero sums", "Map of A+B sums; look up −(C+D)."),
    c("Overflow", "Sums can be large — use the right type."),
  ],
  java_m34_t1_ex_11: [
    c("Target absent", "Reservoir never picks — handle per spec."),
    c("Many occurrences", "Reservoir sampling gives uniform O(1)-space picks."),
    c("Single occurrence", "Always returns that index."),
  ],
  java_m34_t1_ex_12: [
    c("Negative numbers", "Use prefix + count map for subarray sums."),
    c("Empty input", "Identity result."),
    c("One map, many patterns", "Two-sum / subarray-sum / consecutive all reduce to a map."),
  ],
  java_m34_t1_ex_13: [
    c("Collisions", "Chain in a bucket (treeify when long)."),
    c("Bad hashCode", "Degrades to O(n) lookups."),
    c("Null key", "Allowed once — be deliberate."),
  ],
  java_m34_t1_ex_14: [
    c("Multiple valid pairs", "Emit every index pair, not just the first."),
    c("Duplicate values", "Map value→list of indices."),
    c("Self-pairing", "Don't pair an index with itself."),
  ],

  // ── M34 T2: HashMap patterns ──
  java_m34_t2_ex_1: [
    c("Empty list", "Empty result."),
    c("All unique", "Each word its own group."),
    c("Canonical key", "Sorted chars or count signature."),
  ],
  java_m34_t2_ex_10: [
    c("Fewer than 2 points", "All points are 'on a line' trivially."),
    c("Duplicate points", "Count them toward every line through the anchor."),
    c("Vertical lines", "Handle infinite slope (use a reduced dx/dy key)."),
  ],
  java_m34_t2_ex_11: [
    c("Empty input", "Identity result."),
    c("Value type choice", "count / list / index per problem."),
    c("getOrDefault/merge", "Concise idioms for accumulation."),
  ],
  java_m34_t2_ex_12: [
    c("Empty input", "Return the identity."),
    c("computeIfAbsent", "Builds nested structures lazily."),
    c("Immutable keys", "Required for stable hashing."),
  ],
  java_m34_t2_ex_2: [
    c("k ≥ distinct values", "Return all distinct."),
    c("Frequency ties", "Any order among equals is acceptable."),
    c("Bucket sort", "By count gives O(n)."),
  ],
  java_m34_t2_ex_3: [
    c("Length mismatch", "Pattern and words differ → false."),
    c("Two-way mapping", "char→word AND word→char must be consistent."),
    c("Repeated pattern char", "Must map to the same word each time."),
  ],
  java_m34_t2_ex_4: [
    c("Length mismatch", "Not isomorphic → false."),
    c("Two maps", "Enforce a one-to-one char mapping both ways."),
    c("Self-mapping char", "Maps to itself consistently."),
  ],
  java_m34_t2_ex_5: [
    c("All within [L,R]", "Every subarray counts."),
    c("None in range", "Answer 0."),
    c("count(≤R) − count(≤L−1)", "Two linear scans."),
  ],
  java_m34_t2_ex_6: [
    c("All bricks same width", "Every edge aligns → fewest cuts."),
    c("Single row", "The one row's edges define the answer."),
    c("Answer", "rows − max aligned-edge count."),
  ],
  java_m34_t2_ex_7: [
    c("t longer than s", "Empty result."),
    c("No covering window", "Return \"\"."),
    c("Repeated chars in t", "Match by count."),
  ],
  java_m34_t2_ex_8: [
    c("Cyclic ordering", "No valid order → return \"\"."),
    c("Prefix conflict (\"abc\" before \"ab\")", "Invalid input → \"\"."),
    c("Disconnected letters", "Any topological order is acceptable."),
  ],
  java_m34_t2_ex_9: [
    c("Start or end blocked", "Return −1."),
    c("Visited set", "Prevents revisiting in BFS."),
    c("1×1 open grid", "Distance 1."),
  ],

  // ── M34 T3: HashSet ──
  java_m34_t3_ex_1: [
    c("Duplicate add", "Returns false; set keeps one copy."),
    c("Empty set", "contains is always false."),
    c("Membership O(1)", "Average constant time."),
  ],
  java_m34_t3_ex_10: [
    c("Char not in key", "Spaces (or unmapped) pass through."),
    c("Key shorter than 26 distinct", "Map only first-seen letters."),
    c("Empty message", "Empty output."),
  ],
  java_m34_t3_ex_11: [
    c("Reaches 1", "Happy → true."),
    c("Cycle (set revisit)", "Not happy → false."),
    c("Single-digit 7", "Happy."),
  ],
  java_m34_t3_ex_12: [
    c("Empty input", "Identity result."),
    c("Membership/dedup", "Set's core uses."),
    c("Set algebra", "Intersection/union/difference."),
  ],
  java_m34_t3_ex_13: [
    c("Order needed", "Use LinkedHashSet."),
    c("Duplicates", "Collapsed automatically."),
    c("Membership only", "Set over map when values aren't needed."),
  ],
  java_m34_t3_ex_2: [
    c("Empty array", "No duplicate → false."),
    c("All unique", "false."),
    c("Early exit", "Return true on the first failed add."),
  ],
  java_m34_t3_ex_3: [
    c("Disjoint arrays", "Empty intersection."),
    c("Duplicates", "Set collapses them."),
    c("One array empty", "Intersection empty; union is the other."),
  ],
  java_m34_t3_ex_4: [
    c("No jewels among stones", "Count 0."),
    c("Case sensitivity", "'a' and 'A' are distinct."),
    c("Empty stones", "Count 0."),
  ],
  java_m34_t3_ex_5: [
    c("k = 0", "A value can't duplicate within distance 0 → false."),
    c("k ≥ n", "Whole-array window."),
    c("Evict stale indices", "Keep only the last k in the set."),
  ],
  java_m34_t3_ex_6: [
    c("All negatives / huge values", "Ignore values outside [1,n]."),
    c("Contains 1..n exactly", "Answer is n+1."),
    c("Index-as-hash", "Place v at index v−1 via swaps; O(1) space."),
  ],
  java_m34_t3_ex_7: [
    c("Empty array", "Length 0."),
    c("Duplicates", "Set collapses them."),
    c("Run-start check", "Only count from x with x−1 absent."),
  ],
  java_m34_t3_ex_8: [
    c("No cycle", "Set never repeats → false."),
    c("Cycle", "A revisited node → true (O(n) space vs Floyd's O(1))."),
    c("Single node", "Self-loop detected."),
  ],
  java_m34_t3_ex_9: [
    c("Negative values", "Set/map of running sums handles them."),
    c("Path of length 1", "A single node equal to target counts."),
    c("Backtrack the set", "Remove the prefix on return."),
  ],

  // ── M34 T4: custom keys ──
  java_m34_t4_ex_1: [
    c("Sparse grid", "\"r,c\" key avoids a full 2-D visited array."),
    c("Key collisions", "Use a unique separator or r*cols+c."),
    c("Negative coords", "String key still works."),
  ],
  java_m34_t4_ex_10: [
    c("get before any set", "Return the default (e.g., 0)."),
    c("Many snaps", "Store sparse history per index; snap() is O(1)."),
    c("get(i, snap)", "Binary-search the largest snapId ≤ snap."),
  ],
  java_m34_t4_ex_11: [
    c("Composite state", "Encode all fields into one key."),
    c("Mutable components", "Avoid — breaks hashing."),
    c("Equality", "equals/hashCode must reflect every field."),
  ],
  java_m34_t4_ex_12: [
    c("Good key properties", "Immutable, well-distributed hash, matching equals."),
    c("records", "Auto-generate all three."),
    c("Sparse alphabets", "Prefer a map of children over fixed arrays."),
  ],
  java_m34_t4_ex_2: [
    c("Lowercase only", "26-count signature beats sorting."),
    c("Unicode", "Fall back to a sorted-string key."),
    c("Empty strings", "Group together."),
  ],
  java_m34_t4_ex_3: [
    c("equals true ⇒ equal hashCodes", "Mandatory contract."),
    c("Override one only", "Breaks HashMap/HashSet lookups."),
    c("Inconsistent fields", "Use the same fields in both methods."),
  ],
  java_m34_t4_ex_4: [
    c("Identical island shapes", "Deduped via a normalized signature."),
    c("Single-cell islands", "All identical → counted once."),
    c("No land", "0 distinct shapes."),
  ],
  java_m34_t4_ex_5: [
    c("Records as keys", "Immutable + auto equals/hashCode → safe."),
    c("Same components", "Value-based equality groups them."),
    c("Null components", "Allowed but be deliberate."),
  ],
  java_m34_t4_ex_6: [
    c("Fewer than 4 points", "No squares."),
    c("Duplicate points", "Multiply corner counts."),
    c("Axis-aligned only", "Pick diagonal points sharing x/y."),
  ],
  java_m34_t4_ex_7: [
    c("Collisions", "Each bucket is a short chain."),
    c("get missing key", "Return −1."),
    c("Resize", "Past load factor to keep chains short."),
  ],
  java_m34_t4_ex_8: [
    c("Query at the edges", "1-based prefix avoids boundary branches."),
    c("Single cell", "Inclusion–exclusion still returns it."),
    c("Empty matrix", "Guard before building."),
  ],
  java_m34_t4_ex_9: [
    c("Mutate after insert", "hashCode changes → entry becomes unreachable."),
    c("Immutable keys", "The safe fix."),
    c("Demonstration", "Show the lost-entry symptom."),
  ],

  // ── M34 T5: designs ──
  java_m34_t5_ex_1: [
    c("Remove missing element", "Return false / no-op."),
    c("GetRandom on empty", "Undefined — guard."),
    c("O(1) delete", "Swap with last, pop, fix the moved index."),
  ],
  java_m34_t5_ex_10: [
    c("get before any set", "Return \"\" / default."),
    c("Same timestamp", "Latest set wins."),
    c("get(key, t)", "Binary-search the largest timestamp ≤ t."),
  ],
  java_m34_t5_ex_11: [
    c("Recency vs frequency vs random", "Pair the map with DLL / freq buckets / ArrayList."),
    c("Empty state", "Each returns its sentinel."),
    c("O(1) target", "Map for lookup + partner for ordering."),
  ],
  java_m34_t5_ex_12: [
    c("Pick the partner structure", "By eviction/ordering rule."),
    c("Empty operations", "Guard polls/gets."),
    c("Composability", "Map + list/heap combos."),
  ],
  java_m34_t5_ex_13: [
    c("Cache miss", "computeIfAbsent computes and stores."),
    c("Unbounded growth", "No eviction — note the memory caveat."),
    c("Cache hit", "Return the stored value (memoization)."),
  ],
  java_m34_t5_ex_2: [
    c("Capacity 1", "Each put may evict."),
    c("Update existing key", "Move to most-recent and overwrite."),
    c("get missing key", "Return −1, no recency change."),
  ],
  java_m34_t5_ex_3: [
    c("Long chains", "Resize when the load factor is high."),
    c("contains missing", "Walk one chain → false."),
    c("Collisions", "Linked chaining per bucket."),
  ],
  java_m34_t5_ex_4: [
    c("Remove missing", "Return false."),
    c("GetRandom empty", "Guard."),
    c("Swap-with-last delete", "Keeps all ops O(1)."),
  ],
  java_m34_t5_ex_5: [
    c("k ≥ distinct words", "Return all."),
    c("Frequency ties", "Break per spec."),
    c("Empty input", "Empty result."),
  ],
  java_m34_t5_ex_6: [
    c("Capacity 0", "Nothing cached."),
    c("Frequency tie", "Evict LRU within the min-frequency bucket."),
    c("Update existing key", "Bump frequency and value together."),
  ],
  java_m34_t5_ex_7: [
    c("get before any set", "Return the default."),
    c("Sparse history", "Record only on set."),
    c("Binary-search snaps", "For get(i, snap)."),
  ],
  java_m34_t5_ex_8: [
    c("Collisions", "Chain or probe; index = hash % cap."),
    c("Resize", "Past load factor."),
    c("get missing key", "Return −1."),
  ],
  java_m34_t5_ex_9: [
    c("Collision on short code", "Regenerate or use a counter."),
    c("Decode unknown code", "Return null / not found."),
    c("Two-way maps", "short↔long for O(1) both directions."),
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
  console.log(`✅ edge-cases-12: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
