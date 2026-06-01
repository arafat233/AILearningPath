/**
 * tutorService — AI Socratic Tutor for Pro track exercises (ROADMAP §B3).
 *
 * Uses @anthropic-ai/sdk (already installed). Model defaults to
 * claude-sonnet-4-6; override via TUTOR_MODEL env var.
 *
 * Rate limit: 10 questions / hour / user via Redis incrBy.
 * Cost guardrail: rejects studentCode > 8 000 chars.
 */

import Anthropic from "@anthropic-ai/sdk";
import { ProTutorSession, ProExercise } from "../models/proModels.js";
import { incrBy } from "../utils/redisClient.js";
import { AppError } from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { buildSystemPrompt } from "./tutorPrompts.js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TUTOR_MODEL       = process.env.TUTOR_MODEL || "claude-sonnet-4-6";
const RATE_LIMIT        = 10;          // questions per hour per user
const CODE_LENGTH_LIMIT = 8_000;       // chars

export async function ask({ userId, exerciseId, studentCode, question }) {
  // B9: cost guardrail
  if (studentCode && studentCode.length > CODE_LENGTH_LIMIT) {
    throw new AppError(
      "Your code is too long for the tutor (limit: 8 000 characters). " +
      "Paste a specific snippet instead.",
      400
    );
  }

  // B5: per-user hourly rate limit via Redis
  const rlKey = `tutor_rl:${userId}`;
  const count = await incrBy(rlKey, 1, 3600);
  if (count > RATE_LIMIT) {
    throw new AppError(
      `Rate limit reached: ${RATE_LIMIT} tutor questions per hour. Try again later.`,
      429
    );
  }

  // Load or create the session for this (userId, exerciseId) pair
  let session = await ProTutorSession.findOne({ userId, exerciseId });
  if (!session) {
    session = new ProTutorSession({ userId, exerciseId, messages: [] });
  }

  // Exercise context — title + instructions only; expectedSolution intentionally excluded
  const exercise = await ProExercise.findOne({ exerciseId })
    .select("title scenario instructions starterCode type")
    .lean();

  const userMsgCount = session.messages.filter((m) => m.role === "user").length;
  const systemPrompt = buildSystemPrompt(exercise, studentCode || "", userMsgCount);

  // Build message history for Claude
  const history = session.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const t0 = Date.now();
  let reply;
  try {
    const resp = await anthropic.messages.create({
      model: TUTOR_MODEL,
      max_tokens: 512,
      system: systemPrompt,
      messages: [...history, { role: "user", content: question }],
    });
    reply = resp.content[0]?.text ?? "";
  } catch (err) {
    logger.error("tutorService: Claude API error", { err: err.message, userId, exerciseId });
    throw new AppError("Tutor is temporarily unavailable. Please try again in a moment.", 503);
  }
  const durationMs = Date.now() - t0;

  // Persist both messages
  const now = new Date();
  session.messages.push({ role: "user",      content: question, ts: now,            rating: null });
  session.messages.push({ role: "assistant",  content: reply,    ts: new Date(),     rating: null });
  await session.save();

  // B8: telemetry
  logger.info("pro.tutor.message_sent", {
    exerciseId,
    messageLength: question.length,
    durationMs,
    model: TUTOR_MODEL,
    sessionId: String(session._id),
  });

  return {
    reply,
    sessionId:    String(session._id),
    messageIndex: session.messages.length - 1, // index of the assistant message just added
    rateRemaining: Math.max(0, RATE_LIMIT - count),
    messages:     session.messages,
  };
}

export async function getSession({ userId, exerciseId }) {
  const session = await ProTutorSession.findOne({ userId, exerciseId }).lean();
  return session ?? { messages: [], sessionId: null };
}

export async function rateMessage({ userId, sessionId, messageIndex, rating }) {
  const session = await ProTutorSession.findOne({ _id: sessionId, userId });
  if (!session) throw new AppError("Session not found.", 404);

  const msg = session.messages[messageIndex];
  if (!msg) throw new AppError("Message index out of range.", 400);
  if (msg.role !== "assistant") throw new AppError("Can only rate assistant messages.", 400);

  session.messages[messageIndex].rating = rating;
  session.markModified("messages");
  await session.save();
  return { ok: true };
}
