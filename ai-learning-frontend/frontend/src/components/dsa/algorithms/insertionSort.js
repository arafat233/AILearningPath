/**
 * Insertion sort step generator. Ported from dsa-visualizer 2.
 * @typedef {import('../types.js').AnimationStep} AnimationStep
 * @typedef {import('../types.js').AlgorithmDef} AlgorithmDef
 */

/** @type {AlgorithmDef} */
export const insertionSortDef = {
  id: "insertion",
  name: "Insertion Sort",
  code: `function insertionSort(arr) {
  const n = arr.length
  for (let i = 1; i < n; i++) {
    let key = arr[i]
    let j = i - 1
    while (j >= 0 && compare(j, j + 1) > 0) {
      arr[j + 1] = arr[j]   // shift right
      j--
    }
    arr[j + 1] = key        // insert key
  }
}`,
  timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
  spaceComplexity: "O(1)",
  description:
    "Builds the sorted array one element at a time by inserting each new element into its correct position among the already-sorted elements.",
  /** @param {number[]} input @returns {AnimationStep[]} */
  generate: (input) => {
    const arr = [...input];
    /** @type {AnimationStep[]} */
    const steps = [];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= 0) {
        comparisons++;
        steps.push({
          type: "compare",
          indices: [j, j + 1],
          array: [...arr],
          explanation: `Comparing arr[${j}] = ${arr[j]} with key = ${key}`,
          codeLine: 6,
          comparisons, swaps,
        });

        if (arr[j] > key) {
          arr[j + 1] = arr[j];
          swaps++;
          steps.push({
            type: "overwrite",
            indices: [j + 1],
            array: [...arr],
            explanation: `Shifting ${arr[j + 1]} one position right`,
            codeLine: 7,
            comparisons, swaps,
          });
          j--;
        } else {
          break;
        }
      }

      arr[j + 1] = key;
      steps.push({
        type: "sorted",
        indices: [j + 1],
        array: [...arr],
        explanation: `Inserting key ${key} at position ${j + 1}`,
        codeLine: 10,
        comparisons, swaps,
      });
    }

    // Final pass — mark everything sorted
    steps.push({
      type: "sorted",
      indices: Array.from({ length: n }, (_, i) => i),
      array: [...arr],
      explanation: "Array fully sorted!",
      codeLine: 3,
      comparisons, swaps,
    });

    return steps;
  },
};
