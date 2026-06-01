/**
 * complexity.js — fast op-counting for the Complexity Derivation System.
 *
 * Each entry has a count(n, inputType) that runs the algorithm and returns
 * { comparisons, swaps } WITHOUT creating AnimationStep objects. For n=200,
 * these finish in < 1ms — safe to call in useMemo on every slider change.
 *
 * inputType: "random" | "sorted" | "reversed"
 */

function makeInput(n, type) {
  if (type === "sorted")   return Array.from({ length: n }, (_, i) => i + 1);
  if (type === "reversed") return Array.from({ length: n }, (_, i) => n - i);
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const COMPLEXITY_ALGORITHMS = {
  bubble: {
    label: "Bubble Sort",
    color: "#FF3B30",
    theoretical: "O(n²)",
    curveClass: "n2",
    count(n, type = "random") {
      const arr = makeInput(n, type);
      let comparisons = 0, swaps = 0;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          comparisons++;
          if (arr[j] > arr[j + 1]) { [arr[j], arr[j+1]] = [arr[j+1], arr[j]]; swaps++; }
        }
      }
      return { comparisons, swaps };
    },
  },
  insertion: {
    label: "Insertion Sort",
    color: "#FF9500",
    theoretical: "O(n²) worst",
    curveClass: "n2",
    count(n, type = "random") {
      const arr = makeInput(n, type);
      let comparisons = 0, swaps = 0;
      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= 0) {
          comparisons++;
          if (arr[j] > key) { arr[j + 1] = arr[j]; swaps++; j--; } else break;
        }
        arr[j + 1] = key;
      }
      return { comparisons, swaps };
    },
  },
  selection: {
    label: "Selection Sort",
    color: "#FFCC02",
    theoretical: "O(n²)",
    curveClass: "n2",
    count(n, type = "random") {
      const arr = makeInput(n, type);
      let comparisons = 0, swaps = 0;
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          comparisons++;
          if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) { [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]; swaps++; }
      }
      return { comparisons, swaps };
    },
  },
  merge: {
    label: "Merge Sort",
    color: "#34C759",
    theoretical: "O(n log n)",
    curveClass: "nlogn",
    count(n, type = "random") {
      const arr = makeInput(n, type);
      let comparisons = 0;
      const go = (a, l, r) => {
        if (l >= r) return;
        const m = (l + r) >> 1;
        go(a, l, m); go(a, m + 1, r);
        const L = a.slice(l, m + 1), R = a.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < L.length && j < R.length) { comparisons++; a[k++] = L[i] <= R[j] ? L[i++] : R[j++]; }
        while (i < L.length) a[k++] = L[i++];
        while (j < R.length) a[k++] = R[j++];
      };
      go(arr, 0, n - 1);
      return { comparisons, swaps: 0 };
    },
  },
  quick: {
    label: "Quick Sort",
    color: "#007AFF",
    theoretical: "O(n log n) avg",
    curveClass: "nlogn",
    count(n, type = "random") {
      const arr = makeInput(n, type);
      let comparisons = 0;
      const part = (a, lo, hi) => {
        const pv = a[hi]; let i = lo;
        for (let j = lo; j < hi; j++) { comparisons++; if (a[j] <= pv) { [a[i], a[j]] = [a[j], a[i]]; i++; } }
        [a[i], a[hi]] = [a[hi], a[i]]; return i;
      };
      const qs = (a, lo, hi) => { if (lo >= hi) return; const p = part(a, lo, hi); qs(a, lo, p-1); qs(a, p+1, hi); };
      qs(arr, 0, n - 1);
      return { comparisons, swaps: 0 };
    },
  },
  binary_search: {
    label: "Binary Search",
    color: "#AF52DE",
    theoretical: "O(log n)",
    curveClass: "logn",
    count(n) {
      const arr = Array.from({ length: n }, (_, i) => i + 1);
      const target = arr[Math.floor(n / 2)];
      let comparisons = 0, lo = 0, hi = n - 1;
      while (lo <= hi) {
        comparisons++;
        const mid = (lo + hi) >> 1;
        if (arr[mid] === target) break;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
      }
      return { comparisons, swaps: 0 };
    },
  },
  linear_search: {
    label: "Linear Search",
    color: "#5AC8FA",
    theoretical: "O(n)",
    curveClass: "n",
    count(n) {
      return { comparisons: n, swaps: 0 }; // worst case: target not found
    },
  },
};

// Reference curve functions — used for overlay in ComplexityPlot
export const REF_CURVES = [
  { key: "logn",  label: "O(log n)",   fn: (n) => Math.log2(Math.max(n, 1)),    dash: "3,3",  color: "#8E8E93" },
  { key: "n",     label: "O(n)",        fn: (n) => n,                            dash: "4,3",  color: "#8E8E93" },
  { key: "nlogn", label: "O(n log n)",  fn: (n) => n * Math.log2(Math.max(n,2)), dash: "5,3",  color: "#8E8E93" },
  { key: "n2",    label: "O(n²)",       fn: (n) => n * n,                        dash: "6,3",  color: "#8E8E93" },
];

// Display order for algorithm selection UI
export const COMPLEXITY_ALGO_ORDER = ["bubble", "insertion", "selection", "merge", "quick", "binary_search", "linear_search"];
