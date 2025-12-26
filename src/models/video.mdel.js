import mongoose, { Schema } from "mongoose";
const VideoSchema =new Schema({
           owner: [{ type: Schema.Types.ObjectId, ref: 'Videos' }] ,
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
           },
           isPublished: {
               type: String,
               required: true,
 
           }

},{timestamps:true})

export  const  User =  mongoose.model("User",VideoSchema)