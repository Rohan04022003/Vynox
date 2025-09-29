import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tweetImage: {
      url: {
        type: String,
      },
      public_Id: {
        type: String,
      },
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    likeCount: {
      type: Number,
      default: 0
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
