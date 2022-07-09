/* eslint-disable react/jsx-key */
import Modal from "react-modal";
import React from "react";
import { customStyles } from "../styles/styles";
import PropTypes from "prop-types";
import closeIcon from "../assets/close.svg";
import { MAX_ATTEMPTS } from "../utils/constants";
import { range } from "lodash";
import ShareButton from "./ShareButton";
import NextGameTimer from "./NextGameTimer";

const Stats = ({
  openStatsModal,
  setOpenStatsModal,
  statsObj,
  guessData,
  shareText,
  setShareText,
  currentIndex,
  gameStatus,
  dayCount,
  isTimeTravelled
}) => {
  const { gamesPlayed, gamesWon, currentStreak, maxStreak } = statsObj;
  const sum = Object.keys(guessData).reduce((acc, val) => acc + guessData[val], 0);
  const DEFAULT_GRAPH_WIDTH = 7;
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
          <img className="close-icon" src={closeIcon} alt="close" />
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
            {currentStreak ? currentStreak : gamesPlayed === gamesWon && gamesWon === 1 ? 1 : 0}
          </span>
          <span className="data-item">Current Streak</span>
        </div>
        <div className="data-group">
          <span className="data-value">
            {maxStreak ? maxStreak : gamesPlayed === gamesWon && gamesWon === 1 ? 1 : 0}
          </span>
          <span className="data-item">Max Streak</span>
        </div>
      </div>
      <h4 className="stats stats-header guess-graph">Guess distribution</h4>
      <div className="graph-wrapper" style={customStyles.marginTop}>
        {range(0, MAX_ATTEMPTS).map(function (_, index) {
          return (
            <div className="guess-data">
              <div className="guess-index">{index + 1}</div>{" "}
              <div className="guess-bar">
                <div
                  className={`graph-fill ${guessData[index + 1] ? "" : "default-graph-width"}`}
                  style={{
                    width: `${
                      guessData[index + 1] !== 0
                        ? (guessData[index + 1] / sum) * 100
                        : DEFAULT_GRAPH_WIDTH
                    }%`
                  }}>
                  {guessData[index + 1]}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="d-flex justify-content-around p-1">
        <NextGameTimer className="text-black" />
        <ShareButton
          shareText={shareText}
          setShareText={setShareText}
          currentIndex={currentIndex}
          gameStatus={gameStatus}
          dayCount={dayCount}
          isTimeTravelled={isTimeTravelled}
        />
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
