import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PodcastCard from "../components/PodcastCard";
import axios from "axios";
import Navbar from "../components/Navbar";

const Favorite = () => {
  const { currentUser } = useSelector((state) => state.user); // Get the current user from Redux store
  const [favoritePodcasts, setFavoritePodcasts] = useState([]); // State to store favorite podcasts
  const [error, setError] = useState(false);
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser && currentUser._id) {
        try {
          // Fetch favorite podcasts from the backend
          const favoriteResponse = await axios.get(
            `http://localhost:3000/user/favorites/get/${currentUser._id}`,
            { withCredentials: true } // Ensure cookies/session are sent
          );
          console.log("Favorite Podcasts:", favoriteResponse.data);
          // Store favorite podcasts in the state
          setFavoritePodcasts(favoriteResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(true);
        }
      } else {
        navigate("/Signin"); // Redirect to login if no user is logged in
      }
    };
    fetchData(); // Fetch favorite podcasts
  }, [currentUser, navigate]);

  return (
    <>
      <Navbar />
      <div className="bg-black text-white mt-[100px]">
        {/* Section for displaying Favorite Podcasts */}
        <div className="px-6 py-10">
          <h2 className="text-3xl font-bold mb-6">Favorite Podcasts</h2>

          {/* Display podcasts if available */}
          {favoritePodcasts && favoritePodcasts.length > 0 ? (
            <div className="flex flex-wrap gap-6">
              {favoritePodcasts.map((podcast) => (
                <div
                  key={podcast._id}
                  className="bg-black rounded-lg overflow-hidden shadow-lg relative"
                >
                  <PodcastCard
                    key={podcast._id}
                    id={podcast._id}
                    image={podcast.thumbnail}
                    title={podcast.title}
                    username={podcast.uploader?.username}
                    views={podcast.views}
                    description={podcast.description}
                    videoUrl={podcast.videoUrl}
                    uploaderId={podcast.uploader}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xl">You haven't favorited any podcasts yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Favorite;
