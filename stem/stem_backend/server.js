import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import experimentRoutes from "./routes/experiment.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import initRoutes from "./routes/init.routes.js";
import quizRouter from "./routes/quiz.route.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
  res.json({ message: "STEM Explorer API" });
});

app.use("/api/quiz" , quizRouter);
app.use("/api", experimentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api", initRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
