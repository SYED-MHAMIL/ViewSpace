import {ApiError} from "../utils/ApiEror.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
const  addVideo  = async (req,res) => {
    const {videoFile,thumbnail,title,description} = req?.body
    console.log("videoFile",videoFile);
    
    if (!videoFile) {
        throw  new ApiError(406,"Video is required")
    }

    const uploadedCloudinary = await uploadOnCloudinary(videoFile)
    console.log("uploaded video on",uploadedCloudinary);
          
}


export default {addVideo}