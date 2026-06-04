import { useEffect, useRef, useState, useCallback } from "react";

/**
 * ListenButton — audio narration (GAP #5, "Listen" mode) via the browser's
 * Web Speech API (SpeechSynthesis). Free, instant, offline; no backend/API cost.
 *
 * Props:
 *   text       (optional) explicit string to narrate (preferred — cleanest)
 *   contentRef (optional) ref to a content container; narrates the text of its
 *              semantic elements (h1–h4, p, li) so buttons/nav chrome are skipped
 *   label      (optional) button label, default "Listen"
 *
 * Renders nothing if SpeechSynthesis is unavailable.
 */

const SUPPORTED = typeof window !== "undefined" && "speechSynthesis" in window;

function gather(text, contentRef) {
  if (text && text.trim()) return text.trim();
  const el = contentRef?.current;
  if (!el) return "";
  const parts = [...el.querySelectorAll("h1,h2,h3,h4,p,li")]
    .map((n) => n.textContent.trim())
    .filter(Boolean);
  return parts.join(". ").replace(/\s+/g, " ").trim();
}

// Split into speakable chunks (sentences) so progress + pause/stop are responsive.
function chunk(s) {
  return s.match(/[^.!?]+[.!?]*/g)?.map((x) => x.trim()).filter((x) => x.length > 1) || (s ? [s] : []);
}

export default function ListenButton({ text, contentRef, label = "Listen" }) {
  const [state, setState] = useState("idle"); // idle | playing | paused
  const [rate, setRate] = useState(1);
  const [progress, setProgress] = useState({ i: 0, n: 0 });
  const chunksRef = useRef([]);
  const idxRef = useRef(0);
  const rateRef = useRef(1);

  const stop = useCallback(() => {
    if (SUPPORTED) window.speechSynthesis.cancel();
    idxRef.current = 0;
    setState("idle");
    setProgress({ i: 0, n: 0 });
  }, []);

  // Cancel narration on unmount or when the source changes.
  useEffect(() => () => { if (SUPPORTED) window.speechSynthesis.cancel(); }, []);
  useEffect(() => { stop(); }, [text, stop]);

  const speakFrom = useCallback((start) => {
    const chunks = chunksRef.current;
    if (start >= chunks.length) { stop(); return; }
    idxRef.current = start;
    const u = new SpeechSynthesisUtterance(chunks[start]);
    u.rate = rateRef.current;
    u.onend = () => {
      // onend also fires on cancel; guard via state check through idxRef
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) return;
      const next = idxRef.current + 1;
      setProgress({ i: Math.min(next, chunks.length), n: chunks.length });
      if (next < chunks.length) speakFrom(next);
      else stop();
    };
    window.speechSynthesis.speak(u);
    setProgress({ i: start + 1, n: chunks.length });
  }, [stop]);

  const play = () => {
    const full = gather(text, contentRef);
    if (!full) return;
    window.speechSynthesis.cancel();
    chunksRef.current = chunk(full);
    rateRef.current = rate;
    setState("playing");
    speakFrom(0);
  };

  const pause = () => { window.speechSynthesis.pause(); setState("paused"); };
  const resume = () => { window.speechSynthesis.resume(); setState("playing"); };

  const changeRate = (r) => {
    setRate(r); rateRef.current = r;
    // Re-speak from the current chunk so the new rate takes effect immediately.
    if (state !== "idle") { window.speechSynthesis.cancel(); setState("playing"); speakFrom(idxRef.current); }
  };

  if (!SUPPORTED) return null;

  return (
    <div className="inline-flex items-center gap-1.5">
      {state === "idle" ? (
        <button onClick={play}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-apple-blue/10 hover:bg-apple-blue/20 transition-colors text-apple-blue text-[12px] font-semibold">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2a3 3 0 00-3 3v3a3 3 0 006 0V5a3 3 0 00-3-3z"/><path d="M3.5 7v1a4.5 4.5 0 009 0V7M8 12.5V14"/></svg>
          {label}
        </button>
      ) : (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-apple-blue/10 px-1.5 py-1 text-apple-blue">
          {state === "playing"
            ? <button onClick={pause} title="Pause" className="px-1.5 text-[12px] font-semibold">❚❚</button>
            : <button onClick={resume} title="Resume" className="px-1.5 text-[12px] font-semibold">▶</button>}
          <button onClick={stop} title="Stop" className="px-1.5 text-[12px] font-semibold">■</button>
          <span className="text-[11px] tabular-nums px-1">{progress.i}/{progress.n}</span>
          <select value={rate} onChange={(e) => changeRate(parseFloat(e.target.value))}
            className="text-[11px] bg-transparent outline-none cursor-pointer" title="Speed">
            {[0.75, 1, 1.25, 1.5].map((r) => <option key={r} value={r}>{r}×</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
