import videoService from "../services/video.service.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const  addVideo  = AsyncHandler(async (req,res) => {
     const video   = await videoService.addVideo(req,res)
   return  res.status(202).json(
          new ApiResponse(202,video,"Added the video successfully")
     )
})

const  getAllVideo = AsyncHandler(async (req,res) => {
     const video   = await videoService.getAllVideo(req,res)
   return  res.status(202).json(
          new ApiResponse(202,video,"Yoy Got the all video successfully")
     )
})

const  getOneVideo = AsyncHandler(async (req,res) => {
     const video   = await videoService.getOneVideo(req,res)
   return  res.status(202).json(
          new ApiResponse(202,video,"Got the video successfully")
     )
})


const  updateVideoinfo = AsyncHandler(async (req,res) => {
     const video   = await videoService.updateVideoinfo(req,res)
   return  res.status(202).json(
          new ApiResponse(202,video,"video updated successfully")
     )
})


const  toggleIsPublishedVideo = AsyncHandler(async (req,res) => {
     const video   = await videoService.toggleIsPublishedVideo(req,res)
   return  res.status(202).json(
          new ApiResponse(202,video,"video toggle successfully")
     )
})

const  deleteVideo = AsyncHandler(async (req,res) => {
     const video   = await videoService.deleteVideo(req,res)
   return  res.status(202).json(
          new ApiResponse(202,video,"video deleted successfully")
     )
})


export default  {addVideo,getAllVideo,getOneVideo,updateVideoinfo,toggleIsPublishedVideo,deleteVideo}