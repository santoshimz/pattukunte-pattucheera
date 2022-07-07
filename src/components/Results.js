import React from "react";
import { customStyles } from "../styles/styles";
import range from "lodash/range";
import PropTypes from "prop-types";
import { GAME_STATUS } from "../utils/constants";

const Results = ({
  currentGuesses,
  gameStatus,
  currentIndex,
  movie,
  contributor,
  contributorTwitterId
}) => {
  const allGuesses = currentGuesses !== "" ? currentGuesses.split(",") : [];

  const getTwitterProfile = (twitterId) => {
    return (
      <a className="text-info" href={"https://twitter.com/" + cleanTwitterId(twitterId)}>
        @{cleanTwitterId(twitterId)}
      </a>
    );
  };

  const cleanTwitterId = (id) => {
    return id.replaceAll("@", "");
  };

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
            <span className="text-red material-symbols-outlined">close</span>
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
      {(contributor || contributorTwitterId) &&
        (gameStatus === GAME_STATUS.COMPLETED || gameStatus === GAME_STATUS.FAILED) && (
          <small className="mt-4 text-center text-white">
            Contributed by &nbsp;
            {!contributorTwitterId ? "@" + contributor : getTwitterProfile(contributorTwitterId)}
          </small>
        )}
    </div>
  );
};

Results.propTypes = {
  currentGuesses: PropTypes.string,
  gameStatus: PropTypes.string,
  currentIndex: PropTypes.number,
  movie: PropTypes.string,
  contributor: PropTypes.string,
  contributorTwitterId: PropTypes.string
};

export default Results;
