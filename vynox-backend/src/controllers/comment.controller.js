import mongoose, { mongo } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
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
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const result = await Comment.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },

      {
        $facet: {
          totalCount: [{ $count: "totalComments" }],

          comments: [
            { $sort: { updatedAt: -1 } },
            { $skip: skip },
            { $limit: limitNum },

            // 🔹 Owner details
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

            // 🔹 Likes lookup
            {
              $lookup: {
                from: "likes",
                let: { commentId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$comment", "$$commentId"] },
                    },
                  },

                  // only user info
                  {
                    $lookup: {
                      from: "users",
                      localField: "likedBy",
                      foreignField: "_id",
                      as: "user",
                      pipeline: [{ $project: { avatar: 1 } }],
                    },
                  },
                  { $unwind: "$user" },
                ],
                as: "likes",
              },
            },

            // Computed fields
            {
              $addFields: {
                totalLikes: { $size: "$likes" },

                // sirf 3 avatars
                likedUsers: {
                  $slice: ["$likes.user", 3],
                },

                // current user ne like kiya ya nahi
                isLikedByCurrentUser: {
                  $in: [userId, "$likes.likedBy"],
                },
              },
            },

            // cleanup
            {
              $project: {
                likes: 0,
              },
            },
          ],
        },
      },
    ]);

    const totalComments = result[0]?.totalCount[0]?.totalComments || 0;
    const comments = result[0]?.comments || [];

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

  const trimmedContent = content.trim();

  if (trimmedContent.length === 0 || trimmedContent.length > 500) {
    throw new ApiError(400, "Comment length should be 1–500 characters.");
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
      content: trimmedContent,
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

  const trimmedContent = content.trim();

  if (trimmedContent.length === 0 || trimmedContent.length > 500) {
    throw new ApiError(400, "Comment length should be 1–500 characters.");
  }

  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, owner: req.user?._id },
      {
        content: trimmedContent,
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

    // for delete all like record related to the comment
    await Like.deleteMany({
      comment: commentId,
    });

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
