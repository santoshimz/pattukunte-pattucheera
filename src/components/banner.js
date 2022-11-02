import React from "react";

const Banner = () => {
  const [bannerText, setBannerText] = React.useState(process.env.REACT_APP_BANNER);
  return (
    bannerText && (
      <div className="row">
        <div className="text-center">
          <span className="material-symbols-outlined">info</span>
          <span className="banner-text" dangerouslySetInnerHTML={{ __html: bannerText }}></span>
        </div>

        <div className="">
          <button onClick={() => setBannerText("")}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
    )
  );
};

Banner.propTypes = {};

export default Banner;
