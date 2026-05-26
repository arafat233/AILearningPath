/**
 * heap — step generators for binary min-heap operations.
 *
 * Two operations exposed:
 *   generateHeapInsertSteps(heap, value)  — insert with sift-up
 *   generateHeapExtractSteps(heap)        — extract-min with sift-down
 *
 * Frame shape:
 *   { array: number[], activeIndices: number[], step: {description, detail} }
 *
 * The mode component (HeapSandbox) renders both views:
 *   - array cells (ArrayVisualizer) with `activeIndices` highlighted as
 *     'compare'
 *   - tree view (TreeVisualizer) built from the same array using the
 *     parent=(i-1)/2, left=2i+1, right=2i+2 convention
 *
 * Showing both side-by-side is the entire teaching moment: "this array
 * IS the tree." Without that pairing, beginners memorise the index math
 * without ever seeing the structure it encodes.
 */

export const HEAP_INSERT_CODE = `// Min-heap insert
void insert(int x) {
  arr[size++] = x;          // append at end
  int i = size - 1;
  while (i > 0) {
    int parent = (i - 1) / 2;
    if (arr[i] >= arr[parent]) break;
    swap(i, parent);        // sift up
    i = parent;
  }
}`;

export const HEAP_EXTRACT_CODE = `// Min-heap extract-min
int extractMin() {
  int min = arr[0];
  arr[0] = arr[--size];     // move last to root
  int i = 0;
  while (true) {
    int l = 2*i + 1, r = 2*i + 2, smallest = i;
    if (l < size && arr[l] < arr[smallest]) smallest = l;
    if (r < size && arr[r] < arr[smallest]) smallest = r;
    if (smallest == i) break;
    swap(i, smallest);      // sift down
    i = smallest;
  }
  return min;
}`;

const frame = (arr, activeIndices, step, phase) => ({
  array: [...arr],
  activeIndices: [...activeIndices],
  phase,
  step,
});

// HEAP_INSERT_CODE: 1 // comment, 2 method open, 3 append, 4 i = size-1,
// 5 while, 6 parent, 7 if, 8 swap, 9 i = parent, 10 close while, 11 close method
// HEAP_EXTRACT_CODE: 1 //, 2 method, 3 min = arr[0], 4 move last,
// 5 i = 0, 6 while, 7 l/r/smallest, 8 if left, 9 if right, 10 if smallest == i,
// 11 swap, 12 i = smallest, 13 close while, 14 return, 15 close method
export const LINE_BY_PHASE_INSERT  = { "insert-init": 3, "sift-up-compare": 7, "sift-up-swap": 8, "insert-done": 11 };
export const LINE_BY_PHASE_EXTRACT = { "extract-empty": 2, "extract-init": 3, "extract-move-last": 4, "sift-down-check": 8, "sift-down-swap": 11, "extract-done": 14 };

export function generateHeapInsertSteps(heap, value) {
  const arr = [...heap, value];
  const frames = [];

  frames.push(frame(arr, [arr.length - 1], {
    description: `Insert ${value}. Place at index ${arr.length - 1} (end of array).`,
    detail: 'Now sift up: compare with parent and swap if smaller.',
  }, "insert-init"));

  let i = arr.length - 1;
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    const willSwap = arr[i] < arr[parent];
    frames.push(frame(arr, [i, parent], {
      description: `Compare arr[${i}] = ${arr[i]} with parent arr[${parent}] = ${arr[parent]}.`,
      detail: willSwap
        ? `${arr[i]} < ${arr[parent]} → swap (sift up).`
        : `${arr[i]} ≥ ${arr[parent]} → heap property holds. Stop.`,
    }, "sift-up-compare"));
    if (!willSwap) break;
    [arr[i], arr[parent]] = [arr[parent], arr[i]];
    frames.push(frame(arr, [parent, i], {
      description: `Swapped arr[${i}] and arr[${parent}].`,
      detail: `Heap = [${arr.join(', ')}]. Continue from index ${parent}.`,
    }, "sift-up-swap"));
    i = parent;
  }

  frames.push(frame(arr, [], {
    description: 'Heap property restored.',
    detail: `Final heap: [${arr.join(', ')}]. size = ${arr.length}.`,
  }, "insert-done"));
  return frames;
}

export function generateHeapExtractSteps(heap) {
  if (heap.length === 0) {
    return [frame([], [], {
      description: 'Heap is empty — extractMin() would throw.',
      detail: 'Add elements first using Insert.',
    }, "extract-empty")];
  }

  const arr = [...heap];
  const min = arr[0];
  const frames = [];

  frames.push(frame(arr, [0], {
    description: `Extract root (min) = ${min}.`,
    detail: 'Strategy: move last element to root, then sift down.',
  }, "extract-init"));

  const last = arr.pop();
  if (arr.length === 0) {
    frames.push(frame([], [], {
      description: `Returned ${min}. Heap is now empty.`,
      detail: '',
    }, "extract-done"));
    return frames;
  }
  arr[0] = last;
  frames.push(frame(arr, [0], {
    description: `Move last element (${last}) to root.`,
    detail: 'Now sift down to restore heap property.',
  }, "extract-move-last"));

  let i = 0;
  // Loop bound prevents pathological infinite cycles (shouldn't happen, but cheap insurance).
  for (let guard = 0; guard < arr.length + 1; guard++) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let smallest = i;
    if (l < arr.length && arr[l] < arr[smallest]) smallest = l;
    if (r < arr.length && arr[r] < arr[smallest]) smallest = r;

    const activeNow = [i];
    if (l < arr.length) activeNow.push(l);
    if (r < arr.length) activeNow.push(r);

    const childList = [];
    if (l < arr.length) childList.push(`arr[${l}]=${arr[l]}`);
    if (r < arr.length) childList.push(`arr[${r}]=${arr[r]}`);

    frames.push(frame(arr, activeNow, {
      description: `At index ${i} (value ${arr[i]}). Children: ${childList.join(', ') || 'none'}.`,
      detail: smallest === i
        ? 'Already smallest — heap property holds. Stop.'
        : `Smallest is index ${smallest} (${arr[smallest]}). Swap.`,
    }, "sift-down-check"));
    if (smallest === i) break;
    [arr[i], arr[smallest]] = [arr[smallest], arr[i]];
    frames.push(frame(arr, [smallest, i], {
      description: `Swapped arr[${i}] and arr[${smallest}].`,
      detail: `Heap = [${arr.join(', ')}]. Continue from index ${smallest}.`,
    }, "sift-down-swap"));
    i = smallest;
  }

  frames.push(frame(arr, [], {
    description: `Done — extracted ${min}.`,
    detail: `Heap = [${arr.join(', ')}]. size = ${arr.length}.`,
  }, "extract-done"));
  return frames;
}
