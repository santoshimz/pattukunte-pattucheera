export const ALGOLIA_CLIENT = "6be0576ff61c053d5f9a3225e2a90f76";

export const MOVIE_NAME = "Ghatotkachudu";

export const ALTERNATE_MOVIE_NAME = MOVIE_NAME;

export const greenSquare = "🟩";

export const redSquare = "🟥";

export const graySquare = "⬛";

export const MAX_ATTEMPTS = 5;

export const getShareText = (attempts, gameStatus) => {
  let shareText = "";
  if (gameStatus === GAME_STATUS.FAILED) {
    shareText = Array(MAX_ATTEMPTS).fill(redSquare).join("");
    return shareText;
  }
  for (let i = 1; i <= MAX_ATTEMPTS; i++) {
    if (i < attempts) {
      shareText += redSquare;
    } else if (i === attempts) {
      shareText += greenSquare;
    } else {
      shareText += graySquare;
    }
  }
  return shareText;
};

export const SITE_URL = "https://pattukunte-pattucheera.netlify.app";

export const GAME_STATUS = {
  COMPLETED: "completed",
  FAILED: "failed",
  RUNNING: "running"
};

export const s3Bucket = "https://d2t2f7d530jwgo.cloudfront.net";

export function getTimeDifference(date) {
  var now = new Date();
  var dateNow = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    )
  );
  var diffSeconds = (date.getTime() - dateNow.getTime()) / 1000;
  const days = Math.floor(diffSeconds / (24 * 60 * 60));
  const hours = Math.floor((diffSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((diffSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(diffSeconds % 60);
  return { days: days, hours: hours, minutes: minutes, seconds: seconds };
}

export function getDayCount() {
  return 20;
  //return Math.abs(getTimeDifference(new Date("2022-05-24T00:00:14.000Z")).days);
}
export const intialGuessDistribution = new Array(MAX_ATTEMPTS).fill().reduce((acc, _, index) => {
  acc[index + 1] = 0;
  return acc;
}, {});
