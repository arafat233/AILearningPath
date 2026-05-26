/**
 * matrixSearch — staircase search on a row+col-sorted matrix.
 *
 * Used by M39-T4 (2D Binary Search — Matrix Search, Search Space).
 *
 * Standard "search a 2D matrix II" approach: start at top-right corner;
 * if cur > target → go left (column decreases), if cur < target → go
 * down (row increases). O(rows + cols).
 *
 * Frame shape:
 *   {
 *     matrix: number[][], rows: number, cols: number, target: number,
 *     curRow: number, curCol: number,
 *     visited: [r,c][],
 *     foundAt: [r,c] | null,
 *     phase: 'init'|'compare'|'go-left'|'go-down'|'found'|'not-found',
 *     step: { description, detail }
 *   }
 */

export const MATRIX_SEARCH_CODE = `// Search a row/col-sorted matrix (top-right staircase)
boolean search(int[][] m, int target) {
  int r = 0, c = m[0].length - 1;
  while (r < m.length && c >= 0) {
    if (m[r][c] == target) return true;
    if (m[r][c] > target)  c--;        // go left — smaller values
    else                    r++;        // go down — larger values
  }
  return false;
}`;

export function generateMatrixSearchSteps(matrix, target) {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;
  const frames = [];
  const visited = [];

  if (rows === 0 || cols === 0) {
    frames.push({
      matrix, rows, cols, target, curRow: -1, curCol: -1, visited,
      foundAt: null, phase: "not-found",
      step: { description: "Empty matrix.", detail: "Return false." },
    });
    return frames;
  }

  let r = 0, c = cols - 1;
  visited.push([r, c]);
  frames.push({
    matrix: matrix.map((row) => [...row]), rows, cols, target,
    curRow: r, curCol: c, visited: visited.map((p) => [...p]),
    foundAt: null, phase: "init",
    step: {
      description: `Start at top-right corner (0, ${cols - 1}).`,
      detail: "From here, going left decreases the value; going down increases it. So each comparison eliminates a row OR a column.",
    },
  });

  while (r < rows && c >= 0) {
    const v = matrix[r][c];
    frames.push({
      matrix: matrix.map((row) => [...row]), rows, cols, target,
      curRow: r, curCol: c, visited: visited.map((p) => [...p]),
      foundAt: null, phase: "compare",
      step: {
        description: `matrix[${r}][${c}] = ${v}, target = ${target}.`,
        detail: v === target ? "Match!" : v > target ? `${v} > ${target} → eliminate column ${c} (go left).` : `${v} < ${target} → eliminate row ${r} (go down).`,
      },
    });
    if (v === target) {
      frames.push({
        matrix: matrix.map((row) => [...row]), rows, cols, target,
        curRow: r, curCol: c, visited: visited.map((p) => [...p]),
        foundAt: [r, c], phase: "found",
        step: { description: `Found at (${r}, ${c}).`, detail: "Return true." },
      });
      return frames;
    }
    if (v > target) {
      c--;
      if (c >= 0) {
        visited.push([r, c]);
        frames.push({
          matrix: matrix.map((row) => [...row]), rows, cols, target,
          curRow: r, curCol: c, visited: visited.map((p) => [...p]),
          foundAt: null, phase: "go-left",
          step: { description: `Move left to (${r}, ${c}).`, detail: "" },
        });
      }
    } else {
      r++;
      if (r < rows) {
        visited.push([r, c]);
        frames.push({
          matrix: matrix.map((row) => [...row]), rows, cols, target,
          curRow: r, curCol: c, visited: visited.map((p) => [...p]),
          foundAt: null, phase: "go-down",
          step: { description: `Move down to (${r}, ${c}).`, detail: "" },
        });
      }
    }
  }

  frames.push({
    matrix: matrix.map((row) => [...row]), rows, cols, target,
    curRow: -1, curCol: -1, visited: visited.map((p) => [...p]),
    foundAt: null, phase: "not-found",
    step: { description: `Walked off the matrix without finding ${target}.`, detail: "Return false." },
  });
  return frames;
}

export const DEMO_MATRIX = [
  [ 1,  4,  7, 11, 15],
  [ 2,  5,  8, 12, 19],
  [ 3,  6,  9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30],
];
