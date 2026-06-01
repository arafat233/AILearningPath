/**
 * interviewService — Interview Simulator backend (ROADMAP H).
 *
 * Problem bank: static JS module (no DB seed needed).
 * Sessions: ProInterviewSession in MongoDB with 30-day TTL.
 * AI: claude-sonnet-4-6 for both interviewer and rubric generation.
 * Rate limit: 3 sessions/day per user via Redis.
 */

import Anthropic from "@anthropic-ai/sdk";
import { ProInterviewSession } from "../models/proModels.js";
import { incrBy } from "../utils/redisClient.js";
import { AppError } from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { buildInterviewerPrompt, buildRubricPrompt } from "./interviewPrompts.js";
import PROBLEMS from "../data/interviewProblems.js";

const anthropic      = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const INTERVIEW_MODEL = process.env.TUTOR_MODEL || "claude-sonnet-4-6";
const DAILY_LIMIT    = 3;   // sessions per user per day
const MAX_MESSAGES   = 40;  // hard cap to prevent runaway cost

// ── Problem bank ─────────────────────────────────────────────────────────────

export function listProblems({ difficulty, topic } = {}) {
  let list = PROBLEMS;
  if (difficulty) list = list.filter(p => p.difficulty === difficulty);
  if (topic)      list = list.filter(p => p.topic === topic);
  // Strip internal-only fields before sending to client
  return list.map(({ followUps: _f, ...safe }) => safe);
}

export function getProblem(problemId) {
  const p = PROBLEMS.find(p => p.id === problemId);
  if (!p) throw new AppError("Problem not found.", 404);
  return p;
}

// ── Session management ───────────────────────────────────────────────────────

export async function createSession({ userId, problemId }) {
  // Daily rate limit
  const today = new Date().toISOString().slice(0, 10);
  const rlKey = `interview_rl:${userId}:${today}`;
  const count = await incrBy(rlKey, 1, 86400);
  if (count > DAILY_LIMIT) {
    throw new AppError(`Daily limit reached: ${DAILY_LIMIT} interview sessions per day.`, 429);
  }

  const problem = getProblem(problemId);
  const systemPrompt = buildInterviewerPrompt(problem);

  // Generate the opening message from the interviewer
  let opening;
  try {
    const resp = await anthropic.messages.create({
      model: INTERVIEW_MODEL,
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: "user", content: "Hello, I'm ready to start the interview." }],
    });
    opening = resp.content[0]?.text ?? "Welcome! Let's get started. Here's your problem…";
  } catch (err) {
    logger.error("interviewService: Claude error on session open", { err: err.message });
    throw new AppError("Interview service temporarily unavailable.", 503);
  }

  const session = await ProInterviewSession.create({
    userId,
    problemId,
    status: "active",
    startedAt: new Date(),
    transcript: [{ role: "interviewer", content: opening, ts: new Date() }],
  });

  logger.info("pro.interview.session_created", { userId, problemId, sessionId: String(session._id) });

  return _sanitize(session, problem);
}

export async function getSession({ userId, sessionId }) {
  const session = await ProInterviewSession.findOne({ _id: sessionId, userId }).lean();
  if (!session) throw new AppError("Session not found.", 404);
  const problem = getProblem(session.problemId);
  return _sanitize(session, problem);
}

export async function listHistory(userId) {
  const sessions = await ProInterviewSession.find({ userId })
    .select("problemId status startedAt endedAt durationMinutes rubric createdAt")
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return sessions.map(s => {
    const problem = PROBLEMS.find(p => p.id === s.problemId);
    return {
      ...s,
      problemTitle: problem?.title ?? s.problemId,
      difficulty:   problem?.difficulty ?? "unknown",
      topic:        problem?.topic ?? "unknown",
    };
  });
}

export async function sendMessage({ userId, sessionId, content, silenceProbe = false }) {
  const session = await ProInterviewSession.findOne({ _id: sessionId, userId });
  if (!session) throw new AppError("Session not found.", 404);
  if (session.status === "ended") throw new AppError("This interview session has ended.", 400);
  if (session.transcript.length >= MAX_MESSAGES) {
    throw new AppError("Message limit reached. Please end the session.", 400);
  }

  const problem = getProblem(session.problemId);
  const systemPrompt = buildInterviewerPrompt(problem);

  // Build history for Claude
  const history = session.transcript.map(m => ({
    role:    m.role === "interviewer" ? "assistant" : "user",
    content: m.content,
  }));

  // For silence probes, inject an invisible trigger rather than a candidate message
  const userMsg = silenceProbe
    ? "[The candidate has been silent for over 60 seconds]"
    : content;

  let reply;
  const t0 = Date.now();
  try {
    const resp = await anthropic.messages.create({
      model: INTERVIEW_MODEL,
      max_tokens: 256,
      system: systemPrompt,
      messages: [...history, { role: "user", content: userMsg }],
    });
    reply = resp.content[0]?.text ?? "";
  } catch (err) {
    logger.error("interviewService: Claude error on message", { err: err.message });
    throw new AppError("Interview service temporarily unavailable.", 503);
  }

  const now = new Date();
  if (!silenceProbe) {
    session.transcript.push({ role: "user",        content, ts: now });
  }
  session.transcript.push({ role: "interviewer", content: reply, ts: new Date() });
  await session.save();

  logger.info("pro.interview.message_sent", {
    sessionId, durationMs: Date.now() - t0, model: INTERVIEW_MODEL,
  });

  return { reply, transcript: session.transcript };
}

export async function endSession({ userId, sessionId, code = "", scratchpad = "" }) {
  const session = await ProInterviewSession.findOne({ _id: sessionId, userId });
  if (!session) throw new AppError("Session not found.", 404);
  if (session.status === "ended") {
    // Already ended — just return the existing result
    const problem = getProblem(session.problemId);
    return _sanitize(session.toObject(), problem);
  }

  const endedAt = new Date();
  const durationMinutes = Math.round((endedAt - session.startedAt) / 60000);

  session.status          = "ended";
  session.endedAt         = endedAt;
  session.durationMinutes = durationMinutes;
  session.code            = code;
  session.scratchpad      = scratchpad;

  // Generate rubric
  const problem = getProblem(session.problemId);
  let rubric = null;
  try {
    const rubricPrompt = buildRubricPrompt(problem, session.transcript, code, durationMinutes);
    const resp = await anthropic.messages.create({
      model: INTERVIEW_MODEL,
      max_tokens: 1024,
      messages: [{ role: "user", content: rubricPrompt }],
    });
    const raw = resp.content[0]?.text ?? "{}";
    // Extract JSON robustly — Claude sometimes wraps in ```json
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) rubric = JSON.parse(jsonMatch[0]);
  } catch (err) {
    logger.error("interviewService: rubric generation failed", { err: err.message, sessionId });
    // Non-fatal — session still ends, rubric shows as null
  }

  if (rubric?.scores) {
    const vals = Object.values(rubric.scores);
    rubric.overall = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
  }

  session.rubric = rubric;
  await session.save();

  logger.info("pro.interview.session_ended", { userId, sessionId, durationMinutes, rubric: !!rubric });

  return _sanitize(session.toObject(), problem);
}

// Strip followUps from problem before sending to client
function _sanitize(session, problem) {
  const { followUps: _f, ...safeProblem } = problem;
  return { ...session, problem: safeProblem };
}
