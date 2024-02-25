import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/home");
  };

  return (
    <div className="w-8/12 md:w-1/3 m-auto py-3 text-primary dark:text-secondary">
      {" "}
      <button onClick={goBack}>
        <span className="flex items-center">
          <i className="fa-solid fa-left-long text-md"></i>{" "}
          <span className="underline ml-1 text-md">Go back</span>
        </span>
      </button>
    </div>
  );
};

export default BackButton;
