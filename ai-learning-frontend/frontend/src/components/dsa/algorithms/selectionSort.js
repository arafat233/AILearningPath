/**
 * Selection sort step generator. Ported from dsa-visualizer 2.
 * @typedef {import('../types.js').AnimationStep} AnimationStep
 * @typedef {import('../types.js').AlgorithmDef} AlgorithmDef
 */

/** @type {AlgorithmDef} */
export const selectionSortDef = {
  id: "selection",
  name: "Selection Sort",
  code: `function selectionSort(arr) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      if (compare(j, minIdx) < 0) {
        minIdx = j        // new minimum found
      }
    }
    swap(i, minIdx)
  }
}`,
  timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
  spaceComplexity: "O(1)",
  description:
    "Divides the array into sorted and unsorted parts. Repeatedly selects the minimum element from the unsorted part and moves it to the sorted part.",
  /** @param {number[]} input @returns {AnimationStep[]} */
  generate: (input) => {
    const arr = [...input];
    /** @type {AnimationStep[]} */
    const steps = [];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      for (let j = i + 1; j < n; j++) {
        comparisons++;
        steps.push({
          type: "compare",
          indices: [j, minIdx],
          array: [...arr],
          explanation: `Comparing arr[${j}] = ${arr[j]} with current min arr[${minIdx}] = ${arr[minIdx]}`,
          codeLine: 6,
          comparisons, swaps,
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            type: "pivot",
            indices: [minIdx],
            array: [...arr],
            explanation: `New minimum found: ${arr[minIdx]} at index ${minIdx}`,
            codeLine: 7,
            comparisons, swaps,
          });
        }
      }

      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        swaps++;
        steps.push({
          type: "swap",
          indices: [i, minIdx],
          array: [...arr],
          explanation: `Swapping minimum ${arr[i]} into position ${i}`,
          codeLine: 10,
          comparisons, swaps,
        });
      }

      steps.push({
        type: "sorted",
        indices: [i],
        array: [...arr],
        explanation: `${arr[i]} is now in its correct final position`,
        codeLine: 3,
        comparisons, swaps,
      });
    }

    steps.push({
      type: "sorted",
      indices: [n - 1],
      array: [...arr],
      explanation: "Array fully sorted!",
      codeLine: 3,
      comparisons, swaps,
    });

    return steps;
  },
};
