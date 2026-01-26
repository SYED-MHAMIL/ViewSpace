function getTodayRange(nowUtc, timeZone) {
  const userNow = DateTime.fromJSDate(nowUtc, { zone: "utc" }).setZone(
    timeZone
  );
  const startOfToday = userNow.startOf("day").toUTC().toJSDate();

  const endOfToday = userNow.endOf("day").toUTC().toJSDate();

  return { start: startOfToday, end: endOfToday };
}

export  {getTodayRange}