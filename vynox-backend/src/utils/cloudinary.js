import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, resource_type = "image") => {
  try {
    if (!localFilePath) return null;

    const options = {
      resource_type,
      // File size limit (in bytes)
      ...(resource_type === "video" && {
        chunk_size: 80000000, // 80MB chunks for large files
      }),
    };

    // For videos: add streaming + transformations
    if (resource_type === "video") {
      options.eager = [
        {
          streaming_profile: "auto",
          format: "m3u8",
        },
      ];
      options.eager_async = true;
    }

    const response = await cloudinary.uploader.upload(localFilePath, options);

    fs.unlinkSync(localFilePath);

    let hlsUrl = null;

    // Cloudinary returns .m3u8 inside eager array
    if (
      resource_type === "video" &&
      response.eager &&
      response.eager.length > 0
    ) {
      hlsUrl = response.eager[0].secure_url;
    }

    return {
      ...response,
      hlsUrl, // adaptive streaming URL
    };
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

const deleteFromCloudinary = async (publicId, type = "image") => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: type });
    console.log(`Old ${type} removed from Cloudinary successfully.`);
  } catch (error) {
    throw new ApiError(
      500,
      `Old ${type} deletion in Cloudinary failed: ` + error?.message
    );
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
