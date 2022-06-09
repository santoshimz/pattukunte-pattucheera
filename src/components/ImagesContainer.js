import range from "lodash/range";
import React from "react";
import { customStyles } from "../styles/styles";
import PropTypes from "prop-types";
import { GAME_STATUS, getDayCount, MAX_ATTEMPTS, s3Bucket } from "../utils/constants";

const ImagesContainer = ({
  buttonLogic,
  setButtonLogic,
  currentIndexFromButton,
  currentIndexFromStorage,
  setCurrentIndexFromButton,
  gameStatus
}) => {
  //eslint-disable-next-line react/prop-types
  return (
    <div className="searchbox-container">
      <img
        alt=""
        className="movie-frame"
        src={
          buttonLogic
            ? `${s3Bucket}/${getDayCount()}/${currentIndexFromButton.toString()}.jpg`
            : `${s3Bucket}/${getDayCount()}/${currentIndexFromStorage.toString()}.jpg`
        }
        width="100%"
        height="100%"
      />
      <div className="searchbox-container guess-box" style={customStyles.marginTop}>
        {range(
          0,
          gameStatus !== GAME_STATUS.COMPLETED ? currentIndexFromStorage : MAX_ATTEMPTS
        ).map((index) => {
          return (
            <button
              key={index}
              style={{ ...customStyles.marginLeft }}
              onClick={() => {
                setCurrentIndexFromButton(index + 1);
                setButtonLogic(true);
              }}
              className={
                buttonLogic
                  ? index + 1 === currentIndexFromButton
                    ? "current-movie-frame"
                    : ""
                  : index + 1 === currentIndexFromStorage
                  ? "current-movie-frame"
                  : ""
              }>
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

ImagesContainer.propTypes = {
  buttonLogic: PropTypes.bool,
  setButtonLogic: PropTypes.func,
  currentIndexFromButton: PropTypes.number,
  currentIndexFromStorage: PropTypes.number,
  setCurrentIndexFromButton: PropTypes.func,
  gameStatus: PropTypes.string
};

export default ImagesContainer;
