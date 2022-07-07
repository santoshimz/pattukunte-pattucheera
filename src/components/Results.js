import React from "react";
import { customStyles } from "../styles/styles";
import range from "lodash/range";
import PropTypes from "prop-types";
import { GAME_STATUS } from "../utils/constants";

const Results = ({ currentGuesses, gameStatus, currentIndex, movie, contributor }) => {
  const allGuesses = currentGuesses !== "" ? currentGuesses.split(",") : [];

  return (
    <div className="searchbox-container" style={customStyles.column}>
      <div className="text-center">
        {gameStatus === GAME_STATUS.RUNNING && (
          <span style={{ ...customStyles.marginTop, color: "white" }}>{`You got ${
            6 - currentIndex
          } guesses remaining`}</span>
        )}
        {gameStatus === GAME_STATUS.COMPLETED && (
          <span
            className="fs-large"
            style={{
              ...customStyles.marginTop,
              color: "white"
            }}>
            You got it - The answer was
            <span className="color-lawngreen"> {movie}</span>
          </span>
        )}
        {gameStatus === GAME_STATUS.FAILED && (
          <span
            className="fs-large"
            style={{
              ...customStyles.marginTop,
              color: "white"
            }}>
            The answer was
            <span className="color-lawngreen"> {movie}</span>
          </span>
        )}
        <div
          className="mb-4 justify-content-center"
          id="share"
          style={{ ...customStyles.row, height: "1.2em" }}>
          {range(1, currentIndex).map(() => {
            // eslint-disable-next-line react/jsx-key
            return <span className="square red"></span>;
          })}
          {gameStatus === GAME_STATUS.COMPLETED && <span className="square green"></span>}
          {gameStatus === GAME_STATUS.FAILED && <span className="square red"></span>}
        </div>
      </div>
      {allGuesses.map((allGuess, index) => {
        return (
          <div className="m-auto guessed-movie wrong-guess" key={index} style={customStyles.row}>
            <span className="text-danger material-symbols-outlined">close</span>
            <span style={{ ...customStyles.marginLeft, color: "white" }}>{allGuess}</span>
          </div>
        );
      })}
      {gameStatus === GAME_STATUS.COMPLETED && (
        <div>
          <div className="m-auto guessed-movie correct-guess" style={customStyles.row}>
            <span className="color-lawngreen material-symbols-outlined">check_circle</span>
            <span style={{ ...customStyles.marginLeft, color: "white" }}>{movie}</span>
          </div>
        </div>
      )}

      {contributor &&
        (gameStatus === GAME_STATUS.COMPLETED || gameStatus === GAME_STATUS.FAILED) && (
          <small className="mt-4 text-center text-info">Contributed by @{contributor}</small>
        )}
    </div>
  );
};

Results.propTypes = {
  currentGuesses: PropTypes.string,
  gameStatus: PropTypes.string,
  currentIndex: PropTypes.number,
  movie: PropTypes.string,
  contributor: PropTypes.string
};

export default Results;
