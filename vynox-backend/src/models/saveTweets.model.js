import mongoose from "mongoose";

const saveTweetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
      required: true,
      index: true,
    }
  },
  { timestamps: true }
);

//  Unique constraint ke liye: 1 user + 1 video
saveTweetSchema.index({ tweet: 1, user: 1 }, { unique: true });

export const saveTweet = mongoose.model("saveTweet", saveTweetSchema);
