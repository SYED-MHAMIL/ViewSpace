import { Schema,model } from "mongoose"



const watchEvent = Schema({
    historyId: { type : Schema.Types.ObjectId, ref:"WatchHistory"}, 
     watchedAt : {
        type: Date,
        default: Date.now
     }
})

export const WatchEvent = model("WatchEvent",watchEvent)
