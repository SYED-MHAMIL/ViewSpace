import { Schema,model } from "mongoose"



const watchEvent = Schema({
    historyId: { type : Schema.Types.ObjectId, ref:"WatchHistory"}, 
    videoId: {type : Schema.Types.ObjectId, ref : "Video"}
     
},{
    timestamps: {
        createdAt: 'watchedAt'
    }
})

export const WatchEvent = model("WatchEvent",watchEvent)
