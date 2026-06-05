import { useEffect, useState, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  startTopic, submitAnswer, evaluateExplanation, flagQuestion,
  getTopics, getHint, toggleBookmark, startBookmarkPractice,
  startRetryPractice, startCollectionPractice, getBookmarks, rateAIResponse, askTutor, getReport,
  reportQuestion, submitSkipReason, submitErrorLabel,
  getQuestionStats, getPeerTime, getQuestionLineage,
  bmGetDue, bmRate, bmUpsertSection,
} from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useActiveProfile } from "../hooks/useActiveProfile";
import AICreditsIndicator from "../components/AICreditsIndicator";
import MathText from "../components/MathTextLazy";
import NotesPanel from "../components/NotesPanel";
import { enqueueAttempt, flushQueue, getQueuedCount } from "../utils/offlineQueue";

// Respect reduced motion preference
const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

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
  const profile   = useActiveProfile();
  const mixTopics     = location.state?.mixTopics     || null;
  const retryWrongIds = location.state?.retryWrongIds || null;
  const collectionId  = location.state?.collectionId  || null;

  const [topics, setTopics]                 = useState([]);
  const [topicsLoading, setTopicsLoading]   = useState(false);
  const [topicsError,   setTopicsError]     = useState("");
  const [selectedTopic, setSelectedTopic]   = useState(location.state?.topic || "");
  const [activeSubject, setActiveSubject]   = useState(location.state?.topic ? "" : (profile?.subject || user?.subject || "Math"));
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
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [questionsSeen,    setQuestionsSeen]    = useState(0); // increments on answer + skip

  // PM features
  const [topicMastery, setTopicMastery]   = useState({});   // { "Quadratic Equations": 72 }
  const [sessionGoal, setSessionGoal]     = useState(10);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [wrongStreak, setWrongStreak]     = useState(0);
  const [showXP, setShowXP]               = useState(false);
  const [xpBurst, setXpBurst]             = useState(null); // { topic, stars }
  const [explainFirst, setExplainFirst]   = useState(true); // #11 default ON
  const [conceptBrief, setConceptBrief]   = useState(null);
  const [conceptLoading, setConceptLoading] = useState(false);

  // Practice v2 features (#1-25)
  const [hotStreak, setHotStreak]         = useState(0); // #3 in-session correct streak
  const [diffTrend, setDiffTrend]         = useState([]); // #1 last 5 difficulties
  const [practiceMode, setPracticeMode]   = useState(() => localStorage.getItem("stellar_practice_mode") || "mixed"); // #14 easy|mixed|challenge|mock
  const [explainAnswer, setExplainAnswer] = useState(""); // #2 your-answer textbox
  const [showExplainBox, setShowExplainBox] = useState(() => localStorage.getItem("stellar_explain_answer") === "1");
  const [calibration, setCalibration]     = useState({ confidentRight: 0, confidentTotal: 0, unsureRight: 0, unsureTotal: 0 }); // #6
  const [qStats, setQStats]               = useState(null); // #10
  const [showStats, setShowStats]         = useState(false);
  const [peerTime, setPeerTime]           = useState(null); // #24
  const [skipModalOpen, setSkipModalOpen] = useState(false); // #9
  const [reportModalOpen, setReportModalOpen] = useState(false); // #19
  const [errorLabelGiven, setErrorLabelGiven] = useState(false); // #23
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false); // #15
  const [historyItems, setHistoryItems]   = useState([]); // #15 [{questionId, text, status, time}]
  const [savedExplanationFor, setSavedExplanationFor] = useState(null); // #16
  const [paused, setPaused]               = useState(false); // #22 inactivity auto-pause
  const lastActivityRef = useRef(Date.now()); // #22
  const [bookmarkInjectionDue, setBookmarkInjectionDue] = useState(false); // #4
  const dueBookmarksRef = useRef([]); // #4 cached due-for-review queue
  const sessionGoalsCompletedRef = useRef(0); // tracks how many to inject between
  const touchStartXRef = useRef(null); // #18 swipe

  // Doubt chat state
  const [chatOpen, setChatOpen]       = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput]     = useState("");
  const [chatTyping, setChatTyping]   = useState(false);

  const [colPickerOpen,   setColPickerOpen]   = useState(false);
  const [practiceColsVer, setPracticeColsVer] = useState(0); // bump to re-read localStorage

  const startTimeRef     = useRef(null);
  const qContentRef      = useRef(null); // notes/highlights anchor for the current question (GAP #3 Practice-Q surface)
  const handleAnswerRef  = useRef(null);
  const timerRef         = useRef(null);
  const chatEndRef       = useRef(null);

  // Persist user prefs
  useEffect(() => { localStorage.setItem("stellar_practice_mode", practiceMode); }, [practiceMode]);
  useEffect(() => { localStorage.setItem("stellar_explain_answer", showExplainBox ? "1" : "0"); }, [showExplainBox]);

  // Pre-load due-for-review bookmarks for injection (#4)
  useEffect(() => {
    bmGetDue(20).then((r) => { dueBookmarksRef.current = r.data?.data || []; }).catch(() => {});
  }, []);

  // Inactivity auto-pause (#22) — pause timer after 60s no input/click
  useEffect(() => {
    if (!question || feedback) return;
    const ping = () => { lastActivityRef.current = Date.now(); if (paused) setPaused(false); };
    const events = ["mousemove", "keydown", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, ping, { passive: true }));
    const id = setInterval(() => {
      if (Date.now() - lastActivityRef.current > 60_000 && !paused) setPaused(true);
    }, 5000);
    return () => { events.forEach((e) => window.removeEventListener(e, ping)); clearInterval(id); };
  }, [question, feedback, paused]);

  // Pause/resume timer based on `paused`
  useEffect(() => {
    if (!question || feedback) return;
    if (paused) { clearInterval(timerRef.current); timerRef.current = null; }
    else if (!timerRef.current && startTimeRef.current) {
      timerRef.current = setInterval(() => {
        const sec = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsed(sec);
        if (timeLimit && sec >= timeLimit * 0.8) setTimeWarning(true);
      }, 250);
    }
  }, [paused, question, feedback, timeLimit]);

  // Question stats + peer time on each new question (#10, #24)
  useEffect(() => {
    if (!question?._id) return;
    setQStats(null); setPeerTime(null); setSavedExplanationFor(null); setErrorLabelGiven(false); setExplainAnswer("");
    getQuestionStats(question._id).then((r) => setQStats(r.data?.data)).catch(() => {});
    getPeerTime(question._id).then((r) => setPeerTime(r.data?.data)).catch(() => {});
  }, [question?._id]);
  const topicsReqRef     = useRef(0);
  const colPickerRef     = useRef(null);

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

    if (collectionId) {
      try {
        const { data } = await startCollectionPractice(collectionId);
        setQuestion(data);
      } catch (err) {
        setError(err.response?.data?.error || "Could not load collection");
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
      const { data } = await startTopic(topic, null, practiceMode);
      if (data.foundationRedirect) {
        setFoundationMsg(data.message);
        setQuestion(data.question);
      } else {
        setQuestion(data);
        if (data.totalAvailable) {
          setTotalAvailable(data.totalAvailable);
          setSessionGoal(Math.min(10, data.totalAvailable));
        }
      }
      if (mixTopics) setSelectedTopic(topic);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Failed to start topic";
      if (err.response?.status === 404) {
        setError("You've practised all available questions for this topic. More questions are being added soon!");
      } else {
        setError(msg);
      }
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
      if (data.isCorrect) {
        setWrongStreak(0);
        setHotStreak((n) => n + 1); // #3
        setShowXP(true);
        setXpBurst({ topic: question?.conceptTested || selectedTopic || "topic", stars: 1 }); // #8
        setTimeout(() => { setShowXP(false); setXpBurst(null); }, prefersReducedMotion ? 0 : 1600);
      } else {
        setWrongStreak((n) => n + 1);
        setHotStreak(0);
      }
      // #1 difficulty trend
      setDiffTrend((t) => [...t.slice(-4), question?.difficultyScore || 0.5]);
      // #6 calibration update
      const c = confidence || "medium";
      setCalibration((cal) => {
        const next = { ...cal };
        if (c === "high") { next.confidentTotal++; if (data.isCorrect) next.confidentRight++; }
        if (c === "low")  { next.unsureTotal++;    if (data.isCorrect) next.unsureRight++; }
        return next;
      });
      // #15 history drawer item
      setHistoryItems((h) => [...h, {
        questionId: question._id,
        text: question.questionText?.slice(0, 80),
        status: data.isCorrect ? "correct" : "wrong",
        time: timeTaken,
        topic: question.conceptTested || question.topic,
      }]);
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
      // #4 mark bookmark injection due every 5 questions
      sessionGoalsCompletedRef.current += 1;
      if (sessionGoalsCompletedRef.current % 5 === 0 && dueBookmarksRef.current.length > 0) {
        setBookmarkInjectionDue(true);
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
    setQuestionsSeen((n) => n + 1);
    if (!bookmarkMode && feedback?.nextQuestion) {
      setQuestion(feedback.nextQuestion);
      setFeedback(null);
      setConfidence("");
    } else if (!bookmarkMode && feedback && !feedback.nextQuestion) {
      // All questions exhausted — go straight to session summary
      setShowSummary(true);
    } else {
      handleStart();
    }
  };

  const resetQuestionUI = () => {
    setFeedback(null); setSelectedOption(null); setConfidence("");
    setHint(null); setHintLoading(false); setRecallMode(true);
    setRecallAttempt(""); setEvalFeedback(null); setShowSteps(false);
    setFlagged(false); setBookmarked(false); setExplRating(null);
    setFoundationMsg(null); setError("");
  };

  const handleSkip = async () => {
    if (loading || answering || !question) return;
    clearInterval(timerRef.current);

    // If we've already cycled through all available questions, show summary
    if (!bookmarkMode && totalAvailable > 0 && questionsSeen + 1 >= totalAvailable) {
      setQuestionsSeen((n) => n + 1);
      setShowSummary(true);
      return;
    }

    // Save to stack so user can return
    setSkippedQuestions((prev) => [...prev, question]);
    resetQuestionUI();
    setLoading(true);
    const currentQId = question._id?.toString();
    const topic = mixTopics?.length
      ? mixTopics[Math.floor(Math.random() * mixTopics.length)]
      : selectedTopic;
    try {
      let data;
      if (bookmarkMode) {
        ({ data } = await startBookmarkPractice());
      } else if (topic) {
        ({ data } = await startTopic(topic, currentQId, practiceMode));
      } else {
        setLoading(false);
        return;
      }
      if (data.foundationRedirect) {
        setFoundationMsg(data.message);
        setQuestion(data.question);
      } else {
        setQuestion(data);
      }
      setQuestionsSeen((n) => n + 1);
      if (mixTopics) setSelectedTopic(topic);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to load next question");
      // Restore the question we just skipped on failure
      setSkippedQuestions((prev) => {
        if (prev.length) setQuestion(prev[prev.length - 1]);
        return prev.slice(0, -1);
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoBackToSkipped = () => {
    const prev = skippedQuestions[skippedQuestions.length - 1];
    if (!prev) return;
    setSkippedQuestions((s) => s.slice(0, -1));
    setQuestion(prev);
    resetQuestionUI();
  };

  const handleExplainFirst = async () => {
    if (!selectedTopic || conceptLoading) return;
    setConceptLoading(true);
    try {
      const { data } = await askTutor(
        `Give me a quick 2-sentence overview of "${selectedTopic}": the key idea and the most important formula or fact. Be very concise.`,
        [], selectedTopic, activeSubject
      );
      setConceptBrief(data?.message || data?.reply || data?.data?.message || null);
    } catch {
      setConceptBrief(null);
    } finally {
      setConceptLoading(false);
    }
  };

  const handleBackToTopics = () => {
    clearInterval(timerRef.current);
    setQuestion(null); setFeedback(null); setFoundationMsg(null);
    setEvalFeedback(null); setRecallMode(true); setRecallAttempt("");
    setShowSteps(false); setHint(null); setHintLoading(false); setExplRating(null);
    setFlagged(false); setBookmarked(false); setConfidence(""); setSelectedOption(null);
    setSessionStats({ correct: 0, total: 0 }); setWrongAnswers([]);
    setSkippedQuestions([]); setWrongStreak(0); setQuestionsSeen(0);
    setError("");
    navigate("/practice", { replace: true });
  };

  // ── Practice v2 handlers ─────────────────────────────────────────────
  const handleSkipWithReason = async (reason) => {
    if (question?._id && reason) submitSkipReason(question._id, reason).catch(() => {});
    setSkipModalOpen(false);
    handleSkip();
  };

  const handleReport = async (reason, note) => {
    if (!question?._id) return;
    try { await reportQuestion(question._id, reason, note); setReportModalOpen(false); setFlagged(true); } catch {}
  };

  const handleErrorLabel = async (label) => {
    if (!question?._id || errorLabelGiven) return;
    setErrorLabelGiven(true);
    try { await submitErrorLabel(question._id, label); } catch {}
  };

  const handleSaveExplanation = async () => {
    if (!question?._id || !feedback?.aiExplanation || savedExplanationFor === question._id) return;
    const bmId = `practice__explanation__${question._id}`;
    try {
      await bmUpsertSection({
        bmId,
        topicId: question.topicId || question.topic || "practice",
        label: `${question.conceptTested || question.topic}: ${feedback.aiExplanation.slice(0, 100)}`,
        sectionKey: "notes",
      });
      setSavedExplanationFor(question._id);
    } catch {}
  };

  // #4 Inject a due-for-review bookmark
  const handleInjectBookmark = () => {
    const next = dueBookmarksRef.current.shift();
    if (!next) { setBookmarkInjectionDue(false); return; }
    resetQuestionUI();
    setQuestion({ ...next, _injected: true });
    setBookmarkInjectionDue(false);
  };

  // #16 Concept lineage on wrong answer
  const [lineage, setLineage] = useState(null);
  useEffect(() => {
    setLineage(null);
    if (feedback && !feedback.isCorrect && question?._id) {
      getQuestionLineage(question._id).then((r) => setLineage(r.data?.data)).catch(() => {});
    }
  }, [feedback, question?._id]);

  // #17 Doubt chat pre-seed when chat opened on a question
  useEffect(() => {
    if (chatOpen && question && chatMessages.length === 0) {
      setChatInput(""); // clear; pre-seed via placeholder instead — see input below
    }
  }, [chatOpen, question]); // eslint-disable-line

  // #18 Swipe gestures (touch)
  const onTouchStart = (e) => { touchStartXRef.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartXRef.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(dx) < 60 || feedback) return;
    if (dx < -60) handleSkip();          // swipe left → skip
    else if (dx > 60) handleBookmark();  // swipe right → bookmark
  };

  // Calibration % helper
  const calibrationPct = useMemo(() => {
    const n = calibration.confidentTotal + calibration.unsureTotal;
    if (!n) return null;
    const correct = calibration.confidentRight + (calibration.unsureTotal - calibration.unsureRight);
    return Math.round((correct / n) * 100);
  }, [calibration]);

  // Load bookmark count + topic mastery from analytics report
  useEffect(() => {
    getBookmarks().then((r) => setBookmarkCount(r.data?.length || 0)).catch(() => {});
    getReport().then((r) => {
      const progress = r.data?.topicProgress || r.data?.data?.topicProgress || [];
      if (progress.length) {
        const map = {};
        progress.forEach(({ topic, accuracy }) => { map[topic] = Math.round((accuracy || 0) * 100); });
        setTopicMastery(map);
      }
    }).catch(() => {});
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
  const loadTopics = (subject) => {
    if (!subject) return;
    const reqId = ++topicsReqRef.current;
    setTopicsLoading(true);
    setTopicsError("");
    setTopics([]);
    const grade = profile?.grade || "10";
    getTopics({ grade, subject })
      .then((r) => {
        if (reqId !== topicsReqRef.current) return; // stale — newer request in flight
        const list = Array.isArray(r.data) ? r.data : [];
        setTopics(list.map((t) => t.name));
      })
      .catch((err) => {
        if (reqId !== topicsReqRef.current) return;
        const msg = err?.response?.data?.error || err?.message || "Network error";
        console.error("[loadTopics failed]", { subject, grade, msg }, err);
        setTopicsError(msg);
      })
      .finally(() => {
        if (reqId !== topicsReqRef.current) return;
        setTopicsLoading(false);
      });
  };

  useEffect(() => {
    loadTopics(activeSubject);
  }, [activeSubject, profile?.grade]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-start when arriving with pre-selected topic / retry mode
  useEffect(() => {
    if ((mixTopics?.length || location.state?.autoStart || retryWrongIds?.length || collectionId) && !question) handleStart();
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

        {/* Header */}
        <div>
          <p className="text-[11px] font-bold text-[#8E8E93] tracking-widest uppercase mb-1">Practice</p>
          <h1 className="text-[26px] font-bold text-[var(--label)] tracking-tight">
            {mixTopics ? "Mixed Session" : "What are you studying today?"}
          </h1>
          {mixTopics && (
            <p className="text-[13px] text-[#8E8E93] mt-0.5">{mixTopics.join(" · ")}</p>
          )}
        </div>

        {retryWrongIds?.length > 0 && (
          <div className="bg-[#FF9500]/10 border border-[#FF9500]/25 text-[#FF9500] text-[13px] px-4 py-3 rounded-xl font-medium">
            Retrying {retryWrongIds.length} wrong question{retryWrongIds.length !== 1 ? "s" : ""} from your last exam
          </div>
        )}

        {/* Subject tabs */}
        {!mixTopics && (
          <div className="flex gap-2 flex-wrap">
            {SUBJECTS.map(({ id, label, color }) => (
              <button key={id}
                onClick={() => { setActiveSubject(id); setSelectedTopic(""); setScienceSub(null); setBookmarkMode(false); setError(""); }}
                className="px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
                style={!bookmarkMode && activeSubject === id
                  ? { background: color, color: "#fff" }
                  : { background: color + "15", color }}
              >{label}</button>
            ))}
            {bookmarkCount > 0 && (
              <button
                onClick={() => { setBookmarkMode(true); setSelectedTopic(""); setScienceSub(null); }}
                className="px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
                style={bookmarkMode ? { background: "#FF9500", color: "#fff" } : { background: "#FF950015", color: "#FF9500" }}
              >☆ Saved ({bookmarkCount})</button>
            )}
          </div>
        )}

        {/* Science sub-tabs */}
        {!mixTopics && !bookmarkMode && activeSubject === "Science" && (
          <div className="flex gap-1.5">
            {["All","Physics","Chemistry","Biology"].map((s) => (
              <button key={s}
                onClick={() => { setScienceSub(s === "All" ? null : s); setSelectedTopic(""); }}
                className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all border"
                style={(s === "All" && !scienceSub) || scienceSub === s
                  ? { background: "#34C759", color: "#fff", borderColor: "#34C759" }
                  : { background: "#34C75910", color: "#34C759", borderColor: "#34C75930" }}
              >{s}</button>
            ))}
          </div>
        )}

        {/* Topic grid / bookmark panel */}
        {bookmarkMode ? (
          <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#FF9500]/10 flex items-center justify-center mx-auto text-2xl">☆</div>
            <p className="text-[17px] font-semibold text-[var(--label)]">Practice from Saved Questions</p>
            <p className="text-[13px] text-[#8E8E93]">
              {bookmarkCount} saved · questions you haven't seen recently come first
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">
                {scienceSub ? `${scienceSub} Topics` : `${activeSubject} Topics`}
              </p>
              {selectedTopic && (
                <span className="text-[11px] font-semibold text-[#007AFF]">
                  {selectedTopic} selected ✓
                </span>
              )}
            </div>
            {topicsLoading ? (
              <div className="flex items-center gap-2 py-4">
                <div className="w-4 h-4 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin" />
                <p className="text-[13px] text-[#8E8E93]">Loading topics…</p>
              </div>
            ) : topicsError ? (
              <div className="py-4 space-y-2">
                <p className="text-[13px] text-[#FF3B30]">Could not load topics: <span className="font-mono">{topicsError}</span></p>
                <button
                  onClick={() => loadTopics(activeSubject)}
                  className="text-[13px] font-semibold text-[#007AFF] hover:opacity-70 transition-opacity"
                >Retry →</button>
              </div>
            ) : filteredTopics.length === 0 ? (
              <p className="text-[13px] text-[#8E8E93] py-4">No topics found for this filter.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {filteredTopics.map((t) => {
                  const mastery = topicMastery[t];
                  const masteryColor = mastery >= 80 ? "#34C759" : mastery >= 50 ? "#FF9500" : mastery > 0 ? "#FF3B30" : "#C7C7CC";
                  return (
                    <button key={t} onClick={() => { setSelectedTopic(selectedTopic === t ? "" : t); setError(""); setConceptBrief(null); setExplainFirst(false); }}
                      className="p-3.5 rounded-xl text-left transition-all duration-150 active:scale-[0.97] flex flex-col gap-1"
                      style={selectedTopic === t
                        ? { background: subjectColor, color: "#fff" }
                        : { background: "var(--fill)", color: "var(--label)" }}
                    >
                      <span className="text-[13px] font-medium leading-tight">{t}</span>
                      {mastery !== undefined ? (
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-1 rounded-full bg-white/30">
                            <div className="h-full rounded-full" style={{
                              width: `${mastery}%`,
                              background: selectedTopic === t ? "rgba(255,255,255,0.8)" : masteryColor,
                            }} />
                          </div>
                          <span className="text-[10px] font-semibold" style={{
                            color: selectedTopic === t ? "rgba(255,255,255,0.8)" : masteryColor,
                          }}>{mastery}%</span>
                        </div>
                      ) : (
                        <span className="text-[10px]" style={{
                          color: selectedTopic === t ? "rgba(255,255,255,0.6)" : "#C7C7CC",
                        }}>Not started</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Explain first toggle */}
        {!bookmarkMode && selectedTopic && (
          <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[var(--label)]">Explain the concept first</p>
                <p className="text-[11px] text-[#8E8E93] mt-0.5">Get a 2-sentence brief from Stellar before starting</p>
              </div>
              <button
                onClick={() => {
                  const next = !explainFirst;
                  setExplainFirst(next);
                  if (next && !conceptBrief) handleExplainFirst();
                }}
                className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
                style={{ background: explainFirst ? "#007AFF" : "#E5E5EA" }}
              >
                <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all"
                  style={{ left: explainFirst ? "calc(100% - 22px)" : "2px" }} />
              </button>
            </div>
            {explainFirst && (
              <div className="mt-3 pt-3 border-t border-[#F2F2F7]">
                {conceptLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[12px] text-[#8E8E93]">Stellar is preparing a brief…</p>
                  </div>
                ) : conceptBrief ? (
                  <p className="text-[13px] text-[var(--label)] leading-relaxed">{conceptBrief}</p>
                ) : null}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-[#FF3B30]/8 border border-[#FF3B30]/20 text-[#FF3B30] text-[13px] px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* #14 Practice mode picker */}
        {!bookmarkMode && selectedTopic && (
          <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm p-4">
            <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2.5">Mode</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { id: "easy",      label: "Easy warmup", desc: "Build confidence", color: "#34C759" },
                { id: "mixed",     label: "Mixed",       desc: "Recommended",      color: "#007AFF" },
                { id: "challenge", label: "Challenge",   desc: "Hard mode",        color: "#FF9500" },
                { id: "mock",      label: "Mock rules",  desc: "Timed, no hints",  color: "#FF3B30" },
              ].map((m) => (
                <button key={m.id} onClick={() => setPracticeMode(m.id)}
                  className="text-left p-3 rounded-xl transition-all border-2"
                  style={practiceMode === m.id
                    ? { borderColor: m.color, background: `${m.color}10` }
                    : { borderColor: "transparent", background: "var(--fill)" }}>
                  <p className="text-[12px] font-bold" style={{ color: practiceMode === m.id ? m.color : "var(--label)" }}>{m.label}</p>
                  <p className="text-[10px] text-[#8E8E93] mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* #2 Always-on toggle for explain-your-answer */}
        {!bookmarkMode && selectedTopic && (
          <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[var(--label)]">Explain my answer before submit</p>
              <p className="text-[11px] text-[#8E8E93] mt-0.5">Bloom's "explain" tier — locks the concept harder</p>
            </div>
            <button onClick={() => setShowExplainBox((v) => !v)}
              className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
              style={{ background: showExplainBox ? "#AF52DE" : "#E5E5EA" }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all"
                style={{ left: showExplainBox ? "calc(100% - 22px)" : "2px" }} />
            </button>
          </div>
        )}

        {/* Start button — dark to match Submit on question screen */}
        <button
          onClick={handleStart}
          disabled={(!bookmarkMode && !selectedTopic) || loading}
          className={`w-full py-3.5 rounded-xl text-[15px] font-semibold text-white transition-all disabled:opacity-35 flex items-center justify-center gap-2 ${
            (!bookmarkMode && !selectedTopic) ? "bg-[#C7C7CC]" : "bg-[#1c1c1e]"
          }`}
        >
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Loading…</>
            : bookmarkMode ? "Start Bookmark Practice →" : selectedTopic ? `Start — ${selectedTopic} →` : "Select a topic above"}
        </button>

      </div>
    );
  }

  // ── Session summary ──────────────────────────────────────────────────
  if (showSummary) {
    const accuracy   = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
    const grade      = accuracy >= 80 ? "Excellent" : accuracy >= 60 ? "Good" : accuracy >= 40 ? "Keep Going" : "Needs Work";
    const gradeHex   = accuracy >= 80 ? "#34C759" : accuracy >= 60 ? "#007AFF" : accuracy >= 40 ? "#FF9500" : "#FF3B30";
    const gradeEmoji = accuracy >= 80 ? "🎉" : accuracy >= 60 ? "👍" : accuracy >= 40 ? "📈" : "💪";

    return (
      <div className="space-y-5">
        {/* Header — matches question screen breadcrumb style */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowSummary(false); setQuestion(null); setFeedback(null);
              setSessionStats({ correct: 0, total: 0 }); setWrongAnswers([]); setFoundationMsg(null);
              setSkippedQuestions([]); setWrongStreak(0); setQuestionsSeen(0);
              navigate("/practice", { replace: true });
            }}
            className="text-[13px] font-medium text-[#8E8E93] hover:text-[var(--label)] transition-colors"
          >← Back</button>
          <span className="text-[#C7C7CC] text-[11px]">/</span>
          <span className="text-[11px] font-bold text-[#8E8E93] tracking-widest uppercase">
            Practice · {bookmarkMode ? "Saved" : selectedTopic}
          </span>
        </div>

        {/* Score card */}
        <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm p-8 text-center">
          <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-4">Session Complete</p>
          <div className="text-[64px] font-bold tracking-tight leading-none" style={{ color: gradeHex }}>
            {accuracy}%
          </div>
          <p className="text-[17px] font-semibold mt-2" style={{ color: gradeHex }}>
            {gradeEmoji} {grade}
          </p>
          <p className="text-[13px] text-[#8E8E93] mt-1">
            {sessionStats.correct} correct · {sessionStats.total - sessionStats.correct} incorrect · {sessionStats.total} total
          </p>
          <div className="mt-5 h-2.5 bg-[#F2F2F7] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${accuracy}%`, background: gradeHex }} />
          </div>
          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: "Accuracy", value: `${accuracy}%`, color: gradeHex },
              { label: "Questions", value: sessionStats.total, color: "#1C1C1E" },
              { label: "Topic", value: bookmarkMode ? "Saved" : (selectedTopic?.split(" ").slice(0, 2).join(" ")), color: "#007AFF" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#F2F2F7] rounded-xl p-3">
                <p className="text-[11px] text-[#8E8E93] font-medium mb-0.5">{label}</p>
                <p className="text-[15px] font-bold truncate" style={{ color }}>{value}</p>
              </div>
            ))}
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

        {/* #13 Action row — primary action is now "Review the wrong ones" if any */}
        <div className="space-y-2">
          {wrongAnswers.length > 0 && (
            <button
              onClick={() => {
                const ids = wrongAnswers.map((w) => w.questionId).filter(Boolean);
                setShowSummary(false); setQuestion(null); setFeedback(null);
                setSessionStats({ correct: 0, total: 0 }); setFoundationMsg(null);
                setSkippedQuestions([]); setWrongStreak(0); setQuestionsSeen(0);
                navigate("/practice", { state: { retryWrongIds: ids.length ? ids : undefined, autoStart: !!ids.length } });
              }}
              className="w-full py-3.5 rounded-xl text-[15px] font-bold bg-gradient-to-r from-[#FF9500] to-[#FF3B30] text-white shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              ↻ Review the {wrongAnswers.length} you got wrong
            </button>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowSummary(false); setQuestion(null); setFeedback(null);
                setSessionStats({ correct: 0, total: 0 }); setWrongAnswers([]); setFoundationMsg(null);
                setSkippedQuestions([]); setWrongStreak(0); setQuestionsSeen(0);
                navigate("/practice", { replace: true });
              }}
              className="flex-1 py-3 rounded-xl text-[14px] font-semibold border border-[#E5E5EA] text-[#3A3A3C] hover:bg-[#F2F2F7] transition-all"
            >Change Topic</button>

            <button
              onClick={() => {
                setShowSummary(false); setQuestion(null); setFeedback(null);
                setSessionStats({ correct: 0, total: 0 }); setWrongAnswers([]); setFoundationMsg(null);
                setRecallMode(true); setRecallAttempt(""); setEvalFeedback(null);
                setShowSteps(false); setFlagged(false); setBookmarked(false);
                setHint(null); setHintLoading(false); setExplRating(null);
                setConfidence(""); setSelectedOption(null); setError("");
                setSkippedQuestions([]); setWrongStreak(0); setQuestionsSeen(0);
                handleStart();
              }}
              className="flex-1 py-3 rounded-xl text-[14px] font-semibold bg-[#1C1C1E] text-white hover:bg-[#3A3A3C] transition-all"
            >Practice Again →</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Question screen ──────────────────────────────────────────────────
  const diff         = diffLevel(question.difficultyScore);
  const behaviorInfo = feedback ? BEHAVIOR[feedback.behavior] || BEHAVIOR.concept_error : null;

  return (
    <div className="flex flex-col gap-4">
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-28px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-spin, .animate-bounce { animation: none !important; }
          * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }
      `}</style>
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
          {historyItems.length > 0 && (
            <button onClick={() => setHistoryDrawerOpen(true)}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-lg border border-[#E5E5EA] text-[#3A3A3C] hover:border-[#C7C7CC] transition-all">
              📋 History ({historyItems.length})
            </button>
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

      {/* Skipped question return banner */}
      {skippedQuestions.length > 0 && (
        <div className="flex items-center gap-3 bg-[#FF9500]/10 border border-[#FF9500]/30 rounded-2xl px-4 py-3">
          <span className="w-7 h-7 rounded-full bg-[#FF9500] text-white text-[12px] font-bold flex items-center justify-center flex-shrink-0">
            {skippedQuestions.length}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#FF9500]">
              {skippedQuestions.length} skipped question{skippedQuestions.length !== 1 ? "s" : ""}
            </p>
            <p className="text-[11px] text-[#FF9500]/70 truncate">
              {skippedQuestions[skippedQuestions.length - 1]?.questionText?.slice(0, 55) || "Tap to go back"}…
            </p>
          </div>
          <button
            onClick={handleGoBackToSkipped}
            className="px-3 py-1.5 rounded-xl bg-[#FF9500] text-white text-[12px] font-bold hover:bg-[#E68600] transition-colors flex-shrink-0"
          >
            ← Go back
          </button>
        </div>
      )}

      {error && (
        <div className="bg-[#FF3B30]/8 border border-[#FF3B30]/20 text-[#FF3B30] text-[13px] px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Two-panel layout */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* ── Left: Question panel ── */}
        <div className="flex-1 min-w-0">
          {/* #1 Difficulty trend pill + #3 hot streak ribbon + #6 calibration meter + #4 bookmark inject + #22 paused */}
          <div className="flex items-center gap-2 flex-wrap mb-2 text-[11px]">
            {diffTrend.length >= 2 && (() => {
              const last = diffTrend[diffTrend.length - 1];
              const prev = diffTrend[diffTrend.length - 2];
              const trend = last > prev + 0.05 ? "up" : last < prev - 0.05 ? "down" : "flat";
              const label = last < 0.4 ? "Easy" : last < 0.7 ? "Medium" : "Hard";
              const color = last < 0.4 ? "#34C759" : last < 0.7 ? "#FF9500" : "#FF3B30";
              return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold" style={{ background: `${color}14`, color }}>
                  Difficulty: {label} {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
                </span>
              );
            })()}
            {hotStreak >= 2 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold bg-[#FF9500]/12 text-[#FF9500]">
                🔥 {hotStreak} in a row
              </span>
            )}
            {calibrationPct !== null && (calibration.confidentTotal + calibration.unsureTotal) >= 5 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-[#AF52DE]/12 text-[#AF52DE]"
                title="How well your confidence matches accuracy">
                Calibration: {calibrationPct}%
              </span>
            )}
            {paused && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-[#1C1C1E] text-white">
                ⏸ Paused — move mouse to resume
              </span>
            )}
            {question?._injected && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold bg-[#007AFF]/12 text-[#007AFF]">
                ↻ Quick check from earlier
              </span>
            )}
          </div>

          {/* #4 Bookmark injection banner */}
          {bookmarkInjectionDue && !feedback && (
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 mb-3 rounded-xl bg-[#007AFF]/8 border border-[#007AFF]/20">
              <p className="text-[12px] text-[#007AFF] font-medium">↻ A bookmark from earlier is due for review — quick refresh?</p>
              <div className="flex gap-2">
                <button onClick={handleInjectBookmark} className="px-3 py-1.5 rounded-lg bg-[#007AFF] text-white text-[11px] font-bold">Yes, review</button>
                <button onClick={() => setBookmarkInjectionDue(false)} className="px-3 py-1.5 rounded-lg text-[#007AFF] text-[11px] font-medium hover:bg-[#007AFF]/8">Skip</button>
              </div>
            </div>
          )}

          <div className="relative bg-white rounded-2xl border border-[#f0f0f5] shadow-sm p-6 space-y-5"
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

            {/* XP animation — now shows +★ on topic (#8) */}
            {showXP && xpBurst && (
              <div className="absolute top-4 right-6 pointer-events-none z-10"
                style={{ animation: prefersReducedMotion ? "none" : "floatUp 1.5s ease-out forwards" }}>
                <span className="text-[13px] font-bold text-[#34C759]">+★ {xpBurst.topic.slice(0, 24)}</span>
              </div>
            )}

            {/* Progress row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-[#8E8E93] font-medium">
                  Q{questionsSeen + 1}
                  {sessionGoal > 0 && <span className="text-[#C7C7CC]">/{sessionGoal}</span>}
                </span>
                <div className="flex gap-1 items-center">
                  {Array.from({ length: Math.min(sessionGoal, 15) }).map((_, i) => (
                    <div key={i} className={`rounded-full transition-all duration-300 ${
                      i < questionsSeen
                        ? "w-2 h-2 bg-[#007AFF]"
                        : i === questionsSeen
                        ? "w-2.5 h-2.5 bg-[#007AFF] ring-2 ring-[#007AFF]/25"
                        : "w-2 h-2 bg-[#E5E5EA]"
                    }`} />
                  ))}
                  {questionsSeen >= sessionGoal && (
                    <span className="text-[11px] font-bold text-[#34C759] ml-1">Goal! 🎉</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Bookmark — always visible, shows collection picker on ☆ click */}
                <div className="relative" ref={colPickerRef}>
                  <button
                    onClick={async () => {
                      if (bookmarked) {
                        handleBookmark();
                      } else {
                        const cols = (() => { try { return JSON.parse(localStorage.getItem("stellar_collections") || "[]"); } catch { return []; } })();
                        if (cols.length === 0) {
                          // No custom collections — save directly
                          handleBookmark();
                        } else {
                          setColPickerOpen((v) => !v);
                        }
                      }
                    }}
                    title={bookmarked ? "Remove bookmark" : "Bookmark this question"}
                    className={`text-[20px] leading-none transition-colors ${bookmarked ? "text-[#FF9500]" : "text-[#D1D1D6] hover:text-[#FF9500]"}`}
                  >
                    {bookmarked ? "★" : "☆"}
                  </button>
                  {colPickerOpen && (
                    <PracticeCollectionPicker
                      questionId={question?._id?.toString()}
                      pickerRef={colPickerRef}
                      onClose={() => setColPickerOpen(false)}
                      onSave={async (colId, updatedCols) => {
                        await handleBookmark();
                        if (colId && question?._id) {
                          const qId = question._id.toString();
                          const cols = updatedCols ?? (() => { try { return JSON.parse(localStorage.getItem("stellar_collections") || "[]"); } catch { return []; } })();
                          const next = cols.map((c) =>
                            c.id === colId
                              ? { ...c, bookmarkIds: c.bookmarkIds.includes(qId) ? c.bookmarkIds : [...c.bookmarkIds, qId] }
                              : c
                          );
                          localStorage.setItem("stellar_collections", JSON.stringify(next));
                        }
                        setColPickerOpen(false);
                        setPracticeColsVer((v) => v + 1);
                      }}
                    />
                  )}
                </div>
                {/* Session goal ring */}
                <GoalRing done={questionsSeen} goal={sessionGoal} />
                <div className={`text-[13px] font-mono font-semibold tabular-nums ${timeWarning ? "text-[#FF3B30]" : "text-[#8E8E93]"}`}
                  title={qStats?.expectedTime ? `Expected: ~${qStats.expectedTime}s` : ""}>
                  {fmtTime(elapsed)}
                  {timeLimit && <span className="text-[11px] font-normal"> / {fmtTime(timeLimit)}</span>}
                  {qStats?.expectedTime && !timeLimit && (
                    <span className="text-[10px] font-normal text-[#C7C7CC] ml-1">~{qStats.expectedTime}s expected</span>
                  )}
                </div>
                {/* #10 Question stats popover */}
                <div className="relative">
                  <button onClick={() => setShowStats((v) => !v)} className="w-5 h-5 rounded-full border border-[#E5E5EA] text-[10px] text-[#8E8E93] hover:border-[#007AFF] hover:text-[#007AFF] transition-colors flex items-center justify-center font-bold">i</button>
                  {showStats && (
                    <div className="absolute right-0 top-7 z-30 bg-white rounded-xl border border-[#f0f0f5] shadow-lg p-3 min-w-[200px]">
                      <p className="text-[10px] font-bold text-[#8E8E93] tracking-[0.12em] uppercase mb-2">Question stats</p>
                      {qStats === null ? (
                        <p className="text-[12px] text-[#C7C7CC]">Loading…</p>
                      ) : qStats.attempts === 0 ? (
                        <p className="text-[12px] text-[#8E8E93]">First attempt — no data yet.</p>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="text-[12px] text-[#3A3A3C]"><span className="font-bold">{qStats.attempts.toLocaleString()}</span> students tried</p>
                          {qStats.accuracy !== null && (
                            <p className="text-[12px] text-[#3A3A3C]"><span className="font-bold">{qStats.accuracy}%</span> got it right</p>
                          )}
                          {qStats.avgTime > 0 && (
                            <p className="text-[12px] text-[#3A3A3C]">Avg time: <span className="font-bold">{fmtTime(qStats.avgTime)}</span></p>
                          )}
                        </div>
                      )}
                      <button onClick={() => setShowStats(false)} className="mt-2 text-[10px] text-[#C7C7CC] hover:text-[#8E8E93]">Close</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* #12 Pacing markers + ETA */}
            {questionsSeen > 0 && sessionGoal > 0 && questionsSeen < sessionGoal && historyItems.length > 0 && (() => {
              const remaining = sessionGoal - questionsSeen;
              const avgSec = historyItems.reduce((a, h) => a + (h.time || 0), 0) / historyItems.length;
              const eta = Math.round((avgSec * remaining) / 60);
              return (
                <p className="text-[11px] text-[#8E8E93] -mt-1">
                  {remaining} left to your goal · ~{eta} min at your pace
                </p>
              );
            })()}

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

            {/* Question content (case passage + question text) — notes/highlights anchor */}
            <div ref={qContentRef} className="space-y-4">
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
                  <MathText text={question.questionText} />
                </p>
              )}
            </div>

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
                    onClick={() => !feedback && !answering && !loading && setSelectedOption(i)}
                    disabled={!!feedback || answering || loading}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border text-[14px] font-medium
                                transition-all duration-150 active:scale-[0.99] flex items-center gap-3 ${containerCls}`}
                  >
                    <span className={`text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${labelCls}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span><MathText text={opt.text} /></span>
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

            {/* Notes & highlights for this question — review mode (GAP #3 Practice-Q surface) */}
            {feedback && question?._id && !bookmarkMode && (
              <NotesPanel
                item={{
                  scope: "k12",
                  kind: "question",
                  refId: String(question._id),
                  subject: activeSubject || question.subject || undefined,
                  title: question.questionText?.slice(0, 120) || "Practice question",
                  url: "/practice",
                }}
                contentRef={qContentRef}
              />
            )}

            {/* Keyboard shortcut hint */}
            {!feedback && (
              <div className="flex items-center gap-1.5 -mt-1">
                <span className="text-[10px] text-[#C7C7CC]">Select:</span>
                {["A","B","C","D"].map((k) => (
                  <kbd key={k} className="px-1.5 py-0.5 rounded bg-[#F2F2F7] text-[#8E8E93] font-mono text-[10px] font-bold">{k}</kbd>
                ))}
                <span className="text-[10px] text-[#C7C7CC] ml-1">Submit:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#F2F2F7] text-[#8E8E93] font-mono text-[10px] font-bold">↵</kbd>
              </div>
            )}

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
                    <p className="text-[13px] text-[var(--label2)] leading-relaxed"><MathText text={hint} /></p>
                  </div>
                )}

                {/* #2 Explain your reasoning before submit (opt-in) */}
                {showExplainBox && (
                  <div>
                    <p className="text-[10px] font-bold text-[#AF52DE] tracking-wider uppercase mb-1.5">Explain your reasoning (optional)</p>
                    <textarea
                      value={explainAnswer}
                      onChange={(e) => setExplainAnswer(e.target.value)}
                      placeholder="In one sentence — why did you pick this option?"
                      rows={2}
                      maxLength={280}
                      className="w-full text-[13px] px-3 py-2 rounded-xl bg-white border border-[#E5E5EA] text-[var(--label)] resize-none focus:outline-none focus:border-[#AF52DE]"
                    />
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
                      onClick={() => setSkipModalOpen(true)}
                      disabled={answering || loading}
                      className="px-5 py-2.5 rounded-xl text-[14px] font-semibold border border-[#E5E5EA] text-[#8E8E93] hover:border-[#C7C7CC] transition-all disabled:opacity-40"
                    >{loading ? "…" : "Skip"}</button>
                    <button
                      onClick={() => selectedOption !== null && !loading && handleAnswer(selectedOption)}
                      disabled={selectedOption === null || answering || loading}
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
                  <p className="text-[14px] text-[var(--label2)] leading-relaxed"><MathText text={feedback.message} /></p>
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
                    <p className="text-[13px] text-[var(--label2)] leading-relaxed"><MathText text={feedback.aiExplanation} /></p>
                    {/* #16 Save explanation as section bookmark */}
                    <button
                      onClick={handleSaveExplanation}
                      disabled={savedExplanationFor === question?._id}
                      className="mt-2 text-[11px] font-semibold text-[#007AFF] hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-default"
                    >
                      {savedExplanationFor === question?._id ? "✓ Saved to bookmarks" : "📌 Save this explanation"}
                    </button>
                  </div>
                )}

                {/* Shortcut */}
                {feedback.shortcut && (
                  <div className="bg-[#FF9500]/6 border border-[#FF9500]/15 rounded-xl p-4">
                    <p className="text-[11px] font-bold text-[#FF9500] uppercase tracking-wider mb-2">💡 Shortcut</p>
                    <p className="text-[13px] text-[var(--label2)]"><MathText text={feedback.shortcut} /></p>
                  </div>
                )}

                {/* Solution steps — active recall gate for wrong answers */}
                {feedback.solutionSteps?.length > 0 && !feedback.isCorrect && (
                  recallMode ? (
                    <div className="bg-[#FF9500]/6 border border-[#FF9500]/15 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[12px] font-semibold text-[#FF9500]">
                          Try it yourself first — write how you'd solve this:
                        </p>
                        {/* #25 Voice input via Web Speech API */}
                        <VoiceMic onTranscript={(t) => setRecallAttempt((prev) => (prev ? prev + " " : "") + t)} />
                      </div>
                      <textarea
                        className="w-full bg-white border border-[#E5E5EA] rounded-xl px-3 py-2 text-[13px] text-[var(--label)] resize-none focus:outline-none focus:border-[#007AFF]"
                        rows={2}
                        value={recallAttempt}
                        onChange={(e) => setRecallAttempt(e.target.value)}
                        placeholder="Write or speak your approach…"
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
                            <li key={i} className="text-[13px] text-[var(--label2)]"><MathText text={step} /></li>
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
                          <li key={i} className="text-[13px] text-[var(--label2)]"><MathText text={step} /></li>
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

                {/* #24 Peer time comparison */}
                {peerTime?.peerCount > 5 && peerTime.myAvg !== null && (
                  <div className="flex items-center gap-2 text-[11px] text-[#8E8E93]">
                    <span>You: <span className="font-bold text-[#3A3A3C]">{fmtTime(peerTime.myAvg)}</span></span>
                    <span className="text-[#C7C7CC]">·</span>
                    <span>{peerTime.peerCount.toLocaleString()} peers: <span className="font-bold text-[#3A3A3C]">{fmtTime(peerTime.peerAvg)}</span></span>
                    {peerTime.myAvg < peerTime.peerAvg * 0.8 && <span className="text-[#34C759] font-bold">⚡ faster than most</span>}
                    {peerTime.myAvg > peerTime.peerAvg * 1.4 && <span className="text-[#FF9500] font-bold">slower than most</span>}
                  </div>
                )}

                {/* #16 Concept lineage on wrong answer */}
                {!feedback.isCorrect && lineage?.prerequisites?.length > 0 && (
                  <div className="bg-[#FF9500]/6 border border-[#FF9500]/15 rounded-xl px-4 py-3">
                    <p className="text-[11px] font-bold text-[#FF9500] uppercase tracking-wider mb-1.5">You may be missing:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {lineage.prerequisites.slice(0, 3).map((p) => (
                        <button key={p} onClick={() => navigate("/practice", { state: { topic: p } })}
                          className="px-2.5 py-1 rounded-full bg-white border border-[#FF9500]/30 text-[11px] font-semibold text-[#FF9500] hover:bg-[#FF9500] hover:text-white transition-all">
                          {p} →
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* #23 User self-labels error reason */}
                {!feedback.isCorrect && (
                  <div className="pt-1">
                    <p className="text-[10px] font-bold text-[#8E8E93] tracking-wider uppercase mb-1.5">
                      {errorLabelGiven ? "✓ Thanks — that helps personalize your practice" : "Why did you get this wrong?"}
                    </p>
                    {!errorLabelGiven && (
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: "misread", label: "Misread question" },
                          { id: "calc_slip", label: "Calculation slip" },
                          { id: "concept_gap", label: "Don't know concept" },
                          { id: "stuck_step", label: "Stuck on a step" },
                          { id: "guessed", label: "Guessed" },
                          { id: "other", label: "Other" },
                        ].map((b) => (
                          <button key={b.id} onClick={() => handleErrorLabel(b.id)}
                            className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-[#E5E5EA] text-[#3A3A3C] hover:border-[#007AFF] hover:text-[#007AFF] transition-all">
                            {b.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Flag + Report + Bookmark */}
                <div className="flex items-center justify-between pt-1 gap-3">
                  <div className="flex items-center gap-3">
                    <button onClick={handleFlag} disabled={flagged}
                      className={`text-[11px] transition-colors ${flagged ? "text-[#FF3B30] cursor-default" : "text-[#8E8E93] hover:text-[#FF3B30]"}`}>
                      {flagged ? "⚑ Flagged" : "⚑ Quick flag"}
                    </button>
                    <button onClick={() => setReportModalOpen(true)}
                      className="text-[11px] text-[#8E8E93] hover:text-[#FF3B30] transition-colors">
                      Report with reason →
                    </button>
                  </div>
                  <button onClick={handleBookmark}
                    className={`text-[11px] font-medium transition-colors ${bookmarked ? "text-[#FF9500]" : "text-[#8E8E93] hover:text-[#FF9500]"}`}>
                    {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
                  </button>
                </div>

                {/* Wrong streak warning — feature 4 */}
                {wrongStreak >= 3 && !feedback.isCorrect && (
                  <div className="flex items-center gap-3 bg-[#007AFF]/6 border border-[#007AFF]/15 rounded-xl px-4 py-3">
                    <span className="text-[20px]">💙</span>
                    <div>
                      <p className="text-[13px] font-semibold text-[#007AFF]">Take a breath — {wrongStreak} in a row</p>
                      <p className="text-[12px] text-[#007AFF]/70 mt-0.5">Everyone hits rough patches. Read the explanation slowly, then try again.</p>
                    </div>
                  </div>
                )}

                {/* Similar question suggestion — feature 8 */}
                {!feedback.isCorrect && question?.conceptTested && (
                  <button onClick={handleNext}
                    className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-[#007AFF]/25 text-[#007AFF] hover:bg-[#007AFF]/6 transition-all">
                    Try another <span className="font-bold">{question.conceptTested}</span> question →
                  </button>
                )}

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
                    placeholder={
                      feedback && !feedback.isCorrect ? "What's the catch in this question?" :
                      feedback && feedback.isCorrect ? "Want to go deeper on this?" :
                      question ? "What's confusing you here?" :
                      "Ask anything…"
                    }
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

      {/* #9 Skip reason modal */}
      {skipModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={() => setSkipModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-bold text-[var(--label)] mb-1">Why skip this one?</h3>
            <p className="text-[12px] text-[#8E8E93] mb-4">Helps us send you better questions.</p>
            <div className="space-y-1.5">
              {[
                { id: "dont_know",   label: "I don't know this concept" },
                { id: "too_easy",    label: "Too easy" },
                { id: "confusing",   label: "Question is confusing" },
                { id: "bad_question",label: "Looks like a bad question" },
                { id: "no_time",     label: "No time right now" },
              ].map((r) => (
                <button key={r.id} onClick={() => handleSkipWithReason(r.id)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-[13px] text-[var(--label)] hover:bg-[#F2F2F7] transition-colors">
                  {r.label}
                </button>
              ))}
            </div>
            <button onClick={() => setSkipModalOpen(false)} className="mt-3 w-full text-[12px] text-[#8E8E93] hover:text-[var(--label)] py-1">Cancel</button>
          </div>
        </div>
      )}

      {/* #19 Report modal — distinct from quick flag */}
      {reportModalOpen && (
        <ReportModal onClose={() => setReportModalOpen(false)} onSubmit={handleReport} />
      )}

      {/* #15 History drawer */}
      {historyDrawerOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setHistoryDrawerOpen(false)}>
          <div className="bg-white w-full max-w-md h-full shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-[#F2F2F7] flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[var(--label)]">Session history</h3>
              <button onClick={() => setHistoryDrawerOpen(false)} className="text-[#8E8E93] text-[20px] leading-none">×</button>
            </div>
            <div className="px-5 py-4 space-y-2">
              {historyItems.map((h, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FAFAFB] transition-colors">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${h.status === "correct" ? "bg-[#34C759]" : "bg-[#FF3B30]"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[var(--label)] line-clamp-2">{h.text}</p>
                    <p className="text-[11px] text-[#8E8E93] mt-0.5">Q{i + 1} · {h.topic} · {fmtTime(h.time)}</p>
                  </div>
                  <span className={`text-[11px] font-bold ${h.status === "correct" ? "text-[#34C759]" : "text-[#FF3B30]"}`}>
                    {h.status === "correct" ? "✓" : "✗"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SMART_COLLECTION_LABELS = [
  "All saved",
  "Tricky concepts",
  "Review before exam",
  "Concepts & formulas",
  "Tips & shortcuts",
  "✓ Mastered",
];

function PracticeCollectionPicker({ pickerRef, onClose, onSave }) {
  const [customCols, setCustomCols] = useState(() => {
    try { return JSON.parse(localStorage.getItem("stellar_collections") || "[]"); }
    catch { return []; }
  });
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
    const updated = [...customCols, nc];
    setCustomCols(updated);
    localStorage.setItem("stellar_collections", JSON.stringify(updated));
    setCreating(false);
    setNewName("");
    onSave(nc.id, updated);
  };

  return (
    <div className="absolute right-0 bottom-8 z-50 bg-white rounded-xl border border-[#f0f0f5] shadow-xl min-w-[200px] max-h-[320px] overflow-y-auto">
      <p className="text-[9px] font-bold text-[#8E8E93] tracking-[0.12em] uppercase px-3 pt-2.5 pb-1 sticky top-0 bg-white border-b border-[#F2F2F7]">
        Add to collection
      </p>

      {/* Smart collections — always-present, auto-populated by filters */}
      <div className="py-0.5">
        <p className="text-[8px] font-bold text-[#C7C7CC] tracking-[0.12em] uppercase px-3 pt-1.5 pb-0.5">Smart collections</p>
        {SMART_COLLECTION_LABELS.map((label) => (
          <button
            key={label}
            onClick={() => onSave(null, customCols)}
            className="w-full text-left px-3 py-2 text-[12px] text-[#3A3A3C] hover:bg-[#F2F2F7] flex items-center gap-2"
          >
            <span className="text-[#C7C7CC] text-[11px]">◈</span>
            {label}
          </button>
        ))}
      </div>

      {/* Custom collections */}
      {customCols.length > 0 && (
        <div className="border-t border-[#F2F2F7] py-0.5">
          <p className="text-[8px] font-bold text-[#C7C7CC] tracking-[0.12em] uppercase px-3 pt-1.5 pb-0.5">My collections</p>
          {customCols.map((col) => (
            <button
              key={col.id}
              onClick={() => onSave(col.id, customCols)}
              className="w-full text-left px-3 py-2 text-[12px] text-[#3A3A3C] hover:bg-[#F2F2F7] flex items-center gap-2"
            >
              <span className="text-[#C7C7CC] text-[11px]">◉</span>
              {col.label}
            </button>
          ))}
        </div>
      )}

      {/* Create new collection */}
      <div className="border-t border-[#F2F2F7]">
        {creating ? (
          <div className="px-2 pb-2 pt-1.5">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleNew(); if (e.key === "Escape") { setCreating(false); setNewName(""); } }}
              placeholder="Collection name…"
              maxLength={40}
              className="w-full text-[12px] px-2 py-1.5 rounded-lg border border-[#007AFF]/50 outline-none bg-[#007AFF]/5 text-[#1C1C1E] placeholder-[#C7C7CC]"
            />
            <div className="flex gap-1 mt-1">
              <button onClick={handleNew} disabled={!newName.trim()} className="flex-1 py-1 rounded-lg bg-[#007AFF] text-white text-[11px] font-bold disabled:opacity-40">Create</button>
              <button onClick={() => { setCreating(false); setNewName(""); }} className="px-2 py-1 rounded-lg text-[#8E8E93] text-[11px] hover:bg-[#F2F2F7]">Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="w-full text-left px-3 py-2.5 text-[12px] text-[#007AFF] hover:bg-[#F2F2F7] flex items-center gap-1.5"
          >
            <span className="font-bold">+</span> New collection
          </button>
        )}
      </div>
    </div>
  );
}

function GoalRing({ done, goal }) {
  const pct  = goal > 0 ? Math.min(done / goal, 1) : 0;
  const r    = 12;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="16" cy="16" r={r} fill="none" stroke="#F2F2F7" strokeWidth="3" />
      <circle cx="16" cy="16" r={r} fill="none"
        stroke={done >= goal ? "#34C759" : "#007AFF"}
        strokeWidth="3"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.4s ease" }}
      />
    </svg>
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

// #25 Voice mic for free-text answers (Web Speech API)
function VoiceMic({ onTranscript }) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const supported = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  if (!supported) return null;

  const toggle = () => {
    if (listening) { recRef.current?.stop(); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => onTranscript(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  };

  return (
    <button onClick={toggle} title={listening ? "Stop" : "Speak your answer"}
      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${listening ? "bg-[#FF3B30] text-white" : "bg-white border border-[#E5E5EA] text-[#8E8E93] hover:border-[#007AFF] hover:text-[#007AFF]"}`}>
      {listening ? "■" : "🎤"}
    </button>
  );
}

// #19 Report modal — distinct from quick flag
function ReportModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState("wrong_answer");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reasons = [
    { id: "wrong_answer",     label: "Marked answer is wrong" },
    { id: "confusing_wording",label: "Question wording is unclear" },
    { id: "broken_image",     label: "Image is broken or missing" },
    { id: "off_syllabus",     label: "Off the syllabus" },
    { id: "duplicate",        label: "Duplicate of another question" },
    { id: "other",            label: "Other" },
  ];

  const submit = async () => {
    setSubmitting(true);
    try { await onSubmit(reason, note); } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[16px] font-bold text-[var(--label)] mb-1">Report this question</h3>
        <p className="text-[12px] text-[#8E8E93] mb-4">A reviewer will look at this within 48h.</p>
        <div className="space-y-1 mb-4">
          {reasons.map((r) => (
            <label key={r.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FAFAFB] cursor-pointer">
              <input type="radio" name="report-reason" value={r.id} checked={reason === r.id} onChange={() => setReason(r.id)} className="accent-[#FF3B30]" />
              <span className="text-[13px] text-[var(--label)]">{r.label}</span>
            </label>
          ))}
        </div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note (max 500 chars)" rows={2} maxLength={500}
          className="w-full text-[13px] px-3 py-2 rounded-xl bg-white border border-[#E5E5EA] focus:outline-none focus:border-[#FF3B30] resize-none mb-4" />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#E5E5EA] text-[12px] font-semibold text-[#3A3A3C]">Cancel</button>
          <button onClick={submit} disabled={submitting} className="px-4 py-2 rounded-lg bg-[#FF3B30] text-white text-[12px] font-semibold disabled:opacity-50">
            {submitting ? "Sending…" : "Submit report"}
          </button>
        </div>
      </div>
    </div>
  );
}
