import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      enum: ["math", "science", "computer"],
      required: true,
      index: true,
    },
    topic_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },
    explanation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Problem", ProblemSchema);
