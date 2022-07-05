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

const TimeTravel = () => {
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

  const [timeTravelDate, setTimeTravelDate] = React.useState(getDayCount(new Date()) - 1);
  // eslint-disable-next-line no-unused-vars
  const [showLoader, setShowLoader] = React.useState(true);
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
    .toISOString()
    .split("T")[0];
  const [selectedDate, setSelectedDate] = React.useState(yesterday);
  console.log(getDayCount(), "dayCount");
  React.useEffect(() => {
    const dayCount =
      timeTravelDate >= 0 && timeTravelDate < getDayCount() ? timeTravelDate : getDayCount();
    console.log(dayCount, "setting day count");
    if (showLoader) {
      setLoading(true);
    }
    fetch(`${process.env.REACT_APP_CDN_URL}${isProduction() ? "/" + dayCount : ""}/meta-data.json`)
      .then((response) => response.json())
      .then((json) => {
        setMovie(json.movie);
        setContributor(json.contributor);
        setTimeout(() => setLoading(false), 500);
      })
      .catch((error) => console.log(error));
    if (day !== dayCount) {
      setGameStatus(GAME_STATUS.RUNNING);
      setDay(dayCount);
      setCurrentGuesses("");
      setCurrentIndexFromStorage(1);
    }
  }, [timeTravelDate, setCurrentGuesses, setCurrentIndexFromStorage, setDay, setGameStatus]);

  const handleChangeFromDate = (event) => {
    const selectedDate = event.target.value;
    if (!selectedDate) {
      setTimeTravelDate(getDayCount(new Date()) - 1);
      setSelectedDate(yesterday);
      return;
    }
    setSelectedDate(selectedDate);
    let diff = getTimeDifference(
      getDateTimeInUTC(new Date(selectedDate)),
      new Date("2022-05-22T18:30:00.000Z")
    );
    setTimeTravelDate(diff.days);
  };

  const isTimeTravelled = (day) => {
    return day !== null && day !== undefined && day >= 0;
  };

  const navigate = useNavigate();
  const goBack = useCallback(() => navigate("/", { replace: true }), [navigate]);

  return (
    <div style={customStyles.backgroundStyle}>
      <h1 className="m-2 text-white col-12 text-center underline-text">Time Travel to past!</h1>
      <div className="pt-4 mt-2 row ml-1 mr-1">
        <div className="d-flex flex-column col-xs-10 col-md-3 form-group m-auto p-2 text-white">
          <button
            onClick={goBack}
            className="mb-4 btn btn-lg text-center p-0 w-fit-content text-white mb-2">
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
            <div className="text-white text-center text-info m-auto time-travel-info">
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
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

TimeTravel.propTypes = {};

export default TimeTravel;
