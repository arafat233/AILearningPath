/**
 * slidingWindowMax — Sliding window maximum via monotonic deque.
 *
 * Used by M33-T4 (Deque & Sliding Window Maximum). The deque stores
 * INDICES, kept decreasing-by-value so the front is always the current
 * window's max.
 *
 * Frame shape:
 *   {
 *     arr: number[], k: number,
 *     dq: number[],            // current deque (indices, front first)
 *     result: number[],
 *     currentIdx: number,
 *     windowL: number, windowR: number,
 *     phase: 'init'|'pollFirst'|'pollLast'|'add'|'window'|'done',
 *     step: { description, detail }
 *   }
 */

export const SLIDING_WINDOW_MAX_CODE = `// Sliding window maximum via monotonic deque
int[] maxSlidingWindow(int[] arr, int k) {
  int[] result = new int[arr.length - k + 1];
  Deque<Integer> dq = new ArrayDeque<>();  // stores indices, decreasing values
  for (int i = 0; i < arr.length; i++) {
    while (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();  // out of window
    while (!dq.isEmpty() && arr[dq.peekLast()] < arr[i]) dq.pollLast();  // can't be max anymore
    dq.addLast(i);
    if (i >= k - 1) result[i - k + 1] = arr[dq.peekFirst()];
  }
  return result;
}`;

export function generateSlidingWindowMaxSteps(arr, k) {
  if (k <= 0 || k > arr.length) {
    return [{
      arr: [...arr], k, dq: [], result: [],
      currentIdx: -1, windowL: -1, windowR: -1,
      phase: "init",
      step: { description: `Invalid k = ${k} for array length ${arr.length}.`, detail: "" },
    }];
  }
  const frames = [];
  const dq = [];
  const result = [];

  frames.push({
    arr: [...arr], k, dq: [], result: [],
    currentIdx: -1, windowL: -1, windowR: -1,
    phase: "init",
    step: {
      description: `Sliding window max with k = ${k}.`,
      detail: "Deque holds indices in decreasing-by-value order. Front is always the current window's max.",
    },
  });

  for (let i = 0; i < arr.length; i++) {
    // 1. Evict stale front (outside window)
    while (dq.length > 0 && dq[0] <= i - k) {
      const evict = dq.shift();
      frames.push({
        arr: [...arr], k, dq: [...dq], result: [...result],
        currentIdx: i, windowL: Math.max(0, i - k + 1), windowR: i,
        phase: "pollFirst",
        step: {
          description: `Front index ${evict} fell out of window — pollFirst().`,
          detail: `Window is [${Math.max(0, i - k + 1)}..${i}]; ${evict} < ${i - k + 1}.`,
        },
      });
    }

    // 2. Evict smaller from back
    while (dq.length > 0 && arr[dq[dq.length - 1]] < arr[i]) {
      const popped = dq.pop();
      frames.push({
        arr: [...arr], k, dq: [...dq], result: [...result],
        currentIdx: i, windowL: Math.max(0, i - k + 1), windowR: i,
        phase: "pollLast",
        step: {
          description: `arr[${popped}] = ${arr[popped]} < arr[${i}] = ${arr[i]} — pollLast().`,
          detail: `${arr[popped]} can never be max while ${arr[i]} is in window.`,
        },
      });
    }

    // 3. Add current
    dq.push(i);
    frames.push({
      arr: [...arr], k, dq: [...dq], result: [...result],
      currentIdx: i, windowL: Math.max(0, i - k + 1), windowR: i,
      phase: "add",
      step: {
        description: `Add index ${i} to back. Deque indices: [${dq.join(", ")}].`,
        detail: `Values along deque: [${dq.map((d) => arr[d]).join(", ")}] — decreasing.`,
      },
    });

    // 4. Record window max
    if (i >= k - 1) {
      result.push(arr[dq[0]]);
      frames.push({
        arr: [...arr], k, dq: [...dq], result: [...result],
        currentIdx: i, windowL: i - k + 1, windowR: i,
        phase: "window",
        step: {
          description: `Window [${i - k + 1}..${i}] formed. Max = arr[${dq[0]}] = ${arr[dq[0]]}.`,
          detail: `Result so far: [${result.join(", ")}].`,
        },
      });
    }
  }

  frames.push({
    arr: [...arr], k, dq: [...dq], result: [...result],
    currentIdx: arr.length, windowL: -1, windowR: -1,
    phase: "done",
    step: {
      description: "Done.",
      detail: `Result: [${result.join(", ")}]. O(n) total — each index enters and leaves the deque at most once.`,
    },
  });

  return frames;
}
