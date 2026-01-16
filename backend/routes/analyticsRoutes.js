import express from "express";
import {
  startLecture,
  addWatchTime,
  addAttention,
  getLectureAnalytics,
  addView
} from "../controllers/analyticsController.js";
import isAuth from '../middlewares/isAuth.js'
const router = express.Router();

router.post("/start",isAuth, startLecture);
router.post("/watch",isAuth, addWatchTime);
router.post("/attention",isAuth, addAttention);
router.get("/lecture/:lectureId", getLectureAnalytics);
router.post("/view",isAuth, addView);

export default router;