// =============================================
// Analysis Engine — detects HOW the user thinks
// =============================================

export const analyzeAnswer = (question, selectedType, timeTaken, confidence) => {
  const isCorrect = selectedType === "correct";
  const expectedTime = question.expectedTime || 20;
  const isFast = timeTaken < expectedTime * 0.5;
  const isSlow = timeTaken > expectedTime * 2;

  let behavior = selectedType;

  // Override: fast + wrong = guessing regardless of option type
  if (!isCorrect && isFast) {
    behavior = "guessing";
  }

  // Confidence mismatch detection
  let confidenceInsight = null;
  if (confidence === "high" && !isCorrect) {
    confidenceInsight = "dangerous_misconception"; // they THINK they know but don't
  } else if (confidence === "low" && isCorrect) {
    confidenceInsight = "unstable_knowledge"; // knows it but isn't sure why
  }

  // Speed profile
  let speedProfile = "normal";
  if (isFast && isCorrect) speedProfile = "mastery";
  else if (isFast && !isCorrect) speedProfile = "guessing";
  else if (isSlow && isCorrect) speedProfile = "deep_thinker";
  else if (isSlow && !isCorrect) speedProfile = "concept_unclear";

  const message = generateFeedback(behavior, speedProfile, confidenceInsight);

  return { isCorrect, behavior, speedProfile, confidenceInsight, message };
};

const generateFeedback = (behavior, speedProfile, confidenceInsight) => {
  const behaviorMessages = {
    correct: "Correct! Strong understanding.",
    concept_error: "You misunderstood the core concept here.",
    calculation_error: "Your logic was right but the calculation went wrong.",
    partial_logic: "You started correctly but missed a step.",
    guessing: "This looks like a guess. Slow down and think through the steps.",
    misinterpretation: "You misread what the question was asking.",
  };

  let msg = behaviorMessages[behavior] || "Review this concept.";

  if (confidenceInsight === "dangerous_misconception") {
    msg += " Warning: You were confident but incorrect — this suggests a deep misconception.";
  } else if (confidenceInsight === "unstable_knowledge") {
    msg += " Good news: you got it right — build more confidence here.";
  }

  if (speedProfile === "deep_thinker") {
    msg += " You took your time — great focus, work on speed.";
  }

  return msg;
};

// Classify user thinking profile from their attempt history
export const classifyThinkingProfile = (behaviorStats, accuracy) => {
  const { guessing = 0, concept_error = 0, calculation_error = 0, partial_logic = 0 } = behaviorStats;
  const total = guessing + concept_error + calculation_error + partial_logic || 1;

  const guessingRate = guessing / total;
  const conceptRate = concept_error / total;

  if (guessingRate > 0.5) return "Guesser";
  if (accuracy > 0.85) return "Deep Thinker";
  if (accuracy > 0.65 && conceptRate < 0.2) return "Pattern Recognizer";
  if (accuracy > 0.5 && conceptRate > 0.3) return "Surface Learner";
  return "Overthinker";
};
