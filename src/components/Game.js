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
  moviesList
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
    if (
      (selectedValue?.title && !value ? selectedValue.title : value.title).trim().toLowerCase() ===
      movie.trim().toLowerCase()
    ) {
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
  // custom styles for light mode
  const customStylesForAsyncSelect = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "2px solid #ff006e" : "2px solid #e2e8f0",
      borderRadius: "12px",
      padding: "10px 14px",
      backgroundColor: "#fff",
      minHeight: "48px",
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(255, 0, 110, 0.1)"
        : "0 1px 3px rgba(0, 0, 0, 0.05)",
      transition: "all 0.2s ease"
    }),
    menu: (provided) => {
      if (!inputValue.length) {
        return {
          ...provided,
          visibility: "hidden",
          height: 0
        };
      }
      return {
        ...provided,
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        backgroundColor: "#fff",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
        marginTop: "6px",
        overflow: "hidden"
      };
    },
    menuList: (provided) => ({
      ...provided,
      padding: "8px"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#ff006e" : state.isFocused ? "#f0f4f8" : "#fff",
      color: state.isSelected ? "#fff" : "#1e293b",
      padding: "10px 12px",
      borderRadius: "8px",
      margin: "4px 0",
      cursor: "pointer",
      fontWeight: state.isSelected ? "600" : "500",
      transition: "all 0.15s ease"
    }),
    input: (provided) => ({
      ...provided,
      color: "#1e293b",
      fontSize: "15px"
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1e293b",
      fontSize: "15px"
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#94a3b8",
      fontSize: "15px"
    })
  };

  // custom styles for dark mode
  const customStylesForAsyncSelectDark = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "2px solid #ff006e" : "2px solid #475569",
      borderRadius: "12px",
      padding: "10px 14px",
      backgroundColor: "#1e293b",
      minHeight: "48px",
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(255, 0, 110, 0.2)"
        : "0 1px 3px rgba(0, 0, 0, 0.3)",
      transition: "all 0.2s ease"
    }),
    menu: (provided) => {
      if (!inputValue.length) {
        return {
          ...provided,
          visibility: "hidden",
          height: 0
        };
      }
      return {
        ...provided,
        backgroundColor: "#0f172a",
        border: "1px solid #475569",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        marginTop: "6px",
        overflow: "hidden"
      };
    },
    menuList: (provided) => ({
      ...provided,
      padding: "8px"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#ff006e" : state.isFocused ? "#334155" : "#1e293b",
      color: state.isSelected ? "#fff" : "#e2e8f0",
      padding: "10px 12px",
      borderRadius: "8px",
      margin: "4px 0",
      cursor: "pointer",
      fontWeight: state.isSelected ? "600" : "500",
      transition: "all 0.15s ease"
    }),
    input: (provided) => ({
      ...provided,
      color: "#e2e8f0",
      fontSize: "15px"
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#e2e8f0",
      fontSize: "15px"
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#64748b",
      fontSize: "15px"
    })
  };
  return (
    <>
      {!gameFinished && (
        <div className="w-full space-y-4 lg:space-y-5">
          <div className="card p-5 lg:p-6 space-y-4 lg:space-y-5 relative z-10">
            {/* Input Section with label */}
            <div className="space-y-2 relative z-20">
              <label className="text-sm lg:text-base font-semibold text-slate-700 dark:text-slate-300 block">
                Search Movie
              </label>
              <AsyncSelect
                placeholder="Type a movie name..."
                cacheOptions
                defaultValue={false}
                styles={
                  localStorage.getItem("theme") === "dark"
                    ? customStylesForAsyncSelectDark
                    : customStylesForAsyncSelect
                }
                value={selectedValue}
                getOptionLabel={(e) => e.title}
                getOptionValue={(e) => e.title}
                loadOptions={fetchData}
                onInputChange={handleInputChange}
                onChange={(value) => {
                  setSelectedValue(value);
                }}
                classNamePrefix="react-select"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 lg:gap-3 w-full">
              <button
                className="btn-primary flex-1 lg:flex-auto flex items-center justify-center gap-2 px-5 lg:px-6 py-3 lg:py-3"
                onClick={() => submit()}>
                <span className="text-lg">
                  <i className="fa-solid fa-check-circle"></i>
                </span>
                <span>Submit</span>
              </button>

              <button
                onClick={() => submit({ title: "Skipped" })}
                className="btn-secondary flex-1 lg:flex-auto flex items-center justify-center gap-2 px-5 lg:px-6 py-3 lg:py-3">
                <span className="text-lg">
                  <i className="fa-solid fa-forward"></i>
                </span>
                <span>Skip</span>
              </button>
            </div>
          </div>

          {/* Results Display - Below dropdown */}
          <div className="relative z-0">
            <Results
              currentGuesses={currentGuesses}
              gameStatus={gameStatus}
              currentIndex={currentIndex}
              movie={movie}
              contributor={contributor}
              contributorTwitterId={contributorTwitterId}
              gameFinished={gameFinished}
            />
          </div>
        </div>
      )}

      {/* Confetti Animation */}
      <div
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
  moviesList: PropTypes.array
};

export default Game;
