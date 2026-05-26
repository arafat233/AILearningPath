/**
 * Quick sort step generator. Ported from dsa-visualizer 2.
 * @typedef {import('../types.js').AnimationStep} AnimationStep
 * @typedef {import('../types.js').AlgorithmDef} AlgorithmDef
 */

/** @type {AlgorithmDef} */
export const quickSortDef = {
  id: "quick",
  name: "Quick Sort",
  code: `function quickSort(arr, low, high) {
  if (low < high) {
    const pi = partition(arr, low, high)
    quickSort(arr, low, pi - 1)
    quickSort(arr, pi + 1, high)
  }
}

function partition(arr, low, high) {
  const pivot = arr[high]
  let i = low - 1
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++
      swap(i, j)
    }
  }
  swap(i + 1, high)   // place pivot
  return i + 1
}`,
  timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
  spaceComplexity: "O(log n)",
  description:
    "Divide and conquer: picks a pivot, partitions elements smaller/larger around it, then recursively sorts each partition.",
  /** @param {number[]} input @returns {AnimationStep[]} */
  generate: (input) => {
    const arr = [...input];
    /** @type {AnimationStep[]} */
    const steps = [];
    let comparisons = 0;
    let swaps = 0;

    const partition = (arr, low, high) => {
      const pivot = arr[high];

      steps.push({
        type: "pivot",
        indices: [high],
        array: [...arr],
        explanation: `Pivot selected: ${pivot} at index ${high}`,
        codeLine: 10,
        comparisons, swaps,
      });

      let i = low - 1;

      for (let j = low; j < high; j++) {
        comparisons++;
        steps.push({
          type: "compare",
          indices: [j, high],
          array: [...arr],
          explanation: `Comparing arr[${j}] = ${arr[j]} with pivot = ${pivot}`,
          codeLine: 13,
          comparisons, swaps,
        });

        if (arr[j] <= pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaps++;
          steps.push({
            type: "swap",
            indices: [i, j],
            array: [...arr],
            explanation: `${arr[j]} ≤ pivot ${pivot} — swapping arr[${i}] and arr[${j}]`,
            codeLine: 15,
            comparisons, swaps,
          });
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      swaps++;
      steps.push({
        type: "swap",
        indices: [i + 1, high],
        array: [...arr],
        explanation: `Placing pivot ${pivot} in its correct position ${i + 1}`,
        codeLine: 18,
        comparisons, swaps,
      });

      steps.push({
        type: "sorted",
        indices: [i + 1],
        array: [...arr],
        explanation: `Pivot ${pivot} is now in its final sorted position`,
        codeLine: 3,
        comparisons, swaps,
      });

      return i + 1;
    };

    const quickSortHelper = (arr, low, high) => {
      if (low < high) {
        const pi = partition(arr, low, high);
        quickSortHelper(arr, low, pi - 1);
        quickSortHelper(arr, pi + 1, high);
      }
    };

    quickSortHelper(arr, 0, arr.length - 1);

    // Mark all as sorted at the end
    steps.push({
      type: "sorted",
      indices: Array.from({ length: arr.length }, (_, i) => i),
      array: [...arr],
      explanation: "Array fully sorted!",
      codeLine: 3,
      comparisons, swaps,
    });

    return steps;
  },
};
