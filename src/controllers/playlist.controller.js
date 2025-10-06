import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Playlist name is required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user?._id,
    videos: [],
  });

  if (!playlist) {
    throw new ApiError(500, "Something was wrong while creating playlist.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "PlaylistId is not valid.");
  }

  try {
    const deletedPlaylist = await Playlist.findOneAndDelete({
      _id: playlistId,
      owner: req.user?._id,
    });

    if (!deletedPlaylist) {
      throw new ApiError(
        404,
        "Playlist not found or not authorized to delete."
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Playlist was deleted successfully."));
  } catch (error) {
    throw new ApiError(500, "Something was wrong while deleting playlist.");
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist

  let updated = {};

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "PlaylistId is not valid.");
  }

  if (name && name.trim()) {
    updated.name = name.trim();
  }

  if (description && description.trim()) {
    updated.description = description.trim();
  }

  if (Object.keys(updated).length === 0) {
    throw new ApiError(400, "No valid fields to update.");
  }

  let playlist = {};

  try {
    if (updated.name || updated.description) {
      playlist = await Playlist.findOneAndUpdate(
        { _id: playlistId, owner: req.user?._id },
        { $set: updated },
        { new: true }
      );
    }

    if (!playlist) {
      throw new ApiError(
        404,
        "Playlist not found or not authorized to update."
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, playlist, "Playlist was updated successfully.")
      );
  } catch (error) {
    throw new ApiError(500, "Something was wrong while updating playlist.");
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
