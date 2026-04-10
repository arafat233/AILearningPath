import { UserProfile, Question } from "../models/index.js";

// Prerequisite map — expand this for each subject
const PREREQUISITE_MAP = {
  "Quadratic Equations": ["Linear Equations", "Factorization", "Algebra Basics"],
  "Trigonometry": ["Geometry Basics", "Algebra Basics", "Coordinate Geometry"],
  "Calculus": ["Algebra Basics", "Functions", "Trigonometry"],
  "Probability": ["Basic Arithmetic", "Fractions", "Permutations"],
  "Factorization": ["Algebra Basics", "Basic Arithmetic"],
  "Linear Equations": ["Algebra Basics", "Basic Arithmetic"],
  "Coordinate Geometry": ["Geometry Basics", "Linear Equations"],
  "Functions": ["Algebra Basics", "Linear Equations"],
};

export const checkFoundation = async (userId, topic) => {
  const profile = await UserProfile.findOne({ userId });

  const prereqs = PREREQUISITE_MAP[topic] || [];
  if (!prereqs.length || !profile) return { redirect: false };

  const weakAreas = profile.weakAreas || [];

  // Check if any prerequisite is weak
  const weakPrereqs = prereqs.filter((p) => weakAreas.includes(p));

  if (weakPrereqs.length === 0) return { redirect: false };

  // Find a foundation question
  const foundationTopic = weakPrereqs[0];
  const question = await Question.findOne({ topic: foundationTopic });

  return {
    redirect: true,
    foundationTopic,
    message: `You are struggling with "${topic}" because your "${foundationTopic}" fundamentals are weak. Let's fix that first.`,
    question,
  };
};
