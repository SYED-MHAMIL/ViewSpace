import { model, Schema } from "mongoose";


const watchHistory =  Schema({
    userId:   {
         type :  Schema.Types.ObjectId,
         ref : "User"
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video"
   },
   watchCount: {
       type :Number,
       default:  0
   },
   progress : {
     type : Number,
     default : 0 
   },
   lastWatchedAt : {
    type :Date ,
    default: Date.now
   }

}
)


export  const WatchHistory  = model("WatchHistory",watchHistory)