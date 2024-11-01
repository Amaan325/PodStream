import React, { useState, useEffect } from "react";
import PodcastCard from "../components/PodcastCard";
import axios from "axios";

const Dashboard = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [podcasts, setPodcasts] = useState([]); // State for actual podcasts
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/podcasts/getAll");
        setPodcasts(response.data); // Assuming response.data is an array of podcast objects
        console.log(response.data); // Log to inspect the fetched data structure
      } catch (err) {
        console.error("Failed to fetch podcasts:", err);
        setError(true);
      }
    };

    fetchPodcasts();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="dashboard pt-12 min-h-screen overflow-hidden bg-gray-900">
      <div className="section mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-200">All Podcasts</h2>
          <button
            onClick={() => toggleSection("All Podcasts")}
            className="bg-gray-900 text-gray-300 px-4 py-2 border-2 rounded-xl hover:bg-fuchsia-600 hover:text-white transition border-fuchsia-600"
          >
            {expandedSections["All Podcasts"] ? "Show Less" : "Show All"}
          </button>
        </div>
        {error ? (
          <p className="text-red-500 text-center">Failed to load podcasts</p>
        ) : (
          <div className="section-content grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {podcasts
              .slice(0, expandedSections["All Podcasts"] ? podcasts.length : 4)
              .map((podcast) => (
                <PodcastCard
                  key={podcast._id} // Ensure unique key
                  image={podcast.thumbnail} // Assuming this is the correct property for the image
                  title={podcast.title}
                  username={podcast.uploader.username} // Adjusted based on nested structure
                  description={podcast.description} // Updated to show actual podcast description
                  views={podcast.views} // Displaying the view count
                  videoUrl = {podcast.videoUrl}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
