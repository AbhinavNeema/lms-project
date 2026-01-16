import express from "express"
import multer from "multer"
import path from "path"
import { divideMedia } from "../controllers/mediaController.js"


const uploadRouter = express.Router()

const storage = multer.memoryStorage()

const upload = multer({
   storage, 
   limits: { fileSize: 50*1024*1024 }
   });

uploadRouter.post("/upload", upload.single("video"), divideMedia)

export default uploadRouter;