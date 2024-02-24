import React, { useCallback, useState } from "react";
import "../styles/App.css";
import { useLocalStorage } from "../hooks/useLocalStorage";
import PropTypes from "prop-types";
import {
  Collections,
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
import { auth, db } from "../components/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";

const Home = ({ timeTravelDate, moviesList }) => {
  const [currentIndexFromStorage, setCurrentIndexFromStorage] = useLocalStorage("currentIndex", 1);
  const [buttonLogic, setButtonLogic] = useState(false);
  const [currentIndexFromButton, setCurrentIndexFromButton] = useState(currentIndexFromStorage);
  const [currentGuesses, setCurrentGuesses] = useLocalStorage("currentGuesses", "");
  const [gameStatus, setGameStatus] = useLocalStorage("gameStatus", GAME_STATUS.RUNNING);
  const [day, setDay] = useLocalStorage("day", 1);
  const [openStatsModal, setOpenStatsModal] = useState(false);
  const [openRulesModal, setOpenRulesModal] = useState(false);
  const [movie, setMovie] = useState("");
  const [contributor, setContributor] = useState("");
  const [contributorTwitterId, setContributorTwitterId] = useState("");
  const [guessDistribution, setGuessDistribution] = useLocalStorage(
    "guessDistribution",
    intialGuessDistribution
  );
  // We want to update stats only once. This has to be idempotent
  const [updateStats, setUpdateStats] = useLocalStorage("updateStats-latest", false);
  const [shareText, setShareText] = useState("SHARE");
  const [isLoading, setIsLoading] = useState(true);

  // Auth
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);

  const initialStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0
  };

  const [stats, setStats] = useLocalStorage("stats", initialStats);
  const [lastPlayedGame, setLastPlayedGame] = useLocalStorage("lastPlayedGame", "");
  const statsObj = React.useMemo(() => {
    return typeof stats === "string" ? JSON.parse(stats) : stats;
  }, [stats]);

  // Auth
  React.useEffect(async () => {
    if (auth?.currentUser != null) {
      setIsLoading(true);
      setCurrentLoggedInUser(auth.currentUser);
      // No need to check if we have the user in the db coz setDoc will create or update automatically
      // NOTE: we need to update the data in those cases where user updates their Google/Twitter data
      // before logging in. If we dont the we will end up with stale data.
      // Add/Update a new document in collection "user"
      try {
        await setDoc(doc(db, Collections.USER_COLLECTION, auth.currentUser.uid), {
          displayName: auth.currentUser.displayName,
          profilePic: auth.currentUser.photoURL,
          email: auth.currentUser.email
        });

        // Once loggedIn, try getting the stats for the current loggedIn user
        const statsRef = doc(db, Collections.STATS_COLLECTION, auth.currentUser.uid);
        const statsSnap = await getDoc(statsRef);

        // if stats or guessDistribution is null then set the game stats - first time logging in
        if (!statsSnap.exists()) {
          var statsJson = typeof stats === "string" ? JSON.parse(stats) : stats;
          var guessDistributionJson =
            typeof guessDistribution === "string"
              ? JSON.parse(guessDistribution)
              : guessDistribution;

          await setDoc(doc(db, Collections.STATS_COLLECTION, auth.currentUser.uid), {
            gamesPlayed: statsJson.gamesPlayed,
            gamesWon: statsJson.gamesWon,
            maxStreak: statsJson.maxStreak,
            currentStreak: statsJson.currentStreak,
            displayName: auth.currentUser.displayName,
            profilePic: auth.currentUser.photoURL,
            1: guessDistributionJson["1"],
            2: guessDistributionJson["2"],
            3: guessDistributionJson["3"],
            4: guessDistributionJson["4"],
            5: guessDistributionJson["5"],
            score:
              guessDistributionJson["1"] * 1000 +
              guessDistributionJson["2"] * 800 +
              guessDistributionJson["3"] * 600 +
              guessDistributionJson["4"] * 400 +
              guessDistributionJson["5"] * 200
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    return onAuthStateChanged(auth, (user) => {
      setCurrentLoggedInUser(user);
    });
  }, []);

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
    if ((day === 400 || day === 401) && gameStatus === GAME_STATUS.FAILED && !updateStats) {
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
    setIsLoading(false);
  }, [
    timeTravelDate,
    setCurrentGuesses,
    setCurrentIndexFromStorage,
    setDay,
    setGameStatus
    // auth
    // currentLoggedInUser
  ]);

  const navigate = useNavigate();
  const gotoArchives = useCallback(() => navigate("/timetravel", { replace: true }), [navigate]);
  const gotoLeaderBoard = () => {
    console.log(currentLoggedInUser);
    navigate("/leaderboard");
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-secondary dark:bg-primary min-h-screen h-auto pb-6 overflow-scroll">
          <div className="flex justify-center mb-3 mx-2">
            {/* equalizer */}
            <div className="flex flex-col items-center justify-center w-fit mx-2">
              <button
                onClick={() => setOpenStatsModal(true)}
                alt="stats"
                className="material-symbols-outlined text-3xl border-2 rounded px-2 py-1 border-primary-800 text-red-400">
                equalizer
              </button>
              <span className="w-fit text-sm mt-2 dark:text-secondary">Stats</span>
            </div>

            {/* Time Travel */}
            <div className="flex flex-col items-center justify-center w-fit mx-2">
              <button
                onClick={gotoArchives}
                className="material-symbols-outlined text-3xl border-2 rounded px-2 py-1 border-primary-800 text-green-500">
                update
              </button>
              <span className="w-fit text-sm mt-2 dark:text-secondary">Time Travel</span>
            </div>

            {/* Instructions */}
            <div className="flex flex-col items-center justify-center w-fit mx-2">
              <button
                onClick={() => setOpenRulesModal(true)}
                className="material-symbols-outlined text-3xl border-2 rounded px-2 py-1 border-primary-800 text-blue-400">
                help
              </button>
              <span className="w-fit text-sm mt-2 dark:text-secondary">Instructions</span>
            </div>

            {/* LeaderBoard */}
            {currentLoggedInUser == null ? (
              ""
            ) : (
              <div className="flex flex-col items-center justify-center w-fit mx-2">
                <button
                  onClick={gotoLeaderBoard}
                  className="material-symbols-outlined text-3xl border-2 rounded px-2 py-1 border-primary-800 text-amber-400">
                  social_leaderboard
                </button>
                <span className="w-fit text-sm mt-2 dark:text-secondary">LeaderBoard</span>
              </div>
            )}
          </div>
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
          {/* <div className="italic mb-3 flex px-5 justify-center items-center text-primary dark:text-secondary">
            <Footer />
          </div> */}
          <div>
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
              />
            </>
          </div>
        </div>
      )}
    </>
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
