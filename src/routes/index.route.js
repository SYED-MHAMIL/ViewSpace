import { Router } from "express";
import { userRoute } from "./user.route.js";

const  router= Router()

router.use("/auth", userRoute)


export {router}