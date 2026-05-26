/**
 * countingSort — three-phase animation: count, cumulative, place.
 *
 * Used by M38-T2 (Non-Comparison Sorts — Counting, Radix, Bucket).
 * The "no comparisons" insight only lands when learners see the
 * bucket array fill, then become positions, then deposit values.
 */

export const COUNTING_SORT_CODE = `// Counting sort (non-comparison, O(n + k))
int[] countingSort(int[] arr, int max) {
  int[] count = new int[max + 1];
  for (int x : arr) count[x]++;                              // 1. count
  for (int i = 1; i <= max; i++) count[i] += count[i - 1];   // 2. cumulative
  int[] out = new int[arr.length];
  for (int i = arr.length - 1; i >= 0; i--) {                // 3. place (right-to-left for stability)
    out[--count[arr[i]]] = arr[i];
  }
  return out;
}`;

export function generateCountingSortSteps(arr) {
  const max = Math.max(...arr, 0);
  const count = new Array(max + 1).fill(0);
  const out   = new Array(arr.length).fill(null);
  const frames = [];

  const snap = (phase, activeArr, activeCount, activeOut, step) => frames.push({
    arr: [...arr], count: [...count], out: [...out],
    activeArr, activeCount, activeOut,
    phase, step,
  });

  snap("init", -1, -1, -1, {
    description: `Counting sort. Max value = ${max} → ${max + 1} buckets.`,
    detail: "No comparisons. Three passes: count, cumulative, place.",
  });

  // Phase 1: count
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
    snap("count", i, arr[i], -1, {
      description: `count[${arr[i]}]++ (arr[${i}] = ${arr[i]}).`,
      detail: `Buckets: [${count.join(", ")}].`,
    });
  }

  // Phase 2: cumulative
  for (let i = 1; i <= max; i++) {
    const before = count[i];
    count[i] += count[i - 1];
    snap("cumsum", -1, i, -1, {
      description: `count[${i}] += count[${i - 1}] → ${count[i]}.`,
      detail: `count[${i}] now means "first ${i + 1} values fill positions 0..${count[i] - 1}".`,
    });
  }

  // Phase 3: place (right-to-left so equal elements stay stable)
  for (let i = arr.length - 1; i >= 0; i--) {
    count[arr[i]]--;
    out[count[arr[i]]] = arr[i];
    snap("place", i, arr[i], count[arr[i]], {
      description: `Decrement count[${arr[i]}] to ${count[arr[i]]}, then out[${count[arr[i]]}] = ${arr[i]}.`,
      detail: `out: [${out.map((v) => v == null ? "·" : v).join(", ")}].`,
    });
  }

  snap("done", -1, -1, -1, {
    description: "Done.",
    detail: `out = [${out.join(", ")}]. O(n + k), no comparisons.`,
  });

  return frames;
}
