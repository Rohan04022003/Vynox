import mongoose from "mongoose";

const videoViewSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// yeh basically hamaree views ko categoriesed krega.
videoViewSchema.index({ video: 1, user: 1, viewedAt: -1 });

export const VideoView = mongoose.model("VideoView", videoViewSchema);
