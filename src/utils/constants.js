export const greenSquare = "🟩";

export const redSquare = "🟥";

export const graySquare = "⬛";

export const blueSquare = "🟦";

export const MAX_ATTEMPTS = 5;

export const getShareText = (attempts, gameStatus, isTimeTravelled = false) => {
  let shareText = "";
  if (gameStatus === GAME_STATUS.FAILED) {
    shareText = Array(MAX_ATTEMPTS)
      .fill(isTimeTravelled ? blueSquare : redSquare)
      .join("");
    return shareText;
  }
  for (let i = 1; i <= MAX_ATTEMPTS; i++) {
    if (i < attempts) {
      shareText += isTimeTravelled ? blueSquare : redSquare;
    } else if (i === attempts) {
      shareText += greenSquare;
    } else {
      shareText += graySquare;
    }
  }
  return shareText;
};

export const SITE_URL = "https://pattukunte-pattucheera.netlify.app";

export const TIME_TRAVEL_URL = `${SITE_URL}/time-travel`;

export const GAME_STATUS = {
  COMPLETED: "completed",
  FAILED: "failed",
  RUNNING: "running"
};

export function getTimeDifference(date1, date2) {
  var diffSeconds = (date1.getTime() - date2.getTime()) / 1000;
  const days = Math.floor(diffSeconds / (24 * 60 * 60));
  const hours = Math.floor((diffSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((diffSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(diffSeconds % 60);
  return { days: days, hours: hours, minutes: minutes, seconds: seconds };
}

export function getDayCount() {
  const diff = getTimeDifference(
    getDateTimeInUTC(new Date()),
    new Date("2022-05-22T18:30:00.000Z")
  );
  return Math.abs(diff.days);
}
export const intialGuessDistribution = new Array(MAX_ATTEMPTS).fill().reduce((acc, _, index) => {
  acc[index + 1] = 0;
  return acc;
}, {});

export const getDateTimeInUTC = (date) => {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    )
  );
};

export const isProduction = () => {
  return process.env.NODE_ENV && process.env.NODE_ENV === "production";
};

export const githubRepoLink = "https://github.com/santoshimz/pattukunte-pattucheera";

export const composeShareText = (gameStatus, dayCount, isTimeTravelled, currentIndex) => {
  return `Pattukunte Pattucheera Day ${dayCount}${isTimeTravelled ? "(Time Travelled)" : ""}\
: ${gameStatus === GAME_STATUS.FAILED ? "0" : currentIndex}/5\n\n${getShareText(
    currentIndex,
    gameStatus,
    isTimeTravelled
  )}\n\n${SITE_URL}\n#PattukuntePattuCheera`;
};

export const isGameDone = (gameStatus) => {
  return gameStatus === GAME_STATUS.COMPLETED || gameStatus === GAME_STATUS.FAILED;
};

export const missingMovies = [
  "13 B",
  "Mangalyam",
  "Oke Okkadu",
  "Robo",
  "RRR",
  "Veedokkade",
  "Ashokavanam lo Arjuna Kalyanam",
  "Shivaji",
  "Premikula Roju",
  "EESHWAR",
];
