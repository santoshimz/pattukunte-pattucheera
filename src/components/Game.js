import AsyncSelect from "react-select/async";
import React, { useMemo } from "react";
import { GAME_STATUS, MAX_ATTEMPTS, isGameDone } from "../utils/constants";
import PropTypes from "prop-types";
import ShareResults from "./ShareResults";
import Results from "./Results";
import Fuse from "fuse.js";
import Confetti from "react-dom-confetti";

const config = {
  angle: "180",
  spread: 300,
  startVelocity: "30",
  elementCount: 70,
  dragFriction: 0.12,
  duration: "2000",
  stagger: "2",
  width: "10px",
  height: "10px",
  perspective: "900px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

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
  moviesList,
  theme
}) => {
  const [inputValue, setValue] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [isShowConfetti, setIsShowConfetti] = React.useState(null);
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
      setIsShowConfetti(true);
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
        <div className="w-100 searchbox-container movie-search-dropdown row d-flex justify-content-center">
          <div className="w-100 mb-4 px-4 d-flex justify-content-center">
            <button onClick={() => submit({ title: "Skipped" })} className="btn btn-danger col-3">
              Skip
            </button>
          </div>

          <div className="col-9 p-0 pl-4">
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
                setSelectedValue(value);
              }}
            />
          </div>

          <div className="col-3">
            <button className="btn bg-primary text-white px-2.5 py-2" onClick={() => submit()}>
              submit
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
        contributorTwitterId={contributorTwitterId}
        gameFinished={gameFinished}
        theme={theme}
      />
      <div
        className="d-flex justify-content-center"
        style={{
          position: "absolute",
          top: "55%",
          left: "50%"
        }}>
        <Confetti active={isShowConfetti} config={config} />
      </div>

      {gameFinished && (
        <ShareResults
          gameStatus={gameStatus}
          shareText={shareText}
          setShareText={setShareText}
          currentIndex={currentIndex}
          dayCount={day}
          isTimeTravelled={timeTravelled}
          theme={theme}
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
  setCurrentIndexFromButton: PropTypes.func,
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
  moviesList: PropTypes.array,
  theme: PropTypes.string
};

export default Game;
