import React, { useState, useEffect } from "react";
import { getDateTimeInUTC, getTimeDifference } from "../utils/constants";
import PropTypes from "prop-types";
const NextGameTimer = ({ theme }) => {
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
    <div className="timer" style={{ color: theme === "dark" ? "white" : "black" }}>
      <span>Next Movie in</span>
      <div>
        <span className="counter">{diff.hours} hrs</span>:
        <span className="counter">{diff.minutes} mins</span>:
        <span className="counter"> {diff.seconds} secs</span>
      </div>
    </div>
  );
};

NextGameTimer.propTypes = {
  theme: PropTypes.string
};

export default NextGameTimer;
