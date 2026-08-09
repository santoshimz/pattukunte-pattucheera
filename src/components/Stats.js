import Modal from "react-modal";
import React from "react";
import PropTypes from "prop-types";
import { MAX_ATTEMPTS } from "../utils/constants";
import { range } from "lodash";

const Stats = ({ openStatsModal, setOpenStatsModal, statsObj, guessData }) => {
  const { gamesPlayed, gamesWon, currentStreak, maxStreak } = statsObj;
  const sum = Object.keys(guessData).reduce((acc, val) => acc + guessData[val], 0);
  const winPercentage = gamesPlayed > 0 ? ((gamesWon / gamesPlayed) * 100).toFixed(2) : 0;

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
      className="modern-modal p-8 max-w-xl"
      style={{
        content: {
          position: "absolute",
          top: "50%",
          right: "50%",
          transform: "translate(50%,-50%)"
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)"
        }
      }}>
      {/* Modal Header */}
      <div className="modal-header">
        <h3 className="modal-title">📊 Your Stats</h3>
        <button
          onClick={() => setOpenStatsModal(false)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-4 lg:gap-5 mb-8 lg:mb-10">
        <div className="stat-box bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-amber-900/30 dark:to-yellow-900/30 p-4 lg:p-5">
          <div className="stat-value text-3xl lg:text-4xl text-yellow-600 dark:text-yellow-400">
            {gamesPlayed}
          </div>
          <div className="stat-label text-sm lg:text-base">Played</div>
        </div>
        <div className="stat-box bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-4 lg:p-5">
          <div className="stat-value text-3xl lg:text-4xl text-green-600 dark:text-green-400">
            {gamesWon}
          </div>
          <div className="stat-label text-sm lg:text-base">Won</div>
        </div>
        <div className="stat-box bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 lg:p-5">
          <div className="stat-value text-3xl lg:text-4xl text-blue-600 dark:text-blue-400">
            {winPercentage}%
          </div>
          <div className="stat-label text-sm lg:text-base">Win Rate</div>
        </div>
      </div>

      {/* Streaks */}
      <div className="grid grid-cols-2 gap-4 lg:gap-5 mb-8 lg:mb-10">
        <div className="stat-box bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-2 border-red-200 dark:border-red-800 p-4 lg:p-5">
          <div className="text-4xl lg:text-5xl mb-3 lg:mb-4">🔥</div>
          <div className="stat-value text-3xl lg:text-4xl text-red-600 dark:text-red-400">
            {currentStreak ? currentStreak : gamesPlayed === gamesWon && gamesWon === 1 ? 1 : 0}
          </div>
          <div className="stat-label text-sm lg:text-base">Current Streak</div>
        </div>
        <div className="stat-box bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border-2 border-purple-200 dark:border-purple-800 p-4 lg:p-5">
          <div className="text-4xl lg:text-5xl mb-3 lg:mb-4">💪</div>
          <div className="stat-value text-3xl lg:text-4xl text-purple-600 dark:text-purple-400">
            {maxStreak ? maxStreak : gamesPlayed === gamesWon && gamesWon === 1 ? 1 : 0}
          </div>
          <div className="stat-label text-sm lg:text-base">Max Streak</div>
        </div>
      </div>

      {/* Guess Distribution */}
      <div>
        <h4 className="text-lg lg:text-xl font-bold mb-5 lg:mb-6 text-slate-900 dark:text-slate-100">
          📈 Guess Distribution
        </h4>
        <div className="space-y-4 lg:space-y-5">
          {range(0, MAX_ATTEMPTS).map(function (_, index) {
            const percent = guessBars[index];
            const count = guessData[index + 1];
            return (
              <div key={index} className="flex items-center gap-4 lg:gap-5">
                {/* Attempt Number */}
                <div className="font-bold text-lg lg:text-xl text-slate-700 dark:text-slate-300 min-w-max w-8 text-center">
                  {index + 1}
                </div>
                {/* Progress Bar Container */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-9 lg:h-10 overflow-hidden">
                    {percent > 0 && (
                      <div
                        className={`progress-bar h-full flex items-center justify-center text-white text-xs lg:text-sm font-bold ${
                          count ? "animate-progress" : ""
                        }`}
                        style={{
                          width: `${percent}%`
                        }}>
                        {percent > 15 && <span>{percent}%</span>}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold text-lg lg:text-xl text-slate-700 dark:text-slate-300 min-w-fit w-10 text-right">
                    {percent > 0 ? `${percent}%` : "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
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
