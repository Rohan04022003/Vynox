import mongoose, { mongo } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "videoId is not valid");
  }

  const limitNum = Number(limit);
  const pageNum = Number(page);

  const skip = (pageNum - 1) * limitNum;

  try {
    const result = await Comment.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $facet: {
          totalCount: [{ $count: "totalComments" }],
          Comments: [
            {
              $sort: { createdAt: -1 },
            },
            {
              $skip: skip,
            },
            {
              $limit: limitNum,
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
                  { $addFields: { owner: { $arrayElemAt: ["$owner", 0] } } },
                ],
              },
            },
          ],
        },
      },
    ]);

    const totalComments = result[0]?.totalCount[0]?.totalComments || 0;
    const comments = result[0]?.Comments || [];

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          page: pageNum,
          limit: limitNum,
          totalComments,
          totalPages: Math.ceil(totalComments / limitNum),
          comments,
        },
        "All comments are fetched successfully."
      )
    );
  } catch (error) {
    console.error("Error in getVideoComments aggregation:", error);
    throw new ApiError(
      500,
      "Something went wrong while fetching all comments."
    );
  }
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video

  const { videoId } = req.params;
  const { content } = req.body;

  if (!content.trim()) {
    throw new ApiError(400, "comment length atleast 1 char");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Video id invalid.");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  try {
    await Comment.create({
      content,
      video: videoId,
      owner: req.user?._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "comment was saved successfully."));
  } catch (error) {
    throw new ApiError(500, "Something was wrong while saving your comment.");
  }
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment

  const { commentId } = req.params;
  const { content } = req.body;

  if (!content.trim()) {
    throw new ApiError(400, "comment length at least 1 char");
  }

  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, owner: req.user?._id },
      {
        content,
        isEdited: true,
      },
      {
        new: true,
      }
    );

    if (!comment) {
      throw new ApiError(404, "Comment not found or you are not authorized.");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Comment was edited successfully."));
  } catch (error) {
    throw new ApiError(500, "Something was wrong while editing your comments.");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment

  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "CommentId is not valid.");
  }

  try {
    const comment = await Comment.findOneAndDelete({
      _id: commentId,
      owner: req.user?._id,
    });

    if (!comment) {
      throw new ApiError(404, "Comment not found or unauthorized request.");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Comment was deleted successfully."));
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while deleting your comment."
    );
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
