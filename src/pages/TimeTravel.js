import React, { useCallback } from "react";
import {
  getTimeDifference,
  getDateTimeInUTC,
  getDayCount,
  GAME_STATUS,
  isProduction,
  intialGuessDistribution
} from "../utils/constants";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Game from "../components/Game";
import ImagesContainer from "../components/ImagesContainer";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const TimeTravel = ({ moviesList }) => {
  const [currentIndexFromStorage, setCurrentIndexFromStorage] = useLocalStorage(
    "timeTravel-currentIndex",
    1
  );
  const [buttonLogic, setButtonLogic] = React.useState(false);
  const [currentIndexFromButton, setCurrentIndexFromButton] =
    React.useState(currentIndexFromStorage);
  const [currentGuesses, setCurrentGuesses] = useLocalStorage("timeTravel-currentGuesses", "");
  const [gameStatus, setGameStatus] = useLocalStorage("timeTravel-gameStatus", GAME_STATUS.RUNNING);
  const [day, setDay] = useLocalStorage("timeTravel-day", 1);
  const [movie, setMovie] = React.useState("");
  const [contributor, setContributor] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [shareText, setShareText] = React.useState("SHARE");

  const [timeTravelDate, setTimeTravelDate] = React.useState(getDayCount(new Date()) - 1);
  // eslint-disable-next-line no-unused-vars
  const [showLoader, setShowLoader] = React.useState(true);
  const [contributorTwitterId, setContributorTwitterId] = React.useState("");
  const [guessDistribution, setGuessDistribution] = useLocalStorage(
    "timeTravel-guessDistribution",
    JSON.stringify(intialGuessDistribution)
  );
  const [setOpenStatsModal] = React.useState(false);
  const [stats, setStats] = useLocalStorage(
    "timeTravel-stats",
    JSON.stringify({
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0
    })
  );
  const [lastPlayedGame, setLastPlayedGame] = useLocalStorage("timeTravel-lastPlayedGame", "");
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
    .toISOString()
    .split("T")[0];
  const [selectedDate, setSelectedDate] = React.useState(yesterday);
  React.useEffect(() => {
    const dayCount = timeTravelDate >= 0 ? timeTravelDate : getDayCount() - 1;
    if (showLoader) {
      setLoading(true);
    }
    fetch(`${process.env.REACT_APP_CDN_URL}${isProduction() ? "/" + dayCount : ""}/meta-data.json`)
      .then((response) => response.json())
      .then((json) => {
        setMovie(json.movie);
        setContributor(json.contributor);
        setContributorTwitterId(json.twitterId);
        setTimeout(() => setLoading(false), 500);
      })
      .catch((error) => console.log(error));
    if (day !== dayCount) {
      setGameStatus(GAME_STATUS.RUNNING);
      setDay(dayCount);
      setCurrentGuesses("");
      setCurrentIndexFromStorage(1);
      setCurrentIndexFromButton(1);
    }
  }, [timeTravelDate, setCurrentGuesses, setCurrentIndexFromStorage, setDay, setGameStatus]);

  const handleChangeFromDate = (event) => {
    window.gtag("event", "time-travelled", { event_category: "game-stats" });
    const selectedDate = event.target.value;
    let diff = getTimeDifference(
      getDateTimeInUTC(new Date(selectedDate)),
      new Date("2022-05-22T18:30:00.000Z")
    );
    if (!selectedDate || diff.days > getDayCount() - 1) {
      setTimeTravelDate(getDayCount(new Date()) - 1);
      setSelectedDate(yesterday);
      return;
    }
    setSelectedDate(selectedDate);

    setTimeTravelDate(diff.days);
  };

  const isTimeTravelled = (day) => {
    return day !== null && day !== undefined && day >= 0;
  };

  const navigate = useNavigate();
  const goBack = useCallback(() => navigate("/", { replace: true }), [navigate]);

  return (
    <div className="bg-secondary dark:bg-primary min-h-screen h-auto text-primary dark:text-secondary">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-6 lg:py-10 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-semibold">
              <i className="fa-solid fa-arrow-left text-lg"></i>
              <span>Go Back</span>
            </button>
            {timeTravelDate >= 0 && (
              <h1 className="text-2xl lg:text-3xl font-bold text-center text-slate-900 dark:text-slate-100">
                Day <span className="text-blue-500 lg:text-blue-400">#{timeTravelDate}</span>
              </h1>
            )}
            <div className="w-24"></div>
          </div>

          {/* Date Picker */}
          <div className="max-w-md mx-auto space-y-2 relative z-50">
            <label className="block text-sm lg:text-base font-semibold text-slate-700 dark:text-slate-300">
              Select Date
            </label>
            <input
              className="w-full border-2 border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 lg:py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:border-pink-500 dark:focus:border-pink-400 transition-colors"
              placeholder="mm/dd/yyyy"
              min="2022-05-23"
              value={selectedDate}
              max={yesterday}
              onChange={handleChangeFromDate}
              type="date"
            />
          </div>

          {/* Info Banner */}
          <div className="mt-4 lg:mt-5 p-3 lg:p-4 bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 rounded">
            <p className="text-sm lg:text-base text-cyan-900 dark:text-cyan-200 font-medium">
              ℹ️ Time travel results are not included in your daily stats or streaks
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-10 relative z-0">
        {showLoader && loading && (
          <div className="flex justify-center items-center py-16 lg:py-24">
            <i className="fa-solid fa-spinner text-6xl lg:text-8xl animate-spin text-slate-400 dark:text-slate-600"></i>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Image Section - Left Column (3 cols on large) */}
            <div className="lg:col-span-3">
              <ImagesContainer
                buttonLogic={buttonLogic}
                setButtonLogic={setButtonLogic}
                currentIndexFromButton={currentIndexFromButton}
                currentIndexFromStorage={currentIndexFromStorage}
                setCurrentIndexFromButton={setCurrentIndexFromButton}
                gameStatus={gameStatus}
                dayCount={day}
              />
            </div>

            {/* Game Section - Right Column (2 cols on large) */}
            <div className="lg:col-span-2">
              <Game
                currentIndex={currentIndexFromStorage}
                setCurrentIndex={setCurrentIndexFromStorage}
                currentIndexFromButton={currentIndexFromButton}
                setCurrentIndexFromButton={setCurrentIndexFromButton}
                currentGuesses={currentGuesses}
                setCurrentGuesses={setCurrentGuesses}
                gameStatus={gameStatus}
                setGameStatus={setGameStatus}
                day={day}
                setDay={setDay}
                movie={movie}
                contributor={contributor}
                timeTravelled={isTimeTravelled(timeTravelDate)}
                contributorTwitterId={contributorTwitterId}
                shareText={shareText}
                setShareText={setShareText}
                moviesList={moviesList}
                guessDistribution={guessDistribution}
                setGuessDistribution={setGuessDistribution}
                setStats={setStats}
                stats={stats}
                gameStats={JSON.parse(stats)}
                setOpenStatsModal={setOpenStatsModal}
                lastPlayedGame={lastPlayedGame}
                setLastPlayedGame={setLastPlayedGame}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
TimeTravel.propTypes = {
  moviesList: PropTypes.array
};

export default TimeTravel;
