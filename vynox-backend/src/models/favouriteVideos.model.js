import mongoose from "mongoose";

const favouriteVideoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "video",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

//  Unique constraint ke liye: 1 user + 1 tweet
favouriteVideoSchema.index({ video: 1, user: 1 }, { unique: true });

export const favouriteVideo = mongoose.model(
  "favouriteVideo",
  favouriteVideoSchema
);
