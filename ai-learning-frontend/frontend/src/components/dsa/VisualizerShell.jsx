/**
 * VisualizerShell — dispatches to the right sandbox by `kind`.
 *
 * Every sandbox is lazy-loaded. This file is now just a map + Suspense
 * wrapper — no heavy static imports. Monaco, framer-motion, and all
 * sandbox-specific code only download when the matching kind is needed.
 */
import { lazy, Suspense } from "react";

const SANDBOXES = {
  "sorting-sandbox":     lazy(() => import("./modes/SortingSandbox.jsx")),
  "binary-search":       lazy(() => import("./modes/BinarySearchSandbox.jsx")),
  "linked-list":         lazy(() => import("./modes/LinkedListSandbox.jsx")),
  "stack":               lazy(() => import("./modes/StackSandbox.jsx")),
  "tree":                lazy(() => import("./modes/TreeSandbox.jsx")),
  "array-pointers":      lazy(() => import("./modes/ArrayPointersSandbox.jsx")),
  "heap":                lazy(() => import("./modes/HeapSandbox.jsx")),
  "hash-table":          lazy(() => import("./modes/HashTableSandbox.jsx")),
  "string-matching":     lazy(() => import("./modes/StringMatchSandbox.jsx")),
  "graph":               lazy(() => import("./modes/GraphSandbox.jsx")),
  "sliding-window":      lazy(() => import("./modes/SlidingWindowSandbox.jsx")),
  "dutch-flag":          lazy(() => import("./modes/DutchFlagSandbox.jsx")),
  "palindrome":          lazy(() => import("./modes/PalindromeSandbox.jsx")),
  "dp-grid":             lazy(() => import("./modes/LCSGridSandbox.jsx")),
  "linked-list-cycle":   lazy(() => import("./modes/FloydCycleSandbox.jsx")),
  "monotonic-stack":     lazy(() => import("./modes/MonotonicStackSandbox.jsx")),
  "tree-traversal":      lazy(() => import("./modes/TreeTraversalSandbox.jsx")),
  "trie":                lazy(() => import("./modes/TrieSandbox.jsx")),
  "k-largest":           lazy(() => import("./modes/KLargestSandbox.jsx")),
  "graph-topo":          lazy(() => import("./modes/GraphTopoSandbox.jsx")),
  "graph-dijkstra":      lazy(() => import("./modes/GraphDijkstraSandbox.jsx")),
  "prefix-sums":         lazy(() => import("./modes/PrefixSumsSandbox.jsx")),
  "queue":               lazy(() => import("./modes/QueueSandbox.jsx")),
  "sliding-window-max":  lazy(() => import("./modes/SlidingWindowMaxSandbox.jsx")),
  "lca":                 lazy(() => import("./modes/LCASandbox.jsx")),
  "counting-sort":       lazy(() => import("./modes/CountingSortSandbox.jsx")),
  "rotated-search":      lazy(() => import("./modes/RotatedSearchSandbox.jsx")),
  "union-find":          lazy(() => import("./modes/UnionFindSandbox.jsx")),
  "k-way-merge":         lazy(() => import("./modes/KWayMergeSandbox.jsx")),
  "lru":                 lazy(() => import("./modes/LRUSandbox.jsx")),
  "anagram":             lazy(() => import("./modes/AnagramSandbox.jsx")),
  "merge-ll":            lazy(() => import("./modes/MergeLLSandbox.jsx")),
  "custom-hash":         lazy(() => import("./modes/CustomHashSandbox.jsx")),
  "tree-path":           lazy(() => import("./modes/TreePathSandbox.jsx")),
  "pq-lazy":             lazy(() => import("./modes/PQLazySandbox.jsx")),
  "islands":             lazy(() => import("./modes/IslandsSandbox.jsx")),
  "search-on-answer":    lazy(() => import("./modes/SearchOnAnswerSandbox.jsx")),
  "matrix-search":       lazy(() => import("./modes/MatrixSearchSandbox.jsx")),
  "hash-grouping":       lazy(() => import("./modes/HashGroupingSandbox.jsx")),
  "hash-dedup":          lazy(() => import("./modes/HashDedupSandbox.jsx")),
  "interval-merge":      lazy(() => import("./modes/IntervalMergeSandbox.jsx")),
  "memory-model":        lazy(() => import("./modes/MemoryModelSandbox.jsx")),
  "recursion":           lazy(() => import("./modes/RecursionSandbox.jsx")),
  "circular-ll":         lazy(() => import("./modes/CircularLLSandbox.jsx")),
  "doubly-ll":           lazy(() => import("./modes/DoublyLLSandbox.jsx")),
  "array-insert":        lazy(() => import("./modes/ArrayInsertSandbox.jsx")),
};

function VisualizerFallback() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 flex items-center justify-center gap-3 text-zinc-400 text-sm min-h-[200px]">
      <div className="w-5 h-5 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin shrink-0" />
      Loading visualizer…
    </div>
  );
}

export default function VisualizerShell({ kind, config = {} }) {
  const Sandbox = SANDBOXES[kind];
  if (!Sandbox) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center text-zinc-400 text-sm">
        <p className="font-semibold mb-1">Visualizer "{kind}" not yet wired up.</p>
        <p className="text-xs">Coming in a later phase.</p>
      </div>
    );
  }
  return (
    <Suspense fallback={<VisualizerFallback />}>
      <Sandbox config={config} />
    </Suspense>
  );
}
