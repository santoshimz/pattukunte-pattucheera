import React, { useState } from "react";
import "./styles/App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TimeTravel from "./pages/TimeTravel";
import Banner from "./components/banner";
import { customStyles } from "./styles/styles";
import GuessTheMeme from "./components/GuessTheMeme";
import axios from "axios";

const App = () => {
  const [moviesList, setMoviesList] = React.useState([]);
  const [theme, setTheme] = React.useState("dark");

  // GTM
  const [memes, setMemes] = useState(null);
  const [memeToShow, setMemeToShow] = useState(Math.floor(Math.random() * 100));

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_CDN_URL}/movies.json`)
      .then((response) => response.json())
      .then((movies) => {
        if (movies && !movies.includes("Ashokavanam lo Arjuna Kalyanam")) {
          movies.push("Ashokavanam lo Arjuna Kalyanam");
        }
        if (movies && !movies.includes("Shivaji")) {
          movies.push("Shivaji");
        }
        if (movies && !movies.includes("Premikula Roju")) {
          movies.push("Premikula Roju");
        }
        setMoviesList(movies);
      })
      .catch((error) => console.log(error));

    // GTM
    // setIsLoading(true);
    async function getMemes() {
      const res = await axios.get("https://api.imgflip.com/get_memes");
      setMemes(res.data.data.memes);
      // setIsLoading(false);
    }
    getMemes();
  }, []);

  const reloadMeme = () => {
    setMemeToShow(Math.floor(Math.random() * 100));
  };
  let memeNames = [];
  if (memes) {
    memeNames = memes.map((meme) => {
      return meme.name;
    });
  }

  return (
    <div>
      {theme === "dark" && (
        <button
          onClick={() => {
            setTheme("light");
          }}
          alt="stats"
          style={customStyles.themeIcon}
          className="bg-transparent btn-ripple fs-30 material-symbols-outlined">
          light_mode
        </button>
      )}
      {theme === "light" && (
        <button
          onClick={() => {
            setTheme("dark");
          }}
          alt="stats"
          style={customStyles.themeIcon}
          className="bg-transparent btn-ripple fs-30 material-symbols-outlined">
          dark_mode
        </button>
      )}
      {process.env.REACT_APP_BANNER && <Banner />}
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/timetravel"
            element={<TimeTravel theme={theme} moviesList={moviesList} />}
          />
          <Route path="/*" element={<Home theme={theme} moviesList={moviesList} />} />
          <Route
            path="/gtm"
            element={
              memes && (
                <GuessTheMeme
                  theme={theme}
                  reloadMeme={reloadMeme}
                  meme={memes[memeToShow]}
                  memeNames={memeNames}
                />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
