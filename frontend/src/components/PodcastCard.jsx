import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PodcastCard = ({
  image,
  title,
  username,
  views,
  description,
  videoUrl,
}) => {
  const baseURL = "http://localhost:3000/";
  const navigate = useNavigate();
  const play = () => {
    navigate("/player", { state: { videoUrl } });
  };

  useEffect(() => {
    console.log(image, description); // Log to confirm `description` is received
  }, [image, description]);

  return (
    <div className="relative bg-gray-900 text-white rounded-lg shadow-md overflow-hidden mb-4 w-60 h-[270px] transform transition-transform duration-200 hover:scale-105 hover:bg-gray-900">
      {/* Podcast Image */}
      <img
        src={`${baseURL}${image}`}
        alt={title}
        className="w-full h-40 object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 transition-opacity duration-200 hover:opacity-40"></div>

      {/* Play Button */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button
          onClick={play}
          className="bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14.752 11.168l-5.586 3.162A1 1 0 018 13.517V8.485a1 1 0 011.166-.986l5.586 1.998a1 1 0 01.586.913v2.758a1 1 0 01-.586.913z"
            />
          </svg>
        </button>
      </div>

      {/* Podcast Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold mb-1 text-white">{title}</h3>
        <p className="text-xs text-gray-300 mb-2 line-clamp-2">{description}</p>

        {/* Bottom Info */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center">
            <img
              src="/path-to-profile-icon.png"
              alt="User"
              className="w-5 h-5 rounded-full mr-1"
            />
            <span>{username}</span>
          </div>
          <span>{views} Views</span>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;
