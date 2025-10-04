import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "ChannelId is not valid.");
  }

  try {
    const channelStat = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "owner",
          as: "videos",
          pipeline: [
            {
              $project: {
                videos: 0,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          totalVideos: { $size: "$videos" },
          totalviews: { $sum: "$videos.views" },
          totalLikes: { $sum: "$videos.likeCount" },
        },
      },

      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
          pipeline: [
            {
              $project: {
                subscribers: 0,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          totalSubscribers: { $size: "$subscribers" },
          isSubscribed: {
            $in: [req.user._id, "$subscribers.subscriber"],
          },
        },
      },
      {
        $project: {
          username: 1,
          fullName: 1,
          email: 1,
          avatar: 1,
          totalVideos: 1,
          totalViews: 1,
          totalLikes: 1,
          totalSubscribers: 1,
          isSubscribed: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, channelStat, "Channel stats fetched successfully.")
      );
  } catch (error) {
    console.log(error?.messages);

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
