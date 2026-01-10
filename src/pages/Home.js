import React, { useCallback } from "react";
import "../styles/App.css";
import { useLocalStorage } from "../hooks/useLocalStorage";
import PropTypes from "prop-types";
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
import { useNavigate } from "react-router-dom";

const Home = ({ timeTravelDate, moviesList }) => {
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
  const [updateStats, setUpdateStats] = useLocalStorage("updateStats-latest", false);
  const [shareText, setShareText] = React.useState("SHARE");
  // const [isPWAState, setPWAState] = React.useState(false);
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
    if ((day === 1058 || day === 1059) && gameStatus === GAME_STATUS.FAILED && !updateStats) {
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
      // setPWAState(true);
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
    <div className="page-container bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen h-auto pb-6 lg:pb-10 overflow-scroll">
      {/* Hero Header */}
      <div className="text-center py-6 lg:py-10 px-4">
        <h1 className="hero-title mb-2 lg:mb-4 text-3xl lg:text-5xl">🎬 Pattukunte Pattucheera</h1>
        <p className="text-sm lg:text-lg text-slate-600 dark:text-slate-400 font-medium">
          Guess the Tollywood movie from the images
        </p>
      </div>

      {/* Navigation Bar */}
      <nav className="flex justify-center gap-3 lg:gap-6 mb-8 lg:mb-12 px-4 flex-wrap">
        {/* Stats Button */}
        <button
          onClick={() => setOpenStatsModal(true)}
          className="btn-icon stats group"
          title="View Statistics">
          <span className="material-symbols-outlined text-3xl lg:text-4xl group-hover:scale-125 transition-transform">
            equalizer
          </span>
          <span className="text-xs font-semibold mt-2 text-slate-700 dark:text-slate-300 uppercase tracking-wider hidden lg:block">
            Stats
          </span>
        </button>

        {/* Time Travel Button */}
        <button
          onClick={gotoArchives}
          className="btn-icon timetravel group"
          title="Play Past Games">
          <span className="material-symbols-outlined text-3xl lg:text-4xl group-hover:scale-125 transition-transform">
            update
          </span>
          <span className="text-xs font-semibold mt-2 text-slate-700 dark:text-slate-300 uppercase tracking-wider hidden lg:block">
            Time Travel
          </span>
        </button>

        {/* Instructions Button */}
        <button
          onClick={() => setOpenRulesModal(true)}
          className="btn-icon rules group"
          title="How to Play">
          <span className="material-symbols-outlined text-3xl lg:text-4xl group-hover:scale-125 transition-transform">
            help
          </span>
          <span className="text-xs font-semibold mt-2 text-slate-700 dark:text-slate-300 uppercase tracking-wider hidden lg:block">
            How to Play
          </span>
        </button>
      </nav>

      {/* Modals */}
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

      {/* Main Game Container */}
      <div className="w-full px-2 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Image Section - Takes 3 columns on large screens */}
            <div className="lg:col-span-3">
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
              </>
            </div>

            {/* Game & Results Section - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
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
                lastPlayedGame={lastPlayedGame ? lastPlayedGame.toString() : ""}
                setLastPlayedGame={setLastPlayedGame}
                moviesList={moviesList}
              />
            </div>
          </div>
        </div>
      </div>
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
  moviesList: PropTypes.array
};

export default Home;
