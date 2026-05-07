// ============================================================
// INPUT GUARD — AI endpoint protection for Stellar
//
// Applied before all AI endpoints that send user text to Claude.
// Zero cost — pure regex/string checks, no Claude calls.
//
// Layers (in order):
//   0. Strike cooldown    — user blocked after 3 violations in 5 min
//   1. Input length       — cap at 1 000 chars
//   2. PII detection      — phone, Aadhaar, email, card (warn, no strike)
//   3. Unicode normalise  — collapse leet-speak / homoglyphs before checks
//   4. Jailbreak          — prompt-injection + leakage attempts (+ strike)
//   5. Off-topic          — non-CBSE requests (+ strike)
//   6. Unsafe content     — violence, drugs, adult — app for minors (+ strike)
// ============================================================

import { sessionGet, sessionSet, incrBy } from "../utils/redisClient.js";
import logger from "../utils/logger.js";

const MAX_INPUT_LENGTH = 1000;

// ── Strike / cooldown config ──────────────────────────────────
const STRIKE_LIMIT      = 3;
const STRIKE_WINDOW_TTL = 5  * 60;   // seconds — rolling 5-min window
const COOLDOWN_TTL      = 15 * 60;   // seconds — 15-min AI lockout

const strikeKey   = (uid) => `guard:strikes:${uid}`;
const cooldownKey = (uid) => `guard:cooldown:${uid}`;

// ── 0. Unicode / leet-speak normaliser ───────────────────────
// Runs before pattern checks so "1gn0re" and "ｉｇｎｏｒｅ" are caught.
const CYRILLIC_MAP = { а:'a',е:'e',о:'o',р:'p',с:'c',х:'x',і:'i',ѕ:'s',ј:'j',ԁ:'d' };
const LEET_MAP     = { '0':'o','1':'i','3':'e','4':'a','5':'s','7':'t','@':'a','$':'s' };

function normalizeInput(text) {
  let s = text;
  // Remove zero-width / invisible characters
  s = s.replace(/[​-‍﻿­⁠]/g, '');
  // Full-width Unicode (ａ→a, ｂ→b, ０→0, etc.)
  s = s.replace(/[！-～]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
  // Cyrillic lookalikes → Latin
  s = s.replace(/[аеорсхіѕјԁ]/g, c => CYRILLIC_MAP[c] || c);
  // Leet-speak substitutions
  s = s.replace(/[01345@$7]/g, c => LEET_MAP[c] || c);
  // Collapse whitespace
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

// ── 1. Jailbreak / prompt-injection patterns ──────────────────
const JAILBREAK_PATTERNS = [
  /ignore\s+(previous|above|all|prior)\s+(instructions?|prompts?|rules?)/i,
  /pretend\s+(you\s+are|to\s+be|you're)/i,
  /act\s+as\s+(?!(?:a\s+)?(?:teacher|tutor|student))/i,
  /you\s+are\s+now\s+(?!a\s+(teacher|tutor))/i,
  /\bDAN\b/,
  /jailbreak/i,
  /system\s+prompt/i,
  /override\s+(your|the)\s+(instructions?|rules?|guidelines?)/i,
  /forget\s+(everything|all|your\s+(instructions?|training))/i,
  /do\s+not\s+(follow|obey)\s+(your|the)\s+(instructions?|rules?)/i,
  /bypass\s+(safety|content|filter)/i,
  /disregard\s+(your|the|all|previous)/i,
  /you\s+have\s+no\s+(rules?|restrictions?|limits?)/i,
  /unlimited\s+(mode|access|power)/i,
  /<\s*script\s*>/i,
  /prompt\s+injection/i,
  // Prompt leakage — trying to extract system instructions
  /repeat\s+(your|the)\s+(first\s+)?(message|instructions?|prompt|system)/i,
  /what\s+(were|are)\s+you\s+(told|instructed|trained)\s+to/i,
  /echo\s+(your|the)\s+(instructions?|prompt|system\s+message)/i,
  /print\s+(your|the)\s+(system\s+)?(instructions?|prompt|message)/i,
  /show\s+me\s+your\s+(instructions?|prompt|system)/i,
];

// ── 2. Off-topic patterns ─────────────────────────────────────
const OFF_TOPIC_PATTERNS = [
  // Creative writing
  /\b(write\s+(me\s+a?\s+)?(poem|song|story|essay|cover\s+letter|resume|cv|speech|joke|rap))\b/i,
  // Code generation
  /\bgenerate\s+(?:(?:a|an|the|my|some)\s+)?(?:\w+\s+)?(code|program|script|app|website|html|css|javascript|python|sql)\b/i,
  // Hacking / piracy
  /\b(how\s+to\s+(hack|crack|pirate|torrent|download\s+free))\b/i,
  // Finance
  /\b(stock\s+(market|tips?|trading|investment))\b/i,
  /\b(crypto(currency)?|bitcoin|nft)\b/i,
  // Personal / social
  /\b(dating|relationship\s+advice|girlfriend|boyfriend|hook\s*up)\b/i,
  /\b(sports?\s+(betting|tips?|prediction))\b/i,
  /\b(movie\s+review|celebrity|gossip|tiktok|instagram|youtube\s+channel)\b/i,
  /\b(recipe|cooking|diet\s+plan|weight\s+loss\s+tips?)\b/i,
  // Politics
  /\b(political\s+(party|leader|opinion)|vote\s+for|election\s+tips?)\b/i,
  // India-specific communal / religious opinion
  /\b(hindu|muslim|sikh|christian)s?\s+(are|should|must|vs?\.?\s+|versus|fight|riot|kill|attack)/i,
  /\b(caste\s+(discrimination|superiority|is\s+right|system\s+is\s+good))\b/i,
  /\b(communal\s+(violence|tensions?|riots?))\b/i,
  // Exam paper leaks
  /\b(board\s+exam\s+(question\s+)?paper|leak(ed)?\s+(paper|question)|exam\s+paper\s+202\d)\b/i,
  /\bwhat\s+questions?\s+(will\s+come|are\s+coming)\s+in\s+(board|exam)\b/i,
];

// ── 3. Unsafe content (minors 12-18) ──────────────────────────
const UNSAFE_PATTERNS = [
  /\b(kill\s+(yourself|myself|someone)|suicide\s+(method|how\s+to)|self\s+harm)\b/i,
  /\b(how\s+to\s+(make|build|create)\s+(a\s+)?(bomb|weapon|gun|explosive|poison))\b/i,
  /\b(drug\s+(how\s+to\s+(get|buy|make)|dealer)|buy\s+(weed|cocaine|heroin))\b/i,
  /\b(porn|pornography|xxx|nude|naked|sex\s+(position|tips?|video))\b/i,
  /\b(rape|molest|assault|abuse\s+(child|kid|minor))\b/i,
];

// ── 4. PII patterns ───────────────────────────────────────────
// Not a security threat — but students accidentally share personal info.
// Warn + no strike.
const PII_PATTERNS = [
  { re: /\b[6-9]\d{9}\b/,                           label: 'phone number'  },
  { re: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,         label: 'Aadhaar number' },
  { re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, label: 'email address' },
  { re: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, label: 'card number' },
];

// ── Helpers ───────────────────────────────────────────────────
function extractInput(body) {
  return (
    body.message        ||
    body.transcript     ||
    body.userExplanation ||
    body.questionText   ||
    ''
  ).toString();
}

async function recordStrike(userId) {
  if (!userId) return;
  try {
    const strikes = await incrBy(strikeKey(userId), 1, STRIKE_WINDOW_TTL);
    if (strikes >= STRIKE_LIMIT) {
      await sessionSet(cooldownKey(userId), '1', COOLDOWN_TTL);
      logger.warn('inputGuard: cooldown triggered', { userId, strikes });
    }
  } catch { /* non-blocking — don't let Redis failure break the request */ }
}

async function checkCooldown(userId) {
  if (!userId) return false;
  try { return !!(await sessionGet(cooldownKey(userId))); }
  catch { return false; }
}

// ── Middleware ─────────────────────────────────────────────────
export async function inputGuard(req, res, next) {
  const userId = req.user?.id;

  // Layer 0: cooldown check
  if (await checkCooldown(userId)) {
    logger.warn('inputGuard: request blocked — cooldown active', { userId });
    return res.status(429).json({
      error: 'Too many suspicious requests. AI access is paused for 15 minutes.',
    });
  }

  const input = extractInput(req.body);

  // Layer 1: length cap
  if (input.length > MAX_INPUT_LENGTH) {
    return res.status(400).json({
      error: `Input too long. Please keep your message under ${MAX_INPUT_LENGTH} characters.`,
    });
  }

  // Layer 2: PII — warn but don't strike (accidental, not malicious)
  for (const { re, label } of PII_PATTERNS) {
    if (re.test(input)) {
      logger.info('inputGuard: PII detected', { userId, label });
      return res.status(400).json({
        error: `Please don't share personal information (${label}) in the chat. Ask me your study question instead!`,
        type: 'pii',
      });
    }
  }

  // Normalise once — all remaining checks use this
  const normalised = normalizeInput(input);

  // Layer 3: jailbreak
  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(normalised)) {
      logger.warn('inputGuard: jailbreak attempt', { userId, pattern: pattern.source.slice(0, 60) });
      await recordStrike(userId);
      return res.status(400).json({
        error: "I'm your CBSE study tutor. I can't help with that — ask me a question from your syllabus!",
      });
    }
  }

  // Layer 4: off-topic
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(normalised)) {
      logger.info('inputGuard: off-topic', { userId, pattern: pattern.source.slice(0, 60) });
      await recordStrike(userId);
      return res.status(400).json({
        error: 'I only help with CBSE Class 10 subjects — Math, Science, English, Social Science, and Hindi. Ask me something from your syllabus!',
      });
    }
  }

  // Layer 5: unsafe content
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(normalised)) {
      logger.warn('inputGuard: unsafe content', { userId });
      await recordStrike(userId);
      return res.status(400).json({
        error: "That's not something I can help with. If you're going through a tough time, please talk to a trusted adult or counsellor.",
      });
    }
  }

  next();
}
