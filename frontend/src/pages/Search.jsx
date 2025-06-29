import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PodcastSearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/podcasts/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching podcasts", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-8 px-10 min-h-screen bg-black text-white">
      {/* Search Bar */}
      <form onSubmit={(e) => e.preventDefault()} className="mb-6 flex justify-center">
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
        <p className="text-center text-gray-400">Searching Podcasts...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.length === 0 && query.trim() !== "" && (
            <p className="text-center text-gray-400 col-span-full">No podcasts found for "{query}"</p>
          )}

          {results.map((podcast) => (
            <Link
              to={`/podcast/${podcast._id}`}
              key={podcast._id}
              className="bg-gray-900 p-3 rounded-xl shadow hover:scale-105 transition cursor-pointer"
            >
              <img
                src={`http://localhost:3000/${podcast.thumbnail}`}
                alt={podcast.title}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <h2 className="text-lg font-semibold line-clamp-2">{podcast.title}</h2>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                by {podcast.user?.username || "Unknown"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PodcastSearchPage;
