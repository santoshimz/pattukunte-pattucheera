import React from "react";
import "./styles/App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TimeTravel from "./pages/TimeTravel";
import Banner from "./components/banner";
import { customStyles } from "./styles/styles";

const App = () => {
  const [moviesList, setMoviesList] = React.useState([]);
  const [theme, setTheme] = React.useState("dark");
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
  }, []);

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
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
