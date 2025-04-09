import React, { useState, useEffect } from "react";
import PodcastCard from "../components/PodcastCard";
import axios from "axios";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [podcasts, setPodcasts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/podcasts/getAll"
        );
        console.log(response.data);
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

  // Filter podcasts by category
  const businessPodcasts = podcasts.filter(
    (podcast) => podcast.category === "Business"
  );
  const entertainmentPodcasts = podcasts.filter(
    (podcast) => podcast.category === "Entertainment"
  );

  return (
    <>
      <Navbar />
      <div className="dashboard mt-32 min-h-screen bg-black">
        {/* All Podcasts Section */}
        <div className="section mb-8 px-6 my-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-extrabold text-white">All Podcasts</h2>
            <button
              onClick={() => toggleSection("All Podcasts")}
              className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition flex items-center gap-1"
            >
              {expandedSections["All Podcasts"] ? (
                <>
                  Show Less <FaArrowUp />
                </>
              ) : (
                <>
                  Show All <FaArrowDown />
                </>
              )}
            </button>
          </div>
          {error ? (
            <p className="text-red-500 text-center">Failed to load podcasts</p>
          ) : (
            <div className="section-content grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-12">
              {podcasts
                .slice(
                  0,
                  expandedSections["All Podcasts"] ? podcasts.length : 10
                )
                .map((podcast) => (
                  <PodcastCard
                    key={podcast._id}
                    id={podcast._id}
                    image={podcast.thumbnail}
                    title={podcast.title}
                    username={podcast.uploader.username}
                    description={podcast.description}
                    views={podcast.views}
                    videoUrl={podcast.videoUrl}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Business Podcasts Section */}
        <div className="section mb-8 px-6 my-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-extrabold text-white">
              Business Podcasts
            </h2>
            <button
              onClick={() => toggleSection("Business Podcasts")}
              className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition flex items-center gap-1"
            >
              {expandedSections["Business Podcasts"] ? (
                <>
                  Show Less <FaArrowUp />
                </>
              ) : (
                <>
                  Show All <FaArrowDown />
                </>
              )}
            </button>
          </div>
          <div className="section-content grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {businessPodcasts.length === 0 ? (
              <p className="text-gray-400 text-center">
                No business podcasts available
              </p>
            ) : (
              businessPodcasts
                .slice(
                  0,
                  expandedSections["Business Podcasts"]
                    ? businessPodcasts.length
                    : 10
                )
                .map((podcast) => (
                  <PodcastCard
                    key={podcast._id}
                    image={podcast.thumbnail}
                    title={podcast.title}
                    username={podcast.uploader.username}
                    description={podcast.description}
                    views={podcast.views}
                    videoUrl={podcast.videoUrl}
                  />
                ))
            )}
          </div>
        </div>

        {/* Entertainment Podcasts Section */}
        <div className="section mb-8 px-6 my-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-extrabold text-white">
              Entertainment Podcasts
            </h2>
            <button
              onClick={() => toggleSection("Entertainment Podcasts")}
              className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition flex items-center gap-1"
            >
              {expandedSections["Entertainment Podcasts"] ? (
                <>
                  Show Less <FaArrowUp />
                </>
              ) : (
                <>
                  Show All <FaArrowDown />
                </>
              )}
            </button>
          </div>
          <div className="section-content grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {entertainmentPodcasts.length === 0 ? (
              <p className="text-gray-400 text-center">
                No entertainment podcasts available
              </p>
            ) : (
              entertainmentPodcasts
                .slice(
                  0,
                  expandedSections["Entertainment Podcasts"]
                    ? entertainmentPodcasts.length
                    : 10
                )
                .map((podcast) => (
                  <PodcastCard
                    key={podcast._id}
                    image={podcast.thumbnail}
                    title={podcast.title}
                    username={podcast.uploader.username}
                    description={podcast.description}
                    views={podcast.views}
                    videoUrl={podcast.videoUrl}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
