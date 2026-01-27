import { model, Schema } from "mongoose";


const watchHistory =  Schema({
    userId:{
         type :Schema.Types.ObjectId,
         ref : "User",
         required :true
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required :true
   },
   watchCount: {
       type :Number,
       default:  0,
       required :true
   },
   progress : {
     type : Number,
     default : 0 
   },
   lastWatchedAt : {
    type :Date ,
    default: Date.now,
    required :true
   }

}
)
watchHistory.index(
  { userId: 1, videoId: 1 },
  { unique: true }
);



export  const WatchHistory  = model("WatchHistory",watchHistory)