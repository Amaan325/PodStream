import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

const YouTubeSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null); // Store the active video to show
  const [showPlayer, setShowPlayer] = useState(false); // Flag to toggle video player
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      console.log("Searching for:", query);
      const res = await axios.get(`http://localhost:3000/api/youtube/search?q=${query}`);
      console.log("Search Results:", res.data);
      setResults(res.data.items); // Expecting 'items' from backend
    } catch (error) {
      console.error("Error fetching YouTube results", error);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailClick = (video) => {
    console.log("Thumbnail clicked:", video);
    setActiveVideo(video);
    setShowPlayer(true); // Show the player when a thumbnail is clicked
  };

  const handleBackButtonClick = () => {
    setShowPlayer(false); // Hide the player and go back to search results
    setActiveVideo(null);
  };

  return (
    <div className="pt-8 px-10 min-h-screen bg-black text-white">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search YouTube..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-2xl px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none text-white"
        />
        <button
          type="submit"
          className="bg-red-600 px-6 py-2 rounded-r-lg hover:bg-red-700 transition"
        >
          Search
        </button>
      </form>

      {/* Results Grid */}
      {loading ? (
        <p className="text-center text-gray-400">Searching YouTube...</p>
      ) : showPlayer ? (
        // When the player is showing, hide the search results
        <div className="text-center text-gray-400">Video Player is now active</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((video) => (
            <div
              key={video.id.videoId}
              className="bg-gray-900 p-3 rounded-xl shadow hover:scale-105 transition"
            >
              <div
                onClick={() => handleThumbnailClick(video)} // Pass full video object
                className="cursor-pointer"
              >
                <img
                  src={video.snippet.thumbnails.high.url}
                  alt={video.snippet.title}
                  className="w-full rounded-lg mb-2"
                />
                <h2 className="text-lg font-semibold line-clamp-2">
                  {video.snippet.title}
                </h2>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {video.snippet.channelTitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Player */}
      {showPlayer && activeVideo && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "90%",
            height: "80%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          {/* Back Button */}
          <button
            onClick={handleBackButtonClick}
            className="absolute top-4 left-4 text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition flex items-center gap-2"
          >        <FaArrowLeftLong size={24} />
          
            Back
          </button>

          {/* Video Player */}
          <div className="relative mt-32 ml-16 pt-[40%] w-full max-w-4xl mb-4"> {/* Adjusted aspect ratio and added margin bottom */}
            <iframe
              title={activeVideo.snippet.title}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${activeVideo.id.videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0"
            ></iframe>
          </div>

          {/* Title and Description */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mt-4 text-white">{activeVideo.snippet.title}</h2>
            {/* <p className="text-sm text-gray-400 mt-2 text-white">{activeVideo.snippet.description}</p> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeSearch;
