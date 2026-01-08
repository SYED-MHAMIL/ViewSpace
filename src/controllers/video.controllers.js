import videoService from "../services/video.service.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"

const  addVideo  = AsyncHandler(async (req,res) => {
     await videoService.addVideo(req,res)
})


export default  {addVideo}