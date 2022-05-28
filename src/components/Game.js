import AsyncSelect from "react-select/async";
import React from "react";
import algoliasearch from "algoliasearch/lite";
import { ALGOLIA_CLIENT, MAX_ATTEMPTS } from "../utils/constants";
import PropTypes from "prop-types";
import ShareResults from "./ShareResults";
import Results from "./Results";
import { MOVIE_NAME } from "../utils/constants";

const searchClient = algoliasearch("latency", ALGOLIA_CLIENT);

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
    if (value.title === MOVIE_NAME) {
      setGameStatus("completed");
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
      setGameStatus("failed");
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
    const index = searchClient.initIndex("movies");
    const hits = await index.search(inputValue);
    const modifiedData = [
      {
        title: "Godavari"
      },
      ...hits.hits
    ];
    return inputValue.toLowerCase().startsWith("go") ? modifiedData : hits.hits;
  };

  return (
    <>
      {gameStatus === "running" && (
        <div className="searchbox-container movie-search-dropdown">
          <AsyncSelect
            placeholder="Enter a movie name"
            cacheOptions
            defaultOptions
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

      {(gameStatus === "completed" || gameStatus === "failed") && (
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
