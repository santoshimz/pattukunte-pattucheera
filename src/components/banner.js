import React from "react";
import { bannerStyles } from "../styles/bannerStyles";

const Banner = () => {
  const [bannerText, setBannerText] = React.useState(process.env.REACT_APP_BANNER);
  return (
    bannerText && (
      <div style={bannerStyles.banner} className="row">
        <div className="col-xs-10 text-center">
          <span style={bannerStyles.infoIcon} className="material-symbols-outlined">
            info
          </span>
          {bannerText}
        </div>

        <div className="">
          <button style={bannerStyles.closeIcon} onClick={() => setBannerText("")}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
    )
  );
};

Banner.propTypes = {};

export default Banner;
