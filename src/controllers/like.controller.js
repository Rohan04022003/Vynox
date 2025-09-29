import mongoose, { isValidObjectId, startSession } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const existingLike = await Like.findOne({
      video: videoId,
      likedBy: req.user?._id,
    }).session(session);

    if (existingLike) {
      await existingLike.deleteOne({ session });
      await Video.findByIdAndUpdate(
        videoId,
        { $inc: { likeCount: -1 } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res
        .status(200)
        .json(new ApiResponse(200, "Video unliked successfully."));
    }

    const liked = await Like.create(
      [
        {
          video: videoId,
          likedBy: req.user?._id,
        },
      ],
      { session }
    );

    await Video.findByIdAndUpdate(
      videoId,
      { $inc: { likeCount: 1 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, "video liked successfully."));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, "Something went wrong while toggling like.");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingLike = await Like.findOne({
      tweet: tweetId,
      likedBy: req.user?._id,
    }).session(session);

    if (existingLike) {
      await existingLike.deleteOne({ session });
      await Tweet.findOneAndUpdate(
        tweetId,
        {
          $inc: {
            likeCount: -1,
          },
        },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res
        .status(200)
        .json(new ApiResponse(200, "Tweet Unliked successfully."));
    }

    await Like.create([{ tweet: tweetId, likedBy: req.user?._id }], {
      session,
    });
    await Tweet.findOneAndUpdate(
      { _id: tweetId },
      { $inc: { likeCount: 1 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, "Tweet liked successfully."));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new ApiError(
      500,
      "Something went wrong while toggle tweet like.",
      error
    );
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
