import { quizApi } from "./axiosInstance";



// ─── TOPICS ───

export const getTopics = (subject) => quizApi.get(`/${subject}/topics`);

export const getTopicsByDifficulty = (subject, difficulty) =>
  quizApi.get(`/${subject}/topics/${difficulty}`);



// ─── PROBLEMS ───

export const getProblems = (subject, topicId) =>
  quizApi.get(`/${subject}/problems/${topicId}`);


// ─── CHECK ANSWER ───

// get
export const checkAnswerGet = (subject, problem_id, user_answer) =>
  quizApi.get(`/${subject}/check-answer`, {
    params: { problem_id, user_answer },
  });

//post
export const checkAnswerPost = (subject, data) =>
  quizApi.post(`/${subject}/check-answer`, data);



// ─── TOPIC CRUD (TEACHER) ───

export const createTopic = (data) => quizApi.post(`/topic`, data);

export const updateTopic = (id, data) => quizApi.put(`/topic/${id}`, data);

export const deleteTopic = (id) => quizApi.delete(`/topic/${id}`);



// ─── PROBLEM CRUD (TEACHER) ───

export const createProblem = (data) => quizApi.post(`/problem`, data);

export const createBulkProblems = (data) => quizApi.post(`/problem/bulk`, data);

export const updateProblem = (id, data) => quizApi.put(`/problem/${id}`, data);

export const deleteProblem = (id) => quizApi.delete(`/problem/${id}`);