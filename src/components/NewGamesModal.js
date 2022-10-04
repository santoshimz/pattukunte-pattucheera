import Modal from "react-modal";
import React, { useCallback } from "react";
import { customStyles } from "../styles/styles";
import PropTypes from "prop-types";
import gtmDark48 from "../assets/guess-the-meme-icons/gtmDark48.png";
import { useNavigate } from "react-router-dom";

const NewGamesModal = ({ openNewGamesModal, setOpenNewGamesModal }) => {
  const navigate = useNavigate();
  return (
    <Modal
      isOpen={openNewGamesModal}
      ariaHideApp={false}
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
          <img src={gtmDark48} alt="" width="35" height="35" />
          <span
            className="ml-2 d-flex align-items-center"
            style={{ fontSize: "1.25rem", cursor: "pointer" }}
            onClick={useCallback(() => navigate("/gtm", { replace: false }), [navigate])}>
            Guess The Meme
          </span>
        </div>
      </div>
    </Modal>
  );
};

NewGamesModal.propTypes = {
  openNewGamesModal: PropTypes.bool,
  setOpenNewGamesModal: PropTypes.func
};

export default NewGamesModal;
