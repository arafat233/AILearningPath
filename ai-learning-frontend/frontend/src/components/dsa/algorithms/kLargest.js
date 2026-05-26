/**
 * kLargest — streaming K-largest via a min-heap of size K.
 *
 * Used by M36-T2 (Heap Patterns — K Largest, Median Stream).
 *
 * Insight: keep a MIN-heap of size K. New value > heap.peek() → replace
 * root + sift-down. At the end, the heap contains the K largest seen.
 *
 * Frame shape:
 *   {
 *     stream: number[],          // input stream
 *     streamIdx: number,         // current index being processed (-1 before start)
 *     heap: number[],            // current min-heap (size ≤ k)
 *     activeHeapIndices: number[],
 *     k: number,
 *     phase: 'init'|'fill'|'compare'|'replace'|'skip'|'done',
 *     step: { description, detail }
 *   }
 */

export const K_LARGEST_CODE = `// K largest from a stream via min-heap of size K
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
for (int x : stream) {
  if (minHeap.size() < k) {
    minHeap.offer(x);              // fill until size k
  } else if (x > minHeap.peek()) {
    minHeap.poll();                // smallest of the top-k leaves
    minHeap.offer(x);              // new value joins the top-k
  }
}
// minHeap now contains the K largest seen`;

export const LINE_BY_PHASE = { init: 2, fill: 5, compare: 6, replace: 8, skip: 9, done: 11 };

// Min-heap helpers (operate on a mutable array).
function siftUp(h, i) {
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (h[i] >= h[p]) break;
    [h[i], h[p]] = [h[p], h[i]];
    i = p;
  }
}
function siftDown(h, i) {
  const n = h.length;
  while (true) {
    const l = 2 * i + 1, r = 2 * i + 2;
    let s = i;
    if (l < n && h[l] < h[s]) s = l;
    if (r < n && h[r] < h[s]) s = r;
    if (s === i) break;
    [h[i], h[s]] = [h[s], h[i]];
    i = s;
  }
}

export function generateKLargestSteps(stream, k) {
  const frames = [];
  const heap = [];

  frames.push({
    stream, streamIdx: -1, heap: [], activeHeapIndices: [], k,
    phase: "init",
    step: {
      description: `Find ${k} largest in the stream using a min-heap of size ${k}.`,
      detail: "Min-heap means the SMALLEST of the top-k is at the root — easy to compare against new values.",
    },
  });

  for (let idx = 0; idx < stream.length; idx++) {
    const x = stream[idx];

    if (heap.length < k) {
      heap.push(x);
      siftUp(heap, heap.length - 1);
      frames.push({
        stream, streamIdx: idx, heap: [...heap], activeHeapIndices: [], k,
        phase: "fill",
        step: {
          description: `Heap not yet full (size ${heap.length}/${k}) — add ${x}.`,
          detail: `Heap: [${heap.join(", ")}]. Root = min of top-k = ${heap[0]}.`,
        },
      });
      continue;
    }

    frames.push({
      stream, streamIdx: idx, heap: [...heap], activeHeapIndices: [0], k,
      phase: "compare",
      step: {
        description: `Compare new value ${x} with heap root (smallest of top-k) = ${heap[0]}.`,
        detail: x > heap[0]
          ? `${x} > ${heap[0]} — replace root, sift down.`
          : `${x} ≤ ${heap[0]} — skip. ${x} can't be in the top-${k}.`,
      },
    });

    if (x > heap[0]) {
      heap[0] = x;
      siftDown(heap, 0);
      frames.push({
        stream, streamIdx: idx, heap: [...heap], activeHeapIndices: [], k,
        phase: "replace",
        step: {
          description: `Replaced root with ${x}, sifted down.`,
          detail: `Heap: [${heap.join(", ")}]. New min of top-k = ${heap[0]}.`,
        },
      });
    } else {
      frames.push({
        stream, streamIdx: idx, heap: [...heap], activeHeapIndices: [], k,
        phase: "skip",
        step: { description: `Skipped ${x}.`, detail: `Heap unchanged: [${heap.join(", ")}].` },
      });
    }
  }

  const sorted = [...heap].sort((a, b) => b - a);
  frames.push({
    stream, streamIdx: stream.length, heap: [...heap], activeHeapIndices: [], k,
    phase: "done",
    step: {
      description: `Done — heap holds the ${heap.length} largest values.`,
      detail: `Sorted desc: [${sorted.join(", ")}].`,
    },
  });

  return frames;
}
