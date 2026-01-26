// Reaction
import { Reaction } from "../models/videoReaction.models.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiEror.js";
// reaction on video
const likedVideo = async (req, res) => {
  const session =mongoose.startSession() // start session
  try {
    const { videoId } = req.params;
    const reaction = await Reaction.findOne({ videoId, likedby: _id });
  const { _id } = req.user;

   await session.startTransaction()
  
  // if there is no reaction 
  if (!reaction) {
    await session.startTransaction()

     await Reaction.create({
      videoId,
      likedby: _id,
      reaction : 1
    },{session})
    await Video.findByIdAndDelete({_id:videoId},{$inc:{liked:1}},{session} );
    await session.commitTransaction();
    await session.endSession()
    return {
      liked: 1,
    };
  }

  // toggleOff
  if (reaction?.reaction == 1) {
    await session.startTransaction()
     await Reaction.deleteOne({ videoId, likedby: _id }).session(session),
     await  Video.findByIdAndDelete({_id:videoId},{$inc:{liked:-1}}).session(session)
     await session.commitTransaction();
     session.endSession()


     return {
      liked: -1,
    };
  }

  // switch unlike to  liked
  reaction.reaction = 1;
  await Video.findByIdAndDelete({_id:videoId},{$inc:{liked:1,unliked:-1}},{session}),
  await reaction.save({session})  
  session.endSession()
  return {
    liked: 1,
  };
  } catch (error) {
    session.abortTransaction()  
    throw new ApiError(404,"liked video does not work")
  }finally{
    session.abortTransaction()
  }
  
};

const unlikedVideo = async (req, res) => {
   const session =mongoose.startSession() // start session
   try {
     const { videoId } = req.params;
  const { _id } = req.user;
  const islikedVideo = await Reaction.findOne({ videoId, likedby: _id });
   await session.startTransaction()
  
  //  no -reaction --->  unlike
  if (!islikedVideo) {
     await session.startTransaction()
    const likedvideo = await Reaction.create({
      videoId,
      likedby: _id,
      reaction: 1,
      liked: 0,
    },{session});
    
    await Video.findByIdAndUpdate(videoId,{$inc:{unliked:1}}).session(session)
    await session.commitTransaction()
    return {
      videoId: likedvideo.videoId,
      likedby: likedvideo.likedby,
      unliked: 1,
    };
  }
  //  toggleoff
  if (likedVideo.reaction == -1) {
    await session.startTransaction()
    await Reaction.deleteOne({ videoId, likedby: _id }).session(session);
    await Video.findByIdAndUpdate(videoId,{$inc:{unliked:-1}}).session(session)
    await session.commitTransaction()
    return {
      unliked: -1,
    };
  }

  //  switch from liked to unlike
  likedVideo.reaction = -1 

  await likedVideo.save({session});
  await Video.findByIdAndUpdate(videoId,{$inc:{unliked:1,liked:-1}}).session(session)

  await session.commitTransaction()
  
  return {
    unliked: 1,
  };
   } catch (error) {
       throw new ApiError(404,"unliked video does not work")    
   }
   finally{
       session.abortTransaction()
   }
};



export default {
  likedVideo,
  unlikedVideo,
};
