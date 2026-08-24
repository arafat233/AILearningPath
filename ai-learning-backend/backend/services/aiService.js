// ============================================================
// AI SERVICE — Claude wrapper for all student-facing AI calls.
//
// Features:
//   1. Response caching     — lessons cached 7 days in Redis+DB
//   2. Per-user token cap   — daily/monthly limits per student
//   3. Failover             — primary model → haiku → friendly error
//   4. Output guardrails    — checks Claude's reply before it reaches student
//   6. Metrics logging      — fire-and-forget per-call log to MongoDB
//   7. Conversation context — last explanation stored in Redis for follow-up
//   8. Student model        — UserProfile injected into every system prompt
// ============================================================
import crypto from "crypto";
import Anthropic from "@anthropic-ai/sdk";
import logger from "../utils/logger.js";
import {
  checkTokenBudget, incrementTokenBudget,
  checkUserTokenBudget, incrementUserTokenBudget,
} from "../utils/tokenBudget.js";
import { retrieveContext } from "../utils/ragStore.js";
import { getCached, setCache } from "../utils/cache.js";
import { checkOutput } from "../utils/outputGuard.js";
import { logAICall } from "../utils/aiMetrics.js";
import { UserProfile, Streak, AIResponseCache } from "../models/index.js";
import { sessionGet, sessionSet } from "../utils/redisClient.js";

const client        = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL         = process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001";
const FALLBACK_MODEL = "claude-haiku-4-5-20251001";
const LESSON_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// ── 7. Conversation context — last explanation per user (30 min) ──
const lastExplKey = (uid) => `ai:lastexpl:${uid}`;

function storeLastExplanation(userId, question, explanation) {
  if (!userId || !explanation) return;
  sessionSet(lastExplKey(userId), { question, explanation }, 30 * 60).catch(() => {});
}

export async function getLastExplanation(userId) {
  if (!userId) return null;
  try { return await sessionGet(lastExplKey(userId)); } catch { return null; }
}

// ── 8. Student model — pulls UserProfile + Streak for context ─────
async function buildStudentContext(userId) {
  if (!userId) return null;
  try {
    const [profile, streak] = await Promise.all([
      UserProfile.findOne({ userId }).select("accuracy thinkingProfile weakAreas strongAreas").lean(),
      Streak.findOne({ userId }).select("currentStreak").lean(),
    ]);
    if (!profile) return null;
    const acc    = Math.round((profile.accuracy || 0) * 100);
    const weak   = (profile.weakAreas   || []).slice(0, 3).join(", ") || "not identified yet";
    const strong = (profile.strongAreas || []).slice(0, 3).join(", ") || "none identified";
    const streakTxt = streak?.currentStreak > 0 ? `${streak.currentStreak}-day streak` : "no active streak";
    return `Student context: ${acc}% accuracy overall, ${profile.thinkingProfile || "Surface Learner"}, ${streakTxt}. Weak areas: ${weak}. Strong areas: ${strong}. Tailor depth and encouragement to their level.`;
  } catch { return null; }
}

// ── Subject-aware system prompts ──────────────────────────────────
const SUBJECT_PROMPTS = {
  Math: `You are an expert CBSE Class 10 Math teacher in India.
Your students are 15-16 year olds preparing for board exams.
Teaching style: clear, direct, encouraging. No fluff. Use simple Indian English.
Always explain: (1) why they were wrong, (2) the correct concept, (3) one practical tip.
Keep responses under 4 sentences unless asked for steps.`,

  Science: `You are an expert CBSE Class 10 Science teacher in India covering Physics, Chemistry, and Biology.
Your students are 15-16 year olds preparing for board exams.
Teaching style: clear, direct, encouraging. Use diagrams described in words when helpful. Simple Indian English.
Always explain: (1) why they were wrong, (2) the correct concept or law, (3) one practical tip.
Keep responses under 4 sentences unless asked for steps.`,

  English: `You are an expert CBSE Class 10 English teacher in India covering First Flight, Footprints Without Feet, and grammar.
Your students are 15-16 year olds preparing for board exams.
Teaching style: clear, concise, focused on exam scoring. Simple language.
Always explain: (1) what concept the question tests, (2) the correct answer with reasoning, (3) how to approach similar questions.
Keep responses under 4 sentences unless asked for steps.`,

  "Social Science": `You are an expert CBSE Class 10 Social Science teacher in India covering History, Geography, Political Science, and Economics.
Your students are 15-16 year olds preparing for board exams.
Teaching style: factual, direct, exam-focused. Use simple Indian English.
Always explain: (1) why they were wrong, (2) the correct fact or concept, (3) a memory tip or mnemonic.
Keep responses under 4 sentences unless asked for steps.`,

  Hindi: `आप CBSE Class 10 Hindi के विशेषज्ञ शिक्षक हैं जो Sparsh, Sanchayan, Kritika और व्याकरण पढ़ाते हैं।
आपके छात्र 15-16 साल के हैं जो बोर्ड परीक्षा की तैयारी कर रहे हैं।
शिक्षण शैली: स्पष्ट, सीधी, प्रोत्साहनपूर्ण। सरल हिंदी में समझाएं।
हमेशा बताएं: (1) गलती क्या हुई, (2) सही अवधारणा, (3) एक व्यावहारिक सुझाव।
जवाब 4 वाक्यों से कम रखें जब तक चरण न पूछे जाएं।`,
};

export const getSystemPrompt = (subject = "Math") =>
  SUBJECT_PROMPTS[subject] || SUBJECT_PROMPTS.Math;

// ── 3. callClaude — failover + per-user budget ────────────────────
async function callClaude(params, userId = null) {
  // Global monthly budget
  const allowed = await checkTokenBudget();
  if (!allowed) throw Object.assign(
    new Error("Monthly token budget exhausted — try again next month."),
    { code: "BUDGET_EXCEEDED" }
  );

  // Per-user daily/monthly budget
  if (userId) {
    const userOk = await checkUserTokenBudget(userId);
    if (!userOk) throw Object.assign(
      new Error("You've reached your daily AI limit. Try again tomorrow or upgrade your plan!"),
      { code: "USER_BUDGET_EXCEEDED", status: 429 }
    );
  }

  const tryModel = async (model) => {
    const res    = await client.messages.create({ ...params, model });
    const tokens = (res.usage?.input_tokens || 0) + (res.usage?.output_tokens || 0);
    incrementTokenBudget(tokens).catch(() => {});
    if (userId) incrementUserTokenBudget(userId, tokens).catch(() => {});
    res._usedModel = model;
    // 7. Append truncation notice so students know to ask again
    if (res.stop_reason === "max_tokens" && res.content[0]?.type === "text") {
      res.content[0].text += "\n\n_(My answer was cut short — ask me to continue if you need more.)_";
      logger.warn("Claude response truncated at max_tokens", { model, aiType: params._aiType });
    }
    return res;
  };

  try {
    return await tryModel(params.model || MODEL);
  } catch (err) {
    const primary = params.model || MODEL;
    if (primary !== FALLBACK_MODEL) {
      logger.warn("Claude primary failed, trying haiku fallback", { err: err.message });
      try { return await tryModel(FALLBACK_MODEL); } catch (fallbackErr) {
        logger.error("Claude fallback also failed", { err: fallbackErr.message });
      }
    }
    throw Object.assign(
      new Error("AI tutor is taking a short break. Please try again in a minute."),
      { code: "AI_UNAVAILABLE", status: 503 }
    );
  }
}

// ── 1. Lesson cache key — normalised to avoid duplicate Claude calls ─
const lessonCacheKey = (topic, subject, grade) =>
  `lesson::${crypto.createHash("md5").update(`${topic.toLowerCase().trim()}::${subject}::${grade}`).digest("hex")}`;

// ── Citation line from RAG chunk provenance ───────────────────────
// Built server-side from the chunks we actually injected — never from the
// model echoing sources, so it can't hallucinate a citation.
function citationLine(sources) {
  if (!sources?.length) return null;
  const labels = [...new Set(
    sources
      .map((s) => s.source
        || [s.chapterNumber ? `Ch.${s.chapterNumber}` : null, s.chapterTitle, s.conceptName].filter(Boolean).join(" — "))
      .filter(Boolean)
  )].slice(0, 3);
  return labels.length ? `📖 From NCERT: ${labels.join(" · ")}` : null;
}

// ── Wrong answer explanation ──────────────────────────────────────
export const getAIExplanation = async (question, mistakeType, correctAnswer, subject = "Math", userId = null) => {
  const mistakeLabel = {
    concept_error:     "a concept misunderstanding",
    calculation_error: "a calculation mistake",
    partial_logic:     "incomplete reasoning",
    guessing:          "guessing without thinking",
    misinterpretation: "misreading the question",
  }[mistakeType] || "an error";

  const prompt = `Question: ${question}
Correct answer: ${correctAnswer}
Student's mistake: ${mistakeLabel}

Explain in 3-4 sentences:
1. What went wrong
2. The correct concept or step they missed
3. How to avoid this mistake next time
4. One shortcut if applicable

Be direct and helpful like a good tutor.`;

  // 8. Student model — personalize system prompt
  const [rag, studentCtx] = await Promise.all([
    retrieveContext(question, subject),
    buildStudentContext(userId),
  ]);
  const ncertContext = rag?.context || null;

  let systemPrompt = getSystemPrompt(subject);
  if (ncertContext) systemPrompt += `\n\nRelevant NCERT content for this question:\n${ncertContext}`;
  if (studentCtx)  systemPrompt += `\n\n${studentCtx}`;

  const start = Date.now();
  try {
    const res    = await callClaude({ model: MODEL, temperature: 0.3, max_tokens: 320, system: systemPrompt, messages: [{ role: "user", content: prompt }] }, userId);
    let text     = res.content[0]?.text?.trim() || null;
    const tokens = (res.usage?.input_tokens || 0) + (res.usage?.output_tokens || 0);

    // 4. Output guardrails
    if (text) {
      const { safe, reason } = checkOutput(text, { aiType: "explanation", subject });
      if (!safe) {
        logger.warn("getAIExplanation: output blocked", { reason, subject });
        logAICall({ userId, aiType: "explanation", subject, model: res._usedModel, tokens, latencyMs: Date.now() - start, hitRAG: !!ncertContext, success: false });
        return { text: null, tokens };
      }
    }

    // Citation footer — provenance of the chunks that grounded this answer.
    // Appended inside the text so it flows through every cache layer unchanged.
    if (text) {
      const cite = citationLine(rag?.sources);
      if (cite) text += `\n\n${cite}`;
    }

    // 7. Store last explanation for follow-up chat context
    if (text && userId) storeLastExplanation(userId, question, text);

    // 6. Metrics
    logAICall({ userId, aiType: "explanation", subject, model: res._usedModel, tokens, latencyMs: Date.now() - start, hitRAG: !!ncertContext, success: !!text });

    return { text, tokens };
  } catch (err) {
    logger.error("Claude explanation error", { err: err.message, topic: question?.slice(0, 60), subject });
    logAICall({ userId, aiType: "explanation", subject, latencyMs: Date.now() - start, success: false });
    return { text: null, tokens: 0 };
  }
};

// ── 8. Self-check verification for AI-generated questions ─────────
async function verifyAIQuestion(question, userId) {
  if (!question?.questionText || !question?.options) return true; // can't verify, allow through
  const correct = question.options.find((o) => o.type === "correct");
  if (!correct) return false;

  const checkPrompt = `Question: ${question.questionText}
Marked correct answer: "${correct.text}"
Is this answer mathematically/factually correct for a CBSE Class 10 student? Reply with exactly one word: PASS or FAIL.`;

  try {
    const res = await callClaude({
      model: FALLBACK_MODEL, temperature: 0, max_tokens: 5,
      system: "You are a CBSE Class 10 answer verifier. Reply only PASS or FAIL.",
      messages: [{ role: "user", content: checkPrompt }],
    }, userId);
    const verdict = res.content[0]?.text?.trim().toUpperCase();
    if (verdict === "FAIL") {
      logger.warn("generateAIQuestion: answer verification FAILED — discarding question", { topic: question.questionText?.slice(0, 60) });
      return false;
    }
    return true;
  } catch { return true; } // verification failure → allow through rather than breaking the flow
}

// ── Generate a targeted AI question ───────────────────────────────
export const generateAIQuestion = async (topic, weakness, subject = "Math", userId = null) => {
  const prompt = `Generate 1 multiple-choice question for CBSE Class 10 ${subject} topic: "${topic}"
Focus on testing the mistake type: "${weakness}"

Rules:
- 4 options total: 1 correct, 3 wrong options that represent REAL thinking mistakes
- Each wrong option must have a logicTag describing the mistake
- Return ONLY valid JSON — no markdown, no explanation outside the JSON

Format:
{
  "questionText": "...",
  "options": [
    {"text": "...", "type": "correct", "logicTag": "correct_flow"},
    {"text": "...", "type": "concept_error", "logicTag": "describe_mistake"},
    {"text": "...", "type": "calculation_error", "logicTag": "describe_mistake"},
    {"text": "...", "type": "partial_logic", "logicTag": "describe_mistake"}
  ],
  "solutionSteps": ["step 1", "step 2", "step 3"],
  "expectedTime": 25,
  "conceptTested": "one sentence",
  "shortcut": "optional tip"
}`;

  const start = Date.now();
  try {
    const res  = await callClaude({ model: MODEL, temperature: 0.3, max_tokens: 600, system: getSystemPrompt(subject), messages: [{ role: "user", content: prompt }] }, userId);
    const raw   = res.content[0]?.text?.trim() || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    // 8. Answer verification — discard if Claude's own "correct" answer is wrong
    const verified = await verifyAIQuestion(parsed, userId);
    logAICall({ userId, aiType: "question", subject, model: res._usedModel, tokens: (res.usage?.input_tokens||0)+(res.usage?.output_tokens||0), latencyMs: Date.now()-start, success: verified });
    return verified ? parsed : null;
  } catch (err) {
    logger.error("Claude question generation error", { err: err.message, topic, subject });
    logAICall({ userId, aiType: "question", subject, latencyMs: Date.now()-start, success: false });
    return null;
  }
};

// ── Personalised study advice ──────────────────────────────────────
export const getStudyAdvice = async (profile, subject = "Math", userId = null) => {
  const { weakAreas = [], strongAreas = [], thinkingProfile, accuracy, examDate } = profile;
  const daysLeft = examDate
    ? Math.max(1, Math.ceil((new Date(examDate) - new Date()) / 864e5))
    : 60;

  const prompt = `Student profile:
- Subject: ${subject}
- Thinking pattern: ${thinkingProfile}
- Overall accuracy: ${Math.round((accuracy || 0) * 100)}%
- Weak areas: ${weakAreas.join(", ") || "not identified yet"}
- Strong areas: ${strongAreas.join(", ") || "not identified yet"}
- Days until exam: ${daysLeft}

Give 3-4 sentence personalised study advice:
1. What to focus on right now (specific topic)
2. Why they are struggling based on their thinking pattern
3. One daily habit that will help the most
Keep it practical and direct.`;

  const start = Date.now();
  try {
    const res  = await callClaude({ model: MODEL, temperature: 0.3, max_tokens: 280, system: getSystemPrompt(subject), messages: [{ role: "user", content: prompt }] }, userId);
    const text = res.content[0]?.text?.trim() || null;
    logAICall({ userId, aiType: "advice", subject, model: res._usedModel, tokens: (res.usage?.input_tokens||0)+(res.usage?.output_tokens||0), latencyMs: Date.now()-start, success: !!text });
    return text;
  } catch (err) {
    logger.error("Claude advice error", { err: err.message, subject });
    logAICall({ userId, aiType: "advice", subject, latencyMs: Date.now()-start, success: false });
    return null;
  }
};

// ── Generate a hint (without giving away the answer) ─────────────
export const generateHint = async (questionText, topic, subject = "Math", userId = null) => {
  const prompt = `A student is stuck on this question: "${questionText}"
Topic: ${topic}

Give ONE helpful hint (2 sentences max):
1. Point them toward the right approach WITHOUT revealing the answer
2. Mention which concept or formula they should recall

Be a good tutor — guide, don't solve.`;

  const [rag, studentCtx] = await Promise.all([
    retrieveContext(questionText, subject),
    buildStudentContext(userId),
  ]);
  const ncertContext = rag?.context || null;

  let systemPrompt = getSystemPrompt(subject);
  if (ncertContext) systemPrompt += `\n\nRelevant NCERT content:\n${ncertContext}`;
  if (studentCtx)  systemPrompt += `\n\n${studentCtx}`;

  const start = Date.now();
  try {
    const res  = await callClaude({ model: MODEL, temperature: 0.3, max_tokens: 120, system: systemPrompt, messages: [{ role: "user", content: prompt }] }, userId);
    const text = res.content[0]?.text?.trim() || null;

    // 4. Output guardrails
    if (text) {
      const { safe } = checkOutput(text, { aiType: "hint", subject });
      if (!safe) return null;
    }

    logAICall({ userId, aiType: "hint", subject, model: res._usedModel, tokens: (res.usage?.input_tokens||0)+(res.usage?.output_tokens||0), latencyMs: Date.now()-start, hitRAG: !!ncertContext, success: !!text });
    return text;
  } catch (err) {
    logger.error("Claude hint error", { err: err.message, topic, subject });
    logAICall({ userId, aiType: "hint", subject, latencyMs: Date.now()-start, success: false });
    return null;
  }
};

// ── Generate a full lesson — Redis+DB cached 7 days ───────────────
export const generateLesson = async (topic, subject = "Math", grade = "10", userId = null) => {
  // 1. Check Redis cache first, then MongoDB (survives Redis restarts)
  const cKey = lessonCacheKey(topic, subject, grade);
  const cached = await getCached(cKey);
  if (cached) {
    logAICall({ userId, aiType: "lesson", subject, cached: true, success: true });
    return cached;
  }
  try {
    const dbHit = await AIResponseCache.findOne({ cacheKey: cKey }).lean();
    if (dbHit?.response) {
      const parsed = typeof dbHit.response === "string" ? JSON.parse(dbHit.response) : dbHit.response;
      setCache(cKey, parsed, LESSON_CACHE_TTL).catch(() => {});
      AIResponseCache.findOneAndUpdate({ cacheKey: cKey }, { $inc: { hitCount: 1 }, $set: { lastHitAt: new Date() } }).catch(() => {});
      logAICall({ userId, aiType: "lesson", subject, cached: true, success: true });
      return parsed;
    }
  } catch { /* fallthrough to Claude */ }

  const prompt = `Generate a complete lesson for "${topic}" (${subject}, Grade ${grade}, CBSE India).

Return ONLY valid JSON — no markdown, no explanation outside the JSON.

{
  "title": "short catchy title",
  "tagline": "one-line hook: what student will be able to do",
  "shortLesson": {
    "estimatedMinutes": 7,
    "keyIdea": "THE one sentence they must remember",
    "slides": [
      {
        "type": "concept",
        "title": "slide title",
        "body": "2-3 sentence explanation, simple language",
        "formula": "formula string if applicable or null"
      },
      {
        "type": "example",
        "title": "Worked Example",
        "body": "brief intro",
        "example": {
          "problem": "the problem statement",
          "steps": ["step 1", "step 2", "step 3"],
          "answer": "final answer"
        }
      },
      {
        "type": "shortcut",
        "title": "Quick Trick",
        "body": "when to use this",
        "shortcut": "the actual shortcut tip"
      },
      {
        "type": "mistake_warning",
        "title": "Common Mistake",
        "body": "what students often get wrong",
        "warning": "the specific mistake to avoid"
      }
    ]
  },
  "longLesson": {
    "estimatedMinutes": 20,
    "slides": [
      {
        "type": "concept",
        "title": "Deep Dive: Core Concept",
        "body": "thorough explanation, 4-5 sentences",
        "formula": "formula if any"
      },
      {
        "type": "visual",
        "title": "Visualise It",
        "body": "describe what the visual shows",
        "visual": "simple ASCII or emoji diagram"
      },
      {
        "type": "example",
        "title": "Example 1 — Easy",
        "body": "starter example",
        "example": { "problem": "...", "steps": ["..."], "answer": "..." }
      },
      {
        "type": "example",
        "title": "Example 2 — Medium",
        "body": "standard exam style",
        "example": { "problem": "...", "steps": ["...","...","..."], "answer": "..." }
      },
      {
        "type": "shortcut",
        "title": "Exam Shortcut",
        "body": "context for when this helps",
        "shortcut": "the shortcut"
      },
      {
        "type": "mistake_warning",
        "title": "Watch Out",
        "body": "why students lose marks here",
        "warning": "exact mistake description"
      }
    ]
  },
  "prerequisites": ["topic1", "topic2"]
}`;

  const start = Date.now();
  try {
    const res   = await callClaude({ model: MODEL, temperature: 0.3, max_tokens: 1800, system: getSystemPrompt(subject), messages: [{ role: "user", content: prompt }] }, userId);
    const raw   = res.content[0]?.text?.trim() || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const lesson = JSON.parse(clean);

    // 1. Cache in Redis (fast) + MongoDB (survives Redis restarts) for 7 days
    setCache(cKey, lesson, LESSON_CACHE_TTL).catch(() => {});
    AIResponseCache.findOneAndUpdate(
      { cacheKey: cKey },
      { cacheKey: cKey, questionSnippet: topic.slice(0, 120), mistakeType: "lesson", response: JSON.stringify(lesson), expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
      { upsert: true }
    ).catch(() => {});

    logAICall({ userId, aiType: "lesson", subject, model: res._usedModel, tokens: (res.usage?.input_tokens||0)+(res.usage?.output_tokens||0), latencyMs: Date.now()-start, success: true });
    return lesson;
  } catch (err) {
    logger.error("Claude lesson generation error", { err: err.message, topic, subject, grade });
    logAICall({ userId, aiType: "lesson", subject, latencyMs: Date.now()-start, success: false });
    return null;
  }
};

// ── Transformations — one-click derived study formats ─────────────
// Topic content → flashcards / likely exam questions / ELI5 / revision
// sheet / dialogue-podcast script. All cross-user cached under
// MD5(topic::kind::subject::grade): generated once, served to every
// student forever (same economics as the explanation cache).
const TRANSFORM_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // Redis TTL; Mongo copy lives 90 days

const JSON_ONLY = "Return ONLY valid JSON — no markdown fences, no text outside the JSON.";

const TRANSFORMS = {
  flashcards: {
    maxTokens: 1400,
    prompt: (topic, subject, grade) => `Create 10 revision flashcards for "${topic}" (${subject}, Grade ${grade}, CBSE India).
Front = a short question or term. Back = a crisp answer (1-2 sentences, exam-accurate).
Cover definitions, formulas, and the most-tested facts.
${JSON_ONLY}
{"cards":[{"front":"...","back":"..."}]}`,
  },
  examqs: {
    maxTokens: 1400,
    prompt: (topic, subject, grade) => `Write the 5 most likely board-exam questions for "${topic}" (${subject}, Grade ${grade}, CBSE India), based on how this topic is typically tested.
Mix marks: two 1-mark, two 3-mark, one 5-mark. Give a model answer and one examiner tip per question.
${JSON_ONLY}
{"questions":[{"question":"...","marks":1,"answer":"...","examTip":"..."}]}`,
  },
  eli5: {
    maxTokens: 700,
    prompt: (topic, subject, grade) => `Explain "${topic}" (${subject}, Grade ${grade}) like the student is 10 years old.
Simple words, short sentences, one everyday Indian-context analogy. No jargon unless you define it in the same sentence.
${JSON_ONLY}
{"explanation":"...","analogy":"..."}`,
  },
  revision: {
    maxTokens: 1600,
    prompt: (topic, subject, grade) => `Create a one-page revision sheet for "${topic}" (${subject}, Grade ${grade}, CBSE India) — what a topper's notes would look like the night before the exam.
3-5 sections of terse bullet points, every formula on the topic, and one memory trick.
${JSON_ONLY}
{"sections":[{"heading":"...","points":["..."]}],"formulas":["..."],"mnemonic":"..."}`,
  },
  podcast: {
    maxTokens: 2000,
    prompt: (topic, subject, grade) => `Write a ~5-minute teacher-student podcast dialogue teaching "${topic}" (${subject}, Grade ${grade}, CBSE India).
The student is curious and asks the questions real students ask (including one common misconception); the teacher explains warmly with everyday Indian examples. 25-35 alternating lines, each 1-3 sentences. Start with a one-line hook, end with the teacher's 2-sentence recap.
${JSON_ONLY}
{"lines":[{"speaker":"teacher","line":"..."},{"speaker":"student","line":"..."}]}`,
  },
};

export const TRANSFORM_KINDS = Object.keys(TRANSFORMS);

const transformCacheKey = (topic, kind, subject, grade) =>
  `transform::${crypto.createHash("md5").update(`${topic.toLowerCase().trim()}::${kind}::${subject}::${grade}`).digest("hex")}`;

export const generateTransformation = async (topic, kind, subject = "Math", grade = "10", userId = null) => {
  const spec = TRANSFORMS[kind];
  if (!spec) return null;

  // Redis cache, then MongoDB (survives Redis restarts) — same layering as generateLesson
  const cKey = transformCacheKey(topic, kind, subject, grade);
  const cached = await getCached(cKey);
  if (cached) {
    logAICall({ userId, aiType: `transform_${kind}`, subject, cached: true, success: true });
    return cached;
  }
  try {
    const dbHit = await AIResponseCache.findOne({ cacheKey: cKey }).lean();
    if (dbHit?.response) {
      const parsed = typeof dbHit.response === "string" ? JSON.parse(dbHit.response) : dbHit.response;
      setCache(cKey, parsed, TRANSFORM_CACHE_TTL).catch(() => {});
      AIResponseCache.findOneAndUpdate({ cacheKey: cKey }, { $inc: { hitCount: 1, savedCalls: 1 }, $set: { lastHitAt: new Date() } }).catch(() => {});
      logAICall({ userId, aiType: `transform_${kind}`, subject, cached: true, success: true });
      return parsed;
    }
  } catch { /* fallthrough to Claude */ }

  // Ground in NCERT content so output matches the textbook, not generic knowledge
  const rag = await retrieveContext(topic, subject);
  let systemPrompt = getSystemPrompt(subject);
  if (rag?.context) systemPrompt += `\n\nRelevant NCERT content for this topic:\n${rag.context}`;

  const start = Date.now();
  try {
    const res = await callClaude(
      { model: MODEL, temperature: 0.4, max_tokens: spec.maxTokens, system: systemPrompt, messages: [{ role: "user", content: spec.prompt(topic, subject, grade) }] },
      userId
    );
    const raw = res.content[0]?.text?.trim() || "";

    const { safe, reason } = checkOutput(raw, { aiType: `transform_${kind}`, subject });
    if (!safe) {
      logger.warn("generateTransformation: output blocked", { reason, kind, topic });
      logAICall({ userId, aiType: `transform_${kind}`, subject, model: res._usedModel, latencyMs: Date.now() - start, hitRAG: !!rag, success: false });
      return null;
    }

    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    const cite = citationLine(rag?.sources);
    if (cite) parsed.citation = cite;

    setCache(cKey, parsed, TRANSFORM_CACHE_TTL).catch(() => {});
    AIResponseCache.findOneAndUpdate(
      { cacheKey: cKey },
      { cacheKey: cKey, questionSnippet: topic.slice(0, 120), mistakeType: `transform_${kind}`, response: JSON.stringify(parsed), expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
      { upsert: true }
    ).catch(() => {});

    logAICall({ userId, aiType: `transform_${kind}`, subject, model: res._usedModel, tokens: (res.usage?.input_tokens || 0) + (res.usage?.output_tokens || 0), latencyMs: Date.now() - start, hitRAG: !!rag, success: true });
    return parsed;
  } catch (err) {
    logger.error("Claude transformation error", { err: err.message, kind, topic, subject });
    logAICall({ userId, aiType: `transform_${kind}`, subject, latencyMs: Date.now() - start, success: false });
    return null;
  }
};

// ── Parse follow-up suggestions out of a Claude response ─────────
const FOLLOW_UP_RE = /\nFOLLOW_UPS:\s*(.+)$/;
function parseFollowUps(raw) {
  const match = (raw || "").match(FOLLOW_UP_RE);
  if (!match) return { text: raw, followUps: [] };
  const followUps = match[1].split("|").map((q) => q.trim().replace(/^\[|\]$/g, "")).filter(Boolean);
  return { text: raw.replace(FOLLOW_UP_RE, "").trim(), followUps };
}

const FOLLOW_UP_INSTRUCTION = `\nEnd your response with exactly this line (no extra text after it): FOLLOW_UPS: [question 1] | [question 2] | [question 3]\nKeep each follow-up under 8 words. They should naturally continue the current discussion.`;

// ── Multi-turn AI tutor chat ──────────────────────────────────────
// 7. Auto-injects last explanation as context on first turn so follow-ups work.
// history = [{role:"user"|"assistant", content:"..."}]
// ── Tutor modes + language (Khanmigo-style guardrails) ─────────────
// "full" keeps current behaviour; the rest change HOW the tutor helps.
const MODE_INSTRUCTIONS = {
  hint:     "HINT-ONLY MODE: Never reveal the final answer or the full solution. Give exactly one small nudge toward the next step — at most 2 sentences — then stop.",
  socratic: "SOCRATIC MODE: Never state the answer or do the work for the student. Guide with ONE short question at a time that leads them to discover the next step themselves. If they stay stuck, narrow your question — but still never answer it for them.",
  shortcut: "EXAM SHORTCUT MODE: Give the fastest exam-ready method — the trick, formula, or elimination strategy — in minimal steps. Skip derivations and theory unless asked.",
};
const LANG_INSTRUCTIONS = {
  hi:       "Reply in simple Hindi (Devanagari script). Keep formulas, symbols, and technical terms in English.",
  hinglish: "Reply in Hinglish — conversational Hindi written in Latin script, naturally mixing common English words, like an Indian tutor talking to a student. Keep formulas and technical terms in English.",
};
export const tutorModeInstruction = (mode, lang) =>
  [MODE_INSTRUCTIONS[mode], LANG_INSTRUCTIONS[lang]].filter(Boolean).map((s) => `\n${s}`).join("");

export const getChatResponse = async (history, userMessage, topic, subject = "Math", userId = null, opts = {}) => {
  let messages = [...history.slice(-8), { role: "user", content: userMessage }];

  // 7. If first turn and userId provided, prepend last explanation as context
  if (userId && history.length === 0) {
    const lastExpl = await getLastExplanation(userId);
    if (lastExpl) {
      messages = [
        { role: "user",      content: `I just got this question wrong: "${lastExpl.question}"` },
        { role: "assistant", content: lastExpl.explanation },
        { role: "user",      content: userMessage },
      ];
    }
  }

  const start = Date.now();
  try {
    const res  = await callClaude({
      model:       MODEL,
      temperature: 0.3,
      max_tokens:  400,
      system:      `${getSystemPrompt(subject)}\nCurrent topic being discussed: ${topic || `General ${subject}`}.${tutorModeInstruction(opts.mode, opts.lang)}`,
      messages,
    }, userId);
    const text = res.content[0]?.text?.trim() || null;

    // 4. Output guardrails
    if (text) {
      const { safe } = checkOutput(text, { aiType: "chat", subject });
      if (!safe) return null;
    }

    logAICall({ userId, aiType: "chat", subject, model: res._usedModel, tokens: (res.usage?.input_tokens||0)+(res.usage?.output_tokens||0), latencyMs: Date.now()-start, success: !!text });
    return text;
  } catch (err) {
    logger.error("Claude chat error", { err: err.message, topic, subject });
    logAICall({ userId, aiType: "chat", subject, latencyMs: Date.now()-start, success: false });
    return null;
  }
};

// ── Teacher docs — remedial plan / parent note / class summary ────
const TEACHER_DOC_PROMPTS = {
  remedial_plan: "Create a practical 2-week remedial plan targeting the weak topics in the data below. Structure: Week 1 and Week 2, each with 3-4 concrete actions (what to reteach, what to practice, how to check understanding). Under 250 words.",
  parent_note:   "Write a warm, encouraging note to this student's parent (WhatsApp-friendly, under 120 words). Mention one genuine strength, one area to support at home, and one concrete suggestion. Write it ready to send — no placeholders.",
  class_summary: "Write a concise class performance summary for the teacher: overall trend, the top 3 weak topics and which students struggle with them, and 2 recommended next actions. Under 200 words.",
};

export const generateTeacherDoc = async (kind, statsBlock, userId = null) => {
  const instruction = TEACHER_DOC_PROMPTS[kind];
  if (!instruction) return null;
  const start = Date.now();
  try {
    const res = await callClaude({
      model:       MODEL,
      temperature: 0.4,
      max_tokens:  600,
      system: "You are an experienced Indian school teacher's assistant. You write clear, practical, encouraging documents based strictly on the student data provided. Never invent data that isn't in the input.",
      messages: [{ role: "user", content: `${instruction}\n\nDATA:\n${statsBlock}` }],
    }, userId);
    const text = res.content[0]?.text?.trim() || null;
    if (text) {
      const { safe } = checkOutput(text, { aiType: "teacher_doc" });
      if (!safe) return null;
    }
    logAICall({ userId, aiType: "teacher_doc", model: res._usedModel, tokens: (res.usage?.input_tokens||0)+(res.usage?.output_tokens||0), latencyMs: Date.now()-start, success: !!text });
    return text;
  } catch (err) {
    logger.error("Claude teacher doc error", { err: err.message, kind });
    logAICall({ userId, aiType: "teacher_doc", latencyMs: Date.now()-start, success: false });
    return null;
  }
};

// ── Image doubt — student uploads a photo of a question ───────────
export const solveImageDoubt = async (base64Data, mediaType, userPrompt = "", subject = "Math", userId = null, opts = {}) => {
  const start = Date.now();
  try {
    const res = await callClaude({
      model:       MODEL,
      temperature: 0.3,
      max_tokens:  700,
      system: `${getSystemPrompt(subject)}\nThe student has uploaded a PHOTO of a question (handwritten or from a textbook). First restate the question you see in one line, then solve it step by step. If the image is unreadable or contains no academic question, say so and ask for a clearer photo.${tutorModeInstruction(opts.mode, opts.lang)}`,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } },
          { type: "text", text: userPrompt?.trim() || "Please solve this question step by step." },
        ],
      }],
    }, userId);
    const text = res.content[0]?.text?.trim() || null;
    if (text) {
      const { safe } = checkOutput(text, { aiType: "image_doubt", subject });
      if (!safe) return null;
    }
    logAICall({ userId, aiType: "image_doubt", subject, model: res._usedModel, tokens: (res.usage?.input_tokens||0)+(res.usage?.output_tokens||0), latencyMs: Date.now()-start, success: !!text });
    return text;
  } catch (err) {
    logger.error("Claude image doubt error", { err: err.message, subject });
    logAICall({ userId, aiType: "image_doubt", subject, latencyMs: Date.now()-start, success: false });
    return null;
  }
};

// Same as getChatResponse but returns { text, followUps } — used by tutorChat + voice-answer
export const getChatResponseFull = async (history, userMessage, topic, subject = "Math", userId = null, opts = {}) => {
  let messages = [...history.slice(-8), { role: "user", content: userMessage }];
  if (userId && history.length === 0) {
    const lastExpl = await getLastExplanation(userId);
    if (lastExpl) {
      messages = [
        { role: "user",      content: `I just got this question wrong: "${lastExpl.question}"` },
        { role: "assistant", content: lastExpl.explanation },
        { role: "user",      content: userMessage },
      ];
    }
  }

  const start = Date.now();
  try {
    const res = await callClaude({
      model:       MODEL,
      temperature: 0.3,
      max_tokens:  500,
      system:      `${getSystemPrompt(subject)}\nCurrent topic being discussed: ${topic || `General ${subject}`}.${tutorModeInstruction(opts.mode, opts.lang)}${FOLLOW_UP_INSTRUCTION}`,
      messages,
    }, userId);

    const raw  = res.content[0]?.text?.trim() || null;
    if (!raw) return { text: null, followUps: [] };

    const { safe } = checkOutput(raw, { aiType: "chat", subject });
    if (!safe) return { text: null, followUps: [] };

    const { text, followUps } = parseFollowUps(raw);
    logAICall({ userId, aiType: "chat", subject, model: res._usedModel, tokens: (res.usage?.input_tokens||0)+(res.usage?.output_tokens||0), latencyMs: Date.now()-start, success: true });
    return { text, followUps };
  } catch (err) {
    logger.error("Claude chat error (full)", { err: err.message, topic, subject });
    logAICall({ userId, aiType: "chat", subject, latencyMs: Date.now()-start, success: false });
    return { text: null, followUps: [] };
  }
};
