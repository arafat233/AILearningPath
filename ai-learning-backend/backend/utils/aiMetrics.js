import { AICallLog } from "../models/index.js";

// Fire-and-forget — never blocks the student response.
// Logs every Claude call with latency, token cost, cache/RAG hits.
export function logAICall({ userId, aiType, subject, model, tokens, latencyMs, cached, hitRAG, success }) {
  AICallLog.create({
    userId,
    aiType,
    subject:   subject   || "Math",
    model:     model     || process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
    tokens:    tokens    || 0,
    latencyMs: latencyMs || 0,
    cached:    !!cached,
    hitRAG:    !!hitRAG,
    success:   success !== false,
  }).catch(() => {});
}
