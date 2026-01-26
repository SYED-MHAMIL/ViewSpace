import { ApiError } from "./ApiEror.js";
import { DateTime } from "luxon";
function getTodayRange(nowUtc, timeZone) {
  try {
      const userNow = DateTime.fromJSDate(nowUtc, { zone: "utc" }).setZone(
    timeZone
  );
  const startOfToday = userNow.startOf("day").toUTC().toJSDate();

  const endOfToday = userNow.endOf("day").toUTC().toJSDate();

  return { start: startOfToday, end: endOfToday };

  } catch (error) {
       throw new ApiError(404," today range error")    
  }
}

export  {getTodayRange}