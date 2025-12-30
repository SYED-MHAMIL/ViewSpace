import  express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { ApiError } from "./utils/ApiEror.js"
import { ApiResponse } from "./utils/ApiResponse.js"
import { router } from "./routes/index.route.js"


const app = express()
app.use(cors("*"))
app.use("/api/uploads", express.static("uploads"))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true,limit: "16kb"}))
app.use(cookieParser())

//    platforfm middel ware


app.use("/api",router)




// erro midldwe weware

const  erorrHandler =(err, req, res, next)=>{
    console.log("erorrHandler",err);
    
    if (err instanceof ApiError) {
        return res?.status(err?.statuscode).json(
            new ApiResponse(err?.statuscode,null,err.message)
        )
    }
    return  res.status(500).json(
            new ApiResponse(500,null,"Internal Server Issue")
        )
    
}


app.use(erorrHandler)


export default  app