/**
 * seedEdgeCases6.js — GAP #6 edge-case catalog, batch 6 (~52).
 * COMPLETES the tree cluster: tree-traversal (15), tree-dfs (25), bst (12).
 * Data-only. Verify: node config/auditEdgeCases.mjs.
 */
import "dotenv/config";
import mongoose from "mongoose";
const c = (cs, h) => ({ case: cs, handling: h });

const A = {
  // ───────────────────────── tree-traversal (15) ─────────────────────────
  java_m35_t1_ex_1: [
    c("Empty tree", "Return immediately (null root)."),
    c("Single node", "Visits just the root."),
    c("Skewed tree", "Recursion depth equals height — risk of overflow when deep."),
  ],
  java_m35_t1_ex_10: [
    c("Empty tree", "Nothing to flatten."),
    c("Already right-skewed", "No structural change."),
    c("Left-heavy node", "Splice the left subtree into the right chain, then continue."),
  ],
  java_m35_t1_ex_11: [
    c("Empty tree", "Every order returns empty."),
    c("Single node", "All orders are [root]."),
    c("Recursive vs iterative", "Iterative needs an explicit stack/queue; recursion uses the call stack."),
  ],
  java_m35_t1_ex_12: [
    c("Empty tree", "Identity result per traversal."),
    c("Deep/skewed tree", "Prefer iterative to dodge stack overflow."),
    c("Order choice", "Pick pre/in/post/level by when the node must be processed."),
  ],
  java_m35_t1_ex_13: [
    c("Empty tree", "Empty list."),
    c("Iterative ordering", "Push right child before left so left pops first."),
    c("Single node", "[root]."),
  ],
  java_m35_t1_ex_15: [
    c("Empty tree", "Empty list."),
    c("Iterative trick", "Reverse a (node,right,left) pre-order to get post-order."),
    c("Single node", "[root]."),
  ],
  java_m35_t1_ex_17: [
    c("Empty tree", "No levels → empty list."),
    c("Single node", "One level: [root.val]."),
    c("Overflow on sums", "Use long (or double) when summing wide levels."),
  ],
  java_m35_t1_ex_2: [
    c("Empty tree", "Stack stays empty → no output."),
    c("Right-skewed tree", "Each pop immediately goes right."),
    c("Sorted output for BST", "In-order yields ascending keys."),
  ],
  java_m35_t1_ex_3: [
    c("Empty tree", "Empty result."),
    c("Single node", "One level."),
    c("Track level size", "Snapshot queue size per level to group correctly."),
  ],
  java_m35_t1_ex_4: [
    c("Empty tree", "Depth 0."),
    c("Single node", "Depth 1."),
    c("Skewed tree", "Depth equals node count."),
  ],
  java_m35_t1_ex_5: [
    c("Empty tree", "Empty view."),
    c("Left-only tree", "Each left node is the rightmost of its level."),
    c("Full tree", "Rightmost node per level."),
  ],
  java_m35_t1_ex_6: [
    c("Empty tree", "Empty result."),
    c("Single node", "One level, no reversal effect."),
    c("Alternate direction", "Reverse every other level (deque or reverse-on-collect)."),
  ],
  java_m35_t1_ex_7: [
    c("Empty tree", "Symmetric → true."),
    c("Single node", "Trivially symmetric."),
    c("Mirror compare", "Compare left.left with right.right and left.right with right.left."),
  ],
  java_m35_t1_ex_8: [
    c("Empty tree", "Diameter 0."),
    c("Single node", "Diameter 0 (no edges)."),
    c("Path not through root", "Track a global max while returning each node's height."),
  ],
  java_m35_t1_ex_9: [
    c("Empty tree", "All orders empty."),
    c("Single node", "All orders [root]."),
    c("Distinguishing orders", "Pre/in/post differ only in node-visit timing; level uses a queue."),
  ],

  // ───────────────────────── tree-dfs (25) ─────────────────────────
  java_m35_t2_ex_1: [
    c("One node is an ancestor of the other", "The ancestor itself is the LCA."),
    c("Nodes in different subtrees", "LCA is where the two recursions split."),
    c("Node may be absent", "Per spec, both are assumed present; otherwise guard."),
  ],
  java_m35_t2_ex_10: [
    c("Perfect tree", "Count via 2^h − 1 without visiting every node."),
    c("Last level partially filled", "Binary-search the last level's present leaves."),
    c("Empty tree", "Count 0."),
  ],
  java_m35_t2_ex_11: [
    c("Empty tree", "Identity result."),
    c("Combine children", "Most tree DFS returns info (height/sum/bool) merged at each node."),
    c("Skewed tree", "Watch recursion depth."),
  ],
  java_m35_t2_ex_12: [
    c("Empty tree", "Base case returns the neutral value."),
    c("Pass state down vs up", "Params carry context down; returns bubble results up."),
    c("Single node", "Often the trivial answer."),
  ],
  java_m35_t2_ex_13: [
    c("Empty input arrays", "Return null."),
    c("Duplicate values", "Ambiguous — problem assumes distinct keys."),
    c("Index lookup", "HashMap of in-order indices makes splits O(1) → O(n) total."),
  ],
  java_m35_t2_ex_2: [
    c("Empty tree", "Balanced → true."),
    c("Single node", "Balanced."),
    c("Early exit", "Return −1 height to short-circuit once imbalance is found."),
  ],
  java_m35_t2_ex_3: [
    c("Empty tree", "No path → false."),
    c("Single node equals target", "True only if it's a leaf summing to target."),
    c("Negative values", "Can't prune on sum exceeded — must explore."),
  ],
  java_m35_t2_ex_4: [
    c("All negative nodes", "Max path may be a single (largest) node; clamp child gains at 0."),
    c("Single node", "Answer is its value."),
    c("Split at a node", "Candidate = node + leftGain + rightGain; return one side upward."),
  ],
  java_m35_t2_ex_5: [
    c("Single node", "Needs one camera."),
    c("Empty tree", "0 cameras."),
    c("Greedy states", "Track covered / has-camera / needs-cover bottom-up."),
  ],
  java_m35_t2_ex_6: [
    c("Empty tree", "Returns null."),
    c("Single node", "Unchanged."),
    c("Full tree", "Swap children at every node."),
  ],
  java_m35_t2_ex_7: [
    c("Empty tree", "Serialize to a null marker; deserialize back to null."),
    c("Null children", "Encode them explicitly so structure is recoverable."),
    c("Values with delimiters", "Choose a delimiter not present in the data (or escape)."),
  ],
  java_m35_t2_ex_8: [
    c("Empty tree", "No paths."),
    c("Single node", "One path: [root]."),
    c("Backtracking the path list", "Remove the node on the way back up."),
  ],
  java_m35_t2_ex_9: [
    c("Both on one side", "Recurse into that subtree."),
    c("Split across the node", "Current node is the LCA."),
    c("Use BST ordering", "Compare values to choose a direction — O(h), no full search."),
  ],
  java_m35_t4_ex_1: [
    c("Empty tree", "No path sums to target."),
    c("Single node", "Path iff it equals target and is a leaf."),
    c("Negative values", "No pruning by overshoot."),
  ],
  java_m35_t4_ex_10: [
    c("Empty tree", "0 pseudo-palindromic paths."),
    c("Single node", "One digit → always pseudo-palindromic."),
    c("Parity bitmask", "At a leaf, ≤ 1 odd-count digit qualifies."),
  ],
  java_m35_t4_ex_11: [
    c("Root-to-leaf vs any-to-any", "Distinguish path families; use prefix sums for any-to-any."),
    c("Empty tree", "Identity result."),
    c("Single branch", "Path is the whole branch."),
  ],
  java_m35_t4_ex_12: [
    c("Negative values", "Prefix-sum HashMap handles them for downward paths."),
    c("Single node", "Trivial path."),
    c("Reset on backtrack", "Decrement the prefix count when leaving a node."),
  ],
  java_m35_t4_ex_2: [
    c("Empty tree", "No paths."),
    c("No path equals target", "Return an empty list."),
    c("Backtrack the running list", "Remove the last node after exploring both children."),
  ],
  java_m35_t4_ex_3: [
    c("All negative", "Clamp child contributions at 0; allow a single node."),
    c("Single node", "Its own value."),
    c("Through-node vs upward", "Return one side up, but consider both for the global max."),
  ],
  java_m35_t4_ex_4: [
    c("Empty tree", "Sum 0."),
    c("Single node", "The number is that digit."),
    c("Carry the running number", "num = num*10 + node.val down each path; add at leaves."),
  ],
  java_m35_t4_ex_5: [
    c("Negative values", "Prefix-sum map still works (paths needn't start at root)."),
    c("Path of length 1", "A single node equal to target counts."),
    c("Reset the map on backtrack", "Decrement to avoid cross-branch leakage."),
  ],
  java_m35_t4_ex_6: [
    c("All negative", "Best single node wins; clamp child gains at 0."),
    c("Single node", "Its value."),
    c("Mixed signs", "Drop a branch whose contribution is negative."),
  ],
  java_m35_t4_ex_7: [
    c("Empty tree", "0 good nodes."),
    c("Root only", "Root is always good (max so far = itself)."),
    c("Carry max on path", "A node is good if value ≥ the path maximum above it."),
  ],
  java_m35_t4_ex_8: [
    c("Empty tree", "No matching paths."),
    c("Target reached mid-path", "Only count at a leaf if the spec is root-to-leaf."),
    c("Backtrack", "Restore the running sum/list when returning."),
  ],
  java_m35_t4_ex_9: [
    c("Path needn't pass the root", "Use a running prefix sum + HashMap of counts."),
    c("Negative values", "Map approach is sign-agnostic."),
    c("Reset on return", "Decrement the prefix count when leaving the node."),
  ],

  // ───────────────────────── bst (12) ─────────────────────────
  java_m35_t3_ex_1: [
    c("Empty tree", "Not found."),
    c("Target at the root", "Return immediately."),
    c("Skewed BST", "Search is O(h) = O(n) in the worst case."),
  ],
  java_m35_t3_ex_2: [
    c("Insert into empty tree", "New node becomes the root."),
    c("Duplicate key", "Decide: ignore, go right, or count — be consistent."),
    c("Skewed growth", "Sorted inserts produce an O(n)-height chain."),
  ],
  java_m35_t3_ex_3: [
    c("Empty tree", "Valid → true."),
    c("Duplicate values", "Decide strict < vs ≤ at the boundaries."),
    c("Int overflow on bounds", "Use long (or null) for the min/max range."),
  ],
  java_m35_t3_ex_4: [
    c("k = 1", "Smallest = leftmost node."),
    c("k = n", "Largest = rightmost node."),
    c("In-order stops at k", "No need to traverse the whole tree."),
  ],
  java_m35_t3_ex_5: [
    c("One node ancestor of the other", "That ancestor is the LCA."),
    c("Split point", "Where the values straddle the node."),
    c("Use ordering", "Walk left/right by comparison — O(h)."),
  ],
  java_m35_t3_ex_6: [
    c("Delete a leaf", "Just unlink it."),
    c("One child", "Splice the child up."),
    c("Two children", "Replace with the in-order successor, then delete that."),
    c("Key absent", "Tree unchanged."),
  ],
  java_m35_t3_ex_7: [
    c("Empty array", "Return null."),
    c("Single element", "A single-node tree."),
    c("Pick the middle root", "Keeps the BST height-balanced."),
  ],
  java_m35_t3_ex_8: [
    c("Empty tree", "hasNext is false from the start."),
    c("Single node", "One next() then exhausted."),
    c("Amortised O(1)", "Push the left spine lazily; each node is pushed/popped once."),
  ],
  java_m35_t3_ex_9: [
    c("Empty tree", "No change."),
    c("Single node", "Stays the same (no greater keys)."),
    c("Reverse in-order", "Right→node→left with a running suffix sum."),
  ],
  java_m35_t3_ex_10: [
    c("Two adjacent swapped nodes", "One dip in the in-order sequence."),
    c("Two non-adjacent swapped nodes", "Two dips — first/last offenders."),
    c("O(1) space", "Morris in-order to find and swap them back."),
  ],
  java_m35_t3_ex_11: [
    c("Empty tree", "All operations handle null gracefully."),
    c("Skewed tree", "O(h) degrades to O(n); balancing keeps it O(log n)."),
    c("In-order validates", "Sorted in-order confirms the BST invariant."),
  ],
  java_m35_t3_ex_12: [
    c("Range queries", "Prune subtrees outside [lo, hi] using the ordering."),
    c("kth-smallest", "In-order index gives it directly."),
    c("Balanced vs skewed", "Height drives all operation costs."),
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
  console.log(`✅ edge-cases-6: ${updated} attached${missing ? `, ${missing} MISSING` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
