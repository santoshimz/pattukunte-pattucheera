import React from "react";

const Footer = () => {
  return (
    <div className="w-full text-center text-primary dark:text-secondary">
      <span className="mb-3">
        We are opensource now! Want to contribute questions? Submit images through this{" "}
        <a className="underline text-blue-600" href={process.env.REACT_APP_FormsLink}>
          forms
        </a>{" "}
        link
      </span>
    </div>
  );
};

Footer.propTypes = {};

export default Footer;
