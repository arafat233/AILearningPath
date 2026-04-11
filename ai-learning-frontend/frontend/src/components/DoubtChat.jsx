import { useState, useEffect, useRef } from "react";
import { getDoubtThread, sendDoubtMessage, clearDoubtThread } from "../services/api";

export default function DoubtChat({ questionId, topic, subject }) {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!open || !questionId || questionId === "ai-generated") return;
    getDoubtThread(questionId)
      .then((r) => setMessages(r.data.messages || []))
      .catch(() => {});
  }, [open, questionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setLoading(true);
    setError("");
    try {
      const { data } = await sendDoubtMessage(questionId, msg, topic, subject);
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (err) {
      const errMsg = err.response?.data?.error || "AI response failed. Try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    await clearDoubtThread(questionId).catch(() => {});
    setMessages([]);
  };

  if (!questionId || questionId === "ai-generated") return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-[13px] text-apple-blue hover:underline flex items-center gap-1"
      >
        {open ? "▲ Hide" : "▼ Still confused?"} Ask a follow-up question
      </button>

      {open && (
        <div className="mt-3 border border-apple-gray5 rounded-apple-xl overflow-hidden">
          {/* Chat history */}
          <div className="h-52 overflow-y-auto p-3 flex flex-col gap-2 bg-apple-gray6">
            {messages.length === 0 && (
              <p className="text-[12px] text-apple-gray text-center mt-8">
                Ask anything about this question — I'll explain step by step.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] text-[13px] px-3 py-2 rounded-[14px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-apple-blue text-white rounded-br-[4px]"
                    : "bg-white text-[var(--label)] rounded-bl-[4px] shadow-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-3 py-2 rounded-[14px] rounded-bl-[4px] flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-apple-gray3 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-apple-gray3 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-apple-gray3 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {error && (
            <div className="px-3 py-2 text-[12px] text-apple-red bg-apple-red/5 border-t border-apple-gray5">
              {error}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 p-2 border-t border-apple-gray5 bg-white">
            <input
              className="input flex-1 text-[13px] py-1.5"
              placeholder="Ask a follow-up…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            />
            <button onClick={send} disabled={!input.trim() || loading} className="btn-primary text-[12px] py-1.5 px-3">
              Send
            </button>
            {messages.length > 0 && (
              <button onClick={clear} className="btn-ghost text-[11px] text-apple-gray">Clear</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
