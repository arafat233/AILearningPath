/**
 * kWayMerge — K-way merge via min-heap of (value, listIdx, posInList).
 *
 * Used by M36-T4 (K-Way Merge — K Sorted Lists, K Closest Points).
 *
 * Frame shape:
 *   {
 *     lists: number[][],        // input sorted lists
 *     pointers: number[],       // next-unmerged index per list (lists.length)
 *     heap: {value, listIdx, posInList}[],
 *     output: number[],
 *     activeListIdx: number,
 *     phase: 'init'|'pop'|'push'|'exhausted'|'done',
 *     step: { description, detail }
 *   }
 */

export const K_WAY_MERGE_CODE = `// K-way merge using a min-heap
List<Integer> mergeK(List<List<Integer>> lists) {
  PriorityQueue<int[]> pq = new PriorityQueue<>(
    Comparator.comparingInt(a -> a[0])
  );
  for (int i = 0; i < lists.size(); i++)
    if (!lists.get(i).isEmpty())
      pq.add(new int[]{ lists.get(i).get(0), i, 0 });

  List<Integer> out = new ArrayList<>();
  while (!pq.isEmpty()) {
    int[] e = pq.poll();
    out.add(e[0]);
    if (e[2] + 1 < lists.get(e[1]).size())
      pq.add(new int[]{ lists.get(e[1]).get(e[2] + 1), e[1], e[2] + 1 });
  }
  return out;
}`;

export const LINE_BY_PHASE = { init: 3, pop: 12, push: 15, exhausted: 16, done: 17 };

// Tiny manual min-heap so frames see a real partial-ordered structure.
function heapPush(h, e) {
  h.push(e);
  let i = h.length - 1;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (h[i].value >= h[p].value) break;
    [h[i], h[p]] = [h[p], h[i]];
    i = p;
  }
}
function heapPop(h) {
  if (h.length === 0) return null;
  const top = h[0];
  const last = h.pop();
  if (h.length > 0) {
    h[0] = last;
    let i = 0;
    while (true) {
      const l = 2 * i + 1, r = 2 * i + 2;
      let s = i;
      if (l < h.length && h[l].value < h[s].value) s = l;
      if (r < h.length && h[r].value < h[s].value) s = r;
      if (s === i) break;
      [h[i], h[s]] = [h[s], h[i]];
      i = s;
    }
  }
  return top;
}

export function generateKWayMergeSteps(lists) {
  const heap = [];
  const pointers = lists.map(() => 0);
  const output = [];
  const frames = [];

  // Initialize heap with first element of each non-empty list
  for (let i = 0; i < lists.length; i++) {
    if (lists[i].length > 0) heapPush(heap, { value: lists[i][0], listIdx: i, posInList: 0 });
  }

  frames.push({
    lists, pointers: [...pointers], heap: heap.map((e) => ({ ...e })), output: [...output],
    activeListIdx: -1,
    phase: "init",
    step: {
      description: `Seed heap with first element of each of ${lists.length} sorted lists.`,
      detail: `Heap top = global minimum at all times.`,
    },
  });

  while (heap.length > 0) {
    const top = heapPop(heap);
    output.push(top.value);
    pointers[top.listIdx] = top.posInList + 1;
    frames.push({
      lists, pointers: [...pointers], heap: heap.map((e) => ({ ...e })), output: [...output],
      activeListIdx: top.listIdx,
      phase: "pop",
      step: {
        description: `Pop ${top.value} (from list ${top.listIdx}, position ${top.posInList}).`,
        detail: `Output so far: [${output.join(", ")}].`,
      },
    });

    const nextPos = top.posInList + 1;
    if (nextPos < lists[top.listIdx].length) {
      const nextVal = lists[top.listIdx][nextPos];
      heapPush(heap, { value: nextVal, listIdx: top.listIdx, posInList: nextPos });
      frames.push({
        lists, pointers: [...pointers], heap: heap.map((e) => ({ ...e })), output: [...output],
        activeListIdx: top.listIdx,
        phase: "push",
        step: {
          description: `Push next from list ${top.listIdx}: ${nextVal} (position ${nextPos}).`,
          detail: `Heap values: [${heap.map((e) => e.value).join(", ")}].`,
        },
      });
    } else {
      frames.push({
        lists, pointers: [...pointers], heap: heap.map((e) => ({ ...e })), output: [...output],
        activeListIdx: top.listIdx,
        phase: "exhausted",
        step: {
          description: `List ${top.listIdx} exhausted.`,
          detail: `Heap values: [${heap.map((e) => e.value).join(", ")}].`,
        },
      });
    }
  }

  frames.push({
    lists, pointers: [...pointers], heap: [], output: [...output],
    activeListIdx: -1,
    phase: "done",
    step: {
      description: "Done.",
      detail: `Merged: [${output.join(", ")}]. Complexity: O(N log k) for N total elements, k lists.`,
    },
  });

  return frames;
}

export const DEMO_LISTS = [
  [1, 6, 11, 18],
  [2, 7, 9, 24],
  [3, 4, 15, 20],
  [5, 8, 13, 22],
];
