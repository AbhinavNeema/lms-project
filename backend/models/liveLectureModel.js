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
  isActive: { type: Boolean, default: true },
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
  },
  // Add status fields for better UI management
  status: { 
    type: String, 
    enum: ['upcoming', 'live', 'ended', 'completed'],
    default: 'upcoming' 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted date
liveLectureSchema.virtual('formattedDate').get(function() {
  return new Date(this.startTime).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for checking if recording exists
liveLectureSchema.virtual('hasRecording').get(function() {
  return !!this.recordingUrl;
});

// Virtual for checking if notes exist
liveLectureSchema.virtual('hasNotes').get(function() {
  return !!this.notes && !!this.notes.url;
});

export const LiveLecture = mongoose.model("LiveLecture", liveLectureSchema);