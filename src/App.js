import React from "react";
import "./styles/App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TimeTravel from "./pages/TimeTravel";
import Banner from "./components/banner";
import { missingMovies } from "./utils/constants";

const App = () => {
  const [moviesList, setMoviesList] = React.useState([]);
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark"
  );
  const [showUploadIcon, setShowUploadIcon] = React.useState(false);
  React.useEffect(() => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "dark");
      document.querySelector("html").classList.add("dark");
    } else {
      if (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.querySelector("html").classList.add(localStorage.getItem("theme"));
      }
    }
    fetch(`${process.env.REACT_APP_S3}/movies.json`)
      .then((response) => response.json())
      .then((movies) => {
        const moviesSet = new Set(movies);
        missingMovies.forEach((mv) => {
          if (!moviesSet.has(mv)) {
            movies.push(mv);
          }
        });
        setMoviesList(movies);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div id="content" className="relative">
      <div className="absolute bottom-0 right-0 mr-3 mb-3">
        {showUploadIcon && (
          <>
            <a className="absolute bottom-16 right-3" href={process.env.REACT_APP_FormsLink}>
              <i className="fas fa-upload bg-green-500 px-3 py-2 rounded-full text-xl text-secondary dark:text-primary"></i>
            </a>

            <p className="text-primary dark:text-secondary absolute bottom-20 right-16 text-xs w-10">
              upload movies
            </p>
          </>
        )}
        <i
          className="fas fa-plus-circle text-5xl text-red-500 cursor-pointer"
          onClick={() => {
            setShowUploadIcon(!showUploadIcon);
          }}></i>
      </div>
      {theme === "dark" && (
        <button
          onClick={() => {
            localStorage.setItem("theme", "light");
            setTheme("light");
            document.querySelector("html").classList.remove("dark");
          }}
          alt="stats"
          className="bg-transparent material-symbols-outlined absolute text-gray-500 z-1 top-[2.5%] right-[2%]">
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
          className="bg-transparent material-symbols-outlined absolute text-gray-500 z-1 top-[2.5%] right-[2%]">
          dark_mode
        </button>
      )}
      {process.env.REACT_APP_BANNER && <Banner />}
      <BrowserRouter>
        <Routes>
          <Route exact path="/timetravel" element={<TimeTravel moviesList={moviesList} />} />
          <Route path="/*" element={<Home moviesList={moviesList} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
