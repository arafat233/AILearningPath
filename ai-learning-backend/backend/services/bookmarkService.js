import { BookmarkCollection, BookmarkReview, TopicBookmark, SectionBookmark, makeShareToken } from "../models/bookmarkModels.js";
import { Question, User, Attempt } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

// ── SM-2 algorithm (SuperMemo 2) ─────────────────────────────────────
// rating: 0 = again | 1 = hard | 2 = good | 3 = easy
// Returns the next state {easeFactor, intervalDays, repetitions, dueAt}
export function sm2Next(prev, rating) {
  let { easeFactor = 2.5, intervalDays = 0, repetitions = 0 } = prev || {};
  const quality = [0, 3, 4, 5][rating] ?? 4; // map to SM-2 q (0..5)

  if (rating === 0) {
    // Failed — restart schedule
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1)      intervalDays = 1;
    else if (repetitions === 2) intervalDays = rating === 1 ? 3 : 6;
    else                        intervalDays = Math.round(intervalDays * easeFactor);
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  if (rating === 3) intervalDays = Math.round(intervalDays * 1.3);

  const dueAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000);
  return { easeFactor, intervalDays, repetitions, dueAt };
}

// ── Reviews / mastery ──────────────────────────────────────────────────
export async function getReviewsForUser(userId) {
  const rows = await BookmarkReview.find({ userId }).lean();
  const map = {};
  for (const r of rows) map[r.questionId] = r;
  return map;
}

export async function ensureReview(userId, questionId) {
  let r = await BookmarkReview.findOne({ userId, questionId });
  if (!r) r = await BookmarkReview.create({ userId, questionId });
  return r;
}

export async function rateReview(userId, questionId, rating) {
  if (![0, 1, 2, 3].includes(rating)) throw new AppError("Invalid rating", 422);
  const prev = await ensureReview(userId, questionId);
  const next = sm2Next(prev, rating);
  prev.easeFactor    = next.easeFactor;
  prev.intervalDays  = next.intervalDays;
  prev.repetitions   = next.repetitions;
  prev.dueAt         = next.dueAt;
  prev.lastReviewedAt= new Date();
  prev.lastRating    = rating;
  prev.reviewCount  += 1;
  if (rating === 0) prev.wrongCount += 1;
  if (rating === 3 && prev.repetitions >= 3) {
    prev.mastered = true;
    prev.masteredAt = new Date();
  }
  prev.updatedAt = new Date();
  await prev.save();
  return prev;
}

export async function setMastery(userId, questionId, mastered) {
  const prev = await ensureReview(userId, questionId);
  prev.mastered = !!mastered;
  prev.masteredAt = mastered ? new Date() : null;
  prev.updatedAt = new Date();
  await prev.save();
  return prev;
}

export async function setNote(userId, questionId, note) {
  const prev = await ensureReview(userId, questionId);
  prev.note = (note || "").slice(0, 280);
  prev.updatedAt = new Date();
  await prev.save();
  return prev;
}

// ── Due Today queue ────────────────────────────────────────────────────
export async function getDueQuestions(userId, limit = 20) {
  const user = await User.findById(userId).select("savedQuestions").lean();
  const savedIds = (user?.savedQuestions || []).map(String);
  if (!savedIds.length) return [];

  const reviews = await BookmarkReview.find({ userId, questionId: { $in: savedIds } }).lean();
  const reviewMap = {};
  for (const r of reviews) reviewMap[r.questionId] = r;

  const now = new Date();
  const due = savedIds
    .filter((id) => {
      const r = reviewMap[id];
      if (!r) return true; // never reviewed = due
      if (r.mastered)   return false;
      return r.dueAt && new Date(r.dueAt) <= now;
    })
    .slice(0, limit);

  if (!due.length) return [];

  const questions = await Question.find({ _id: { $in: due }, deletedAt: null })
    .select("questionText subject grade conceptTested difficultyScore options topic")
    .lean();
  return questions.map((q) => ({
    ...q,
    options: (q.options || []).map(({ text, logicTag }) => ({ text, logicTag })),
    review: reviewMap[String(q._id)] || null,
  }));
}

// ── Smart auto-collections ─────────────────────────────────────────────
// Returns IDs that match each smart filter, computed server-side.
export async function computeSmartCollections(userId) {
  const user = await User.findById(userId).select("savedQuestions examDate").lean();
  const savedIds = (user?.savedQuestions || []).map(String);
  const reviews = await BookmarkReview.find({ userId }).lean();
  const reviewMap = {};
  for (const r of reviews) reviewMap[r.questionId] = r;

  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const twoWeeks = 14 * 24 * 60 * 60 * 1000;

  const out = {
    due:           [],
    forgotten:     [],
    frequentlyWrong:[],
    thisWeek:      [],
    mastered:      [],
  };

  for (const id of savedIds) {
    const r = reviewMap[id];
    if (!r) {
      out.due.push(id);
      continue;
    }
    if (r.mastered) {
      out.mastered.push(id);
      continue;
    }
    if (r.dueAt && new Date(r.dueAt).getTime() <= now) out.due.push(id);
    if (r.wrongCount >= 2) out.frequentlyWrong.push(id);
    const last = new Date(r.lastReviewedAt || r.createdAt).getTime();
    if (now - last > twoWeeks && r.reviewCount === 0) out.forgotten.push(id);
    if (now - new Date(r.createdAt).getTime() < oneWeek) out.thisWeek.push(id);
  }

  return out;
}

// ── Custom collections CRUD ────────────────────────────────────────────
export async function listCollections(userId) {
  return BookmarkCollection.find({ userId }).sort({ order: 1, createdAt: 1 }).lean();
}

export async function createCollection(userId, { name, emoji, color }) {
  const trimmed = (name || "").trim().slice(0, 60);
  if (!trimmed) throw new AppError("Collection name required", 422);
  const count = await BookmarkCollection.countDocuments({ userId });
  if (count >= 50) throw new AppError("Max 50 collections", 422);
  const col = await BookmarkCollection.create({
    userId,
    name: trimmed,
    emoji: emoji || "📁",
    color: color || "#007AFF",
    order: count,
  });
  return col;
}

export async function updateCollection(userId, colId, patch) {
  const allow = ["name", "emoji", "color", "order"];
  const set = {};
  for (const k of allow) if (patch[k] !== undefined) set[k] = patch[k];
  set.updatedAt = new Date();
  const col = await BookmarkCollection.findOneAndUpdate({ _id: colId, userId }, { $set: set }, { new: true });
  if (!col) throw new AppError("Collection not found", 404);
  return col;
}

export async function deleteCollection(userId, colId) {
  const result = await BookmarkCollection.deleteOne({ _id: colId, userId });
  if (!result.deletedCount) throw new AppError("Collection not found", 404);
  return true;
}

export async function reorderCollections(userId, orderedIds) {
  const ops = orderedIds.map((id, i) => ({
    updateOne: { filter: { _id: id, userId }, update: { $set: { order: i, updatedAt: new Date() } } },
  }));
  if (ops.length) await BookmarkCollection.bulkWrite(ops);
  return true;
}

export async function addToCollection(userId, colId, kind, refId) {
  const col = await BookmarkCollection.findOne({ _id: colId, userId });
  if (!col) throw new AppError("Collection not found", 404);
  const exists = col.memberRefs.some((m) => m.kind === kind && m.refId === refId);
  if (!exists) {
    col.memberRefs.push({ kind, refId, addedAt: new Date() });
    col.updatedAt = new Date();
    await col.save();
  }
  return col;
}

export async function removeFromCollection(userId, colId, kind, refId) {
  const col = await BookmarkCollection.findOne({ _id: colId, userId });
  if (!col) throw new AppError("Collection not found", 404);
  col.memberRefs = col.memberRefs.filter((m) => !(m.kind === kind && m.refId === refId));
  col.updatedAt = new Date();
  await col.save();
  return col;
}

export async function bulkAddToCollection(userId, colId, items) {
  const col = await BookmarkCollection.findOne({ _id: colId, userId });
  if (!col) throw new AppError("Collection not found", 404);
  for (const { kind, refId } of items) {
    if (!col.memberRefs.some((m) => m.kind === kind && m.refId === refId)) {
      col.memberRefs.push({ kind, refId, addedAt: new Date() });
    }
  }
  col.updatedAt = new Date();
  await col.save();
  return col;
}

// ── Topic / Section bookmarks (server-side mirror of localStorage) ────
export async function listTopicBookmarks(userId) {
  return TopicBookmark.find({ userId }).sort({ savedAt: -1 }).lean();
}

export async function upsertTopicBookmark(userId, body) {
  const { topicId, name, subject, isLesson, smartCol } = body;
  if (!topicId) throw new AppError("topicId required", 422);
  const doc = await TopicBookmark.findOneAndUpdate(
    { userId, topicId },
    { $set: { name, subject, isLesson: !!isLesson, smartCol: smartCol || null }, $setOnInsert: { savedAt: new Date() } },
    { upsert: true, new: true }
  );
  return doc;
}

export async function removeTopicBookmark(userId, topicId) {
  await TopicBookmark.deleteOne({ userId, topicId });
  await BookmarkCollection.updateMany(
    { userId },
    { $pull: { memberRefs: { kind: "topic", refId: topicId } } }
  );
  return true;
}

export async function listSectionBookmarks(userId) {
  return SectionBookmark.find({ userId }).sort({ savedAt: -1 }).lean();
}

export async function upsertSectionBookmark(userId, body) {
  const { bmId, topicId, label, sectionKey } = body;
  if (!bmId || !topicId) throw new AppError("bmId and topicId required", 422);
  const doc = await SectionBookmark.findOneAndUpdate(
    { userId, bmId },
    { $set: { topicId, label, sectionKey: sectionKey || "" }, $setOnInsert: { savedAt: new Date() } },
    { upsert: true, new: true }
  );
  return doc;
}

export async function removeSectionBookmark(userId, bmId) {
  await SectionBookmark.deleteOne({ userId, bmId });
  await BookmarkCollection.updateMany(
    { userId },
    { $pull: { memberRefs: { kind: "section", refId: bmId } } }
  );
  return true;
}

// ── Bulk delete ───────────────────────────────────────────────────────
export async function bulkRemoveQuestions(userId, ids) {
  if (!Array.isArray(ids) || !ids.length) return { removed: 0 };
  await User.findByIdAndUpdate(userId, { $pull: { savedQuestions: { $in: ids } } });
  await BookmarkReview.deleteMany({ userId, questionId: { $in: ids } });
  await BookmarkCollection.updateMany(
    { userId },
    { $pull: { memberRefs: { kind: "question", refId: { $in: ids } } } }
  );
  return { removed: ids.length };
}

export async function bulkSetMastery(userId, ids, mastered) {
  if (!Array.isArray(ids) || !ids.length) return { updated: 0 };
  const now = new Date();
  await Promise.all(ids.map(async (qid) => {
    const r = await ensureReview(userId, qid);
    r.mastered = !!mastered;
    r.masteredAt = mastered ? now : null;
    r.updatedAt = now;
    await r.save();
  }));
  return { updated: ids.length };
}

// ── Share collection ──────────────────────────────────────────────────
export async function generateCollectionShareToken(userId, colId) {
  const col = await BookmarkCollection.findOne({ _id: colId, userId });
  if (!col) throw new AppError("Collection not found", 404);
  if (!col.shareToken) {
    col.shareToken = makeShareToken();
    col.sharedAt = new Date();
    col.updatedAt = new Date();
    await col.save();
  }
  return col.shareToken;
}

export async function revokeCollectionShareToken(userId, colId) {
  const col = await BookmarkCollection.findOne({ _id: colId, userId });
  if (!col) throw new AppError("Collection not found", 404);
  col.shareToken = null;
  col.sharedAt = null;
  col.updatedAt = new Date();
  await col.save();
  return true;
}

export async function getSharedCollection(token) {
  const col = await BookmarkCollection.findOne({ shareToken: token }).lean();
  if (!col) throw new AppError("Shared collection not found", 404);

  const questionRefs = col.memberRefs.filter((m) => m.kind === "question").map((m) => m.refId);
  const topicRefs    = col.memberRefs.filter((m) => m.kind === "topic").map((m) => m.refId);

  const [questions, topics, owner] = await Promise.all([
    questionRefs.length
      ? Question.find({ _id: { $in: questionRefs }, deletedAt: null })
          .select("questionText subject grade conceptTested difficultyScore")
          .lean()
      : [],
    topicRefs.length
      ? TopicBookmark.find({ topicId: { $in: topicRefs }, userId: col.userId })
          .select("topicId name subject")
          .lean()
      : [],
    User.findById(col.userId).select("name").lean(),
  ]);

  return {
    name: col.name,
    emoji: col.emoji,
    color: col.color,
    sharedAt: col.sharedAt,
    ownerName: owner?.name || "A Stellar learner",
    questions,
    topics,
  };
}

// ── Export to Markdown / Anki ─────────────────────────────────────────
export async function exportCollection(userId, colId, format = "md") {
  const col = await BookmarkCollection.findOne({ _id: colId, userId }).lean();
  if (!col) throw new AppError("Collection not found", 404);

  const qIds = col.memberRefs.filter((m) => m.kind === "question").map((m) => m.refId);
  const tIds = col.memberRefs.filter((m) => m.kind === "topic").map((m) => m.refId);

  const [questions, topics] = await Promise.all([
    qIds.length
      ? Question.find({ _id: { $in: qIds }, deletedAt: null })
          .select("questionText conceptTested options solutionSteps subject topic correctAnswer")
          .lean()
      : [],
    tIds.length
      ? TopicBookmark.find({ topicId: { $in: tIds }, userId })
          .select("topicId name subject")
          .lean()
      : [],
  ]);

  if (format === "anki") {
    // CSV: Front,Back  (importable as Anki deck)
    const rows = [["Front", "Back", "Tags"]];
    for (const q of questions) {
      const front = (q.questionText || "").replace(/"/g, '""');
      const correct = (q.options || []).find((o) => o.logicTag === "correct")?.text || q.correctAnswer || "";
      const back = [
        correct,
        q.solutionSteps?.length ? "<br><br>" + q.solutionSteps.join("<br>") : "",
        q.conceptTested ? "<br><br><i>Concept: " + q.conceptTested + "</i>" : "",
      ].join("").replace(/"/g, '""');
      const tags = [q.subject, q.topic, col.name].filter(Boolean).map((t) => t.replace(/\s+/g, "_")).join(" ");
      rows.push([`"${front}"`, `"${back}"`, tags]);
    }
    return { mime: "text/csv", filename: `${col.name.replace(/[^\w]+/g, "_")}.csv`, body: rows.map((r) => r.join(",")).join("\n") };
  }

  // Markdown
  const lines = [
    `# ${col.emoji} ${col.name}`,
    `> Exported from Stellar — ${new Date().toISOString().slice(0, 10)}`,
    "",
  ];
  if (topics.length) {
    lines.push("## Topics", "");
    for (const t of topics) lines.push(`- **${t.name}** _(${t.subject})_  \`${t.topicId}\``);
    lines.push("");
  }
  if (questions.length) {
    lines.push("## Questions", "");
    for (const q of questions) {
      lines.push(`### ${q.conceptTested || q.topic || "Question"}`);
      lines.push("", q.questionText, "");
      const correct = (q.options || []).find((o) => o.logicTag === "correct")?.text;
      if (correct) lines.push(`**Answer:** ${correct}`, "");
      if (q.solutionSteps?.length) {
        lines.push("**Solution:**");
        for (const s of q.solutionSteps) lines.push(`- ${s}`);
        lines.push("");
      }
      lines.push("---", "");
    }
  }
  return { mime: "text/markdown", filename: `${col.name.replace(/[^\w]+/g, "_")}.md`, body: lines.join("\n") };
}

// ── AI summary ─────────────────────────────────────────────────────────
export async function generateAiSummary(userId, colId) {
  const col = await BookmarkCollection.findOne({ _id: colId, userId });
  if (!col) throw new AppError("Collection not found", 404);

  // 24h cache
  if (col.aiSummary && col.aiSummaryAt && Date.now() - new Date(col.aiSummaryAt).getTime() < 24 * 60 * 60 * 1000) {
    return col.aiSummary;
  }

  const qIds = col.memberRefs.filter((m) => m.kind === "question").map((m) => m.refId);
  const tIds = col.memberRefs.filter((m) => m.kind === "topic").map((m) => m.refId);

  const [questions, topics, attempts] = await Promise.all([
    qIds.length
      ? Question.find({ _id: { $in: qIds } }).select("conceptTested topic subject difficultyScore").lean()
      : [],
    tIds.length
      ? TopicBookmark.find({ topicId: { $in: tIds }, userId }).select("name subject").lean()
      : [],
    qIds.length
      ? Attempt.find({ userId, questionId: { $in: qIds } }).select("isCorrect topic").lean()
      : [],
  ]);

  const concepts = [...new Set(questions.map((q) => q.conceptTested).filter(Boolean))].slice(0, 12);
  const subjects = [...new Set([...questions.map((q) => q.subject), ...topics.map((t) => t.subject)].filter(Boolean))];
  const wrongRate = attempts.length ? (attempts.filter((a) => !a.isCorrect).length / attempts.length).toFixed(2) : "n/a";

  // Heuristic summary — fast, deterministic, no AI tokens. Upgradable to LLM later.
  const subjectStr = subjects.length ? subjects.join(" + ") : "varied subjects";
  const focusConcept = concepts[0] || "the saved topics";
  const wrongPct = attempts.length ? Math.round((1 - parseFloat(wrongRate)) * 100) : null;
  const accuracyLine = wrongPct !== null
    ? `you currently get ${wrongPct}% right on these — ${wrongPct < 60 ? "real weak spot" : wrongPct < 80 ? "needs reinforcement" : "almost there"}.`
    : `you haven't tested yourself on these recently.`;

  const summary = [
    `• You're building a ${subjectStr} cluster around ${concepts.slice(0,3).join(", ") || "core ideas"} — ${qIds.length} question${qIds.length===1?"":"s"} saved, ${tIds.length} topic${tIds.length===1?"":"s"}.`,
    `• Likely weakest: ${focusConcept} — ${accuracyLine}`,
    `• This week: 15 min on Due Today should clear ${Math.min(qIds.length, 8)} of these. Then quiz the collection to lock it in.`,
  ].join("\n");
  col.aiSummary = summary;
  col.aiSummaryAt = new Date();
  col.updatedAt = new Date();
  await col.save();
  return summary;
}
