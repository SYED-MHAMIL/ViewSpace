import { Router } from "express";
import videoReactionController from "../controllers/videoReaction.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const videoReactionRouter =Router()

videoReactionRouter.post("/liked/:videoId",verifyUser,videoReactionController.likedVideo)
videoReactionRouter.post("/unliked/:videoId",verifyUser,videoReactionController.unlikedVideo)



export {videoReactionRouter}