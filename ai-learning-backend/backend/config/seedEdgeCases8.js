/**
 * seedEdgeCases8.js — GAP #6 edge-case catalog, batch 8 (~48).
 * COMPLETES matrix (30) + stack (18). Data-only.
 * Verify: node config/auditEdgeCases.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const c = (cs, h) => ({ case: cs, handling: h });

const A = {
  // ───────────────────────── matrix (30) ─────────────────────────
  java_m30_5_t1_ex_11: [
    c("Dimension mismatch", "A.cols must equal B.rows, or the product is undefined."),
    c("Empty matrix", "Guard before the triple loop."),
    c("Single cell", "1×1 × 1×1 is a scalar product."),
  ],
  java_m30_5_t1_ex_12: [
    c("All zeros", "Result is the zero matrix; skip all multiplications."),
    c("Mostly zeros", "Iterate only non-zero entries → work ∝ non-zeros."),
    c("Dimension mismatch", "Guard A.cols == B.rows."),
  ],
  java_m30_5_t1_ex_13: [
    c("Empty cells ('.')", "Skip them — only filled digits are validated."),
    c("Duplicate in a box", "Track 9 row, col, and 3×3 sets; any repeat → invalid."),
    c("Single filled cell", "Trivially valid."),
  ],
  java_m30_5_t1_ex_14: [
    c("n = 1", "Single cell holds 1."),
    c("Shrinking bounds", "Move right→down→left→up, tightening after each edge."),
    c("Even vs odd n", "Center handling differs; the bound logic covers both."),
  ],
  java_m30_5_t1_ex_3: [
    c("Single row or column", "Spiral is just a straight line."),
    c("Empty matrix", "Empty result."),
    c("Non-square matrix", "Bounds for rows and columns shrink independently."),
  ],
  java_m30_5_t1_ex_4: [
    c("1×1 matrix", "Rotation is a no-op."),
    c("In-place layers", "Rotate four cells per swap, layer by layer."),
    c("Even vs odd n", "Odd n has a fixed center cell."),
  ],
  java_m30_5_t1_ex_5: [
    c("First row/col holds a zero", "Use marker flags so the markers themselves aren't lost."),
    c("All zeros", "Whole matrix becomes zero."),
    c("No zeros", "Matrix unchanged."),
  ],
  java_m30_5_t1_ex_6: [
    c("Single row/column", "Diagonal order degenerates to a line."),
    c("Direction flips", "Alternate up-right and down-left per anti-diagonal."),
    c("Bounds at corners", "Clamp at the last row/column when turning."),
  ],
  java_m30_5_t1_ex_7: [
    c("Empty matrix", "Return false."),
    c("Target out of range", "Below first or above last cell → false."),
    c("Flat-index mapping", "row = mid/cols, col = mid%cols."),
  ],
  java_m30_5_t1_ex_9: [
    c("1×1 matrix", "No-op for any direction."),
    c("Clockwise vs counter", "Transpose then reverse rows (CW) or columns (CCW)."),
    c("Odd n center", "Stays fixed under rotation."),
  ],
  java_m30_5_t2_ex_2: [
    c("Empty grid", "0 islands."),
    c("All water / all land", "0 / 1 island."),
    c("Visited marking", "Sink land or use a seen set to avoid recount."),
  ],
  java_m30_5_t2_ex_3: [
    c("Start color == new color", "Return immediately (avoid infinite recursion)."),
    c("Single cell", "Fill just that cell."),
    c("Whole region uniform", "Entire connected block recolors."),
  ],
  java_m30_5_t2_ex_4: [
    c("Start or end blocked", "Return −1."),
    c("1×1 open grid", "Path length 1."),
    c("8-directional BFS", "Level count is the shortest path."),
  ],
  java_m30_5_t2_ex_5: [
    c("No land", "Max area 0."),
    c("Single-cell island", "Area 1."),
    c("All land", "Area = rows*cols."),
  ],
  java_m30_5_t2_ex_6: [
    c("Border-connected region", "Not captured — start DFS from border 'O's."),
    c("All 'X'", "Nothing to flip."),
    c("Single cell", "Edge cell can't be surrounded."),
  ],
  java_m30_5_t2_ex_7: [
    c("Repeated letters", "Mark visited during DFS; un-mark on backtrack."),
    c("Word longer than the grid", "Cannot fit → false."),
    c("Word absent", "DFS exhausts → false."),
  ],
  java_m30_5_t3_ex_2: [
    c("1×n or n×1 grid", "Exactly 1 path."),
    c("Single cell", "1 path."),
    c("Overflow", "Path counts grow combinatorially — use long."),
  ],
  java_m30_5_t3_ex_3: [
    c("Single cell", "The cell's own value."),
    c("Single row/column", "Sum along that line."),
    c("First row/col base case", "Can only come from one direction."),
  ],
  java_m30_5_t3_ex_4: [
    c("Obstacle at start or end", "0 paths."),
    c("Obstacle row blocks all", "Downstream cells become 0."),
    c("No obstacles", "Reduces to plain Unique Paths."),
  ],
  java_m30_5_t3_ex_5: [
    c("One string empty", "Edits = the other's length."),
    c("Identical strings", "0 edits."),
    c("Base row/col", "Initialise with 0..m and 0..n."),
  ],
  java_m30_5_t3_ex_6: [
    c("One string empty", "LCS 0."),
    c("Identical strings", "Full length."),
    c("No common chars", "LCS 0."),
  ],
  java_m30_5_t3_ex_7: [
    c("No 1s", "Largest square side 0."),
    c("All 1s", "Square side = min(rows, cols)."),
    c("First row/col", "dp value is the cell itself (can't extend up-left)."),
  ],
  java_m30_5_t4_ex_3: [
    c("Empty matrix", "Return false."),
    c("Fully sorted (row-major)", "Treat as one flat sorted array."),
    c("Target out of range", "Below first / above last → false."),
  ],
  java_m30_5_t4_ex_4: [
    c("Empty matrix", "Return false."),
    c("Start corner", "Top-right (or bottom-left) eliminates a row or column each step."),
    c("Target absent", "Walk off the grid → false."),
  ],
  java_m30_5_t4_ex_5: [
    c("k = 1 / k = n²", "Top-left / bottom-right value."),
    c("Duplicates", "Count entries ≤ mid so k lands correctly."),
    c("Binary search on value", "Search the value range, not indices."),
  ],
  java_m30_5_t5_ex_2: [
    c("No gates", "All rooms stay INF (unreachable)."),
    c("No empty rooms", "Nothing to fill."),
    c("Multi-source BFS", "Seed all gates at distance 0 simultaneously."),
  ],
  java_m30_5_t5_ex_3: [
    c("All dead / all alive", "Apply rules uniformly."),
    c("In-place update", "Use intermediate states (e.g., 2/3) to avoid clobbering neighbours."),
    c("Border cells", "Neighbours off-grid count as dead."),
  ],
  java_m30_5_t5_ex_4: [
    c("No zeros", "Distances undefined — problem guarantees at least one 0."),
    c("All zeros", "Every distance is 0."),
    c("Multi-source BFS", "Seed all 0-cells at distance 0."),
  ],
  java_m30_5_t5_ex_5: [
    c("k ≥ obstacles on the straight path", "A direct route becomes possible."),
    c("Start == end", "0 steps."),
    c("State includes eliminations", "visited keyed by (r, c, eliminationsLeft)."),
  ],
  java_m30_5_t5_ex_6: [
    c("Robots on the same cell", "Count that cell's cherries once."),
    c("Single column", "Both robots forced together."),
    c("DP state", "(row, col1, col2) drives the transitions."),
  ],

  // ───────────────────────── stack (18) ─────────────────────────
  java_m33_t1_ex_1: [
    c("Empty string", "Balanced → true."),
    c("Closing bracket first", "Stack underflow → false."),
    c("Leftover opens", "Non-empty stack at the end → false."),
    c("Mismatched type", "'(' closed by ']' → false."),
  ],
  java_m33_t1_ex_10: [
    c("Leading/trailing spaces", "Skip whitespace while parsing."),
    c("Precedence", "Resolve * and / immediately; defer + and −."),
    c("Single number", "Push and sum at the end."),
  ],
  java_m33_t1_ex_11: [
    c("Empty histogram", "Area 0."),
    c("Strictly increasing", "All bars flush at the end (append a sentinel 0)."),
    c("Equal heights", "Consistent pop rule avoids miscounting widths."),
  ],
  java_m33_t1_ex_12: [
    c("Flat or empty", "0 water."),
    c("Monotonic terrain", "No basin → 0."),
    c("Wide valley", "Width spans the popped valley to the new wall."),
  ],
  java_m33_t1_ex_13: [
    c("Empty input", "Identity result per sub-problem."),
    c("Choosing the variant", "Balanced/next-greater/eval/decode all use LIFO differently."),
    c("Monotonic vs plain", "Use a monotonic stack for next-greater/smaller."),
  ],
  java_m33_t1_ex_14: [
    c("Pop/peek when empty", "Guard against underflow."),
    c("Single element", "push then pop returns it."),
    c("ArrayDeque over Stack", "Prefer ArrayDeque (legacy Stack is synchronized/slow)."),
  ],
  java_m33_t1_ex_15: [
    c("Empty string", "Returns empty."),
    c("Single char", "Unchanged."),
    c("Push all then pop", "LIFO yields the reverse."),
  ],
  java_m33_t1_ex_16: [
    c("Already sorted", "Still O(n²) inserts, no early exit."),
    c("Duplicates", "Equal elements keep a consistent order."),
    c("Two stacks only", "No other data structure allowed."),
  ],
  java_m33_t1_ex_17: [
    c("Empty stack", "Recursion bottoms out immediately."),
    c("Single element", "insertAtBottom returns it unchanged."),
    c("No extra structure", "Uses the call stack only."),
  ],
  java_m33_t1_ex_18: [
    c("Lengths differ", "Can't be a valid sequence → false."),
    c("Empty sequences", "Vacuously true."),
    c("Greedy pop", "Push pushed[i], pop while top == popped[j]."),
  ],
  java_m33_t1_ex_2: [
    c("getMin after pops", "Auxiliary min-stack mirrors the current minimum."),
    c("Duplicate minimums", "Push to min-stack on ≤ so equal mins survive pops."),
    c("Empty operations", "Guard top/getMin against underflow."),
  ],
  java_m33_t1_ex_3: [
    c("Pop when empty", "Guard underflow."),
    c("addFirst/removeFirst", "ArrayDeque used as a LIFO stack."),
    c("Single element", "push then pop returns it."),
  ],
  java_m33_t1_ex_4: [
    c("Temperatures never rise", "Those days get 0."),
    c("Strictly increasing", "Each waits 1 day."),
    c("Equal temps", "Strict > so equal days don't count as warmer."),
  ],
  java_m33_t1_ex_5: [
    c("Single number token", "Push and return it."),
    c("Division semantics", "Integer truncation toward zero per the spec."),
    c("Operand order", "Pop b then a; compute a op b (order matters for −, /)."),
  ],
  java_m33_t1_ex_6: [
    c("All duplicates removed", "Could empty the string."),
    c("No adjacent dupes", "String unchanged."),
    c("Cascading removals", "A pop can expose a new adjacent pair."),
  ],
  java_m33_t1_ex_7: [
    c("All same direction", "No collisions occur."),
    c("Equal-size opposite", "Both explode."),
    c("Right then left moving", "Only opposite-facing convergent asteroids collide."),
  ],
  java_m33_t1_ex_8: [
    c("Nested brackets", "Stack of (prevString, count) for correct nesting."),
    c("Multi-digit counts", "Accumulate digits before '['."),
    c("No brackets", "Plain passthrough."),
  ],
  java_m33_t1_ex_9: [
    c("k ≥ length", "Remove everything → \"0\"."),
    c("Leading zeros after removal", "Strip them; \"0\" if empty."),
    c("Already increasing digits", "Remove from the end (largest tail)."),
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
  console.log(`✅ edge-cases-8: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
