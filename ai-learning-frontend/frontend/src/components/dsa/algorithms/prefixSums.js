/**
 * prefixSums — build phase + range-query phase animation.
 *
 * Used by M30-T3 (Prefix Sums — O(1) Range Queries). Two-phase animation
 * makes the trick obvious: O(n) preprocessing buys O(1) per query.
 *
 * Frame shape:
 *   {
 *     arr: number[], prefix: number[],
 *     arrActive: number, prefixActive: number,
 *     queryL: number, queryR: number,
 *     queryHighlight: [highIdx, lowIdx] | null,    // prefix indices for the query
 *     queryResult: number | null,
 *     phase: 'init'|'build'|'built'|'query'|'result',
 *     step: { description, detail }
 *   }
 */

export const PREFIX_SUMS_CODE = `// Prefix sums for O(1) range queries
int[] buildPrefix(int[] arr) {
  int[] p = new int[arr.length + 1];
  for (int i = 0; i < arr.length; i++) {
    p[i + 1] = p[i] + arr[i];
  }
  return p;
}

int rangeSum(int[] prefix, int L, int R) {
  return prefix[R + 1] - prefix[L];   // O(1) after O(n) preprocessing
}`;

export const LINE_BY_PHASE = { init: 3, build: 5, built: 7, query: 11, result: 11 };

export function generatePrefixSumsSteps(arr, queryL, queryR) {
  const prefix = new Array(arr.length + 1).fill(0);
  const frames = [];

  frames.push({
    arr: [...arr], prefix: [...prefix],
    arrActive: -1, prefixActive: -1,
    queryL: -1, queryR: -1, queryHighlight: null, queryResult: null,
    phase: "init",
    step: {
      description: "Build the prefix array: prefix[i+1] = prefix[i] + arr[i].",
      detail: "prefix[0] = 0 by convention so the range formula works for L = 0.",
    },
  });

  for (let i = 0; i < arr.length; i++) {
    prefix[i + 1] = prefix[i] + arr[i];
    frames.push({
      arr: [...arr], prefix: [...prefix],
      arrActive: i, prefixActive: i + 1,
      queryL: -1, queryR: -1, queryHighlight: null, queryResult: null,
      phase: "build",
      step: {
        description: `prefix[${i + 1}] = prefix[${i}] + arr[${i}] = ${prefix[i]} + ${arr[i]} = ${prefix[i + 1]}.`,
        detail: `prefix so far: [${prefix.slice(0, i + 2).join(", ")}…].`,
      },
    });
  }

  frames.push({
    arr: [...arr], prefix: [...prefix],
    arrActive: -1, prefixActive: -1,
    queryL: -1, queryR: -1, queryHighlight: null, queryResult: null,
    phase: "built",
    step: {
      description: "Prefix array built. Any range sum is now O(1).",
      detail: `Final prefix: [${prefix.join(", ")}].`,
    },
  });

  if (queryL >= 0 && queryR >= queryL && queryR < arr.length) {
    frames.push({
      arr: [...arr], prefix: [...prefix],
      arrActive: -1, prefixActive: -1,
      queryL, queryR, queryHighlight: [queryR + 1, queryL], queryResult: null,
      phase: "query",
      step: {
        description: `Query: sum of arr[${queryL}..${queryR}].`,
        detail: `Read two prefix entries: prefix[${queryR + 1}] − prefix[${queryL}].`,
      },
    });
    const result = prefix[queryR + 1] - prefix[queryL];
    frames.push({
      arr: [...arr], prefix: [...prefix],
      arrActive: -1, prefixActive: -1,
      queryL, queryR, queryHighlight: [queryR + 1, queryL], queryResult: result,
      phase: "result",
      step: {
        description: `Range sum = prefix[${queryR + 1}] − prefix[${queryL}] = ${prefix[queryR + 1]} − ${prefix[queryL]} = ${result}.`,
        detail: "One subtraction, regardless of range length.",
      },
    });
  }

  return frames;
}
