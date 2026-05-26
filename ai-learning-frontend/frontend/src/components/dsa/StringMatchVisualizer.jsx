/**
 * StringMatchVisualizer — text + aligned pattern + failure table.
 *
 * Built for M31-T2 (KMP). The two-row layout (text on top, pattern
 * sliding underneath) plus the static failure table is the canonical
 * way KMP is taught, and no existing primitive captures that shape.
 *
 * Props:
 *   { text, pattern, fail, i, j, matches, action }
 */
import { motion } from "framer-motion";

const CHAR_BASE = "w-7 h-9 flex items-center justify-center text-[13px] font-mono font-bold border rounded transition-colors";

export default function StringMatchVisualizer({
  text = "",
  pattern = "",
  fail = [],
  i = 0,
  j = 0,
  matches = [],
  action = "init",
}) {
  // Pattern is aligned so pattern[j] sits under text[i] → offset = i - j.
  const offset = i - j;

  const matchedRanges = matches.map((s) => [s, s + pattern.length - 1]);
  const inMatchRange = (idx) => matchedRanges.some(([s, e]) => idx >= s && idx <= e);

  const textCellStyle = (idx) => {
    if (inMatchRange(idx)) return "bg-[#00c896]/15 border-[#00c896] text-[#00c896]";
    if (action !== "init" && idx === i) {
      if (action === "compare") return "bg-amber-500/20 border-amber-500 text-amber-300";
      if (action === "fallback") return "bg-red-500/15 border-red-500 text-red-300";
      if (action === "match") return "bg-[#00c896]/20 border-[#00c896] text-[#00c896]";
    }
    if (idx < offset) return "bg-zinc-900 border-zinc-800 text-zinc-500";
    return "bg-zinc-800 border-zinc-700 text-zinc-200";
  };

  const patternCellStyle = (pIdx) => {
    if (action === "compare" && pIdx === j) return "bg-amber-500/20 border-amber-500 text-amber-300";
    if (action === "fallback" && pIdx === j) return "bg-red-500/15 border-red-500 text-red-300";
    if (action === "match" && pIdx === j - 1) return "bg-[#00c896]/20 border-[#00c896] text-[#00c896]";
    if (pIdx < j) return "bg-blue-500/10 border-blue-500/50 text-blue-300";
    return "bg-zinc-800 border-zinc-700 text-zinc-300";
  };

  return (
    <div className="w-full p-6 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl space-y-5">
      {/* Text row */}
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">text</div>
        <div className="flex gap-0.5 flex-wrap">
          {text.split("").map((c, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <motion.div
                layout
                animate={{ scale: action !== "init" && idx === i ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.25 }}
                className={`${CHAR_BASE} ${textCellStyle(idx)}`}
              >
                {c}
              </motion.div>
              <span className={`text-[9px] mt-0.5 font-mono ${idx === i ? "text-amber-400" : "text-[#444]"}`}>{idx}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern row — aligned under text via offset */}
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">pattern (aligned at i−j = {offset})</div>
        <div className="flex gap-0.5" style={{ paddingLeft: `${offset * 28}px` }}>
          {pattern.split("").map((c, pIdx) => (
            <div key={pIdx} className="flex flex-col items-center">
              <motion.div
                layout
                animate={{ scale: action !== "init" && pIdx === j ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.25 }}
                className={`${CHAR_BASE} ${patternCellStyle(pIdx)}`}
              >
                {c}
              </motion.div>
              <span className={`text-[9px] mt-0.5 font-mono ${pIdx === j ? "text-amber-400" : "text-[#444]"}`}>{pIdx}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Failure table */}
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">failure table</div>
        <div className="flex gap-0.5">
          {fail.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={`${CHAR_BASE} text-[12px] ${(action === "fallback" && idx === j - 1) ? "bg-red-500/15 border-red-500 text-red-300" : "bg-zinc-900 border-zinc-800 text-zinc-300"}`}>{v}</div>
              <span className="text-[9px] mt-0.5 font-mono text-[#444]">{idx}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-[11px] font-mono text-zinc-400">
        i = <span className="text-amber-400">{i}</span> · j = <span className="text-amber-400">{j}</span> · matches found: <span className="text-[#00c896]">{matches.length}</span>
        {matches.length > 0 && <span className="text-zinc-500"> @ [{matches.join(", ")}]</span>}
      </div>
    </div>
  );
}
