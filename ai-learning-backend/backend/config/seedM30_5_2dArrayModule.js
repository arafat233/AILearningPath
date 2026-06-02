/**
 * seedM30_5_2dArrayModule.js — Pro Java Track M30.5: DSA: 2D Array Patterns
 *
 * Slots between M30 (Array Patterns) and M31 (String Algorithms).
 * Covers: matrix traversal, grid BFS/DFS, path-finding DP, 2D search.
 * All exercises use Java 21 (Judge0 language ID from JUDGE0_JAVA_LANGUAGE_ID).
 * Idempotent — uses updateOne/upsert throughout. Safe to re-run.
 *
 * Usage: node config/seedM30_5_2dArrayModule.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const TRACK = "pro_java";
const MODULE_ID = "java_m30_5";
// We re-number conceptually as M30.5 — moduleNumber uses a decimal to avoid
// renumbering all subsequent modules. The UI sorts by moduleNumber.
const MODULE_NUMBER = 30.5;

// ─────────────────────────────────────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────────────────────────────────────
function ex(exerciseId, topicId, position, level, type, title, instructions,
            expectedSolution, hints, testCases, starterCode = "", scenario = "") {
  return {
    exerciseId, topicId, moduleId: MODULE_ID, trackKey: TRACK,
    position, level, type, title, instructions, expectedSolution,
    hints, testCases, starterCode, scenario,
    blanks: [], difficulty: { warmup: 0.17, easy: 0.40, medium: 0.65, hard: 0.90 }[level] ?? 0.5,
    xpReward: { warmup: 10, easy: 15, medium: 20, hard: 30 }[level] ?? 15,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE
// ─────────────────────────────────────────────────────────────────────────────
const MODULE = {
  moduleId: MODULE_ID,
  trackKey: TRACK,
  name: "DSA: 2D Array Patterns",
  slug: "dsa-2d-arrays",
  moduleNumber: MODULE_NUMBER,
  description: "Matrix traversal, grid BFS/DFS, path-finding DP, and 2D binary search. The patterns behind Google Maps routing, game-board problems, and image processing — all O(rows × cols) or better.",
  estimatedHours: 8,
  prerequisites: ["java_m30"],
  status: "live",
};

// ─────────────────────────────────────────────────────────────────────────────
// TOPICS (5)
// ─────────────────────────────────────────────────────────────────────────────
const TOPICS = [
  {
    topicId: "java_m30_5_t1",
    moduleId: MODULE_ID,
    trackKey: TRACK,
    topicNumber: 1,
    name: "Matrix Traversal — Row/Column/Diagonal/Spiral",
    slug: "matrix-traversal",
    difficulty: 0.5,
    estimatedMinutes: 55,
    xpReward: 50,
    freeAccess: false,
    prerequisites: ["java_m30_t1"],
    problemTitle: "Traverse a matrix in every direction without out-of-bounds errors",
    revealStrategy: "first_attempt",
    hook: {
      real_world_problem: "```\nImage processing at Flipkart:\nRotate 1000×1000 product image 90° before thumbnail generation.\n\nBrute force: allocate second array, copy → O(n²) space\nIn-place transpose + reverse: O(1) extra space\n\nMatrix: [[1,2,3],[4,5,6],[7,8,9]]\nTranspose (swap [i][j] ↔ [j][i]):\n  [[1,4,7],[2,5,8],[3,6,9]]\nReverse each row:\n  [[7,4,1],[8,5,2],[9,6,3]] ← 90° clockwise!\n```",
      what_you_will_build: "Row/column scan, diagonal traversal, spiral order, and in-place rotation — all O(rows×cols) time, O(1) space.",
    },
    teaching: {
      concept_explanation: {
        traversal_patterns: `**Matrix traversal patterns:**

\`\`\`
1. ROW-MAJOR (most common):
   for (int r = 0; r < rows; r++)
     for (int c = 0; c < cols; c++)
       process(mat[r][c]);

2. COLUMN-MAJOR:
   for (int c = 0; c < cols; c++)
     for (int r = 0; r < rows; r++)
       process(mat[r][c]);

3. DIAGONAL (top-left to bottom-right):
   for (int d = 0; d < rows; d++)    // each diagonal
     for (int r = 0; r <= d && r < rows; r++) {
       int c = d - r;
       if (c < cols) process(mat[r][c]);
     }

4. ANTI-DIAGONAL (top-right to bottom-left):
   Elements on same anti-diagonal share: r + c == constant

5. BOUNDS CHECK (4-directional):
   int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}}; // R,L,D,U
   for (int[] d : dirs) {
     int nr = r + d[0], nc = c + d[1];
     if (nr >= 0 && nr < rows && nc >= 0 && nc < cols)
       process(mat[nr][nc]);  // ← always bounds-check first!
   }
\`\`\``,
        spiral_pattern: `**Spiral order — shrinking boundary technique:**

\`\`\`java
List<Integer> spiralOrder(int[][] matrix) {
    int top=0, bottom=matrix.length-1;
    int left=0, right=matrix[0].length-1;
    List<Integer> result = new ArrayList<>();
    while (top <= bottom && left <= right) {
        for (int c=left; c<=right; c++) result.add(matrix[top][c]); top++;
        for (int r=top; r<=bottom; r++) result.add(matrix[r][right]); right--;
        if (top <= bottom)
            for (int c=right; c>=left; c--) result.add(matrix[bottom][c]); bottom--;
        if (left <= right)
            for (int r=bottom; r>=top; r--) result.add(matrix[r][left]); left++;
    }
    return result;
}
// 4 boundaries shrink inward after each side is consumed.
\`\`\``,
        matrix_multiplication: `**Matrix Multiplication — A(m×n) × B(n×p) = C(m×p):**

\`\`\`
Rule: C[i][j] = sum of A[i][k] * B[k][j] for k=0..n-1
      (row i of A) · (column j of B) — dot product

Dimensions: A is m×n, B is n×p → C is m×p
  Inner dimensions MUST match: A cols == B rows.

Template:
  int[][] multiply(int[][] A, int[][] B) {
      int m=A.length, n=A[0].length, p=B[0].length;
      int[][] C = new int[m][p];
      for (int i=0; i<m; i++)
          for (int j=0; j<p; j++)
              for (int k=0; k<n; k++)
                  C[i][j] += A[i][k] * B[k][j];
      return C;
  }
  // O(m × n × p) time, O(m × p) space (result only)

Sparse optimisation (LeetCode #311):
  If A has many zeros, skip the k loop when A[i][k]==0:
  for (int i=0; i<m; i++)
      for (int k=0; k<n; k++) {
          if (A[i][k]==0) continue;    // ← skip entire inner loop
          for (int j=0; j<p; j++)
              C[i][j] += A[i][k] * B[k][j];
      }
  // Same worst-case, much faster on sparse input.
\`\`\``,
      },
      visual_aid: {
        type: "diagram",
        description: "3×3 matrix spiral: → top row, ↓ right col, ← bottom row, ↑ left col. Boundaries shrink: top++, right--, bottom--, left++. Next inner ring repeats.",
        alt_text: "Spiral traversal with shrinking boundary pointers",
      },
      worked_example: {
        scenario: "Rotate matrix 90° clockwise in-place (Flipkart thumbnail service).",
        problem_statement: "Rotate an n×n matrix 90° clockwise. Must be in-place (O(1) extra space).",
        step_by_step_solution: [
          { step: 1, action: "Transpose: swap mat[i][j] with mat[j][i] for all i < j", details: "Only iterate upper triangle (i < j) to avoid double-swapping back." },
          { step: 2, action: "Reverse each row", details: "After transpose, reversing each row gives the 90° clockwise result." },
        ],
        final_code: `void rotate(int[][] mat) {
    int n = mat.length;
    // Step 1: transpose
    for (int i = 0; i < n; i++)
        for (int j = i+1; j < n; j++) {
            int tmp = mat[i][j];
            mat[i][j] = mat[j][i];
            mat[j][i] = tmp;
        }
    // Step 2: reverse each row
    for (int[] row : mat) {
        int lo = 0, hi = n-1;
        while (lo < hi) { int t=row[lo]; row[lo++]=row[hi]; row[hi--]=t; }
    }
}
// O(n²) time, O(1) space`,
        expected_output: "[[1,2,3],[4,5,6],[7,8,9]] → [[7,4,1],[8,5,2],[9,6,3]]",
        things_to_notice: [
          "Transpose swaps (i,j)↔(j,i) — only upper triangle, else you swap back.",
          "Counter-clockwise: reverse each row first, then transpose.",
          "Spiral uses 4 boundary pointers that shrink inward — never touch a cell twice.",
          "All 4 direction arrays ({{0,1},{0,-1},{1,0},{-1,0}}) are reusable in BFS/DFS.",
        ],
      },
      reflection: {
        key_takeaways: [
          "Row-major order is the default; column-major for transposed access.",
          "Diagonal elements share r-c (top-left diagonal) or r+c (anti-diagonal).",
          "Spiral: 4 boundary variables, shrink after each side.",
          "In-place rotation: transpose (upper triangle only) → reverse each row.",
          "Always bounds-check: nr>=0 && nr<rows && nc>=0 && nc<cols.",
        ],
        self_check_questions: [
          { question: "Why do we only iterate j from i+1 (not 0) when transposing?", answer: "If we start j from 0, we'd swap mat[i][j] and mat[j][i], then later swap them back when (j,i) becomes (i,j) in the outer loop — net effect is no change. The upper triangle (i < j) gives us each pair exactly once." },
        ],
        next_topic_preview: "Next: Grid BFS/DFS — when the matrix is a graph and you need to explore connected regions.",
      },
    },
  },

  {
    topicId: "java_m30_5_t2",
    moduleId: MODULE_ID,
    trackKey: TRACK,
    topicNumber: 2,
    name: "Grid BFS / DFS — Islands and Flood Fill",
    slug: "grid-bfs-dfs",
    difficulty: 0.65,
    estimatedMinutes: 60,
    xpReward: 50,
    freeAccess: false,
    prerequisites: ["java_m30_5_t1"],
    problemTitle: "Count connected regions and find shortest paths in a grid",
    revealStrategy: "first_attempt",
    hook: {
      real_world_problem: "```\nGoogle Maps — finding connected land mass:\nGrid of 0s (water) and 1s (land).\nCount the number of islands.\n\nEvery cell is a graph node.\nEvery adjacent land cell is an edge.\n→ Graph connected-components problem on a 2D grid!\n\nBFS/DFS from each unvisited '1':\n  Mark all cells reachable → one island\n  Move to next unvisited '1' → new island\nTime: O(rows × cols) — every cell visited once.\n```",
      what_you_will_build: "Number of Islands, Flood Fill, Shortest Path in Binary Matrix, and Surrounded Regions — the four canonical grid BFS/DFS patterns.",
    },
    teaching: {
      concept_explanation: {
        grid_as_graph: `**The key insight — a grid IS a graph:**

\`\`\`
cell (r,c) → node
adjacent cells → edges (4-directional or 8-directional)

BFS template for grid (shortest path / level-by-level):
  Queue<int[]> q = new LinkedList<>();
  q.add(new int[]{startR, startC});
  boolean[][] visited = new boolean[rows][cols];
  visited[startR][startC] = true;
  int steps = 0;
  int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
  while (!q.isEmpty()) {
    int size = q.size();          // ← level size for step counting
    while (size-- > 0) {
      int[] cell = q.poll();
      if (cell[0]==endR && cell[1]==endC) return steps;
      for (int[] d : dirs) {
        int nr=cell[0]+d[0], nc=cell[1]+d[1];
        if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&!visited[nr][nc]&&grid[nr][nc]!='#') {
          visited[nr][nc] = true;
          q.add(new int[]{nr, nc});
        }
      }
    }
    steps++;
  }

DFS template for grid (connected component / flood fill):
  void dfs(char[][] grid, int r, int c) {
    if (r<0||r>=rows||c<0||c>=cols||grid[r][c]!='1') return;
    grid[r][c] = '0';              // ← mark visited by mutating grid
    dfs(grid, r+1,c); dfs(grid, r-1,c);
    dfs(grid, r,c+1); dfs(grid, r,c-1);
  }
\`\`\``,
      },
      visual_aid: {
        type: "diagram",
        description: "Grid with '1's forming two islands. BFS wave ripples from source. DFS dives deep marking cells. visited[][] prevents revisiting.",
        alt_text: "Grid BFS expanding rings vs DFS deep dive",
      },
      worked_example: {
        scenario: "Number of Islands — core interview problem (Amazon, Google, Flipkart).",
        problem_statement: "Given a 2D grid of '1's (land) and '0's (water), count the number of islands (connected groups of '1's, 4-directional).",
        step_by_step_solution: [
          { step: 1, action: "Iterate every cell", details: "When we find an unvisited '1', that's a new island — increment count." },
          { step: 2, action: "DFS to sink the island", details: "From that cell, DFS in 4 directions, marking every reachable land cell as '0' (visited). This prevents recounting." },
        ],
        final_code: `int numIslands(char[][] grid) {
    int rows=grid.length, cols=grid[0].length, count=0;
    for (int r=0; r<rows; r++)
        for (int c=0; c<cols; c++)
            if (grid[r][c]=='1') { dfs(grid,r,c,rows,cols); count++; }
    return count;
}
void dfs(char[][] g, int r, int c, int rows, int cols) {
    if (r<0||r>=rows||c<0||c>=cols||g[r][c]!='1') return;
    g[r][c]='0';                      // sink — mark visited
    dfs(g,r+1,c,rows,cols); dfs(g,r-1,c,rows,cols);
    dfs(g,r,c+1,rows,cols); dfs(g,r,c-1,rows,cols);
}
// O(rows×cols) time — every cell visited at most once`,
        expected_output: `grid=[["1","1","0","0","0"],
      ["1","1","0","0","0"],
      ["0","0","1","0","0"],
      ["0","0","0","1","1"]]
→ 3 islands`,
        things_to_notice: [
          "BFS gives shortest path (level = distance). DFS gives connected component.",
          "Mutating the grid (mark '0') avoids a separate visited[][] array.",
          "If the grid can't be mutated: use visited[][] boolean array instead.",
          "8-directional: add 4 diagonal directions to the dirs array.",
          "Flood Fill is the same pattern — replace color instead of sinking.",
        ],
      },
      reflection: {
        key_takeaways: [
          "Grid = graph: cells are nodes, adjacency = edges.",
          "BFS for shortest path (level-by-level expansion).",
          "DFS for connected components (sink visited cells or use visited[][]).",
          "Bounds check + visited check before every recursive/queued call.",
          "4-directional: {{0,1},{0,-1},{1,0},{-1,0}}. 8-directional: add 4 diagonals.",
          "Time: O(rows×cols) — every cell processed at most once.",
        ],
        self_check_questions: [
          { question: "When would you use BFS over DFS on a grid?", answer: "BFS when you need the *shortest* path (fewest steps). BFS explores level by level, so the first time you reach the target is guaranteed to be the shortest path. DFS may find a longer path first. For connected-component problems (islands, flood fill) where you just need to mark reachable cells, DFS is simpler to code recursively." },
        ],
        next_topic_preview: "Next: Path-finding DP on grids — when you need the minimum-cost or count-of-paths, not just reachability.",
      },
    },
  },

  {
    topicId: "java_m30_5_t3",
    moduleId: MODULE_ID,
    trackKey: TRACK,
    topicNumber: 3,
    name: "Grid DP — Paths, Costs, and Edit Distance",
    slug: "grid-dp",
    difficulty: 0.75,
    estimatedMinutes: 65,
    xpReward: 50,
    freeAccess: false,
    prerequisites: ["java_m30_5_t2"],
    problemTitle: "Count paths and find minimum cost through a grid without re-exploring",
    revealStrategy: "first_attempt",
    hook: {
      real_world_problem: "```\nDelivery routing at Swiggy:\nGrid of city blocks, each with a delivery time.\nFind the minimum time from restaurant (0,0) to customer (m,n).\nCan only move right or down (one-way streets).\n\nBFS gives shortest hops; DP gives minimum WEIGHTED cost.\ndp[r][c] = min cost to reach (r,c)\ndp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])\n\nThe cell's cost + the cheaper of the two ways to arrive.\nFill row by row: O(m×n) time, O(m×n) space (reducible to O(n)).\n```",
      what_you_will_build: "Unique Paths, Minimum Path Sum, Edit Distance (2D DP), and Longest Common Subsequence — the four canonical 2D DP patterns.",
    },
    teaching: {
      concept_explanation: {
        grid_dp_template: `**Grid DP — the recurrence template:**

\`\`\`
Two key questions for any grid DP:
1. What does dp[r][c] represent?
2. Where does (r,c) come from? → write the recurrence.

Pattern A — PATHS (count or min cost, right+down only):
  dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])
  Base: dp[0][0]=grid[0][0], fill first row+col (only one way to reach them).

Pattern B — SUBSEQUENCE (LCS, Edit Distance):
  Build dp[i][j] from dp[i-1][j], dp[i][j-1], dp[i-1][j-1].
  dp[i][j] = dp[i-1][j-1]+1          if match (LCS)
  dp[i][j] = 1 + min(dp[i-1][j],     // delete
                     dp[i][j-1],      // insert
                     dp[i-1][j-1])    // replace  (Edit Distance)
  Base: dp[i][0]=i (i deletions), dp[0][j]=j (j insertions).

Space optimisation: if dp[r][c] only needs dp[r-1][c] and dp[r][c-1],
  keep only ONE row and update left-to-right:
  int[] dp = new int[cols];  // O(n) instead of O(m×n)
\`\`\``,
      },
      visual_aid: {
        type: "diagram",
        description: "3×3 grid with dp values filled row by row. Arrows show each cell pulling from cell-above and cell-left. Edit distance table shown with 'match/insert/delete' arrows.",
        alt_text: "Grid DP table filled bottom-up",
      },
      worked_example: {
        scenario: "Minimum Path Sum — Swiggy delivery routing.",
        problem_statement: "Given a grid filled with non-negative numbers, find a path from top-left to bottom-right (only right or down) that minimises the sum of numbers along the path.",
        step_by_step_solution: [
          { step: 1, action: "Define dp[r][c] = min cost to reach (r,c)", details: "dp[0][0] = grid[0][0]. First row: each cell = previous cell + grid cost (only reachable from left). First col: similar (only from above)." },
          { step: 2, action: "Fill left-to-right, top-to-bottom", details: "dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])." },
          { step: 3, action: "Answer is dp[rows-1][cols-1]", details: "The bottom-right cell holds the minimum total cost." },
        ],
        final_code: `int minPathSum(int[][] grid) {
    int rows=grid.length, cols=grid[0].length;
    int[] dp = new int[cols];   // space-optimised: O(cols)
    dp[0] = grid[0][0];
    for (int c=1; c<cols; c++) dp[c] = dp[c-1] + grid[0][c]; // first row
    for (int r=1; r<rows; r++) {
        dp[0] += grid[r][0];    // first col: only from above
        for (int c=1; c<cols; c++)
            dp[c] = grid[r][c] + Math.min(dp[c], dp[c-1]);
            //                           ↑ above   ↑ left
    }
    return dp[cols-1];
}
// O(rows×cols) time, O(cols) space`,
        expected_output: "grid=[[1,3,1],[1,5,1],[4,2,1]] → 7  (path: 1→3→1→1→1)",
        things_to_notice: [
          "O(cols) space: dp[c] (before update) = dp[r-1][c] (above). dp[c-1] (just updated) = dp[r][c-1] (left).",
          "Edit Distance: same 2-row optimisation works — keep previous row and current row.",
          "Unique Paths: no grid cost, dp[r][c] = dp[r-1][c] + dp[r][c-1] (count of paths).",
          "If obstacles: skip cells where grid[r][c]==1 (set dp to INFINITY).",
        ],
      },
      reflection: {
        key_takeaways: [
          "Grid DP = fill a table where each cell depends on neighbours.",
          "Right+down only: dp[r][c] comes from dp[r-1][c] and dp[r][c-1].",
          "LCS/Edit Distance: dp[i][j] from diagonal + left + above.",
          "Space optimisation: single-row dp[] array, update left-to-right.",
          "Obstacles: treat as infinity (can't pass through).",
        ],
        self_check_questions: [
          { question: "How does the space-optimised min path sum work — why does dp[c] represent 'from above' before the update?", answer: "We process row-by-row. Before updating dp[c] for the current row r, it still holds the value from the previous row (row r-1) — so dp[c] is dp[r-1][c], the cost from above. dp[c-1] was already updated this row, so it's dp[r][c-1], the cost from the left. We pick the minimum of these two and add the current cell's cost." },
        ],
        next_topic_preview: "Next: Binary Search on a sorted matrix — O(log(rows×cols)) search without BFS or DP.",
      },
    },
  },

  {
    topicId: "java_m30_5_t4",
    moduleId: MODULE_ID,
    trackKey: TRACK,
    topicNumber: 4,
    name: "2D Binary Search — Search in Sorted Matrix",
    slug: "2d-binary-search",
    difficulty: 0.60,
    estimatedMinutes: 45,
    xpReward: 50,
    freeAccess: false,
    prerequisites: ["java_m30_5_t1"],
    problemTitle: "Search a sorted matrix in O(log n) — not O(rows × cols)",
    revealStrategy: "first_attempt",
    hook: {
      real_world_problem: "```\nDatabase index lookup at Zerodha:\nStock prices stored in a sorted 2D table:\n  each row sorted left-to-right,\n  first element of each row > last element of previous row.\nFind if price P exists.\n\nLinear scan: O(rows×cols)\nFlatten to 1D index: O(log(rows×cols))\n\nKey insight:\n  index i in 1D → row = i/cols, col = i%cols\n  Binary search on [0 .. rows×cols-1] using this mapping!\n```",
      what_you_will_build: "Two search patterns: (1) fully sorted matrix via 1D binary search mapping, (2) staircase search on row-sorted, column-sorted matrix in O(rows+cols).",
    },
    teaching: {
      concept_explanation: {
        two_patterns: `**Pattern 1 — Fully sorted (LeetCode #74):**
Row i, col j → flat index = i*cols + j
Flat index k → row = k/cols, col = k%cols

\`\`\`java
boolean searchMatrix(int[][] mat, int target) {
    int rows=mat.length, cols=mat[0].length;
    int lo=0, hi=rows*cols-1;
    while (lo <= hi) {
        int mid = lo + (hi-lo)/2;
        int val = mat[mid/cols][mid%cols];  // ← key mapping
        if (val == target) return true;
        else if (val < target) lo = mid+1;
        else hi = mid-1;
    }
    return false;
}
// O(log(rows×cols))
\`\`\`

**Pattern 2 — Row + column sorted (LeetCode #240), staircase search:**
Start at top-right corner. At each step:
  - value == target → found
  - value > target → move LEFT (eliminate this column)
  - value < target → move DOWN (eliminate this row)

\`\`\`java
boolean searchMatrixII(int[][] mat, int target) {
    int r=0, c=mat[0].length-1;
    while (r<mat.length && c>=0) {
        if (mat[r][c]==target) return true;
        else if (mat[r][c]>target) c--;   // too big → go left
        else r++;                          // too small → go down
    }
    return false;
}
// O(rows + cols)  ← not O(rows × cols)!
\`\`\``,
      },
      visual_aid: {
        type: "diagram",
        description: "Pattern 1: 4×4 matrix flattened to 16-element array with binary search. Pattern 2: starting top-right, arrows show left/down decisions eliminating rows/columns.",
        alt_text: "Matrix binary search — flat index mapping and staircase path",
      },
      worked_example: {
        scenario: "Search a 2D matrix (LeetCode #74) — the 'pretend it's 1D' trick.",
        problem_statement: "Given an m×n matrix where each row is sorted and the first element of each row is greater than the last element of the previous row. Determine if target exists.",
        step_by_step_solution: [
          { step: 1, action: "Treat the matrix as a sorted 1D array of size rows×cols", details: "Binary search on [0 .. rows×cols-1]. Map mid → mat[mid/cols][mid%cols]." },
          { step: 2, action: "Standard binary search", details: "If val < target: lo=mid+1. If val > target: hi=mid-1. If equal: return true." },
        ],
        final_code: `boolean searchMatrix(int[][] mat, int target) {
    int rows=mat.length, cols=mat[0].length;
    int lo=0, hi=rows*cols-1;
    while (lo<=hi) {
        int mid = lo+(hi-lo)/2;
        int val = mat[mid/cols][mid%cols];
        if (val==target) return true;
        if (val<target) lo=mid+1; else hi=mid-1;
    }
    return false;
}`,
        expected_output: "mat=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3 → true\ntarget=13 → false",
        things_to_notice: [
          "mid/cols gives row, mid%cols gives column — the core mapping.",
          "Works ONLY when matrix is fully sorted (row-by-row continuation).",
          "For row+column sorted only (not fully): use staircase from top-right.",
          "Both patterns are O(log) or O(rows+cols) — far better than O(rows×cols).",
        ],
      },
      reflection: {
        key_takeaways: [
          "Fully sorted matrix: flatten index trick → O(log(rows×cols)) binary search.",
          "Row+col sorted: staircase from top-right → O(rows+cols).",
          "Index mapping: 1D index k → row=k/cols, col=k%cols.",
          "Staircase: moves eliminate entire row OR entire column each step.",
        ],
        self_check_questions: [
          { question: "Why does the staircase search start at the top-right corner, not the top-left?", answer: "The top-right corner is the only position where one move unambiguously eliminates a row OR column: if mat[r][c] > target, then the entire column c is too large (every row below has mat[r][c] increasing down), so we eliminate it by moving left. If mat[r][c] < target, the entire row r is too small, so we move down. From the top-left, both right and down increase the value — we can't eliminate a full row or column." },
        ],
        next_topic_preview: "Next: 2D Array Synthesis — combining traversal, BFS/DFS, DP and search in multi-pattern problems.",
      },
    },
  },

  {
    topicId: "java_m30_5_t5",
    moduleId: MODULE_ID,
    trackKey: TRACK,
    topicNumber: 5,
    name: "2D Array Synthesis — Multi-Pattern Problems",
    slug: "2d-array-synthesis",
    difficulty: 0.85,
    estimatedMinutes: 70,
    xpReward: 50,
    freeAccess: false,
    prerequisites: ["java_m30_5_t2", "java_m30_5_t3", "java_m30_5_t4"],
    problemTitle: "Recognise which 2D pattern fits — and combine them when needed",
    revealStrategy: "first_attempt",
    hook: {
      real_world_problem: "```\nGoogle Maps — shortest safe route:\nGrid with 0=safe, 1=obstacle, 2=enemy.\nFind shortest path from top-left to bottom-right\nthat avoids enemies (cells within distance 2 of '2').\n\nStep 1: Multi-source BFS from all '2's → distance map\nStep 2: BFS from start, skip cells where distance ≤ 2\nStep 3: DP not appropriate here (obstacles block shortest path)\n\nCombines: multi-source BFS + single-source BFS + grid traversal.\nThis is what real interviews test — pattern recognition + combination.\n```",
      what_you_will_build: "Game of Life, Walls and Gates (multi-source BFS), Surrounded Regions, Word Search — problems that require combining two or more 2D patterns.",
    },
    teaching: {
      concept_explanation: {
        pattern_recognition: `**When to use which 2D pattern:**

\`\`\`
TRAVERSAL (spiral, diagonal, rotate):
  → no reachability or optimisation involved
  → just visit cells in a specific order

BFS (grid BFS, multi-source BFS):
  → shortest path / minimum steps
  → level-by-level expansion
  → multi-source: start BFS from MULTIPLE cells at once
    (walls-and-gates: BFS from all '0' gates simultaneously)

DFS (connected components, flood fill):
  → mark all reachable cells from a source
  → "is this region connected?"
  → reverse-DFS: start from border cells to mark "safe"

GRID DP (path count, min cost):
  → optimisation over ALL paths (not just shortest hop count)
  → "how many paths" or "minimum weighted cost"
  → right+down constraint (no BFS needed — order is fixed)

2D BINARY SEARCH:
  → sorted structure (row-sorted or fully sorted)
  → target lookup, not path or count

COMBINING:
  Word Search = DFS + backtracking (mark visited, unmark on return)
  Game of Life = snapshot (copy grid) + in-place update rule
  Walls and Gates = multi-source BFS (all sources at level 0)
\`\`\``,
      },
      visual_aid: {
        type: "diagram",
        description: "Decision flowchart: 'Do you need shortest path?' → BFS. 'Do you need connected component?' → DFS. 'Do you need min-cost over all paths?' → DP. 'Is the grid sorted?' → Binary search. 'Just visit in order?' → Traversal.",
        alt_text: "2D pattern selection flowchart",
      },
      worked_example: {
        scenario: "Walls and Gates — multi-source BFS (Swiggy nearest hub finder).",
        problem_statement: "Fill a grid with distances to the nearest gate (0). Walls are -1, gates are 0, empty rooms are INF. Fill each INF room with its shortest distance to any gate.",
        step_by_step_solution: [
          { step: 1, action: "Seed BFS queue with ALL gates at step 0", details: "Multi-source BFS: start from every '0' simultaneously. This guarantees each room gets the distance to its NEAREST gate." },
          { step: 2, action: "BFS outward, filling distances", details: "Whenever we reach an INF cell from a gate, update it with current distance. Never overwrite — first arrival is shortest." },
        ],
        final_code: `void wallsAndGates(int[][] rooms) {
    int rows=rooms.length, cols=rooms[0].length;
    int INF=Integer.MAX_VALUE;
    Queue<int[]> q = new LinkedList<>();
    for (int r=0; r<rows; r++)
        for (int c=0; c<cols; c++)
            if (rooms[r][c]==0) q.add(new int[]{r,c});   // all gates at once
    int[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};
    while (!q.isEmpty()) {
        int[] cell=q.poll();
        for (int[] d:dirs) {
            int nr=cell[0]+d[0], nc=cell[1]+d[1];
            if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&rooms[nr][nc]==INF) {
                rooms[nr][nc]=rooms[cell[0]][cell[1]]+1;
                q.add(new int[]{nr,nc});
            }
        }
    }
}
// O(rows×cols) — every cell enqueued at most once`,
        expected_output: `INF -1  0  INF        3  -1  0   1
INF INF INF  -1   →   2   2   1  -1
INF  -1 INF  -1       1  -1   2  -1
  0  -1 INF INF       0  -1   3   4`,
        things_to_notice: [
          "Multi-source BFS: enqueue ALL sources before starting — they all start at distance 0.",
          "Single-source BFS would require running BFS from every gate and taking minimums: O(gates × rows×cols). Multi-source is O(rows×cols).",
          "Walls (-1) are never enqueued — rooms[nr][nc]==INF check skips them.",
          "Surrounded Regions: DFS from border '0's to mark 'safe', then flip all remaining '0' → 'X'.",
        ],
      },
      reflection: {
        key_takeaways: [
          "Multi-source BFS: enqueue ALL sources at level 0 for simultaneous expansion.",
          "Word Search: DFS + backtracking — mark visited, unmark when backtracking.",
          "Game of Life: never mutate in-place during the step — copy grid or use bit encoding.",
          "Surrounded Regions: reverse-think — mark safe from border first, then fill.",
          "Pattern selection: shortest hops→BFS, connected region→DFS, min weighted cost→DP, sorted lookup→binary search.",
        ],
        self_check_questions: [
          { question: "Why is multi-source BFS O(rows×cols) while running BFS from each gate separately would be O(gates × rows×cols)?", answer: "In multi-source BFS, we enqueue ALL gates at distance 0 and run ONE BFS. Each cell is enqueued and dequeued at most once — the first arrival is guaranteed to be from the nearest gate. In separate single-source BFS runs, each cell could be visited once per gate, giving O(gates × cells) total. Multi-source is like saying: 'every gate starts expanding simultaneously' — the BFS wavefronts merge naturally, and the first wavefront to reach each cell wins." },
        ],
        next_topic_preview: "Next: M31 String Algorithms — sliding window on strings, KMP, Rabin-Karp, and the patterns behind grep and autocomplete.",
      },
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISES — 5 topics × ~16 exercises each
// ─────────────────────────────────────────────────────────────────────────────

const EXERCISES = [
  // ── T1: Matrix Traversal ──────────────────────────────────────────────────
  ex("java_m30_5_t1_ex_1","java_m30_5_t1",1,"warmup","predict_output",
    "Trace spiral order on 3×3 matrix",
    "Trace the spiral traversal of:\n`[[1,2,3],[4,5,6],[7,8,9]]`\nList all elements in the order they are visited.",
    "[1,2,3,6,9,8,7,4,5]\n\nBoundary state:\n  top=0→1, right=2→1, bottom=2→1, left=0→1\nStep 1 (top=0, left→right): 1,2,3  → top=1\nStep 2 (right=2, top→bottom): 6,9  → right=1\nStep 3 (bottom=2, right→left): 8,7  → bottom=1\nStep 4 (left=0, bottom→top): 4  → left=1\nStep 5 (top=1, left→right): 5  → top=2\n(top > bottom, loop ends)",
    ["Start: top=0, right=2, bottom=2, left=0","After first top-row pass: top++","After last right-col pass: right--"],
    [{ type:"text_match", expected:"[1,2,3,6,9,8,7,4,5]" }]),

  ex("java_m30_5_t1_ex_2","java_m30_5_t1",2,"warmup","predict_output",
    "What does diagonal index r+c tell you?",
    "For a 4×4 matrix, list all cells that belong to anti-diagonal `r+c=3`.\nThen list all cells on main diagonal `r-c=0`.",
    "Anti-diagonal r+c=3:\n  (0,3), (1,2), (2,1), (3,0)\n  Values from top-right to bottom-left.\n\nMain diagonal r-c=0 (i.e. r==c):\n  (0,0), (1,1), (2,2), (3,3)\n  Values from top-left to bottom-right.\n\nKey insight:\n  Same anti-diagonal → r+c is constant.\n  Same main diagonal → r-c is constant.",
    ["Anti-diagonal: elements where row+col equals the same value","Main diagonal: elements where row==col"],
    [{ type:"text_match", expected:"(0,3), (1,2), (2,1), (3,0)" }]),

  ex("java_m30_5_t1_ex_3","java_m30_5_t1",3,"easy","code_scratch",
    "Spiral Order (LeetCode #54)",
    "Return all elements of a matrix in spiral order.",
    "Use 4 boundary variables: top, right, bottom, left.\nShrink each boundary after traversing that side.",
    ["Traverse top row (left→right), then increment top","After right col (top→bottom): right--","After bottom row (right→left): bottom--","After left col (bottom→top): left++"],
    [{ type:"execution", input:"[[1,2,3],[4,5,6],[7,8,9]]", expected:"[1, 2, 3, 6, 9, 8, 7, 4, 5]" },
     { type:"execution", input:"[[1,2],[3,4]]", expected:"[1, 2, 4, 3]" }],
    `List<Integer> spiralOrder(int[][] matrix) {\n    // your code here\n}`),

  ex("java_m30_5_t1_ex_4","java_m30_5_t1",4,"easy","code_scratch",
    "Rotate Matrix 90° Clockwise (LeetCode #48)",
    "Rotate an n×n matrix 90° clockwise IN-PLACE (O(1) extra space).",
    "Transpose first (swap mat[i][j] with mat[j][i] for i<j), then reverse each row.",
    ["Transpose: iterate j from i+1 (upper triangle only)","Reverse each row after transposing","Counter-clockwise: reverse rows first, then transpose"],
    [{ type:"execution", input:"[[1,2,3],[4,5,6],[7,8,9]]", expected:"[[7,4,1],[8,5,2],[9,6,3]]" }],
    `void rotate(int[][] matrix) {\n    // your code here\n}`),

  ex("java_m30_5_t1_ex_5","java_m30_5_t1",5,"easy","code_scratch",
    "Set Matrix Zeroes (LeetCode #73)",
    "If an element is 0, set its entire row and column to 0. Do it in-place.",
    "First pass: record which rows and cols contain a zero. Second pass: zero them out.",
    ["Never zero in-place during the first pass — you'd spread zeros incorrectly","Use the first row/col as storage to achieve O(1) space (advanced)","Simple O(rows+cols) space: two boolean arrays for marked rows and cols"],
    [{ type:"execution", input:"[[1,1,1],[1,0,1],[1,1,1]]", expected:"[[1,0,1],[0,0,0],[1,0,1]]" }],
    `void setZeroes(int[][] matrix) {\n    // your code here\n}`),

  ex("java_m30_5_t1_ex_6","java_m30_5_t1",6,"medium","code_scratch",
    "Diagonal Traverse (LeetCode #498)",
    "Traverse an m×n matrix in diagonal order (alternating direction each diagonal).",
    "Anti-diagonal d has all cells where r+c=d. Even d: traverse bottom-up. Odd d: traverse top-down.",
    ["Total diagonals: rows+cols-1","For diagonal d: r ranges from max(0,d-cols+1) to min(rows-1,d)","Direction flips each diagonal"],
    [{ type:"execution", input:"[[1,2,3],[4,5,6],[7,8,9]]", expected:"[1, 2, 4, 7, 5, 3, 6, 8, 9]" }],
    `int[] findDiagonalOrder(int[][] mat) {\n    // your code here\n}`),

  ex("java_m30_5_t1_ex_7","java_m30_5_t1",7,"medium","code_scratch",
    "Search a 2D Matrix (LeetCode #74)",
    "Matrix where each row is sorted and first of each row > last of previous. Search for target in O(log(m×n)).",
    "Flatten the 2D index to 1D: binary search on [0..rows*cols-1]. Map mid: row=mid/cols, col=mid%cols.",
    ["mid/cols gives the row","mid%cols gives the column","Standard binary search — just different index mapping"],
    [{ type:"execution", input:"[[1,3,5,7],[10,11,16,20],[23,30,34,60]],3", expected:"true" },
     { type:"execution", input:"[[1,3,5,7],[10,11,16,20],[23,30,34,60]],13", expected:"false" }],
    `boolean searchMatrix(int[][] matrix, int target) {\n    // your code here\n}`),

  ex("java_m30_5_t1_ex_8","java_m30_5_t1",8,"medium","pattern_match",
    "Identify the traversal pattern",
    "Match each problem to the correct 2D traversal technique.",
    "1. Print all elements on each diagonal (bottom-left to top-right)\n2. Print the matrix rotated 180°\n3. Find all elements equal to the element to their right and below\n4. Iterate all cells in reading order (left-right, top-bottom)",
    "1→anti-diagonal grouping (r+c=constant), 2→rotate 180° = reverse rows + reverse each row, 3→nested loop with bounds check, 4→standard row-major nested loop",
    [{ type:"text_match", expected:"1→anti-diagonal" }]),

  ex("java_m30_5_t1_ex_9","java_m30_5_t1",9,"hard","code_scratch",
    "Rotate Image — all 4 directions",
    "Implement both 90° clockwise AND counter-clockwise rotation in-place.",
    "Clockwise: transpose then reverse rows. Counter-clockwise: reverse rows then transpose.",
    ["Test by applying clockwise 4 times — you should get the original matrix back","Counter-clockwise = 3× clockwise (different approach, same result)"],
    [{ type:"execution", input:"[[1,2,3],[4,5,6],[7,8,9]],'CW'", expected:"[[7,4,1],[8,5,2],[9,6,3]]" }],
    `void rotateCW(int[][] m) { /* clockwise */ }\nvoid rotateCCW(int[][] m) { /* counter-clockwise */ }`),

  ex("java_m30_5_t1_ex_10","java_m30_5_t1",10,"warmup","predict_output",
    "Trace matrix multiplication by hand",
    "Compute A × B by hand:\n```\nA = [[1,2],[3,4]]\nB = [[5,6],[7,8]]\n```\nShow C[0][0], C[0][1], C[1][0], C[1][1] with the dot-product calculation.",
    "C[0][0] = A[0]·B[:,0] = 1×5 + 2×7 = 5+14  = 19\nC[0][1] = A[0]·B[:,1] = 1×6 + 2×8 = 6+16  = 22\nC[1][0] = A[1]·B[:,0] = 3×5 + 4×7 = 15+28 = 43\nC[1][1] = A[1]·B[:,1] = 3×6 + 4×8 = 18+32 = 50\n\nResult: [[19,22],[43,50]]\n\nKey: C[i][j] = row i of A dotted with column j of B.",
    ["C[i][j] = sum(A[i][k] * B[k][j]) for k=0..n-1","Row i of A times column j of B","Inner dimension n=2, so k runs 0 and 1"],
    [{ type:"text_match", expected:"[[19,22],[43,50]]" }]),

  ex("java_m30_5_t1_ex_11","java_m30_5_t1",11,"medium","code_scratch",
    "Matrix Multiplication (LeetCode #311 variant)",
    "Implement matrix multiplication for two 2D integer arrays A (m×n) and B (n×p).\nReturn the resulting matrix C (m×p).",
    "Standard O(m×n×p) triple loop:\n  for i in rows of A\n    for j in cols of B\n      for k in 0..n-1\n        C[i][j] += A[i][k] * B[k][j]",
    ["C has dimensions A.length × B[0].length","Inner dimension: A[0].length == B.length","Three nested loops: i (rows A), j (cols B), k (shared dimension)"],
    [{ type:"execution", input:"[[1,2],[3,4]],[[5,6],[7,8]]", expected:"[[19,22],[43,50]]" },
     { type:"execution", input:"[[1,0],[0,1]],[[5,6],[7,8]]", expected:"[[5,6],[7,8]]" }],
    `int[][] multiply(int[][] A, int[][] B) {\n    // your code here\n}`),

  ex("java_m30_5_t1_ex_12","java_m30_5_t1",12,"hard","code_scratch",
    "Sparse Matrix Multiplication (LeetCode #311)",
    "Multiply sparse matrices A and B efficiently — skip zero entries in A to avoid unnecessary work.\nInput: two 2D arrays where many values are 0.",
    "Optimised: iterate k in middle loop; if A[i][k]==0, skip entire inner j loop.\nThis short-circuits all multiplications by zero — O(m×nnz×p) where nnz=non-zeros in A.",
    ["Middle loop: k over shared dimension","if (A[i][k]==0) continue — skips the j loop entirely","Same result as standard multiplication but faster on sparse input"],
    [{ type:"execution", input:"[[1,0,0],[-1,0,3]],[[7,0,0],[0,0,0],[0,0,1]]", expected:"[[7,0,0],[-7,0,3]]" }],
    `int[][] multiply(int[][] A, int[][] B) {\n    // optimised for sparse matrices\n}`),

  // ── T2: Grid BFS/DFS ─────────────────────────────────────────────────────
  ex("java_m30_5_t2_ex_1","java_m30_5_t2",1,"warmup","predict_output",
    "Trace BFS from (0,0) on a grid",
    "Grid (0=open, 1=wall):\n```\n0 0 1\n0 0 0\n1 0 0\n```\nTrace BFS from (0,0). List cells in the order they are first visited (r,c).",
    "BFS level 0: (0,0)\nBFS level 1: (0,1), (1,0)          ← right and down of (0,0)\nBFS level 2: (1,1), (2,1)          ← neighbours of level-1 cells (skip wall at (0,2) and (2,0))\nBFS level 3: (1,2), (2,2)          ← neighbours of level-2 cells\n\nVisited order: (0,0), (0,1), (1,0), (1,1), (2,1), (1,2), (2,2)\n\nNote: (0,2) and (2,0) are walls — never visited.",
    ["BFS visits level-by-level (all distance-1 cells before distance-2)","Walls and already-visited cells are skipped","Queue order: FIFO — first-in, first-out"],
    [{ type:"text_match", expected:"(0,0), (0,1), (1,0), (1,1), (2,1), (1,2), (2,2)" }]),

  ex("java_m30_5_t2_ex_2","java_m30_5_t2",2,"easy","code_scratch",
    "Number of Islands (LeetCode #200)",
    "Count the number of islands in a 2D grid of '1's and '0's.",
    "For each unvisited '1': increment count, then DFS to sink all connected land ('1'→'0').",
    ["DFS marks cells by mutating the grid — avoids a separate visited array","If grid is immutable: use boolean[][] visited","4-directional adjacency only (not diagonal)"],
    [{ type:"execution", input:"[[\"1\",\"1\",\"0\"],[\"0\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]", expected:"2" },
     { type:"execution", input:"[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]", expected:"1" }],
    `int numIslands(char[][] grid) {\n    // your code here\n}`),

  ex("java_m30_5_t2_ex_3","java_m30_5_t2",3,"easy","code_scratch",
    "Flood Fill (LeetCode #733)",
    "Given an image, a starting pixel, and a new color, flood fill the connected region.",
    "DFS from the starting pixel. Replace oldColor with newColor. Stop at boundaries or different colors.",
    ["Early exit: if oldColor == newColor, return immediately (avoid infinite loop)","4-directional only","DFS is cleaner here than BFS — no shortest path needed"],
    [{ type:"execution", input:"[[1,1,1],[1,1,0],[1,0,1]],1,1,2", expected:"[[2,2,2],[2,2,0],[2,0,1]]" }],
    `int[][] floodFill(int[][] image, int sr, int sc, int color) {\n    // your code here\n}`),

  ex("java_m30_5_t2_ex_4","java_m30_5_t2",4,"medium","code_scratch",
    "Shortest Path in Binary Matrix (LeetCode #1091)",
    "Find the shortest clear path from (0,0) to (n-1,n-1) (8-directional, 0=clear, 1=blocked).",
    "BFS with 8 directions. Track steps (level). First time you reach (n-1,n-1) = shortest path.",
    ["8 directions: add 4 diagonals to the standard 4-directional dirs array","If start or end is blocked: return -1 immediately","BFS level size = number of cells at that distance"],
    [{ type:"execution", input:"[[0,1],[1,0]]", expected:"2" },
     { type:"execution", input:"[[0,0,0],[1,1,0],[1,1,0]]", expected:"4" }],
    `int shortestPathBinaryMatrix(int[][] grid) {\n    // your code here\n}`),

  ex("java_m30_5_t2_ex_5","java_m30_5_t2",5,"medium","code_scratch",
    "Max Area of Island (LeetCode #695)",
    "Find the maximum area (number of cells) among all islands in the grid.",
    "DFS from each unvisited '1', count connected cells. Track the max count seen.",
    ["DFS returns the area of the island it sinks","Max area = max over all DFS calls","Mark visited to avoid recounting"],
    [{ type:"execution", input:"[[0,0,1,0],[0,1,1,0],[0,1,0,0],[0,0,0,1]]", expected:"4" }],
    `int maxAreaOfIsland(int[][] grid) {\n    // your code here\n}`),

  ex("java_m30_5_t2_ex_6","java_m30_5_t2",6,"medium","code_scratch",
    "Surrounded Regions (LeetCode #130)",
    "Flip all 'O' regions NOT connected to the border to 'X'. Keep border-connected 'O's.",
    "DFS from all border 'O' cells — mark them safe (e.g. 'S'). Then flip all remaining 'O' to 'X', restore 'S' to 'O'.",
    ["Reverse thinking: start from border, not interior","Three-pass: mark safe → flip O→X → restore S→O","DFS from each border cell that is 'O'"],
    [{ type:"execution", input:"[[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"O\",\"X\"],[\"X\",\"X\",\"O\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]", expected:"[[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]" }],
    `void solve(char[][] board) {\n    // your code here\n}`),

  ex("java_m30_5_t2_ex_7","java_m30_5_t2",7,"hard","code_scratch",
    "Word Search (LeetCode #79)",
    "Given a board of characters and a word, find if the word exists in the grid using adjacent (non-diagonal) cells — each cell used at most once.",
    "DFS with backtracking. Mark cell visited by replacing it temporarily, then restore on backtrack.",
    ["Mark visited: grid[r][c]='#', restore after DFS returns","Check grid[r][c]==word.charAt(idx) before recursing","Base case: idx==word.length() → return true"],
    [{ type:"execution", input:"[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]],\"ABCCED\"", expected:"true" },
     { type:"execution", input:"[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]],\"ABCB\"", expected:"false" }],
    `boolean exist(char[][] board, String word) {\n    // your code here\n}`),

  // ── T3: Grid DP ───────────────────────────────────────────────────────────
  ex("java_m30_5_t3_ex_1","java_m30_5_t3",1,"warmup","predict_output",
    "Fill minimum path sum DP table",
    "Fill the DP table for minimum path sum on:\n```\ngrid = [[1,3,1],\n        [1,5,1],\n        [4,2,1]]\n```\nShow dp[r][c] for every cell.",
    "dp[0][0]=1, dp[0][1]=4, dp[0][2]=5  (first row: cumulative sum, right only)\ndp[1][0]=2, dp[1][1]=7, dp[1][2]=6  (dp[1][1]=5+min(4,2)=7; dp[1][2]=1+min(5,7)=6)\ndp[2][0]=6, dp[2][1]=8, dp[2][2]=7  (dp[2][1]=2+min(7,6)=8; dp[2][2]=1+min(6,8)=7)\n\nAnswer: dp[2][2] = 7  (path 1→3→1→1→1)",
    ["First row: only reachable from the left","First col: only reachable from above","dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])"],
    [{ type:"text_match", expected:"dp[2][2] = 7" }]),

  ex("java_m30_5_t3_ex_2","java_m30_5_t3",2,"easy","code_scratch",
    "Unique Paths (LeetCode #62)",
    "Count paths from top-left to bottom-right moving only right or down.",
    "dp[r][c] = dp[r-1][c] + dp[r][c-1]. Base: first row and col = 1 (only one way to reach each).",
    ["First row: all 1s (only right)","First col: all 1s (only down)","Math alternative: C(m+n-2, m-1) — but DP is the expected interview answer"],
    [{ type:"execution", input:"3,7", expected:"28" },
     { type:"execution", input:"3,2", expected:"3" }],
    `int uniquePaths(int m, int n) {\n    // your code here\n}`),

  ex("java_m30_5_t3_ex_3","java_m30_5_t3",3,"easy","code_scratch",
    "Minimum Path Sum (LeetCode #64)",
    "Find path from top-left to bottom-right with minimum sum. Only right or down.",
    "dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1]). Space-optimise to O(cols) with 1D array.",
    ["dp[c] before update = cell above","dp[c-1] after update = cell left","Optimise space: single 1D array, update left-to-right"],
    [{ type:"execution", input:"[[1,3,1],[1,5,1],[4,2,1]]", expected:"7" }],
    `int minPathSum(int[][] grid) {\n    // your code here\n}`),

  ex("java_m30_5_t3_ex_4","java_m30_5_t3",4,"medium","code_scratch",
    "Unique Paths II — with obstacles (LeetCode #63)",
    "Count paths from top-left to bottom-right, avoiding obstacles (1=obstacle, 0=open).",
    "Same as Unique Paths but set dp[r][c]=0 when grid[r][c]==1. Handle blocked start/end.",
    ["If grid[0][0]==1 or grid[rows-1][cols-1]==1: return 0","Blocked cell: 0 paths through it","First row/col: if a cell is blocked, all cells beyond it (in that row/col) are also 0"],
    [{ type:"execution", input:"[[0,0,0],[0,1,0],[0,0,0]]", expected:"2" }],
    `int uniquePathsWithObstacles(int[][] obstacleGrid) {\n    // your code here\n}`),

  ex("java_m30_5_t3_ex_5","java_m30_5_t3",5,"medium","code_scratch",
    "Edit Distance (LeetCode #72)",
    "Find the minimum number of operations (insert, delete, replace) to transform word1 into word2.",
    "dp[i][j] = min edit distance for word1[0..i-1] and word2[0..j-1]. Base: dp[i][0]=i, dp[0][j]=j. Recurrence: if chars match, dp[i][j]=dp[i-1][j-1]; else 1+min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).",
    ["dp[i][0]=i: delete all i characters of word1","dp[0][j]=j: insert all j characters","Match: diagonal copy. Mismatch: 1 + min(delete, insert, replace)"],
    [{ type:"execution", input:"\"horse\",\"ros\"", expected:"3" },
     { type:"execution", input:"\"intention\",\"execution\"", expected:"5" }],
    `int minDistance(String word1, String word2) {\n    // your code here\n}`),

  ex("java_m30_5_t3_ex_6","java_m30_5_t3",6,"medium","code_scratch",
    "Longest Common Subsequence (LeetCode #1143)",
    "Find the length of the longest common subsequence of two strings.",
    "dp[i][j]: LCS of text1[0..i-1] and text2[0..j-1]. Match: dp[i-1][j-1]+1. No match: max(dp[i-1][j], dp[i][j-1]).",
    ["Base: dp[0][*]=0 and dp[*][0]=0 (empty string)","Match: take the diagonal","No match: take the max of left or above"],
    [{ type:"execution", input:"\"abcde\",\"ace\"", expected:"3" },
     { type:"execution", input:"\"abc\",\"abc\"", expected:"3" }],
    `int longestCommonSubsequence(String text1, String text2) {\n    // your code here\n}`),

  ex("java_m30_5_t3_ex_7","java_m30_5_t3",7,"hard","code_scratch",
    "Maximal Square (LeetCode #221)",
    "Find the largest square containing only 1s in a binary matrix. Return its area.",
    "dp[r][c] = side length of largest square with bottom-right corner at (r,c). If mat[r][c]=='1': dp[r][c] = 1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]).",
    ["The min of the three neighbours limits how large the square can be","dp[r][c]=0 when mat[r][c]=='0'","Answer = max(dp[r][c])² — return area not side"],
    [{ type:"execution", input:"[[\"1\",\"0\",\"1\",\"0\"],[\"1\",\"0\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\"]]", expected:"4" }],
    `int maximalSquare(char[][] matrix) {\n    // your code here\n}`),

  // ── T4: 2D Binary Search ─────────────────────────────────────────────────
  ex("java_m30_5_t4_ex_1","java_m30_5_t4",1,"warmup","predict_output",
    "Trace 2D binary search",
    "Trace binary search for target=11 on:\n```\nmat = [[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n```\n(rows=3, cols=4). Show lo, hi, mid, mapped (row,col), and decision each step.",
    "lo=0, hi=11 (rows*cols-1=11)\n\nStep 1: mid=5  → row=5/4=1, col=5%4=1 → mat[1][1]=11 == target → FOUND!\n\nSo: 1 step only. Answer: true.\n\nFor target=13:\nStep 1: mid=5 → 11 < 13 → lo=6\nStep 2: mid=8 → mat[2][0]=23 > 13 → hi=7\nStep 3: mid=6 → mat[1][2]=16 > 13 → hi=5\nlo(6) > hi(5) → not found. Answer: false.",
    ["Flat index to 2D: row=mid/cols, col=mid%cols","lo=0, hi=rows*cols-1","Same lo <= hi, mid = lo+(hi-lo)/2 as standard binary search"],
    [{ type:"text_match", expected:"FOUND" }]),

  ex("java_m30_5_t4_ex_2","java_m30_5_t4",2,"warmup","predict_output",
    "Trace staircase search on row+col sorted matrix",
    "Trace search for target=14 on:\n```\nmat = [[1,4,7,11],[2,5,8,12],[3,6,9,16],[10,13,14,17]]\n```\nStart at top-right. Show (r,c), value, and decision each step.",
    "Start: (0,3) → value=11 < 14 → move DOWN (r++)\n(1,3) → value=12 < 14 → move DOWN\n(2,3) → value=16 > 14 → move LEFT (c--)\n(2,2) → value=9 < 14 → move DOWN\n(3,2) → value=14 == target → FOUND!\n\nTotal: 5 steps for a 4×4 matrix (max is rows+cols-1=7 steps).",
    ["Start at top-right: (0, cols-1)","value > target → col-- (eliminate this column)","value < target → row++ (eliminate this row)"],
    [{ type:"text_match", expected:"FOUND" }]),

  ex("java_m30_5_t4_ex_3","java_m30_5_t4",3,"easy","code_scratch",
    "Search a 2D Matrix (LeetCode #74) — fully sorted",
    "Binary search on a fully sorted matrix (each row sorted, first of next row > last of current).",
    "Flatten: binary search on [0..rows*cols-1]. Map mid: row=mid/cols, col=mid%cols.",
    ["mid/cols = row, mid%cols = col","Standard binary search — just the index mapping changes","O(log(rows*cols))"],
    [{ type:"execution", input:"[[1,3,5,7],[10,11,16,20],[23,30,34,60]],3", expected:"true" },
     { type:"execution", input:"[[1,3,5,7],[10,11,16,20],[23,30,34,60]],13", expected:"false" }],
    `boolean searchMatrix(int[][] matrix, int target) {\n    // your code here\n}`),

  ex("java_m30_5_t4_ex_4","java_m30_5_t4",4,"medium","code_scratch",
    "Search a 2D Matrix II (LeetCode #240) — row and column sorted",
    "Matrix where each row AND each column is sorted (not fully sorted). Search for target in O(rows+cols).",
    "Start at top-right (0, cols-1). Move left if value > target, move down if value < target.",
    ["Start top-right — only corner where one move eliminates a full row OR column","O(rows+cols) — at most rows down-moves + cols left-moves","NOT binary search — staircase search"],
    [{ type:"execution", input:"[[1,4,7],[2,5,8],[3,6,9]],5", expected:"true" },
     { type:"execution", input:"[[1,4,7],[2,5,8],[3,6,9]],10", expected:"false" }],
    `boolean searchMatrixII(int[][] matrix, int target) {\n    // your code here\n}`),

  ex("java_m30_5_t4_ex_5","java_m30_5_t4",5,"medium","code_scratch",
    "Kth Smallest in a Sorted Matrix (LeetCode #378)",
    "Find the kth smallest element in a row+column sorted matrix.",
    "Binary search on value range [mat[0][0]..mat[n-1][n-1]]. Count elements ≤ mid using staircase from bottom-left. If count < k: lo=mid+1, else hi=mid.",
    ["Count ≤ mid using staircase from bottom-left corner","Binary search on values, not indices","O(n log(max-min))"],
    [{ type:"execution", input:"[[1,5,9],[10,11,13],[12,13,15]],8", expected:"13" }],
    `int kthSmallest(int[][] matrix, int k) {\n    // your code here\n}`),

  // ── T5: Synthesis ─────────────────────────────────────────────────────────
  ex("java_m30_5_t5_ex_1","java_m30_5_t5",1,"warmup","predict_output",
    "Pattern recognition — which 2D technique?",
    "For each problem, name the best technique (traversal, BFS, DFS, grid-DP, binary-search):\n1. Rotate an image 90° in-place\n2. Count connected groups of 1s\n3. Find shortest path in a maze\n4. Count paths from top-left to bottom-right\n5. Search in a row+column sorted matrix",
    "1 → traversal (transpose + reverse rows)\n2 → DFS (connected components / flood fill)\n3 → BFS (shortest path = level-by-level expansion)\n4 → grid-DP (dp[r][c] = dp[r-1][c] + dp[r][c-1])\n5 → binary search / staircase O(rows+cols)",
    ["BFS=shortest hops, DFS=connected component, DP=optimal over all paths, binary search=sorted structure"],
    [{ type:"text_match", expected:"1→traversal, 2→DFS, 3→BFS, 4→grid-DP, 5→staircase search" }]),

  ex("java_m30_5_t5_ex_2","java_m30_5_t5",2,"easy","code_scratch",
    "Walls and Gates (LeetCode #286) — multi-source BFS",
    "Fill each empty room (INF) with its distance to the nearest gate (0). Walls are -1.",
    "Multi-source BFS: enqueue ALL gates at step 0. BFS fills distances. Never overwrite a shorter distance.",
    ["Enqueue all 0s before starting BFS — they all start at level 0","Only update INF cells (not walls, not already-visited rooms)","O(rows*cols) — each cell visited once"],
    [{ type:"execution", input:"[[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]", expected:"[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]" }],
    `void wallsAndGates(int[][] rooms) {\n    int INF = Integer.MAX_VALUE;\n    // your code here\n}`),

  ex("java_m30_5_t5_ex_3","java_m30_5_t5",3,"medium","code_scratch",
    "Game of Life (LeetCode #289)",
    "Apply Conway's Game of Life rules to the board in-place without extra O(m×n) space.",
    "Encode next state in the current cell using extra bits: 01=currently alive, 11=alive→alive, 10=dead→alive. Second pass: shift right to decode final state.",
    ["Bit encoding: use bit 1 for current state, bit 2 for next state","Count live neighbours using bit & 1","Second pass: shift right by 1 to get final state"],
    [{ type:"execution", input:"[[0,1,0],[0,0,1],[1,1,1],[0,0,0]]", expected:"[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]" }],
    `void gameOfLife(int[][] board) {\n    // your code here\n}`),

  ex("java_m30_5_t5_ex_4","java_m30_5_t5",4,"medium","code_scratch",
    "01 Matrix (LeetCode #542) — distance to nearest 0",
    "Given a binary matrix, find the distance of the nearest 0 for each cell.",
    "Multi-source BFS: enqueue all 0-cells at distance 0. BFS propagates distances. Unreachable cells start as Integer.MAX_VALUE.",
    ["Start BFS from ALL 0s simultaneously — same as Walls and Gates","Only update cells with INF (unvisited) distance","4-directional BFS"],
    [{ type:"execution", input:"[[0,0,0],[0,1,0],[0,0,0]]", expected:"[[0,0,0],[0,1,0],[0,0,0]]" },
     { type:"execution", input:"[[0,0,0],[0,1,0],[1,1,1]]", expected:"[[0,0,0],[0,1,0],[1,2,1]]" }],
    `int[][] updateMatrix(int[][] mat) {\n    // your code here\n}`),

  ex("java_m30_5_t5_ex_5","java_m30_5_t5",5,"hard","code_scratch",
    "Shortest Path in Grid with Obstacles Elimination (LeetCode #1293)",
    "Find shortest path from (0,0) to (m-1,n-1) where you can eliminate at most k obstacles.",
    "BFS with state (r, c, remaining_k). visited[r][c][k] to avoid revisiting. Enqueue (r,c,k-1) when stepping through an obstacle.",
    ["State is 3D: (row, col, obstacles-left)","visited array is 3D: rows*cols*(k+1)","BFS still gives shortest path — we just have expanded state space"],
    [{ type:"execution", input:"[[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]],1", expected:"6" }],
    `int shortestPath(int[][] grid, int k) {\n    // your code here\n}`),

  ex("java_m30_5_t5_ex_6","java_m30_5_t5",6,"hard","code_scratch",
    "Cherry Pickup II (LeetCode #1463) — 2-robot grid DP",
    "Two robots start at (0,0) and (0,cols-1). Both move down each step (3 choices: stay-col, left, right). Maximize total cherries collected (don't double-count shared cells).",
    "DP on state (row, col1, col2). dp[r][c1][c2] = max cherries collectible from row r with robot1 at c1 and robot2 at c2.",
    ["At each row, each robot has 3 choices → 9 combinations","If c1==c2: count cherries once","Fill top-down with memoization or bottom-up"],
    [{ type:"execution", input:"[[3,1,1],[2,5,1],[1,5,5],[2,1,1]]", expected:"24" }],
    `int cherryPickup(int[][] grid) {\n    // your code here\n}`),
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED
// ─────────────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Mod = mongoose.connection.collection("promodules");
  const Top = mongoose.connection.collection("protopics");
  const Exr = mongoose.connection.collection("proexercises");

  // Module
  await Mod.updateOne({ moduleId: MODULE_ID }, { $set: MODULE }, { upsert: true });
  console.log(`✓ module ${MODULE_ID} — ${MODULE.name}`);

  // Topics
  for (const t of TOPICS) {
    await Top.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true });
    console.log(`  ✓ topic ${t.topicId} — ${t.name}`);
  }

  // Exercises
  let count = 0;
  for (const e of EXERCISES) {
    await Exr.updateOne({ exerciseId: e.exerciseId }, { $set: e }, { upsert: true });
    count++;
  }
  console.log(`  ✓ ${count} exercises seeded`);

  console.log(`\n✅ M30.5 2D Array Patterns: ${TOPICS.length} topics, ${EXERCISES.length} exercises.`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
