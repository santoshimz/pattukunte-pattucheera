import Modal from "react-modal";
import React from "react";
import { customStyles } from "../styles/styles";
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
      style={customStyles}>
      <div className="stats-header" style={customStyles.spaceBetween}>
        <h4 className="stats" style={{ marginTop: "8px" }}>
          Stats
        </h4>
        <button className="btn modal-close" onClick={() => setOpenStatsModal(false)}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="data-props">
        <div className="data-group">
          <span className="data-value total-played">{gamesPlayed}</span>
          <span className="data-item">Played</span>
        </div>
        <div className="data-group">
          <span className="data-value won">{gamesWon}</span>
          <span className="data-item">Won</span>
        </div>
        <div className="data-group">
          <span className="data-value">
            {gamesPlayed > 0 ? ((gamesWon / gamesPlayed) * 100).toFixed(2) : 0}
          </span>
          <span className="data-item">Win %</span>
        </div>
      </div>
      <div className="data-props">
        <div className="data-group">
          <span className="data-value">
            {currentStreak ? currentStreak : gamesPlayed === gamesWon && gamesWon === 1 ? 1 : 0} 🔥
          </span>
          <span className="data-item">Current Streak</span>
        </div>
        <div className="data-group">
          <span className="data-value">
            {maxStreak ? maxStreak : gamesPlayed === gamesWon && gamesWon === 1 ? 1 : 0} 💪
          </span>
          <span className="data-item">Max Streak</span>
        </div>
      </div>
      <h4 className="stats stats-header guess-graph">Guess distribution</h4>
      <div className="graph-wrapper" style={customStyles.marginTop}>
        {range(0, MAX_ATTEMPTS).map(function (_, index) {
          return (
            <div key={index} className="guess-data">
              <div className="guess-index">{index + 1}</div>{" "}
              <div className="guess-bar d-flex">
                <div
                  className={`graph-fill ${guessData[index + 1] ? "" : "default-graph-width"}`}
                  style={{
                    width: `${guessBars[index]}` + "%"
                  }}></div>
                <span className="ml-2">{guessBars[index]}%</span>
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
