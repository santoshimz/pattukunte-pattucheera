import React from "react";
import "../styles/App.css";
import { useLocalStorage } from "../hooks/useLocalStorage";
import PropTypes from "prop-types";
import { customStyles } from "../styles/styles";
import {
  GAME_STATUS,
  getDayCount,
  intialGuessDistribution,
  isProduction
} from "../utils/constants";

import Game from "../components/Game";
import Stats from "../components/Stats";
import ImagesContainer from "../components/ImagesContainer";
import statsLogo from "../assets/stats.svg";
import rulesLogo from "../assets/rules.svg";
import RulesModal from "../components/RulesModal";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const Home = ({ timeTravelDate, showLoader }) => {
  console.log(timeTravelDate);

  const [currentIndexFromStorage, setCurrentIndexFromStorage] = useLocalStorage("currentIndex", 1);
  const [buttonLogic, setButtonLogic] = React.useState(false);
  const [currentIndexFromButton, setCurrentIndexFromButton] =
    React.useState(currentIndexFromStorage);
  const [currentGuesses, setCurrentGuesses] = useLocalStorage("currentGuesses", "");
  const [gameStatus, setGameStatus] = useLocalStorage("gameStatus", GAME_STATUS.RUNNING);
  const [day, setDay] = useLocalStorage("day", 1);
  const [openStatsModal, setOpenStatsModal] = React.useState(false);
  const [openRulesModal, setOpenRulesModal] = React.useState(false);
  const [movie, setMovie] = React.useState("");
  const [contributor, setContributor] = React.useState("");
  const [guessDistribution, setGuessDistribution] = useLocalStorage(
    "guessDistribution",
    JSON.stringify(intialGuessDistribution)
  );
  const [loading, setLoading] = React.useState(false);

  const initialStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0
  };

  const [stats, setStats] = useLocalStorage("stats", JSON.stringify(initialStats));

  const statsObj = React.useMemo(() => {
    return typeof stats === "string" ? JSON.parse(stats) : stats;
  }, [stats]);

  React.useEffect(() => {
    console.log(day);
    const dayCount = timeTravelDate >= 0 ? timeTravelDate : getDayCount();
    console.log("in useEffect", dayCount);
    setDay(dayCount);
    setLoading(true);
    fetch(`${process.env.REACT_APP_CDN_URL}${isProduction() ? "/" + dayCount : ""}/meta-data.json`)
      .then((response) => response.json())
      .then((json) => {
        setMovie(json.movie);
        setContributor(json.contributor);
        setLoading(false);
      })
      .catch((error) => console.log(error));
    if (day !== dayCount) {
      setGameStatus(GAME_STATUS.RUNNING);
      setDay(dayCount);
      setCurrentGuesses("");
      setCurrentIndexFromStorage(1);
    }
  }, [timeTravelDate, day, setCurrentGuesses, setCurrentIndexFromStorage, setDay, setGameStatus]);
  return (
    <div style={customStyles.backgroundStyle}>
      <div style={customStyles.headerStyle}>Pattukunte Pattucheera</div>
      <span style={customStyles.statsStyle}>
        <img
          className="stats-icon"
          onClick={() => setOpenStatsModal(true)}
          src={statsLogo}
          alt="stats"
        />
        <img
          className="rules-icon"
          onClick={() => setOpenRulesModal(true)}
          src={rulesLogo}
          alt="rules"
        />
      </span>
      <Stats
        openStatsModal={openStatsModal}
        setOpenStatsModal={setOpenStatsModal}
        statsObj={statsObj}
        guessData={JSON.parse(guessDistribution)}
      />
      <RulesModal openRulesModal={openRulesModal} setOpenRulesModal={setOpenRulesModal} />
      <div style={customStyles.column}>
        <div />
        {showLoader && loading && (
          <div className="d-flex p-200">
            <div className="p-4 m-auto spinner-border text-light spinner-border text-light"></div>
          </div>
        )}
        {!loading && (
          <>
            {showLoader}
            <ImagesContainer
              buttonLogic={buttonLogic}
              setButtonLogic={setButtonLogic}
              currentIndexFromButton={currentIndexFromButton}
              currentIndexFromStorage={currentIndexFromStorage}
              setCurrentIndexFromButton={setCurrentIndexFromButton}
              gameStatus={gameStatus}
              dayCount={day}
            />
            <Game
              currentIndex={currentIndexFromStorage}
              setCurrentIndex={setCurrentIndexFromStorage}
              currentIndexFromButton={currentIndexFromButton}
              setCurrentIndexFromButton={setCurrentIndexFromButton}
              guessDistribution={guessDistribution}
              setGuessDistribution={setGuessDistribution}
              currentGuesses={currentGuesses}
              setCurrentGuesses={setCurrentGuesses}
              gameStatus={gameStatus}
              setGameStatus={setGameStatus}
              day={day}
              setDay={setDay}
              setStats={setStats}
              stats={stats}
              gameStats={statsObj}
              movie={movie}
              setOpenStatsModal={setOpenStatsModal}
              contributor={contributor}
            />
          </>
        )}
      </div>
      <Footer />
      <Outlet />
    </div>
  );
};

Home.propTypes = {
  searchState: PropTypes.object,
  createURL: PropTypes.func,
  onSearchStateChange: PropTypes.func,
  movie: PropTypes.string,
  setMovie: PropTypes.func,
  timeTravelDate: PropTypes.number,
  showLoader: PropTypes.bool
};

export default Home;
