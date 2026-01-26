import { WatchHistory } from "../models/watchHistory.model.js"

const getHistory = async (videoId,userId) => {
    // TODO 
    // check alreawdy hisdoy
    // no so ceratee hsitory 
    // if  yes so uppdate the history  
     let nowUtc = new Date()
     const history = await WatchHistory.findOneAndUpdate(
      { userId,videoId },
      { $inc: { watchCount: 1 }, lastWatchedAt: nowUtc },
      { new: true }
    );
   
    if(!history){
        await WatchHistory.create({ userId,videoId,watchCount:1,lastWatchedAt: nowUtc })
         
    }

}