import { LikeVideo } from "../models/like.models.js";

const likedVideo = async (req, res) => {
  const { videoId } = req.params;
  const { _id } = req.user;

  const islikedVideo = await LikeVideo.findOne({ videoId, likedby: _id });
  if (!islikedVideo) {
    const likedvideo = await LikeVideo.create({
      videoId,
      likedby: _id,
      liked: 1,
    });


    return {
      videoId : likedvideo.videoId,
      likedby: likedvideo.likedby,
      liked: 1
    }

  }

     const removeLike = await LikeVideo.deleteOne({ videoId, likedby: _id });
     return {
        liked: -1
     }  
 




};
