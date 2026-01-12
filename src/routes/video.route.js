import { Router } from "express";
import videoControllers from "../controllers/video.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const videoRouter = Router()

videoRouter.post('/addvideo',verifyUser,upload.fields([
    {name : "videoFile" , maxCount :1},
    {name : "thumbnail", maxCount: 1}
]) ,videoControllers.addVideo)
videoRouter.get('/getAllVideo',verifyUser, videoControllers.getAllVideo)
videoRouter.get('/getOneVideo/:videoId', videoControllers.getOneVideo)
videoRouter.post('/ /:videoId', upload.single("thumbnail"),videoControllers.updateVideoinfo)
videoRouter.post('/toggleIsPublishedVideo/:videoId', videoControllers.toggleIsPublishedVideo)
videoRouter.post('/deleteVideo/:videoId', videoControllers.deleteVideo)

export {videoRouter}    