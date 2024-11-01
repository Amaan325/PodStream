import VideoPlayer from "./VideoPlayer";
import { useEffect, useRef } from "react";
import videojs from 'video.js';
import { useLocation } from "react-router-dom";

const Player = () => {
  const location = useLocation();
  const { videoUrl } = location.state || {};
  const cleanedVideoUrl = videoUrl ? videoUrl.replace(/^\.+/, "").trim() : "";
  const actualUrl = `http://localhost:3000${cleanedVideoUrl}`; // Use template literal correctly
  const playerRef = useRef(null);

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: actualUrl,
        type: "application/x-mpegURL",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  useEffect(() => {
    console.log(actualUrl);
  }, [actualUrl]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="">
        <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} />
      </div>
    </div>
  );
};

export default Player;
