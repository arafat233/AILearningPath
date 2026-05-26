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

const frame = (arr, activeIndices, step) => ({
  array: [...arr],
  activeIndices: [...activeIndices],
  step,
});

export function generateHeapInsertSteps(heap, value) {
  const arr = [...heap, value];
  const frames = [];

  frames.push(frame(arr, [arr.length - 1], {
    description: `Insert ${value}. Place at index ${arr.length - 1} (end of array).`,
    detail: 'Now sift up: compare with parent and swap if smaller.',
  }));

  let i = arr.length - 1;
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    const willSwap = arr[i] < arr[parent];
    frames.push(frame(arr, [i, parent], {
      description: `Compare arr[${i}] = ${arr[i]} with parent arr[${parent}] = ${arr[parent]}.`,
      detail: willSwap
        ? `${arr[i]} < ${arr[parent]} → swap (sift up).`
        : `${arr[i]} ≥ ${arr[parent]} → heap property holds. Stop.`,
    }));
    if (!willSwap) break;
    [arr[i], arr[parent]] = [arr[parent], arr[i]];
    frames.push(frame(arr, [parent, i], {
      description: `Swapped arr[${i}] and arr[${parent}].`,
      detail: `Heap = [${arr.join(', ')}]. Continue from index ${parent}.`,
    }));
    i = parent;
  }

  frames.push(frame(arr, [], {
    description: 'Heap property restored.',
    detail: `Final heap: [${arr.join(', ')}]. size = ${arr.length}.`,
  }));
  return frames;
}

export function generateHeapExtractSteps(heap) {
  if (heap.length === 0) {
    return [frame([], [], {
      description: 'Heap is empty — extractMin() would throw.',
      detail: 'Add elements first using Insert.',
    })];
  }

  const arr = [...heap];
  const min = arr[0];
  const frames = [];

  frames.push(frame(arr, [0], {
    description: `Extract root (min) = ${min}.`,
    detail: 'Strategy: move last element to root, then sift down.',
  }));

  const last = arr.pop();
  if (arr.length === 0) {
    frames.push(frame([], [], {
      description: `Returned ${min}. Heap is now empty.`,
      detail: '',
    }));
    return frames;
  }
  arr[0] = last;
  frames.push(frame(arr, [0], {
    description: `Move last element (${last}) to root.`,
    detail: 'Now sift down to restore heap property.',
  }));

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
    }));
    if (smallest === i) break;
    [arr[i], arr[smallest]] = [arr[smallest], arr[i]];
    frames.push(frame(arr, [smallest, i], {
      description: `Swapped arr[${i}] and arr[${smallest}].`,
      detail: `Heap = [${arr.join(', ')}]. Continue from index ${smallest}.`,
    }));
    i = smallest;
  }

  frames.push(frame(arr, [], {
    description: `Done — extracted ${min}.`,
    detail: `Heap = [${arr.join(', ')}]. size = ${arr.length}.`,
  }));
  return frames;
}
