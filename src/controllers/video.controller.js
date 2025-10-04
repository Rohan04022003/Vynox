import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination

  if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID.");
  }

  try {
    const filter = {};

    if (query) {
      filter.title = { $regex: query, $options: "i" };
    }

    if (userId) {
      filter.owner = userId;
    }

    let skip = (Number(page) - 1) * Number(limit);

    let sort = {};

    if (sortBy) {
      sort[sortBy] = sortType === "desc" ? -1 : 1;
    } else {
      sort["createdAt"] = -1;
    }

    const results = await Video.aggregate([
      {
        $match: filter,
      },
      {
        $facet: {
          totalCount: [{ $count: "totalVideos" }],
          videos: [
            {
              $sort: sort,
            },
            {
              $skip: skip,
            },
            {
              $limit: Number(limit),
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
          ],
        },
      },
    ]);

    const totalVideos = results[0]?.totalCount[0]?.totalVideos || 0;
    const videos = results[0]?.videos || [];

    return res.status(200).json(
      new ApiResponse(200, {
        totalVideos,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalVideos / limit),
        videos,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Something went wrong while fetching all videos");
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "Title and description are required.");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video and thumbnail both are required.");
  }

  let videoURL = null;
  let thumbnailURL = null;

  try {
    videoURL = await uploadOnCloudinary(videoLocalPath, "video");
    thumbnailURL = await uploadOnCloudinary(thumbnailLocalPath, "image");

    const video = await Video.create({
      videoFile: {
        url: videoURL.url,
        public_Id: videoURL.public_id,
      },
      thumbnail: {
        url: thumbnailURL.url,
        public_Id: thumbnailURL.public_id,
      },
      duration: videoURL.duration,
      title,
      description,
      owner: req.user._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video uploaded successfully."));
  } catch (error) {
    await deleteFromCloudinary(videoURL.public_id, "video");
    await deleteFromCloudinary(thumbnailURL.public_id, "image");

    throw new ApiError(
      500,
      "Something went wrong while uploading videos: " + error.message
    );
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  try {
    const video = await Video.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(videoId),
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
                fullName: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "video",
          as: "comments",
        },
      },
      {
        $addFields: {
          comments: {
            $slice: [
              {
                $sortArray: {
                  input: "$comments",
                  sortBy: { createdAt: -1 },
                },
              },
              3,
            ],
          },
          totalComents: { $size: "$comments" },
        },
      },
      {
        $project: {
          commentsData: 0, // response me raw data chhupa diya
        },
      },
      {
        $addFields: { ownerId: { $arrayElemAt: ["$owner._id", 0] } },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "ownerId",
          foreignField: "channel",
          as: "subscribers",
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
          subscribers: 0,
        },
      },
    ]);

    if (!video) {
      throw new ApiError(404, "Video is not found.");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video fetched successfully."));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while fetching video.");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "Title and description are required.");
  }

  // ✅ Correct way: findOne instead of findById
  const oldVideoDetails = await Video.findOne({
    _id: videoId,
    owner: req.user._id,
  });

  if (!oldVideoDetails) {
    throw new ApiError(404, "Video not found or you are not the owner.");
  }

  const thumbnailLocalPath = req.file?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required.");
  }

  let thumbnailURL = null;
  const oldThumbnailPublicId = oldVideoDetails.thumbnail?.public_Id;

  try {
    // Upload new thumbnail
    thumbnailURL = await uploadOnCloudinary(thumbnailLocalPath, "image");

    if (!thumbnailURL) {
      throw new ApiError(500, "Failed to upload thumbnail to Cloudinary.");
    }

    // Update fields
    oldVideoDetails.title = title;
    oldVideoDetails.description = description;
    oldVideoDetails.thumbnail.url = thumbnailURL.url;
    oldVideoDetails.thumbnail.public_Id = thumbnailURL.public_id;

    await oldVideoDetails.save({ validateBeforeSave: false });

    // ✅ Delete old thumbnail AFTER saving new one
    if (oldThumbnailPublicId) {
      await deleteFromCloudinary(oldThumbnailPublicId, "image");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { video: oldVideoDetails },
          "Video updated successfully."
        )
      );
  } catch (error) {
    // ✅ Only delete newly uploaded thumbnail if DB update fails
    if (thumbnailURL?.public_id) {
      await deleteFromCloudinary(thumbnailURL.public_id);
    }
    throw new ApiError(
      500,
      "Something went wrong while updating video: " + error?.message
    );
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  try {
    const video = await Video.findOne({
      _id: videoId,
      owner: req.user._id,
    });

    if (!video) {
      throw new ApiError(404, "Video not found or you are not the owner.");
    }

    const videoFile_public_id = video.videoFile.public_Id;
    const thumbnail_public_id = video.thumbnail.public_Id;

    await video.deleteOne({ validateBeforeSave: false });

    await deleteFromCloudinary(videoFile_public_id, "video");
    await deleteFromCloudinary(thumbnail_public_id, "image");

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Video was deleted successfully."));
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while deleting video: " + error?.message
    );
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  try {
    const video = await Video.findOne({ _id: videoId, owner: req.user._id });

    if (!video) {
      throw new ApiError(404, "Video not found or you are not the owner.");
    }

    video.isPublished = !video.isPublished;

    await video.save({ validateBeforeSave: true });

    return res
      .status(200)
      .json(
        new ApiResponse(200, video, "Publish status updated successfully.")
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while updating publish status: " + error?.message
    );
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
