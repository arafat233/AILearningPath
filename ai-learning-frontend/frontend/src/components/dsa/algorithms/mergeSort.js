/**
 * Merge sort step generator. Ported from dsa-visualizer 2.
 * @typedef {import('../types.js').AnimationStep} AnimationStep
 * @typedef {import('../types.js').AlgorithmDef} AlgorithmDef
 */

/** @type {AlgorithmDef} */
export const mergeSortDef = {
  id: "merge",
  name: "Merge Sort",
  code: `function mergeSort(arr, l, r) {
  if (l >= r) return
  const mid = Math.floor((l + r) / 2)
  mergeSort(arr, l, mid)
  mergeSort(arr, mid + 1, r)
  merge(arr, l, mid, r)
}

function merge(arr, l, mid, r) {
  const left = arr.slice(l, mid + 1)
  const right = arr.slice(mid + 1, r + 1)
  let i = 0, j = 0, k = l
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      arr[k++] = left[i++]
    } else {
      arr[k++] = right[j++]
    }
  }
  while (i < left.length) arr[k++] = left[i++]
  while (j < right.length) arr[k++] = right[j++]
}`,
  timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
  spaceComplexity: "O(n)",
  description:
    "Divide and conquer: recursively splits the array in half, sorts each half, then merges them back together in sorted order.",
  /** @param {number[]} input @returns {AnimationStep[]} */
  generate: (input) => {
    const arr = [...input];
    /** @type {AnimationStep[]} */
    const steps = [];
    let comparisons = 0;
    let swaps = 0;

    const merge = (arr, l, mid, r) => {
      const left = arr.slice(l, mid + 1);
      const right = arr.slice(mid + 1, r + 1);
      let i = 0, j = 0, k = l;

      while (i < left.length && j < right.length) {
        comparisons++;
        steps.push({
          type: "compare",
          indices: [l + i, mid + 1 + j],
          array: [...arr],
          explanation: `Merging: comparing ${left[i]} and ${right[j]}`,
          codeLine: 14,
          comparisons, swaps,
        });

        if (left[i] <= right[j]) {
          arr[k] = left[i];
          swaps++;
          steps.push({
            type: "overwrite",
            indices: [k],
            array: [...arr],
            explanation: `Placing ${left[i]} from left half at position ${k}`,
            codeLine: 15,
            comparisons, swaps,
          });
          i++;
        } else {
          arr[k] = right[j];
          swaps++;
          steps.push({
            type: "overwrite",
            indices: [k],
            array: [...arr],
            explanation: `Placing ${right[j]} from right half at position ${k}`,
            codeLine: 17,
            comparisons, swaps,
          });
          j++;
        }
        k++;
      }

      while (i < left.length) {
        arr[k] = left[i];
        swaps++;
        steps.push({
          type: "overwrite",
          indices: [k],
          array: [...arr],
          explanation: `Copying remaining left element ${left[i]}`,
          codeLine: 20,
          comparisons, swaps,
        });
        i++; k++;
      }

      while (j < right.length) {
        arr[k] = right[j];
        swaps++;
        steps.push({
          type: "overwrite",
          indices: [k],
          array: [...arr],
          explanation: `Copying remaining right element ${right[j]}`,
          codeLine: 21,
          comparisons, swaps,
        });
        j++; k++;
      }

      steps.push({
        type: "sorted",
        indices: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
        array: [...arr],
        explanation: `Merged subarray [${l}...${r}] is sorted`,
        codeLine: 6,
        comparisons, swaps,
      });
    };

    const mergeSortHelper = (arr, l, r) => {
      if (l >= r) return;
      const mid = Math.floor((l + r) / 2);
      mergeSortHelper(arr, l, mid);
      mergeSortHelper(arr, mid + 1, r);
      merge(arr, l, mid, r);
    };

    mergeSortHelper(arr, 0, arr.length - 1);
    return steps;
  },
};
