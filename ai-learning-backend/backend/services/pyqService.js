import { Question } from "../models/index.js";

export const getPYQTopics = async ({ subject, grade, examBoard }) => {
  const match = { isPYQ: true };
  if (subject)   match.subject   = subject;
  if (grade)     match.grade     = grade;
  if (examBoard) match.examBoard = examBoard;

  const agg = await Question.aggregate([
    { $match: match },
    { $group: {
      _id:        "$topic",
      count:      { $sum: 1 },
      years:      { $addToSet: "$pyqYear" },
      totalMarks: { $sum: "$marks" },
      subject:    { $first: "$subject" },
    }},
    { $sort: { _id: 1 } },
  ]);

  return agg.map((t) => ({
    topic:      t._id,
    count:      t.count,
    years:      t.years.filter(Boolean).sort((a, b) => b - a),
    totalMarks: t.totalMarks,
    subject:    t.subject,
  }));
};

export const getPYQs = async ({ topic, year, subject, grade, examBoard, difficulty, page = 1, limit = 20 }) => {
  const filter = { isPYQ: true };
  if (topic)     filter.topic     = topic;
  if (year)      filter.pyqYear   = Number(year);
  if (subject)   filter.subject   = subject;
  if (grade)     filter.grade     = grade;
  if (examBoard) filter.examBoard = examBoard;
  if (difficulty) filter.difficulty = difficulty;

  const skip = (page - 1) * limit;
  const [questions, total] = await Promise.all([
    Question.find(filter)
      .sort({ pyqYear: -1, topic: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Question.countDocuments(filter),
  ]);

  return { questions, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) };
};

export const getPYQById = async (id) => {
  return Question.findById(id).lean();
};

export const getPYQYears = async ({ subject, grade, examBoard }) => {
  const match = { isPYQ: true };
  if (subject)   match.subject   = subject;
  if (grade)     match.grade     = grade;
  if (examBoard) match.examBoard = examBoard;

  const years = await Question.distinct("pyqYear", match);
  return years.filter(Boolean).sort((a, b) => b - a);
};
