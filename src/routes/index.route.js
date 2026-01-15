import { Router } from "express";
import { userRoute } from "./user.route.js";
import { videoRouter } from "./video.route.js";
import { subscriptionRouter } from "./subscription.route.js";

const  router= Router()

router.use("/auth", userRoute)
router.use("/video",videoRouter)
router.use("/subscription",subscriptionRouter)

export {router}


