import React, { useEffect, useState } from "react";
import { auth } from "./Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser != null) {
      setCurrentLoggedInUser(auth.currentUser);
    }
    return onAuthStateChanged(auth, (user) => {
      setCurrentLoggedInUser(user);
    });
  }, [auth]);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut(auth);
    setIsLoading(false);
  };

  const navigetToLandingPage = () => {
    navigate("/");
  };

  return (
    <div className="absolute z-5 top-[1.5%] right-[2%] group">
      {currentLoggedInUser != null ? (
        <img
          className="w-12 h-12 rounded-full cursor-pointer"
          src={currentLoggedInUser.photoURL}
          alt={currentLoggedInUser.displayName}
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-circle-user-round text-primary dark:text-secondary w-12 h-12">
          <path d="M18 20a6 6 0 0 0-12 0" />
          <circle cx="12" cy="10" r="4" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      )}
      <ul className="hidden absolute right-[2%] w-52 dark:text-secondary text-primary list-none text-center group-hover:block dark:bg-slate-800 bg-zinc-100 py-4 px-2 top-[102%] rounded">
        <li>
          Hi,{" "}
          {currentLoggedInUser?.displayName != null
            ? currentLoggedInUser.displayName
                .split(" ")
                .map((name) => {
                  return name[0].toUpperCase() + name.substring(1);
                })
                .join(" ")
            : "Guest User"}
        </li>
        {currentLoggedInUser != null ? (
          <li>
            {isLoading ? (
              <i className="animate-pulse" data-lucide="more-horizontal"></i>
            ) : (
              <button
                className="w-full py-2 cursor-pointer mt-3 hover:bg-zinc-200 dark:hover:bg-gray-700 rounded"
                onClick={handleSignOut}>
                Sign out
              </button>
            )}
          </li>
        ) : (
          <button
            className="w-full py-2 cursor-pointer mt-3 hover:bg-zinc-200 dark:hover:bg-gray-700 rounded"
            onClick={navigetToLandingPage}>
            Wanna SignIn?
          </button>
        )}
      </ul>
    </div>
  );
};

export default UserProfile;
