import { WatchHistory } from "../models/watchHistory.model.js"

const getHistory = async (videoId,userId,session) => {
    // TODO 
    // check alreawdy hisdoy
    // no so ceratee hsitory 
    // if  yes so uppdate the history  
     let nowUtc = new Date()
     const history = await WatchHistory.findOneAndUpdate(
      { userId,videoId },
      { $inc: { watchCount: 1 }, lastWatchedAt: nowUtc },
      { new: true }
    ).session(session);
   
    if(!history){
        const history = await WatchHistory.create({ userId,videoId,watchCount:1,lastWatchedAt: nowUtc},{session})         
        return  history
    }

    return history

}


export {getHistory}