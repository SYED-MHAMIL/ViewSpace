import { Router } from "express";
import videoControllers from "../controllers/video.controllers.js";
const videoRouter = Router()

videoRouter.post('/addvideo', videoControllers.addVideo)


export {videoRouter}