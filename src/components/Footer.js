import React from "react";
import { FooterStyles } from "../styles/FooterStyles";
import { githubRepoLink } from "../utils/constants";

const Footer = () => {
  return (
    <div style={FooterStyles.footer} className="col-12 text-center">
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

Footer.propTypes = {};

export default Footer;
