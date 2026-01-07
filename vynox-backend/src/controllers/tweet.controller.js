import mongoose, { mongo } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { sendMail } from "../services/mail.service.js";
import { Like } from "../models/like.model.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet

  const { content } = req.body;

  if (!content?.trim() || content?.trim().length > 1500) {
    throw new ApiError(
      400,
      "Tweet Content length should be 1–1500 characters."
    );
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized access.");
  }

  const tweetLocalPath = req.file?.path;

  let tweetURL = null;

  try {
    tweetURL = await uploadOnCloudinary(tweetLocalPath, "image");

    if (!tweetURL) {
      throw new ApiError(
        400,
        "Something went wrong while uploading tweet image."
      );
    }

    const tweet = await Tweet.create({
      content,
      tweetImage: {
        url: tweetURL.url,
        public_Id: tweetURL.public_id,
      },
      owner: req.user?._id,
    });

    if (!tweet) {
      if (tweetURL.public_id) {
        await deleteFromCloudinary(tweetURL.public_id, "image");
      }
      throw new ApiError(
        500,
        "Something went wrong while creating tweet in db"
      );
    }

    await sendMail("tweetUpload", user.email, user);

    return res
      .status(201)
      .json(new ApiResponse(201, tweet, "Tweet created successfully."));
  } catch (error) {
    if (tweetURL.public_id) {
      await deleteFromCloudinary(tweetURL.public_id, "image");
    }
    throw new ApiError(500, "Something went wrong while creating tweet.");
  }
});

const getAllTweets = asyncHandler(async (req, res) => {
  const { sortType = "desc", limit = 20, page = 1, content = "" } = req.query;

  const limitNum = Number(limit);
  const pageNum = Number(page);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  if (content) {
    filter.content = { $regex: content, $options: "i" };
  }

  const userId = req.user?._id
    ? new mongoose.Types.ObjectId(req.user._id)
    : null;

  const result = await Tweet.aggregate([
    // Filter tweets
    {
      $match: filter,
    },

    // Facet for pagination + total count
    {
      $facet: {
        totalCount: [{ $count: "totalTweets" }],

        tweets: [
          // Sort + Pagination
          { $sort: { createdAt: sortType === "desc" ? -1 : 1 } },
          { $skip: skip },
          { $limit: limitNum },

          // Owner lookup
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
                    fullName: 1,
                  },
                },
              ],
            },
          },

          // Flatten owner
          { $unwind: "$owner" },

          // Subscriptions lookup (who subscribed this owner)
          {
            $lookup: {
              from: "subscriptions",
              localField: "owner._id",
              foreignField: "channel",
              as: "subscribers",
            },
          },

          // isSubscribed (CORRECT logic)
          {
            $addFields: {
              isSubscribed: {
                $in: [ new mongoose.Types.ObjectId(userId), "$subscribers.subscriber"]
              },
            },
          },

          // Likes lookup
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "tweet",
              as: "likes",
            },
          },

          // Likes count + isLiked
          {
            $addFields: {
              totalLikes: { $size: "$likes" },

              isLiked: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$likes",
                        as: "l",
                        cond: {
                          $eq: ["$$l.likedBy", { $toObjectId: userId }],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
            },
          },

          // Cleanup
          {
            $project: {
              subscribers: 0,
              likes: 0,
            },
          },
        ],
      },
    },
  ]);

  const tweetsList = result[0]?.tweets || [];
  const totalTweets = result[0]?.totalCount[0]?.totalTweets || 0;

  console.log(tweetsList);
  console.log(totalTweets);

  return res.status(200).json({
    status: 200,
    data: {
      tweets: tweetsList,
      totalTweets,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalTweets / limitNum),
    },
    message: "Tweets fetched successfully.",
  });
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets

  const { userId } = req.params;
  const { sortType = "desc", limit = 5, page = 1 } = req.query;

  const limitNum = Number(limit);
  const pageNum = Number(page);
  const skip = (pageNum - 1) * limitNum;

  // const tweets = await Tweet.find({ owner: userId })
  //   .sort({ createdAt: sortType === "desc" ? -1 : 1 })
  //   .skip(skip)
  //   .limit(limit);

  // Aggregation pipeline
  const result = await Tweet.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $facet: {
        totalCount: [{ $count: "totalTweets" }],
        tweets: [
          { $sort: { createdAt: sortType === "desc" ? -1 : 1 } },
          { $skip: skip },
          { $limit: limitNum },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [{ $project: { username: 1, avatar: 1, fullName: 1 } }],
            },
          },
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "tweet",
              as: "likes",
            },
          },
          {
            $addFields: {
              totalLikes: { $size: "$likes" },
              isLiked: {
                $in: [
                  new mongoose.Types.ObjectId(req.user?._id),
                  "$likes.user",
                ],
              },
            },
          },
        ], // optional, can remove
      },
    },
  ]);

  // Extract results
  const tweetsList = result[0]?.tweets || [];
  const totalTweets = result[0]?.totalCount[0]?.totalTweets || 0;

  return res.status(200).json({
    status: 200,
    data: {
      tweets: tweetsList,
      totalTweets,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalTweets / limitNum),
    },
    message: "Tweets fetched successfully.",
  });
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet

  const { content } = req.body;
  const { tweetId } = req.params;

  if (!content?.trim() || content?.trim().length > 1500) {
    throw new ApiError(
      400,
      "Tweet Content length should be 1–1500 characters."
    );
  }

  const tweet = await Tweet.findOne({ _id: tweetId, owner: req.user?._id });

  if (!tweet) {
    throw new ApiError(400, "Tweet not found or something went wrong.");
  }

  tweet.content = content;
  tweet.isEdited = true;

  await tweet.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet was edited successfully."));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet

  try {
    const { tweetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
      throw new ApiError(400, "Invalid tweet id");
    }
    const tweet = await Tweet.findOne({ _id: tweetId, owner: req.user?._id });

    if (!tweet) {
      throw new ApiError(
        404,
        "tweet not found or you are not owner of the tweet."
      );
    }

    const tweetImage_public_Id = tweet.tweetImage?.public_Id;

    // delete tweet
    await tweet.deleteOne();

    // delete all related likes documents or data.
    await Like.deleteMany({ tweet: tweetId });

    // delete image from cloudinary
    if (tweetImage_public_Id) {
      await deleteFromCloudinary(tweetImage_public_Id, "image");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet was deleted successfully."));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while deleting tweet.");
  }
});

export { createTweet, getUserTweets, getAllTweets, updateTweet, deleteTweet };
