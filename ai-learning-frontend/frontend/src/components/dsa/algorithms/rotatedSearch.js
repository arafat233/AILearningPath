/**
 * rotatedSearch — Binary search on a rotated sorted array.
 *
 * Used by M39-T3 (Rotated Arrays — Search, Find Min, Find Peak).
 *
 * Per iteration, ONE half of [L..R] is sorted — figure out which by
 * comparing arr[L] vs arr[mid]. Then check if target falls in the
 * sorted half; if yes, recurse there; if no, recurse the other half.
 *
 * Frame shape:
 *   {
 *     arr: number[], target: number,
 *     L: number, R: number, mid: number,
 *     halfSorted: 'left' | 'right' | null,
 *     foundIdx: number | null,
 *     phase: 'init'|'compare'|'decide'|'found'|'not-found',
 *     step: { description, detail }
 *   }
 */

export const ROTATED_SEARCH_CODE = `// Binary search on a rotated sorted array
int search(int[] arr, int target) {
  int L = 0, R = arr.length - 1;
  while (L <= R) {
    int mid = (L + R) >>> 1;
    if (arr[mid] == target) return mid;
    if (arr[L] <= arr[mid]) {                        // left half is sorted
      if (arr[L] <= target && target < arr[mid]) R = mid - 1;
      else                                          L = mid + 1;
    } else {                                         // right half is sorted
      if (arr[mid] < target && target <= arr[R]) L = mid + 1;
      else                                          R = mid - 1;
    }
  }
  return -1;
}`;

export const LINE_BY_PHASE = { init: 3, compare: 6, decide: 7, found: 6, "not-found": 16 };

export function generateRotatedSearchSteps(arr, target) {
  const frames = [];
  let L = 0, R = arr.length - 1;

  frames.push({
    arr: [...arr], target, L, R, mid: -1, halfSorted: null, foundIdx: null,
    phase: "init",
    step: {
      description: `Search ${target} in rotated array.`,
      detail: "Each iteration: one half of [L..R] is guaranteed sorted. Decide which, then check if target is inside it.",
    },
  });

  while (L <= R) {
    const mid = (L + R) >>> 1;
    frames.push({
      arr: [...arr], target, L, R, mid, halfSorted: null, foundIdx: null,
      phase: "compare",
      step: {
        description: `mid = ${mid}, arr[mid] = ${arr[mid]}.`,
        detail: arr[mid] === target ? `Equal to target!` : "Decide which half is sorted next.",
      },
    });

    if (arr[mid] === target) {
      frames.push({
        arr: [...arr], target, L, R, mid, halfSorted: null, foundIdx: mid,
        phase: "found",
        step: { description: `Found at index ${mid}.`, detail: "" },
      });
      return frames;
    }

    if (arr[L] <= arr[mid]) {
      const inLeft = arr[L] <= target && target < arr[mid];
      frames.push({
        arr: [...arr], target, L, R, mid, halfSorted: "left", foundIdx: null,
        phase: "decide",
        step: {
          description: `Left half [${L}..${mid}] sorted (arr[L]=${arr[L]} ≤ arr[mid]=${arr[mid]}).`,
          detail: inLeft
            ? `${arr[L]} ≤ ${target} < ${arr[mid]} → target is in left half. Search left.`
            : `${target} not in [${arr[L]}, ${arr[mid]}) → search right.`,
        },
      });
      if (inLeft) R = mid - 1;
      else        L = mid + 1;
    } else {
      const inRight = arr[mid] < target && target <= arr[R];
      frames.push({
        arr: [...arr], target, L, R, mid, halfSorted: "right", foundIdx: null,
        phase: "decide",
        step: {
          description: `Right half [${mid}..${R}] sorted (arr[mid]=${arr[mid]} < arr[L]=${arr[L]}, so rotation cut is on the left).`,
          detail: inRight
            ? `${arr[mid]} < ${target} ≤ ${arr[R]} → target is in right half. Search right.`
            : `${target} not in (${arr[mid]}, ${arr[R]}] → search left.`,
        },
      });
      if (inRight) L = mid + 1;
      else         R = mid - 1;
    }
  }

  frames.push({
    arr: [...arr], target, L, R, mid: -1, halfSorted: null, foundIdx: -1,
    phase: "not-found",
    step: { description: `Search exhausted (L=${L} > R=${R}).`, detail: `${target} not in array. Return -1.` },
  });
  return frames;
}
