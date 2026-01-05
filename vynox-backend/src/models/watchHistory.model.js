import mongoose from "mongoose";

const watchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//  Unique constraint ke liye: 1 user + 1 video
videoViewSchema.index({ video: 1, user: 1 }, { unique: true });

// TTL index → auto delete ho jayega after 30 days
watchHistorySchema.index(
  { lastWatchedAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 } // 30 days
);

export const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);
