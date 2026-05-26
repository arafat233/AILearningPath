/**
 * ArrayBars — bar-chart visualizer for sort algorithms.
 *
 * Ported from dsa-visualizer 2/src/components/ArrayBars.tsx (Next.js)
 * into Stellar's Vite frontend:
 *   - Dropped `'use client'` (Vite doesn't differentiate server/client)
 *   - Stripped TS prop types (Stellar is JSX-only)
 *   - Kept framer-motion `layout` + `transition` for smooth swaps
 *   - Kept the colour palette consistent with the source
 *
 * Used by VisualizerShell when the topic's visualizer.kind is one of
 * `sorting-sandbox`, `array-pointers`, `binary-search`.
 */
import { motion } from "framer-motion";

const BAR_COLOR = {
  default: "bg-blue-500",
  active:  "bg-amber-400",
  sorted:  "bg-emerald-500",
  pivot:   "bg-pink-500",
};

export default function ArrayBars({ array = [], activeIndices = [], sortedIndices = [], pivotIndex }) {
  const maxVal = Math.max(...array, 1);
  const active = new Set(activeIndices);
  const sorted = new Set(sortedIndices);

  return (
    <div className="flex items-end justify-center gap-1 h-[340px] w-full rounded-xl p-4 bg-zinc-900 border border-zinc-800">
      {array.map((value, index) => {
        let color = BAR_COLOR.default;
        if (sorted.has(index))          color = BAR_COLOR.sorted;
        else if (pivotIndex === index)  color = BAR_COLOR.pivot;
        else if (active.has(index))     color = BAR_COLOR.active;

        const heightPct = (value / maxVal) * 100;

        return (
          <motion.div
            key={index}
            className="flex flex-col items-center justify-end flex-1 min-w-0"
            style={{ height: "100%" }}
          >
            {array.length <= 24 && (
              <span className="text-[9px] text-zinc-400 mb-0.5 font-mono leading-none">{value}</span>
            )}
            <motion.div
              layout
              transition={{ duration: 0.15 }}
              className={`w-full rounded-t-sm ${color}`}
              style={{ height: `${heightPct}%` }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
