import Modal from "react-modal";
import React from "react";
import { customStyles } from "../styles/styles";
import PropTypes from "prop-types";
import gtmDark48 from "../assets/guess-the-meme-icons/gtmDark48.png";
const RulesModal = ({ openNewGamesModal, setOpenNewGamesModal }) => {
  return (
    <Modal
      isOpen={openNewGamesModal}
      onRequestClose={() => setOpenNewGamesModal(false)}
      style={{ ...customStyles }}>
      <div className="rules-header" style={customStyles.spaceBetween}>
        <h3 className="rules" style={{ marginTop: "8px" }}>
          Loved Pattukunte Pattucheera ?
        </h3>
        <button className="btn modal-close" onClick={() => setOpenNewGamesModal(false)}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="d-flex flex-column px-3">
        <h5 className="w-100 mb-2">Try new games here!!!</h5>
        <div className="guess-the-meme d-flex">
          <img src={gtmDark48} alt="" />
          <a
            className="ml-3 d-flex align-items-center"
            href="https://guess-the-meme.vercel.app/"
            rel="noreferrer"
            target="_blank"
            style={{ fontSize: "1.5rem" }}>
            Guess The Meme
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
              open_in_new
            </span>
          </a>
        </div>
      </div>
    </Modal>
  );
};

RulesModal.propTypes = {
  openNewGamesModal: PropTypes.bool,
  setOpenNewGamesModal: PropTypes.func
};

export default RulesModal;
