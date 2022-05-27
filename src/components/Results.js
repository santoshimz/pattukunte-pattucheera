import React from "react";
import { customStyles } from "../styles/styles";
import range from "lodash/range";
import PropTypes from "prop-types";
import { greenSquare, MOVIE_NAME, redSquare } from "../utils/constants";

const Results = ({ currentGuesses, gameStatus, currentIndex }) => {
  const allGuesses = currentGuesses !== "" ? currentGuesses.split(",") : [];

  return (
    <div className="searchbox-container" style={customStyles.column}>
      {allGuesses.map((allGuess, index) => {
        return (
          <div className="guessed-movie" key={index} style={customStyles.row}>
            <span role="img" aria-label="Error">
              &#10060;
            </span>
            <span style={{ ...customStyles.marginLeft, color: "white" }}>{allGuess}</span>
          </div>
        );
      })}
      {gameStatus === "running" && (
        <span style={{ ...customStyles.marginTop, color: "white" }}>{`You got ${
          6 - currentIndex
        } guesses remaining`}</span>
      )}
      {gameStatus === "completed" && (
        <div>
          <div className="guessed-movie" style={customStyles.row}>
            <span role="img" aria-label="Error">
              ✅
            </span>
            <span style={{ ...customStyles.marginLeft, color: "white" }}>{MOVIE_NAME}</span>
          </div>
          <span
            style={{
              ...customStyles.marginTop,
              color: "white"
            }}>{`You got it - The answer was ${MOVIE_NAME}`}</span>
        </div>
      )}
      {gameStatus === "failed" && (
        <span
          style={{
            ...customStyles.marginTop,
            color: "white"
          }}>{`The answer was ${MOVIE_NAME}`}</span>
      )}
      <div id="share" style={{ ...customStyles.row, width: "1.2em", height: "1.2em" }}>
        {range(1, currentIndex).map(() => {
          // eslint-disable-next-line react/jsx-key
          return <span className="square">{`${redSquare}`}</span>;
        })}
        {gameStatus === "completed" && <span className="square">{`${greenSquare}`}</span>}
        {gameStatus === "failed" && <span className="square">{`${redSquare}`}</span>}
      </div>
    </div>
  );
};

Results.propTypes = {
  currentGuesses: PropTypes.string,
  gameStatus: PropTypes.string,
  currentIndex: PropTypes.number,
  movieName: PropTypes.string
};

export default Results;
