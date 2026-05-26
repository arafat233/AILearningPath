/**
 * Binary search step generator. Ported from dsalearn/lib/algorithms/binarySearch.ts.
 *
 * Different output shape from the sort algorithms — searches produce
 * `BinarySearchFrame` objects ({ cells, pointers, step }) instead of
 * `AnimationStep`s, because the visualizer needs to show L/R/mid pointers
 * above specific indices (rendered by ArrayVisualizer, not ArrayBars).
 *
 * @typedef {object} BinarySearchFrame
 * @property {import('../ArrayVisualizer.jsx').ArrayCell[]} cells
 * @property {Object<string, number>} pointers
 * @property {object} step  — { type, description, detail?, codeLine, indices? }
 */

export const BINARY_SEARCH_CODE = `function binarySearch(arr, target) {
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (arr[mid] === target) {
      return mid           // found!
    } else if (arr[mid] < target) {
      left = mid + 1       // search right half
    } else {
      right = mid - 1      // search left half
    }
  }

  return -1                // not found
}`;

/**
 * @param {number[]} arr
 * @param {number} target
 * @returns {BinarySearchFrame[]}
 */
export function generateBinarySearchSteps(arr, target) {
  // Binary search requires sorted input — sort defensively.
  const sorted = [...arr].sort((a, b) => a - b);
  /** @type {BinarySearchFrame[]} */
  const frames = [];

  const makeFrame = (left, right, mid, activeIdx, activeState, step) => ({
    cells: sorted.map((v, idx) => {
      if (idx === activeIdx) return { value: v, state: activeState };
      if (idx < left || idx > right) return { value: v, state: "default", label: "" };
      return { value: v, state: "default" };
    }),
    pointers: {
      ...(left <= right  ? { L: left }  : {}),
      ...(right >= left  ? { R: right } : {}),
      ...(mid !== null   ? { mid }      : {}),
    },
    step,
  });

  // Initial
  frames.push({
    cells: sorted.map((v) => ({ value: v, state: "default" })),
    pointers: { L: 0, R: sorted.length - 1 },
    step: {
      type: "highlight",
      description: `Binary search for ${target} in sorted array.`,
      detail: "The array must be sorted. We halve the search space each iteration.",
      codeLine: 2,
    },
  });

  let left = 0;
  let right = sorted.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    frames.push(
      makeFrame(left, right, mid, mid, "compare", {
        type: "compare",
        description: `mid = (${left} + ${right}) / 2 = ${mid}, arr[mid] = ${sorted[mid]}`,
        detail: `Is ${sorted[mid]} === ${target}?`,
        codeLine: 6,
        indices: [mid],
      })
    );

    if (sorted[mid] === target) {
      frames.push({
        cells: sorted.map((v, idx) => ({ value: v, state: idx === mid ? "found" : "default" })),
        pointers: { mid },
        step: {
          type: "found",
          description: `Found! arr[${mid}] = ${target}`,
          detail: `Returning index ${mid}. Only ${frames.length} comparisons needed!`,
          codeLine: 8,
          indices: [mid],
        },
      });
      return frames;
    } else if (sorted[mid] < target) {
      frames.push(
        makeFrame(mid + 1, right, null, null, "default", {
          type: "pointer",
          description: `${sorted[mid]} < ${target} → search RIGHT half`,
          detail: `left = mid + 1 = ${mid + 1}. Eliminated left half.`,
          codeLine: 10,
        })
      );
      left = mid + 1;
    } else {
      frames.push(
        makeFrame(left, mid - 1, null, null, "default", {
          type: "pointer",
          description: `${sorted[mid]} > ${target} → search LEFT half`,
          detail: `right = mid - 1 = ${mid - 1}. Eliminated right half.`,
          codeLine: 12,
        })
      );
      right = mid - 1;
    }
  }

  frames.push({
    cells: sorted.map((v) => ({ value: v, state: "not-found" })),
    pointers: {},
    step: {
      type: "not-found",
      description: `${target} not found. left > right, search exhausted.`,
      detail: "Returning -1.",
      codeLine: 17,
    },
  });

  return frames;
}
