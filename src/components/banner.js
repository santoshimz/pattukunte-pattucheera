import React from "react";

const Banner = () => {
  const [bannerText, setBannerText] = React.useState(process.env.REACT_APP_BANNER);
  return (
    bannerText && (
      <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-l-4 border-blue-500 p-4 lg:p-5 rounded-lg shadow-md mb-6 lg:mb-8">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-blue-600 dark:text-blue-400 text-2xl lg:text-3xl">
            <i className="fa-solid fa-circle-info"></i>
          </span>
          <span
            className="banner-text text-sm lg:text-base text-slate-700 dark:text-slate-300 font-medium"
            dangerouslySetInnerHTML={{ __html: bannerText }}></span>
        </div>

        <button
          onClick={() => setBannerText("")}
          className="flex-shrink-0 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 hover:bg-white dark:hover:bg-slate-800 rounded">
          <span className="text-lg lg:text-xl">
            <i className="fa-solid fa-xmark"></i>
          </span>
        </button>
      </div>
    )
  );
};

Banner.propTypes = {};

export default Banner;
