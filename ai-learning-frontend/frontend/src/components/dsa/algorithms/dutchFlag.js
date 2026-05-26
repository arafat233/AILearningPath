/**
 * dutchFlag — Dijkstra's 3-way partition step generator.
 *
 * Used by M30-T4 (Dutch National Flag — 3-Way Partition).
 *
 * Invariant maintained at every step:
 *   arr[0..low-1]   = 0s (red)
 *   arr[low..mid-1] = 1s (white)
 *   arr[mid..high]  = unknown (being scanned)
 *   arr[high+1..n]  = 2s (blue)
 *
 * The animation makes the three regions visually obvious via cell state.
 */

export const DUTCH_FLAG_CODE = `// 3-way partition (Dutch National Flag)
void sortColors(int[] arr) {
  int low = 0, mid = 0, high = arr.length - 1;
  while (mid <= high) {
    if (arr[mid] == 0) {
      swap(arr, low++, mid++);    // red region grows
    } else if (arr[mid] == 2) {
      swap(arr, mid, high--);     // blue region grows (don't ++mid; new value not yet checked)
    } else {
      mid++;                      // arr[mid] == 1, already in place
    }
  }
}`;

// Encode the 3 colour states using ArrayBars-compatible flags.
//  red region   -> sorted (left fixed)
//  white region -> default
//  blue region  -> sorted (right fixed)
// Active scan index -> compare
function regionStates(low, mid, high, n) {
  return Array.from({ length: n }, (_, i) => {
    if (i < low)          return "sorted";   // red, fixed
    if (i > high)         return "sorted";   // blue, fixed
    if (i === mid)        return "compare";  // active scan
    return "default";                         // white / unknown
  });
}

export function generateDutchFlagSteps(arr) {
  const a = [...arr];
  const n = a.length;
  const frames = [];
  let low = 0, mid = 0, high = n - 1;

  const snap = (note) => frames.push({
    array:     [...a],
    states:    regionStates(low, mid, high, n),
    pointers:  { low, mid, high },
    step:      note,
  });

  snap({
    description: "Three pointers: low (red boundary), mid (scan), high (blue boundary).",
    detail: "Scan while mid ≤ high. At each step decide based on arr[mid].",
  });

  while (mid <= high) {
    const v = a[mid];
    snap({
      description: `arr[mid=${mid}] = ${v}.`,
      detail: v === 0
        ? "Zero → swap with arr[low], advance both."
        : v === 2
          ? "Two → swap with arr[high], shrink high (don't advance mid — new value not yet seen)."
          : "One → already in the middle region, advance mid only.",
    });
    if (v === 0) {
      [a[low], a[mid]] = [a[mid], a[low]];
      low++; mid++;
      snap({
        description: `Swapped to arr[low]. low → ${low}, mid → ${mid}.`,
        detail: `Red region grows. arr = [${a.join(", ")}].`,
      });
    } else if (v === 2) {
      [a[mid], a[high]] = [a[high], a[mid]];
      high--;
      snap({
        description: `Swapped with arr[high]. high → ${high}.`,
        detail: `Blue region grows. arr = [${a.join(", ")}]. (mid stays — re-examine the new value.)`,
      });
    } else {
      mid++;
      snap({
        description: `One in place. mid → ${mid}.`,
        detail: `arr = [${a.join(", ")}].`,
      });
    }
  }

  frames.push({
    array: [...a],
    states: a.map(() => "sorted"),
    pointers: { low, mid, high },
    step: {
      description: "Done — array partitioned in one O(n) pass.",
      detail: `Result: [${a.join(", ")}].`,
    },
  });

  return frames;
}
