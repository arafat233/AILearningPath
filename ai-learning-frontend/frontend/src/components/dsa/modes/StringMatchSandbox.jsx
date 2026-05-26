/**
 * StringMatchSandbox — KMP pattern matching with failure table.
 *
 * Used by M31-T2 (Pattern Matching — KMP). Default text/pattern picked
 * so the learner sees: (1) a real fallback via failure table mid-match,
 * and (2) the "text pointer never backs up" property in action.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import StringMatchVisualizer from "../StringMatchVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import HighlightedCode from "../HighlightedCode.jsx";
import { KMP_CODE, LINE_BY_ACTION, generateKMPSteps } from "../algorithms/kmp.js";

const DEFAULT_TEXT    = "ababcababcabcabc";
const DEFAULT_PATTERN = "abcabc";

export default function StringMatchSandbox() {
  const [text, setText]       = useState(DEFAULT_TEXT);
  const [pattern, setPattern] = useState(DEFAULT_PATTERN);
  const [speed, setSpeed]     = useState(550);
  const [frames, setFrames]   = useState(() => generateKMPSteps(DEFAULT_TEXT, DEFAULT_PATTERN));
  const [idx, setIdx]         = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    if (!text || !pattern) return;
    setFrames(generateKMPSteps(text, pattern));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [text, pattern]);

  useEffect(() => { stoppedRef.current = false; }, [idx]);

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
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-72 font-mono"
        />
        <label className="text-xs text-zinc-400">pattern</label>
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-32 font-mono"
        />
        <button onClick={rebuild} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-white transition">Apply</button>

        <div className="w-px h-6 bg-zinc-700" />

        {!playing ? (
          <button onClick={play}  className="px-4 py-2 bg-green-600  hover:bg-green-500  rounded-lg text-sm font-medium text-white transition">▶ Play</button>
        ) : (
          <button onClick={stop}  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium text-white transition">⏸ Pause</button>
        )}
        <button onClick={back}   disabled={idx === 0}                  className="px-3 py-2 bg-zinc-700  hover:bg-zinc-600  disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">◀</button>
        <button onClick={step}   disabled={idx >= frames.length - 1}   className="px-3 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">Step ▶</button>
        <button onClick={reset}                                        className="px-3 py-2 bg-zinc-700  hover:bg-zinc-600  rounded-lg text-sm font-medium text-white transition">Reset</button>

        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-zinc-400 text-xs">Speed</span>
          <input
            type="range" min={150} max={1500} step={50}
            value={1500 - speed + 150}
            onChange={(e) => setSpeed(1500 - Number(e.target.value) + 150)}
            className="w-24 accent-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <StringMatchVisualizer
          text={frame.text}
          pattern={frame.pattern}
          fail={frame.fail}
          i={frame.i}
          j={frame.j}
          matches={frame.matches}
          action={frame.action}
        />
        <HighlightedCode code={KMP_CODE} activeLine={LINE_BY_ACTION[frame.action]} height="420px" />
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
