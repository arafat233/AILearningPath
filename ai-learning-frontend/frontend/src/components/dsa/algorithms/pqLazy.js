/**
 * pqLazy — Priority Queue with lazy deletion.
 *
 * Used by M36-T3 (Priority Queue Design — Lazy Deletion, Custom Comparators).
 *
 * Lazy deletion: instead of removing a node from the heap (O(n) lookup),
 * we mark its key as "deleted" in a side-set and skip-and-discard such
 * keys when they bubble up to the top on poll().
 *
 * Frame shape:
 *   {
 *     heap: number[],                 // active min-heap array
 *     tombstoned: Set as array,       // keys marked deleted
 *     activeIndices: number[],
 *     pendingOp: string | null,
 *     phase: 'init'|'push'|'mark-delete'|'peek-stale'|'discard'|'pop'|'done',
 *     step: { description, detail }
 *   }
 */

export const PQ_LAZY_CODE = `// Min-PQ with lazy deletion
class LazyPQ {
  PriorityQueue<Integer> heap = new PriorityQueue<>();
  Map<Integer, Integer> tombstones = new HashMap<>();   // value → count

  void offer(int x) { heap.offer(x); }

  void delete(int x) {                                  // O(log n) write
    tombstones.merge(x, 1, Integer::sum);
  }

  int poll() {                                          // amortised O(log n)
    while (!heap.isEmpty() && tombstones.getOrDefault(heap.peek(), 0) > 0) {
      tombstones.merge(heap.poll(), -1, Integer::sum);
    }
    return heap.poll();
  }
}`;

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

export function generatePQLazySteps(initialItems, ops) {
  const heap = [];
  for (const v of initialItems) {
    heap.push(v);
    siftUp(heap, heap.length - 1);
  }
  // tombstones map: value → count (allows duplicate values to be tombstoned multiple times)
  const tomb = {};

  const frames = [];

  const snap = (activeIndices, pendingOp, phase, step) => frames.push({
    heap: [...heap],
    tombstoned: Object.entries(tomb).filter(([_, c]) => c > 0).map(([v]) => Number(v)),
    activeIndices: [...activeIndices],
    pendingOp,
    phase, step,
  });

  snap([], null, "init", {
    description: `Initial heap: [${heap.join(", ")}].`,
    detail: "Lazy deletion: delete(x) just marks x as tombstoned. Real removal happens lazily on poll().",
  });

  for (const op of ops) {
    if (op.type === "offer") {
      heap.push(op.value);
      siftUp(heap, heap.length - 1);
      snap([heap.indexOf(op.value)], `offer(${op.value})`, "push", {
        description: `offer(${op.value}) — add and sift up.`,
        detail: `Heap: [${heap.join(", ")}].`,
      });
    } else if (op.type === "delete") {
      tomb[op.value] = (tomb[op.value] || 0) + 1;
      snap([], `delete(${op.value})`, "mark-delete", {
        description: `delete(${op.value}) — mark as tombstoned. O(1) write.`,
        detail: `Tombstones: { ${Object.entries(tomb).filter(([_, c]) => c > 0).map(([v, c]) => `${v}×${c}`).join(", ")} }.`,
      });
    } else if (op.type === "poll") {
      // Discard tombstoned roots
      while (heap.length > 0 && (tomb[heap[0]] || 0) > 0) {
        const stale = heap[0];
        snap([0], `poll()`, "peek-stale", {
          description: `Heap root ${stale} is tombstoned — discard it now.`,
          detail: `tombstones[${stale}]−−.`,
        });
        tomb[stale]--;
        // Remove root
        const last = heap.pop();
        if (heap.length > 0) {
          heap[0] = last;
          siftDown(heap, 0);
        }
        snap([], `poll()`, "discard", {
          description: `Removed tombstoned ${stale} from heap. Continue checking root.`,
          detail: `Heap: [${heap.join(", ")}].`,
        });
      }
      if (heap.length === 0) {
        snap([], `poll()`, "pop", {
          description: `Heap empty after discarding tombstones — poll returns null.`,
          detail: "",
        });
      } else {
        const top = heap[0];
        const last = heap.pop();
        if (heap.length > 0) {
          heap[0] = last;
          siftDown(heap, 0);
        }
        snap([], `poll() = ${top}`, "pop", {
          description: `poll() returns ${top}.`,
          detail: `Heap: [${heap.join(", ")}].`,
        });
      }
    }
  }

  snap([], null, "done", { description: "Done.", detail: `Heap: [${heap.join(", ")}].` });
  return frames;
}

export const DEMO_INITIAL = [3, 7, 1, 5, 9, 2, 8];
export const DEMO_OPS = [
  { type: "delete", value: 1 },
  { type: "delete", value: 7 },
  { type: "offer",  value: 4 },
  { type: "poll" },                     // skips tombstoned 1
  { type: "poll" },
  { type: "offer",  value: 6 },
  { type: "poll" },
];
