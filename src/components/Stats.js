import Modal from "react-modal";
import React from "react";
import { customStyles } from "../styles/styles";
import PropTypes from "prop-types";

const Stats = ({ openStatsModal, setOpenStatsModal, statsObj }) => {
  const { gamesPlayed, gamesWon, currentStreak, maxStreak } = statsObj;
  return (
    <Modal
      isOpen={openStatsModal}
      onRequestClose={() => setOpenStatsModal(false)}
      style={customStyles}>
      <div style={customStyles.spaceBetween}>
        <span style={{ marginTop: "8px", fontSize: "16px" }}>Stats</span>
        <button className="btn" onClick={() => setOpenStatsModal(false)}>
          <i className="fa fa-close"></i>
        </button>
      </div>
      <h3>{`Played: ${gamesPlayed}`}</h3>
      <h3>{`Won: ${gamesWon}`}</h3>
      <h3>{`Current Streak: ${
        currentStreak ? currentStreak : gamesPlayed === gamesWon && gamesWon === 1 ? 1 : 0
      }`}</h3>
      <h3>{`Max Streak: ${
        maxStreak ? maxStreak : gamesPlayed === gamesWon && gamesWon === 1 ? 1 : 0
      }`}</h3>
    </Modal>
  );
};

Stats.propTypes = {
  openStatsModal: PropTypes.bool,
  setOpenStatsModal: PropTypes.func,
  statsObj: PropTypes.object
};

export default Stats;
