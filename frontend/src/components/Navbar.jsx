import React, { useState, useEffect } from "react";
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
import { AiFillYoutube } from "react-icons/ai";
import { io } from "socket.io-client";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [modal, setModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const socket = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.emit("join", currentUser._id);
    socket.on("newPodcastFromSubscribed", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.disconnect();
  }, [currentUser]);

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

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative text-white hover:text-red-600 text-lg flex items-center gap-1"
            >
              <IoMdNotificationsOutline size={24} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
                  {notifications.length}
                </span>
              )}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 text-white rounded shadow-lg max-h-96 overflow-y-auto z-50">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center">No notifications</div>
                ) : (
                  notifications.map((n, index) => (
                    <div
                      key={index}
                      className="p-3 border-b border-gray-700 text-sm hover:bg-gray-700 cursor-pointer"
                    >
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
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
