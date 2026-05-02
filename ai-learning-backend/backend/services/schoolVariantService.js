/**
 * School Variant Service
 *
 * Guarantees no two students from the same school ever receive the same
 * homework / assessment question for a given topic + slot.
 *
 * Mechanism:
 *   Each student has a variant_index (their position in enrolledStudentIds).
 *   The seed for question generation is derived from
 *     (schoolId, assessmentId, slotId, variantIndex)
 *   — not from userId — so two students in the same school always get
 *   distinct seeds and thus distinct questions.
 *
 * Port of school_variant_assigner.py.
 */

import { SchoolGroup, User } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import {
  getDynamicQuestionForSchoolVariant,
  hasDynamicTemplate,
} from "./questionTemplateService.js";
import { Question } from "../models/index.js";

// ── School management ─────────────────────────────────────────────────────────

export async function createSchoolGroup(schoolName, createdByUserId) {
  const joinCode = _randomCode();
  const group = await SchoolGroup.create({ schoolName, createdBy: String(createdByUserId), joinCode });
  return group;
}

export async function getSchoolGroup(schoolGroupId) {
  const group = await SchoolGroup.findById(schoolGroupId).lean();
  if (!group) throw new AppError("School group not found", 404);
  return group;
}

export async function listMySchoolGroups(userId) {
  return SchoolGroup.find({ createdBy: String(userId) }).lean();
}

// ── Enrollment ────────────────────────────────────────────────────────────────

/**
 * Enroll a student into a school group.
 * Returns the student's variant_index (their unique position within the school).
 * Safe to call multiple times — idempotent (returns existing index if already enrolled).
 */
export async function enrollStudent(schoolGroupId, studentUserId) {
  const studentId = String(studentUserId);
  const group = await SchoolGroup.findById(schoolGroupId);
  if (!group) throw new AppError("School group not found", 404);

  let idx = group.enrolledStudentIds.indexOf(studentId);
  if (idx === -1) {
    group.enrolledStudentIds.push(studentId);
    await group.save();
    idx = group.enrolledStudentIds.length - 1;
    // Link back to user
    await User.findByIdAndUpdate(studentUserId, { schoolGroupId });
  }
  return { variantIndex: idx, schoolGroupId: group._id, schoolName: group.schoolName };
}

/**
 * Self-enroll via join code (student-initiated).
 */
export async function enrollByCode(joinCode, studentUserId) {
  const group = await SchoolGroup.findOne({ joinCode });
  if (!group) throw new AppError("Invalid join code", 404);
  return enrollStudent(group._id, studentUserId);
}

/**
 * Get a student's variant index. Returns null if not enrolled in any group.
 */
export async function getVariantIndex(studentUserId) {
  const user = await User.findById(studentUserId).select("schoolGroupId").lean();
  if (!user?.schoolGroupId) return null;

  const group = await SchoolGroup.findById(user.schoolGroupId).lean();
  if (!group) return null;

  const idx = group.enrolledStudentIds.indexOf(String(studentUserId));
  return idx === -1 ? null : { variantIndex: idx, schoolGroupId: group._id, schoolName: group.schoolName };
}

// ── Variant retrieval ─────────────────────────────────────────────────────────

/**
 * Get the unique homework question for a student.
 *
 * If the student is enrolled in a school group:
 *   - Uses school-scoped seed → guaranteed unique within the school
 *   - Returns isDynamic: true, uniquenessGuaranteed: true
 *
 * If NOT enrolled (solo learner):
 *   - Falls back to user-scoped seed (still unique per-user, just not school-guaranteed)
 *   - Returns isDynamic: true, uniquenessGuaranteed: false
 *
 * If no dynamic template exists for the topic+difficulty:
 *   - Falls through to static DB question
 *   - Returns isDynamic: false, uniquenessGuaranteed: false
 *
 * @param {string} studentUserId
 * @param {string} topicId         e.g. "ch5_s1_c2_t1"
 * @param {string} difficulty      "easy" | "medium" | "hard"
 * @param {string} assessmentId    e.g. "homework_2026-05-02" or "mock_paper_ch5"
 * @param {string} slotId          e.g. "q1" or "slot_easy_1" (distinguishes multiple questions of same type)
 * @param {number} attemptN        how many times this student has already attempted this topic+difficulty
 */
export async function getHomeworkVariant(studentUserId, topicId, difficulty, assessmentId, slotId, attemptN = 0) {
  // 1. Check if student is school-enrolled
  const enrollment = await getVariantIndex(studentUserId);

  if (enrollment !== null && hasDynamicTemplate(topicId, difficulty)) {
    // School-scoped: guaranteed unique within the school
    const { variantIndex, schoolGroupId, schoolName } = enrollment;
    const question = getDynamicQuestionForSchoolVariant(
      topicId, difficulty,
      String(schoolGroupId), assessmentId, slotId,
      variantIndex
    );
    if (question) {
      return {
        ...question,
        _meta: {
          isDynamic: true,
          uniquenessGuaranteed: true,
          variantIndex,
          schoolName,
          slotId,
          assessmentId,
        },
      };
    }
  }

  if (!enrollment && hasDynamicTemplate(topicId, difficulty)) {
    // No school enrollment — use user-scoped seed (personal uniqueness, not school-guaranteed)
    const { getDynamicQuestion } = await import("./questionTemplateService.js");
    const question = getDynamicQuestion(topicId, difficulty, String(studentUserId), attemptN);
    if (question) {
      return {
        ...question,
        _meta: {
          isDynamic: true,
          uniquenessGuaranteed: false,
          note: "Enroll in a school group for school-wide uniqueness guarantee.",
          slotId,
          assessmentId,
        },
      };
    }
  }

  // Fallback: serve a static question from DB
  const staticQ = await Question.findOne({
    topicId,
    difficulty,
    isFlagged: { $ne: true },
    deletedAt: null,
  }).lean();

  if (staticQ) {
    return {
      _id:          staticQ._id,
      questionId:   staticQ.questionId,
      questionText: staticQ.questionText,
      questionType: staticQ.questionType,
      options:      (staticQ.options ?? []).map((o) => ({ text: o.text })),
      marks:        staticQ.marks || 1,
      difficulty:   staticQ.difficulty,
      topicId:      staticQ.topicId,
      _meta: {
        isDynamic: false,
        uniquenessGuaranteed: false,
        warning: `No dynamic template for ${topicId} at ${difficulty} difficulty. All students see this question.`,
      },
    };
  }

  return null;
}

/**
 * Get a full homework set for a student.
 * Returns one unique question per requested slot.
 *
 * @param {string} studentUserId
 * @param {Array}  slots  e.g. [{ topicId, difficulty, slotId }]
 * @param {string} assessmentId
 */
export async function getHomeworkSet(studentUserId, slots, assessmentId) {
  const questions = await Promise.all(
    slots.map((s, i) =>
      getHomeworkVariant(studentUserId, s.topicId, s.difficulty, assessmentId, s.slotId || `slot_${i}`)
        .then((q) => ({ slot: s.slotId || `slot_${i}`, question: q }))
    )
  );
  return questions;
}

// ── School roster summary ─────────────────────────────────────────────────────

export async function getSchoolSummary(schoolGroupId) {
  const group = await SchoolGroup.findById(schoolGroupId).lean();
  if (!group) throw new AppError("School group not found", 404);

  const users = await User.find({
    _id: { $in: group.enrolledStudentIds },
  }).select("name email").lean();

  const userMap = new Map(users.map((u) => [String(u._id), u]));

  return {
    schoolGroupId:  group._id,
    schoolName:     group.schoolName,
    joinCode:       group.joinCode,
    studentCount:   group.enrolledStudentIds.length,
    students:       group.enrolledStudentIds.map((id, idx) => ({
      variantIndex: idx,
      userId: id,
      name: userMap.get(id)?.name || "(unknown)",
      email: userMap.get(id)?.email || "",
    })),
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function _randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase(); // e.g. "X4K2P7"
}
