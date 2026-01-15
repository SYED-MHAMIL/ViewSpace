import { Router } from "express";
import videoControllers from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const videoRouter = Router()

videoRouter.post('/addvideo',verifyUser,upload.fields([
    {name : "videoFile" , maxCount :1},
    {name : "thumbnail", maxCount: 1}
]) ,videoControllers.addVideo)
videoRouter.get('/getAllVideo', videoControllers.getAllVideo)
videoRouter.get('/getOneVideo/:videoId', videoControllers.getOneVideo)
videoRouter.post('/updateVideoinfo/:videoId', upload.single("thumbnail"),videoControllers.updateVideoinfo)
videoRouter.post('/toggleIsPublishedVideo/:videoId', videoControllers.toggleIsPublishedVideo)
videoRouter.delete('/deleteVideo/:videoId',videoControllers.deleteVideo)

export {videoRouter}    