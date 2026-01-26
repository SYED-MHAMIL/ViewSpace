import { WatchEvent } from "../models/watchEvent.model.js"
import { ApiError } from "../utils/ApiEror.js";
import {getTodayRange} from "../utils/getTodayRange.js"

const watchEvent = async (historyId,session) => {
     try {
         const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
         console.log("history", historyId);
   
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
         }
       ).session(session);


        console.log("dupleecate envet ", isDuplicateEvent);
        
   
       if (!isDuplicateEvent) {
         await WatchEvent.create({
           historyId,
           watchedAt: new Date(),
         },{session})

        console.log("dupleecate envet ", isDuplicateEvent);

       }
        console.log(" done  gratete  sdfa");
        
       
     } catch (error) {
        throw new ApiError(404,"does not watch event")
     }

  }

export {watchEvent}