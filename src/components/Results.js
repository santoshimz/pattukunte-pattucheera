import React, { useMemo } from "react";
import range from "lodash/range";
import PropTypes from "prop-types";
import { GAME_STATUS } from "../utils/constants";

const Results = ({
  currentGuesses,
  gameStatus,
  currentIndex,
  movie,
  contributor,
  contributorTwitterId,
  gameFinished
}) => {
  const allGuesses = currentGuesses !== "" ? currentGuesses.split(",") : [];
  const gameSuccess = useMemo(() => gameStatus === GAME_STATUS.COMPLETED, [gameStatus]);
  const gameFailed = useMemo(() => gameStatus === GAME_STATUS.FAILED, [gameStatus]);
  const gameRunning = useMemo(() => gameStatus === GAME_STATUS.RUNNING, [gameStatus]);
  const getTwitterProfile = (twitterId) => {
    return (
      <a
        className="text-blue-500 underline"
        onClick={() => window.gtag("event", "checking-contributor", { event_category: "misc" })}
        href={"https://twitter.com/" + cleanTwitterId(twitterId)}>
        @{cleanTwitterId(twitterId)}
      </a>
    );
  };

  const cleanTwitterId = (id) => {
    return id.replaceAll("@", "");
  };

  return (
    <div className="text-center text-primary dark:text-secondary">
      <div>
        {gameRunning && (
          <span className="block my-3">
            You got{" "}
            <strong
              className={`text-lg ${
                6 - currentIndex >= 4
                  ? "text-green-500"
                  : 6 - currentIndex === 3
                  ? "text-orange-500"
                  : 6 - currentIndex < 3
                  ? "text-red-500"
                  : null
              }`}>
              {6 - currentIndex}
            </strong>{" "}
            guesses remaining out of <strong className="text-lg text-green-500">5</strong>.
          </span>
        )}
        {gameSuccess && (
          <span className="text-lg">
            You got it - The answer was
            <span className="text-green-600"> {movie}</span>
          </span>
        )}
        {gameFailed && (
          <span className="text-lg">
            The answer was
            <span className="text-green-500"> {movie}</span>
          </span>
        )}
        <div className="justify-center" id="share">
          {range(1, currentIndex).map(() => {
            return (
              <span key={Math.random() * 100}>
                <i className="fa-solid fa-square-xmark text-red-600 text-3xl mr-2"></i>
              </span>
            );
          })}
          {gameSuccess && (
            <span className="text-green-600 text-3xl">
              <i className="fa-solid fa-square-check"></i>
            </span>
          )}
          {gameFailed && (
            <span className="text-red-600 text-3xl">
              <i className="fa-solid fa-square-xmark"></i>
            </span>
          )}
        </div>
      </div>
      {allGuesses.map((allGuess, index) => {
        return (
          <div
            className="mx-auto my-3 flex items-center border-2 border-red-600 rounded w-72 py-0.5"
            key={index}>
            <span className="text-red-600 text-xl ml-3">
              <i className="fa-regular fa-circle-xmark"></i>
            </span>
            <span className="ml-3">{allGuess}</span>
          </div>
        );
      })}
      {gameSuccess && (
        <div className="mx-auto my-3 flex items-center border-2 border-green-600 rounded w-72 py-0.5">
          <span className="text-green-500 text-xl ml-3">
            <i className="fa-regular fa-circle-check"></i>
          </span>
          <span className="ml-3">{movie}</span>
        </div>
      )}
      {(contributor || contributorTwitterId) && gameFinished && (
        <small className="block text-center text-primary dark:text-secondary">
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
  contributorTwitterId: PropTypes.string,
  gameFinished: PropTypes.bool
};

export default Results;
