import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Tweet } from "../models/tweet.model.js";
import { SaveTweet } from "../models/saveTweets.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleSaveTweet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { tweetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweetExists = await Tweet.exists({ _id: tweetId });
  if (!tweetExists) {
    throw new ApiError(404, "Tweet not found");
  }

  const alreadySaved = await SaveTweet.findOne({
    user: userId,
    tweet: tweetId,
  });

  // TOGGLE LOGIC
  if (alreadySaved) {
    await SaveTweet.deleteOne({ _id: alreadySaved._id });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          saved: false,
        },
        "Tweet unsaved"
      )
    );
  }

  // SAVE
  await SaveTweet.create({
    user: userId,
    tweet: tweetId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        saved: true,
      },
      "Tweet saved"
    )
  );
});

const getSavedTweet = asyncHandler(async (req, res) => {
  const { sortType = "desc", limit = 20, page = 1 } = req.query;

  const limitNum = Number(limit);
  const pageNum = Number(page);
  const skip = (pageNum - 1) * limitNum;

  const userId = new mongoose.Types.ObjectId(req.user._id);

  const result = await SaveTweet.aggregate([
    // current user ka hi saved tweet aaye uske liye.
    {
      $match: { user: userId },
    },

    {
      $facet: {
        totalCount: [{ $count: "totalTweets" }],

        tweets: [
          { $sort: { createdAt: sortType === "desc" ? -1 : 1 } },
          { $skip: skip },
          { $limit: limitNum },

          // Tweet lookup
          {
            $lookup: {
              from: "tweets",
              localField: "tweet",
              foreignField: "_id",
              as: "tweet",
            },
          },
          { $unwind: "$tweet" },

          // Owner lookup
          {
            $lookup: {
              from: "users",
              localField: "tweet.owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          { $unwind: "$owner" },

          // Subscriptions
          {
            $lookup: {
              from: "subscriptions",
              localField: "owner._id",
              foreignField: "channel",
              as: "subscribers",
            },
          },

          // Likes
          {
            $lookup: {
              from: "likes",
              localField: "tweet._id",
              foreignField: "tweet",
              as: "likes",
            },
          },

          // yaha pe hum like structure defined kr rhe hai means fields add kr rhe hai.
          {
            $addFields: {
              "tweet.owner": "$owner",
              "tweet.totalLikes": { $size: "$likes" },
              "tweet.isLiked": {
                $in: [userId, "$likes.likedBy"],
              },
              "tweet.isSubscribed": {
                $in: [userId, "$subscribers.subscriber"],
              },
              "tweet.tweetSaved": true,
            },
          },

          // tweet ko root kr rhe hai.
          {
            $replaceRoot: {
              newRoot: "$tweet",
            },
          },
        ],
      },
    },
  ]);

  const tweets = result[0]?.tweets || [];
  const totalTweets = result[0]?.totalCount[0]?.totalTweets || 0;

  return res.status(200).json({
    status: 200,
    data: {
      savedTweet: tweets,
      totalTweets,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalTweets / limitNum),
    },
    message: "Saved Tweets fetched successfully.",
  });
});

export { toggleSaveTweet, getSavedTweet };
