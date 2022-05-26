import AsyncSelect from "react-select/async";
import React from "react";
import algoliasearch from "algoliasearch/lite";
import { ALGOLIA_CLIENT } from "../utils/constants";
import { customStyles } from "../styles/styles";
import PropTypes from "prop-types";
import ShareResults from "./ShareResults";
import Results from "./Results";
import { MOVIE_NAME } from "../utils/constants";

const searchClient = algoliasearch("latency", ALGOLIA_CLIENT);

const Game = ({
  currentIndex,
  setCurrentIndex,
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
    } else if (currentIndex === 5) {
      setGameStatus("failed");
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
        title: "Vasu"
      },
      ...hits.hits
    ];
    return inputValue.toLowerCase().startsWith("va") ? modifiedData : hits.hits;
  };

  return (
    <>
      <div className="searchbox-container" style={customStyles.marginBottom}>
        {gameStatus === "running" && (
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
        )}
      </div>
      <Results
        currentGuesses={currentGuesses}
        gameStatus={gameStatus}
        currentIndex={currentIndex}
      />
      <ShareResults shareText={shareText} setShareText={setShareText} currentIndex={currentIndex} />
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
  gameStats: PropTypes.object
};

export default Game;
