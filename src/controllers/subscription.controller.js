import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "channelId is not valid.");
  }

  if (channelId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot subscribe yourself.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingSubscription = await Subscription.findOne({
      channel: channelId,
      subscriber: req.user?._id,
    }).session(session);

    let isSubscribed = true;

    if (existingSubscription) {
      await Subscription.deleteOne({ _id: existingSubscription._id }).session(
        session
      );
      isSubscribed = false;
    } else {
      await Subscription.create(
        [
          {
            channel: channelId,
            subscriber: req.user?._id,
          },
        ],
        { session }
      );

      isSubscribed = true;
    }

    const result = await Subscription.aggregate(
      [
        {
          $match: {
            channel: new mongoose.Types.ObjectId(channelId),
          },
        },
        {
          $count: "totalSubscribers",
        },
      ],
      { session }
    );

    const totalSubscribers = result[0]?.totalSubscribers || 0;

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalSubscribers,
          isSubscribed,
        },
        isSubscribed ? "Subscribed successfully" : "Unsubscribed successfully."
      )
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, "Something was wrong while toggling subscription.");
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getSubscribedChannels };
