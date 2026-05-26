/**
 * Bubble sort step generator. Ported from dsa-visualizer 2; TS removed.
 * @typedef {import('../types.js').AnimationStep} AnimationStep
 * @typedef {import('../types.js').AlgorithmDef} AlgorithmDef
 */

/** @type {AlgorithmDef} */
export const bubbleSortDef = {
  id: "bubble",
  name: "Bubble Sort",
  code: `function bubbleSort(arr) {
  const n = arr.length
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (compare(j, j + 1) > 0) {
        swap(j, j + 1)
      }
    }
  }
}`,
  timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
  spaceComplexity: "O(1)",
  description:
    'Repeatedly steps through the list, compares adjacent elements and swaps them if out of order. Largest elements "bubble" to the end each pass.',
  /** @param {number[]} input @returns {AnimationStep[]} */
  generate: (input) => {
    const arr = [...input];
    /** @type {AnimationStep[]} */
    const steps = [];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        steps.push({
          type: "compare",
          indices: [j, j + 1],
          array: [...arr],
          explanation: `Comparing arr[${j}] = ${arr[j]} and arr[${j + 1}] = ${arr[j + 1]}`,
          codeLine: 5,
          comparisons, swaps,
        });

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swaps++;
          steps.push({
            type: "swap",
            indices: [j, j + 1],
            array: [...arr],
            explanation: `${arr[j + 1]} > ${arr[j]} — swapping them`,
            codeLine: 6,
            comparisons, swaps,
          });
        }
      }

      steps.push({
        type: "sorted",
        indices: [n - i - 1],
        array: [...arr],
        explanation: `${arr[n - i - 1]} is now in its correct final position`,
        codeLine: 3,
        comparisons, swaps,
      });
    }

    return steps;
  },
};
