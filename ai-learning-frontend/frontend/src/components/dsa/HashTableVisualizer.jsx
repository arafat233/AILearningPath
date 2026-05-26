/**
 * HashTableVisualizer — vertical bucket array with chained entries
 * per bucket. Collisions render as a horizontal chain off the bucket.
 *
 * Built for the M34 wire-up because no existing primitive showed
 * collision chains. ArrayVisualizer + LinkedListVisualizer side by
 * side would have worked but reads worse than a single integrated view.
 *
 * @typedef {object} HashEntry
 * @property {string|number} key
 * @property {any}           value
 * @property {'default'|'compare'|'found'|'new'} state
 */
import { motion, AnimatePresence } from "framer-motion";

const ENTRY_STYLE = {
  default: "bg-[#1a1a1a] border-[#2a2a2a] text-[#ccc]",
  compare: "bg-amber-500/15 border-amber-500 text-amber-300",
  found:   "bg-[#00c896]/15 border-[#00c896] text-[#00c896]",
  new:     "bg-blue-500/15 border-blue-500 text-blue-300",
};

/**
 * @param {{
 *   capacity: number,
 *   buckets: (HashEntry[]|null)[],
 *   activeBucket?: number|null,
 *   hashWork?: string|null,
 * }} props
 */
export default function HashTableVisualizer({ capacity, buckets, activeBucket = null, hashWork = null }) {
  return (
    <div className="w-full p-6 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl">
      {hashWork && (
        <div className="mb-3 text-[12px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
          {hashWork}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {Array.from({ length: capacity }).map((_, idx) => {
          const chain  = buckets[idx];
          const active = idx === activeBucket;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${active ? "bg-amber-500/5 border border-amber-500/40" : "border border-transparent"}`}
            >
              <span className={`text-[11px] font-mono w-8 text-right ${active ? "text-amber-400" : "text-[#555]"}`}>
                [{idx}]
              </span>
              <span className="text-[#444] text-xs">→</span>

              {!chain || chain.length === 0 ? (
                <span className="text-[#444] text-[11px] italic">null</span>
              ) : (
                <div className="flex items-center gap-0">
                  <AnimatePresence mode="popLayout">
                    {chain.map((entry, i) => {
                      const style = ENTRY_STYLE[entry.state] || ENTRY_STYLE.default;
                      return (
                        <motion.div
                          key={`${entry.key}`}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center"
                        >
                          <div className={`flex items-center px-2 py-1 border-2 rounded-md text-[12px] font-mono ${style}`}>
                            <span className="font-bold">{entry.key}</span>
                            <span className="text-[#666] mx-1.5">:</span>
                            <span>{typeof entry.value === "string" ? `"${entry.value}"` : String(entry.value)}</span>
                          </div>
                          {i < chain.length - 1 && (
                            <span className="text-[#444] text-xs mx-1">→</span>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <span className="text-[#444] text-xs ml-1">→ ∅</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
