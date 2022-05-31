import Modal from "react-modal";
import React from "react";
import { customStyles } from "../styles/styles";
import PropTypes from "prop-types";
import closeIcon from "../assets/close.svg";
import imageIcon from "../assets/image.png";
import viewIcon from "../assets/view.png";
import numberFiveIcon from "../assets/number-five.png";
const RulesModal = ({ openRulesModal, setOpenRulesModal }) => {
  return (
    <Modal
      isOpen={openRulesModal}
      onRequestClose={() => setOpenRulesModal(false)}
      style={customStyles}>
      <div className="rules-header" style={customStyles.spaceBetween}>
        <h3 className="rules" style={{ marginTop: "8px" }}>
          How to Play ?
        </h3>
        <button className="btn modal-close" onClick={() => setOpenRulesModal(false)}>
          <img className="close-icon" src={closeIcon} alt="close" />
        </button>
      </div>
      <div className="rules">
        <p>
          <span>
            <img className="rule-icon" src={imageIcon} alt="close" />
          </span>
          <span>Use the image provided to guess the name of the movie.</span>
        </p>
        <p>
          <span>
            <img className="rule-icon" src={viewIcon} alt="close" />
          </span>
          <span>If you get a guess wrong a new image from the same movie is revealed.</span>
        </p>
        <p>
          <span>
            <img className="rule-icon chances" src={numberFiveIcon} alt="close" />
          </span>
          <span>You have five chances to guess the movie</span>
        </p>
      </div>
    </Modal>
  );
};

RulesModal.propTypes = {
  openRulesModal: PropTypes.bool,
  setOpenRulesModal: PropTypes.func
};

export default RulesModal;
