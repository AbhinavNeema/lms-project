import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      enum: ["math", "science", "computer"],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Topic", TopicSchema);
