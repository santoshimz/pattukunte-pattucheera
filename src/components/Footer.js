import React from "react";
import { FooterStyles } from "../styles/FooterStyles";
import { githubRepoLink } from "../utils/constants";
import PropTypes from "prop-types";

const Footer = ({ theme }) => {
  return (
    <div
      style={theme === "dark" ? FooterStyles.footer : FooterStyles.footerLight}
      className="col-12 text-center">
      <div className="mb-4 d-flex align-items-start justify-content-center">
        <span className="material-symbols-outlined new-icon" style={{ fontSize: "2rem" }}>
          new_releases
        </span>
        <span style={{ fontSize: "1.25rem" }} className="ml-1">
          Loved <strong className="app-name">Pattukunte Pattucheera</strong>? Want to explore more
          of our apps?{" "}
          <a href="https://guess-the-meme.vercel.app/" rel="noreferrer" target="_blank">
            click here!!
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
              open_in_new
            </span>
          </a>
        </span>
      </div>
      <span className="banner-text">
        We are opensource now! Want to contribute questions? Submit images through this{" "}
        <a href={process.env.REACT_APP_FormsLink}>forms</a> link
        <div>
          Want to contribute through code - here is our <a href={githubRepoLink}>github</a> repo{" "}
        </div>
      </span>
    </div>
  );
};

Footer.propTypes = {
  theme: PropTypes.string
};

export default Footer;
