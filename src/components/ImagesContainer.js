import range from "lodash/range";
import React from "react";
import { customStyles } from "../styles/styles";
import PropTypes from "prop-types";

const ImagesContainer = ({
  buttonLogic,
  setButtonLogic,
  currentIndexFromButton,
  currentIndexFromStorage,
  setCurrentIndexFromButton
}) => {
  //eslint-disable-next-line react/prop-types
  return (
    <div className="searchbox-container">
      <img
        alt=""
        className="movie-frame"
        src={
          buttonLogic
            ? `${currentIndexFromButton.toString()}.png`
            : `${currentIndexFromStorage.toString()}.png`
        }
        width="100%"
        height="100%"
      />
      <div className="searchbox-container guess-box" style={customStyles.marginTop}>
        {range(0, currentIndexFromStorage).map((index) => {
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
  setCurrentIndexFromButton: PropTypes.func
};

export default ImagesContainer;
