import mongoose from "mongoose";

const attentionPointSchema = new mongoose.Schema(
  {
    avgScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    samples: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const lectureAnalyticsSchema = new mongoose.Schema(
  {
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
      unique: true,
      index: true,
    },

    /* ================= GLOBAL STATS ================= */
    totalViews: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalWatchTimeSec: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ================= ATTENTION ================= */
    /**
     * Map<second, { avgScore, samples }>
     * example:
     * {
     *   "0": { avgScore: 72, samples: 10 },
     *   "1": { avgScore: 68, samples: 10 },
     *   "2": { avgScore: 0,  samples: 10 } // skipped by many
     * }
     */
    attentionTimelineAvg: {
      type: Map,
      of: attentionPointSchema,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "LectureAnalytics",
  lectureAnalyticsSchema
);