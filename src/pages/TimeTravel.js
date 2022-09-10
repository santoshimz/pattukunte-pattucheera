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
import { customStyles } from "../styles/styles";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const TimeTravel = ({ moviesList, theme }) => {
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
    <div
      style={theme === "dark" ? customStyles.backgroundStyle : customStyles.backgroundStyleLight}>
      <h1
        className="m-2 col-12 text-center underline-text px-5"
        style={{ color: theme === "dark" ? "white" : "black" }}>
        Time Travel to past!
      </h1>
      {timeTravelDate >= 0 && (
        <h5
          className="text-center mt-4 mb-0 text-primary"
          style={{ color: theme === "dark" ? "white" : "black" }}>
          You are playing day #{timeTravelDate} game
        </h5>
      )}
      <div className="pt-4 mt-2 row ml-1 mr-1">
        <div
          className="d-flex flex-column col-xs-10 col-md-3 form-group m-auto p-2"
          style={{ color: theme === "dark" ? "white" : "black" }}>
          <button
            onClick={goBack}
            className="mb-4 btn btn-lg text-center p-0 w-fit-content mb-2"
            style={{ color: theme === "dark" ? "white" : "black" }}>
            <span className="d-flex">
              <i className="d-flex align-items-center fa fa-arrow-left fs-30"></i>
            </span>
          </button>
          <label>Select the date you want to travel to:</label>
          <input
            className="form-control"
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
          <div className="d-flex p-200">
            <div className="p-4 m-auto spinner-border text-light spinner-border text-light"></div>
          </div>
        )}

        {!loading && (
          <>
            <div
              className="text-center text-info m-auto time-travel-info"
              style={{ color: theme === "dark" ? "white" : "black" }}>
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
              theme={theme}
            />
          </>
        )}
      </div>
      <Footer theme={theme} />
    </div>
  );
};
TimeTravel.propTypes = {
  moviesList: PropTypes.array,
  theme: PropTypes.string
};

export default TimeTravel;
