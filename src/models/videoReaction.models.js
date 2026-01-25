import { model, Schema } from "mongoose";

const reaction  =  Schema({
     videoId: {
         type  : Schema.Types.ObjectId,
         ref: "Video",
         required : true     
        },  
     likedby: {
           type  : Schema.Types.ObjectId,
            ref: "User" ,
         required : true     
    },
     reaction:{
        type: Number,
        enum: [1,-1],
        default: true
    }


})

export const Reaction = model("Reaction",reaction)