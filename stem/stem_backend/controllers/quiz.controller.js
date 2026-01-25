import Topic from "../models/Topic.js";
import Problem from "../models/Problem.js";

export const getTopics = async (req, res) => {
  const { subject } = req.params;

  const filter = { subject };
  if (req.params.difficulty) {
    filter.difficulty = req.params.difficulty;
  }

  const topics = await Topic.find(filter);
  res.json(topics);
};

export const getProblems = async (req, res) => {
  const { subject, topic_id } = req.params;

  const problems = await Problem.find({
    subject,
    topic_id,
  });

  res.json(problems);
};

export const checkAnswer = async (req, res) => {
  const problem_id = req.query.problem_id || req.body.problem_id;
  const user_answer = req.query.user_answer || req.body.user_answer;

  if (!problem_id || !user_answer) {
    return res.status(400).json({
      detail: "problem_id and user_answer are required",
    });
  }

  const problem = await Problem.findById(problem_id);

  if (!problem) {
    return res.status(404).json({
      detail: "Problem not found",
    });
  }

  const correct =
    String(user_answer).trim().toLowerCase() ===
    String(problem.answer).trim().toLowerCase();

  return res.json({
    correct,
    answer: problem.answer,
    explanation: problem.explanation,
  });
};
