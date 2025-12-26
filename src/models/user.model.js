import mongoose, { Schema } from "mongoose";
const UserSchema =new Schema({
           watchHistory: [{ type: Schema.Types.ObjectId, ref: 'Videos' }] ,
           username :{
               type: String,
               unique: true,
               required: true,
               lowercase : true,
               trim: true,
               index: true
           },
           email : {
               type: String,
               unique: true,
               required: true,
               lowercase : true,
               trim: true,
           },
           fullname:{
              type: String,
               unique: true,
               required: true,
               lowercase : true,
            
           },
           avatar : {
             type: String,
            //    unique: true,
               required: true,
           },
           coverImage : {
              type: String,
        //    unique: true,
              required: true,
           },
           refreshToken : {
              type: String,
        //    unique: true,
              required: true,
           },
           password : {
                type : String,
                 required : true
           }

},{timestamps:true})

export  const  User =  mongoose.model("User",UserSchema)