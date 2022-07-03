import React from "react";
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
import { Link } from "react-router-dom";

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

  const [timeTravelDate, setTimeTravelDate] = React.useState(getDayCount(new Date()));
  // eslint-disable-next-line no-unused-vars
  const [showLoader, setShowLoader] = React.useState(true);
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
    .toISOString()
    .split("T")[0];

  React.useEffect(() => {
    const dayCount = timeTravelDate >= 0 ? timeTravelDate : getDayCount();
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
    let diff = getTimeDifference(
      getDateTimeInUTC(new Date(selectedDate)),
      new Date("2022-05-22T18:30:00.000Z")
    );
    setTimeTravelDate(diff.days);
  };

  const isTimeTravelled = (day) => {
    return day !== null && day !== undefined && day >= 0;
  };

  return (
    <div style={customStyles.backgroundStyle}>
      <h1 className="text-white col-12 text-center underline-text">Time Travel to past!</h1>
      <div className="pt-4 mt-4 row ml-1 mr-1">
        <div className="d-flex flex-column col-xs-10 col-md-3 form-group m-auto p-2 text-white">
          <Link
            to="/"
            className="w-fit-content button-href mb-4 fs-large d-flex align-items-center justify-content-evenly">
            <span className="material-symbols-outlined">arrow_back</span>Go Back
          </Link>
          <label>Select the date you want to travel to:</label>
          <input
            className="form-control"
            placeholder="mm/dd/yyyy"
            min="2022-05-23"
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
