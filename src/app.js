import  express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { ApiError } from "./utils/ApiEror"
import { ApiResponse } from "./utils/ApiResponse"


const app = express()
app.use(cors("*"))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true,limit: "16kb"}))
app.use("api/uploads",express.static("uploads"))
app.use(cookieParser())

// erro midldwe weware

const  erorrHandler = (err,req,res,next)=>{
    if (err instanceof ApiError) {
        res.status(err.statuscode).json(
            new ApiResponse(err.statuscode,null,err.message)
        )
    } else {
         res.status(404).json(
            new ApiResponse(404,null,"Internal Server Issue")
        )
    }
}


app.use(erorrHandler)


export default  app