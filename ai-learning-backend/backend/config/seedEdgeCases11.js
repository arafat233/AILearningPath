/**
 * seedEdgeCases11.js — GAP #6 edge-case catalog, batch 11 (~65).
 * COMPLETES linked-list (65). Data-only. Verify: node config/auditEdgeCases.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const c = (cs, h) => ({ case: cs, handling: h });

const A = {
  // ── M32 T1: basics ──
  java_m32_t1_ex_3: [
    c("Operations on an empty list", "head is null — guard inserts/deletes/traversals."),
    c("Delete the head", "Move head to head.next."),
    c("Single node", "Insert/delete must update head correctly."),
  ],
  java_m32_t1_ex_4: [
    c("n equals list length", "Removing the head — a dummy node simplifies this."),
    c("Single node, n = 1", "List becomes empty."),
    c("n larger than length", "Invalid — guard or clamp."),
  ],
  java_m32_t1_ex_5: [
    c("One list empty", "Return the other."),
    c("Both empty", "Return null."),
    c("Duplicate values", "Use ≤ when picking to stay stable."),
  ],
  java_m32_t1_ex_6: [
    c("Different lengths", "Continue with the longer list's remaining digits."),
    c("Final carry", "A leftover carry adds a new most-significant node."),
    c("One list empty", "Result is the other (plus any carry)."),
  ],
  java_m32_t1_ex_7: [
    c("Empty list", "Nothing to dedup."),
    c("All duplicates", "Collapse to a single node."),
    c("No duplicates", "List unchanged."),
  ],
  java_m32_t1_ex_8: [
    c("No intersection", "Both pointers reach null → return null."),
    c("Lists of different lengths", "Pointer-switching equalizes the traversal distance."),
    c("Intersection at the head", "They meet immediately."),
  ],
  java_m32_t1_ex_9: [
    c("Empty list", "Return null."),
    c("No child pointers", "Flatten is a no-op."),
    c("Deeply nested child", "Splice each child between a node and its next; fix prev pointers."),
  ],
  java_m32_t1_ex_11: [
    c("Odd number of nodes", "The last unpaired node stays in place."),
    c("Empty / single node", "Returned unchanged."),
    c("Relink, don't copy", "Swap by pointer surgery, not values, when required."),
  ],
  java_m32_t1_ex_12: [
    c("Empty / single node", "Returned unchanged."),
    c("Two nodes", "Odd and even chains each have one node."),
    c("Append even after odd", "Connect the odd tail to the even head."),
  ],
  java_m32_t1_ex_13: [
    c("Random pointer is null", "Copy as null."),
    c("Random points to self", "The clone's random must point to the clone."),
    c("Empty list", "Return null."),
  ],
  java_m32_t1_ex_14: [
    c("Index out of range", "get/addAtIndex must bounds-check."),
    c("addAtHead / addAtTail", "Maintain both head and (optionally) tail pointers."),
    c("Delete the only node", "Reset head (and tail) to null."),
  ],
  java_m32_t1_ex_15: [
    c("Empty list", "All operations handle null head."),
    c("Dummy head", "Simplifies insert/delete at the front."),
    c("Single node", "Edge of most operations."),
  ],

  // ── M32 T2: two-pointer / cycle ──
  java_m32_t2_ex_3: [
    c("Even length", "Two middles — slow lands on the second (or first, by fast init)."),
    c("Single node", "It is the middle."),
    c("Empty list", "No middle — return null."),
  ],
  java_m32_t2_ex_4: [
    c("No cycle", "fast reaches null → false."),
    c("Cycle at the head", "slow/fast still meet inside the loop."),
    c("Single node self-loop", "Detected as a cycle."),
  ],
  java_m32_t2_ex_5: [
    c("Empty / single node", "Trivially a palindrome → true."),
    c("Even vs odd length", "Reverse the second half; compare halves inward."),
    c("Restore the list", "Re-reverse if the caller needs it intact."),
  ],
  java_m32_t2_ex_6: [
    c("No cycle", "Return null."),
    c("Cycle entry at the head", "Head-reset pointers meet at the head."),
    c("Whole list is the cycle", "Entry is the head."),
  ],
  java_m32_t2_ex_7: [
    c("Read-only constraint", "Treat values as next-pointers; run Floyd (don't sort)."),
    c("Duplicate at the extremes", "Cycle detection is position-agnostic."),
    c("Multiple copies", "Still converges on the duplicate value."),
  ],
  java_m32_t2_ex_8: [
    c("No intersection", "Both reach null → null."),
    c("Different lengths", "Pointer-switching equalizes distance."),
    c("Intersect at head", "Meet immediately."),
  ],
  java_m32_t2_ex_9: [
    c("Reaches 1", "Happy → true."),
    c("Enters a cycle", "Floyd detects the loop → false."),
    c("Single-digit inputs", "1 and 7 are happy; others may cycle."),
  ],
  java_m32_t2_ex_10: [
    c("Empty / single node", "Returned unchanged."),
    c("Even vs odd length", "Mid split differs; weave handles both."),
    c("Two nodes", "Already in reorder form."),
  ],
  java_m32_t2_ex_11: [
    c("n equals length", "The head is the nth from the end."),
    c("n larger than length", "Invalid — guard."),
    c("Single node, n = 1", "Returns that node."),
  ],
  java_m32_t2_ex_12: [
    c("No cycle", "Length 0 (undefined)."),
    c("Self-loop", "Length 1."),
    c("Measure after meeting", "Freeze one pointer, step until it returns."),
  ],
  java_m32_t2_ex_13: [
    c("Cycle present", "Gap shrinks by 1 each step → guaranteed meeting."),
    c("No cycle", "fast reaches null first."),
    c("Proof intuition", "Entry distance equals meeting-to-entry distance (mod cycle)."),
  ],
  java_m32_t2_ex_14: [
    c("Pick slow/fast speeds", "Mid, nth-from-end, cycle — choose offset/speed accordingly."),
    c("Empty list", "Guard before the loop."),
    c("Single node", "Most variants return it directly."),
  ],
  java_m32_t2_ex_15: [
    c("One pass, O(1) space", "Two pointers avoid a second traversal or extra storage."),
    c("Empty / single node", "Return the identity."),
    c("Speed/offset choice", "Matches the sub-problem (mid vs nth vs cycle)."),
  ],

  // ── M32 T3: reversal ──
  java_m32_t3_ex_1: [
    c("Empty / single node", "Returned unchanged."),
    c("Return prev", "Loop ends with curr == null; prev is the new head."),
    c("Two nodes", "Simplest non-trivial reversal."),
  ],
  java_m32_t3_ex_2: [
    c("Why prev, not curr", "curr is null at the end; prev holds the new head."),
    c("Single node", "prev becomes that node."),
    c("Empty list", "prev stays null."),
  ],
  java_m32_t3_ex_3: [
    c("Three nodes", "Trace save-next → point-back → advance for each."),
    c("Losing the next pointer", "Save next BEFORE rewiring or the list is lost."),
    c("Termination", "Stop when curr is null."),
  ],
  java_m32_t3_ex_4: [
    c("left == right", "No change (single-node segment)."),
    c("left == 1", "Segment includes the head — use a dummy node."),
    c("right == length", "Segment runs to the tail."),
  ],
  java_m32_t3_ex_5: [
    c("Fewer than k nodes remain", "Leave the tail group as-is."),
    c("k = 1", "List unchanged."),
    c("k == length", "Reverse the whole list once."),
  ],
  java_m32_t3_ex_6: [
    c("Empty / single node", "Palindrome → true."),
    c("Even vs odd length", "Reverse the second half; compare inward."),
    c("Restore", "Re-reverse to leave the list intact."),
  ],
  java_m32_t3_ex_7: [
    c("Odd count", "Last unpaired node stays."),
    c("Empty / single node", "Unchanged."),
    c("Dummy head", "Simplifies the first swap."),
  ],
  java_m32_t3_ex_8: [
    c("Empty / single / two nodes", "Trivial or single-swap cases."),
    c("Append even after odd", "Link odd tail → even head."),
    c("Preserve relative order", "Within each parity chain."),
  ],
  java_m32_t3_ex_9: [
    c("Empty / single node", "Base case returns it."),
    c("Tail becomes new head", "Recurse to the end first."),
    c("Rewire on unwind", "head.next.next = head; head.next = null."),
  ],
  java_m32_t3_ex_10: [
    c("k larger than length", "Use k % length."),
    c("k % length == 0", "List unchanged."),
    c("Empty / single node", "Unchanged."),
  ],
  java_m32_t3_ex_11: [
    c("Iterative three-pointer", "save-next, point-back, advance."),
    c("Sublist reversal", "Reverse-between and k-group reuse the core."),
    c("Empty / single node", "Identity."),
  ],
  java_m32_t3_ex_12: [
    c("O(1) space iterative", "vs O(n) recursion stack."),
    c("Empty list", "Returns null."),
    c("Single node", "Unchanged."),
  ],

  // ── M32 T4: cycle detection ──
  java_m32_t4_ex_1: [
    c("No cycle", "fast hits null → false."),
    c("Cycle at head", "Still detected."),
    c("Self-loop", "Detected."),
  ],
  java_m32_t4_ex_2: [
    c("Cycle present", "fast gains 1 step on slow each move → they meet."),
    c("No cycle", "fast reaches null."),
    c("Gap bound", "Meeting guaranteed within cycle length."),
  ],
  java_m32_t4_ex_3: [
    c("Entry at head", "Reset pointer meets at the head."),
    c("Whole list is the cycle", "Entry is the head."),
    c("No cycle", "Phase 2 isn't reached."),
  ],
  java_m32_t4_ex_4: [
    c("Read-only", "Value-as-next Floyd, no sorting/modifying."),
    c("Multiple copies", "Converges on the duplicate."),
    c("Range [1,n] of n+1 values", "Pigeonhole guarantees a cycle."),
  ],
  java_m32_t4_ex_5: [
    c("No cycle", "Length 0."),
    c("Self-loop", "Length 1."),
    c("After meeting", "Step one pointer around to count."),
  ],
  java_m32_t4_ex_6: [
    c("Reaches 1", "Happy → true."),
    c("Cycles", "Floyd detects → false."),
    c("No HashSet needed", "O(1) space via tortoise/hare."),
  ],
  java_m32_t4_ex_7: [
    c("No intersection", "Return null."),
    c("Different lengths", "Pointer-switch equalizes distance."),
    c("Meet at head", "Immediate."),
  ],
  java_m32_t4_ex_8: [
    c("Multiple possible entries", "Algebra still yields the true entry via head-reset."),
    c("Entry at head", "Converges at the head."),
    c("No cycle", "Phase 2 not applicable."),
  ],
  java_m32_t4_ex_9: [
    c("Back edge to a grey node", "Indicates a directed cycle."),
    c("Disconnected graph", "Check from every unvisited node."),
    c("Self-loop", "Immediate cycle."),
  ],
  java_m32_t4_ex_10: [
    c("No cycle", "Phase 1 returns no meeting."),
    c("Entry at head", "Phase 2 meets at head."),
    c("Phase 3 length", "Loop the cycle once to measure."),
  ],
  java_m32_t4_ex_11: [
    c("No-modify constraint", "Use Floyd on value-as-next."),
    c("Multiple copies", "Still finds the duplicate."),
    c("O(1) space", "No extra structures."),
  ],
  java_m32_t4_ex_12: [
    c("Sequence always cycles", "Finite range → guaranteed loop."),
    c("Fixed point", "f(x) == x is a length-1 cycle."),
    c("Entry = answer", "Floyd's cycle start is the repeated value."),
  ],
  java_m32_t4_ex_13: [
    c("Entry at head", "Reset meets at head."),
    c("No cycle", "Report none."),
    c("All in O(1) space", "Detect, locate, and measure without extra memory."),
  ],
  java_m32_t4_ex_14: [
    c("Map to a next-function", "LL cycle / duplicate / happy number all reduce to Floyd."),
    c("No cycle case", "Terminates at null/1."),
    c("Single technique", "One mental model covers all three."),
  ],
  java_m32_t4_ex_15: [
    c("Detect then locate", "Meeting then head-reset finds the entry."),
    c("O(1) vs HashSet", "Floyd beats the O(n)-space set approach."),
    c("No cycle", "fast reaches null."),
  ],

  // ── M32 T5: merge / sort ──
  java_m32_t5_ex_1: [
    c("One list empty", "Return the other."),
    c("Both empty", "Return null."),
    c("Duplicates", "Use ≤ to stay stable."),
  ],
  java_m32_t5_ex_10: [
    c("Different lengths", "Pad with the longer list's remaining digits."),
    c("Final carry", "Prepend a new most-significant node."),
    c("MSB-first storage", "Use stacks (or reverse) to add from the least-significant end."),
  ],
  java_m32_t5_ex_11: [
    c("Empty / single node", "Already sorted."),
    c("Verify sorted", "One pass checks non-decreasing order."),
    c("Timing", "Matches n log n on large inputs."),
  ],
  java_m32_t5_ex_12: [
    c("Top-down vs bottom-up", "Bottom-up avoids recursion stack (O(1) extra)."),
    c("Empty list", "Return null."),
    c("Merge primitive", "Two-sorted-list merge is the core step."),
  ],
  java_m32_t5_ex_2: [
    c("Why merge not quick", "Lists lack O(1) indexing → quicksort partition is poor."),
    c("Stability", "Merge sort is stable."),
    c("Sequential access", "Merge needs only forward traversal + splicing."),
  ],
  java_m32_t5_ex_3: [
    c("fast = head.next", "Splits even-length lists evenly; cut at slow.next."),
    c("Single node", "Already sorted."),
    c("Empty list", "Return null."),
  ],
  java_m32_t5_ex_4: [
    c("Empty / single node", "Already sorted."),
    c("Even split", "fast=head.next ensures balanced halves."),
    c("Duplicates", "Stable merge with ≤."),
  ],
  java_m32_t5_ex_5: [
    c("Some lists empty/null", "Skip when seeding the heap."),
    c("All empty", "Return null."),
    c("Heap of heads", "Poll min, push its next — O(N log k)."),
  ],
  java_m32_t5_ex_6: [
    c("Different lengths", "Continue with the remaining digits."),
    c("Final carry", "Add a trailing node."),
    c("One list empty", "Return the other (plus carry)."),
  ],
  java_m32_t5_ex_7: [
    c("Empty / single node", "Unchanged."),
    c("Even vs odd length", "Mid split differs; weave handles both."),
    c("O(1) space", "Reverse the second half in place, then merge."),
  ],
  java_m32_t5_ex_8: [
    c("Many duplicates", "Stable merge keeps equal keys' order."),
    c("Already sorted", "Merge sort still O(n log n) (no early exit)."),
    c("Empty / single node", "Already sorted."),
  ],
  java_m32_t5_ex_9: [
    c("Some lists empty", "Skip null heads."),
    c("All empty", "Return null."),
    c("Heap size ≤ k", "Total cost O(N log k)."),
  ],
  java_m32_t5_ex_13: [
    c("Empty list", "Return null."),
    c("Stability", "Merge sort preserves equal-key order."),
    c("Quicksort unsuitable", "No random access on a list."),
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
  console.log(`✅ edge-cases-11: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
