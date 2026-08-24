import { useEffect, useRef, useState } from "react";
import { getTransformation, trackPodcastListen } from "../services/api";

/**
 * PodcastPlayer — two-voice teacher/student dialogue podcast via the browser's
 * Web Speech API. Zero TTS cost: the script is a cached cross-user
 * transformation (kind "podcast"); voices are synthesized on-device.
 *
 * Voice strategy: pick two distinct English voices from getVoices(); when the
 * device has fewer, fall back to one voice differentiated by pitch/rate.
 * Listen-through (furthest line played / total) is reported once per playback
 * session — it's the metric that decides whether real TTS ever gets funded.
 *
 * Props: topic (name string, required) · subject · grade
 */

const SUPPORTED = typeof window !== "undefined" && "speechSynthesis" in window;

function pickVoices() {
  const all = SUPPORTED ? window.speechSynthesis.getVoices() : [];
  const en = all.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  // Prefer Indian English for the teacher when available
  const teacher = en.find((v) => v.lang?.toLowerCase() === "en-in") || en[0] || null;
  const student = en.find((v) => v !== teacher) || null;
  return { teacher, student };
}

export default function PodcastPlayer({ topic, subject = "Math", grade = "10" }) {
  const [state, setState]     = useState("collapsed"); // collapsed | loading | ready | playing | paused | error
  const [lines, setLines]     = useState([]);
  const [current, setCurrent] = useState(-1);
  const [rate, setRate]       = useState(1);

  const cancelledRef = useRef(false);
  const rateRef      = useRef(1);
  const furthestRef  = useRef(0);   // furthest line index played + 1
  const reportedRef  = useRef(false);
  const linesRef     = useRef([]);

  // Report listen-through once per fetched script — on stop, finish, or unmount.
  const report = () => {
    if (reportedRef.current || !furthestRef.current || !linesRef.current.length) return;
    reportedRef.current = true;
    trackPodcastListen(topic, subject, furthestRef.current, linesRef.current.length).catch(() => {});
  };

  useEffect(() => () => {
    cancelledRef.current = true;
    if (SUPPORTED) window.speechSynthesis.cancel();
    report();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!SUPPORTED || !topic) return null;

  const speakFrom = (i) => {
    const list = linesRef.current;
    if (cancelledRef.current) return;
    if (i >= list.length) { setState("ready"); setCurrent(-1); report(); return; }
    setCurrent(i);
    furthestRef.current = Math.max(furthestRef.current, i + 1);

    const { teacher, student } = pickVoices();
    const isTeacher = list[i].speaker === "teacher";
    const u = new SpeechSynthesisUtterance(list[i].line);
    u.rate = rateRef.current;
    const voice = isTeacher ? teacher : student;
    if (voice) u.voice = voice;
    // Same voice on both speakers (or none found) → differentiate by pitch
    if (!voice || teacher === student || !student) u.pitch = isTeacher ? 0.9 : 1.2;
    u.onend = () => { if (!cancelledRef.current) speakFrom(i + 1); };
    window.speechSynthesis.speak(u);
  };

  const load = async () => {
    setState("loading");
    try {
      const r = await getTransformation(topic, "podcast", subject, grade);
      const got = r.data?.data?.lines;
      if (!Array.isArray(got) || !got.length) throw new Error("empty");
      setLines(got);
      linesRef.current = got;
      furthestRef.current = 0;
      reportedRef.current = false;
      cancelledRef.current = false;
      setState("playing");
      speakFrom(0);
    } catch {
      setState("error");
    }
  };

  const play   = () => { cancelledRef.current = false; setState("playing"); speakFrom(Math.max(0, current)); };
  const pause  = () => { window.speechSynthesis.pause(); setState("paused"); };
  const resume = () => { window.speechSynthesis.resume(); setState("playing"); };
  const stop   = () => {
    cancelledRef.current = true;
    window.speechSynthesis.cancel();
    setState("ready"); setCurrent(-1);
    report();
  };
  const changeRate = (r) => {
    setRate(r); rateRef.current = r;
    if (state === "playing" || state === "paused") {
      cancelledRef.current = true;
      window.speechSynthesis.cancel();
      cancelledRef.current = false;
      setState("playing");
      speakFrom(Math.max(0, current));
    }
  };

  if (state === "collapsed" || state === "loading" || state === "error") {
    return (
      <div>
        <button onClick={load} disabled={state === "loading"}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-apple-blue/10 hover:bg-apple-blue/20 transition-colors text-apple-blue text-[12px] font-semibold"
          style={{ cursor: state === "loading" ? "wait" : "pointer" }}>
          🎧 {state === "loading" ? "Preparing episode…" : "Listen as conversation"}
        </button>
        {state === "error" && <p style={{ fontSize: "12px", color: "#FF3B30", margin: "8px 0 0" }}>Couldn't load the episode — try again in a minute.</p>}
      </div>
    );
  }

  return (
    <div style={{ flex: "1 1 100%", background: "#FFFFFF", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#007AFF" }}>🎧 Topic Podcast</span>
        <div style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "999px", background: "rgba(0,122,255,0.08)", padding: "4px 8px", color: "#007AFF" }}>
          {state === "playing"
            ? <button onClick={pause} title="Pause" style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: "12px", fontWeight: 700 }}>❚❚</button>
            : state === "paused"
            ? <button onClick={resume} title="Resume" style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: "12px", fontWeight: 700 }}>▶</button>
            : <button onClick={play} title="Play" style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: "12px", fontWeight: 700 }}>▶</button>}
          <button onClick={stop} title="Stop" style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: "12px", fontWeight: 700 }}>■</button>
          <span style={{ fontSize: "11px" }}>{current >= 0 ? `${current + 1}/${lines.length}` : `${lines.length} lines`}</span>
          <select value={rate} onChange={(e) => changeRate(parseFloat(e.target.value))} title="Speed"
            style={{ fontSize: "11px", background: "transparent", border: "none", outline: "none", cursor: "pointer", color: "inherit" }}>
            {[0.75, 1, 1.25, 1.5].map((r) => <option key={r} value={r}>{r}×</option>)}
          </select>
        </div>
      </div>
      <div style={{ maxHeight: "260px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start",
            background: i === current ? "rgba(0,122,255,0.08)" : "transparent", borderRadius: "10px", padding: "6px 8px" }}>
            <span style={{ fontSize: "14px", flexShrink: 0 }}>{l.speaker === "teacher" ? "👩‍🏫" : "🧑‍🎓"}</span>
            <p style={{ fontSize: "13px", color: "#1D1D1F", lineHeight: 1.6, margin: 0 }}>{l.line}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
