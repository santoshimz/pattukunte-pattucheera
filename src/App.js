import React from "react";
import "./styles/App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TimeTravel from "./pages/TimeTravel";
import Banner from "./components/banner";

const App = () => {
  return (
    <div>
      {process.env.REACT_APP_BANNER && <Banner />}
      <BrowserRouter>
        <Routes>
          <Route exact path="/timetravel" element={<TimeTravel />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
