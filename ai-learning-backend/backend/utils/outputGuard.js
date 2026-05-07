import logger from "./logger.js";

// Patterns that indicate Claude leaked its own system prompt back to the student
const LEAKAGE_PATTERNS = [
  /you are an? (expert|cbse|teacher|tutor)/i,
  /your students are \d+-\d+ year/i,
  /teaching style:\s*(clear|direct|factual)/i,
  /keep responses under \d+ sentences/i,
  /always explain:\s*\(1\)/i,
  /आप cbse class/i,
];

// Harmful content that must never reach a student (app is for minors)
const HARMFUL_PATTERNS = [
  /\b(suicide|self.?harm|kill yourself|end your life)\b/i,
  /\bhow to (make|build|create) (a )?(bomb|weapon|explosive|poison)\b/i,
  /\b(porn|pornography|xxx|nude|naked)\b/i,
];

export function checkOutput(text, context = {}) {
  if (!text || typeof text !== "string") {
    logger.warn("outputGuard: empty response from Claude", context);
    return { safe: false, reason: "empty_response" };
  }
  if (text.trim().length < 15) {
    logger.warn("outputGuard: response too short", { ...context, len: text.length });
    return { safe: false, reason: "too_short" };
  }
  for (const p of LEAKAGE_PATTERNS) {
    if (p.test(text)) {
      logger.warn("outputGuard: prompt leakage detected", { ...context, pattern: p.source.slice(0, 50) });
      return { safe: false, reason: "prompt_leakage" };
    }
  }
  for (const p of HARMFUL_PATTERNS) {
    if (p.test(text)) {
      logger.warn("outputGuard: harmful content in response", { ...context, pattern: p.source.slice(0, 50) });
      return { safe: false, reason: "harmful_content" };
    }
  }
  return { safe: true };
}
