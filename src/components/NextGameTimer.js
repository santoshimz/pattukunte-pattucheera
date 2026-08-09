import React, { useState, useEffect } from "react";
import { getDateTimeInUTC, getTimeDifference } from "../utils/constants";
const NextGameTimer = () => {
  const [diff, setDiff] = useState({ days: "--", hours: "--", minutes: "--", seconds: "--" });

  useEffect(() => {
    const interval = setInterval(() => {
      const nextGameDate = getNextGameDate();
      const diff = getTimeDifference(nextGameDate, getDateTimeInUTC(new Date()));
      if (diff.hours === 0 && diff.minutes === 0 && diff.seconds === 0) {
        window.location.reload();
      }
      setDiff(diff);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function getNextGameDate() {
    let today = new Date();
    let todayInUTC = new Date(`${today.toISOString().split("T")[0]}T18:30:00.000Z`);
    const todayDiff = getTimeDifference(todayInUTC, getDateTimeInUTC(new Date()));
    if (todayDiff.hours < 0) {
      today.setDate(today.getDate() + 1);
      return new Date(`${today.toISOString().split("T")[0]}T18:30:00.000Z`);
    }
    return todayInUTC;
  }
  return (
    <div className="text-center">
      <p className="text-sm lg:text-base uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4 lg:mb-5 font-semibold">
        Next Level
      </p>
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 lg:p-5 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
          <div className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {diff.hours}
          </div>
          <div className="text-xs lg:text-sm text-slate-600 dark:text-slate-400 uppercase font-semibold tracking-wide">
            hours
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 lg:p-5 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
          <div className="text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {diff.minutes}
          </div>
          <div className="text-xs lg:text-sm text-slate-600 dark:text-slate-400 uppercase font-semibold tracking-wide">
            minutes
          </div>
        </div>
        <div className="bg-pink-50 dark:bg-pink-900/30 rounded-lg p-4 lg:p-5 border border-pink-200 dark:border-pink-800 hover:shadow-lg transition-shadow">
          <div className="text-3xl lg:text-4xl font-bold text-pink-600 dark:text-pink-400 mb-1">
            {diff.seconds}
          </div>
          <div className="text-xs lg:text-sm text-slate-600 dark:text-slate-400 uppercase font-semibold tracking-wide">
            seconds
          </div>
        </div>
      </div>
    </div>
  );
};

NextGameTimer.propTypes = {};

export default NextGameTimer;
