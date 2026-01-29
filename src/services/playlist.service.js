import { Playlist } from "../models/playlists.model.js";
import { ApiError } from "../utils/ApiEror.js";

const addPlaylist = async (req, res) => {
  if (!(req?.body && req?.body?.tittle)) {
    throw new ApiError(409, "Tittle is required");
  }

  if (!(req?.user && req?.body?._id)) {
    throw new ApiError(409, "Login User is required");
  }

  if (!(req?.params && req?.params?.videoId)) {
    throw new ApiError(409, "video is required");
  }

  const playlists = await Playlist.create({
    tittle,
    userId: _id,
    videos: videoId,
  });

  return playlists;
};

const addVideoInPlaylists = async (req, res) => {
  let playlistId = "";
  if (!(req?.params && req?.params?.playlistId)) {
    throw new ApiError(409, "video is required");
  }
  playlistId = req.params?.playlistId;

  let videoId = "";
  if (!(req?.params && req?.params?.videoId)) {
    throw new ApiError(409, "video is required");
  }
  videoId = req.params?.videoId;

  const playlists = await Playlist.findByIdAndUpdate(
    {
      _id: playlistId,
    },
    {
      $addToSet: { videos: videoId },
    },
    {
      new: true,
    }
  );

  return playlists;
};


export default {addPlaylist,addVideoInPlaylists}