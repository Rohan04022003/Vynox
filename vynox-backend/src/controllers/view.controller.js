import { Video } from "../models/video.model.js";
import { VideoView } from "../models/videoView.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const incrementView = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  const now = new Date();
  const last24Hours = new Date(now - 24 * 60 * 60 * 1000);

  try {
    // check if video hai and isPublished hona chahiye.
    const video = await Video.findOne({
      _id: videoId,
      isPublished: true,
    });

    if (!video) {
      throw new ApiError(404, "Video not found or not published.");
    }

    let view = await VideoView.findOne({
      video: videoId,
      user: userId,
    });


    if (view) {
      // 24h rule check
      if (view.lastViewCountedAt < last24Hours) {
        await Video.findByIdAndUpdate(videoId, {
          $inc: { views: 1 },
        });

        view.lastViewCountedAt = now;
        await view.save();
      }

      return res
        .status(200)
        .json(new ApiResponse(200, null, "View processed."));
    }

    // first time view add kr rhe hai.
    await Video.findByIdAndUpdate(videoId, {
      $inc: { views: 1 },
    });

    await VideoView.create({
      video: videoId,
      user: userId,
      lastViewCountedAt: now,
    });

    return res
      .status(201)
      .json(new ApiResponse(200, null, "View counted successfully."));

      
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while processing view: " + error?.message
    );
  }
});
