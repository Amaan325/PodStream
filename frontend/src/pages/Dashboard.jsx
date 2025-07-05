import React, { useState, useEffect } from "react";
import PodcastCard from "../components/PodcastCard";
import axios from "axios";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [expandedSections, setExpandedSections] = useState({
    all: true,
    business: true,
    entertainment: true,
    lifestyle: true,
    travel: true,
  });

  const [podcasts, setPodcasts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/podcasts/getAll");
        setPodcasts(response.data);
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

  const businessPodcasts = podcasts.filter(
    (podcast) => podcast.category?.toLowerCase() === "business"
  );

  const entertainmentPodcasts = podcasts.filter(
    (podcast) => podcast.category?.toLowerCase() === "entertainment"
  );

  const lifestylePodcasts = podcasts.filter(
    (podcast) => podcast.category?.toLowerCase() === "lifestyle"
  );

  const travelPodcasts = podcasts.filter(
    (podcast) => podcast.category?.toLowerCase() === "travel"
  );

  const renderSection = (title, podcastsArray, sectionKey) => (
    <div className="section mb-8 my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-extrabold text-white">{title}</h2>
        {podcastsArray.length > 0 && (
          <button
            onClick={() => toggleSection(sectionKey)}
            className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition flex items-center gap-1"
          >
            {expandedSections[sectionKey] ? (
              <>
                Show Less <FaArrowUp />
              </>
            ) : (
              <>
                Show All <FaArrowDown />
              </>
            )}
          </button>
        )}
      </div>
      {expandedSections[sectionKey] && (
        <div className="section-content grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {podcastsArray.map((podcast) => (
            <PodcastCard
              key={podcast._id}
              id={podcast._id}
              image={podcast.thumbnail}
              title={podcast.title}
              username={podcast.uploader?.username || "Unknown"}
              description={podcast.description}
              views={podcast.views}
              videoUrl={podcast.videoUrl}
              uploaderId={podcast.uploader?._id}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="dashboard mt-32 min-h-screen bg-black px-6">
        {/* All Podcasts Section */}
        <div className="section mb-8 my-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-extrabold text-white">All Podcasts</h2>
            {podcasts.length > 0 && (
              <button
                onClick={() => toggleSection("all")}
                className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition flex items-center gap-1"
              >
                {expandedSections.all ? (
                  <>
                    Show Less <FaArrowUp />
                  </>
                ) : (
                  <>
                    Show All <FaArrowDown />
                  </>
                )}
              </button>
            )}
          </div>
          {expandedSections.all && (
            error ? (
              <p className="text-red-500 text-center">Failed to load podcasts</p>
            ) : (
              <div className="section-content grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-12">
                {podcasts.map((podcast) => (
                  <PodcastCard
                    key={podcast._id}
                    id={podcast._id}
                    image={podcast.thumbnail}
                    title={podcast.title}
                    username={podcast.uploader?.username || "Unknown"}
                    description={podcast.description}
                    views={podcast.views}
                    uploaderId={podcast.uploader?._id}
                    videoUrl={podcast.videoUrl}
                  />
                ))}
              </div>
            )
          )}
        </div>

        {/* Category Sections */}
        {renderSection("Business Podcasts", businessPodcasts, "business")}
        {renderSection("Entertainment Podcasts", entertainmentPodcasts, "entertainment")}
        {renderSection("Lifestyle Podcasts", lifestylePodcasts, "lifestyle")}
        {renderSection("Travel Podcasts", travelPodcasts, "travel")}
      </div>
    </>
  );
};

export default Dashboard;
