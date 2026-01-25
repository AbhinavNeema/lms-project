import express from "express";
import {
  getTopics,
  getProblems,
  checkAnswer,
} from "../controllers/quiz.controller.js";

const router = express.Router();

router.get("/:subject/topics", getTopics);
router.get("/:subject/topics/:difficulty", getTopics);
router.get("/:subject/problems/:topic_id", getProblems);

router.get("/:subject/check-answer", checkAnswer);
router.post("/:subject/check-answer", checkAnswer);

export default router;
