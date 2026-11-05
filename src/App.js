import React from "react";
import "./styles/App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TimeTravel from "./pages/TimeTravel";
import Banner from "./components/banner";
import { missingMovies } from "./utils/constants";
import Landing from "./pages/Landing";
import LeaderBoard from "./pages/LeaderBoard";

const fabBtn = {
  // border-radius: 50%;
  backgroundImage: `url(
    https://d2t2f7d530jwgo.cloudfront.net/bm.gif
  )`,
  backgroundPosition: "-12px",
  cursor: "pointer"
  // width: 90px;
  // height: 90px;
  // position: sticky;
  // left: 80%;
  // top: 80%;
};

const App = () => {
  const [moviesList, setMoviesList] = React.useState([]);
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
    <>
      <div id="content" className="relative bg-secondary dark:bg-primary pb-3">
        <div className="fixed left-3/4 md:left-90 top-85 w-20 h-20 rounded-full">
          {showUploadIcon && (
            <>
              <a
                className="absolute bottom-24 right-3"
                href={process.env.REACT_APP_FormsLink}
                target="__blank">
                <i className="fas fa-upload bg-green-500 px-3 py-2 rounded-full text-xl text-secondary dark:text-primary"></i>
              </a>

              <p className="text-primary dark:text-secondary font-semibold absolute bottom-36 right-[-0.15rem] text-xs text-center bg-transparentBg px-2 py-1 rounded">
                upload movies
              </p>
            </>
          )}
          {/* <i
            className="fas fa-plus-circle text-5xl text-red-500 cursor-pointer"
            onClick={() => {
              setShowUploadIcon(!showUploadIcon);
            }}></i> */}
          <div
            onClick={() => {
              setShowUploadIcon(!showUploadIcon);
              window.gtag("event", "UploadClicked", { event_category: "game-stats" });
            }}
            className="w-full h-full rounded-full"
            style={fabBtn}></div>
        </div>
        {process.env.REACT_APP_BANNER && <Banner />}
        <BrowserRouter>
          <Routes>
            <Route exact path="/timetravel" element={<TimeTravel moviesList={moviesList} />} />
            <Route path="/home" element={<Home moviesList={moviesList} />} />
            <Route path="/*" element={<Landing />} />
            <Route exact path="/leaderboard" element={<LeaderBoard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};

export default App;
