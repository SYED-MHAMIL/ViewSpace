import { model, Schema } from "mongoose";

const reaction  =  Schema({
     videoId: {
         type  : Schema.Types.ObjectId,
         ref: "Video"
     },
     liked: {
        type : Number,
        default : 0 
     },
     unliked:  {
        type : Number,
        default : 0 
     },
     likedby: {
           type  : Schema.Types.ObjectId,
            ref: "User"      
    },
     commentId :{
         type  : Schema.Types.ObjectId,
         ref: "Comment"
    },  
    tweetId : {
         type  : Schema.Types.ObjectId,
         ref: "Tweet"
            
    }
    
})

export const Reaction = model("Reaction",reaction)