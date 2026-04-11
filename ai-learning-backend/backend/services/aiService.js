// ============================================================
// AI SERVICE — Claude Haiku 4.5
// All student-facing AI calls go through here.
// Do NOT call this directly — always go through aiRouter.js
// which checks DB cache first before calling Claude.
// ============================================================
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL  = process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001";

// ── Subject-aware system prompts ─────────────────────────────────
// Claude caches these — keep each string IDENTICAL across calls
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

// ── Wrong answer explanation ──────────────────────────────────────
export const getAIExplanation = async (question, mistakeType, correctAnswer, subject = "Math") => {
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
      system: getSystemPrompt(subject),
      messages: [{ role: "user", content: prompt }],
    });
    return res.content[0]?.text?.trim() || null;
  } catch (err) {
    console.error("Claude explanation error:", err.message);
    return null;
  }
};

// ── Generate a targeted AI question ───────────────────────────────
export const generateAIQuestion = async (topic, weakness, subject = "Math") => {
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

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      system: getSystemPrompt(subject),
      messages: [{ role: "user", content: prompt }],
    });
    const raw = res.content[0]?.text?.trim() || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("Claude question generation error:", err.message);
    return null;
  }
};

// ── Personalised study advice ──────────────────────────────────────
export const getStudyAdvice = async (profile, subject = "Math") => {
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

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 280,
      system: getSystemPrompt(subject),
      messages: [{ role: "user", content: prompt }],
    });
    return res.content[0]?.text?.trim() || null;
  } catch (err) {
    console.error("Claude advice error:", err.message);
    return null;
  }
};

// ── Generate a hint for a question (without giving away answer) ───
export const generateHint = async (questionText, topic, subject = "Math") => {
  const prompt = `A student is stuck on this question: "${questionText}"
Topic: ${topic}

Give ONE helpful hint (2 sentences max):
1. Point them toward the right approach WITHOUT revealing the answer
2. Mention which concept or formula they should recall

Be a good tutor — guide, don't solve.`;

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 120,
      system: getSystemPrompt(subject),
      messages: [{ role: "user", content: prompt }],
    });
    return res.content[0]?.text?.trim() || null;
  } catch (err) {
    console.error("Claude hint error:", err.message);
    return null;
  }
};

// ── Generate a full lesson for a topic ───────────────────────────
export const generateLesson = async (topic, subject = "Math", grade = "10") => {
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

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 1800,
      system: getSystemPrompt(subject),
      messages: [{ role: "user", content: prompt }],
    });
    const raw   = res.content[0]?.text?.trim() || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("Claude lesson generation error:", err.message);
    return null;
  }
};

// ── Multi-turn AI tutor chat ──────────────────────────────────────
// history = [{role:"user"|"assistant", content:"..."}]
export const getChatResponse = async (history, userMessage, topic, subject = "Math") => {
  const messages = [
    ...history.slice(-8),
    { role: "user", content: userMessage },
  ];

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: `${getSystemPrompt(subject)}\nCurrent topic being discussed: ${topic || `General ${subject}`}.`,
      messages,
    });
    return res.content[0]?.text?.trim() || null;
  } catch (err) {
    console.error("Claude chat error:", err.message);
    return null;
  }
};
