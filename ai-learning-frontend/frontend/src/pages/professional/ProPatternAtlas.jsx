/**
 * ProPatternAtlas — /pro/java/patterns
 *
 * Shows 70+ interview coding patterns, how many drill exercises exist per
 * pattern, which topics teach each one, and a Quick Drill button.
 *
 * D3.4: natural home for the pattern_match work.
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { proGetPatternAtlas } from "../../services/api";
import PatternDrill from "../../components/pro/PatternDrill";

// 14 canonical patterns — label + when-to-use description
const PATTERN_CATALOG = [
  {
    id: "two_pointer",
    label: "Two Pointers",
    icon: "⇌",
    color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
    when: "Sorted arrays or linked lists. Two indices converging inward or moving same direction removes the inner loop — O(n) instead of O(n²).",
  },
  {
    id: "sliding_window",
    label: "Sliding Window",
    icon: "⬜",
    color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30",
    when: "Contiguous subarray/substring with a constraint. Expand right, shrink left — each element enters and leaves the window at most once.",
  },
  {
    id: "prefix_sum",
    label: "Prefix Sum",
    icon: "Σ",
    color: "text-teal-500 bg-teal-500/10 border-teal-500/30",
    when: "Repeated range-sum queries. One O(n) precomputation pass makes every query O(1). Also enables difference arrays for range updates.",
  },
  {
    id: "binary_search",
    label: "Binary Search",
    icon: "½",
    color: "text-green-500 bg-green-500/10 border-green-500/30",
    when: "Sorted data or a monotone predicate. Halves the search space each step. Works on index, value, or answer space — not just arrays.",
  },
  {
    id: "hash_map",
    label: "Hash Map / Set",
    icon: "#",
    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
    when: "O(1) lookup or membership at the cost of O(n) space. Turns two-pass O(n²) into one-pass O(n). Classic: two-sum, anagram, frequency count.",
  },
  {
    id: "monotonic_stack",
    label: "Monotonic Stack",
    icon: "↑",
    color: "text-orange-500 bg-orange-500/10 border-orange-500/30",
    when: "Next greater / next smaller element problems. Maintain a stack whose elements are always increasing or decreasing — each element pushed/popped once.",
  },
  {
    id: "dfs",
    label: "DFS",
    icon: "↓",
    color: "text-red-500 bg-red-500/10 border-red-500/30",
    when: "Explore all paths, connected components, or cycle detection. Naturally recursive (or explicit stack). Mark visited to avoid revisits.",
  },
  {
    id: "bfs",
    label: "BFS",
    icon: "~",
    color: "text-pink-500 bg-pink-500/10 border-pink-500/30",
    when: "Shortest path on unweighted graphs, level-order traversal, or spreading problems (islands, walls). Queue-based; explores by layers.",
  },
  {
    id: "topological_sort",
    label: "Topological Sort",
    icon: "→",
    color: "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/30",
    when: "Ordering tasks with dependencies (DAG). Kahn's (BFS + in-degree) detects cycles; DFS post-order also works. Course schedule problems.",
  },
  {
    id: "dynamic_programming",
    label: "Dynamic Programming",
    icon: "◫",
    color: "text-violet-500 bg-violet-500/10 border-violet-500/30",
    when: "Overlapping subproblems + optimal substructure. Memoize top-down or fill a table bottom-up. Spot it when brute force is exponential but subproblems repeat.",
  },
  {
    id: "greedy",
    label: "Greedy",
    icon: "✦",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    when: "Locally optimal choice = globally optimal result (must be proven). Common in interval scheduling, Huffman, fractional knapsack. No backtracking.",
  },
  {
    id: "backtracking",
    label: "Backtracking",
    icon: "↩",
    color: "text-rose-500 bg-rose-500/10 border-rose-500/30",
    when: "Enumerate all valid configurations with pruning. Choose → explore → unchoose. Used for subsets, permutations, N-Queens, Sudoku.",
  },
  {
    id: "divide_and_conquer",
    label: "Divide & Conquer",
    icon: "÷",
    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/30",
    when: "Split into independent subproblems, solve recursively, merge. O(n log n) for many problems. Merge sort, quick sort, binary search, closest pair.",
  },
  {
    id: "union_find",
    label: "Union Find",
    icon: "∪",
    color: "text-sky-500 bg-sky-500/10 border-sky-500/30",
    when: "Dynamic connectivity — grouping elements into disjoint sets. Path compression + union by rank gives near-O(1) per op. Number of provinces, redundant connection.",
  },
  {
    id: "bit_manipulation",
    label: "Bit Manipulation",
    icon: "&",
    color: "text-lime-500 bg-lime-500/10 border-lime-500/30",
    when: "Direct operations on the binary representation. XOR cancels duplicates, AND/OR mask bits, shifts multiply/divide by 2. O(1) tricks for power-of-2, counting bits, finding single elements.",
  },
  { id: "fast_slow_pointers", label: "Fast & Slow Pointers", icon: "🐢", color: "text-blue-500 bg-blue-500/10 border-blue-500/30", when: "Cycle detection and midpoints in linked lists/sequences. A pointer at 2× speed meets the slow one inside a cycle (Floyd) — O(1) space." },
  { id: "cyclic_sort", label: "Cyclic Sort", icon: "🔁", color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30", when: "Arrays holding numbers in a known range 1..n. Place each value at its index in O(n)/O(1) to find missing/duplicate numbers without extra space." },
  { id: "in_place_reversal", label: "In-Place Reversal", icon: "↩", color: "text-teal-500 bg-teal-500/10 border-teal-500/30", when: "Reverse a linked list or sub-list by re-pointing nodes — O(1) extra space. Foundation for reverse-in-k-groups and palindrome-list checks." },
  { id: "merge_intervals", label: "Merge Intervals", icon: "⫝", color: "text-green-500 bg-green-500/10 border-green-500/30", when: "Overlapping intervals. Sort by start, then merge when current.start ≤ prev.end. Solves meeting rooms, insert/merge, free-time." },
  { id: "kadane", label: "Kadane's Algorithm", icon: "📈", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30", when: "Maximum-sum contiguous subarray in O(n): keep a running sum, reset to 0 (or restart) when it goes negative; track the best." },
  { id: "dutch_national_flag", label: "Dutch National Flag", icon: "🇳🇱", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30", when: "Three-way partition in one pass (sort colors, segregate < = >). Three pointers (low/mid/high) — O(n)/O(1)." },
  { id: "top_k_heap", label: "Top-K (Heap)", icon: "🔝", color: "text-sky-500 bg-sky-500/10 border-sky-500/30", when: "K largest/smallest/most-frequent. A size-K heap gives O(n log k) instead of full sort. Classic: K closest points, top-K frequent." },
  { id: "two_heaps", label: "Two Heaps", icon: "⚖", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/30", when: "Running median / balance two halves. A max-heap (lower half) + min-heap (upper half) give the median in O(1), insert in O(log n)." },
  { id: "k_way_merge", label: "K-Way Merge", icon: "🔀", color: "text-violet-500 bg-violet-500/10 border-violet-500/30", when: "Merge K sorted lists/streams. A min-heap of the K heads pops the global minimum each step — O(N log k). Merge-K-lists, smallest range." },
  { id: "tree_dfs", label: "Tree DFS", icon: "🌲", color: "text-purple-500 bg-purple-500/10 border-purple-500/30", when: "Recursive pre/in/post-order traversal. The default for path sums, depth, and any 'process node + recurse children' tree problem." },
  { id: "tree_bfs", label: "Tree BFS (Level Order)", icon: "📚", color: "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/30", when: "Level-by-level traversal with a queue. For level averages, right-side view, zigzag, and minimum depth." },
  { id: "lowest_common_ancestor", label: "Lowest Common Ancestor", icon: "🜍", color: "text-pink-500 bg-pink-500/10 border-pink-500/30", when: "Find the deepest node that is an ancestor of two nodes. Recurse: if both sides return a node, the current node is the LCA." },
  { id: "bst_operations", label: "Binary Search Tree", icon: "🌳", color: "text-rose-500 bg-rose-500/10 border-rose-500/30", when: "Ordered tree: left < node < right. In-order traversal is sorted; search/insert/delete are O(h). Kth-smallest, validate-BST, range queries." },
  { id: "trie", label: "Trie (Prefix Tree)", icon: "🔤", color: "text-red-500 bg-red-500/10 border-red-500/30", when: "Prefix-based string lookups. Each node = a character; words share prefixes. Autocomplete, word search, prefix counting in O(len)." },
  { id: "segment_tree", label: "Segment Tree", icon: "🪵", color: "text-orange-500 bg-orange-500/10 border-orange-500/30", when: "Range queries (sum/min/max) AND point/range updates in O(log n). Heavier than prefix sums but supports updates; lazy propagation for range updates." },
  { id: "fenwick_tree", label: "Fenwick Tree (BIT)", icon: "🌿", color: "text-amber-500 bg-amber-500/10 border-amber-500/30", when: "Prefix sums with point updates in O(log n) using a compact array and the lowbit trick — simpler/lighter than a segment tree for sums." },
  { id: "dijkstra", label: "Dijkstra's Algorithm", icon: "🗺", color: "text-blue-500 bg-blue-500/10 border-blue-500/30", when: "Shortest path from a source on non-negative weighted graphs. A min-heap by tentative distance relaxes edges — O((V+E) log V)." },
  { id: "bellman_ford", label: "Bellman-Ford", icon: "💱", color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30", when: "Shortest path that tolerates NEGATIVE edges and detects negative cycles. Relax all edges V−1 times — O(VE), slower than Dijkstra." },
  { id: "floyd_warshall", label: "Floyd-Warshall", icon: "🔳", color: "text-teal-500 bg-teal-500/10 border-teal-500/30", when: "All-pairs shortest paths via DP over intermediate nodes — O(V³). Good for dense, small graphs and transitive closure." },
  { id: "minimum_spanning_tree", label: "Minimum Spanning Tree", icon: "🕸", color: "text-green-500 bg-green-500/10 border-green-500/30", when: "Cheapest set of edges connecting all nodes. Kruskal (sort edges + union-find) or Prim (grow from a node with a heap)." },
  { id: "strongly_connected_components", label: "Strongly Connected Components", icon: "🔗", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30", when: "Maximal mutually-reachable groups in a directed graph. Tarjan (one DFS) or Kosaraju (two DFS + transpose) — O(V+E)." },
  { id: "bipartite_check", label: "Bipartite / Graph Coloring", icon: "🎨", color: "text-sky-500 bg-sky-500/10 border-sky-500/30", when: "Can nodes be 2-colored with no same-color edge? BFS/DFS coloring detects odd cycles — for scheduling, matching, conflict graphs." },
  { id: "flood_fill", label: "Flood Fill / Grid Search", icon: "🌊", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/30", when: "Spread through connected grid cells (4/8-directional) via BFS/DFS. Number-of-islands, surrounded regions, paint-fill." },
  { id: "bidirectional_search", label: "Bidirectional BFS", icon: "↔", color: "text-violet-500 bg-violet-500/10 border-violet-500/30", when: "Shortest path between two known endpoints. Search from both ends until the frontiers meet — roughly halves the explored space." },
  { id: "knapsack_dp", label: "0/1 Knapsack DP", icon: "🎒", color: "text-purple-500 bg-purple-500/10 border-purple-500/30", when: "Choose items under a capacity to maximize value. dp[i][w] = best using first i items within weight w; the template for subset/partition DP." },
  { id: "longest_common_subsequence", label: "Longest Common Subsequence", icon: "🧬", color: "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/30", when: "Compare two sequences. 2-D DP: match → diagonal+1, else max of left/up. Basis for diff tools and edit-distance." },
  { id: "longest_increasing_subsequence", label: "Longest Increasing Subsequence", icon: "📊", color: "text-pink-500 bg-pink-500/10 border-pink-500/30", when: "Longest strictly-increasing subsequence. O(n²) DP, or O(n log n) with patience sorting (binary search into tails)." },
  { id: "edit_distance", label: "Edit Distance", icon: "✏", color: "text-rose-500 bg-rose-500/10 border-rose-500/30", when: "Min insert/delete/replace to transform one string to another. 2-D DP over prefixes — spell-check, DNA alignment, fuzzy match." },
  { id: "grid_dp", label: "Grid DP", icon: "▦", color: "text-red-500 bg-red-500/10 border-red-500/30", when: "DP over a 2-D grid: each cell depends on neighbors above/left. Unique paths, min path sum, maximal square." },
  { id: "interval_dp", label: "Interval DP", icon: "⟦⟧", color: "text-orange-500 bg-orange-500/10 border-orange-500/30", when: "DP over ranges [i,j], combining sub-intervals by a split point k. Burst balloons, matrix-chain, palindrome partitioning." },
  { id: "bitmask_dp", label: "Bitmask DP", icon: "🎭", color: "text-amber-500 bg-amber-500/10 border-amber-500/30", when: "DP where the state is a set encoded as bits (n ≤ ~20). Traveling salesman, assignment, subset enumeration over a small universe." },
  { id: "tree_dp", label: "Tree DP", icon: "🌴", color: "text-blue-500 bg-blue-500/10 border-blue-500/30", when: "DP on a tree via post-order: combine children's results at each node. House-robber-III, diameter, max independent set on trees." },
  { id: "digit_dp", label: "Digit DP", icon: "🔢", color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30", when: "Count numbers in [L,R] with a digit property. DP over position + tight-bound flag + carried state — counting problems, not enumeration." },
  { id: "coin_change", label: "Coin Change / Unbounded Knapsack", icon: "🪙", color: "text-teal-500 bg-teal-500/10 border-teal-500/30", when: "Min coins / number of ways to make an amount with unlimited supply. 1-D DP iterating amounts — the unbounded-knapsack family." },
  { id: "subset_sum", label: "Subset Sum / Partition", icon: "➗", color: "text-green-500 bg-green-500/10 border-green-500/30", when: "Can a subset reach a target sum? Boolean knapsack DP — equal-partition, target-sum, last-stone-weight." },
  { id: "matrix_chain", label: "Matrix Chain Multiplication", icon: "✖", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30", when: "Optimal parenthesization to minimize cost over a chain. Interval DP choosing the best split — the classic interval-DP exemplar." },
  { id: "kmp", label: "KMP String Matching", icon: "🔍", color: "text-sky-500 bg-sky-500/10 border-sky-500/30", when: "Find a pattern in text in O(n+m). Precompute the prefix-function (failure table) so mismatches skip ahead without re-scanning." },
  { id: "rabin_karp", label: "Rabin-Karp", icon: "#️⃣", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/30", when: "Substring/anagram search via a rolling hash — slide the window, update the hash in O(1). Great for multiple-pattern and repeated-substring." },
  { id: "z_algorithm", label: "Z-Algorithm", icon: "Z", color: "text-violet-500 bg-violet-500/10 border-violet-500/30", when: "Compute, for each position, the longest prefix-match — O(n). Pattern matching and string-periodicity problems." },
  { id: "manacher", label: "Manacher's Algorithm", icon: "🪞", color: "text-purple-500 bg-purple-500/10 border-purple-500/30", when: "Longest palindromic substring in O(n) by reusing previously computed palindrome radii around a center." },
  { id: "string_hashing", label: "String Hashing", icon: "🧮", color: "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/30", when: "Polynomial/rolling hashes for O(1) substring comparison after O(n) preprocessing — dedup, repeated substrings, fast equality." },
  { id: "sweep_line", label: "Sweep Line", icon: "🧹", color: "text-pink-500 bg-pink-500/10 border-pink-500/30", when: "Process sorted events (start/end) as a line sweeps across. Skyline, max overlapping intervals, closest pair, rectangle area." },
  { id: "difference_array", label: "Difference Array", icon: "Δ", color: "text-rose-500 bg-rose-500/10 border-rose-500/30", when: "Many range-add updates then one final read. Mark +v at L and −v at R+1; prefix-sum once at the end — O(1) per update." },
  { id: "fast_exponentiation", label: "Fast Exponentiation", icon: "⚡", color: "text-red-500 bg-red-500/10 border-red-500/30", when: "Compute a^n (or matrix^n) in O(log n) by squaring. Modular power for hashing/crypto; matrix power for linear recurrences (Fibonacci)." },
  { id: "modular_arithmetic", label: "Modular Arithmetic", icon: "%", color: "text-orange-500 bg-orange-500/10 border-orange-500/30", when: "Keep huge results bounded with mod. Modular inverse (Fermat) for division, combinatorics under a prime mod — counting problems." },
  { id: "sieve_of_eratosthenes", label: "Sieve of Eratosthenes", icon: "🔱", color: "text-amber-500 bg-amber-500/10 border-amber-500/30", when: "All primes up to N in ~O(N log log N) by crossing out multiples. Smallest-prime-factor variant gives fast factorization." },
  { id: "gcd_euclid", label: "GCD / Euclid", icon: "∥", color: "text-blue-500 bg-blue-500/10 border-blue-500/30", when: "Greatest common divisor in O(log min) via gcd(a,b)=gcd(b,a%b). LCM, fractions, cycle lengths, and the extended form for inverses." },
  { id: "combinatorics", label: "Combinatorics", icon: "🎲", color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30", when: "Counting arrangements/selections: nPr, nCr, Pascal's triangle, stars-and-bars. Often under a modulus with precomputed factorials." },
  { id: "meet_in_the_middle", label: "Meet in the Middle", icon: "🤝", color: "text-teal-500 bg-teal-500/10 border-teal-500/30", when: "Halve an exponential search: enumerate each half (2^(n/2)) and combine via sort/hash. Subset-sum for n≈40, 4-sum variants." },
  { id: "ternary_search", label: "Ternary Search", icon: "⅓", color: "text-green-500 bg-green-500/10 border-green-500/30", when: "Find the extremum of a UNIMODAL function. Discard a third each step — O(log n) — for peak-finding and optimization over a convex curve." },
  { id: "binary_lifting", label: "Binary Lifting", icon: "🪜", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30", when: "Answer ancestor/LCA and jump-2^k queries on trees in O(log n) after O(n log n) preprocessing of sparse ancestor tables." },
  { id: "sparse_table", label: "Sparse Table", icon: "🧱", color: "text-sky-500 bg-sky-500/10 border-sky-500/30", when: "O(1) idempotent range queries (min/max/gcd) on a STATIC array after O(n log n) preprocessing — faster than a segment tree when there are no updates." },
  { id: "monotonic_deque", label: "Monotonic Deque", icon: "🪟", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/30", when: "Sliding-window max/min in O(n): a deque keeps indices in monotonic order, evicting dominated elements from the back." },
  { id: "reservoir_sampling", label: "Reservoir Sampling", icon: "🎰", color: "text-violet-500 bg-violet-500/10 border-violet-500/30", when: "Pick k uniform random items from a stream of unknown length in O(1) space — replace the i-th element with probability k/i." },
  { id: "quickselect", label: "Quickselect", icon: "🎯", color: "text-purple-500 bg-purple-500/10 border-purple-500/30", when: "Kth-smallest/largest in average O(n) by partitioning toward only the side that contains k — no full sort needed." },
  { id: "matrix_traversal", label: "Matrix Traversal", icon: "🧭", color: "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/30", when: "Walk a 2-D grid in spiral/diagonal order or rotate/transpose in place — boundary pointers and index math, O(1) extra space." },
  { id: "game_theory", label: "Game Theory (Grundy)", icon: "♟", color: "text-pink-500 bg-pink-500/10 border-pink-500/30", when: "Two-player optimal-play games. Minimax/DP for win-lose states; Sprague-Grundy numbers (nim) for impartial games." },
];

export default function ProPatternAtlas() {
  const navigate = useNavigate();
  const { trackSlug } = useParams();
  const [atlas,   setAtlas]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [drillPattern, setDrillPattern] = useState(null); // { exercises, label }

  useEffect(() => {
    proGetPatternAtlas("pro_java")
      .then(r => setAtlas(r.data?.data))
      .catch(() => setAtlas({ byPattern: {}, topicMap: {}, totalExercises: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const { byPattern = {}, topicMap = {}, totalExercises = 0 } = atlas || {};

  // Build drill exercises for PatternDrill — needs the blanks[].options shape.
  // We pass a synthetic exercise list that PatternDrill can handle.
  const openDrill = (pattern) => {
    const exercises = (byPattern[pattern.id] || []).map(e => ({
      ...e,
      type: "pattern_match",
      // PatternDrill will navigate to individual exercises; just need exerciseId
    }));
    if (exercises.length === 0) return;
    // Navigate to first exercise in sequence — PatternDrill needs full exercise data
    // so we just navigate to the first one for now
    navigate(`/pro/exercise/${exercises[0].exerciseId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[var(--label)]">Pattern Atlas</h1>
          <p className="text-[14px] text-apple-gray mt-1">
            14 canonical interview patterns — learn to recognise which one fits before you code.
          </p>
          {!loading && (
            <p className="text-[12px] text-apple-gray3 mt-0.5">
              {totalExercises} pattern drill exercises available across {Object.keys(byPattern).length} patterns
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate(`/pro/${trackSlug}/pattern-quiz`)}
            className="px-3 py-1.5 rounded-full bg-apple-blue/10 hover:bg-apple-blue/20 text-apple-blue text-[12px] font-semibold transition-colors"
          >
            🎯 Take the quiz
          </button>
          <button
            onClick={() => navigate(-1)}
            className="text-[12px] text-apple-gray hover:text-apple-blue transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Pattern grid */}
      {loading ? (
        <div className="text-[13px] text-apple-gray">Loading patterns…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PATTERN_CATALOG.map(pattern => {
            const exercises = byPattern[pattern.id] || [];
            const topics = [...new Set(exercises.map(e => e.topicId))];

            return (
              <div key={pattern.id} className="card p-5 flex flex-col gap-3 hover:shadow-apple-md transition-shadow">
                {/* Title row */}
                <div className="flex items-center gap-2.5">
                  <span className={`w-9 h-9 rounded-lg border flex items-center justify-center text-[16px] font-bold shrink-0 ${pattern.color}`}>
                    {pattern.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[var(--label)] truncate">{pattern.label}</p>
                    {exercises.length > 0 && (
                      <p className="text-[10px] text-apple-gray">
                        {exercises.length} drill exercise{exercises.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  {exercises.length > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pattern.color}`}>
                      {exercises.length}
                    </span>
                  )}
                </div>

                {/* When to use */}
                <p className="text-[12px] text-apple-gray leading-relaxed">{pattern.when}</p>

                {/* Topic chips */}
                {topics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {topics.map(tid => (
                      <button
                        key={tid}
                        onClick={() => navigate(`/pro/topic/${tid}`)}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--fill)] text-apple-gray hover:text-apple-blue transition-colors"
                      >
                        {topicMap[tid]?.name || tid}
                      </button>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {exercises.length > 0 ? (
                  <button
                    onClick={() => navigate(`/pro/exercise/${exercises[0].exerciseId}`)}
                    className="mt-auto btn-primary text-[12px] py-2"
                  >
                    ⚡ Drill {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
                  </button>
                ) : (
                  <p className="mt-auto text-[11px] text-apple-gray3 italic">Exercises coming soon</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
