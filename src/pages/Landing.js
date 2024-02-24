import React, { useEffect } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../components/Firebase";

const Landing = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    if (auth?.currentUser != null) {
      navigate("/home");
    }
  }, []);

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log({ credential, token, user });
        navigate("/home");
      })
      .catch((error) => {
        // Handling Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.error({ errorCode, email, credential, errorMessage });
      });
  };

  return (
    <div className="w-100 h-screen">
      <div className="py-8">
        <Header />
      </div>
      <div className="w-full h-60vh flex flex-wrap items-center justify-center content-center bg-secondary dark:bg-primary dark:text-white">
        {/* cont without login */}
        <div className="basis-full text-center mb-8">
          <p className="text-2xl italic">Introducing new feature - Leader Board 🎉</p>
          <p>
            <br />
            You can still play the game without logging in. You jst cant see the leaderboard if u
            dont login.
          </p>
          <p className="text-sm">
            If you dont want to login, click
            <span
              className="cursor-pointer text-blue-500"
              onClick={() => {
                navigate("/home");
              }}>
              {" "}
              here
            </span>
            !!!
          </p>
        </div>

        {/* Google login/signup */}
        <button
          className="w-56 h-14 flex items-center justify-center border dark:border-slate-800 dark:bg-slate-700 border-slate-400 bg-slate-300 rounded"
          onClick={handleGoogleSignIn}>
          <i className="text-2xl w-fit text-gray-500 fa-brands fa-google"></i>
          <span className="ml-2">Continue with Google</span>
        </button>

        {/* twitter login/setup */}
        <button className="w-56 h-14 ml-4 flex items-center justify-center border dark:border-slate-800 dark:bg-slate-700 border-slate-400 bg-slate-300 rounded">
          <i className="text-2xl w-fit text-gray-500 fa-brands fa-twitter"></i>
          <span className="ml-2">Continue with Twitter</span>
        </button>
      </div>
    </div>
  );
};

export default Landing;
