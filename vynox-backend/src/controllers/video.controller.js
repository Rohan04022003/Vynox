import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { sendMail } from "../services/mail.service.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { VideoView } from "../models/videoView.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortType } = req.query;
  //TODO: get all videos based on query, sort, pagination

  const userId = req.user._id;

  if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID.");
  }

  try {
    const filter = { isPublished: true }; // only published videos will shown.

    if (query) {
      filter.title = { $regex: query, $options: "i" };
    }

    let skip = (Number(page) - 1) * Number(limit);

    const results = await Video.aggregate([
      {
        $match: filter,
      },
      {
        $facet: {
          totalCount: [{ $count: "totalVideos" }],
          videos: [
            { $sort: { createdAt: sortType === "desc" ? -1 : 1 } },
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
            {
              $unwind: "$owner",
            },
            {
              $lookup: {
                from: "favouritevideos",
                localField: "_id",
                foreignField: "video",
                as: "favouriteVideo",
              },
            },
            {
              $addFields: {
                isFavouriteVideo: {
                  $in: [
                    new mongoose.Types.ObjectId(userId),
                    "$favouriteVideo.user",
                  ],
                },
              },
            },
            {
              $project: {
                favouriteVideo: 0,
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

const likedVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sortType } = req.query;
  const userId = req.user._id;

  const skip = (Number(page) - 1) * Number(limit);

  try {
    const results = await Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(userId),
          video: { $exists: true, $ne: null }, // yeh video id present hai ya nahi check krega uske baad hi video like mana jayega.
        },
      },

      // facet ka use pagination ke liye use kiya hai.
      {
        $facet: {
          totalCount: [{ $count: "totalVideos" }],

          videos: [
            { $sort: { createdAt: sortType === "desc" ? -1 : 1 } },
            { $skip: skip },
            { $limit: Number(limit) },

            // yaha pe get video kr rhe hai.
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
                ],
              },
            },
            { $unwind: "$video" },

            // owner ko get kar rha hai same getAllVideos jaisa.
            {
              $lookup: {
                from: "users",
                localField: "video.owner",
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

            // owner ko video ke inside me rakhne ke liye
            {
              $addFields: {
                "video.owner": "$owner",
              },
            },

            // video ko root object bana rhe hai.
            {
              $replaceRoot: {
                newRoot: "$video",
              },
            },
          ],
        },
      },
    ]);

    const totalVideos = results[0]?.totalCount[0]?.totalVideos || 0;
    const videos = results[0]?.videos || [];

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalVideos,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalVideos / limit),
          videos,
        },
        "Liked Videos fetched successfully."
      )
    );
  } catch (error) {
    throw new ApiError(500, "Something went wrong while fetching liked videos");
  }
});

const commentedVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sortType } = req.query;
  const userId = req.user._id;

  const skip = (Number(page) - 1) * Number(limit);

  try {
    const results = await Comment.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
          video: { $exists: true, $ne: null },
        },
      },

      // facet ka use pagination ke liye use kiya hai.
      {
        $facet: {
          totalCount: [{ $count: "totalVideos" }],

          videos: [
            { $sort: { createdAt: sortType === "desc" ? -1 : 1 } },
            { $skip: skip },
            { $limit: Number(limit) },
            {
              $group: {
                _id: "$video",
                latestComment: { $first: "$$ROOT" },
              },
            },

            // yaha pe get video kr rhe hai.
            {
              $lookup: {
                from: "videos",
                localField: "_id",
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
                ],
              },
            },

            { $unwind: "$video" },
            {
              $addFields: {
                "video.userComment": {
                  _id: "$latestComment._id",
                  content: "$latestComment.content",
                  createdAt: "$latestComment.createdAt",
                },
              },
            },

            // owner ko get kar rha hai same getAllVideos jaisa.
            {
              $lookup: {
                from: "users",
                localField: "video.owner",
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

            // owner ko video ke inside me rakhne ke liye
            {
              $addFields: {
                "video.owner": "$owner",
              },
            },

            // video ko root object bana rhe hai.
            {
              $replaceRoot: {
                newRoot: "$video",
              },
            },
          ],
        },
      },
    ]);

    const totalVideos = results[0]?.totalCount[0]?.totalVideos || 0;
    const videos = results[0]?.videos || [];

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalVideos,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalVideos / limit),
          videos,
        },
        "Commented Videos fetched successfully."
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while fetching commented videos"
    );
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;

  const trimmedTitle = title?.trim();
  const trimmedDescription = description?.trim();

  if (!trimmedTitle || !trimmedDescription) {
    throw new ApiError(400, "Title and description are required.");
  }

  if (trimmedTitle.length > 100) {
    throw new ApiError(400, "Title max length is 100 characters.");
  }

  if (trimmedDescription.length > 1500) {
    throw new ApiError(400, "Description max length is 1500 characters.");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized access.");
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
        url: videoURL.hlsUrl || videoURL.secure_url,
        public_Id: videoURL.public_id,
      },
      thumbnail: {
        url: thumbnailURL.url,
        public_Id: thumbnailURL.public_id,
      },
      duration: videoURL.duration,
      title,
      description,
      isPublished,
      owner: user._id,
    });

    await sendMail("videoUpload", user.email, {
      fullName: user.fullName,
      videoTitle: video.title,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video uploaded successfully."));
  } catch (error) {
    videoURL.public_id &&
      (await deleteFromCloudinary(videoURL.public_id, "video"));
    thumbnailURL.public_id &&
      (await deleteFromCloudinary(thumbnailURL.public_id, "image"));

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
        $addFields: {
          ownerId: { $arrayElemAt: ["$owner._id", 0] },
        },
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
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "likes",
        },
      },

      {
        $addFields: {
          totalSubscribers: { $size: "$subscribers" },
          isSubscribed: {
            $in: [
              new mongoose.Types.ObjectId(req.user._id),
              "$subscribers.subscriber",
            ],
          },
          totalLikes: { $size: "$likes" },
          isLiked: {
            $in: [new mongoose.Types.ObjectId(req.user._id), "$likes.likedBy"],
          },
        },
      },

      {
        $project: {
          subscribers: 0, // remove subs object actual json response se.
          likes: 0, // remove likes obj.
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

  const trimmedTitle = title?.trim();
  const trimmedDescription = description?.trim();

  if (!trimmedTitle || !trimmedDescription) {
    throw new ApiError(400, "Title and description are required.");
  }

  if (trimmedTitle.length > 100) {
    throw new ApiError(400, "Title max length is 100 characters.");
  }

  if (trimmedDescription.length > 1500) {
    throw new ApiError(400, "Description max length is 1500 characters.");
  }

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
  try {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }

    const video = await Video.findOne({
      _id: videoId,
      owner: req.user._id,
    });

    if (!video) {
      throw new ApiError(404, "Video not found or you are not the owner.");
    }

    const videoFile_public_id = video.videoFile.public_Id;
    const thumbnail_public_id = video.thumbnail.public_Id;

    // delete video
    await video.deleteOne({ validateBeforeSave: false });

    // view count documents ko delete kr rhe hai.
    await VideoView.deleteMany({
      video: videoId,
    });

    // sare comments nikala hai video ke
    const comments = await Comment.find({ video: videoId }, { _id: 1 });
    // commentIds ko save kr liya.
    const commentIds = comments.map((c) => c._id);

    // ab comments ke likes ko delete kiya hai.
    if (commentIds.length > 0) {
      await Like.deleteMany({
        comment: { $in: commentIds },
      });
    }

    // ab comments ko delete kiya hai.
    await Comment.deleteMany({ video: videoId });

    // uske baad video ko.
    await Like.deleteMany({ video: videoId });

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
  likedVideos,
  commentedVideos,
};
