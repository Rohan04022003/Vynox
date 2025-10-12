import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { ApiError } from "./ApiError.js";


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath, resource_type = "image") => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resource_type
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

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




export {uploadOnCloudinary, deleteFromCloudinary}