/**
 * KWayMergeSandbox — merge K sorted lists with a min-heap. M36-T4.
 */
import { useCallback, useRef, useState } from "react";
import ExplanationPanel from "../ExplanationPanel.jsx";
import HighlightedCode from "../HighlightedCode.jsx";
import { K_WAY_MERGE_CODE, LINE_BY_PHASE, DEMO_LISTS, generateKWayMergeSteps } from "../algorithms/kWayMerge.js";

const cellBase = "min-w-[36px] px-2 h-8 flex items-center justify-center text-[12px] font-mono font-bold border rounded";

function cellClass(state) {
  if (state === "active")  return "bg-amber-500/15 border-amber-500 text-amber-300";
  if (state === "consumed") return "bg-zinc-900 border-zinc-800 text-zinc-600";
  if (state === "next")    return "bg-blue-500/15 border-blue-500 text-blue-300";
  return "bg-zinc-800 border-zinc-700 text-zinc-200";
}

function parseLists(text) {
  return text.split("\n").map((line) => line.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n))).filter((arr) => arr.length > 0);
}

export default function KWayMergeSandbox() {
  const [listsInput, setListsInput] = useState(DEMO_LISTS.map((l) => l.join(", ")).join("\n"));
  const [speed, setSpeed]   = useState(700);
  const [frames, setFrames] = useState(() => generateKWayMergeSteps(DEMO_LISTS));
  const [idx, setIdx]       = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const lists = parseLists(listsInput);
    if (lists.length === 0) return;
    setFrames(generateKWayMergeSteps(lists));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [listsInput]);

  const play = useCallback(async () => {
    if (playing) return;
    setPlaying(true); stoppedRef.current = false;
    for (let i = idx; i < frames.length; i++) {
      if (stoppedRef.current) break;
      setIdx(i);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, speed));
    }
    setPlaying(false);
  }, [playing, idx, frames, speed]);

  const stop  = () => { stoppedRef.current = true; setPlaying(false); };
  const step  = () => { if (idx < frames.length - 1) setIdx(idx + 1); };
  const back  = () => { if (idx > 0) setIdx(idx - 1); };
  const reset = () => { stoppedRef.current = true; setPlaying(false); setIdx(0); };

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-[11px] text-zinc-500">one sorted list per line, comma-separated</span>
        <button onClick={rebuild} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-white transition">Apply</button>
        <div className="w-px h-6 bg-zinc-700" />
        {!playing
          ? <button onClick={play} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium text-white transition">▶ Play</button>
          : <button onClick={stop} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium text-white transition">⏸ Pause</button>}
        <button onClick={back} disabled={idx === 0} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">◀</button>
        <button onClick={step} disabled={idx >= frames.length - 1} className="px-3 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">Step ▶</button>
        <button onClick={reset} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium text-white transition">Reset</button>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-zinc-400 text-xs">Speed</span>
          <input type="range" min={150} max={1500} step={50} value={1500 - speed + 150} onChange={(e) => setSpeed(1500 - Number(e.target.value) + 150)} className="w-24 accent-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <div className="space-y-3">
          <div className="w-full p-4 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl space-y-2">
            <div className="text-[10px] uppercase tracking-widest text-[#555]">input lists (next-unmerged in blue, just-consumed highlighted)</div>
            {frame.lists.map((arr, listIdx) => {
              const ptr = frame.pointers[listIdx] ?? 0;
              return (
                <div key={listIdx} className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-zinc-500 w-12 shrink-0">list {listIdx}</span>
                  {arr.map((v, j) => {
                    const state = listIdx === frame.activeListIdx && j === ptr - 1 ? "active"
                                : j < ptr ? "consumed"
                                : j === ptr ? "next"
                                : "default";
                    return <div key={j} className={`${cellBase} ${cellClass(state)}`}>{v}</div>;
                  })}
                </div>
              );
            })}
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">min-heap (value · list · pos)</div>
            <div className="flex flex-wrap gap-1.5">
              {frame.heap.length === 0 ? <span className="text-[#555] italic text-[12px]">empty</span> : frame.heap.map((e, i) => (
                <div key={i} className={`${cellBase} bg-purple-500/15 border-purple-500 text-purple-300`}>{e.value} · {e.listIdx} · {e.posInList}</div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">output (merged)</div>
            <div className="font-mono text-[13px] text-emerald-300">{frame.output.length === 0 ? <span className="text-[#555] italic">none yet</span> : `[${frame.output.join(", ")}]`}</div>
          </div>
        </div>
        <div className="space-y-3">
          <textarea value={listsInput} onChange={(e) => setListsInput(e.target.value)} className="w-full h-32 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-[12px] text-white font-mono" />
          <HighlightedCode code={K_WAY_MERGE_CODE} activeLine={LINE_BY_PHASE[frame.phase]} height="280px" />
        </div>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
