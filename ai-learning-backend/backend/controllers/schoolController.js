import Joi from "joi";
import {
  createSchoolGroup,
  getSchoolGroup,
  listMySchoolGroups,
  enrollStudent,
  enrollByCode,
  getVariantIndex,
  getHomeworkVariant,
  getHomeworkSet,
  getSchoolSummary,
} from "../services/schoolVariantService.js";
import { listDynamicTopics } from "../services/questionTemplateService.js";
import { AppError } from "../utils/AppError.js";

// POST /api/v1/schools
export const createSchool = async (req, res, next) => {
  try {
    const { schoolName } = req.body;
    if (!schoolName?.trim()) return next(new AppError("schoolName is required", 400));
    const group = await createSchoolGroup(schoolName.trim(), req.user.id);
    res.status(201).json({ data: group });
  } catch (err) { next(err); }
};

// GET /api/v1/schools
export const listSchools = async (req, res, next) => {
  try {
    const groups = await listMySchoolGroups(req.user.id);
    res.json({ data: groups });
  } catch (err) { next(err); }
};

// GET /api/v1/schools/:schoolGroupId
export const getSchool = async (req, res, next) => {
  try {
    const summary = await getSchoolSummary(req.params.schoolGroupId);
    res.json({ data: summary });
  } catch (err) { next(err); }
};

// POST /api/v1/schools/:schoolGroupId/enroll  (teacher/admin enrolls a student by userId)
export const enrollStudentById = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    if (!studentId) return next(new AppError("studentId is required", 400));
    const result = await enrollStudent(req.params.schoolGroupId, studentId);
    res.json({ data: result });
  } catch (err) { next(err); }
};

// POST /api/v1/schools/join  (student self-enrolls with a join code)
export const joinByCode = async (req, res, next) => {
  try {
    const { joinCode } = req.body;
    if (!joinCode) return next(new AppError("joinCode is required", 400));
    const result = await enrollByCode(joinCode.trim().toUpperCase(), req.user.id);
    res.json({ data: result });
  } catch (err) { next(err); }
};

// GET /api/v1/schools/my-enrollment
export const myEnrollment = async (req, res, next) => {
  try {
    const info = await getVariantIndex(req.user.id);
    res.json({ data: info ?? { enrolled: false } });
  } catch (err) { next(err); }
};

// GET /api/v1/schools/homework?topicId=&difficulty=&assessmentId=&slotId=
// Single question — unique for this student
export const getHomeworkQuestion = async (req, res, next) => {
  try {
    const { topicId, difficulty, assessmentId, slotId } = req.query;
    if (!topicId || !difficulty) return next(new AppError("topicId and difficulty are required", 400));

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const question = await getHomeworkVariant(
      req.user.id,
      topicId,
      difficulty,
      assessmentId || `homework_${today}`,
      slotId || "q1"
    );

    if (!question) return next(new AppError("No question available for this topic/difficulty", 404));
    res.json({ data: question });
  } catch (err) { next(err); }
};

// POST /api/v1/schools/homework-set
// Body: { assessmentId, slots: [{ topicId, difficulty, slotId }] }
// Returns a full homework set — one unique question per slot for this student
export const getHomeworkSetForStudent = async (req, res, next) => {
  try {
    const { slots, assessmentId } = req.body;
    if (!Array.isArray(slots) || slots.length === 0) {
      return next(new AppError("slots array is required", 400));
    }
    const schema = Joi.array().items(Joi.object({
      topicId:    Joi.string().required(),
      difficulty: Joi.string().valid("easy", "medium", "hard").required(),
      slotId:     Joi.string().optional(),
    })).min(1).max(30);

    const { error } = schema.validate(slots);
    if (error) return next(new AppError(error.message, 422));

    const today = new Date().toISOString().slice(0, 10);
    const result = await getHomeworkSet(req.user.id, slots, assessmentId || `homework_${today}`);
    res.json({ data: result });
  } catch (err) { next(err); }
};

// GET /api/v1/schools/dynamic-topics  — which topics have dynamic templates
export const getDynamicTopics = async (req, res, next) => {
  try {
    res.json({ data: listDynamicTopics() });
  } catch (err) { next(err); }
};
