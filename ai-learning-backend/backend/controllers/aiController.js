import { getStudyAdvice } from "../services/aiService.js";
import { UserProfile } from "../models/index.js";

export const studyAdvice = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await UserProfile.findOne({ userId });
    if (!profile) return res.json({ advice: "Complete some practice questions first to get personalized advice." });

    const advice = await getStudyAdvice(profile);
    res.json({ advice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
