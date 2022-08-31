import AsyncSelect from "react-select/async";
import React, { useMemo } from "react";
import { GAME_STATUS, MAX_ATTEMPTS, isGameDone } from "../utils/constants";
import PropTypes from "prop-types";
import ShareResults from "./ShareResults";
import Results from "./Results";
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
  contributor,
  timeTravelled,
  contributorTwitterId,
  shareText,
  setShareText,
  lastPlayedGame,
  setLastPlayedGame,
  moviesList
}) => {
  const [inputValue, setValue] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState(null);
  const gameFinished = useMemo(() => isGameDone(gameStatus), [gameStatus]);
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

  const fuse = new Fuse(moviesList, fuzzyOptions);

  const setAttemptsInLocalStorage = (attempts) => {
    let currentGuessDistribution = JSON.parse(guessDistribution);
    currentGuessDistribution[attempts.toString()]++;
    setGuessDistribution(JSON.stringify(currentGuessDistribution));
  };

  const submit = (value) => {
    if ((selectedValue?.title ? selectedValue?.title : value.title) === movie) {
      window.gtag("event", "GameWon", { event_category: "game-stats" });
      setTimeout(() => setOpenStatsModal(true), statsModalTimeOut);
      setGameStatus(GAME_STATUS.COMPLETED);
      setAttemptsInLocalStorage(currentIndex);
      setStats(
        JSON.stringify({
          gamesPlayed: gameStats.gamesPlayed + 1,
          gamesWon: gameStats.gamesWon + 1,
          currentStreak: lastPlayedGame === day - 1 ? gameStats.currentStreak + 1 : 1,
          maxStreak: Math.max(gameStats.maxStreak, gameStats.currentStreak + 1)
        })
      );
      setLastPlayedGame(day);
    } else if (currentIndex === MAX_ATTEMPTS) {
      window.gtag("event", "GameFailed", { event_category: "game-stats" });
      setGameStatus(GAME_STATUS.FAILED);
      setTimeout(() => setOpenStatsModal(true), statsModalTimeOut);
      if (currentGuesses !== "") {
        setCurrentGuesses(
          currentGuesses + "," + (value?.title ? value?.title : selectedValue.title)
        );
      } else {
        setCurrentGuesses(value?.title ? value?.title : selectedValue.title);
      }
      setStats(
        JSON.stringify({
          gamesPlayed: gameStats.gamesPlayed + 1,
          gamesWon: gameStats.gamesWon,
          maxStreak: gameStats.maxStreak,
          currentStreak: 0
        })
      );
      setLastPlayedGame(day);
      setSelectedValue(null);
    } else {
      setCurrentIndex(currentIndex + 1);
      setCurrentIndexFromButton(currentIndex + 1);
      if (currentGuesses !== "") {
        setCurrentGuesses(
          currentGuesses + "," + (value?.title ? value?.title : selectedValue.title)
        );
      } else {
        setCurrentGuesses(value?.title ? value?.title : selectedValue.title);
      }
    }
    setSelectedValue(null);
  };

  const fetchData = async (inputValue) => {
    const vals = fuse.search(inputValue, { limit: 6 });
    return vals.map((val) => ({ title: val.item }));
  };

  return (
    <>
      {!gameFinished && (
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
              onChange={(value) => {
                console.log(value);
                setSelectedValue(value);
              }}
            />
          </div>
          <div className="col-2 d-flex justify-content-end">
            <button onClick={() => submit({ title: "Skipped" })} className="btn btn-primary">
              Skip
            </button>
          </div>
          <button
            className="btn px-4 py-2 text-white w-full rounded bg-primary my-2 mx-auto"
            onClick={() => submit()}>
            submit
          </button>
        </div>
      )}
      <Results
        currentGuesses={currentGuesses}
        gameStatus={gameStatus}
        currentIndex={currentIndex}
        movie={movie}
        contributor={contributor}
        contributorTwitterId={contributorTwitterId}
        gameFinished={gameFinished}
      />

      {gameFinished && (
        <ShareResults
          gameStatus={gameStatus}
          shareText={shareText}
          setShareText={setShareText}
          currentIndex={currentIndex}
          dayCount={day}
          isTimeTravelled={timeTravelled}
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
  contributor: PropTypes.string,
  timeTravelled: PropTypes.bool,
  contributorTwitterId: PropTypes.string,
  shareText: PropTypes.string,
  setShareText: PropTypes.func,
  lastPlayedGame: PropTypes.string,
  setLastPlayedGame: PropTypes.func,
  moviesList: PropTypes.array
};

export default Game;
