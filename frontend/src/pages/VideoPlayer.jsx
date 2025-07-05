import React, { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useSelector } from "react-redux";
import { AiOutlineLike } from "react-icons/ai";
import { FaDownload } from "react-icons/fa";
import { MdSubscriptions, MdUnsubscribe } from "react-icons/md";
import PodcastMenu from "../components/PodcastMenu";
import axios from "axios";

export const VideoPlayer = (props) => {
  const { currentUser } = useSelector((state) => state.user);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const {
    userAdmin,
    url,
    options,
    onReady,
    videoId,
    image,
    title,
    username,
    description,
    views,
    uploaderId,
  } = props;

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!currentUser || !videoId || !uploaderId) return;
      try {
        const [subRes, countRes, likeStatusRes] = await Promise.all([
          axios.get(
            `http://localhost:3000/user/check-subscription/${uploaderId}`,
            { withCredentials: true }
          ),
          axios.get(
            `http://localhost:3000/user/subscribers-count/${uploaderId}`
          ),
          axios.get(`http://localhost:3000/podcasts/like-status/${videoId}`, {
            withCredentials: true,
          }),
        ]);

        setIsSubscribed(subRes.data.isSubscribed);
        setSubscribersCount(countRes.data.count);
        setHasLiked(likeStatusRes.data.hasLiked);
        setLikesCount(likeStatusRes.data.likesCount);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchInitialData();
  }, [currentUser?._id, videoId, uploaderId]);

  const handleSubscribe = async () => {
    if (!currentUser || !uploaderId) return;

    if (currentUser._id === uploaderId) {
      alert("You can't subscribe to yourself.");
      return;
    }

    setLoadingSub(true);
    try {
      const endpoint = isSubscribed
        ? `http://localhost:3000/user/unsubscribe/${uploaderId}`
        : `http://localhost:3000/user/subscribe/${uploaderId}`;

      await axios.put(endpoint, {}, { withCredentials: true });

      setIsSubscribed(!isSubscribed);
      setSubscribersCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Subscription error:", err);
    } finally {
      setLoadingSub(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;

    try {
      const res = await axios.put(
        `http://localhost:3000/podcasts/like-count/${videoId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setHasLiked(res.data.liked);
        setLikesCount(res.data.likes);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const playerOptions = {
        ...options,
        playbackRates: [0.5, 1, 1.5, 2],
      };

      const player = (playerRef.current = videojs(
        videoElement,
        playerOptions,
        () => {
          videojs.log("player is ready");
          onReady && onReady(player);
        }
      ));
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  const lessonId = url?.split("courses/")[1]?.split("/")[0];

  return (
    <div className="bg-black h-screen">
      <div data-vjs-player style={{ width: "900px" }}>
        <div ref={videoRef} />
      </div>

      <div className="p-4 text-white">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 text-gray-400">
            <span>{views} views</span>
            <span className="mx-2">•</span>
            <span>{subscribersCount} subscribers</span>
            <span className="mx-2">•</span>
            <span>{likesCount} likes</span>
          </div>
        </div>
      </div>

      {/* Buttons and Menu (Only show if NOT admin) */}
      {userAdmin !== "admin" && (
        <div className="flex justify-between items-center mt-4 px-4">
          {/* Subscribe Button */}
          <button
            onClick={handleSubscribe}
            disabled={loadingSub || !currentUser}
            className={`flex items-center ${
              isSubscribed ? "bg-gray-600" : "bg-red-700"
            } text-[16px] text-white uppercase px-4 py-2 rounded-lg hover:bg-red-600 w-[180px] transition-all duration-200 ease-in-out`}
          >
            {isSubscribed ? (
              <>
                <MdUnsubscribe className="text-2xl mr-2" /> Unsubscribe
              </>
            ) : (
              <>
                <MdSubscriptions className="text-2xl mr-2" /> Subscribe
              </>
            )}
          </button>

          {/* Like / Download / Menu */}
          <div className="flex space-x-4">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={!currentUser}
              className={`flex items-center text-white border px-4 py-2 rounded-3xl ${
                hasLiked
                  ? "border-blue-500 text-blue-500"
                  : "border-gray-400 hover:text-blue-600"
              }`}
            >
              <AiOutlineLike className="text-2xl mr-2" />
              {hasLiked ? "Liked" : "Like"}
            </button>

            {/* Download Link */}
            <a
              href={`http://localhost:3000/api/download/${lessonId}`}
              className="flex items-center text-white hover:text-green-600 border border-gray-400 px-4 py-2 rounded-3xl"
            >
              <FaDownload className="text-2xl mr-2" /> Download
            </a>

            {/* 3-dot menu */}
            <PodcastMenu
              videoId={videoId}
              image={image}
              title={title}
              description={description}
              views={views}
              username={username}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
