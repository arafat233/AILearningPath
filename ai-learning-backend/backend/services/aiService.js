import OpenAI from "openai";

const hasKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key_here";
const client = hasKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// ── AI Explanation of a wrong answer ──────────────────────────────
export const getAIExplanation = async (question, mistakeType, correctAnswer) => {
  const prompt = `
A student answered a question incorrectly.

Question: ${question}
Their mistake type: ${mistakeType}
Correct answer: ${correctAnswer}

Please explain in 3-4 clear sentences:
1. Why they are wrong
2. What concept or step they likely missed
3. How to fix it (simple, practical)
4. One shortcut or tip if applicable

Keep it direct and helpful — no fluff.
`;
  if (!client) return "Review the concept for this question and try again step by step.";
  try {
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });
    return res.choices[0].message.content;
  } catch {
    return "Review the concept for this question and try again step by step.";
  }
};

// ── Generate a targeted question for a specific weakness ──────────
export const generateAIQuestion = async (topic, weakness) => {
  const prompt = `
Generate 1 multiple-choice question for the topic: "${topic}"
Focus specifically on testing the mistake type: "${weakness}"

Rules:
- 1 correct option
- 3 wrong options that represent REAL thinking mistakes (not random wrong answers)
- Each wrong option should have a label for what mistake it represents
- Return ONLY valid JSON, no extra text

JSON format:
{
  "questionText": "...",
  "options": [
    {"text": "...", "type": "correct", "logicTag": "correct_flow"},
    {"text": "...", "type": "concept_error", "logicTag": "describe_mistake"},
    {"text": "...", "type": "calculation_error", "logicTag": "describe_mistake"},
    {"text": "...", "type": "partial_logic", "logicTag": "describe_mistake"}
  ],
  "expectedTime": 25,
  "conceptTested": "one sentence what this tests",
  "shortcut": "optional shortcut tip"
}
`;
  if (!client) return null;
  try {
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });
    const text = res.choices[0].message.content.trim();
    return JSON.parse(text);
  } catch {
    return null;
  }
};

// ── Personalized Study Advice ──────────────────────────────────────
export const getStudyAdvice = async (profile) => {
  const { weakAreas, strongAreas, thinkingProfile, accuracy, examDate } = profile;

  const daysLeft = examDate
    ? Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 60;

  const prompt = `
Student profile:
- Thinking pattern: ${thinkingProfile}
- Overall accuracy: ${Math.round(accuracy * 100)}%
- Weak areas: ${weakAreas?.join(", ") || "None detected yet"}
- Strong areas: ${strongAreas?.join(", ") || "None detected yet"}
- Days until exam: ${daysLeft}

Give a 3-4 sentence personalized study recommendation:
1. What to prioritize now
2. Why they are struggling (based on thinking pattern)
3. One specific daily habit to improve
Keep it direct and practical.
`;
  if (!client) return "Focus on your weak areas and practice medium-difficulty questions daily.";
  try {
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 250,
    });
    return res.choices[0].message.content;
  } catch {
    return "Focus on your weak areas and practice medium-difficulty questions daily.";
  }
};
