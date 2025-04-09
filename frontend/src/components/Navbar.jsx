import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { SiGooglepodcasts } from "react-icons/si";
import { IoIosLogIn } from "react-icons/io";
import UserMenu from "./UserMenu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdFavoriteBorder } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { AiFillYoutube } from "react-icons/ai"; // Imported YouTube icon

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [modal, setModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setModal(true);
    navigate("/signin");
  };

  const handleSignupClick = () => {
    setModal(true);
    navigate("/signup");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav
      className={`px-[65px] py-4 fixed top-0 left-0 w-full z-10 ${
        modal ? "bg-opacity-50" : ""
      } bg-black bg-opacity-80 backdrop-blur-md transition-all`}
    >
      <div className="flex justify-between items-center py-3">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <SiGooglepodcasts size={30} className="text-red-600" />
          <h1 className="text-3xl font-bold text-red-600">PODSTREAM</h1>
        </NavLink>

        {/* Center Navigation */}
        <div className="flex flex-grow justify-center space-x-8">
          <NavLink
            to="/"
            className="text-white hover:text-red-600 transition-all text-lg flex items-center gap-1"
          >
            Dashboard
            <MdOutlineDashboard size={24} />
          </NavLink>
          <NavLink
            to="/search"
            className="text-white hover:text-red-600 transition-all text-lg flex items-center gap-1"
          >
            Search
            <IoIosSearch size={24} />
          </NavLink>
          <NavLink
            to="/search-youtube"
            className="text-white hover:text-red-600 transition-all text-lg flex items-center gap-1"
          >
            YouTube
            <AiFillYoutube size={24} />
          </NavLink>
          <NavLink
            to="/favorite"
            className="text-white hover:text-red-600 transition-all text-lg flex items-center gap-1"
          >
            Favorite
            <MdFavoriteBorder size={24} />
          </NavLink>
          <NavLink
            to="/uploadpodcast"
            className="text-white hover:text-red-600 transition-all text-lg flex items-center gap-1"
          >
            Upload
            <IoCloudUploadOutline size={24} />
          </NavLink>
          <NavLink
            to="/theme"
            className="text-white hover:text-red-600 transition-all text-lg flex items-center gap-1"
          >
            Notifications
            <IoMdNotificationsOutline size={24} />
          </NavLink>
        </div>

        {/* User Buttons */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <button
              onClick={toggleUserMenu}
              className="rounded-full h-12 w-12 bg-gray-800 hover:bg-gray-700 transition"
            >
              <img
                src={currentUser?.profilePicture}
                alt="User Avatar"
                className="h-full w-full object-cover rounded-full"
              />
            </button>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition flex items-center gap-2"
              >
                <IoIosLogIn />
                Login
              </button>
              <button
                onClick={handleSignupClick}
                className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition flex items-center gap-2"
              >
                <IoMdPersonAdd />
                Signup
              </button>
            </>
          )}
          {showUserMenu && <UserMenu />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
