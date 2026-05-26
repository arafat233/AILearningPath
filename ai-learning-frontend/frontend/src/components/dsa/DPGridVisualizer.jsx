/**
 * DPGridVisualizer — 2D DP table with row/col headers, current cell
 * highlight, dependency arrows, and optional traceback path.
 *
 * Built for M31-T5 (LCS). Designed to be reusable for any 2D DP
 * (edit distance, palindromic subsequence) as long as the frame
 * provides current/deps/path consistent with LCS-style.
 *
 * Props:
 *   { grid: number[][], rowHeader: string, colHeader: string,
 *     current?: [i,j], deps?: [[i,j]], path?: [[i,j]], match?: boolean }
 */
import { motion } from "framer-motion";

const CELL_BASE = "w-10 h-10 flex items-center justify-center text-[12px] font-mono font-bold border";

function stateClass({ isCurrent, isDep, isPath, isInactive }) {
  if (isPath)    return "bg-[#00c896]/20 border-[#00c896] text-[#00c896]";
  if (isCurrent) return "bg-amber-500/25 border-amber-500 text-amber-300";
  if (isDep)     return "bg-blue-500/15 border-blue-500 text-blue-300";
  if (isInactive) return "bg-zinc-900 border-zinc-800 text-zinc-600";
  return "bg-zinc-800 border-zinc-700 text-zinc-200";
}

export default function DPGridVisualizer({
  grid = [],
  rowHeader = "",
  colHeader = "",
  current = null,
  deps = null,
  path = null,
  match = null,
}) {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  const inPath    = new Set((path || []).map(([i, j]) => `${i},${j}`));
  const inDeps    = new Set((deps || []).map(([i, j]) => `${i},${j}`));
  const currentKey = current ? `${current[0]},${current[1]}` : "";

  return (
    <div className="w-full p-6 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl">
      <div className="overflow-auto">
        <table className="border-separate border-spacing-0.5">
          <thead>
            <tr>
              <th className={`${CELL_BASE} bg-zinc-900 border-zinc-800 text-zinc-500`}>·</th>
              <th className={`${CELL_BASE} bg-zinc-900 border-zinc-800 text-zinc-500`}>ε</th>
              {colHeader.split("").map((c, j) => (
                <th key={j} className={`${CELL_BASE} bg-zinc-900 border-zinc-800 text-zinc-200`}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, i) => (
              <tr key={i}>
                <th className={`${CELL_BASE} bg-zinc-900 border-zinc-800 text-zinc-200`}>{i === 0 ? "ε" : rowHeader[i - 1]}</th>
                {row.map((v, j) => {
                  const k = `${i},${j}`;
                  const isCurrent = k === currentKey;
                  const isDep     = inDeps.has(k);
                  const isPath    = inPath.has(k);
                  const isInactive = v < 0;
                  return (
                    <td key={j} className="p-0">
                      <motion.div
                        animate={isCurrent ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`${CELL_BASE} rounded ${stateClass({ isCurrent, isDep, isPath, isInactive })}`}
                      >
                        {v < 0 ? "" : v}
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {current && match != null && (
        <div className={`mt-3 inline-block px-2.5 py-1 rounded text-[11px] font-mono ${match ? "bg-[#00c896]/15 text-[#00c896] border border-[#00c896]/40" : "bg-zinc-800 text-zinc-400 border border-zinc-700"}`}>
          {match
            ? `match: ${rowHeader[current[0] - 1]} == ${colHeader[current[1] - 1]} → diag + 1`
            : `no match: max(top, left)`}
        </div>
      )}
    </div>
  );
}
