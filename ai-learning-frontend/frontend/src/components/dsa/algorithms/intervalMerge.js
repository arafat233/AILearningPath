/**
 * intervalMerge — sort-then-scan to merge overlapping intervals.
 *
 * Used by M38-T3 (Sorting Applications — Intervals, Anagrams, Custom).
 *
 * The pattern: sort by start time, then a single linear scan that
 * extends the last result interval or pushes a new one. The "sort
 * first" step is what makes the linear scan correct — that's the
 * teaching moment.
 *
 * Frame shape:
 *   {
 *     intervals: [start, end][],     // current order (may be unsorted then sorted)
 *     currentIdx: number,            // -1 before, n after
 *     result: [start, end][],
 *     mergedWithLast: boolean | null,
 *     phase: 'init'|'sort'|'sorted'|'examine'|'merge'|'new'|'done',
 *     step: { description, detail }
 *   }
 */

export const INTERVAL_MERGE_CODE = `// Merge overlapping intervals
int[][] merge(int[][] intervals) {
  if (intervals.length == 0) return intervals;
  Arrays.sort(intervals, (a, b) -> a[0] - b[0]);   // sort by start
  List<int[]> out = new ArrayList<>();
  out.add(intervals[0]);
  for (int i = 1; i < intervals.length; i++) {
    int[] last = out.get(out.size() - 1);
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);  // extend
    } else {
      out.add(intervals[i]);                         // no overlap — start new
    }
  }
  return out.toArray(new int[0][]);
}`;

export const LINE_BY_PHASE = { init: 2, sort: 4, sorted: 6, examine: 9, merge: 10, new: 12, done: 15 };

export function generateIntervalMergeSteps(intervals) {
  const frames = [];

  if (intervals.length === 0) {
    frames.push({
      intervals: [], currentIdx: -1, result: [], mergedWithLast: null, phase: "done",
      step: { description: "Empty input.", detail: "" },
    });
    return frames;
  }

  frames.push({
    intervals: intervals.map((iv) => [...iv]),
    currentIdx: -1, result: [], mergedWithLast: null, phase: "init",
    step: {
      description: `Merge ${intervals.length} intervals. Input may be unsorted.`,
      detail: "Step 1: sort by start time. Step 2: linear scan — extend last result if overlap, else push new.",
    },
  });

  // Sort phase (cheap visualization — just produce the sorted snapshot)
  const sorted = [...intervals.map((iv) => [...iv])].sort((a, b) => a[0] - b[0]);
  const wasSorted = JSON.stringify(sorted) === JSON.stringify(intervals);
  frames.push({
    intervals: sorted.map((iv) => [...iv]),
    currentIdx: -1, result: [], mergedWithLast: null, phase: "sort",
    step: {
      description: wasSorted ? "Already sorted by start time." : "Sort by start time.",
      detail: `Sorted: [${sorted.map((iv) => `[${iv[0]},${iv[1]}]`).join(", ")}].`,
    },
  });

  const result = [];
  result.push([...sorted[0]]);
  frames.push({
    intervals: sorted.map((iv) => [...iv]),
    currentIdx: 0, result: result.map((iv) => [...iv]),
    mergedWithLast: null, phase: "new",
    step: {
      description: `Seed result with the first interval [${sorted[0][0]}, ${sorted[0][1]}].`,
      detail: "",
    },
  });

  for (let i = 1; i < sorted.length; i++) {
    const cur  = sorted[i];
    const last = result[result.length - 1];
    const overlap = cur[0] <= last[1];

    frames.push({
      intervals: sorted.map((iv) => [...iv]),
      currentIdx: i, result: result.map((iv) => [...iv]),
      mergedWithLast: null, phase: "examine",
      step: {
        description: `Examine [${cur[0]}, ${cur[1]}]. Compare start ${cur[0]} with last result end ${last[1]}.`,
        detail: overlap ? `${cur[0]} ≤ ${last[1]} → overlap, merge.` : `${cur[0]} > ${last[1]} → no overlap, start new.`,
      },
    });

    if (overlap) {
      last[1] = Math.max(last[1], cur[1]);
      frames.push({
        intervals: sorted.map((iv) => [...iv]),
        currentIdx: i, result: result.map((iv) => [...iv]),
        mergedWithLast: true, phase: "merge",
        step: {
          description: `Extend last result to [${last[0]}, ${last[1]}].`,
          detail: `End = max(prev end, cur end).`,
        },
      });
    } else {
      result.push([...cur]);
      frames.push({
        intervals: sorted.map((iv) => [...iv]),
        currentIdx: i, result: result.map((iv) => [...iv]),
        mergedWithLast: false, phase: "new",
        step: {
          description: `No overlap — push [${cur[0]}, ${cur[1]}] as a new result interval.`,
          detail: "",
        },
      });
    }
  }

  frames.push({
    intervals: sorted.map((iv) => [...iv]),
    currentIdx: sorted.length, result: result.map((iv) => [...iv]),
    mergedWithLast: null, phase: "done",
    step: {
      description: `Done — ${result.length} merged interval${result.length === 1 ? "" : "s"}.`,
      detail: `Result: [${result.map((iv) => `[${iv[0]},${iv[1]}]`).join(", ")}].`,
    },
  });
  return frames;
}

export const DEMO_INTERVALS = [[1, 3], [8, 10], [2, 6], [15, 18], [9, 11], [12, 14]];
