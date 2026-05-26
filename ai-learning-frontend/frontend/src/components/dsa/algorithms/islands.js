/**
 * islands — count connected components of '1' cells via BFS.
 *
 * Used by M37-T2 (BFS/DFS Applications — Islands, Clone Graph, Walls
 * and Gates). Grid-shape problem — needs a dedicated grid visualizer.
 *
 * Frame shape:
 *   {
 *     grid: ('0'|'1')[][], rows: number, cols: number,
 *     visited: boolean[][],
 *     queue: [r,c][],
 *     currentCell: [r,c] | null,
 *     islandCount: number,
 *     currentIslandCells: [r,c][],
 *     phase: 'init'|'scan'|'bfs-start'|'bfs-step'|'water'|'visited'|'done',
 *     step: { description, detail }
 *   }
 */

export const ISLANDS_CODE = `// Count islands via BFS
int numIslands(char[][] grid) {
  int rows = grid.length, cols = grid[0].length, count = 0;
  boolean[][] visited = new boolean[rows][cols];
  int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};

  for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
      if (grid[r][c] != '1' || visited[r][c]) continue;
      count++;
      Deque<int[]> q = new ArrayDeque<>();
      q.add(new int[]{r, c});
      visited[r][c] = true;
      while (!q.isEmpty()) {
        int[] cur = q.poll();
        for (int[] d : dirs) {
          int nr = cur[0] + d[0], nc = cur[1] + d[1];
          if (nr<0||nc<0||nr>=rows||nc>=cols) continue;
          if (grid[nr][nc] != '1' || visited[nr][nc]) continue;
          visited[nr][nc] = true;
          q.add(new int[]{nr, nc});
        }
      }
    }
  }
  return count;
}`;

export const LINE_BY_PHASE = { init: 3, scan: 9, water: 9, visited: 9, "bfs-start": 10, "bfs-step": 15, done: 26 };

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export function generateIslandsSteps(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const frames = [];
  let islandCount = 0;

  function snap(currentCell, queue, currentIslandCells, phase, step) {
    frames.push({
      grid: grid.map((row) => [...row]),
      rows, cols,
      visited: visited.map((row) => [...row]),
      queue: queue.map((c) => [...c]),
      currentCell: currentCell ? [...currentCell] : null,
      islandCount,
      currentIslandCells: currentIslandCells.map((c) => [...c]),
      phase, step,
    });
  }

  snap(null, [], [], "init", {
    description: `Count islands in a ${rows}×${cols} grid. '1' = land, '0' = water.`,
    detail: "Scan top-down, left-right. Hit an unvisited '1' → BFS-mark its whole connected component.",
  });

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== "1") {
        snap([r, c], [], [], "water", {
          description: `(${r}, ${c}) is '${grid[r][c]}' — water, skip.`,
          detail: "",
        });
        continue;
      }
      if (visited[r][c]) {
        snap([r, c], [], [], "visited", {
          description: `(${r}, ${c}) already part of a counted island — skip.`,
          detail: "",
        });
        continue;
      }
      islandCount++;
      const currentCells = [];
      const queue = [[r, c]];
      visited[r][c] = true;
      currentCells.push([r, c]);
      snap([r, c], queue, currentCells, "bfs-start", {
        description: `New island #${islandCount} discovered at (${r}, ${c}).`,
        detail: "Start BFS from this cell.",
      });

      while (queue.length > 0) {
        const cur = queue.shift();
        snap(cur, queue, currentCells, "bfs-step", {
          description: `Dequeue (${cur[0]}, ${cur[1]}). Check 4 neighbours.`,
          detail: "",
        });
        for (const [dr, dc] of DIRS) {
          const nr = cur[0] + dr, nc = cur[1] + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          if (grid[nr][nc] !== "1" || visited[nr][nc]) continue;
          visited[nr][nc] = true;
          queue.push([nr, nc]);
          currentCells.push([nr, nc]);
        }
      }
      snap(null, [], currentCells, "bfs-step", {
        description: `Island #${islandCount} complete — ${currentCells.length} cells.`,
        detail: "",
      });
    }
  }

  snap(null, [], [], "done", {
    description: `Done — ${islandCount} island${islandCount === 1 ? "" : "s"}.`,
    detail: "",
  });
  return frames;
}

export const DEMO_GRID = [
  ["1", "1", "0", "0", "1"],
  ["1", "0", "0", "1", "1"],
  ["0", "0", "1", "0", "0"],
  ["1", "0", "1", "1", "0"],
  ["1", "0", "0", "0", "1"],
];
