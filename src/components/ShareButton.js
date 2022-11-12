import React from "react";
import { composeShareText } from "../utils/constants";
import PropTypes from "prop-types";

const ShareButton = ({
  shareText,
  setShareText,
  currentIndex,
  gameStatus,
  dayCount,
  isTimeTravelled
}) => {
  const copyText = async () => {
    window.gtag("event", "share_clicked", { event_category: "share_clicked" });
    if (navigator.share) {
      const shareData = {
        title: "Pattukunte PattuCheera",
        text: composeShareText(gameStatus, dayCount, isTimeTravelled, currentIndex)
      };
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log(err);
      }
    } else {
      let str = composeShareText(gameStatus, dayCount, isTimeTravelled, currentIndex);
      navigator.clipboard.writeText(str);
      setShareText("COPIED");
    }
  };
  return (
    <>
      <button
        className="px-4 py-1.5 rounded-sm bg-green-500 border-green-500 mx-auto mb-4 text-secondary"
        onClick={copyText}>
        {shareText}
      </button>
    </>
  );
};

ShareButton.propTypes = {
  shareText: PropTypes.string,
  setShareText: PropTypes.func,
  currentIndex: PropTypes.number,
  gameStatus: PropTypes.string,
  dayCount: PropTypes.number,
  isTimeTravelled: PropTypes.bool
};

export default ShareButton;
