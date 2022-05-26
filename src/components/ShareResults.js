import React from "react";
import { customStyles } from "../styles/styles";
import { dayCount } from "../utils/constants";
import PropTypes from "prop-types";

const ShareResults = ({ shareText, setShareText, currentIndex }) => {
  const copyText = () => {
    let str = `Pattukunte Pattucheera Day ${
      dayCount + 1
    }: ${currentIndex}/5\nhttps://pattukunte-pattucheera.netlify.app/\n#PattukuntePattuCheera`;
    navigator.clipboard.writeText(str);
    setShareText("COPIED");
  };

  return (
    <button style={customStyles.shareText} onClick={copyText}>
      {shareText}
    </button>
  );
};

ShareResults.propTypes = {
  shareText: PropTypes.string,
  setShareText: PropTypes.func,
  currentIndex: PropTypes.number
};

export default ShareResults;
