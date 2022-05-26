import React from "react";
import { customStyles } from "../styles/styles";
import range from "lodash/range";
import PropTypes from "prop-types";
import { MOVIE_NAME } from "../utils/constants";

const Results = ({ currentGuesses, gameStatus, currentIndex }) => {
  const allGuesses = currentGuesses !== "" ? currentGuesses.split(",") : [];

  return (
    <div className="searchbox-container" style={customStyles.column}>
      {allGuesses.map((allGuess) => {
        return (
          <div key={allGuess} style={customStyles.row}>
            <span role="img" aria-label="Error">
              &#10060;
            </span>
            <span key={allGuess} style={{ ...customStyles.marginLeft, color: "white" }}>
              {allGuess}
            </span>
          </div>
        );
      })}
      {gameStatus === "running" && (
        <span style={{ ...customStyles.marginTop, color: "white" }}>{`You got ${
          6 - currentIndex
        } guesses remaining`}</span>
      )}
      {gameStatus === "completed" && (
        <span
          style={{
            ...customStyles.marginTop,
            color: "white"
          }}>{`You got it - The answer was ${MOVIE_NAME}`}</span>
      )}
      {gameStatus === "failed" && (
        <span
          style={{
            ...customStyles.marginTop,
            color: "white"
          }}>{`The answer was ${MOVIE_NAME}`}</span>
      )}
      <div id="share" style={{ ...customStyles.row, width: "1.2em", height: "1.2em" }}>
        {range(1, currentIndex).map((index) => {
          return (
            <img
              key={index}
              style={customStyles.marginRight}
              src="https://abs-0.twimg.com/emoji/v2/svg/1f7e5.svg"
              alt=""
            />
          );
        })}
        {gameStatus === "completed" && (
          <img
            style={customStyles.marginRight}
            src="https://abs-0.twimg.com/emoji/v2/svg/1f7e9.svg"
            alt=""
          />
        )}
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
