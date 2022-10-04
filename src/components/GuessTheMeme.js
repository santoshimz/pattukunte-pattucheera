import React, { useState } from "react";
import { Button, styled, Tooltip, Autocomplete, TextField, Paper } from "@mui/material";
import Confetti from "react-dom-confetti";
import PropTypes from "prop-types";
import { customStyles } from "../styles/styles";
import twitterShare from "../assets/twitter.png";
import fbShare from "../assets/fb.png";
import github from "../assets/github.png";
import githubLight from "../assets/github-light.png";
// import AsyncSelect from "react-select/async";

// import success from "../images/success.gif";
// import failure from "../images/failure.gif";

const MyButton = styled(Button)({
  marginTop: "1rem",
  marginRight: "1rem",
  ":disabled": {
    background: "#3c3c3c",
    opacity: 0.6,
    color: "#767776"
  }
});

const CustomPaper = (props) => {
  return <Paper style={{ background: "#3c3c3c", color: "#f3f3f3" }} elevation={8} {...props} />;
};

const StyledTextField = styled(TextField)`
  color: #1976d1;
  & .MuiAtuocomplete-popper {
    background: red;
  }
  & .MuiInputBase-root.MuiOutlinedInput-root.Mui-disabled {
    background: #3c3c3c;
    opacity: 0.6;
  }
  & .MuiFormLabel-root.Mui-disabled {
    color: #767776;
    opacity: 0.6;
  }
  & .MuiButtonBase-root.Mui-disabled svg {
    color: #767776;
    opcaity: 0.6;
  }
  & .MuiFormLabel-root {
    color: #1976d1;
  }
  & .MuiInputBase-input {
    color: #1976d1;
  }

  & label.Mui-focused {
    color: #1976d1;
  }
  & .MuiInput-underline:after {
    border-bottom-color: #1976d1;
  }
  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: #1976d1;
    }
    &:hover fieldset {
      border-color: #1976d1;
    }
    &.Mui-focused fieldset {
      border-color: #1976d1;
    }
    & .MuiSvgIcon-root {
      color: #1976d1;
    }
  }
`;

const MAX_COUNT = 5;
const GuessTheMeme = ({ meme, memeNames, reloadMeme, theme }) => {
  const config = {
    angle: "180",
    spread: 300,
    startVelocity: "30",
    elementCount: 70,
    dragFriction: 0.12,
    duration: "5000",
    stagger: "2",
    width: "10px",
    height: "10px",
    perspective: "900px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };

  const [memeName, setMemeName] = useState(null);
  const [showConfetti, setShowConfetti] = useState(null);
  const [count, setCount] = useState(0);
  const [showRefresh, setShowRefresh] = useState(false);
  const [showStatus, setShowStatus] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [alert, setAlert] = useState(null);

  const onChange = (e, newValue) => {
    const guessedMemeName = newValue;
    setMemeName(guessedMemeName);
    if (memeName !== "" || !memeName) {
      setAlert(null);
    }
  };

  const onClick = () => {
    if (memeName === "" || !memeName) {
      setAlert({ msg: "Please enter something", type: "danger" });
      return;
    }
    setCount(count + 1);
    if (count + 1 === MAX_COUNT) {
      setShowRefresh(true);
    }

    if (memeName === meme.name) {
      setShowConfetti(true);
      setShowStatus([...showStatus, true]);
      setShowRefresh(true);
      setIsCorrect(true);
      setTimeout(() => {
        setShowConfetti(null);
      }, 3000);
    } else {
      setShowStatus([...showStatus, false]);
      setIsCorrect(false);
    }
    setMemeName(null);
  };

  return (
    <div
      className="d-flex flex-column vh-100"
      style={theme === "dark" ? customStyles.backgroundStyle : customStyles.backgroundStyleLight}>
      <h3
        className="text-3xl text-center my-2"
        style={{ color: theme === "dark" ? "white" : "black" }}>
        Guess-The-Meme
      </h3>
      {alert && (
        <p
          className="p-3 w-100 bg-danger rounded mt-3 d-block text-xl"
          style={{ color: theme === "dark" ? "white" : "black" }}>
          {alert.msg}
        </p>
      )}
      {meme && (
        <img className="h-50 w-98 d-block d-sm-none mx-auto py-2" src={meme?.url} alt="meme here" />
      )}
      {meme && (
        <img className="h-50 d-none d-sm-block mx-auto py-2" src={meme?.url} alt="meme here" />
      )}
      {(count !== 0 || showRefresh) && (
        <div className="mx-auto mt-2">
          {(() => {
            const statuses = [];
            showStatus.forEach((status) => {
              const key = Math.random();
              status
                ? statuses.push(
                    <i
                      key={key}
                      style={{ color: "green", fontSize: "2.25rem" }}
                      className="fa-solid fa-square-check mx-2"></i>
                  )
                : statuses.push(
                    <i
                      key={key}
                      className="fa-solid fa-square-xmark mx-2"
                      style={{ color: "red", fontSize: "2.25rem" }}></i>
                  );
            });
            return statuses;
          })()}
        </div>
      )}
      {showRefresh && isCorrect && (
        <div
          className="w-100 mx-auto text-center"
          style={{ fontSize: "1.15rem", color: theme === "dark" ? "white" : "black" }}>
          {(count === 1 || count === 2) && (
            <p>
              Hurray!!! 🎉 You guessed it in {count} out of {MAX_COUNT} guesses 🥳
            </p>
          )}
          {count === 3 && (
            <p>
              Hmmm!!! 🤔💭 Not Bad, You guessed it in {count} out of {MAX_COUNT} guesses{" "}
            </p>
          )}
          {count === 4 && (
            <p>
              That was closeee!!!! 😮 You got it on {count} th guess out of {MAX_COUNT} guesses{" "}
            </p>
          )}
          {count === 5 && <p>Phew!!! 😮‍💨 You got it on the last chance</p>}
          <p className="my-2">
            It is{" "}
            <strong style={{ color: "green" }} className="text-md">
              {meme.name}
            </strong>{" "}
            indeed!!!
          </p>
        </div>
      )}
      {showRefresh && !isCorrect && (
        <div
          className="w-100 mx-auto text-center mt-3"
          style={{ fontSize: "1.15rem", color: theme === "dark" ? "white" : "black" }}>
          {count === 5 && (
            <>
              <p>Its okay 😓. You are not alone 🤗. Try again!!!!</p>
              <p className="my-2">
                Btw, it is{" "}
                <strong style={{ color: "green" }} className="text-md">
                  {meme.name}
                </strong>{" "}
              </p>
            </>
          )}
        </div>
      )}
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        autoSelect={true}
        className="mx-auto mt-3"
        options={memeNames}
        sx={{ width: 300 }}
        disabled={showRefresh}
        PaperComponent={CustomPaper}
        renderInput={(params) => <StyledTextField error={!!alert} {...params} label="Meme Name" />}
        value={memeName}
        onChange={onChange}
      />
      {/* <AsyncSelect
        placeholder="Enter meme caption here"
        cacheOptions
        defaultValue={false}
        className="mx-auto mt-3"
        value={memeName}
        disabled={showRefresh}
        getOptionLabel={(e) => e.name}
        getOptionValue={(e) => e.name}
        loadOptions={memeNames}
        onChange={onChange}
      /> */}
      <Confetti
        className="block mx-auto"
        style={{ width: "fit-content" }}
        active={showConfetti}
        config={config}
      />
      <div className="d-flex justify-content-center">
        <MyButton
          color="primary"
          size="medium"
          variant="contained"
          onClick={onClick}
          disabled={showRefresh}>
          Submit
        </MyButton>
        {showRefresh && (
          <MyButton
            color="primary"
            size="medium"
            variant="outlined"
            onClick={() => {
              setCount(0);
              reloadMeme();
              setShowStatus([]);
              setShowRefresh(false);
            }}>
            Reload
          </MyButton>
        )}
      </div>
      <Tooltip title="You have 5 chances to guess the meme. Submit your guesses in the textfeild below :)">
        <i
          style={{ color: theme === "dark" ? "white" : "black" }}
          className="fa-solid fa-circle-info text-xl opacity-80 position-absolute "></i>
      </Tooltip>
      {/* <div className="w-full my-4 flex justify-center">
        {isCorrect && showRefresh && (
          <img width={120} height={100} src={success} alt="success" />
        )}
        {!isCorrect && showRefresh && (
          <img width={170} height={150} src={failure} alt="failure" />
        )}
      </div> */}
      <div className="footer w-full d-flex justify-content-center mt-auto align-items-center">
        <p className="text-xl mb-0" style={{ color: theme === "dark" ? "white" : "black" }}>
          Follow :{" "}
        </p>
        <a href="https://twitter.com/14491Yashu" target="_blank" rel="noreferrer">
          <img
            className="social twitter-icon"
            src={twitterShare}
            alt="twitter"
            style={{ height: "30px", width: "30px" }}
          />
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=100011492925176"
          target="_blank"
          rel="noreferrer">
          {" "}
          <img
            className="social facebook-icon"
            src={fbShare}
            alt="facebook"
            style={{ height: "30px", width: "30px" }}
          />
        </a>
        <a href="https://github.com/yashu183" target="_blank" rel="noreferrer">
          {" "}
          {theme == "light" && (
            <img
              className="social github-icon"
              src={github}
              alt="github"
              style={{ height: "30px", width: "30px" }}
            />
          )}
          {theme == "dark" && (
            <img
              className="social github-icon"
              src={githubLight}
              alt="github"
              style={{ height: "30px", width: "30px" }}
            />
          )}
        </a>
      </div>
    </div>
  );
};

export default GuessTheMeme;

GuessTheMeme.propTypes = {
  meme: PropTypes.object,
  reloadMeme: PropTypes.func,
  memeNames: PropTypes.array,
  theme: PropTypes.string
};
