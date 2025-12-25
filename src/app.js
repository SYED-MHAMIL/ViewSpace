import  express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()
app.use(cors("*"))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true,limit: "16kb"}))
app.use("api/uploads",express.static("uploads"))
app.use(cookieParser())
// erro midldwe weware



export default  app