import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet

  const { content } = req.body;

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

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets

  const { userId } = req.params;
  const { sortType = "desc", limit = 5, page = 1 } = req.query;

  const skip = (page - 1) * limit;

  const tweets = await Tweet.find({ owner: userId })
    .sort({ createdAt: sortType === "desc" ? -1 : 1 })
    .skip(skip)
    .limit(limit);

  const totalTweets = await Tweet.countDocuments({ owner: userId });

  if (!tweets) {
    throw new ApiError(
      404,
      "Tweets not found or something went wrong while fetching tweets."
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalTweets,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalTweets / limit),
        tweets,
      },
      "All tweets was fetched successfully."
    )
  );
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet

  const { content } = req.body;
  const { tweetId } = req.params;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content cannot be empty.");
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

  const { tweetId } = req.params;

  try {
    const tweet = await Tweet.findOne({ _id: tweetId, owner: req.user?._id });

    if (!tweet) {
      throw new ApiError(
        404,
        "tweet not found or you are not owner of the tweet."
      );
    }

    const tweetImage_public_Id = tweet.tweetImage?.public_Id;

    await tweet.deleteOne({ validateBeforeSave: false });

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

export { createTweet, getUserTweets, updateTweet, deleteTweet };
