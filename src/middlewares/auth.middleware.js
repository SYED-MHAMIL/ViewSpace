import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiEror.js"
import jwt from "jsonwebtoken"
const verifyUser = async (req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("bearer ","")
        if (!token) {
            throw new ApiError(408,"Unauthorized request")
        }
        const decodedUser =  jwt.verify(token,process.env?.ACCESS_TOKEN_KEY)
        if (!decodedUser) {
            throw new ApiError(408,"Unauthorized token")
        }
    
        const user =await User.findById(decodedUser._id)
        if (!user) {
            
            throw new ApiError(408,"Invalid Access token")
        }
        
        req.user =user
        next()
    } catch (error) {
       throw new ApiError(400,error?.message)
    }
}

export {verifyUser}