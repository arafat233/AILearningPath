/**
 * lcs — Longest Common Subsequence DP step generator.
 *
 * Used by M31-T5 (String DP — LCS, Edit Distance, Palindromic Subsequence).
 * Animates the dp grid filling cell-by-cell with the standard recurrence:
 *   dp[i][j] = dp[i-1][j-1] + 1            if s1[i-1] === s2[j-1]
 *            = max(dp[i-1][j], dp[i][j-1]) otherwise
 *
 * Each frame highlights the current cell + the 1-3 cells it depends on,
 * so the recurrence is visible — not just numbers filling a table.
 *
 * Frame shape:
 *   {
 *     grid: number[][],                  // dp values so far (others -1)
 *     current: [i, j] | null,
 *     deps: [[i, j]] | null,
 *     match: boolean | null,             // s1[i-1] === s2[j-1]
 *     path: [[i, j]] | null,             // traceback path (last frame only)
 *     result: string | null,             // LCS string (last frame only)
 *     step: { description, detail }
 *   }
 */

export const LCS_CODE = `// Longest Common Subsequence (DP)
int lcs(String a, String b) {
  int[][] dp = new int[a.length() + 1][b.length() + 1];
  for (int i = 1; i <= a.length(); i++) {
    for (int j = 1; j <= b.length(); j++) {
      if (a.charAt(i - 1) == b.charAt(j - 1)) {
        dp[i][j] = dp[i - 1][j - 1] + 1;            // match: diag + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);  // skip: top or left
      }
    }
  }
  return dp[a.length()][b.length()];
}`;

export function generateLCSSteps(s1, s2) {
  const m = s1.length, n = s2.length;
  const grid = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(-1));
  // First row + col are zero by definition (empty string ↔ anything = 0 LCS)
  for (let j = 0; j <= n; j++) grid[0][j] = 0;
  for (let i = 0; i <= m; i++) grid[i][0] = 0;
  const frames = [];

  frames.push({
    grid: grid.map((r) => [...r]),
    current: null,
    deps: null,
    match: null,
    path: null,
    result: null,
    step: {
      description: `LCS("${s1}", "${s2}") — DP grid is (${m + 1})×(${n + 1}).`,
      detail: "Row 0 and column 0 are zero by definition (LCS with empty string = 0).",
    },
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = s1[i - 1] === s2[j - 1];
      const deps  = match ? [[i - 1, j - 1]] : [[i - 1, j], [i, j - 1]];

      frames.push({
        grid: grid.map((r) => [...r]),
        current: [i, j],
        deps,
        match,
        path: null,
        result: null,
        step: {
          description: `dp[${i}][${j}]: compare s1[${i - 1}]="${s1[i - 1]}" with s2[${j - 1}]="${s2[j - 1]}".`,
          detail: match
            ? `Match — dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${grid[i - 1][j - 1] + 1}.`
            : `No match — dp[${i}][${j}] = max(dp[${i - 1}][${j}]=${grid[i - 1][j]}, dp[${i}][${j - 1}]=${grid[i][j - 1]}) = ${Math.max(grid[i - 1][j], grid[i][j - 1])}.`,
        },
      });

      grid[i][j] = match ? grid[i - 1][j - 1] + 1 : Math.max(grid[i - 1][j], grid[i][j - 1]);

      frames.push({
        grid: grid.map((r) => [...r]),
        current: [i, j],
        deps: null,
        match,
        path: null,
        result: null,
        step: {
          description: `Set dp[${i}][${j}] = ${grid[i][j]}.`,
          detail: "",
        },
      });
    }
  }

  // Traceback
  const path = [];
  let lcs = "";
  let i = m, j = n;
  while (i > 0 && j > 0) {
    path.push([i, j]);
    if (s1[i - 1] === s2[j - 1]) {
      lcs = s1[i - 1] + lcs;
      i--; j--;
    } else if (grid[i - 1][j] >= grid[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  path.reverse();

  frames.push({
    grid: grid.map((r) => [...r]),
    current: null,
    deps: null,
    match: null,
    path,
    result: lcs,
    step: {
      description: `Done — LCS length = ${grid[m][n]}.`,
      detail: lcs ? `One LCS: "${lcs}" (traceback from dp[${m}][${n}]).` : "No common subsequence.",
    },
  });

  return frames;
}
