import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const PodcastCard = ({ id, image, title, username, views, videoUrl, uploaderId }) => {
  const baseURL = "http://localhost:3000/";
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const play = async () => {
    try {
      // 🔒 Increase view count if viewer is not the uploader
      if (currentUser && currentUser._id !== uploaderId) {
        await axios.put(`http://localhost:3000/podcasts/view/${id}`, null, {
          withCredentials: true,
        });
      }

      // 📺 Navigate to player
      navigate("/player", {
        state: { videoUrl, id, image, title, username, views, uploaderId },
      });
    } catch (error) {
      console.error("Error in play function:", error);
    }
  };

  return (
    <div className="relative bg-gray-900 text-white rounded-lg shadow-md overflow-hidden mb-4 w-60 h-[260px] transform transition-transform duration-200 hover:scale-105">
      <img src={`${baseURL}${image}`} alt={title} className="w-full h-40 object-cover" />

      <div className="absolute inset-0 bg-black opacity-50 transition-opacity duration-200 hover:opacity-40"></div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button
          onClick={play}
          className="bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14.752 11.168l-5.586 3.162A1 1 0 018 13.517V8.485a1 1 0 011.166-.986l5.586 1.998a1 1 0 01.586.913v2.758a1 1 0 01-.586.913z"
            />
          </svg>
        </button>
      </div>

      <div className="p-3 h-[80px] flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <div className="flex items-center justify-between text-xs text-white -mb-5">
          <span>{username}</span>
          <span>{views} Views</span>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;
