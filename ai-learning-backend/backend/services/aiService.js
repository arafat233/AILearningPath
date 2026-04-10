// ============================================================
// AI SERVICE — Claude Haiku 4.5
// All student-facing AI calls go through here.
// Do NOT call this directly — always go through aiRouter.js
// which checks DB cache first before calling Claude.
// ============================================================
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL  = process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001";

// Shared system prompt — cached by Claude (90% discount on repeated calls)
// Keep this IDENTICAL across calls so Claude's prompt cache activates
const SYSTEM_PROMPT = `You are an expert CBSE Class 10 Math teacher in India.
Your students are 15-16 year olds preparing for board exams.
Teaching style: clear, direct, encouraging. No fluff. Use simple Indian English.
Always explain: (1) why they were wrong, (2) the correct concept, (3) one practical tip.
Keep responses under 4 sentences unless asked for steps.`;

// ── Wrong answer explanation ──────────────────────────────────────
export const getAIExplanation = async (question, mistakeType, correctAnswer) => {
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

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 320,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });
    return res.content[0]?.text?.trim() || null;
  } catch (err) {
    console.error("Claude explanation error:", err.message);
    return null;
  }
};

// ── Generate a targeted AI question ───────────────────────────────
export const generateAIQuestion = async (topic, weakness) => {
  const prompt = `Generate 1 multiple-choice question for CBSE Class 10 topic: "${topic}"
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

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });
    const raw = res.content[0]?.text?.trim() || "";
    // Strip any accidental markdown fences
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("Claude question generation error:", err.message);
    return null;
  }
};

// ── Personalised study advice ──────────────────────────────────────
export const getStudyAdvice = async (profile) => {
  const { weakAreas = [], strongAreas = [], thinkingProfile, accuracy, examDate } = profile;
  const daysLeft = examDate
    ? Math.max(1, Math.ceil((new Date(examDate) - new Date()) / 864e5))
    : 60;

  const prompt = `Student profile:
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

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 280,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });
    return res.content[0]?.text?.trim() || null;
  } catch (err) {
    console.error("Claude advice error:", err.message);
    return null;
  }
};

// ── Multi-turn AI tutor chat ──────────────────────────────────────
// history = [{role:"user"|"assistant", content:"..."}]
export const getChatResponse = async (history, userMessage, topic) => {
  const messages = [
    ...history.slice(-8), // keep last 8 turns to save tokens
    { role: "user", content: userMessage },
  ];

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: `${SYSTEM_PROMPT}\nCurrent topic being discussed: ${topic || "General Math"}.`,
      messages,
    });
    return res.content[0]?.text?.trim() || null;
  } catch (err) {
    console.error("Claude chat error:", err.message);
    return null;
  }
};
