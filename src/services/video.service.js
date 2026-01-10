import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiEror.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// add the video
const addVideo = async (req, res) => {
  const { title, description } = req?.body;

  if (!req?.user) {
    throw new ApiError(406, "Unaughorized User");
  }

  if ([title, description].some((val) => !val || val.trim() == "")) {
    throw new ApiError(406, "All fields are required");
  }

  let videoFile = "";
  if (req?.files && req.files.videoFile && req.files.videoFile[0]?.path) {
    videoFile = req.files.videoFile[0]?.path;
  }

  let thumbnail = "";
  if (req?.files && req?.files?.thumbnail && req?.files?.thumbnail[0].path) {
    thumbnail = req?.files?.thumbnail[0].path;
  }
  if (!videoFile) {
    throw new ApiError(406, "Video is required");
  }
  const uploadedCloudinary = await uploadOnCloudinary(videoFile);
  if (!uploadedCloudinary) {
    throw new ApiError(406, "Video is not saved in cloudinary");
  }

  //  for thumnail

  if (!thumbnail) {
    throw new ApiError(406, "thumbnail is required");
  }
  const uploadedthumbnailCloudinary = await uploadOnCloudinary(thumbnail);
  if (!uploadedthumbnailCloudinary) {
    throw new ApiError(406, "thumbnail is not saved in cloudinary");
  }

  const video = await new Video({
    videoFile: uploadedCloudinary?.url,
    thumbnail: uploadedthumbnailCloudinary?.url,
    title,
    owner: req.user?._id,
    description,
    duration: uploadedCloudinary?.duration,
  });

  if (!video) {
    throw new ApiError(406, "video  is not saved");
  }

  await video.save();
  return video;
};

export default { addVideo };
