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
    fetch(`${process.env.REACT_APP_CDN_URL}/movies.json`)
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
    <div id="content">
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
