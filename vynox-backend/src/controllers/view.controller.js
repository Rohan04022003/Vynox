import { Video } from "../models/video.model.js";
import { VideoView } from "../models/videoView.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// POST /videos/:id/view
export const incrementView = async (req, res) => {
  const videoId = req.params.id;
  const userId = req.user._id;

  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const alreadyViewed = await VideoView.findOne({
    video: videoId,
    user: userId,
    viewedAt: { $gte: last24Hours },
  });

  // Already viewed within 24h
  if (alreadyViewed) {
    return res
      .status(409)
      .json(new ApiResponse(409, "Already viewed within last 24 hours"));
  }

  await Video.findByIdAndUpdate(videoId, {
    $inc: { views: 1 },
  });

  await VideoView.create({
    video: videoId,
    user: userId,
    viewedAt: new Date(),
  });

  return res.status(200).json(
    new ApiResponse(200, "View counted successfully")
  );
};
