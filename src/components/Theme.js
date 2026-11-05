import React from "react";

const Theme = () => {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark"
  );

  return (
    <>
      {theme === "dark" && (
        <button
          onClick={() => {
            localStorage.setItem("theme", "light");
            setTheme("light");
            document.querySelector("html").classList.remove("dark");
          }}
          alt="stats"
          className="bg-transparent material-symbols-outlined absolute text-gray-500 z-1 top-[2.8%] right-[19%] md:right-[9%] xl:right-[6.5%]">
          light_mode
        </button>
      )}
      {theme === "light" && (
        <button
          onClick={() => {
            localStorage.setItem("theme", "dark");
            setTheme("dark");
            document.querySelector("html").classList.add("dark");
          }}
          alt="stats"
          className="bg-transparent material-symbols-outlined absolute text-gray-500 z-1 top-[2.8%] right-[19%] md:right-[9%] xl:right-[6.5%]">
          dark_mode
        </button>
      )}
    </>
  );
};

export default Theme;
