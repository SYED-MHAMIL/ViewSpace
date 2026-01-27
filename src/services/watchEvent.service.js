import { WatchEvent } from "../models/watchEvent.model.js"
import { ApiError } from "../utils/ApiEror.js";
import {getTodayRange} from "../utils/getTodayRange.js"

const watchEvent = async (historyId,session) => {
     try {
         const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
         
      const nowUtc = new Date()
       const { start, end } = getTodayRange(nowUtc, userTimezone);
       const isDuplicateEvent = await WatchEvent.findOneAndUpdate(
         {
           historyId,
           watchedAt: { $gte: start, $lte: end },
         },
         {
           watchedAt: nowUtc,
         },
         {
           new: true,
         },
         { upsert: true }
       ).session(session);        
   
       if (!isDuplicateEvent) {
         await WatchEvent.create([{
           historyId,
           watchedAt: new Date(),
         }],{session})
       }
        
       
     } catch (error) {
        throw new ApiError(404,"does not watch event")
     }

  }

export {watchEvent}