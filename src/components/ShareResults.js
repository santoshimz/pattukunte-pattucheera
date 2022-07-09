import React from "react";
import { composeShareText } from "../utils/constants";
import PropTypes from "prop-types";
import twitterShare from "../assets/twitter.png";
import fbShare from "../assets/fb.png";
import whatsappShare from "../assets/whatsapp.png";
import NextGameTimer from "./NextGameTimer";
import ShareButton from "./ShareButton";
const ShareResults = ({
  shareText,
  setShareText,
  currentIndex,
  gameStatus,
  dayCount,
  isTimeTravelled
}) => {
  const socialShare = (app) => {
    switch (app) {
      case "twitter":
        window.open(
          "https://twitter.com/intent/tweet?text=" +
            encodeURIComponent(
              composeShareText(gameStatus, dayCount, isTimeTravelled, currentIndex)
            ),
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=https://pattukunte-pattucheera.netlify.app/&quote=${encodeURIComponent(
            composeShareText(gameStatus, dayCount, isTimeTravelled, currentIndex)
          )}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me?text=${encodeURIComponent(
            composeShareText(gameStatus, dayCount, isTimeTravelled, currentIndex)
          )}`,
          "_blank"
        );
        break;
    }
  };

  return (
    <>
      <div className="timer-wrapper">
        {!isTimeTravelled && (
          <div className="text-white">
            <NextGameTimer />
          </div>
        )}
        <ShareButton
          shareText={shareText}
          setShareText={setShareText}
          currentIndex={currentIndex}
          gameStatus={gameStatus}
          dayCount={dayCount}
          isTimeTravelled={isTimeTravelled}
        />
      </div>
      <div className="social-icons">
        <img
          className="social twitter-icon"
          onClick={() => socialShare("twitter")}
          src={twitterShare}
          alt="twitter-share"
        />

        <img
          className="social wa-icon"
          onClick={() => socialShare("whatsapp")}
          src={whatsappShare}
          alt="whatsapp-share"
        />

        <img
          className="social facebook-icon"
          onClick={() => socialShare("facebook")}
          src={fbShare}
          alt="facebook-share"
        />
      </div>
    </>
  );
};

ShareResults.propTypes = {
  shareText: PropTypes.string,
  setShareText: PropTypes.func,
  currentIndex: PropTypes.number,
  gameStatus: PropTypes.string,
  dayCount: PropTypes.number,
  isTimeTravelled: PropTypes.bool
};

export default ShareResults;
