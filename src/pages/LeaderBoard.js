import React, { useEffect, useState } from "react";
import { auth, db } from "../components/Firebase";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { getDocs, query, orderBy, limit, collection } from "firebase/firestore";
import { Collections } from "../utils/constants";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { onAuthStateChanged } from "firebase/auth";

const LeaderBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const [users, setUsers] = useState([]);
  const [currentProperty, setCurrentProperty] = useState("currentStreak");
  const [currentSortOrder, setCurrentSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const crownSizes = [32, 28, 24];
  const crownColors = ["text-gold", "text-silver", "text-bronze"];

  useEffect(async () => {
    setIsLoading(true);
    try {
      // Once loggedIn, try getting the stats for the current loggedIn user
      await fetchUsersData(currentProperty, currentSortOrder);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }

    return onAuthStateChanged(auth, (user) => {
      if (user == null) {
        navigate("/home");
      }
    });
  }, [currentProperty, currentSortOrder]);

  const handleSortChange = async (fieldName) => {
    var sortOrder = "";

    if (fieldName === currentProperty) {
      setCurrentSortOrder((sortOrder) => {
        if (sortOrder == "desc") {
          sortOrder = "asc";
          return "asc";
        }
        sortOrder = "desc";
        return "desc";
      });
    }
    setCurrentProperty(fieldName);
    console.log(currentSortOrder, sortOrder);
    // await fetchUsersData(fieldName, sortOrder);
  };

  const fetchUsersData = async (fieldName, sortOrder) => {
    const statsRef = collection(db, Collections.STATS_COLLECTION);
    const statsQuery = query(
      statsRef,
      // where
      orderBy(fieldName, sortOrder),
      limit(10)
    );
    var statsSnapshot = await getDocs(statsQuery);
    var usersList = [];
    statsSnapshot.forEach((stats) => {
      usersList.push({ ...stats.data(), userId: stats.id });
    });
    setUsers(usersList);
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <BackButton />
          <div className="2xl:w-9/12 xl:w-10/12 w-11/12 h-87vh text-primary dark:text-secondary m-auto">
            <h1 className="text-center italic text-3xl py-3">Leader Board !!</h1>
            <div className="relative rounded shadow">
              {/* Dropdown */}
              <div className="relative inline-block text-left mb-4 sm:block md:hidden">
                <div>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-1.5 rounded bg-white px-5 py-3 text-sm font-semibold ring-1 ring-inset dark:ring-gray-800 ring-gray-200 bg-gray-50 dark:bg-gray-900 dark:text-secondary"
                    id="menu-button"
                    onClick={() => {
                      setShowDropdown((showDropDown) => !showDropDown);
                    }}>
                    Sort by property
                    <svg
                      className="-mr-1 h-5 w-5 text-primary dark:text-secondary"
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div
                  className={`absolute left-0 z-10 mt-2 w-full md:w-56 origin-top-right rounded shadow-lg dark:ring-gray-800 ring-gray-200 bg-gray-50 dark:bg-gray-900 text-primary dark:text-secondary ring-opacity-5 focus:outline-none ${
                    showDropdown ? "block" : "hidden"
                  }`}
                  role="menu">
                  <div className="py-1" role="none">
                    <div
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer hover:dark:bg-gray-800"
                      role="menuitem"
                      id="menu-item-0"
                      onClick={() => {
                        handleSortChange("currentStreak");
                        setShowDropdown((showDropdown) => !showDropdown);
                      }}>
                      Current Streak
                    </div>
                    <div
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer hover:dark:bg-gray-800"
                      role="menuitem"
                      id="menu-item-1"
                      onClick={() => {
                        handleSortChange("maxStreak");
                        setShowDropdown((showDropdown) => !showDropdown);
                      }}>
                      Max Streak
                    </div>
                    <div
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer hover:dark:bg-gray-800"
                      role="menuitem"
                      id="menu-item-2"
                      onClick={() => {
                        handleSortChange("score");
                        setShowDropdown((showDropdown) => !showDropdown);
                      }}>
                      Score
                    </div>
                  </div>
                </div>
              </div>
              <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
                  <tr className="h-16">
                    <th scope="col" className="px-4 py-1.5 md:px-6 md:py-4 text-center">
                      #
                    </th>
                    <th scope="col" className="px-4 py-1.5 md:px-6 md:py-4">
                      User
                    </th>
                    {/* Current Streak */}
                    <th
                      scope="col"
                      className={`px-4 py-1.5 md:px-6 md:py-4 cursor-pointer ${
                        currentProperty === "currentStreak"
                          ? "md:dark:text-white md:dark:bg-slate-900 md:bg-gray-300"
                          : "max-md:hidden"
                      }`}
                      onClick={() => handleSortChange("currentStreak")}>
                      <div className="flex items-center justify-center">
                        Current Streak
                        <svg
                          className="w-3 h-3 ms-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24">
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </div>
                    </th>
                    {/* Max Streak */}
                    <th
                      scope="col"
                      className={`px-4 py-1.5 md:px-6 md:py-4 cursor-pointer ${
                        currentProperty === "maxStreak"
                          ? "md:dark:text-white md:dark:bg-slate-900 md:bg-gray-300"
                          : "max-md:hidden"
                      }`}
                      onClick={() => handleSortChange("maxStreak")}>
                      <div className="flex items-center justify-center">
                        Max Streak
                        <svg
                          className="w-3 h-3 ms-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24">
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </div>
                    </th>
                    {/* Score */}
                    <th
                      scope="col"
                      className={`px-4 py-1.5 md:px-6 md:py-4 cursor-pointer ${
                        currentProperty === "score"
                          ? "md:dark:text-white md:dark:bg-slate-900 md:bg-gray-300"
                          : "max-md:hidden"
                      }`}
                      onClick={() => handleSortChange("score")}>
                      <div className="flex items-center justify-center">
                        Score
                        <svg
                          className="w-3 h-3 ms-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24">
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    return (
                      <tr
                        key={index}
                        className={`border-b dark:border-gray-700 odd:bg-white odd:dark:bg-gray-800 even:bg-gray-100 even:dark:bg-gray-700 bg-white dark:bg-gray-700 ${
                          user.userId == auth.currentUser.uid ? "scale-102" : ""
                        }`}>
                        <th
                          scope="col"
                          className="px-4 py-1.5 md:px-6 md:py-4 font-medium text-md text-gray-900 whitespace-nowrap dark:text-white text-center">
                          {index < 3 ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={crownSizes[index]}
                              height={crownSizes[index]}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`lucide lucide-crown ${crownColors[index]} m-auto`}>
                              <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                            </svg>
                          ) : (
                            `#${index + 1}`
                          )}
                        </th>
                        <th
                          scope="col"
                          className="flex flex-wrap items-center justify-start px-6 py-4 px-4 py-1.5 md:px-6 md:py-4 text-gray-900 whitespace-nowrap dark:text-white">
                          <img className="w-12 h-12 rounded-full" src={user.profilePic} alt="DP" />
                          <div className="ps-3">
                            <div className="text-base font-semibold">
                              {user.displayName
                                .split(" ")
                                .map((name) => {
                                  return name[0].toUpperCase() + name.substring(1);
                                })
                                .join(" ")}
                            </div>
                          </div>
                        </th>
                        <td
                          className={`px-4 py-1.5 md:px-6 md:py-4 text-primary dark:text-secondary text-center ${
                            currentProperty === "currentStreak"
                              ? "md:dark:text-white md:dark:bg-slate-900 md:bg-gray-300"
                              : "max-md:hidden"
                          }`}>
                          {user.currentStreak}
                        </td>
                        <td
                          className={`px-4 py-1.5 md:px-6 md:py-4 text-primary dark:text-secondary text-center ${
                            currentProperty === "maxStreak"
                              ? "md:dark:text-white md:dark:bg-slate-900 md:bg-gray-300"
                              : "max-md:hidden"
                          }`}>
                          {user.maxStreak}
                        </td>
                        <td
                          className={`px-4 py-1.5 md:px-6 md:py-4 text-primary dark:text-secondary text-center ${
                            currentProperty === "score"
                              ? "md:dark:text-white md:dark:bg-slate-900 md:bg-gray-300"
                              : "max-md:hidden"
                          }`}>
                          {user.score}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LeaderBoard;
