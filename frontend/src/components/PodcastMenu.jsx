import React, { useState, useEffect, useRef } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { useSelector } from "react-redux";
import axios from "axios";

const PodcastMenu = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user); // Access current user from Redux
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const checkPodcastInFavs = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/user/favorites/exists/${videoId}`,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      setIsFavorite(response.data.exists); // Simplified state setting
    } catch (error) {
      console.error("Error checking podcast in favorites:", error);
    }
  };

  const handleAddToFavorites = async () => {
    if (!currentUser || !currentUser._id) return; // Early return if no current user

    try {
      const url = isFavorite
        ? `http://localhost:3000/user/favorites/remove/${videoId}`
        : `http://localhost:3000/user/favorites/add/${currentUser._id}`;

      await axios({
        method: isFavorite ? "put" : "post",
        url,
        data: isFavorite ? undefined : { podcastId: videoId }, // Add data only if needed
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setIsFavorite(!isFavorite); // Toggle favorite state
    } catch (error) {
      console.error("Error handling favorite action:", error);
    }
  };

  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  const handleReportSubmit = () => {
    console.log("Report submitted");
    closeReportModal();
  };

  useEffect(() => {
    if (videoId && currentUser) {
      checkPodcastInFavs();
    }
  }, [videoId, currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center text-white hover:text-white border border-gray-400 px-4 py-2 rounded-3xl"
        onClick={toggleDropdown}
      >
        <HiDotsHorizontal className="text-2xl" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-300 rounded-lg shadow-lg">
          <ul>
            <li
              className="px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
              onClick={handleAddToFavorites}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </li>
            <li
              className="px-4 py-2 text-white hover:bg-red-600 cursor-pointer"
              onClick={openReportModal}
            >
              Report
            </li>
          </ul>
        </div>
      )}

      {isReportModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-96">
            <h3 className="text-xl mb-4">Report Podcast</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Copyright
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Misinformation
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Harmful Content
              </label>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <button
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500"
                onClick={closeReportModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500"
                onClick={handleReportSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastMenu;
