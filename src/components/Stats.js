import Modal from "react-modal";
import React from "react";
import PropTypes from "prop-types";
import { MAX_ATTEMPTS } from "../utils/constants";
import { range } from "lodash";

const Stats = ({ openStatsModal, setOpenStatsModal, statsObj, guessData }) => {
  const { gamesPlayed, gamesWon, currentStreak, maxStreak } = statsObj;
  const sum = Object.keys(guessData).reduce((acc, val) => acc + guessData[val], 0);

  const getGraphWidth = (index) => {
    const percent = guessData[index + 1] !== 0 ? (guessData[index + 1] / sum) * 100 : 0;
    return Math.round(percent);
  };

  const guessBars = Object.keys(guessData).map((key, ind) => getGraphWidth(ind));
  return (
    <Modal
      isOpen={openStatsModal}
      onRequestClose={() => setOpenStatsModal(false)}
      ariaHideApp={false}
      className="w-90 md:w-1/3 lg:w-1/4 border-2 dark:border-primary border-gray-300/50 rounded bg-slate-200 dark:bg-primary text-primary dark:text-secondary p-5 text-xl top-[25%]"
      style={{
        content: {
          position: "absolute",
          top: "50%",
          right: "50%",
          transform: "translate(50%,-50%)"
        }
      }}>
      <div className="flex mb-2">
        <h4 className="text-2xl w-11/12">Stats</h4>
        <button onClick={() => setOpenStatsModal(false)}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="flex justify-around mb-6 text-primary dark:text-secondary">
        <div className="flex flex-col items-center">
          <span className="py-2 px-3 border border-yellow-400 bg-yellow-400 rounded">
            {gamesPlayed}
          </span>
          <span className="text-sm mt-1">Played</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="py-2 px-3 border border-green-500 bg-green-500 rounded">{gamesWon}</span>
          <span className="text-sm mt-1">Won</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="py-2 px-3 border border-blue-400 bg-blue-400 rounded">
            {gamesPlayed > 0 ? ((gamesWon / gamesPlayed) * 100).toFixed(2) : 0}
          </span>
          <span className="text-sm mt-1">Win %</span>
        </div>
      </div>
      <div className="flex justify-around mb-6">
        <div className="flex flex-col items-center justify-center">
          <span className="text-2xl">
            {currentStreak ? currentStreak : gamesPlayed === gamesWon && gamesWon === 1 ? 1 : 0} 🔥
          </span>
          <span className="text-sm font-normal">Current Streak</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-2xl">
            {maxStreak ? maxStreak : gamesPlayed === gamesWon && gamesWon === 1 ? 1 : 0} 💪
          </span>
          <span className="text-sm font-normal">Max Streak</span>
        </div>
      </div>
      <h4 className="text-2xl mb-3">Guess distribution</h4>
      <div className="">
        {range(0, MAX_ATTEMPTS).map(function (_, index) {
          return (
            <div key={index} className="flex my-2 w-full items-center">
              <div className="">{index + 1}</div>{" "}
              <div className="flex h-6 w-11/12 ml-3">
                <div
                  className={`bg-blue-500 border border-blue-500 rounded-sm max-w-82 ${
                    guessData[index + 1] ? "animate-progress" : ""
                  }`}
                  style={{
                    width: `${guessBars[index]}` + "%"
                  }}></div>
                <span className="ml-2 text-base font-normal">{guessBars[index]} %</span>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

Stats.propTypes = {
  openStatsModal: PropTypes.bool,
  setOpenStatsModal: PropTypes.func,
  statsObj: PropTypes.object,
  guessData: PropTypes.object,
  shareText: PropTypes.string,
  setShareText: PropTypes.func,
  currentIndex: PropTypes.number,
  gameStatus: PropTypes.string,
  dayCount: PropTypes.number,
  isTimeTravelled: PropTypes.bool
};

export default Stats;
