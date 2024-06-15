import React, {useEffect, useState} from "react";
import {FaSearch} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

function Header() {
  const {currentUser} = useSelector((state) => state.user);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchText", searchText);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTextFromUrl = urlParams.get("searchText");
    if (searchTextFromUrl) {
      setSearchText(searchTextFromUrl);
    }
  }, [window.location.search]);

  return (
    <header className=" bg-slate-200 shadow-md">
      <div className=" flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className=" font-bold text-sm sm:text-xl flex flex-wrap">
            <span className=" text-slate-700">Dream</span>
            <span className=" text-pink-600">Home</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className=" bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Search..."
            className=" bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchText}
          />
          <button>
            <FaSearch className=" text-slate-600" />
          </button>
        </form>
        <ul className=" flex gap-4">
          <Link
            to="/"
            className=" hidden sm:inline text-slate-700 hover:text-red-600 hover:underline"
          >
            Home
          </Link>
          <Link
            to="/about"
            className=" hidden sm:inline text-slate-700 hover:text-red-600 hover:underline"
          >
            About
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className=" rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile "
              />
            ) : (
              <li className="  text-slate-700 hover:text-red-600 hover:underline">
                {" "}
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
