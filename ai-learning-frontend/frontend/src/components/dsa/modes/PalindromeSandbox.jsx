/**
 * PalindromeSandbox — expand-around-center for longest palindromic
 * substring. M31-T3.
 */
import { useCallback, useRef, useState } from "react";
import ExplanationPanel from "../ExplanationPanel.jsx";
import { PALINDROME_CODE, generatePalindromeSteps } from "../algorithms/palindrome.js";

const DEFAULT_TEXT = "babad";

const cellBase = "w-9 h-10 flex items-center justify-center text-[14px] font-mono font-bold border-2 rounded";

function cellClassFor(idx, frame) {
  const { L, R, bestL, bestR, centerL, centerR, phase } = frame;
  if (phase === "done") {
    if (idx >= bestL && idx <= bestR) return "bg-[#00c896]/20 border-[#00c896] text-[#00c896]";
    return "bg-zinc-800 border-zinc-700 text-zinc-300";
  }
  if (idx === L && idx === R)             return "bg-amber-500/30 border-amber-500 text-amber-300";
  if (idx === L || idx === R)             return "bg-amber-500/20 border-amber-500 text-amber-300";
  if (idx > L && idx < R)                 return "bg-blue-500/15 border-blue-500/60 text-blue-300";
  if (idx === centerL || idx === centerR) return "bg-pink-500/15 border-pink-500/60 text-pink-300";
  return "bg-zinc-800 border-zinc-700 text-zinc-300";
}

export default function PalindromeSandbox() {
  const [textInput, setTextInput] = useState(DEFAULT_TEXT);
  const [speed, setSpeed]         = useState(500);
  const [frames, setFrames]       = useState(() => generatePalindromeSteps(DEFAULT_TEXT));
  const [idx, setIdx]             = useState(0);
  const [playing, setPlaying]     = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    if (!textInput) return;
    setFrames(generatePalindromeSteps(textInput));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [textInput]);

  const play = useCallback(async () => {
    if (playing) return;
    setPlaying(true);
    stoppedRef.current = false;
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
        <label className="text-xs text-zinc-400">text</label>
        <input value={textInput} onChange={(e) => setTextInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-64 font-mono" />
        <button onClick={rebuild} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-white transition">Apply</button>
        <div className="w-px h-6 bg-zinc-700" />
        {!playing ? (
          <button onClick={play}  className="px-4 py-2 bg-green-600  hover:bg-green-500  rounded-lg text-sm font-medium text-white transition">▶ Play</button>
        ) : (
          <button onClick={stop}  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium text-white transition">⏸ Pause</button>
        )}
        <button onClick={back}  disabled={idx === 0}                  className="px-3 py-2 bg-zinc-700  hover:bg-zinc-600  disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">◀</button>
        <button onClick={step}  disabled={idx >= frames.length - 1}   className="px-3 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">Step ▶</button>
        <button onClick={reset}                                       className="px-3 py-2 bg-zinc-700  hover:bg-zinc-600  rounded-lg text-sm font-medium text-white transition">Reset</button>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-zinc-400 text-xs">Speed</span>
          <input type="range" min={150} max={1500} step={50} value={1500 - speed + 150} onChange={(e) => setSpeed(1500 - Number(e.target.value) + 150)} className="w-24 accent-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <div className="w-full p-6 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl space-y-4">
          <div className="flex gap-0.5 flex-wrap">
            {frame.text.split("").map((c, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`${cellBase} ${cellClassFor(i, frame)}`}>{c}</div>
                <span className="text-[10px] mt-0.5 font-mono text-[#444]">{i}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 flex-wrap text-[11px] font-mono">
            <span className="text-zinc-500">phase: <span className="text-zinc-200">{frame.phase}</span></span>
            <span className="text-zinc-500">L = <span className="text-amber-400">{frame.L}</span></span>
            <span className="text-zinc-500">R = <span className="text-amber-400">{frame.R}</span></span>
            <span className="text-zinc-500">best = <span className="text-[#00c896]">"{frame.text.slice(frame.bestL, frame.bestR + 1)}"</span> ({frame.bestR - frame.bestL + 1})</span>
          </div>
        </div>
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[12px] text-[#d4d4d4] overflow-auto h-[340px]"><code>{PALINDROME_CODE}</code></pre>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
