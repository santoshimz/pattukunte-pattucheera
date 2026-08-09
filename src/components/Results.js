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
    <div className="text-slate-900 dark:text-slate-100 space-y-3 lg:space-y-4">
      {/* Status Bar */}
      {gameRunning && (
        <div className="card p-4 lg:p-5 text-center">
          <div className="flex justify-center items-center gap-3 lg:gap-4">
            <span className="text-sm lg:text-base uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold">
              Remaining:
            </span>
            <span
              className={`text-3xl lg:text-4xl font-black ${
                6 - currentIndex >= 4
                  ? "text-green-500"
                  : 6 - currentIndex === 3
                  ? "text-amber-500"
                  : 6 - currentIndex < 3
                  ? "text-red-500"
                  : null
              }`}>
              {6 - currentIndex}
            </span>
            <span className="text-sm lg:text-base text-slate-600 dark:text-slate-400 font-semibold">
              / 5
            </span>
          </div>
        </div>
      )}

      {gameSuccess && (
        <div className="card p-4 lg:p-5 text-center">
          <p className="text-base lg:text-lg font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 lg:mb-3">
            🎉 You Got It!
          </p>
          <p className="text-2xl lg:text-3xl font-black text-green-500">{movie}</p>
        </div>
      )}

      {gameFailed && (
        <div className="card p-4 lg:p-5 text-center">
          <p className="text-base lg:text-lg font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 lg:mb-3">
            The Answer Was
          </p>
          <p className="text-2xl lg:text-3xl font-black text-green-500">{movie}</p>
        </div>
      )}

      {/* Result Icons */}
      <div
        className="flex justify-center items-center gap-2 lg:gap-3 text-2xl lg:text-4xl py-2 lg:py-3"
        id="share">
        {range(1, currentIndex).map(() => (
          <span
            key={Math.random() * 100}
            className="transform hover:scale-110 transition-transform">
            <i className="fa-solid fa-square-xmark text-red-500"></i>
          </span>
        ))}
        {gameSuccess && (
          <span className="transform hover:scale-110 transition-transform text-green-500 text-3xl lg:text-5xl">
            <i className="fa-solid fa-square-check"></i>
          </span>
        )}
        {gameFailed && (
          <span className="transform hover:scale-110 transition-transform text-red-500 text-3xl lg:text-5xl">
            <i className="fa-solid fa-square-xmark"></i>
          </span>
        )}
      </div>

      {/* Guesses List */}
      {allGuesses.length > 0 && (
        <div className="space-y-2 lg:space-y-3">
          {allGuesses.map((allGuess, index) => (
            <div key={index} className="result-item incorrect max-w-md mx-auto py-3 px-4">
              <span className="text-red-500 text-base lg:text-lg mr-3">
                <i className="fa-regular fa-circle-xmark"></i>
              </span>
              <span className="text-sm lg:text-base font-semibold text-slate-700 dark:text-slate-200">
                {allGuess}
              </span>
            </div>
          ))}
        </div>
      )}

      {gameSuccess && (
        <div className="result-item correct max-w-md mx-auto py-3 px-4">
          <span className="text-green-500 text-base lg:text-lg mr-3">
            <i className="fa-regular fa-circle-check"></i>
          </span>
          <span className="text-sm lg:text-base font-semibold text-green-700 dark:text-green-300">
            {movie}
          </span>
        </div>
      )}

      {/* Contributor */}
      {(contributor || contributorTwitterId) && gameFinished && (
        <div className="text-center pt-3 lg:pt-4 border-t border-slate-200 dark:border-slate-700 text-xs lg:text-sm">
          <p className="text-slate-600 dark:text-slate-400 mb-1">Level by</p>
          {!contributorTwitterId ? (
            <p className="font-semibold text-slate-900 dark:text-slate-100">@{contributor}</p>
          ) : (
            getTwitterProfile(contributorTwitterId)
          )}
        </div>
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
