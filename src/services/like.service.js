import { Reaction } from "../models/like.models.js";
import { Video } from "../models/video.model.js";

// reaction on video
const likedVideo = async (req, res) => {
  const { videoId } = req.params;
  const { _id } = req.user;

  const reaction = await Reaction.findOne({ videoId, likedby: _id });
  // if there is no reaction 
  
  if (!reaction) {
    const [likedvideo,updatedVideo] = Promise.all([Reaction.create({
      videoId,
      likedby: _id,
      liked: 1,
      unliked: 0,
    }),Video.findByIdAndDelete({_id:videoId},{$inc:{liked:1}})]);
    return {
      liked: 1,
    };
  }

  // toggleOff
  if (reaction?.liked == 1) {
      Promise.all([
      Reaction.deleteOne({ videoId, likedby: _id }),
      Video.findByIdAndDelete({_id:videoId},{$inc:{liked:-1}})
     ]);

     return {
      liked: -1,
    };
  }

  // switch unlike to  liked
  reaction.liked = 1;
  reaction.unliked = 0;
  
   Promise.all([Video.findByIdAndDelete({_id:videoId},{$inc:{liked:1,unliked:-1}}),reaction.save()])

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

// reaction on comment
const likedComment = async (req, res) => {
  const { commentId } = req.params;
  const { _id } = req.user;

  const commentReaction = await Reaction.findOne({ commentId, likedby: _id });
  if (!commentReaction) {
    await Reaction.create({
      commentId,
      likedby: _id,
      liked: 1,
      unliked: 0,
    });
    return {
      liked: 1,
    };
  }

  // toggleOff
  if (commentReaction?.liked == 1) {
    await Reaction.deleteOne({ commentId, likedby: _id });
    return {
      liked: -1,
    };
  }

  // switch unlike to  liked
  commentReaction.liked = 1;
  commentReaction.unliked = 0;
  await commentReaction.save();

  return {
    liked: 1,
  };
};

const unlikedComment = async (req, res) => {
  const { commentId } = req.params;
  const { _id } = req.user;

  const commentReaction = await Reaction.findOne({ commentId, likedby: _id });
  if (!commentReaction) {
    const likedcomment = await Reaction.create({
      videoId,
      likedby: _id,
      unliked: 1,
      liked: 0,
    });

    return {
      videoId: likedcomment.videoId,
      likedby: likedcomment.likedby,
      unliked: 1,
    };
  }
  //  toggleoff
  if (commentReaction.unliked == 1) {
    await Reaction.deleteOne({ commentId, likedby: _id });
    return {
      unliked: -1,
    };
  }

  //  switch from liked to unlike
  commentReaction.liked = 0;
  commentReaction.unliked = 1;
  await commentReaction.save();

  return {
    unliked: 1,
  };
};

// reaction on tweet
const likedTweet = async (req, res) => {
  const { tweetId } = req.params;
  const { _id } = req.user;

  const tweetReaction = await Reaction.findOne({ tweetId, likedby: _id });
  if (!tweetReaction) {
    await Reaction.create({
      tweetId,
      likedby: _id,
      liked: 1,
      unliked: 0,
    });
    return {
      liked: 1,
    };
  }

  // toggleOff
  if (tweetReaction?.liked == 1) {
    await Reaction.deleteOne({ tweetId, likedby: _id });
    return {
      liked: -1,
    };
  }

  // switch unlike to  liked
  tweetReaction.liked = 1;
  tweetReaction.unliked = 0;
  await tweetReaction.save();

  return {
    liked: 1,
  };
};

const unlikedTweet = async (req, res) => {
  const { tweetId } = req.params;
  const { _id } = req.user;

  const tweetReaction = await Reaction.findOne({ tweetId, likedby: _id });
  if (!tweetReaction) {
    await Reaction.create({
      tweetId,
      likedby: _id,
      unliked: 1,
      liked: 0,
    });

    return {
      unliked: 1,
    };
  }
  //  toggleoff
  if (tweetReaction.unliked == 1) {
    await Reaction.deleteOne({ tweetId, likedby: _id });
    return {
      unliked: 1,
    };
  }

  //  switch from liked to unlike
  tweetReaction.liked = 0;
  tweetReaction.unliked = 1;
  await tweetReaction.save();

  return {
    unliked: 1,
  };
};

export default {
  likedVideo,
  unlikedVideo,
  likedComment,
  unlikedComment,
  likedTweet,
  unlikedTweet,
};
