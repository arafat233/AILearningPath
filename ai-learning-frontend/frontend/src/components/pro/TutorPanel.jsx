/**
 * TutorPanel — AI Socratic Tutor sidebar for ProExerciseRunner.
 *
 * Rendered as a fixed right-side drawer overlay so it never disrupts the
 * existing 2-column editor layout. Toggle via the "Ask tutor" button in the
 * exercise header.
 *
 * B6: collapsible chat sidebar showing conversation history for the exercise.
 * B7: 👍/👎 feedback buttons on each assistant message.
 * B9: surfaces "code too long" and rate-limit errors inline.
 */

import { useEffect, useRef, useState } from "react";
import { proTutorAsk, proTutorGetSession, proTutorRate } from "../../services/api";

export default function TutorPanel({ exerciseId, studentCode, open, onClose }) {
  const [messages, setMessages]     = useState([]);
  const [sessionId, setSessionId]   = useState(null);
  const [question, setQuestion]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [rateRemaining, setRateRemaining] = useState(null);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Load existing session when panel opens
  useEffect(() => {
    if (!open || !exerciseId) return;
    proTutorGetSession(exerciseId)
      .then((r) => {
        const s = r.data?.data;
        if (s?.messages?.length) setMessages(s.messages);
        if (s?._id) setSessionId(s._id);
        if (s?.sessionId) setSessionId(s.sessionId);
      })
      .catch(() => {}); // silently ignore — session will be created on first ask
  }, [open, exerciseId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const handleAsk = async () => {
    const q = question.trim();
    if (!q || loading) return;
    setError("");
    setLoading(true);
    try {
      const r = await proTutorAsk(exerciseId, studentCode || "", q);
      const d = r.data?.data;
      setMessages(d.messages || []);
      if (d.sessionId) setSessionId(d.sessionId);
      if (d.rateRemaining != null) setRateRemaining(d.rateRemaining);
      setQuestion("");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Tutor is temporarily unavailable.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk(); }
  };

  const handleRate = async (msgIdx, rating) => {
    if (!sessionId) return;
    // Optimistic update
    setMessages((prev) =>
      prev.map((m, i) => (i === msgIdx ? { ...m, rating } : m))
    );
    try {
      await proTutorRate(sessionId, msgIdx, rating);
    } catch {
      // Revert optimistic on failure
      setMessages((prev) =>
        prev.map((m, i) => (i === msgIdx ? { ...m, rating: null } : m))
      );
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 z-50 h-screen w-full max-w-[420px] flex flex-col bg-[var(--bg)] border-l border-apple-gray5 shadow-2xl"
        role="dialog"
        aria-label="AI Socratic Tutor"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-apple-gray5 shrink-0">
          <div>
            <p className="text-[15px] font-bold text-[var(--label)]">AI Tutor</p>
            <p className="text-[11px] text-apple-gray mt-0.5">
              Ask a question — the tutor will guide you, not give the answer.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-apple-gray6 transition-colors text-apple-gray"
            aria-label="Close tutor"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"
                 strokeLinecap="round" className="w-4 h-4">
              <path d="M3 3l10 10M13 3L3 13"/>
            </svg>
          </button>
        </div>

        {/* Rate-limit info */}
        {rateRemaining != null && (
          <div className="px-5 py-1.5 bg-apple-gray6 border-b border-apple-gray5 shrink-0">
            <p className="text-[10px] text-apple-gray">
              {rateRemaining} of 10 questions remaining this hour
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && !loading && (
            <div className="text-center mt-12 px-4">
              <p className="text-[32px] mb-3">🤔</p>
              <p className="text-[14px] font-semibold text-[var(--label)]">Stuck? Ask the tutor.</p>
              <p className="text-[12px] text-apple-gray mt-1 leading-relaxed">
                Describe what you're trying to do or what's confusing. The tutor will ask you a
                question to help you figure it out yourself.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-apple-blue text-white rounded-br-sm"
                    : "bg-[var(--fill)] text-[var(--label)] rounded-bl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* B7: thumbs up/down on assistant messages */}
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-black/10">
                    <span className="text-[10px] text-apple-gray3 mr-auto">Helpful?</span>
                    <button
                      onClick={() => handleRate(i, msg.rating === 1 ? null : 1)}
                      title="Helpful"
                      className={`text-[14px] transition-opacity ${
                        msg.rating === 1 ? "opacity-100" : "opacity-40 hover:opacity-70"
                      }`}
                    >
                      👍
                    </button>
                    <button
                      onClick={() => handleRate(i, msg.rating === -1 ? null : -1)}
                      title="Not helpful"
                      className={`text-[14px] transition-opacity ${
                        msg.rating === -1 ? "opacity-100" : "opacity-40 hover:opacity-70"
                      }`}
                    >
                      👎
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[var(--fill)] rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center h-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-apple-gray animate-bounce [animation-delay:0ms]"/>
                  <span className="w-1.5 h-1.5 rounded-full bg-apple-gray animate-bounce [animation-delay:150ms]"/>
                  <span className="w-1.5 h-1.5 rounded-full bg-apple-gray animate-bounce [animation-delay:300ms]"/>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 pb-2 shrink-0">
            <div className="card p-2.5 border-l-4 border-apple-red">
              <p className="text-[11px] text-apple-red font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-5 pt-2 border-t border-apple-gray5 shrink-0">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="What are you confused about? Press Enter to send."
              rows={2}
              className="flex-1 resize-none rounded-xl border border-apple-gray5 bg-[var(--fill)] px-3 py-2.5 text-[13px] text-[var(--label)] placeholder:text-apple-gray4 outline-none focus:border-apple-blue transition-colors disabled:opacity-50"
            />
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="btn-primary shrink-0 px-4 py-2.5 text-[13px] font-semibold disabled:opacity-40"
            >
              Ask
            </button>
          </div>
          <p className="text-[10px] text-apple-gray3 mt-1.5">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </>
  );
}
