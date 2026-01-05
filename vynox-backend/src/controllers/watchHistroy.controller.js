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
