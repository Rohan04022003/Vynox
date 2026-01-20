import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Tweet } from "../models/tweet.model.js";
import { SaveTweet } from "../models/saveTweets.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const saveTweet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { tweetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweetExists = await Tweet.exists({ _id: tweetId });
  if (!tweetExists) {
    throw new ApiError(404, "Tweet not found");
  }

  try {
    await SaveTweet.create({
      user: userId,
      tweet: tweetId,
    });

    return res.status(201).json(new ApiResponse(201, {}, "Tweet was saved"));
  } catch (error) {
    throw new ApiError(
      500,
      "Internal server error while saving tweet: ",
      error
    );
  }
});

const unsaveTweet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { tweetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const deleted = await SaveTweet.findOneAndDelete({
    tweet: tweetId,
    user: userId,
  });

  if (!deleted) {
    throw new ApiError(404, "Saved tweet not found");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Tweet was unsaved"));
});

export { saveTweet, unsaveTweet, getSavedTweet };
