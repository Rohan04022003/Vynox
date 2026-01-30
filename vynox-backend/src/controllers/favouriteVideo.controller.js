import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { favouriteVideo } from "../models/favouriteVideos.model.js";

const toggleFavouriteVideo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const tweetExists = await Video.exists({ _id: videoId });
  if (!tweetExists) {
    throw new ApiError(404, "Video not found");
  }

  const alreadySaved = await favouriteVideo.findOne({
    user: userId,
    video: videoId,
  });

  // TOGGLE LOGIC
  if (alreadySaved) {
    await favouriteVideo.deleteOne({ _id: alreadySaved._id });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          favourite: false,
        },
        "unmarked favourite"
      )
    );
  }

  // SAVE
  await favouriteVideo.create({
    user: userId,
    video: videoId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        favourite: true,
      },
      "marked favourite"
    )
  );
});

const getFavouriteVideos = asyncHandler(async (req, res) => {
  const { sortType = "desc", limit = 20, page = 1 } = req.query;

  const limitNum = Number(limit);
  const pageNum = Number(page);
  const skip = (pageNum - 1) * limitNum;

  const userId = new mongoose.Types.ObjectId(req.user._id);

  try {
const results = await favouriteVideo.aggregate([
  {
    $match: { user: userId },
  },

  {
    $facet: {
      totalCount: [{ $count: "totalVideos" }],

      videos: [
        { $sort: { createdAt: sortType === "desc" ? -1 : 1 } },
        { $skip: skip },
        { $limit: limitNum },

        {
          $lookup: {
            from: "videos",
            localField: "video",
            foreignField: "_id",
            as: "video",
          },
        },
        { $unwind: "$video" },

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

        {
          $addFields: {
            "video.owner": "$owner",
            "video.isFavouriteVideo": true,
          },
        },

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
      new ApiResponse(200, {
        totalVideos,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalVideos / limit),
        videos,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Something went wrong while fetching all favourite videos");
  }
});

export { toggleFavouriteVideo, getFavouriteVideos };
