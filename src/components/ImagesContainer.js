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
  return (
    <div className="searchbox-container" style={customStyles.marginBottom}>
      <img
        alt=""
        src={
          buttonLogic
            ? `${currentIndexFromButton.toString()}.png`
            : `${currentIndexFromStorage.toString()}.png`
        }
        width="100%"
        height="100%"
      />
      <div className="searchbox-container" style={customStyles.marginTop}>
        {range(0, currentIndexFromStorage).map((index) => {
          return (
            <button
              key={index}
              style={{ ...customStyles.marginLeft, ...customStyles.marginBottom }}
              onClick={() => {
                setCurrentIndexFromButton(index + 1);
                setButtonLogic(true);
              }}>
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
