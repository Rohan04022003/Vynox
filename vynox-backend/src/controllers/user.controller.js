import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import isURLReachable from "../utils/UrlChecker.js";
import { sendMail } from "../services/mail.service.js";
import { getDeviceInfo, getIp } from "../utils/device.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    res.status(400).json(new ApiResponse(400, {}, "All fields are required."));
    throw new ApiError(400, "All fields are required");
  }

  // Username length
  if (username.trim().length > 20) {
    throw new ApiError(400, "Username cannot exceed 20 characters.");
  }

  // Full name length
  if (fullName.trim().length > 25) {
    throw new ApiError(400, "Full name cannot exceed 25 characters.");
  }

  // Password length
  if (password.length > 30) {
    throw new ApiError(400, "Password cannot exceed 30 characters.");
  }

  // Email format (basic regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new ApiError(400, "Invalid email address.");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    res
      .status(400)
      .json(
        new ApiResponse(400, "User with username or email already exists.")
      );
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    res.status(400).json(new ApiResponse(400, {}, "Avatar is requried."));
    throw new ApiError(400, "Avatar file is required");
  }

  let avatar = null;
  let coverImage = null;

  try {
    avatar = await uploadOnCloudinary(avatarLocalPath, "image");

    if (
      req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
    ) {
      const coverImageLocalPath = req.files.coverImage[0].path;
      coverImage = await uploadOnCloudinary(coverImageLocalPath, "image");
    }

    if (!avatar) {
      res
        .status(400)
        .json(
          new ApiResponse(
            500,
            "Avatar uploading failure, please try after some time."
          )
        );
      throw new ApiError(
        500,
        "Avatar uploading failure, please try after some time."
      );
    }

    let user = await User.create({
      fullName,
      avatar: { url: avatar.url, public_id: avatar.public_id },
      coverImage: coverImage
        ? { url: coverImage.url, public_id: coverImage.public_id }
        : {},
      email,
      password,
      username: username.toLowerCase(),
    });

    const registeredUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    user = registeredUser;

    if (!user) {
      res
        .status(500)
        .json(
          new ApiResponse(
            500,
            {},
            "Something went wrong while registering the user"
          )
        );
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    // await sendMail("register", user.email, user);

    return res
      .status(201)
      .json(new ApiResponse(200, user, "User registered Successfully"));
  } catch (error) {
    if (avatar?.public_id) {
      await deleteFromCloudinary(avatar.public_id, "image");
    }

    if (coverImage?.public_id) {
      await deleteFromCloudinary(coverImage.public_id, "image");
    }

    throw new ApiError(500, "Something went wrong while resitering new user.");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier) {
    res
      .status(400)
      .json(new ApiResponse(400, {}, "username or email is required"));
    throw new ApiError(400, "username or email is required");
  }

  const isEmail = identifier.includes("@");

  const user = await User.findOne(
    isEmail ? { email: identifier } : { username: identifier }
  );

  if (!user) {
    res.status(404).json(new ApiResponse(404, {}, "User does not exist"));
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    res.status(404).json(new ApiResponse(401, {}, "Invalid user credentials"));
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  const deviceInfo = getDeviceInfo(req);
  const ip = getIp(req);

  await sendMail("login", user.email, {
    fullName: user.fullName,
    ...deviceInfo,
    ip,
  });

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!newPassword.trim() || newPassword?.trim().length > 30) {
    throw new ApiError(
      400,
      "password should not be empty or more than 30 char"
    );
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  await sendMail("passwordReset", user.email, user);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, bio, socialLinks } = req.body;

  //Full name length
  if (fullName.trim().length > 25) {
    throw new ApiError(400, "Full name cannot exceed 25 characters.");
  }

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new ApiError(400, "Invalid email address.");
  }

  // Bio length (optional)
  if (bio && bio.trim().length > 250) {
    throw new ApiError(400, "Bio cannot exceed 250 characters.");
  }

  // Social links validation
  if (socialLinks) {
    const { linkedin, github, instagram, twitter } = socialLinks;

    const links = [linkedin, github, instagram, twitter];
    links.forEach((link) => {
      if (link && link.length > 200) {
        throw new ApiError(400, "Social link URL is too long.");
      }
    });
  }

  for (let key in socialLinks) {
    if (socialLinks[key]) {
      const reachable = await isURLReachable(socialLinks[key]);
      if (!reachable) {
        throw new ApiError(400, `${key} url is not reachable.`);
      }
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
        bio,
        socialLinks,
      },
    },
    { new: true }
  ).select("-password");

  await sendMail("profileUpdate", user.email, user);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  const oldAvatar_public_id = req.user.avatar.public_id;

  if (!avatarLocalPath) {
    throw new ApiError(400, "File is required.");
  }

  let avatar = null;

  try {
    avatar = await uploadOnCloudinary(avatarLocalPath, "image");

    if (!avatar) {
      throw new ApiError(500, "Failed to upload avatar to Cloudinary.");
    }

    if (oldAvatar_public_id) {
      await deleteFromCloudinary(oldAvatar_public_id);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          avatar: { url: avatar.url, public_id: avatar.public_id },
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: updatedUser },
          "Avatar Updated Successfully."
        )
      );
  } catch (error) {
    if (avatar?.public_id) {
      await deleteFromCloudinary(avatar.public_id, "image");
    }

    throw new ApiError(
      500,
      "Something went wrong while updating avatar: ",
      error?.message
    );
  }
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  const oldCoverImage_public_id = req.user.coverImage.public_id;

  if (!oldCoverImage_public_id) {
    throw new ApiError(500, "Something went wrong while uploading Cover Image");
  }

  let coverImage = null;

  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath, "image");

    if (!coverImage) {
      throw new ApiError(
        500,
        "Something went wrong while uploading cover Image."
      );
    }

    if (oldCoverImage_public_id) {
      await deleteFromCloudinary(oldCoverImage_public_id);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          coverImage: { url: coverImage.url, public_id: coverImage.public_id },
        },
      },
      {
        new: true,
      }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: updatedUser },
          "Cover image updated successfully."
        )
      );
  } catch (error) {
    if (oldCoverImage_public_id) {
      await deleteFromCloudinary(oldCoverImage_public_id, "image");

      throw new ApiError(
        500,
        "Something went wrong while updating cover Image"
      );
    }
  }
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
        bio: 1,
        socialLinks: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
};
