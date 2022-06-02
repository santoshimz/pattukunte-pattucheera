import React, { useState, useEffect } from "react";

const NextGameTimer = () => {
  const [diff, setDiff] = useState({ days: "--", hours: "--", minutes: "--", seconds: "--" });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = getTimeDifference(
        new Date(`${getNextGameDate().toISOString().split("T")[0]}T00:00:14.000Z`)
      );
      if (diff.hours === 0 && diff.minutes === 0 && diff.seconds === 0) {
        window.location.reload();
      }
      setDiff(diff);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  function getTimeDifference(date) {
    var now = new Date();
    var dateNow = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      )
    );
    var diffSeconds = (date.getTime() - dateNow.getTime()) / 1000;
    const days = Math.floor(diffSeconds / (24 * 60 * 60));
    const hours = Math.floor((diffSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((diffSeconds % (60 * 60)) / 60);
    const seconds = Math.floor(diffSeconds % 60);
    return { days: days, hours: hours, minutes: minutes, seconds: seconds };
  }

  function getNextGameDate() {
    let today = new Date();
    let todayInUTC = new Date(`${today.toISOString().split("T")[0]}T00:00:14.000Z`);
    const todayDiff = getTimeDifference(todayInUTC);
    if (todayDiff.hours < 0) {
      today.setDate(today.getDate() + 1);
      return new Date(`${today.toISOString().split("T")[0]}T00:00:14.000Z`);
    }
    return todayInUTC;
  }
  return (
    <div className="timer">
      <span>Next Movie in</span>
      <div>
        <span className="counter">{diff.hours} hrs</span>:
        <span className="counter">{diff.minutes} mins</span>:
        <span className="counter"> {diff.seconds} secs</span>
      </div>
    </div>
  );
};

NextGameTimer.propTypes = {};

export default NextGameTimer;
