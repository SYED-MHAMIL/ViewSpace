import { Schema,model } from "mongoose"



const watchEvent = Schema({
    historyId: { type : Schema.Types.ObjectId, ref:"WatchHistory"}, 
     watchedAt : {
        type: Date,
        default: Date.now,
        required :true
     }
})

watchEvent.index(
  { historyId: 1, watchedDate: 1 },
  { unique: true }
);


export const WatchEvent = model("WatchEvent",watchEvent)
