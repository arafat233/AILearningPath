import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  startTopic, submitAnswer, evaluateExplanation, flagQuestion,
  getTopics, getHint, toggleBookmark, startBookmarkPractice,
  startRetryPractice, getBookmarks, rateAIResponse, askTutor,
} from "../services/api";
import { useAuthStore } from "../store/authStore";
import AICreditsIndicator from "../components/AICreditsIndicator";
import { enqueueAttempt, flushQueue, getQueuedCount } from "../utils/offlineQueue";

const SUBJECTS = [
  { id: "Math",          label: "Maths",   color: "#007AFF" },
  { id: "Science",       label: "Science", color: "#34C759" },
  { id: "English",       label: "English", color: "#FF9500" },
  { id: "Social Science",label: "Social",  color: "#AF52DE" },
  { id: "Hindi",         label: "Hindi",   color: "#FF3B30" },
];

const SCIENCE_SUBS = {
  Physics:   ["Light — Reflection and Refraction","Human Eye and Colourful World","Electricity","Magnetic Effects of Electric Current","Sources of Energy"],
  Chemistry: ["Chemical Reactions and Equations","Acids, Bases and Salts","Metals and Non-metals","Carbon and Its Compounds","Periodic Classification of Elements"],
  Biology:   ["Life Processes","Control and Coordination","How Do Organisms Reproduce","Heredity and Evolution","Our Environment","Sustainable Management of Natural Resources"],
};

const BEHAVIOR = {
  guessing:          { text: "Guessing detected",    bg: "bg-apple-orange/10", text_c: "text-apple-orange" },
  concept_error:     { text: "Concept misunderstood",bg: "bg-apple-red/10",    text_c: "text-apple-red"    },
  calculation_error: { text: "Calculation mistake",  bg: "bg-apple-yellow/10", text_c: "text-apple-yellow" },
  partial_logic:     { text: "Missed a step",        bg: "bg-apple-purple/10", text_c: "text-apple-purple" },
  misinterpretation: { text: "Misread question",     bg: "bg-apple-blue/10",   text_c: "text-apple-blue"   },
  correct:           { text: "Correct",              bg: "bg-apple-green/10",  text_c: "text-apple-green"  },
};

const DIFF_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" };
const DIFF_STAR  = { easy: "★☆☆", medium: "★★☆", hard: "★★★" };
const DIFF_COLOR = {
  easy:   { bg: "bg-[#34C759]/10", text: "text-[#34C759]" },
  medium: { bg: "bg-[#FF9500]/10", text: "text-[#FF9500]" },
  hard:   { bg: "bg-[#FF3B30]/10", text: "text-[#FF3B30]" },
};

function diffLevel(score) {
  return score < 0.4 ? "easy" : score < 0.7 ? "medium" : "hard";
}

function fmtTime(secs) {
  const m = Math.floor(secs / 60);
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function Practice() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const user      = useAuthStore((s) => s.user);
  const mixTopics     = location.state?.mixTopics     || null;
  const retryWrongIds = location.state?.retryWrongIds || null;

  const [topics, setTopics]                 = useState([]);
  const [selectedTopic, setSelectedTopic]   = useState(location.state?.topic || "");
  const [activeSubject, setActiveSubject]   = useState(location.state?.topic ? "" : (user?.subject || "Math"));
  const [scienceSub,    setScienceSub]      = useState(null);
  const [question, setQuestion]             = useState(null);
  const [feedback, setFeedback]             = useState(null);
  const [confidence, setConfidence]         = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading]               = useState(false);
  const [answering, setAnswering]           = useState(false);
  const [sessionStats, setSessionStats]     = useState({ correct: 0, total: 0 });
  const [foundationMsg, setFoundationMsg]   = useState(null);
  const [showSteps, setShowSteps]           = useState(false);
  const [recallMode, setRecallMode]         = useState(true);
  const [recallAttempt, setRecallAttempt]   = useState("");
  const [evalFeedback, setEvalFeedback]     = useState(null);
  const [evalLoading, setEvalLoading]       = useState(false);
  const [flagged, setFlagged]               = useState(false);
  const [bookmarked, setBookmarked]         = useState(false);
  const [hint, setHint]                     = useState(null);
  const [hintLoading, setHintLoading]       = useState(false);
  const [explRating, setExplRating]         = useState(null);
  const [showSummary, setShowSummary]       = useState(false);
  const [wrongAnswers, setWrongAnswers]     = useState([]);
  const [error, setError]                   = useState("");
  const [bookmarkMode, setBookmarkMode]     = useState(false);
  const [bookmarkCount, setBookmarkCount]   = useState(0);
  const [elapsed, setElapsed]               = useState(0);
  const [timeLimit, setTimeLimit]           = useState(null);
  const [timeWarning, setTimeWarning]       = useState(false);
  const [isOnline, setIsOnline]             = useState(navigator.onLine);
  const [queuedCount, setQueuedCount]       = useState(0);

  // Doubt chat state
  const [chatOpen, setChatOpen]       = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput]     = useState("");
  const [chatTyping, setChatTyping]   = useState(false);

  const startTimeRef   = useRef(null);
  const handleAnswerRef = useRef(null);
  const timerRef       = useRef(null);
  const chatEndRef     = useRef(null);

  // Keyboard: A/B/C/D selects option, Enter submits selected
  useEffect(() => {
    if (!question || feedback) return;
    const onKey = (e) => {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
      const idx = ["a","b","c","d"].indexOf(e.key.toLowerCase());
      if (idx !== -1 && question.options?.[idx]) setSelectedOption(idx);
      if (e.key === "Enter" && selectedOption !== null) handleAnswerRef.current(selectedOption);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question, feedback, selectedOption]);

  // Timer per question
  useEffect(() => {
    if (question && !feedback) {
      startTimeRef.current = Date.now();
      setElapsed(0);
      setTimeWarning(false);
      const limit = question.expectedTime ? question.expectedTime * 2 : null;
      setTimeLimit(limit);
      timerRef.current = setInterval(() => {
        const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsed(secs);
        if (limit) {
          if (secs >= limit - 5) setTimeWarning(true);
          if (secs >= limit) {
            clearInterval(timerRef.current);
            handleAnswerRef.current(-1);
          }
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [question, feedback]);

  // Seed chat welcome when question changes
  useEffect(() => {
    if (question?._id) {
      setSelectedOption(null);
      setChatMessages([{
        role: "assistant",
        content: `Hi! I'm Stellar. I can help you with this ${selectedTopic || "question"}. Ask me anything about the concept or your approach.`,
      }]);
    }
  }, [question?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatTyping]);

  const handleSendChat = async () => {
    const msg = chatInput.trim();
    if (!msg || chatTyping) return;
    const updated = [...chatMessages, { role: "user", content: msg }];
    setChatMessages(updated);
    setChatInput("");
    setChatTyping(true);
    try {
      const history = updated.slice(0, -1);
      const { data } = await askTutor(msg, history, selectedTopic, activeSubject);
      const reply = data?.message || data?.reply || data?.data?.message || "I can help with that — try rephrasing your question.";
      setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble connecting. Try again in a moment." }]);
    } finally {
      setChatTyping(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    setError("");
    setQuestion(null);
    setFeedback(null);
    setFoundationMsg(null);
    setFlagged(false);
    setSelectedOption(null);

    if (retryWrongIds?.length) {
      try {
        const { data } = await startRetryPractice(retryWrongIds);
        setQuestion(data);
      } catch (err) {
        setError(err.response?.data?.error || "Could not load retry questions");
      } finally { setLoading(false); }
      return;
    }

    if (bookmarkMode) {
      try {
        const { data } = await startBookmarkPractice();
        setQuestion(data);
      } catch (err) {
        setError(err.response?.data?.error || "No bookmarked questions to practice");
      } finally { setLoading(false); }
      return;
    }

    const topic = mixTopics?.length
      ? mixTopics[Math.floor(Math.random() * mixTopics.length)]
      : selectedTopic;
    if (!topic) { setLoading(false); return; }
    try {
      const { data } = await startTopic(topic);
      if (data.foundationRedirect) {
        setFoundationMsg(data.message);
        setQuestion(data.question);
      } else {
        setQuestion(data);
      }
      if (mixTopics) setSelectedTopic(topic);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to start topic");
    } finally { setLoading(false); }
  };

  const handleAnswer = async (optionIndex) => {
    if (answering || !question) return;
    clearInterval(timerRef.current);
    const timeTaken = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
    setAnswering(true);
    try {
      const { data } = await submitAnswer({
        selectedOptionIndex: optionIndex,
        timeTaken,
        confidence: confidence || "medium",
      });
      setFeedback(data);
      setSessionStats((s) => ({
        correct: s.correct + (data.isCorrect ? 1 : 0),
        total:   s.total + 1,
      }));
      if (!data.isCorrect) {
        setWrongAnswers((w) => [...w, {
          questionText:        question.questionText,
          selectedOptionIndex: optionIndex,
          correctOptionIndex:  data.correctOptionIndex,
          options:             question.options,
          aiExplanation:       data.aiExplanation,
          topic:               selectedTopic,
        }]);
      }
    } catch (err) {
      const offline = !navigator.onLine || err.code === "ERR_NETWORK";
      if (offline) {
        await enqueueAttempt({ selectedOptionIndex: optionIndex, timeTaken, confidence: confidence || "medium" }).catch(() => {});
        setQueuedCount((c) => c + 1);
        setError("You're offline — answer saved and will sync when you reconnect.");
      } else {
        setError(err.response?.data?.error || "Submit failed");
      }
    } finally {
      setAnswering(false);
    }
  };

  handleAnswerRef.current = handleAnswer;

  const handleEvaluate = async () => {
    if (!recallAttempt.trim() || evalLoading) return;
    setEvalLoading(true);
    try {
      const concept = question?.conceptTested || selectedTopic;
      const { data } = await evaluateExplanation(concept, recallAttempt);
      setEvalFeedback(data.feedback);
    } catch {
      setEvalFeedback("Could not evaluate — try showing the solution directly.");
    } finally { setEvalLoading(false); }
  };

  const handleHint = async () => {
    if (hintLoading || hint || !question) return;
    setHintLoading(true);
    try {
      const { data } = await getHint(question.questionText, selectedTopic);
      setHint(data.hint);
    } catch {
      setHint("Think step by step — which formula or concept applies here?");
    } finally { setHintLoading(false); }
  };

  const handleFlag = async () => {
    if (!question?._id || flagged) return;
    try { await flagQuestion(question._id); setFlagged(true); } catch {}
  };

  const handleBookmark = async () => {
    if (!question?._id) return;
    try {
      const { data } = await toggleBookmark(question._id);
      setBookmarked(data.bookmarked);
      setBookmarkCount((c) => data.bookmarked ? c + 1 : Math.max(0, c - 1));
    } catch {}
  };

  const handleNext = () => {
    setRecallMode(true);
    setRecallAttempt("");
    setEvalFeedback(null);
    setShowSteps(false);
    setFlagged(false);
    setBookmarked(false);
    setHint(null);
    setHintLoading(false);
    setExplRating(null);
    setSelectedOption(null);
    if (!bookmarkMode && feedback?.nextQuestion) {
      setQuestion(feedback.nextQuestion);
      setFeedback(null);
      setConfidence("");
    } else {
      handleStart();
    }
  };

  const handleBackToTopics = () => {
    clearInterval(timerRef.current);
    setQuestion(null); setFeedback(null); setFoundationMsg(null);
    setEvalFeedback(null); setRecallMode(true); setRecallAttempt("");
    setShowSteps(false); setHint(null); setHintLoading(false); setExplRating(null);
    setFlagged(false); setBookmarked(false); setConfidence(""); setSelectedOption(null);
    setSessionStats({ correct: 0, total: 0 }); setWrongAnswers([]);
    setError("");
    navigate("/practice", { replace: true });
  };

  // Load bookmark count
  useEffect(() => {
    getBookmarks().then((r) => setBookmarkCount(r.data?.length || 0)).catch(() => {});
  }, []);

  // Offline detection + flush
  useEffect(() => {
    getQueuedCount().then(setQueuedCount).catch(() => {});
    const goOnline = async () => {
      setIsOnline(true);
      const flushed = await flushQueue((payload) => submitAnswer(payload)).catch(() => 0);
      if (flushed > 0) setQueuedCount(0);
    };
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Load topics for active subject
  useEffect(() => {
    if (!activeSubject) return;
    getTopics({ grade: user?.grade || "10", subject: activeSubject })
      .then((r) => setTopics(r.data.map((t) => t.name)))
      .catch(() => {});
  }, [activeSubject, user?.grade]);

  // Auto-start when arriving with pre-selected topic / retry mode
  useEffect(() => {
    if ((mixTopics?.length || location.state?.autoStart || retryWrongIds?.length) && !question) handleStart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Topic selector ──────────────────────────────────────────────────
  if (!question) {
    const subjectColor = SUBJECTS.find((s) => s.id === activeSubject)?.color || "#007AFF";
    const filteredTopics = (activeSubject === "Science" && scienceSub)
      ? topics.filter((t) => SCIENCE_SUBS[scienceSub]?.includes(t))
      : topics;

    return (
      <div className="space-y-5">
        <OfflineBanner isOnline={isOnline} queuedCount={queuedCount} />
        <div>
          <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Practice</h1>
          <p className="text-[14px] text-apple-gray mt-0.5">
            {mixTopics ? `Mixed session: ${mixTopics.join(", ")}` : "Select a subject and topic to begin"}
          </p>
        </div>

        {retryWrongIds?.length > 0 && (
          <div className="bg-apple-orange/10 border border-apple-orange/25 text-apple-orange text-[13px] px-4 py-3 rounded-xl font-medium">
            Retrying {retryWrongIds.length} wrong question{retryWrongIds.length !== 1 ? "s" : ""} from your last exam — loading…
          </div>
        )}

        {!mixTopics && (
          <div className="flex gap-1.5 flex-wrap">
            {SUBJECTS.map(({ id, label, color }) => (
              <button key={id}
                onClick={() => { setActiveSubject(id); setSelectedTopic(""); setScienceSub(null); setBookmarkMode(false); }}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
                style={!bookmarkMode && activeSubject === id
                  ? { background: color, color: "#fff" }
                  : { background: color + "14", color }}
              >{label}</button>
            ))}
            {bookmarkCount > 0 && (
              <button
                onClick={() => { setBookmarkMode(true); setSelectedTopic(""); setScienceSub(null); }}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
                style={bookmarkMode ? { background: "#FF9500", color: "#fff" } : { background: "#FF950014", color: "#FF9500" }}
              >☆ Saved ({bookmarkCount})</button>
            )}
          </div>
        )}

        {!mixTopics && !bookmarkMode && activeSubject === "Science" && (
          <div className="flex gap-1.5">
            {["All","Physics","Chemistry","Biology"].map((s) => (
              <button key={s}
                onClick={() => { setScienceSub(s === "All" ? null : s); setSelectedTopic(""); }}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
                  (s === "All" && !scienceSub) || scienceSub === s
                    ? "bg-[#34C759] text-white border-[#34C759]"
                    : "bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20 hover:border-[#34C759]/50"
                }`}
              >{s}</button>
            ))}
          </div>
        )}

        {bookmarkMode ? (
          <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm p-8 text-center space-y-3">
            <div className="text-[40px]">☆</div>
            <p className="text-[17px] font-semibold text-[var(--label)]">Practice from Saved Questions</p>
            <p className="text-[13px] text-apple-gray">
              {bookmarkCount} bookmarked question{bookmarkCount !== 1 ? "s" : ""} · questions you haven't seen recently come first
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm p-6">
            <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-3">
              {scienceSub ? `${scienceSub} Topics` : `${activeSubject} Topics`}
            </p>
            {filteredTopics.length === 0 ? (
              <p className="text-[13px] text-apple-gray">Loading topics…</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {filteredTopics.map((t) => (
                  <button key={t} onClick={() => setSelectedTopic(t)}
                    className={`p-3.5 rounded-xl text-[13px] font-medium text-left transition-all duration-150 active:scale-[0.97] ${
                      selectedTopic === t ? "text-white shadow-sm" : "bg-[#F2F2F7] text-[var(--label)] hover:bg-[#E5E5EA]"
                    }`}
                    style={selectedTopic === t ? { background: subjectColor } : {}}
                  >{t}</button>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-apple-red/8 border border-apple-red/20 text-apple-red text-[13px] px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button onClick={handleStart} disabled={(!bookmarkMode && !selectedTopic) || loading}
          className="w-full py-3 rounded-xl text-[15px] font-semibold text-white transition-all disabled:opacity-40"
          style={bookmarkMode ? { background: "#FF9500" } : selectedTopic ? { background: subjectColor } : { background: "#C7C7CC" }}
        >
          {loading ? "Loading…" : bookmarkMode ? "Start Bookmark Practice →" : "Start Practice →"}
        </button>
      </div>
    );
  }

  // ── Session summary ──────────────────────────────────────────────────
  if (showSummary) {
    const accuracy  = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
    const grade     = accuracy >= 80 ? "Excellent" : accuracy >= 60 ? "Good" : accuracy >= 40 ? "Keep Going" : "Needs Work";
    const gradeColor = accuracy >= 80 ? "text-[#34C759]" : accuracy >= 60 ? "text-[#007AFF]" : accuracy >= 40 ? "text-[#FF9500]" : "text-[#FF3B30]";

    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Session Summary</h1>
          <p className="text-[14px] text-apple-gray mt-0.5">{selectedTopic}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm p-8 text-center">
          <div className={`text-[56px] font-bold tracking-tight ${gradeColor}`}>{accuracy}%</div>
          <p className={`text-[17px] font-semibold mt-1 ${gradeColor}`}>{grade}</p>
          <p className="text-[14px] text-apple-gray mt-1">
            {sessionStats.correct} correct out of {sessionStats.total} questions
          </p>
          <div className="mt-5 h-2 bg-[#F2F2F7] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${accuracy}%`, background: accuracy >= 60 ? "#34C759" : accuracy >= 40 ? "#FF9500" : "#FF3B30" }} />
          </div>
        </div>

        {wrongAnswers.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm p-6 space-y-4">
            <p className="text-[13px] font-bold text-[var(--label)] uppercase tracking-wider">
              Missed Questions ({wrongAnswers.length})
            </p>
            {wrongAnswers.map((w, idx) => (
              <div key={idx} className="border border-[#F2F2F7] rounded-xl p-4 space-y-2">
                <p className="text-[14px] font-medium text-[var(--label)]">{w.questionText}</p>
                <div className="space-y-1">
                  {w.options?.map((opt, i) => (
                    <div key={i} className={`flex items-center gap-2 text-[13px] px-3 py-1.5 rounded-lg ${
                      i === w.correctOptionIndex   ? "bg-[#34C759]/10 text-[#34C759] font-medium" :
                      i === w.selectedOptionIndex  ? "bg-[#FF3B30]/10 text-[#FF3B30] line-through opacity-70" :
                      "text-[#8E8E93]"
                    }`}>
                      <span className="text-[11px]">{String.fromCharCode(65 + i)}.</span>
                      {opt.text}
                      {i === w.correctOptionIndex && <span className="ml-auto text-[11px]">Correct</span>}
                      {i === w.selectedOptionIndex && i !== w.correctOptionIndex && <span className="ml-auto text-[11px]">Your answer</span>}
                    </div>
                  ))}
                </div>
                {w.aiExplanation && (
                  <div className="bg-[#007AFF]/6 border border-[#007AFF]/15 rounded-xl px-3 py-2 mt-2">
                    <p className="text-[11px] font-bold text-[#007AFF] uppercase tracking-wider mb-1">Why?</p>
                    <p className="text-[13px] text-[var(--label2)] leading-relaxed">{w.aiExplanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowSummary(false); setQuestion(null); setFeedback(null);
              setSessionStats({ correct: 0, total: 0 }); setWrongAnswers([]); setFoundationMsg(null);
              navigate("/practice", { replace: true });
            }}
            className="flex-1 py-3 rounded-xl text-[15px] font-semibold border border-[#E5E5EA] text-[var(--label)] hover:bg-[#F2F2F7] transition-all"
          >← Back to Topics</button>
          <button
            onClick={() => {
              setShowSummary(false); setQuestion(null); setFeedback(null);
              setSessionStats({ correct: 0, total: 0 }); setWrongAnswers([]); setFoundationMsg(null);
              setRecallMode(true); setRecallAttempt(""); setEvalFeedback(null);
              setShowSteps(false); setFlagged(false); setBookmarked(false);
              setHint(null); setHintLoading(false); setExplRating(null);
              setConfidence(""); setSelectedOption(null); setError("");
              handleStart();
            }}
            className="flex-1 py-3 rounded-xl text-[15px] font-semibold bg-[#1C1C1E] text-white hover:bg-[#3A3A3C] transition-all"
          >New Session →</button>
        </div>
      </div>
    );
  }

  // ── Question screen ──────────────────────────────────────────────────
  const diff         = diffLevel(question.difficultyScore);
  const behaviorInfo = feedback ? BEHAVIOR[feedback.behavior] || BEHAVIOR.concept_error : null;

  return (
    <div className="flex flex-col gap-4">
      <OfflineBanner isOnline={isOnline} queuedCount={queuedCount} />

      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={handleBackToTopics}
            className="text-[13px] font-medium text-[#8E8E93] hover:text-[var(--label)] transition-colors flex items-center gap-1">
            ← Back
          </button>
          <span className="text-[#C7C7CC] text-[11px]">/</span>
          <span className="text-[11px] font-bold text-[#8E8E93] tracking-widest uppercase">
            Practice · {bookmarkMode ? "Saved" : selectedTopic}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[12px] font-semibold text-[var(--label)]">
            {sessionStats.correct}/{sessionStats.total} <span className="font-normal text-[#8E8E93]">correct</span>
          </div>
          {sessionStats.total > 0 && (
            <button
              onClick={() => { clearInterval(timerRef.current); setShowSummary(true); }}
              className="text-[12px] font-medium text-[#FF3B30] border border-[#FF3B30]/30 px-3 py-1.5 rounded-lg hover:bg-[#FF3B30]/8 transition-colors"
            >End Session</button>
          )}
          <button
            onClick={() => setChatOpen((o) => !o)}
            className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              chatOpen
                ? "bg-[#1C1C1E] text-white border-[#1C1C1E]"
                : "border-[#E5E5EA] text-[#3A3A3C] hover:border-[#C7C7CC]"
            }`}
          >💬 Stellar</button>
        </div>
      </div>

      {error && (
        <div className="bg-[#FF3B30]/8 border border-[#FF3B30]/20 text-[#FF3B30] text-[13px] px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Two-panel layout */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* ── Left: Question panel ── */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm p-6 space-y-5">

            {/* Progress row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-[#8E8E93] font-medium">
                  Question {sessionStats.total + 1}
                </span>
                <div className="flex gap-1 items-center">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className={`rounded-full transition-all duration-300 ${
                      i < sessionStats.total
                        ? "w-2 h-2 bg-[#007AFF]"
                        : i === sessionStats.total
                        ? "w-2.5 h-2.5 bg-[#007AFF] ring-2 ring-[#007AFF]/25"
                        : "w-2 h-2 bg-[#E5E5EA]"
                    }`} />
                  ))}
                </div>
              </div>
              <div className={`text-[13px] font-mono font-semibold tabular-nums ${timeWarning ? "text-[#FF3B30]" : "text-[#8E8E93]"}`}>
                {fmtTime(elapsed)}
                {timeLimit && <span className="text-[11px] font-normal"> / {fmtTime(timeLimit)}</span>}
              </div>
            </div>

            {/* Time progress bar */}
            {timeLimit && !feedback && (
              <div className="h-1 bg-[#F2F2F7] rounded-full overflow-hidden -mt-2">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.max(0, ((timeLimit - elapsed) / timeLimit) * 100)}%`,
                    background: timeWarning ? "#FF3B30" : elapsed / timeLimit > 0.5 ? "#FF9500" : "#34C759",
                  }} />
              </div>
            )}

            {/* Topic pills */}
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-[#007AFF] text-white">
                {bookmarkMode ? "Saved" : selectedTopic}
              </span>
              {question.conceptTested && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border border-[#C7C7CC] text-[#3A3A3C]">
                  {question.conceptTested}
                </span>
              )}
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold ${DIFF_COLOR[diff].bg} ${DIFF_COLOR[diff].text}`}>
                {DIFF_STAR[diff]} {DIFF_LABEL[diff]}
              </span>
              {question.isAIGenerated && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-[#AF52DE]/10 text-[#AF52DE]">
                  AI Generated
                </span>
              )}
            </div>

            {/* Foundation warning */}
            {foundationMsg && (
              <div className="flex items-start gap-3 bg-[#FF9500]/8 border border-[#FF9500]/20 rounded-xl px-4 py-3">
                <span className="text-[#FF9500] mt-0.5">⚠️</span>
                <p className="text-[13px] text-[#FF9500]">{foundationMsg}</p>
              </div>
            )}

            {/* Case passage */}
            {question.caseContext && (
              <div className="bg-[#F2F2F7] border border-[#E5E5EA] rounded-xl px-4 py-3">
                <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-1">Read the passage</p>
                <p className="text-[13px] text-[var(--label2)] leading-relaxed">{question.caseContext}</p>
              </div>
            )}

            {/* Question text */}
            {question.questionType === "assertion_reason" ? (
              <AssertionReasonText text={question.questionText} />
            ) : (
              <p className="text-[18px] font-semibold text-[var(--label)] leading-snug">
                {question.questionText}
              </p>
            )}

            {/* MCQ options */}
            <div className="flex flex-col gap-2">
              {question.options?.map((opt, i) => {
                let containerCls = "";
                let labelCls = "";
                if (feedback) {
                  if (i === feedback.correctOptionIndex) {
                    containerCls = "bg-[#34C759]/8 border-[#34C759]/40 text-[#34C759]";
                    labelCls = "bg-[#34C759] text-white";
                  } else if (i === feedback.selectedOptionIndex && !feedback.isCorrect) {
                    containerCls = "bg-[#FF3B30]/8 border-[#FF3B30]/40 text-[#FF3B30]";
                    labelCls = "bg-[#FF3B30] text-white";
                  } else {
                    containerCls = "bg-[#F2F2F7] border-[#E5E5EA] text-[#8E8E93] cursor-default";
                    labelCls = "bg-[#E5E5EA] text-[#8E8E93]";
                  }
                } else if (selectedOption === i) {
                  containerCls = "bg-[#007AFF] border-[#007AFF] text-white";
                  labelCls = "bg-white/20 text-white";
                } else {
                  containerCls = "bg-white border-[#E5E5EA] text-[var(--label)] hover:border-[#007AFF]/40 hover:bg-[#007AFF]/4";
                  labelCls = "bg-[#F2F2F7] text-[#8E8E93]";
                }
                return (
                  <button key={i}
                    onClick={() => !feedback && !answering && setSelectedOption(i)}
                    disabled={!!feedback || answering}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border text-[14px] font-medium
                                transition-all duration-150 active:scale-[0.99] flex items-center gap-3 ${containerCls}`}
                  >
                    <span className={`text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${labelCls}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt.text}</span>
                    {feedback && i === feedback.correctOptionIndex && (
                      <span className="ml-auto text-[11px] font-bold">✓ Correct</span>
                    )}
                    {feedback && i === feedback.selectedOptionIndex && !feedback.isCorrect && (
                      <span className="ml-auto text-[11px] font-bold">✗ Your answer</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Before answering: confidence + hint + skip/submit */}
            {!feedback && (
              <div className="pt-4 border-t border-[#F2F2F7] space-y-4">
                <div>
                  <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2">How Confident?</p>
                  <div className="flex gap-2">
                    {[["Sure", "high"], ["Likely", "medium"], ["Unsure", "low"]].map(([label, val]) => (
                      <button key={val}
                        onClick={() => setConfidence(val)}
                        className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all ${
                          confidence === val
                            ? "bg-[#1C1C1E] text-white border-[#1C1C1E]"
                            : "bg-white border-[#E5E5EA] text-[#3A3A3C] hover:border-[#C7C7CC]"
                        }`}
                      >{label}</button>
                    ))}
                  </div>
                </div>

                {hint && (
                  <div className="bg-[#FF9500]/6 border border-[#FF9500]/20 rounded-xl px-4 py-3">
                    <p className="text-[11px] font-bold text-[#FF9500] uppercase tracking-wider mb-1">Hint</p>
                    <p className="text-[13px] text-[var(--label2)] leading-relaxed">{hint}</p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button onClick={handleHint} disabled={hintLoading || !!hint}
                    className="text-[12px] font-medium text-[#FF9500] hover:opacity-70 transition-opacity disabled:opacity-40">
                    {hintLoading ? "Getting hint…" : hint ? "Hint shown" : "💡 Get Hint"}
                  </button>
                  <AICreditsIndicator compact />
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => handleAnswer(-1)}
                      disabled={answering}
                      className="px-5 py-2.5 rounded-xl text-[14px] font-semibold border border-[#E5E5EA] text-[#8E8E93] hover:border-[#C7C7CC] transition-all disabled:opacity-40"
                    >Skip</button>
                    <button
                      onClick={() => selectedOption !== null && handleAnswer(selectedOption)}
                      disabled={selectedOption === null || answering}
                      className="px-6 py-2.5 rounded-xl text-[14px] font-semibold bg-[#1C1C1E] text-white hover:bg-[#3A3A3C] disabled:opacity-35 transition-all"
                    >{answering ? "Submitting…" : "Submit →"}</button>
                  </div>
                </div>
              </div>
            )}

            {/* After answering: feedback */}
            {feedback && (
              <div className="pt-4 border-t border-[#F2F2F7] space-y-4">
                {/* Result header */}
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    feedback.isCorrect ? "bg-[#34C759]/10" : "bg-[#FF3B30]/10"
                  }`}>
                    <span className={`font-bold text-[16px] ${feedback.isCorrect ? "text-[#34C759]" : "text-[#FF3B30]"}`}>
                      {feedback.isCorrect ? "✓" : "✗"}
                    </span>
                  </div>
                  <div>
                    <p className={`text-[15px] font-bold ${feedback.isCorrect ? "text-[#34C759]" : "text-[#FF3B30]"}`}>
                      {feedback.isCorrect ? "Correct!" : "Incorrect"}
                    </p>
                    {behaviorInfo && (
                      <span className={`text-[11px] font-medium ${behaviorInfo.text_c}`}>{behaviorInfo.text}</span>
                    )}
                  </div>
                </div>

                {feedback.message && (
                  <p className="text-[14px] text-[var(--label2)] leading-relaxed">{feedback.message}</p>
                )}

                {/* AI Explanation */}
                {feedback.aiExplanation && (
                  <div className="bg-[#007AFF]/6 border border-[#007AFF]/15 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-bold text-[#007AFF] uppercase tracking-wider">AI Explanation</p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const r = explRating === 1 ? null : 1;
                            setExplRating(r);
                            if (r) rateAIResponse(question?.questionText || "", feedback.selectedType || "", activeSubject || "Math", r).catch(() => {});
                          }}
                          className={`text-[14px] px-1 transition-opacity ${explRating === 1 ? "opacity-100" : "opacity-30 hover:opacity-70"}`}
                        >👍</button>
                        <button
                          onClick={() => {
                            const r = explRating === -1 ? null : -1;
                            setExplRating(r);
                            if (r) rateAIResponse(question?.questionText || "", feedback.selectedType || "", activeSubject || "Math", r).catch(() => {});
                          }}
                          className={`text-[14px] px-1 transition-opacity ${explRating === -1 ? "opacity-100" : "opacity-30 hover:opacity-70"}`}
                        >👎</button>
                      </div>
                    </div>
                    <p className="text-[13px] text-[var(--label2)] leading-relaxed">{feedback.aiExplanation}</p>
                  </div>
                )}

                {/* Shortcut */}
                {feedback.shortcut && (
                  <div className="bg-[#FF9500]/6 border border-[#FF9500]/15 rounded-xl p-4">
                    <p className="text-[11px] font-bold text-[#FF9500] uppercase tracking-wider mb-2">💡 Shortcut</p>
                    <p className="text-[13px] text-[var(--label2)]">{feedback.shortcut}</p>
                  </div>
                )}

                {/* Solution steps — active recall gate for wrong answers */}
                {feedback.solutionSteps?.length > 0 && !feedback.isCorrect && (
                  recallMode ? (
                    <div className="bg-[#FF9500]/6 border border-[#FF9500]/15 rounded-xl p-4">
                      <p className="text-[12px] font-semibold text-[#FF9500] mb-2">
                        Try it yourself first — write how you'd solve this:
                      </p>
                      <textarea
                        className="w-full bg-white border border-[#E5E5EA] rounded-xl px-3 py-2 text-[13px] text-[var(--label)] resize-none focus:outline-none focus:border-[#007AFF]"
                        rows={2}
                        value={recallAttempt}
                        onChange={(e) => setRecallAttempt(e.target.value)}
                        placeholder="Write your approach before seeing the solution…"
                      />
                      {evalFeedback && (
                        <div className="mt-3 bg-[#AF52DE]/6 border border-[#AF52DE]/15 rounded-xl px-3 py-2">
                          <p className="text-[11px] font-bold text-[#AF52DE] mb-1">AI Feedback on your answer</p>
                          <p className="text-[13px] text-[var(--label2)] leading-relaxed">{evalFeedback}</p>
                        </div>
                      )}
                      <div className="flex gap-2 mt-2">
                        <button onClick={handleEvaluate} disabled={recallAttempt.trim().length < 5 || evalLoading}
                          className="text-[13px] font-semibold px-4 py-2 rounded-xl border border-[#E5E5EA] text-[var(--label)] hover:bg-[#F2F2F7] disabled:opacity-40 transition-all">
                          {evalLoading ? "Evaluating…" : "Evaluate my answer"}
                        </button>
                        <button onClick={() => setRecallMode(false)} disabled={recallAttempt.trim().length < 5}
                          className="text-[13px] font-semibold px-4 py-2 rounded-xl bg-[#1C1C1E] text-white disabled:opacity-40 transition-all">
                          Show Solution →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => setShowSteps((s) => !s)}
                        className="text-[13px] font-medium text-[#007AFF] hover:opacity-70 transition-opacity">
                        {showSteps ? "Hide" : "Show"} solution steps
                      </button>
                      {showSteps && (
                        <ol className="mt-3 space-y-1.5 list-decimal list-inside">
                          {feedback.solutionSteps.map((step, i) => (
                            <li key={i} className="text-[13px] text-[var(--label2)]">{step}</li>
                          ))}
                        </ol>
                      )}
                    </div>
                  )
                )}
                {feedback.solutionSteps?.length > 0 && feedback.isCorrect && (
                  <div>
                    <button onClick={() => setShowSteps((s) => !s)}
                      className="text-[13px] font-medium text-[#007AFF] hover:opacity-70 transition-opacity">
                      {showSteps ? "Hide" : "Show"} solution steps
                    </button>
                    {showSteps && (
                      <ol className="mt-3 space-y-1.5 list-decimal list-inside">
                        {feedback.solutionSteps.map((step, i) => (
                          <li key={i} className="text-[13px] text-[var(--label2)]">{step}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}

                {/* Dangerous misconception */}
                {feedback.confidenceInsight === "dangerous_misconception" && (
                  <div className="bg-[#FF3B30]/6 border border-[#FF3B30]/20 rounded-xl p-4">
                    <p className="text-[12px] font-bold text-[#FF3B30] mb-1">⚠️ Dangerous Misconception</p>
                    <p className="text-[12px] text-[#FF3B30]/80">You were highly confident but wrong. Revisit this concept carefully.</p>
                  </div>
                )}

                {/* Auto-doubt */}
                {feedback.doubtInsight && !feedback.aiExplanation && (
                  <div className="bg-[#AF52DE]/6 border border-[#AF52DE]/15 rounded-xl p-4">
                    <p className="text-[11px] font-bold text-[#AF52DE] uppercase tracking-wider mb-1">🧠 Auto-doubt detected</p>
                    <p className="text-[13px] text-[var(--label2)]">{feedback.doubtInsight}</p>
                  </div>
                )}

                {/* AI Teacher */}
                {feedback.teacherMessage?.message && (
                  <div className="bg-[#007AFF]/6 border border-[#007AFF]/15 rounded-xl p-4">
                    <p className="text-[11px] font-bold text-[#007AFF] uppercase tracking-wider mb-1">🤖 AI Teacher</p>
                    <p className="text-[13px] text-[var(--label2)]">{feedback.teacherMessage.message}</p>
                  </div>
                )}

                {/* Difficulty level dots */}
                {feedback.difficultyLevel && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#8E8E93]">
                      Difficulty: {["", "Basic", "Application", "Tricky", "Exam-level"][feedback.difficultyLevel] || feedback.difficultyLevel}
                    </span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4].map((l) => (
                        <div key={l} className={`w-2 h-2 rounded-full ${l <= feedback.difficultyLevel ? "bg-[#007AFF]" : "bg-[#E5E5EA]"}`} />
                      ))}
                    </div>
                  </div>
                )}

                {/* AI usage */}
                {feedback.aiUsage && (
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] text-[#8E8E93]">
                      AI calls today: {feedback.aiUsage.used}/{feedback.aiUsage.limit}
                    </p>
                    {feedback.aiFromCache && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#34C759]/10 text-[#34C759]">⚡ cached</span>
                    )}
                  </div>
                )}

                {/* Flag + Bookmark */}
                <div className="flex items-center justify-between pt-1">
                  <button onClick={handleFlag} disabled={flagged}
                    className={`text-[11px] transition-colors ${flagged ? "text-[#FF3B30] cursor-default" : "text-[#8E8E93] hover:text-[#FF3B30]"}`}>
                    {flagged ? "⚑ Reported — thanks" : "⚑ Report this question"}
                  </button>
                  <button onClick={handleBookmark}
                    className={`text-[11px] font-medium transition-colors ${bookmarked ? "text-[#FF9500]" : "text-[#8E8E93] hover:text-[#FF9500]"}`}>
                    {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
                  </button>
                </div>

                <button onClick={handleNext}
                  className="w-full py-3 rounded-xl text-[15px] font-semibold bg-[#1C1C1E] text-white hover:bg-[#3A3A3C] transition-all">
                  Next Question →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Stellar doubt chat ── */}
        {chatOpen && (
          <div className="w-full lg:w-[360px] flex-shrink-0 lg:sticky lg:top-4">
            <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm flex flex-col" style={{ height: "520px" }}>
              {/* Chat header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#F2F2F7]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#007AFF] to-[#AF52DE] flex items-center justify-center">
                    <span className="text-white text-[13px] font-bold">S</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[var(--label)]">Stellar</p>
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${chatTyping ? "bg-[#FF9500]" : "bg-[#34C759]"}`} />
                      <span className="text-[11px] text-[#8E8E93]">{chatTyping ? "typing…" : "online"}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)}
                  className="text-[#8E8E93] hover:text-[var(--label)] transition-colors text-[18px] leading-none">
                  ×
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#1C1C1E] text-white rounded-br-sm"
                        : "bg-[#F2F2F7] text-[var(--label)] rounded-bl-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#F2F2F7] px-3 py-2.5 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                      {[0, 150, 300].map((delay) => (
                        <span key={delay} className="w-1.5 h-1.5 rounded-full bg-[#8E8E93] animate-bounce"
                          style={{ animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="px-3 py-3 border-t border-[#F2F2F7]">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendChat()}
                    placeholder="Ask anything…"
                    className="flex-1 text-[13px] px-3 py-2 rounded-xl bg-[#F2F2F7] border border-transparent focus:outline-none focus:border-[#007AFF]/40 text-[var(--label)] placeholder-[#8E8E93]"
                  />
                  <button
                    onClick={handleSendChat}
                    disabled={!chatInput.trim() || chatTyping}
                    className="w-8 h-8 rounded-xl bg-[#1C1C1E] text-white flex items-center justify-center disabled:opacity-35 hover:bg-[#3A3A3C] transition-all flex-shrink-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AssertionReasonText({ text }) {
  const aMatch = text.match(/assertion\s*(?:\(A\))?\s*[:\-]\s*(.*?)(?=reason|$)/is);
  const rMatch = text.match(/reason\s*(?:\(R\))?\s*[:\-]\s*(.*)/is);
  if (aMatch && rMatch) {
    return (
      <div className="space-y-3">
        <div className="bg-[#007AFF]/6 border border-[#007AFF]/15 rounded-xl px-4 py-3">
          <p className="text-[11px] font-bold text-[#007AFF] uppercase tracking-wider mb-1">Assertion (A)</p>
          <p className="text-[15px] font-semibold text-[var(--label)] leading-snug">{aMatch[1].trim()}</p>
        </div>
        <div className="bg-[#AF52DE]/6 border border-[#AF52DE]/15 rounded-xl px-4 py-3">
          <p className="text-[11px] font-bold text-[#AF52DE] uppercase tracking-wider mb-1">Reason (R)</p>
          <p className="text-[15px] font-semibold text-[var(--label)] leading-snug">{rMatch[1].trim()}</p>
        </div>
        <p className="text-[12px] text-[#8E8E93]">Choose the correct relation between A and R:</p>
      </div>
    );
  }
  return <p className="text-[18px] font-semibold text-[var(--label)] leading-snug">{text}</p>;
}

function OfflineBanner({ isOnline, queuedCount }) {
  if (isOnline && queuedCount === 0) return null;
  if (isOnline && queuedCount > 0) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#34C759]/10 border border-[#34C759]/20">
        <span className="text-[#34C759] text-[15px]">✓</span>
        <p className="text-[13px] text-[#34C759] font-medium">
          Back online — syncing {queuedCount} queued {queuedCount === 1 ? "answer" : "answers"}…
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FF9500]/10 border border-[#FF9500]/20">
      <span className="text-[#FF9500] text-[15px]">⚡</span>
      <div>
        <p className="text-[13px] text-[#FF9500] font-semibold">You're offline</p>
        <p className="text-[12px] text-[#FF9500]/80">
          {queuedCount > 0
            ? `${queuedCount} ${queuedCount === 1 ? "answer" : "answers"} saved — will sync when you reconnect`
            : "Answers will be saved locally and synced when you reconnect"}
        </p>
      </div>
    </div>
  );
}
