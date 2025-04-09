import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/user/signout`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        dispatch(deleteUser());
        console.log("Sign Out successful");
        navigate("/"); // Navigate to dashboard after sign out
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // On Menu Item Click (can be used for closing the menu or navigation)
  const onClose = () => {
    console.log("Menu item clicked");
  };

  // Ensure currentUser is defined before rendering
  if (!currentUser) {
    return null; // Or show some loading/error UI if user is not logged in
  }

  return (
    <div className="absolute right-0 mt-3 w-56 bg-gray-900 rounded-lg shadow-lg">
      <ul className="text-white text-sm font-medium">
        {/* Display username only if currentUser is available */}
        <li className="px-6 py-2 text-lg font-semibold text-gray-200">
          {currentUser?.username || "Guest"} {/* Default to "Guest" if username is unavailable */}
        </li>

        {/* Horizontal line */}
        <hr className="border-gray-700 my-1" />

        {/* Menu Options */}
        <li
          className="px-6 py-2 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
          onClick={onClose}
        >
          Switch Account
        </li>
        <li
          className="px-6 py-2 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
          onClick={onClose}
        >
          Your Channel
        </li>
        <li
          className="px-6 py-2 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
          onClick={onClose}
        >
          Settings
        </li>
        <li
          className="px-6 py-2 hover:bg-red-600 cursor-pointer transition-all duration-200 ease-in-out"
          onClick={handleSignOut}
        >
          Sign Out
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
