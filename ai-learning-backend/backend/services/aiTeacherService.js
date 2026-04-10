// ============================================================
// AI TEACHER MODE — continuous guidance engine
// Generates contextual guidance based on user state
// ============================================================
import { getCached, setCache } from "../utils/cache.js";

export const generateTeacherMessage = (profile, sessionData = {}) => {
  const { accuracy = 0, thinkingProfile, weakAreas = [], behaviorStats = {}, totalAttempts = 0 } = profile;
  const { questionsAnswered = 0, sessionCorrect = 0 } = sessionData;

  // New user — onboard them
  if (totalAttempts < 5) {
    return {
      type: "welcome",
      message: "Welcome! Let's start with easy questions to understand your current level. Don't rush — think through each one.",
      action: "start_easy",
    };
  }

  // Guessing pattern detected
  if ((behaviorStats.guessing || 0) > (totalAttempts * 0.4)) {
    return {
      type: "warning",
      message: "I've noticed you're answering very quickly and getting many wrong. Slow down — read each option before choosing.",
      action: "slow_down",
    };
  }

  // Concept errors dominating
  if ((behaviorStats.concept_error || 0) > (totalAttempts * 0.35)) {
    const weak = weakAreas[0] || "this topic";
    return {
      type: "redirect",
      message: `You keep making concept mistakes in ${weak}. Let's go back to the lesson before continuing with questions.`,
      action: "revisit_lesson",
      topic: weak,
    };
  }

  // Good performance — push harder
  if (accuracy > 0.8 && totalAttempts > 20) {
    return {
      type: "challenge",
      message: "You're doing great on easy and medium questions. Time to tackle the hard ones — that's where real understanding is tested.",
      action: "increase_difficulty",
    };
  }

  // Session-based feedback
  if (questionsAnswered > 0) {
    const sessionAcc = Math.round((sessionCorrect / questionsAnswered) * 100);
    if (sessionAcc >= 80) {
      return { type: "praise", message: `Excellent session! ${sessionAcc}% accuracy. Keep this momentum going.`, action: "continue" };
    }
    if (sessionAcc < 40) {
      return { type: "support", message: `This topic is tough — ${sessionAcc}% today. Try the short lesson first, then come back to questions.`, action: "take_break" };
    }
  }

  // Weak area focus
  if (weakAreas.length > 0) {
    return {
      type: "focus",
      message: `Your priority right now: ${weakAreas[0]}. You're weak here and it likely appears in your exam. Focus here first.`,
      action: "focus_weak",
      topic: weakAreas[0],
    };
  }

  // Profile-based guidance
  const profileMessages = {
    "Guesser":           "You're guessing answers. This won't help you in exams. Take time to think before answering.",
    "Surface Learner":   "You understand basics but struggle with applications. Practice more medium-level problems.",
    "Overthinker":       "Your understanding is good — trust your instincts more and work on speed.",
    "Pattern Recognizer":"You can handle patterns but struggle with deep logic. Focus on WHY answers work, not just HOW.",
    "Deep Thinker":      "You're thinking deeply — now work on speed and covering all topics.",
  };

  return {
    type: "profile",
    message: profileMessages[thinkingProfile] || "Keep practicing consistently — daily practice beats cramming.",
    action: "continue",
  };
};

// Daily opening message
export const getDailyMessage = (profile, streak = 0) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  let msg = `${greeting}! `;

  if (streak > 0) msg += `🔥 ${streak}-day streak — don't break it. `;

  if (profile.weakAreas?.length > 0) {
    msg += `Today's priority: ${profile.weakAreas[0]}. Start there.`;
  } else {
    msg += "Keep practicing — consistency is everything.";
  }

  return msg;
};
