// ============================================================
// INPUT GUARD — AI endpoint protection for Stellar
//
// Applied before all AI endpoints that send user text to Claude.
// Zero cost — pure regex/string checks, no Claude calls.
//
// Blocks:
//   1. Input too long (>1000 chars)
//   2. Jailbreak / prompt-injection attempts
//   3. Clearly off-topic requests (not CBSE academic)
//   4. Unsafe content (violence, adult, self-harm) — app is for minors 12-18
// ============================================================

import logger from "../utils/logger.js";

const MAX_INPUT_LENGTH = 1000;

// ── 1. Jailbreak / prompt-injection patterns ─────────────────────
// Tries to override the system prompt or make Claude behave outside its role
const JAILBREAK_PATTERNS = [
  /ignore\s+(previous|above|all|prior)\s+(instructions?|prompts?|rules?)/i,
  /pretend\s+(you\s+are|to\s+be|you're)/i,
  /act\s+as\s+(?!(?:a\s+)?(?:teacher|tutor|student))/i,
  /you\s+are\s+now\s+(?!a\s+(teacher|tutor))/i,
  /\bDAN\b/,                           // "Do Anything Now" jailbreak
  /jailbreak/i,
  /system\s+prompt/i,
  /override\s+(your|the)\s+(instructions?|rules?|guidelines?)/i,
  /forget\s+(everything|all|your\s+(instructions?|training))/i,
  /do\s+not\s+(follow|obey)\s+(your|the)\s+(instructions?|rules?)/i,
  /bypass\s+(safety|content|filter)/i,
  /disregard\s+(your|the|all|previous)/i,
  /you\s+have\s+no\s+(rules?|restrictions?|limits?)/i,
  /unlimited\s+(mode|access|power)/i,
  /<\s*script\s*>/i,                   // script injection
  /prompt\s+injection/i,
];

// ── 2. Off-topic patterns (not CBSE Class 9-10 academic content) ──
// Explicit attempts to use the tutor for unrelated purposes
const OFF_TOPIC_PATTERNS = [
  /\b(write\s+(me\s+a?\s+)?(poem|song|story|essay|cover\s+letter|resume|cv|speech|joke|rap))\b/i,
  /\bgenerate\s+(?:(?:a|an|the|my|some)\s+)?(?:\w+\s+)?(code|program|script|app|website|html|css|javascript|python|sql)\b/i,
  /\b(how\s+to\s+(hack|crack|pirate|torrent|download\s+free|bypass))\b/i,
  /\b(stock\s+(market|tips?|trading|investment))\b/i,
  /\b(crypto(currency)?|bitcoin|nft)\b/i,
  /\b(dating|relationship\s+advice|girlfriend|boyfriend|hook\s*up)\b/i,
  /\b(sports?\s+(betting|tips?|prediction))\b/i,
  /\b(movie\s+review|celebrity|gossip|tiktok|instagram|youtube\s+channel)\b/i,
  /\b(recipe|cooking|diet\s+plan|weight\s+loss\s+tips?)\b/i,
  /\b(political\s+(party|leader|opinion)|vote\s+for|election\s+tips?)\b/i,
];

// ── 3. Unsafe content (app for minors 12-18) ─────────────────────
const UNSAFE_PATTERNS = [
  /\b(kill\s+(yourself|myself|someone)|suicide\s+(method|how\s+to)|self\s+harm)\b/i,
  /\b(how\s+to\s+(make|build|create)\s+(a\s+)?(bomb|weapon|gun|explosive|poison))\b/i,
  /\b(drug\s+(how\s+to\s+(get|buy|make)|dealer)|buy\s+(weed|cocaine|heroin))\b/i,
  /\b(porn|pornography|xxx|nude|naked|sex\s+(position|tips?|video))\b/i,
  /\b(rape|molest|assault|abuse\s+(child|kid|minor))\b/i,
];

// ── Extract the text input from any AI request body ──────────────
// Different endpoints use different field names
function extractInput(body) {
  return (
    body.message ||
    body.transcript ||
    body.userExplanation ||
    body.questionText ||
    ""
  ).toString();
}

// ── Middleware factory ────────────────────────────────────────────
export function inputGuard(req, res, next) {
  const input = extractInput(req.body);

  // 1. Length cap
  if (input.length > MAX_INPUT_LENGTH) {
    logger.warn("inputGuard: input too long", { userId: req.user?.id, length: input.length });
    return res.status(400).json({
      error: `Input too long. Please keep your message under ${MAX_INPUT_LENGTH} characters.`,
    });
  }

  // 2. Jailbreak check
  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(input)) {
      logger.warn("inputGuard: jailbreak attempt", { userId: req.user?.id, pattern: pattern.source });
      return res.status(400).json({
        error: "I'm your CBSE study tutor. I can't help with that — ask me a question from your syllabus!",
      });
    }
  }

  // 3. Off-topic check
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(input)) {
      logger.info("inputGuard: off-topic request", { userId: req.user?.id, pattern: pattern.source });
      return res.status(400).json({
        error: "I only help with CBSE Class 10 subjects — Math, Science, English, Social Science, and Hindi. Ask me something from your syllabus!",
      });
    }
  }

  // 4. Unsafe content check
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(input)) {
      logger.warn("inputGuard: unsafe content", { userId: req.user?.id });
      return res.status(400).json({
        error: "That's not something I can help with. If you're going through a tough time, please talk to a trusted adult or counsellor.",
      });
    }
  }

  next();
}
