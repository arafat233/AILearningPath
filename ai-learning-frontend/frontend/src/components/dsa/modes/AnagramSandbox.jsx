/**
 * AnagramSandbox — frequency-counting anagram check. M31-T4.
 */
import { useCallback, useRef, useState } from "react";
import ExplanationPanel from "../ExplanationPanel.jsx";
import HighlightedCode from "../HighlightedCode.jsx";
import { ANAGRAM_CODE, generateAnagramSteps } from "../algorithms/anagram.js";

const cellBase = "w-9 h-10 flex items-center justify-center text-[14px] font-mono font-bold border-2 rounded";

function cellClass(highlight) {
  if (highlight === "active")  return "bg-amber-500/25 border-amber-500 text-amber-300";
  if (highlight === "mismatch") return "bg-red-500/20 border-red-500 text-red-300";
  return "bg-zinc-800 border-zinc-700 text-zinc-200";
}

function freqCellClass(value) {
  if (value < 0) return "bg-red-500/25 border-red-500 text-red-300";
  if (value > 0) return "bg-amber-500/15 border-amber-500/60 text-amber-300";
  return "bg-zinc-900 border-zinc-800 text-zinc-500";
}

export default function AnagramSandbox() {
  const [s1, setS1] = useState("listen");
  const [s2, setS2] = useState("silent");
  const [speed, setSpeed] = useState(550);
  const [frames, setFrames] = useState(() => generateAnagramSteps("listen", "silent"));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    setFrames(generateAnagramSteps(s1, s2));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [s1, s2]);

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

  const freqEntries = Object.entries(frame.freq).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs text-zinc-400">s1</label>
        <input value={s1} onChange={(e) => setS1(e.target.value.toLowerCase())} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-32 font-mono" />
        <label className="text-xs text-zinc-400">s2</label>
        <input value={s2} onChange={(e) => setS2(e.target.value.toLowerCase())} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-32 font-mono" />
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
          <div className="w-full p-4 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">s1</div>
              <div className="flex gap-0.5">
                {frame.s1.split("").map((c, i) => (
                  <div key={i} className={`${cellBase} ${cellClass(i === frame.activeS1Idx ? "active" : null)}`}>{c}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">s2</div>
              <div className="flex gap-0.5">
                {frame.s2.split("").map((c, i) => (
                  <div key={i} className={`${cellBase} ${cellClass(i === frame.activeS2Idx ? (frame.phase === "mismatch" ? "mismatch" : "active") : null)}`}>{c}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">freq map (per character)</div>
              <div className="flex flex-wrap gap-0.5">
                {freqEntries.length === 0
                  ? <span className="text-[#555] italic text-[12px]">empty</span>
                  : freqEntries.map(([c, v]) => (
                    <div key={c} className="flex flex-col items-center">
                      <div className={`${cellBase} ${c === frame.activeChar ? "ring-2 ring-amber-400" : ""} ${freqCellClass(v)}`}>{v}</div>
                      <span className="text-[10px] mt-0.5 font-mono text-zinc-500">'{c}'</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className={`inline-block px-3 py-1.5 rounded text-[12px] font-mono ${frame.isAnagram === true ? "bg-[#00c896]/15 border border-[#00c896]/40 text-[#00c896]" : frame.isAnagram === false ? "bg-red-500/15 border border-red-500/40 text-red-300" : "bg-zinc-800 border border-zinc-700 text-zinc-400"}`}>
            {frame.isAnagram === true ? "✓ anagrams" : frame.isAnagram === false ? "✗ not anagrams" : "in progress…"}
          </div>
        </div>
        <HighlightedCode code={ANAGRAM_CODE} activeLine={frame.step.codeLine} height="380px" />
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
