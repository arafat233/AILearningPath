/**
 * studentRunner — execute a student's sort code with instrumented helpers,
 * recording every compare() and swap() as a visualizable AnimationStep.
 *
 * Ported AS-IS from dsa-visualizer 2/src/utils/studentRunner.ts. This is
 * the most pedagogically valuable artifact across both source projects —
 * it's what lets a learner write THEIR OWN sort and watch it animate.
 *
 * Mechanism:
 *   - Build a Function from the student's source code
 *   - Pass them `compare(i, j)` and `swap(i, j)` helpers that mutate
 *     the array AND push an AnimationStep into a buffer
 *   - After the student's function returns, validate the array is sorted
 *     and append a final "all sorted" frame
 *
 * Safety:
 *   - Bounds-checked helpers throw before mutating on invalid index
 *   - 50,000-step ceiling guards against infinite loops (caught by the
 *     try/catch and reported as a tidy error)
 *   - No `eval` — `new Function(...)` is scoped (can't access window/locals)
 *
 * @typedef {import('../types.js').AnimationStep} AnimationStep
 */

export const STUDENT_TEMPLATE = `// Write your sorting algorithm below.
//
// Available helpers (auto-tracked for visualization):
//   compare(i, j)  → returns arr[i] - arr[j]
//                    negative = arr[i] < arr[j]
//   swap(i, j)     → swaps elements at indices i and j
//
// The array 'arr' is passed in — sort it in place.

function mySort(arr, compare, swap) {
  const n = arr.length

  // --- your code below ---
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (compare(j, j + 1) > 0) {
        swap(j, j + 1)
      }
    }
  }
  // --- end of your code ---
}`;

/**
 * @param {string} code         Student-supplied JS source.
 * @param {number[]} input      The array to sort.
 * @returns {{ steps: AnimationStep[] } | { error: string }}
 */
export function runStudentCode(code, input) {
  const arr = [...input];
  /** @type {AnimationStep[]} */
  const steps = [];
  let comparisons = 0;
  let swaps = 0;

  const compare = (i, j) => {
    if (i < 0 || j < 0 || i >= arr.length || j >= arr.length) {
      throw new Error(`Index out of bounds: compare(${i}, ${j}), array length = ${arr.length}`);
    }
    comparisons++;
    steps.push({
      type: "compare",
      indices: [i, j],
      array: [...arr],
      explanation: `Comparing arr[${i}] = ${arr[i]} and arr[${j}] = ${arr[j]}`,
      codeLine: -1,
      comparisons, swaps,
    });
    return arr[i] - arr[j];
  };

  const swap = (i, j) => {
    if (i < 0 || j < 0 || i >= arr.length || j >= arr.length) {
      throw new Error(`Index out of bounds: swap(${i}, ${j}), array length = ${arr.length}`);
    }
    [arr[i], arr[j]] = [arr[j], arr[i]];
    swaps++;
    steps.push({
      type: "swap",
      indices: [i, j],
      array: [...arr],
      explanation: `Swapping arr[${i}] = ${arr[j]} and arr[${j}] = ${arr[i]}`,
      codeLine: -1,
      comparisons, swaps,
    });
    if (steps.length > 50000) throw new Error("Too many steps — possible infinite loop");
  };

  try {
    // new Function() scopes the body — no access to outer locals/globals
    // (modulo the parameters we explicitly pass).
    const fn = new Function(
      "arr", "_compare", "_swap",
      `${code}
      if (typeof mySort !== 'function') throw new Error('mySort function not found')
      mySort(arr, _compare, _swap)`
    );
    fn(arr, compare, swap);

    // Validate the result
    const isSorted = arr.every((v, i) => i === 0 || arr[i - 1] <= v);

    steps.push({
      type: "sorted",
      indices: Array.from({ length: arr.length }, (_, i) => i),
      array: [...arr],
      explanation: isSorted
        ? "Sorting complete! Array is correctly sorted."
        : "Done — but array is NOT fully sorted. Check your algorithm!",
      codeLine: -1,
      comparisons, swaps,
    });

    return { steps };
  } catch (err) {
    return { error: String(err) };
  }
}
