import { DateTime } from "luxon";
// import { User } from "../models/user.model.js";
import { getHistory } from "./watchHistory.service.js"
import { watchEvent } from "./watchEvent.service.js"
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiEror.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";


// video service handler
const getAndRegisterView =async (videoId,userId,session) => {
  const video = await Video.findByIdAndUpdate(
    videoId,
    { $addToSet: { views: userId } },
    { new: true },
    { upsert: true }
  ).session(session);
  // if vidoeo doenot exits
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  return video
}

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

// get all video with pagination
const getAllVideo = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "asc",
    userId,
  } = req.query;

  const filter = {
    isPublished: true,
  };

  //  if query exits
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }
  filter.owner = userId;
  const sortOption = {
    [sortBy]: sortType === "asc" ? 1 : -1,
  };

  // skip that we have seen
  const skip = (Number(page) - 1) * Number(limit);

  const video = await Video.find(filter);
  // .sort(sortOption)
  // .skip(skip)
  // .limit(Number(limit));

  console.log("get all fetch video", video);

  if (!video || video.length === 0) {
    throw new ApiError(406, "field to get all video");
  }

  return video;
};


// get user reaction oon video
const getAllUserReaction =async (videoId) => {
   await Video.aggregate([
     {
       $match :{
          _id : videoId,
       }
     },
    //  TODO Tomooeor: 
    //  d
    //  {
      //  $lookup :{
    //       from : "videoreactions",
    //       localField: "_id",
    //       foreignField: "videoId",
    //       as: "likeReact",
    //       pipeline :[
    //         {
    //           $exp : {$eq : ["reaction",1]}
    //         }
    //       ]  
    //    }
    //  },
    //  {
    //   $addFields :{
    //      liked : {$cond : {if:'$likeReact.reaction' == 1,then:{$size: "$likeReact.reaction"}}}
    //   }
    //  }      
   ])
   


} 



const watchVideo = async (req, res) => {
  const session  =await mongoose.startSession()
 
  try {
     session.startTransaction()
     let {videoId} =req.params
     videoId =  new mongoose.Types.ObjectId(videoId)
     const {_id} =req.user
  
      const video = await getAndRegisterView(videoId,_id,session)
      const history = await getHistory(videoId,_id,session)
      await watchEvent(history._id,session)
      
      await session.commitTransaction()  
      return video
    } catch (error) {
    await session.abortTransaction()
      console.error("watchVideo error:", error);  // <-- log full error
    throw new ApiError(404," you can't watch the video ")

  }finally{
            await session.endSession()
  }
  


  // TODO: will do later on
  // enforcing DB-level uniqueness
  // handling race conditions
  // splitting this into services
  // history pagination like YouTube
};

const updateVideoinfo = async (req, res) => {
  const { title, description } = req?.body;
  const { videoId } = req.params;

  if ([title, description].some((val) => !val && val.trim() == "")) {
    throw new ApiError(406, "Title and description are both required");
  }

  let thumbnailPath = "";
  if (req?.file && req?.file?.path) {
    thumbnailPath = req?.file.path;
  }
  console.log("thumbnailPath", thumbnailPath);

  const uploadedCloudinary = await uploadOnCloudinary(thumbnailPath);
  if (!uploadedCloudinary) {
    throw new ApiError(406, "thumbnai is not saved in cloud");
  }

  const videoInfoUpdated = await Video.findByIdAndUpdate(
    { _id: videoId },
    { $set: { thumbnail: uploadedCloudinary.url, title, description } },
    { new: true }
  );

  if (!videoInfoUpdated) {
    throw new ApiError(406, "User does not have access");
  }

  return videoInfoUpdated;
};

const deleteVideo = async (req, res) => {
  const video = await Video.deleteOne({ _id: req?.params.videoId });
  if (!video) {
    throw new ApiError(406, "get all video");
  }

  return video;
};

const toggleIsPublishedVideo = async (req, res) => {
  const video = await Video.findById(req.params?.videoId);

  if (!video) {
    throw new ApiError(406, "failed video access");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return video;
};

export default {
  addVideo,
  getAllVideo,
  watchVideo,
  updateVideoinfo,
  deleteVideo,
  toggleIsPublishedVideo,
};
