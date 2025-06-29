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
        navigate("/"); // Navigate to homepage after sign out
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Navigate to profile page
  const goToProfile = () => {
    navigate("/user-profile");
  };

  const onClose = () => {
    console.log("Menu item clicked");
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="absolute right-0 mt-72 w-56 bg-gray-900 rounded-lg shadow-lg z-50">
      <ul className="text-white text-sm font-medium">
        <li className="px-6 py-2 text-lg font-semibold text-gray-200">
          {currentUser?.username || "Guest"}
        </li>

        <hr className="border-gray-700 my-1" />

        <li
          className="px-6 py-2 hover:bg-gray-800 cursor-pointer transition-all duration-200"
          onClick={goToProfile}
        >
          Profile
        </li>
        <li
          className="px-6 py-2 hover:bg-gray-800 cursor-pointer transition-all duration-200"
          onClick={onClose}
        >
          Switch Account
        </li>
        {/* <li
          className="px-6 py-2 hover:bg-gray-800 cursor-pointer transition-all duration-200"
          onClick={onClose}
        >
          Your Channel
        </li> */}
        {/* <li
          className="px-6 py-2 hover:bg-gray-800 cursor-pointer transition-all duration-200"
          onClick={onClose}
        >
          Settings
        </li> */}
        <li
          className="px-6 py-2 hover:bg-red-600 cursor-pointer transition-all duration-200"
          onClick={handleSignOut}
        >
          Sign Out
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
