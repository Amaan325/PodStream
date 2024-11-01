import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { SiGooglepodcasts } from "react-icons/si";
import { IoHomeOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { MdOutlineFavorite } from "react-icons/md";
import { IoIosLogIn } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdOutlineLightMode } from "react-icons/md";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();

  const handleLoginClick = () => {
    setModal(true);
    navigate("/signin");
  };

  return (
    <div
      className={`flex justify-between items-center bg-gray-900 text-white py-4 ${
        modal ? "bg-opacity-50" : ""
      }`}
    >
      <NavLink to="/" className="flex items-center gap-3">
        <SiGooglepodcasts size={24} className="text-fuchsia-400" />
        <h1 className="text-[27px] text-fuchsia-600 font-semibold pr-40">
          PODSTREAM
        </h1>
      </NavLink>
      <NavLink className="bg-gray-900 text-gray-300 px-4 py-2 border-2 rounded-xl hover:bg-fuchsia-600 transition hover:text-white border-fuchsia-600">
        <span className="flex items-center gap-1">
          <IoHomeOutline />
          <h1>Dashboard</h1>
        </span>
      </NavLink>
      <NavLink className="bg-gray-900 text-gray-300 px-4 py-2 border-2 rounded-xl hover:bg-fuchsia-600 transition hover:text-white border-fuchsia-600">
        <span className="flex items-center gap-1">
          <IoSearch />
          <h1>Search</h1>
        </span>
      </NavLink>
      <NavLink className="bg-gray-900 text-gray-300 px-4 py-2 border-2 rounded-xl hover:bg-fuchsia-600 transition hover:text-white border-fuchsia-600">
        <span className="flex items-center gap-1">
          <MdOutlineFavorite />
          <h1>Favorite</h1>
        </span>
      </NavLink>
      <NavLink to="/uploadpodcast" className="bg-gray-900 text-gray-300 px-4 py-2 border-2 rounded-xl hover:bg-fuchsia-600 hover:text-white transition border-fuchsia-600">
        <span className="flex items-center gap-1">
          <IoCloudUploadOutline className="text-gray-300" />
          <h1>Upload</h1>
        </span>
      </NavLink>
      <NavLink className="bg-gray-900 text-gray-300 px-4 py-2 border-2 rounded-xl hover:bg-fuchsia-600 hover:text-white transition border-fuchsia-600">
        <span className="flex items-center gap-1">
          <MdOutlineLightMode />
          <h1>Light Mode</h1>
        </span>
      </NavLink>
      {/* </span> */}

      <div className="flex items-center">
        {currentUser ? (
          <span className="text-lg text-gray-200 flex items-center gap-1">
            <img
              className="rounded-full w-[56px] object-cover"
              src={currentUser.profilePicture}
            ></img>
            Welcome, {currentUser.username || currentUser.email}!
          </span>
        ) : (
          <button
            onClick={handleLoginClick}
            className="bg-gray-900 text-gray-300 px-4 py-2 border-2 rounded-xl hover:bg-fuchsia-600 transition hover:text-white border-fuchsia-600"
          >
            <span className="flex items-center gap-1">
              <IoIosLogIn />
              <h1 className="">Login</h1>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
