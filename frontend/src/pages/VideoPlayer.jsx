import React, { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { FaDownload } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import PodcastMenu from "../components/PodcastMenu";

export const VideoPlayer = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const {
    options,
    onReady,
    videoId,
    image,
    title,
    username,
    description,
    views,
  } = props;

  // State for controlling the visibility of the dropdown menu and the report modal
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    // Initialize video.js player only once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const playerOptions = {
        ...options,
        playbackRates: [0.5, 1, 1.5, 2], // Speed control options
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
      player.options({ playbackRates: options.playbackRates });
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [options.id]); // Add `options.id` as a dependency to re-run when it changes

  return (
    <div className="bg-black h-screen">
      <div data-vjs-player style={{ width: "900px" }}>
        <div ref={videoRef} />
      </div>

      {/* Video Player Controls - Buttons below */}
      <div className="flex justify-between items-center mt-4">
        {/* Subscribe Button on the Left */}
        <button className="flex items-center bg-red-700 text-[16px] text-white uppercase px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-80 w-[150px] transition-all duration-200 ease-in-out">
          <MdSubscriptions className="text-2xl mr-2" /> Subscribe
        </button>

        {/* Like, Dislike, and Download Buttons on the Right with Borders */}
        <div className="flex space-x-4">
          <button className="flex items-center text-white hover:text-blue-600 border border-gray-400 px-4 py-2 rounded-3xl">
            <AiOutlineLike className="text-2xl mr-2" /> Like
          </button>
          {/* <button className="flex items-center text-white hover:text-red-600 border border-gray-400 px-4 py-2 rounded-3xl">
            <AiOutlineDislike className="text-2xl mr-2" /> Dislike */}
          {/* </button> */}
          <button className="flex items-center text-white hover:text-green-600 border border-gray-400 px-4 py-2 rounded-3xl">
            <FaDownload className="text-2xl mr-2" /> Download
          </button>

          {/* Pass videoId to PodcastMenu */}
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
    </div>
  );
};

export default VideoPlayer;
