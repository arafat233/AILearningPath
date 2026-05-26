/**
 * slidingWindow — fixed-size window scan with incremental sum updates.
 *
 * Used by M30-T2 (Sliding Window — Contiguous Subarray Problems). The
 * "aha" is the incremental update: sum = sum - leaving + entering. So
 * the animation explicitly highlights the leaving/entering cells.
 */

export const SLIDING_WINDOW_CODE = `// Max-sum subarray of size K
int maxSubarraySum(int[] arr, int k) {
  int sum = 0;
  for (int i = 0; i < k; i++) sum += arr[i];
  int max = sum;
  for (int R = k; R < arr.length; R++) {
    sum = sum - arr[R - k] + arr[R];   // slide: -leaving, +entering
    if (sum > max) max = sum;
  }
  return max;
}`;

export function generateSlidingWindowSteps(arr, k) {
  if (k > arr.length || k <= 0) {
    return [{
      cells: arr.map((v) => ({ value: v, state: "default" })),
      pointers: {},
      windowSum: 0,
      maxSum: 0,
      step: { description: `Window size ${k} is invalid for array length ${arr.length}.`, detail: "Pick k between 1 and array length." },
    }];
  }

  const frames = [];
  let sum = 0;
  for (let i = 0; i < k; i++) sum += arr[i];
  let maxSum = sum;

  frames.push({
    cells: arr.map((v, i) => ({ value: v, state: i < k ? "active" : "default" })),
    pointers: { L: 0, R: k - 1 },
    windowSum: sum,
    maxSum,
    step: {
      description: `Initial window [0..${k - 1}], sum = ${sum}.`,
      detail: "Now slide rightward, one index at a time.",
    },
  });

  for (let R = k; R < arr.length; R++) {
    const L        = R - k + 1;
    const leavingI = L - 1;
    const leaving  = arr[leavingI];
    const entering = arr[R];

    frames.push({
      cells: arr.map((v, i) => {
        if (i >= L && i <= R) return { value: v, state: "active" };
        if (i === leavingI)   return { value: v, state: "compare" };
        return                       { value: v, state: "default" };
      }),
      pointers: { L: leavingI, R },
      windowSum: sum,
      maxSum,
      step: {
        description: `Leaving arr[${leavingI}] = ${leaving}, entering arr[${R}] = ${entering}.`,
        detail: `sum = ${sum} - ${leaving} + ${entering} = ${sum - leaving + entering}`,
      },
    });

    sum = sum - leaving + entering;
    if (sum > maxSum) maxSum = sum;

    frames.push({
      cells: arr.map((v, i) => ({ value: v, state: i >= L && i <= R ? "active" : "default" })),
      pointers: { L, R },
      windowSum: sum,
      maxSum,
      step: {
        description: `Window [${L}..${R}], sum = ${sum}.`,
        detail: sum === maxSum ? `New max-so-far!` : `Max so far still ${maxSum}.`,
      },
    });
  }

  frames.push({
    cells: arr.map((v) => ({ value: v, state: "default" })),
    pointers: {},
    windowSum: maxSum,
    maxSum,
    step: {
      description: `Done — max window sum = ${maxSum}.`,
      detail: `Scanned ${arr.length - k + 1} windows in O(n) total. Brute force would have been O(n·k).`,
    },
  });

  return frames;
}
