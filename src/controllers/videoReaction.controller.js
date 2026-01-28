import videoReactionService from "../services/videoReaction.service.js";
import {AsyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const likedVideo =AsyncHandler(
    async (req,res) => {
      const reaction =await videoReactionService.likedVideo(req,res);
      return res.status(202).json(
        new ApiResponse(202,reaction,"Reaction successfully")
      )   
    }
)

const unlikedVideo =AsyncHandler(
    async (req,res) => {
      const reaction =await videoReactionService.unlikedVideo(req,res);
      return res.status(202).json(
        new ApiResponse(202,reaction,"Reaction successfully")
      )   
    }
)

export default {likedVideo,unlikedVideo}