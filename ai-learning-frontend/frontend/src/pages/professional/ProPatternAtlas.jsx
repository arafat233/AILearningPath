/**
 * ProPatternAtlas — /pro/java/patterns
 *
 * Shows the 14 interview patterns, how many drill exercises exist per pattern,
 * which topics teach each one, and a Quick Drill button.
 *
 * D3.4: natural home for the pattern_match work.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
];

export default function ProPatternAtlas() {
  const navigate = useNavigate();
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
        <button
          onClick={() => navigate(-1)}
          className="text-[12px] text-apple-gray hover:text-apple-blue transition-colors shrink-0"
        >
          ← Back
        </button>
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
