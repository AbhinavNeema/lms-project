import express from "express"
import { getCareerGuidance, searchWithAi, getFollowUpGuidance } from "../controllers/aiController.js"
import isAuth from '../middlewares/isAuth.js'

let aiRouter = express.Router()

aiRouter.post("/search",searchWithAi)
aiRouter.get("/career-guidance",isAuth, getCareerGuidance)
aiRouter.post("/follow-up",isAuth, getFollowUpGuidance)

export default aiRouter