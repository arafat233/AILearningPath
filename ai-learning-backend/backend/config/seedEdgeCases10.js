/**
 * seedEdgeCases10.js — GAP #6 edge-case catalog, batch 10 (~30).
 * COMPLETES queue (30). Data-only. Verify: node config/auditEdgeCases.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const c = (cs, h) => ({ case: cs, handling: h });

const A = {
  java_m33_t3_ex_1: [
    c("Dequeue from empty", "poll returns null — guard before use."),
    c("addLast / pollFirst", "ArrayDeque used as a FIFO queue."),
    c("Single element", "offer then poll returns it."),
  ],
  java_m33_t3_ex_10: [
    c("No starting cells", "BFS does nothing — return the base answer."),
    c("Unreachable cells", "Stay at their initial (infinite/unvisited) state."),
    c("Multi-source seeding", "Enqueue all sources at level 0 together."),
  ],
  java_m33_t3_ex_11: [
    c("Empty input", "Return the identity result."),
    c("Single element", "One level / one item."),
    c("FIFO guarantee", "Queue preserves arrival / breadth order."),
  ],
  java_m33_t3_ex_12: [
    c("All characters repeat", "Queue empties → answer is '#' (none)."),
    c("First char unique forever", "Stays at the front."),
    c("Pop stale fronts", "Discard fronts whose count > 1 on each query."),
  ],
  java_m33_t3_ex_13: [
    c("k = 0", "Queue unchanged."),
    c("k = n", "Whole queue reversed."),
    c("k > n", "Clamp k to the queue size."),
  ],
  java_m33_t3_ex_14: [
    c("n = 0", "Empty output."),
    c("Single number", "Just \"1\"."),
    c("BFS generation", "Seed \"1\"; enqueue front+\"0\" and front+\"1\"."),
  ],
  java_m33_t3_ex_15: [
    c("n = 0", "Empty output."),
    c("Ordering", "BFS yields patterns in length-then-lexicographic order."),
    c("Single pattern", "\"1\" first."),
  ],
  java_m33_t3_ex_16: [
    c("Odd-length queue", "One half has an extra element — define which."),
    c("Empty queue", "Nothing to interleave."),
    c("Two elements", "Simple swap-in alternation."),
  ],
  java_m33_t3_ex_18: [
    c("k not dividing n", "Last block is shorter — reverse what remains."),
    c("k = 1", "Queue unchanged."),
    c("k = n", "Reverses the whole queue."),
  ],
  java_m33_t3_ex_19: [
    c("Empty queue", "Recursion bottoms out immediately."),
    c("Single element", "Returned unchanged."),
    c("No extra structure", "Uses the call stack to reverse."),
  ],
  java_m33_t3_ex_2: [
    c("Dequeue when both stacks empty", "Underflow — guard."),
    c("Amortised O(1)", "Each element moves between stacks at most once."),
    c("Peek", "May need to shuffle to expose the front."),
  ],
  java_m33_t3_ex_3: [
    c("Pop when empty", "Underflow — guard."),
    c("Push-costly vs pop-costly", "Choose which op does the rotation."),
    c("Single element", "push then pop returns it."),
  ],
  java_m33_t3_ex_4: [
    c("Empty tree/graph", "Empty traversal."),
    c("Single node", "One level."),
    c("Track level size", "Snapshot the queue size to group levels."),
  ],
  java_m33_t3_ex_5: [
    c("Empty grid", "0 islands."),
    c("All water / all land", "0 / 1 island."),
    c("Visited marking", "Mark on enqueue to avoid double counting."),
  ],
  java_m33_t3_ex_6: [
    c("No gates", "All rooms stay unreachable (INF)."),
    c("No empty rooms", "Nothing to fill."),
    c("Multi-source BFS", "Seed all gates at distance 0."),
  ],
  java_m33_t3_ex_7: [
    c("No fresh oranges", "Time 0."),
    c("Unreachable fresh orange", "Return −1."),
    c("Multi-source", "Seed all rotten at level 0."),
  ],
  java_m33_t3_ex_8: [
    c("n is a perfect square", "Answer is 1."),
    c("n = 0", "0 squares."),
    c("BFS over remainders", "Level = fewest squares summing to n."),
  ],
  java_m33_t3_ex_9: [
    c("Queue vs PriorityQueue", "FIFO order vs priority order — different pop sequences."),
    c("Empty", "Both guard poll/peek."),
    c("Complexity", "Queue O(1) ops; PQ O(log n)."),
  ],
  java_m33_t4_ex_1: [
    c("Empty deque", "Both ends guard against underflow."),
    c("addFirst/addLast", "O(1) at both ends."),
    c("Single element", "Same element at both ends."),
  ],
  java_m33_t4_ex_10: [
    c("Full ring", "(tail+1)%n == head signals full."),
    c("Empty ring", "head == tail (with a size/flag to disambiguate)."),
    c("Wrap-around", "Indices advance with modulo n."),
  ],
  java_m33_t4_ex_11: [
    c("Window size 1", "Each element is its own answer."),
    c("Monotonic deque", "Front holds the window's extreme; pop dominated entries."),
    c("Empty input", "Return the identity."),
  ],
  java_m33_t4_ex_12: [
    c("Next-greater vs extremes", "Same monotonic-deque tool, different comparison."),
    c("Empty input", "Identity result."),
    c("Indices vs values", "Store indices for distances/windows."),
  ],
  java_m33_t4_ex_2: [
    c("k = 1", "Each element is its own max."),
    c("k = n", "One window — the global max."),
    c("Monotonic decreasing deque", "Front is the max; pop indices leaving the window."),
  ],
  java_m33_t4_ex_3: [
    c("k = 1", "Each element is its own min."),
    c("k = n", "Global min."),
    c("Monotonic increasing deque", "Front is the min."),
  ],
  java_m33_t4_ex_4: [
    c("First element 0 (n>1)", "Unreachable → false."),
    c("Single element", "Already at the end → true."),
    c("Greedy reach", "maxReach must cover the last index."),
  ],
  java_m33_t4_ex_5: [
    c("Single element", "0 jumps."),
    c("Zero mid-array", "Reach must already cover it."),
    c("BFS-by-levels", "Each level boundary is one jump."),
  ],
  java_m33_t4_ex_6: [
    c("k = 1", "Trivially O(n)."),
    c("Why O(n)", "Each index enters and leaves the deque exactly once."),
    c("Duplicates", "Equal values handled by index eviction."),
  ],
  java_m33_t4_ex_7: [
    c("All equal", "Whole array is one valid window."),
    c("limit = 0", "Window of equal values only."),
    c("Two deques", "Track running max AND min; shrink when max−min > limit."),
  ],
  java_m33_t4_ex_8: [
    c("No subarray reaches K", "Return −1."),
    c("Negative numbers", "Prefix-sum + monotonic deque (a plain window fails)."),
    c("Whole array needed", "Length n if only the full sum qualifies."),
  ],
  java_m33_t4_ex_9: [
    c("Use one end only", "Behaves as a stack (LIFO)."),
    c("Use both ends", "Behaves as a queue (FIFO)."),
    c("Empty", "Guard both-end operations."),
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
  console.log(`✅ edge-cases-10: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
