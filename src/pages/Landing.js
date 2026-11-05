import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  GoogleAuthProvider,
  TwitterAuthProvider,
  getAdditionalUserInfo,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../components/Firebase";
import { Collections } from "../utils/constants";

const Landing = () => {
  const navigate = useNavigate();
  const [signInError, setSignInError] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    return onAuthStateChanged(auth, (user) => {
      if (user != null) {
        navigate("/home");
      }
    });
  }, []);

  const handleGoogleSignIn = () => {
    if (!isFirebaseConfigured || !auth) {
      setSignInError("Sign-in is unavailable in this environment.");
      return;
    }

    setSignInError("");
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        navigate("/home");
      })
      .catch(() => setSignInError("Google sign-in failed. Please try again."));
  };

  const handleTwitterSignIn = () => {
    if (!isFirebaseConfigured || !auth) {
      setSignInError("Sign-in is unavailable in this environment.");
      return;
    }

    setSignInError("");
    const provider = new TwitterAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // The @handle is only available right after sign-in, so save it now (best effort)
        const handle = getAdditionalUserInfo(result)?.username;
        if (handle && db) {
          try {
            await setDoc(
              doc(db, Collections.USER_COLLECTION, result.user.uid),
              { twitterHandle: handle },
              { merge: true }
            );
          } catch {
            // Not critical: sign-in still succeeds without the handle
          }
        }
        navigate("/home");
      })
      .catch(() => setSignInError("Twitter sign-in failed. Please try again."));
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
            You can still play the game without logging in. You just can&apos;t see the leaderboard
            if you don&apos;t login.
          </p>
          <p className="text-sm">
            If you don&apos;t want to login, click
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
          className="w-56 h-14 flex items-center justify-center border dark:border-slate-800 dark:bg-gray-900 border-gray-400 bg-slate-300 rounded"
          onClick={handleGoogleSignIn}>
          <i className="text-2xl w-fit text-gray-500 fa-brands fa-google"></i>
          <span className="ml-2">Continue with Google</span>
        </button>

        {/* twitter login/setup */}
        <button
          className="w-56 h-14 ml-4 flex items-center justify-center border dark:border-slate-800 dark:bg-gray-900 border-gray-400 bg-slate-300 rounded"
          onClick={handleTwitterSignIn}>
          <i className="text-2xl w-fit text-gray-500 fa-brands fa-twitter"></i>
          <span className="ml-2">Continue with Twitter</span>
        </button>
        {signInError && (
          <p role="alert" className="basis-full text-center text-red-600">
            {signInError}
          </p>
        )}
      </div>
    </div>
  );
};

export default Landing;
