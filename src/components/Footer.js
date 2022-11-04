import React from "react";
// import { githubRepoLink } from "../utils/constants";

const Footer = () => {
  return (
    <div className="w-full text-center text-black dark:text-white">
      <span className="mb-3">
        We are opensource now! Want to contribute questions? Submit images through this{" "}
        <a className="underline text-blue-600" href={process.env.REACT_APP_FormsLink}>
          forms
        </a>{" "}
        link
        {/* <div>
          Want to contribute through code - here is our{" "}
          <a className="underline text-blue-600" href={githubRepoLink}>
            github
          </a>{" "}
          repo{" "}
        </div> */}
      </span>
    </div>
  );
};

Footer.propTypes = {};

export default Footer;
