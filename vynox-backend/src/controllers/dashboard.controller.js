import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "ChannelId is not valid.");
  }

  const channelObjectId = new mongoose.Types.ObjectId(channelId);

  // logged-in user optional
  const loggedInUserId = req.user?._id
    ? new mongoose.Types.ObjectId(req.user._id)
    : null;

  try {
    const channelProfileWithStats = await User.aggregate([
      /* -------- MATCH CHANNEL -------- */
      {
        $match: {
          _id: channelObjectId,
        },
      },

      /* -------- VIDEOS -------- */
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "owner",
          as: "videos",
        },
      },
      {
        $addFields: {
          totalVideos: { $size: "$videos" },
          totalVideoViews: {
            $sum: { $ifNull: ["$videos.views", []] },
          },
          totalVideoLikes: {
            $sum: { $ifNull: ["$videos.likeCount", []] },
          },
        },
      },

      /* -------- TWEETS -------- */
      {
        $lookup: {
          from: "tweets",
          localField: "_id",
          foreignField: "owner",
          as: "tweets",
        },
      },
      {
        $addFields: {
          totalTweets: { $size: "$tweets" },
          totalTweetLikes: {
            $sum: { $ifNull: ["$tweets.likeCount", []] },
          },
        },
      },

      /* -------- SUBSCRIPTIONS -------- */
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $addFields: {
          totalSubscribers: { $size: "$subscribers" },
          isSubscribed: {
            $cond: {
              if: { $ne: [loggedInUserId, null] },
              then: {
                $in: [loggedInUserId, "$subscribers.subscriber"],
              },
              else: false,
            },
          },
        },
      },

      /* -------- FINAL SHAPE -------- */
      {
        $project: {
          _id: 1,

          user: {
            _id: "$_id",
            username: "$username",
            fullName: "$fullName",
            email: "$email",
            avatar: "$avatar",
            coverImage: "$coverImage",
            bio: "$bio",
            socialLinks: "$socialLinks",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
          },

          stats: {
            totalVideos: "$totalVideos",
            totalVideoViews: "$totalVideoViews",
            totalVideoLikes: "$totalVideoLikes",
            totalTweets: "$totalTweets",
            totalTweetLikes: "$totalTweetLikes",
            totalSubscribers: "$totalSubscribers",
            isSubscribed: "$isSubscribed",
          },
        },
      },
    ]);

    if (!channelProfileWithStats.length) {
      throw new ApiError(404, "Channel not found.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channelProfileWithStats[0],
          "Channel stats fetched successfully."
        )
      );
  } catch (error) {
    console.error("Channel stats error:", error);

    throw new ApiError(
      500,
      "Something was wrong while fetching channel stats."
    );
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel

  try {
    const videos = await Video.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
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
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, videos, "All videos fetched successfully."));
  } catch (error) {
    throw new ApiError(500, "Something was wrong while fetching all videos.");
  }
});

export { getChannelStats, getChannelVideos };
