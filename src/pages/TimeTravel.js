import React, { useCallback } from "react";
import {
  getTimeDifference,
  getDateTimeInUTC,
  getDayCount,
  GAME_STATUS,
  isProduction
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
    <div className="bg-secondary dark:bg-primary min-h-screen h-auto text-primary dark:text-secondary overflow-scroll">
      {/* <h1 className="text-center underline text-3xl py-3">Time Travel to past!</h1> */}
      {timeTravelDate >= 0 && (
        <>
          <div className="w-8/12 md:w-1/3 m-auto py-6">
            {" "}
            <button onClick={goBack}>
              <span className="flex items-center">
                <i className="fa-solid fa-left-long text-md"></i>{" "}
                <span className="underline ml-1 text-md">Go back</span>
              </span>
            </button>
          </div>
          <h5 className="text-center text-lg py-6">
            You are playing day <strong className="text-blue-600">#{timeTravelDate}</strong> game
          </h5>
        </>
      )}
      <div className="w-10/12 md:w-1/3 m-auto px-4">
        <div className="flex flex-col m-auto">
          <label className="text-sm mb-1">Select the date you want to travel to :</label>
          <input
            className="border-2 rounded dark:text-darkComponentText text-primary dar:text-secondary border-darkComponentBg p-1 dark:bg-darkComponentBg bg-white"
            placeholder="mm/dd/yyyy"
            min="2022-05-23"
            value={selectedDate}
            max={yesterday}
            onChange={handleChangeFromDate}
            type="date"
          />
        </div>
      </div>
      <div>
        {showLoader && loading && (
          <div className="text-primary dark:text-secondary flex justify-center items-center p-16 opacity-50 drak:opacity-10">
            <i className="fa-solid fa-spinner text-6xl animate-spin"></i>
          </div>
        )}

        {!loading && (
          <>
            <div className="text-center m-auto text-cyan-400 text-sm px-2 my-3">
              <p>Note: This results will not be included in streak or any other daily game stats</p>
            </div>
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
            />
          </>
        )}
      </div>
    </div>
  );
};
TimeTravel.propTypes = {
  moviesList: PropTypes.array
};

export default TimeTravel;
