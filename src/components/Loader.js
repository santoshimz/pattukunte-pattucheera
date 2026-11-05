import React from "react";

const Loader = () => {
  return (
    <div className="w-100 h-91vh bg-secondary dark:bg-primary flex items-center justify-center text-primary dark:text-secondary">
      <i className="fa-solid fa-spinner fa-spin-pulse text-4xl"></i>
    </div>
  );
};

export default Loader;
