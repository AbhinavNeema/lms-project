import mongoose from "mongoose";

const lectureSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
      index: true,
    },

    /* ================= VIEW LOGIC ================= */
    viewed: {
      type: Boolean,
      default: false, // true only after >=50% watch
    },

    watchedSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ================= ATTENTION ================= */
    /**
     * Map<second, attentionScore>
     * example:
     * {
     *   "0": 78,
     *   "1": 85,
     *   "2": 0   // skipped
     * }
     */
    attentionMap: {
      type: Map,
      of: {
        type: Number,
        min: 0,
        max: 100,
      },
      default: {},
    },
  },
  { timestamps: true }
);

/**
 * CRITICAL:
 * Exactly one session per user per lecture
 */
lectureSessionSchema.index(
  { userId: 1, lectureId: 1 },
  { unique: true }
);

export default mongoose.model("LectureSession", lectureSessionSchema);