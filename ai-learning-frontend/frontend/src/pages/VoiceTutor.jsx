import { useState, useRef, useEffect } from "react";
import {
  voiceAnswer, askTutor, getVoiceHistory, clearVoiceHistory,
  getDailyBrief, saveVoiceTutorNote,
} from "../services/api";
import { useAuthStore } from "../store/authStore";
import VoiceTutorView from "./VoiceTutorView";

const QUICK_PROMPTS = {
  Math:            ["Explain the discriminant", "Why is Pythagoras useful?", "How do I solve quadratics?", "Area of a circle formula?"],
  Science:         ["Explain refraction of light", "What is Ohm's law?", "How does photosynthesis work?", "What is DNA?"],
  English:         ["What is passive voice?", "How to write a formal letter?", "Explain theme vs plot", "What is a metaphor?"],
  "Social Science":["What caused WWI?", "Explain federalism", "What is the HDI?", "Non-cooperation movement?"],
  Hindi:           ["संज्ञा और सर्वनाम में क्या अंतर है?", "औपचारिक पत्र कैसे लिखें?", "काल के प्रकार बताएं", "मुझे कमज़ोर विषय में मदद चाहिए"],
};

export default function VoiceTutorContainer() {
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
  const timerRef       = useRef(null);

  const isSupported  = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
  const quickPrompts = QUICK_PROMPTS[subject] || QUICK_PROMPTS.Math;
  const activeTopic  = topic || subject;

  const exchanges      = chat.filter((m) => m.role === "user");
  const sessionCovered = [...new Set(exchanges.map((m) => {
    const words = m.content.trim().split(/\s+/);
    return words.slice(0, 4).join(" ") + (words.length > 4 ? "…" : "");
  }))].slice(0, 6);
  const showSummary = exchanges.length >= 3;

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

  useEffect(() => {
    if (listening) {
      setListenSecs(0);
      timerRef.current = setInterval(() => setListenSecs((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [listening]);

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
    const msgIndex = chat.length + 1;
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

  return (
    <VoiceTutorView
      subject={subject}
      isHindi={isHindi}
      isSupported={isSupported}
      chat={chat}
      text={text}
      topic={topic}
      listening={listening}
      speaking={speaking}
      speakingIdx={speakingIdx}
      loading={loading}
      historyLoading={historyLoading}
      status={status}
      error={error}
      listenSecs={listenSecs}
      followUps={followUps}
      savedIdx={savedIdx}
      weakTopics={weakTopics}
      summaryOpen={summaryOpen}
      limitReached={limitReached}
      user={user}
      quickPrompts={quickPrompts}
      exchanges={exchanges}
      sessionCovered={sessionCovered}
      showSummary={showSummary}
      setText={setText}
      setTopic={setTopic}
      handleClearHistory={handleClearHistory}
      startListening={startListening}
      stopListening={stopListening}
      speak={speak}
      stopSpeaking={stopSpeaking}
      sendMessage={sendMessage}
      handleSaveNote={handleSaveNote}
      setSummaryOpen={setSummaryOpen}
    />
  );
}
