import { Question } from "../models/index.js";

export const getPYQTopics = async ({ subject, grade, examBoard, year, years }) => {
  const match = { isPYQ: true, deletedAt: null };
  if (subject)   match.subject   = subject;
  if (grade)     match.grade     = grade;
  if (examBoard) match.examBoard = examBoard;
  // Year-aware counts so chips show "Trig · 1" when 2022 selected, not all-time
  const yearArr = years
    ? String(years).split(",").map((y) => Number(y)).filter(Boolean)
    : year ? [Number(year)] : [];
  if (yearArr.length === 1) match.pyqYear = yearArr[0];
  else if (yearArr.length > 1) match.pyqYear = { $in: yearArr };

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

export const getPYQs = async ({ topic, topics, year, years, chapter, chapters, subject, grade, examBoard, difficulty, page = 1, limit = 20 }) => {
  const filter = { isPYQ: true, deletedAt: null };
  // Topics: support single ?topic= and multi ?topics=A,B,C
  const topicArr = topics
    ? String(topics).split(",").map((t) => t.trim()).filter(Boolean)
    : topic ? [topic] : [];
  if (topicArr.length === 1) filter.topic = topicArr[0];
  else if (topicArr.length > 1) filter.topic = { $in: topicArr };
  // Years: support both single ?year=2024 and multi ?years=2024,2023,2022
  const yearArr = years
    ? String(years).split(",").map((y) => Number(y)).filter(Boolean)
    : year ? [Number(year)] : [];
  if (yearArr.length === 1) filter.pyqYear = yearArr[0];
  else if (yearArr.length > 1) filter.pyqYear = { $in: yearArr };
  // Chapters: support single ?chapter=4 and multi ?chapters=1,4,7
  const chapArr = chapters
    ? String(chapters).split(",").map((c) => Number(c)).filter(Boolean)
    : chapter ? [Number(chapter)] : [];
  if (chapArr.length === 1) filter.chapterNumber = chapArr[0];
  else if (chapArr.length > 1) filter.chapterNumber = { $in: chapArr };
  if (subject)   filter.subject   = subject;
  if (grade)     filter.grade     = grade;
  if (examBoard) filter.examBoard = examBoard;
  if (difficulty) filter.difficulty = difficulty;

  const skip = (page - 1) * limit;
  const [questions, total] = await Promise.all([
    Question.find(filter)
      .sort({ pyqYear: -1, chapterNumber: 1, topic: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Question.countDocuments(filter),
  ]);

  return { questions, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) };
};

// ── Chapters list per subject ─────────────────────────────────────
export const getPYQChapters = async ({ subject, grade, examBoard, year, years }) => {
  const match = { isPYQ: true, deletedAt: null, chapterNumber: { $exists: true, $ne: null } };
  if (subject)   match.subject   = subject;
  if (grade)     match.grade     = grade;
  if (examBoard) match.examBoard = examBoard;
  const yearArr = years
    ? String(years).split(",").map((y) => Number(y)).filter(Boolean)
    : year ? [Number(year)] : [];
  if (yearArr.length === 1) match.pyqYear = yearArr[0];
  else if (yearArr.length > 1) match.pyqYear = { $in: yearArr };

  const agg = await Question.aggregate([
    { $match: match },
    { $group: {
      _id:        "$chapterNumber",
      title:      { $first: "$topic" },
      topics:     { $addToSet: "$topic" },
      count:      { $sum: 1 },
      years:      { $addToSet: "$pyqYear" },
      totalMarks: { $sum: "$marks" },
    }},
    { $sort: { _id: 1 } },
  ]);

  return agg.map((c) => ({
    chapterNumber: c._id,
    title:         c.title,
    topics:        c.topics,
    count:         c.count,
    years:         (c.years || []).filter(Boolean).sort((a, b) => b - a),
    totalMarks:    c.totalMarks,
  }));
};

export const getPYQById = async (id) => {
  return Question.findOne({ _id: id, deletedAt: null }).lean();
};

export const getPYQYears = async ({ subject, grade, examBoard }) => {
  const match = { isPYQ: true, deletedAt: null };
  if (subject)   match.subject   = subject;
  if (grade)     match.grade     = grade;
  if (examBoard) match.examBoard = examBoard;

  const years = await Question.distinct("pyqYear", match);
  return years.filter(Boolean).sort((a, b) => b - a);
};
