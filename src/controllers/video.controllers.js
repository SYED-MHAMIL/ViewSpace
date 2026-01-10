import videoService from "../services/video.service.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const  addVideo  = AsyncHandler(async (req,res) => {
     const video   = await videoService.addVideo(req,res)
   return  res.status(202).json(
          new ApiResponse(202,video,"Added the video successfully")
     )
})


export default  {addVideo}