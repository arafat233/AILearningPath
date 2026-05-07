import express from "express";
import Joi from "joi";
import { listExams, startExam, submitExam, getExamReview, getLeaderboard, generateMock } from "../controllers/examController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const r = express.Router();

const startSchema = Joi.object({
  examId: Joi.string().required(),
});

const submitSchema = Joi.object({
  answers: Joi.array().items(
    Joi.object({
      questionId:          Joi.string().required(),
      selectedOptionIndex: Joi.number().integer().min(0).allow(null).optional(),
      answer:              Joi.string().allow("").optional(),
      timeTaken:           Joi.number().optional(),
    })
  ).required(),
});

const generateMockSchema = Joi.object({
  questionCount: Joi.number().integer().min(5).max(50).optional(),
  duration:      Joi.number().integer().min(15).max(120).optional(),
  subject:       Joi.string().optional().allow("", null),
});

r.get("/list",                   auth, listExams);
r.post("/start",                 auth, validate(startSchema),  startExam);
r.post("/submit",                auth, validate(submitSchema), submitExam);
r.get("/review/:attemptId",      auth, getExamReview);
r.get("/leaderboard/:examId",    auth, getLeaderboard);
r.post("/generate-mock",         auth, validate(generateMockSchema), generateMock);

export default r;
