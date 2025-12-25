import app from "./src/app.js";
import ConnectDB from "./src/db/index.js";
import dotenv from "dotenv";
dotenv.config({
    path:"./.env"
})
ConnectDB().then(
    ()=>{
         app.listen(process.env.PORT || 8000,()=>{
            console.log(`PORT is running on :${process.env.PORT}`);    
         })
    }
).catch((err)=>{
            console.log("MONGO db connection failed !!! ", err);

})