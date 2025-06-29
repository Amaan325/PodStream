import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import PodcastCard from "../components/PodcastCard";

const UserProfile = () => {
  const baseURL = "http://localhost:3000/";
  const { currentUser } = useSelector((state) => state.user);

  const [userPodcasts, setUserPodcasts] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [error, setError] = useState(false);

  // Fetch user's own podcasts
  useEffect(() => {
    const fetchUserPodcasts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/podcasts/getAll");
        const allPodcasts = res.data;

        const filtered = allPodcasts.filter(
          (podcast) => podcast?.uploader?._id === currentUser?._id
        );
        setUserPodcasts(filtered);
      } catch (err) {
        console.error("Error fetching podcasts:", err);
        setError(true);
      }
    };

    if (currentUser?._id) {
      fetchUserPodcasts();
    }
  }, [currentUser]);

  // Fetch subscriber count
  useEffect(() => {
    const fetchSubscriberCount = async () => {
      if (!currentUser?._id) return;
      try {
        const res = await axios.get(
          `http://localhost:3000/user/subscribers-count/${currentUser._id}`
        );
        setSubscriberCount(res.data.count);
      } catch (err) {
        console.error("Error fetching subscriber count:", err);
      }
    };

    fetchSubscriberCount();
  }, [currentUser]);

  return (
    <>
      <Navbar />
      <div className="mt-32 min-h-screen bg-black px-6 py-8 text-white">
        <h2 className="text-3xl font-extrabold mb-8">User Profile</h2>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-2">Name</h3>
            <p className="text-lg text-gray-300">{currentUser?.username}</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-2">Subscribers</h3>
            <p className="text-lg text-gray-300">{subscriberCount}</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-2">Podcasts Uploaded</h3>
            <p className="text-lg text-gray-300">{userPodcasts.length}</p>
          </div>
        </div>

        {/* Uploaded Podcasts */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Your Podcasts</h3>

          {error ? (
            <p className="text-red-500">Failed to load your podcasts.</p>
          ) : userPodcasts.length === 0 ? (
            <p className="text-gray-400">You haven't uploaded any podcasts yet.</p>
          ) : (
            <div className="flex flex-wrap gap-6">
              {userPodcasts.map((podcast) => (
                <PodcastCard
                  key={podcast._id}
                  id={podcast._id}
                  image={podcast.thumbnail}
                  title={podcast.title}
                  username={podcast.uploader.username}
                  views={podcast.views}
                  videoUrl={podcast.videoUrl}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
