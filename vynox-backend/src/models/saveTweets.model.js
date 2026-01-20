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

//  Unique constraint ke liye: 1 user + 1 tweet
saveTweetSchema.index({ tweet: 1, user: 1 }, { unique: true });

export const SaveTweet = mongoose.model("saveTweet", saveTweetSchema);
