/**
 * seedEdgeCases5.js — GAP #6 edge-case catalog, batch 5 (~55).
 * COMPLETES eight patterns: graph-traversal (14), stack-queue (11),
 * binary-search-on-answer (7), intervals (5), shortest-path (5),
 * topological-sort (5), greedy (4), union-find (4). Data-only.
 * Verify: node config/auditEdgeCases.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const c = (cs, h) => ({ case: cs, handling: h });

const A = {
  // ───────────────────────── graph-traversal (14) ─────────────────────────
  java_m37_t1_ex_2: [
    c("Self-loops", "An edge u-u adds u to its own list — allow or reject per the spec."),
    c("Parallel edges", "Duplicates appear twice unless deduped."),
    c("Isolated vertices", "Pre-size the list for all n nodes so loners still exist."),
  ],
  java_m37_t1_ex_3: [
    c("Disconnected graph", "BFS from one source misses other components — loop over all unvisited starts."),
    c("Visited guard", "Mark on enqueue (not dequeue) to avoid duplicate queueing."),
    c("Single node", "Visits just that node."),
  ],
  java_m37_t1_ex_4: [
    c("Cycle", "Visited set prevents infinite recursion."),
    c("Disconnected graph", "Recurse from every unvisited vertex."),
    c("Deep graph", "Recursion can stack-overflow — note the iterative alternative."),
  ],
  java_m37_t1_ex_5: [
    c("Visit order vs recursion", "Push neighbours in reverse to mimic recursive order."),
    c("Cycle", "Mark visited on pop (or push) consistently to avoid reprocessing."),
    c("Disconnected graph", "Restart the stack from each unvisited node."),
  ],
  java_m37_t1_ex_6: [
    c("No edges", "Each vertex is its own component → n components."),
    c("Fully connected", "One component."),
    c("Isolated vertices", "Counted as singleton components."),
  ],
  java_m37_t1_ex_7: [
    c("Tree (no cycle)", "DFS never revisits a non-parent → false."),
    c("Parent edge", "Ignore the edge back to the parent; only a different visited node means a cycle."),
    c("Disconnected", "Check every component."),
  ],
  java_m37_t1_ex_8: [
    c("source == destination", "Trivially true (path of length 0)."),
    c("No path", "BFS/DFS exhausts without reaching the target → false."),
    c("Disconnected nodes", "Different components → false."),
  ],
  java_m37_t2_ex_2: [
    c("Empty grid", "0 islands."),
    c("All water", "0 islands."),
    c("All land", "1 island."),
    c("Visited marking", "Sink visited land (or use a seen set) to avoid recounting."),
  ],
  java_m37_t2_ex_3: [
    c("No land", "Max area 0."),
    c("Single cell island", "Area 1."),
    c("Whole grid is land", "Area = rows*cols."),
  ],
  java_m37_t2_ex_4: [
    c("No fresh oranges", "Time 0."),
    c("Unreachable fresh orange", "Return −1."),
    c("No rotten to start", "If any fresh exists → −1; else 0."),
    c("Multi-source BFS", "Seed all rotten cells at level 0."),
  ],
  java_m37_t2_ex_5: [
    c("Start color == new color", "Return immediately to avoid infinite recursion."),
    c("Single cell", "Fill just that cell."),
    c("Whole region same color", "Entire connected block recolors."),
  ],
  java_m37_t2_ex_6: [
    c("Empty graph (null node)", "Return null."),
    c("Single node, no edges", "Clone the lone node."),
    c("Cycles", "A visited→clone HashMap prevents infinite cloning."),
  ],
  java_m37_t2_ex_7: [
    c("Unknown variable", "Query with an unseen symbol → −1."),
    c("a/a query", "Equals 1 only if a appears in the graph."),
    c("Disconnected variables", "No path between them → −1."),
  ],
  java_m37_t2_ex_8: [
    c("Single row/column grid", "Borders still seed both oceans correctly."),
    c("Flat heights", "Water reaches everywhere → all cells qualify."),
    c("Reverse-flow BFS", "Start from ocean borders inward (≥ neighbour) to avoid O(n²) per cell."),
  ],

  // ───────────────────────── stack-queue (11) ─────────────────────────
  java_m33_t5_ex_1: [
    c("Capacity 1", "Every put may evict the previous key."),
    c("Updating an existing key", "Move it to most-recent and overwrite the value."),
    c("get on a missing key", "Return −1 without touching recency."),
  ],
  java_m33_t5_ex_2: [
    c("Cooldown n = 0", "No idle slots; answer is just the task count."),
    c("One task type", "Idle gaps fill the (count−1)*(n+1) frame."),
    c("Many distinct tasks", "Enough variety means no idling — answer is task count."),
  ],
  java_m33_t5_ex_3: [
    c("User follows themselves", "Their own tweets must appear; avoid double counting."),
    c("Unfollow not-followed", "No-op."),
    c("Empty feed", "Return an empty list."),
  ],
  java_m33_t5_ex_4: [
    c("Nested parentheses", "Push the running result + sign on '(' and restore on ')'."),
    c("Unary minus / leading sign", "Initialise sign to +1; handle a leading '-'."),
    c("Spaces", "Skip whitespace while parsing."),
  ],
  java_m33_t5_ex_5: [
    c("Leading zero", "'0' alone can't decode → 0 ways from that point."),
    c("'10' / '20'", "Only valid as a two-digit decode (no single 0)."),
    c("Numbers > 26", "Two-digit decode invalid; only the single-digit path counts."),
  ],
  java_m33_t5_ex_6: [
    c("Capacity 0", "Nothing is ever cached."),
    c("Frequency tie", "Evict the least-recently-used within the min-frequency bucket."),
    c("Update existing key", "Bump its frequency and value together."),
  ],
  java_m33_t5_ex_7: [
    c("Out-of-order updates", "A correction may rewrite an old timestamp — keep time→price."),
    c("Same timestamp update", "Overwrite; adjust the price-count multiset."),
    c("max/min after correction", "Maintained via a TreeMap of price→count."),
  ],
  java_m33_t5_ex_8: [
    c("Visit after going back", "A new visit clears the forward history."),
    c("back/forward beyond bounds", "Clamp to the oldest / newest page."),
    c("Single page", "back/forward stay put."),
  ],
  java_m33_t5_ex_9: [
    c("Pop when empty", "Guard against underflow."),
    c("Duplicate minimums", "Push to the min-stack on ≤ so equal mins pop correctly."),
    c("getMin after pops", "The min-stack top always mirrors the current minimum."),
  ],
  java_m33_t5_ex_10: [
    c("Choosing the structure", "Recency→DLL+map; precedence→stack; frequency→bucketed map; scheduling→heap."),
    c("Empty state", "Each design returns its defined empty/sentinel."),
    c("Composability", "Combine map + list + heap for O(1)/O(log n) operations."),
  ],
  java_m33_t5_ex_11: [
    c("Stack vs queue vs deque", "Match the ADT to LIFO / FIFO / both-ends access."),
    c("PriorityQueue ordering", "Comparator defines pop order; not FIFO."),
    c("Empty operations", "poll/peek must handle emptiness."),
  ],

  // ───────────────────────── binary-search-on-answer (7) ─────────────────────────
  java_m39_t2_ex_2: [
    c("piles fit in h trivially", "Min speed could be the max pile / required rate — search lower bound."),
    c("h equals number of piles", "Speed must equal the largest pile."),
    c("Feasibility check", "hoursNeeded(speed) ≤ h is monotonic in speed → binary search."),
  ],
  java_m39_t2_ex_3: [
    c("days == n", "Capacity is the single heaviest package."),
    c("days == 1", "Capacity is the total weight."),
    c("Search range", "[max weight, total weight]; smallest feasible capacity wins."),
  ],
  java_m39_t2_ex_4: [
    c("k == n", "Each element its own subarray → answer is the max element."),
    c("k == 1", "One subarray → answer is the total sum."),
    c("Feasibility", "Greedily count parts with sum ≤ mid; minimise the largest sum."),
  ],
  java_m39_t2_ex_5: [
    c("One array empty", "Median comes entirely from the other."),
    c("Even vs odd total length", "Average the two middle values, or take the single middle."),
    c("Partition validity", "maxLeftA ≤ minRightB and maxLeftB ≤ minRightA."),
  ],
  java_m39_t2_ex_6: [
    c("Equal-length arrays", "Partition each half so left and right counts match."),
    c("Duplicates across arrays", "Boundary comparisons still hold with equal values."),
    c("Search the smaller array", "Binary search on min(m,n) for O(log min(m,n))."),
  ],
  java_m39_t2_ex_8: [
    c("All elements equal", "Any split gives the same largest sum."),
    c("k larger than needed", "Extra parts may be empty/degenerate — clamp feasibility."),
    c("Monotonic feasibility", "Larger mid → fewer parts needed; binary-search the boundary."),
  ],
  java_m39_t2_ex_9: [
    c("days == n", "Heaviest package is the answer."),
    c("Single package", "Capacity is that weight."),
    c("Smallest feasible capacity", "Lower-bound binary search on the answer space."),
  ],

  // ───────────────────────── intervals (5) ─────────────────────────
  java_m41_5_t2_ex_1: [
    c("New interval before all / after all", "Insert at the front or append at the end."),
    c("No overlap", "Insert in sorted position, no merging."),
    c("Overlaps several", "Merge the whole overlapping run into one."),
  ],
  java_m41_5_t2_ex_2: [
    c("No overlaps", "Remove 0."),
    c("All identical", "Keep one, remove the rest."),
    c("Greedy by end time", "Sort by end; drop the interval that ends later on a clash."),
  ],
  java_m41_5_t2_ex_3: [
    c("Touching at a point", "Decide if [1,2] and [2,3] count as overlapping (inclusive)."),
    c("All overlapping", "One arrow bursts them all."),
    c("No overlap", "One arrow per balloon."),
  ],
  java_m41_5_t2_ex_4: [
    c("Single interval", "Returned unchanged."),
    c("Fully nested intervals", "Outer absorbs the inner."),
    c("Adjacent (touching) intervals", "Merge if the spec treats [1,2],[2,3] as overlapping."),
    c("Already disjoint & sorted", "No merges; still sort first to be safe."),
  ],
  java_m41_5_t2_ex_5: [
    c("All meetings overlap", "Need as many rooms as meetings."),
    c("No overlaps", "One room suffices."),
    c("End equals next start", "Decide if a room frees exactly at the boundary (reuse)."),
  ],

  // ───────────────────────── shortest-path (5) ─────────────────────────
  java_m37_t4_ex_13: [
    c("Negative-weight cycle", "A relax on the n-th pass signals a negative cycle → report it."),
    c("Unreachable nodes", "Distance stays infinity."),
    c("Negative edges (no cycle)", "Bellman-Ford handles them where Dijkstra can't."),
  ],
  java_m37_t4_ex_2: [
    c("Negative edges", "Dijkstra is invalid — note the precondition (non-negative weights)."),
    c("Unreachable node", "Remains at infinity."),
    c("Stale heap entries", "Skip a popped node whose distance is outdated (lazy deletion)."),
  ],
  java_m37_t4_ex_3: [
    c("Negative cycle", "A negative diagonal entry after the run signals one."),
    c("Disconnected pairs", "Stay at infinity."),
    c("Self distance", "dist[i][i] starts at 0."),
  ],
  java_m37_t4_ex_4: [
    c("Some node unreachable", "Return −1 if any node never receives the signal."),
    c("Single node", "Delay is 0."),
    c("Parallel edges", "Keep the minimum-weight edge."),
  ],
  java_m37_t4_ex_5: [
    c("No path", "Probability 0."),
    c("Direct edge", "Its probability is a candidate maximum."),
    c("Maximise (not minimise)", "Use a max-heap on probability (multiply along the path)."),
  ],

  // ───────────────────────── topological-sort (5) ─────────────────────────
  java_m37_t3_ex_2: [
    c("Cycle present", "Queue empties before all nodes are output → no valid order."),
    c("Multiple valid orders", "Any order respecting in-degrees is acceptable."),
    c("Isolated nodes", "In-degree 0 → queued first."),
  ],
  java_m37_t3_ex_3: [
    c("Cycle present", "A back edge (grey node) means no topological order."),
    c("Disconnected DAG", "Run DFS from every unvisited node."),
    c("Output order", "Reverse the post-order finishing times."),
  ],
  java_m37_t3_ex_4: [
    c("Cyclic prerequisites", "Can't finish → false."),
    c("No prerequisites", "Trivially finishable → true."),
    c("Self-prerequisite", "A course requiring itself is an immediate cycle."),
  ],
  java_m37_t3_ex_5: [
    c("Cycle present", "Return an empty array (impossible)."),
    c("No prerequisites", "Any permutation (e.g., 0..n−1) is valid."),
    c("Multiple valid orders", "Return any topological order."),
  ],
  java_m37_t3_ex_6: [
    c("Back edge to a grey node", "Indicates a directed cycle."),
    c("Cross/forward edges", "Edges to black nodes are NOT cycles."),
    c("Disconnected graph", "Check from every unvisited node."),
  ],

  // ───────────────────────── greedy (4) ─────────────────────────
  java_m41_5_t1_ex_1: [
    c("Total gas < total cost", "No solution → return −1."),
    c("Single station", "Feasible iff gas ≥ cost there."),
    c("Reset start", "When the running tank goes negative, the next station is the new candidate start."),
  ],
  java_m41_5_t1_ex_2: [
    c("All equal ratings", "Everyone gets 1 candy."),
    c("Strictly increasing", "Candies climb 1,2,3,…"),
    c("Two passes", "Left-to-right then right-to-left; take the max at each child."),
  ],
  java_m41_5_t1_ex_3: [
    c("More cookies than children", "Extra cookies are unused."),
    c("No cookie satisfies a child", "That child stays unfed."),
    c("Sort both", "Greedily give the smallest adequate cookie to the least greedy child."),
  ],
  java_m41_5_t1_ex_4: [
    c("First customer pays 10 or 20", "Can't make change → false."),
    c("Only 5s", "Always able to give change."),
    c("Prefer giving a 10+5 over three 5s", "Keep 5s for flexibility when changing a 20."),
  ],

  // ───────────────────────── union-find (4) ─────────────────────────
  java_m37_t5_ex_2: [
    c("Union of already-connected nodes", "No-op (same root)."),
    c("Self-union", "find(x) == find(x) → no change."),
    c("Path compression + rank", "Keeps find nearly O(1) amortised (inverse-Ackermann)."),
  ],
  java_m37_t5_ex_3: [
    c("Cycle-forming edge", "Skip it — its endpoints are already connected."),
    c("Disconnected graph", "MST undefined / forest; report per spec."),
    c("Equal-weight edges", "Either order is fine for a valid MST."),
  ],
  java_m37_t5_ex_4: [
    c("No connections", "n provinces (each city alone)."),
    c("All connected", "1 province."),
    c("Self-link on the diagonal", "isConnected[i][i] is always 1 — ignore it."),
  ],
  java_m37_t5_ex_5: [
    c("Single point", "Cost 0."),
    c("Two points", "Cost is their Manhattan distance."),
    c("Complete graph", "Build all pairwise edges, then MST (Kruskal/Prim)."),
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
  console.log(`✅ edge-cases-5: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
