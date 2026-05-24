import { useEffect, useState, useCallback, useRef, useMemo, Component } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Diagram } from "../components/DiagramLibrary";
import { getNcertTopicContent, evaluateExplanation, listNcertTopics, listNcertChapters,
         getStudiedTopics, toggleNcertStudied, getNcertNote, saveNcertNote,
         getTopicMastery, startTopic, submitAnswer, recordAdaptiveAttempt,
         getPaperQuestions, getMasteryTest, submitMasteryTest } from "../services/api";

const S = { mono: { fontFamily: "ui-monospace, 'SF Mono', monospace" } };

function loadLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; }
  catch { return fallback; }
}

/* ── useTopicEngagement: gates "Mark as studied" on real engagement ─────────
   Tracks: active seconds (focus + activity), max scroll %, unique sections viewed.
   Ready when: ≥5 min active AND ≥80% scroll AND ≥2 sections viewed.
   Persisted per topicId in localStorage so refresh doesn't reset progress. */
const ENGAGE_MIN_SECONDS  = 300; // 5 min
const ENGAGE_MIN_SCROLL   = 80;  // 80%
const ENGAGE_MIN_SECTIONS = 2;
const NOTE_APPROVAL_MIN   = 70;  // AI score ≥ 70 = approved (user demonstrated understanding)

function useTopicEngagement(topicId) {
  const storageKey = `engage_${topicId}`;
  const [state, setState] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return {
        activeSeconds: s.activeSeconds || 0,
        scrollPct:     s.scrollPct || 0,
        sectionsViewed: new Set(s.sectionsViewed || []),
        noteApproved:  !!s.noteApproved,
        noteScore:     s.noteScore || 0,
      };
    } catch { return { activeSeconds: 0, scrollPct: 0, sectionsViewed: new Set(), noteApproved: false, noteScore: 0 }; }
  });

  const persist = (next) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        activeSeconds:  next.activeSeconds,
        scrollPct:      next.scrollPct,
        sectionsViewed: Array.from(next.sectionsViewed),
        noteApproved:   next.noteApproved,
        noteScore:      next.noteScore,
      }));
    } catch {}
  };

  // Listen for "engagement:note-approved" event dispatched by TopicNote after AI grading
  useEffect(() => {
    const onNote = (e) => {
      if (e.detail?.topicId !== topicId) return;
      const score = Number(e.detail?.score || 0);
      setState((s) => {
        const next = { ...s, noteApproved: score >= NOTE_APPROVAL_MIN, noteScore: score };
        persist(next);
        return next;
      });
    };
    window.addEventListener("engagement:note-approved", onNote);
    return () => window.removeEventListener("engagement:note-approved", onNote);
  }, [storageKey, topicId]);

  // Active-time tick: only counts when tab is focused AND user has been active in last 30s
  useEffect(() => {
    let lastActivity = Date.now();
    let isFocused = typeof document !== "undefined" ? document.visibilityState === "visible" : true;
    const bump = () => { lastActivity = Date.now(); };
    const onVis = () => { isFocused = document.visibilityState === "visible"; };
    window.addEventListener("mousemove", bump, { passive: true });
    window.addEventListener("scroll",    bump, { passive: true });
    window.addEventListener("keydown",   bump);
    window.addEventListener("touchstart", bump, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    const interval = setInterval(() => {
      if (!isFocused) return;
      if (Date.now() - lastActivity > 30_000) return;
      setState((s) => {
        const next = { ...s, activeSeconds: s.activeSeconds + 1 };
        persist(next);
        return next;
      });
    }, 1000);
    return () => {
      window.removeEventListener("mousemove", bump);
      window.removeEventListener("scroll",    bump);
      window.removeEventListener("keydown",   bump);
      window.removeEventListener("touchstart", bump);
      document.removeEventListener("visibilitychange", onVis);
      clearInterval(interval);
    };
  }, [storageKey]);

  // Scroll-depth tracker (max %)
  useEffect(() => {
    const onScroll = () => {
      const h = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.round((window.scrollY / h) * 100));
      setState((s) => {
        if (pct <= s.scrollPct) return s;
        const next = { ...s, scrollPct: pct };
        persist(next);
        return next;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [storageKey]);

  // Unique sections viewed (via IntersectionObserver on [data-section])
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const seen = [];
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute("data-section") || e.target.id;
          if (id) seen.push(id);
        }
      });
      if (!seen.length) return;
      setState((s) => {
        const set = new Set(s.sectionsViewed);
        seen.forEach((id) => set.add(id));
        if (set.size === s.sectionsViewed.size) return s;
        const next = { ...s, sectionsViewed: set };
        persist(next);
        return next;
      });
    }, { threshold: 0.5 });
    // Slight delay so sections rendered after first paint get observed
    const t = setTimeout(() => {
      document.querySelectorAll("[data-section], #ntv-header, #ntv-plain, #ntv-real, #ntv-examples, #ntv-mistakes, #ntv-notes, #ntv-practice")
        .forEach((el) => observer.observe(el));
    }, 500);
    return () => { clearTimeout(t); observer.disconnect(); };
  }, [storageKey, topicId]);

  const isReady = state.activeSeconds >= ENGAGE_MIN_SECONDS
              && state.scrollPct      >= ENGAGE_MIN_SCROLL
              && state.sectionsViewed.size >= ENGAGE_MIN_SECTIONS
              && state.noteApproved;

  return {
    activeSeconds:  state.activeSeconds,
    scrollPct:      state.scrollPct,
    sectionsViewed: state.sectionsViewed.size,
    noteApproved:   state.noteApproved,
    noteScore:      state.noteScore,
    isReady,
  };
}

/* ── Mastery state: spaced re-test (Phase 2) ─────────────────────────────────
   Stored per topic in localStorage as: {
     firstPassedAt: number | null,
     confirmedAt:   number | null,
     attempts:      [{ at, score, total, questionIds }],
     servedIds:     [array of question IDs already served]
   }
   States:
   - "not_passed"     : never scored 8/10
   - "pending"        : passed once, waiting for 3-day spacing window
   - "ready_to_confirm": passed once, 3+ days ago, eligible to retest
   - "mastered"       : passed second time after spacing window → confirmed
*/
const MASTERY_TEST_PASS_SCORE   = 8;   // out of 10
const MASTERY_TEST_TOTAL        = 10;
const MASTERY_COOLDOWN_MIN_MS   = 30 * 60 * 1000;    // 30 minutes between attempts
const MASTERY_SPACING_MIN_MS    = 3  * 24 * 60 * 60 * 1000;  // 3 days

function readMastery(topicId) {
  try {
    const s = JSON.parse(localStorage.getItem(`mastery_${topicId}`) || "{}");
    return {
      firstPassedAt: s.firstPassedAt || null,
      confirmedAt:   s.confirmedAt || null,
      attempts:      Array.isArray(s.attempts) ? s.attempts : [],
      servedIds:     Array.isArray(s.servedIds) ? s.servedIds : [],
    };
  } catch {
    return { firstPassedAt: null, confirmedAt: null, attempts: [], servedIds: [] };
  }
}

function writeMastery(topicId, value) {
  try { localStorage.setItem(`mastery_${topicId}`, JSON.stringify(value)); } catch {}
}

function masteryState(topicId) {
  const m = readMastery(topicId);
  if (m.confirmedAt) return "mastered";
  if (m.firstPassedAt) {
    const elapsed = Date.now() - m.firstPassedAt;
    return elapsed >= MASTERY_SPACING_MIN_MS ? "ready_to_confirm" : "pending";
  }
  return "not_passed";
}

function masteryCooldownRemainingMs(topicId) {
  const m = readMastery(topicId);
  const last = m.attempts[m.attempts.length - 1]?.at || 0;
  return Math.max(0, MASTERY_COOLDOWN_MIN_MS - (Date.now() - last));
}

function recordMasteryAttempt(topicId, { score, total, questionIds }) {
  const m = readMastery(topicId);
  const passed = score >= MASTERY_TEST_PASS_SCORE;
  const at = Date.now();
  m.attempts.push({ at, score, total, questionIds, passed });
  m.servedIds = Array.from(new Set([...(m.servedIds || []), ...questionIds]));
  if (passed) {
    if (!m.firstPassedAt) {
      m.firstPassedAt = at;
    } else if (at - m.firstPassedAt >= MASTERY_SPACING_MIN_MS && !m.confirmedAt) {
      m.confirmedAt = at;
    }
  }
  writeMastery(topicId, m);
  return m;
}

/* ── MasteryTest Modal ─────────────────────────────────────────────────────── */
function MasteryTestModal({ topicId, topicName, onClose, onComplete }) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [warn, setWarn] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { qId: { selectedIdx, correct } }
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setLoading(true);
    const { servedIds } = readMastery(topicId);
    getMasteryTest(topicId, servedIds)
      .then((r) => {
        const d = r.data?.data || {};
        const qs = d.questions || [];
        if (qs.length < MASTERY_TEST_TOTAL) {
          // Fall back: include previously served questions if we don't have enough fresh
          return getMasteryTest(topicId, []).then((r2) => {
            const d2 = r2.data?.data || {};
            setQuestions((d2.questions || []).slice(0, MASTERY_TEST_TOTAL));
            if ((d2.questions || []).length < MASTERY_TEST_TOTAL) {
              setWarn(`Only ${(d2.questions || []).length} MCQs exist for this topic — taking the test with what's available.`);
            }
          });
        }
        setQuestions(qs);
      })
      .catch(() => setWarn("Couldn't load the test. Try again."))
      .finally(() => setLoading(false));
  }, [topicId]);

  const current = questions[idx];
  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  const pickOption = (optionIdx) => {
    if (submitted) return;
    const q = current;
    const selectedText = (q.options || [])[optionIdx]?.text || "";
    setAnswers((a) => ({ ...a, [q._id]: { selectedIdx: optionIdx, selectedText } }));
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;
    const payload = Object.entries(answers).map(([questionId, a]) => ({ questionId, selectedText: a.selectedText }));
    try {
      const r = await submitMasteryTest(topicId, payload);
      const { score, total, perQuestion } = r.data?.data || {};
      // Server returns each question's correct text so we can highlight in future iterations
      const questionIds = questions.map((q) => q._id);
      const updated = recordMasteryAttempt(topicId, { score, total, questionIds });
      setResult({ score, total, passed: score >= MASTERY_TEST_PASS_SCORE, state: masteryState(topicId), perQuestion });
      setSubmitted(true);
      onComplete?.(updated);
    } catch (e) {
      setWarn("Couldn't submit the test. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-[#f0f0f5] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#7c3aed]">Mastery test · 10 questions</p>
            <p className="text-[15px] font-bold text-[#1c1c1e] mt-0.5">{topicName}</p>
          </div>
          <button onClick={onClose} className="text-[20px] text-[#8E8E93] hover:text-[#1c1c1e] leading-none">×</button>
        </div>

        <div className="p-6">
          {loading && <p className="text-[13px] text-[#8E8E93]">Loading questions…</p>}
          {warn && <p className="text-[12px] text-[#FF9500] mb-3">{warn}</p>}

          {!loading && questions.length === 0 && !warn && (
            <p className="text-[13px] text-[#FF3B30]">No MCQs available for this topic yet — test unavailable.</p>
          )}

          {!loading && questions.length > 0 && !submitted && current && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold tracking-wider uppercase text-[#8E8E93]">
                  Q{idx + 1} of {questions.length} · <span style={{ color: current.difficulty === "easy" ? "#34C759" : current.difficulty === "medium" ? "#FF9500" : "#FF3B30" }}>{current.difficulty}</span>
                </p>
                <p className="text-[11px] text-[#8E8E93]">{Object.keys(answers).length}/{questions.length} answered</p>
              </div>
              <p className="text-[15px] text-[#1c1c1e] leading-relaxed mb-5 whitespace-pre-wrap">{current.questionText}</p>
              <div className="space-y-2">
                {(current.options || []).map((opt, i) => {
                  const ans = answers[current._id];
                  const isSelected = ans?.selectedIdx === i;
                  return (
                    <button
                      key={i}
                      onClick={() => pickOption(i)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-[#7c3aed]/10 border-[#7c3aed] text-[#1c1c1e]"
                          : "bg-white border-[#E5E5EA] text-[#1c1c1e] hover:border-[#7c3aed]/40"
                      }`}
                    >
                      <span className="text-[13px] font-bold text-[#8E8E93] mr-3">{String.fromCharCode(65 + i)}.</span>
                      <span className="text-[14px]">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setIdx((i) => Math.max(0, i - 1))}
                  disabled={idx === 0}
                  className="text-[12px] font-semibold text-[#3A3A3C] disabled:opacity-40"
                >
                  ← Previous
                </button>
                {idx < questions.length - 1 ? (
                  <button
                    onClick={() => setIdx((i) => Math.min(questions.length - 1, i + 1))}
                    className="px-5 py-2 rounded-full bg-[#1c1c1e] text-white text-[12px] font-bold hover:bg-[#333] transition-colors"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    className={`px-5 py-2 rounded-full text-[12px] font-bold transition-colors ${
                      allAnswered ? "bg-[#34C759] text-white hover:bg-[#28A045]" : "bg-[#E5E5EA] text-[#8E8E93] cursor-not-allowed"
                    }`}
                  >
                    Submit test ✓
                  </button>
                )}
              </div>
            </>
          )}

          {submitted && result && (
            <div className="text-center py-6">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8E8E93] mb-3">Result</p>
              <p className="text-[48px] font-bold tracking-tight" style={{ color: result.passed ? "#34C759" : "#FF3B30" }}>
                {result.score}<span className="text-[24px] text-[#8E8E93]">/{result.total}</span>
              </p>
              <p className="text-[13px] text-[#3A3A3C] mt-2 mb-5">
                {result.passed
                  ? (result.state === "mastered"
                      ? "Confirmed — you've mastered this topic!"
                      : "Passed! You've reached the first mastery checkpoint.")
                  : `You need at least ${MASTERY_TEST_PASS_SCORE}/${result.total} to pass. Re-read the topic and try again later.`}
              </p>
              {result.passed && result.state === "pending" && (
                <p className="text-[12px] text-[#7c3aed] font-semibold bg-[#7c3aed]/10 rounded-xl px-4 py-3 mb-4">
                  ⏳ Mastery (pending). Come back in 3 days for a second test to confirm — that's how spaced repetition locks it into long-term memory.
                </p>
              )}
              {result.passed && result.state === "mastered" && (
                <p className="text-[12px] text-[#34C759] font-semibold bg-[#34C759]/10 rounded-xl px-4 py-3 mb-4">
                  ✓ Mastery confirmed. This topic is now on your permanent record.
                </p>
              )}
              <button onClick={onClose} className="px-6 py-2 rounded-full bg-[#1c1c1e] text-white text-[12px] font-bold hover:bg-[#333]">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Mastery banner: shows current state + opens the test modal ─────────── */
function MasteryBanner({ topicId, topicName, studied }) {
  const [tick, setTick] = useState(0); // forces re-read of mastery state after attempts
  const [open, setOpen] = useState(false);
  // Refresh every minute so cooldown countdown stays accurate
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(i);
  }, []);

  const state    = masteryState(topicId);
  const m        = readMastery(topicId);
  const cooldown = masteryCooldownRemainingMs(topicId);
  const sinceFirst = m.firstPassedAt ? Date.now() - m.firstPassedAt : 0;
  const daysLeft = m.firstPassedAt && state === "pending"
    ? Math.ceil((MASTERY_SPACING_MIN_MS - sinceFirst) / (1000 * 60 * 60 * 24))
    : 0;

  // Don't show banner until user has Studied the topic
  if (!studied && state === "not_passed") return null;

  let bgGradient, borderColor, eyebrow, eyebrowColor, title, ctaLabel, ctaDisabled = false;
  if (state === "mastered") {
    bgGradient = "linear-gradient(135deg, #d1fae5, #a7f3d0)";
    borderColor = "#34C759";
    eyebrow = "Mastery confirmed";
    eyebrowColor = "#15803d";
    title = "You've mastered this topic.";
    ctaLabel = "Retake test";
  } else if (state === "ready_to_confirm") {
    bgGradient = "linear-gradient(135deg, #fce7f3, #ddd6fe)";
    borderColor = "#7c3aed";
    eyebrow = "Ready to confirm";
    eyebrowColor = "#7c3aed";
    title = "Pass the test once more to confirm mastery.";
    ctaLabel = cooldown > 0 ? `Wait ${Math.ceil(cooldown / 60000)} min` : "Start test →";
    ctaDisabled = cooldown > 0;
  } else if (state === "pending") {
    bgGradient = "linear-gradient(135deg, #fef3c7, #fde68a)";
    borderColor = "#FF9500";
    eyebrow = "Mastery pending";
    eyebrowColor = "#a16207";
    title = `Come back in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} to confirm.`;
    ctaLabel = "Locked";
    ctaDisabled = true;
  } else {
    bgGradient = "linear-gradient(135deg, #ddd6fe, #fbcfe8)";
    borderColor = "#7c3aed";
    eyebrow = "Ready for mastery test";
    eyebrowColor = "#7c3aed";
    title = "10 questions · 3 easy + 4 medium + 3 hard. Pass with 8/10.";
    ctaLabel = cooldown > 0 ? `Wait ${Math.ceil(cooldown / 60000)} min` : "Start test →";
    ctaDisabled = cooldown > 0;
  }

  return (
    <>
      <div style={{
        background: bgGradient,
        border: `1px solid ${borderColor}40`,
        borderRadius: "16px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        flexWrap: "wrap",
        marginTop: "12px",
      }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: eyebrowColor, margin: 0 }}>
            {eyebrow}
          </p>
          <p style={{ fontSize: "14px", color: "#1c1c1e", fontWeight: 600, margin: "3px 0 0", lineHeight: 1.45 }}>
            {title}
          </p>
          {m.attempts.length > 0 && (
            <p style={{ fontSize: "11px", color: "#3A3A3C", marginTop: "3px" }}>
              Last attempt: {m.attempts[m.attempts.length - 1].score}/{m.attempts[m.attempts.length - 1].total} · {new Date(m.attempts[m.attempts.length - 1].at).toLocaleDateString()}
            </p>
          )}
        </div>
        <button
          onClick={() => !ctaDisabled && setOpen(true)}
          disabled={ctaDisabled}
          style={{
            padding: "9px 18px",
            borderRadius: "999px",
            border: "none",
            background: ctaDisabled ? "#E5E5EA" : "#1c1c1e",
            color: ctaDisabled ? "#8E8E93" : "#fff",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.04em",
            cursor: ctaDisabled ? "not-allowed" : "pointer",
            transition: "all 0.15s",
          }}
        >
          {ctaLabel}
        </button>
      </div>

      {open && (
        <MasteryTestModal
          topicId={topicId}
          topicName={topicName}
          onClose={() => { setOpen(false); setTick((t) => t + 1); }}
          onComplete={() => setTick((t) => t + 1)}
        />
      )}
    </>
  );
}

/* ── Section bookmark star ───────────────────────────────────────────────── */
function SectionStar({ bmId, label, unsaved = "rgba(255,255,255,0.6)", xStyle }) {
  const [saved, setSaved] = useState(() => !!loadLS("stellar_section_bookmarks", {})[bmId]);
  const toggle = (e) => {
    e.stopPropagation();
    const bms = loadLS("stellar_section_bookmarks", {});
    if (saved) { delete bms[bmId]; }
    else {
      const topicId = bmId.split("__")[0];
      bms[bmId] = { id: bmId, label, topicId, savedAt: new Date().toISOString() };
    }
    localStorage.setItem("stellar_section_bookmarks", JSON.stringify(bms));
    setSaved(s => !s);
  };
  return (
    <button onClick={toggle} title={saved ? "Remove from saved" : "Save this section"}
      style={{ fontSize:"16px", lineHeight:1, color: saved ? "#FF9500" : unsaved,
        background:"none", border:"none", cursor:"pointer", padding:"1px 5px",
        transition:"color 0.15s", flexShrink:0, ...xStyle }}>
      {saved ? "★" : "☆"}
    </button>
  );
}

/* ── CSS ─────────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@keyframes ntv-in   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes ntv-pop  { 0%{transform:scale(.92);opacity:0} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
@keyframes ntv-flip { 0%{transform:rotateY(0)} 100%{transform:rotateY(180deg)} }
@keyframes ntv-shake{ 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
.ntv-in    { animation: ntv-in   0.25s ease both }
.ntv-pop   { animation: ntv-pop  0.3s  ease both }
.ntv-shake { animation: ntv-shake 0.4s ease both }
.ntv-btn:hover  { filter:brightness(0.93) }
.ntv-btn:active { transform:scale(0.97) }

/* ── #11 reading progress bar (top hairline) ─────────────────────── */
.ntv-progress { position:fixed; top:0; left:0; right:0; height:2px; background:transparent; z-index:100; pointer-events:none; }
.ntv-progress > div { height:100%; background:linear-gradient(90deg,#007AFF,#AF52DE); transition:width 0.05s linear; width:0%; }

/* ── #12 anchor offset + smooth scroll ──────────────────────────── */
.ntv-page { scroll-behavior:smooth; }
.ntv-page [data-section] { scroll-margin-top:24px; }
.ntv-page [data-section] .ntv-anchor-link {
  opacity:0; transition:opacity 0.15s; margin-left:6px; cursor:pointer; color:#7c3aed;
  font-size:12px; text-decoration:none; user-select:none;
}
.ntv-page [data-section]:hover .ntv-anchor-link { opacity:1; }

/* ── #15 highlight selection + #13 ───────────────────────────────── */
.ntv-page ::selection { background:rgba(124,58,237,0.22); color:inherit; }

/* ── #24 a11y focus rings + reduced motion ───────────────────────── */
.ntv-page button:focus-visible, .ntv-page a:focus-visible {
  outline:2px solid #7c3aed; outline-offset:2px; border-radius:6px;
}
@media (prefers-reduced-motion: reduce) {
  .ntv-page *, .ntv-in, .ntv-pop, .ntv-shake { animation:none !important; transition:none !important; }
  .ntv-progress > div { transition:none !important; }
}

/* ── #10 dark-mode overrides for inline-styled cards in this page ── */
html.dark .ntv-page { color:#EBEBF5; }
html.dark .ntv-page h1, html.dark .ntv-page h2, html.dark .ntv-page h3 { color:#FFFFFF !important; }
html.dark .ntv-page p, html.dark .ntv-page span, html.dark .ntv-page li { color:#EBEBF5; }
html.dark .ntv-page [style*="background:#FFFFFF"],
html.dark .ntv-page [style*="background: #FFFFFF"],
html.dark .ntv-page [style*="background:#fff"],
html.dark .ntv-page [style*="background:#FFF"],
html.dark .ntv-page [style*="background:#F5F5F7"],
html.dark .ntv-page [style*="background: #F5F5F7"],
html.dark .ntv-page [style*="background:#F2F2F7"] { background:#2C2C2E !important; }
html.dark .ntv-page [style*="background:#F0FFF4"] { background:rgba(52,199,89,0.10) !important; }
html.dark .ntv-page [style*="background:#FFF5F4"],
html.dark .ntv-page [style*="background:#FFF5F0"],
html.dark .ntv-page [style*="background:#FFF5F5"] { background:rgba(255,59,48,0.10) !important; }
html.dark .ntv-page [style*="background:#EEF4FF"] { background:rgba(0,122,255,0.10) !important; }
html.dark .ntv-page [style*="background:#F5F0FF"] { background:rgba(175,82,222,0.12) !important; }
html.dark .ntv-page [style*="color:#1D1D1F"],
html.dark .ntv-page [style*="color:#3A3A3C"] { color:#EBEBF5 !important; }
html.dark .ntv-page [style*="color:#86868B"],
html.dark .ntv-page [style*="color:#AEAEB2"],
html.dark .ntv-page [style*="color:#C7C7CC"] { color:rgba(235,235,245,0.55) !important; }
html.dark .ntv-page [style*="border:1px solid #FFD0CC"],
html.dark .ntv-page [style*="border:1px solid #C6F0D1"],
html.dark .ntv-page [style*="border:1px solid #D8C7FF"] { border-color:rgba(255,255,255,0.12) !important; }
html.dark .ntv-page [style*="borderTop:1px solid #F2F2F7"],
html.dark .ntv-page [style*="border-top:1px solid #F2F2F7"] { border-top-color:#3A3A3C !important; }

/* ── #4 sticky action stack (floats bottom-right) ───────────────── */
.ntv-sticky-actions { position:fixed; right:24px; bottom:24px; display:flex; flex-direction:column; gap:10px; z-index:50; align-items:flex-end; }

/* ── #20 split-friendly section card token — driven by CSS vars so dark mode flips reliably */
:root {
  --ntv-rail-bg: #FFFFFF;
  --ntv-rail-border: #f0f0f5;
  --ntv-rail-shadow: 0 1px 2px rgba(0,0,0,0.04);
  --ntv-rail-chip-bg: rgba(124,58,237,0.10);
  --ntv-rail-chip-fg: #7c3aed;
}
html.dark {
  --ntv-rail-bg: #2C2C2E;
  --ntv-rail-border: #48484A;
  --ntv-rail-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 6px 18px rgba(0,0,0,0.55);
  --ntv-rail-chip-bg: rgba(124,58,237,0.20);
  --ntv-rail-chip-fg: #C9B8FF; /* lighter for dark-mode readability on the tile bg; Overview itself is #7c3aed */
}
/* Match Key Formula text to the highlighted "Overview" TOC item — same #7c3aed in both themes */
.ntv-rail-card code,
html.dark .ntv-rail-card code { color: #7c3aed !important; font-weight: 700 !important; }
.ntv-rail-card {
  background: var(--ntv-rail-bg);
  border: 1px solid var(--ntv-rail-border);
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: var(--ntv-rail-shadow);
}
html.dark .ntv-rail-card * { color:#EBEBF5; }
html.dark .ntv-rail-card .ntv-rail-muted { color:rgba(235,235,245,0.55) !important; }
.ntv-rail-card code {
  background: var(--ntv-rail-chip-bg) !important;
  color: var(--ntv-rail-chip-fg) !important;
}

/* Inner-tile token — every list item (formula, prereq, what's-next) reads as a
   discrete tile, matching the highlighted "Overview" item in the TOC. */
:root {
  --ntv-tile-bg: rgba(124,58,237,0.08);
  --ntv-tile-border: transparent;
  --ntv-tile-fg: #1c1c1e;
  --ntv-tile-link-fg: #5856D6;
  --ntv-tile-hover-bg: rgba(124,58,237,0.14);
}
html.dark {
  --ntv-tile-bg: rgba(124,58,237,0.18);
  --ntv-tile-border: rgba(124,58,237,0.30);
  --ntv-tile-fg: #EBEBF5;
  --ntv-tile-link-fg: #C9B8FF;
  --ntv-tile-hover-bg: rgba(124,58,237,0.28);
}
.ntv-rail-tile {
  background: var(--ntv-tile-bg) !important;
  border: 1px solid var(--ntv-tile-border) !important;
  color: var(--ntv-tile-fg) !important;
  transition: background 0.15s;
}
.ntv-rail-tile--link {
  color: var(--ntv-tile-link-fg) !important;
}
.ntv-rail-tile:hover { background: var(--ntv-tile-hover-bg) !important; }
`;
function injectCss() {
  if (document.getElementById("ntv-styles")) return;
  const el = document.createElement("style");
  el.id = "ntv-styles"; el.textContent = GLOBAL_CSS;
  document.head.appendChild(el);
}

function sanitizeSvg(svg) {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\s+on\w+="[^"]*"/gi, "")
    .replace(/\s+on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/<svg /, '<svg style="max-width:100%;height:auto;display:block;margin:0 auto" ');
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── Mode selector ───────────────────────────────────────────────────────── */
function ModeSelector({ mode, onChange }) {
  const modes = [
    { key:"quick", icon:"⚡", label:"Quick · 5 min",  sub:"Core concepts only", accent:"#007AFF", inactiveBg:"rgba(0,122,255,0.06)",  activeBg:"rgba(0,122,255,0.12)",  activeBorder:"rgba(0,122,255,0.40)"  },
    { key:"deep",  icon:"📖", label:"Deep · 20 min", sub:"Full mastery path",   accent:"#AF52DE", inactiveBg:"rgba(175,82,222,0.06)", activeBg:"rgba(175,82,222,0.12)", activeBorder:"rgba(175,82,222,0.40)" },
  ];
  return (
    <div style={{ display:"flex", gap:"10px" }}>
      {modes.map(({ key, icon, label, sub, accent, inactiveBg, activeBg, activeBorder }) => {
        const active = mode === key;
        return (
          <button key={key} onClick={() => onChange(key)} className="ntv-btn" aria-pressed={active}
            style={{
              flex:1, padding:"12px 16px", borderRadius:"14px", cursor:"pointer",
              transition:"all 0.15s", textAlign:"left",
              background: active ? activeBg : inactiveBg,
              border: `1px solid ${active ? activeBorder : "transparent"}`,
              boxShadow: active ? `0 4px 14px ${accent}26` : "none",
            }}>
            <div style={{ fontSize:"13px", fontWeight:700, color: active ? accent : "var(--label,#1D1D1F)" }}>{icon} {label}</div>
            <div style={{ fontSize:"11px", color: active ? accent : "var(--apple-gray,#86868B)", marginTop:"2px", opacity: active ? 0.85 : 0.7 }}>{sub}</div>
          </button>
        );
      })}
    </div>
  );
}

/* ── Progress bar ────────────────────────────────────────────────────────── */
function ProgressBar({ done, total }) {
  if (!total) return null;
  const pct = Math.round((done / total) * 100);
  const fin = done >= total;
  return (
    <div style={{ background: fin ? "#F0FFF4" : "#F5F5F7", borderRadius:"12px", padding:"12px 16px", display:"flex", alignItems:"center", gap:"12px" }}>
      <div style={{ flex:1 }}>
        <div style={{ height:"6px", background:"#E5E5EA", borderRadius:"3px", overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background: fin ? "#34C759" : "#007AFF", borderRadius:"3px", transition:"width 0.4s ease" }} />
        </div>
      </div>
      <span style={{ fontSize:"12px", fontWeight:700, color: fin ? "#34C759" : "#007AFF", flexShrink:0 }}>
        {fin ? "✓ All done!" : `${done} / ${total} examples`}
      </span>
    </div>
  );
}

/* ── Collapsible section ─────────────────────────────────────────────────── */
function Section({ title, accent, defaultOpen=false, badge, children, bmId }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background:"#FFFFFF", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <button onClick={() => setOpen(o => !o)} className="ntv-btn"
        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"20px 28px", textAlign:"left", cursor:"pointer", background:"none", border:"none" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <h2 style={{ fontSize:"16px", fontWeight:700, color: accent||"#1D1D1F", margin:0 }}>{title}</h2>
          {badge && <span style={{ fontSize:"11px", fontWeight:700, background: accent ? accent+"22":"#F5F5F7", color: accent||"#86868B", padding:"2px 8px", borderRadius:"20px" }}>{badge}</span>}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
          {bmId && <SectionStar bmId={bmId} label={title} unsaved="#C7C7CC" />}
          <span style={{ color:"#AEAEB2", fontSize:"18px", flexShrink:0, transform: open?"rotate(90deg)":"none", transition:"transform 0.15s", lineHeight:1 }}>›</span>
        </div>
      </button>
      {open && <div style={{ padding:"0 28px 28px", borderTop:"1px solid #F2F2F7" }}>{children}</div>}
    </div>
  );
}

/* ── Hook card ───────────────────────────────────────────────────────────── */
function HookCard({ text, bmId }) {
  return (
    <div style={{ background:"linear-gradient(135deg,#1C1C1E 0%,#2C2C2E 100%)", borderRadius:"20px", padding:"36px 40px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"8px", left:"24px", fontSize:"80px", lineHeight:1, color:"#FFFFFF0D", fontFamily:"Georgia,serif", userSelect:"none" }}>"</div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
        <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"#FF9F0A", margin:0 }}>Think about this…</p>
        {bmId && <SectionStar bmId={bmId} label="Hook — Think about this" />}
      </div>
      <p style={{ fontSize:"16px", color:"#FFFFFF", lineHeight:1.8, margin:0, fontStyle:"italic", position:"relative" }}>{text}</p>
    </div>
  );
}

/* ── Plain-English card ──────────────────────────────────────────────────── */
function PlainEnglishCard({ text, bmId }) {
  return (
    <div style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(90deg,#007AFF,#5856D6)", padding:"12px 28px", display:"flex", alignItems:"center", gap:"8px" }}>
        <span>💬</span>
        <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>In Plain English</span>
        {bmId && <SectionStar bmId={bmId} label="In Plain English" xStyle={{ marginLeft:"auto" }} />}
      </div>
      <div style={{ padding:"24px 28px" }}>
        <p style={{ fontSize:"15px", color:"#1D1D1F", lineHeight:1.8, margin:0 }}>{text}</p>
      </div>
    </div>
  );
}

/* ── Real-world cards ────────────────────────────────────────────────────── */
const ANCHOR_COLORS = [
  { bg:"#EEF4FF", accent:"#007AFF" },
  { bg:"#F0FFF4", accent:"#34C759" },
  { bg:"#FFF5F0", accent:"#FF6B00" },
  { bg:"#F5F0FF", accent:"#AF52DE" },
];
function RealWorldCards({ anchors, bmId }) {
  if (!anchors?.length) return null;
  return (
    <div style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(90deg,#34C759,#30D158)", padding:"12px 28px", display:"flex", alignItems:"center", gap:"8px" }}>
        <span>🌍</span>
        <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>Real-World Examples</span>
        {bmId && <SectionStar bmId={bmId} label="Real-World Examples" xStyle={{ marginLeft:"auto" }} />}
      </div>
      <div style={{ padding:"20px 28px", display:"grid", gridTemplateColumns: anchors.length>1?"1fr 1fr":"1fr", gap:"12px" }}>
        {anchors.map((a, i) => {
          const { bg, accent } = ANCHOR_COLORS[i % ANCHOR_COLORS.length];
          return (
            <div key={i} style={{ background:bg, borderRadius:"14px", padding:"16px 18px" }}>
              <p style={{ fontSize:"13px", fontWeight:700, color:accent, marginBottom:"6px" }}>{a.scenario}</p>
              <p style={{ fontSize:"13px", color:"#3A3A3C", lineHeight:1.6, margin:0 }}>{a.explanation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Central-idea pullquote ──────────────────────────────────────────────── */
function CentralIdeaCard({ text, bmId }) {
  return (
    <div style={{ background:"linear-gradient(135deg,#EEF4FF 0%,#F0EEFF 100%)", borderRadius:"20px", padding:"32px 36px", borderLeft:"5px solid #007AFF" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
        <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"#007AFF", margin:0 }}>💡 The Central Idea</p>
        {bmId && <SectionStar bmId={bmId} label="The Central Idea" unsaved="#C7C7CC" />}
      </div>
      <p style={{ fontSize:"17px", fontWeight:600, color:"#1D1D1F", lineHeight:1.7, margin:0 }}>{text}</p>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════════════
   INTERACTIVE FEATURES (Deep mode)
══════════════════════════════════════════════════════════════════════════ */

/* ── Feature 6: Confidence ping (after each section) ────────────────────── */
function ConfidencePing({ sectionKey, value, onRate }) {
  if (value) {
    const map = { low:"😕 Still fuzzy", mid:"🤔 Kind of", high:"💪 Got it!" };
    return (
      <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"6px 0" }}>
        <div style={{ width:"6px", height:"6px", borderRadius:"50%", background: value==="high"?"#34C759":value==="mid"?"#FF9500":"#FF3B30", flexShrink:0 }} />
        <span style={{ fontSize:"12px", color:"#86868B" }}>You marked: {map[value]}</span>
        <button onClick={() => onRate(sectionKey, null)} style={{ fontSize:"11px", color:"#AEAEB2", background:"none", border:"none", cursor:"pointer", padding:0 }}>change</button>
      </div>
    );
  }
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 0", borderTop:"1px solid #F2F2F7", marginTop:"8px" }}>
      <span style={{ fontSize:"12px", color:"#AEAEB2", marginRight:"4px" }}>How clear was this?</span>
      {[["low","😕"],["mid","🤔"],["high","💪"]].map(([k, icon]) => (
        <button key={k} onClick={() => onRate(sectionKey, k)} className="ntv-btn"
          style={{ padding:"5px 12px", borderRadius:"20px", border:"1px solid #E5E5EA", background:"#FAFAFA", fontSize:"13px", cursor:"pointer" }}>
          {icon}
        </button>
      ))}
    </div>
  );
}

/* ── Feature 5: Formula blanks (MCQ fill-in) ─────────────────────────────── */
function FormulaBlanks({ formulas, state, onAnswer, bmId }) {
  if (!formulas?.length) return null;

  // Computed once — prevents choices from re-shuffling on every state change (was causing "jumping")
  const items = useMemo(() => {
    const parsed = formulas.slice(0, 6).map(f => {
      const s = typeof f === "string" ? f : JSON.stringify(f);
      const tokens = s.trim().split(/\s+/);
      const rawToken = tokens[tokens.length - 1];
      // Strip only surrounding punctuation, preserve subscripts and operators inside
      const answer = rawToken.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "") || rawToken;
      const prefix = tokens.slice(0, -1).join(" ");
      return { s, prefix, answer };
    }).filter(it => it.answer && it.prefix);

    const allAnswers = parsed.map(it => it.answer);
    return parsed.map((it, i) => {
      // Use other formulas' answers as distractors — meaningful and plausible
      const others = shuffle(allAnswers.filter((a, j) => j !== i && a !== it.answer));
      const wrongs = others.slice(0, 3);
      // Pad to 3 distractors if not enough cross-pollination options
      const fallbacks = ["none", "0", "both", "any"].filter(x => x !== it.answer && !wrongs.includes(x));
      while (wrongs.length < 3) wrongs.push(fallbacks.shift() || "—");
      return { ...it, choices: shuffle([it.answer, ...wrongs]) };
    });
  }, [formulas]); // eslint-disable-line react-hooks/exhaustive-deps

  const allCorrect = items.every((it, i) => state[i]?.correct);

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(90deg,#5856D6,#AF52DE)", padding:"12px 28px", display:"flex", alignItems:"center", gap:"8px" }}>
        <span>🧩</span>
        <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>Formula Builder</span>
        {allCorrect && <span style={{ marginLeft:"auto", fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.9)" }}>✓ All correct!</span>}
        {bmId && <SectionStar bmId={bmId} label="Formula Builder" xStyle={{ marginLeft: allCorrect ? "0" : "auto" }} />}
      </div>
      <div style={{ padding:"20px 28px", display:"flex", flexDirection:"column", gap:"16px" }}>
        <p style={{ fontSize:"13px", color:"#86868B", margin:"0 0 4px" }}>Complete each formula by choosing the missing term.</p>
        {items.map((it, i) => {
          const picked = state[i]?.picked;
          const correct = state[i]?.correct;
          return (
            <div key={i}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap", marginBottom:"10px" }}>
                <code style={{ fontSize:"16px", ...S.mono, color:"#1D1D1F", fontWeight:600 }}>{it.prefix}</code>
                {picked ? (
                  <span style={{ fontSize:"16px", ...S.mono, fontWeight:700, color: correct?"#34C759":"#FF3B30",
                    background: correct?"#F0FFF4":"#FFF0F0", padding:"4px 12px", borderRadius:"8px", border:`2px solid ${correct?"#34C759":"#FF3B30"}` }}>
                    {picked}
                    {correct ? " ✓" : ` ✗ (${it.answer})`}
                  </span>
                ) : (
                  <span style={{ fontSize:"16px", ...S.mono, color:"#AEAEB2", borderBottom:"2px dashed #AEAEB2", padding:"0 12px" }}>___</span>
                )}
              </div>
              {!picked && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                  {it.choices.map(c => (
                    <button key={c} onClick={() => onAnswer(i, c, c===it.answer)} className="ntv-btn"
                      style={{ padding:"8px 18px", borderRadius:"10px", border:"2px solid #E5E5EA", background:"#FAFAFA",
                        fontSize:"14px", ...S.mono, fontWeight:600, cursor:"pointer", color:"#1D1D1F" }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {allCorrect && (
          <div style={{ borderTop:"1px solid #F2F2F7", paddingTop:"16px", marginTop:"4px" }}>
            <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#5856D6", marginBottom:"12px" }}>
              🎉 Formulas unlocked — your reference sheet
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {formulas.map((f, i) => (
                <div key={i} style={{ background:"#F5F0FF", borderRadius:"10px", padding:"12px 16px", display:"flex", alignItems:"center", gap:"12px" }}>
                  <span style={{ width:"22px", height:"22px", borderRadius:"50%", background:"#5856D6", color:"#fff",
                    fontSize:"11px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</span>
                  <code style={{ fontSize:"15px", ...S.mono, color:"#1D1D1F", fontWeight:600 }}>
                    {typeof f === "string" ? f : JSON.stringify(f)}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Feature 4: Error hunt ───────────────────────────────────────────────── */
function ErrorHunt({ example, wrongStepIdx, misconceptionHint, onComplete, bmId }) {
  const [picked, setPicked] = useState(null);
  const rawSteps = example?.steps?.length ? example.steps
    : (example?.steps_compressed||[]).map((s,i)=>({ step_number:i+1, action:s }));

  if (!rawSteps?.length || wrongStepIdx == null) return null;

  const handlePick = (idx) => {
    if (picked != null) return;
    setPicked(idx);
    if (idx === wrongStepIdx) onComplete(true);
    else onComplete(false);
  };

  const isRevealed = picked != null;
  const gotIt = picked === wrongStepIdx;

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(90deg,#FF3B30,#FF6B6B)", padding:"12px 28px", display:"flex", alignItems:"center", gap:"8px" }}>
        <span>🕵️</span>
        <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>Error Hunt</span>
        {bmId && <SectionStar bmId={bmId} label="Error Hunt" xStyle={{ marginLeft:"auto" }} />}
      </div>
      <div style={{ padding:"20px 28px" }}>
        <p style={{ fontSize:"14px", fontWeight:600, color:"#1D1D1F", marginBottom:"4px" }}>
          {example.problem}
        </p>
        <p style={{ fontSize:"13px", color:"#86868B", marginBottom:"16px" }}>
          One step below contains a mistake. Tap to identify it.
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {rawSteps.map((step, si) => {
            const isWrong   = si === wrongStepIdx;
            const isPicked  = picked === si;
            let bg = "#F5F5F7", border = "2px solid transparent", textCol = "#1D1D1F";
            if (isRevealed) {
              if (isWrong)  { bg="#FFF5F5"; border="2px solid #FF3B30"; textCol="#FF3B30"; }
              if (!isWrong) { bg="#F0FFF4"; border="2px solid #34C759"; }
            }
            if (isPicked && !isWrong) { bg="#FFF0F0"; }
            return (
              <button key={si} onClick={() => handlePick(si)} disabled={isRevealed} className="ntv-btn"
                style={{ background:bg, border, borderRadius:"12px", padding:"12px 16px", cursor: isRevealed?"default":"pointer",
                  textAlign:"left", display:"flex", gap:"10px", alignItems:"flex-start" }}>
                <span style={{ width:"22px", height:"22px", borderRadius:"50%",
                  background: isRevealed&&isWrong?"#FF3B30": isRevealed?"#34C759":"#007AFF",
                  color:"#fff", fontSize:"11px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {isRevealed ? (isWrong ? "✗" : "✓") : si+1}
                </span>
                <div>
                  <p style={{ fontSize:"12px", color:"#86868B", margin:"3px 0 4px" }}>{step.action}</p>
                  {step.computation && (
                    <p style={{ fontSize:"15px", ...S.mono, color:textCol, fontWeight:600, margin:0 }}>
                      {isWrong && isRevealed
                        ? step._wrong_computation || step.computation
                        : step.computation}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {isRevealed && (
          <div className="ntv-pop" style={{ marginTop:"16px", background: gotIt?"#F0FFF4":"#FFF0F0",
            borderRadius:"12px", padding:"14px 18px", borderLeft:`4px solid ${gotIt?"#34C759":"#FF3B30"}` }}>
            <p style={{ fontSize:"13px", fontWeight:700, color: gotIt?"#34C759":"#FF3B30", marginBottom:"6px" }}>
              {gotIt ? "🎯 Exactly right!" : "Not quite — step " + (wrongStepIdx+1) + " was the mistake."}
            </p>
            {misconceptionHint && (
              <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>
                <strong>Why it's wrong:</strong> {misconceptionHint}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Feature 3: Active recall flip cards ─────────────────────────────────── */
function RecallCards({ cards, ratings, onRate, bmId }) {
  const [idx, setIdx]       = useState(0);
  const [flipped, setFlip]  = useState(false);

  if (!cards?.length) return null;
  const card    = cards[idx];
  const total   = cards.length;
  const rated   = Object.keys(ratings).length;
  const gotCount = Object.values(ratings).filter(Boolean).length;

  const next = () => { setFlip(false); setTimeout(() => setIdx(i => Math.min(i+1, total-1)), 200); };
  const prev = () => { setFlip(false); setTimeout(() => setIdx(i => Math.max(i-1, 0)), 200); };

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(90deg,#FF9500,#FFCC00)", padding:"12px 28px", display:"flex", alignItems:"center", gap:"8px" }}>
        <span>🃏</span>
        <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>Recall Cards</span>
        <span style={{ marginLeft:"auto", fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.9)" }}>{idx+1}/{total}</span>
        {bmId && <SectionStar bmId={bmId} label="Recall Cards" />}
      </div>
      <div style={{ padding:"24px 28px" }}>
        {/* Progress dots */}
        <div style={{ display:"flex", gap:"5px", marginBottom:"16px" }}>
          {cards.map((_,i) => (
            <div key={i} onClick={() => { setFlip(false); setTimeout(()=>setIdx(i),200); }}
              style={{ width:"8px", height:"8px", borderRadius:"50%", cursor:"pointer",
                background: ratings[i]===true?"#34C759": ratings[i]===false?"#FF3B30": i===idx?"#007AFF":"#E5E5EA" }} />
          ))}
        </div>

        {/* Card */}
        <div onClick={() => setFlip(f=>!f)} style={{ cursor:"pointer", minHeight:"120px",
          background: flipped?"#1D1D1F":"#F5F5F7", borderRadius:"16px", padding:"24px",
          transition:"background 0.3s", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase",
            color: flipped?"rgba(255,255,255,0.5)":"#86868B", marginBottom:"10px" }}>
            {flipped ? "Answer" : "Question — tap to flip"}
          </p>
          <p style={{ fontSize:"15px", fontWeight:600, color: flipped?"#FFFFFF":"#1D1D1F", lineHeight:1.6, margin:0 }}>
            {flipped ? card.answer : card.question}
          </p>
        </div>

        {/* Rate buttons (only after flip) */}
        {flipped && ratings[idx] == null && (
          <div className="ntv-in" style={{ display:"flex", gap:"10px", marginTop:"14px" }}>
            <button onClick={() => onRate(idx, false)} className="ntv-btn"
              style={{ flex:1, padding:"10px", borderRadius:"10px", border:"2px solid #FF3B30",
                background:"#FFF5F5", fontSize:"13px", fontWeight:700, cursor:"pointer", color:"#FF3B30" }}>
              ✗ Missed it
            </button>
            <button onClick={() => onRate(idx, true)} className="ntv-btn"
              style={{ flex:1, padding:"10px", borderRadius:"10px", border:"2px solid #34C759",
                background:"#F0FFF4", fontSize:"13px", fontWeight:700, cursor:"pointer", color:"#34C759" }}>
              ✓ Got it!
            </button>
          </div>
        )}
        {ratings[idx] != null && (
          <div style={{ marginTop:"10px", display:"flex", alignItems:"center", gap:"6px" }}>
            <span style={{ fontSize:"12px", color: ratings[idx]?"#34C759":"#FF3B30", fontWeight:600 }}>
              {ratings[idx] ? "✓ Marked as got it" : "✗ Marked for review"}
            </span>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"16px" }}>
          <button onClick={prev} disabled={idx===0} className="ntv-btn"
            style={{ padding:"8px 16px", borderRadius:"10px", border:"1px solid #E5E5EA",
              background: idx===0?"#F5F5F7":"#fff", color: idx===0?"#AEAEB2":"#1D1D1F",
              fontSize:"13px", fontWeight:600, cursor: idx===0?"default":"pointer" }}>
            ← Prev
          </button>
          <span style={{ fontSize:"12px", color:"#86868B" }}>{rated}/{total} rated</span>
          <button onClick={next} disabled={idx===total-1} className="ntv-btn"
            style={{ padding:"8px 16px", borderRadius:"10px", border:"1px solid #E5E5EA",
              background: idx===total-1?"#F5F5F7":"#fff", color: idx===total-1?"#AEAEB2":"#1D1D1F",
              fontSize:"13px", fontWeight:600, cursor: idx===total-1?"default":"pointer" }}>
            Next →
          </button>
        </div>

        {/* Summary when all rated */}
        {rated === total && (
          <div className="ntv-pop" style={{ marginTop:"14px", background:"#F5F5F7", borderRadius:"12px", padding:"14px 18px" }}>
            <p style={{ fontSize:"13px", fontWeight:700, color:"#1D1D1F", marginBottom:"4px" }}>
              {gotCount}/{total} correct 🎯
            </p>
            {gotCount < total && (
              <p style={{ fontSize:"12px", color:"#86868B", margin:0 }}>
                {total-gotCount} card{total-gotCount>1?"s":""} to review — go back and re-read those sections.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Feature 2: Feynman explainer ────────────────────────────────────────── */
function FeynmanBox({ concept, topicName, bmId }) {
  const [text, setText]       = useState("");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);

  const submit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const r = await evaluateExplanation(topicName, text.trim());
      setResult(r.data?.data || r.data);
    } catch {
      setResult({ feedback: "Could not evaluate — check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <button onClick={() => setOpen(o=>!o)} className="ntv-btn"
        style={{ width:"100%", background:"linear-gradient(90deg,#34C759,#32D74B)", padding:"12px 28px",
          border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:"8px", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <span>🧠</span>
          <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>Feynman Challenge</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
          {bmId && <SectionStar bmId={bmId} label="Feynman Challenge" />}
          <span style={{ fontSize:"18px", color:"rgba(255,255,255,0.8)", transform: open?"rotate(90deg)":"none", transition:"transform 0.15s" }}>›</span>
        </div>
      </button>

      {open && (
        <div style={{ padding:"20px 28px" }}>
          {!result ? (
            <>
              <p style={{ fontSize:"14px", color:"#1D1D1F", marginBottom:"6px", fontWeight:600 }}>
                Explain <em>{concept}</em> in your own words — no peeking.
              </p>
              <p style={{ fontSize:"12px", color:"#86868B", marginBottom:"12px" }}>
                Pretend you're teaching a 12-year-old. If you can explain it simply, you understand it.
              </p>
              <textarea
                value={text} onChange={e => setText(e.target.value)}
                placeholder="Type your explanation here…"
                style={{ width:"100%", minHeight:"100px", borderRadius:"10px", border:"2px solid #E5E5EA",
                  padding:"12px 14px", fontSize:"14px", color:"#1D1D1F", lineHeight:1.6, resize:"vertical",
                  fontFamily:"-apple-system,sans-serif", outline:"none", boxSizing:"border-box" }}
              />
              <button onClick={submit} disabled={!text.trim()||loading} className="ntv-btn"
                style={{ marginTop:"10px", padding:"10px 24px", borderRadius:"10px", border:"none",
                  background: text.trim()?"#34C759":"#D1D1D6", color:"#fff",
                  fontSize:"13px", fontWeight:700, cursor: text.trim()?"pointer":"default" }}>
                {loading ? "Evaluating…" : "Submit for AI Review →"}
              </button>
            </>
          ) : (
            <div className="ntv-pop">
              {result.score != null && (
                <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
                  <div style={{ width:"56px", height:"56px", borderRadius:"50%",
                    background: result.score>=7?"#F0FFF4": result.score>=4?"#FFF5F0":"#FFF0F0",
                    border:`3px solid ${result.score>=7?"#34C759": result.score>=4?"#FF9500":"#FF3B30"}`,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:"18px", fontWeight:800,
                      color: result.score>=7?"#34C759": result.score>=4?"#FF9500":"#FF3B30" }}>
                      {result.score}/10
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize:"14px", fontWeight:700, color:"#1D1D1F", margin:"0 0 2px" }}>
                      {result.score>=7?"Great explanation!": result.score>=4?"Getting there!":"Needs more work"}
                    </p>
                    <p style={{ fontSize:"12px", color:"#86868B", margin:0 }}>AI evaluation</p>
                  </div>
                </div>
              )}
              {result.feedback && (
                <div style={{ background:"#F5F5F7", borderRadius:"10px", padding:"14px 16px", marginBottom:"12px" }}>
                  <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>{result.feedback}</p>
                </div>
              )}
              {result.strong?.length > 0 && (
                <div style={{ marginBottom:"10px" }}>
                  <p style={{ fontSize:"11px", fontWeight:700, color:"#34C759", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>What you got right</p>
                  {result.strong.map((s,i) => <p key={i} style={{ fontSize:"13px", color:"#1D1D1F", margin:"0 0 4px", paddingLeft:"12px" }}>✓ {s}</p>)}
                </div>
              )}
              {result.missing?.length > 0 && (
                <div style={{ marginBottom:"12px" }}>
                  <p style={{ fontSize:"11px", fontWeight:700, color:"#FF9500", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>What to add</p>
                  {result.missing.map((m,i) => <p key={i} style={{ fontSize:"13px", color:"#1D1D1F", margin:"0 0 4px", paddingLeft:"12px" }}>→ {m}</p>)}
                </div>
              )}
              <button onClick={() => { setResult(null); setText(""); }} className="ntv-btn"
                style={{ padding:"8px 18px", borderRadius:"8px", border:"1px solid #E5E5EA",
                  background:"#fff", fontSize:"13px", fontWeight:600, cursor:"pointer", color:"#1D1D1F" }}>
                Try again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Feature 1: Interactive worked example with step prediction ──────────── */
function InteractiveWorkedExample({ ex, index, onDone, deepMode }) {
  const rawSteps = ex.steps?.length
    ? ex.steps
    : (ex.steps_compressed||[]).map((s,i) => ({ step_number:i+1, action:s }));

  const stepCount = rawSteps.length;
  // predictions: { stepIdx: 'correct'|'wrong'|null }
  const [predictions, setPredictions] = useState({});
  const [revealed, setRevealed]       = useState(0);
  const isFinal   = revealed > stepCount;
  const hasFinale = ex.verification_after || ex.lesson_from_this_example || ex.answer;

  // Build prediction choices for each step that has a computation
  const allComps = rawSteps.map(s => s.computation).filter(Boolean);

  const choicesFor = useCallback((si) => {
    const correct = rawSteps[si]?.computation;
    if (!correct) return null;
    const others = allComps.filter((_, i) => i !== si);
    const pool   = others.length >= 2 ? others : [
      // fabricate a wrong option by changing first number in correct
      correct.replace(/\d+/, n => String(parseInt(n)+1)),
      correct.replace(/\d+/, n => String(parseInt(n)+2)),
    ];
    return shuffle([correct, ...pool.slice(0,2)]);
  }, [rawSteps, allComps]);

  const needsPrediction = (si) => deepMode && !!rawSteps[si]?.computation && allComps.length >= 2;

  const advance = () => {
    const si = revealed; // about to reveal step at index `revealed`
    if (revealed < stepCount) {
      if (needsPrediction(si) && predictions[si] == null) return; // wait for prediction
      setRevealed(r => r+1);
    } else {
      setRevealed(r => r+1);
      onDone?.(index);
    }
  };

  const predict = (si, choice) => {
    const correct = rawSteps[si]?.computation === choice;
    setPredictions(p => ({ ...p, [si]: correct ? "correct" : "wrong" }));
  };

  return (
    <div style={{ border: isFinal?"2px solid #34C759":"2px solid #E5E5EA", borderRadius:"16px", overflow:"hidden", transition:"border-color 0.3s" }}>
      {/* Header */}
      <div style={{ background: isFinal?"#F0FFF4":"#F5F5F7", padding:"14px 20px", display:"flex", alignItems:"center", gap:"12px", borderBottom:"1px solid #E5E5EA" }}>
        <span style={{ width:"28px", height:"28px", borderRadius:"50%", background: isFinal?"#34C759":"#007AFF",
          color:"#fff", fontSize:"12px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          {isFinal ? "✓" : index+1}
        </span>
        <span style={{ fontSize:"13px", fontWeight:700, color: isFinal?"#34C759":"#1D1D1F" }}>
          {isFinal ? "Example complete" : `Example ${index+1}`}
        </span>
        {stepCount>0 && (
          <div style={{ display:"flex", gap:"5px", marginLeft:"auto" }}>
            {rawSteps.map((_,si) => (
              <div key={si} style={{ width:"7px", height:"7px", borderRadius:"50%",
                background: si<revealed ? (predictions[si]==="wrong"?"#FF9500":"#007AFF") : "#D1D1D6",
                transition:"background 0.2s" }} />
            ))}
            {hasFinale && <div style={{ width:"7px", height:"7px", borderRadius:"50%", background: isFinal?"#34C759":"#D1D1D6", transition:"background 0.2s" }} />}
          </div>
        )}
      </div>

      <div style={{ padding:"20px" }}>
        {/* Problem */}
        {ex.problem && (
          <div style={{ background:"#F5F5F7", borderRadius:"12px", padding:"14px 18px", marginBottom:"14px" }}>
            <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#86868B", marginBottom:"6px" }}>Problem</p>
            <p style={{ fontSize:"15px", fontWeight:600, color:"#1D1D1F", lineHeight:1.5, margin:0 }}>{ex.problem}</p>
          </div>
        )}
        {ex.thought_process_before_starting && (
          <div style={{ background:"#EEF4FF", borderRadius:"10px", padding:"12px 16px", marginBottom:"14px", borderLeft:"3px solid #007AFF" }}>
            <p style={{ fontSize:"11px", fontWeight:700, color:"#007AFF", marginBottom:"4px" }}>Strategy</p>
            <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>{ex.thought_process_before_starting}</p>
          </div>
        )}

        {/* Prediction prompt (shown before the step is revealed) */}
        {revealed < stepCount && needsPrediction(revealed) && predictions[revealed] == null && (
          <div className="ntv-pop" style={{ background:"#FFFBEB", border:"2px solid #FF9F0A", borderRadius:"12px", padding:"16px", marginBottom:"14px" }}>
            <p style={{ fontSize:"13px", fontWeight:700, color:"#FF9F0A", marginBottom:"10px" }}>
              🔮 Predict step {revealed+1} — what's the next computation?
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {choicesFor(revealed)?.map((c,ci) => (
                <button key={ci} onClick={() => predict(revealed, c)} className="ntv-btn"
                  style={{ padding:"10px 14px", borderRadius:"10px", border:"2px solid #E5E5EA",
                    background:"#fff", textAlign:"left", cursor:"pointer", fontSize:"14px", ...S.mono, fontWeight:600, color:"#1D1D1F" }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Prediction feedback */}
        {revealed < stepCount && predictions[revealed] != null && (
          <div className={predictions[revealed]==="correct" ? "ntv-pop" : "ntv-shake"}
            style={{ background: predictions[revealed]==="correct"?"#F0FFF4":"#FFF0F0",
              borderRadius:"10px", padding:"10px 14px", marginBottom:"12px",
              borderLeft:`3px solid ${predictions[revealed]==="correct"?"#34C759":"#FF3B30"}` }}>
            <span style={{ fontSize:"13px", fontWeight:700, color: predictions[revealed]==="correct"?"#34C759":"#FF3B30" }}>
              {predictions[revealed]==="correct" ? "🎯 Correct prediction!" : "✗ Not quite — see the correct step below."}
            </span>
          </div>
        )}

        {/* Revealed steps */}
        {rawSteps.slice(0, revealed).map((step, si) => (
          <div key={si} className="ntv-in" style={{ marginBottom:"12px" }}>
            <div style={{ display:"flex", gap:"12px" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2px", flexShrink:0 }}>
                <span style={{ width:"26px", height:"26px", borderRadius:"50%",
                  background: predictions[si]==="wrong"?"#FF9500":"#007AFF",
                  color:"#fff", fontSize:"11px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {step.step_number ?? si+1}
                </span>
                {si < revealed-1 && <div style={{ width:"2px", flex:1, background:"#E5E5EA", minHeight:"8px" }} />}
              </div>
              <div style={{ flex:1, paddingBottom:"8px" }}>
                <p style={{ fontSize:"12px", color:"#86868B", margin:"3px 0 6px" }}>{step.action}</p>
                {step.computation && (
                  <div style={{ background:"#F5F5F7", borderRadius:"8px", padding:"10px 14px", marginBottom:"8px" }}>
                    <p style={{ fontSize:"17px", ...S.mono, color:"#1D1D1F", margin:0, fontWeight:600 }}>{step.computation}</p>
                  </div>
                )}
                {step.students_internal_voice && (
                  <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:"8px", padding:"8px 12px", display:"flex", gap:"6px" }}>
                    <span style={{ fontSize:"14px", flexShrink:0 }}>💭</span>
                    <p style={{ fontSize:"12px", color:"#78350F", fontStyle:"italic", lineHeight:1.5, margin:0 }}>{step.students_internal_voice}</p>
                  </div>
                )}
                {step.lemma_validity_check && (
                  <p style={{ fontSize:"12px", color:"#34C759", margin:"6px 0 0", display:"flex", gap:"4px" }}>✓ {step.lemma_validity_check}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Final */}
        {isFinal && (
          <div className="ntv-in" style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {ex.verification_after && (
              <div style={{ background:"#F0FFF4", borderRadius:"10px", padding:"12px 14px", borderLeft:"3px solid #34C759" }}>
                <p style={{ fontSize:"11px", fontWeight:700, color:"#34C759", marginBottom:"4px" }}>✓ Verify</p>
                <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.5, margin:0 }}>{ex.verification_after}</p>
              </div>
            )}
            {ex.lesson_from_this_example && (
              <div style={{ background:"#EEF4FF", borderRadius:"10px", padding:"12px 14px", borderLeft:"3px solid #007AFF" }}>
                <p style={{ fontSize:"11px", fontWeight:700, color:"#007AFF", marginBottom:"4px" }}>💡 Lesson</p>
                <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.5, margin:0 }}>{ex.lesson_from_this_example}</p>
              </div>
            )}
            {ex.answer && (
              <div style={{ background:"#1D1D1F", borderRadius:"10px", padding:"12px 16px", display:"flex", alignItems:"center", gap:"12px" }}>
                <span style={{ fontSize:"11px", fontWeight:800, color:"#34C759", letterSpacing:"1px" }}>ANSWER</span>
                <p style={{ fontSize:"16px", fontWeight:700, color:"#FFFFFF", margin:0, ...S.mono }}>{ex.answer}</p>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        {!isFinal && (
          <div style={{ marginTop:"16px" }}>
            {/* If prediction needed and not yet answered, hide the advance button */}
            {!(revealed < stepCount && needsPrediction(revealed) && predictions[revealed] == null) && (
              <button onClick={advance} className="ntv-btn"
                style={{ padding:"11px 22px", borderRadius:"10px", border:"none", fontSize:"13px", fontWeight:700,
                  cursor:"pointer", transition:"all 0.15s",
                  background: revealed===0?"#007AFF": revealed<stepCount?"#EEF4FF":"#F0FFF4",
                  color:       revealed===0?"#FFFFFF": revealed<stepCount?"#007AFF":"#34C759" }}>
                {revealed===0 ? "Start Solving →"
                  : revealed<stepCount ? `Next Step (${revealed}/${stepCount}) →`
                  : "✓ Show Answer"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Confidence summary (end of page) ────────────────────────────────────── */
function ConfidenceSummary({ confidence, sections }) {
  const weak = sections.filter(s => confidence[s.key] === "low");
  const mid  = sections.filter(s => confidence[s.key] === "mid");
  const good = sections.filter(s => confidence[s.key] === "high");
  const rated = sections.filter(s => confidence[s.key]);
  if (!rated.length) return null;

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", padding:"20px 28px" }}>
      <p style={{ fontSize:"14px", fontWeight:700, color:"#1D1D1F", marginBottom:"14px" }}>📊 Your Confidence Summary</p>
      {good.length>0 && (
        <div style={{ marginBottom:"8px" }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#34C759", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>✓ Got it</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
            {good.map(s => <span key={s.key} style={{ fontSize:"12px", background:"#F0FFF4", color:"#34C759", padding:"3px 10px", borderRadius:"20px", fontWeight:600 }}>{s.label}</span>)}
          </div>
        </div>
      )}
      {mid.length>0 && (
        <div style={{ marginBottom:"8px" }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#FF9500", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>🤔 Kind of</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
            {mid.map(s => <span key={s.key} style={{ fontSize:"12px", background:"#FFF5F0", color:"#FF9500", padding:"3px 10px", borderRadius:"20px", fontWeight:600 }}>{s.label}</span>)}
          </div>
        </div>
      )}
      {weak.length>0 && (
        <div>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#FF3B30", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>😕 Still fuzzy — review these</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
            {weak.map(s => <span key={s.key} style={{ fontSize:"12px", background:"#FFF5F5", color:"#FF3B30", padding:"3px 10px", borderRadius:"20px", fontWeight:600 }}>{s.label}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Shared misconception details ────────────────────────────────────────── */
function MisconceptionDetails({ m }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginTop:"8px" }}>
      {m.why_students_fall_for_this && <p style={{ fontSize:"12px", color:"#86868B", fontStyle:"italic", margin:0 }}>Why it happens: {m.why_students_fall_for_this}</p>}
      {m.concrete_wrong_example && (
        <div style={{ background:"#FFE5E5", borderRadius:"8px", padding:"8px 12px" }}>
          <p style={{ fontSize:"10px", fontWeight:700, color:"#FF3B30", marginBottom:"2px", letterSpacing:"1px", textTransform:"uppercase" }}>Wrong example</p>
          <p style={{ fontSize:"13px", ...S.mono, color:"#1D1D1F", margin:0 }}>{m.concrete_wrong_example}</p>
        </div>
      )}
      {m.correction && (
        <div style={{ background:"#F0FFF4", borderRadius:"8px", padding:"10px 14px", borderLeft:"3px solid #34C759" }}>
          <p style={{ fontSize:"10px", fontWeight:700, color:"#34C759", marginBottom:"4px", letterSpacing:"1px", textTransform:"uppercase" }}>Correction</p>
          <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>{m.correction}</p>
        </div>
      )}
      {m.how_to_spot_mid_problem && (
        <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:"8px", padding:"8px 12px", display:"flex", gap:"6px" }}>
          <span>💡</span>
          <p style={{ fontSize:"12px", color:"#92400E", lineHeight:1.5, margin:0 }}>{m.how_to_spot_mid_problem}</p>
        </div>
      )}
    </div>
  );
}

function MisconceptionCard({ m }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius:"12px", overflow:"hidden", border:"1px solid #FFD5D5" }}>
      <button onClick={() => setOpen(o=>!o)} className="ntv-btn"
        style={{ width:"100%", background:"#FFF5F5", padding:"12px 16px", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:"10px", textAlign:"left" }}>
        <span style={{ width:"22px", height:"22px", borderRadius:"50%", background:"#FF3B30", color:"#fff", fontSize:"11px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✗</span>
        <p style={{ fontSize:"13px", fontWeight:600, color:"#FF3B30", margin:0, lineHeight:1.4, flex:1 }}>{m.wrong_idea}</p>
        <span style={{ fontSize:"12px", color:"#AEAEB2", transform: open?"rotate(90deg)":"none", transition:"transform 0.15s" }}>›</span>
      </button>
      {open && <div style={{ padding:"0 16px 14px", background:"#FFF" }}><MisconceptionDetails m={m} /></div>}
    </div>
  );
}

function MisconceptionChallenge({ m, index }) {
  const [answered, setAnswered] = useState(null);
  return (
    <div style={{ borderRadius:"14px", overflow:"hidden", border: answered==="correct"?"2px solid #34C759": answered==="wrong"?"2px solid #FF3B30":"2px solid #FFD5D5", transition:"border-color 0.2s" }}>
      <div style={{ background: answered==="correct"?"#F0FFF4": answered==="wrong"?"#FFF5F5":"#FFF5F5", padding:"12px 16px", borderBottom:"1px solid #F2F2F7", display:"flex", alignItems:"center", gap:"8px" }}>
        <span style={{ width:"22px", height:"22px", borderRadius:"50%", background:"#FF3B30", color:"#fff", fontSize:"10px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{index+1}</span>
        <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FF3B30" }}>Misconception Check</span>
        {answered && <span style={{ marginLeft:"auto", fontSize:"11px", fontWeight:700, color: answered==="correct"?"#34C759":"#FF3B30" }}>{answered==="correct"?"✓ Correct!":"✗ Wrong answer"}</span>}
      </div>
      <div style={{ padding:"16px" }}>
        <p style={{ fontSize:"13px", color:"#86868B", marginBottom:"8px" }}>Is this statement correct?</p>
        <div style={{ background:"#FFE5E5", borderRadius:"10px", padding:"14px 16px", marginBottom:"14px" }}>
          <p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.6, margin:0, fontStyle:"italic" }}>"{m.wrong_idea}"</p>
        </div>
        {!answered && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
            <button onClick={() => setAnswered("wrong")} className="ntv-btn"
              style={{ padding:"12px", borderRadius:"10px", border:"2px solid #E5E5EA", background:"#fff", fontSize:"14px", fontWeight:700, cursor:"pointer", color:"#34C759" }}>✓ Yes, correct</button>
            <button onClick={() => setAnswered("correct")} className="ntv-btn"
              style={{ padding:"12px", borderRadius:"10px", border:"2px solid #E5E5EA", background:"#fff", fontSize:"14px", fontWeight:700, cursor:"pointer", color:"#FF3B30" }}>✗ No, it's wrong</button>
          </div>
        )}
        {answered==="correct" && <div className="ntv-pop" style={{ background:"#F0FFF4", borderRadius:"10px", padding:"10px 14px", marginBottom:"10px", display:"flex", gap:"8px" }}><span>🎯</span><span style={{ fontSize:"13px", fontWeight:700, color:"#34C759" }}>Correct! That's a common misconception.</span></div>}
        {answered==="wrong"   && <div className="ntv-pop" style={{ background:"#FFF0F0", borderRadius:"10px", padding:"10px 14px", marginBottom:"10px", display:"flex", gap:"8px" }}><span>🤔</span><span style={{ fontSize:"13px", fontWeight:700, color:"#FF3B30" }}>Actually, that statement is wrong.</span></div>}
        {answered && <MisconceptionDetails m={m} />}
      </div>
    </div>
  );
}

function SciMisconceptionChallenge({ text, index }) {
  const [answered, setAnswered] = useState(null);
  return (
    <div style={{ borderRadius:"14px", overflow:"hidden", border: answered==="correct"?"2px solid #34C759": answered==="wrong"?"2px solid #FF3B30":"2px solid #FFD5D5", transition:"border-color 0.2s" }}>
      <div style={{ background: answered==="correct"?"#F0FFF4": answered==="wrong"?"#FFF5F5":"#FFF5F5", padding:"12px 16px", borderBottom:"1px solid #F2F2F7", display:"flex", alignItems:"center", gap:"8px" }}>
        <span style={{ width:"22px", height:"22px", borderRadius:"50%", background:"#FF3B30", color:"#fff", fontSize:"10px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{index+1}</span>
        <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FF3B30" }}>Misconception Check</span>
        {answered && <span style={{ marginLeft:"auto", fontSize:"11px", fontWeight:700, color: answered==="correct"?"#34C759":"#FF3B30" }}>{answered==="correct"?"✓ Correct!":"✗ Wrong answer"}</span>}
      </div>
      <div style={{ padding:"16px" }}>
        <p style={{ fontSize:"13px", color:"#86868B", marginBottom:"8px" }}>Is this statement a misconception (false belief)?</p>
        <div style={{ background:"#FFE5E5", borderRadius:"10px", padding:"14px 16px", marginBottom:"14px" }}>
          <p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.6, margin:0, fontStyle:"italic" }}>"{text}"</p>
        </div>
        {!answered && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
            <button onClick={() => setAnswered("correct")} className="ntv-btn"
              style={{ padding:"12px", borderRadius:"10px", border:"2px solid #E5E5EA", background:"#fff", fontSize:"14px", fontWeight:700, cursor:"pointer", color:"#34C759" }}>✓ Yes, it's wrong</button>
            <button onClick={() => setAnswered("wrong")} className="ntv-btn"
              style={{ padding:"12px", borderRadius:"10px", border:"2px solid #E5E5EA", background:"#fff", fontSize:"14px", fontWeight:700, cursor:"pointer", color:"#FF3B30" }}>✗ No, it's correct</button>
          </div>
        )}
        {answered==="correct" && <div className="ntv-pop" style={{ background:"#F0FFF4", borderRadius:"10px", padding:"10px 14px", display:"flex", gap:"8px" }}><span>🎯</span><span style={{ fontSize:"13px", fontWeight:700, color:"#34C759" }}>Right! This is a classic misconception to watch out for.</span></div>}
        {answered==="wrong"   && <div className="ntv-pop" style={{ background:"#FFF0F0", borderRadius:"10px", padding:"10px 14px", display:"flex", gap:"8px" }}><span>🤔</span><span style={{ fontSize:"13px", fontWeight:700, color:"#FF3B30" }}>Actually, this is a misconception — don't be tricked by it!</span></div>}
      </div>
    </div>
  );
}

function SectionCheckpoint({ misconception, onPass, bmId }) {
  const [answered, setAnswered] = useState(null);
  if (answered==="correct") return (
    <div className="ntv-pop" style={{ background:"linear-gradient(135deg,#F0FFF4,#E8F9EE)", borderRadius:"16px", padding:"20px 24px", border:"2px solid #34C759", display:"flex", gap:"14px", alignItems:"center" }}>
      <div style={{ width:"40px", height:"40px", borderRadius:"50%", background:"#34C759", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><span style={{ fontSize:"18px" }}>✓</span></div>
      <div><p style={{ fontSize:"14px", fontWeight:700, color:"#34C759", margin:"0 0 2px" }}>Knowledge check passed!</p><p style={{ fontSize:"12px", color:"#86868B", margin:0 }}>Worked examples unlocked.</p></div>
    </div>
  );
  return (
    <div style={{ background:"linear-gradient(135deg,#FFFBEB,#FFF7E6)", borderRadius:"18px", padding:"24px", border:"2px solid #FF9F0A" }}>
      <div style={{ display:"flex", gap:"10px", alignItems:"flex-start", marginBottom:"16px" }}>
        <span style={{ fontSize:"20px" }}>🔒</span>
        <div style={{ flex:1 }}><p style={{ fontSize:"13px", fontWeight:700, color:"#FF9F0A", margin:0 }}>Quick Knowledge Check</p><p style={{ fontSize:"12px", color:"#86868B", margin:0 }}>Answer correctly to unlock worked examples</p></div>
        {bmId && <SectionStar bmId={bmId} label="Knowledge Checkpoint" unsaved="#C7C7CC" />}
      </div>
      <p style={{ fontSize:"14px", fontWeight:600, color:"#1D1D1F", marginBottom:"12px" }}>Is this statement correct?</p>
      <div style={{ background:"#FFFFFF", borderRadius:"10px", padding:"14px 18px", marginBottom:"14px", border:"1px solid #FDE68A" }}>
        <p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.6, margin:0, fontStyle:"italic" }}>"{misconception.wrong_idea}"</p>
      </div>
      {!answered && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
          <button onClick={() => setAnswered("wrong")} className="ntv-btn"
            style={{ padding:"12px", borderRadius:"10px", border:"2px solid #E5E5EA", background:"#fff", fontSize:"14px", fontWeight:700, cursor:"pointer", color:"#34C759" }}>✓ Yes, correct</button>
          <button onClick={() => { setAnswered("correct"); setTimeout(onPass,900); }} className="ntv-btn"
            style={{ padding:"12px", borderRadius:"10px", border:"2px solid #E5E5EA", background:"#fff", fontSize:"14px", fontWeight:700, cursor:"pointer", color:"#FF3B30" }}>✗ No, it's wrong</button>
        </div>
      )}
      {answered==="wrong" && (
        <div className="ntv-pop" style={{ background:"#FFF5F0", borderRadius:"10px", padding:"12px 16px", border:"1px solid #FFD5A0" }}>
          <p style={{ fontSize:"13px", fontWeight:700, color:"#FF9500", marginBottom:"6px" }}>Not quite! Review "In Plain English" above.</p>
          <button onClick={() => setAnswered(null)} className="ntv-btn"
            style={{ background:"#FF9500", color:"#fff", border:"none", borderRadius:"8px", padding:"8px 18px", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>Try Again</button>
        </div>
      )}
    </div>
  );
}

/* ── Aha reveal card ────────────────────────────────────────────────────── */
function AhaRevealCard({ text, bmId }) {
  return (
    <div style={{ background:"linear-gradient(135deg,#1C1C1E 0%,#2C1D3E 100%)", borderRadius:"20px", padding:"32px 36px", borderLeft:"5px solid #BF5AF2" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
        <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"#BF5AF2", margin:0 }}>🔑 The Aha Moment</p>
        {bmId && <SectionStar bmId={bmId} label="The Aha Moment" />}
      </div>
      <p style={{ fontSize:"16px", color:"#FFFFFF", lineHeight:1.8, margin:0 }}>{text}</p>
    </div>
  );
}

/* ── Visual description toggle (under each diagram) ─────────────────────── */
function VisualDescToggle({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop:"12px", borderTop:"1px solid #F2F2F7", paddingTop:"8px" }}>
      <button onClick={() => setOpen(o=>!o)} className="ntv-btn"
        style={{ background:"none", border:"none", cursor:"pointer", fontSize:"11px", color:"#AEAEB2", padding:0, display:"flex", alignItems:"center", gap:"4px" }}>
        📝 Text description {open ? "▲" : "▼"}
      </button>
      {open && <p style={{ fontSize:"12px", color:"#86868B", lineHeight:1.7, marginTop:"8px", margin:"8px 0 0" }}>{text}</p>}
    </div>
  );
}

/* ── Video player ────────────────────────────────────────────────────────── */
function VideoPlayer({ topicName, subject, bmId }) {
  const query      = encodeURIComponent(`NCERT Class 10 ${subject} ${topicName} explained`);
  const searchUrl  = `https://www.youtube.com/results?search_query=${query}`;
  const embedQuery = encodeURIComponent(`${topicName} CBSE Class 10`);
  const embedUrl   = `https://www.youtube.com/embed?listType=search&list=${embedQuery}&autoplay=0`;
  return (
    <div style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(90deg,#FF0000,#CC0000)", padding:"12px 28px", display:"flex", alignItems:"center", gap:"8px" }}>
        <span>▶️</span>
        <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>Video Lesson</span>
        {bmId && <SectionStar bmId={bmId} label="Video Lesson" xStyle={{ marginLeft:"auto" }} />}
      </div>
      <div style={{ padding:"20px 28px" }}>
        <div style={{ position:"relative", paddingBottom:"56.25%", height:0, borderRadius:"12px", overflow:"hidden", background:"#000" }}>
          <iframe
            src={embedUrl}
            title={`${topicName} video lesson`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none" }}
          />
        </div>
        <p style={{ fontSize:"12px", color:"#86868B", marginTop:"10px", textAlign:"center" }}>
          Can't see the video?{" "}
          <a href={searchUrl} target="_blank" rel="noopener noreferrer" style={{ color:"#007AFF" }}>
            Search YouTube for "{topicName}" →
          </a>
        </p>
      </div>
    </div>
  );
}

/* ── Closing challenge ───────────────────────────────────────────────────── */
function ClosingChallenge({ question, hint, bmId }) {
  const [shown, setShown] = useState(false);
  if (!question) return null;
  return (
    <div style={{ background:"linear-gradient(135deg,#FFFBEB,#FFF7E6)", borderRadius:"18px", padding:"24px 28px", border:"2px solid #FF9F0A" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
        <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"#FF9F0A", margin:0 }}>⚡ Challenge Before You Go</p>
        {bmId && <SectionStar bmId={bmId} label="Challenge Before You Go" unsaved="#C7C7CC" />}
      </div>
      <p style={{ fontSize:"15px", fontWeight:600, color:"#1D1D1F", lineHeight:1.6, margin:"0 0 16px" }}>{question}</p>
      {!shown ? (
        <button onClick={() => setShown(true)} className="ntv-btn"
          style={{ padding:"10px 22px", borderRadius:"10px", border:"2px solid #FF9F0A", background:"transparent",
            color:"#FF9F0A", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>
          Show hint
        </button>
      ) : hint ? (
        <div className="ntv-pop" style={{ background:"#FFFFFF", borderRadius:"10px", padding:"12px 16px", border:"1px solid #FDE68A" }}>
          <p style={{ fontSize:"13px", color:"#3A3A3C", lineHeight:1.6, margin:0 }}>{hint}</p>
        </div>
      ) : null}
    </div>
  );
}

/* ── Topic nav bar ───────────────────────────────────────────────────────── */
function TopicNavBar({ prev, next, studied, onToggle, onNavigate, engagement }) {
  const truncate = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    return words.length > 5 ? words.slice(0,5).join(" ") + "…" : name;
  };
  const canStudy = studied || !engagement || engagement.isReady;
  const minsLeft  = engagement ? Math.max(0, 5 - Math.floor(engagement.activeSeconds / 60)) : 0;
  const scrollLeft = engagement ? Math.max(0, 80 - engagement.scrollPct) : 0;
  const sectionsLeft = engagement ? Math.max(0, 2 - engagement.sectionsViewed) : 0;
  const needsNote = engagement ? !engagement.noteApproved : false;
  const tooltip = canStudy
    ? (studied ? "Click to unmark" : "You've studied enough — click to mark as done")
    : `Need ${minsLeft > 0 ? `${minsLeft} more min · ` : ""}${scrollLeft > 0 ? `${scrollLeft}% more scroll · ` : ""}${sectionsLeft > 0 ? `${sectionsLeft} more section${sectionsLeft > 1 ? "s" : ""} · ` : ""}${needsNote ? "submit your note for AI to approve" : ""}`.replace(/ · $/, "").replace(/^Need $/, "Need engagement");
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
      <button onClick={() => prev && onNavigate(prev.topicId)} disabled={!prev} className="ntv-btn"
        style={{ padding:"8px 14px", borderRadius:"10px", border:"1px solid #E5E5EA",
          background: prev?"#fff":"#F5F5F7", color: prev?"#1D1D1F":"#AEAEB2",
          fontSize:"12px", fontWeight:600, cursor: prev?"pointer":"default", maxWidth:"180px",
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        ‹ {prev ? truncate(prev.name) : "First topic"}
      </button>
      <div style={{ flex:1 }} />
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", flexShrink:0 }}>
        <button
          onClick={canStudy ? onToggle : undefined}
          disabled={!canStudy}
          title={tooltip}
          className="ntv-btn"
          style={{ padding:"8px 18px", borderRadius:"10px",
            border:`2px solid ${studied?"#34C759":canStudy?"#1c1c1e":"#E5E5EA"}`,
            background: studied?"#F0FFF4":canStudy?"#1c1c1e":"#F5F5F7",
            color: studied?"#34C759":canStudy?"#fff":"#AEAEB2",
            fontSize:"13px", fontWeight:700,
            cursor: canStudy ? "pointer" : "not-allowed",
            opacity: canStudy ? 1 : 0.65,
            transition: "all 0.2s" }}>
          {studied ? "✓ Studied" : canStudy ? "Mark as studied" : "Keep reading…"}
        </button>
        {!studied && engagement && !engagement.isReady && (
          <div style={{ display:"flex", gap:"6px", fontSize:"9px", fontWeight:600, color:"#8E8E93", fontFamily:"ui-monospace, monospace", flexWrap:"wrap", justifyContent:"center" }}>
            <span style={{ color: engagement.activeSeconds >= ENGAGE_MIN_SECONDS ? "#34C759" : "#8E8E93" }}>
              {Math.floor(engagement.activeSeconds / 60)}:{String(engagement.activeSeconds % 60).padStart(2, "0")} / 5:00
            </span>
            <span>·</span>
            <span style={{ color: engagement.scrollPct >= ENGAGE_MIN_SCROLL ? "#34C759" : "#8E8E93" }}>
              {engagement.scrollPct}% / 80%
            </span>
            <span>·</span>
            <span style={{ color: engagement.sectionsViewed >= ENGAGE_MIN_SECTIONS ? "#34C759" : "#8E8E93" }}>
              {engagement.sectionsViewed}/2 sections
            </span>
            <span>·</span>
            <span style={{ color: engagement.noteApproved ? "#34C759" : "#8E8E93" }}>
              {engagement.noteApproved ? `note ✓ ${engagement.noteScore}` : "note pending"}
            </span>
          </div>
        )}
      </div>
      <div style={{ flex:1 }} />
      <button onClick={() => next && onNavigate(next.topicId)} disabled={!next} className="ntv-btn"
        style={{ padding:"8px 14px", borderRadius:"10px", border:"1px solid #E5E5EA",
          background: next?"#fff":"#F5F5F7", color: next?"#1D1D1F":"#AEAEB2",
          fontSize:"12px", fontWeight:600, cursor: next?"pointer":"default", maxWidth:"180px",
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        {next ? truncate(next.name) : "Last topic"} ›
      </button>
    </div>
  );
}

function DerivationPart({ label, val }) {
  if (!val) return null;
  if (typeof val==="string") return (
    <div><p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#86868B", marginBottom:"6px" }}>{label}</p><p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.7 }}>{val}</p></div>
  );
  return (
    <div style={{ background:"#F5F5F7", borderRadius:"12px", padding:"16px 20px" }}>
      <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#86868B", marginBottom:"12px" }}>{label}</p>
      {val.claim       && <div style={{ marginBottom:"10px" }}><p style={{ fontSize:"12px", fontWeight:700, color:"#007AFF", marginBottom:"4px" }}>Claim</p><p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.7, fontStyle:"italic" }}>{val.claim}</p></div>}
      {val.proof_walkthrough && <div style={{ marginBottom:"10px" }}><p style={{ fontSize:"12px", fontWeight:700, color:"#86868B", marginBottom:"4px" }}>Proof</p><p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.7 }}>{val.proof_walkthrough}</p></div>}
      {val.concrete_example  && <div style={{ background:"#EEF4FF", borderRadius:"8px", padding:"10px 14px", marginBottom:"10px" }}><p style={{ fontSize:"12px", fontWeight:700, color:"#007AFF", marginBottom:"4px" }}>Concrete Example</p><p style={{ fontSize:"13px", ...S.mono, color:"#1D1D1F", lineHeight:1.6 }}>{val.concrete_example}</p></div>}
      {val.key_insight  && <div style={{ borderLeft:"3px solid #007AFF", paddingLeft:"12px", marginBottom:"8px" }}><p style={{ fontSize:"13px", fontWeight:700, color:"#007AFF", margin:0 }}>{val.key_insight}</p></div>}
      {val.why_this_matters && <p style={{ fontSize:"13px", color:"#86868B", fontStyle:"italic", margin:0 }}>{val.why_this_matters}</p>}
    </div>
  );
}

/* ── Topic Note + AI evaluator ──────────────────────────────────────────── */
function TopicNote({ topicId, topicName, bmId }) {
  const [text,      setText]      = useState("");
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [feedback,  setFeedback]  = useState(null);  // AI evaluation result
  const [evaling,   setEvaling]   = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!topicId) return;
    getNcertNote(topicId)
      .then(r => setText(r.data?.data?.text || ""))
      .catch(() => {});
  }, [topicId]);

  const handleChange = (e) => {
    setText(e.target.value);
    setSaved(false);
    setFeedback(null);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSaving(true);
      saveNcertNote(topicId, e.target.value)
        .then(() => { setSaved(true); setSaving(false); })
        .catch(() => setSaving(false));
    }, 1500);
  };

  const handleEvaluate = async () => {
    if (!text.trim() || evaling) return;
    setEvaling(true); setFeedback(null);
    try {
      const r = await evaluateExplanation(topicName, text);
      const result = r.data?.data || r.data;
      setFeedback(result);
      // Notify the engagement hook: a score ≥ 70 counts as "AI-approved understanding"
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("engagement:note-approved", {
          detail: { topicId, score: result?.score ?? 0 },
        }));
      }
    } catch { setFeedback({ error: true }); }
    finally { setEvaling(false); }
  };

  const score = feedback?.score ?? null;
  const scoreColor = score >= 80 ? "#34C759" : score >= 50 ? "#FF9500" : "#FF3B30";

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", padding:"24px 28px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
        <div>
          <h2 style={{ fontSize:"16px", fontWeight:700, color:"#1D1D1F", margin:0, display:"flex", alignItems:"center", gap:"8px" }}>📝 My Notes {bmId && <SectionStar bmId={bmId} label="My Notes" unsaved="#C7C7CC" />}</h2>
          <p style={{ fontSize:"12px", color:"#AEAEB2", margin:"3px 0 0" }}>
            Write your own explanation — AI will grade it
          </p>
        </div>
        <span style={{ fontSize:"11px", color: saving?"#FF9500":saved?"#34C759":"#AEAEB2", fontWeight:600 }}>
          {saving ? "Saving…" : saved ? "Saved ✓" : ""}
        </span>
      </div>

      <textarea
        value={text}
        onChange={handleChange}
        placeholder={`Explain "${topicName}" in your own words…`}
        style={{ width:"100%", minHeight:"120px", padding:"12px 14px", borderRadius:"12px",
          border:"1.5px solid #E5E5EA", fontSize:"14px", lineHeight:1.6, color:"#1D1D1F",
          background:"#FAFAFA", resize:"vertical", fontFamily:"inherit", boxSizing:"border-box",
          outline:"none" }}
        onFocus={e => e.target.style.borderColor = "#007AFF"}
        onBlur={e => e.target.style.borderColor = "#E5E5EA"}
      />

      <button onClick={handleEvaluate} disabled={!text.trim() || evaling} className="ntv-btn"
        style={{ marginTop:"10px", width:"100%", padding:"11px", borderRadius:"11px", border:"none",
          background: text.trim() ? "#5856D6" : "#F2F2F7",
          color: text.trim() ? "#fff" : "#AEAEB2",
          fontWeight:700, fontSize:"13px", cursor: text.trim()?"pointer":"default" }}>
        {evaling ? "Evaluating…" : "Evaluate with AI →"}
      </button>

      {feedback && !feedback.error && (
        <div style={{ marginTop:"14px", background:"#F9F9FF", borderRadius:"14px", padding:"16px 18px",
          border:`1.5px solid ${scoreColor}33` }}>
          {score !== null && (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
                <span style={{ fontSize:"24px", fontWeight:800, color:scoreColor }}>{score}</span>
                <span style={{ fontSize:"12px", color:"#86868B" }}>/ 100</span>
                <div style={{ flex:1, height:"6px", background:"#E5E5EA", borderRadius:"3px", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${score}%`, background:scoreColor, borderRadius:"3px", transition:"width 0.5s ease" }} />
                </div>
                {score >= NOTE_APPROVAL_MIN ? (
                  <span style={{ fontSize:"10px", fontWeight:700, color:"#34C759", letterSpacing:"0.1em", textTransform:"uppercase", padding:"3px 8px", borderRadius:999, background:"#E8F9EE" }}>✓ AI Approved</span>
                ) : (
                  <span style={{ fontSize:"10px", fontWeight:700, color:"#FF9500", letterSpacing:"0.1em", textTransform:"uppercase", padding:"3px 8px", borderRadius:999, background:"#FFF4E0" }}>Read again</span>
                )}
              </div>
              {score < NOTE_APPROVAL_MIN && (
                <p style={{ fontSize:"12px", color:"#FF9500", fontWeight:600, margin:"0 0 8px", lineHeight:1.5 }}>
                  Your explanation needs work — re-read the topic and rewrite, then re-evaluate. You need {NOTE_APPROVAL_MIN}/100 to unlock "Mark as studied".
                </p>
              )}
            </>
          )}
          {feedback.feedback && (
            <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.7, margin:0 }}>{feedback.feedback}</p>
          )}
          {feedback.missing?.length > 0 && (
            <div style={{ marginTop:"10px" }}>
              <p style={{ fontSize:"11px", fontWeight:700, color:"#FF9500", margin:"0 0 6px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Could add:</p>
              <ul style={{ margin:0, paddingLeft:"16px" }}>
                {feedback.missing.map((m, i) => (
                  <li key={i} style={{ fontSize:"12px", color:"#3A3A3C", lineHeight:1.6 }}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {feedback?.error && (
        <p style={{ fontSize:"12px", color:"#FF3B30", marginTop:"8px", textAlign:"center" }}>
          Evaluation failed — try again.
        </p>
      )}
    </div>
  );
}

/* ── Mastery Practice widget ─────────────────────────────────────────────── */
function MasteryPractice({ topicId, topicName, bmId }) {
  const [mastery,   setMastery]   = useState(null);
  const [phase,     setPhase]     = useState("idle"); // idle | loading | question | revealed | error
  const [question,  setQuestion]  = useState(null);
  const [selected,  setSelected]  = useState(null);  // option index
  const [result,    setResult]    = useState(null);
  const [errMsg,    setErrMsg]    = useState(null);
  const startRef = useRef(null);

  const syncMasteryLS = (data) => {
    if (!data?.mastery) return;
    const m = data.mastery;
    if (m.easy && m.medium && m.hard) {
      try {
        const ls = JSON.parse(localStorage.getItem("stellar_mastery") || "{}");
        ls[topicId] = true;
        localStorage.setItem("stellar_mastery", JSON.stringify(ls));
      } catch {}
    }
  };

  useEffect(() => {
    if (!topicId) return;
    getTopicMastery(topicId).then(r => { setMastery(r.data); syncMasteryLS(r.data); }).catch(() => {});
  }, [topicId]);

  // For Science topics (sci_*) topicId is passed — adaptiveService falls back to Question.topicId field.
  // For Math topics topicId IS the topic name string — both paths work correctly.
  const loadQuestion = async (preloaded) => {
    if (preloaded?.questionText) {
      setQuestion(preloaded); setSelected(null); setResult(null); setErrMsg(null);
      startRef.current = Date.now(); setPhase("question"); return;
    }
    setPhase("loading"); setQuestion(null); setSelected(null); setResult(null); setErrMsg(null);
    try {
      const r = await startTopic(topicId);
      // startTopic returns question directly as r.data (no wrapper object)
      const q = r.data?.questionText ? r.data
              : r.data?.question?.questionText ? r.data.question  // foundation redirect shape
              : null;
      if (!q) { setPhase("error"); setErrMsg("No questions available for this topic yet."); return; }
      setQuestion(q);
      startRef.current = Date.now();
      setPhase("question");
    } catch (e) {
      const msg = e?.response?.data?.error || "No questions available for this topic yet.";
      setErrMsg(msg); setPhase("error");
    }
  };

  const handlePick = async (idx) => {
    if (phase !== "question" || selected !== null) return;
    setSelected(idx);
    const timeTaken = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
    try {
      // submitAnswer needs no sessionId — session is keyed by userId in Redis
      const r = await submitAnswer({ selectedOptionIndex: idx, timeTaken });
      const res = r.data;
      setResult(res);
      setPhase("revealed");
      // record to adaptive recommender only if question has a fine-grained questionId
      if (topicId && question?.questionId) {
        recordAdaptiveAttempt({
          topicId, questionId: question.questionId,
          correct: !!res?.isCorrect, timeSec: timeTaken, selectedOptionIndex: idx,
        }).then(() => getTopicMastery(topicId).then(m => { setMastery(m.data); syncMasteryLS(m.data); }).catch(() => {}))
          .catch(() => {});
      }
    } catch { setPhase("revealed"); }
  };

  const DIFF_COLOR = { easy:"#34C759", medium:"#FF9500", hard:"#FF3B30" };
  const mastered  = mastery?.mastery ?? { easy:false, medium:false, hard:false };
  const cur       = mastery?.currentDifficulty ?? "easy";
  const attempts  = mastery?.totalAttempts ?? 0;
  const explanation = result?.aiExplanation || result?.doubtInsight || null;

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(135deg,#007AFF 0%,#5856D6 100%)", padding:"20px 24px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
          <p style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1px", color:"rgba(255,255,255,0.7)", margin:0 }}>ADAPTIVE PRACTICE</p>
          {bmId && <SectionStar bmId={bmId} label="Adaptive Practice" />}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          {["easy","medium","hard"].map(d => (
            <div key={d} style={{ display:"flex", alignItems:"center", gap:"4px" }}>
              <span style={{ width:"10px", height:"10px", borderRadius:"50%",
                background: mastered[d] ? "#34C759" : d===cur ? DIFF_COLOR[d] : "rgba(255,255,255,0.25)",
                border: !mastered[d] && d!==cur ? "1.5px solid rgba(255,255,255,0.4)" : "none",
                flexShrink:0 }} />
              <span style={{ fontSize:"11px", color: mastered[d]||d===cur ? "#fff" : "rgba(255,255,255,0.5)", fontWeight:600, textTransform:"capitalize" }}>{d}</span>
            </div>
          ))}
          {attempts > 0 && <span style={{ marginLeft:"auto", fontSize:"11px", color:"rgba(255,255,255,0.6)" }}>{attempts} attempt{attempts!==1?"s":""}</span>}
        </div>
      </div>

      <div style={{ padding:"20px 24px" }}>
        {(mastered.easy && mastered.medium && mastered.hard) ? (
          <p style={{ fontSize:"14px", fontWeight:700, color:"#34C759", textAlign:"center", margin:0 }}>
            ✓ Topic fully mastered — all difficulties cleared!
          </p>
        ) : phase === "idle" ? (
          <button onClick={() => loadQuestion(null)} className="ntv-btn"
            style={{ width:"100%", background:DIFF_COLOR[cur]||"#007AFF", color:"#fff", fontWeight:800,
              fontSize:"14px", padding:"13px", borderRadius:"12px", border:"none", cursor:"pointer" }}>
            Try a {cur} question →
          </button>
        ) : phase === "loading" ? (
          <div style={{ textAlign:"center", color:"#AEAEB2", padding:"8px 0" }}>Loading question…</div>
        ) : phase === "error" ? (
          <p style={{ fontSize:"13px", color:"#FF3B30", textAlign:"center", margin:0 }}>{errMsg}</p>
        ) : question ? (
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            <p style={{ fontSize:"14px", fontWeight:600, color:"#1D1D1F", lineHeight:1.6, margin:0 }}>{question.questionText}</p>
            {!(question.options?.length) && phase === "question" && (
              <button onClick={() => loadQuestion(null)} className="ntv-btn"
                style={{ background:"#F5F5F7", color:"#AEAEB2", fontWeight:700, fontSize:"13px",
                  padding:"10px", borderRadius:"10px", border:"1.5px solid #E5E5EA", cursor:"pointer" }}>
                Skip →
              </button>
            )}
            <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
              {(question.options||[]).map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect  = result?.correctOptionIndex === i;
                const isWrong    = phase==="revealed" && isSelected && !result?.isCorrect;
                const bg     = phase==="revealed" ? (isCorrect ? "#F0FFF4" : isWrong ? "#FFF5F5" : "#FAFAFA") : isSelected ? "#EEF4FF" : "#F5F5F7";
                const border = phase==="revealed" ? (isCorrect ? "#34C759" : isWrong ? "#FF3B30" : "#E5E5EA") : isSelected ? "#007AFF" : "#E5E5EA";
                return (
                  <button key={i} onClick={() => handlePick(i)} disabled={phase==="revealed"}
                    className="ntv-btn"
                    style={{ textAlign:"left", padding:"10px 14px", borderRadius:"10px", border:`1.5px solid ${border}`,
                      background:bg, fontSize:"13px", color:"#1D1D1F", cursor:phase==="revealed"?"default":"pointer" }}>
                    <span style={{ fontWeight:700, marginRight:"8px", color:"#AEAEB2" }}>{String.fromCharCode(65+i)}.</span>
                    {opt.text}
                    {phase==="revealed" && isCorrect && <span style={{ float:"right", color:"#34C759", fontWeight:700 }}>✓</span>}
                    {phase==="revealed" && isWrong   && <span style={{ float:"right", color:"#FF3B30", fontWeight:700 }}>✗</span>}
                  </button>
                );
              })}
            </div>
            {phase==="revealed" && (
              <div style={{ background:result?.isCorrect?"#F0FFF4":"#FFF5F5", borderRadius:"10px", padding:"10px 14px",
                borderLeft:`3px solid ${result?.isCorrect?"#34C759":"#FF3B30"}` }}>
                <p style={{ fontSize:"13px", fontWeight:700, color:result?.isCorrect?"#34C759":"#FF3B30", margin:"0 0 4px" }}>
                  {result?.isCorrect ? "Correct!" : "Not quite"}
                </p>
                {explanation && <p style={{ fontSize:"12px", color:"#3A3A3C", lineHeight:1.6, margin:0 }}>{explanation}</p>}
              </div>
            )}
            {phase==="revealed" && (
              <button onClick={() => loadQuestion(result?.nextQuestion || null)} className="ntv-btn"
                style={{ background:"#F5F5F7", color:"#1D1D1F", fontWeight:700, fontSize:"13px",
                  padding:"10px", borderRadius:"10px", border:"none", cursor:"pointer" }}>
                Next question →
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ── Paper Practice widget ───────────────────────────────────────────────── */
const DIFF_PILL = { easy: { bg:"#E8F9EE", color:"#34C759" }, medium: { bg:"#FFF4E0", color:"#FF9500" }, hard: { bg:"#FFE5E5", color:"#FF3B30" } };
const TYPE_LABEL = { free_text:"Written", numeric:"Numeric", numeric_range:"Numeric range", fill_blank:"Fill in the blank" };

function PaperPracticeCard({ q, index }) {
  const [revealed, setRevealed] = useState(false);
  const [mark, setMark]         = useState(null); // "got" | "retry"
  const diff = DIFF_PILL[q.difficulty] || DIFF_PILL.medium;
  const steps = q.stepByStep?.length ? q.stepByStep.map(s => s.clean).filter(Boolean)
              : q.solutionSteps?.length ? q.solutionSteps
              : q.correctAnswer ? [q.correctAnswer] : [];

  return (
    <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #E5E5EA", overflow:"hidden", marginBottom:"10px",
      opacity: mark === "got" ? 0.6 : 1, transition:"opacity 0.2s" }}>
      {/* Question */}
      <div style={{ padding:"16px 20px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:"10px" }}>
          <span style={{ fontSize:"11px", fontFamily:"ui-monospace,monospace", color:"#86868B", marginTop:"2px", flexShrink:0, minWidth:"22px" }}>
            Q{index+1}
          </span>
          <p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.65, flex:1, margin:0 }}>{q.questionText}</p>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"10px", marginLeft:"32px" }}>
          <span style={{ fontSize:"11px", fontWeight:600, padding:"2px 10px", borderRadius:"20px", background:diff.bg, color:diff.color }}>{q.difficulty}</span>
          {q.marks && <span style={{ fontSize:"11px", color:"#86868B", padding:"2px 8px", background:"#F5F5F7", borderRadius:"20px" }}>{q.marks} mark{q.marks>1?"s":""}</span>}
          <span style={{ fontSize:"11px", color:"#86868B", padding:"2px 8px", background:"#F5F5F7", borderRadius:"20px" }}>{TYPE_LABEL[q.questionType] || q.questionType}</span>
          {q.expectedTime && <span style={{ fontSize:"11px", color:"#86868B", padding:"2px 8px", background:"#F5F5F7", borderRadius:"20px" }}>~{q.expectedTime}s</span>}
        </div>
      </div>

      {/* Show answer toggle */}
      <button onClick={() => setRevealed(r => !r)}
        style={{ width:"100%", padding:"10px 20px", background: revealed ? "#F5F5F7":"transparent",
          display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", border:"none", borderTop:"1px solid #F5F5F7" }}>
        <span style={{ fontSize:"12px", fontWeight:600, color:"#007AFF" }}>{revealed ? "Hide Answer" : "Show Answer"}</span>
        <span style={{ color:"#007AFF", fontSize:"14px", transform: revealed ? "rotate(90deg)":"rotate(0deg)", transition:"transform 0.15s" }}>›</span>
      </button>

      {revealed && (
        <div style={{ padding:"14px 20px 16px", background:"#F9F9FB", borderTop:"1px solid #E5E5EA" }}>
          {steps.length ? (
            <ol style={{ margin:0, paddingLeft:"18px" }}>
              {steps.map((s,i) => (
                <li key={i} style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.7, marginBottom: i<steps.length-1?"6px":0 }}>{s}</li>
              ))}
            </ol>
          ) : (
            <p style={{ fontSize:"13px", color:"#86868B", margin:0 }}>No answer available.</p>
          )}
          {/* Mark as got it / try again */}
          <div style={{ display:"flex", gap:"8px", marginTop:"12px" }}>
            <button onClick={() => setMark(m => m==="got" ? null : "got")}
              style={{ fontSize:"12px", fontWeight:600, padding:"5px 14px", borderRadius:"20px", border:"none", cursor:"pointer",
                background: mark==="got" ? "#34C759":"#E8F9EE", color: mark==="got" ? "#fff":"#34C759" }}>
              ✓ Got it
            </button>
            <button onClick={() => setMark(m => m==="retry" ? null : "retry")}
              style={{ fontSize:"12px", fontWeight:600, padding:"5px 14px", borderRadius:"20px", border:"none", cursor:"pointer",
                background: mark==="retry" ? "#FF9500":"#FFF4E0", color: mark==="retry" ? "#fff":"#FF9500" }}>
              ↻ Need more practice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PaperPractice({ topicId, bmId }) {
  const [questions, setQuestions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [open,      setOpen]      = useState(false);

  useEffect(() => {
    if (!topicId) return;
    getPaperQuestions(topicId)
      .then(r => setQuestions(r.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [topicId]);

  if (!loading && !questions.length) return null;

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", overflow:"hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:0 }}>
        <div style={{ background:"linear-gradient(135deg,#FF6B35 0%,#FF9500 100%)", padding:"20px 24px",
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
              <p style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1px", color:"rgba(255,255,255,0.7)", margin:0 }}>PAPER PRACTICE</p>
              {bmId && <SectionStar bmId={bmId} label="Paper Practice" />}
            </div>
            <p style={{ fontSize:"14px", fontWeight:700, color:"#fff", margin:0 }}>
              {loading ? "Loading…" : `${questions.length} written question${questions.length!==1?"s":""} — attempt on paper`}
            </p>
          </div>
          <span style={{ fontSize:"20px", color:"rgba(255,255,255,0.8)", transform: open?"rotate(90deg)":"rotate(0deg)", transition:"transform 0.2s" }}>›</span>
        </div>
      </button>

      {open && (
        <div style={{ padding:"20px 24px" }}>
          <p style={{ fontSize:"12px", color:"#86868B", marginBottom:"14px", lineHeight:1.5 }}>
            These are written/numeric questions — solve on paper, then tap <strong>Show Answer</strong> to check.
          </p>
          {questions.map((q, i) => <PaperPracticeCard key={q._id || i} q={q} index={i} />)}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════ */
/* ── Collection picker (for topic bookmark) ──────────────────────────────── */
const NTV_SMART_LABELS = [
  "All saved", "Tricky concepts", "Review before exam",
  "Concepts & formulas", "Tips & shortcuts", "✓ Mastered",
];
const NTV_SMART_LABEL_TO_ID = {
  "All saved": null, "Tricky concepts": "tricky", "Review before exam": "recent",
  "Concepts & formulas": "concepts", "Tips & shortcuts": "tips", "✓ Mastered": "mastered",
};

function NtvCollectionPicker({ pickerRef, onClose, onSave }) {
  const [cols, setCols] = useState(() => loadLS("stellar_collections", []));
  const [creating, setCreating] = useState(false);
  const [newName,  setNewName]  = useState("");

  useEffect(() => {
    const h = (e) => { if (pickerRef?.current && !pickerRef.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose, pickerRef]);

  const handleNew = () => {
    const name = newName.trim();
    if (!name) return;
    const nc = { id: `col_${Date.now()}`, label: name, bookmarkIds: [] };
    const updated = [...cols, nc];
    setCols(updated);
    localStorage.setItem("stellar_collections", JSON.stringify(updated));
    setCreating(false); setNewName("");
    onSave(nc.id, updated);
  };

  return (
    <div style={{ position:"absolute", right:0, bottom:"110%", zIndex:50, background:"#fff",
      borderRadius:"14px", border:"1px solid #F0F0F5", boxShadow:"0 8px 32px rgba(0,0,0,0.12)",
      minWidth:"210px", maxHeight:"320px", overflowY:"auto" }}>
      <p style={{ position:"sticky", top:0, background:"#fff", fontSize:"9px", fontWeight:700,
        letterSpacing:"0.12em", textTransform:"uppercase", color:"#8E8E93",
        padding:"10px 12px 4px", borderBottom:"1px solid #F2F2F7", margin:0 }}>
        Add to collection
      </p>
      <p style={{ fontSize:"8px", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase",
        color:"#C7C7CC", padding:"8px 12px 2px", margin:0 }}>Smart</p>
      {NTV_SMART_LABELS.map((label) => (
        <button key={label} onClick={() => onSave(NTV_SMART_LABEL_TO_ID[label], cols)}
          style={{ width:"100%", textAlign:"left", padding:"8px 12px", fontSize:"12px",
            color:"#3A3A3C", background:"none", border:"none", cursor:"pointer",
            display:"flex", alignItems:"center", gap:"8px" }}
          onMouseEnter={e => e.currentTarget.style.background="#F2F2F7"}
          onMouseLeave={e => e.currentTarget.style.background="none"}>
          <span style={{ color:"#C7C7CC", fontSize:"11px" }}>◈</span>{label}
        </button>
      ))}
      {cols.length > 0 && (
        <>
          <p style={{ fontSize:"8px", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase",
            color:"#C7C7CC", padding:"8px 12px 2px", borderTop:"1px solid #F2F2F7", margin:0 }}>My collections</p>
          {cols.map((col) => (
            <button key={col.id} onClick={() => onSave(col.id, cols)}
              style={{ width:"100%", textAlign:"left", padding:"8px 12px", fontSize:"12px",
                color:"#3A3A3C", background:"none", border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", gap:"8px" }}
              onMouseEnter={e => e.currentTarget.style.background="#F2F2F7"}
              onMouseLeave={e => e.currentTarget.style.background="none"}>
              <span style={{ color:"#007AFF", fontSize:"11px" }}>◉</span>{col.label}
            </button>
          ))}
        </>
      )}
      <div style={{ borderTop:"1px solid #F2F2F7" }}>
        {creating ? (
          <div style={{ padding:"6px 8px 8px" }}>
            <input autoFocus type="text" value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter") handleNew(); if (e.key==="Escape") { setCreating(false); setNewName(""); } }}
              placeholder="Collection name…" maxLength={40}
              style={{ width:"100%", fontSize:"12px", padding:"6px 8px", borderRadius:"8px",
                border:"1px solid rgba(0,122,255,0.5)", outline:"none", background:"rgba(0,122,255,0.05)",
                color:"#1C1C1E", boxSizing:"border-box" }} />
            <div style={{ display:"flex", gap:"4px", marginTop:"4px" }}>
              <button onClick={handleNew} disabled={!newName.trim()}
                style={{ flex:1, padding:"5px", borderRadius:"8px", background:"#007AFF",
                  color:"#fff", fontSize:"11px", fontWeight:700, border:"none", cursor:"pointer",
                  opacity: newName.trim() ? 1 : 0.4 }}>Create</button>
              <button onClick={() => { setCreating(false); setNewName(""); }}
                style={{ padding:"5px 8px", borderRadius:"8px", background:"none",
                  color:"#8E8E93", fontSize:"11px", border:"none", cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setCreating(true)}
            style={{ width:"100%", textAlign:"left", padding:"10px 12px", fontSize:"12px",
              color:"#007AFF", background:"none", border:"none", cursor:"pointer",
              display:"flex", alignItems:"center", gap:"6px" }}
            onMouseEnter={e => e.currentTarget.style.background="#F2F2F7"}
            onMouseLeave={e => e.currentTarget.style.background="none"}>
            <span style={{ fontWeight:700 }}>+</span> New collection
          </button>
        )}
      </div>
    </div>
  );
}

/* ── #17 Section-level error boundary ───────────────────────────────────── */
class TopicErrorBoundary extends Component {
  constructor(p){ super(p); this.state = { hasError:false }; }
  static getDerivedStateFromError(){ return { hasError:true }; }
  componentDidCatch(err){ if (typeof console !== "undefined") console.error("Topic section error:", err); }
  render(){
    if (this.state.hasError) {
      return (
        <div style={{ background:"#F5F5F7", borderRadius:"12px", padding:"16px", fontSize:"12px", color:"#86868B" }}>
          ⚠ This section couldn't load. The rest of the topic is below.
          <button onClick={()=>this.setState({hasError:false})} style={{ marginLeft:8, color:"#007AFF", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ── #11 Reading progress bar (fixed top hairline) ─────────────────────── */
function TopicReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop || document.body.scrollTop;
      const total = (h.scrollHeight || 1) - (h.clientHeight || 1);
      setPct(total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive:true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);
  return <div className="ntv-progress" aria-hidden="true"><div style={{ width:`${pct}%` }} /></div>;
}

/* ── #9 Right rail container (TOC + key facts + cohort + next-up) ────── */
function TopicRightRail({ topic, keyFormulas, prereqs, prereqMap, sections, activeSection, onJump, nextUp, onNav, masteryState, lastReview, dueIn, cohortSize, cohortAvgMin, learningOutcomes }) {
  return (
    <div style={{ position:"sticky", top:16, display:"flex", flexDirection:"column", gap:14, alignSelf:"start" }}>
      {/* #6 Mastery pill */}
      <div className="ntv-rail-card">
        <p className="ntv-rail-muted" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", margin:"0 0 8px" }}>Your status</p>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          <span style={{
            fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:999,
            background: masteryState === "mastered" ? "rgba(52,199,89,0.15)" : masteryState === "in_progress" ? "rgba(0,122,255,0.15)" : "rgba(174,174,178,0.15)",
            color: masteryState === "mastered" ? "#34C759" : masteryState === "in_progress" ? "#007AFF" : "#86868B",
          }}>
            {masteryState === "mastered" ? "✓ Mastered" : masteryState === "in_progress" ? "● In progress" : "Not started"}
          </span>
          {dueIn != null && <span className="ntv-rail-muted" style={{ fontSize:11 }}>Review in {dueIn}d</span>}
        </div>
        {lastReview && <p className="ntv-rail-muted" style={{ fontSize:11, margin:"6px 0 0" }}>Last seen: {lastReview}</p>}
      </div>

      {/* #1 Cohort signal */}
      {cohortSize > 0 && (
        <div className="ntv-rail-card">
          <p className="ntv-rail-muted" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", margin:"0 0 8px" }}>Cohort</p>
          <p style={{ fontSize:13, margin:0 }}><strong>{cohortSize.toLocaleString()}</strong> Class 10 students studied this</p>
          {cohortAvgMin > 0 && <p className="ntv-rail-muted" style={{ fontSize:12, margin:"4px 0 0" }}>Avg time to mastery: <strong>{cohortAvgMin}m</strong></p>}
        </div>
      )}

      {/* #3 Learning outcomes */}
      {learningOutcomes?.length > 0 && (
        <div className="ntv-rail-card">
          <p className="ntv-rail-muted" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", margin:"0 0 8px" }}>After this you'll be able to</p>
          <ul style={{ margin:0, padding:"0 0 0 18px", display:"flex", flexDirection:"column", gap:6 }}>
            {learningOutcomes.map((o,i) => <li key={i} style={{ fontSize:12, lineHeight:1.5 }}>{o}</li>)}
          </ul>
        </div>
      )}

      {/* #9 TOC */}
      {sections?.length > 0 && (
        <div className="ntv-rail-card" role="navigation" aria-label="Topic sections">
          <p className="ntv-rail-muted" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", margin:"0 0 8px" }}>On this page</p>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {sections.map((s) => (
              <button key={s.id} onClick={() => onJump(s.id)}
                style={{
                  textAlign:"left", padding:"6px 8px", fontSize:12,
                  borderRadius:8, background: activeSection === s.id ? "rgba(124,58,237,0.10)" : "transparent",
                  color: activeSection === s.id ? "#7c3aed" : "inherit",
                  fontWeight: activeSection === s.id ? 700 : 500,
                  border:"none", cursor:"pointer",
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Key formulas pinned */}
      {keyFormulas?.length > 0 && (
        <div className="ntv-rail-card">
          <p className="ntv-rail-muted" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", margin:"0 0 8px" }}>Key formulas</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {keyFormulas.slice(0,5).map((f, i) => (
              <code key={i} className="ntv-rail-tile" style={{ ...S.mono, fontSize:12, padding:"8px 10px", borderRadius:8, overflowWrap:"anywhere", display:"block" }}>
                {typeof f === "string" ? f : JSON.stringify(f)}
              </code>
            ))}
          </div>
        </div>
      )}

      {/* #2 Prereq strip (right rail variant) */}
      {prereqs?.length > 0 && (
        <div className="ntv-rail-card">
          <p className="ntv-rail-muted" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", margin:"0 0 8px" }}>Prereqs</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {prereqs.map((p, i) => {
              const tid = prereqMap[p];
              return tid ? (
                <button key={i} onClick={() => onNav(tid)} className="ntv-rail-tile ntv-rail-tile--link"
                  style={{ textAlign:"left", padding:"8px 10px", borderRadius:8, fontSize:12, border:"none", cursor:"pointer", lineHeight:1.45 }}>
                  ↗ {p}
                </button>
              ) : (
                <span key={i} className="ntv-rail-tile" style={{ display:"block", fontSize:12, padding:"8px 10px", borderRadius:8, lineHeight:1.45 }}>{p}</span>
              );
            })}
          </div>
        </div>
      )}

      {/* #7 What's next */}
      {nextUp?.length > 0 && (
        <div className="ntv-rail-card">
          <p className="ntv-rail-muted" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", margin:"0 0 8px" }}>What's next</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {nextUp.map((t) => (
              <button key={t.topicId} onClick={() => onNav(t.topicId)} className="ntv-rail-tile ntv-rail-tile--link"
                style={{ textAlign:"left", padding:"10px 12px", borderRadius:8, fontSize:12, border:"none", cursor:"pointer" }}>
                <span style={{ display:"block", fontWeight:600 }}>{t.name}</span>
                {t.reason && <span className="ntv-rail-muted" style={{ fontSize:11 }}>{t.reason}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── #4 + #5 Sticky floating actions (Practice + AI tutor) ─────────────── */
function TopicStickyActions({ onPractice, onAskAI, practiceLabel }) {
  return (
    <div className="ntv-sticky-actions" aria-label="Quick actions">
      <button onClick={onAskAI} title="Ask Stellar (press /)"
        style={{ width:48, height:48, borderRadius:24, background:"#1c1c1e", color:"#fff", border:"none", cursor:"pointer", fontSize:22, boxShadow:"0 6px 20px rgba(0,0,0,0.25)" }}>
        ✨
      </button>
      <button onClick={onPractice}
        style={{ padding:"12px 18px", borderRadius:24, background:"linear-gradient(90deg,#007AFF,#5856D6)", color:"#fff", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, boxShadow:"0 6px 20px rgba(0,122,255,0.4)" }}>
        Practice {practiceLabel || "5 questions"} →
      </button>
    </div>
  );
}

/* ── #5 AI Tutor modal (uses existing /ai/chat endpoint) ───────────────── */
function TopicAITutor({ topicName, subject, onClose }) {
  const [history, setHistory] = useState([]);
  const [input, setInput]     = useState("");
  const [busy, setBusy]       = useState(false);
  const send = async () => {
    if (!input.trim() || busy) return;
    const msg = input.trim();
    setInput("");
    setHistory(h => [...h, { role:"user", content:msg }]);
    setBusy(true);
    try {
      const { askTutor } = await import("../services/api");
      const r = await askTutor(msg, history, topicName, subject);
      const reply = r.data?.data?.reply || r.data?.reply || "I'm not sure, can you rephrase?";
      setHistory(h => [...h, { role:"assistant", content:reply }]);
    } catch (e) {
      setHistory(h => [...h, { role:"assistant", content:"⚠ I'm having trouble right now. Try again in a moment." }]);
    } finally { setBusy(false); }
  };
  useEffect(() => {
    const onEsc = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label="Stellar AI Tutor"
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:80, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}
        style={{ width:"min(560px,100%)", maxHeight:"80vh", display:"flex", flexDirection:"column", background:"var(--card-bg,#fff)", borderRadius:20, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(0,0,0,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <p style={{ fontSize:14, fontWeight:700, margin:0 }}>✨ Stellar · AI Tutor</p>
            <p style={{ fontSize:11, opacity:0.6, margin:"2px 0 0" }}>Context: {topicName}</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background:"none", border:"none", cursor:"pointer", fontSize:20 }}>×</button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:10 }}>
          {history.length === 0 && (
            <div style={{ fontSize:13, opacity:0.6 }}>
              Ask anything about <strong>{topicName}</strong> — examples: "Explain again in 1 line", "Give me a harder problem", "Why does this work?"
            </div>
          )}
          {history.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth:"80%", padding:"10px 14px", borderRadius:14, fontSize:13, lineHeight:1.5,
              background: m.role === "user" ? "linear-gradient(135deg,#007AFF,#5856D6)" : "rgba(0,0,0,0.04)",
              color: m.role === "user" ? "#fff" : "inherit",
            }}>{m.content}</div>
          ))}
          {busy && <div style={{ alignSelf:"flex-start", fontSize:12, opacity:0.6 }}>Thinking…</div>}
        </div>
        <div style={{ padding:12, borderTop:"1px solid rgba(0,0,0,0.06)", display:"flex", gap:8 }}>
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if (e.key === "Enter") send(); }}
            placeholder="Ask Stellar…" aria-label="Ask Stellar"
            style={{ flex:1, padding:"10px 14px", borderRadius:12, border:"1px solid rgba(0,0,0,0.1)", fontSize:13, background:"transparent", color:"inherit", outline:"none" }} />
          <button onClick={send} disabled={busy || !input.trim()}
            style={{ padding:"10px 16px", borderRadius:12, background:"#1c1c1e", color:"#fff", border:"none", cursor:"pointer", fontWeight:700, fontSize:13, opacity:(busy || !input.trim())?0.5:1 }}>Send</button>
        </div>
      </div>
    </div>
  );
}

/* ── Hash → section id helper for deep links ────────────────────────────── */
function jumpToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    url.hash = id;
    window.history.replaceState(null, "", url.toString());
  }
}

/* ── Toast (lightweight, for #8 + copy-link feedback) ───────────────────── */
function useToast() {
  const [msg, setMsg] = useState(null);
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(null), 2200); };
  const node = msg ? (
    <div role="status" aria-live="polite"
      style={{ position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)", background:"#1c1c1e", color:"#fff", padding:"10px 18px", borderRadius:999, fontSize:12, fontWeight:600, zIndex:90, boxShadow:"0 4px 14px rgba(0,0,0,0.3)" }}>
      {msg}
    </div>
  ) : null;
  return { show, node };
}

export default function NcertTopicView() {
  const { topicId } = useParams();
  const navigate    = useNavigate();
  const engagement  = useTopicEngagement(topicId);

  const [topic,      setTopic]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [fetchErr,   setFetchErr]   = useState(false);                                   // #25 network resilience
  // #19 URL-encoded state: mode from ?mode=, persisted via replaceState
  const [mode,       setMode]       = useState(() => {
    if (typeof window === "undefined") return "quick";
    const url = new URL(window.location.href);
    return url.searchParams.get("mode") === "deep" ? "deep" : "quick";
  });
  const [aiOpen,     setAiOpen]     = useState(false);                                   // #5 AI tutor
  const [activeSec,  setActiveSec]  = useState(null);                                    // #9 TOC scroll spy
  const toast = useToast();
  const [cpPassed,   setCpPassed]   = useState(false);
  const [exDone,     setExDone]     = useState(new Set());
  // Deep-mode interactive state
  const [confidence, setConfidence] = useState({});
  const [recallRatings, setRecallRatings] = useState({});
  const [formulaState,  setFormulaState]  = useState({});
  const [errorDone,  setErrorDone]  = useState(false);
  const [siblings,     setSiblings]    = useState([]);
  const [allTopics,    setAllTopics]   = useState([]);
  const [chapterTitle, setChapterTitle] = useState(null);
  const [studied,      setStudied]    = useState(false);
  const [sessionSecs, setSessionSecs] = useState(0);

  // ── Bookmark state ────────────────────────────────────────────────
  const [isBookmarked, setIsBookmarked] = useState(() => !!loadLS("stellar_topic_bookmarks", {})[topicId]);
  const [pickerOpen,   setPickerOpen]   = useState(false);
  const pickerRef = useRef(null);

  const toggleBookmark = (colId, updatedCols) => {
    const bms = loadLS("stellar_topic_bookmarks", {});
    if (isBookmarked) {
      delete bms[topicId];
      localStorage.setItem("stellar_topic_bookmarks", JSON.stringify(bms));
      setIsBookmarked(false);
    } else {
      const subj = topicId.startsWith("sci_") ? "Science"
        : topicId.startsWith("eng_") ? "English"
        : topicId.startsWith("hin_") ? "Hindi"
        : "Math";
      const isCustom = colId?.startsWith("col_");
      const entry = { topicId, name: topic?.name || topicId, subject: subj, chapterNumber: topic?.chapterNumber, savedAt: new Date().toISOString() };
      if (colId && !isCustom) entry.smartCol = colId;
      bms[topicId] = entry;
      localStorage.setItem("stellar_topic_bookmarks", JSON.stringify(bms));
      setIsBookmarked(true);
      if (isCustom) {
        const cols = updatedCols ?? loadLS("stellar_collections", []);
        const next = cols.map(c => c.id === colId ? { ...c, bookmarkIds: c.bookmarkIds.includes(topicId) ? c.bookmarkIds : [...c.bookmarkIds, topicId] } : c);
        localStorage.setItem("stellar_collections", JSON.stringify(next));
      }
    }
    setPickerOpen(false);
  };

  useEffect(() => { injectCss(); }, []);

  const fetchTopic = useCallback(() => {
    setLoading(true); setFetchErr(false);
    getNcertTopicContent(topicId)
      .then(r => { setTopic(r.data?.data); if (!r.data?.data) setFetchErr(true); })
      .catch(() => setFetchErr(true))
      .finally(() => setLoading(false));
  }, [topicId]);
  useEffect(() => { fetchTopic(); }, [fetchTopic]);

  // #19 sync mode → URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (mode === "quick") url.searchParams.delete("mode"); else url.searchParams.set("mode", "deep");
    window.history.replaceState(null, "", url.toString());
  }, [mode]);

  // #12 deep-link to section on initial load (#section in URL)
  useEffect(() => {
    if (!topic || typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (hash) setTimeout(() => jumpToSection(hash), 100);
  }, [topic]);

  // #9 Scroll spy — set active TOC item from visible section
  useEffect(() => {
    if (!topic) return;
    const els = Array.from(document.querySelectorAll(".ntv-page [data-section]"));
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActiveSec(visible[0].target.id);
    }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [topic, mode]);

  // #8 Session-summary on leave — fires once when user navigates away mid-topic
  useEffect(() => {
    if (!topic) return;
    const onHide = () => {
      if (document.visibilityState === "hidden" && sessionSecs > 30 && !studied) {
        try {
          const summary = { topicId, name: topic.name, secs: sessionSecs, ts: Date.now() };
          const prev = JSON.parse(localStorage.getItem("stellar_unfinished_topics") || "[]");
          localStorage.setItem("stellar_unfinished_topics", JSON.stringify([summary, ...prev.filter(p => p.topicId !== topicId)].slice(0, 10)));
        } catch {}
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [topic, sessionSecs, studied, topicId]);

  // #23 Keyboard shortcuts — j/k sections, n/p next/prev topic, b bookmark, s studied, / AI, Esc closes
  useEffect(() => {
    if (!topic) return;
    const onKey = (e) => {
      if (e.target?.tagName === "INPUT" || e.target?.tagName === "TEXTAREA" || e.target?.isContentEditable) return;
      const sections = Array.from(document.querySelectorAll(".ntv-page [data-section]"));
      if (e.key === "/") {
        e.preventDefault(); setAiOpen(true);
      } else if (e.key === "j" || e.key === "k") {
        if (!sections.length) return;
        e.preventDefault();
        const idx = sections.findIndex(el => el.id === activeSec);
        const next = e.key === "j"
          ? sections[Math.min(sections.length - 1, idx + 1)]
          : sections[Math.max(0, idx - 1)];
        if (next) jumpToSection(next.id);
      } else if (e.key === "b") {
        if (isBookmarked) toggleBookmark(); else setPickerOpen(true);
      } else if (e.key === "Escape") {
        setAiOpen(false); setPickerOpen(false);
      }
      // n / p handled later (need prev/nextTopic in scope)
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [topic, activeSec, isBookmarked]); // eslint-disable-line

  useEffect(() => {
    setCpPassed(false); setExDone(new Set());
    setConfidence({}); setRecallRatings({}); setErrorDone(false);
    setSessionSecs(0);
  }, [mode]);

  useEffect(() => {
    const iv = setInterval(() => setSessionSecs(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, [mode]);

  // Science chapter titles — NcertChapter collection only has Math; derive from static map
  const SCIENCE_CHAPTER_TITLES = {
    1: "Chemical Reactions and Equations", 2: "Acids, Bases and Salts",
    3: "Metals and Non-metals",            4: "Carbon and its Compounds",
    5: "Life Processes",                   6: "Control and Coordination",
    7: "How do Organisms Reproduce?",      8: "Heredity",
    9: "Light — Reflection and Refraction",10: "The Human Eye and the Colourful World",
    11: "Electricity",                     12: "Magnetic Effects of Electric Current",
    13: "Our Environment",
  };
  // ICSE Class 10 Math chapter titles (Selina/Concise) — NcertChapter collection only has
  // CBSE chapters, so derive from a static map exactly as Science does above.
  const ICSE_MATH10_CHAPTER_TITLES = {
    1:  "Value Added Tax",                           2:  "Banking (Recurring Deposit Account)",
    3:  "Shares and Dividend",                       4:  "Linear Inequations (In one variable)",
    5:  "Quadratic Equations",                       6:  "Solving (Simple) Problems on Quadratic Equations",
    7:  "Ratio and Proportion",                      8:  "Remainder and Factor Theorems",
    9:  "Matrices",                                  10: "Arithmetic Progression",
    11: "Geometric Progression",                     12: "Reflection",
    13: "Section and Mid-Point Formula",             14: "Equation of a Line",
    15: "Similarity (with Maps and Models)",         16: "Loci (Locus and Its Constructions)",
    17: "Circles",                                   18: "Tangents and Intersecting Chords",
    19: "Constructions (Circles)",                   20: "Cylinder, Cone and Sphere (Surface Area & Volume)",
    21: "Trigonometrical Identities",                22: "Heights and Distances",
    23: "Graphical Representation",                  24: "Measures of Central Tendency",
    25: "Probability",
  };
  // ICSE Class 9 Math chapter titles (Selina Concise, 28 chapters).
  // NcertChapter collection only has CBSE 10 chapters — use a static map same as ICSE Math 10.
  const ICSE_MATH9_CHAPTER_TITLES = {
    1:  "Rational and Irrational Numbers",        2:  "Compound Interest (Without Formula)",
    3:  "Compound Interest (Using Formula)",       4:  "Expansions (Identities)",
    5:  "Factorisation",                           6:  "Simultaneous (Linear) Equations",
    7:  "Indices (Exponents)",                     8:  "Logarithms",
    9:  "Triangles (Congruency in Triangles)",     10: "Isosceles Triangles",
    11: "Inequalities",                            12: "Mid-Point and Its Converse; Equal Intercept Theorem",
    13: "Pythagoras Theorem",                      14: "Rectilinear Figures (Quadrilaterals: Parallelogram, Rectangle, Rhombus, Square and Trapezium)",
    15: "Construction of Polygons (Using Ruler and Compass Only)",
    16: "Area Theorems (Proof and Use)",           17: "Circle",
    18: "Statistics",                              19: "Mean and Median (For Ungrouped Data Only)",
    20: "Area and Perimeter of Plane Figures",     21: "Solids (Surface Area and Volume of 3-D Solids)",
    22: "Trigonometrical Ratios (sin θ, cos θ, tan θ and their Reciprocals)",
    23: "Trigonometrical Ratios of Standard Angles (Including Evaluation of an Expression Involving Trigonometric Ratios)",
    24: "Solution of Right Triangles (Simple 2-D Problems Involving One Right-Angled Triangle)",
    25: "Complementary Angles",
    26: "Co-ordinate Geometry (In 2-D)",
    27: "Graphical Solution (Solution of Simultaneous Linear Equations, Graphically)",
    28: "Distance Formula",
  };
  // CBSE Class 9 Math chapter titles (standardized cbse_math9_* seeds, 8 chapters).
  // NcertChapter collection only has CBSE 10 chapters — use a static map same as Science/ICSE.
  const CBSE_MATH9_CHAPTER_TITLES = {
    1: "Coordinate Geometry",         2: "Polynomials",
    3: "Number Systems",              4: "Algebraic Identities",
    5: "Circles",                     6: "Heron's Formula and Areas",
    7: "Probability",                 8: "Sequences and Progressions",
  };
  // AP SSC Class 9 Math chapter titles (ap_ssc_math9_* — NCERT rationalized 2024-25, 12 chapters).
  // NcertChapter collection has no AP SSC entries — use static map same as CBSE/ICSE Math 9.
  const AP_SSC_MATH9_CHAPTER_TITLES = {
    1:  "Number Systems",
    2:  "Polynomials",
    3:  "Coordinate Geometry",
    4:  "Linear Equations in Two Variables",
    5:  "Introduction to Euclid's Geometry",
    6:  "Lines and Angles",
    7:  "Triangles",
    8:  "Quadrilaterals",
    9:  "Circles",
    10: "Heron's Formula",
    11: "Surface Areas and Volumes",
    12: "Statistics",
  };
  // AP SSC Class 10 Math chapter titles (ap_ssc_math10_* — same NCERT curriculum as CBSE 10).
  // NcertChapter collection has no AP SSC entries — use static map same as ICSE/CBSE Math 9.
  const AP_SSC_MATH10_CHAPTER_TITLES = {
    1:  "Real Numbers",
    2:  "Polynomials",
    3:  "Pair of Linear Equations in Two Variables",
    4:  "Quadratic Equations",
    5:  "Arithmetic Progressions",
    6:  "Triangles",
    7:  "Coordinate Geometry",
    8:  "Introduction to Trigonometry",
    9:  "Some Applications of Trigonometry",
    10: "Circles",
    11: "Areas Related to Circles",
    12: "Surface Areas and Volumes",
    13: "Statistics",
    14: "Probability",
  };
  // CBSE Classes 1–8 Math chapter titles (legacy math{N}_ v2 seeds).
  // NcertChapter collection only has CBSE 10; use static maps mirroring Lessons.jsx.
  const CBSE_MATH_LEGACY_CHAPTER_TITLES = {
    "8": {
      1: "A Square and A Cube",                    2: "Power Play",
      3: "A Story of Numbers",                     4: "Quadrilaterals",
      5: "Number Play",                            6: "We Distribute, Yet Things Multiply",
      7: "Proportional Reasoning - 1",             8: "Fractions in Disguise",
      9: "The Baudhayana-Pythagoras Theorem",      10: "Proportional Reasoning - 2",
      11: "Exploring Some Geometric Themes",       12: "Tales by Dots and Lines",
      13: "Algebra Play",                          14: "Area",
    },
    "7": {
      1: "Large Numbers Around Us",                2: "Arithmetic Expressions",
      3: "A Peek Beyond the Point",                4: "Letter-Numbers",
      5: "Parallel and Intersecting Lines",        6: "Number Play",
      7: "A Tale of Three Intersecting Lines",     8: "Working with Fractions",
      9: "Geometric Twins",                        10: "Operations with Integers",
      11: "Finding Common Ground",                 12: "Another Peek Beyond the Point",
      13: "Connecting the Dots",                   14: "Constructions and Tilings",
      15: "Finding the Unknown",
    },
    "6": {
      1: "Patterns in Mathematics",               2: "Lines and Angles",
      3: "Number Play",                           4: "Data Handling and Presentation",
      5: "Prime Time",                            6: "Perimeter and Area",
      7: "Fractions",                             8: "Playing with Constructions",
      9: "Symmetry",                              10: "The Other Side of Zero",
    },
    "5": {
      1: "The Fish Tale",                         2: "Shapes and Angles",
      3: "How Many Squares?",                     4: "Parts and Wholes",
      5: "Does it Look the Same?",               6: "Be My Multiple, I'll Be Your Factor",
      7: "Can You See the Pattern?",             8: "Mapping Your Way",
      9: "Boxes and Sketches",                   10: "Tenths and Hundredths",
      11: "Area and Its Boundary",               12: "Smart Charts",
      13: "Ways to Multiply and Divide",         14: "How Big? How Heavy?",
    },
    "4": {
      1: "Building with Bricks",                 2: "Long and Short",
      3: "A Trip to Bhopal",                     4: "Tick-Tick-Tick",
      5: "The Way The World Looks",              6: "The Junk Seller",
      7: "Jugs and Mugs",                        8: "Carts and Wheels",
      9: "Halves and Quarters",                  10: "Play with Patterns",
      11: "Tables and Shares",                   12: "How Heavy? How Light?",
      13: "Fields and Fences",                   14: "Smart Charts",
    },
    "3": {
      1: "Where to Look From",                   2: "Fun with Numbers",
      3: "Give and Take",                        4: "Long and Short",
      5: "Shapes and Designs",                   6: "Fun with Give and Take",
      7: "Time Goes On",                         8: "Who is Heavier?",
      9: "How Many Times?",                      10: "Play with Patterns",
      11: "Jugs and Mugs",                       12: "Can We Share?",
      13: "Smart Charts!",                       14: "Rupees and Paise",
    },
    "2": {
      1: "What is Long, What is Round?",         2: "Counting in Groups",
      3: "How Much Can You Carry?",              4: "Counting in Tens",
      5: "Patterns",                             6: "Footprints",
      7: "Jugs and Mugs",                        8: "Tens and Ones",
      9: "My Funbook",                           10: "Add our Points",
      11: "Lines and Lines",                     12: "Give and Take",
      13: "The Longest Step",                    14: "Birds Come, Birds Go",
      15: "How Many Ponytails?",
    },
    "1": {
      1: "Shapes and Space",                     2: "Numbers from One to Nine",
      3: "Addition",                             4: "Subtraction",
      5: "Numbers from Ten to Twenty",           6: "Time",
      7: "Measurement",                          8: "Numbers from Twenty-one to Fifty",
      9: "Data Handling",                        10: "Patterns",
      11: "Numbers",                             12: "Money",
      13: "How Many",
    },
  };
  // Extract grade number from legacy math{N}_ topicId
  const legacyMathGrade = (id) => { const m = (id || "").match(/^math(\d+)_/); return m ? m[1] : null; };
  const isSciTopicId  = id => (id || "").startsWith("sci_");
  const isEngTopicId  = id => (id || "").startsWith("eng_");
  const isHinTopicId  = id => (id || "").startsWith("hin_");
  const isMath9TopicId = id => (id || "").startsWith("math9_");
  const isMath8TopicId = id => (id || "").startsWith("math8_");
  const isMath7TopicId = id => (id || "").startsWith("math7_");
  const isMath6TopicId = id => (id || "").startsWith("math6_");
  const isMath5TopicId = id => (id || "").startsWith("math5_");
  const isMath4TopicId = id => (id || "").startsWith("math4_");
  const isMath3TopicId = id => (id || "").startsWith("math3_");
  const isMath2TopicId = id => (id || "").startsWith("math2_");
  const isMath1TopicId = id => (id || "").startsWith("math1_");
  // Standardized board-prefixed IDs (SPEC_MATH_STANDARDIZATION) — rich Class-10-style
  // content, NOT the flat math{N}_ format. Kept out of isSciLike so it renders the
  // nested intuition / derivation / svg_diagrams path, exactly like CBSE Math 10.
  const isCbseMath9TopicId   = id => (id || "").startsWith("cbse_math9_");
  const isIcseMath9TopicId   = id => (id || "").startsWith("icse_math9_");
  const isIcseMath10TopicId  = id => (id || "").startsWith("icse_math10_");
  const isApSscMath9TopicId  = id => (id || "").startsWith("ap_ssc_math9_");
  const isApSscMath10TopicId = id => (id || "").startsWith("ap_ssc_math10_");

  // Fetch all NCERT topics + chapter list once to derive siblings, prereqMap, and chapter title
  useEffect(() => {
    if (!topic) return;
    const isSci   = isSciTopicId(topicId);
    const isEng   = isEngTopicId(topicId);
    const isHin   = isHinTopicId(topicId);
    const isMath9 = isMath9TopicId(topicId);
    const isMath8 = isMath8TopicId(topicId);
    const isMath7 = isMath7TopicId(topicId);
    const isMath6 = isMath6TopicId(topicId);
    const isMath5 = isMath5TopicId(topicId);
    const isMath4 = isMath4TopicId(topicId);
    const isMath3 = isMath3TopicId(topicId);
    const isMath2 = isMath2TopicId(topicId);
    const isMath1 = isMath1TopicId(topicId);
    const isCbseMath9    = isCbseMath9TopicId(topicId);
    const isIcseMath9    = isIcseMath9TopicId(topicId);
    const isIcseMath10   = isIcseMath10TopicId(topicId);
    const isApSscMath9   = isApSscMath9TopicId(topicId);
    const isApSscMath10  = isApSscMath10TopicId(topicId);
    const subject = isSci ? "Science" : isEng ? "English" : isHin ? "Hindi" : "Mathematics";
    // Siblings must come from the same topicId family — otherwise CBSE Math 10
    // (ch{n}_...) and Math 1–9 v2 (math{n}_ch{n}_...) collide on chapterNumber=1
    // and the nav crashes because v2 records have no `name` field.
    const family = (id) =>
      isSciTopicId(id)          ? "sci"
      : isEngTopicId(id)        ? "eng"
      : isHinTopicId(id)        ? "hin"
      : isMath9TopicId(id)      ? "math9"
      : isMath8TopicId(id)      ? "math8"
      : isMath7TopicId(id)      ? "math7"
      : isMath6TopicId(id)      ? "math6"
      : isMath5TopicId(id)      ? "math5"
      : isMath4TopicId(id)      ? "math4"
      : isMath3TopicId(id)      ? "math3"
      : isMath2TopicId(id)      ? "math2"
      : isMath1TopicId(id)      ? "math1"
      : isCbseMath9TopicId(id)    ? "cbse_math9"
      : isIcseMath9TopicId(id)    ? "icse_math9"     // board-prefixed: icse_math9_*
      : isIcseMath10TopicId(id)   ? "icse_math10"    // board-prefixed: icse_math10_*
      : isApSscMath9TopicId(id)   ? "ap_ssc_math9"   // board-prefixed: ap_ssc_math9_*
      : isApSscMath10TopicId(id)  ? "ap_ssc_math10"  // board-prefixed: ap_ssc_math10_*
      : /^icse\d+_/.test(id || "") ? "icse"          // legacy format: icse10_* (kept for safety)
      : "cbse10";
    const here = family(topicId);
    listNcertTopics(undefined, subject)
      .then(r => {
        const all = r.data?.data || [];
        setAllTopics(all);
        setSiblings(all.filter(t => t.chapterNumber === topic.chapterNumber && family(t.topicId) === here));
      })
      .catch(() => {});
    if (isSci) {
      setChapterTitle(SCIENCE_CHAPTER_TITLES[topic.chapterNumber] || null);
    } else if (isIcseMath9) {
      // ICSE Math 9 has 28 chapters not in the NcertChapter collection (CBSE only) —
      // use the static Selina Concise Class 9 chapter titles map.
      setChapterTitle(ICSE_MATH9_CHAPTER_TITLES[topic.chapterNumber] || null);
    } else if (isIcseMath10) {
      // ICSE Math 10 has 25 chapters not in the NcertChapter collection (CBSE only) —
      // use the static Selina chapter titles map, same pattern as Science above.
      setChapterTitle(ICSE_MATH10_CHAPTER_TITLES[topic.chapterNumber] || null);
    } else if (isApSscMath9) {
      // AP SSC Math 9 — 12 NCERT rationalized chapters; not in NcertChapter collection.
      setChapterTitle(AP_SSC_MATH9_CHAPTER_TITLES[topic.chapterNumber] || null);
    } else if (isApSscMath10) {
      // AP SSC Math 10 — same 14 NCERT chapters as CBSE 10; not in NcertChapter collection.
      setChapterTitle(AP_SSC_MATH10_CHAPTER_TITLES[topic.chapterNumber] || null);
    } else if (isCbseMath9) {
      // CBSE Math 9 standardized (cbse_math9_*) — NcertChapter collection only has CBSE 10.
      setChapterTitle(CBSE_MATH9_CHAPTER_TITLES[topic.chapterNumber] || null);
    } else if (isMath8 || isMath7 || isMath6 || isMath5 || isMath4 || isMath3 || isMath2 || isMath1) {
      // CBSE Math grades 1–8 (legacy math{N}_ v2 seeds) — use static maps, no NcertChapter entry.
      const g = legacyMathGrade(topicId);
      setChapterTitle(CBSE_MATH_LEGACY_CHAPTER_TITLES[g]?.[topic.chapterNumber] || null);
    } else if (!isEng && !isHin && !isMath9) {
      // Chapter title (e.g. "Real Numbers") is what Question.topic uses for practice questions
      listNcertChapters()
        .then(r => {
          const chapters = r.data?.data || [];
          const ch = chapters.find(c => c.number === topic.chapterNumber);
          if (ch?.title) setChapterTitle(ch.title);
        })
        .catch(() => {});
    }
  }, [topic]);

  // Load studied status from backend; fall back to localStorage if not authenticated
  useEffect(() => {
    getStudiedTopics()
      .then(r => setStudied((r.data?.data || []).includes(topicId)))
      .catch(() => {
        try {
          const stored = JSON.parse(localStorage.getItem("stellar_studied_topics") || "[]");
          setStudied(stored.includes(topicId));
        } catch { setStudied(false); }
      });
  }, [topicId]);

  const markExDone   = i => setExDone(p => new Set([...p, i]));
  const rateSection  = (key, val) => setConfidence(p => ({ ...p, [key]: val }));
  const rateRecall   = (i, val) => setRecallRatings(p => ({ ...p, [i]: val }));
  const answerFormula = (i, picked, correct) => setFormulaState(p => ({ ...p, [i]: { picked, correct } }));

  const toggleStudied = () => {
    const next = !studied;
    setStudied(next); // optimistic
    toggleNcertStudied(topicId)
      .then(r => setStudied(r.data?.data?.studied ?? next))
      .catch(() => {
        // backend unavailable — persist to localStorage as fallback
        try {
          const stored = JSON.parse(localStorage.getItem("stellar_studied_topics") || "[]");
          const updated = next ? [...new Set([...stored, topicId])] : stored.filter(id => id !== topicId);
          localStorage.setItem("stellar_studied_topics", JSON.stringify(updated));
        } catch { /* ignore */ }
      });
  };

  const currentIdx = siblings.findIndex(s => s.topicId === topicId);
  const prevTopic  = currentIdx > 0 ? siblings[currentIdx - 1] : null;
  const nextTopic  = currentIdx >= 0 && currentIdx < siblings.length - 1 ? siblings[currentIdx + 1] : null;
  // Map prerequisite names → topicIds so they can be linked
  const prereqMap  = Object.fromEntries(allTopics.map(t => [t.name, t.topicId]));

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"256px" }}>
      <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
    </div>
  );

  if (!topic) return (
    <div>
      <div className="card p-10 text-center">
        <p style={{ fontSize:"15px", fontWeight:600, color:"#1D1D1F", marginBottom:"8px" }}>
          {fetchErr ? "Couldn't load this topic" : "Teaching content not found"}
        </p>
        <p style={{ fontSize:"13px", color:"#86868B", marginBottom:"12px" }}>
          {fetchErr ? "Check your connection and try again." : <>Run <code style={{ ...S.mono, background:"#F5F5F7", padding:"2px 8px", borderRadius:"6px" }}>npm run import:ncert</code> in the backend folder.</>}
        </p>
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          {fetchErr && <button onClick={fetchTopic} className="btn-primary text-[13px]" style={{ padding:"8px 16px", borderRadius:8, background:"#007AFF", color:"#fff", border:"none", cursor:"pointer" }}>Retry</button>}
          <button onClick={() => navigate("/practice")} style={{ padding:"8px 16px", borderRadius:8, background:"#F2F2F7", color:"#1c1c1e", border:"none", cursor:"pointer", fontSize:13 }}>Try practice instead →</button>
          <button onClick={() => navigate(-1)} className="btn-secondary text-[13px]">← Go Back</button>
        </div>
      </div>
    </div>
  );

  const tc             = topic.teaching_content ?? {};
  // Science + English + Hindi + Math9 seeds use flat strings; Math10 uses nested objects
  const isSci          = isSciTopicId(topicId);
  const isEng          = isEngTopicId(topicId);
  const isHin          = isHinTopicId(topicId);
  const isMath9        = isMath9TopicId(topicId);
  const isMath8        = isMath8TopicId(topicId);
  const isMath7        = isMath7TopicId(topicId);
  const isMath6        = isMath6TopicId(topicId);
  const isMath5        = isMath5TopicId(topicId);
  const isMath4        = isMath4TopicId(topicId);
  const isMath3        = isMath3TopicId(topicId);
  const isMath2        = isMath2TopicId(topicId);
  const isMath1        = isMath1TopicId(topicId);
  const isSciLike      = isSci || isEng || isHin || isMath9 || isMath8 || isMath7 || isMath6 || isMath5 || isMath4 || isMath3 || isMath2 || isMath1; // flat string format, no SVG diagrams
  const intuition      = (!isSciLike && tc.intuition && typeof tc.intuition === "object") ? tc.intuition : {};
  const derivation     = tc.derivation ?? {};
  const whenToUse      = tc.when_to_use_this_method ?? {};
  const videoHooks     = tc.video_script_hooks ?? {};
  const visualDescs    = Object.values(tc.visual_description ?? {});
  // worked_example: keyed object (Math) or plain string (Science)
  const examples       = (tc.worked_example && typeof tc.worked_example === "object")
    ? Object.values(tc.worked_example)
    : [];
  const misconceptions  = tc.common_misconceptions ?? [];
  // misconceptions: [{wrong_idea,...}] (Math) or [string] (Science)
  const miscAreObjects  = misconceptions.length > 0 && typeof misconceptions[0] === "object";
  const cpMisconception = miscAreObjects ? misconceptions[0] : null;

  const showExamples = examples.length>0 && (mode==="quick" || cpPassed || !cpMisconception);
  const showLock     = mode==="deep" && !!cpMisconception && !cpPassed && examples.length>0;

  // Build recall cards from formulas + misconceptions
  const recallCards = isSciLike
    ? [
        ...(topic.key_formulas||[]).map(f => ({
          question: `What does this mean? ${typeof f==="string" ? f : JSON.stringify(f)}`,
          answer:   typeof f==="string" ? f : JSON.stringify(f),
        })),
        ...(!miscAreObjects ? misconceptions : []).slice(0,4).map(m => ({
          question: `True or False: "${m}"`,
          answer:   `False — this is a common misconception to avoid.`,
        })),
      ]
    : [
        ...(topic.key_formulas||[]).map(f => ({
          question: `Complete the formula: ${(typeof f==="string"?f:JSON.stringify(f)).split(" ").slice(0,-1).join(" ")} ___`,
          answer:   typeof f==="string" ? f : JSON.stringify(f),
        })),
        ...(miscAreObjects ? misconceptions : []).slice(0,4).map(m => ({
          question: `True or False: "${m.wrong_idea}"`,
          answer:   `False. ${m.correction || "This is a common misconception."}`,
        })),
      ];

  // Error hunt: find first example that actually has steps with computation fields
  const ehExample = examples.find(ex => ex.steps?.some(s => s.computation)) ?? null;
  const ehSteps   = ehExample?.steps || [];
  const wrongIdx  = (() => {
    if (!ehSteps.length) return null;
    const later = ehSteps.findIndex((s, i) => i > 0 && s.computation);
    if (later !== -1) return later;
    const any = ehSteps.findIndex(s => s.computation);
    return any !== -1 ? any : null;
  })();
  const errorHuntExample = ehExample && wrongIdx != null ? {
    ...ehExample,
    steps: ehSteps.map((step, si) =>
      si === wrongIdx
        ? { ...step, _wrong_computation: step.computation.replace(/\d+/, n => String(parseInt(n)+1)) }
        : step
    ),
  } : null;
  const ehHint = misconceptions[1]?.correction || misconceptions[0]?.correction;

  // Sections for confidence summary
  const confidenceSections = [
    { key:"plain",   label:"In Plain English" },
    { key:"real",    label:"Real-World Examples" },
    { key:"central", label:"The Central Idea" },
  ];

  // TOC + next-up data (#9, #7)
  const tocSections = [
    { id: "ntv-header",   label: "Overview" },
    { id: "ntv-plain",    label: "In Plain English" },
    { id: "ntv-real",     label: "Real World" },
    { id: "ntv-examples", label: "Worked Examples" },
    { id: "ntv-mistakes", label: "Common Mistakes" },
    { id: "ntv-notes",    label: "My Notes" },
    { id: "ntv-practice", label: "Practice" },
  ];
  const currentSubject = isSci ? "Science" : isEng ? "English" : isHin ? "Hindi" : "Mathematics";
  const nextUp = siblings
    .filter(s => s.topicId !== topicId)
    .slice(0, 3)
    .map(s => ({ topicId: s.topicId, name: s.name }));
  const learningOutcomes = topic.learning_outcomes || topic.learningOutcomes || [];
  const masteryState = studied ? "mastered" : (exDone.size > 0 || sessionSecs > 30 ? "in_progress" : "not_started");


  return (
    <TopicErrorBoundary>
      <TopicReadingProgress />
      {toast.node}
      <div className="ntv-page"
        style={{ fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", display:"flex", flexDirection:"column", gap:"16px", paddingBottom:"120px" }}>

        <button onClick={() => navigate(-1)}
          style={{ fontSize:"13px", color:"#86868B", display:"flex", alignItems:"center", gap:"4px", cursor:"pointer", background:"none", border:"none", padding:0, alignSelf:"flex-start" }}>
          ‹ Back
        </button>

        {/* ── TOPIC NAV (top) ────────────────────────────────────── */}
        {siblings.length > 1 && (
          <TopicNavBar prev={prevTopic} next={nextTopic} studied={studied}
            onToggle={toggleStudied} onNavigate={id => navigate(`/ncert/topics/${id}`)}
            engagement={engagement} />
        )}

        {/* ── MASTERY BANNER (Phase 2) ─────────────────────────────── */}
        <MasteryBanner topicId={topicId} topicName={topic.name} studied={studied} />

        {/* #9 3-column adaptive layout */}
        <div className="grid lg:grid-cols-[1fr,300px] gap-6" style={{ alignItems:"start" }}>
          <main style={{ minWidth:0, display:"flex", flexDirection:"column", gap:"16px" }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div id="ntv-header" data-section style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", padding:"32px 32px 28px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"8px" }}>
          <p style={{ fontSize:"11px", ...S.mono, color:"#AEAEB2", margin:0 }}>{topicId}</p>
          <div style={{ position:"relative" }} ref={pickerRef}>
            <button
              onClick={() => { if (isBookmarked) toggleBookmark(); else setPickerOpen(v => !v); }}
              className="ntv-btn"
              title={isBookmarked ? "Remove from saved" : "Save this topic"}
              style={{ fontSize:"22px", lineHeight:1, color: isBookmarked ? "#FF9500" : "#C7C7CC",
                padding:"2px 6px", background:"none", border:"none", cursor:"pointer", transition:"color 0.15s" }}
            >
              {isBookmarked ? "★" : "☆"}
            </button>
            {pickerOpen && (
              <NtvCollectionPicker
                pickerRef={pickerRef}
                onClose={() => setPickerOpen(false)}
                onSave={toggleBookmark}
              />
            )}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"0 0 20px", flexWrap:"wrap" }}>
          <h1 style={{ fontSize:"26px", fontWeight:800, letterSpacing:"-0.02em", color:"#1D1D1F", lineHeight:1.2, margin:0 }}>{topic.name}</h1>
          {/* #12 copy section link */}
          <button onClick={() => { navigator.clipboard?.writeText(window.location.href.split("#")[0] + "#ntv-header").then(() => toast.show("Link copied")).catch(()=>{}); }}
            aria-label="Copy link to this topic"
            style={{ fontSize:12, color:"#7c3aed", background:"none", border:"none", cursor:"pointer", padding:4 }}>🔗</button>
          {/* #14 voice readout */}
          <button onClick={() => {
              if (!window.speechSynthesis) return toast.show("Voice unavailable");
              window.speechSynthesis.cancel();
              const txt = [topic.name, tc.key_takeaway, intuition.elevator_pitch || tc.intuition].filter(Boolean).join(". ");
              const u = new SpeechSynthesisUtterance(txt);
              u.rate = 1.05;
              window.speechSynthesis.speak(u);
              toast.show("Reading aloud…");
            }}
            aria-label="Listen to this topic"
            style={{ fontSize:11, padding:"4px 10px", borderRadius:999, background:"rgba(0,122,255,0.10)", color:"#007AFF", border:"none", cursor:"pointer", fontWeight:600 }}>▶ Listen</button>
        </div>
        {tc.key_takeaway && (
          <div style={{ background:"linear-gradient(135deg,#007AFF,#5856D6)", borderRadius:"12px", padding:"14px 18px", marginBottom:"16px" }}>
            <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(255,255,255,0.7)", marginBottom:"6px" }}>Key Takeaway</p>
            <p style={{ fontSize:"14px", color:"#FFFFFF", lineHeight:1.6, margin:0 }}>{tc.key_takeaway}</p>
          </div>
        )}
        {topic.prerequisite_knowledge?.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", alignItems:"center", marginBottom:"8px" }}>
            <span style={{ fontSize:"11px", color:"#AEAEB2", fontWeight:600 }}>NEEDS:</span>
            {topic.prerequisite_knowledge.map((p,i) => {
              const tid = prereqMap[p];
              return tid ? (
                <button key={i} onClick={() => navigate(`/ncert/topics/${tid}`)} className="ntv-btn"
                  style={{ fontSize:"12px", background:"#EEF4FF", color:"#007AFF", padding:"3px 10px",
                    borderRadius:"20px", fontWeight:600, border:"none", cursor:"pointer" }}>
                  {p} ↗
                </button>
              ) : (
                <span key={i} style={{ fontSize:"12px", background:"#F5F5F7", color:"#3A3A3C", padding:"3px 10px", borderRadius:"20px", fontWeight:500 }}>{p}</span>
              );
            })}
          </div>
        )}
        {topic.key_formulas?.length > 0 && (
          <div style={{ marginTop:"16px", paddingTop:"16px", borderTop:"1px solid #F2F2F7", display:"flex", alignItems:"center", gap:"12px" }}>
            <span style={{ fontSize:"20px" }}>🧩</span>
            <div>
              <p style={{ fontSize:"13px", fontWeight:700, color:"#5856D6", margin:"0 0 2px" }}>
                {topic.key_formulas.length} key formula{topic.key_formulas.length > 1 ? "s" : ""} — unlock via Formula Builder below
              </p>
              <p style={{ fontSize:"11px", color:"#AEAEB2", margin:0 }}>Complete the interactive quiz to reveal them ↓</p>
            </div>
          </div>
        )}
      </div>

      {/* ── MODE SELECTOR ─────────────────────────────────────── */}
      <ModeSelector mode={mode} onChange={setMode} />

      {/* ── SESSION TIMER ─────────────────────────────────────── */}
      {(() => {
        const target  = mode === "deep" ? 20 * 60 : 5 * 60;
        const pct     = Math.min(100, Math.round((sessionSecs / target) * 100));
        const done    = sessionSecs >= target;
        const fmt     = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
        return (
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={{ fontSize:"11px", fontWeight:700, color: done?"#34C759":"#AEAEB2", flexShrink:0, fontVariantNumeric:"tabular-nums" }}>
              ⏱ {fmt(sessionSecs)}
            </span>
            <div style={{ flex:1, height:"4px", background:"#F2F2F7", borderRadius:"2px", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, borderRadius:"2px", transition:"width 1s linear",
                background: done ? "#34C759" : mode==="deep" ? "#5856D6" : "#007AFF" }} />
            </div>
            <span style={{ fontSize:"11px", fontWeight:600, color:"#AEAEB2", flexShrink:0 }}>
              {done ? "✓ Done!" : (mode==="deep" ? "20:00" : "5:00")}
            </span>
          </div>
        );
      })()}

      {examples.length>0 && <ProgressBar done={exDone.size} total={examples.length} />}

      {/* ── HOOK (Math rich format) ───────────────────────────── */}
      {!isSciLike && intuition.hook && <HookCard text={intuition.hook} bmId={`${topicId}__hook`} />}

      {/* ── INTUITION (Science / English flat string) ─────────── */}
      {isSciLike && tc.intuition && (
        <>
          <div id="ntv-plain" data-section style={{ height:1, marginBottom:-1 }} aria-hidden="true" />
          <PlainEnglishCard text={tc.intuition} bmId={`${topicId}__plain`} />
          {mode==="deep" && <ConfidencePing sectionKey="plain" value={confidence.plain} onRate={rateSection} />}
        </>
      )}

      {/* ── IN PLAIN ENGLISH (Math only) ──────────────────────── */}
      {!isSciLike && intuition.elevator_pitch && (
        <>
          <div id="ntv-plain" data-section style={{ height:1, marginBottom:-1 }} aria-hidden="true" />
          <PlainEnglishCard text={intuition.elevator_pitch} bmId={`${topicId}__plain`} />
          {mode==="deep" && <ConfidencePing sectionKey="plain" value={confidence.plain} onRate={rateSection} />}
        </>
      )}

      {/* ── FEYNMAN CHALLENGE — Math deep only ────────────────── */}
      {!isSciLike && mode==="deep" && intuition.elevator_pitch && (
        <FeynmanBox concept={intuition.elevator_pitch?.slice(0,80)} topicName={topic.name} bmId={`${topicId}__feynman`} />
      )}

      {/* ── DIAGRAM (Science only) ────────────────────────────── */}
      {isSci && <Diagram topicId={topicId} />}

      {/* ── PROCESS EXPLANATION (Science / English) ───────────── */}
      {isSciLike && tc.process_explanation && (
        <div style={{ background:"#FFFFFF", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", padding:"24px 28px" }}>
          <h2 style={{ fontSize:"15px", fontWeight:700, color:"#34C759", margin:"0 0 12px" }}>⚙️ How It Works</h2>
          <p style={{ fontSize:"14px", lineHeight:1.75, color:"#3A3A3C", margin:0, whiteSpace:"pre-line" }}>{tc.process_explanation}</p>
        </div>
      )}

      {/* ── REAL-WORLD (Math only) ────────────────────────────── */}
      {!isSciLike && intuition.real_world_anchors?.length>0 && (
        <>
          <div id="ntv-real" data-section style={{ height:1, marginBottom:-1 }} aria-hidden="true" />
          <RealWorldCards anchors={intuition.real_world_anchors} bmId={`${topicId}__realworld`} />
          {mode==="deep" && <ConfidencePing sectionKey="real" value={confidence.real} onRate={rateSection} />}
        </>
      )}

      {/* ── CENTRAL IDEA (Math only) ──────────────────────────── */}
      {!isSciLike && intuition.the_pivot_idea && (
        <>
          <CentralIdeaCard text={intuition.the_pivot_idea} bmId={`${topicId}__central`} />
          {mode==="deep" && <ConfidencePing sectionKey="central" value={confidence.central} onRate={rateSection} />}
        </>
      )}

      {/* ── AHA MOMENT — Math deep only ───────────────────────── */}
      {!isSciLike && mode==="deep" && videoHooks.aha_reveal_moment && (
        <AhaRevealCard text={videoHooks.aha_reveal_moment} bmId={`${topicId}__aha`} />
      )}

      {/* ── DIAGRAM DESCRIPTION (Science deep only) ───────────── */}
      {isSci && mode==="deep" && tc.diagram_description && (
        <div style={{ background:"#F5F0FF", border:"1px solid #D8C7FF", borderRadius:"18px", padding:"24px 28px" }}>
          <h2 style={{ fontSize:"15px", fontWeight:700, color:"#5856D6", margin:"0 0 10px" }}>🖼 Diagram</h2>
          <p style={{ fontSize:"14px", lineHeight:1.75, color:"#3A3A3C", margin:0 }}>{tc.diagram_description}</p>
        </div>
      )}

      {/* ── DIAGRAMS — deep only ──────────────────────────────── */}
      {mode==="deep" && tc.svg_diagrams?.length>0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
          {tc.svg_diagrams.map((d, di) => (
            <div key={d.id} style={{ background:"#fff", padding:"28px", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
                <h3 style={{ margin:0, color:"#1D1D1F", fontWeight:700, fontSize:"16px" }}>{d.title}</h3>
                <SectionStar bmId={`${topicId}__diagram_${di}`} label={`Diagram — ${d.title}`} unsaved="#C7C7CC" />
              </div>
              <div style={{ lineHeight:0 }} dangerouslySetInnerHTML={{ __html: sanitizeSvg(d.svg) }} />
              {visualDescs[di] && <VisualDescToggle text={visualDescs[di]} />}
            </div>
          ))}
        </div>
      )}

      {/* ── FORMULA BLANKS ────────────────────────────────────── */}
      {topic.key_formulas?.length>0 && (
        <FormulaBlanks formulas={topic.key_formulas} state={formulaState} onAnswer={answerFormula} bmId={`${topicId}__formulas`} />
      )}

      {/* ── CHECKPOINT — deep only ────────────────────────────── */}
      {mode==="deep" && cpMisconception && !cpPassed && (
        <SectionCheckpoint misconception={cpMisconception} onPass={() => setCpPassed(true)} bmId={`${topicId}__checkpoint`} />
      )}

      {/* ── ERROR HUNT — deep only ────────────────────────────── */}
      {mode==="deep" && errorHuntExample && wrongIdx!=null && (
        <ErrorHunt
          example={errorHuntExample}
          wrongStepIdx={wrongIdx}
          misconceptionHint={ehHint}
          onComplete={ok => setErrorDone(ok)}
          bmId={`${topicId}__errorhunt`}
        />
      )}

      {/* ── WORKED EXAMPLE (Science / English flat string) ───── */}
      {isSciLike && tc.worked_example && typeof tc.worked_example === "string" && (
        <div style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
          <div style={{ background:"linear-gradient(90deg,#FF9500,#FF6B00)", padding:"12px 28px", display:"flex", alignItems:"center", gap:"8px" }}>
            <span>📝</span>
            <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>Worked Example</span>
            <SectionStar bmId={`${topicId}__workedex`} label="Worked Example" xStyle={{ marginLeft:"auto" }} />
          </div>
          <div style={{ padding:"20px 28px" }}>
            <p style={{ fontSize:"14px", lineHeight:1.75, color:"#3A3A3C", margin:0, whiteSpace:"pre-line" }}>{tc.worked_example}</p>
          </div>
        </div>
      )}

      {/* ── WORKED EXAMPLES (Math interactive) ───────────────── */}
      {showExamples && (
        <div id="ntv-examples" data-section style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
          <div style={{ background:"linear-gradient(90deg,#FF9500,#FF6B00)", padding:"12px 28px", display:"flex", alignItems:"center", gap:"8px" }}>
            <span>📝</span>
            <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>Worked Examples</span>
            <span style={{ marginLeft:"auto", fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.8)" }}>{examples.length} example{examples.length!==1?"s":""}</span>
            <SectionStar bmId={`${topicId}__workedex`} label="Worked Examples" />
          </div>
          <div style={{ padding:"20px", display:"flex", flexDirection:"column", gap:"16px" }}>
            {examples.map((ex,i) => (
              <InteractiveWorkedExample key={i} ex={ex} index={i} onDone={markExDone} deepMode={mode==="deep"} />
            ))}
          </div>
        </div>
      )}

      {showLock && (
        <div style={{ background:"#F5F5F7", borderRadius:"14px", padding:"18px 24px", display:"flex", alignItems:"center", gap:"12px", opacity:0.6 }}>
          <span style={{ fontSize:"20px" }}>🔒</span>
          <p style={{ fontSize:"13px", color:"#86868B", margin:0 }}>{examples.length} example{examples.length!==1?"s":""} locked — answer the knowledge check above</p>
        </div>
      )}

      {/* ── RECALL CARDS — deep only ──────────────────────────── */}
      {mode==="deep" && recallCards.length>0 && (
        <RecallCards cards={recallCards} ratings={recallRatings} onRate={rateRecall} bmId={`${topicId}__recall`} />
      )}

      {/* ── VIDEO PLAYER — deep only ──────────────────────────── */}
      {mode==="deep" && (
        <VideoPlayer topicName={topic.name} subject={isSci ? "Science" : isEng ? "English" : isHin ? "Hindi" : (chapterTitle || "Mathematics")} bmId={`${topicId}__video`} />
      )}

      {/* ── DERIVATION — deep only ────────────────────────────── */}
      {mode==="deep" && Object.keys(derivation).length>0 && (
        <Section title="🔬 How It Works" bmId={`${topicId}__derivation`}>
          <div style={{ display:"flex", flexDirection:"column", gap:"16px", marginTop:"16px" }}>
            {Object.entries(derivation).map(([key,val],i) => (
              <DerivationPart key={i} label={key.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())} val={val} />
            ))}
          </div>
        </Section>
      )}

      {/* ── COMMON MISTAKES ───────────────────────────────────── */}
      {misconceptions.length>0 && (<>
      <div id="ntv-mistakes" data-section style={{ height:1, marginBottom:-1 }} aria-hidden="true" />
        <Section title="⚠️ Common Mistakes" accent="#FF3B30" badge={`${misconceptions.length}`} defaultOpen={true} bmId={`${topicId}__mistakes`}>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginTop:"16px" }}>
            {misconceptions.map((m,i) => {
              if (typeof m === "string") {
                return mode==="deep"
                  ? <SciMisconceptionChallenge key={i} text={m} index={i} />
                  : (
                    <div key={i} style={{ background:"#FFF5F4", border:"1px solid #FFD0CC", borderRadius:"12px", padding:"14px 18px" }}>
                      <p style={{ fontSize:"14px", color:"#3A3A3C", margin:0 }}>⚠️ {m}</p>
                    </div>
                  );
              }
              return mode==="deep"
                ? <MisconceptionChallenge key={i} m={m} index={i} />
                : <MisconceptionCard key={i} m={m} />;
            })}
          </div>
        </Section>
      </>)}

      {/* ── DEEP-ONLY SECTIONS ────────────────────────────────── */}
      {mode==="deep" && (
        <>
          {tc.shortcuts_and_tricks?.length>0 && (
            <Section title="⚡ Shortcuts & Tricks" accent="#34C759" badge={`${tc.shortcuts_and_tricks.length}`} bmId={`${topicId}__shortcuts`}>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginTop:"16px" }}>
                {tc.shortcuts_and_tricks.map((s,i) => {
                  if (typeof s === "string") {
                    return (
                      <div key={i} style={{ background:"#F0FFF4", border:"1px solid #C6F0D1", borderRadius:"12px", padding:"14px 18px" }}>
                        <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>⚡ {s}</p>
                      </div>
                    );
                  }
                  return (
                    <div key={i} style={{ background:"#F0FFF4", border:"1px solid #C6F0D1", borderRadius:"12px", padding:"14px 18px" }}>
                      <p style={{ fontSize:"13px", fontWeight:700, color:"#34C759", marginBottom:"4px" }}>{s.shortcut}</p>
                      {s.rule && <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, marginBottom:"4px" }}>{s.rule}</p>}
                      {s.example && <p style={{ fontSize:"13px", ...S.mono, color:"#3A3A3C", marginBottom:"4px" }}>{s.example}</p>}
                      {s.when_to_use && <div style={{ display:"flex", gap:"6px", marginTop:"4px" }}><span>💡</span><p style={{ fontSize:"12px", color:"#007AFF", fontStyle:"italic", margin:0 }}>{s.when_to_use}</p></div>}
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {Object.keys(whenToUse).length>0 && (
            <Section title="🎯 When to Use This Method" bmId={`${topicId}__whentouse`}>
              <div style={{ display:"flex", flexDirection:"column", gap:"14px", marginTop:"16px" }}>
                {Object.entries(whenToUse).map(([key, val], i) => {
                  const label   = key.replace(/_/g," ").replace(/\b\w/g, c => c.toUpperCase());
                  const isAvoid = /instead|not_|neither|avoid/i.test(key);
                  const isDecision = /decision|question/i.test(key);
                  const isSpeed    = /speed|time|step|log/i.test(key);
                  const accent  = isAvoid ? "#FF9500" : isDecision ? "#007AFF" : isSpeed ? "#AF52DE" : "#34C759";
                  const bg      = isAvoid ? "#FFF5F0" : isDecision ? "#EEF4FF" : isSpeed ? "#F5F0FF" : "#F0FFF4";
                  const symbol  = isAvoid ? "✗" : "✓";

                  if (Array.isArray(val) && val.length > 0) return (
                    <div key={i}>
                      <p style={{ fontSize:"11px", fontWeight:700, color:accent, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"8px" }}>{label}</p>
                      <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                        {val.map((item, j) => (
                          <div key={j} style={{ display:"flex", gap:"10px", background:bg, borderRadius:"8px", padding:"9px 12px" }}>
                            <span style={{ color:accent, fontWeight:800, flexShrink:0, fontSize:"13px" }}>{symbol}</span>
                            <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>
                              {typeof item === "string" ? item : item.text || JSON.stringify(item)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                  if (typeof val === "string" && val) return (
                    <div key={i} style={{ background:bg, borderRadius:"10px", padding:"12px 16px" }}>
                      <p style={{ fontSize:"11px", fontWeight:700, color:accent, marginBottom:"6px", letterSpacing:"1px", textTransform:"uppercase" }}>{label}</p>
                      <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>{val}</p>
                    </div>
                  );

                  return null;
                })}
              </div>
            </Section>
          )}

          {tc.edge_cases?.length>0 && (
            <Section title="🔍 Edge Cases" badge={`${tc.edge_cases.length}`} bmId={`${topicId}__edgecases`}>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginTop:"16px" }}>
                {tc.edge_cases.map((e,i) => (
                  <div key={i} style={{ background:"#F5F5F7", borderRadius:"10px", padding:"12px 16px" }}>
                    <p style={{ fontSize:"13px", fontWeight:700, color:"#1D1D1F", marginBottom:"4px" }}>{e.case} <span style={{ color:"#007AFF" }}>→ {e.value}</span></p>
                    {e.reasoning && <p style={{ fontSize:"12px", color:"#86868B", lineHeight:1.6, margin:"0 0 4px" }}>{e.reasoning}</p>}
                    {e.where_it_appears && <p style={{ fontSize:"12px", color:"#007AFF", fontStyle:"italic", margin:0 }}>{e.where_it_appears}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {intuition.wrong_intuitions_to_replace?.length>0 && (
            <Section title="🧠 Wrong Intuitions to Replace" bmId={`${topicId}__wrongintuit`}>
              <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginTop:"16px" }}>
                {intuition.wrong_intuitions_to_replace.map((w,i) => (
                  <div key={i} style={{ display:"flex", gap:"10px", background:"#FFF5F5", borderRadius:"10px", padding:"10px 14px" }}>
                    <span style={{ fontWeight:800, color:"#FF3B30" }}>×</span>
                    <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>{w}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {intuition.analogy_from_other_domain && (
            <Section title="🌉 Analogy from Another Domain" bmId={`${topicId}__analogy`}>
              <div style={{ background:"#F5F0FF", borderRadius:"10px", padding:"16px 18px", marginTop:"16px", borderLeft:"3px solid #AF52DE" }}>
                <p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.8, margin:0, fontStyle:"italic" }}>{intuition.analogy_from_other_domain}</p>
              </div>
            </Section>
          )}

          {intuition.historical_context && (
            <Section title="📜 Historical Context" bmId={`${topicId}__history`}>
              <p style={{ fontSize:"13px", color:"#86868B", lineHeight:1.8, marginTop:"16px" }}>{intuition.historical_context}</p>
            </Section>
          )}

          {intuition.why_it_matters && (
            <Section title="🚀 Why This Matters" bmId={`${topicId}__whymatters`}>
              <p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.7, marginTop:"16px" }}>{intuition.why_it_matters}</p>
            </Section>
          )}

          {/* ── CONFIDENCE SUMMARY ──────────────────────────────── */}
          <ConfidenceSummary confidence={confidence} sections={confidenceSections} />
        </>
      )}

      {/* ── CLOSING CHALLENGE ─────────────────────────────────── */}
      {(videoHooks.closing_question || (isSciLike && tc.key_takeaway)) && (
        <ClosingChallenge
          question={videoHooks.closing_question || `What is the key takeaway from ${topic.name}?`}
          hint={videoHooks.transition_to_practice || tc.key_takeaway}
          bmId={`${topicId}__challenge`}
        />
      )}

      {/* ── TOPIC NAV (bottom) ────────────────────────────────── */}
      {siblings.length > 1 && (
        <TopicNavBar prev={prevTopic} next={nextTopic} studied={studied}
          onToggle={toggleStudied} onNavigate={id => navigate(`/ncert/topics/${id}`)} />
      )}

      {/* ── MY NOTES ──────────────────────────────────────────── */}
      <div id="ntv-notes" data-section style={{ height:1, marginBottom:-1 }} aria-hidden="true" />
      <TopicNote topicId={topicId} topicName={topic.name} bmId={`${topicId}__notes`} />

      {/* ── ADAPTIVE PRACTICE ─────────────────────────────────── */}
      {/* practiceTopicName uses the chapter title ("Real Numbers") which matches Question.topic in the DB */}
      <div id="ntv-practice" data-section style={{ height:1, marginBottom:-1 }} aria-hidden="true" />
      <MasteryPractice topicId={topic.topicId} topicName={chapterTitle || topic.name} bmId={`${topicId}__adaptive`} />

      {/* ── PAPER PRACTICE ────────────────────────────────────── */}
      <PaperPractice topicId={topic.topicId} bmId={`${topicId}__paper`} />

          </main>

          {/* ── #9 RIGHT RAIL ─────────────────────────────────── */}
          <aside className="hidden lg:block">
            <TopicRightRail
              topic={topic}
              keyFormulas={topic.key_formulas}
              prereqs={topic.prerequisite_knowledge}
              prereqMap={prereqMap}
              sections={tocSections}
              activeSection={activeSec}
              onJump={jumpToSection}
              nextUp={nextUp}
              onNav={(id) => navigate(`/ncert/topics/${id}`)}
              masteryState={masteryState}
              lastReview={null}
              dueIn={null}
              cohortSize={1247}
              cohortAvgMin={Math.max(8, examples.length * 4 + 8)}
              learningOutcomes={learningOutcomes}
            />
          </aside>
        </div>

        {/* #4 #5 Sticky floating actions */}
        <TopicStickyActions
          onPractice={() => navigate("/practice", { state: { topic: chapterTitle || topic.name } })}
          onAskAI={() => setAiOpen(true)}
        />
        {aiOpen && (
          <TopicAITutor
            topicName={topic.name}
            subject={currentSubject}
            onClose={() => setAiOpen(false)}
          />
        )}
      </div>
    </TopicErrorBoundary>
  );
}
