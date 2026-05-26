/**
 * HashGroupingSandbox — Group Anagrams via HashMap. M34-T2.
 */
import { useCallback, useRef, useState } from "react";
import ExplanationPanel from "../ExplanationPanel.jsx";
import { HASH_GROUPING_CODE, DEMO_WORDS, generateGroupAnagramsSteps } from "../algorithms/hashGrouping.js";

const wordCell = "px-2 py-1 rounded text-[12px] font-mono font-bold border";

function wordCellClass(state) {
  if (state === "active") return "bg-amber-500/25 border-amber-500 text-amber-300";
  if (state === "done")   return "bg-zinc-900 border-zinc-800 text-zinc-500";
  return "bg-zinc-800 border-zinc-700 text-zinc-200";
}

export default function HashGroupingSandbox() {
  const [wordsInput, setWordsInput] = useState(DEMO_WORDS.join(", "));
  const [speed, setSpeed] = useState(700);
  const [frames, setFrames] = useState(() => generateGroupAnagramsSteps(DEMO_WORDS));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const words = wordsInput.split(",").map((s) => s.trim()).filter(Boolean);
    if (words.length === 0) return;
    setFrames(generateGroupAnagramsSteps(words));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [wordsInput]);

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

  const groupEntries = Object.entries(frame.groups).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs text-zinc-400">words (comma-separated)</label>
        <input value={wordsInput} onChange={(e) => setWordsInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-96 font-mono" />
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
          <div className="w-full p-4 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl">
            <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">input words</div>
            <div className="flex flex-wrap gap-1.5">
              {frame.words.map((w, i) => (
                <div key={i} className={`${wordCell} ${wordCellClass(i === frame.currentIdx ? "active" : i < frame.currentIdx ? "done" : null)}`}>{w}</div>
              ))}
            </div>
            {frame.currentKey && (
              <div className="mt-3 inline-block px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/40 text-[11px] font-mono text-amber-300">
                current sorted key: <span className="font-bold">"{frame.currentKey}"</span>
              </div>
            )}
          </div>

          <div className="w-full p-4 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl">
            <div className="text-[10px] uppercase tracking-widest text-[#555] mb-2">groups (key → list)</div>
            <div className="space-y-1.5">
              {groupEntries.length === 0
                ? <span className="text-[#444] italic text-[12px]">empty</span>
                : groupEntries.map(([k, vs]) => (
                  <div key={k} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border ${k === frame.activeKey ? "bg-amber-500/10 border-amber-500/40" : "border-transparent"}`}>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${k === frame.activeKey ? "bg-amber-500/20 text-amber-300" : "bg-zinc-800 text-zinc-300"}`}>"{k}"</span>
                    <span className="text-[#444] text-xs">→</span>
                    <div className="flex gap-1 flex-wrap">
                      {vs.map((w, i) => (
                        <span key={i} className="px-2 py-0.5 bg-emerald-900/30 border border-emerald-700/40 rounded text-[11px] font-mono text-emerald-300">{w}</span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[11px] text-[#d4d4d4] overflow-auto h-[420px]"><code>{HASH_GROUPING_CODE}</code></pre>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length} · {groupEntries.length} group{groupEntries.length === 1 ? "" : "s"} so far</div>
    </div>
  );
}
