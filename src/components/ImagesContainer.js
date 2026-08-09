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
    <div className="w-full space-y-4 lg:space-y-5">
      {/* Image Display - Large and prominent */}
      <div className="image-container shadow-2xl dark:shadow-2xl rounded-2xl overflow-hidden">
        <img
          alt="Movie clue"
          className="images-container-img mx-auto w-auto object-contain h-[78vh] lg:h-[92vh] max-h-[98vh]"
          src={
            buttonLogic
              ? buildImageUrl(currentIndexFromButton)
              : buildImageUrl(currentIndexFromStorage)
          }
        />
      </div>

      {/* Clue Counter - Better spacing */}
      <div className="flex justify-center items-center gap-2 lg:gap-3 flex-wrap px-2">
        {range(
          0,
          gameStatus !== GAME_STATUS.COMPLETED ? currentIndexFromStorage : MAX_ATTEMPTS
        ).map((index) => {
          const isActive =
            index + 1 === (buttonLogic ? currentIndexFromButton : currentIndexFromStorage);
          return (
            <button
              key={index}
              onClick={() => {
                setCurrentIndexFromButton(index + 1);
                setButtonLogic(true);
              }}
              className={`rounded-lg px-3 py-2 lg:px-4 lg:py-2.5 font-bold transition-all duration-300 transform hover:scale-110 text-sm lg:text-base shadow-md ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-110"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:shadow-md hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}>
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="text-center text-slate-600 dark:text-slate-400 text-sm lg:text-base font-semibold">
        <span>
          Clue {buttonLogic ? currentIndexFromButton : currentIndexFromStorage} of{" "}
          {gameStatus !== GAME_STATUS.COMPLETED ? currentIndexFromStorage : MAX_ATTEMPTS}
        </span>
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
