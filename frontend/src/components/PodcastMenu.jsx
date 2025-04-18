import React, { useState, useEffect, useRef } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { useSelector } from "react-redux";
import axios from "axios";

const PodcastMenu = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  const checkPodcastInFavs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/user/favorites/exists/${videoId}`,
        { withCredentials: true }
      );
      setIsFavorite(res.data.exists);
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  };

  const handleAddToFavorites = async () => {
    if (!currentUser) return;
    try {
      const url = isFavorite
        ? `http://localhost:3000/user/favorites/remove/${videoId}`
        : `http://localhost:3000/user/favorites/add/${currentUser._id}`;

      await axios({
        method: isFavorite ? "put" : "post",
        url,
        data: isFavorite ? {} : { podcastId: videoId },
        withCredentials: true,
      });

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };

  const handleReportSubmit = async () => {
    const reason = {
      copyright: document.querySelector('input[name="copyright"]').checked,
      misinformation: document.querySelector('input[name="misinformation"]').checked,
      harmfulContent: document.querySelector('input[name="harmfulContent"]').checked,
    };

    try {
      await axios.post(
        `http://localhost:3000/api/reports/report/${videoId}`,
        { reason },
        { withCredentials: true }
      );
      alert("Report submitted successfully");
      closeReportModal();
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report");
    }
  };

  useEffect(() => {
    if (videoId && currentUser) checkPodcastInFavs();
  }, [videoId, currentUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
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
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-300 rounded-lg shadow-lg z-50">
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
                <input type="checkbox" className="mr-2" name="copyright" /> Copyright
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" name="misinformation" /> Misinformation
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" name="harmfulContent" /> Harmful Content
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
