import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";

const YouTubeSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  // Debounce timer reference
  const debounceTimeout = useRef(null);

  // When user types, delay API call by 300ms
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Clear previous timer
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [query]);

  const fetchResults = async (searchTerm) => {
    setLoading(true);
    try {
      // Call backend with user query, backend prepends 'podcast'
      const res = await axios.get(`http://localhost:3000/api/youtube/search?q=${encodeURIComponent(searchTerm)}`);
      setResults(res.data.items || []);
    } catch (error) {
      console.error("Error fetching YouTube results", error);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailClick = (video) => {
    setActiveVideo(video);
    setShowPlayer(true);
  };

  const handleBackButtonClick = () => {
    setShowPlayer(false);
    setActiveVideo(null);
  };

  return (
    <div className="pt-8 px-10 min-h-screen bg-black text-white">
      {/* Search Bar */}
      <form onSubmit={e => e.preventDefault()} className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search Podcasts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-2xl px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none text-white"
          autoComplete="off"
        />
      </form>

      {/* Results Grid */}
      {loading ? (
        <p className="text-center text-gray-400">Searching YouTube...</p>
      ) : showPlayer ? (
        <div className="text-center text-gray-400">Video Player is now active</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.length === 0 && query.trim() !== "" && (
            <p className="text-center text-gray-400 col-span-full">No podcasts found.</p>
          )}
          {results.map((video) => (
            <div
              key={video.id.videoId}
              className="bg-gray-900 p-3 rounded-xl shadow hover:scale-105 transition cursor-pointer"
              onClick={() => handleThumbnailClick(video)}
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
          <button
            onClick={handleBackButtonClick}
            className="absolute top-4 left-4 text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition flex items-center gap-2"
          >
            <FaArrowLeftLong size={24} /> Back
          </button>

          <div className="relative mt-32 ml-16 pt-[40%] w-full max-w-4xl mb-4">
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

          <div className="text-center">
            <h2 className="text-xl font-semibold mt-4 text-white">{activeVideo.snippet.title}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeSearch;
