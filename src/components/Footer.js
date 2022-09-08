import React from "react";
import { FooterStyles } from "../styles/FooterStyles";
import { githubRepoLink } from "../utils/constants";
import PropTypes from "prop-types";

const Footer = ({ theme }) => {
  return (
    <div
      style={theme === "dark" ? FooterStyles.footer : FooterStyles.footerLight}
      className="col-12 text-center">
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
