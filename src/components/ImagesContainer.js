import range from "lodash/range";
import React from "react";
import PropTypes from "prop-types";
import { GAME_STATUS, isProduction, MAX_ATTEMPTS } from "../utils/constants";

const ImagesContainer = ({
  buttonLogic,
  setButtonLogic,
  currentIndexFromButton,
  currentIndexFromStorage,
  setCurrentIndexFromButton,
  gameStatus,
  dayCount
}) => {
  //eslint-disable-next-line react/prop-types

  const buildImageUrl = (index) =>
    `${process.env.REACT_APP_CDN_URL}${
      isProduction() ? "/" + dayCount : ""
    }/${index.toString()}.jpg`;

  return (
    <div className="w-full">
      <img
        alt=""
        className="w-11/12 md:w-4/12 mx-auto my-0"
        src={
          buttonLogic
            ? buildImageUrl(currentIndexFromButton)
            : buildImageUrl(currentIndexFromStorage)
        }
      />
      <div className="text-secondary flex justify-center items-center my-3">
        {range(
          0,
          gameStatus !== GAME_STATUS.COMPLETED ? currentIndexFromStorage : MAX_ATTEMPTS
        ).map((index) => {
          return (
            <button
              key={index}
              onClick={() => {
                setCurrentIndexFromButton(index + 1);
                setButtonLogic(true);
              }}
              className={
                "rounded-sm px-2.5 py-1.5 mx-1 " +
                (index + 1 === (buttonLogic ? currentIndexFromButton : currentIndexFromStorage)
                  ? "bg-gray-600 border-gray-600 text-secondary"
                  : "border-slate-200 bg-slate-200 text-primary")
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
  gameStatus: PropTypes.string,
  dayCount: PropTypes.number
};

export default ImagesContainer;
