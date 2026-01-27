import { WatchHistory } from "../models/watchHistory.model.js"

const getHistory = async (videoId,userId,session) => {
    console.log("userid  in history " , userId);
    

    // TODO 
    // check alreawdy hisdoy
    // no so ceratee hsitory 
    // if  yes so uppdate the history  
     let nowUtc = new Date()
     const history = await WatchHistory.findOneAndUpdate(
      { userId,videoId},
      { $inc: { watchCount: 1 }, lastWatchedAt: nowUtc },
      { new: true, upsert: true },

    ).session(session);

    return history

}


export {getHistory}