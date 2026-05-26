/**
 * StackVisualizer — LIFO stack with push/pop animations.
 *
 * Ported from dsalearn/components/visualizers/StackVisualizer.tsx:
 *   - Dropped `'use client'`
 *   - Stripped TS `StackItem` / `Props` interfaces (kept as JSDoc)
 *   - Renamed `.tsx` → `.jsx`
 *
 * @typedef {object} StackItem
 * @property {string} id
 * @property {number|string} value
 * @property {'default'|'active'|'new'|'popping'} state
 */
import { motion, AnimatePresence } from "framer-motion";

const ITEM_STYLE = {
  default: "bg-[#1a1a1a] border-[#2a2a2a] text-[#ccc]",
  active:  "bg-amber-500/15 border-amber-500 text-amber-300",
  new:     "bg-[#00c896]/15 border-[#00c896] text-[#00c896]",
  popping: "bg-red-500/15 border-red-500 text-red-300",
};

/**
 * @param {{ items: StackItem[], maxSize?: number }} props
 */
export default function StackVisualizer({ items = [], maxSize = 8 }) {
  const reversed = [...items].reverse();

  return (
    <div className="flex gap-8 items-end justify-center w-full p-6 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl">
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-[#555] mb-2 uppercase tracking-widest">Stack</span>

        {/* Empty slots above current top to keep the column height stable */}
        {Array.from({ length: Math.max(0, maxSize - items.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="w-32 h-10 border border-dashed border-[#1f1f1f] rounded-lg" />
        ))}

        <AnimatePresence mode="popLayout">
          {reversed.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ y: -40, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ x: 60, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className={`w-32 h-10 flex items-center justify-center font-bold font-mono text-base border-2 rounded-lg ${ITEM_STYLE[item.state] || ITEM_STYLE.default}`}
            >
              {item.value}
              {i === 0 && (
                <span className="ml-2 text-[10px] text-[#555] font-normal">← TOP</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Base bar */}
        <div className="w-36 h-1 bg-[#2a2a2a] rounded-full mt-1" />
      </div>
    </div>
  );
}
