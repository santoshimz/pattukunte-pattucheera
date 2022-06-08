export const ALGOLIA_CLIENT = "6be0576ff61c053d5f9a3225e2a90f76";

export const MOVIE_NAME = "Brochevarevarura";

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

export const dayCount = 16;

export const GAME_STATUS = {
  COMPLETED: "completed",
  FAILED: "failed",
  RUNNING: "running"
};
