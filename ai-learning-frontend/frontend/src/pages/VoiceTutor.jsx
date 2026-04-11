import { useState, useRef, useEffect } from "react";
import { voiceAnswer, askTutor } from "../services/api";
import { useAuthStore } from "../store/authStore";

const QUICK_PROMPTS_BY_SUBJECT = {
  Math:            ["Explain the discriminant", "Why is Pythagoras useful?", "How do I solve quadratics?", "What is the formula for area of a circle?"],
  Science:         ["Explain refraction of light", "What is Ohm's law?", "How does photosynthesis work?", "What is DNA?"],
  English:         ["What is passive voice?", "How to write a formal letter?", "Explain theme of the poem", "What is a metaphor?"],
  "Social Science":["What caused WWI?", "Explain federalism", "What is the HDI?", "Describe Gandhiji's non-cooperation movement"],
  Hindi:           ["संज्ञा और सर्वनाम में क्या अंतर है?", "औपचारिक पत्र कैसे लिखें?", "काल के प्रकार बताएं", "मुझे कमज़ोर विषय में मदद चाहिए"],
};

export default function VoiceTutor() {
  const user = useAuthStore((s) => s.user);
  const subject = user?.subject || "Math";
  const isHindi = subject === "Hindi";

  const [chat, setChat]           = useState([]);
  const [text, setText]           = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const recognitionRef = useRef(null);
  const bottomRef      = useRef(null);

  const isSupported = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
  const quickPrompts = QUICK_PROMPTS_BY_SUBJECT[subject] || QUICK_PROMPTS_BY_SUBJECT.Math;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const speak = (msg) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(msg);
    u.rate  = 1;
    u.pitch = 1;
    u.lang  = isHindi ? "hi-IN" : "en-IN";
    u.onstart = () => setSpeaking(true);
    u.onend   = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const sendMessage = async (msg, fromMic = false) => {
    if (!msg.trim() || loading) return;
    setChat((c) => [...c, { role: "user", content: msg }]);
    setText("");
    setLoading(true);
    setError("");

    try {
      let reply;
      if (fromMic) {
        // Dedicated voice endpoint — subject-aware, no history (stateless per mic press)
        const { data } = await voiceAnswer(msg, subject);
        reply = data.answer;
      } else {
        // Text chat — keeps history for multi-turn context
        const history = chat.map((m) => ({ role: m.role, content: m.content }));
        const { data } = await askTutor(msg, history, subject);
        reply = data.reply;
      }
      const finalReply = reply || "I'm here to help! Could you rephrase that?";
      setChat((c) => [...c, { role: "assistant", content: finalReply }]);
      speak(finalReply);
    } catch {
      setError("Could not reach AI tutor. Check the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!isSupported) { setError("Voice not supported. Please use Chrome or Edge."); return; }
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recog = new SpeechRecognition();
    recog.continuous     = false;
    recog.interimResults = false;
    recog.lang           = isHindi ? "hi-IN" : "en-IN";
    recog.onstart  = () => setListening(true);
    recog.onend    = () => setListening(false);
    recog.onerror  = () => { setListening(false); setError("Could not hear you. Try again."); };
    recog.onresult = (e) => {
      const spoken = e.results[0][0].transcript;
      setText(spoken);
      sendMessage(spoken, true); // fromMic = true
    };
    recog.start();
    recognitionRef.current = recog;
  };

  const stopListening = () => { recognitionRef.current?.stop(); setListening(false); };
  const stopSpeaking  = () => { window.speechSynthesis.cancel(); setSpeaking(false); };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Voice Tutor</h1>
        <p className="text-[14px] text-apple-gray mt-0.5">
          {isSupported
            ? `Ask anything about ${subject} — speak or type. Your AI tutor will answer${isHindi ? " in Hindi too" : ""}.`
            : "Voice requires Chrome or Edge. You can still type below."}
        </p>
      </div>

      {error && (
        <div className="bg-apple-red/8 border border-apple-red/20 text-apple-red text-[13px] px-4 py-3 rounded-apple-lg">
          {error}
        </div>
      )}

      {/* Chat window */}
      <div className="card p-4 h-80 overflow-y-auto flex flex-col gap-3">
        {chat.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-full bg-apple-blue/10 flex items-center justify-center mb-3">
              <span className="text-2xl">🎙️</span>
            </div>
            <p className="text-[14px] font-semibold text-[var(--label)] mb-1">Ask your AI {subject} tutor anything</p>
            <p className="text-[12px] text-apple-gray">Press the mic or type your question below</p>
          </div>
        )}

        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[78%] px-4 py-2.5 rounded-[18px] text-[14px] leading-relaxed ${
              msg.role === "user"
                ? "bg-apple-blue text-white rounded-br-[4px]"
                : "bg-apple-gray6 text-[var(--label)] rounded-bl-[4px]"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-apple-gray6 px-4 py-2.5 rounded-[18px] rounded-bl-[4px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-apple-gray3 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-apple-gray3 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-apple-gray3 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Speaking indicator */}
      {speaking && (
        <div className="flex items-center gap-2 text-[13px] text-apple-blue">
          <span className="animate-pulse">🔊</span>
          <span>AI is speaking…</span>
          <button onClick={stopSpeaking} className="btn-ghost text-[12px] ml-1">Stop</button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-3">
        {isSupported && (
          <button
            onClick={listening ? stopListening : startListening}
            disabled={loading}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all shrink-0 shadow-apple
              ${listening
                ? "bg-apple-red text-white animate-pulse"
                : "bg-apple-blue text-white hover:opacity-90 disabled:opacity-50"
              }`}
          >
            {listening ? "■" : "🎤"}
          </button>
        )}
        <input
          className="input flex-1"
          placeholder={isHindi ? "अपना प्रश्न लिखें…" : "Or type your question…"}
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

      {/* Quick prompts */}
      <div>
        <p className="text-[11px] text-apple-gray uppercase tracking-wider mb-2">Quick questions</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-[12px] px-3 py-1.5 bg-apple-gray6 border border-apple-gray5
                         text-[var(--label2)] rounded-full hover:border-apple-blue/30
                         hover:text-apple-blue transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
