/**
 * IntervalVisualizer — horizontal time-axis with intervals as colored bars.
 *
 * Built for M38-T3 (Merge Intervals). Renders input and result rows
 * stacked, with overlapping intervals visually obvious because they
 * share x-axis range.
 *
 * Props:
 *   {
 *     intervals: [start, end][],
 *     result?: [start, end][],
 *     activeIdx?: number,
 *     mergedWithLast?: boolean | null,
 *     minX?: number, maxX?: number,        // axis bounds (auto if omitted)
 *   }
 */
import { motion } from "framer-motion";

const ROW_H = 36;
const BAR_H = 22;
const LABEL_H = 16;
const PAD = 30;

export default function IntervalVisualizer({
  intervals = [],
  result = [],
  activeIdx = -1,
  mergedWithLast = null,
  minX = null,
  maxX = null,
}) {
  const allEnds = [...intervals.flat(), ...result.flat()];
  if (allEnds.length === 0) {
    return <div className="w-full h-24 flex items-center justify-center bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl text-[#444] text-sm">No intervals</div>;
  }
  const min = minX != null ? minX : Math.min(...allEnds);
  const max = maxX != null ? maxX : Math.max(...allEnds);
  const range = Math.max(1, max - min);

  const totalRows = 2;
  const width = 720;
  const usableW = width - PAD * 2;
  const xOf = (v) => PAD + ((v - min) / range) * usableW;

  const height = LABEL_H + ROW_H * totalRows + 30;
  const inputY = LABEL_H + 8;
  const resultY = LABEL_H + ROW_H + 8;

  // Axis ticks — generate up to 12 evenly spaced
  const tickCount = Math.min(12, Math.max(2, max - min));
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => Math.round(min + (range * i) / tickCount));

  return (
    <div className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-x-auto p-4">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
        {/* Axis */}
        <line x1={PAD} y1={LABEL_H + ROW_H * 2 + 14} x2={width - PAD} y2={LABEL_H + ROW_H * 2 + 14} stroke="#2a2a2a" strokeWidth={1} />
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={xOf(t)} y1={LABEL_H + ROW_H * 2 + 11} x2={xOf(t)} y2={LABEL_H + ROW_H * 2 + 17} stroke="#444" />
            <text x={xOf(t)} y={LABEL_H + ROW_H * 2 + 28} fontSize={10} fill="#666" textAnchor="middle" fontFamily="monospace">{t}</text>
          </g>
        ))}

        {/* Row labels */}
        <text x={4} y={inputY + BAR_H / 2 + 4} fontSize={10} fill="#555" fontFamily="monospace">input</text>
        <text x={4} y={resultY + BAR_H / 2 + 4} fontSize={10} fill="#555" fontFamily="monospace">result</text>

        {/* Input intervals */}
        {intervals.map(([s, e], i) => {
          const active = i === activeIdx;
          const stroke = active ? "#f59e0b" : "#3b82f6";
          const fill   = active ? "#f59e0b30" : "#3b82f620";
          return (
            <motion.g
              key={`in-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <rect x={xOf(s)} y={inputY} width={Math.max(2, xOf(e) - xOf(s))} height={BAR_H} rx={4} fill={fill} stroke={stroke} strokeWidth={active ? 2 : 1.5} />
              <text x={xOf(s) + 4} y={inputY + BAR_H / 2 + 4} fontSize={11} fill={active ? "#fbbf24" : "#93c5fd"} fontFamily="monospace">[{s}, {e}]</text>
            </motion.g>
          );
        })}

        {/* Result intervals */}
        {result.map(([s, e], i) => {
          const isLast = i === result.length - 1;
          const stroke = mergedWithLast === true && isLast ? "#00c896" : "#10b981";
          const fill   = mergedWithLast === true && isLast ? "#00c89640" : "#10b98120";
          return (
            <motion.g
              key={`out-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <rect x={xOf(s)} y={resultY} width={Math.max(2, xOf(e) - xOf(s))} height={BAR_H} rx={4} fill={fill} stroke={stroke} strokeWidth={mergedWithLast === true && isLast ? 2.5 : 1.5} />
              <text x={xOf(s) + 4} y={resultY + BAR_H / 2 + 4} fontSize={11} fill="#6ee7b7" fontFamily="monospace">[{s}, {e}]</text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
