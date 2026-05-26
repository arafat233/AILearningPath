/**
 * GridVisualizer — 2D grid renderer with per-cell state + optional
 * row/col headers.
 *
 * Built for M37-T2 (Islands BFS) and M39-T4 (2D matrix search).
 * State palette is rich enough to cover both: land/water for islands,
 * compare/visited/found for matrix search.
 *
 * Props:
 *   { grid: any[][], cellState?: (r,c) => state, labels?: {rows, cols},
 *     currentCell?: [r,c], cellSize?: number, fontSize?: number }
 */
import { motion } from "framer-motion";

const STATE_STYLE = {
  default:    "bg-zinc-800 border-zinc-700 text-zinc-200",
  water:      "bg-blue-900/40 border-blue-800/60 text-blue-400",
  land:       "bg-amber-700/40 border-amber-600/60 text-amber-200",
  "land-current": "bg-amber-500/60 border-amber-300 text-zinc-900",
  visited:    "bg-emerald-700/40 border-emerald-600/60 text-emerald-200",
  queued:     "bg-cyan-500/30 border-cyan-400/60 text-cyan-100",
  compare:    "bg-amber-500/25 border-amber-500 text-amber-200",
  found:      "bg-[#00c896]/30 border-[#00c896] text-[#00c896]",
  eliminated: "bg-zinc-900 border-zinc-800 text-zinc-700 line-through",
  path:       "bg-purple-500/25 border-purple-500 text-purple-200",
};

/**
 * @param {{
 *   grid: any[][],
 *   cellState?: (r:number, c:number) => string,
 *   labels?: {rows?: (string|number)[], cols?: (string|number)[]},
 *   currentCell?: [number, number] | null,
 *   cellSize?: number,
 *   fontSize?: number,
 * }} props
 */
export default function GridVisualizer({
  grid = [],
  cellState = () => "default",
  labels = null,
  currentCell = null,
  cellSize = 44,
  fontSize = 13,
}) {
  if (grid.length === 0) {
    return <div className="w-full h-32 flex items-center justify-center bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl text-[#444] text-sm">Empty grid</div>;
  }
  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <div className="w-full p-5 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-x-auto">
      <table className="border-separate border-spacing-1">
        {labels?.cols && (
          <thead>
            <tr>
              {labels.rows && <th className="text-[10px] font-mono text-zinc-500" style={{ width: 28 }}></th>}
              {labels.cols.map((c, i) => (
                <th key={i} className="text-[10px] font-mono text-zinc-500 text-center" style={{ width: cellSize }}>{c}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {grid.map((row, r) => (
            <tr key={r}>
              {labels?.rows && <th className="text-[10px] font-mono text-zinc-500 text-right pr-2">{labels.rows[r]}</th>}
              {row.map((v, c) => {
                const st = cellState(r, c) || "default";
                const isCurrent = currentCell && currentCell[0] === r && currentCell[1] === c;
                return (
                  <td key={c}>
                    <motion.div
                      animate={isCurrent ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center justify-center border-2 rounded ${STATE_STYLE[st] || STATE_STYLE.default}`}
                      style={{ width: cellSize, height: cellSize, fontSize, fontFamily: "monospace", fontWeight: 700 }}
                    >
                      {v}
                    </motion.div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
