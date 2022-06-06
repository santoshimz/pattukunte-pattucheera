import Modal from "react-modal";
import React from "react";
import { customStyles } from "../styles/styles";
import PropTypes from "prop-types";
import closeIcon from "../assets/close.svg";

const Stats = ({ openStatsModal, setOpenStatsModal, statsObj }) => {
  const { gamesPlayed, gamesWon, currentStreak, maxStreak } = statsObj;
  return (
    <Modal
      isOpen={openStatsModal}
      onRequestClose={() => setOpenStatsModal(false)}
      style={customStyles}>
      <div className="stats-header" style={customStyles.spaceBetween}>
        <h4 className="stats" style={{ marginTop: "8px" }}>
          Statistics
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
    </Modal>
  );
};

Stats.propTypes = {
  openStatsModal: PropTypes.bool,
  setOpenStatsModal: PropTypes.func,
  statsObj: PropTypes.object
};

export default Stats;
