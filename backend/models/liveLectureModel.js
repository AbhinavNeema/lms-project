import mongoose from "mongoose";

const liveLectureSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // in minutes
  meetingId: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: false },
  recordingUrl: { type: String },
  recordingUploadedAt: { type: Date },
  recordingUpdatedAt: { type: Date },
  endedAt: { type: Date },
  notes: {
    url: { type: String },
    name: { type: String },
    size: { type: Number },
    type: { type: String },
    uploadedAt: { type: Date }
  }
}, { timestamps: true });

export const LiveLecture = mongoose.model("LiveLecture", liveLectureSchema);