// ============================================================
// AUTO DOUBT DETECTION — detects WHY user failed without asking
// ============================================================
import { smartAIExplanation } from "./aiRouter.js";

// Classify the doubt type from behavior signals
export const detectDoubtType = (selectedType, timeTaken, expectedTime) => {
  if (selectedType === "correct") return null;

  const isFast = timeTaken < (expectedTime || 20) * 0.4;
  const isSlow = timeTaken > (expectedTime || 20) * 2.5;

  if (isFast) return "guessing";
  if (selectedType === "concept_error") return "concept_gap";
  if (selectedType === "calculation_error") return "calculation_slip";
  if (selectedType === "partial_logic") return "incomplete_logic";
  if (selectedType === "misinterpretation") return "misread_question";
  if (isSlow) return "overthinking";
  return "general_error";
};

// Generate a human-readable doubt insight
export const generateDoubtInsight = (doubtType, topic) => {
  const insights = {
    guessing:           `You answered too quickly — this is guessing. Slow down on ${topic} questions and read each option carefully.`,
    concept_gap:        `You have a conceptual gap in ${topic}. The wrong option you chose suggests you misunderstood a core idea — revisit the lesson.`,
    calculation_slip:   `Your approach was right but the calculation went wrong. Practice arithmetic carefully for ${topic} problems.`,
    incomplete_logic:   `You started the ${topic} problem correctly but didn't complete all steps. Break it into smaller pieces.`,
    misread_question:   `You misread the question. Read it twice before solving, especially in ${topic}.`,
    overthinking:       `You spent too long on this — trust your first logical step in ${topic} problems.`,
    general_error:      `Review this ${topic} concept and try similar questions.`,
  };
  return insights[doubtType] || insights.general_error;
};

// Full auto-doubt pipeline: detect + explain + suggest practice
export const resolveDoubt = async (userId, question, selectedType, correctAnswer, solutionSteps, timeTaken, expectedTime, topic) => {
  const doubtType = detectDoubtType(selectedType, timeTaken, expectedTime);
  if (!doubtType) return null;

  const insight    = generateDoubtInsight(doubtType, topic);
  const aiHelp     = await smartAIExplanation(userId, question, selectedType, correctAnswer, solutionSteps);

  return {
    doubtType,
    insight,
    aiHelp,
    suggestedAction: getSuggestedAction(doubtType),
  };
};

const getSuggestedAction = (doubtType) => {
  const actions = {
    guessing:         "slow_down",
    concept_gap:      "revisit_lesson",
    calculation_slip: "practice_arithmetic",
    incomplete_logic: "step_by_step",
    misread_question: "read_carefully",
    overthinking:     "trust_instinct",
    general_error:    "review_concept",
  };
  return actions[doubtType] || "review_concept";
};
