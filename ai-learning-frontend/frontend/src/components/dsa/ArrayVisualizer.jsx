/**
 * ArrayVisualizer — labelled array cells with named pointers above.
 *
 * Different from ArrayBars (which shows variable-height bars for sort
 * algorithms): this one shows fixed-size cells with index labels below
 * and named pointer markers above (e.g. `L`, `R`, `mid` for binary
 * search, `i`/`j` for two-pointer techniques).
 *
 * Ported from dsalearn/components/visualizers/ArrayVisualizer.tsx:
 *   - Dropped 'use client'
 *   - Stripped TS `ArrayCell` / `Props` interfaces (kept as JSDoc)
 *   - Renamed .tsx → .jsx
 *
 * @typedef {object} ArrayCell
 * @property {number|string} value
 * @property {'default'|'compare'|'found'|'not-found'|'sorted'|'active'|'pivot'|'done'} state
 * @property {string=} label
 */
import { motion } from "framer-motion";

const STATE_STYLE = {
  default:    "bg-[#1a1a1a] border-[#2a2a2a] text-[#ccc]",
  compare:    "bg-amber-500/15 border-amber-500 text-amber-300",
  found:      "bg-[#00c896]/15 border-[#00c896] text-[#00c896]",
  "not-found": "bg-red-500/15 border-red-500 text-red-300",
  sorted:     "bg-[#00c896]/15 border-[#00c896] text-[#00c896]",
  active:     "bg-blue-500/15 border-blue-500 text-blue-300",
  pivot:      "bg-pink-500/15 border-pink-500 text-pink-300",
  done:       "bg-[#00c896]/15 border-[#00c896] text-[#00c896]",
};

const POINTER_COLORS = ["#00c896", "#f59e0b", "#3b82f6", "#a78bfa", "#ec4899", "#f97316"];

/**
 * @param {{ cells: ArrayCell[], pointers?: Object<string, number>, title?: string }} props
 */
export default function ArrayVisualizer({ cells = [], pointers = {}, title }) {
  const ptrEntries = Object.entries(pointers);
  const colorFor = (name) =>
    POINTER_COLORS[ptrEntries.findIndex(([k]) => k === name) % POINTER_COLORS.length];

  return (
    <div className="flex flex-col items-center gap-6 w-full p-6 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl">
      {title && (
        <span className="text-xs text-[#555] uppercase tracking-widest self-start">{title}</span>
      )}

      {/* Pointer arrows above */}
      {ptrEntries.length > 0 && (
        <div className="relative w-full flex justify-center">
          <div className="flex gap-1">
            {cells.map((_, idx) => {
              const ptrsHere = ptrEntries.filter(([, v]) => v === idx);
              return (
                <div key={idx} className="w-12 flex flex-col items-center">
                  {ptrsHere.map(([name]) => (
                    <div key={name} className="flex flex-col items-center">
                      <span
                        className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                        style={{ color: colorFor(name), background: `${colorFor(name)}20` }}
                      >
                        {name}
                      </span>
                      <span style={{ color: colorFor(name) }} className="text-xs leading-none">▼</span>
                    </div>
                  ))}
                  {ptrsHere.length === 0 && <div className="h-6" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Array cells */}
      <div className="flex gap-1 items-end">
        {cells.map((cell, idx) => (
          <motion.div
            key={idx}
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, delay: idx * 0.03 }}
            className="flex flex-col items-center gap-1"
          >
            <motion.div
              animate={{ scale: cell.state !== "default" ? [1, 1.08, 1] : 1 }}
              transition={{ duration: 0.25 }}
              className={`w-12 h-12 flex items-center justify-center text-base font-bold font-mono border-2 rounded-lg transition-all duration-200 ${STATE_STYLE[cell.state] || STATE_STYLE.default}`}
            >
              {cell.value}
            </motion.div>
            <span className="text-[10px] text-[#444] font-mono">{idx}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
