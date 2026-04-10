import { useState, useRef } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

export default function VoiceTutor() {
  const token    = useAuthStore((s) => s.token);
  const [chat, setChat]         = useState([]);
  const [text, setText]         = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const recognitionRef = useRef(null);

  const isSupported = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  const speak = (msg) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(msg);
    u.rate = 1; u.pitch = 1;
    u.onstart  = () => setSpeaking(true);
    u.onend    = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const sendMessage = async (msg) => {
    if (!msg.trim()) return;
    setLoading(true);
    setError("");
    setChat((c) => [...c, { role: "user", text: msg }]);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/ai/advice",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const reply = data.advice || "I'm here to help! Ask me anything about your topics.";
      setChat((c) => [...c, { role: "ai", text: reply }]);
      speak(reply);
    } catch {
      setError("Could not reach AI tutor. Check backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!isSupported) { setError("Voice not supported in this browser. Use Chrome."); return; }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recog = new SpeechRecognition();
    recog.continuous     = false;
    recog.interimResults = false;
    recog.lang           = "en-IN";

    recog.onstart  = () => setListening(true);
    recog.onend    = () => setListening(false);
    recog.onerror  = () => { setListening(false); setError("Could not hear you. Try again."); };

    recog.onresult = (e) => {
      const spoken = e.results[0][0].transcript;
      setText(spoken);
      sendMessage(spoken);
    };

    recog.start();
    recognitionRef.current = recog;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Voice Tutor</h1>
      <p className="text-sm text-gray-500 mb-5">
        {isSupported
          ? "Click the mic and ask any question — the AI tutor will answer in voice."
          : "Voice requires Chrome browser. You can still type below."}
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
      )}

      {/* Chat window */}
      <div className="card p-4 mb-4 h-72 overflow-y-auto flex flex-col gap-3">
        {chat.length === 0 && (
          <div className="text-center text-gray-400 text-sm my-auto">
            <p className="text-3xl mb-2">🎙️</p>
            <p>Press the mic button and ask anything!</p>
            <p className="text-xs mt-1">e.g. "Explain the discriminant" or "Why do I keep getting trigonometry wrong?"</p>
          </div>
        )}
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-brand-500 text-white rounded-br-sm"
                : "bg-gray-100 text-gray-800 rounded-bl-sm"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Mic button */}
        {isSupported && (
          <button
            onClick={listening ? stopListening : startListening}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all shrink-0 ${
              listening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-brand-500 text-white hover:bg-brand-600"
            }`}
          >
            {listening ? "■" : "🎤"}
          </button>
        )}

        {/* Text input fallback */}
        <input
          className="input flex-1"
          placeholder="Or type your question here…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { sendMessage(text); setText(""); } }}
        />
        <button
          onClick={() => { sendMessage(text); setText(""); }}
          disabled={!text.trim() || loading}
          className="btn-primary shrink-0"
        >
          Ask
        </button>
      </div>

      {/* Speaking indicator */}
      {speaking && (
        <div className="flex items-center gap-2 mt-3 text-sm text-brand-500">
          <span className="animate-pulse">🔊</span>
          <span>AI is speaking…</span>
          <button onClick={stopSpeaking} className="text-xs text-gray-400 hover:text-gray-700 underline ml-1">
            Stop
          </button>
        </div>
      )}

      {/* Quick prompts */}
      <div className="mt-5">
        <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Why am I weak in Trigonometry?",
            "Explain the discriminant",
            "What should I study today?",
            "How do I improve my score?",
          ].map((q) => (
            <button
              key={q}
              onClick={() => { setText(q); sendMessage(q); }}
              className="text-xs px-3 py-1.5 border border-surface-border rounded-full hover:border-brand-400 hover:text-brand-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
