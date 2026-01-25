// Reaction
import { Reaction } from "../models/videoReaction.models.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
// reaction on video
const likedVideo = async (req, res) => {
  const { videoId } = req.params;
  const { _id } = req.user;

  const reaction = await Reaction.findOne({ videoId, likedby: _id });
   const session =mongoose.startSession() // start session
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
  if (reaction?.liked == 1) {
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
  reaction.liked = 1;
  reaction.unliked = 0;
  
  await Video.findByIdAndDelete({_id:videoId},{$inc:{liked:1,unliked:-1}},{session}),
  await reaction.save({session})  
  session.endSession()
  return {
    liked: 1,
  };
};

const unlikedVideo = async (req, res) => {
  const { videoId } = req.params;
  const { _id } = req.user;

  const islikedVideo = await Reaction.findOne({ videoId, likedby: _id });
  if (!islikedVideo) {
    const likedvideo = await Reaction.create({
      videoId,
      likedby: _id,
      unliked: 1,
      liked: 0,
    });

    return {
      videoId: likedvideo.videoId,
      likedby: likedvideo.likedby,
      unliked: 1,
    };
  }
  //  toggleoff
  if (likedVideo.unliked == 1) {
    await Reaction.deleteOne({ videoId, likedby: _id });
    return {
      unliked: -1,
    };
  }

  //  switch from liked to unlike
  likedVideo.liked = 0;
  likedVideo.unliked = 1;
  await likedVideo.save();

  return {
    unliked: 1,
  };
};



export default {
  likedVideo,
  unlikedVideo,

};
