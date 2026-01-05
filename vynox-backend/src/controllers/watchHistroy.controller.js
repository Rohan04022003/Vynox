import mongoose from "mongoose";
import { WatchHistory } from "../models/watchHistory.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;
  const now = new Date();

  try {
    await WatchHistory.findOneAndUpdate(
      { user: userId, video: videoId },
      { lastWatchedAt: now },
      { upsert: true, new: true } // upsert ki wajah se history hoga toh update nahi toh new create
    );

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Watch history updated."));
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while adding watch history: " + error?.message
    );
  }
});

export const deleteHistory = asyncHandler(async (req, res) => {
  const { watchedHistoryId } = req.params;
  const userId = req.user._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(watchedHistoryId)) {
      throw new ApiError(400, "Invalid watched history id.");
    }

    const deletedHistory = await WatchHistory.findOneAndDelete({
      _id: watchedHistoryId,
      user: userId,
    });

    if (!deletedHistory) {
      throw new ApiError(
        404,
        "Watched history not found or you are not authorized."
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Watched history deleted."));
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while deleting watched history.: " + error?.message
    );
  }
});

export const clearHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await WatchHistory.deleteMany({
    user: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Watch history cleared."));
});

export const getHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const watchedHistories = await WatchHistory.aggregate([
      // User match
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },

      // Recent first
      {
        $sort: { lastWatchedAt: -1 },
      },

      // Lookup video
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "video",
          pipeline: [
            {
              $project: {
                title: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                owner: 1,
                createdAt: 1,
              },
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
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: "$owner" },
          ],
        },
      },

      // Flatten video
      { $unwind: "$video" },

      // lastWatchedAt ko video ke andar dal rahe hai.
      {
        $addFields: {
          "video.lastWatchedAt": "$lastWatchedAt",
        },
      },

      // Sirf video object rakh rhe hai.
      {
        $project: {
          _id: 0,
          video: 1,
        },
      },

      // Saare videos ko ek array me group kar rhe hai.
      {
        $group: {
          _id: null,
          videos: { $push: "$video" },
        },
      },

      // _id hata diya rhe hai.
      {
        $project: {
          _id: 0,
          videos: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          watchedHistories,
          "All History fetched successfully."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while fetching all history.: " + error?.message
    );
  }
});
