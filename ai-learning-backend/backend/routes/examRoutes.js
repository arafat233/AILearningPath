import express from "express";
import Joi from "joi";
import { listExams, startExam, submitExam, getExamReview, getLeaderboard } from "../controllers/examController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const r = express.Router();

const startSchema = Joi.object({
  examId: Joi.string().required(),
});

const submitSchema = Joi.object({
  answers: Joi.array().items(
    Joi.object({
      questionId:   Joi.string().required(),
      selectedType: Joi.string().optional().allow(""),
      timeTaken:    Joi.number().optional(),
    })
  ).required(),
});

r.get("/list",                   auth, listExams);
r.post("/start",                 auth, validate(startSchema),  startExam);
r.post("/submit",                auth, validate(submitSchema), submitExam);
r.get("/review/:attemptId",      auth, getExamReview);
r.get("/leaderboard/:examId",    auth, getLeaderboard);

export default r;
