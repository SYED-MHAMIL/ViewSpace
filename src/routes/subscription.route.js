import { Router } from "express";
import subscriptipnController from "../controllers/subscriptipn.controller";
import { verifyUser } from "../middlewares/auth.middleware";

const subscriptionRouter = Router()

subscriptionRouter.post("/subscribetoggle/:channelId",verifyUser,asubscriptipnController.toggleSubscribtion)

subscriptionRouter.post("/subscribedchannel/:subscriberId",subscriptipnController.getSubscribedChannels)


subscriptionRouter.post("/subscriber/:channelId",subscriptipnController.getUserChannelSubscribers)

export {subscriptionRouter}