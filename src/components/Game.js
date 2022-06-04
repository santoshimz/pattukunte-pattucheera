import AsyncSelect from "react-select/async";
import React from "react";
import { ALTERNATE_MOVIE_NAME, GAME_STATUS, MAX_ATTEMPTS } from "../utils/constants";
import PropTypes from "prop-types";
import ShareResults from "./ShareResults";
import Results from "./Results";
import { MOVIE_NAME } from "../utils/constants";
import moviesDataset from "../utils/telugu-movies";

const Game = ({
  currentIndex,
  setCurrentIndex,
  setCurrentIndexFromButton,
  currentGuesses,
  setCurrentGuesses,
  gameStatus,
  setGameStatus,
  setStats,
  gameStats
}) => {
  const [shareText, setShareText] = React.useState("SHARE");
  const [inputValue, setValue] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState(null);
  const handleInputChange = (value) => {
    setValue(value);
  };

  const handleChange = (value) => {
    setSelectedValue(value.title);
    if (value.title === MOVIE_NAME || value.title === ALTERNATE_MOVIE_NAME) {
      setGameStatus(GAME_STATUS.COMPLETED);
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

  const fetchData = async () => {
    let suggestions = [];
    let modifiedData = [];
    for (let i = 0; i < moviesDataset.length; i++) {
      const movie = moviesDataset[i];
      if (movie.toLowerCase().includes(inputValue.toLowerCase())) {
        suggestions.push({ title: movie });
      }
      modifiedData = [
        {
          title: "Aaruguru Pathivrathalu"
        },
        ...suggestions
      ];
      if (suggestions.length >= 5) {
        break;
      }
    }

    return (inputValue.toLowerCase().startsWith("aar") || inputValue.toLowerCase().startsWith("6")) ? modifiedData : suggestions;
  };

  return (
    <>
      {gameStatus === GAME_STATUS.RUNNING && (
        <div className="searchbox-container movie-search-dropdown">
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
      )}
      <Results
        currentGuesses={currentGuesses}
        gameStatus={gameStatus}
        currentIndex={currentIndex}
      />

      {(gameStatus === GAME_STATUS.COMPLETED || gameStatus === GAME_STATUS.FAILED) && (
        <ShareResults
          gameStatus={gameStatus}
          shareText={shareText}
          setShareText={setShareText}
          currentIndex={currentIndex}
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
  setCurrentIndexFromButton: PropTypes.number
};

export default Game;
