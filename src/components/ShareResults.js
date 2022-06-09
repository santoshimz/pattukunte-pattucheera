import React from "react";
import { customStyles } from "../styles/styles";
import { getDayCount, getShareText, SITE_URL } from "../utils/constants";
import PropTypes from "prop-types";
import twitterShare from "../assets/twitter.png";
import fbShare from "../assets/fb.png";
import whatsappShare from "../assets/whatsapp.png";
import NextGameTimer from "./NextGameTimer";
const ShareResults = ({ shareText, setShareText, currentIndex, gameStatus }) => {
  const copyText = () => {
    let str = composeShareText();
    navigator.clipboard.writeText(str);
    setShareText("COPIED");
  };

  const composeShareText = () => {
    return `Pattukunte Pattucheera Day ${getDayCount()}: ${currentIndex}/5\n\n${getShareText(
      currentIndex,
      gameStatus
    )}\n\n${SITE_URL}\n#PattukuntePattuCheera`;
  };

  const socialShare = (app) => {
    switch (app) {
      case "twitter":
        window.open(
          "https://twitter.com/intent/tweet?text=" + encodeURIComponent(composeShareText()),
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=https://pattukunte-pattucheera.netlify.app/&quote=${encodeURIComponent(
            composeShareText()
          )}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(`https://wa.me?text=${encodeURIComponent(composeShareText())}`, "_blank");
        break;
    }
  };

  return (
    <>
      <div className="timer-wrapper">
        <NextGameTimer />
        <button style={customStyles.shareText} onClick={copyText}>
          {shareText}
        </button>
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
  gameStatus: PropTypes.string
};

export default ShareResults;
