import userController from "../controllers/user.controller.js";
import {upload} from  "../middlewares/multer.middleware.js"
import { Router } from "express";

const  userRoute =  Router()
userRoute.post("/register",
    upload.fields([{name: "Avatar", maxCount :1 },{name: "CoverImage", maxCount :1 }]),
    userController.registerUser)

export   {userRoute}