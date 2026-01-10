
import mongoose, { Schema } from "mongoose";
const VideoSchema =new Schema({
           owner: { type: Schema.Types.ObjectId, ref: 'User' } ,
            videoFile :{
                type: String,
                required: true,

            },
            thumbnail :{
                type: String,
                required: true,

            },
            title :{
                type: String,
                required: true,

            },
            description :{
                type: String,
                required: true,

            },
            duration :{
                type: Number,
                required: true,
            },
            views: {
                type: Number,
                required: true,
                default :0 
            },
            isPublished: {
                type: String,
                required: true,  
                default :true
            }

},{timestamps:true})

export  const  Video =  mongoose.model("Video",VideoSchema)