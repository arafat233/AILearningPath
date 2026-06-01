/**
 * InterviewSimulator — /pro/interview/:sessionId
 *
 * Three-panel layout: problem+scratchpad | code editor | AI interviewer chat.
 * Timer counts down from 45 minutes. Warnings at 30/15/5 min.
 * Silence probe fires if user goes 60s without messaging.
 *
 * When session.status === "ended", renders the post-session rubric view.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  interviewGetSession,
  interviewSendMessage,
  interviewEndSession,
} from "../../services/api";
import CodeEditor from "../../components/pro/CodeEditor";

const TOTAL_SECONDS  = 45 * 60;
const WARN_AT        = [30 * 60, 15 * 60, 5 * 60]; // seconds remaining
const SILENCE_SECS   = 60;

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

const SCORE_LABEL = {
  clarifying_questions:   "Clarifying questions",
  approach_communication: "Approach communication",
  code_quality:           "Code quality",
  complexity_awareness:   "Complexity awareness",
  curveball_handling:     "Curveball handling",
};

// ── Rubric view ───────────────────────────────────────────────────────────────
function RubricView({ session, navigate }) {
  const { rubric, problem, durationMinutes, transcript } = session;
  if (!rubric) return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-[24px] font-bold text-[var(--label)]">Session ended</h1>
      <div className="card p-5 text-apple-gray text-[14px]">
        Rubric generation failed or was skipped. Duration: {durationMinutes ?? "?"} min.
      </div>
      <button onClick={() => navigate("/pro/interview")} className="btn-secondary text-[13px]">
        ← New interview
      </button>
    </div>
  );

  const overall = rubric.overall ?? 0;
  const color = overall >= 4 ? "text-apple-green" : overall >= 3 ? "text-apple-orange" : "text-apple-red";

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[var(--label)]">Interview complete</h1>
          <p className="text-[14px] text-apple-gray mt-0.5">{problem?.title} · {durationMinutes ?? "?"} min</p>
        </div>
        <div className={`text-[36px] font-bold ${color}`}>{overall}/5</div>
      </div>

      {rubric.summary && (
        <div className="card p-5 border-l-4 border-apple-blue">
          <p className="text-[13px] text-[var(--label)] leading-relaxed">{rubric.summary}</p>
        </div>
      )}

      {/* Scores */}
      <div className="card p-5 space-y-3">
        <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">Scores</p>
        {Object.entries(rubric.scores || {}).map(([k, v]) => (
          <div key={k} className="flex items-center gap-3">
            <span className="text-[12px] text-apple-gray w-48 shrink-0">{SCORE_LABEL[k] ?? k}</span>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => (
                <div key={n}
                  className={`w-6 h-6 rounded text-[11px] font-bold flex items-center justify-center border ${
                    n <= v
                      ? "bg-apple-blue text-white border-apple-blue"
                      : "bg-[var(--fill)] text-apple-gray3 border-apple-gray5"
                  }`}
                >{n}</div>
              ))}
            </div>
            <span className="text-[12px] font-bold text-[var(--label)]">{v}/5</span>
          </div>
        ))}
      </div>

      {/* Strengths / Improvements */}
      <div className="grid grid-cols-2 gap-4">
        {rubric.strengths?.length > 0 && (
          <div className="card p-4 border-l-4 border-apple-green space-y-2">
            <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">Strengths</p>
            <ul className="space-y-1">
              {rubric.strengths.map((s, i) => <li key={i} className="text-[12px] text-[var(--label)]">✓ {s}</li>)}
            </ul>
          </div>
        )}
        {rubric.improvements?.length > 0 && (
          <div className="card p-4 border-l-4 border-apple-orange space-y-2">
            <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">Improve</p>
            <ul className="space-y-1">
              {rubric.improvements.map((s, i) => <li key={i} className="text-[12px] text-[var(--label)]">→ {s}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Transcript replay */}
      {transcript?.length > 0 && (
        <details className="card p-4">
          <summary className="text-[12px] font-semibold text-apple-gray cursor-pointer select-none">
            Replay transcript ({transcript.length} messages)
          </summary>
          <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
            {transcript.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[12px] ${
                  m.role === "user"
                    ? "bg-apple-blue text-white rounded-br-sm"
                    : "bg-[var(--fill)] text-[var(--label)] rounded-bl-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      <div className="flex gap-3">
        <button onClick={() => navigate("/pro/interview")} className="btn-primary text-[13px]">
          New interview →
        </button>
        <button onClick={() => navigate("/pro/interview/history")} className="btn-secondary text-[13px]">
          History
        </button>
      </div>
    </div>
  );
}

// ── Active session ────────────────────────────────────────────────────────────
export default function InterviewSimulator() {
  const { sessionId } = useParams();
  const navigate       = useNavigate();

  const [session,     setSession]     = useState(null);
  const [code,        setCode]        = useState("");
  const [scratchpad,  setScratchpad]  = useState("");
  const [message,     setMessage]     = useState("");
  const [sending,     setSending]     = useState(false);
  const [ending,      setEnding]      = useState(false);
  const [error,       setError]       = useState("");
  const [secsLeft,    setSecsLeft]    = useState(TOTAL_SECONDS);
  const [warnings,    setWarnings]    = useState(new Set());
  const [toast,       setToast]       = useState("");
  const [leftTab,     setLeftTab]     = useState("problem"); // "problem" | "scratch"

  const chatBottomRef  = useRef(null);
  const silenceTimer   = useRef(null);
  const warnedRef      = useRef(new Set());

  // Load session
  useEffect(() => {
    interviewGetSession(sessionId)
      .then(r => {
        const s = r.data?.data;
        setSession(s);
        if (s?.code) setCode(s.code);
        if (s?.scratchpad) setScratchpad(s.scratchpad);
      })
      .catch(() => setError("Could not load session."));
  }, [sessionId]);

  // Timer countdown
  useEffect(() => {
    if (!session || session.status === "ended") return;
    const startMs  = new Date(session.startedAt).getTime();
    const elapsed  = Math.floor((Date.now() - startMs) / 1000);
    const initial  = Math.max(0, TOTAL_SECONDS - elapsed);
    setSecsLeft(initial);
    if (initial <= 0) return;

    const id = setInterval(() => {
      setSecsLeft(prev => {
        const next = prev - 1;
        // Warnings
        for (const w of WARN_AT) {
          if (next === w && !warnedRef.current.has(w)) {
            warnedRef.current.add(w);
            setToast(`⏱ ${Math.floor(w / 60)} minutes remaining`);
            setTimeout(() => setToast(""), 4000);
          }
        }
        // Auto-end
        if (next <= 0) {
          clearInterval(id);
          handleEnd();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [session?.status, session?.startedAt]);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.transcript]);

  // Silence probe
  const resetSilenceTimer = useCallback(() => {
    clearTimeout(silenceTimer.current);
    if (session?.status === "ended") return;
    silenceTimer.current = setTimeout(async () => {
      try {
        const r = await interviewSendMessage(sessionId, "", true);
        setSession(s => s ? { ...s, transcript: r.data?.data?.transcript || s.transcript } : s);
      } catch {}
    }, SILENCE_SECS * 1000);
  }, [sessionId, session?.status]);

  useEffect(() => {
    resetSilenceTimer();
    return () => clearTimeout(silenceTimer.current);
  }, [resetSilenceTimer]);

  const handleSend = async () => {
    const msg = message.trim();
    if (!msg || sending) return;
    setError("");
    setSending(true);
    resetSilenceTimer();
    try {
      const r = await interviewSendMessage(sessionId, msg, false);
      setSession(s => s ? { ...s, transcript: r.data?.data?.transcript || s.transcript } : s);
      setMessage("");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to send.");
    } finally {
      setSending(false);
    }
  };

  const handleEnd = async () => {
    if (ending) return;
    setEnding(true);
    try {
      const r = await interviewEndSession(sessionId, code, scratchpad);
      setSession(r.data?.data);
    } catch (err) {
      setError(err?.response?.data?.error || "Could not end session.");
      setEnding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (error && !session) return (
    <div className="card p-8 text-center max-w-md mx-auto">
      <p className="text-apple-red font-semibold text-[14px]">{error}</p>
      <button onClick={() => navigate("/pro/interview")} className="btn-secondary text-[13px] mt-4">← Back</button>
    </div>
  );

  if (!session) return <div className="text-[13px] text-apple-gray">Loading…</div>;

  // Ended — show rubric
  if (session.status === "ended") return <RubricView session={session} navigate={navigate} />;

  const transcript = session.transcript || [];
  const timerColor = secsLeft <= 5*60 ? "text-apple-red" : secsLeft <= 15*60 ? "text-apple-orange" : "text-[var(--label)]";

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] gap-0 -mt-4">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-apple-gray5 bg-[var(--bg)] shrink-0">
        <div className="flex items-center gap-3">
          <span className={`text-[18px] font-mono font-bold tabular-nums ${timerColor}`}>{fmt(secsLeft)}</span>
          <span className="text-[12px] text-apple-gray truncate max-w-[200px]">{session.problem?.title}</span>
          <span className="text-[10px] text-apple-gray3 hidden md:block">· 45 min mock interview</span>
        </div>
        {toast && (
          <span className="text-[12px] font-semibold text-apple-orange px-3 py-1 rounded-full bg-apple-orange/10 border border-apple-orange/30 animate-pulse">
            {toast}
          </span>
        )}
        <button
          onClick={handleEnd}
          disabled={ending}
          className="btn-secondary text-[12px] py-1.5 px-4 shrink-0 disabled:opacity-50"
        >
          {ending ? "Generating rubric…" : "End & get rubric →"}
        </button>
      </div>

      {/* ── Three-panel body ── */}
      <div className="flex flex-1 min-h-0 divide-x divide-apple-gray5">

        {/* LEFT: problem + scratchpad */}
        <div className="w-[280px] shrink-0 flex flex-col">
          <div className="flex border-b border-apple-gray5 shrink-0">
            {["problem", "scratch"].map(tab => (
              <button key={tab}
                onClick={() => setLeftTab(tab)}
                className={`flex-1 text-[11px] font-semibold py-2 transition-colors ${
                  leftTab === tab ? "text-apple-blue border-b-2 border-apple-blue" : "text-apple-gray hover:text-[var(--label)]"
                }`}
              >
                {tab === "problem" ? "Problem" : "Scratchpad"}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {leftTab === "problem" ? (
              <div className="space-y-4 text-[13px] text-[var(--label)]">
                <p className="leading-relaxed">{session.problem?.description}</p>
                {session.problem?.constraints?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray mb-1">Constraints</p>
                    <ul className="space-y-0.5">
                      {session.problem.constraints.map((c, i) => <li key={i} className="text-[12px]">• {c}</li>)}
                    </ul>
                  </div>
                )}
                {session.problem?.examples?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold tracking-wider uppercase text-apple-gray mb-1">Examples</p>
                    {session.problem.examples.map((ex, i) => (
                      <div key={i} className="font-mono text-[11px] bg-[var(--fill)] rounded p-2 mb-2">
                        <div><span className="text-apple-gray">Input:</span> {ex.input}</div>
                        <div><span className="text-apple-gray">Output:</span> {ex.output}</div>
                        {ex.explanation && <div className="text-apple-gray3 mt-0.5">{ex.explanation}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <textarea
                value={scratchpad}
                onChange={e => setScratchpad(e.target.value)}
                placeholder="Jot down your approach, edge cases, complexity analysis…"
                className="w-full h-full resize-none bg-transparent text-[13px] text-[var(--label)] placeholder:text-apple-gray4 outline-none leading-relaxed"
              />
            )}
          </div>
        </div>

        {/* CENTER: code editor */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="px-3 py-1.5 border-b border-apple-gray5 shrink-0">
            <span className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">Java · Your solution</span>
          </div>
          <div className="flex-1 min-h-0">
            <CodeEditor
              value={code}
              onChange={setCode}
              language="java"
              height="100%"
            />
          </div>
        </div>

        {/* RIGHT: interviewer chat */}
        <div className="w-[340px] shrink-0 flex flex-col">
          <div className="px-3 py-1.5 border-b border-apple-gray5 shrink-0">
            <span className="text-[10px] font-bold tracking-wider uppercase text-apple-gray">AI Interviewer</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {transcript.length === 0 && (
              <p className="text-[12px] text-apple-gray italic text-center mt-8">Starting interview…</p>
            )}
            {transcript.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-apple-blue text-white rounded-br-sm"
                    : "bg-[var(--fill)] text-[var(--label)] rounded-bl-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-[var(--fill)] rounded-2xl rounded-bl-sm px-3 py-2">
                  <div className="flex gap-1 items-center h-4">
                    {[0,150,300].map(d => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-apple-gray animate-bounce"
                        style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {error && (
            <div className="px-3 pb-1 shrink-0">
              <p className="text-[10px] text-apple-red">{error}</p>
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-apple-gray5 shrink-0 flex gap-2 items-end">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              placeholder="Ask a clarifying question or explain your approach…"
              rows={2}
              className="flex-1 resize-none rounded-xl border border-apple-gray5 bg-[var(--fill)] px-3 py-2 text-[12px] text-[var(--label)] placeholder:text-apple-gray4 outline-none focus:border-apple-blue disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={sending || !message.trim()}
              className="btn-primary shrink-0 px-3 py-2.5 text-[12px] font-semibold disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
