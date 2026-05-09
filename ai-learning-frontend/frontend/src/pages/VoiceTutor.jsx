import { useState, useRef, useEffect } from "react";
import {
  voiceAnswer, askTutor, getVoiceHistory, clearVoiceHistory,
  getDailyBrief, saveVoiceTutorNote,
} from "../services/api";
import { useAuthStore } from "../store/authStore";
import AICreditsIndicator from "../components/AICreditsIndicator";

/* ── Sub-components ────────────────────────────────────────────── */

function StatusBadge({ status }) {
  const map = {
    loading: { cls: "bg-apple-orange",                  label: "Connecting…" },
    ready:   { cls: "bg-apple-green animate-pulse",     label: "Connected"   },
    error:   { cls: "bg-apple-red",                     label: "Offline"     },
  };
  const { cls, label } = map[status] || map.ready;
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#f0f0f5] bg-white shadow-sm shrink-0">
      <span className={`w-2 h-2 rounded-full ${cls}`} />
      <span className="text-[12px] font-medium text-[#3a3a3c]">{label}</span>
    </div>
  );
}

function StellarAvatar({ size = 32 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{ width: size, height: size, background: "linear-gradient(135deg,#c8b4f0,#f0a0cc)" }}
    >
      <svg width={size * 0.44} height={size * 0.44} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>
      </svg>
    </div>
  );
}

const BAR_HEIGHTS = [10, 18, 14, 22, 12, 20, 10, 16, 8, 14];
function Waveform({ color = "#FF3B30" }) {
  return (
    <div className="flex items-center gap-[3px]" aria-hidden>
      {BAR_HEIGHTS.map((h, i) => (
        <div key={i} className="rounded-full animate-bounce"
          style={{ width: 3, height: h, background: color, animationDelay: `${i * 60}ms`, animationDuration: `${500 + (i % 3) * 120}ms` }} />
      ))}
    </div>
  );
}

/* ── Quick prompts per subject ──────────────────────────────────── */
const QUICK_PROMPTS = {
  Math:            ["Explain the discriminant", "Why is Pythagoras useful?", "How do I solve quadratics?", "Area of a circle formula?"],
  Science:         ["Explain refraction of light", "What is Ohm's law?", "How does photosynthesis work?", "What is DNA?"],
  English:         ["What is passive voice?", "How to write a formal letter?", "Explain theme vs plot", "What is a metaphor?"],
  "Social Science":["What caused WWI?", "Explain federalism", "What is the HDI?", "Non-cooperation movement?"],
  Hindi:           ["संज्ञा और सर्वनाम में क्या अंतर है?", "औपचारिक पत्र कैसे लिखें?", "काल के प्रकार बताएं", "मुझे कमज़ोर विषय में मदद चाहिए"],
};

/* ── Main component ─────────────────────────────────────────────── */

export default function VoiceTutor() {
  const user    = useAuthStore((s) => s.user);
  const subject = user?.subject || "Math";
  const isHindi = subject === "Hindi";

  const [chat,           setChat]          = useState([]);
  const [text,           setText]          = useState("");
  const [topic,          setTopic]         = useState("");
  const [listening,      setListening]     = useState(false);
  const [speaking,       setSpeaking]      = useState(false);
  const [speakingIdx,    setSpeakingIdx]   = useState(null);
  const [loading,        setLoading]       = useState(false);
  const [historyLoading, setHistoryLoading]= useState(true);
  const [status,         setStatus]        = useState("loading");
  const [error,          setError]         = useState("");
  const [listenSecs,     setListenSecs]    = useState(0);
  const [followUps,      setFollowUps]     = useState([]);
  const [savedIdx,       setSavedIdx]      = useState(new Set());
  const [weakTopics,     setWeakTopics]    = useState([]);
  const [summaryOpen,    setSummaryOpen]   = useState(true);
  const [limitReached,   setLimitReached]  = useState(false);

  const recognitionRef = useRef(null);
  const bottomRef      = useRef(null);
  const timerRef       = useRef(null);

  const isSupported  = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
  const quickPrompts = QUICK_PROMPTS[subject] || QUICK_PROMPTS.Math;
  const activeTopic  = topic || subject;

  // Session summary — derived from user messages, shown after 3+ exchanges
  const exchanges      = chat.filter((m) => m.role === "user");
  const sessionCovered = [...new Set(exchanges.map((m) => {
    const words = m.content.trim().split(/\s+/);
    return words.slice(0, 4).join(" ") + (words.length > 4 ? "…" : "");
  }))].slice(0, 6);
  const showSummary = exchanges.length >= 3;

  /* Load history + weak topics on mount */
  useEffect(() => {
    let dead = false;
    Promise.all([
      getVoiceHistory().then((r) => r.data.history || []),
      getDailyBrief().then((r) => (r.data?.data?.weakTopics || []).slice(0, 5)).catch(() => []),
    ])
      .then(([history, topics]) => {
        if (dead) return;
        if (history.length) setChat(history);
        setWeakTopics(topics);
        setStatus("ready");
      })
      .catch(() => { if (!dead) setStatus("error"); })
      .finally(() => { if (!dead) setHistoryLoading(false); });
    return () => { dead = true; };
  }, []);

  /* Scroll to bottom on new message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading, followUps]);

  /* Listening timer */
  useEffect(() => {
    if (listening) {
      setListenSecs(0);
      timerRef.current = setInterval(() => setListenSecs((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [listening]);

  /* ── Helpers ── */
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const speak = (msg, idx = null) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(msg);
    u.rate  = 1; u.pitch = 1;
    u.lang  = isHindi ? "hi-IN" : "en-IN";
    u.onstart = () => { setSpeaking(true); setSpeakingIdx(idx); };
    u.onend   = () => { setSpeaking(false); setSpeakingIdx(null); };
    window.speechSynthesis.speak(u);
  };

  const stopSpeaking = () => { window.speechSynthesis.cancel(); setSpeaking(false); setSpeakingIdx(null); };

  const handleSaveNote = async (content, idx) => {
    try {
      await saveVoiceTutorNote({ content, topic: activeTopic, subject });
      setSavedIdx((prev) => new Set([...prev, idx]));
    } catch { /* silent */ }
  };

  const handleClearHistory = async () => {
    await clearVoiceHistory().catch(() => {});
    setChat([]); setFollowUps([]); setSavedIdx(new Set());
  };

  const sendMessage = async (msg, fromMic = false) => {
    if (!msg.trim() || loading || limitReached) return;
    const msgIndex = chat.length + 1; // index of the upcoming assistant reply
    setChat((c) => [...c, { role: "user", content: msg }]);
    setText(""); setFollowUps([]); setLoading(true); setError("");

    try {
      let reply, suggestions = [];
      if (fromMic) {
        const { data } = await voiceAnswer(msg, activeTopic, subject);
        reply = data.answer; suggestions = data.followUps || [];
      } else {
        const history = chat.map((m) => ({ role: m.role, content: m.content }));
        const { data } = await askTutor(msg, history, activeTopic, subject);
        reply = data.reply; suggestions = data.followUps || [];
      }
      const finalReply = reply || "I'm here to help! Could you rephrase that?";
      setChat((c) => [...c, { role: "assistant", content: finalReply }]);
      setFollowUps(suggestions);
      speak(finalReply, msgIndex);
    } catch (err) {
      if (err?.response?.status === 429 && err?.response?.data?.error === "daily_limit_reached") {
        setLimitReached(true);
      } else {
        setError("Could not reach Stellar. Check the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!isSupported) { setError("Voice not supported. Please use Chrome or Edge."); return; }
    const SR = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recog = new SR();
    recog.continuous = false; recog.interimResults = false;
    recog.lang = isHindi ? "hi-IN" : "en-IN";
    recog.onstart  = () => setListening(true);
    recog.onend    = () => setListening(false);
    recog.onerror  = () => { setListening(false); setError("Could not hear you. Try again."); };
    recog.onresult = (e) => {
      const spoken = e.results[0][0].transcript;
      setText(spoken); sendMessage(spoken, true);
    };
    recog.start();
    recognitionRef.current = recog;
  };

  const stopListening = () => { recognitionRef.current?.stop(); setListening(false); };

  /* ── Render ── */
  return (
    <div className="w-full space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-1">
            Stellar · Voice Tutor
          </p>
          <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">{subject}</h1>
          <p className="text-[14px] text-apple-gray mt-0.5">
            {isSupported
              ? `Ask anything — speak or type. Stellar will answer${isHindi ? " in Hindi too" : ""}.`
              : "Voice requires Chrome or Edge. You can still type below."}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1 shrink-0">
          <AICreditsIndicator compact />
          {chat.length > 0 && (
            <button onClick={handleClearHistory}
              className="text-[12px] text-apple-gray hover:text-apple-red transition-colors border border-apple-gray5 px-3 py-1.5 rounded-apple">
              Clear
            </button>
          )}
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Topic picker */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#8e8e93] mb-2">Focus topic</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTopic("")}
            className={`text-[12px] px-3 py-1.5 rounded-full border transition-all ${
              !topic
                ? "bg-[#1c1c1e] text-white border-[#1c1c1e]"
                : "bg-white border-[#e5e5ea] text-[#3a3a3c] hover:border-[#c7c7cc]"
            }`}
          >
            General
          </button>
          {weakTopics.map((t) => (
            <button key={t.topic}
              onClick={() => setTopic(t.topic)}
              className={`text-[12px] px-3 py-1.5 rounded-full border transition-all ${
                topic === t.topic
                  ? "bg-apple-blue text-white border-apple-blue"
                  : "bg-white border-[#e5e5ea] text-[#3a3a3c] hover:border-apple-blue/40"
              }`}
            >
              {t.topic}
            </button>
          ))}
        </div>
        {topic && (
          <p className="text-[11px] text-apple-blue mt-1.5 font-medium">
            Focusing on: <strong>{topic}</strong>
          </p>
        )}
      </div>

      {error && (
        <div className="bg-apple-red/8 border border-apple-red/20 text-apple-red text-[13px] px-4 py-3 rounded-apple-lg">
          {error}
        </div>
      )}

      {/* Daily limit reached */}
      {limitReached && (
        <div className="bg-apple-orange/8 border border-apple-orange/25 px-5 py-4 rounded-2xl flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <p className="text-[13px] font-semibold text-apple-orange">Daily AI limit reached</p>
            <p className="text-[12px] text-[#8e8e93] mt-0.5">
              You've used your free daily quota. Upgrade to Pro (100/day) or Premium (500/day) for more.
            </p>
          </div>
        </div>
      )}

      {/* Session summary — appears after 3+ exchanges, collapsible */}
      {showSummary && (
        <div className="rounded-xl border border-[#f0f0f5] bg-[#fafafa] px-4 py-3">
          <button
            onClick={() => setSummaryOpen((o) => !o)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#8e8e93]">
              What we covered · {exchanges.length} {exchanges.length === 1 ? "exchange" : "exchanges"}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round"
              className={`transition-transform duration-200 ${summaryOpen ? "rotate-180" : ""}`}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {summaryOpen && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {sessionCovered.map((phrase, i) => (
                <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-[#e5e5ea] text-[#3a3a3c]">
                  {phrase}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chat window */}
      <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm p-5 h-[440px] overflow-y-auto flex flex-col gap-4">

        {/* Loading skeleton */}
        {historyLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="w-5 h-5 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state — quick prompts live here, not below the input */}
        {!historyLoading && chat.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-5">
            <StellarAvatar size={52} />
            <div>
              <p className="text-[15px] font-semibold text-[#1c1c1e] mb-1">
                Stellar is ready — ask anything about {topic || subject}
              </p>
              <p className="text-[13px] text-apple-gray">Press the mic button or try one of these</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {quickPrompts.map((q) => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="text-[12px] px-3 py-1.5 bg-[#f5f5fa] border border-[#e5e5ea] text-[#3a3a3c] rounded-full hover:border-apple-blue/30 hover:text-apple-blue transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {chat.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            {msg.role === "assistant"
              ? <StellarAvatar size={32} />
              : (
                <div className="w-8 h-8 rounded-full bg-apple-blue flex items-center justify-center shrink-0">
                  <span className="text-white text-[11px] font-bold">
                    {(user?.name?.[0] || "U").toUpperCase()}
                  </span>
                </div>
              )
            }

            {/* Bubble + actions */}
            <div className={`max-w-[75%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-4 py-2.5 rounded-[18px] text-[14px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-apple-blue text-white rounded-br-[4px]"
                  : "bg-[#f5f5fa] text-[#1c1c1e] rounded-bl-[4px]"
              }`}>
                {msg.content}
              </div>

              {/* Hover actions on AI bubbles */}
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1 mt-1.5 opacity-0 hover:opacity-100 focus-within:opacity-100 group-hover:opacity-100 transition-opacity"
                  style={{ opacity: (speakingIdx === i || savedIdx.has(i)) ? 1 : undefined }}
                >
                  {/* Replay */}
                  <button
                    onClick={() => speakingIdx === i ? stopSpeaking() : speak(msg.content, i)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      speakingIdx === i
                        ? "bg-apple-blue/10 text-apple-blue"
                        : "text-[#8e8e93] hover:text-apple-blue hover:bg-apple-blue/8"
                    }`}
                  >
                    {speakingIdx === i ? (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                      </svg>
                    ) : (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/>
                      </svg>
                    )}
                    {speakingIdx === i ? "Stop" : "Replay"}
                  </button>

                  {/* Save to notes */}
                  <button
                    onClick={() => !savedIdx.has(i) && handleSaveNote(msg.content, i)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      savedIdx.has(i)
                        ? "text-apple-orange bg-apple-orange/10 cursor-default"
                        : "text-[#8e8e93] hover:text-apple-orange hover:bg-apple-orange/8"
                    }`}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24"
                      fill={savedIdx.has(i) ? "currentColor" : "none"}
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                    </svg>
                    {savedIdx.has(i) ? "Saved" : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-2.5">
            <StellarAvatar size={32} />
            <div className="bg-[#f5f5fa] px-4 py-3 rounded-[18px] rounded-bl-[4px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-apple-gray3 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-apple-gray3 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-apple-gray3 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Follow-up chips — contextual suggestions after each reply */}
        {followUps.length > 0 && !loading && (
          <div className="flex flex-wrap gap-2 pl-[42px]">
            {followUps.map((q) => (
              <button key={q} onClick={() => sendMessage(q)}
                className="text-[12px] px-3 py-1.5 bg-white border border-apple-blue/25 text-apple-blue rounded-full hover:bg-apple-blue/5 transition-colors">
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Listening / speaking indicator with timer */}
      {(listening || speaking) && (
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${
          listening
            ? "bg-apple-red/8 border border-apple-red/20"
            : "bg-apple-blue/8 border border-apple-blue/20"
        }`}>
          <Waveform color={listening ? "#FF3B30" : "#007AFF"} />
          <span className={`text-[13px] font-medium ${listening ? "text-apple-red" : "text-apple-blue"}`}>
            {listening ? `Listening… ${fmt(listenSecs)}` : "Stellar is speaking…"}
          </span>
          {speaking && (
            <button onClick={stopSpeaking}
              className="ml-auto text-[12px] text-apple-gray hover:text-apple-red transition-colors">
              Stop
            </button>
          )}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-3">
        {isSupported && (
          <button
            onClick={listening ? stopListening : startListening}
            disabled={loading}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-[background-color,opacity,transform] active:scale-[0.93] shrink-0 shadow-sm ${
              listening
                ? "bg-apple-red text-white"
                : "bg-apple-blue text-white hover:opacity-90 disabled:opacity-50"
            }`}
          >
            {listening ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            )}
          </button>
        )}
        <input
          className="input flex-1"
          placeholder={isHindi ? "अपना प्रश्न लिखें…" : topic ? `Ask about ${topic}…` : "Type your question…"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(text); }}
        />
        <button
          onClick={() => sendMessage(text)}
          disabled={!text.trim() || loading}
          className="btn-primary shrink-0"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
