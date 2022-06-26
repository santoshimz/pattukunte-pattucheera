import AsyncSelect from "react-select/async";
import React from "react";
import { GAME_STATUS, MAX_ATTEMPTS } from "../utils/constants";
import PropTypes from "prop-types";
import ShareResults from "./ShareResults";
import Results from "./Results";
import moviesDataset from "../utils/telugu-movies";
import Fuse from "fuse.js";

const Game = ({
  currentIndex,
  setCurrentIndex,
  setCurrentIndexFromButton,
  currentGuesses,
  setCurrentGuesses,
  gameStatus,
  setGameStatus,
  setStats,
  gameStats,
  movie,
  guessDistribution,
  setGuessDistribution,
  day,
  setOpenStatsModal,
  contributor
}) => {
  const [shareText, setShareText] = React.useState("SHARE");
  const [inputValue, setValue] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState(null);
  const statsModalTimeOut = 2000;
  const handleInputChange = (value) => {
    setValue(value);
  };
  const fuzzyOptions = {
    isCaseSensitive: false
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    // threshold: 0.6,
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
  };

  const fuse = new Fuse(moviesDataset, fuzzyOptions);

  const setAttemptsInLocalStorage = (attempts) => {
    let currentGuessDistribution = JSON.parse(guessDistribution);
    currentGuessDistribution[attempts.toString()]++;
    setGuessDistribution(JSON.stringify(currentGuessDistribution));
  };

  const handleChange = (value) => {
    setSelectedValue(value.title);
    if (value.title === movie) {
      setTimeout(() => setOpenStatsModal(true), statsModalTimeOut);
      setGameStatus(GAME_STATUS.COMPLETED);
      setAttemptsInLocalStorage(currentIndex);
      setStats(
        JSON.stringify({
          gamesPlayed: gameStats.gamesPlayed + 1,
          gamesWon: gameStats.gamesWon + 1,
          currentStreak: gameStats.currentStreak
            ? gameStats.currentStreak + 1
            : gameStats.gamesPlayed === gameStats.gamesWon && gameStats.gamesWon === 1
            ? 2
            : 1,
          maxStreak: gameStats.maxStreak
            ? gameStats.maxStreak + 1
            : gameStats.gamesPlayed === gameStats.gamesWon && gameStats.gamesWon === 1
            ? 2
            : 1
        })
      );
    } else if (currentIndex === MAX_ATTEMPTS) {
      setGameStatus(GAME_STATUS.FAILED);
      setTimeout(() => setOpenStatsModal(true), statsModalTimeOut);
      if (currentGuesses !== "") {
        setCurrentGuesses(currentGuesses + "," + value.title);
      } else {
        setCurrentGuesses(value.title);
      }
      setStats(
        JSON.stringify({
          gamesPlayed: gameStats.gamesPlayed + 1,
          gamesWon: gameStats.gamesWon,
          maxStreak: gameStats.maxStreak
            ? gameStats.maxStreak
            : gameStats.gamesPlayed === gameStats.gamesWon && gameStats.gamesWon === 1
            ? 1
            : 0,
          currentStreak: 0
        })
      );
    } else {
      setCurrentIndex(currentIndex + 1);
      setCurrentIndexFromButton(currentIndex + 1);
      if (currentGuesses !== "") {
        setCurrentGuesses(currentGuesses + "," + value.title);
      } else {
        setCurrentGuesses(value.title);
      }
    }
  };

  const fetchData = async (inputValue) => {
    const vals = fuse.search(inputValue, { limit: 5 });
    return vals.map((val) => ({ title: val.item }));
  };

  return (
    <>
      {gameStatus === GAME_STATUS.RUNNING && (
        <div className="w-100 searchbox-container movie-search-dropdown row d-flex">
          <div className="col-10">
            <AsyncSelect
              placeholder="Enter a movie name"
              cacheOptions
              defaultValue={false}
              className={!inputValue.length ? "hide-dropdown" : ""}
              value={selectedValue}
              getOptionLabel={(e) => e.title}
              getOptionValue={(e) => e.title}
              loadOptions={fetchData}
              onInputChange={handleInputChange}
              onChange={handleChange}
            />
          </div>
          <div className="col-2 d-flex justify-content-end">
            <button onClick={() => handleChange({ title: " " })} className="btn btn-primary">
              Pass
            </button>
          </div>
        </div>
      )}
      <Results
        currentGuesses={currentGuesses}
        gameStatus={gameStatus}
        currentIndex={currentIndex}
        movie={movie}
        contributor={contributor}
      />

      {(gameStatus === GAME_STATUS.COMPLETED || gameStatus === GAME_STATUS.FAILED) && (
        <ShareResults
          gameStatus={gameStatus}
          shareText={shareText}
          setShareText={setShareText}
          currentIndex={currentIndex}
          dayCount={day}
        />
      )}
    </>
  );
};

Game.propTypes = {
  currentIndex: PropTypes.number,
  setCurrentIndex: PropTypes.func,
  currentGuesses: PropTypes.string,
  setCurrentGuesses: PropTypes.func,
  gameStatus: PropTypes.string,
  setGameStatus: PropTypes.func,
  setStats: PropTypes.func,
  day: PropTypes.number,
  gameStats: PropTypes.object,
  setCurrentIndexFromButton: PropTypes.number,
  movie: PropTypes.string,
  guessDistribution: PropTypes.string,
  setGuessDistribution: PropTypes.func,
  setOpenStatsModal: PropTypes.func,
  contributor: PropTypes.string
};

export default Game;
