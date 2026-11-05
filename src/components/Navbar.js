import React from "react";
import Header from "./Header";
import GithubIcon from "./GithubIcon";
import Theme from "./Theme";
import UserProfile from "./UserProfile";

const Navbar = () => {
  return (
    <div className="pr-4 py-6">
      <Header />
      <UserProfile />
      <Theme />
      <GithubIcon />
    </div>
  );
};

export default Navbar;
