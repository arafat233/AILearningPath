/**
 * Linear search step generator. Ported from dsalearn/lib/algorithms/linearSearch.ts.
 *
 * Returns LinearSearchFrame objects with a single `i` pointer (the current
 * comparison index). Renders via ArrayVisualizer.
 *
 * @typedef {object} LinearSearchFrame
 * @property {import('../ArrayVisualizer.jsx').ArrayCell[]} cells
 * @property {Object<string, number>} pointers
 * @property {object} step
 */

export const LINEAR_SEARCH_CODE = `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i           // found at index i
    }
  }
  return -1              // not found
}`;

/**
 * @param {number[]} arr
 * @param {number} target
 * @returns {LinearSearchFrame[]}
 */
export function generateLinearSearchSteps(arr, target) {
  /** @type {LinearSearchFrame[]} */
  const frames = [];

  const makeFrame = (active, state, step, foundAll = false) => ({
    cells: arr.map((v, idx) => ({
      value: v,
      state: foundAll ? "found" : idx === active ? state : "default",
    })),
    pointers: active !== null ? { i: active } : {},
    step,
  });

  // Initial
  frames.push({
    cells: arr.map((v) => ({ value: v, state: "default" })),
    pointers: {},
    step: {
      type: "highlight",
      description: `Searching for target = ${target} in array of ${arr.length} elements.`,
      detail: "We will check each element one by one from left to right.",
      codeLine: 2,
    },
  });

  for (let i = 0; i < arr.length; i++) {
    frames.push(
      makeFrame(i, "compare", {
        type: "compare",
        description: `Checking arr[${i}] = ${arr[i]}`,
        detail: `Is ${arr[i]} === ${target}?`,
        codeLine: 3,
        indices: [i],
      })
    );

    if (arr[i] === target) {
      frames.push({
        cells: arr.map((v, idx) => ({ value: v, state: idx === i ? "found" : "default" })),
        pointers: { i },
        step: {
          type: "found",
          description: `Found! arr[${i}] = ${target}`,
          detail: `Returning index ${i}. Search complete.`,
          codeLine: 4,
          indices: [i],
        },
      });
      return frames;
    }
  }

  // Not found — mark all as not-found
  frames.push({
    cells: arr.map((v) => ({ value: v, state: "not-found" })),
    pointers: {},
    step: {
      type: "not-found",
      description: `${target} not found in the array.`,
      detail: "Returning -1. All elements were checked.",
      codeLine: 7,
    },
  });

  return frames;
}
