import React from "react";
import PropTypes from "prop-types";
import { bannerStyles } from "../styles/bannerStyles";
import { BANNER_TEXT } from "../utils/constants";

const Banner = ({ banner, setBanner }) => {
  return (
    banner && (
      <div style={bannerStyles.banner} className="row">
        <div className="col-xs-10 text-center">
          <span style={bannerStyles.infoIcon} className="material-symbols-outlined">
            info
          </span>
          {BANNER_TEXT}
        </div>

        <div className="">
          <button style={bannerStyles.closeIcon} onClick={() => setBanner(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
    )
  );
};

Banner.propTypes = {
  banner: PropTypes.boolean,
  setBanner: PropTypes.func
};

export default Banner;
