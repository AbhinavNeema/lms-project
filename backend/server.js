import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./configs/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);
app.use("/api/auth", authRouter);

app.listen(port, async () => {
  await connectDb();
  console.log(`Server running at http://localhost:${port}`);
});
