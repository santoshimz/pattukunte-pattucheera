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
import { auth, db, isFirebaseConfigured } from "../components/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";

const attemptStatFields = {
  1: "guessedInSingleAttempt",
  2: "guessedInTwoAttempts",
  3: "guessedInThreeAttempts",
  4: "guessedInFourAttempts",
  5: "guessedInFiveAttempts"
};

const getStoredAttemptStats = (distribution) =>
  Object.fromEntries(
    Object.entries(attemptStatFields).map(([attempt, field]) => [field, distribution[attempt] ?? 0])
  );

const getGuessDistribution = (stats) =>
  Object.fromEntries(
    Object.entries(attemptStatFields).map(([attempt, field]) => [
      attempt,
      stats[field] ?? stats[attempt] ?? 0
    ])
  );

const Home = ({ timeTravelDate, moviesList }) => {
  const initialStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0
  };
  const readStoredValue = (key, defaultValue) => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue === null) {
        return defaultValue;
      }
      const parsedValue = JSON.parse(storedValue);
      return typeof parsedValue === "string" ? JSON.parse(parsedValue) : parsedValue;
    } catch (error) {
      return defaultValue;
    }
  };

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
  const [guessDistribution, setGuessDistribution] = useState(() =>
    readStoredValue("guessDistribution", intialGuessDistribution)
  );
  // We want to update stats only once. This has to be idempotent
  const [updateStats, setUpdateStats] = useLocalStorage("updateStats-latest", false);
  const [shareText, setShareText] = useState("SHARE");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [statsSyncError, setStatsSyncError] = useState(false);

  // Auth
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);
  const [stats, setStats] = useState(() => readStoredValue("stats", initialStats));
  const [lastPlayedGame, setLastPlayedGame] = useState(() => readStoredValue("lastPlayedGame", ""));
  const previousUserId = React.useRef(null);
  const statsRef = React.useRef(stats);
  const guessDistributionRef = React.useRef(guessDistribution);
  const lastPlayedGameRef = React.useRef(lastPlayedGame);
  statsRef.current = stats;
  guessDistributionRef.current = guessDistribution;
  lastPlayedGameRef.current = lastPlayedGame;
  const statsObj = stats;

  // Auth
  React.useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsAuthLoading(false);
      setCurrentLoggedInUser(null);
      return;
    }

    return onAuthStateChanged(auth, async (user) => {
      setIsAuthLoading(true);
      setCurrentLoggedInUser(user);
      if (user != null) {
        const shouldMigrateLocalStats = previousUserId.current === null;
        previousUserId.current = user.uid;
        await storeUserData(user, shouldMigrateLocalStats);
      } else if (previousUserId.current !== null) {
        previousUserId.current = null;
        setStats(initialStats);
        setGuessDistribution(intialGuessDistribution);
        setLastPlayedGame("");
        localStorage.removeItem("stats");
        localStorage.removeItem("guessDistribution");
        localStorage.removeItem("lastPlayedGame");
      }
      setIsAuthLoading(false);
    });
  }, []);

  const storeUserData = async (user, shouldMigrateLocalStats) => {
    if (!db) {
      return;
    }

    setCurrentLoggedInUser(user);
    // No need to check if we have the user in the db coz setDoc will create or update automatically
    // NOTE: we need to update the data in those cases where user updates their Google/Twitter data
    // before logging in. If we dont the we will end up with stale data.
    // Add/Update a new document in collection "user"
    try {
      // How they signed in, e.g. "google.com" or "twitter.com", and their id on that provider
      const signInProvider = user.providerData?.[0];
      await setDoc(
        doc(db, Collections.USER_COLLECTION, user.uid),
        {
          displayName: user.displayName || user.email || user.uid,
          profilePic: user.photoURL || "",
          email: user.email || "",
          signInProvider: signInProvider?.providerId || "",
          providerUserId: signInProvider?.uid || ""
        },
        { merge: true }
      ); // merge so fields saved elsewhere (e.g. twitterHandle) are kept

      // Once loggedIn, try getting the stats for the current loggedIn user
      const statsRef = doc(db, Collections.STATS_COLLECTION, user.uid);
      const statsSnap = await getDoc(statsRef);

      if (!statsSnap.exists()) {
        const guestStats = shouldMigrateLocalStats ? statsRef.current : initialStats;
        const guestGuessDistribution = shouldMigrateLocalStats
          ? guessDistributionRef.current
          : intialGuessDistribution;
        const guestLastPlayedGame = shouldMigrateLocalStats ? lastPlayedGameRef.current : "";
        const statsToStoreInDb = {
          gamesPlayed: guestStats.gamesPlayed,
          gamesWon: guestStats.gamesWon,
          maxStreak: guestStats.maxStreak,
          currentStreak: guestStats.currentStreak,
          displayName: user.displayName || "Player",
          profilePic: user.photoURL || "",
          lastPlayedGame: guestLastPlayedGame,
          ...getStoredAttemptStats(guestGuessDistribution),
          score:
            (guestGuessDistribution["1"] ?? 0) * 1000 +
            (guestGuessDistribution["2"] ?? 0) * 800 +
            (guestGuessDistribution["3"] ?? 0) * 600 +
            (guestGuessDistribution["4"] ?? 0) * 400 +
            (guestGuessDistribution["5"] ?? 0) * 200
        };
        await setDoc(doc(db, Collections.STATS_COLLECTION, user.uid), statsToStoreInDb);
        if (!shouldMigrateLocalStats && auth.currentUser?.uid === user.uid) {
          setStats(initialStats);
          setGuessDistribution(intialGuessDistribution);
          setLastPlayedGame("");
        }
      } else {
        const savedStats = statsSnap.data();
        if (auth.currentUser?.uid !== user.uid) {
          return;
        }
        setStats({
          gamesPlayed: savedStats.gamesPlayed ?? 0,
          gamesWon: savedStats.gamesWon ?? 0,
          currentStreak: savedStats.currentStreak ?? 0,
          maxStreak: savedStats.maxStreak ?? 0
        });
        setGuessDistribution({
          ...getGuessDistribution(savedStats)
        });
        setLastPlayedGame(savedStats.lastPlayedGame ?? "");
      }
      setStatsSyncError(false);
    } catch {
      setStatsSyncError(true);
    }
  };

  const persistGameStats = async (updatedStats, updatedGuessDistribution, playedDay) => {
    if (!currentLoggedInUser || !db) {
      return;
    }

    const distribution = updatedGuessDistribution;
    const score =
      distribution["1"] * 1000 +
      distribution["2"] * 800 +
      distribution["3"] * 600 +
      distribution["4"] * 400 +
      distribution["5"] * 200;

    try {
      await setDoc(
        doc(db, Collections.STATS_COLLECTION, currentLoggedInUser.uid),
        {
          ...updatedStats,
          ...getStoredAttemptStats(distribution),
          score,
          lastPlayedGame: playedDay,
          displayName: currentLoggedInUser.displayName || "Player",
          profilePic: currentLoggedInUser.photoURL || ""
        },
        { merge: true }
      );
      setStatsSyncError(false);
    } catch {
      setStatsSyncError(true);
    }
  };

  React.useEffect(() => {
    if (!isAuthLoading && currentLoggedInUser === null) {
      localStorage.setItem("stats", JSON.stringify(stats));
      localStorage.setItem("guessDistribution", JSON.stringify(guessDistribution));
      localStorage.setItem("lastPlayedGame", JSON.stringify(lastPlayedGame));
    }
  }, [stats, guessDistribution, lastPlayedGame, isAuthLoading, currentLoggedInUser]);

  React.useEffect(() => {
    const dayCount = timeTravelDate >= 0 ? timeTravelDate : getDayCount();
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_CDN_URL}${isProduction() ? "/" + dayCount : ""}/meta-data.json`)
      .then((response) => response.json())
      .then((json) => {
        setMovie(json.movie);
        setContributor(json.contributor);
        setContributorTwitterId(json.twitterId);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
    // We had a bug where movies.json was not updated correctly resulting in people losing their streak.
    // This fix will make their current streak same as their max streak
    // This will fix the issue for users whose max streak was their current streak
    // This will be extra advantageous for people whose max streak is not their current streak
    // Probably we should start storing previousStreak
    if ((day === 400 || day === 401) && gameStatus === GAME_STATUS.FAILED && !updateStats) {
      setStats({
        gamesPlayed: statsObj.gamesPlayed,
        gamesWon: statsObj.gamesWon + 1,
        currentStreak: statsObj.maxStreak + 1,
        maxStreak: statsObj.maxStreak + 1
      });
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
    navigate("/leaderboard");
  };

  return (
    <>
      <Navbar />
      {isLoading || isAuthLoading ? (
        <Loader />
      ) : (
        <div className="bg-secondary dark:bg-primary min-h-screen h-auto pb-6 overflow-scroll">
          {statsSyncError && (
            <p role="alert" className="text-center text-red-600 dark:text-red-400">
              Unable to sync account stats. Refresh the page to retry.
            </p>
          )}
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
            guessData={guessDistribution}
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
                gameStats={statsObj}
                movie={movie}
                setOpenStatsModal={setOpenStatsModal}
                contributor={contributor}
                contributorTwitterId={contributorTwitterId}
                shareText={shareText}
                setShareText={setShareText}
                lastPlayedGame={lastPlayedGame}
                setLastPlayedGame={setLastPlayedGame}
                userId={currentLoggedInUser?.uid}
                onStatsChange={persistGameStats}
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
