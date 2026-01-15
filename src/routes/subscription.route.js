import { Router } from "express";
import subscriptipnController from "../controllers/subscriptipn.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router()

subscriptionRouter.post("/subscribertoggle/:channelId",verifyUser,subscriptipnController.toggleSubscribtion)

subscriptionRouter.post("/subscribedchannel/:subscriberId",subscriptipnController.getSubscribedChannels)


subscriptionRouter.post("/subscriber/:channelId",subscriptipnController.getUserChannelSubscribers)

export {subscriptionRouter}