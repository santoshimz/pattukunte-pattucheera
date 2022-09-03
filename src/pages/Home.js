import React, { useCallback } from "react";
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
import RulesModal from "../components/RulesModal";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Home = ({ timeTravelDate, moviesList, theme }) => {
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
  const [contributorTwitterId, setContributorTwitterId] = React.useState("");
  const [guessDistribution, setGuessDistribution] = useLocalStorage(
    "guessDistribution",
    JSON.stringify(intialGuessDistribution)
  );
  // We want to update stats only once. This has to be idempotent
  const [updateStats, setUpdateStats] = useLocalStorage("updateStats", false);
  const [shareText, setShareText] = React.useState("SHARE");
  const [isPWAState, setPWAState] = React.useState(false);
  const initialStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0
  };

  const [stats, setStats] = useLocalStorage("stats", JSON.stringify(initialStats));
  const [lastPlayedGame, setLastPlayedGame] = useLocalStorage("lastPlayedGame", "");
  const statsObj = React.useMemo(() => {
    return typeof stats === "string" ? JSON.parse(stats) : stats;
  }, [stats]);

  React.useEffect(() => {
    const dayCount = timeTravelDate >= 0 ? timeTravelDate : getDayCount();
    fetch(`${process.env.REACT_APP_CDN_URL}${isProduction() ? "/" + dayCount : ""}/meta-data.json`)
      .then((response) => response.json())
      .then((json) => {
        setMovie(json.movie);
        setContributor(json.contributor);
        setContributorTwitterId(json.twitterId);
      })
      .catch((error) => console.log(error));
    // We had a bug where movies.json was not updated correctly resulting in people losing their streak.
    // This fix will make their current streak same as their max streak
    // This will fix the issue for users whose max streak was their current streak
    // This will be extra advantageous for people whose max streak is not their current streak
    // Probably we should start storing previousStreak
    if ((day === 88 || day === 89) && gameStatus === GAME_STATUS.FAILED && !updateStats) {
      setStats(
        JSON.stringify({
          gamesPlayed: statsObj.gamesPlayed,
          gamesWon: statsObj.gamesWon + 1,
          currentStreak: statsObj.maxStreak + 1,
          maxStreak: statsObj.maxStreak + 1
        })
      );
      setUpdateStats(true);
    }
    if (day !== dayCount) {
      setGameStatus(GAME_STATUS.RUNNING);
      setDay(dayCount);
      setCurrentGuesses("");
      setCurrentIndexFromStorage(1);
    }
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setPWAState(true);
      window.gtag("event", "playingUsingPWA", { event_category: "pwaInstall" });
      if (localStorage.getItem("pwaInstall") == null) {
        localStorage.setItem("pwaInstall", "installed");
        window.gtag("event", "pwaInstall", { event_category: "pwaInstall" });
      }
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") {
          window.location.reload();
        }
      });
    }
  }, [timeTravelDate, setCurrentGuesses, setCurrentIndexFromStorage, setDay, setGameStatus]);

  const navigate = useNavigate();
  const gotoArchives = useCallback(() => navigate("/timetravel", { replace: true }), [navigate]);

  return (
    <div
      style={theme === "dark" ? customStyles.backgroundStyle : customStyles.backgroundStyleLight}>
      <h1
        className="font-weight-bold"
        style={theme === "dark" ? customStyles.headerStyle : customStyles.headerStyleLight}>
        Pattukunte Pattucheera
      </h1>
      <span style={theme === "dark" ? customStyles.statsStyle : customStyles.statsStyleLight}>
        <div className="d-flex flex-column align-items-center">
          <button
            onClick={() => setOpenStatsModal(true)}
            alt="stats"
            style={theme === "dark" ? customStyles.statsIcons : customStyles.statsIconsLight}
            className="bg-transparent btn-ripple stats-icon fs-30 material-symbols-outlined">
            equalizer
          </button>
          <span>Stats</span>
        </div>
        <div className="d-flex flex-column align-items-center">
          <button
            onClick={gotoArchives}
            style={theme === "dark" ? customStyles.statsIcons : customStyles.statsIconsLight}
            className="bg-transparent btn-ripple time-travel-icon fs-30 material-symbols-outlined">
            update
          </button>
          <span>Time Travel</span>
        </div>
        <div className="d-flex flex-column align-items-center">
          <button
            onClick={() => setOpenRulesModal(true)}
            style={theme === "dark" ? customStyles.statsIcons : customStyles.statsIconsLight}
            className="bg-transparent btn-ripple instructions-icon fs-30 material-symbols-outlined">
            help
          </button>
          <span>Instructions</span>
        </div>
      </span>
      <Stats
        shareText={shareText}
        setShareText={setShareText}
        currentIndex={currentIndexFromStorage}
        gameStatus={gameStatus}
        dayCount={day}
        isTimeTravelled={false}
        openStatsModal={openStatsModal}
        setOpenStatsModal={setOpenStatsModal}
        statsObj={statsObj}
        guessData={JSON.parse(guessDistribution)}
      />
      <RulesModal openRulesModal={openRulesModal} setOpenRulesModal={setOpenRulesModal} />
      {/* used inline style as we this would be removed in future */}
      {isPWAState ? (
        ""
      ) : (
        <div
          className="information-text"
          style={theme === "dark" ? customStyles.install : customStyles.installLight}>
          Our application can be installed on your device now! Check the &nbsp;
          <a
            className="text-primary"
            href="https://medium.com/progressivewebapps/how-to-install-a-pwa-to-your-device-68a8d37fadc1">
            link
          </a>
          &nbsp; for installation instructions.
        </div>
      )}
      <div style={customStyles.column}>
        <div />
        <>
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
            contributorTwitterId={contributorTwitterId}
            shareText={shareText}
            setShareText={setShareText}
            lastPlayedGame={lastPlayedGame}
            setLastPlayedGame={setLastPlayedGame}
            moviesList={moviesList}
            theme={theme}
          />
        </>
      </div>
      <Footer theme={theme} />
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
  showLoader: PropTypes.bool,
  moviesList: PropTypes.array,
  theme: PropTypes.string
};

export default Home;
