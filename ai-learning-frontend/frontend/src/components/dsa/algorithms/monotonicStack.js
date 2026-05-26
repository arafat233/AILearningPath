/**
 * monotonicStack — Next Greater Element via monotonic stack.
 *
 * Used by M33-T2 (Monotonic Stack — Next Greater, Histogram, Trapping Rain).
 *
 * Demo: for each arr[i], find the next index j > i with arr[j] > arr[i],
 * using a stack of indices waiting for their NGE to arrive.
 *
 * Frame shape:
 *   {
 *     array: number[],
 *     currentIdx: number,         // -1 before start, n after end
 *     stackIndices: number[],     // indices waiting in the stack
 *     result: (number|null)[],    // NGE values (null = not found yet)
 *     phase: 'init'|'examine'|'pop'|'push'|'done',
 *     step: { description, detail }
 *   }
 */

export const NGE_CODE = `// Next Greater Element via monotonic stack
int[] nextGreater(int[] arr) {
  int n = arr.length;
  int[] result = new int[n];
  Arrays.fill(result, -1);              // -1 = no greater element
  Deque<Integer> stack = new ArrayDeque<>();
  for (int i = 0; i < n; i++) {
    while (!stack.isEmpty() && arr[stack.peek()] < arr[i]) {
      result[stack.pop()] = arr[i];     // arr[i] is NGE of stack.top
    }
    stack.push(i);                      // wait for arr[i]'s NGE
  }
  return result;
}`;

export const LINE_BY_PHASE = { init: 6, examine: 7, pop: 9, push: 11, done: 13 };

export function generateNGESteps(arr) {
  const n = arr.length;
  const result = new Array(n).fill(null);
  const stack = [];
  const frames = [];

  const snap = (currentIdx, phase, step) => frames.push({
    array: [...arr],
    currentIdx,
    stackIndices: [...stack],
    result: [...result],
    phase,
    step,
  });

  snap(-1, "init", {
    description: "Scan left-to-right. Stack holds indices waiting for their NGE.",
    detail: "Invariant: arr at indices in the stack is strictly decreasing top→bottom.",
  });

  for (let i = 0; i < n; i++) {
    snap(i, "examine", {
      description: `Examine arr[${i}] = ${arr[i]}.`,
      detail: stack.length === 0
        ? "Stack is empty — nothing to resolve."
        : `Stack top = index ${stack[stack.length - 1]} (value ${arr[stack[stack.length - 1]]}). Pop while top < ${arr[i]}.`,
    });
    while (stack.length > 0 && arr[stack[stack.length - 1]] < arr[i]) {
      const popped = stack.pop();
      result[popped] = arr[i];
      snap(i, "pop", {
        description: `arr[${stack[stack.length - 1] ?? "(empty)"}] popped index ${popped} — NGE of arr[${popped}]=${arr[popped]} is ${arr[i]}.`,
        detail: `Set result[${popped}] = ${arr[i]}.`,
      });
    }
    stack.push(i);
    snap(i, "push", {
      description: `Push index ${i} onto the stack.`,
      detail: `Stack indices: [${stack.join(", ")}].`,
    });
  }

  snap(n, "done", {
    description: `Done. ${stack.length} index/indices left in stack — those have no greater element.`,
    detail: `result = [${result.map((v) => v == null ? "-1" : v).join(", ")}].`,
  });

  return frames;
}
