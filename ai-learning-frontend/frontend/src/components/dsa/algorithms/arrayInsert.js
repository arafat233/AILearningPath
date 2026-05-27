/**
 * arrayInsert — array insert-at-index with shift-right animation.
 *
 * From the D2 parity checklist. log2base2 explicitly animates this
 * operation; Stellar didn't visualize it before. The teaching moment
 * is "every element after the insertion point gets bumped right by 1
 * — this is why array insert at the middle is O(n)."
 *
 * Frame:
 *   {
 *     array: number[],            // current contents (length = original + 0 or 1)
 *     activeIdx: number,          // index being read/written at this step
 *     insertIdx: number,
 *     insertValue: number,
 *     phase: 'init'|'shift'|'place'|'done',
 *     step: { description, detail }
 *   }
 */

export const ARRAY_INSERT_CODE = `// Insert value into a fixed-size array at index
void insertAt(int[] arr, int n, int idx, int value) {
  if (idx > n || n >= arr.length) return;   // bounds
  for (int i = n; i > idx; i--) {
    arr[i] = arr[i - 1];                    // shift right
  }
  arr[idx] = value;                         // place
}`;

export function generateArrayInsertSteps(initialArr, insertIdx, insertValue) {
  const frames = [];
  const arr = [...initialArr];
  const n = arr.length;

  frames.push({
    array: [...arr], activeIdx: -1, insertIdx, insertValue,
    phase: "init",
    step: {
      description: `Insert ${insertValue} at index ${insertIdx} into [${arr.join(", ")}].`,
      detail: `Length grows from ${n} to ${n + 1}. Every element at index ≥ ${insertIdx} shifts right by 1.`,
    },
  });

  if (insertIdx < 0 || insertIdx > n) {
    frames.push({
      array: [...arr], activeIdx: -1, insertIdx, insertValue,
      phase: "done",
      step: { description: `Index ${insertIdx} out of bounds for length ${n}.`, detail: "" },
    });
    return frames;
  }

  // Grow the array (append placeholder at end so shifts have somewhere to go)
  arr.push(null);

  // Shift right: from i = n down to insertIdx + 1
  for (let i = n; i > insertIdx; i--) {
    arr[i] = arr[i - 1];
    frames.push({
      array: [...arr], activeIdx: i, insertIdx, insertValue,
      phase: "shift",
      step: {
        description: `arr[${i}] = arr[${i - 1}] = ${arr[i]}.`,
        detail: `Shifting right to make room. Every shift is O(1); n − idx shifts = O(n − idx).`,
      },
    });
  }

  // Place the new value
  arr[insertIdx] = insertValue;
  frames.push({
    array: [...arr], activeIdx: insertIdx, insertIdx, insertValue,
    phase: "place",
    step: {
      description: `arr[${insertIdx}] = ${insertValue}.`,
      detail: "Slot is now free — drop the new value in.",
    },
  });

  frames.push({
    array: [...arr], activeIdx: -1, insertIdx, insertValue,
    phase: "done",
    step: {
      description: "Done.",
      detail: `Final: [${arr.join(", ")}]. Total operations: ${n - insertIdx} shifts + 1 write = O(n).`,
    },
  });
  return frames;
}

export const LINE_BY_PHASE = { init: 2, shift: 5, place: 7, done: 8 };

export const DEMO_ARR = [10, 20, 30, 40, 50, 60];
export const DEMO_INSERT_IDX = 2;
export const DEMO_INSERT_VALUE = 99;
