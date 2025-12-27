import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiEror";
import fs from "fs"
cloudinary.config({ 
  cloud_name: process.env?.CLOUDINARY_CLOUD_NAME , 
  api_key: process.env?.CLOUDINARY_API_KEY, 
  api_secret: process.env?.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary =async (fileURL)=>{
     
    try {
        if (!fileURL) {
         throw new ApiError(403,"file is required!")
        
        }
        const response = await cloudinary.v2.uploader.upload(fileURL,{
            resource_type: "auto"
        })
  
        console.log("file upload successfully ",response?.url);
        return response
    } catch (error) {
        //  throw new ApiError(404,"Cloudinary file Upload  Error !", error)
        fs.unlinkSync(fileURL)
    
    }
  }


