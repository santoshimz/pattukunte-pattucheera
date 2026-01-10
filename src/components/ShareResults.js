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
        window.gtag("event", "twitter_share", { event_category: "social_share" });
        window.open(
          "https://twitter.com/intent/tweet?text=" +
            encodeURIComponent(
              composeShareText(gameStatus, dayCount, isTimeTravelled, currentIndex)
            ),
          "_blank"
        );
        break;
      case "facebook":
        window.gtag("event", "facebook_share", { event_category: "social_share" });
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=https://pattukunte-pattucheera.netlify.app/&quote=${encodeURIComponent(
            composeShareText(gameStatus, dayCount, isTimeTravelled, currentIndex)
          )}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.gtag("event", "whatsapp_share", { event_category: "social_share" });
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
    <div className="space-y-6 lg:space-y-8">
      {/* Next Game Timer */}
      {!isTimeTravelled && (
        <div className="card p-5 lg:p-6 text-center">
          <NextGameTimer />
        </div>
      )}

      {/* Share Button */}
      <div className="card p-5 lg:p-6 text-center">
        <ShareButton
          shareText={shareText}
          setShareText={setShareText}
          currentIndex={currentIndex}
          gameStatus={gameStatus}
          dayCount={dayCount}
          isTimeTravelled={isTimeTravelled}
        />
      </div>

      {/* Social Media Share Icons */}
      <div className="flex justify-center items-center gap-5 lg:gap-6">
        <button
          onClick={() => socialShare("twitter")}
          className="group hover:scale-110 transition-transform"
          title="Share on Twitter">
          <img
            className="w-13 lg:w-14 h-13 lg:h-14 p-2 lg:p-3 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-all shadow-md"
            src={twitterShare}
            alt="twitter-share"
          />
        </button>

        <button
          onClick={() => socialShare("whatsapp")}
          className="group hover:scale-110 transition-transform"
          title="Share on WhatsApp">
          <img
            className="w-13 lg:w-14 h-13 lg:h-14 p-2 lg:p-3 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-green-100 dark:group-hover:bg-green-900 transition-all shadow-md"
            src={whatsappShare}
            alt="whatsapp-share"
          />
        </button>

        <button
          onClick={() => socialShare("facebook")}
          className="group hover:scale-110 transition-transform"
          title="Share on Facebook">
          <img
            className="w-13 lg:w-14 h-13 lg:h-14 p-2 lg:p-3 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-all shadow-md"
            src={fbShare}
            alt="facebook-share"
          />
        </button>
      </div>
    </div>
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
