// Reaction
import { Reaction } from "../models/videoReaction.models.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiEror.js";
// reaction on video
const likedVideo = async (req, res) => {
  const session =await mongoose.startSession() // start session
  try {
    let { videoId } = req.params;
    
    videoId = new mongoose.Types.ObjectId(videoId);
    session.startTransaction()
    const video =  await Video.findOne({_id:videoId},null,{session});
    const _id = req.user
    if (!video) {
        throw new ApiError(404,"Video does not exits")
    }
    const reaction = await Reaction.findOne({ videoId, likedby: _id },null,{session});
   
  // if there is no reaction 
  if (!reaction) {
    console.log("added the react document ");
    
     await Reaction.create([{
      videoId,
      likedby: _id,
      reaction : 1
    }],{session})

    await Video.findOneAndUpdate({_id:videoId},{$inc:{liked:1}},{session} );
    await session.commitTransaction();
    return {
      liked: 1,
    };
  }

  // toggleOff
  if (reaction?.reaction == 1) {

     await Reaction.deleteOne({ videoId, likedby: _id }).session(session),
     await  Video.findOneAndUpdate({_id:videoId},{$inc:{liked:-1}}).session(session)
     await session.commitTransaction();
   


     return {
      liked: -1,
    };
  }

  // switch unlike to  liked
  reaction.reaction = 1;
  await Video.findOneAndUpdate({_id:videoId},{$inc:{liked:1,unliked:-1}},{session}),
  await reaction.save({session})  
  
  return {
    liked: 1,
  };

  } catch (error) {
    await session.abortTransaction()  
    throw new ApiError(404,"liked video does not work",error)
  }finally{
    await session.endSession()
  }
  
};

const unlikedVideo = async (req, res) => {
   const session =await mongoose.startSession() // start session
   try {
     let { videoId } = req.params;
  
    videoId = new mongoose.Types.ObjectId(videoId);
    session.startTransaction()
    const video =  await Video.findOne({_id:videoId},null,{session});
    const _id = req.user;
    if (!video) {
        throw new ApiError(404,"Video does not exits")
    }
  const islikedVideo = await Reaction.findOne({ videoId, likedby: _id },null,{session});
  
  
  //  no -reaction --->  unlike
  if (!islikedVideo) {
  
    const likedvideo = await Reaction.create([{
      videoId,
      likedby: _id,
      reaction: -1,
      liked: 0,
    }],{session});
    
    await Video.findByIdAndUpdate(videoId,{$inc:{unliked:1}}).session(session)
    await session.commitTransaction()
    return {
      unliked: 1,
    };
  }
  //  toggleoff
  if (islikedVideo.reaction == -1) {

    await Reaction.deleteOne({ videoId, likedby: _id }).session(session);
    await Video.findByIdAndUpdate(videoId,{$inc:{unliked:-1}}).session(session)
    await session.commitTransaction()
    return {
      unliked: -1,
    };
  }

  //  switch from liked to unlike
  islikedVideo.reaction = -1 

  await islikedVideo.save({session});
  await Video.findByIdAndUpdate(videoId,{$inc:{unliked:1,liked:-1}}).session(session)

  await session.commitTransaction()
  
  return {
    unliked: 1,
  };
   } catch (error) {
       await session.abortTransaction()
       throw new ApiError(404,"unliked video does not work",error)    
   }
   finally{
       await session.endSession()
   }
};



export default {
  likedVideo,
  unlikedVideo,
};
